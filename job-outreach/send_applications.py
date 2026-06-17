#!/usr/bin/env python3
"""
======================================================================
 Job-Application Outreach Sender  -  Balaji Dilipsingh Rajput
 ---------------------------------------------------------------------
 Sends a PERSONALIZED job-application email (resume PDF attached) to
 each company/HR address in recipients.csv, using your OWN Gmail over
 SMTP. Also handles polite FOLLOW-UPS and prints a status REPORT.

 Targeted, rate-limited, personalized outreach - NOT a spam blaster.
   * personalizes greeting + company per recipient
   * de-duplicates; never re-sends an initial mail
   * follow-ups only to people who haven't replied/bounced
   * daily cap + human-like delay
   * NEVER contacts an excluded employer (e.g. a former company)
   * DRY-RUN by default (prints what it WOULD send, sends nothing)

 ---------------------------------------------------------------------
 QUICK START
   1. Put credentials in a .env file (see .env.example) OR export them:
          export GMAIL_ADDRESS="balajirajput966@gmail.com"
          export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   2. Preview (sends nothing):      python3 send_applications.py
   3. Status report:                python3 send_applications.py --report
   4. Test mail to yourself:        python3 send_applications.py --test you@x.com --send
   5. Send initial batch:           python3 send_applications.py --send
   6. Send follow-ups (5+ days):    python3 send_applications.py --followup --send
 ======================================================================
"""

import argparse
import csv
import os
import random
import re
import smtplib
import ssl
import sys
import time
from datetime import date, datetime
from email.message import EmailMessage
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_RECIPIENTS = HERE / "recipients.csv"
DEFAULT_TEMPLATE = HERE / "email_template.txt"
FOLLOWUP_TEMPLATE = HERE / "followup_template.txt"
DEFAULT_RESUME = HERE.parent / "resume" / "Balaji_Rajput_QA_Officer_Resume.pdf"
SENT_LOG = HERE / "sent_log.csv"
ENV_FILE = HERE / ".env"

# ---- SAFETY: never contact these (former/current employer, etc.) -----
EXCLUDE_KEYWORDS = ["elysium"]          # company already worked at
EXCLUDE_DOMAINS = set()                 # e.g. {"example.com"}
EXCLUDE_EMAILS = set()                  # e.g. {"someone@x.com"}

SUBJECT = ("Job Application - QC / Microbiology / Production / Lab Technician "
           "| Balaji Dilipsingh Rajput (Diploma Biotechnology)")
FOLLOWUP_SUBJECT = ("Following up - Job Application | Balaji Dilipsingh Rajput "
                    "(Diploma Biotechnology, QC / Microbiology)")
SENDER_NAME = "Balaji Dilipsingh Rajput"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ----------------------------------------------------------------- helpers
def log(msg):
    print(f"[{datetime.now():%H:%M:%S}] {msg}", flush=True)


def load_dotenv(path=ENV_FILE):
    """Minimal .env loader: KEY=VALUE lines. Won't overwrite real env vars."""
    if not Path(path).exists():
        return
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        key, val = key.strip(), val.strip().strip('"').strip("'")
        os.environ.setdefault(key, val)


def parse_recipients(lines):
    """Parse CSV lines/file -> list of {company, email}. De-dupes by email."""
    seen, rows = set(), []
    for r in csv.DictReader(lines):
        email = (r.get("email") or "").strip()
        company = (r.get("company") or "").strip()
        if not email:
            continue
        key = email.lower()
        if key in seen:
            continue
        seen.add(key)
        rows.append({"company": company, "email": email})
    return rows


def sheet_to_csv_url(url):
    """Convert a Google Sheets share/edit URL to a CSV-export URL.
    Leaves any other URL untouched."""
    m = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", url)
    if not m:
        return url
    sid = m.group(1)
    g = re.search(r"[#&?]gid=([0-9]+)", url)
    gid = g.group(1) if g else "0"
    return f"https://docs.google.com/spreadsheets/d/{sid}/export?format=csv&gid={gid}"


