import { describe, it, expect } from "vitest";
import manifest from "../../assets/manifest.json";
import {
  boatIds,
  characters,
  poseId,
  placements,
} from "../../src/artwork/config";
describe("official artwork configuration", () => {
  it("has seven boats and all 42 seating combinations", () => {
    expect(boatIds).toHaveLength(7);
    for (const boat of boatIds) {
      expect(placements[boat].rimY).toBeGreaterThan(0);
      for (const c of characters)
        expect(manifest.assets.some((a) => a.id === poseId(c, "neutral"))).toBe(
          true,
        );
    }
  });
  it("uses actual character-specific fallback poses", () => {
    for (const c of characters)
      for (const pose of [
        "neutral",
        "paddling",
        "worried",
        "surprised",
        "celebrating",
        "looking-back",
      ])
        expect(manifest.assets.some((a) => a.id === poseId(c, pose))).toBe(
          true,
        );
  });
});
