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
import { racePlacements } from "./artwork/race-config";
import { drawRaceBoat } from "./rendering/race-boat";
import { prepareCanvas } from "./rendering/canvas";
const art = new Artwork();
await art.init();
const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `<main class="shell"><header class="topbar"><a href="./">← Back to the race</a><span class="brand">ARTWORK WORKSHOP</span></header><h1>Little details. Big personalities.</h1><p>Official artwork · 155 active assets · originals preserved</p><div class="gallery-layout"><section class="panel controls"><label>Preview mode<select id="mode" aria-label="Preview mode"><option value="race">Race composition</option><option value="selection">Selection composition (unchanged)</option></select></label><label>Character<select id="character" aria-label="Character">${characters.map((c) => `<option>${c}</option>`).join("")}</select></label><label>Boat<select id="boat" aria-label="Boat">${boatIds.map((b) => `<option>${b}</option>`).join("")}</select></label><label>Pose<select id="pose" aria-label="Pose">${["neutral", "excited", "worried", "surprised", "paddling", "celebrating", "looking-back"].map((p) => `<option>${p}</option>`).join("")}</select></label><label>Equipment<select id="equipment" aria-label="Equipment"><option value="">None</option>${Object.entries(
  art.entries,
)
  .filter(([, e]) => e.usage === "boat-room-selectable-equipment")
  .map(
    ([id, e]) =>
      `<option value="${id.replace("equipment.", "")}">${e.name}</option>`,
  )
  .join(
    "",
  )}</select></label><label><input id="guides" type="checkbox"> Show face, attachment and waterline guides</label><button id="matrix">Review all 42 seats</button><label>Seat height<input id="seat" type="range" min="0.1" max="0.8" step="0.01" value="0.43"></label><label>Character scale<input id="scale" type="range" min="0.2" max="0.8" step="0.01" value="0.48"></label><button id="export">Export placement JSON</button><p class="muted">Save exported race values in src/artwork/race-config.ts; selection values in src/artwork/config.ts to keep adjustments in Git.</p><output id="errors"></output></section><div class="gallery-canvas"><canvas aria-label="Character, boat and equipment composition preview"></canvas></div></div><section id="composition-matrix" hidden></section><section class="asset-grid">${Object.entries(
  art.entries,
)
  .map(
    ([id, e]) =>
      `<article class="asset-card"><img src="${e.url}" loading="lazy" alt="${e.name}"><strong>${e.name}</strong><p>${e.page ? "Page " + e.page : "Background"}<br>${id}</p></article>`,
  )
  .join("")}</section></main>`;
for (const index of [2, 3]) {
  const original = document.querySelector<HTMLSelectElement>("#equipment")!;
  const label = document.createElement("label");
  label.textContent = "Equipment " + index;
  const select = original.cloneNode(true) as HTMLSelectElement;
  select.id = "equipment" + index;
  select.setAttribute("aria-label", "Equipment " + index);
  label.append(select);
  original.closest("label")!.after(label);
}
const value = (id: string) =>
  (document.getElementById(id) as HTMLInputElement).value;
