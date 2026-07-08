# Rules for AI Agents

1. **Role Context**: Always refer to the user's role as "QA" (Quality Assurance) with 2+ years of experience in any generated templates or outreach materials.
2. **No Auto-Outreach**: Do not attempt to add code that automatically sends emails, DMs, or WhatsApp messages. Everything must result in a draft placed inside a GitHub Issue.
3. **Never Close Issues or PRs**: Do NOT write automation rules that close Issues or Pull Requests. Even if an issue is resolved, rejected, or a duplicate, it should only be labelled.
4. **Source of Truth**: The `data/casting_leads.csv` file is the ultimate source of truth. Do not integrate external Google Sheets or web databases.
