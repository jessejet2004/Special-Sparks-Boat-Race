# Official artwork intake — Batch 10

Source: creator upload `illustrations to use 127-140.zip`, **Slowest Race and Wobbly Waters — Pages 127–140**. The creator's upload request supplies the authoritative mapping. Archive and original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-10-slowest-and-wobbly-pages-127-140/`, retaining numbered filenames. No cropping, masking, background removal, optimisation, or other image edits were performed.

| Canva page / PNG filename | Official mapping | Primary challenge |
| --- | --- | --- |
| 127.png | Sleeping Frog on Floating Chair | Slowest Race |
| 128.png | Snail on Lily Pad | Slowest Race |
| 129.png | Floating Alarm Clock | Slowest Race |
| 130.png | Sleeping Duck | Slowest Race |
| 131.png | Floating Beach Ball | Slowest Race |
| 132.png | No Rush Sign | Slowest Race |
| 133.png | Turtle with Checkered Flag | Slowest Race |
| 134.png | Probably Safe Sign | Wobbly Waters |
| 135.png | Rubber Duck | Wobbly Waters |
| 136.png | Warning Buoy | Wobbly Waters |
| 137.png | Floating Treasure Chest | Wobbly Waters |
| 138.png | Colourful Fish | Wobbly Waters |
| 139.png | Little Shipwreck | Wobbly Waters |
| 140.png | Floating Rescue Ring | Wobbly Waters |

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 expected files. Exactly pages 127–140 are present; no missing, duplicate, extra, blank, or corrupt files were found.
- Every image is 2000 × 2000 RGBA with transparent areas. Visual inspection agrees with the supplied mapping.
- **133.png (Turtle with Checkered Flag)** contains an opaque white rectangular backing within the transparent canvas. Visual inspection and an opaque near-white pixel sample confirm it belongs to the file. Preserved unchanged and flagged in the manifest; transparent re-export is recommended for later compositing. Content bounds include the backing, not just the turtle. No other opaque background issue was observed in this batch.
- Content bounds are measurements, not applied crops. No individual file approaches GitHub's file size limit. These are creator-supplied official project assets; no separate redistribution licence was supplied or inferred.

## Future challenge presentation

Slowest Race should feel deliberately relaxed and ridiculous: competitors aim to finish as slowly as possible while still completing the course. Frog, snail and sleeping duck can supply humour; the alarm clock can reinforce the time limit; No Rush and the turtle official establish personality. Use a scrolling camera with the finish initially off-screen and entering view as competitors approach. Time-limit values and gameplay events are not defined at intake.

Wobbly Waters remains an endurance/survival challenge with increasingly large waves and survival-focused camera behaviour, rather than automatically inheriting the scrolling-course framing. Preserve creator possibilities for later review: Probably Safe near the beginning, warning buoys before dangerous waves, jumping fish, a treasure-chest obstacle, shipwreck scenery suggesting danger, and a rescue ring when Teddy collects a stranded competitor. These are not mandatory events or implemented mechanics.

Keep world placement, animation timing, scale and draw order configurable. Allow some elements to stay stationary in world coordinates and others to drift, bob or move independently. Avoid crowding the course or hiding boats, characters and important warnings. Respect the brief's reduced-motion requirement when implementing movement later.

Keep decorative art separate from explicit collision, encounter and obstacle definitions. A treasure chest, buoy, shipwreck or other illustration must not automatically become a hazard merely by being drawn. Optional visual, warning and rescue roles are separate from gameplay consequences.

## Development hold

Artwork intake and documentation only. Picnic Panic illustrations, special effects and scene backgrounds are still expected. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
