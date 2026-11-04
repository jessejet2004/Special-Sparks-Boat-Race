# Boat Race development proposal

Status: approved for full autonomous implementation by the creator after final artwork intake. The original proposal is retained below as design history. See README.md and gameplay-decisions.md for current implementation and resolved defaults.

The authoritative design is [the supplied Version 1 brief](boat-race-design-brief-v1.md). This document proposes architecture and identifies open decisions; it does not replace the brief or the still-missing official equipment inventory. The repository currently contains documentation and an empty asset manifest, with no prototype, code, artwork, dependencies, or tests. The earlier prototype's camera behaviour can be implemented from the brief; exact comparisons require the prototype or a recording if available.

## Proposed architecture

Use TypeScript, Vite, and native HTML/CSS with a small Canvas 2D scene renderer. Avoid a framework or full game engine initially. HTML supplies accessible menus, buttons, instructions, results, and gallery controls; Canvas draws the layered river scene. Required interactions have touch/mouse and keyboard controls, with readable state outside Canvas. Keep rendering resolution separate from world coordinates and account for device pixel ratio without changing simulation distances.

Keep gameplay as pure TypeScript modules without DOM, Canvas, clocks, or asset-loading dependencies. A seeded random generator and fixed simulation step make outcomes repeatable. Capture player actions with their simulation tick; rendering interpolates state using requestAnimationFrame. Challenge rules determine progress, completion, disqualification/rescue, and ranking; rendering only presents those results. Handle pause and hidden tabs explicitly rather than advancing a scramble or race unpredictably.

Use Vitest for simulation, selection, allocation, results, and registry validation; use Playwright for browser integration, keyboard/touch interaction, image loading, gallery, and responsive checks. These are development dependencies, not runtime game libraries. Pin the Node version, record npm version, and commit package-lock.json when implementation begins. Verify a clean `npm ci`, test, browser-test, and production-build workflow before marking Stage 1 complete. No packages need installing for this proposal.

Portable production output should contain local bundled assets, with no CDN or online API requirement. Define portable-build hosting and offline scope before the release stage. A service worker can later provide offline revisits after an initial successful load; test cache updates and actual offline operation rather than assuming a normal browser cache is sufficient. Direct file:// support is a separate requirement if desired.

## Proposed file structure

```text
AGENTS.md
README.md
docs/
  boat-race-design-brief-v1.md
  boat-race-development-proposal.md
  artwork-import.md                  # import process and authoritative page maps
assets/
  manifest.json                     # tracked source/provenance inventory
  originals/<batch>/                # unchanged official PNGs; original filenames
  derived/<batch>/                  # generated crops/optimised copies, if needed
src/
  app/                              # flow/state transitions and accessible HTML UI
  game/
    model.ts
    random.ts
    selection.ts
    equipment.ts
    challenges/                     # one rules module per challenge
  artwork/
    registry.ts                     # typed asset IDs and presentation config
    poses.ts
    boats.ts                        # seats, layers, waterlines, mounting anchors
    loader.ts
  rendering/
    scene.ts
    camera.ts
    boat-composite.ts
  gallery/                          # separate developer entry point
  styles/
tests/
  unit/
  browser/
scripts/
  validate-assets.mjs
index.html
gallery.html
package.json
package-lock.json
vite.config.ts
tsconfig.json
```

This is a future structure, not a request to create empty modules now. Stage 1 creates only the modules needed for its milestone; later stages add gameplay modules as required. Vite should bundle registry-referenced artwork into production output without duplicating the original files in source control.

## Artwork registry and composition

Separate source provenance from adjustable presentation. Extend the existing `assets/manifest.json` when actual files arrive. Each source entry records stable semantic ID, unchanged path and filename, batch identifier, exact export page number, authoritative name/category, source reference, known rights/attribution, dimensions, and SHA-256. Derivatives additionally reference the source asset ID and reproducible transformation settings. Validate unique IDs, file existence, checksums, page mappings, and references. Never identify an asset solely from its numbered filename or silently guess an ambiguous mapping. Check GitHub size limits before importing large batches; if needed, agree a Git LFS approach and document restoration before committing oversized assets.

The typed runtime registry references those IDs and supplies crop rectangle, transparent content bounds, pivot, scale, layer, and animation-state mappings. Crop coordinates refer to original pixels; composition anchors use normalised boat-local coordinates so resizing remains consistent. Configuring a crop must not alter the source PNG. Derivative generation is optional and must preserve originals.

Each boat has a small ordered layer stack, a waterline, a character seat anchor, a character scale/depth, and equipment mounting anchors with allowed categories, scale, rotation, and draw order. Compose rear boat, rear equipment, seated character, foreground rim, and front equipment in a configurable order. An original image may be drawn in multiple clipped regions to place its rim in front of a character; if clipping is insufficient, record a derivative mask referencing the untouched source. Do not assume every boat needs the same layer solution.

Raft: seat on top. Teacup and welly: seat inside the opening with appropriate foreground occlusion. Bathtub, box, doughnut, and basket: tune individually. Store per-character/per-pose offsets only when necessary, so switching to a worried or paddling pose does not cause a visible jump. Inspect gallery combinations before accepting placement values.

Map events such as idle, paddling, worried, celebrating, and surprised to each character's actual supplied pose IDs. Use explicit character-specific fallback chains that end at a verified available neutral pose; report missing required assets in the developer gallery. Do not invent identical pose sets for all characters. Production missing-image handling should remain legible and avoid broken-image icons, but it must not silently substitute unrelated artwork.

