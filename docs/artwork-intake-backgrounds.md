# Final official background intake

Source: creator upload `backgrounds.zip`. The ZIP contains exactly the three expected filenames; no extras or missing files. ZIP CRC, PNG verification, full decoding and visual inspection passed. Archive and individual file SHA-256 hashes are recorded in `assets/manifest.json`.

Original files are preserved byte for byte in `assets/originals/batch-12-backgrounds/`. No image was edited, recompressed, cropped or substituted.

| Original filename | Dimensions | Mode / transparency | Intended scene |
| --- | --- | --- | --- |
| lake-background.png | 2900 × 1000 | RGB, opaque, no alpha channel | All four race challenges |
| boat-room-background.png | 1920 × 1080 | RGB, opaque, no alpha channel | Boat selection and equipment scramble |
| celebration-background.png | 1920 × 1080 | RGB, opaque, no alpha channel | Results and full-body celebrations |

## Lake border and scrolling configuration

The lake has 17 near-white full-width rows at both top and bottom. The manifest records render-only source rectangle `[0, 17, 2900, 966]` as x, y, width, height. This excludes the borders while leaving source bytes untouched. Preserve aspect ratio using a uniform scale, never independent horizontal/vertical stretching.

Use one scenic backdrop, not repeated tiles: after fitting the cropped source to the viewport, pan only within its available horizontal crop margin and clamp at both ends. Map overall course progress to that bounded backdrop pan. The actual world camera, boats, finish, scenery and encounters move independently and retain their real world distances. If a viewport leaves no horizontal crop margin, keep the scenic backdrop fixed while world objects scroll. This avoids edge joins, wrapping jumps, mirrored scenery and distortion without inventing replacement art. Reduced motion fixes the background crop. Runtime visual verification at different aspect ratios is still required during implementation; no scrolling renderer has been built at intake.

The wide water region is suitable as the course foundation. Foreground rocks and reeds are baked into the image, so establish a clear water play area and keep boat/equipment silhouettes legible. Do not make baked-in scenery into collision hazards automatically.

## Boat Room and celebration suitability

The Boat Room has a useful open floor/central area. Its busy walls should sit behind readable HTML UI panels with explicit safe areas, contrast, focus and touch targets. Do not make illustrated wall objects the only controls. Preserve aspect ratio on narrow screens and allow accessible UI to reflow outside the artwork where needed.

The celebration image has a central three-place podium and surrounding ground suitable for all six full-body characters. Configure podium/ground anchors, individual character scale and pose alignment rather than changing originals. Retain the creator's neutral/celebrating cutout alternation and small bounce with individual rhythms; use a static celebrating pose for reduced motion. Results text must remain legible without covering character faces.

## Five corrected numbered illustrations

At the background intake stage, only inline previews of the corrections were available. The creator has since supplied `remaining illustrations .zip`; all five corrected originals are verified and active. Earlier originals remain preserved unchanged. See [corrected artwork intake](artwork-intake-corrections.md) for exact mappings, provenance and verification.

## Implementation status

This stage performs artwork intake, presentation configuration and audit only. The creator requested a report after backup and restoration verification, before proceeding with playable-game implementation. No game implementation was started here.
