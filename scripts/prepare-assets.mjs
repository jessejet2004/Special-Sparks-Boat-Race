import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
const manifest = JSON.parse(await fs.readFile("assets/manifest.json", "utf8"));
await fs.mkdir("public/art", { recursive: true });
const registry = {};
// Reproducible runtime derivatives; source PNGs are never written to.
for (const a of manifest.assets) {
  const bytes = await fs.readFile(a.path);
  if (crypto.createHash("sha256").update(bytes).digest("hex") !== a.sha256)
    throw Error(`Original changed: ${a.id}`);
  const [x, y, right, bottom] =
    a.id === "background.lake" ? [0, 17, 2900, 983] : a.content_bounds_px;
  const filename = `${a.id}.webp`;
  const output = `public/art/${filename}`;
  let fresh = false;
  try {
    fresh = (await fs.stat(output)).mtimeMs >= (await fs.stat(a.path)).mtimeMs;
  } catch {}
  if (!fresh)
    await sharp(bytes)
      .extract({ left: x, top: y, width: right - x, height: bottom - y })
      .resize({
        width: a.usage === "scene-background" ? 1920 : 600,
        height: a.usage === "scene-background" ? 1080 : 600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(output);
  registry[a.id] = {
    url: `art/${filename}`,
    name: a.name,
    usage: a.usage,
    page: a.page,
    source: a.path,
    sourceHash: a.sha256,
    bounds: [x, y, right, bottom],
  };
}
await fs.writeFile("public/art/registry.json", JSON.stringify(registry));
console.log(
  `Prepared ${Object.keys(registry).length} verified official artwork derivatives.`,
);
