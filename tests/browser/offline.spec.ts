import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
test("web edition reloads and launches a survival challenge without network", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.locator(".offline-status")).toHaveText("Offline ready", {
    timeout: 45000,
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".challenge-card")).toHaveCount(4);
  await page
    .locator(".challenge-card")
    .filter({ hasText: "Wobbly Waters" })
    .click();
  await page.locator("#accept").click();
  await page.locator("#ready").click();
  await page.locator("#launch").click();
  await expect(page.locator("#race-canvas")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document
          .querySelector("canvas")!
          .getContext("2d")!
          .getImageData(300, 300, 1, 1).data[3],
    ),
  ).toBe(255);
});
test("standalone portable HTML plays with all external network requests blocked", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.setOffline(true);
  await page.route("**/standalone", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: readFileSync("artifacts/Boat-Race-Play.html", "utf8"),
    }),
  );
  await page.goto("http://127.0.0.1:4173/standalone");
  await expect(page.locator(".challenge-card")).toHaveCount(4);
  await expect(page.locator(".offline-status")).toHaveText(
    "Portable · offline ready",
  );
  await page.locator(".challenge-card").first().click();
  await page.locator("#accept").click();
  await page
    .locator(".equipment-card")
    .filter({ hasText: "Giant Spoon" })
    .click();
  await page.locator("#ready").click();
  await page.locator("#launch").click();
  await expect(page.locator("#race-canvas")).toBeVisible();
  expect(errors).toEqual([]);
});
