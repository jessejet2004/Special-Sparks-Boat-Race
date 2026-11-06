import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
const manifest = JSON.parse(await fs.readFile("assets/manifest.json", "utf8"));
await fs.mkdir("public/art", { recursive: true });
await fs.mkdir("node_modules/.cache/boat-art", { recursive: true });
const cachePath = "node_modules/.cache/boat-art/recipes.json";
let cache = {};
try {
  cache = JSON.parse(await fs.readFile(cachePath, "utf8"));
} catch {}
const nextCache = {},
  registry = {};
async function derivative(
  a,
  bytes,
  bounds,
  filename,
  maxWidth,
  maxHeight,
  quality,
) {
  const [left, top, right, bottom] = bounds;
  const recipe = JSON.stringify({
    hash: a.sha256,
    bounds,
    maxWidth,
    maxHeight,
    quality,
    alphaQuality: 100,
    encoder: sharp.versions,
  });
  const key = crypto.createHash("sha256").update(recipe).digest("hex");
  const output = "public/art/" + filename;
  let exists = false;
  try {
    await fs.access(output);
    exists = true;
  } catch {}
  if (!exists || cache[filename] !== key)
    await sharp(bytes)
      .extract({ left, top, width: right - left, height: bottom - top })
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality, alphaQuality: 100 })
      .toFile(output);
  nextCache[filename] = key;
  const meta = await sharp(output).metadata();
  return {
    url: "art/" + filename,
    width: meta.width,
    height: meta.height,
    recipe: key,
  };
}
for (const a of manifest.assets) {
  const bytes = await fs.readFile(a.path);
  if (crypto.createHash("sha256").update(bytes).digest("hex") !== a.sha256)
    throw Error("Original changed: " + a.id);
  const bounds =
    a.id === "background.lake" ? [0, 17, 2900, 983] : a.content_bounds_px;
  const bg = a.usage === "scene-background";
  const ui = await derivative(
    a,
    bytes,
    bounds,
    a.id + ".webp",
    bg ? 1920 : 600,
    bg ? 1080 : 600,
    88,
  );
  const entry = {
    ...ui,
    name: a.name,
    usage: a.usage,
    page: a.page,
    source: a.path,
    sourceHash: a.sha256,
    bounds,
  };
  if (
    [
      "selectable-boat",
      "character-pose",
      "boat-room-selectable-equipment",
    ].includes(a.usage) ||
    a.id === "background.lake"
  ) {
    const maximum =
      a.id === "background.lake"
        ? 2900
        : a.usage === "boat-room-selectable-equipment"
          ? 900
          : 1200;
    entry.race = await derivative(
      a,
      bytes,
      bounds,
      a.id + ".race.webp",
      maximum,
      maximum,
      94,
    );
  }
  registry[a.id] = entry;
}
await fs.writeFile("public/art/registry.json", JSON.stringify(registry));
await fs.writeFile(cachePath, JSON.stringify(nextCache));
console.log(
  `Prepared ${Object.keys(registry).length} verified official assets with source-backed race-resolution variants; originals unchanged.`,
);
