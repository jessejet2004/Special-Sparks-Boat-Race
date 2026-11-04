# Official artwork intake — Batch 7

Source: creator upload `illustrations to use 85-98.zip`, **Final 14 Boat Equipment Illustrations — Pages 85–98**. The creator's upload request supplies the authoritative names and groupings. Archive and original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-07-equipment-pages-85-98/`, retaining numbered filenames. No cropping, masking, optimisation, or other image edits were performed.

| Canva page / PNG filename | Official equipment name | Official group |
| --- | --- | --- |
| 85.png | Little Electric Fan | Wind, movement and unusual inventions |
| 86.png | Patchwork Sail | Wind, movement and unusual inventions |
| 87.png | Party Balloons | Wind, movement and unusual inventions |
| 88.png | Upside-Down Umbrella | Wind, movement and unusual inventions |
| 89.png | Runaway Kite | Wind, movement and unusual inventions |
| 90.png | Hamster Wheel | Wind, movement and unusual inventions |
| 91.png | Giraffe Lookout | Wind, movement and unusual inventions |
| 92.png | Giant Spoon | Braking, surprises and ridiculous ideas |
| 93.png | Pet Rock | Braking, surprises and ridiculous ideas |
| 94.png | Anchor | Braking, surprises and ridiculous ideas |
| 95.png | Slippery Soap | Braking, surprises and ridiculous ideas |
| 96.png | Lily Pad | Braking, surprises and ridiculous ideas |
| 97.png | Pelican Scoop | Braking, surprises and ridiculous ideas |
| 98.png | Octopus Tentacle | Braking, surprises and ridiculous ideas |

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 expected files. Exactly pages 85–98 are present; no missing, duplicate, extra, blank, or corrupt files were found.
- All files are 2000 × 2000 RGBA with transparent padding. Visual inspection agrees with the supplied mapping. No opaque rectangular background issue was observed in this batch.
- Content bounds are measurements, not applied crops. No individual file approaches GitHub's file size limit. The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.
- Together with Batch 6, the manifest now contains all **28 official equipment illustrations, pages 71–98**, in four creator-defined groups of seven. Equipment artwork intake is complete; gameplay definitions and integration are not implemented.

## Future artwork configuration

Keep equipment definitions separate from artwork configuration. Configure attachment position, scale, rotation, visual extent and layering per boat without changes to the gameplay simulation. Above-boat parts such as Giraffe Lookout, Runaway Kite and Party Balloons need room above the hull; Giant Spoon, Anchor and Octopus Tentacle may extend into the water. Do not clip all parts to the hull or assume one mounting layout works for every boat. Test eventual composites for recognisability at smaller race-view sizes. No actual mounting positions or simulation behaviour are assigned during intake.

## Creative interaction directions, not final rules

Equipment should be imaginative, surprising and occasionally ridiculous, with strengths, weaknesses and interactions. Not every part must help, and usefulness may differ across the four challenges. Preserve the following creator suggestions for future design review:

- Party Balloons + Pet Rock: lift and weight could partially cancel.
- Giant Spoon + Fizzy Bottle Engine: unexpectedly effective propulsion.
- Patchwork Sail + Little Electric Fan: potentially useful, depending on positioning.
- Anchor + Slippery Soap: conflicting braking and movement effects.
- Giraffe Lookout: anticipating obstacles without necessarily increasing speed.
- Octopus Tentacle: useful steering with occasional unexpected grabbing.

These are possibilities, not mandatory mechanics, balance values or final interaction rules. Keep visual placement configuration independent of simulation rules; if a later approved interaction uses relative mounting positions, define that input explicitly rather than deriving gameplay from render pixels.

## Development hold

Artwork intake and documentation only. More batches are coming. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
