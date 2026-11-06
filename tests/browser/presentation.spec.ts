import { test, expect } from "@playwright/test";
const boats = [
  "bathtub",
  "cardboard-box",
  "raft",
  "doughnut",
  "teacup",
  "welly",
  "picnic-basket",
];
test.use({ deviceScaleFactor: 2, viewport: { width: 1440, height: 1000 } });
test("all 42 race seats: neutral and paddling visual regressions with three distinct mounts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/gallery.html");
  for (const pose of ["neutral", "paddling"]) {
    await page.getByLabel("Pose", { exact: true }).selectOption(pose);
    await page.locator("#matrix").click();
    await expect(page.locator("#composition-matrix")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await expect(page.locator(".seat-review canvas")).toHaveCount(42);
    for (const boat of boats) {
      const row = page
        .locator(".seat-matrix-row")
        .filter({ has: page.locator(`canvas[data-boat="${boat}"]`) });
      await expect(row).toHaveScreenshot(`${boat}-${pose}.png`, {
        maxDiffPixelRatio: 0.015,
      });
    }
  }
  expect(errors).toEqual([]);
});
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 768, height: 1024 },
])
  test(`moving four-racer fleet at ${viewport.width}px uses device-resolution canvas`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.setViewportSize(viewport);
    await page.clock.install();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const challenge of [
      "Fastest Race",
      "Slowest Race",
      "Picnic Panic",
      "Wobbly Waters",
    ]) {
      await page.goto("/?seed=22");
      await page
        .locator(".challenge-card")
        .filter({ hasText: challenge })
        .click();
      await page.locator("#accept").click();
      for (let i = 0; i < 3; i++)
        await page.locator(".equipment-card").nth(i).click();
      await page.locator("#ready").click();
      await page.locator("#launch").click();
      const canvas = page.locator("#race-canvas");
      await expect(canvas).toBeVisible();
      const actionBounds = await page.locator("#race-action").boundingBox();
      expect(actionBounds!.y).toBeGreaterThanOrEqual(0);
      expect(actionBounds!.y + actionBounds!.height).toBeLessThanOrEqual(
        viewport.height,
      );
      if (viewport.width < 1000) {
        const riverBounds = await canvas.boundingBox();
        const panelBounds = await page.locator(".race-dashboard").boundingBox();
        expect(panelBounds!.y).toBeGreaterThanOrEqual(
          riverBounds!.y + riverBounds!.height * 0.97,
        );
      }
      for (const tick of [1000, 7000, 12000]) {
        await page.clock.runFor(tick);
        await expect(canvas).toHaveAttribute("data-racer-count", "4");
        const sizes = await canvas.evaluate((c) => {
          const x = c as HTMLCanvasElement;
          return [x.width, x.height, x.clientWidth, x.clientHeight];
        });
        expect(sizes[0]).toBe(Math.round(sizes[2] * 2));
        expect(sizes[1]).toBe(Math.round(sizes[3] * 2));
        await canvas.screenshot({
          path: `artifacts/review-${viewport.width}-${challenge.replaceAll(" ", "-")}-${tick}.png`,
        });
      }
      await expect(page.locator(".live-standings > div")).toHaveCount(4);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
