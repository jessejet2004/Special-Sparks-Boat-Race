import { test, expect } from "@playwright/test";
test("scene stays painted across pause and controls fit a laptop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/?seed=12");
  await page.locator(".challenge-card").first().click();
  await page.locator("#accept").click();
  await page.locator("#ready").click();
  await page.locator("#launch").click();
  await expect(page.locator("#race-canvas")).toBeVisible();
  await page.locator("#pause").click();
  await page.locator("#resume").click();
  const alpha = await page
    .locator("#race-canvas")
    .evaluate(
      (c) =>
        (c as HTMLCanvasElement).getContext("2d")!.getImageData(100, 100, 1, 1)
          .data[3],
    );
  expect(alpha).toBe(255);
  const bounds = await page.locator("#race-action").boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(768);
  await page.screenshot({ path: "artifacts/race-desktop.png" });
});
