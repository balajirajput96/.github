from typing import Dict, List
from utils.logger import setup_logger

logger = setup_logger(__name__)

class JobMatcher:
    """Compares job descriptions with the user profile to generate a match score."""

    def __init__(self, profile_summary: str):
        self.profile = profile_summary

    def match_jobs(self, jobs: List[Dict]) -> List[Dict]:
        """Evaluates jobs against the profile."""
        logger.info("Matching jobs against user profile...")
        matched_jobs = []

        # Simple keyword matching for demo purposes
        # ⚡ Bolt Optimization: Pre-uppercased keywords to prevent calling .upper() O(N*K) times in the loop
        keywords = ["IPQA", "QA", "OSD", "TABLET", "GMP", "BMR", "BPR"]

        for job in jobs:
            score = 0
            desc = job.get("description", "").upper()
            title = job.get("title", "").upper()

            for kw in keywords:
                if kw in desc or kw in title:
                    score += 10

            # Penalize for higher experience required (very simple logic)
            if "5+ years" in desc:
                score -= 30

            job["match_score"] = max(0, min(100, score)) # Normalize between 0-100
            matched_jobs.append(job)

        # Sort by best match
        matched_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        logger.info("Job matching complete.")
        return matched_jobs
