@echo off
REM ====================================================================
REM  Daily job-application runner  (Windows)
REM  Run once per day via Task Scheduler. In order it:
REM    1. detects replies & bounces
REM    2. sends the day's initial applications (respects the daily cap)
REM    3. sends follow-ups to non-responders
REM    4. prints a status report
REM  Credentials are read from the .env file in this folder.
REM  Usage:  double-click this file, or point Task Scheduler at it.
REM ====================================================================
cd /d "%~dp0"
set LOG=run_daily.log

echo. >> "%LOG%"
echo ================================================== >> "%LOG%"
echo Daily run started: %date% %time% >> "%LOG%"
echo ================================================== >> "%LOG%"

echo --- [1/4] checking replies ^& bounces --- >> "%LOG%"
python check_replies.py --apply >> "%LOG%" 2>&1

echo --- [2/4] sending initial applications --- >> "%LOG%"
python send_applications.py --send >> "%LOG%" 2>&1

echo --- [3/4] sending follow-ups --- >> "%LOG%"
python send_applications.py --followup --send >> "%LOG%" 2>&1

echo --- [4/4] status report --- >> "%LOG%"
python send_applications.py --report >> "%LOG%" 2>&1

echo Daily run finished: %date% %time% >> "%LOG%"
echo Daily run complete. Full output in: %cd%\%LOG%
