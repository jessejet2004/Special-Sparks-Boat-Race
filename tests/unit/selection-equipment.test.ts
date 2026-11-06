import { describe, it, expect } from "vitest";
import { offers, nextOffer, boats } from "../../src/game/model";
import { equipment, equippedStats } from "../../src/game/equipment";
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
describe("equipment library", () => {
  it("has exactly the official 28 parts", () => {
    expect(equipment).toHaveLength(28);
    expect(new Set(equipment.map((e) => e.id)).size).toBe(28);
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
