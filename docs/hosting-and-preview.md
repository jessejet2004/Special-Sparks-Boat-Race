# Browser preview and website deployment

The hosted browser game is the primary delivery. The standalone HTML/ZIP is a secondary offline option. No gameplay rules, official source artwork or asset mappings are changed by hosting configuration.

## What this Codex session can provide

Vite can run on this machine, but the available session tools do not expose a forwarded-port/public-preview URL or a connected hosting account. A loopback URL on the cloud machine is not a URL the creator can open from their own computer. Do not present a workspace HTML link or an invented forwarding hostname as a live preview.

If a future Codex client exposes port forwarding, start `npm run dev` and forward **5173** using that client's port/preview control. Use the URL actually returned by the client; test the game through that URL before handing it over. This session cannot manufacture that link. Servers and preview links may end when a cloud environment is replaced; a static host provides the persistent website.

## Vite development preview

With Node 24.22.1 and npm 11.9.0:

```sh
npm ci
npm run dev
```

Vite listens on `0.0.0.0:5173` with `strictPort`, so it never silently moves to a different port. On your own development computer, open the local address printed by Vite. On a cloud machine, use an actual forwarded URL if the client supplies one.

For an HTTPS forwarding proxy that supplies its own hostname, start with:

```sh
PREVIEW_ALLOWED_HOSTS=the-exact-forwarded-host.example npm run dev
```

This is an example hostname, not an existing preview URL. Use the real forwarded hostname without a scheme, port or path. Multiple exact hosts can be comma-separated. Host validation remains enabled; do not set `allowedHosts: true` to work around an unknown hostname. Vite normally detects WebSocket forwarding automatically. If the client specifically requires it, set `PREVIEW_HMR_HOST` to the real host and `PREVIEW_HMR_PORT` to its external HTTPS port (default 443). These optional settings configure development forwarding, not public deployment.

Development shows **Development preview** and does not install a production service worker, avoiding offline caching of development bundles.

## Production preview and subpaths

```sh
npm run build
npm run preview
```

The production server binds to `0.0.0.0:4173` with `strictPort`. The same forwarding and host-validation considerations apply.

To test the production build as a website section on your own computer:

```sh
npm run build
npm run preview:subpath
```

Open the mounted path `/special-sparks/boat-race/` on port 4174 of that computer/server. The automated browser suite tests this mount, all 155 images, gallery navigation, race launch and offline use. It also tests a second mount on the same origin to ensure caches do not delete each other.

Vite's default build base is `./`, making the same `dist/` portable to a domain root or a directory such as `https://your-homeroom-site.example/special-sparks/boat-race/`. That domain is illustrative, not a published site. Keep the trailing slash on directory URLs. Assets and gallery links resolve relative to the document; no source asset paths are fetched at runtime.

If the hosting platform requires a fixed base, build with:

```sh
VITE_BASE_PATH=/special-sparks/boat-race/ npm run build
```

Deploy the contents of `dist/` at exactly that path. Deploying at an unrelated path after choosing an absolute base will break JavaScript/CSS links. Do not configure an SPA catch-all that returns HTML for missing PNG/WebP/JS files; there are only the game and developer gallery HTML entries, no client-side route system.

## Permanent preview: GitHub Pages

The creator has chosen GitHub Pages rather than Cloudflare. The expected website URL is:

**https://jessejet2004.github.io/Homeroom-codex-test/**

This is the expected address, not proof of a successful deployment. The actual deployment must complete before calling it live. The Actions deployment exposes its confirmed `page_url`.

### Automatic update workflow

`.github/workflows/pages.yml` now triggers on every push to **work**, the branch containing the approved game. It can also be rerun manually where GitHub exposes the workflow. Other branches do not publish. The existing `main` branch still contains the initial repository; it is not the deployment source and need not be reset or changed for automatic push deployments.

Before publishing, the build job checks that Pages is configured, installs from the lockfile, audits the original artwork, builds the portable/default web edition, runs all unit tests and the full Chromium browser suite, then creates a fresh production build with `VITE_BASE_PATH=/Homeroom-codex-test/`. A final Pages-specific browser smoke test then verifies all 155 images and an offline race launch from the actual repository-path artifact. Only that verified final `dist/` artifact is deployed. A failed check prevents the deployment job from running. Original PNG files and source code are not copied into the published static directory; the game uses its verified runtime artwork derivatives.

The deployment job uses GitHub Pages artifact/OIDC authentication with read-only Pages configuration access for the build, and `pages: write` and `id-token: write` for deployment. No personal access token, Cloudflare installation or committed secret is required. Updates are serialised to avoid overlapping publication. The standalone build remains a secondary download option.

### One-time settings for the repository owner

