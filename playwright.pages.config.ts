import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testDir: "tests/pages",
  webServer: {
    command:
      "node scripts/serve-static.mjs --port 4175 --mount /Special-Sparks-Boat-Race/",
    url: "http://127.0.0.1:4175/Special-Sparks-Boat-Race/",
    reuseExistingServer: !process.env.CI,
  },
});
