#!/usr/bin/env python3
"""
Pharma QA/IPQA job automation - MVP pipeline.

Flow (daily, via GitHub Actions):
  1. Read job URLs from the Sheet "Inbox" tab (+ optional RSS feeds in sources.yml)
  2. Fetch each page -> plain text
  3. LLM: extract structured fields
  4. Filter (location + experience) and LLM: score 0-100 vs candidate profile
  5. Dedupe (company+title+location+source_url)
  6. LLM: draft email + LinkedIn note/message + Day-3/Day-7 follow-ups
  7. Append new rows to the "Jobs" tab and refresh "Summary"

NEVER sends anything. Secrets come ONLY from environment (GitHub Actions Secrets):
  OPENROUTER_API_KEY, GOOGLE_SA_JSON, SHEET_ID
"""
import os, sys, json, hashlib, datetime, pathlib, re
import requests

HERE = pathlib.Path(__file__).resolve().parent
MODEL = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
SCORE_THRESHOLD = int(os.getenv("SCORE_THRESHOLD", "55"))

CANDIDATE = """Balaji Rajput - QA/IPQA Officer, 2 years, Solid Oral Dosage (tablet)
manufacturing. Skills: line clearance, in-process checks (compression: weight
variation, hardness, friability, thickness, disintegration), BMR/BPR review,
granulation/compression/coating, deviation, CAPA, IPQA sampling, GMP/GDP,
documentation. Diploma in Biotechnology (Parul University). Base: Vadodara.
Priority locations: Vadodara, Ahmedabad, Halol, Savli, Sanand, Changodar, Padra,
Ankleshwar, Bharuch. Experience fit: 1-3 / 2-5 / 2-7 years."""


# ----------------------------------------------------------------- LLM helper
def llm(system, user, json_out=True):
    key = os.environ["OPENROUTER_API_KEY"]
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [{"role": "system", "content": system},
                         {"role": "user", "content": user}],
            "temperature": 0.2,
            **({"response_format": {"type": "json_object"}} if json_out else {}),
        },
        timeout=90,
    )
    r.raise_for_status()
    content = r.json()["choices"][0]["message"]["content"]
    return json.loads(content) if json_out else content


def prompt(name):
    return (HERE / "prompts" / f"{name}.md").read_text(encoding="utf-8")


# ----------------------------------------------------------------- fetching
def fetch_text(url):
    try:
        from bs4 import BeautifulSoup
        html = requests.get(url, timeout=45, headers={"User-Agent": "Mozilla/5.0"}).text
        soup = BeautifulSoup(html, "html.parser")
        for t in soup(["script", "style", "noscript"]):
            t.extract()
        text = re.sub(r"\n{3,}", "\n\n", soup.get_text("\n"))
        return text[:12000]
    except Exception as e:
        print(f"  ! fetch failed {url}: {e}")
        return ""


def rss_urls(sources_file):
    urls = []
    if not sources_file.exists():
        return urls
    import yaml, feedparser
    cfg = yaml.safe_load(sources_file.read_text()) or {}
    for feed in cfg.get("rss", []):
        try:
            for e in feedparser.parse(feed).entries[:25]:
                urls.append(e.link)
        except Exception as ex:
            print(f"  ! rss failed {feed}: {ex}")
    return urls


# ----------------------------------------------------------------- sheets
def open_sheet():
    import gspread
    from google.oauth2.service_account import Credentials
    info = json.loads(os.environ["GOOGLE_SA_JSON"])
    creds = Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/spreadsheets"])
    gc = gspread.authorize(creds)
    return gc.open_by_key(os.environ["SHEET_ID"])


def dedup_key(company, title, location, url):
    raw = f"{company}|{title}|{location}|{url}".lower().strip()
    return hashlib.sha1(raw.encode()).hexdigest()[:12]


