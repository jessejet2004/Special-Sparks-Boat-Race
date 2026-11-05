import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
      args: ["--no-sandbox"],
    },
  },
  webServer: [
    {
      command: "npm run preview",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "node scripts/serve-static.mjs --port 4174 --mount /special-sparks/boat-race/ --mount /preview/boat-race/ --mount /Special-Sparks-Boat-Race/",
      url: "http://127.0.0.1:4174/special-sparks/boat-race/",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
