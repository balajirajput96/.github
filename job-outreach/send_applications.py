#!/usr/bin/env python3
"""
======================================================================
 Job-Application Outreach Sender  -  Balaji Dilipsingh Rajput
 ---------------------------------------------------------------------
 Sends a PERSONALIZED job-application email (with the resume PDF
 attached) to each company/HR address in recipients.csv, using your
 OWN Gmail account over SMTP.

 This is a targeted, rate-limited, personalized outreach tool - NOT a
 spam blaster. It:
   * personalizes the greeting + company name per recipient,
   * de-duplicates and never re-sends to an address already contacted,
   * enforces a daily cap and a human-like delay between mails,
   * NEVER contacts an excluded employer (e.g. a former company),
   * defaults to DRY-RUN (prints what it WOULD send, sends nothing).

 ---------------------------------------------------------------------
 QUICK START
   1. Create a Gmail "App Password" (see README.md), then export:
          export GMAIL_ADDRESS="balajirajput966@gmail.com"
          export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   2. Preview first (sends nothing):
          python3 send_applications.py
   3. Send one test mail to yourself:
          python3 send_applications.py --test balajirajput966@gmail.com --send
   4. Send for real (35/day cap, polite delays):
          python3 send_applications.py --send
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
DEFAULT_RESUME = HERE.parent / "resume" / "Balaji_Rajput_QA_Officer_Resume.pdf"
SENT_LOG = HERE / "sent_log.csv"

# ---- SAFETY: never contact these (former/current employer, etc.) -----
# Matches if the keyword appears anywhere in the email address.
EXCLUDE_KEYWORDS = ["elysium"]          # company already worked at
EXCLUDE_DOMAINS = set()                 # e.g. {"example.com"}
EXCLUDE_EMAILS = set()                  # e.g. {"someone@x.com"}

SUBJECT = ("Job Application - QC / Microbiology / Production / Lab Technician "
           "| Balaji Dilipsingh Rajput (Diploma Biotechnology)")
SENDER_NAME = "Balaji Dilipsingh Rajput"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ----------------------------------------------------------------- helpers
def log(msg):
    print(f"[{datetime.now():%H:%M:%S}] {msg}", flush=True)


def load_recipients(path):
    """Read recipients.csv -> list of {company, email}. De-dupes by email."""
    seen, rows = set(), []
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
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


def is_valid(email):
    return bool(EMAIL_RE.match(email))


def is_excluded(email):
    e = email.lower()
    if e in {x.lower() for x in EXCLUDE_EMAILS}:
        return True
    domain = e.split("@")[-1]
    if domain in {d.lower() for d in EXCLUDE_DOMAINS}:
        return True
    return any(kw.lower() in e for kw in EXCLUDE_KEYWORDS)


def load_sent_log():
    """Return (already_sent_set, count_sent_today)."""
    already, today_count = set(), 0
    today = date.today().isoformat()
    if SENT_LOG.exists():
        with open(SENT_LOG, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                if r.get("status") == "sent":
                    already.add((r.get("email") or "").lower())
                    if (r.get("timestamp") or "").startswith(today):
                        today_count += 1
    return already, today_count


def record(email, company, status, note=""):
    new = not SENT_LOG.exists()
    with open(SENT_LOG, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["timestamp", "email", "company", "status", "note"])
        w.writerow([datetime.now().isoformat(timespec="seconds"),
                    email, company, status, note])


def render_body(template, company):
    """Fill the template's {greeting}/{company} tokens for one recipient."""
    company_disp = company if company else "your organization"
    greeting = (f"Dear {company} HR Team," if company
                else "Dear Hiring Manager / HR Team,")
    return template.replace("{greeting}", greeting).replace("{company}", company_disp)


def build_message(sender, to_email, company, template, resume_path):
    body = render_body(template, company)

    msg = EmailMessage()
    msg["From"] = f"{SENDER_NAME} <{sender}>"
    msg["To"] = to_email
    msg["Subject"] = SUBJECT
    msg["Reply-To"] = sender
    msg.set_content(body)

    if resume_path and Path(resume_path).exists():
        data = Path(resume_path).read_bytes()
        msg.add_attachment(data, maintype="application", subtype="pdf",
                           filename=Path(resume_path).name)
    return msg


def connect(sender, password):
    ctx = ssl.create_default_context()
    server = smtplib.SMTP("smtp.gmail.com", 587, timeout=30)
    server.starttls(context=ctx)
    server.login(sender, password)
    return server


