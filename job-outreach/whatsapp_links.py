#!/usr/bin/env python3
"""
======================================================================
 WhatsApp click-to-chat link generator  (SAFE, ban-proof)
 ---------------------------------------------------------------------
 Builds a wa.me link with a pre-filled, personalized message for each
 contact who has a phone number. You open the link and press Send
 yourself in WhatsApp.

 WHY NOT FULLY AUTOMATIC?  Bulk auto-sending WhatsApp messages to many
 (especially cold/scraped) numbers VIOLATES WhatsApp's rules and gets
 your number permanently BANNED. This one-click-per-contact approach is
 safe and keeps you in control.

 USAGE
   1. Add contacts to whatsapp_contacts.csv  (company,name,phone)
      phone in international form, e.g. 919876543210   (91 = India)
   2. python3 whatsapp_links.py
   3. Open whatsapp_links.html in a browser and click each green button.
      Only message people who are open to being contacted.
 ======================================================================
"""
import csv
import re
import urllib.parse
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONTACTS = HERE / "whatsapp_contacts.csv"
OUT_HTML = HERE / "whatsapp_links.html"

MESSAGE = (
    "Hello {name}, this is Balaji Rajput. I am a Quality Assurance Officer with "
    "2+ years of experience in pharmaceutical tablet (OSD) manufacturing at "
    "Elysium Pharmaceuticals, Vadodara - working on cGMP, SOPs, BMR/BPR review, "
    "IPQA, deviation/CAPA and change control. I am looking for a QA Officer / IPQA "
    "role and can join immediately. May I share my resume for any suitable opening "
    "at {company}? Thank you!"
)


def normalize(phone):
    """Keep digits only; add India country code 91 to a bare 10-digit mobile."""
    d = re.sub(r"\D", "", phone or "")
    if len(d) == 10:
        d = "91" + d
    return d


def main():
    if not CONTACTS.exists():
        print(f"Missing {CONTACTS.name}. Create it with columns: company,name,phone")
        return
    rows = []
    with open(CONTACTS, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            phone = normalize(r.get("phone"))
            if not phone:
                continue  # blank/placeholder -> skipped
            name = (r.get("name") or "Sir/Madam").strip() or "Sir/Madam"
            company = (r.get("company") or "your organization").strip() or "your organization"
            msg = MESSAGE.format(name=name, company=company)
            link = "https://wa.me/" + phone + "?text=" + urllib.parse.quote(msg)
            rows.append((company, name, phone, link))

    if not rows:
        print("No usable contacts yet. Add real opt-in numbers to "
              f"{CONTACTS.name} (company,name,phone) and re-run.")
        return

    for company, name, phone, link in rows:
        print(f"{company} ({name}, +{phone}):\n  {link}\n")

    cards = "\n".join(
        f'<div class="card"><b>{c}</b> &middot; {n} &middot; +{p}<br>'
        f'<a class="btn" href="{l}" target="_blank" rel="noopener">Open in WhatsApp</a></div>'
        for c, n, p, l in rows)
    html = (
        "<!doctype html><meta charset=utf-8><title>WhatsApp outreach</title>"
        "<style>body{font-family:sans-serif;max-width:680px;margin:24px auto;padding:0 12px}"
        ".card{border:1px solid #ddd;border-radius:8px;padding:12px;margin:10px 0}"
        ".btn{display:inline-block;margin-top:8px;background:#25D366;color:#fff;"
        "text-decoration:none;padding:8px 14px;border-radius:6px}</style>"
        f"<h2>WhatsApp outreach ({len(rows)} contacts)</h2>"
        "<p>Click a button, review the pre-filled message, then press send in "
        "WhatsApp. Only message people who are open to being contacted.</p>"
        + cards)
    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT_HTML.name} ({len(rows)} contacts). Open it in a browser and click each button.")


if __name__ == "__main__":
    main()
