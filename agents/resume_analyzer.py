import re
from typing import Dict, List, Optional
from utils.logger import setup_logger

logger = setup_logger(__name__)

PHARMA_CORE_SKILLS = [
    "GMP", "CGMP", "IPQA", "QA", "QC", "BMR", "BPR", "CAPA", "DEVIATION",
    "CHANGE CONTROL", "OOS", "OOT", "OSD", "TABLET", "CAPSULE", "LINE CLEARANCE",
    "ALCOA+", "DATA INTEGRITY", "VALIDATION", "SCHEDULE M", "WHO-GMP", "HPLC",
    "DISSOLUTION", "DISINTEGRATION", "SOP", "QMS", "BIOTECHNOLOGY"
]

class ResumeAnalyzer:
    """Analyzes resumes against pharma QA/IPQA job criteria and industry standards."""

    def __init__(self, core_skills: Optional[List[str]] = None):
        self.core_skills = [s.upper() for s in (core_skills or PHARMA_CORE_SKILLS)]

    def analyze_text(self, resume_text: str, target_job_desc: Optional[str] = None) -> Dict:
        """Analyzes resume text and generates skill breakdown, keyword matches, and gap score."""
        logger.info("Analyzing resume text against pharmaceutical QA benchmarks...")
        resume_upper = resume_text.upper()

        found_skills = []
        missing_skills = []

        for skill in self.core_skills:
            if skill in resume_upper:
                found_skills.append(skill)
            else:
                missing_skills.append(skill)

        # Baseline coverage score
        skill_coverage_score = int((len(found_skills) / len(self.core_skills)) * 100) if self.core_skills else 0

        # Custom comparison with job description if provided
        job_match_score = None
        job_keywords_matched = []
        job_keywords_missing = []

        if target_job_desc:
            desc_upper = target_job_desc.upper()
            relevant_job_skills = [s for s in self.core_skills if s in desc_upper]
            if relevant_job_skills:
                for s in relevant_job_skills:
                    if s in resume_upper:
                        job_keywords_matched.append(s)
                    else:
                        job_keywords_missing.append(s)
                job_match_score = int((len(job_keywords_matched) / len(relevant_job_skills)) * 100)
            else:
                job_match_score = skill_coverage_score

        recommendations = []
        if "BMR" not in found_skills or "BPR" not in found_skills:
            recommendations.append("Highlight hands-on BMR/BPR review and line clearance verification.")
        if "CAPA" not in found_skills or "DEVIATION" not in found_skills:
            recommendations.append("Include experience with root-cause analysis (5-Why/Fishbone) and CAPA.")
        if "DATA INTEGRITY" not in found_skills and "ALCOA+" not in found_skills:
            recommendations.append("Explicitly state knowledge of ALCOA+ Data Integrity guidelines.")

        return {
            "found_skills": found_skills,
            "missing_skills": missing_skills,
            "skill_coverage_percent": skill_coverage_score,
            "job_match_score": job_match_score if job_match_score is not None else skill_coverage_score,
            "job_keywords_matched": job_keywords_matched,
            "job_keywords_missing": job_keywords_missing,
            "recommendations": recommendations,
            "is_ats_ready": skill_coverage_score >= 50
        }