1. Open repository **Settings → Pages** and set **Build and deployment → Source → GitHub Actions**. The repository visibility/account plan must support Pages. If Pages is unavailable for a private repository, use an eligible plan or review repository visibility; do not change visibility blindly just to enable it.
2. Ensure **Settings → Actions → General** permits workflows and the official `actions/*` actions used here. The workflow declares the required token permissions itself; organisation restrictions may need an administrator's approval. There is no need to enable broad write access for every workflow.
3. If **Settings → Environments → github-pages** restricts deployment branches, allow **work**. Approve an environment review if one is configured. Do not leave a default-main-only rule blocking this workflow.
4. After enabling Pages, open **Actions → Publish playable website**, select the latest `work` run and choose **Re-run all jobs** if its first attempt failed before Pages was enabled. Future approved pushes to `work` trigger automatically. No default-branch change is required for push-triggered runs. GitHub's **Run workflow** button for manual dispatch appears only if the workflow is also available on the default branch; rerunning an existing automatic run does not require that button.
5. Wait for both build and deploy to succeed, then open the deployment's `page_url` or **Settings → Pages → Visit site**. Confirm the game, all artwork and a race load. A first deployment may take a few minutes to become available.

The workflow publishes the game and runtime artwork publicly, as authorised by the creator's Pages request. A custom domain can be added later by its DNS owner, but a root-level custom domain would need a root-base build instead of the repository subdirectory. Keep the current repository URL until that change is deliberately configured and tested.

### Continuing development

Keep source updates on `work`, run local checks, commit and push. The Pages workflow then validates that exact commit and updates the same browser URL. Use branches/PR review to decide which changes are approved for `work`; merging into `main` is not part of this preview workflow. Failed deployments leave the previous successfully deployed site available. Never describe a site as updated until the deployment job succeeds.

### Inspecting deployment status

Use the repository's **Actions** page. With API access, `gh run list --workflow pages.yml --branch work` and `gh api repos/jessejet2004/Homeroom-codex-test/pages` can report runs and the site URL. This cloud session can push through GitHub's Git proxy, but its GitHub API requests currently return Forbidden and the API/Pages hostnames are not on its reported network allowlist. Git read/write access alone does not establish API/admin access. A blocked status request is not proof that deployment failed or succeeded. If the environment cannot reach the public Pages hostname, verify the URL in a normal external browser rather than manufacturing a success claim.

## Offline, browser updates and caching

Hosted builds generate a versioned service worker and cache all local game files. HTTPS or localhost is required. Wait for **Offline ready** before disconnecting. Cache namespaces include the worker's URL path, so two Homeroom previews on the same origin remain isolated, and the worker intercepts only requests inside its own scope. New deployments install a new complete cache; reload after installation to use the new bundle.

Keep `sw.js` revalidated rather than immutable. `npm run portable` still creates the secondary standalone HTML and ZIP. It is not needed for routine website testing.

## Verification and preservation

```sh
npm ci
npm run portable
npm test
npm run test:browser
python3 scripts/audit-artwork.py
```

The browser suite covers root hosting, nested hosting, all artwork, desktop/tablet/smartboard layouts, offline caching, missing-resource recovery and all four challenge journeys. The separate build CI workflow runs these checks on pushes and pull requests. Changes must be committed and pushed to GitHub and verified remotely; a running cloud server alone is not preservation.

After the first real external deployment, verify the actual public URL, a game/race launch, the gallery images, offline readiness and refresh after the next update. Local/subpath test success proves the build is hostable, not that an external site has been published.

## Verified in the current setup task

- Vite development server started on port 5173; Chromium loaded the actual game and launched a race without page errors. Development status was shown without installing the production offline worker.
- Build/type checking and all 22 unit tests passed. All 15 browser tests passed, including existing gameplay and offline checks plus the new subpath, cache-isolation and smartboard checks.
- All 160 preserved original PNGs passed the source-art audit (155 active assets, five archived earlier originals).
- A separate fixed-base build at `/Homeroom-codex-test/` loaded the game, reached offline readiness, reloaded offline and launched a race successfully. The default relative-base portable build was regenerated afterwards.
- The earlier hosting-setup task did not publish an external site. The current Pages task enables automatic publication from `work`; its completion report distinguishes the verified Git push from any confirmed or unconfirmed deployment result.

## Verify the exact Pages artifact locally

After the normal suite, run:

```sh
VITE_BASE_PATH=/Homeroom-codex-test/ npm run build
npm run test:pages
```

The Pages-specific test starts a static server under the real repository path and checks all active artwork, navigation, offline readiness, offline reload and a race launch. It is a mandatory deployment gate in the Pages workflow. The environment variable above is shell syntax for macOS/Linux; on PowerShell set `$env:VITE_BASE_PATH` before building and remove it afterwards. Regenerate the general portable edition with `npm run portable` after clearing an explicit base.

## Automatic Pages workflow verification

The switch to automatic deployment was checked with a successful portable/production build, 22 unit tests, all 16 general browser tests, and the separate Pages-production browser test. The Pages-specific check verified the actual `/Homeroom-codex-test/` artifact, all 155 active artwork files, navigation, offline reload and race launch. The original-art audit passed for all 160 preserved PNG files. No gameplay or original artwork files were changed by this deployment task.

The GitHub API and expected public Pages URL were attempted from this cloud environment, but its network proxy rejected those connections. This is not evidence that the website itself returns an error. The completion report records the pushed commit and whether live deployment could be confirmed; the expected URL must not be described as verified live based solely on a successful push.
