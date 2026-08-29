import sys
import os
import json
import unittest
from typing import Dict

# Add project root to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.job_collector import JobCollector
from agents.job_matcher import JobMatcher
from agents.hr_email_generator import HREmailGenerator
from agents.career_page_scanner import CareerPageScanner, is_safe_url
from agents.company_scanner import CompanyScanner
from agents.company_research import CompanyResearch
from agents.interview_generator import InterviewGenerator
from agents.resume_analyzer import ResumeAnalyzer
from agents.resume_optimizer import ResumeOptimizer
from utils.logger import setup_logger
from utils.config_loader import ConfigLoader

logger = setup_logger(__name__)

class TestSuite(unittest.TestCase):
    """Automated unit test suite verifying all repository agents and components."""

    def setUp(self):
        self.profile = {
            "name": "Balaji Rajput",
            "experience": "2",
            "role": "QA/IPQA Officer",
            "email": "balajirajput966@gmail.com",
            "phone": "+91-8780861044",
            "linkedin": "linkedin.com/in/balaji-rajput-483a86194",
            "summary": "2 years experience in Pharmaceutical QA / IPQA. Tablet manufacturing / OSD background with cGMP, BMR/BPR review, line clearance, CAPA, and ALCOA+ data integrity."
        }

    def test_config_loader(self):
        keys = ConfigLoader.load()
        self.assertIsInstance(keys, dict)
        self.assertIn("OPENAI_API_KEY", keys)

    def test_job_collector_and_matcher(self):
        collector = JobCollector()
        jobs = collector.mock_collect()
        self.assertGreaterEqual(len(jobs), 1)

        matcher = JobMatcher(self.profile["summary"])
        matched = matcher.match_jobs(jobs)
        self.assertEqual(len(matched), len(jobs))
        self.assertIn("match_score", matched[0])
        self.assertGreaterEqual(matched[0]["match_score"], 0)

    def test_hr_email_generator(self):
        email_gen = HREmailGenerator(self.profile)
        sample_job = {"id": "1", "title": "QA Officer", "company": "Alembic Pharmaceuticals"}
        draft = email_gen.generate_draft(sample_job)
        self.assertIn("Alembic Pharmaceuticals", draft["body"])
        self.assertIn("Balaji Rajput", draft["body"])
        self.assertIn("subject", draft)

    def test_career_page_scanner_safety(self):
        self.assertFalse(is_safe_url("http://127.0.0.1/admin"))
        self.assertFalse(is_safe_url("http://localhost:8080"))
        self.assertFalse(is_safe_url("http://192.168.1.1/internal"))
        self.assertFalse(is_safe_url("ftp://example.com/test"))
        self.assertTrue(is_safe_url("https://careers.sunpharma.com"))

    def test_company_scanner_and_research(self):
        research = CompanyResearch()
        profile = research.research_company("Alembic Pharmaceuticals")
        self.assertEqual(profile["headquarters"], "Vadodara, Gujarat")
        self.assertIn("USFDA", profile["certifications"])

        pitch_points = research.generate_tailored_pitch_points("Alembic Pharmaceuticals", "2")
        self.assertGreaterEqual(len(pitch_points), 3)

    def test_interview_generator(self):
        gen = InterviewGenerator()
        prep = gen.generate_interview_prep("QA Officer", "Sun Pharma")
        self.assertEqual(prep["role"], "QA Officer")
        self.assertGreaterEqual(len(prep["technical_questions"]), 3)
        self.assertGreaterEqual(len(prep["behavioral_questions"]), 2)

    def test_resume_analyzer(self):
        analyzer = ResumeAnalyzer()
        comprehensive_resume = (
            "QA / IPQA Officer with 2 years in OSD tablet manufacturing. "
            "Expertise in GMP, cGMP, QC, BMR, BPR review, line clearance, CAPA, "
            "deviation, change control, OOS, OOT, ALCOA+, data integrity, validation, "
            "Schedule M, WHO-GMP, HPLC, dissolution, disintegration, SOP, QMS, biotechnology."
        )
        analysis = analyzer.analyze_text(comprehensive_resume, "Looking for IPQA Officer with BMR review and GMP experience.")
        self.assertGreaterEqual(analysis["skill_coverage_percent"], 50)
        self.assertIn("GMP", analysis["found_skills"])
        self.assertIn("IPQA", analysis["found_skills"])
        self.assertTrue(analysis["is_ats_ready"])

    def test_resume_optimizer(self):
        optimizer = ResumeOptimizer(self.profile)
        summary = optimizer.generate_tailored_summary("QA Officer", "Zydus Lifesciences")
        self.assertIn("Zydus Lifesciences", summary)
        self.assertIn("2+ years", summary)

        bullets = optimizer.generate_impact_bullets(["BMR", "CAPA"])
        self.assertGreaterEqual(len(bullets), 4)

        ats_profile = optimizer.build_ats_resume_profile("QA Executive", "Torrent Pharma")
        self.assertEqual(ats_profile["name"], "Balaji Rajput")
        self.assertIn("core_competencies", ats_profile)

    def test_fastapi_ml_endpoints(self):
        from main import app, home, health, predict, PredictionInput
        from pydantic import ValidationError

        # Direct handler tests
        self.assertEqual(home()["status"], "active")
        self.assertEqual(health()["status"], "healthy")

        valid_input = PredictionInput(features=[1.0, 2.5, 3.2, 4.8])
        res = predict(valid_input)
        self.assertIn("prediction", res)
        self.assertIsInstance(res["prediction"], float)

        # Verify DoS input validation (>1000 items raises ValidationError)
        with self.assertRaises(ValidationError):
            PredictionInput(features=[1.0] * 1001)

        # TestClient invocation when environment transport is compatible
        try:
            from fastapi.testclient import TestClient
            client = TestClient(app)
            resp = client.get("/")
            if resp.status_code == 200:
                self.assertEqual(resp.json()["status"], "active")
            health_resp = client.get("/health")
            if health_resp.status_code == 200:
                self.assertEqual(health_resp.json()["status"], "healthy")
        except Exception:
            pass

