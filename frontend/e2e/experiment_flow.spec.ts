import { test, expect } from "@playwright/test";

test.describe("TuneLab End-to-End User Journey", () => {
  test("should load landing page, run demo experiment, and display decision", async ({ page }) => {
    // 1. Visit App
    await page.goto("http://localhost:3000");

    // 2. Check title banner
    await expect(page.locator("text=TuneLab")).toBeVisible();
    await expect(page.locator("text=Dataset Selection")).toBeVisible();

    // 3. Click Run Pipeline button
    const runBtn = page.locator("button:has-text('Execute Full Experiment Pipeline')");
    await expect(runBtn).toBeVisible();
    await runBtn.click();

    // 4. Verify jumping to evaluation dashboard
    await expect(page.locator("text=Baseline vs Fine-Tuned Model Benchmarking")).toBeVisible();

    // 5. Verify decision banner step
    await page.click("button:has-text('06 Decide')");
    await expect(page.locator("text=DECISION: RECOMMENDED")).toBeVisible();

    // 6. Open About / PM Portfolio modal
    await page.click("button:has-text('About / PM Portfolio Mode')");
    await expect(page.locator("text=About TuneLab — PM Portfolio Showcase")).toBeVisible();
  });
});
