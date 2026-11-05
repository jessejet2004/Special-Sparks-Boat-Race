import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testDir: "tests/pages",
  webServer: {
    command:
      "node scripts/serve-static.mjs --port 4175 --mount /Homeroom-codex-test/",
    url: "http://127.0.0.1:4175/Homeroom-codex-test/",
    reuseExistingServer: !process.env.CI,
  },
});
