import { defineConfig } from "vitest/config";
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: { input: { game: "index.html", gallery: "gallery.html" } },
  },
  test: { include: ["tests/unit/**/*.test.ts"] },
});
