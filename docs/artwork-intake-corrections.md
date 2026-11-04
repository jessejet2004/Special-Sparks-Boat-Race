# Corrected transparent artwork intake

Source: creator upload `remaining illustrations .zip`. Exactly five expected PNGs are present, with no missing or unexpected files. ZIP CRC, PNG verification, full pixel decoding and visual inspection against a coloured background passed. Each is 2000 × 2000 RGBA with genuine transparent background pixels. The earlier opaque white rectangles are absent.

| Filename | Existing official mapping | Active semantic asset ID |
| --- | --- | --- |
| 49.png | Tilly — Full Body Neutral | character.tilly.full-body-neutral |
| 51.png | Lantern — Full Body Celebrating | character.lantern.full-body-celebrating |
| 119.png | Flowering Riverbank Bush | environment.flowering-riverbank-bush |
| 133.png | Turtle with Checkered Flag | slowest-race.turtle-checkered-flag |
| 154.png | Jumping Fish | supporting-effect.jumping-fish |

Corrected originals are preserved byte for byte under `assets/originals/batch-13-corrected-pages-49-51-119-133-154/`, with archive and file SHA-256 hashes in the manifest. Stable semantic IDs now reference these corrected sources. The five earlier originals remain unchanged at their earlier paths and are registered in `archived_sources` with reciprocal revision references. Earlier per-batch issue reports describe those preserved historical exports, not the active corrected sources.

The library now has **155 active assets and five archived earlier sources: 160 original PNG files retained**. The 152 numbered illustration mappings and three scene-background mappings are unchanged. No artwork was edited, reconstructed, substituted, recompressed or deleted during this intake. The creator supplied these corrected sources; no separate redistribution licence was supplied or inferred.

Content bounds and apparent placement differ between original and corrected exports. Future composition must use the active revision's bounds and configurable scale/anchors, rather than copying placement values from old files. Visual/alpha checks show the reported rectangular backing issues are resolved in all five active corrections; final small-scale appearance remains a runtime validation task.

Run `python3 scripts/audit-artwork.py` after a fresh checkout to verify all 160 source files, hashes, PNG structure, inventories, pair links and revision links without external packages. This intake also performed full pixel decoding and compared corrected file bytes directly with the ZIP.

This is artwork intake only. No game or gallery implementation was started. The creator's next instruction can begin development using the verified library.
