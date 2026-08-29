#!/usr/bin/env bash
# ==============================================================================
#  MASTER REPOSITORY VALIDATION & AUTOMATION SUITE
#  Validates all components across Python, Node, React, TypeScript, and Shell.
# ==============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "======================================================================"
echo " Starting Full Unified Validation Suite across entire repository..."
echo " Root directory: $ROOT_DIR"
echo "======================================================================"

echo ""
echo "[1/16] Python Agent & FastAPI Unit Tests..."
python3 "$ROOT_DIR/scripts/demo_run.py" --test

echo ""
echo "[2/16] Python Platform Workflow Demo..."
python3 "$ROOT_DIR/scripts/demo_run.py"

echo ""
echo "[3/16] URL Safety & SSRF Validation..."
python3 "$ROOT_DIR/job-outreach/automation/test_url_safety.py"

echo ""
echo "[4/16] Career Lead Scam Detection Tests..."
python3 "$ROOT_DIR/acting-career-automation/scripts/parse_leads.py"

echo ""
echo "[5/16] Career Drafts Generation..."
python3 "$ROOT_DIR/acting-career-automation/scripts/generate_drafts.py"

echo ""
echo "[6/16] Job Outreach Status & Contact Analysis..."
python3 "$ROOT_DIR/job-outreach/send_applications.py" --report

echo ""
echo "[7/16] Job Outreach Automation Pipeline (run_repo.py)..."
python3 "$ROOT_DIR/job-outreach/automation/run_repo.py"

echo ""
echo "[8/16] WhatsApp Outreach Generator..."
python3 "$ROOT_DIR/job-outreach/whatsapp_links.py"

echo ""
echo "[9/16] Outreach 5-Day Runner..."
bash "$ROOT_DIR/job-outreach/run_every_5_days.sh"

echo ""
echo "[10/16] Resume PDF Generator..."
python3 "$ROOT_DIR/resume/resume.py"

echo ""
echo "[11/16] Express Backend Tests (Jest + Node:test)..."
npm --prefix "$ROOT_DIR/web-app/server" test

echo ""
echo "[12/16] React Client Tests..."
npm --prefix "$ROOT_DIR/web-app/client" test -- --watchAll=false

echo ""
echo "[13/16] TypeScript Static Analysis..."
npx --prefix "$ROOT_DIR" tsc -p "$ROOT_DIR/tsconfig.json" --noEmit

echo ""
echo "[14/16] Root ESLint Analysis..."
npm --prefix "$ROOT_DIR" run lint

echo ""
echo "[15/16] Root Landing Production Build..."
npm --prefix "$ROOT_DIR" run build

echo ""
echo "[16/16] React Client Production Build..."
npm --prefix "$ROOT_DIR/web-app/client" run build

echo ""
echo "======================================================================"
echo " ALL 16 VALIDATION CHECKS PASSED WITH ZERO ERRORS!"
echo "======================================================================"
