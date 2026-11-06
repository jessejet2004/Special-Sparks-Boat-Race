import { it, expect } from "vitest";
import manifest from "../../assets/manifest.json";
import { boatIds, characters, poseId } from "../../src/artwork/config";
import {
  characterGeometry,
  equipmentAttachments,
  equipmentPresentation,
  overlaps,
} from "../../src/artwork/race-config";
import { selectRaceRoster } from "../../src/game/roster";
import { fleetLayout } from "../../src/rendering/fleet-layout";
const bounds = (id: string) => {
  const a = manifest.assets.find((a) => a.id === id)!;
  const [x, y, r, b] = a.content_bounds_px;
  return { width: r - x, height: b - y };
};
it("selects four distinct deterministic competitors and rotates every rival", () => {
  const seen = new Set<string>();
  for (let seed = 0; seed < 80; seed++) {
    const roster = selectRaceRoster(seed);
    expect(roster).toEqual(selectRaceRoster(seed));
    expect(roster).toHaveLength(4);
    expect(roster[0]).toBe("lantern");
    expect(new Set(roster).size).toBe(4);
    roster.slice(1).forEach((c) => seen.add(c));
  }
  expect([...seen].sort()).toEqual([...characters.slice(1)].sort());
});
it("keeps all equipment triples clear of faces and each other in all 42 seats and seven reaction poses", () => {
  const ids = Object.keys(equipmentPresentation);
  const aspects = Object.fromEntries(
    ids.map((id) => {
      const b = bounds("equipment." + id);
      return [id, b.height / b.width];
    }),
  );
  let checks = 0;
  for (const boat of boatIds)
    for (const char of characters)
      for (const pose of [
        "neutral",
        "paddling",
        "worried",
        "excited",
        "celebrating",
        "surprised",
        "looking-back",
      ]) {
        const b = bounds("boat." + boat),
          p = bounds(poseId(char, pose));
        const g = characterGeometry(
          boat,
          char,
          pose,
          160,
          b.height / b.width,
          p.height / p.width,
        );
        for (let i = 0; i < ids.length; i++)
          for (let j = i + 1; j < ids.length; j++)
            for (let k = j + 1; k < ids.length; k++) {
              const parts = equipmentAttachments(
                boat,
                g,
                [ids[i], ids[j], ids[k]],
                aspects,
              );
              if (
                parts.some((a) => overlaps(a.bounds, g.face)) ||
                parts.some((a, n) =>
                  parts.slice(n + 1).some((b) => overlaps(a.bounds, b.bounds)),
                )
              )
                throw Error(`${boat}/${char}/${parts.map((p) => p.id)}`);
              checks++;
            }
      }
  expect(checks).toBe(963144);
}, 15000);
it("reserves separate water lanes and a fixed two-by-two survival fleet", () => {
  for (const [w, h] of [
    [1114, 740],
    [724, 800],
    [346, 560],
  ]) {
    const l = fleetLayout(w, h);
    expect(l.anchors).toHaveLength(4);
    expect(l.boatWidth * 0.94 + 24).toBeLessThan(
      l.anchors[1].waterY - l.anchors[0].waterY,
    );
    const s = fleetLayout(w, h, true);
    expect(s.anchors[0].waterY).toBe(s.anchors[1].waterY);
    expect(s.anchors[0].x).toBeLessThan(s.anchors[1].x);
  }
});
it("keeps attachment slots fixed through reactions and paddling", () => {
  for (const boat of boatIds)
    for (const c of characters) {
      const b = bounds("boat." + boat);
      for (const ids of [
        ["party-balloons", "giraffe-lookout", "runaway-kite"],
        ["giant-spoon", "helpful-duck", "super-sponge"],
        ["anchor", "pelican-scoop", "octopus-tentacle"],
      ]) {
        const aspects = Object.fromEntries(
          ids.map((id) => {
            const a = bounds("equipment." + id);
            return [id, a.height / a.width];
          }),
        );
        let previous: string | undefined;
        for (const pose of [
          "neutral",
          "paddling",
          "excited",
          "worried",
          "celebrating",
          "surprised",
          "looking-back",
        ]) {
          const p = bounds(poseId(c, pose));
          const g = characterGeometry(
            boat,
            c,
            pose,
            160,
            b.height / b.width,
            p.height / p.width,
          );
          const attachments = equipmentAttachments(boat, g, ids, aspects);
          const value = JSON.stringify(attachments);
          if (previous) expect(value).toBe(previous);
          previous = value;
        }
      }
    }
});
it("allocates every equipment triple regardless of selection order", () => {
  const ids = Object.keys(equipmentPresentation);
  const aspects = Object.fromEntries(
    ids.map((id) => {
      const a = bounds("equipment." + id);
      return [id, a.height / a.width];
    }),
  );
  for (const boat of boatIds) {
    const b = bounds("boat." + boat),
      p = bounds(poseId("lantern", "neutral"));
    const g = characterGeometry(
      boat,
      "lantern",
      "neutral",
      160,
      b.height / b.width,
      p.height / p.width,
    );
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++)
        for (let k = j + 1; k < ids.length; k++) {
          for (const order of [
            [i, j, k],
            [i, k, j],
            [j, i, k],
            [j, k, i],
            [k, i, j],
            [k, j, i],
          ]) {
            const parts = equipmentAttachments(
              boat,
              g,
              order.map((n) => ids[n]),
              aspects,
            );
            if (parts.length !== 3) throw Error("Incomplete loadout " + boat);
          }
        }
  }
}, 15000);
