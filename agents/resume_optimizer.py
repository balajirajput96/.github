from typing import Dict, List, Optional
from utils.logger import setup_logger

logger = setup_logger(__name__)

class ResumeOptimizer:
    """Optimizes and formats pharmaceutical QA resumes for ATS compliance and job targeting."""

    def __init__(self, profile_data: Optional[Dict] = None):
        self.profile = profile_data or {}

    def generate_tailored_summary(self, target_role: str = "QA Officer / IPQA Executive", target_company: Optional[str] = None) -> str:
        """Generates a high-impact executive summary for the target role."""
        logger.info(f"Generating optimized summary for {target_role}")
        exp = self.profile.get("experience", "2")
        name = self.profile.get("name", "Quality Assurance Professional")
        co_str = f" targeting opportunities at {target_company}" if target_company else ""

        return (
            f"Results-oriented {target_role} with {exp}+ years of hands-on experience in Oral Solid Dosage (OSD) "
            f"tablet manufacturing, cGMP compliance, and quality operations{co_str}. Proven expertise in BMR/BPR review, "
            f"in-process quality assurance (IPQA), line clearance, deviation investigation (5-Why/Fishbone), and CAPA execution. "
            f"Dedicated to ALCOA+ data integrity, Schedule M, and WHO-GMP audit readiness."
        )

    def generate_impact_bullets(self, target_keywords: Optional[List[str]] = None) -> List[str]:
        """Generates quantifiable, action-verb driven experience bullet points."""
        logger.info("Generating optimized experience bullets...")
        bullets = [
            "Executed daily IPQA oversight and line clearance across dispensing, granulation, compression, and coating areas in full cGMP compliance.",
            "Reviewed and approved 100+ Batch Manufacturing Records (BMR) and Batch Packaging Records (BPR) ensuring strict ALCOA+ data integrity.",
            "Conducted physical in-process checks including weight variation, thickness, hardness, friability, and disintegration testing.",
            "Facilitated root-cause analysis for shop-floor deviations and supported timely Corrective and Preventive Action (CAPA) closures.",
            "Assisted in Change Control impact assessments and standard operating procedure (SOP) authoring for production equipment.",
            "Participated in internal GMP self-inspections and maintained continuous audit readiness for WHO-GMP and regulatory inspections."
        ]

        if target_keywords:
            kws = [k.upper() for k in target_keywords]
            # Prioritize bullets matching provided keywords
            bullets.sort(key=lambda b: sum(1 for k in kws if k in b.upper()), reverse=True)

        return bullets

    def build_ats_resume_profile(self, target_role: str = "QA Officer", target_company: Optional[str] = None) -> Dict:
        """Compiles a complete ATS-optimized resume profile dictionary."""
        return {
            "name": self.profile.get("name", "Balaji Rajput"),
            "contact": {
                "phone": self.profile.get("phone", "+91-8780861044"),
                "email": self.profile.get("email", "balajirajput966@gmail.com"),
                "location": self.profile.get("location", "Vadodara, Gujarat, India"),
                "linkedin": self.profile.get("linkedin", "linkedin.com/in/balaji-rajput-483a86194")
            },
            "headline": f"{target_role} | cGMP & IPQA Specialist (OSD Manufacturing)",
            "summary": self.generate_tailored_summary(target_role, target_company),
            "core_competencies": [
                "cGMP & Schedule M", "IPQA Line Clearance", "BMR / BPR Verification",
                "Deviation Management & CAPA", "Data Integrity (ALCOA+)", "In-Process Quality Checks",
                "Change Control", "SOP Preparation", "Audit Readiness & QMS"
            ],
            "experience_bullets": self.generate_impact_bullets()
        }
