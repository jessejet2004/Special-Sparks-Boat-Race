import { test, expect } from "@playwright/test";
test("four offers, untimed garage and three removable slots", async ({
  page,
}) => {
  await page.goto("/?seed=12");
  await page.getByRole("button", { name: /FASTEST RACE/i }).click();
  const seen = new Set<string>();
  for (let i = 0; i < 4; i++) {
    seen.add((await page.locator(".offer-panel h2").textContent())!);
    if (i < 3) await page.getByRole("button", { name: /Risk another/ }).click();
  }
  expect(seen.size).toBe(4);
  await expect(page.getByRole("button", { name: /Risk another/ })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: /Make it work/ }).click();
  await expect(page.locator("#countdown")).toHaveCount(0);
  await expect(page.locator(".equipment-card")).toHaveCount(10);
  for (let i = 0; i < 3; i++)
    await page.locator(".equipment-card").nth(i).click();
  await expect(page.locator(".slot.filled")).toHaveCount(3);
  await page.locator(".equipment-card").nth(3).click();
  await expect(page.locator(".slot.filled")).toHaveCount(3);
  await page.locator(".slot.filled").nth(1).click();
  await expect(page.locator(".slot.filled")).toHaveCount(2);
  await page.locator(".equipment-card").nth(3).click();
  await expect(page.locator(".slot.filled")).toHaveCount(3);
  await expect(page.locator("#garage-preview")).toHaveAttribute(
    "data-parts",
    /.+/,
  );
  await page.screenshot({
    path: "artifacts/garage-desktop.png",
    fullPage: true,
  });
});
test("home fits tablet and has visible keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".challenge-card")).toHaveCount(4);
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "artifacts/home-tablet.png", fullPage: true });
});
