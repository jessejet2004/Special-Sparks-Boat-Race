import { equipment, type Equipment } from "./equipment";
import { random, shuffle } from "./model";
import type { Character } from "../artwork/config";
export type EquipmentSlots = [string | null, string | null, string | null];
export type Garage = {
  offers: string[];
  loadouts: EquipmentSlots[];
  seed: number;
};
const preferences: Record<Character, Equipment["role"]> = {
  lantern: "wild",
  foxy: "drive",
  ruby: "float",
  dizzy: "wild",
  nibbles: "drive",
  tilly: "brake",
};
export function createGarage(seed: number, roster: Character[]): Garage {
  if (
    roster.length !== 4 ||
    roster[0] !== "lantern" ||
    new Set(roster).size !== 4
  )
    throw Error("Garage needs Lantern and three distinct rivals.");
  const rng = random(seed ^ 0x6a12);
  const offers = shuffle(
    (["drive", "float", "brake", "wild"] as const).flatMap((role) =>
      shuffle(
        equipment.filter((e) => e.role === role),
        rng,
      )
        .slice(0, role === "drive" || role === "float" ? 3 : 2)
        .map((e) => e.id),
    ),
    rng,
  );
  const loadouts: EquipmentSlots[] = roster.map((c, i) => {
    if (i === 0) return [null, null, null];
    const preferred = shuffle(
      equipment.filter((e) => e.role === preferences[c]),
      rng,
    ).slice(0, 2);
    const other = shuffle(
      equipment.filter((e) => !preferred.includes(e)),
      rng,
    )[0];
    return [...preferred.map((e) => e.id), other.id] as EquipmentSlots;
  });
  return { offers, loadouts, seed };
}
export function togglePart(garage: Garage, id: string): boolean {
  if (!garage.offers.includes(id)) return false;
  const slots = garage.loadouts[0],
    at = slots.indexOf(id);
  if (at >= 0) {
    slots[at] = null;
    return true;
  }
  const empty = slots.indexOf(null);
  if (empty < 0) return false;
  slots[empty] = id;
  return true;
}
export const selectedParts = (garage: Garage) =>
  garage.loadouts[0].filter((id): id is string => id !== null);
/** Child-facing summaries of existing deltas; never changes simulation. */
export function effectDescription(item: Equipment): string {
  const d = item.delta,
    effects: string[] = [];
  if ((d.speed ?? 0) > 0) effects.push("Helps you go faster");
  if ((d.speed ?? 0) < 0) effects.push("Slows your boat");
  if ((d.stability ?? 0) > 0) effects.push("Adds stability");
  if ((d.stability ?? 0) < 0) effects.push("Adds a little wobble");
  if ((d.handling ?? 0) > 0) effects.push("Helps steering");
  if ((d.handling ?? 0) < 0) effects.push("Harder to steer");
  if ((d.glide ?? 0) < 0) effects.push("Helps you stop");
  if ((d.glide ?? 0) > 0) effects.push("Keeps you gliding");
  if ((d.durability ?? 0) > 0) effects.push("Helps you stay afloat");
  return (
    effects.slice(0, 3).join(" · ") || "An unusual helper — try it on the river"
  );
}
