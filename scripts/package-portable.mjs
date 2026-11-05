import fs from "node:fs/promises";
import { build } from "esbuild";
await fs.mkdir("artifacts", { recursive: true });
const registry = JSON.parse(
  await fs.readFile("public/art/registry.json", "utf8"),
);
for (const e of Object.values(registry))
  e.url =
    "data:image/webp;base64," +
    (await fs.readFile("public/" + e.url)).toString("base64");
const js = await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "esm",
  target: "es2022",
  write: false,
  define: { "import.meta.env.DEV": "false" },
  minify: true,
  loader: { ".css": "empty" },
});
const css =
  (await fs.readFile("src/ui.css", "utf8")) +
  "\n" +
  (await fs.readFile("src/style.css", "utf8")).replace(/@import[^;]+;/g, "");
const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Very Serious Boat Race (Not Really)</title><style>${css}</style></head><body><div id="app"></div><script>window.__BOAT_ART__=${JSON.stringify(registry).replaceAll("<", "\\u003c")};</script><script type="module">${js.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script></body></html>`;
await fs.writeFile("artifacts/Boat-Race-Play.html", html);
console.log(
  `Self-contained playable HTML: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MiB. Open directly in a modern browser.`,
);
