#!/usr/bin/env bash
# =============================================================================
#  run_every_5_days.sh  -  Vadodara-region pharma QA outreach automation
# -----------------------------------------------------------------------------
#  Runs the outreach cycle every 5 days:
#    1. Status report (what was sent / pending / replied)
#    2. Check inbox for replies & bounces (so we stop emailing them)
#    3. Send new initial applications (daily cap applies)
#    4. Send polite follow-ups to non-responders
#
#  REQUIREMENTS (on YOUR machine, never committed):
#    - job-outreach/.env  with SENDER_EMAIL, SENDER_NAME, GMAIL_APP_PASSWORD
#    - Python 3 (standard library only)
#
#  SAFE BY DEFAULT: without --send it only previews (dry-run).
#
#  ONE-TIME SETUP (cron, runs 09:30 every 5th day):
#    crontab -e
#    # then add this line (adjust the path):
#    30 9 */5 * * /full/path/to/job-outreach/run_every_5_days.sh --send >> /full/path/to/job-outreach/cron.log 2>&1
#
#  Windows users: use run_daily.bat with Task Scheduler (trigger: every 5 days).
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

SEND_FLAG="${1:-}"   # pass --send to actually send; empty = dry-run preview

echo "=================================================================="
echo " QA Outreach cycle  -  $(date '+%Y-%m-%d %H:%M')"
echo "=================================================================="

echo "--- [1/4] Status report ---"
python3 send_applications.py --report || true

echo "--- [2/4] Checking replies / bounces ---"
python3 check_replies.py ${SEND_FLAG:+--apply} || true

echo "--- [3/4] Sending new initial applications ---"
python3 send_applications.py ${SEND_FLAG}

echo "--- [4/4] Sending follow-ups to non-responders ---"
python3 send_applications.py --followup ${SEND_FLAG}

echo "--- Reminder: refresh openings every cycle ---"
echo "    Check these for new QA/IPQA walk-ins & posts (Vadodara/Halol/Savli/Padra/Ankleshwar):"
echo "    - https://www.pharmatutor.org/pharma-jobs"
echo "    - https://www.pharmabharat.com/"
echo "    - https://www.naukri.com/quality-assurance-jobs-in-vadodara"
echo "    - Company career pages in vadodara_osd_companies.csv"
echo "    Add any new verified HR emails to recipients.csv, then re-run."
echo "Done."
