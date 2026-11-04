import type { Challenge } from "../game/model";
export function cameraPlan(
  challenge: Challenge,
  target: number,
  fleetPosition: number,
  width: number,
  reduced = false,
) {
  // Fixed scale for a challenge/viewport, never fitted to the spread of the fleet.
  const scale = Math.max(1.55, (width * 1.22) / target);
  let goal = Math.max(0, fleetPosition - (width * 0.32) / scale);
  if (challenge === "picnic")
    goal = Math.min(goal, target - (width * 0.64) / scale);
  if (challenge === "wobbly") goal = 0;
  if (reduced)
    goal =
      Math.floor(goal / ((width * 0.12) / scale)) * ((width * 0.12) / scale);
  return { scale, goal };
}
