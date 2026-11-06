import { it, expect } from "vitest";
import { createGarage, togglePart, selectedParts } from "../../src/game/garage";
import { equipment } from "../../src/game/equipment";
import { selectRaceRoster } from "../../src/game/roster";
import { createRace } from "../../src/game/race";
it("offers ten unique mixed inventions with every part eligible across sessions", () => {
  const seen = new Set<string>();
  for (let seed = 0; seed < 150; seed++) {
    const g = createGarage(seed, selectRaceRoster(seed));
    expect(g).toEqual(createGarage(seed, selectRaceRoster(seed)));
    expect(g.offers).toHaveLength(10);
    expect(new Set(g.offers).size).toBe(10);
    const roles = g.offers.map(
      (id) => equipment.find((e) => e.id === id)!.role,
    );
    for (const role of ["drive", "float", "brake", "wild"])
      expect(roles.filter((r) => r === role).length).toBe(
        role === "drive" || role === "float" ? 3 : 2,
      );
    g.offers.forEach((id) => seen.add(id));
    expect(g.loadouts).toHaveLength(4);
    for (const slots of g.loadouts.slice(1)) {
      expect(new Set(slots).size).toBe(3);
      expect(slots.every((id) => equipment.some((e) => e.id === id))).toBe(
        true,
      );
    }
  }
  expect(seen.size).toBe(28);
});
it("allows free removal/replacement without moving other slots or taking rival parts", () => {
  const g = createGarage(4, selectRaceRoster(4)),
    rivals = JSON.stringify(g.loadouts.slice(1));
  const [a, b, c, d] = g.offers;
  for (const id of [a, b, c]) expect(togglePart(g, id)).toBe(true);
  expect(togglePart(g, d)).toBe(false);
  expect(togglePart(g, "missing")).toBe(false);
  expect(togglePart(g, b)).toBe(true);
  expect(g.loadouts[0]).toEqual([a, null, c]);
  expect(togglePart(g, d)).toBe(true);
  expect(g.loadouts[0]).toEqual([a, d, c]);
  expect(g.offers).toHaveLength(10);
  expect(JSON.stringify(g.loadouts.slice(1))).toBe(rivals);
});
it("carries zero to three selections and exact slot positions into the race", () => {
  for (let variant = 0; variant <= 4; variant++) {
    const count = Math.min(3, variant);
    const roster = selectRaceRoster(12),
      g = createGarage(12, roster);
    g.offers.slice(0, count).forEach((id) => togglePart(g, id));
    if (variant === 4) togglePart(g, g.offers[1]);
    const r = createRace(
      "fastest",
      12,
      ["bathtub", "raft", "welly", "teacup"],
      g.loadouts.map((s) => s.filter((id): id is string => id !== null)),
      roster,
      g.loadouts,
    );
    expect(r.racers[0].equipment).toEqual(selectedParts(g));
    expect(r.racers[0].equipmentSlots).toEqual(g.loadouts[0]);
  }
  expect(equipment.every((e) => e.behavior.mode === "passive")).toBe(true);
});
