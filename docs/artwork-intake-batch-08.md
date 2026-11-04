# Official artwork intake — Batch 8

Source: creator upload `illustrations to use 99-112.zip`, **Encounter Characters, Vehicles and Action Poses — Pages 99–112**. The creator's upload request supplies the authoritative mapping and pairs. Archive and original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-08-encounters-pages-99-112/`, retaining numbered filenames. No cropping, masking, optimisation, or other image edits were performed.

| Initial page / PNG filename | Official initial illustration | Action page / PNG filename | Official action illustration |
| --- | --- | --- | --- |
| 99.png | Teddy Bear Captain: Friendly / Idle | 106.png | Teddy Bear Captain: Holding Tow Hook |
| 100.png | Teddy's Tow Boat: Idle | 107.png | Teddy's Tow Boat: Towing |
| 101.png | Disgruntled Fisherman: Waiting | 108.png | Disgruntled Fisherman: Casting |
| 102.png | Fisherman's Boat: Idle | 109.png | Fisherman's Boat: Fishing Action |
| 103.png | Playful Seal: Balancing Ball | 110.png | Playful Seal: Poking Forward |
| 104.png | Friendly River Monster: Idle | 111.png | Friendly River Monster: Splashing |
| 105.png | Potato Cannon: Ready | 112.png | Potato Cannon: Firing |

Each illustration links to its paired state in the manifest. Shared encounter groups associate the captain with his tow boat and the fisherman with his fishing boat without conflating the separate source illustrations. Paired states stay together logically while original filenames remain intact.

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 expected files. Exactly pages 99–112 are present; no missing, duplicate, extra, blank, or corrupt files were found.
- Every file is 2000 × 2000 RGBA with transparent padding. Visual inspection agrees with the supplied mapping. No opaque rectangular background issue was observed in this batch.
- Artwork size and placement differ between paired canvases. Some images already include splashes, motion marks, or a potato. Preserve these elements and account for them when configuring alignment and separate effects later; do not assume an extra projectile or splash is always needed. Content bounds are measurements, not applied crops.
- No individual file approaches GitHub's file size limit. The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.

## Future encounter and animation direction

Keep the river playful, surprising and alive through selective encounters, not all events in every race. Choose timing and behaviour by challenge, and limit overlapping events so children can understand what happened. Effects may be purely visual or may influence speed, steering, stability or survival; no effects or balance values are finalised at intake.

Preserve these creator possibilities for later design: Teddy arrives to rescue stranded, damaged or eliminated competitors; the fisherman casts towards passing racers disturbing his fishing; the seal balances its ball before approaching to bump a boat; the friendly river monster splashes nearby racers; the cannon fires a potato across the course. **Teddy's tow boat is a friendly rescue feature, never an obstacle.**

Use simple state-based illustration changes: enter in the initial pose, provide brief anticipation/warning where appropriate, switch to the paired action pose at the event, animate movement/rotation/splashes/projectiles separately as needed, then return to idle or leave view. Keep placement, timing, pair alignment, scale and effect layers configurable. No skeletal animation is required. Scrolling scenes should allow encounters to enter and leave the visible race area without changing simulation distances.

Respect reduced motion with restrained/static presentation that still communicates warnings, actions and effects clearly. Actual timing, eligibility, concurrency limits, trajectories and simulation effects await later approved design and implementation; this intake implements none of them.

## Development hold

Artwork intake and documentation only. More batches are coming. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
