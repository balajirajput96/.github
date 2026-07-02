@echo off
REM ====================================================================
REM  WEEKLY job-application runner  (Windows)
REM  Schedule in Task Scheduler: Weekly, every Monday at 12:00 noon.
REM
REM  NOT a spam loop - de-dupe is always on, so people already
REM  contacted are never re-emailed. Each week it:
REM    1. detects replies & bounces
REM    2. emails any NEW companies added to recipients.csv
REM    3. sends limited follow-ups (max 2) to non-responders
REM    4. prints a report
REM  Credentials come from the .env file in this folder.
REM ====================================================================
cd /d "%~dp0"
set LOG=run_weekly.log

echo. >> "%LOG%"
echo ================================================== >> "%LOG%"
echo Weekly run started: %date% %time% >> "%LOG%"
echo ================================================== >> "%LOG%"

python check_replies.py --apply >> "%LOG%" 2>&1
python send_applications.py --send --limit 120 >> "%LOG%" 2>&1
python send_applications.py --followup --send --followup-after 7 --max-followups 2 >> "%LOG%" 2>&1
python send_applications.py --report >> "%LOG%" 2>&1

echo Weekly run finished: %date% %time% >> "%LOG%"
echo Weekly run complete. Full output in: %cd%\%LOG%