def load_recipients(path=None, url=None):
    """Load recipients from a Google Sheet (url) or a local CSV (path)."""
    if url:
        import urllib.request
        export = sheet_to_csv_url(url)
        log(f"Fetching recipients from URL: {export}")
        with urllib.request.urlopen(export, timeout=30) as resp:
            text = resp.read().decode("utf-8", "replace")
        return parse_recipients(text.splitlines())
    with open(path, newline="", encoding="utf-8") as f:
        return parse_recipients(f)


def is_valid(email):
    return bool(EMAIL_RE.match(email))


def is_excluded(email):
    e = email.lower()
    if e in {x.lower() for x in EXCLUDE_EMAILS}:
        return True
    if e.split("@")[-1] in {d.lower() for d in EXCLUDE_DOMAINS}:
        return True
    return any(kw.lower() in e for kw in EXCLUDE_KEYWORDS)


def load_state():
    """Aggregate sent_log.csv into per-email state.
    Returns {email_lower: {sent, replied, bounced, failed, followups,
                           first_sent, company}}."""
    state = {}
    if not SENT_LOG.exists():
        return state
    with open(SENT_LOG, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            e = (r.get("email") or "").lower()
            if not e:
                continue
            s = state.setdefault(e, {"sent": False, "replied": False,
                                     "bounced": False, "failed": False,
                                     "followups": 0, "first_sent": None,
                                     "company": ""})
            st, ts = r.get("status"), r.get("timestamp") or ""
            if st == "sent":
                s["sent"] = True
                if s["first_sent"] is None:
                    s["first_sent"] = ts
            elif st == "followup":
                s["followups"] += 1
            elif st == "replied":
                s["replied"] = True
            elif st == "bounced":
                s["bounced"] = True
            elif st == "failed":
                s["failed"] = True
            if r.get("company"):
                s["company"] = r["company"]
    return state


def outgoing_today():
    today, n = date.today().isoformat(), 0
    if SENT_LOG.exists():
        with open(SENT_LOG, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                if r.get("status") in ("sent", "followup") \
                        and (r.get("timestamp") or "").startswith(today):
                    n += 1
    return n


def days_since(iso_ts):
    try:
        d = datetime.fromisoformat(iso_ts).date()
        return (date.today() - d).days
    except Exception:
        return 9999


def record(email, company, status, note=""):
    new = not SENT_LOG.exists()
    with open(SENT_LOG, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["timestamp", "email", "company", "status", "note"])
        w.writerow([datetime.now().isoformat(timespec="seconds"),
                    email, company, status, note])


def render_body(template, company, resume_link=""):
    company_disp = company if company else "your organization"
    greeting = (f"Dear {company} HR Team," if company
                else "Dear Hiring Manager / HR Team,")
    body = template.replace("{greeting}", greeting).replace("{company}", company_disp)
    link_line = f"Resume (PDF): {resume_link}" if resume_link else ""
    return body.replace("{resume_link_line}", link_line)


def build_message(sender, to_email, company, template, resume_path,
                  subject, resume_link=""):
    body = render_body(template, company, resume_link)
    msg = EmailMessage()
    msg["From"] = f"{SENDER_NAME} <{sender}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg["Reply-To"] = sender
    msg.set_content(body)
    if resume_path and Path(resume_path).exists():
        msg.add_attachment(Path(resume_path).read_bytes(),
                           maintype="application", subtype="pdf",
                           filename=Path(resume_path).name)
    return msg


def connect(sender, password):
    ctx = ssl.create_default_context()
    server = smtplib.SMTP("smtp.gmail.com", 587, timeout=30)
    server.starttls(context=ctx)
    server.login(sender, password)
    return server


# ----------------------------------------------------------------- report
def cmd_report(recipients):
    state = load_state()
    total = len(recipients)
    sent = sum(1 for s in state.values() if s["sent"])
    replied = sum(1 for s in state.values() if s["replied"])
    bounced = sum(1 for s in state.values() if s["bounced"])
    failed = sum(1 for s in state.values() if s["failed"] and not s["sent"])
    followed = sum(1 for s in state.values() if s["followups"] > 0)
    pending = total - sent
    awaiting = sent - replied - bounced

    print("\n================  OUTREACH STATUS  ================")
    print(f"  Total target contacts     : {total}")
    print(f"  Initial mails sent        : {sent}")
    print(f"  Not yet contacted         : {pending}")
    print(f"  Follow-ups sent           : {followed}")
    print(f"  Replies received          : {replied}")
    print(f"  Bounced / undeliverable   : {bounced}")
    print(f"  Failed (never delivered)  : {failed}")
    print(f"  Awaiting response         : {awaiting}")
    print(f"  Sent/followed-up today    : {outgoing_today()}")
    print("===================================================")
    if replied:
        print("  Replied by:")
        for e, s in state.items():
            if s["replied"]:
                print(f"    - {e}  [{s['company']}]")
    if bounced:
        print("  Bounced:")
        for e, s in state.items():
            if s["bounced"]:
                print(f"    - {e}  [{s['company']}]")
    print()


# -------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description="Personalized job-application sender")
    ap.add_argument("--send", action="store_true",
                    help="actually send (omit for a safe dry-run preview)")
    ap.add_argument("--followup", action="store_true",
                    help="send follow-ups to non-responders instead of initial mails")
    ap.add_argument("--report", action="store_true",
                    help="print a status report and exit")
    ap.add_argument("--limit", type=int, default=35,
                    help="max emails to send per day (default 35)")
    ap.add_argument("--followup-after", type=int, default=5,
                    help="days to wait before a follow-up (default 5)")
    ap.add_argument("--max-followups", type=int, default=1,
                    help="max follow-ups per contact (default 1)")
    ap.add_argument("--min-delay", type=int, default=45)
    ap.add_argument("--max-delay", type=int, default=90)
    ap.add_argument("--recipients", default=str(DEFAULT_RECIPIENTS))
    ap.add_argument("--recipients-url", default="",
                    help="load recipients from a Google Sheet share/CSV URL "
                         "instead of the local CSV (or set RECIPIENTS_URL)")
    ap.add_argument("--template", default=str(DEFAULT_TEMPLATE))
    ap.add_argument("--resume", default=str(DEFAULT_RESUME))
    ap.add_argument("--test", metavar="EMAIL",
                    help="send a single test mail to this address, then exit")
    args = ap.parse_args()

    load_dotenv()
    sender = os.environ.get("GMAIL_ADDRESS", "").strip()
    password = os.environ.get("GMAIL_APP_PASSWORD", "").strip()
    resume_link = os.environ.get("RESUME_LINK", "").strip()
    resume = args.resume

    recipients_url = args.recipients_url.strip() or os.environ.get("RECIPIENTS_URL", "").strip()
    recipients = load_recipients(path=args.recipients, url=recipients_url or None)

    if args.report:
        cmd_report(recipients)
        return

    is_followup = args.followup
    tmpl_path = FOLLOWUP_TEMPLATE if is_followup else Path(args.template)
    if is_followup and not tmpl_path.exists():
        sys.exit(f"ERROR: follow-up template not found at {tmpl_path}")
    template = tmpl_path.read_text(encoding="utf-8")
    subject = FOLLOWUP_SUBJECT if is_followup else SUBJECT

    if not Path(resume).exists():
        log(f"WARNING: resume not found at {resume} - mails would have NO attachment.")

    # ---- test mode -------------------------------------------------------
    if args.test:
        if not args.send:
            log("Test mode is a dry-run unless --send is also passed.")
        log(f"Building test mail -> {args.test}")
        msg = build_message(sender or "you@example.com", args.test,
                            "Test Company", template, resume, subject, resume_link)
        if args.send:
            if not (sender and password):
                sys.exit("ERROR: set GMAIL_ADDRESS and GMAIL_APP_PASSWORD.")
            srv = connect(sender, password)
            srv.send_message(msg)
            srv.quit()
            log("Test mail sent.")
        else:
            print("\n----- PREVIEW (subject) -----\n" + subject)
            print("\n----- PREVIEW (body) -----\n"
                  + render_body(template, "Test Company", resume_link))
        return

    # ---- build queue -----------------------------------------------------
    state = load_state()
    queue, skipped = [], []
    for r in recipients:
        e = r["email"]
        el = e.lower()
        st = state.get(el)
        if not is_valid(e):
            skipped.append((e, "invalid-format")); continue
        if is_excluded(e):
            skipped.append((e, "EXCLUDED")); continue
        if is_followup:
            if not st or not st["sent"]:
                skipped.append((e, "not-yet-sent")); continue
            if st["replied"]:
                skipped.append((e, "already-replied")); continue
            if st["bounced"]:
                skipped.append((e, "bounced")); continue
            if st["followups"] >= args.max_followups:
                skipped.append((e, "max-followups-reached")); continue
            if days_since(st["first_sent"] or "") < args.followup_after:
                skipped.append((e, f"too-soon (<{args.followup_after}d)")); continue
            queue.append(r)
        else:
            if st and st["sent"]:
                skipped.append((e, "already-sent")); continue
            queue.append(r)

    today_count = outgoing_today()
    remaining = max(0, args.limit - today_count)
    to_process = queue[:remaining]
    mode = "FOLLOW-UP" if is_followup else "INITIAL"

    log(f"Mode: {mode} | eligible: {len(queue)} | daily room: {remaining} "
        f"| processing now: {len(to_process)} (sent today: {today_count})")
    if skipped:
        log(f"Skipped {len(skipped)}:")
        for e, why in skipped:
            log(f"   - {e}  ({why})")

    # ---- dry run ---------------------------------------------------------
    if not args.send:
        log(f"DRY-RUN (no --send): would {mode.lower()} email:")
        for r in to_process:
            log(f"   -> {r['email']:42s} [{r['company']}]")
        sample_co = to_process[0]["company"] if to_process else ""
        print("\n===== SAMPLE EMAIL PREVIEW =====")
        print("Subject:", subject)
        print("Attachment:",
              Path(resume).name if Path(resume).exists() else "(none)")
        print("-" * 60)
        print(render_body(template, sample_co, resume_link))
        log("Re-run with --send to actually send.")
        return

    # ---- real send -------------------------------------------------------
    if not (sender and password):
        sys.exit("ERROR: set GMAIL_ADDRESS and GMAIL_APP_PASSWORD before --send.")

    status_label = "followup" if is_followup else "sent"
    server = connect(sender, password)
    done = 0
    try:
        for i, r in enumerate(to_process):
            e, company = r["email"], r["company"]
            try:
                msg = build_message(sender, e, company, template, resume,
                                    subject, resume_link)
                server.send_message(msg)
                record(e, company, status_label)
                done += 1
                log(f"{mode} {done}/{len(to_process)} -> {e}  [{company}]")
            except (smtplib.SMTPServerDisconnected, smtplib.SMTPException) as ex:
                log(f"Reconnecting after error on {e}: {ex}")
                try:
                    server.quit()
                except Exception:
                    pass
                try:
                    server = connect(sender, password)
                    server.send_message(build_message(sender, e, company, template,
                                                       resume, subject, resume_link))
                    record(e, company, status_label, "after-reconnect")
                    done += 1
                    log(f"{mode} {done}/{len(to_process)} -> {e}  [{company}]")
                except Exception as ex2:
                    record(e, company, "failed", str(ex2)[:120])
                    log(f"FAILED -> {e}: {ex2}")
            if i < len(to_process) - 1:
                delay = random.randint(args.min_delay, args.max_delay)
                log(f"   ...waiting {delay}s")
                time.sleep(delay)
    finally:
        try:
            server.quit()
        except Exception:
            pass

    log(f"Done. {mode} sent {done} email(s) this run. Log: {SENT_LOG}")


if __name__ == "__main__":
    main()
