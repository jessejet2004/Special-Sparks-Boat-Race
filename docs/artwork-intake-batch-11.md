# Official artwork intake — Batch 11

Source: creator upload `illustrations to use 141-154.zip`, **Picnic Panic and Special Game Effects — Pages 141–154**. The creator's upload request supplies the authoritative mapping. Archive and original file SHA-256 checksums are recorded in `assets/manifest.json`.

Originals are preserved byte for byte in `assets/originals/batch-11-picnic-and-effects-pages-141-154/`, retaining numbered filenames. No cropping, masking, background removal, optimisation, or other image edits were performed.

| Canva page / PNG filename | Official mapping | Category |
| --- | --- | --- |
| 141.png | Floating Picnic Platform | Picnic Panic |
| 142.png | Picnic Basket Full of Food | Picnic Panic |
| 143.png | Seagull on a Rock | Picnic Panic |
| 144.png | Floating Sandwich | Picnic Panic |
| 145.png | Flying Potato | Picnic Panic; also potato cannon encounter |
| 146.png | Picnic Finish Markers | Picnic Panic |
| 147.png | You Made It! (Almost) Sign | Picnic Panic |
| 148.png | 20-Second Stopwatch | Reusable supporting asset |
| 149.png | Equipment Crate | Reusable supporting asset |
| 150.png | Ringing Bell | Reusable supporting asset |
| 151.png | Broken Wooden Plank | Reusable supporting asset |
| 152.png | Flashing Warning Light | Reusable supporting asset |
| 153.png | Sandwich Trophy | Reusable supporting asset |
| 154.png | Jumping Fish | Reusable supporting asset |

## Inspection results

- ZIP CRC integrity, PNG verification, and full pixel decoding passed for all 14 expected files. Exactly pages 141–154 are present; no missing, duplicate, extra, blank, or corrupt files were found.
- Every image is 2000 × 2000 RGBA with transparent areas. Visual inspection agrees with the supplied mapping.
- **154.png (Jumping Fish)** contains an opaque white vertical rectangle behind the illustration, inside the transparent canvas. Visual inspection and an opaque near-white pixel sample confirm it is part of the file. Preserved unchanged and flagged for transparent re-export before compositing. Content bounds include the backing, not just the fish. No other opaque background issue was observed in this batch.
- Content bounds are measurements, not applied crops. No individual file approaches GitHub's file size limit. The creator supplied official project artwork; no separate redistribution licence was supplied or inferred.

## Future Picnic Panic presentation

Competitors approach the picnic destination and attempt to stop at the correct position. Use the platform and finish markers for an easily recognised target. Start the destination off-screen and reveal it through scrolling as boats approach; settle the camera early enough for an informed braking decision. Keep target and braking cues clear of decorative illustrations.

Basket, seagull and floating sandwich may add personality. Flying Potato can also support the Batch 8 potato cannon. The You Made It! (Almost) sign may appear near the stopping zone or react humorously to an imperfect finish. These uses do not finalise collision, scoring or event rules.

## Future supporting effects

Preserve the creator's possible uses: stopwatch for the default 20-second scramble countdown; crate for presenting Boat Room equipment; bell for scramble boundaries or important events; broken plank for occasional appropriate damage/collision debris; warning light for danger or large waves; sandwich trophy for a humorous Picnic Panic award; jumping fish for occasional environmental animation.

These are supporting illustrations, not additions to the 28 selectable equipment parts. Timer logic is separate from stopwatch art; the bell PNG supplies no audio; debris does not automatically cause damage. None of these behaviours is implemented during intake.

Favour configurable lightweight bobbing, bouncing, rotation, brief movement or simple pose changes. Not every effect needs to appear in every race. Keep artwork configuration separate from gameplay mechanics, and assign any obstacle or gameplay effect explicitly rather than deriving it from the presence of an illustration. Avoid rapid flashing for the warning light; a steady reduced-motion warning and clear cue can communicate danger without repetitive movement. Respect reduced motion for other decorative effects as well.

## Development hold

Artwork intake and documentation only. The main lake, Boat Room and celebration backgrounds are still pending. Do not implement the game or developer gallery until all batches have been uploaded and the creator gives the final instruction.
