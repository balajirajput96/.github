import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_dashboard(page: Page):
    """
    This test verifies that the dashboard page is rendered correctly.
    """
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:3000")

    # 2. Assert: Confirm the main heading is visible.
    heading = page.get_by_role("heading", name="Dashboard")
    expect(heading).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_dashboard(page)
        browser.close()