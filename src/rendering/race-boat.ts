import { Artwork } from "../artwork/registry";
import { poseId, type BoatId, type Character } from "../artwork/config";
import {
  racePlacements,
  characterGeometry,
  equipmentAttachments,
} from "../artwork/race-config";
export function drawRaceBoat(
  ctx: CanvasRenderingContext2D,
  art: Artwork,
  boat: BoatId,
  character: Character,
  x: number,
  y: number,
  width: number,
  pose = "neutral",
  equipment: string[] = [],
  time = 0,
  damage = 0,
  water = 0,
  guides = false,
) {
  const image = art.raceImage("boat." + boat),
    person =
      art.raceImage(poseId(character, pose)) ??
      art.raceImage(poseId(character, "neutral"));
  if (!image || !person) return;
  const geometry = characterGeometry(
      boat,
      character,
      pose,
      width,
      image.height / image.width,
      person.height / person.width,
    ),
    p = racePlacements[boat];
  const aspects = Object.fromEntries(
    equipment.map((id) => {
      const im = art.raceImage("equipment." + id);
      return [id, im ? im.height / im.width : 1];
    }),
  );
  const attachments = equipmentAttachments(boat, geometry, equipment, aspects);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(damage ? Math.sin(time * 4) * 0.018 : 0);
  function gear(layer: "rear" | "front") {
    for (const a of attachments.filter((a) => a.layer === layer)) {
      const im = art.raceImage("equipment." + a.id);
      if (!im) continue;
      ctx.save();
      ctx.strokeStyle = "#71543a";
      ctx.lineWidth = Math.max(1, width * 0.006);
      ctx.beginPath();
      ctx.moveTo(...a.root);
      ctx.lineTo(...a.point);
      ctx.stroke();
      ctx.translate(...a.point);
      ctx.rotate(a.angle);
      ctx.drawImage(
        im,
        -a.width * a.pivot[0],
        -a.height * a.pivot[1],
        a.width,
        a.height,
      );
      ctx.restore();
    }
  }
  gear("rear");
  ctx.drawImage(image, 0, 0, width, geometry.height);
  const c = geometry.person;
  // Per-pose handline removes only the baked-in ledge at presentation time.
  ctx.drawImage(
    person,
    0,
    0,
    person.width,
    person.height * geometry.hand,
    c.x,
    c.y,
    c.width,
    c.height * geometry.hand,
  );
  ctx.save();
  ctx.beginPath();
  p.foreground.forEach(([px, py], i) =>
    i
      ? ctx.lineTo(px * width, py * geometry.height)
      : ctx.moveTo(px * width, py * geometry.height),
  );
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, 0, 0, width, geometry.height);
  ctx.restore();
  if (water > 4) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.45, water / 130);
    ctx.fillStyle = "#26a9c5";
    ctx.beginPath();
    ctx.ellipse(
      width * 0.5,
      geometry.waterline,
      width * 0.28,
      Math.min(geometry.height * 0.1, water * 0.12),
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }
  gear("front");
  if (guides) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ed5846";
    ctx.strokeRect(
      geometry.face.x,
      geometry.face.y,
      geometry.face.width,
      geometry.face.height,
    );
    ctx.strokeStyle = "#136c7b";
    for (const a of attachments)
      ctx.strokeRect(a.bounds.x, a.bounds.y, a.bounds.width, a.bounds.height);
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, geometry.waterline);
    ctx.lineTo(width, geometry.waterline);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  return { geometry, attachments };
}
