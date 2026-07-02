# Compliance — what MUST stay manual (and why)

This system is deliberately human-in-the-loop. The following NEVER happen automatically:

1. **Sending** any email, LinkedIn note, message, or application.
   -> You copy the draft and send it yourself. Prevents spam + keeps you in control.

2. **Logging into LinkedIn** or scraping content behind its login.
   -> Violates LinkedIn ToS and risks a permanent ban. You open LinkedIn yourself and
      paste public job / saved-search result URLs into the Inbox tab.

3. **Using unverified contact info.** Emails/phones are stored only if publicly present
   in the posting; otherwise marked "NOT VERIFIED". You verify before using.

4. **Mass / repeated messaging.** Only two scheduled follow-ups (Day 3, Day 7), and only
   after you approve.

5. **Secrets** (LLM key, Google key, Sheet ID) live ONLY in GitHub Actions Secrets —
   never in code, never committed, never in chat. Rotate any key that gets exposed.

What IS automated: fetching pages you queued, extracting fields, scoring, drafting text,
deduping, and writing a ranked dashboard + daily summary. That's the 95% that saves time;
the final human click stays with you.
