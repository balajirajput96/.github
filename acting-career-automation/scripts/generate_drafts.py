import os
from tracker_utils import get_repo, read_csv, write_csv, read_template
from parse_leads import check_for_scams

CSV_PATH = 'data/casting_leads.csv'

def fill_template(template_str, lead):
    return template_str.replace('{{name}}', lead.get('contact', 'Hiring Manager')) \
                       .replace('{{role}}', lead.get('role', 'QA Role')) \
                       .replace('{{source}}', lead.get('source', 'Online')) \
                       .replace('{{project}}', lead.get('project', 'your project'))

def main():
    try:
        leads = read_csv(CSV_PATH)
    except FileNotFoundError:
        print(f"{CSV_PATH} not found. Skipping.")
        return

    if not leads:
        print("No leads in CSV.")
        return

    fieldnames = list(leads[0].keys())
    repo = get_repo()

    try:
        email_template = read_template('templates/email_template.md')
        dm_template = read_template('templates/dm_template.md')
    except Exception as e:
        print(f"Error reading templates: {e}")
        return

    updates_made = False

    for lead in leads:
        if lead.get('status', '').upper() == 'NEW':
            # Check for scams
            warnings = check_for_scams(lead)

            # Prepare draft
            is_email = lead.get('contact_type', '').lower() == 'email'
            draft_text = fill_template(email_template if is_email else dm_template, lead)

            # Create Issue body
            body = f"### Lead Details\n"
            body += f"- **Project:** {lead.get('project')}\n"
            body += f"- **Role:** {lead.get('role')}\n"
            body += f"- **Contact:** {lead.get('contact')} ({lead.get('contact_type')})\n"
            body += f"- **Source:** {lead.get('source')}\n"
            body += f"- **Notes:** {lead.get('notes')}\n\n"

            if warnings:
                body += "### ⚠️ WARNINGS\n"
                for w in warnings:
                    body += f"- {w}\n"
                body += "\n"

            body += f"### Suggested Draft\n```text\n{draft_text}\n```\n\n"
            body += "---\n*When you send this, comment `/sent` to update the status.*"

            title = f"Lead: {lead.get('project')} - {lead.get('role')}"
            labels = ['Status: New']
            if warnings:
                labels.append('Scam Warning')

            try:
                # Create issue
                issue = repo.create_issue(title=title, body=body, labels=labels)
                print(f"Created issue #{issue.number} for lead ID {lead.get('id')}")

                # Update CSV status
                lead['status'] = 'DRAFTED'
                updates_made = True
            except Exception as e:
                print(f"Failed to create issue for lead ID {lead.get('id')}: {e}")

    if updates_made:
        write_csv(CSV_PATH, leads, fieldnames)
        print("CSV updated with DRAFTED statuses.")

if __name__ == "__main__":
    main()
