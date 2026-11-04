# Official artwork intake — Batch 1

Source: creator upload `illustrations 1-14.zip`, identified as **Characters — Pages 1–14**. The creator's upload request supplies the authoritative mapping below. Archive checksum and individual original file hashes are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-01-characters-pages-1-14/`, retaining the original numbered filenames. No cropping, masking, optimisation, or other image changes were performed.

| Canva page / PNG filename | Official mapping | Use |
| --- | --- | --- |
| 1.png | Lantern — Name Label | UI/reference only |
| 2.png | Lantern — Neutral | Character pose |
| 3.png | Lantern — Excited | Character pose |
| 4.png | Lantern — Worried | Character pose |
| 5.png | Lantern — Surprised | Character pose |
| 6.png | Lantern — Paddling | Character pose |
| 7.png | Lantern — Celebrating | Character pose |
| 8.png | Foxy — Name Label | UI/reference only |
| 9.png | Foxy — Neutral | Character pose |
| 10.png | Foxy — Excited | Character pose |
| 11.png | Foxy — Worried | Character pose |
| 12.png | Foxy — Looking Back | Character pose |
| 13.png | Foxy — Paddling | Character pose |
| 14.png | Foxy — Celebrating | Character pose |

## Inspection results

- ZIP CRC integrity check passed. All expected pages 1–14 are present, with no duplicate filenames.
- All files passed PNG verification and full pixel decoding. Each is 2000 × 2000 RGBA with transparent padding. Visual inspection of all 14 mapped images agrees with the supplied mapping.
- Curved ledges beneath the characters' hands are present and preserved. Later boat composition must support configurable rim layering or masking without altering originals. Content bounds in the manifest describe existing nontransparent pixels, not an applied crop.
- One additional file, **159.png**, is a valid 2000 × 2000 RGBA PNG whose alpha is zero everywhere: it has no visible artwork. It has no authoritative mapping. Preserve it as an excluded, unmapped extra; do not assign a character, pose, or gameplay meaning.
- No corruption or missing expected images was found. No source file approaches GitHub's individual-file size limit.

The creator supplied these as official project artwork; no separate redistribution licence was supplied. This intake does not infer one.

## Development hold

The latest creator instruction is to intake artwork only. Wait until **all artwork batches have been uploaded and the creator gives the final instruction** before implementing the game. This supersedes the earlier proposal's first-ZIP start condition. No game or gallery implementation was performed during this intake.
