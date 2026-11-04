# Official artwork library audit

Status: **numbered library verified; final background intake pending downloadable original PNGs**. No game implementation is authorised by this audit. The creator requests findings and necessary decisions before implementation proceeds.

## Numbered library results

Audited all 152 original PNGs from Batches 1–11 against their source ZIPs and `assets/manifest.json`:

- All originals match the ZIP entry bytes and recorded SHA-256 checksums. All 11 archive hashes and ZIP CRC checks passed.
- All PNGs passed verification and full pixel decoding. Each is 2000 × 2000 RGBA, contains visible artwork and has transparent areas. Manifest dimensions and content bounds agree with decoded images.
- Exact page coverage is 1–154 excluding deliberately omitted section labels 43 and 50. No missing required numbered pages, duplicate IDs/pages/paths, duplicate file hashes, or unregistered original files were found. Accidental 159.png remains removed as requested.
- Mappings remain as recorded from the creator's per-batch inventories. No incorrect mapping was identified during intake or this audit. Original hashes are unchanged, and boat/piece and encounter-state references resolve reciprocally.
- Six characters each have one reference label, six seated poses and two full-body poses. Seated and full-body illustrations have distinct IDs. Character-specific actions such as Singing and Looking Back remain distinct.
- Exactly seven selectable boats and seven matching fallen pieces are registered; no flying saucer. Exactly 28 selectable equipment illustrations cover pages 71–98 in four groups of seven. Supporting crate/effects art is not additional selectable equipment.
- Fourteen encounter illustrations form seven initial/action pairs, grouped into five encounter families. Seven general-lake assets, seven assets per challenge, and seven supporting effects are registered.

The numbered originals total 146,846,223 bytes (about 140 MiB on disk). Preserve these sources, but load only scene-relevant runtime artwork; consider separately generated optimised derivatives and bounded decoded-image caching later. Loading every 2000 × 2000 RGBA image at once would require roughly 2.3 GiB for decoded pixel buffers alone. This is a runtime performance consideration, not a reason to alter originals.

## Known technical artwork issues

| Page | Asset | Issue |
| --- | --- | --- |
| 49 | Tilly — Full Body Neutral | Opaque white rectangular backing |
| 51 | Lantern — Full Body Celebrating | Opaque white rectangular backing |
| 119 | Flowering Riverbank Bush | Opaque white vertical backing |
| 133 | Turtle with Checkered Flag | Opaque white rectangular backing |
| 154 | Jumping Fish | Opaque white vertical backing |

These are valid PNGs with transparency outside the backing, not corruption. They are flagged in the manifest and preserved unchanged. Transparent re-exports are recommended before clean scene compositing. Do not silently remove backgrounds or replace the original files. Future corrected source files must retain clear provenance and preserve earlier originals.

Other integration considerations: large transparent padding, varying apparent character sizes/pose origins, embedded motion/splash marks, and curved seated-pose ledges. Content bounds and per-boat/per-pose placement, scale, masks and layers must handle these; do not stretch artwork or encode visual offsets as simulation rules. Pair/frame alignment and reduced motion remain future implementation work.

## Final backgrounds: expected files and current limitation

The creator has shown three backgrounds inline and supplied these intended filenames. Their original downloadable PNG bytes are not available in the workspace or as downloadable attachment references in this request. Therefore they have **not** been imported, hashed, registered as present, or backed up to GitHub. Exact original dimensions, PNG integrity, colour mode and byte preservation remain unverified. Do not reconstruct originals from rendered chat previews or describe the complete library as backed up.

| Expected filename | Intended use | Visual review from inline preview only |
| --- | --- | --- |
| lake-background.png | Race foundation for all four challenges | Wide water scene with foreground and bank scenery. Visible white top/bottom strips; verify actual source and use configurable render cropping if appropriate. Not demonstrated seamless at left/right edges. |
| boat-room-background.png | Boat selection and equipment scramble | Clear foreground floor supports boats/characters; busy walls need readable accessible UI panels and careful safe areas. |
| celebration-background.png | Results and full-body celebrations | Central three-place podium supplies anchors; preserve aspect ratio and position other competitors nearby without covering results. |

The latest resend shows the same three scene types and does not establish byte-level access. Obtain a downloadable ZIP containing the named PNGs to finish intake and audit. After receipt, inspect dimensions, full decoding, source hashes, any borders/transparency, and camera/composition suitability; register and preserve all three unchanged. Expected final count is 155 original images if no other files are added.

## Background integration direction to preserve

Lake: preserve aspect ratio, support horizontal camera scrolling, and layer environmental/encounter assets above it. Do not assume the art is a seamless infinite tile. A reasonable initial approach is a slowly moving scenic backdrop with independently scrolling world objects; for longer courses, verify bounded panning or a separate repeatable presentation treatment without visible joins. Do not stretch the illustration to course length. Choose the final treatment after the original is inspected and previewed. No replacement scenery is authorised by this note.

Boat Room: use behind interactive selection/scramble UI. Keep controls in accessible HTML with adequate contrast, focus visibility and touch targets, rather than relying on artwork alone. Configure safe areas by viewport.

Celebration: align full-body characters to configurable podium/ground anchors and preserve individual scaling and pose offsets. Keep the creator's simple neutral/celebrating alternation, small bounce and different character rhythms. Use static celebrations for reduced motion. Avoid placing results text directly over busy art. No animation is implemented yet.

## GitHub preservation evidence

Before this report, the full numbered library, manifest and intake documentation were pushed on branch `work` at `fabefe5c13893e543c5724746bf210a8603510e3`. A separate fresh clone directly from GitHub restored that exact commit and all 152 original files; every original hash matched the restored manifest and the checkout was clean. This proves restoration of the numbered artwork without the source uploads or this conversation.

This report is committed and pushed as its own audit stage; the accompanying response reports its final SHA and verified push result. It does not establish preservation of the three missing original backgrounds. After final intake, repeat remote verification and fresh-checkout hash checks before claiming the complete artwork library is backed up.

## Necessary next steps and deferred decisions

1. Obtain downloadable originals for the three backgrounds. This blocks completion of intake and the complete-library backup claim.
2. Resolve the five opaque backings with transparent re-exports, or explicitly defer those illustrations during the initial foundation. This need not block work on unaffected assets after authorisation.
3. Report final audit/backup results and obtain the creator's final implementation instruction. Do not begin implementation merely because previews have arrived.

Exact equipment balance, scramble allocation rules, race controls and scoring questions in the development proposal can be resolved before their respective gameplay stages. They do not need to block the illustrated foundation. No new gameplay decisions are imposed by this audit.
