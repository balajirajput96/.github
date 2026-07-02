# Pharma QA/IPQA Job Automation — MVP (GitHub Actions)

Free, no-server, compliant, human-in-the-loop job-application system.

## ⭐ RECOMMENDED: Zero-Google setup (only 1 secret, least work)
Uses the repo itself as the database — **no Google account needed.**

**One-time (2 minutes):**
1. Get a NEW OpenRouter key: https://openrouter.ai/keys
2. Repo → Settings → Secrets and variables → Actions → New secret:
   - Name: `OPENROUTER_API_KEY`  Value: your new key
3. Actions tab → enable workflows → open "Daily Pharma Job Scan" → **Run workflow** (test).

**Daily (10 seconds):**
- Open `job-outreach/automation/inbox.txt` on GitHub (pencil icon) → paste job URLs
  (LinkedIn/Naukri/Indeed/career pages) → commit.
- The daily run reads them and updates:
  - `dashboard.md` → ranked Top-10 matches + walk-ins + ready-to-send drafts
  - `jobs.csv`     → full tracker (with status column)
- You review `dashboard.md`, copy a draft, and **send it yourself** (nothing auto-sends).

That's the whole system. `run_repo.py` + `.github/workflows/daily-jobs.yml` do the rest.

---

## Alternative: Google Sheets dashboard (optional)
If you prefer a live spreadsheet dashboard instead of files in the repo, use `run.py`
with a Google Sheet. This needs a Google service account (more setup). Steps below.



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
- Create a new blank Google Sheet named `Pharma-Job-Tracker`.
- That's it — the workflow **auto-creates** the `Inbox`, `Jobs`, `Summary` tabs and
  headers on first run. (Schema reference: `sheet_schema.md`.)
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
