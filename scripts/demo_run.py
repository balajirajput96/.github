import sys
import os
import json

# Add project root to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.job_collector import JobCollector
from agents.job_matcher import JobMatcher
from agents.hr_email_generator import HREmailGenerator
from utils.logger import setup_logger
from utils.config_loader import ConfigLoader

logger = setup_logger(__name__)

def main():
    print("="*50)
    print("PHARMA JOB AUTOMATION AGENT - DEMO RUN")
    print("="*50)

    # 1. Load config
    ConfigLoader.load()

    # User Profile (Hardcoded for demo)
    profile = {
        "name": "Jane Doe",
        "experience": "2",
        "role": "QA/IPQA Executive",
        "email": "jane.doe@example.com",
        "phone": "+91-9876543210",
        "linkedin": "linkedin.com/in/janedoe-pharma",
        "summary": "2 years experience in Pharmaceutical QA / IPQA. Tablet manufacturing / oral solid dosage background. Experience with GMP, documentation, in-process checks, BMR/BPR review, deviation/CAPA support."
    }

    # 2. Collect Jobs
    print("\n[1] COLLECTING JOBS...")
    collector = JobCollector()
    jobs = collector.mock_collect()
    collector.save_to_json()

    # 3. Match Jobs
    print("\n[2] MATCHING JOBS AGAINST PROFILE...")
    matcher = JobMatcher(profile["summary"])
    matched_jobs = matcher.match_jobs(jobs)

    print(f"\nTop Matches:")
    for i, job in enumerate(matched_jobs[:2]):
        print(f"  {i+1}. {job['title']} at {job['company']} (Score: {job['match_score']})")

    # 4. Generate Email Draft
    print("\n[3] GENERATING EMAIL DRAFT FOR TOP MATCH...")
    best_job = matched_jobs[0]
    email_gen = HREmailGenerator(profile)
    draft = email_gen.generate_draft(best_job)

    print(f"\n--- EMAIL DRAFT START ---")
    print(f"Subject: {draft['subject']}\n")
    print(draft['body'])
    print(f"--- EMAIL DRAFT END ---")

    # Save draft to reports
    os.makedirs('reports', exist_ok=True)
    with open(f"reports/draft_{best_job['company'].replace(' ', '_')}.txt", 'w') as f:
        f.write(f"Subject: {draft['subject']}\n\n")
        f.write(draft['body'])

    print("\nDemo completed successfully! Check the 'jobs' and 'reports' folders for outputs.")

if __name__ == "__main__":
    main()
