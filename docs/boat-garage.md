# Pass 2 — Boat Garage

The untimed Garage replaces the equipment scramble. It retains the Special Sparks identity, boat gamble, four challenges, official artwork, Pass 1 compositor, scoring, race physics and Pages/offline delivery. The supplied [creator brief](boat-garage-brief.md) is preserved verbatim.

Each fresh garage visit generates ten unique offers using the seeded RNG: three propulsion, three flotation/stability, two braking/steering and two wild inventions. Every one of the 28 original parts remains eligible. A visit's offers stay fixed while experimenting; a new challenge/replay gets a new seed and selection. The player can add/remove/replace parts freely, with no timer or rival claims. Three explicit slots preserve gaps; removing slot 2 leaves slot 3 in place. A fourth selection gives clear feedback and never silently replaces a choice. Zero-equipment boats are allowed.

Rivals have independent supplies from all 28 parts. Foxy and Nibbles lean towards propulsion, Ruby flotation, Dizzy unusual inventions and Tilly braking/steering. Each independently chooses two preferred parts plus a third random distinct part. Parts can overlap across competitors. Lantern and three rotating rivals remain the exact four racers.

The live high-DPI preview uses the existing Boat Room background and Pass 1 `drawRaceBoat`, including boat-specific seats, handline clipping, hull masks, stable face-safe mounts and original proportions. The preview fits the complete boat/character/equipment bounds so low-mounted and tall parts stay inside the canvas. Selected equipment appears on the boat and in labelled removable slots. A small boat nod acknowledges changes; system and manual reduced-motion settings suppress it. Selected cards have both colour and text/check states, native buttons, keyboard focus and `aria-pressed`. Shelf scroll and focus survive selection changes. Desktop/tablet use a sticky boat panel alongside independently scrolling shelves; narrow phones stack the two areas. The race-ready confirmation and established race actions are retained.

Cards pair the existing playful hint with plain-language effect descriptions derived from existing stat deltas, including trade-offs. No numerical stat dashboard or altered balancing is introduced. Existing time-limited automatic effects such as fizz/battery exhaustion still work as before.

## Foundation for Pass 3

`Equipment.behavior` supports a passive/activated mode and optional duration, cooldown and one-use fields. **All current equipment remains passive/automatic.** Changing this metadata alone does not implement an ability; Pass 3 must explicitly add simulation transitions and controls. There are no new activation buttons in this pass.

`Garage.loadouts` contains three ordered nullable slots per competitor. The race receives both the active equipment IDs and copied slot arrays, validates their consistency, and preserves the arrays on each racer. A read-only three-slot strip carries the player's configuration into the race. Exported race logs include the four slot arrays. The existing simulation still consumes active equipment IDs, so slots and future ability configuration do not change current physics.

## Verification

Unit tests cover deterministic ten-part mixed offers, eligibility of all 28 parts across sessions, uniqueness/capacity, free removal/replacement, independent rival choices, zero-to-three selections and empty-slot preservation into races. Existing all-seven-boat/all-four-challenge simulation tests remain.

Browser tests exercise all seven garage boats, live equipment previews, slot persistence on launch, a ten-minute untimed visit, replacement/keyboard focus, shelf scroll preservation, desktop/tablet layout, all four race journeys, existing composition snapshots, both offline editions and hosted subpaths. Actual desktop/tablet screenshots are reviewed, not just test results. See [desktop](review/garage-desktop.jpg) [tablet](review/garage-tablet.jpg), and [all seven equipped previews](review/garage-boats.jpg). Seven committed Garage preview snapshots guard against composition regressions. The original art manifest and all 160 PNG sources are unchanged; the artwork audit remains required.

Reproduce using README instructions: `npm ci`, `npm run portable`, `npm test`, `npm run test:browser`, and `python3 scripts/audit-artwork.py`. Check the exact Pages artifact with `VITE_BASE_PATH=/Special-Sparks-Boat-Race/ npm run build` then `npm run test:pages`. The existing `work` workflow performs these checks automatically before deployment.

First playtest: ask children to explain a trade-off, remove a middle-slot part, browse the lower shelves and try a fresh set of ten. Check tablet/smartboard reach and whether the preview is large enough at classroom distance. No reshuffle button is supplied during a visit; a replay starts a fresh workshop. Browser automation targets Chromium; Safari/iPad hardware still needs a hands-on check.

## Completed checks

- Production and portable builds: passed (standalone HTML remains 22.6 MiB).
- Unit suite: 29 passed, including the existing four-challenge/seven-boat tests and new Garage model tests.
- Full browser run: 21 passed; final targeted Garage/selection/offline reruns passed after preview-fit and scroll/focus fixes. The added lower-shelf regression also passes.
- Seven new Garage visual baselines: recorded, inspected, then compared successfully without snapshot updates. Existing 14 race-composition baselines remain unchanged and passed.
- Original artwork audit: all 155 active assets and five archived original PNGs passed, with no source edits.
- Exact `/Special-Sparks-Boat-Race/` production build and Pages/offline browser test: passed.
- TypeScript, formatting and `git diff --check`: passed.

The completion response records the pushed commit and independent remote verification. Git push success is separate from confirmation that GitHub Actions has finished deploying the website.
