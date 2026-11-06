import { Artwork } from "../artwork/registry";
import { drawImage } from "./composite";
import { type Race } from "../game/race";
import { characterName } from "../artwork/config";
import { cameraPlan } from "./camera";
import { prepareCanvas } from "./canvas";
import { fleetLayout } from "./fleet-layout";
import { drawRaceBoat } from "./race-boat";
import { racePlacements } from "../artwork/race-config";
export class RaceScene {
  camera = 0;
  constructor(public art: Artwork) {}
  draw(canvas: HTMLCanvasElement, r: Race, reduced: boolean) {
    const { ctx, width: W, height: H } = prepareCanvas(canvas);
    const waveMode = r.challenge === "wobbly";
    const layout = fleetLayout(W, H, waveMode);
    canvas.dataset.racerCount = String(r.racers.length);
    canvas.dataset.boatWidth = String(layout.boatWidth);
    const fleet = r.racers
      .filter((p) => p.status !== "rescued")
      .map((p) => p.x)
      .sort((a, b) => a - b);
    const middle = fleet.length
      ? fleet[Math.floor(fleet.length / 2)]
      : r.racers[0].x;
    const { scale: worldScale, goal } = cameraPlan(
      r.challenge,
      r.target,
      middle,
      W,
      reduced,
      layout.origin,
    );
    this.camera = reduced ? goal : this.camera + (goal - this.camera) * 0.07;
    const bg = this.art.raceImage("background.lake");
    if (bg) {
      const scale = Math.max(W / bg.width, (H * 2.1) / bg.height);
      const margin = bg.width * scale - W;
      ctx.drawImage(
        bg,
        -(reduced
          ? margin * 0.5
          : margin * (0.35 + 0.3 * Math.min(1, middle / r.target))),
        H * 0.08 - bg.height * scale * 0.55,
        bg.width * scale,
        bg.height * scale,
      );
    }
    const world = (x: number) => (x - this.camera) * worldScale + layout.origin;
    // Deliberate course placements, independent from collisions.
    const scenery = [
      "environment.lily-pads-pink-flower",
      "environment.cattails-rocks",
      "environment.mossy-rock",
      "environment.floating-log",
      "environment.flagged-buoy",
      "environment.wooden-jetty",
      "environment.flowering-riverbank-bush",
    ];
    for (let i = 0; i < 8; i++) {
      const x = world(i * 190 - 40);
      if (x > -150 && x < W + 100)
        drawImage(
          ctx,
          this.art,
          scenery[(i * 3 + 2) % 7],
          x,
          H * 0.11 + (i % 2) * 7,
          48 + (i % 3) * 10,
        );
    }
    const props: Record<string, string[]> = {
      fastest: [
        "fastest-race.very-official-race-judge",
        "fastest-race.speed-limit-maybe-sign",
        "fastest-race.cheering-duck-spectators",
      ],
      slowest: [
        "slowest-race.sleeping-frog-floating-chair",
        "slowest-race.snail-lily-pad",
        "slowest-race.sleeping-duck",
        "slowest-race.floating-alarm-clock",
        "slowest-race.no-rush-sign",
        "slowest-race.floating-beach-ball",
      ],
      picnic: [
        "picnic-panic.picnic-basket-full-of-food",
        "picnic-panic.seagull-on-rock",
        "picnic-panic.floating-sandwich",
        "picnic-panic.you-made-it-almost-sign",
      ],
      wobbly: [
        "wobbly-waters.probably-safe-sign",
        "wobbly-waters.rubber-duck",
        "wobbly-waters.warning-buoy",
        "wobbly-waters.floating-treasure-chest",
        "wobbly-waters.colourful-fish",
        "wobbly-waters.little-shipwreck",
      ],
    };
    props[r.challenge]
      .filter((_, i, all) => all.length <= 3 || i % 2 === r.seed % 2)
      .forEach((id, i, visibleProps) => {
        const x = waveMode
          ? 30 + (i * (W - 100)) / 6
          : world(
              60 +
                (i * (r.target - 120)) / Math.max(1, visibleProps.length - 1),
            );
        if (x > -100 && x < W + 50)
          drawImage(
            ctx,
            this.art,
            id,
            x,
            H * 0.1 - (i % 2) * 12,
            55 + (i % 3) * 10,
          );
      });
    if (!waveMode) {
      const finish = world(r.target);
      if (finish > -100 && finish < W + 200) {
        ctx.save();
        ctx.strokeStyle = "#fff9df";
        ctx.lineWidth = 5;
        ctx.setLineDash([13, 10]);
        ctx.beginPath();
        ctx.moveTo(finish + 20, H * 0.27);
        ctx.lineTo(finish + 20, H * 0.94);
        ctx.stroke();
        ctx.restore();
        drawImage(
          ctx,
          this.art,
          r.challenge === "picnic"
            ? "picnic-panic.floating-picnic-platform"
            : r.challenge === "slowest"
              ? "slowest-race.turtle-checkered-flag"
              : "fastest-race.finish-line-arch",
          finish - 48,
          H * 0.1,
          r.challenge === "picnic" ? 160 : 105,
        );
        if (r.challenge === "fastest")
          drawImage(
            ctx,
            this.art,
            "fastest-race.checkered-race-flag",
            finish + 70,
            H * 0.21,
            40,
          );
        if (r.challenge === "picnic")
          drawImage(
            ctx,
            this.art,
            "picnic-panic.picnic-finish-markers",
            finish - 25,
            H * 0.86,
            110,
          );
        ctx.fillStyle = "#fff9e9";
        ctx.fillRect(finish - 42, H * 0.26, 124, 28);
        ctx.fillStyle = "#16484a";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          r.challenge === "picnic" ? "PICNIC TARGET" : "FINISH",
          finish + 20,
          H * 0.26 + 20,
        );
      }
    }
    if (waveMode) {
      const until = r.nextWave - r.time;
      const progress = Math.max(0, 1 - until / 4.5);
      if (until < 2.5 && r.wave < 10) {
        const wx = reduced ? W * 0.85 : W - progress * W;
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#e7fcff";
        ctx.lineWidth = 14 + r.wave;
        ctx.beginPath();
        for (let y = H * 0.3; y < H; y += 8) {
          const x = wx + Math.sin(y * 0.04) * 18;
          y === H * 0.3 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
      drawImage(
        ctx,
        this.art,
        "wobbly-waters.warning-buoy",
        W - 90,
        H * 0.16,
        60,
      );
      if (until < 1.5)
        drawImage(
          ctx,
          this.art,
          "supporting-effect.flashing-warning-light",
          W - 135,
          H * 0.2,
          32,
        );
    }
    const positions = r.racers.map((p, i) => {
      const image = this.art.raceImage("boat." + p.boat)!;
      const width = layout.boatWidth,
        height = (width * image.height) / image.width;
      return {
        x: waveMode ? layout.anchors[i].x : world(p.x),
        y: layout.anchors[i].waterY - height * racePlacements[p.boat].waterline,
        width,
        waterY: layout.anchors[i].waterY,
        height,
      };
    });
    r.racers.forEach((p, i) => {
      const { x, y, width, waterY } = positions[i];
      if (!waveMode && (x < 0 || x > W - width * 0.2)) {
        ctx.fillStyle = i === 0 ? "#124c4d" : "#375e5c";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = x < 0 ? "left" : "right";
        ctx.fillText(
          `${x < 0 ? "◀ " : ""}${characterName(p.character)}${x > W - width * 0.2 ? " ▶" : ""}`,
          x < 0 ? 10 : W - 10,
          waterY + 12,
        );
        return;
      }
      const bob = reduced ? 0 : Math.sin(r.time * 2.2 + i) * 2.5;
      const hit = [...r.events]
        .reverse()
        .find(
          (e) => e.racer === i && e.kind === "damage" && r.time - e.time < 1.5,
        );
      const encounterHit = recentEncounter(r, i);
      const pose =
        p.status === "rescued"
          ? "worried"
          : p.status === "finished"
            ? "celebrating"
            : hit
              ? "worried"
              : encounterHit
                ? "surprised"
                : p.boostUntil > r.time
                  ? "excited"
                  : p.equipment.includes("hamster-wheel") &&
                      p.character === "dizzy"
                    ? "looking-back"
                    : "paddling";
      if (i === 0) {
        ctx.save();
        ctx.strokeStyle = "#f8d56b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(
          x + width * 0.48,
          waterY,
          width * 0.46,
          6,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
      }
      if (p.status === "rescued") {
        ctx.globalAlpha = 0.45;
        drawRaceBoat(
          ctx,
          this.art,
          p.boat,
          p.character,
          x,
          y,
          width,
          "worried",
          [],
          r.time,
        );
        ctx.globalAlpha = 1;
        drawImage(
          ctx,
          this.art,
          "encounter.teddy-tow-boat.action",
          x + width * 0.45,
          y - 15,
          width * 0.72,
        );
        drawImage(
          ctx,
          this.art,
          "encounter.teddy-bear-captain.action",
          x + width * 0.78,
          y - 18,
          width * 0.2,
        );
        drawImage(
          ctx,
          this.art,
          "wobbly-waters.floating-rescue-ring",
          x - 15,
          waterY + 12,
          35,
        );
      } else
        drawRaceBoat(
          ctx,
          this.art,
          p.boat,
          p.character,
          x,
          y + bob,
          width,
          pose,
          p.equipment.filter((id) => !p.failed.includes(id)),
          r.time,
          hit ? 1 : 0,
          p.water,
        );
      ctx.font = `${i === 0 ? "bold " : ""}12px sans-serif`;
      ctx.textAlign = "center";
      const label = characterName(p.character) + (i === 0 ? " · YOU" : "");
      const labelWidth = ctx.measureText(label).width + 18;
      const nameX = Math.max(
        8,
        Math.min(W - labelWidth - 8, x + width * 1.22 + 8),
      );
      const nameY = waterY - 30;
      ctx.fillStyle = i === 0 ? "#123e43" : "#fffbeaee";
      ctx.beginPath();
      ctx.roundRect(nameX, nameY, labelWidth, 23, 9);
      ctx.fill();
      ctx.fillStyle = i === 0 ? "#fff8dc" : "#163f43";
      ctx.fillText(label, nameX + labelWidth / 2, nameY + 16);
      if (waveMode) {
        ctx.fillStyle = "#ffffffba";
        ctx.fillRect(x + 15, waterY + 35, width - 30, 5);
        ctx.fillStyle = p.hull > 35 ? "#2b8169" : "#c26537";
        ctx.fillRect(
          x + 15,
          waterY + 35,
          (width - 30) * Math.max(0, p.hull / p.stats.durability),
          5,
        );
      }
    });
    const recent = r.events.filter((e) => r.time - e.time < 3.3);
    // Sparse debris: only selected damage/cosmetic moments, never every slowdown.
    for (const e of recent
      .filter(
        (e) =>
          e.asset &&
          (e.kind === "cosmetic" ||
            e.kind === "equipment" ||
            (e.kind === "damage" && e.id % 7 === 0)),
      )
      .slice(-2)) {
      const position = positions[e.racer];
      if (!position) continue;
      const age = r.time - e.time,
        x = position.x + position.width * 0.8,
        y = position.waterY - 12;
      ctx.save();
      ctx.translate(
        x + (reduced ? 0 : age * 18),
        y +
          (reduced ? 0 : -Math.sin(Math.min(1, age) * Math.PI) * 26 + age * 10),
      );
      ctx.rotate(reduced ? 0 : age * 1.4);
      drawImage(ctx, this.art, e.asset!, -16, -16, 32);
      ctx.restore();
    }
    for (const e of r.encounters.filter(
      (e) => r.time >= e.at - 2 && r.time < e.at + 3.5,
    )) {
      const prefix: Record<string, string> = {
        fisherman: "disgruntled-fisherman",
        seal: "playful-seal",
        "river-monster": "friendly-river-monster",
        "potato-cannon": "potato-cannon",
      };
      const state = r.time < e.at ? "initial" : "action";
      const ex = W - 190 + (reduced ? 0 : Math.max(0, e.at - 1 - r.time) * 65);
      drawImage(
        ctx,
        this.art,
        `encounter.${prefix[e.kind]}.${state}`,
        ex,
        H * 0.08,
        100,
      );
      if (e.kind === "fisherman")
        drawImage(
          ctx,
          this.art,
          `encounter.fisherman-boat.${state}`,
          ex - 10,
          H * 0.2,
          120,
        );
      if (e.kind === "potato-cannon" && r.time > e.at)
        drawImage(
          ctx,
          this.art,
          "picnic-panic.flying-potato",
          ex - 40 - (reduced ? 0 : (r.time - e.at) * 110),
          H * 0.24,
          35,
        );
    }
    const fishPhase = r.time % 19;
    if (fishPhase > 7 && fishPhase < 9)
      drawImage(
        ctx,
        this.art,
        "supporting-effect.jumping-fish",
        W * 0.65,
        H * 0.65 -
          (reduced ? 0 : Math.sin(((fishPhase - 7) / 2) * Math.PI) * 35),
        40,
      );
    const damageEvent = [...recent]
      .reverse()
      .find((e) => e.kind === "damage" && e.id % 11 === 0);
    if (damageEvent)
      drawImage(
        ctx,
        this.art,
        "supporting-effect.broken-wooden-plank",
        W * 0.4,
        H * 0.8,
        35,
      );
    ctx.textAlign = "left";
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#123e43";
    ctx.fillText(
      waveMode
        ? "WAVES ARRIVE FROM THE RIGHT →"
        : `COURSE ${Math.round(Math.min(100, (middle / r.target) * 100))}% · Fleet camera`,
      24,
      35,
    );
  }
}

function recentEncounter(r: Race, i: number) {
  return r.events.some(
    (e) => e.racer === i && e.kind === "encounter" && r.time - e.time < 1.5,
  );
}
