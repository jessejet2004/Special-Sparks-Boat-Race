import type { Challenge } from "../game/model";
export function cameraPlan(
  challenge: Challenge,
  target: number,
  fleetPosition: number,
  width: number,
  reduced = false,
  origin = 110,
) {
  // Fixed scale for a challenge/viewport, never fitted to the spread of the fleet.
  const scale = Math.max(1.55, (width * 1.22) / target);
  let goal = Math.max(
    0,
    fleetPosition - Math.max(0, width * 0.3 - origin) / scale,
  );
  if (challenge === "picnic")
    goal = Math.min(goal, target - Math.max(40, width * 0.7 - origin) / scale);
  if (challenge === "wobbly") goal = 0;
  if (reduced)
    goal =
      Math.floor(goal / ((width * 0.12) / scale)) * ((width * 0.12) / scale);
  return { scale, goal };
}
