# The Very Serious Boat Race (Not Really)

A complete illustrated browser game from the Special Sparks collection: six characters, seven questionable boats, 28 equipment parts and four very different challenges. Uses the creator's official artwork throughout.

## Browser preview and hosting

The game is a normal static Vite web application. Website hosting is the primary way to play and test it; the standalone edition is secondary.

```sh
npm ci
npm run dev
```

Vite listens on `0.0.0.0:5173` on a fixed port. Use the local URL on your own development machine, or a real forwarded URL if the Codex client exposes port forwarding. This session currently has no forwarding/public-preview URL tool, so a cloud loopback address or workspace HTML link is not an accessible creator preview.

GitHub Pages is the permanent browser preview. Every push of approved changes to **work** now runs the full checks and deploys only after they pass. Expected site: **https://jessejet2004.github.io/Special-Sparks-Boat-Race/** (this is not a claim that the first deployment has succeeded). The repository owner must first set **Settings → Pages → Source: GitHub Actions**, enable Actions if restricted, and allow `work` in any `github-pages` environment branch rules. See [Pages setup and deployment](docs/hosting-and-preview.md). No Cloudflare account is required.

`npm run build` produces the static website in `dist/`. `npm run preview` serves it on fixed port 4173. `npm run preview:subpath` serves it beneath `/special-sparks/boat-race/` on port 4174 for deployment checks. Relative build links support domain-root and subpath hosting. Optional `VITE_BASE_PATH` selects a fixed deployment prefix. The developer artwork workshop is `/gallery.html` beneath the same deployment path.

For occasional offline distribution, `npm run portable` still produces **Boat-Race-Play.html** and **Boat-Race-Portable.zip**. Routine hosted testing does not require downloads.

## Controls and rules

Choose a challenge, then accept a boat or reject up to three offers. The fourth distinct offer is compulsory. Tap/click equipment to claim up to three shared parts during the default 20-second scramble; tap a chosen part to put it back. Rivals claim exclusive parts too. Untimed equipment picking is available on the home screen.

- **Fastest Race:** reach the line first. Space or the large button gives a short paddling burst, followed by a cooldown.
- **Slowest Race:** finish last while still finishing. Gentle braking helps; eight seconds stranded or the 115-second course limit means a friendly tow. Rescued boats cannot win over legal finishers.
- **Picnic Panic:** stop closest to the target. Brake once, then glide. Use the distance and stopping estimate; excessive overshoot receives a tow.
- **Wobbly Waters:** survive ten increasingly large waves. Brace just before impact; surviving waves, remaining hull and water aboard decide the order.

Tab and Enter navigate controls; Space activates the race action; **P** pauses and **Escape** resumes. Switching tabs automatically pauses. Pause freezes the scramble and simulation; the pause dialog can also leave the race. Reduced motion, optional quiet sound cues and large touch controls are provided. Lantern is the player, alongside three seeded, rotating computer-controlled rivals from the other five characters. Smartboard groups can discuss choices and take turns; this is not a simultaneous multiplayer game.

## Reproduce from GitHub

```sh
git clone https://github.com/jessejet2004/Special-Sparks-Boat-Race.git
cd Special-Sparks-Boat-Race
git switch work
npm ci
npm run portable
npm test
npm run test:browser
python3 scripts/audit-artwork.py
```

Use **Node 24.22.1**, npm **11.9.0**, and Python **3.9+**. Node is pinned in `.nvmrc`; dependencies are pinned in `package-lock.json`. Chromium browser tests default to `/usr/bin/chromium`. Set `CHROMIUM_PATH` to an installed Chromium executable on another platform. Alternatively install the Playwright Chromium build with `npx playwright install chromium` ; the test configuration uses the installed Playwright Chromium when no system Chromium or explicit path exists. No application credentials, CDN, account, analytics service or external API is required.

Commands:

