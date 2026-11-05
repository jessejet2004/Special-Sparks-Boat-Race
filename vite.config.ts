import { defineConfig } from "vitest/config";
const previewHosts = (process.env.PREVIEW_ALLOWED_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: previewHosts,
    hmr: process.env.PREVIEW_HMR_HOST
      ? {
          host: process.env.PREVIEW_HMR_HOST,
          protocol: "wss",
          clientPort: Number(process.env.PREVIEW_HMR_PORT || 443),
        }
      : undefined,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
    allowedHosts: previewHosts,
  },
  build: {
    rollupOptions: { input: { game: "index.html", gallery: "gallery.html" } },
  },
  test: { include: ["tests/unit/**/*.test.ts"] },
});
