import "./style.css";
import { Artwork } from "./artwork/registry";
import {
  characters,
  boatIds,
  placements,
  poseId,
  type BoatId,
  type Character,
} from "./artwork/config";
import { drawBoat, drawImage } from "./rendering/composite";
const art = new Artwork();
await art.init();
const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `<main class="shell"><header class="topbar"><a href="./">← Back to the race</a><span class="brand">ARTWORK WORKSHOP</span></header><h1>Little details. Big personalities.</h1><p>Official artwork · 155 active assets · originals preserved</p><div class="gallery-layout"><section class="panel controls"><label>Character<select id="character" aria-label="Character">${characters.map((c) => `<option>${c}</option>`).join("")}</select></label><label>Boat<select id="boat" aria-label="Boat">${boatIds.map((b) => `<option>${b}</option>`).join("")}</select></label><label>Pose<select id="pose" aria-label="Pose">${["neutral", "excited", "worried", "surprised", "paddling", "celebrating", "looking-back"].map((p) => `<option>${p}</option>`).join("")}</select></label><label>Equipment<select id="equipment" aria-label="Equipment"><option value="">None</option>${Object.entries(
  art.entries,
)
  .filter(([, e]) => e.usage === "boat-room-selectable-equipment")
  .map(
    ([id, e]) =>
      `<option value="${id.replace("equipment.", "")}">${e.name}</option>`,
  )
  .join(
    "",
  )}</select></label><label>Seat height<input id="seat" type="range" min="0.1" max="0.8" step="0.01" value="0.43"></label><label>Character scale<input id="scale" type="range" min="0.2" max="0.8" step="0.01" value="0.48"></label><button id="export">Export placement JSON</button><p class="muted">Save exported values in src/artwork/config.ts to keep adjustments in Git.</p><output id="errors"></output></section><div class="gallery-canvas"><canvas aria-label="Character, boat and equipment composition preview"></canvas></div></div><section class="asset-grid">${Object.entries(
  art.entries,
)
  .map(
    ([id, e]) =>
      `<article class="asset-card"><img src="${e.url}" loading="lazy" alt="${e.name}"><strong>${e.name}</strong><p>${e.page ? "Page " + e.page : "Background"}<br>${id}</p></article>`,
  )
  .join("")}</section></main>`;
const value = (id: string) =>
  (document.getElementById(id) as HTMLInputElement).value;
async function render() {
  const character = value("character") as Character,
    boat = value("boat") as BoatId,
    pose = value("pose"),
    eq = value("equipment");
  await art.load([
    "background.lake",
    `boat.${boat}`,
    poseId(character, pose),
    poseId(character, "neutral"),
    ...(eq ? [`equipment.${eq}`] : []),
  ]);
  const canvas = document.querySelector("canvas")!;
  canvas.width = 1000;
  canvas.height = 550;
  const ctx = canvas.getContext("2d")!;
  drawImage(ctx, art, "background.lake", 0, 0, 1000, 550);
  drawBoat(ctx, art, boat, character, 300, 170, 400, pose, eq ? [eq] : []);
  document.getElementById("errors")!.textContent = art.errors.size
    ? `Missing: ${[...art.errors].join(", ")}`
    : "All selected artwork loaded.";
}
document.querySelectorAll("select").forEach((el) =>
  el.addEventListener("change", () => {
    const p = placements[value("boat") as BoatId];
    (document.getElementById("seat") as HTMLInputElement).value = String(
      p.seatY,
    );
    (document.getElementById("scale") as HTMLInputElement).value = String(
      p.characterWidth,
    );
    void render();
  }),
);
document.querySelectorAll("input").forEach((el) =>
  el.addEventListener("input", () => {
    const p = placements[value("boat") as BoatId];
    p.seatY = Number(value("seat"));
    p.characterWidth = Number(value("scale"));
    void render();
  }),
);
document.getElementById("export")!.onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(placements, null, 2)], {
      type: "application/json",
    }),
  );
  a.download = "boat-placements.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
void render();
