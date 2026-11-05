import { test, expect } from "@playwright/test";

test("the actual Pages production artifact loads artwork and plays offline at its repository path", async ({
  page,
  context,
}) => {
  const base = "http://127.0.0.1:4175/Homeroom-codex-test/";
  const failures: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  page.on("pageerror", (error) => failures.push(error.message));
  await page.goto(base + "gallery.html");
  await expect(page.locator(".asset-card")).toHaveCount(155);
  await page
    .locator(".asset-card img")
    .evaluateAll((images) =>
      images.forEach(
        (image) => ((image as HTMLImageElement).loading = "eager"),
      ),
    );
  await expect
    .poll(() =>
      page
        .locator(".asset-card img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.getByRole("link", { name: /Back to the race/ }).click();
  await expect(page.locator(".offline-status")).toHaveText("Offline ready", {
    timeout: 30000,
  });
  await context.setOffline(true);
  await page.reload();
  await page
    .locator(".challenge-card")
    .filter({ hasText: "Fastest Race" })
    .click();
  await page.locator("#accept").click();
  await page.locator("#ready").click();
  await page.locator("#launch").click();
  await expect(page.locator("#race-canvas")).toBeVisible();
  expect(failures).toEqual([]);
});
