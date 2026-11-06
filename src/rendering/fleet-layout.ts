/** CSS-pixel presentation only. Never changes racer distances or simulation rules. */
export function fleetLayout(width: number, height: number, survival = false) {
  const boatWidth = survival
    ? Math.min(240, (width - 100) * 0.34, height * 0.42)
    : Math.min(180, width * 0.34, height * 0.18);
  const rows = survival ? [0.46, 0.84] : [0.26, 0.48, 0.7, 0.92];
  return {
    boatWidth,
    origin: Math.min(width * 0.25, boatWidth * 0.65 + 50),
    anchors: Array.from({ length: 4 }, (_, i) => ({
      x: survival ? width * (i % 2 === 0 ? 0.26 : 0.74) - boatWidth / 2 : 0,
      waterY: height * rows[survival ? Math.floor(i / 2) : i],
    })),
  };
}
