# Pharma QA/IPQA Job Automation — MVP (GitHub Actions + Google Sheets)

Free, no-server, compliant, human-in-the-loop job-application system.

- Runs **daily** on GitHub Actions (cron) — no server needed.
- Reads job URLs you paste into a Google Sheet **Inbox** tab (+ optional RSS feeds).
- Uses an LLM to **extract → score → draft** email / LinkedIn / follow-ups.
- Writes ranked results back into the Sheet (your dashboard).
- **Never sends anything.** You review, approve, and send yourself (compliant, ban-safe).

## What is automated vs manual
| Automated (daily, hands-off) | Manual (you, ~5–10 min/day) |
|---|---|
| Fetch job pages you queued | Paste new job/saved-search URLs into **Inbox** tab |
| Extract structured fields (AI) | Review **Top matches** |
| Score match vs your profile (AI) | Set status `approved` on good ones |
| Draft email + LinkedIn + follow-ups (AI) | Copy the draft and **send it yourself** |
| Dedupe + write to Sheet + daily summary | Attach your resume when sending |

## One-time setup (≈30 min)
### 1. Create the Google Sheet
- New Google Sheet named `Pharma-Job-Tracker`.
- Create tabs exactly: `Inbox`, `Jobs`, `Summary` (columns in `sheet_schema.md`).
- Copy its **Sheet ID** (from the URL between `/d/` and `/edit`).

### 2. Google service account (free)
- console.cloud.google.com → new project → enable **Google Sheets API**.
- Create a **Service Account** → create a JSON key → download it.
- **Share your Sheet** with the service account's email (Editor).

### 3. Get a NEW LLM key
- Use OpenRouter (openrouter.ai/keys) — create a **fresh** key.
- (Any key you ever pasted in chat/DM must be revoked and recreated.)

### 4. Add GitHub Secrets  (repo → Settings → Secrets and variables → Actions)
- `OPENROUTER_API_KEY`   = your new OpenRouter key
- `GOOGLE_SA_JSON`       = full contents of the service-account JSON
- `SHEET_ID`             = your Google Sheet ID
> Secrets live ONLY here. They are never written to code or committed.

### 5. Enable the workflow
- The workflow file is at `.github/workflows/daily-jobs.yml`.
- Actions tab → enable workflows → run once manually to test.

## Daily use
1. Paste any new job / LinkedIn saved-search / career-page URLs into the **Inbox** tab.
2. The daily run fills the **Jobs** tab (ranked) with ready drafts.
3. Open **Summary** → pick good matches → set status `approved` → copy draft → send.

## Files
- `run.py` — the pipeline (fetch → extract → score → draft → write)
- `prompts/` — reusable AI prompts (extract, score, draft, follow-up)
- `sources.example.yml` — optional RSS feeds (copy to `sources.yml`)
- `company_master_gujarat.csv` — verified pharma employers (seed)
- `sheet_schema.md` — Sheet tab/column definitions
- `compliance.md` — what must stay manual and why
