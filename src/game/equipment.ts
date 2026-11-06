import { RACER_COUNT } from "./roster";
import type { Stats, Challenge } from "./model";
export type Equipment = {
  id: string;
  name: string;
  hint: string;
  delta: Partial<Stats>;
  role: "drive" | "float" | "wild" | "brake";
};
const e = (
  id: string,
  name: string,
  hint: string,
  delta: Partial<Stats>,
  role: Equipment["role"],
): Equipment => ({ id, name, hint, delta, role });
export const equipment: Equipment[] = [
  e(
    "helpful-duck",
    "Helpful Duck",
    "A steady helper. Easily distracted by fish.",
    { speed: 5, handling: 1 },
    "drive",
  ),
  e(
    "proper-ish-paddle",
    "Proper-ish Paddle",
    "Reliable rowing. Your arms may disagree.",
    { speed: 4, handling: 2 },
    "drive",
  ),
  e(
    "whisk-o-matic",
    "Whisk-o-matic",
    "Whips up speed. And a little wobble.",
    { speed: 7, stability: -1 },
    "drive",
  ),
  e(
    "fizzy-bottle-engine",
    "Fizzy Bottle Engine",
    "A fizzy opening burst. Then it runs flat.",
    { speed: 2 },
    "drive",
  ),
  e(
    "wind-up-propeller",
    "Wind-Up Propeller",
    "Quick early on. Gradually winds down.",
    { speed: 3, handling: -1 },
    "drive",
  ),
  e(
    "frog-leg-flippers",
    "Frog-Leg Flippers",
    "Good kicks, with splashy side effects.",
    { speed: 5, stability: -1, handling: 1 },
    "drive",
  ),
  e(
    "beaver-tail",
    "Beaver Tail",
    "Paddling power and sensible turns. Adds drag.",
    { speed: 2, handling: 3, glide: -1 },
    "drive",
  ),
  e(
    "pool-noodle",
    "Pool Noodle",
    "Stays floaty. Not very streamlined.",
    { speed: -2, stability: 3, durability: 8 },
    "float",
  ),
  e(
    "baby-arm-floaties",
    "Baby Arm Floaties",
    "Extra buoyancy. Tiny armholes.",
    { speed: -2, stability: 2, durability: 12 },
    "float",
  ),
  e(
    "bottle-outriggers",
    "Bottle Outriggers",
    "Very steady. Also rather wide.",
    { speed: -3, stability: 4, handling: -1 },
    "float",
  ),
  e(
    "super-sponge",
    "Super Sponge",
    "Soaks up trouble. Gets heavy when wet.",
    { stability: 2, durability: 14 },
    "float",
  ),
  e(
    "turtle-shell-shield",
    "Turtle-Shell Shield",
    "Tough protection. Quite a weight.",
    { speed: -3, durability: 28, stability: 1 },
    "float",
  ),
  e(
    "leaky-bucket",
    "Leaky Bucket",
    "Useful ballast. Unfortunately, it leaks in.",
    { speed: -2, stability: 1, glide: -2 },
    "float",
  ),
  e(
    "bouncy-spring",
    "Bouncy Spring",
    "Softens impacts. Introduces extra boing.",
    { durability: 15, stability: -1, glide: 1 },
    "float",
  ),
  e(
    "little-electric-fan",
    "Little Electric Fan",
    "A little push, until the battery tires.",
    { speed: 3 },
    "wild",
  ),
  e(
    "patchwork-sail",
    "Patchwork Sail",
    "Catches the breeze. Not always your breeze.",
    { speed: 5, stability: -1, glide: 2 },
    "wild",
  ),
  e(
    "party-balloons",
    "Party Balloons",
    "Less weight. More wind trouble.",
    { speed: 5, stability: -2, glide: 2 },
    "wild",
  ),
  e(
    "upside-down-umbrella",
    "Upside-Down Umbrella",
    "Catches air and spray. Slow but floaty.",
    { speed: -3, stability: 2, glide: -2 },
    "wild",
  ),
  e(
    "runaway-kite",
    "Runaway Kite",
    "A powerful tug. Questionable directions.",
    { speed: 7, handling: -3, stability: -1 },
    "wild",
  ),
  e(
    "hamster-wheel",
    "Hamster Wheel",
    "Enthusiastic bursts. Snack breaks included.",
    { speed: 5, glide: 1 },
    "wild",
  ),
  e(
    "giraffe-lookout",
    "Giraffe Lookout",
    "Spots trouble earlier. A tall order in wind.",
    { handling: 3, stability: -1 },
    "wild",
  ),
  e(
    "giant-spoon",
    "Giant Spoon",
    "Steer or stir. A surprisingly good paddle.",
    { speed: 1, handling: 3, glide: -1 },
    "brake",
  ),
  e(
    "pet-rock",
    "Pet Rock",
    "Good at sitting still. Very committed.",
    { speed: -5, stability: 3, glide: -3 },
    "brake",
  ),
  e(
    "anchor",
    "Anchor",
    "Excellent brakes. Drag comes as standard.",
    { speed: -6, handling: 2, glide: -4 },
    "brake",
  ),
  e(
    "slippery-soap",
    "Slippery Soap",
    "Lovely glide. Braking gets slippery.",
    { speed: 3, glide: 4, handling: -2 },
    "brake",
  ),
  e(
    "lily-pad",
    "Lily Pad",
    "A gentle float. May fold in a big wave.",
    { speed: -1, stability: 2, durability: 5 },
    "brake",
  ),
  e(
    "pelican-scoop",
    "Pelican Scoop",
    "Scoops out water. Catches the occasional snack.",
    { speed: -1, stability: 1, handling: 1 },
    "brake",
  ),
  e(
    "octopus-tentacle",
    "Octopus Tentacle",
    "Excellent steering. Occasionally grabs a log.",
    { handling: 4, glide: -1 },
    "brake",
  ),
];
export const equipmentById = Object.fromEntries(
  equipment.map((e) => [e.id, e]),
);
export function equippedStats(
  base: Stats,
  ids: string[],
  challenge: Challenge,
): { stats: Stats; combos: string[] } {
  const stats = { ...base },
    combos: string[] = [];
  const has = (s: string) => ids.includes(s);
  for (const id of ids) {
    const item = equipmentById[id];
    if (!item) throw Error(`Unknown equipment ${id}`);
    for (const [k, v] of Object.entries(item.delta))
      stats[k as keyof Stats] += v;
  }
  if (has("party-balloons") && has("pet-rock")) {
    stats.speed += 0;
    stats.stability += 1;
    stats.glide += 1;
    combos.push("Balloons met pet rock. Lift and weight mostly cancelled out.");
  }
  if (has("giant-spoon") && has("fizzy-bottle-engine")) {
    stats.speed += 6;
    combos.push("Spoon + fizz: an unexpectedly serious engine.");
  }
  if (has("patchwork-sail") && has("little-electric-fan")) {
    stats.speed += 4;
    stats.handling += 1;
    combos.push("Fan aimed at sail. The committee is investigating.");
  }
  if (has("anchor") && has("slippery-soap")) {
    stats.glide += 2;
    combos.push("Anchor says stop. Soap has other ideas.");
  }
  if (challenge === "wobbly" && has("upside-down-umbrella"))
    stats.durability += 8;
  stats.speed = Math.max(8, stats.speed);
  stats.stability = Math.max(1, stats.stability);
  stats.handling = Math.max(1, stats.handling);
  stats.glide = Math.max(1, stats.glide);
  return { stats, combos };
}
export type Scramble = {
  available: string[];
  claimed: string[][];
  elapsed: number;
  nextClaim: number;
  seed: number;
};
export function createScramble(seed: number): Scramble {
  return {
    available: equipment.map((e) => e.id),
    claimed: Array.from({ length: RACER_COUNT }, () => []),
    elapsed: 0,
    nextClaim: 2.4,
    seed,
  };
}
export function claim(s: Scramble, racer: number, id: string) {
  if (s.claimed[racer].length >= 3 || !s.available.includes(id)) return false;
  s.available.splice(s.available.indexOf(id), 1);
  s.claimed[racer].push(id);
  return true;
}
export function release(s: Scramble, id: string) {
  const i = s.claimed[0].indexOf(id);
  if (i < 0) return;
  s.claimed[0].splice(i, 1);
  s.available.push(id);
}
