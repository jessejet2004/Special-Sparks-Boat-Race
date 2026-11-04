# Official artwork library audit

Status: **all 155 original illustrations and backgrounds registered and verified**. Five corrected numbered source PNGs remain pending: only inline correction previews were provided. No game implementation was started in this audit stage; the creator requested the results before proceeding.

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

## Final backgrounds: original-file intake completed

`backgrounds.zip` supplied exactly the expected three originals. Archive CRC and individual PNG verification/full decoding passed. Original bytes and hashes are preserved under `assets/originals/batch-12-backgrounds/` and in the manifest. See [background intake](artwork-intake-backgrounds.md).

| Filename | Verified dimensions | Transparency |
| --- | --- | --- |
| lake-background.png | 2900 × 1000 | RGB, opaque |
| boat-room-background.png | 1920 × 1080 | RGB, opaque |
| celebration-background.png | 1920 × 1080 | RGB, opaque |

The lake's 17-pixel top and bottom white strips are excluded by presentation source rectangle `[0, 17, 2900, 966]`, not by modifying the original. Uniform scale and a single non-repeating backdrop with bounded horizontal pan avoid distortion and repeating seams. World objects and the race camera scroll independently. The Boat Room and celebration backgrounds are suitable for their intended scenes with configurable safe areas and character/podium anchors. Runtime appearance remains to be tested during implementation.

The five corrected numbered images were shown inline with this upload, but no downloadable corrected source files are present in the ZIP or workspace. They appear visually improved, but their original PNG dimensions, alpha and hashes cannot be verified. The five prior originals remain unchanged with their existing flags. Corrections are not registered or backed up; obtain their downloadable source ZIP before claiming those issues resolved. Do not reconstruct originals from previews.

## Background integration direction to preserve

Lake: preserve aspect ratio and render the configured border-free source rectangle. Fit it with one uniform scale, pan within available horizontal crop margin, and clamp at both edges. Map backdrop pan to normalised course progress; do not wrap, mirror or tile. If no pan margin is available, keep the backdrop fixed while world objects scroll. The actual world camera remains independent, so finish lines enter naturally without changing boat distances. Reduced motion fixes the backdrop. No scrolling renderer has been built yet; verify visual behaviour across viewports during implementation.

Boat Room: use behind interactive selection/scramble UI. Keep controls in accessible HTML with adequate contrast, focus visibility and touch targets, rather than relying on artwork alone. Configure safe areas by viewport.

Celebration: align full-body characters to configurable podium/ground anchors and preserve individual scaling and pose offsets. Keep the creator's simple neutral/celebrating alternation, small bounce and different character rhythms. Use static celebrations for reduced motion. Avoid placing results text directly over busy art. No animation is implemented yet.

## GitHub preservation and restoration

All 152 numbered originals were previously restored in an independent fresh GitHub clone at `fabefe5c13893e543c5724746bf210a8603510e3`, with every hash matching. The final background/audit stage adds three originals for a total of 155, all referenced in the manifest. The completion response records the exact pushed final commit and outcome of another fresh clone audit of that commit. Corrected inline-only source updates are excluded from that preservation claim.

Reproduce the library audit from a fresh checkout with Python 3.9 or newer, without third-party dependencies:

```sh
python3 scripts/audit-artwork.py
```

The audit fails on missing/orphaned files, incorrect page/background inventories, duplicate asset IDs/paths, SHA-256 changes, invalid PNG chunk CRCs or compressed image streams, metadata mismatches, and broken artwork pair references. Current sources use non-interlaced 8-bit RGB/RGBA PNGs; new unsupported formats fail explicitly. Intake additionally performed full image decoding and visual review. The original ZIP files are not required for restoration because each extracted original and its hash is tracked.

## Remaining issues and implementation boundary

- Downloadable corrected sources for pages 49, 51, 119, 133 and 154 are needed to verify and integrate the creator's fixes. Preserve the earlier originals if revised files arrive. This does not block verification or backup of the complete original library, but those five compositing issues remain unresolved in the checked-in files.
- No required numbered artwork or background is missing from the original inventory. Section labels 43 and 50 were deliberately excluded; accidental 159 was removed as requested.
- No game implementation is included in this stage. Proceed with development only after delivering this report and the creator's subsequent implementation instruction. Later gameplay decisions can be resolved at their respective stages rather than blocking unaffected artwork foundation work.
