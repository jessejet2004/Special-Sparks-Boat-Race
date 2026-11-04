# Official artwork intake — Batch 2

Source: creator upload `illustrations to use 15-28.zip`, **Characters — Pages 15–28**. The creator's upload request supplies the authoritative mapping below. The archive SHA-256 and individual file checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-02-characters-pages-15-28/`, retaining numbered filenames. No cropping, optimisation, masking, or other image changes were performed.

| Canva page / PNG filename | Official mapping | Use |
| --- | --- | --- |
| 15.png | Ruby — Name Label | UI/reference only |
| 16.png | Ruby — Neutral | Character pose |
| 17.png | Ruby — Excited | Character pose |
| 18.png | Ruby — Worried | Character pose |
| 19.png | Ruby — Looking Back | Character pose |
| 20.png | Ruby — Paddling | Character pose |
| 21.png | Ruby — Celebrating | Character pose |
| 22.png | Dizzy — Name Label | UI/reference only |
| 23.png | Dizzy — Neutral | Character pose |
| 24.png | Dizzy — Excited | Character pose |
| 25.png | Dizzy — Worried | Character pose |
| 26.png | Dizzy — Singing | Character pose |
| 27.png | Dizzy — Paddling | Character pose |
| 28.png | Dizzy — Celebrating | Character pose |

## Inspection results and composition notes

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 files. No missing, duplicate, unexpected, or fully transparent images were found.
- Every image is 2000 × 2000 RGBA with transparent padding. Visual inspection agrees with the supplied mapping. No corruption was found.
- Curved ledges are retained unchanged. Recorded content bounds are inspection metadata, not applied crops. Later seating can hide ledges using configurable boat-rim layering or masks.
- Preserve character-specific distinctions: Ruby's page 19 is **Looking Back**, while Dizzy's page 26 is **Singing**. Do not treat them as interchangeable poses or assume all characters have identical reaction sets. Animation configuration is deferred until implementation is authorised.
- No individual file approaches GitHub's file size limit. The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.

## Requested cleanup

Removed the accidental Batch 1 `159.png` from the checkout and active asset list at the creator's explicit request. Updated Batch 1 documentation and metadata to record the removal. The original Batch 1 pages 1–14 remain unchanged; prior Git history is not rewritten.

## Development hold

Artwork intake only. More batches are coming. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
