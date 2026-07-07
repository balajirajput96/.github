from typing import Dict
from utils.logger import setup_logger

logger = setup_logger(__name__)

class HREmailGenerator:
    """Generates professional, tailored HR application email drafts."""

    def __init__(self, profile_data: Dict):
        self.profile = profile_data

    def generate_draft(self, job: Dict) -> Dict:
        """Generates an email subject and body for a specific job."""
        logger.info(f"Generating email draft for {job.get('company')} - {job.get('title')}")

        subject = f"Application for {job.get('title')} - {self.profile.get('name', 'QA Professional')}"

        body = f"""Dear Hiring Manager,

I am writing to express my interest in the {job.get('title')} position at {job.get('company')}.

With {self.profile.get('experience', '2')} years of experience in Pharmaceutical Quality Assurance (IPQA), particularly in Tablet Manufacturing and Oral Solid Dosage (OSD), I am confident in my ability to contribute effectively to your quality operations.

My background includes hands-on experience with GMP compliance, documentation, in-process checks, and BMR/BPR review. I have consistently demonstrated a strong commitment to quality oversight and continuous improvement in pharmaceutical manufacturing environments.

Please find my resume attached for your review. I welcome the opportunity to discuss how my skills and experience align with the needs of {job.get('company')}.

Thank you for your time and consideration.

Sincerely,

{self.profile.get('name', '[Your Name]')}
{self.profile.get('phone', '[Your Phone]')}
{self.profile.get('email', '[Your Email]')}
{self.profile.get('linkedin', '[Your LinkedIn]')}
"""
        return {
            "job_id": job.get("id"),
            "company": job.get("company"),
            "subject": subject,
            "body": body
        }
