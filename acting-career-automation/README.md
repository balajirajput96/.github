# Acting/QA Career Automation Toolkit

This toolkit automates lead generation drafts, follow-ups, and organization for your job hunt using a local CSV file, Python scripts, and GitHub Actions.

## Setup Instructions
1. **GitHub Secret**: The default `GITHUB_TOKEN` provided by Actions is usually enough. If you encounter permission issues while creating issues, add a Personal Access Token as a secret named `GITHUB_PAT`.
2. **Project Board (Manual Setup)**:
   - Go to your repository's "Projects" tab.
   - Create a new "Project (v2)" board.
   - Create 4 columns: `New`, `Sent`, `Follow-up`, `Closed-tracking`.
   - Workflows will add labels to your issues. You can configure your GitHub Project's built-in automation to move issues to columns based on labels (e.g., when the `Status: Sent` label is added, move to `Sent`).

## Daily Workflow
1. **Find Leads**: Add new rows to `data/casting_leads.csv` with the status `NEW`.
2. **Commit & Push**: Push the updated CSV to GitHub.
3. **Automated Drafts**: A GitHub Action (`draft_generator.yml`) runs and creates a new Issue for each `NEW` lead. The Issue contains a personalized email/DM draft and checks for scam red flags.
4. **Manual Outreach**: Copy the draft, tweak it if needed, and send it manually.
5. **Update Issue**: Comment `/sent` on the Issue. The `reply_processor.yml` workflow will automatically label it `Status: Sent`.
6. **Follow-ups**: Every 7 days, the `follow_up_tracker.yml` checks for 'Sent' leads without responses and adds a reminder comment to follow up.
7. **Resolving**: If you get a reply, comment `/callback` or `/rejected` to update the issue labels. **Note**: Issues are never automatically closed.

## Disclaimer
This is purely a toolkit for organization. It does not send auto-DMs or auto-emails. All actual outreach must be done manually to ensure compliance and personalization.
