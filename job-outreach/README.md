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

## Good-practice notes

- Keep the list to genuinely relevant employers/recruiters (quality > quantity).
- In parallel, **apply on official portals** (Naukri, LinkedIn, Indeed, company
  career pages) — these usually get the highest response rate.
- If anyone asks to be removed, add them to `EXCLUDE_EMAILS` and never mail again.
- Manual, personal replies convert best — use the automation to open doors, then
  follow through personally.
