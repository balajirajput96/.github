import csv
import os
from github import Github
from datetime import datetime, timezone, timedelta

def get_repo():
    token = os.environ.get("GITHUB_TOKEN")
    repo_name = os.environ.get("GITHUB_REPOSITORY")
    if not token or not repo_name:
        raise ValueError("GITHUB_TOKEN or GITHUB_REPOSITORY environment variable not set.")
    g = Github(token)
    return g.get_repo(repo_name)

def read_csv(file_path):
    leads = []
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
    return leads

def write_csv(file_path, leads, fieldnames):
    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(leads)

def read_template(template_path):
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def run_followups():
    """Check for issues with 'Status: Sent' older than 7 days and add a reminder comment."""
    repo = get_repo()
    # Search for issues in this repo that are open and have the 'Status: Sent' label
    issues = repo.get_issues(state='open', labels=['Status: Sent'])

    now = datetime.now(timezone.utc)

    try:
        followup_template = read_template('templates/followup_template.md')
    except Exception:
        followup_template = "Hi! It's been 7 days since you sent this. Time for a polite follow-up!"

    for issue in issues:
        # Check if the last comment/update was more than 7 days ago
        if now - issue.updated_at > timedelta(days=7):
            # Check if we already posted a reminder recently to avoid spamming
            comments = issue.get_comments()
            recently_reminded = False
            for comment in comments:
                if "Time for a polite follow-up!" in comment.body and now - comment.created_at < timedelta(days=6):
                    recently_reminded = True
                    break

            if not recently_reminded:
                issue.create_comment(f"🔔 **Follow-up Reminder**\n\nIt has been 7 days since this was marked as 'Sent'. Consider sending a follow-up message using this template:\n\n```text\n{followup_template}\n```\n\nIf you send it, comment `/followup_sent` (or just leave it here).")
                print(f"Added follow-up reminder to issue #{issue.number}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--run-followups':
        run_followups()