| Command                            | Purpose                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`                      | Prepare artwork and start Vite development server                                         |
| `npm run build`                    | Verify/prepare artwork, type-check, build and generate offline cache                      |
| `npm run preview`                  | Serve the production website on fixed port 4173                                           |
| `npm run preview:subpath`          | Check the website under a mounted URL path on port 4174                                   |
| `npm test`                         | Pure gameplay and artwork configuration tests                                             |
| `npm run test:browser`             | Browser gameplay, gallery, responsiveness, pause and offline checks; build portable first |
| `npm run portable`                 | Build web edition, standalone HTML and portable ZIP in `artifacts/`                       |
| `python3 scripts/audit-artwork.py` | Verify all 160 original PNG files and provenance links                                    |

The ZIP includes the standalone HTML, complete local web build and launch instructions. The hosted web edition caches every local file through a versioned service worker; wait for **Offline ready** before disconnecting. Service workers require HTTPS or localhost. The standalone HTML embeds its artwork and does not require a server, cache installation or network connection. The source repo tracks everything needed to regenerate the distributable; generated build files are ignored.

## Architecture and artwork

Gameplay rules and seeded fixed-step simulation live in `src/game/`. Canvas rendering lives in `src/rendering/`; HTML controls/results are in `src/main.ts`. Character fallback poses, per-boat seats, foreground masks, waterlines and mounts are in `src/artwork/`. The gallery has separate race/selection composition modes, three equipment selectors, alignment guides, and an all-42-seats review matrix. Export race placement JSON into `src/artwork/race-config.ts`; selection values stay in `src/artwork/config.ts`. Commit adjustments. Runtime dependencies: none; build/test tools are development-only.

The [official manifest](assets/manifest.json) records **155 active assets plus five archived earlier sources**. All 160 original PNGs remain unchanged. The five white-backed earlier exports are superseded by verified transparent corrections. [Audit](docs/artwork-library-audit.md), [background intake](docs/artwork-intake-backgrounds.md) and [correction intake](docs/artwork-intake-corrections.md) record their provenance. Batch-specific inventories remain in `docs/artwork-intake-batch-*.md`.

`npm run assets` verifies active source hashes and generates cropped/resized WebP runtime derivatives in `public/art/`, with a source-to-runtime registry. The lake's white strips are cropped in the derivative recipe; originals are never changed. A single aspect-preserving backdrop pans within bounds without tiling; world objects and camera move independently. Drawing a prop never creates a collision hazard automatically.

The [race presentation report](docs/race-presentation-overhaul.md) records the high-DPI diagnosis, source resolutions, per-boat masks/mounts, visual review, and remaining limits. Visual snapshots are checked in under `tests/browser/presentation.spec.ts-snapshots/`; update them intentionally with `npx playwright test tests/browser/presentation.spec.ts --update-snapshots` after reviewing the new compositions.

The [original design brief](docs/boat-race-design-brief-v1.md), [approved architecture proposal](docs/boat-race-development-proposal.md), [implemented defaults](docs/gameplay-decisions.md) and [playtest guide](docs/playtest-guide.md) explain scope and the first balance pass.

## Preservation and development

Follow [AGENTS.md](AGENTS.md). Completed stages are committed and pushed to `work`, and verified against the remote commit. Never call a local-only commit backed up. All source, configuration, tests, artwork and documentation are in GitHub; no previous cloud environment or conversation is needed. Preserve originals; add revised source files with provenance rather than overwriting them.

## Current limits

This is a first playable balance pass, not a tuned competitive game. It is a single player experience with three rivals, no online multiplayer or saved campaign. Only brief synthesised sound cues are included; there is no music or supplied voice audio. Chromium is the automated browser target; Safari/iPad, Firefox and actual classroom hardware still need human playtesting. The cloud browser blocks direct `file://` navigation by policy, so the standalone document is tested as a self-contained response with external network access blocked; test double-click launch on the intended school device too.
