# Official artwork intake — Batch 4

Source: creator upload `full body illustrations .zip`, **Full-body character illustrations — Pages 44–49 and 51–56**. The creator's upload request supplies the authoritative mapping. Pages 43 and 50 are deliberately excluded section labels, not missing assets. Archive and original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-04-full-body-pages-44-56/`, retaining numbered filenames. No cropping, masking, background removal, optimisation, or other image edits were performed.

| Canva page / PNG filename | Official mapping |
| --- | --- |
| 44.png | Lantern — Full Body Neutral |
| 45.png | Foxy — Full Body Neutral |
| 46.png | Ruby — Full Body Neutral |
| 47.png | Dizzy — Full Body Neutral |
| 48.png | Nibbles — Full Body Neutral |
| 49.png | Tilly — Full Body Neutral |
| 51.png | Lantern — Full Body Celebrating |
| 52.png | Foxy — Full Body Celebrating |
| 53.png | Ruby — Full Body Celebrating |
| 54.png | Dizzy — Full Body Celebrating |
| 55.png | Nibbles — Full Body Celebrating |
| 56.png | Tilly — Full Body Celebrating |

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 12 expected files. No missing, duplicate, unexpected, blank, or corrupt files were found.
- Every image is 2000 × 2000 RGBA and has transparent outer padding. Visual inspection agrees with the supplied character and pose mapping.
- **49.png (Tilly Neutral)** and **51.png (Lantern Celebrating)** include opaque white rectangular backings around the illustrations, inside the transparent outer canvas. Inspection against a coloured background and opaque near-white pixel samples confirm these are in the files, not the preview background. Flagged in the manifest. Preserve unchanged; transparent re-exports would avoid white rectangles when compositing later. No repair or substitution was attempted.
- Character sizes and content positions vary across source canvases. Configure content bounds, per-character scale, ground anchor, and pose offsets later; switching identically sized PNG canvases may change apparent size or foot placement. Bounds in the manifest are measurements, not applied crops.
- No individual file approaches GitHub's file size limit. The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.

## Intended use and future celebration direction

These full-body assets are separate from the existing seated boat poses. Neutral full-body poses primarily serve the Boat Room, introductions, and other standing interactions. Celebrating full-body poses primarily serve celebration scenes, podiums, and results. Keep existing seated artwork for boat gameplay.

The creator requests a cheerful, deliberately homemade cardboard-cutout style: start neutral, switch to celebrating with a small upward bounce, briefly return to neutral, then repeat. Give each character a different configurable rhythm so they do not all move together. Preserve individual personalities through their supplied celebrating illustrations.

Future visual configuration should expose the neutral/celebrating asset pair, pose alignment, scale, position, neutral and celebrating hold times, bounce height/duration, and individual phase offset. Use a simple visual timeline, not skeletal animation or gameplay logic. Keep timing gentle and avoid excessive flashing or rapid motion. Reduced-motion mode should use a static celebrating pose without repetitive bounce or switching. Exact values and implementation remain deferred; no animation system was created during intake.

## Development hold

Artwork intake and documentation only. More batches are coming. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
