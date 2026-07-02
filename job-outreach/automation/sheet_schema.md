# Google Sheet schema

Create ONE Google Sheet with 3 tabs.

## Tab: Inbox   (you paste URLs here)
| A: url |
|--------|
| (row 1 = header "url") |
| https://... a job / career-page / LinkedIn saved-search result URL you opened |

## Tab: Jobs   (the system writes here — this is your dashboard)
Header row (row 1), in this exact order:
key | date_added | company | job_title | department | location | walk_in |
source_url | official_email | official_phone | eligibility | salary |
company_size | match_score | score_reason | subject | email |
linkedin_note | linkedin_message | followup_day3 | followup_day7 | status

- `status` values: new, shortlisted, drafted, approved, applied, follow-up due,
  replied, interview scheduled, rejected, closed.
- Sort/filter by `match_score` (descending) to see best matches.

## Tab: Summary   (auto-refreshed daily)
Top 10 matches + best walk-ins + counts. Read-only; regenerated each run.
