import re
import ipaddress
import urllib.parse
from typing import Dict, List, Optional
import requests
from bs4 import BeautifulSoup
from utils.logger import setup_logger

logger = setup_logger(__name__)

# SSRF and URL safety constraints
BLOCKED_HOSTNAMES = {"localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal"}

def is_safe_url(url: str) -> bool:
    """Validates that a URL is HTTP/HTTPS and not targeting private/internal network addresses."""
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = parsed.hostname or ""
        if not hostname or hostname in BLOCKED_HOSTNAMES:
            return False
        try:
            ip = ipaddress.ip_address(hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return False
        except ValueError:
            # Hostname is a domain name, not a raw IP
            pass
        return True
    except Exception:
        return False

class CareerPageScanner:
    """Scans and extracts job postings from authorized company career pages."""

    def __init__(self, session: Optional[requests.Session] = None, timeout: int = 10):
        self.session = session or requests.Session()
        self.timeout = timeout
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        })

    def scan_url(self, company_name: str, url: str, target_keywords: Optional[List[str]] = None) -> List[Dict]:
        """Scans a career page URL safely and extracts matching job postings."""
        if not is_safe_url(url):
            logger.warning(f"Refusing to scan unsafe or internal URL: {url}")
            return []

        keywords = [kw.upper() for kw in (target_keywords or ["QA", "IPQA", "QUALITY", "OFFICER", "EXECUTIVE", "OSD", "GMP"])]
        logger.info(f"Scanning career page for {company_name}: {url}")

        try:
            resp = self.session.get(url, timeout=self.timeout)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            return self._parse_html(soup, company_name, url, keywords)
        except Exception as e:
            logger.error(f"Failed to scan {url} for {company_name}: {e}")
            return []

    def _parse_html(self, soup: BeautifulSoup, company_name: str, base_url: str, keywords: List[str]) -> List[Dict]:
        """Parses job listings from HTML text structure."""
        found_jobs = []
        # Look for headers and list items containing job titles
        elements = soup.find_all(["h1", "h2", "h3", "h4", "li", "div", "a"])
        seen_titles = set()

        for el in elements:
            text = el.get_text(strip=True)
            if not text or len(text) < 5 or len(text) > 200:
                continue

            text_upper = text.upper()
            if any(kw in text_upper for kw in keywords):
                if text_upper in seen_titles:
                    continue
                seen_titles.add(text_upper)

                job_link = base_url
                if el.name == "a" and el.get("href"):
                    job_link = urllib.parse.urljoin(base_url, el["href"])
                elif el.find("a") and el.find("a").get("href"):
                    job_link = urllib.parse.urljoin(base_url, el.find("a")["href"])

                parent_text = el.parent.get_text(strip=True) if el.parent else text

                found_jobs.append({
                    "title": text,
                    "company": company_name,
                    "url": job_link,
                    "description": parent_text[:500],
                    "matched_keywords": [kw for kw in keywords if kw in text_upper]
                })

        logger.info(f"Extracted {len(found_jobs)} matching job listings from {company_name}")
        return found_jobs