# -------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description="Personalized job-application sender")
    ap.add_argument("--send", action="store_true",
                    help="actually send (omit for a safe dry-run preview)")
    ap.add_argument("--limit", type=int, default=35,
                    help="max emails to send per day (default 35)")
    ap.add_argument("--min-delay", type=int, default=45,
                    help="min seconds between sends (default 45)")
    ap.add_argument("--max-delay", type=int, default=90,
                    help="max seconds between sends (default 90)")
    ap.add_argument("--recipients", default=str(DEFAULT_RECIPIENTS))
    ap.add_argument("--template", default=str(DEFAULT_TEMPLATE))
    ap.add_argument("--resume", default=str(DEFAULT_RESUME))
    ap.add_argument("--test", metavar="EMAIL",
                    help="send a single test mail to this address, then exit")
    args = ap.parse_args()

    sender = os.environ.get("GMAIL_ADDRESS", "").strip()
    password = os.environ.get("GMAIL_APP_PASSWORD", "").strip()
    template = Path(args.template).read_text(encoding="utf-8")
    resume = args.resume

    if not Path(resume).exists():
        log(f"WARNING: resume not found at {resume} - mails would send WITHOUT attachment.")

    # ---- test mode -------------------------------------------------------
    if args.test:
        if not args.send:
            log("Test mode is a dry-run unless --send is also passed.")
        log(f"Building test mail -> {args.test}")
        msg = build_message(sender or "you@example.com", args.test,
                            "Test Company", template, resume)
        if args.send:
            if not (sender and password):
                sys.exit("ERROR: set GMAIL_ADDRESS and GMAIL_APP_PASSWORD env vars.")
            srv = connect(sender, password)
            srv.send_message(msg)
            srv.quit()
            log("Test mail sent.")
        else:
            print("\n----- PREVIEW (subject) -----\n" + msg["Subject"])
            print("\n----- PREVIEW (body) -----\n" + render_body(template, "Test Company"))
        return

    # ---- load + filter ---------------------------------------------------
    recipients = load_recipients(args.recipients)
    already, today_count = load_sent_log()
    log(f"Loaded {len(recipients)} unique recipients. "
        f"Already-sent: {len(already)}. Sent today so far: {today_count}.")

    queue, skipped = [], []
    for r in recipients:
        e = r["email"]
        if not is_valid(e):
            skipped.append((e, "invalid-format")); continue
        if is_excluded(e):
            skipped.append((e, "EXCLUDED")); continue
        if e.lower() in already:
            skipped.append((e, "already-sent")); continue
        queue.append(r)

    remaining_today = max(0, args.limit - today_count)
    to_process = queue[:remaining_today]

    log(f"Eligible: {len(queue)} | Daily cap leaves room for: {remaining_today} "
        f"| Will process now: {len(to_process)}")
    if skipped:
        log("Skipped:")
        for e, why in skipped:
            log(f"   - {e}  ({why})")

    if not args.send:
        log("DRY-RUN (no --send): the following WOULD be emailed:")
        for r in to_process:
            log(f"   -> {r['email']:42s} [{r['company']}]")
        sample_company = to_process[0]["company"] if to_process else ""
        print("\n===== SAMPLE EMAIL PREVIEW =====")
        print("Subject:", SUBJECT)
        print("Attachment:", Path(resume).name if Path(resume).exists() else "(none)")
        print("-" * 60)
        print(render_body(template, sample_company))
        log("Re-run with --send to actually send.")
        return

    # ---- real send -------------------------------------------------------
    if not (sender and password):
        sys.exit("ERROR: set GMAIL_ADDRESS and GMAIL_APP_PASSWORD env vars before --send.")

    server = connect(sender, password)
    sent = 0
    try:
        for i, r in enumerate(to_process):
            e, company = r["email"], r["company"]
            try:
                msg = build_message(sender, e, company, template, resume)
                server.send_message(msg)
                record(e, company, "sent")
                sent += 1
                log(f"SENT  {sent}/{len(to_process)}  -> {e}  [{company}]")
            except (smtplib.SMTPServerDisconnected, smtplib.SMTPException) as ex:
                log(f"Reconnecting after error on {e}: {ex}")
                try:
                    server.quit()
                except Exception:
                    pass
                try:
                    server = connect(sender, password)
                    server.send_message(build_message(sender, e, company, template, resume))
                    record(e, company, "sent", "after-reconnect")
                    sent += 1
                    log(f"SENT  {sent}/{len(to_process)}  -> {e}  [{company}]")
                except Exception as ex2:
                    record(e, company, "failed", str(ex2)[:120])
                    log(f"FAILED -> {e}: {ex2}")
            # polite, human-like gap (skip after the last one)
            if i < len(to_process) - 1:
                delay = random.randint(args.min_delay, args.max_delay)
                log(f"   ...waiting {delay}s")
                time.sleep(delay)
    finally:
        try:
            server.quit()
        except Exception:
            pass

    log(f"Done. Sent {sent} email(s) this run. Log: {SENT_LOG}")


if __name__ == "__main__":
    main()
