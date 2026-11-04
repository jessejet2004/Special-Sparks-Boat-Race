import { describe, it, expect } from "vitest";
import { offers, nextOffer, boats } from "../../src/game/model";
import {
  equipment,
  createScramble,
  claim,
  release,
  equippedStats,
} from "../../src/game/equipment";
describe("boat gamble", () => {
  it("never repeats rejected offers and forces the fourth", () => {
    for (let seed = 1; seed < 100; seed++) {
      const list = offers(seed);
      expect(new Set(list).size).toBe(4);
      expect(list).toEqual(offers(seed));
      expect(nextOffer(list, 2)).toBe(3);
      expect(() => nextOffer(list, 3)).toThrow();
    }
  });
});
describe("shared equipment", () => {
  it("has exactly the official 28 parts", () => {
    expect(equipment).toHaveLength(28);
    expect(new Set(equipment.map((e) => e.id)).size).toBe(28);
  });
  it("prevents stealing, duplicates and a fourth slot, and permits release", () => {
    const s = createScramble(1);
    for (const id of s.available.slice(0, 3))
      expect(claim(s, 0, id)).toBe(true);
    expect(claim(s, 1, s.claimed[0][0])).toBe(false);
    expect(claim(s, 0, s.available[0])).toBe(false);
    const id = s.claimed[0][0];
    release(s, id);
    expect(claim(s, 1, id)).toBe(true);
  });
  it("gives combinations and tradeoffs real consequences", () => {
    const base = boats.bathtub.stats;
    const plain = equippedStats(base, [], "fastest").stats;
    const anchor = equippedStats(base, ["anchor"], "picnic").stats;
    expect(anchor.speed).toBeLessThan(plain.speed);
    expect(anchor.glide).toBeLessThan(plain.glide);
    expect(
      equippedStats(base, ["giant-spoon", "fizzy-bottle-engine"], "fastest")
        .combos,
    ).toHaveLength(1);
    const a = equippedStats(base, ["party-balloons", "pet-rock"], "fastest");
    expect(a.stats.speed).toBe(base.speed);
    expect(a.combos).toHaveLength(1);
  });
});
