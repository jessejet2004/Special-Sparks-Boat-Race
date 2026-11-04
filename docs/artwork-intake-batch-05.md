# Official artwork intake — Batch 5

Source: creator upload `illustrations to use 57-70.zip`, **Seven Boats and Seven Matching Fallen Pieces — Pages 57–70**. The authoritative mapping comes from the creator's upload request. Archive and individual original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-05-boats-and-fallen-pieces-pages-57-70/`, retaining numbered filenames. No cropping, masking, optimisation, or other image edits were performed.

| Boat page / filename | Official selectable boat | Matching piece page / filename | Official fallen piece |
| --- | --- | --- | --- |
| 57.png | The Good Old Bathtub | 64.png | Rubber Duck |
| 58.png | A Very Brave Cardboard Box | 65.png | Torn Cardboard |
| 59.png | The Stick-Together Raft | 66.png | Loose Rope |
| 60.png | The Doughnut of Destiny | 67.png | Missing Bite |
| 61.png | An Enormous Teacup | 68.png | Broken Ceramic |
| 62.png | The Left Welly | 69.png | Detached Sole |
| 63.png | The Picnic Basket | 70.png | Apple Core |

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 files. Exactly pages 57–70 are present; no missing, duplicate, unexpected, blank, or corrupt files were found.
- Every image is 2000 × 2000 RGBA with transparent padding. Visual inspection agrees with the supplied boats and matching pieces. No opaque rectangular background issue was observed in this batch.
- The raft includes the revised raised front edge. Record this for later character occlusion rather than assuming the earlier flat/top-only seating arrangement.
- Source canvases include varying transparent padding; measured content bounds are recorded without applying crops. Water/splash details and decorative marks already present in the illustrations are preserved.
- No individual file approaches GitHub's file size limit. The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.

## Future configuration requirements

There are exactly seven official selectable boats. The flying saucer is permanently excluded; do not add an eighth boat.

Configure seating, character scale, waterline, equipment mounting positions, and appropriate foreground occlusion separately for each boat shape. Use existing seated poses behind rims/front edges where possible. Use configurable layering or masks without editing originals. The revised raft has a raised front edge; the teacup and welly require seating within their openings. Keep actual placement values deferred until the authorised composition work.

Each boat and fallen piece has an explicit reciprocal asset reference in the manifest. Future effects should be occasional, configurable humorous events: a piece may fly off, tumble briefly, splash, or float away. They must not automatically appear whenever a boat loses speed or encounters difficulty. Damage and cosmetic effects are separate decisions; triggering a piece alone does not imply a performance penalty.

Creator examples are possibilities, not mandatory mechanics: the rubber duck and apple core can fall without damage; torn cardboard might accompany water damage; rope might loosen in a rough wave; a doughnut might mysteriously lose a bite; a teacup might lose a decorative ceramic piece; a welly might lose its sole. Do not turn these suggestions into fixed rules at intake. Later configuration can expose eligible events, frequency/cooldown, attachment point, motion and splash/drift presentation, while actual gameplay damage belongs to simulation rules. No effect system is implemented now.

## Development hold

Artwork intake and documentation only. More batches are coming. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
