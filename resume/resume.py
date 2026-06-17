#!/usr/bin/env python3
"""
======================================================================
 Balaji Dilipsingh Rajput - QA Officer Resume (Single-Column, ATS-Safe)
 ---------------------------------------------------------------------
 INSTRUCTIONS:
   1. Install dependency (one-time):
          pip install reportlab
   2. Run this file:
          python3 resume.py
   3. Output: "Balaji_Rajput_QA_Officer_Resume.pdf" (same folder)
 ---------------------------------------------------------------------
 DESIGN:
   - Single column, no tables, no images, no text boxes -> ATS-safe.
   - All text is real, selectable text -> fully parseable by any ATS.
   - Standard fonts (Helvetica). Bold section headings with thin rules.
   - Live mailto / LinkedIn / GitHub hyperlinks in the header.
======================================================================
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate,
    Paragraph, Spacer, HRFlowable, KeepTogether, ListFlowable, ListItem,
)

# ---------------------------------------------------------------- palette
NAVY  = HexColor("#0B2E4F")   # name + section headings
ACCENT = HexColor("#1E5F8E")  # rules, links
DARK  = HexColor("#222222")   # body text
GREY  = HexColor("#555555")   # meta text

OUT = "Balaji_Rajput_QA_Officer_Resume.pdf"
PW, PH = A4
ML = MR = 16 * mm             # left / right margins (~0.63")
MT = 14 * mm                  # top margin
MB = 14 * mm                  # bottom margin
CW = PW - ML - MR             # content width
BUL = "\u2022"
EN  = "\u2013"

# ---------------------------------------------------------------- contact
NAME     = "BALAJI DILIPSINGH RAJPUT"
TITLE    = "Quality Assurance Officer  |  IPQA Officer  |  Pharmaceutical QA"
PHONE    = "+91 87808 61044"
EMAIL    = "balajirajput966@gmail.com"
LOCATION = "Vadodara, Gujarat 390010, India"
LINKEDIN = "linkedin.com/in/balaji-rajput-483a86194"
GITHUB   = "github.com/balajirajput96"

# ---------------------------------------------------------------- styles
def st(name, **kw):
    base = dict(fontName="Helvetica", fontSize=9.5, leading=13,
                textColor=DARK, spaceAfter=0)
    base.update(kw)
    return ParagraphStyle(name, **base)

S = {
    "name":   st("name", fontName="Helvetica-Bold", fontSize=19, leading=22,
                 textColor=NAVY, alignment=TA_CENTER),
    "title":  st("title", fontName="Helvetica-Bold", fontSize=10, leading=13,
                 textColor=ACCENT, alignment=TA_CENTER),
    "contact": st("contact", fontSize=8.6, leading=12, textColor=DARK,
                  alignment=TA_CENTER),
    "sect":   st("sect", fontName="Helvetica-Bold", fontSize=10.3, leading=12,
                 textColor=NAVY, spaceBefore=7),
    "body":   st("body", fontSize=8.9, leading=11.8, alignment=TA_JUSTIFY,
                 spaceAfter=1),
    "job":    st("job", fontName="Helvetica-Bold", fontSize=9.7, leading=12,
                 textColor=NAVY, spaceBefore=3),
    "meta":   st("meta", fontName="Helvetica-Oblique", fontSize=8.6,
                 leading=11, textColor=GREY, spaceAfter=1),
    "bullet": st("bullet", fontSize=8.7, leading=11.6, alignment=TA_JUSTIFY),
    "subh":   st("subh", fontName="Helvetica-Bold", fontSize=9.2, leading=11.8,
                 textColor=DARK),
    "small":  st("small", fontSize=8.7, leading=11.6, textColor=DARK),
}

def rule(space_after=4):
    return HRFlowable(width="100%", thickness=0.9, color=ACCENT,
                      spaceBefore=1, spaceAfter=space_after)

def heading(title):
    """Section heading + rule that never gets orphaned at a page bottom
    (keepWithNext pulls the following content along)."""
    kt = KeepTogether([Paragraph(title.upper(), S["sect"]), rule()])
    kt.keepWithNext = 1
    return kt

def bullets(items, style="bullet", gap=2):
    return ListFlowable(
        [ListItem(Paragraph(t, S[style]), leftIndent=12,
                  value=BUL, spaceAfter=gap) for t in items],
        bulletType="bullet", bulletColor=ACCENT, bulletFontSize=8,
        leftIndent=12, bulletOffsetY=0.5,
    )

# ---------------------------------------------------------------- page deco
def on_page(c, doc):
    c.saveState()
    # top accent band
    c.setFillColor(NAVY)
    c.rect(0, PH - 4 * mm, PW, 4 * mm, fill=1, stroke=0)
    # footer
    c.setStrokeColor(HexColor("#C9D4DC")); c.setLineWidth(0.6)
    c.line(ML, 9 * mm, PW - MR, 9 * mm)
    c.setFont("Helvetica", 7.6); c.setFillColor(GREY)
    c.drawString(ML, 5.8 * mm,
                 "Balaji Dilipsingh Rajput  |  Quality Assurance Officer")
    c.drawRightString(PW - MR, 5.8 * mm,
                      f"{PHONE}   {BUL}   {EMAIL}   {BUL}   Page {doc.page}")
    c.restoreState()

# ---------------------------------------------------------------- header flow
def header_block():
    contact1 = (f'{PHONE} &nbsp;&nbsp;{BUL}&nbsp;&nbsp; '
                f'<a href="mailto:{EMAIL}"><font color="#1E5F8E">{EMAIL}</font></a>'
                f' &nbsp;&nbsp;{BUL}&nbsp;&nbsp; {LOCATION}')
    contact2 = (f'<a href="https://{LINKEDIN}"><font color="#1E5F8E">{LINKEDIN}</font></a>'
                f' &nbsp;&nbsp;{BUL}&nbsp;&nbsp; '
                f'<a href="https://{GITHUB}"><font color="#1E5F8E">{GITHUB}</font></a>')
    return [
        Paragraph(NAME, S["name"]),
        HRFlowable(width="38%", thickness=2, color=ACCENT,
                   spaceBefore=3, spaceAfter=4, hAlign="CENTER"),
        Paragraph(TITLE, S["title"]),
        Spacer(1, 4),
        Paragraph(contact1, S["contact"]),
        Paragraph(contact2, S["contact"]),
        HRFlowable(width="100%", thickness=1.3, color=NAVY,
                   spaceBefore=6, spaceAfter=2),
    ]

# ================================================================ content
story = []
story += header_block()

# ---- Professional Summary ----
story.append(heading("Professional Summary"))
story.append(Paragraph(
    "Results-driven pharmaceutical Quality Assurance professional with 2+ years "
    "of hands-on experience in cGMP, GDP and Schedule M compliance at Elysium "
    "Pharmaceuticals Ltd., Vadodara, in Oral Solid Dosage (tablet) manufacturing. "
    "Skilled in SOP authoring, deviation management, CAPA, BMR/BPR review, change "
    "control, in-process quality checks (IPQA) and OOS/OOT investigation support "
    "within a QMS framework. Experienced in internal audits, documentation control "
    "and data integrity (ALCOA+), with strong audit readiness for CDSCO and WHO-GMP "
    "inspections. Seeking QA Officer / QA Executive / IPQA / Documentation Officer "
    "roles across Gujarat. Available to join immediately.",
    S["body"]))

# ---- Core Competencies ----
story.append(heading("Core Competencies"))
comp = [
    "cGMP / GDP / GLP & Schedule M Compliance", "SOP Writing & Periodic Review",
    "Batch Record Review (BMR / BPR)", "Deviation Management & CAPA",
    "Change Control Management", "OOS / OOT Investigation Support",
    "In-Process Quality Assurance (IPQA)", "Internal Audit & Self-Inspection",
    "QMS & Documentation Control", "Data Integrity (ALCOA+) & 21 CFR Part 11",
    "APQR & Stability Documentation", "CDSCO / WHO-GMP Audit Readiness",
    "ICH Guidelines (Q8 / Q9 / Q10)", "Vendor Qualification Support",
]
comp_text = (" &nbsp;&nbsp;<font color='#1E5F8E'>" + BUL + "</font>&nbsp;&nbsp; ").join(comp)
story.append(Paragraph(
    "<font color='#1E5F8E'>" + BUL + "</font>&nbsp;&nbsp; " + comp_text, S["small"]))

# ---- Professional Experience ----
story.append(heading("Professional Experience"))
exp_head = KeepTogether([
    Paragraph("Quality Assurance Officer / IPQA Officer "
              "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; "
              "<font color='#555555' size=9>Mar 2024 " + EN + " Mar 2026 (2 Years)</font>",
              S["job"]),
    Paragraph("Elysium Pharmaceuticals Ltd., Dabhasa, Vadodara, Gujarat  "
              f"{BUL}  Department: Quality Assurance", S["meta"]),
])
story.append(exp_head)
story.append(bullets([
    "Authored, reviewed and revised Standard Operating Procedures (SOPs) and "
    "managed periodic review schedules to maintain cGMP, GDP and Schedule M "
    "compliance across Oral Solid Dosage operations.",
    "Reviewed, verified and approved Batch Manufacturing Records (BMR) and Batch "
    "Packaging Records (BPR), including reconciliation, issuance logs and yield "
    "calculations, resolving discrepancies prior to batch release.",
    "Performed line clearance and in-process quality checks (IPQA) during "
    "granulation, compression, coating and packing - weight variation, hardness, "
    "friability, thickness and disintegration time as per BMR specifications.",
    "Identified, documented and investigated deviations using structured "
    "root-cause analysis (5-Why, Fishbone); implemented CAPA and tracked "
    "corrective / preventive actions to timely closure.",
    "Initiated, evaluated and closed Change Control records with cross-functional "
    "teams, performing impact assessment and post-change effectiveness verification "
    "for equipment, process and documentation changes.",
    "Supported OOS (Out of Specification) and OOT investigations in coordination "
    "with Quality Control per ICH Q10 and 21 CFR Part 211 guidance, contributing "
    "to batch review and release decisions.",
    "Conducted internal GMP audits and self-inspections across production, "
    "warehouse, HVAC/AHU and utility areas; documented observations and tracked "
    "corrective-action closure.",
    "Maintained document control, Good Documentation Practices (GDP) and data "
    "integrity (ALCOA+); compiled Annual Product Quality Review (APQR) inputs and "
    "supported the stability program through scheduled data review.",
    "Prepared documentation packages and provided audit readiness support for "
    "CDSCO and WHO-GMP inspections, including master files, validation summaries "
    "and change histories.",
    "Coordinated and delivered periodic GMP / GDP training for production staff "
    "and maintained up-to-date training records for compliance.",
]))

# ---- Education ----
story.append(heading("Education"))
story.append(KeepTogether([
    Paragraph("Diploma in Biotechnology "
              "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; "
              "<font color='#555555' size=9>2021 " + EN + " 2025 &nbsp;|&nbsp; CGPA: 6.7 / 10</font>",
              S["job"]),
    Paragraph("Parul Institute of Technology & Engineering, Vadodara - "
              "Gujarat Technological University (GTU)", S["meta"]),
]))
story.append(bullets([
    "Honours: Dean's List for Academic Excellence (2024" + EN + "25); "
    "Best Research Project Award (Bioethanol Production); "
    "Top 10 ranking in Molecular Biology coursework.",
    "Key Subjects: Molecular Biology, Biochemistry, Microbiology, Bioprocess "
    "Technology, Immunology, Fermentation Technology.",
], gap=2))

# ---- Internship Experience ----
story.append(heading("Internship Experience"))
story.append(KeepTogether([
    Paragraph("Bioinformatics Intern " + EN + " Biotecnika (Remote) "
              "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; "
              "<font color='#555555' size=9>2024 &nbsp;|&nbsp; 3 Months</font>", S["subh"]),
]))
story.append(bullets([
    "Built Python / Biopython pipelines for genomic data analysis; analysed 500+ "
    "DNA / protein sequences via BLAST and ClustalW.",
    "Reduced manual curation time by 40% through pipeline automation.",
], gap=2))
story.append(Spacer(1, 3))
story.append(KeepTogether([
    Paragraph("Laboratory Research Intern " + EN + " Gujarat Biotech Innovations "
              "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; "
              "<font color='#555555' size=9>2023 &nbsp;|&nbsp; 2 Months</font>", S["subh"]),
]))
story.append(bullets([
    "Executed PCR, gel electrophoresis and microbial culture workflows; processed "
    "80+ samples/week with 95% accuracy.",
    "Authored 3 SOPs under GLP protocols; improved laboratory efficiency by 20%.",
], gap=2))

# ---- Key Research Projects ----
story.append(heading("Key Research Projects"))
story.append(bullets([
    "<b>Bioethanol Production from Agricultural Waste (2024):</b> Optimised SSF "
    "process with S. cerevisiae using RSM/DOE; achieved 15% yield improvement "
    "validated via HPLC and ANOVA (p&lt;0.05). Best Research Project Award.",
    "<b>Comparative Genomic Analysis of AMR Genes (2024):</b> Analysed 120 "
    "bacterial genomes (NCBI GenBank) with an automated Python/Biopython BLAST "
    "pipeline; discovered 8 novel resistance gene variants from 500+ sequences.",
    "<b>Protein Structure Prediction & Molecular Docking (2023):</b> Modelled 5 "
    "therapeutic proteins (SWISS-MODEL) and docked 50 ligands (AutoDock Vina); "
    "identified 3 lead compounds (binding affinity " + EN + "8.0 kcal/mol or lower).",
    "<b>Microbial Quality Assessment of Dairy Products (2023):</b> Tested 40 "
    "dairy samples per ISO 4833 with 100% detection accuracy for E. coli and "
    "Salmonella.",
]))

# ---- Technical Skills ----
story.append(heading("Technical Skills"))
def skill_line(cat, val):
    return Paragraph(f"<b><font color='#0B2E4F'>{cat}:</font></b> {val}", S["small"])
story.append(skill_line(
    "QA / Regulatory",
    "GMP, cGMP, GDP, GLP, SOP Writing, CAPA, Deviation Management, BMR/BPR Review, "
    "Change Control, OOS Investigation, QMS, Internal Audit, Vendor Qualification, "
    "ICH Guidelines, WHO-GMP, CDSCO, 21 CFR Part 11, APQR, Stability Studies, "
    "Documentation Control, Data Integrity (ALCOA+)"))
story.append(Spacer(1, 2))
story.append(skill_line(
    "Laboratory",
    "HPLC, PCR (RT-PCR, qPCR), UV-Vis Spectrophotometry, Gel Electrophoresis, "
    "Microbial & Cell Culture, DNA/RNA Extraction, Microbial Limit Test, Sterility "
    "Testing, Media Preparation, Autoclave, Laminar Air Flow, Microscopy"))
story.append(Spacer(1, 2))
story.append(skill_line(
    "Bioinformatics",
    "Python (Biopython, Pandas, NumPy), R (Bioconductor), BLAST, ClustalW, NCBI, "
    "GenBank, UniProt, AutoDock Vina, SWISS-MODEL, PyMOL"))
story.append(Spacer(1, 2))
story.append(skill_line(
    "Software & Data",
    "MS Office (Advanced), TrackWise (basic), SAP (basic), SPSS, MATLAB, DOE/RSM, "
    "ANOVA, Git/GitHub"))

# ---- Certifications ----
story.append(heading("Certifications"))
story.append(bullets([
    "Bioinformatics Specialization " + EN + " Coursera / UC San Diego (2024)",
    "Python for Genomic Data Science " + EN + " Coursera / Johns Hopkins (2024)",
    "Industrial Biotechnology & GMP Fundamentals " + EN + " NPTEL / IIT Madras (2023)",
    "Molecular Biology Techniques " + EN + " Udemy (2023)",
    "Advanced Techniques in Biotechnology " + EN + " Parul University (2025)",
    "Web Designing " + EN + " ITI Vadodara (2021)  " + BUL +
    "  Digital Marketing " + EN + " Google Digital Garage",
], gap=2))

# ---- Key Achievements ----
story.append(heading("Key Achievements"))
story.append(bullets([
    "Best Research Project Award (Bioethanol Production) " + EN +
    " Parul Institute, 2024.",
    "Dean's List for Academic Excellence, 2024" + EN + "25.",
    "Top 10 ranking in Molecular Biology coursework.",
    "Authored 3 GLP SOPs adopted during laboratory internship; improved lab "
    "efficiency by 20%.",
    "40% reduction in manual bioinformatics curation time through pipeline "
    "automation; 8 novel AMR variants identified from 500+ sequences.",
], gap=2))

# ---- Languages ----
story.append(heading("Languages"))
story.append(Paragraph(
    "English (Fluent) &nbsp;&nbsp;" + BUL + "&nbsp;&nbsp; Hindi (Fluent) "
    "&nbsp;&nbsp;" + BUL + "&nbsp;&nbsp; Gujarati (Native)", S["small"]))

# ---- Personal Details + Declaration ----
story.append(heading("Personal Details"))
story.append(Paragraph(
    "Date of Birth: 20 June 2000 &nbsp;&nbsp;" + BUL + "&nbsp;&nbsp; "
    "Marital Status: Single &nbsp;&nbsp;" + BUL + "&nbsp;&nbsp; Nationality: Indian "
    "&nbsp;&nbsp;" + BUL + "&nbsp;&nbsp; Availability: Immediate Joiner", S["small"]))
story.append(Spacer(1, 3))
story.append(Paragraph(
    "<i>I hereby declare that the information furnished above is true and correct "
    "to the best of my knowledge and belief.</i>", S["small"]))

# ================================================================ build
doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=ML, rightMargin=MR, topMargin=MT, bottomMargin=MB,
    title="Balaji Dilipsingh Rajput - QA Officer Resume",
    author="Balaji Dilipsingh Rajput",
    subject=("Pharmaceutical Quality Assurance | QA Officer | IPQA | GMP | GDP | "
             "Schedule M | CAPA | Deviation | Change Control | BMR | BPR | OOS | "
             "QMS | APQR | WHO-GMP | CDSCO | ICH | Data Integrity | OSD Tablet"),
    keywords=("Quality Assurance, QA Officer, QA Executive, IPQA, Pharmaceutical QA, "
              "GMP, cGMP, GDP, GLP, SOP, CAPA, Deviation Management, Change Control, "
              "BMR, BPR, Batch Record Review, OOS, OOT, QMS, Internal Audit, "
              "Documentation Control, Data Integrity, ICH Guidelines, WHO-GMP, CDSCO, "
              "21 CFR Part 11, APQR, Stability, Vadodara, Gujarat, Tablet, OSD"))

frame = Frame(ML, MB, CW, PH - MT - MB, id="full",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])
doc.build(story)
print(f"Created {OUT}")
