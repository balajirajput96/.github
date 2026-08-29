#!/usr/bin/env bash
# ====================================================================
#  Daily job-application runner  (Linux / macOS)
#  Safe to run once per day via cron. In order it:
#    1. detects replies & bounces (so follow-ups skip those people)
#    2. sends the day's initial applications (respects the daily cap)
#    3. sends follow-ups to non-responders
#    4. prints a status report
#  The daily cap inside send_applications.py prevents over-sending,
#  so running this more than once a day is still safe.
#
#  Credentials are read from the .env file in this folder.
#  Usage:   ./run_daily.sh
cd "$(dirname "$0")"
LOG="run_daily.log"

run_pipeline() {
  echo ""
  echo "=================================================="
  echo "Daily run started: $(date)"
  echo "=================================================="

  echo "--- [1/4] checking replies & bounces ---"
  python3 check_replies.py --apply || echo "(reply-check skipped/failed)"

  echo "--- [2/4] sending initial applications (daily cap applies) ---"
  python3 send_applications.py --send || echo "(initial send skipped/failed)"

  echo "--- [3/4] sending follow-ups to non-responders ---"
  python3 send_applications.py --followup --send || echo "(follow-up skipped/failed)"

  echo "--- [4/4] status report ---"
  python3 send_applications.py --report || true

  echo "Daily run finished: $(date)"
}

if touch "$LOG" 2>/dev/null; then
  run_pipeline 2>&1 | tee -a "$LOG"
  echo "Daily run complete. Full output appended to: $(pwd)/$LOG"
else
  run_pipeline
  echo "Daily run complete."
fi
