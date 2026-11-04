# Official artwork intake — Batch 9

Source: creator upload `illustrations to use 113-126.zip`, **General Lake Environment and Fastest Race — Pages 113–126**. The creator's upload request supplies the authoritative mapping. Archive and original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-09-lake-and-fastest-pages-113-126/`, retaining numbered filenames. No cropping, masking, background removal, optimisation, or other image edits were performed.

| Canva page / PNG filename | Official mapping | Category |
| --- | --- | --- |
| 113.png | Lily Pads & Pink Flower | General lake environment |
| 114.png | Cattails & Rocks | General lake environment |
| 115.png | Mossy Rock | General lake environment |
| 116.png | Floating Log | General lake environment |
| 117.png | Flagged Buoy | General lake environment |
| 118.png | Wooden Jetty | General lake environment |
| 119.png | Flowering Riverbank Bush | General lake environment |
| 120.png | Very Official Race Judge (Owl) | Fastest Race |
| 121.png | Checkered Race Flag | Fastest Race |
| 122.png | Finish Line Arch | Fastest Race |
| 123.png | Golden Winner's Trophy | Fastest Race; also results celebration |
| 124.png | Fishing Hook | Fastest Race; potential fisherman encounter support |
| 125.png | Speed Limit: Maybe Sign | Fastest Race |
| 126.png | Cheering Duck Spectators | Fastest Race |

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 expected files. Exactly pages 113–126 are present; no missing, duplicate, extra, blank, or corrupt files were found.
- Every image is 2000 × 2000 RGBA with transparent areas. Visual inspection agrees with the supplied mapping.
- **119.png (Flowering Riverbank Bush)** has an opaque white vertical rectangle behind the illustration, reaching the top and bottom of the canvas, with transparent areas outside it. Visual inspection and opaque near-white pixel samples confirm it is part of the source file. Flagged in the manifest and preserved unchanged; a transparent re-export is recommended before scene compositing. No other opaque background issue was observed in this batch.
- Content bounds are measurements, not applied crops. For page 119, bounds include the white rectangle and do not isolate the bush. No individual file approaches GitHub's file size limit.
- The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.

## Future scenery and Fastest Race direction

General lake assets are reusable across all four challenges. Use them selectively as riverbank decoration, floating scenery, course markers, start-area elements, or potential obstacles where separately specified. Not every illustration needs to appear in every race. Keep scenery varied and alive without overwhelming characters or boats.

For Fastest Race, retain a smooth scrolling camera at consistent visual scale with actual fleet distances. The finish starts off-screen and enters view naturally as racers approach. Use the arch and flag to make that approach exciting; spectators may gather near the finish. The owl should feel comically serious. The trophy may also serve results celebrations, and the hook may support the fisherman encounter.

Future scene configuration should expose world placement, depth/layer, scale, and view-entry/exit bounds. Reuse scenery with occasional placement variation while avoiding excessive repetition, clutter and obscured boats, obstacles or finish markers. Keep camera/decorative movement compatible with the brief's reduced-motion requirement. No scene placement or camera code is implemented at intake.

**Decorative scenery is separate from collision and obstacle logic.** An illustration, including a log, rock, buoy or hook, must not automatically become a physical hazard because it appears in the scene. Any collision shape, obstacle eligibility or gameplay effect needs a separate explicit definition during later approved work.

## Development hold

Artwork intake and documentation only. More batches are coming. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
