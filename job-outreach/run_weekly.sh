#!/usr/bin/env bash
# ====================================================================
#  WEEKLY job-application runner  (Linux / macOS)
#  Designed for a cron schedule of: every Monday at 12:00 noon.
#
#  IMPORTANT - this is NOT a spam loop. It will NOT re-send the same
#  application to people already contacted (de-dupe is always on).
#  Each week it:
#    1. detects replies & bounces (so they are skipped going forward)
#    2. emails any NEW companies added to recipients.csv / Google Sheet
#    3. sends a LIMITED follow-up (max 2 per contact) to non-responders
#       who were emailed 7+ days ago and have not replied/bounced
#    4. prints a status report
#
#  Re-sending the identical email to the same companies every week
#  would be spam and would get the Gmail account banned, so it is
#  intentionally prevented. Add NEW targets to keep the pipeline fresh.
#
#  Credentials are read from the .env file in this folder.
# ====================================================================
set -uo pipefail
cd "$(dirname "$0")"

LOG="run_weekly.log"
{
  echo ""
  echo "=================================================="
  echo "Weekly run started: $(date)"
  echo "=================================================="

  echo "--- [1/4] checking replies & bounces ---"
  python3 check_replies.py --apply || echo "(reply-check skipped/failed)"

  echo "--- [2/4] emailing NEW companies (de-duped, daily cap) ---"
  python3 send_applications.py --send --limit 120 || echo "(send skipped/failed)"

  echo "--- [3/4] limited follow-ups (7+ days, max 2 per contact) ---"
  python3 send_applications.py --followup --send --followup-after 7 --max-followups 2 \
      || echo "(follow-up skipped/failed)"

  echo "--- [4/4] status report ---"
  python3 send_applications.py --report || true

  echo "Weekly run finished: $(date)"
} >> "$LOG" 2>&1

echo "Weekly run complete. Full output in: $(pwd)/$LOG"
tail -n 25 "$LOG"
