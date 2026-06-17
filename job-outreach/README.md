# Job-Application Outreach Automation

A small, **safe** tool to email a personalized job application (with the resume PDF
attached) to a curated list of pharmaceutical companies / HR contacts in Gujarat,
using **your own Gmail account**.

> This is **targeted, personalized, rate-limited outreach** — not a spam blaster.
> Mass/unsolicited blasting gets your email flagged and your number/account banned,
> and recruiters ignore it. This tool keeps volume sane and every mail personalized.

## What's here

| File | Purpose |
|------|---------|
| `send_applications.py` | The sender (pure Python standard library — no `pip install`) |
| `recipients.csv` | Your target list: `company,email` (de-duplicated) |
| `email_template.txt` | The email body with `{greeting}` / `{company}` tokens |
| `sent_log.csv` | Auto-created log of who was emailed (git-ignored) |

The resume that gets attached: `../resume/Balaji_Rajput_QA_Officer_Resume.pdf`.

## Safety features

- **Excluded employer**: never sends to addresses containing `elysium`
  (former employer). Add more in `EXCLUDE_KEYWORDS / EXCLUDE_DOMAINS / EXCLUDE_EMAILS`
  near the top of `send_applications.py`.
- **No duplicates / no re-sends**: tracks `sent_log.csv` and skips anyone already mailed.
- **Daily cap** (`--limit`, default **35/day**) so Gmail doesn't rate-limit you.
- **Human-like delay** (45–90s) between mails.
- **Dry-run by default**: prints what it *would* send. Nothing leaves your inbox
  until you add `--send`.

## Setup (one-time): Gmail App Password

Normal Gmail passwords don't work for SMTP. Create a free **App Password**:

1. Turn on **2-Step Verification**: <https://myaccount.google.com/security>
2. Open **App passwords**: <https://myaccount.google.com/apppasswords>
3. Create one (name it e.g. "job-outreach"). Google shows a 16-char code.
4. Export your credentials in the terminal:

```bash
export GMAIL_ADDRESS="balajirajput966@gmail.com"
export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"   # the 16-char app password
```

## Usage

```bash
# 1) Preview — sends NOTHING, shows the queue + a sample email
python3 send_applications.py

# 2) Send ONE test mail to yourself to check formatting + attachment
python3 send_applications.py --test balajirajput966@gmail.com --send

# 3) Send for real (35/day cap, polite delays)
python3 send_applications.py --send

# Optional: change the daily cap or delays
python3 send_applications.py --send --limit 25 --min-delay 60 --max-delay 120
```

Run it again the next day — it automatically continues with whoever is left,
respecting the daily cap and skipping anyone already emailed.

## Recommended workflow

1. **Test mail to yourself first** — confirm the resume attaches and the text looks right.
2. Start with a small `--limit` (e.g. 10–15) the first day, watch for bounces/replies.
3. **Follow up** after 4–5 days with people who didn't reply (you can re-use this tool
   with a follow-up template, or reply manually — manual replies convert best).
4. In parallel, **apply on official portals** (Naukri, LinkedIn, Indeed, company career
   pages) — these usually get the highest response rate.

## Adding / editing targets

Edit `recipients.csv`:

```csv
company,email
New Pharma Ltd,hr@newpharma.com
```

Leave `company` blank and the greeting falls back to "Dear Hiring Manager / HR Team,".

## Good-practice notes

- Keep the list to genuinely relevant employers/recruiters (quality > quantity).
- Don't send to the same company many times in a short window.
- If anyone asks to be removed, add their address to `EXCLUDE_EMAILS` and never mail again.
