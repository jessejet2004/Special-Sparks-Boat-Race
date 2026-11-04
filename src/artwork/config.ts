export const characters = [
  "lantern",
  "foxy",
  "ruby",
  "dizzy",
  "nibbles",
  "tilly",
] as const;
export type Character = (typeof characters)[number];
export const characterNames = [
  "Lantern",
  "Foxy",
  "Ruby",
  "Dizzy",
  "Nibbles",
  "Tilly",
];
export const boatIds = [
  "bathtub",
  "cardboard-box",
  "raft",
  "doughnut",
  "teacup",
  "welly",
  "picnic-basket",
] as const;
export type BoatId = (typeof boatIds)[number];
export type BoatPlacement = {
  seatX: number;
  seatY: number;
  characterWidth: number;
  rimY: number;
  waterline: number;
  mounts: [number, number, number][];
};
// Normalised to the trimmed boat artwork; rim is redrawn over the character.
export const placements: Record<BoatId, BoatPlacement> = {
  bathtub: {
    seatX: 0.48,
    seatY: 0.43,
    characterWidth: 0.48,
    rimY: 0.48,
    waterline: 0.88,
    mounts: [
      [0.18, 0.6, -0.25],
      [0.78, 0.58, 0.2],
      [0.58, 0.13, 0],
    ],
  },
  "cardboard-box": {
    seatX: 0.48,
    seatY: 0.45,
    characterWidth: 0.48,
    rimY: 0.49,
    waterline: 0.9,
    mounts: [
      [0.18, 0.62, -0.2],
      [0.8, 0.6, 0.2],
      [0.62, 0.12, 0],
    ],
  },
  raft: {
    seatX: 0.47,
    seatY: 0.48,
    characterWidth: 0.47,
    rimY: 0.57,
    waterline: 0.9,
    mounts: [
      [0.12, 0.7, -0.3],
      [0.83, 0.67, 0.2],
      [0.55, 0.12, 0],
    ],
  },
  doughnut: {
    seatX: 0.48,
    seatY: 0.47,
    characterWidth: 0.44,
    rimY: 0.56,
    waterline: 0.91,
    mounts: [
      [0.16, 0.65, -0.25],
      [0.83, 0.64, 0.2],
      [0.54, 0.1, 0],
    ],
  },
  teacup: {
    seatX: 0.44,
    seatY: 0.43,
    characterWidth: 0.43,
    rimY: 0.48,
    waterline: 0.9,
    mounts: [
      [0.12, 0.62, -0.2],
      [0.83, 0.65, 0.2],
      [0.56, 0.1, 0],
    ],
  },
  welly: {
    seatX: 0.59,
    seatY: 0.34,
    characterWidth: 0.4,
    rimY: 0.39,
    waterline: 0.9,
    mounts: [
      [0.16, 0.7, -0.2],
      [0.84, 0.65, 0.25],
      [0.54, 0.05, 0],
    ],
  },
  "picnic-basket": {
    seatX: 0.49,
    seatY: 0.47,
    characterWidth: 0.45,
    rimY: 0.55,
    waterline: 0.91,
    mounts: [
      [0.12, 0.7, -0.2],
      [0.82, 0.7, 0.2],
      [0.5, 0.12, 0],
    ],
  },
};
export function poseId(character: Character, pose: string) {
  if (pose === "surprised" && character !== "lantern")
    pose = character === "dizzy" ? "worried" : "looking-back";
  if (pose === "looking-back" && character === "dizzy") pose = "singing";
  if (pose === "looking-back" && character === "lantern") pose = "surprised";
  return `character.${character}.${pose}`;
}
