#!/usr/bin/env python3
"""
======================================================================
 Reply & Bounce Checker  -  companion to send_applications.py
 ---------------------------------------------------------------------
 Logs into your Gmail over IMAP (read-only) and:
   * marks a contact as "replied"  if they emailed you back,
   * marks a contact as "bounced"  if Gmail's Mailer-Daemon reported
     their address as undeliverable.
 It then appends those statuses to sent_log.csv, so follow-ups
 automatically skip people who already replied or bounced.

 SAFE: only reads your own inbox. Defaults to DRY-RUN (prints findings,
 writes nothing) unless you pass --apply.

   export GMAIL_ADDRESS="balajirajput966@gmail.com"
   export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   python3 check_replies.py            # preview
   python3 check_replies.py --apply    # update sent_log.csv
 ======================================================================
"""

import argparse
import csv
import email
import imaplib
import os
import sys
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
SENT_LOG = HERE / "sent_log.csv"
ENV_FILE = HERE / ".env"
IMAP_HOST = "imap.gmail.com"
BOUNCE_SENDERS = ("mailer-daemon", "postmaster")


def log(m):
    print(f"[{datetime.now():%H:%M:%S}] {m}", flush=True)


def load_dotenv(path=ENV_FILE):
    if not Path(path).exists():
        return
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def load_state():
    """email_lower -> {company, sent, replied, bounced}."""
    state = {}
    if not SENT_LOG.exists():
        return state
    with open(SENT_LOG, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            e = (r.get("email") or "").lower()
            if not e:
                continue
            s = state.setdefault(e, {"company": "", "sent": False,
                                     "replied": False, "bounced": False})
            st = r.get("status")
            if st == "sent":
                s["sent"] = True
            elif st == "replied":
                s["replied"] = True
            elif st == "bounced":
                s["bounced"] = True
            if r.get("company"):
                s["company"] = r["company"]
    return state


def record(email_addr, company, status, note=""):
    new = not SENT_LOG.exists()
    with open(SENT_LOG, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["timestamp", "email", "company", "status", "note"])
        w.writerow([datetime.now().isoformat(timespec="seconds"),
                    email_addr, company, status, note])


def body_text(msg):
    """Best-effort plain-text extraction from an email.message."""
    if msg.is_multipart():
        chunks = []
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    chunks.append(part.get_payload(decode=True)
                                  .decode(part.get_content_charset() or "utf-8",
                                          "replace"))
                except Exception:
                    pass
        return "\n".join(chunks)
    try:
        return msg.get_payload(decode=True).decode(
            msg.get_content_charset() or "utf-8", "replace")
    except Exception:
        return msg.get_payload() if isinstance(msg.get_payload(), str) else ""


def imap_search_uids(imap, criteria):
    typ, data = imap.search(None, *criteria)
    if typ != "OK" or not data or not data[0]:
        return []
    return data[0].split()


def main():
    ap = argparse.ArgumentParser(description="Detect replies & bounces via IMAP")
    ap.add_argument("--apply", action="store_true",
                    help="write replied/bounced statuses to sent_log.csv "
                         "(default: dry-run preview)")
    ap.add_argument("--mailbox", default="INBOX")
    args = ap.parse_args()

    load_dotenv()
    user = os.environ.get("GMAIL_ADDRESS", "").strip()
    pwd = os.environ.get("GMAIL_APP_PASSWORD", "").strip()
    if not (user and pwd):
        sys.exit("ERROR: set GMAIL_ADDRESS and GMAIL_APP_PASSWORD (or use .env).")

    state = load_state()
    contacted = {e: s for e, s in state.items() if s["sent"]}
    if not contacted:
        log("No contacts have been emailed yet (empty sent_log.csv). Nothing to check.")
        return
    log(f"Checking inbox for replies/bounces against {len(contacted)} contacts...")

    imap = imaplib.IMAP4_SSL(IMAP_HOST)
    imap.login(user, pwd)
    imap.select(args.mailbox, readonly=True)

    new_replied, new_bounced = [], []

    # ---- replies: a message FROM a contacted address ---------------------
    for e, s in contacted.items():
        if s["replied"] or s["bounced"]:
            continue
        uids = imap_search_uids(imap, ("FROM", e))
        if uids:
            new_replied.append((e, s["company"]))

    # ---- bounces: Mailer-Daemon messages mentioning a contact ------------
    bounce_uids = []
    for snd in BOUNCE_SENDERS:
        bounce_uids += imap_search_uids(imap, ("FROM", snd))
    seen_bounce = set()
    for uid in bounce_uids:
        typ, data = imap.fetch(uid, "(RFC822)")
        if typ != "OK" or not data or not data[0]:
            continue
        msg = email.message_from_bytes(data[0][1])
        text = (msg.get("Subject", "") + "\n" + body_text(msg)).lower()
        for e, s in contacted.items():
            if e in seen_bounce or s["replied"] or s["bounced"]:
                continue
            if e in text:
                seen_bounce.add(e)
                new_bounced.append((e, s["company"]))

    try:
        imap.logout()
    except Exception:
        pass

    # ---- report ----------------------------------------------------------
    print("\n================  REPLY / BOUNCE SCAN  ================")
    print(f"  New replies detected : {len(new_replied)}")
    for e, c in new_replied:
        print(f"     REPLIED  {e}  [{c}]")
    print(f"  New bounces detected : {len(new_bounced)}")
    for e, c in new_bounced:
        print(f"     BOUNCED  {e}  [{c}]")
    print("======================================================")

    if not args.apply:
        log("DRY-RUN: nothing written. Re-run with --apply to update sent_log.csv.")
        return

    for e, c in new_replied:
        record(e, c, "replied", "imap-detected")
    for e, c in new_bounced:
        record(e, c, "bounced", "imap-detected")
    log(f"Applied: {len(new_replied)} replied, {len(new_bounced)} bounced "
        f"-> {SENT_LOG}")


if __name__ == "__main__":
    main()
