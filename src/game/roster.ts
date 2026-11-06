import { characters, type Character } from "../artwork/config";
import { random, shuffle } from "./model";
export const RACER_COUNT = 4;
/** Stable for replay, with every rival eligible on every fresh race. */
export function selectRaceRoster(seed: number): Character[] {
  return [
    "lantern",
    ...shuffle(characters.slice(1), random(seed ^ 0x51a7)).slice(
      0,
      RACER_COUNT - 1,
    ),
  ];
}
