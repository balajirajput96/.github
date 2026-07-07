import json
import os
from typing import List, Dict
from utils.logger import setup_logger

logger = setup_logger(__name__)

class JobCollector:
    """Collects job postings from authorized/public sources and normalizes them."""

    def __init__(self):
        self.jobs = []

    def mock_collect(self) -> List[Dict]:
        """Mock method to simulate collecting jobs for the demo."""
        logger.info("Starting job collection from authorized sources...")

        mock_jobs = [
            {
                "id": "1",
                "title": "QA Executive - OSD",
                "company": "Sun Pharma",
                "location": "Vadodara, Gujarat",
                "description": "2-4 years experience in IPQA. Handling BMR/BPR review, line clearance, in-process checks in OSD manufacturing.",
                "url": "https://example.com/sunpharma-qa"
            },
            {
                "id": "2",
                "title": "IPQA Officer",
                "company": "Zydus Lifesciences",
                "location": "Ahmedabad, Gujarat",
                "description": "Looking for IPQA officer with 1-3 years experience in tablet manufacturing. Strong knowledge of GMP and documentation.",
                "url": "https://example.com/zydus-ipqa"
            },
            {
                "id": "3",
                "title": "Senior QA Specialist",
                "company": "Intas Pharmaceuticals",
                "location": "Ahmedabad, Gujarat",
                "description": "5+ years experience required. Deviation handling, CAPA, and QMS management.",
                "url": "https://example.com/intas-qa"
            }
        ]

        self.jobs.extend(mock_jobs)
        logger.info(f"Collected {len(mock_jobs)} jobs.")
        return mock_jobs

    def save_to_json(self, filepath: str = "jobs/collected_jobs.json"):
        """Saves collected jobs to a JSON file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(self.jobs, f, indent=4)
        logger.info(f"Saved collected jobs to {filepath}")
