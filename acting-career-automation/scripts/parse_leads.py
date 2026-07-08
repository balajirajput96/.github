import re

SCAM_KEYWORDS = [
    'fee', 'registration', 'charges', 'portfolio', 'payment'
]

SCAM_DOMAINS = [
    '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com'
]

def check_for_scams(lead):
    warnings = []
    notes = lead.get('notes', '').lower()
    contact = lead.get('contact', '').lower()
    project = lead.get('project', '').strip()

    # Check for fee/money keywords in notes
    for kw in SCAM_KEYWORDS:
        if kw in notes:
            warnings.append(f"Contains keyword '{kw}'")

    # Check for generic email domains (if contact is email)
    if lead.get('contact_type', '').lower() == 'email':
        for domain in SCAM_DOMAINS:
            if domain in contact:
                warnings.append(f"Uses generic email domain '{domain}'")

    # Check for missing project
    if not project or project.lower() == 'unknown':
        warnings.append("Missing project name")

    return warnings
