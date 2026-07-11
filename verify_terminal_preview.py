from playwright.sync_api import sync_playwright
import time

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            record_video_dir="videos/"
        )
        page = context.new_page()

        print("Navigating to http://localhost:5173")
        page.goto("http://localhost:5173", wait_until="networkidle")

        # Scroll to terminal preview
        page.evaluate("document.querySelector('div[style*=\"background: var(--bg-color); border: 1px solid var(--border-color)\"]').scrollIntoView({ behavior: 'smooth' })")

        # Wait a bit for the animation to start typing
        time.sleep(3)

        # Take a screenshot of the terminal preview part
        page.screenshot(path="terminal_preview_screenshot.png")
        print("Screenshot saved to terminal_preview_screenshot.png")

        # Wait to record some more of the typing animation in the video
        time.sleep(5)

        context.close()
        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify()
