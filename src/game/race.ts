import { boats, random, type Challenge, type Stats } from "./model";
import { equippedStats } from "./equipment";
import { characters, type Character, type BoatId } from "../artwork/config";
export type Racer = {
  character: Character;
  boat: BoatId;
  equipment: string[];
  stats: Stats;
  x: number;
  speed: number;
  hull: number;
  water: number;
  brake: boolean;
  braceUntil: number;
  cooldown: number;
  boostUntil: number;
  impairUntil: number;
  finishTime: number | null;
  status: "sailing" | "finished" | "rescued";
  waves: number;
  stranded: number;
  failed: string[];
};
export type RaceEvent = {
  id: number;
  time: number;
  kind:
    | "encounter"
    | "warning"
    | "damage"
    | "cosmetic"
    | "rescue"
    | "wave"
    | "equipment";
  text: string;
  racer: number;
  asset?: string;
};
export type Race = {
  challenge: Challenge;
  seed: number;
  time: number;
  tick: number;
  racers: Racer[];
  events: RaceEvent[];
  actions: { tick: number; challenge: Challenge }[];
  wave: number;
  nextWave: number;
  done: boolean;
  target: number;
  encounters: {
    at: number;
    kind: string;
    racer: number;
    warned: boolean;
    fired: boolean;
  }[];
  rng: () => number;
};
export const STEP = 0.05;
export function createRace(
  challenge: Challenge,
  seed: number,
  boatList: BoatId[],
  parts: string[][],
): Race {
  const rng = random(seed),
    types = ["fisherman", "seal", "river-monster", "potato-cannon"];
  const chosen = [types[Math.floor(rng() * 4)], types[Math.floor(rng() * 4)]];
  return {
    challenge,
    seed,
    time: 0,
    tick: 0,
    racers: characters.map((c, i) => {
      const stats = equippedStats(
        boats[boatList[i]].stats,
        parts[i],
        challenge,
      ).stats;
      return {
        character: c,
        boat: boatList[i],
        equipment: [...parts[i]],
        stats,
        x: 0,
        speed: 0,
        hull: stats.durability,
        water: 0,
        brake: false,
        braceUntil: 0,
        cooldown: 0,
        boostUntil: 0,
        impairUntil: 0,
        finishTime: null,
        status: "sailing",
        waves: 0,
        stranded: 0,
        failed: [],
      };
    }),
    events: [],
    actions: [],
    wave: 0,
    nextWave: 5,
    done: false,
    target: challenge === "slowest" ? 460 : challenge === "picnic" ? 720 : 1100,
    encounters: chosen.map((kind, i) => ({
      at: 10 + i * 15,
      kind,
      racer: Math.floor(rng() * 6),
      warned: false,
      fired: false,
    })),
    rng,
  };
}
function emit(
  r: Race,
  kind: RaceEvent["kind"],
  text: string,
  racer = 0,
  asset?: string,
) {
  r.events.push({
    id: r.events.length,
    time: r.time,
    kind,
    text,
    racer,
    asset,
  });
}
export function action(r: Race) {
  const p = r.racers[0];
  if (r.done || p.status !== "sailing") return false;
  if (r.challenge === "picnic") {
    if (p.brake) return false;
    p.brake = true;
    r.actions.push({ tick: r.tick, challenge: r.challenge });
    emit(r, "equipment", "Brakes on! Let’s see where we glide.");
    return true;
  }
  if (p.cooldown > r.time) return false;
  r.actions.push({ tick: r.tick, challenge: r.challenge });
  if (r.challenge === "fastest") {
    p.boostUntil = r.time + 1.8;
    p.cooldown = r.time + 4.5;
    emit(r, "equipment", "Lantern puts some sparkle into paddling!");
  }
  if (r.challenge === "slowest") {
    p.boostUntil = r.time + 2.5;
    p.cooldown = r.time + 4;
    emit(r, "equipment", "Gently does it. Keep that boat moving.");
  }
  if (r.challenge === "wobbly") {
    p.braceUntil = r.time + 1.4;
    p.cooldown = r.time + 2.4;
    emit(r, "equipment", "Brace ready! Best just before the wave.");
  }
  return true;
}
export function stoppingDistance(p: Racer) {
  return (p.speed * p.speed) / (2 * deceleration(p));
}
function deceleration(p: Racer) {
  return Math.max(
    1.2,
    26 / p.stats.glide + (p.equipment.includes("anchor") ? 2 : 0),
  );
}
function rescue(r: Race, p: Racer, i: number, why: string) {
  if (p.status !== "sailing") return;
  p.status = "rescued";
  p.speed = 0;
  p.finishTime = r.time;
  emit(
    r,
    "rescue",
    `${capital(p.character)} ${why}. Teddy has this under control.`,
    i,
    "encounter.teddy-tow-boat.action",
  );
}
const capital = (s: string) => s[0].toUpperCase() + s.slice(1);
function has(p: Racer, id: string) {
  return p.equipment.includes(id) && !p.failed.includes(id);
}
function damage(r: Race, p: Racer, i: number, amount: number, why: string) {
  p.hull = Math.max(0, p.hull - amount);
  emit(
    r,
    "damage",
    `${capital(p.character)}: ${why}`,
    i,
    `fallen-piece.${p.boat}`,
  );
  if (p.hull <= 0) rescue(r, p, i, "needs a tow");
}
export function stepRace(r: Race) {
  if (r.done) return;
  r.time += STEP;
  r.tick++;
  for (const event of r.encounters) {
    if (!event.warned && r.time >= event.at - 2) {
      event.warned = true;
      emit(
        r,
        "warning",
        event.kind === "fisherman"
          ? "A fishing line ahead. Someone looks displeased."
          : event.kind === "seal"
            ? "A seal has a ball. And a plan."
            : event.kind === "river-monster"
              ? "Friendly ripples… rather large friendly ripples."
              : "The potato cannon is taking aim.",
        event.racer,
      );
    }
    if (!event.fired && r.time >= event.at) {
      event.fired = true;
      const p = r.racers[event.racer];
      const assets: Record<string, string> = {
        fisherman: "encounter.disgruntled-fisherman.action",
        seal: "encounter.playful-seal.action",
        "river-monster": "encounter.friendly-river-monster.action",
        "potato-cannon": "encounter.potato-cannon.action",
      };
      emit(
        r,
        "encounter",
        event.kind === "fisherman"
          ? "The fisherman casts! A very serious complaint."
          : event.kind === "seal"
            ? "The seal gives a playful nudge."
            : event.kind === "river-monster"
              ? "A friendly splash. An enormous friendly splash."
              : "Potato incoming! The vegetable has no licence.",
        event.racer,
        assets[event.kind],
      );
      if (p.status === "sailing" && r.challenge !== "picnic") {
        p.impairUntil =
          r.time +
          Math.max(0.5, 2.8 - p.stats.handling * 0.16) -
          (has(p, "giraffe-lookout") ? 0.4 : 0);
        if (event.kind === "river-monster") {
          p.water += 8;
          damage(
            r,
            p,
            event.racer,
            Math.max(2, 12 - p.stats.stability),
            "A splash came aboard.",
          );
        }
        if (event.kind === "seal") {
          p.x += r.challenge === "slowest" ? 9 : 5;
          emit(
            r,
            "cosmetic",
            "A rubber duck escapes. Purely a duck decision.",
            event.racer,
            `fallen-piece.${p.boat}`,
          );
        }
      }
    }
  }
  if (r.challenge === "wobbly" && r.time >= r.nextWave && r.wave < 10) {
    r.wave++;
    r.nextWave += 4.5;
    emit(
      r,
      "wave",
      `Wave ${r.wave}! ${r.wave >= 7 ? "The water is getting ambitious." : "Hold on to your bright ideas."}`,
      0,
      "wobbly-waters.warning-buoy",
    );
    r.racers.forEach((p, i) => {
      if (p.status !== "sailing") return;
      const aiBrace =
        i > 0 && ((r.wave + i) % 4 !== 0 || p.character === "tilly");
      const braced = i === 0 ? p.braceUntil >= r.time : aiBrace;
      let impact = Math.max(
        1,
        8 +
          r.wave * 3.8 -
          p.stats.stability * 1.7 +
          (has(p, "party-balloons") ? r.wave * 0.7 : 0),
      );
      if (braced) impact *= 0.4;
      if (has(p, "bouncy-spring")) impact *= 0.75;
      if (has(p, "turtle-shell-shield")) impact *= 0.75;
      let water = Math.max(1, r.wave * 2 - p.stats.stability * 0.6);
      if (has(p, "super-sponge") && p.water < 25) water *= 0.35;
      if (has(p, "pelican-scoop")) water *= 0.65;
      p.water += water;
      damage(
        r,
        p,
        i,
        impact,
        "A wave shook the hull. " +
          (braced ? "Well braced!" : "A little more warning next time."),
      );
      if (r.wave === 7 && has(p, "lily-pad")) {
        p.failed.push("lily-pad");
        p.stats.stability = Math.max(1, p.stats.stability - 2);
        emit(
          r,
          "equipment",
          `${capital(p.character)}’s lily pad folded. Still a good leaf.`,
          i,
          "equipment.lily-pad",
        );
      }
      if (p.status === "sailing") p.waves = r.wave;
    });
  }
  r.racers.forEach((p, i) => {
    if (p.status !== "sailing") return;
    p.water = Math.max(
      0,
      p.water +
        (has(p, "leaky-bucket") ? 0.22 : 0) * STEP -
        (has(p, "pelican-scoop") ? 0.35 : 0) * STEP,
    );
    if (r.challenge === "wobbly") {
      if (p.water > 65)
        damage(r, p, i, STEP * 3, "Water is weighing the boat down.");
      return;
    }
    let drive = p.stats.speed;
    if (has(p, "fizzy-bottle-engine") && r.time < 6) drive += 12;
    if (has(p, "wind-up-propeller")) drive += 8 * Math.max(0, 1 - r.time / 30);
    if (has(p, "little-electric-fan") && r.time > 22) drive -= 3;
    if (has(p, "helpful-duck") && (r.time + i * 2) % 17 < 3) drive -= 5;
    if (has(p, "hamster-wheel")) drive += (r.time + i) % 9 < 4 ? 6 : -3;
    if (has(p, "patchwork-sail")) drive += Math.sin(r.time * 0.3 + i) * 3;
    if (has(p, "runaway-kite")) drive += Math.sin(r.time * 0.5 + i) * 5;
    if (has(p, "bouncy-spring")) drive += Math.sin(r.time * 2 + i) * 2;
    if (has(p, "octopus-tentacle") && r.time > 17 && r.time < 19) drive -= 7;
    if (has(p, "super-sponge")) drive -= p.water * 0.12;
    drive *= 1 - Math.min(0.35, p.water / 200);
    if (p.impairUntil > r.time) drive *= 0.65;
    if (i > 0) {
      const personality = [1, 1.04, 1.02, 0.97, 1.06, 0.96][i];
      drive *= personality * (1 + Math.sin(r.time * 0.7 + i) * 0.035);
    }
    if (r.challenge === "fastest" && p.boostUntil > r.time) drive += 12;
    if (r.challenge === "slowest") {
      drive = drive * 0.38 + 2;
      const aiBrake = i > 0 && Math.sin(r.time * 0.2 + i) > 0.05;
      if (p.boostUntil > r.time || aiBrake)
        drive = Math.max(0.25, drive * 0.36);
      if (has(p, "anchor") && has(p, "pet-rock") && p.boostUntil > r.time)
        drive = 0.1;
    }
    if (r.challenge === "picnic" && i > 0 && !p.brake) {
      const aim =
        r.target +
        Math.sin(i * 1.7 + r.seed * 0.01) * 20 +
        (p.character === "dizzy" ? 18 : 0);
      if (p.x + stoppingDistance(p) >= aim) p.brake = true;
    }
    if (r.challenge === "picnic" && p.brake) {
      p.speed = Math.max(0, p.speed - deceleration(p) * STEP);
      if (p.speed < 0.15) {
        p.speed = 0;
        p.status = "finished";
        p.finishTime = r.time;
      }
    } else
      p.speed += (Math.max(0.05, drive) - p.speed) * Math.min(1, STEP * 1.5);
    p.x += p.speed * STEP;
    if (r.challenge === "slowest") {
      p.stranded = p.speed < 0.5 ? p.stranded + STEP : 0;
      if (p.stranded >= 8) rescue(r, p, i, "stopped for too long");
    }
    if (r.challenge !== "picnic" && p.x >= r.target) {
      p.x = r.target;
      p.status = "finished";
      p.finishTime = r.time;
      emit(
        r,
        "equipment",
        `${capital(p.character)} crossed the finish line!`,
        i,
      );
    }
    if (r.challenge === "picnic" && p.x > r.target + 380)
      rescue(r, p, i, "sailed past the picnic");
  });
  if (r.tick === 121)
    r.racers.forEach((p, i) => {
      if (has(p, "fizzy-bottle-engine"))
        emit(
          r,
          "equipment",
          `${capital(p.character)}’s fizz ran flat. The spoon still believes.`,
          i,
        );
    });
  if (r.tick === 341)
    r.racers.forEach((p, i) => {
      if (has(p, "octopus-tentacle"))
        emit(
          r,
          "equipment",
          `${capital(p.character)}’s tentacle found a fascinating log.`,
          i,
        );
    });
  const limit =
    r.challenge === "slowest" ? 115 : r.challenge === "picnic" ? 75 : 80;
  if (r.time >= limit)
    r.racers.forEach((p, i) => rescue(r, p, i, "ran out of course time"));
  r.done =
    r.challenge === "wobbly"
      ? r.wave >= 10 || r.racers.every((p) => p.status !== "sailing")
      : r.racers.every((p) => p.status !== "sailing");
}
export function rank(r: Race): number[] {
  return r.racers
    .map((_, i) => i)
    .sort((a, b) => {
      const p = r.racers[a],
        q = r.racers[b];
      if (r.challenge === "wobbly")
        return (
          q.waves - p.waves || q.hull - p.hull || p.water - q.water || a - b
        );
      const legalP = p.status === "finished" ? 0 : 1,
        legalQ = q.status === "finished" ? 0 : 1;
      if (legalP !== legalQ) return legalP - legalQ;
      if (r.challenge === "picnic")
        return Math.abs(p.x - r.target) - Math.abs(q.x - r.target) || a - b;
      return (
        (r.challenge === "slowest" ? -1 : 1) *
          ((p.finishTime ?? 999) - (q.finishTime ?? 999)) || a - b
      );
    });
}
export function resultText(r: Race, p: Racer) {
  if (p.status === "rescued") return "Friendly tow · not a legal finish";
  if (r.challenge === "picnic")
    return `${Math.abs(p.x - r.target).toFixed(1)} m ${p.x < r.target ? "short" : "past"} the picnic`;
  if (r.challenge === "wobbly")
    return `${p.waves} waves · ${Math.round(p.hull)} hull left`;
  return `${p.finishTime?.toFixed(1)} seconds · ${r.challenge === "slowest" ? "unhurried" : "finished"}`;
}
export function tied(r: Race, a: number, b: number) {
  const p = r.racers[a],
    q = r.racers[b];
  if (p.status !== q.status && r.challenge !== "wobbly") return false;
  if (r.challenge === "wobbly")
    return (
      p.waves === q.waves &&
      Math.abs(p.hull - q.hull) < 0.01 &&
      Math.abs(p.water - q.water) < 0.01
    );
  if (r.challenge === "picnic")
    return Math.abs(Math.abs(p.x - r.target) - Math.abs(q.x - r.target)) < 0.01;
  return Math.abs((p.finishTime ?? -1) - (q.finishTime ?? -1)) < 0.01;
}
