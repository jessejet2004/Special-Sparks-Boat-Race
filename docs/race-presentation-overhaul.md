# Race artwork and presentation overhaul

Scope: the creator's [presentation brief](artwork-race-presentation-brief.md). This pass keeps the homepage/selection composition and gamble, seven boats, four challenges, scoring/ranking formulas, accessibility options, offline delivery and Pages configuration. The requested gameplay change is four active competitors rather than six.

## Rendering diagnosis

The original race canvas allocated one bitmap pixel per CSS pixel, regardless of device pixel ratio. An actual DPR-2 desktop capture measured **1320 × 648 backing pixels for 1320 × 648 CSS pixels**: the browser enlarged that bitmap onto twice as many device pixels in each direction. The original race renderer also drew boats around 80–116 CSS pixels wide, while selection showed much larger illustrations. Downsampling those bold outlines and then enlarging the low-density canvas lost detail.

All relevant PNG exports are 2000 × 2000, including transparent margins. Actual trimmed hull widths are **1344–1673 px**, seated-pose widths **1219–1654 px**, and equipment widths **645–1216 px**. Thus the original sources have enough resolution for the intended race sprites. The previous shared WebP recipe capped all non-background art at 600 × 600, quality 88; selection and races used the same derivatives. There was no separate high-resolution race variant. No pixel-art CSS or nearest-neighbour setting was responsible. Sprites were drawn directly from images, without chains of resized intermediate canvases; the principal extra enlargement occurred at the canvas-to-screen boundary.

`prepareCanvas` now allocates CSS size × device pixel ratio (capped at 3 for memory), resets the coordinate transform on each frame, and enables high-quality image smoothing. The final desktop capture measured **2228 × 1536 backing pixels for 1114 × 768 CSS pixels at DPR 2**. Simulation and layout still use CSS coordinates. Bitmap dimensions change only on a viewport/DPR change, not every frame.

The race pipeline uses source-backed WebP variants up to 1200 px for hulls and poses and 900 px for equipment, quality 94 with full alpha quality. No source is enlarged; small sources keep their native dimensions. The lake race derivative retains the full 2900 × 966 cropped source region. Selection and homepage keep their existing artwork recipe and compositor. No sharpening, generated replacements, new illustration or original-file editing is involved.

The asset cache now keys the source hash, crop, dimensions, quality and encoder version. Recipe changes therefore regenerate derivatives even when source modification timestamps have not changed. The registry records dimensions, original hash/path, crop and recipe hashes. Both offline editions include the additional variants.

## Composition and equipment

`src/artwork/race-config.ts` holds a separate race configuration for each boat: seat anchor, character height, waterline, front-hull polygon and named equipment mounts. The raft's raised front edge, the welly opening, the teacup rim and the basket's offset seat each have their own geometry. The original selection settings remain in `src/artwork/config.ts`.

Characters are height-scaled and aligned to per-character/per-pose handlines and head anchors rather than fitting every cutout into the same width. The compositor draws rear equipment, the boat, the seated cutout, only the front-hull polygon, then foreground equipment. It clips the supplied curved ledge at render time; originals retain it. Masts and sails remain behind faces. The whole composite shares one translation/rotation, so characters and parts move with the boat during bobbing, damage and scrolling.

All 28 parts have a presentation category independent of their gameplay definition. Overhead, water, propulsion, flotation and deck items prefer different named boat mounts. Connections meet the hull; tall items can use outer rigging points if inner mounts are occupied. The allocator checks rotated bounds against a fixed envelope covering all seated reactions and against other selected parts, and can modestly reduce equipment scale. This keeps faces clear, parts separate and slots stable when a character paddles or reacts. Losing a part can free its mount. The constraints use conservative rectangles, not pixel-perfect collision physics.

The artwork workshop (`gallery.html`) now supports separate race/selection modes, three equipment selectors, alignment guides and an all-42-seats matrix using the real race compositor. Pose and equipment selections also apply to the matrix. Export race adjustments into `race-config.ts`; export selection adjustments into `config.ts` and commit them.

## Four-racer scene

A seeded roster always contains Lantern and three distinct rivals selected from Foxy, Ruby, Dizzy, Nibbles and Tilly. Fresh races/replays can select a different trio; identical seeds reproduce the roster. Scramble ownership, AI turn cycling, encounter targets, names, logs and results use that roster. Character-specific personality multipliers remain tied to identity, not whichever lane a rival occupies. Only the four racers are ranked. The other two characters cheer beside the existing dynamic results podium.

