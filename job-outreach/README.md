# Job-Application Outreach Automation

A small, **safe** toolkit to run a personalized job-application campaign to
pharmaceutical companies / HR contacts / recruiters in Gujarat — using **your own
Gmail**. It sends the application, follows up with non-responders, detects replies
and bounces, and reports progress.

> This is **targeted, personalized, rate-limited outreach** — not a spam blaster.
> Mass/unsolicited blasting gets your mail flagged and your account banned, and
> recruiters ignore it. This toolkit keeps volume sane and every mail personalized.

## Files

| File | Purpose |
|------|---------|
| `send_applications.py` | Sends initial mails **and** follow-ups; prints a status report |
| `check_replies.py` | Scans your inbox (IMAP) for replies & bounces, updates the log |
| `recipients.csv` | Your target list: `company,email` (de-duplicated) |
| `email_template.txt` | Initial email body (`{greeting}` / `{company}` / `{resume_link_line}`) |
| `followup_template.txt` | Polite follow-up email body |
| `companies_to_apply.csv` | Extra companies + official **careers-page URLs** to apply directly |
| `copy_paste_messages.md` | Ready-to-paste LinkedIn / Naukri / WhatsApp / phone messages |
| `whatsapp_links.py` / `whatsapp_contacts.csv` | Safe one-click WhatsApp links (you press send) |
| `run_daily.sh` / `run_daily.bat` | One-shot daily runner for cron / Task Scheduler |
| `.env.example` | Copy to `.env` and add your Gmail credentials |
| `sent_log.csv` | Auto-created campaign log (git-ignored) |

The resume that gets attached: `../resume/Balaji_Rajput_QA_Officer_Resume.pdf`.
Everything uses the **Python standard library** — no `pip install` needed.

## Safety features

- **Excluded employer** — never sends to addresses containing `elysium` (former
  employer). Add more in `EXCLUDE_KEYWORDS / EXCLUDE_DOMAINS / EXCLUDE_EMAILS` at the
  top of `send_applications.py`.
- **No duplicates / no re-sends** — tracks `sent_log.csv` and skips anyone already mailed.
- **Smart follow-ups** — only to people who were emailed N+ days ago and have **not**
  replied or bounced; capped per contact.
- **Daily cap** (`--limit`, default **35/day**) + **human-like delay** (45–90s).
- **Dry-run by default** — nothing leaves your inbox until you add `--send`
  (and `check_replies.py` writes nothing until `--apply`).

## One-time setup: Gmail App Password

Normal Gmail passwords don't work for SMTP/IMAP. Create a free **App Password**:

1. Turn on **2-Step Verification**: <https://myaccount.google.com/security>
2. Open **App passwords**: <https://myaccount.google.com/apppasswords>
3. Create one (e.g. "job-outreach"); Google shows a 16-char code.
4. Save your credentials in a `.env` file (git-ignored):

```bash
cp .env.example .env
# then edit .env and put your address + the 16-char app password
```

(Or `export GMAIL_ADDRESS=...` and `export GMAIL_APP_PASSWORD=...` instead.)

## The campaign — step by step

```bash
# 1) Preview the initial batch (sends NOTHING)
python3 send_applications.py

# 2) Send a test mail to yourself (check formatting + attachment)
python3 send_applications.py --test balajirajput966@gmail.com --send

# 3) Send the initial applications (35/day cap, polite delays)
python3 send_applications.py --send

# 4) A few days later — find out who replied / bounced
python3 check_replies.py            # preview
python3 check_replies.py --apply    # update the log

# 5) Follow up with people who didn't reply (waits 5 days by default)
python3 send_applications.py --followup --send

# 6) Check progress any time
python3 send_applications.py --report
```

Re-run on later days — it automatically continues where it left off, respects the
daily cap, and skips anyone already contacted / replied / bounced.

## Run it automatically every day (scheduler)

`run_daily.sh` (Linux/macOS) and `run_daily.bat` (Windows) do the full daily
cycle in one go: **check replies/bounces → send the day's initial batch →
send follow-ups → print a report**. The daily cap makes it safe to run once a day.

> The scheduler runs on **your own computer**, which must be on and online at the
> scheduled time. Credentials come from your `.env` file — nothing is stored anywhere else.

