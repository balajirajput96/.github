#!/usr/bin/env python3
"""
Continuous 24/7 Automation Orchestrator & Self-Healing Engine.

This script executes periodic end-to-end automation cycles:
1. Python Agents & Job Matchers verification
2. Live Job Outreach Scanning & ATS Scoring
3. Lead Parsing & Scam Detection Heuristics
4. Health Checks & Automatic Asset Recovery (e.g. PDF generation, dashboard refresh)
5. Express Backend & React Client build verifications
6. Timestamped logging and heartbeat telemetry
"""

import os
import sys
import time
import json
import subprocess
import argparse
from datetime import datetime

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOG_DIR = os.path.join(REPO_ROOT, "logs")

def log(message: str, level: str = "INFO"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] [{level}] {message}"
    print(formatted)
    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        log_file = os.path.join(LOG_DIR, "orchestrator.log")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except OSError:
        pass

def run_command(cmd, cwd=REPO_ROOT, description="Command"):
    log(f"Executing: {description} -> {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True)
    if res.returncode == 0:
        log(f"✓ {description} succeeded.")
        return True, res.stdout
    else:
        log(f"✗ {description} failed with return code {res.returncode}:\n{res.stderr.strip()}", level="ERROR")
        return False, res.stderr

def run_single_cycle() -> dict:
    start_time = datetime.now()
    log("=================================================================")
    log("Starting 24/7 Continuous Automation Cycle...")
    log("=================================================================")

    results = {
        "cycle_timestamp": start_time.isoformat(),
        "tasks": {}
    }

    # Task 1: Python Agents Test & Demo
    success, out = run_command(
        [sys.executable, "scripts/demo_run.py", "--test"],
        description="Python Agents & FastAPI Endpoint Tests"
    )
    results["tasks"]["python_agents"] = {"status": "SUCCESS" if success else "FAILED"}

    # Task 2: URL Safety & SSRF Guard
    success, out = run_command(
        [sys.executable, "job-outreach/automation/test_url_safety.py"],
        description="URL Safety & SSRF Guard Tests"
    )
    results["tasks"]["url_safety"] = {"status": "SUCCESS" if success else "FAILED"}

    # Task 3: Lead Parsing & Scam Detection Heuristics
    success, out = run_command(
        [sys.executable, "acting-career-automation/scripts/parse_leads.py"],
        description="Lead Parsing & Scam Detection Tests"
    )
    results["tasks"]["scam_detection"] = {"status": "SUCCESS" if success else "FAILED"}

    # Task 4: Pharma Job Outreach Pipeline Scan
    success, out = run_command(
        [sys.executable, "run_repo.py"],
        cwd=os.path.join(REPO_ROOT, "job-outreach", "automation"),
        description="Pharma Job Outreach Automation Scan"
    )
    results["tasks"]["job_scan"] = {"status": "SUCCESS" if success else "FAILED"}

    # Task 5: Self-Healing PDF Resume Generation Check
    resume_pdf = os.path.join(REPO_ROOT, "Balaji_Rajput_QA_Officer_Resume.pdf")
    if not os.path.exists(resume_pdf):
        log("Resume PDF missing, automatically self-healing and generating...", level="WARNING")
        run_command(
            [sys.executable, os.path.join(REPO_ROOT, "resume", "resume.py")],
            cwd=REPO_ROOT,
            description="Self-Healing Resume PDF Generation"
        )
    results["tasks"]["resume_pdf"] = {"status": "PRESENT" if os.path.exists(resume_pdf) else "MISSING"}

    # Task 6: Express Backend Tests
    success, out = run_command(
        "npm test",
        cwd=os.path.join(REPO_ROOT, "web-app", "server"),
        description="Express Backend Test Suite"
    )
    results["tasks"]["backend_tests"] = {"status": "SUCCESS" if success else "FAILED"}

    # Task 7: React Client Tests
    success, out = run_command(
        "npm test -- --watchAll=false",
        cwd=os.path.join(REPO_ROOT, "web-app", "client"),
        description="React Client Test Suite"
    )
    results["tasks"]["client_tests"] = {"status": "SUCCESS" if success else "FAILED"}

    # Calculate overall health
    failed_tasks = [k for k, v in results["tasks"].items() if v.get("status") in ["FAILED", "MISSING"]]
    duration_s = (datetime.now() - start_time).total_seconds()
    results["duration_seconds"] = duration_s
    results["overall_health"] = "HEALTHY" if not failed_tasks else "DEGRADED"
    results["failed_tasks"] = failed_tasks

    # Save summary report
    try:
        report_path = os.path.join(LOG_DIR, "latest_health_report.json")
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
    except OSError:
        pass

    log(f"Cycle completed in {duration_s:.1f}s. Overall Health: {results['overall_health']}")
    return results

def run_daemon(interval_seconds: int = 3600, max_cycles: int = None):
    log(f"Starting 24/7 Continuous Automation Daemon (Interval: {interval_seconds}s, Max Cycles: {max_cycles or 'Infinite'})...")
    cycles = 0
    try:
        while True:
            cycles += 1
            log(f"--- Starting Automation Cycle #{cycles} ---")
            run_single_cycle()
            if max_cycles and cycles >= max_cycles:
                log(f"Reached max cycles ({max_cycles}). Exiting daemon.")
                break
            log(f"Cycle #{cycles} complete. Next run in {interval_seconds} seconds ({interval_seconds / 3600:.1f} hours)...")
            time.sleep(interval_seconds)
    except KeyboardInterrupt:
        log("Orchestrator daemon stopped by user.", level="WARNING")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="24/7 Continuous Automation Orchestrator")
    parser.add_argument("--once", action="store_true", help="Run a single automation cycle and exit")
    parser.add_argument("--daemon", action="store_true", help="Run continuously in background daemon loop")
    parser.add_argument("--interval", type=int, default=3600, help="Interval in seconds between cycles (default: 3600s)")
    parser.add_argument("--cycles", type=int, default=None, help="Maximum number of cycles to execute (default: infinite)")
    args = parser.parse_args()

    if args.once or not args.daemon:
        res = run_single_cycle()
        sys.exit(0 if res["overall_health"] == "HEALTHY" else 1)
    else:
        run_daemon(interval_seconds=args.interval, max_cycles=args.cycles)
