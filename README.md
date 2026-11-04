# Homeroom

Boat Race development repository. Full playable implementation is authorised and being built in verified stages.

The creator's [Version 1 design brief](docs/boat-race-design-brief-v1.md) and [development proposal](docs/boat-race-development-proposal.md) are saved in this repository. The original artwork batches are now imported; the creator requested the final audit and backup report before proceeding with implementation. Official artwork is used throughout; see development commands below.

## Restore from GitHub

Prerequisite: Git and access to this GitHub repository.

```sh
git clone https://github.com/jessejet2004/Homeroom-codex-test.git
cd Homeroom-codex-test
git switch work
git status --short
```

`work` is the development branch. Completed stages are committed and pushed there. Restore that branch to recover completed development work; a cloud environment or prior Codex conversation is not required.

## Installation, development, build, and tests

Use Node 24.22.1 (see `.nvmrc`), npm 11.9.0 and Python 3.9+ for the source-art audit. Browser tests use Chromium (`/usr/bin/chromium` by default); set `CHROMIUM_PATH` for another installed Chromium executable.

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:browser
python3 scripts/audit-artwork.py
```

The developer composition gallery is at `/gallery.html`. `npm run assets` verifies source hashes and generates cropped, resized WebP runtime copies plus their source mapping in `public/art/`. Originals are never modified. Generated copies are reproducible and ignored in Git; the build includes them automatically. Save gallery placement exports into `src/artwork/config.ts` to preserve adjustments.

The production output is `dist/`; serve with `npm run preview`. No game credentials or external APIs are required. All artwork is served locally. Offline installation and portable packaging are added in the release stage.

## Artwork

Keep official source artwork unchanged in `assets/originals/`, and generated or edited derivatives in `assets/derived/`. Track every asset in [assets/manifest.json](assets/manifest.json), including its provenance, rights information, and SHA-256 checksum. [Batch 1 intake](docs/artwork-intake-batch-01.md) records Lantern and Foxy pages 1–14; [Batch 2 intake](docs/artwork-intake-batch-02.md) records Ruby and Dizzy pages 15–28; [Batch 3 intake](docs/artwork-intake-batch-03.md) records Nibbles and Tilly pages 29–42. All six characters' supplied poses and labels are now imported. The accidental extra `159.png` was removed at the creator's request.

[Batch 4 intake](docs/artwork-intake-batch-04.md) adds neutral and celebrating full-body illustrations for all six characters, separate from seated boat poses. Pages 43 and 50 are deliberately excluded. Pages 49 and 51 initially had white backings; corrected transparent sources are now active. The intake notes retain the creator's lightweight celebration animation direction; no animation is implemented yet.

[Batch 5 intake](docs/artwork-intake-batch-05.md) adds the seven official boats and their seven matching fallen pieces, pages 57–70. Seating and optional-effect requirements are documented; no game effects are implemented. The flying saucer is excluded.

[Batch 6 intake](docs/artwork-intake-batch-06.md) adds equipment pages 71–84; [Batch 7 intake](docs/artwork-intake-batch-07.md) adds pages 85–98. All 28 official equipment illustrations are now imported in four groups of seven. Gameplay definitions and integration remain pending; creator interaction suggestions are documented without implemented mechanics.

[Batch 8 intake](docs/artwork-intake-batch-08.md) adds encounter illustrations on pages 99–112, organised as seven initial/action pairs. Encounter and animation directions are documented; no mechanics are implemented.

[Batch 9 intake](docs/artwork-intake-batch-09.md) adds general lake scenery and Fastest Race assets on pages 113–126. Page 119’s corrected transparent source is now active. Scenery placement remains separate from collision rules; no implementation was added.

[Batch 10 intake](docs/artwork-intake-batch-10.md) adds Slowest Race and Wobbly Waters assets on pages 127–140. Page 133’s corrected transparent source is now active. Challenge camera and configurable movement directions are documented; implementation is still on hold.

[Batch 11 intake](docs/artwork-intake-batch-11.md) adds Picnic Panic and supporting effects on pages 141–154. Page 154’s corrected transparent source is now active. The three backgrounds have since arrived in the final intake; gameplay implementation is still pending.

The [final library audit](docs/artwork-library-audit.md) covers 155 active assets and five preserved earlier sources (160 original PNGs), including the three [official backgrounds](docs/artwork-intake-backgrounds.md). Originals are preserved unchanged. [Corrected transparent originals](docs/artwork-intake-corrections.md) for pages 49, 51, 119, 133 and 154 are now verified and active, with earlier versions retained in the manifest’s archived sources. The lake border crop and non-repeating, aspect-preserving presentation are configured in the manifest. No game implementation has started.

Run `python3 scripts/audit-artwork.py` with Python 3.9+ to verify the complete original inventory, hashes and PNG structure from a fresh checkout; no third-party packages are needed.

## Complete a development stage

Follow [AGENTS.md](AGENTS.md). Run the stage's checks, review and commit its changes, then push the current branch to GitHub. Report the branch, full commit ID, and actual push outcome. Confirm the remote branch points to the pushed commit with `git ls-remote origin refs/heads/work`. Failed pushes must be reported immediately; local commits alone are not a GitHub backup.
