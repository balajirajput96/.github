from typing import Dict, List, Optional
from utils.logger import setup_logger

logger = setup_logger(__name__)

# Known Gujarat & Major Indian Pharma company intelligence database
PHARMA_KNOWLEDGE_BASE: Dict[str, Dict] = {
    "Alembic Pharmaceuticals": {
        "headquarters": "Vadodara, Gujarat",
        "manufacturing_units": ["Panelav", "Karkhadi", "Jarod"],
        "primary_dosage_forms": ["Oral Solid Dosage (OSD)", "Formulations", "APIs"],
        "certifications": ["USFDA", "WHO-GMP", "EU-GMP", "Schedule M"],
        "focus_areas": ["Tablets", "Capsules", "IPQA", "Process Validation", "QMS"]
    },
    "Sun Pharma": {
        "headquarters": "Vadodara / Mumbai",
        "manufacturing_units": ["Halol", "Baska", "Tandalja", "Karkhadi"],
        "primary_dosage_forms": ["Oral Solid Dosage", "Injectables", "Complex Generics"],
        "certifications": ["USFDA", "WHO-GMP", "MHRA", "Schedule M"],
        "focus_areas": ["GMP Compliance", "BMR/BPR Review", "Data Integrity", "CAPA"]
    },
    "Zydus Lifesciences": {
        "headquarters": "Ahmedabad, Gujarat",
        "manufacturing_units": ["Moraiya", "Dabhasa", "Baddi", "SEZ Ahmedabad"],
        "primary_dosage_forms": ["OSD Tablets & Capsules", "Biologics", "Vaccines"],
        "certifications": ["USFDA", "WHO-GMP", "ANVISA", "Schedule M"],
        "focus_areas": ["In-Process Quality Control", "Deviation Management", "ALCOA+"]
    },
    "Torrent Pharmaceuticals": {
        "headquarters": "Ahmedabad, Gujarat",
        "manufacturing_units": ["Indrad", "Dahej", "Baddi", "Pithampur"],
        "primary_dosage_forms": ["Oral Solid Dosage", "Cardiovascular Formulations"],
        "certifications": ["USFDA", "WHO-GMP", "MHRA", "Schedule M"],
        "focus_areas": ["QMS", "Audit Readiness", "SOP Writing", "Stability Testing"]
    },
    "Intas Pharmaceuticals": {
        "headquarters": "Ahmedabad, Gujarat",
        "manufacturing_units": ["Matoda", "Pharmez SEZ", "Dehradun"],
        "primary_dosage_forms": ["OSD Formulations", "Injectables", "Biosimilars"],
        "certifications": ["USFDA", "WHO-GMP", "MHRA", "Schedule M"],
        "focus_areas": ["IPQA Line Clearance", "Change Control", "OOS/OOT"]
    }
}

class CompanyResearch:
    """Generates pharmaceutical company background briefings and compliance intelligence."""

    def __init__(self):
        self.kb = PHARMA_KNOWLEDGE_BASE

    def research_company(self, company_name: str) -> Dict:
        """Looks up or generates a detailed company research profile."""
        logger.info(f"Researching company profile: {company_name}")

        # Exact or partial match in knowledge base
        for known_name, info in self.kb.items():
            if known_name.lower() in company_name.lower() or company_name.lower() in known_name.lower():
                return {
                    "company": company_name,
                    "matched_profile": known_name,
                    **info,
                    "is_known_entity": True
                }

        # Fallback profile for unindexed companies
        return {
            "company": company_name,
            "matched_profile": "Standard Gujarat Pharmaceutical Manufacturer",
            "headquarters": "Gujarat, India",
            "manufacturing_units": ["Industrial Area / GIDC"],
            "primary_dosage_forms": ["Oral Solid Dosage (Tablets/Capsules)", "Pharmaceutical Formulations"],
            "certifications": ["WHO-GMP", "Schedule M", "CDSCO Compliant"],
            "focus_areas": ["cGMP Quality Operations", "Documentation", "BMR/BPR Verification"],
            "is_known_entity": False
        }

    def generate_tailored_pitch_points(self, company_name: str, candidate_experience_years: str = "2") -> List[str]:
        """Generates tailored talking points linking candidate skills with company profile."""
        profile = self.research_company(company_name)
        dosages = ", ".join(profile.get("primary_dosage_forms", ["OSD"]))
        certs = ", ".join(profile.get("certifications", ["WHO-GMP"]))

        return [
            f"Hands-on expertise in {dosages} manufacturing aligned with {certs} regulatory standards.",
            f"{candidate_experience_years} years executing cGMP documentation, line clearance, and BMR/BPR review.",
            "Solid track record in deviation investigation (5-Why, Fishbone) and proactive CAPA implementation.",
            "Strict adherence to Data Integrity (ALCOA+) principles and audit readiness."
        ]