Scrolling challenges use four water lanes with larger hulls sized to the available vertical space (normally about 126–151 CSS px on desktop/tablet, up to 180 on larger scenes). Labels follow alongside each hull; Lantern retains the gold waterline and YOU badge. Wobbly Waters uses a fixed two-by-two survival fleet with hulls up to 240 px. Decorative scenery is sparser and occupies the bank band. The lake pans within a central crop, retaining its aspect ratio and avoiding the large baked-in foreground plants over racers; it never tiles or stretches. World scale is fixed per viewport/challenge, edge names identify out-of-view racers, and Picnic still settles before the target. Reduced motion keeps its static backdrop and stepped camera.

Desktop race controls sit beside the river so the action is accessible on laptop screens. Tablet scene height reserves room for a sticky readable control panel; the panel stays clear of the bottom boat. The race view is taller to give four illustrated lanes breathing room; small portrait screens may require vertical scrolling. The homepage and boat-selection layout are preserved apart from the factual three-rivals label.

## Verification and review

- Unit coverage includes all seven boats completing all four challenges, deterministic replay, scoring/ties, equipment effects and camera plans.
- Presentation checks cover deterministic four-person roster rotation and **963,144** combinations: 3276 equipment triples × 42 seats × seven pose requests, using official trimmed-source dimensions. Each verifies no face/gear overlap. Additional checks ensure selected mount transforms remain identical through reactions/paddling and all six selection orders of every equipment triple can be allocated.
- Fourteen committed visual baselines show all 42 seats in neutral and paddling poses, with balloons, spoon and sponge. These use the real race compositor at DPR 2. Review changes before intentionally updating snapshots; the browser tolerance allows minor rasterisation differences, not missing objects.
- Browser moving-race captures cover all four challenges at 1440 × 1000 and 768 × 1024, DPR 2, at approximately 1, 8 and 20 seconds. Review checks include waterline alignment, faces, mounts, labels, scenery, scrolling and survival framing. The original full challenge journeys also exercise actions, pause/resume, rescue and four-place results with all six characters present at celebrations.
- Production tests retain root and hosted-subpath asset loading, offline/standalone play, selection, desktop controls, smartboard responsiveness and the exact `/Special-Sparks-Boat-Race/` Pages build. The artwork audit verifies all 155 active sources and five archived original PNGs.

Reviewed captures: [before](review/race-before.jpg), [desktop](review/race-desktop.jpg), [tablet](review/race-tablet.jpg), [42-seat matrix](review/seating-matrix.jpg), [three overhead parts](review/equipment-overhead.jpg), and [propulsion/water parts](review/equipment-drive-water.jpg). Final command outcomes accompany the completion report. Generated full-resolution captures remain in `artifacts/`; representative review captures are committed beside this document. The tests reproduce the review without a prior cloud environment.

## Remaining limits

These are raster illustrations, not vector or skeletal assets. Details inside the originals already have some softness; the full-screen lake is necessarily magnified to fill a tall river view and remains softer than the small, high-resolution foreground sprites. No individual hull, pose or equipment source was found too small for its normal race display size. Extreme browser zoom, huge displays beyond the DPR cap and small equipment silhouettes cannot acquire detail absent from the source. Three tall rigging items may extend beyond the hull, attached by visible lines; silhouette/face separation takes priority over physical realism.

The masks and mount allocator are deliberate 2D cutout composition. Pose switching has the approved handmade character; it is not fluid articulated paddling. On narrow screens the camera may show edge labels for widely separated rivals. Hardware playtests should check visibility from the back of the classroom, touch reach and scrolling on the actual tablet/smartboard. Safari/iPad and Firefox remain human-playtest targets; automated checks use Chromium. Gameplay rebalance and new mechanics are outside this pass.

## Completed validation

- `npm run portable`: passed; standalone HTML 22.6 MiB, plus a portable ZIP and web build.
- `npm test`: **27 passed**, including all four challenges × seven boats, pose/mount invariants and all equipment selection orders.
- `npm run test:browser`: **19 passed**. After the final tablet/workshop-only spacing adjustment, the affected moving-tablet, gallery, laptop-control, visual-snapshot and offline checks were rerun.
- `VITE_BASE_PATH=/Special-Sparks-Boat-Race/ npm run build` followed by `npm run test:pages`: **passed**; all artwork loads and a race launches offline at the exact repository path.
- `python3 scripts/audit-artwork.py`: **passed**; all 160 preserved PNGs and provenance links verified. No source artwork or official manifest mappings changed.
- `git diff --check`, TypeScript build and formatting checks: passed.

The completion response records the pushed commit and independent remote verification. A successful push is not itself proof of a completed Pages deployment.
