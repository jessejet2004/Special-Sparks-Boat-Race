import { it, expect } from "vitest";
import { cameraPlan } from "../../src/rendering/camera";
import type { Challenge } from "../../src/game/model";
it("keeps every course finish off-screen initially, then reveals it without zoom", () => {
  for (const width of [390, 768, 1366, 1920])
    for (const [challenge, target] of [
      ["fastest", 1100],
      ["slowest", 460],
      ["picnic", 720],
    ] as [Challenge, number][]) {
      const start = cameraPlan(challenge, target, 0, width);
      expect(target * start.scale + 70).toBeGreaterThan(width);
      const end = cameraPlan(challenge, target, target, width);
      expect((target - end.goal) * end.scale + 70).toBeLessThan(width);
      expect(end.scale).toBe(start.scale);
    }
});
it("settles the picnic camera before braking and holds survival framing", () => {
  const a = cameraPlan("picnic", 720, 620, 1366),
    b = cameraPlan("picnic", 720, 800, 1366);
  expect(a.goal).toBe(b.goal);
  expect(cameraPlan("wobbly", 1100, 900, 1366).goal).toBe(0);
});
