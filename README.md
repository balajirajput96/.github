# Pharma Job Automation Agent

A personal AI-powered job search and automation toolkit tailored for Pharmaceutical QA/IPQA roles. This system helps you find jobs, match your resume, and draft tailored HR emails and cover letters to streamline the application process.

## Features
- **Job Collection:** Scan public job boards and company career pages (no unauthorized scraping).
- **Resume Tailoring:** Compare job descriptions with your Pharma QA/IPQA profile.
- **Match Scoring:** Generate short match scores based on requirements like GMP, BMR/BPR review, and quality oversight.
- **Email drafting:** Auto-generate tailored application email drafts with subject lines and bodies.
- **Reporting:** Daily summaries of new jobs and matches.

## Quick Start (Beginner Friendly)

1. **Clone the repository and set up a virtual environment:**
   `python -m venv venv`
   `source venv/bin/activate`  # On Windows, use `venv\Scripts\activate`

2. **Install requirements:**
   `pip install -r requirements.txt`

3. **Configure Environment:**
   Copy `.env.example` to `.env` and fill in your API keys (e.g., Google Gemini, OpenAI).
   `cp .env.example .env`

4. **Run the Demo:**
   `python scripts/demo_run.py`

## Folder Structure
- `agents/`: Core modules for collecting jobs, analyzing resumes, matching, and generating emails.
- `utils/`: Helpers like logging and configuration loading.
- `scripts/`: Executable scripts for daily jobs, demos, and scheduling.
- `jobs/`, `reports/`: Directories for saving output data (CSV/JSON/Text).
- `docs/`: Setup, troubleshooting, and beginner guides.

## Disclaimer
This tool relies entirely on public and authorized sources. It is intended for personal automation and complies with standard platform usage guidelines.
