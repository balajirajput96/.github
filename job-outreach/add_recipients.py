import sys
import re
import csv
from pathlib import Path

def extract_contacts(text):
    contacts = []
    lines = text.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue

        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', line)
        if email_match:
            email = email_match.group(0)
            if '←' in line:
                parts = line.split('←')
                company_part = parts[1] if email in parts[0] else parts[0]
                company = company_part.strip().split(',')[0].split('–')[0].strip()
            else:
                remaining = line.replace(email, '').strip(' ,<>[]()')
                company = remaining.split(',')[0].split('–')[0].strip() if remaining else ""

            company = re.sub(r'\(.*?\)', '', company).strip()
            if len(company.split()) > 4:
                company = " ".join(company.split()[:3])

            contacts.append({'company': company, 'email': email})

    return contacts

def update_recipients(new_contacts, csv_path):
    existing_emails = set()
    path = Path(csv_path)

    if path.exists():
        with open(path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing_emails.add(row['email'].lower())

    added_count = 0
    with open(path, 'a', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['company', 'email'])
        if not path.exists() or path.stat().st_size == 0:
            writer.writeheader()

        for contact in new_contacts:
            if contact['email'].lower() not in existing_emails:
                writer.writerow(contact)
                existing_emails.add(contact['email'].lower())
                added_count += 1

    return added_count

if __name__ == "__main__":
    raw_text = sys.stdin.read()
    contacts = extract_contacts(raw_text)
    if not contacts:
        sys.exit(0)
    update_recipients(contacts, 'job-outreach/recipients.csv')
