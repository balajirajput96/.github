import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the path of the current script to build a robust path
        script_dir = Path(__file__).parent.resolve()
        # The project root is two levels up from jules-scratch/verification
        project_root = script_dir.parent.parent

        html_file_path = project_root / 'web-app' / 'client' / 'build' / 'index.html'

        # Go to the local HTML file
        page.goto(f'file://{html_file_path}')

        # Expect the main heading to be visible
        expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

        # Take a screenshot in the verification directory
        screenshot_path = script_dir / 'verification.png'
        page.screenshot(path=str(screenshot_path))

        browser.close()
        print(f"Screenshot saved to {screenshot_path}")

if __name__ == "__main__":
    run_verification()