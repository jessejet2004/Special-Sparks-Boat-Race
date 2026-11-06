import { test, expect } from "@playwright/test";
const origin = "http://127.0.0.1:4174";
const path = "/special-sparks/boat-race/";
for (const hostedPath of [path, "/Special-Sparks-Boat-Race/"])
  test(`hosted path ${hostedPath} loads all 155 assets and a playable race`, async ({
    page,
    request,
  }) => {
    const failures: string[] = [];
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(r.url());
    });
    const registry = await (
      await request.get(origin + hostedPath + "art/registry.json")
    ).json();
    const variants = Object.values(registry).filter((e: any) => e.race) as {
      bounds: number[];
      race: { url: string; width: number; height: number };
    }[];
    expect(variants).toHaveLength(72);
    for (const e of variants) {
      expect(e.race.width).toBeLessThanOrEqual(e.bounds[2] - e.bounds[0]);
      expect(e.race.height).toBeLessThanOrEqual(e.bounds[3] - e.bounds[1]);
    }
    const variantResponses = await Promise.all(
      variants.map((e) => request.get(origin + hostedPath + e.race.url)),
    );
    expect(variantResponses.every((r) => r.ok())).toBe(true);
    await page.goto(origin + hostedPath + "gallery.html");
    await expect(page.locator(".asset-card")).toHaveCount(155);
    await page
      .locator(".asset-card img")
      .evaluateAll((imgs) =>
        imgs.forEach((i) => ((i as HTMLImageElement).loading = "eager")),
      );
    await expect
      .poll(() =>
        page
          .locator(".asset-card img")
          .evaluateAll((imgs) =>
            imgs.every(
              (i) =>
                (i as HTMLImageElement).complete &&
                (i as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await page.getByRole("link", { name: /Back to the race/ }).click();
    await expect(page).toHaveURL(origin + hostedPath);
    await page
      .locator(".challenge-card")
      .filter({ hasText: "Picnic Panic" })
      .click();
    await page.locator("#accept").click();
    await page.locator("#ready").click();
    await page.locator("#launch").click();
    await expect(page.locator("#race-canvas")).toBeVisible();
    expect(failures).toEqual([]);
  });
test("offline caches are isolated between two hosted paths", async ({
  page,
  context,
}) => {
  await page.goto(origin + path);
  await expect(page.locator(".offline-status")).toHaveText("Offline ready");
  const before = await page.evaluate(() => caches.keys());
  await page.goto(origin + "/preview/boat-race/");
  await expect(page.locator(".offline-status")).toHaveText("Offline ready");
  const after = await page.evaluate(() => caches.keys());
  expect(after.length).toBe(before.length + 1);
  for (const key of before) expect(after).toContain(key);
  await context.setOffline(true);
  await page.goto(origin + path);
  await expect(page.locator(".challenge-card")).toHaveCount(4);
  await page.goto(origin + "/preview/boat-race/");
  await expect(page.locator(".challenge-card")).toHaveCount(4);
});
test("smartboard website layout stays usable without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(origin + path);
  await expect(page.locator(".challenge-card")).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/hosted-smartboard.png",
    fullPage: true,
  });
});