let renderVersion = 0;
async function render() {
  const version = ++renderVersion;
  const character = value("character") as Character,
    boat = value("boat") as BoatId,
    pose = value("pose"),
    eq = [
      ...new Set(
        [value("equipment"), value("equipment2"), value("equipment3")].filter(
          Boolean,
        ),
      ),
    ];
  await art.load([
    "background.lake",
    `boat.${boat}`,
    poseId(character, pose),
    poseId(character, "neutral"),
    ...eq.map((id) => `equipment.${id}`),
  ]);
  if (value("mode") === "race")
    await art.loadRace([
      `boat.${boat}`,
      poseId(character, pose),
      poseId(character, "neutral"),
      ...eq.map((id) => "equipment." + id),
    ]);
  if (version !== renderVersion) return;
  const canvas = document.querySelector("canvas")!;
  canvas.dataset.composition = [boat, character, pose, ...eq].join("/");
  const { ctx, width: W, height: H } = prepareCanvas(canvas);
  const bg = art.image("background.lake")!;
  const scale = Math.max(W / bg.width, H / bg.height);
  ctx.drawImage(
    bg,
    (W - bg.width * scale) / 2,
    0,
    bg.width * scale,
    bg.height * scale,
  );
  const width = Math.min(430, W * 0.66),
    im = art.image("boat." + boat)!;
  const height = (width * im.height) / im.width;
  if (value("mode") === "race")
    drawRaceBoat(
      ctx,
      art,
      boat,
      character,
      (W - width) / 2,
      H * 0.8 - height * racePlacements[boat].waterline,
      width,
      pose,
      eq,
      0,
      0,
      0,
      (document.getElementById("guides") as HTMLInputElement).checked,
    );
  else
    drawBoat(
      ctx,
      art,
      boat,
      character,
      (W - width) / 2,
      H * 0.8 - height * 0.9,
      width,
      pose,
      eq,
    );
  document.getElementById("errors")!.textContent = art.errors.size
    ? `Missing: ${[...art.errors].join(", ")}`
    : "All selected artwork loaded.";
}
document.querySelectorAll("select").forEach((el) =>
  el.addEventListener("change", () => {
    const p = placements[value("boat") as BoatId];
    const r = racePlacements[value("boat") as BoatId];
    (document.getElementById("seat") as HTMLInputElement).value = String(
      value("mode") === "race" ? r.seat[1] : p.seatY,
    );
    (document.getElementById("scale") as HTMLInputElement).value = String(
      value("mode") === "race" ? r.characterHeight : p.characterWidth,
    );
    void render();
  }),
);
document
  .querySelectorAll<HTMLInputElement>('input[type="range"]')
  .forEach((el) =>
    el.addEventListener("input", () => {
      const p = placements[value("boat") as BoatId];
      if (value("mode") === "race") {
        racePlacements[value("boat") as BoatId].seat[1] = Number(value("seat"));
        racePlacements[value("boat") as BoatId].characterHeight = Number(
          value("scale"),
        );
      } else {
        p.seatY = Number(value("seat"));
        p.characterWidth = Number(value("scale"));
      }
      void render();
    }),
  );
document.getElementById("export")!.onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(
      [
        JSON.stringify(
          value("mode") === "race" ? racePlacements : placements,
          null,
          2,
        ),
      ],
      {
        type: "application/json",
      },
    ),
  );
  a.download =
    value("mode") === "race" ? "race-placements.json" : "boat-placements.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
(document.getElementById("seat") as HTMLInputElement).value = String(
  racePlacements.bathtub.seat[1],
);
(document.getElementById("scale") as HTMLInputElement).value = String(
  racePlacements.bathtub.characterHeight,
);
void render();

document.getElementById("guides")!.onchange = () => void render();
document.getElementById("matrix")!.onclick = async () => {
  const section = document.getElementById("composition-matrix")!;
  section.hidden = false;
  const selectedPose = value("pose");
  const selectedGear = [
    value("equipment"),
    value("equipment2"),
    value("equipment3"),
  ].filter(Boolean);
  const gear = selectedGear.length
    ? [...new Set(selectedGear)]
    : ["party-balloons", "giant-spoon", "super-sponge"];
  section.dataset.ready = "false";
  const ids = Object.keys(art.entries).filter(
    (id) =>
      id.startsWith("boat.") ||
      characters.some((c) => id === poseId(c, selectedPose)) ||
      gear.map((id) => "equipment." + id).includes(id),
  );
  await art.loadRace(ids);
  section.innerHTML =
    "<h2>All seven boats · all six characters</h2><p>Race composition at normal race size. Compare faces, front rims and three distinct mounts.</p>" +
    boatIds
      .map(
        (boat) =>
          `<h3>${art.entries["boat." + boat].name}</h3><div class="seat-matrix-row">${characters.map((c) => `<article class="seat-review"><canvas data-boat="${boat}" data-character="${c}" aria-label="${c} in ${boat}"></canvas><span>${c}</span></article>`).join("")}</div>`,
      )
      .join("");
  for (const canvas of section.querySelectorAll<HTMLCanvasElement>("canvas")) {
    const { ctx, width: W, height: H } = prepareCanvas(canvas);
    ctx.fillStyle = "#dceff0";
    ctx.fillRect(0, 0, W, H);
    const boat = canvas.dataset.boat as BoatId,
      c = canvas.dataset.character as Character,
      w = W * 0.64,
      im = art.raceImage("boat." + boat)!;
    drawRaceBoat(
      ctx,
      art,
      boat,
      c,
      (W - w) / 2,
      H * 0.78 - ((w * im.height) / im.width) * racePlacements[boat].waterline,
      w,
      selectedPose,
      gear,
    );
  }
  section.dataset.ready = "true";
  section.scrollIntoView({ behavior: "instant" });
};