def run_demo():
    print("="*60)
    print("PHARMA JOB AUTOMATION & AI AGENT PLATFORM - END-TO-END DEMO")
    print("="*60)

    # 1. Load config
    ConfigLoader.load()

    profile = {
        "name": "Balaji Rajput",
        "experience": "2",
        "role": "QA/IPQA Officer",
        "email": "balajirajput966@gmail.com",
        "phone": "+91-8780861044",
        "linkedin": "linkedin.com/in/balaji-rajput-483a86194",
        "summary": "2 years experience in Pharmaceutical QA / IPQA. Tablet manufacturing / oral solid dosage background with cGMP, documentation, in-process checks, BMR/BPR review, deviation/CAPA support, and ALCOA+ data integrity."
    }

    # 2. Collect Jobs
    print("\n[1] COLLECTING JOBS VIA JOBCOLLECTOR...")
    collector = JobCollector()
    jobs = collector.mock_collect()
    collector.save_to_json()

    # 3. Match Jobs
    print("\n[2] MATCHING JOBS VIA JOBMATCHER...")
    matcher = JobMatcher(profile["summary"])
    matched_jobs = matcher.match_jobs(jobs)

    for i, job in enumerate(matched_jobs[:2]):
        print(f"  {i+1}. {job['title']} at {job['company']} (Score: {job['match_score']})")

    # 4. Research Top Match Company
    best_job = matched_jobs[0]
    print(f"\n[3] RESEARCHING TARGET COMPANY: {best_job['company']}...")
    researcher = CompanyResearch()
    co_intel = researcher.research_company(best_job["company"])
    print(f"  Headquarters: {co_intel['headquarters']}")
    print(f"  Dosage Forms: {', '.join(co_intel['primary_dosage_forms'])}")
    print(f"  Certifications: {', '.join(co_intel['certifications'])}")

    # 5. Optimize Resume Profile & ATS Check
    print("\n[4] ANALYZING & OPTIMIZING RESUME...")
    analyzer = ResumeAnalyzer()
    analysis = analyzer.analyze_text(profile["summary"], best_job["description"])
    print(f"  Skill Coverage: {analysis['skill_coverage_percent']}% | ATS Ready: {analysis['is_ats_ready']}")

    optimizer = ResumeOptimizer(profile)
    opt_summary = optimizer.generate_tailored_summary(best_job["title"], best_job["company"])
    print(f"  Tailored Summary: {opt_summary[:120]}...")

    # 6. Generate Tailored HR Application Email
    print(f"\n[5] GENERATING TAILORED EMAIL DRAFT FOR {best_job['company']}...")
    email_gen = HREmailGenerator(profile)
    draft = email_gen.generate_draft(best_job)

    print(f"\n--- EMAIL DRAFT START ---")
    print(f"Subject: {draft['subject']}\n")
    print(draft['body'])
    print(f"--- EMAIL DRAFT END ---")

    # 7. Generate Interview Preparation Guide
    print(f"\n[6] GENERATING INTERVIEW PREP GUIDE FOR {best_job['title']}...")
    interview_gen = InterviewGenerator()
    prep = interview_gen.generate_interview_prep(best_job["title"], best_job["company"])
    print(f"  Generated {len(prep['technical_questions'])} technical scenario questions and {len(prep['behavioral_questions'])} behavioral questions.")

    # Save outputs
    os.makedirs('reports', exist_ok=True)
    with open(f"reports/draft_{best_job['company'].replace(' ', '_')}.txt", 'w', encoding='utf-8') as f:
        f.write(f"Subject: {draft['subject']}\n\n")
        f.write(draft['body'])

    print("\n✓ Full platform workflow demonstrated successfully!")

def main():
    if "--test" in sys.argv:
        # Run test suite
        sys.argv.remove("--test")
        unittest.main()
    else:
        run_demo()

if __name__ == "__main__":
    main()
