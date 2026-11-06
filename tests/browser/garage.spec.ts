import { test, expect } from "@playwright/test";
import { offers } from "../../src/game/model";
import { boatIds } from "../../src/artwork/config";
test("seven garage boats keep attached selections and empty slots when launched", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [i, boat] of boatIds.entries()) {
    let seed = 1;
    while (offers(seed + 1)[0] !== boat) seed++;
    await page.goto("/?seed=" + seed);
    await page.locator(".challenge-card").first().click();
    await page.locator("#accept").click();
    const count = i % 4,
      chosen: string[] = [];
    for (let n = 0; n < 3; n++) {
      const card = page.locator(".equipment-card").nth(n);
      chosen.push((await card.getAttribute("data-part"))!);
      await card.click();
    }
    await expect(page.locator("#garage-preview")).toHaveAttribute(
      "data-parts",
      chosen.join(","),
    );
    await expect(page.locator(".garage-preview")).toHaveScreenshot(
      `garage-${boat}.png`,
      { animations: "disabled", maxDiffPixelRatio: 0.015 },
    );
    await page
      .locator(".garage-preview")
      .screenshot({ path: `artifacts/garage-preview-${boat}.png` });
    for (let n = 2; n >= count; n--) {
      await page.locator(`.garage-slots [data-part="${chosen[n]}"]`).click();
      chosen.splice(n, 1);
    }
    if (count === 3) {
      await page.locator(".slot.filled").nth(1).click();
      chosen.splice(1, 1);
    }
    await expect(page.locator("#garage-preview")).toHaveAttribute(
      "data-parts",
      chosen.join(","),
    );
    await page.screenshot({
      path: `artifacts/garage-${boat}.png`,
      fullPage: true,
    });
    const slots = await page
      .locator(".garage-slots > *")
      .evaluateAll((els) =>
        els.map((e) => (e as HTMLElement).dataset.part ?? ""),
      );
    await page.locator("#ready").click();
    await page.locator("#launch").click();
    await expect(page.locator("#race-canvas")).toBeVisible();
    expect(
      await page
        .locator(".race-inventions > div")
        .evaluateAll((els) =>
          els.map((e) => (e as HTMLElement).dataset.equipment),
        ),
    ).toEqual(slots);
  }
  expect(errors).toEqual([]);
});
test("tablet workshop stays untimed, has no contested parts and keeps actions reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?seed=22");
  await page.locator(".challenge-card").first().click();
  await page.locator("#accept").click();
  const ids = await page
    .locator(".equipment-card")
    .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.part));
  await page.clock.fastForward(600000);
  await expect(
    page.getByRole("heading", { name: "The Boat Garage." }),
  ).toBeVisible();
  await expect(page.locator("#countdown")).toHaveCount(0);
  expect(
    await page
      .locator(".equipment-card")
      .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.part)),
  ).toEqual(ids);
  for (let i = 0; i < 3; i++)
    await page.locator(".equipment-card").nth(i).click();
  await expect(page.locator(".equipment-card:disabled")).toHaveCount(0);
  const action = await page.locator("#ready").boundingBox();
  expect(action!.y + action!.height).toBeLessThanOrEqual(1024);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/garage-tablet.png",
    fullPage: true,
  });
});
test("browsing lower shelves preserves scroll position and keyboard focus after toggling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?seed=22");
  await page.locator(".challenge-card").first().click();
  await page.locator("#accept").click();
  const last = page.locator(".equipment-card").last();
  await last.scrollIntoViewIfNeeded();
  const before = await page
    .locator(".invention-grid")
    .evaluate((e) => e.scrollTop);
  expect(before).toBeGreaterThan(0);
  await last.click();
  await expect(last).toBeFocused();
  expect(
    await page.locator(".invention-grid").evaluate((e) => e.scrollTop),
  ).toBe(before);
  await page.keyboard.press("Enter");
  await expect(last).toHaveAttribute("aria-pressed", "false");
  await expect(last).toBeFocused();
});
