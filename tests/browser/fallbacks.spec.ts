import { test, expect } from "@playwright/test";
test("missing artwork gets readable feedback instead of a blank application", async ({
  page,
}) => {
  await page.route("**/art/boat.bathtub.webp", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("[role=alert]")).toContainText(
    "Some artwork could not load",
  );
  await expect(page.locator(".challenge-card")).toHaveCount(4);
});
test("missing registry has a recovery screen", async ({ page }) => {
  await page.route("**/art/registry.json", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.locator("[role=alert]")).toContainText("reconnect");
});