### Linux / macOS (cron)

```bash
chmod +x run_daily.sh           # one time
crontab -e                      # opens your crontab
```
Add this line to run every day at 10:00 AM (use the full path to the file):
```
0 10 * * * /full/path/to/job-outreach/run_daily.sh
```

### Windows (Task Scheduler)

1. Open **Task Scheduler** → **Create Basic Task**.
2. Trigger: **Daily**, time e.g. 10:00 AM.
3. Action: **Start a program** → browse to `run_daily.bat`.
4. Finish. (Tick "Run whether user is logged on or not" if you want.)

Output of each run is appended to `run_daily.log` in this folder.

## Useful options

```bash
# smaller first day + gentler pace
python3 send_applications.py --send --limit 15 --min-delay 60 --max-delay 120

# follow up only after 7 days, allow up to 2 follow-ups
python3 send_applications.py --followup --send --followup-after 7 --max-followups 2
```

## Status values in `sent_log.csv`

| status | meaning |
|--------|---------|
| `sent` | initial application delivered |
| `followup` | a follow-up was sent |
| `replied` | they emailed you back (set by `check_replies.py`) |
| `bounced` | address undeliverable (set by `check_replies.py`) |
| `failed` | send error (never delivered) |

## Adding / editing targets

Edit `recipients.csv`:

```csv
company,email
New Pharma Ltd,hr@newpharma.com
```

Leave `company` blank → greeting falls back to "Dear Hiring Manager / HR Team,".

### Option: manage the list in Google Sheets

Instead of editing the CSV, you can keep the list in a Google Sheet:

1. Make a sheet with header columns `company` and `email`.
2. Share it as **"Anyone with the link → Viewer"**.
3. Either set `RECIPIENTS_URL` in `.env` to the share URL, or run:

```bash
python3 send_applications.py --recipients-url "https://docs.google.com/spreadsheets/d/<ID>/edit"
```

The share/edit URL is auto-converted to a CSV-export link and downloaded each run —
no Google API key needed.

## Apply directly on company portals

`companies_to_apply.csv` lists additional Gujarat + national pharma companies with
their **official careers pages**. Many big employers (Zydus, Torrent, Sun, Cadila,
Intas, Amneal, Macleods, Cipla, Lupin, Dr Reddy's) hire mainly through their own
portals — applying there usually gets the **highest response rate**. Use it as your
direct-apply checklist alongside the email campaign.

## LinkedIn / Naukri / WhatsApp / phone messages

`copy_paste_messages.md` has ready-to-paste, personalized templates for LinkedIn
connection notes and recruiter messages, a Naukri/Indeed summary, an opt-in-only
WhatsApp message, and a short phone-call script. Replace `[Name]` / `[Company]` and send.

### WhatsApp (safe, one-click)

`whatsapp_links.py` turns a contact list into **wa.me click-to-chat links** with a
pre-filled message — you open each link and press send yourself.

```bash
# 1) add opt-in contacts to whatsapp_contacts.csv  (company,name,phone)
#    phone like 919876543210  (91 = India; bare 10-digit numbers get 91 added)
# 2) generate links
python3 whatsapp_links.py
# 3) open whatsapp_links.html in a browser, click each green button
```

> **Do NOT bulk auto-send WhatsApp messages to cold/scraped numbers** — it breaks
> WhatsApp's rules and gets your number permanently banned. Only message people who
> are open to being contacted. That's why this tool is one-click-per-person, not a blaster.

## A note on Naukri / LinkedIn / Indeed "auto-apply"

Fully automatic bot-applying on these portals is **not provided on purpose**: it
violates their Terms of Service (accounts get banned), breaks on CAPTCHAs/logins, and
recruiters reject obvious bot applications. Instead use `companies_to_apply.csv`
(direct careers pages) and `copy_paste_messages.md` (fast personalized applies). These
get far better results.

## Good-practice notes

- Keep the list to genuinely relevant employers/recruiters (quality > quantity).
- In parallel, **apply on official portals** (Naukri, LinkedIn, Indeed, company
  career pages) — these usually get the highest response rate.
- If anyone asks to be removed, add them to `EXCLUDE_EMAILS` and never mail again.
- Manual, personal replies convert best — use the automation to open doors, then
  follow through personally.
