#!/usr/bin/env python3
"""
Repo-native pipeline (NO Google account needed).

Reads job URLs from inbox.txt -> fetch -> LLM extract -> filter -> LLM score ->
dedupe (against jobs.csv) -> LLM draft -> append to jobs.csv -> regenerate dashboard.md.

The GitHub Actions workflow commits jobs.csv + dashboard.md back to the repo.
NEVER sends anything. Only secret required: OPENROUTER_API_KEY.
"""
import os, sys, json, csv, hashlib, datetime, pathlib, re
import requests

HERE = pathlib.Path(__file__).resolve().parent
INBOX = HERE / "inbox.txt"
JOBS_CSV = HERE / "jobs.csv"
DASHBOARD = HERE / "dashboard.md"
MODEL = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
SCORE_THRESHOLD = int(os.getenv("SCORE_THRESHOLD", "55"))

FIELDS = ["key", "date_added", "company", "job_title", "department", "location",
          "walk_in", "source_url", "official_email", "official_phone", "eligibility",
          "salary", "company_size", "match_score", "score_reason", "subject", "email",
          "linkedin_note", "linkedin_message", "followup_day3", "followup_day7", "status"]

CANDIDATE = """Balaji Rajput - QA/IPQA Officer, 2 years, Solid Oral Dosage (tablet)
manufacturing. Skills: line clearance, in-process checks (compression: weight variation,
hardness, friability, thickness, disintegration), BMR/BPR review, granulation/compression/
coating, deviation, CAPA, IPQA sampling, GMP/GDP, documentation. Diploma in Biotechnology
(Parul University). Base: Vadodara. Priority: Vadodara, Ahmedabad, Halol, Savli, Sanand,
Changodar, Padra, Ankleshwar, Bharuch. Experience fit: 1-3 / 2-5 / 2-7 years."""


def llm(system, user, json_out=True):
    key = os.environ["OPENROUTER_API_KEY"]
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"model": MODEL,
              "messages": [{"role": "system", "content": system},
                           {"role": "user", "content": user}],
              "temperature": 0.2,
              **({"response_format": {"type": "json_object"}} if json_out else {})},
        timeout=90)
    r.raise_for_status()
    c = r.json()["choices"][0]["message"]["content"]
    return json.loads(c) if json_out else c


def prompt(name):
    return (HERE / "prompts" / f"{name}.md").read_text(encoding="utf-8")


def fetch_text(url):
    try:
        from bs4 import BeautifulSoup
        html = requests.get(url, timeout=45, headers={"User-Agent": "Mozilla/5.0"}).text
        soup = BeautifulSoup(html, "html.parser")
        for t in soup(["script", "style", "noscript"]):
            t.extract()
        return re.sub(r"\n{3,}", "\n\n", soup.get_text("\n"))[:12000]
    except Exception as e:
        print(f"  ! fetch failed {url}: {e}")
        return ""


def read_inbox():
    if not INBOX.exists():
        return []
    out = []
    for line in INBOX.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith("http"):
            out.append(line)
    return list(dict.fromkeys(out))


def read_jobs():
    if not JOBS_CSV.exists():
        return []
    with open(JOBS_CSV, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_jobs(rows):
    with open(JOBS_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in FIELDS})


def dkey(company, title, location, url):
    return hashlib.sha1(f"{company}|{title}|{location}|{url}".lower().encode()).hexdigest()[:12]