# ----------------------------------------------------------------- pipeline
def main():
    for var in ("OPENROUTER_API_KEY", "GOOGLE_SA_JSON", "SHEET_ID"):
        if not os.getenv(var):
            print(f"Missing env {var}. Set it in GitHub Actions Secrets.")
            sys.exit(1)

    sh = open_sheet()
    inbox = sh.worksheet("Inbox")
    jobs = sh.worksheet("Jobs")

    existing_keys = set(r.get("key", "") for r in jobs.get_all_records())

    # collect candidate URLs: Inbox column A (skip header) + optional RSS
    inbox_urls = [u.strip() for u in inbox.col_values(1)[1:] if u.strip().startswith("http")]
    urls = list(dict.fromkeys(inbox_urls + rss_urls(HERE / "sources.yml")))
    print(f"{len(urls)} candidate URLs")

    added = 0
    for url in urls:
        text = fetch_text(url)
        if len(text) < 200:
            continue
        try:
            data = llm(prompt("extract"), f"URL: {url}\n\nPAGE TEXT:\n{text}")
        except Exception as e:
            print(f"  ! extract failed {url}: {e}")
            continue

        company = data.get("company", "").strip() or "NOT VERIFIED"
        title = data.get("job_title", "").strip()
        location = data.get("location", "").strip()
        if not title:
            continue

        key = dedup_key(company, title, location, url)
        if key in existing_keys:
            continue

        try:
            sc = llm(prompt("score"), f"CANDIDATE:\n{CANDIDATE}\n\nJOB:\n{json.dumps(data)}")
            score = int(sc.get("match_score", 0))
        except Exception as e:
            print(f"  ! score failed: {e}")
            score = 0

        drafts = {}
        if score >= SCORE_THRESHOLD:
            try:
                drafts = llm(prompt("draft"),
                             f"CANDIDATE:\n{CANDIDATE}\n\nJOB:\n{json.dumps(data)}")
            except Exception as e:
                print(f"  ! draft failed: {e}")

        row = [
            key,
            datetime.date.today().isoformat(),
            company, title, data.get("department", ""),
            location, data.get("walk_in", ""),
            url, data.get("official_email", "NOT VERIFIED"),
            data.get("official_phone", "NOT VERIFIED"),
            data.get("eligibility", ""), data.get("salary", ""),
            data.get("company_size", ""), score,
            sc.get("reason", "") if score else "",
            drafts.get("subject", ""), drafts.get("email", ""),
            drafts.get("linkedin_note", ""), drafts.get("linkedin_message", ""),
            drafts.get("followup_day3", ""), drafts.get("followup_day7", ""),
            "new",
        ]
        jobs.append_row(row, value_input_option="RAW")
        existing_keys.add(key)
        added += 1
        print(f"  + [{score}] {company} - {title} ({location})")

    write_summary(sh, added)
    print(f"Done. {added} new jobs added.")


def write_summary(sh, added):
    try:
        summary = sh.worksheet("Summary")
    except Exception:
        return
    recs = sh.worksheet("Jobs").get_all_records()
    ranked = sorted(recs, key=lambda r: int(r.get("match_score", 0) or 0), reverse=True)
    top = ranked[:10]
    walkins = [r for r in recs if str(r.get("walk_in", "")).strip()][:10]
    today = datetime.date.today().isoformat()
    lines = [[f"Daily summary - {today}"], [f"New added today: {added}"], [""],
             ["TOP 10 MATCHES"], ["Score", "Company", "Title", "Location", "Link"]]
    for r in top:
        lines.append([r.get("match_score"), r.get("company"), r.get("job_title"),
                      r.get("location"), r.get("source_url")])
    lines += [[""], ["BEST WALK-INS"], ["Company", "Walk-in", "Location"]]
    for r in walkins:
        lines.append([r.get("company"), r.get("walk_in"), r.get("location")])
    summary.clear()
    summary.update("A1", lines)


if __name__ == "__main__":
    main()
