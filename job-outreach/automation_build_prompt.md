# MASTER BUILD PROMPT — Pharma QA/IPQA Job-Application Automation
# (Paste this whole thing into Kiro / your AI coding assistant)

---

You are a senior automation engineer + pharma job-search assistant. Build me a
COMPLIANT, human-in-the-loop, mostly-automated job-application system, MVP-first,
committing all code to my GitHub (I have GitHub Pro). Work in small, reviewable steps
and explain each step.

## CANDIDATE PROFILE
- Name: Balaji Rajput
- Education: Diploma in Biotechnology (Parul University)
- Experience: 2 years Pharmaceutical QA / IPQA, focused on tablet compression &
  Solid Oral Dosage (OSD) manufacturing
- Skills: Line clearance, in-process checks, BMR/BPR review, compression activities,
  granulation/compression/coating, GMP, GDP, deviation, CAPA, documentation, IPQA sampling
- Base: Vadodara. Immediate joiner. Resume PDF will be provided by me.

## PRIORITY GEOGRAPHY
Vadodara, Ahmedabad, Halol, Savli-Manjusar, Sanand, Changodar, Padra, Ankleshwar,
Bharuch, and nearby Gujarat pharma hubs. India-wide only if the match is strong.

## TARGET ROLES / KEYWORDS
QA, IPQA, Quality Assurance, Production Officer, tablet compression, solid oral dosage,
OSD, pharmaceutical manufacturing, line clearance, BMR/BPR review, granulation,
compression, coating. Experience filters: exactly 2 / 1–3 / 2–5 / 2–7 years.

## HARD COMPLIANCE RULES (never violate)
1. Use ONLY publicly available, verified information.
2. NEVER invent or guess emails, phone numbers, or job details. Mark anything
   unverified as "NOT VERIFIED".
3. NO mass-spam, NO repeated unsolicited messages.
4. Do NOT build an unattended bot that auto-logs into LinkedIn and auto-applies or
   auto-DMs at scale (this violates LinkedIn ToS and risks account ban).
5. Human-in-the-loop: the system PREPARES everything; I only review + approve before
   anything is sent. No message/application leaves without my explicit approval.
6. Prefer official company career pages, trusted job portals (Naukri, Indeed,
   pharma job boards), and job URLs / saved-search links that I provide.
7. Deduplicate. Never store secrets in the repo (use .env / secrets manager).

## WHAT TO DELIVER (in this order)
Produce all of the following, then start building the MVP:

1. ARCHITECTURE diagram/description (components + data flow).
2. GITHUB REPO folder structure.
3. n8n WORKFLOW outline (nodes, triggers, schedule) for ingest -> extract -> score ->
   draft -> store -> daily summary. All "send" steps gated behind manual approval.
4. DATABASE/SPREADSHEET schema (start with Google Sheets or Airtable; design so it can
   later move to PostgreSQL).
5. AI PROMPTS (store as reusable templates in the repo) for:
   a) job extraction (JD text -> structured fields)
   b) job scoring (role/location/reputation/salary/apply-quality/walk-in vs my profile)
   c) application drafting (subject + email + LinkedIn note + LinkedIn message)
   d) follow-up drafting (Day-3 and Day-7)
6. A MINIMAL MVP plan buildable quickly.
7. A DAILY OPERATING FLOW that needs the least manual effort (target: one dashboard,
   ~5–10 min/day: review, approve, done).
8. A COMPLIANCE section listing exactly what MUST stay manual and why.

## SYSTEM MUST DO DAILY
- Collect new postings for the target keywords from official career pages + portals +
  my provided LinkedIn saved-search / job URLs (I will paste these; do NOT scrape
  LinkedIn behind login).
- Filter by location priority, then experience fit.
- Rank each vacancy by match score (role relevance, location, company reputation,
  salary band, direct-application quality, walk-in priority).
- For each shortlisted role capture: company, job title, department, location,
  walk-in date/time/venue (if given), apply/posting link, official email (only if
  publicly verified), official phone (only if publicly verified), eligibility,
  salary/CTC (if mentioned), company size (small/mid/large/MNC), match score.
- Draft: tailored subject, concise email, LinkedIn connection note, LinkedIn message,
  Day-3 follow-up, Day-7 follow-up.
- Track status: new -> shortlisted -> drafted -> approved -> applied -> follow-up due
  -> replied -> interview scheduled -> rejected -> closed.
- Produce a daily summary: top 10 matches, best walk-ins, urgent follow-ups, new today.

## TECH PREFERENCES
- Workflow engine: n8n (self-host or cloud).
- Store: Google Sheets or Airtable for MVP.
- AI: for extraction, scoring, drafting.
- Code + prompt templates: my GitHub (Pro).
- Salary inference layer ONLY when salary is missing, clearly labeled "ESTIMATE (public
  market data)".
- Dedup key: company name + job title + location + posting date + source URL.
- Include a company master list of Gujarat + India pharma employers (I will help verify).

## MVP PRIORITY (build in this exact order)
1. Collect jobs + rank them (dashboard shows ranked list).
2. Add auto-drafting of application + follow-up text.
3. Add reminders + status tracking.
4. Optional: user-approved browser assistance ONLY if compliant and safe.

## HOW TO WORK WITH ME
- Start by confirming the plan, then build Phase 1 (collect + rank) end to end.
- Give me exact setup steps (accounts, API keys, n8n import, Sheet template).
- Keep every "send" action manual/approval-gated.
- Ask me for: my resume PDF, my LinkedIn saved-search URLs, and any portal preferences.
- Commit code to GitHub in small PRs with clear READMEs.

Begin with #1 (Architecture) and #6 (MVP plan). Then wait for my go-ahead to build.

---
### NOTE FOR ME (Balaji) — what stays manual by design
- Final click to SEND any email / LinkedIn note / application (I approve each).
- Logging into LinkedIn myself (no bot login).
- Confirming any email/phone before it's used.
This keeps my LinkedIn Premium + Gmail accounts safe from bans/spam flags.
