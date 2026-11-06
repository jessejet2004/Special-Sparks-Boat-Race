import type { BoatId, Character } from "./config";
export type Point = [number, number];
export type Rect = { x: number; y: number; width: number; height: number };
export type Mount = { at: Point; root: Point; angle: number };
export type RacePlacement = {
  seat: Point;
  characterHeight: number;
  waterline: number;
  foreground: Point[];
  mounts: Record<string, Mount>;
};
const m = (x: number, y: number, rx = x, ry = y, angle = 0): Mount => ({
  at: [x, y],
  root: [rx, ry],
  angle,
});
function mounts(left: number, right: number, water: number, high: number) {
  return {
    port: m(left, water - 0.12, left + 0.06, water - 0.12, -0.14),
    starboard: m(right, water - 0.12, right - 0.06, water - 0.12, 0.14),
    stern: m(left + 0.06, water + 0.01, left + 0.12, water - 0.12, -0.18),
    bow: m(right - 0.08, water + 0.01, right - 0.12, water - 0.12, 0.18),
    highPort: m(left, high, left + 0.1, water - 0.3),
    highStarboard: m(right, high, right - 0.12, water - 0.3),
    trailing: m(0.5, water + 0.07, 0.48, water - 0.07),
    outerPort: m(-0.12, high, left + 0.06, water - 0.18),
    outerStarboard: m(1.12, high, right - 0.06, water - 0.18),
  };
}
/** Trimmed-art coordinates. Polygons redraw ONLY the front hull, not masts/sails. */
export const racePlacements: Record<BoatId, RacePlacement> = {
  bathtub: {
    seat: [0.43, 0.47],
    characterHeight: 0.49,
    waterline: 0.89,
    foreground: [
      [0.07, 0.46],
      [0.24, 0.5],
      [0.55, 0.51],
      [0.88, 0.44],
      [0.94, 1],
      [0.03, 1],
    ],
    mounts: mounts(0.05, 0.94, 0.88, 0.43),
  },
  "cardboard-box": {
    seat: [0.63, 0.6],
    characterHeight: 0.49,
    waterline: 0.93,
    foreground: [
      [0.13, 0.55],
      [0.31, 0.62],
      [0.84, 0.56],
      [0.89, 1],
      [0.12, 1],
    ],
    mounts: mounts(0.05, 0.95, 0.91, 0.43),
  },
  raft: {
    seat: [0.7, 0.7],
    characterHeight: 0.45,
    waterline: 0.94,
    foreground: [
      [0.08, 0.7],
      [0.36, 0.8],
      [0.87, 0.69],
      [0.97, 1],
      [0.03, 1],
    ],
    mounts: mounts(0.04, 0.96, 0.93, 0.52),
  },
  doughnut: {
    seat: [0.68, 0.65],
    characterHeight: 0.46,
    waterline: 0.94,
    foreground: [
      [0.04, 0.62],
      [0.28, 0.72],
      [0.61, 0.73],
      [0.91, 0.6],
      [0.98, 1],
      [0.02, 1],
    ],
    mounts: mounts(0.04, 0.96, 0.94, 0.48),
  },
  teacup: {
    seat: [0.59, 0.53],
    characterHeight: 0.45,
    waterline: 0.94,
    foreground: [
      [0.07, 0.5],
      [0.26, 0.56],
      [0.55, 0.57],
      [0.78, 0.51],
      [0.8, 1],
      [0.04, 1],
    ],
    mounts: mounts(0.04, 0.96, 0.93, 0.4),
  },
  welly: {
    seat: [0.61, 0.47],
    characterHeight: 0.38,
    waterline: 0.94,
    foreground: [
      [0.39, 0.45],
      [0.53, 0.5],
      [0.73, 0.46],
      [0.8, 1],
      [0.04, 1],
      [0.04, 0.7],
      [0.38, 0.67],
    ],
    mounts: mounts(0.04, 0.96, 0.94, 0.44),
  },
  "picnic-basket": {
    seat: [0.34, 0.63],
    characterHeight: 0.45,
    waterline: 0.94,
    foreground: [
      [0.05, 0.59],
      [0.27, 0.66],
      [0.68, 0.65],
      [0.9, 0.58],
      [0.94, 1],
      [0.04, 1],
    ],
    mounts: mounts(0.04, 0.96, 0.93, 0.46),
  },
};
type PoseAlignment = { hand: number; headX: number; scale?: number };
const neutral: Record<Character, PoseAlignment> = {
  lantern: { hand: 0.87, headX: 0.51 },
  foxy: { hand: 0.87, headX: 0.53 },
  ruby: { hand: 0.88, headX: 0.5 },
  dizzy: { hand: 0.87, headX: 0.57 },
  nibbles: { hand: 0.89, headX: 0.57 },
  tilly: { hand: 0.87, headX: 0.52 },
};
export function seatedPose(character: Character, pose: string): PoseAlignment {
  const base = neutral[character];
  const paddling: Record<Character, PoseAlignment> = {
    lantern: { hand: 0.85, headX: 0.43 },
    foxy: { hand: 0.8, headX: 0.49 },
    ruby: { hand: 0.84, headX: 0.49 },
    dizzy: { hand: 0.86, headX: 0.5 },
    nibbles: { hand: 0.85, headX: 0.53 },
    tilly: { hand: 0.79, headX: 0.5 },
  };
  if (pose === "paddling") return paddling[character];
  if (pose === "celebrating" || pose === "excited")
    return { ...base, hand: 0.86, scale: 1.02 };
  if (pose === "looking-back" || pose === "surprised")
    return {
      ...base,
      headX: character === "lantern" ? 0.49 : base.headX,
      hand: 0.86,
    };
  return base;
}
export function characterGeometry(
  boat: BoatId,
  character: Character,
  pose: string,
  width: number,
  boatAspect: number,
  personAspect: number,
) {
  const p = racePlacements[boat],
    a = seatedPose(character, pose),
    height = width * boatAspect;
  const h = height * p.characterHeight * (a.scale ?? 1),
    w = h / personAspect;
  const x = width * p.seat[0] - w * a.headX,
    y = height * p.seat[1] - h * a.hand;
  return {
    width,
    height,
    person: { x, y, width: w, height: h },
    hand: a.hand,
    face: { x: x + w * 0.18, y, width: w * 0.66, height: h * 0.74 },
    waterline: height * p.waterline,
  };
}
export type EquipmentKind = "overhead" | "drive" | "float" | "water" | "deck";
export const equipmentPresentation: Record<string, EquipmentKind> = {
  "helpful-duck": "drive",
  "proper-ish-paddle": "water",
  "whisk-o-matic": "drive",
  "fizzy-bottle-engine": "drive",
  "wind-up-propeller": "drive",
  "frog-leg-flippers": "water",
  "beaver-tail": "water",
  "pool-noodle": "float",
  "baby-arm-floaties": "float",
  "bottle-outriggers": "float",
  "super-sponge": "deck",
  "turtle-shell-shield": "float",
  "leaky-bucket": "deck",
  "bouncy-spring": "deck",
  "little-electric-fan": "deck",
  "patchwork-sail": "overhead",
  "party-balloons": "overhead",
  "upside-down-umbrella": "float",
  "runaway-kite": "overhead",
  "hamster-wheel": "deck",
  "giraffe-lookout": "overhead",
  "giant-spoon": "water",
  "pet-rock": "deck",
  anchor: "water",
  "slippery-soap": "float",
  "lily-pad": "float",
  "pelican-scoop": "water",
  "octopus-tentacle": "water",
};
export function overlaps(a: Rect, b: Rect, gap = 0) {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}
export type Attachment = {
  id: string;
  slot: string;
  point: Point;
  root: Point;
  angle: number;
  width: number;
  height: number;
  pivot: Point;
  bounds: Rect;
  layer: "rear" | "front";
};
export function equipmentAttachments(
  boat: BoatId,
  geometry: ReturnType<typeof characterGeometry>,
  ids: string[],
  aspects: Record<string, number>,
): Attachment[] {
  const p = racePlacements[boat],
    used = new Set<string>(),
    placed: Attachment[] = [];
  const preferences: Record<EquipmentKind, string[]> = {
    overhead: [
      "highPort",
      "highStarboard",
      "outerPort",
      "outerStarboard",
      "stern",
      "bow",
      "port",
      "starboard",
      "trailing",
    ],
    water: [
      "port",
      "starboard",
      "bow",
      "stern",
      "trailing",
      "highPort",
      "highStarboard",
    ],
    drive: [
      "starboard",
      "port",
      "stern",
      "bow",
      "trailing",
      "highStarboard",
      "highPort",
    ],
    float: [
      "port",
      "starboard",
      "bow",
      "stern",
      "trailing",
      "highPort",
      "highStarboard",
    ],
    deck: [
      "starboard",
      "port",
      "bow",
      "stern",
      "trailing",
      "highStarboard",
      "highPort",
    ],
  };
  // A fixed envelope covering every seated reaction pose keeps mounts from
  // hopping between slots when a character changes expression or paddles.
  const keepout: Rect = {
    x: p.seat[0] * geometry.width - p.characterHeight * geometry.height * 0.75,
    y: p.seat[1] * geometry.height - p.characterHeight * geometry.height * 0.92,
    width: p.characterHeight * geometry.height * 1.5,
    height: p.characterHeight * geometry.height * 0.9,
  };
  for (const id of ids.slice(0, 3)) {
    const kind = equipmentPresentation[id] ?? "deck";
    let chosen: Attachment | undefined;
    for (const size of [1, 0.86, 0.73]) {
      for (const slot of [
        ...preferences[kind],
        "outerPort",
        "outerStarboard",
      ]) {
        if (used.has(slot)) continue;
        const mount = p.mounts[slot],
          point: Point = [
            mount.at[0] * geometry.width,
            mount.at[1] * geometry.height,
          ],
          root: Point = [
            mount.root[0] * geometry.width,
            mount.root[1] * geometry.height,
          ];
        const width =
            geometry.width *
            (kind === "overhead" ? 0.23 : kind === "water" ? 0.21 : 0.2) *
            size,
          height = width * (aspects[id] ?? 1),
          pivot: Point = [
            0.5,
            kind === "overhead" ? 1 : kind === "water" ? 0.1 : 0.35,
          ];
        const angle = kind === "overhead" ? 0 : mount.angle;
        const corners = [
          [0, 0],
          [width, 0],
          [width, height],
          [0, height],
        ].map(([x, y]) => {
          x -= width * pivot[0];
          y -= height * pivot[1];
          return [
            point[0] + x * Math.cos(angle) - y * Math.sin(angle),
            point[1] + x * Math.sin(angle) + y * Math.cos(angle),
          ];
        });
        const xs = corners.map((c) => c[0]),
          ys = corners.map((c) => c[1]);
        const bounds = {
          x: Math.min(...xs),
          y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        };
        if (
          overlaps(bounds, keepout, geometry.width * 0.025) ||
          placed.some((a) => overlaps(bounds, a.bounds, geometry.width * 0.015))
        )
          continue;
        chosen = {
          id,
          slot,
          point,
          root,
          angle,
          width,
          height,
          pivot,
          bounds,
          layer:
            kind === "overhead" &&
            (slot.startsWith("high") || slot.startsWith("outer"))
              ? "rear"
              : "front",
        };
        break;
      }
      if (chosen) break;
    }
    if (!chosen) throw Error(`No clear attachment for ${boat}/${id}`);
    used.add(chosen.slot);
    placed.push(chosen);
  }
  return placed;
}
