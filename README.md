# Homeroom

Boat Race development repository. The implementation has not started yet.

The creator's [Version 1 design brief](docs/boat-race-design-brief-v1.md) and [development proposal](docs/boat-race-development-proposal.md) are saved in this repository. Per the latest creator instruction, game implementation must wait until all artwork batches have been uploaded and the creator gives the final instruction. No game code or substitute artwork has been created.

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

Currently this repository contains workflow documentation, an asset manifest, and imported official artwork. There are no application dependencies to install, development server to start, build command, or game tests to run. Boat Race implementation must add the exact commands, tool versions, dependency lockfiles, and required non-secret configuration here before its first stage is completed.

The current manifest can be validated with Python 3:

```sh
python3 -m json.tool assets/manifest.json
git diff --check
```

No credentials or external services are required for the current repository contents. GitHub authentication is required to fetch and push private repository content; supply it through the host's secure authentication mechanism, never committed files.

## Artwork

Keep official source artwork unchanged in `assets/originals/`, and generated or edited derivatives in `assets/derived/`. Track every asset in [assets/manifest.json](assets/manifest.json), including its provenance, rights information, and SHA-256 checksum. [Batch 1 intake](docs/artwork-intake-batch-01.md) records Lantern and Foxy pages 1–14 and an excluded, fully transparent extra file, `159.png`.

## Complete a development stage

Follow [AGENTS.md](AGENTS.md). Run the stage's checks, review and commit its changes, then push the current branch to GitHub. Report the branch, full commit ID, and actual push outcome. Confirm the remote branch points to the pushed commit with `git ls-remote origin refs/heads/work`. Failed pushes must be reported immediately; local commits alone are not a GitHub backup.
