import { Artwork } from "../artwork/registry";
import {
  placements,
  poseId,
  type BoatId,
  type Character,
} from "../artwork/config";
export function drawImage(
  ctx: CanvasRenderingContext2D,
  art: Artwork,
  id: string,
  x: number,
  y: number,
  w: number,
  h?: number,
) {
  const image = art.image(id);
  if (!image) return;
  ctx.drawImage(image, x, y, w, h ?? (w * image.height) / image.width);
}
export function drawBoat(
  ctx: CanvasRenderingContext2D,
  art: Artwork,
  boat: BoatId,
  character: Character,
  x: number,
  y: number,
  w: number,
  pose = "neutral",
  equipment: string[] = [],
  time = 0,
  damage = 0,
  water = 0,
) {
  const image = art.image(`boat.${boat}`);
  if (!image) return;
  const h = (w * image.height) / image.width,
    p = placements[boat];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(damage ? Math.sin(time * 4) * 0.025 : 0);
  ctx.drawImage(image, 0, 0, w, h);
  const person =
    art.image(poseId(character, pose)) ??
    art.image(poseId(character, "neutral"));
  if (person) {
    const cw = w * p.characterWidth,
      ch = (cw * person.height) / person.width;
    // Hide the illustrated ledge under the front edge using a configurable clip.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, -h, w, h * (p.rimY + 1));
    ctx.clip();
    ctx.drawImage(
      person,
      0,
      0,
      person.width,
      person.height * 0.9,
      w * p.seatX - cw / 2,
      h * p.seatY - ch * 0.82,
      cw,
      ch * 0.9,
    );
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, h * p.rimY, w, h);
    ctx.clip();
    ctx.drawImage(image, 0, 0, w, h);
    ctx.restore();
  }
  if (water > 4) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.55, water / 110);
    ctx.fillStyle = "#26a9c5";
    ctx.beginPath();
    ctx.ellipse(
      w * 0.5,
      h * p.waterline,
      w * 0.34,
      Math.min(h * 0.2, water * 0.25),
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }
  equipment.forEach((id, i) => {
    const above = /balloons|kite|giraffe|sail/.test(id),
      water = /spoon|anchor|tentacle|flipper/.test(id);
    const [mx, my, rot] = p.mounts[above ? 2 : i % 2];
    const ew = w * (above ? 0.34 : 0.24);
    ctx.save();
    ctx.translate(w * mx, h * (water ? 0.82 : my));
    ctx.rotate(rot);
    drawImage(ctx, art, `equipment.${id}`, -ew / 2, -ew * 0.6, ew);
    ctx.restore();
  });
  ctx.restore();
}
