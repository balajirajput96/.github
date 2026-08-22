from playwright.sync_api import Page, expect, sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            # Ensure the verification directory exists
            os.makedirs("jules-scratch/verification", exist_ok=True)

            page.goto("http://localhost:3001")
            expect(page.get_by_text("AI Automation Hub Dashboard")).to_be_visible()
            page.screenshot(path="jules-scratch/verification/home_page.png")
            print("Screenshot taken successfully")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()