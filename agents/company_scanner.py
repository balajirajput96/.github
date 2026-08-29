import csv
import json
import os
from typing import Dict, List, Optional
from utils.logger import setup_logger

logger = setup_logger(__name__)

class CompanyScanner:
    """Discovers and normalizes pharma companies, locations, and HR contact points."""

    def __init__(self):
        self.companies: List[Dict] = []

    def load_from_csv(self, file_path: str) -> List[Dict]:
        """Loads company directories from a CSV file."""
        if not os.path.exists(file_path):
            logger.warning(f"Company CSV file not found: {file_path}")
            return []

        loaded = []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    cleaned_row = {k.strip(): (v or "").strip() for k, v in row.items() if k}
                    if cleaned_row.get("company") or cleaned_row.get("name") or cleaned_row.get("Company"):
                        comp_name = cleaned_row.get("company") or cleaned_row.get("name") or cleaned_row.get("Company")
                        loaded.append({
                            "company": comp_name,
                            "location": cleaned_row.get("location") or cleaned_row.get("Location") or "Gujarat, India",
                            "email": cleaned_row.get("email") or cleaned_row.get("Email") or "",
                            "career_url": cleaned_row.get("career_url") or cleaned_row.get("url") or "",
                            "dosage_forms": cleaned_row.get("dosage_forms") or "OSD, Tablets, Capsules",
                            "priority": cleaned_row.get("priority") or "Medium"
                        })
            self.companies.extend(loaded)
            logger.info(f"Loaded {len(loaded)} companies from {file_path}")
        except Exception as e:
            logger.error(f"Error loading company CSV {file_path}: {e}")

        return loaded

    def filter_by_location(self, location_keyword: str) -> List[Dict]:
        """Filters companies by target location (e.g. Vadodara, Ahmedabad, Gujarat)."""
        kw = location_keyword.lower()
        filtered = [c for c in self.companies if kw in c.get("location", "").lower()]
        logger.info(f"Filtered {len(filtered)} companies matching location '{location_keyword}'")
        return filtered

    def get_companies_with_email(self) -> List[Dict]:
        """Returns only companies with a contact email configured."""
        return [c for c in self.companies if "@" in c.get("email", "")]

    def save_to_json(self, output_path: str) -> None:
        """Saves current company inventory to JSON."""
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(self.companies, f, indent=2)
        logger.info(f"Saved {len(self.companies)} companies to {output_path}")