def main():
    if not os.getenv("OPENROUTER_API_KEY"):
        print("Missing OPENROUTER_API_KEY (add it in repo Settings -> Secrets -> Actions).")
        sys.exit(1)

    rows = read_jobs()
    keys = {r["key"] for r in rows}
    urls = read_inbox()
    print(f"{len(urls)} inbox URLs, {len(rows)} existing jobs")

    added = 0
    for url in urls:
        text = fetch_text(url)
        if len(text) < 200:
            print(f"  - skipped (little/no text, maybe JS-only page): {url}")
            continue
        try:
            data = llm(prompt("extract"), f"URL: {url}\n\nPAGE TEXT:\n{text}")
        except Exception as e:
            print(f"  ! extract failed: {e}"); continue

        job_list = data.get("jobs", []) if isinstance(data, dict) else []
        if not job_list:
            print(f"  - no relevant jobs found on: {url}")
            continue

        for d in job_list:
            company = (d.get("company") or "NOT VERIFIED").strip()
            title = (d.get("job_title") or "").strip()
            location = (d.get("location") or "").strip()
            if not title:
                continue
            k = dkey(company, title, location, url)
            if k in keys:
                continue
            try:
                sc = llm(prompt("score"), f"CANDIDATE:\n{CANDIDATE}\n\nJOB:\n{json.dumps(d)}")
                score = int(sc.get("match_score", 0))
            except Exception as e:
                print(f"  ! score failed: {e}"); score = 0; sc = {}
            drafts = {}
            if score >= SCORE_THRESHOLD:
                try:
                    drafts = llm(prompt("draft"),
                                 f"CANDIDATE:\n{CANDIDATE}\n\nJOB:\n{json.dumps(d)}")
                except Exception as e:
                    print(f"  ! draft failed: {e}")
            rows.append({
                "key": k, "date_added": datetime.date.today().isoformat(),
                "company": company, "job_title": title, "department": d.get("department", ""),
                "location": location, "walk_in": d.get("walk_in", ""), "source_url": url,
                "official_email": d.get("official_email", "NOT VERIFIED"),
                "official_phone": d.get("official_phone", "NOT VERIFIED"),
                "eligibility": d.get("eligibility", ""), "salary": d.get("salary", ""),
                "company_size": d.get("company_size", ""), "match_score": score,
                "score_reason": sc.get("reason", ""), "subject": drafts.get("subject", ""),
                "email": drafts.get("email", ""), "linkedin_note": drafts.get("linkedin_note", ""),
                "linkedin_message": drafts.get("linkedin_message", ""),
                "followup_day3": drafts.get("followup_day3", ""),
                "followup_day7": drafts.get("followup_day7", ""), "status": "new"})
            keys.add(k); added += 1
            print(f"  + [{score}] {company} - {title} ({location})")

    rows.sort(key=lambda r: int(r.get("match_score") or 0), reverse=True)
    write_jobs(rows)
    write_dashboard(rows, added)
    print(f"Done. {added} new. Total {len(rows)}.")


def write_dashboard(rows, added):
    today = datetime.date.today().isoformat()
    top = rows[:10]
    walkins = [r for r in rows if str(r.get("walk_in", "")).strip()]
    md = [f"# Job Dashboard — updated {today}", "",
          f"- New added today: **{added}**  |  Total tracked: **{len(rows)}**",
          f"- Walk-ins available: **{len(walkins)}**", "",
          "## Top 10 Matches", "",
          "| Score | Company | Title | Location | Link |",
          "|------:|---------|-------|----------|------|"]
    for r in top:
        md.append(f"| {r.get('match_score')} | {r.get('company')} | {r.get('job_title')} "
                  f"| {r.get('location')} | [open]({r.get('source_url')}) |")
    if walkins:
        md += ["", "## Walk-ins", "", "| Company | Walk-in | Location |",
               "|---------|---------|----------|"]
        for r in walkins[:10]:
            md.append(f"| {r.get('company')} | {r.get('walk_in')} | {r.get('location')} |")
    md += ["", "## Ready-to-send drafts (top matches)", ""]
    for r in top:
        if not r.get("email"):
            continue
        md += [f"<details><summary><b>{r.get('company')} — {r.get('job_title')} "
               f"(score {r.get('match_score')})</b></summary>", "",
               f"**Apply:** {r.get('source_url')}  ",
               f"**Email (verified?):** {r.get('official_email')}  ",
               f"**Subject:** {r.get('subject')}", "", "```", r.get("email", ""), "```",
               "**LinkedIn note:** " + r.get("linkedin_note", ""), "",
               "**Follow-up (Day 3):** " + r.get("followup_day3", ""), "",
               "</details>", ""]
    md += ["", "> Review, set status in jobs.csv, then SEND yourself. Nothing is auto-sent."]
    DASHBOARD.write_text("\n".join(md), encoding="utf-8")


if __name__ == "__main__":
    main()
