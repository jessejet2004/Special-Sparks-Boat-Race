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

## Recommended persistent preview: Cloudflare Pages

This requires a Cloudflare account and permission to connect this GitHub repository. No token needs to be entered in chat or committed to the repo.

1. In Cloudflare, create a **Pages** project using Git integration and authorise access to `jessejet2004/Homeroom-codex-test`.
2. Set the production branch to **work**. This matters: the complete game is on `work`; the current `main` branch is still the initial repository.
3. Select Vite/static hosting. Set build command **npm run build**, output directory **dist**, root directory the repository root. Set build environment variable **NODE_VERSION=24.22.1**. There are no application secrets.
4. Review that the game and official runtime artwork will be publicly accessible, then deploy. Cloudflare displays the actual `pages.dev` URL only after successful deployment. Test it in a normal browser; do not substitute an expected URL for a confirmed deployment.

After that one-time setup, pushes to `work` rebuild the website. Cloudflare can generate branch/PR preview deployments too; configure preview branches in the project. A Homeroom custom domain can be connected later by someone with DNS permission. For deployment within an existing Homeroom URL path, publish `dist/` into that website's directory or configure its proxy; a separate Pages subdomain does not automatically become a path on another website.

## Vercel alternative

`vercel.json` records the static Vite framework, `npm ci`, `npm run build`, and `dist` output. Import the GitHub repository in Vercel, choose **work** as the production branch, and use Node 24. Review public visibility and deploy. Vercel returns the actual live deployment URL and can create previews on future pushes. Connecting Vercel requires account/repository authorisation. No application credentials are needed. Do not create rewrites that turn asset errors into HTML. Service worker and registry responses are configured for revalidation.

## GitHub Pages alternative: manual publication workflow

`.github/workflows/pages.yml` builds the correct `/<repository-name>/` base and publishes `dist/` using GitHub's Pages artifact/OIDC mechanism. It deliberately has **only a manual trigger**, with `publish_publicly` defaulting to false. Merely committing or pushing this file does not publish publicly.

One-time repository-owner setup:

1. Make the deployment workflow available on the default branch: either change the default branch to **work**, or review and merge `work` into `main`. GitHub only offers manual workflows present on its default branch; simply selecting `work` in an unavailable workflow is insufficient. Do not reset or overwrite branches to bypass this step.
2. In **Settings → Pages**, set **Source: GitHub Actions**. The repository/account must support Pages for its visibility/plan. Check organisation rules and any environment approvals with the repository owner.
3. In **Actions → Publish playable website → Run workflow**, choose the branch with the complete game, explicitly check `publish_publicly`, then run it. Approve the `github-pages` environment if the repository requires that.
4. The deployment job exposes `page_url`. Verify that URL loads the game and all artwork before sharing it. For this project the workflow uses the repository subpath; configuring a root-level custom domain needs a root-base build instead.

The workflow requests `contents: read`, `pages: write` and `id-token: write` only where needed; it needs no personal access token or committed deployment secret. Repository administration/Actions/Pages permissions and explicit public publication are the outside prerequisites. This task prepares the workflow but does not change repository settings, merge branches or trigger public publication.

Future updates: commit/push to `work`, let CI build/test, then run the publication workflow again when ready. GitHub Pages is manual here; Cloudflare/Vercel are simpler if every push should immediately refresh a persistent preview.

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
- No external site was published and no public/forwarded preview URL was returned by the environment. Vite's internal/local addresses are not supplied as a public creator preview. One-time host/account setup remains the prerequisite for a real shareable website URL.
