#!/usr/bin/env python3
"""
Repo-native pipeline (NO Google account needed).

inbox.txt (job/listing URLs) -> fetch -> [expand listing pages into individual posts]
-> LLM extract (multi-job) -> score -> dedupe -> LLM draft -> jobs.csv + dashboard.md.

The GitHub Actions workflow commits jobs.csv + dashboard.md back to the repo.
NEVER sends anything. Only secret required: OPENROUTER_API_KEY.
"""
import os, sys, json, csv, hashlib, datetime, pathlib, re
from urllib.parse import urljoin
import requests

HERE = pathlib.Path(__file__).resolve().parent
INBOX = HERE / "inbox.txt"
JOBS_CSV = HERE / "jobs.csv"
DASHBOARD = HERE / "dashboard.md"
MODEL = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
SCORE_THRESHOLD = int(os.getenv("SCORE_THRESHOLD", "55"))
MAX_POSTS_PER_LISTING = int(os.getenv("MAX_POSTS_PER_LISTING", "12"))

DIAG = []   # human-readable diagnostics surfaced into dashboard.md

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


def _parse_json(txt):
    txt = (txt or "").strip()
    if txt.startswith("```"):
        txt = re.sub(r"^```[a-zA-Z]*\n?", "", txt).rstrip("`").rstrip()
    try:
        return json.loads(txt)
    except Exception:
        m = re.search(r"\{.*\}", txt, re.S)
        return json.loads(m.group(0)) if m else {}


def llm(system, user, json_out=True):
    # Provider-flexible: works with any OpenAI-compatible endpoint
    # (OpenRouter / Google Gemini / Azure OpenAI / OpenAI). Configure via env:
    #   LLM_BASE_URL (default OpenRouter), LLM_MODEL, and key in
    #   LLM_API_KEY (falls back to OPENROUTER_API_KEY).
    base = (os.getenv("LLM_BASE_URL") or "https://openrouter.ai/api/v1").rstrip("/")
    key = os.getenv("LLM_API_KEY") or os.getenv("OPENROUTER_API_KEY") or ""
    body = {"model": MODEL,
            "messages": [{"role": "system", "content": system},
                         {"role": "user", "content": user}],
            "temperature": 0.2}
    if json_out and os.getenv("LLM_JSON_MODE", "on") != "off":
        body["response_format"] = {"type": "json_object"}
    url = f"{base}/chat/completions"
    headers = {"Content-Type": "application/json"}
    if os.getenv("LLM_API_STYLE", "").lower() == "azure":
        headers["api-key"] = key
        url += "?api-version=" + os.getenv("LLM_API_VERSION", "2024-08-01-preview")
    else:
        headers["Authorization"] = f"Bearer {key}"
    r = requests.post(url, headers=headers, json=body, timeout=90)
    r.raise_for_status()
    c = r.json()["choices"][0]["message"]["content"]
    return _parse_json(c) if json_out else c


def prompt(name):
    return (HERE / "prompts" / f"{name}.md").read_text(encoding="utf-8")


def fetch_html(url):
    try:
        r = requests.get(url, timeout=45, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code != 200:
            DIAG.append(f"fetch HTTP {r.status_code}: {url}")
        return r.text
    except Exception as e:
        DIAG.append(f"fetch ERROR {url}: {e}")
        print(f"  ! fetch failed {url}: {e}")
        return ""


def to_text(html):
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    for t in soup(["script", "style", "noscript"]):
        t.extract()
    return re.sub(r"\n{3,}", "\n\n", soup.get_text("\n"))[:12000]


def expand_links(url, html):
    """If URL is a known job-listing page, return individual posting URLs to follow."""
    out = []
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        if "pharmatutor.org" in url:
            for a in soup.select("a[href]"):
                h = a.get("href", "")
                if "/content/" in h:
                    out.append(urljoin(url, h))
    except Exception:
        pass
    return list(dict.fromkeys(out))[:MAX_POSTS_PER_LISTING]


def read_inbox():
    if not INBOX.exists():
        return []
    out = [l.strip() for l in INBOX.read_text(encoding="utf-8").splitlines()
           if l.strip().startswith("http")]
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


def process_page(url, rows, keys):
    """Extract, score and draft all jobs on one page. Returns count added."""
    html = fetch_html(url)
    if not html:
        return 0
    text = to_text(html)
    if len(text) < 200:
        DIAG.append(f"little text ({len(text)} chars, maybe JS-only): {url}")
        print(f"  - skipped (little/no text, maybe JS-only): {url}")
        return 0
    try:
        data = llm(prompt("extract"), f"URL: {url}\n\nPAGE TEXT:\n{text}")
    except Exception as e:
        DIAG.append(f"LLM extract ERROR: {e}")
        print(f"  ! extract failed {url}: {e}")
        return 0
    job_list = data.get("jobs", []) if isinstance(data, dict) else []
    if not job_list:
        DIAG.append(f"no jobs extracted from: {url}")
        print(f"  - no relevant jobs on: {url}")
        return 0
    added = 0
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
            DIAG.append(f"LLM score ERROR: {e}")
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
    return added


def main():
    if not (os.getenv("LLM_API_KEY") or os.getenv("OPENROUTER_API_KEY")):
        print("Missing LLM key. Set LLM_API_KEY (or OPENROUTER_API_KEY) in "
              "repo Settings -> Secrets -> Actions.")
        sys.exit(1)

    rows = read_jobs()
    keys = {r["key"] for r in rows}
    urls = read_inbox()
    print(f"{len(urls)} inbox URLs, {len(rows)} existing jobs")

    added = 0
    for url in urls:
        html = fetch_html(url)
        if not html:
            continue
        children = expand_links(url, html)
        if children:
            DIAG.append(f"listing {url} -> {len(children)} posts")
            print(f"  ~ listing: {url} -> {len(children)} posts")
            for c in children:
                added += process_page(c, rows, keys)
        else:
            added += process_page(url, rows, keys)

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
               f"**Email (verify):** {r.get('official_email')}  ",
               f"**Subject:** {r.get('subject')}", "", "```", r.get("email", ""), "```",
               "**LinkedIn note:** " + r.get("linkedin_note", ""), "",
               "**Follow-up (Day 3):** " + r.get("followup_day3", ""), "",
               "</details>", ""]
    md += ["", "> Review, set status in jobs.csv, then SEND yourself. Nothing is auto-sent."]
    if DIAG:
        md += ["", "## Run log (diagnostics)", "",
               "_If 0 jobs, these lines show why (blocked fetch / JS-only page / "
               "LLM key or credits error)._", ""]
        for line in DIAG[-40:]:
            md.append(f"- {line}")
    DASHBOARD.write_text("\n".join(md), encoding="utf-8")


if __name__ == "__main__":
    main()
