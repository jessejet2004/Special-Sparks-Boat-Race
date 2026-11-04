# Development workflow

These rules apply to every development stage, including Boat Race.

Current creator instruction: the complete playable game is authorised. Work autonomously through the approved stages, testing, committing and pushing each completed stage. Preserve all original artwork.

- Keep all game source, artwork configuration, tests, and documentation in this repository. Do not depend on a conversation, cloud snapshot, or files outside the checkout for completed work.
- Use the existing checkout. Each cloud task is isolated; do not create a worktree unless explicitly requested.
- Before working, inspect Git status and the current branch. Preserve existing user changes.
- Keep installation, development, build, and test instructions current as implementation introduces tools. Commit dependency manifests, lockfiles, version pins, and non-secret configuration. Document required variables without committing credentials.
- Preserve official artwork originals byte for byte under `assets/originals/`. Create derivatives separately under `assets/derived/`. Maintain `assets/manifest.json` with paths, provenance, rights information, and SHA-256 hashes. Never overwrite an original with an edited version.
- At each completed stage, run the relevant checks, review the diff, commit all files belonging to that stage, and push the commit to GitHub. Do not include unrelated user changes or secrets.
- Report the branch, full commit ID, checks performed, and whether the push succeeded. Verify the remote branch contains the commit with a read-only remote query. Never call work backed up to GitHub until its push has succeeded.
- If GitHub access or pushing fails, tell the user immediately. Preserve local work, diagnose the failure, and retry after a meaningful correction. Do not mark the stage backed up or begin another stage while its required push remains unresolved. Never force-push to work around a conflict.
- For restoration, follow README.md from a fresh checkout. Cloud environment deletion must not lose any completed stage.
