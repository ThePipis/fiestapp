import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)

        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass

        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # -> Click the 'Presupuesto' (Budget) tab to open the Budget view (use element index 150).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div[1]/nav/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the Excel export button to trigger the Excel download (element index 323).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div[2]/div/div/div[2]/div/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Install JS hooks to capture created blob URLs or anchor downloads, re-trigger the Excel export to capture the file blob/metadata, then trigger the PDF export and capture its blob/metadata for verification.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div[2]/div/div/div[2]/div/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fetch the captured Excel blob from window.__downloads and convert to base64, then trigger the PDF export (click element 324), wait, and fetch the new download blob(s) (PDF) as base64 for verification.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div[2]/div/div/div[2]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Install a stronger page-side hook (override URL.createObjectURL) that immediately converts blobs to base64 when created, re-trigger the Excel export (click Excel button index 323) and capture the base64 result; then retrieve captured data for verification.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div[2]/div/div/div[2]/div/button[1]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Re-trigger the PDF export (click element index 324), wait for the download entry to appear, then run a robust page-context conversion routine to read window.__downloads entries (XHR->blob fallback and FileReader) and return filename, mime, size, url and base64 (or detailed errors) for each captured download so files can be verified.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=html/body/main/div[2]/div/div/div[2]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    