Equipment entries remain empty until the authoritative 28-part page map arrives. Future definitions will separately reference artwork IDs, simulation effects, interactions, mount category, and visible consequence events. The brief's examples are design references, not a complete inventory or approved balance values. Seven boats only; the flying saucer is excluded from registry validation and selection.

The gallery should enumerate imported assets, display provenance and loading errors, and offer character/pose/boat selectors, adjustable crop/seat/scale/waterline/layer controls, and mount-anchor overlays. Persist approved adjustments in repository configuration, not browser storage alone. Add equipment and encounter views as those assets arrive; do not manufacture stand-ins to fill them.

## Decisions to resolve

Stage 1 needs the authoritative page-to-asset map and agreement on the proposed foundation and first milestone. Other decisions can wait until their relevant stage:

1. **Boat selection:** Is the challenge known before offers? Are offers uniformly shuffled? Recommended proposal: show the challenge first, four distinct uniformly shuffled offers, final offer forced. Confirm how competitors receive boats.
2. **Scramble:** How many parts may each racer claim? Can players swap/release parts, do copies exist, and what happens on simultaneous claims? What accessible untimed/extended-time option is desired? Set these after receiving the official inventory, before Stage 3.
3. **Player control:** Are Fastest and Slowest largely automated after equipment selection, or do they include active steering/paddling? Is Picnic braking a one-way action or can it be released? What active decisions does Wobbly Waters require? These determine controls and simulation scope before race stages.
4. **Fairness and failure:** Set encounter frequency, AI knowledge, race time limits, and tie rules. Recommended Slowest principle: only unassisted legal finishers qualify to win; stops trigger a clearly announced grace period, then rescue rather than an indefinite race. Confirm exact rules before Stage 5.
5. **Picnic and survival scoring:** Confirm signed/absolute picnic distances, ties, and handling wrecks; define wave survival credit, last-wave ties, rescue ranking, and whether recovered boats can rejoin.
6. **Session and portability:** Confirm pause/background-tab behaviour, reduced-motion expectations for the scrolling course, and whether offline means portable locally hosted build, cached offline revisits, or double-click file support. No accounts, analytics, or external services are proposed.

Keep open questions explicit rather than baking unapproved mechanics into code. Exact equipment disadvantages and combinations await the authoritative inventory and creator review.

## First official artwork delivery

For a small first milestone, request:

- Lantern's six transparent PNG poses and their exact event/name mapping.
- The Good Old Bathtub illustration; its matching fallen piece can wait until damage work.
- The seven reusable lake environment illustrations with the intended layering/page map.
- A ZIP/batch identifier and source/rights information for the manifest; note any known crop, waterline, or seating guidance.

If convenient, include all seven boats in the first ZIP to calibrate every seating arrangement early. They are required before Stage 2 acceptance. Animal poses, the Boat Room, the 28 mapped equipment parts, encounters, fallen pieces, challenge props, and celebration background can follow. Do not block the first small scene on those later batches.

## Proposed first Stage 1 milestone

**One official illustrated lake scene and a developer composition gallery:** Lantern in the Good Old Bathtub, using supplied lake artwork. This is the first slice of Stage 1, not completion of all Stage 1 asset coverage or a playable race.

Acceptance criteria:

1. Fresh checkout plus documented pinned tools can run `npm ci`, development server, tests, browser tests, and production build. Verify production output with a local server; no network artwork dependencies.
2. Every imported original matches its recorded SHA-256 and page mapping. Manifest validation rejects missing paths, duplicate IDs, and invalid references. No invented illustrations or equipment.
3. Lake scene uses official artwork; Lantern sits correctly in the bathtub at narrow tablet and desktop/classroom sizes. Foreground occlusion, waterline, and pose alignment are inspectable.
4. Gallery shows all assets supplied in this batch, all supplied Lantern poses, and the bathtub composite. Adjustments have a documented route into tracked registry configuration. Unsupported future categories clearly say assets are pending.
5. Image-load failures and pose fallbacks have automated coverage. Browser tests verify loaded images and composition controls, keyboard focus, touch-sized controls, reduced-motion mode, and layouts at representative 768x1024 and 1366x768 viewports. Review visual screenshots as well as assertions.
6. No race, selection, scramble, equipment mechanics, or placeholder complete-game flow is included. No game timer is necessary for this scene milestone.
7. Source, registry, tests, asset originals, and instructions are committed and successfully pushed; verify remote branch SHA and report it. A clean temporary checkout of that pushed commit can repeat installation, checks, and build before declaring the milestone reproducible.

Remaining Stage 1 work then extends the same gallery and configuration to all official characters, boats, and supplied scene assets without changing architecture.

## Preservation at every stage

Continue on `work` unless the user requests a branch change. Before each stage inspect status and verify GitHub access. Preserve unrelated changes. Run relevant checks, review the diff and manifest, commit the completed stage, push, then query the remote branch and compare its full commit ID. Report checks, branch, commit, and actual push outcome. If access or push fails, report immediately and do not call the work backed up or proceed into the next stage while its required push is unresolved.

Keep design decisions, commands, tool versions, dependencies, artwork provenance, and adjustment settings in GitHub with the implementation. Never rely on chat, local storage, environment snapshots, untracked assets, or a running process for restoration. Keep secret values outside Git. A later environment restores from GitHub and follows README; it need not access this conversation. No cloud install/start changes are needed until the implementation workflow exists.
