import re
import csv
from pathlib import Path

RECIPIENTS_FILE = Path(__file__).parent / "recipients.csv"

def extract_email_company(text):
    # Matches patterns like "email@domain.com - Company Name" or "Company Name <email@domain.com>" or just "email@domain.com"
    emails = re.findall(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', text)
    results = []

    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue

        found_email = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', line)
        if found_email:
            email = found_email.group(1)
            # Try to find company name
            # Remove email from line to see what's left
            remainder = line.replace(email, '').strip()
            # Clean up characters like -, :, <, >
            company = remainder.strip(' -:<>[]()').strip()

            if not company:
                # Derive from domain
                domain = email.split('@')[1].split('.')[0].capitalize()
                company = domain

            results.append({'email': email, 'company': company})

    return results

def add_to_csv(entries):
    fieldnames = ['company', 'email']
    file_exists = RECIPIENTS_FILE.exists()

    # Load existing emails to avoid duplicates
    existing_emails = set()
    if file_exists:
        with open(RECIPIENTS_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing_emails.add(row['email'].lower())

    with open(RECIPIENTS_FILE, mode='a', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()

        count = 0
        for entry in entries:
            if entry['email'].lower() not in existing_emails:
                writer.writerow(entry)
                existing_emails.add(entry['email'].lower())
                count += 1
        return count

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        print("Paste the emails and company names (type Ctrl+D to finish):")
        text = sys.stdin.read()

    entries = extract_email_company(text)
    if not entries:
        print("No valid email addresses found.")
    else:
        added = add_to_csv(entries)
        print(f"Processed {len(entries)} entries. Added {added} new recipients to {RECIPIENTS_FILE.name}.")
