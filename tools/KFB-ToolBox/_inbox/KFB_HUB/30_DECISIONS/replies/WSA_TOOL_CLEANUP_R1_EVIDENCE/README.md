# Cloudflare route evidence · 2026-10-17

Read-only evidence. No production or GitHub writes were performed.

- Repository `georg-doc/kayfabizarro`; pinned main `904f0e95968999c7e8af77cc6667161bd4f3f788`, old `cloudflare-live` `0067014f203484a1f89cef9bbaf7c64395494b27`, `ws1/preview` `9b935cc9a7cb0e88895a3820a6d0a656342e46a8`.
- `main-routes.json`: 191 HTML routes accepted by main public build filter. Each has title, exact last source commit/date from GitHub path commit history, canonical alias, and exact HTTP body/blob-hash evidence. All 191 match main source exactly.
- `cloudflare-routes.json`: 156 historical cloudflare-live HTML paths, each with last source commit/date and HTTP evidence. Only 45 match cloudflare-live bodies at the production origin; all overlap main. Historical missing pages often return HTTP 200 with the generic root HTML (SPA fallback), which is not proof that the requested page works.
- `main-excluded-html-paths.json`: 282 source HTML files excluded from the main public build (inbox, originals, handover etc), not counted as actual deployed pages.
- `http-routes.json`: 301 deduplicated tested URLs before excluding four `_handoff` paths; 191 exact main bodies, 110 root-body SPA fallback including the four handoff paths. Requests used a browser User-Agent; default Python User-Agent produced 403 and web tool was inaccessible. Correct URL encoding is necessary for Cloudflare's 308 canonical redirects.
- `/kfb-hub/` currently serves Production Hub 82637 bytes, blob `1153d083ed778b90d29008fe1323d5fab863ab38` matching main, not old cloudflare-live. `/kfb-hub/stage/toolbox/` serves 27819 bytes `c1d346872b0c72c17da026c07b44c0c066ddc19a` matching main. `/tools/asset_registry/librarian/` serves v1.8 Deck Library R1 19538 bytes `f9e76260350a544b9f22460f34689989f429d6d4` matching main. These support main as the source branch for a reviewable public redirects PR.
- Main `wrangler.jsonc` names project `kayfabizarro` and `pages_build_output_dir: ./.cloudflare-pages`. Main `.github/scripts/build-cloudflare-pages.mjs` copies root `_redirects` through to `.cloudflare-pages/_redirects` (no exclusion), omits `_handoff`, `skills`, `node_modules`, originals under media/2D_Assets and media/3D_Assets, ToolBox `_inbox`, any `_handover`, and >25 MiB files. cloudflare-live itself has no wrangler/build script; it is a historical projection.
- `ws1-http.json`: current fallback root is HTTP 200, 18100983 bytes, title KFB Planet-Spike; metadata 757 bytes HTTP 200. Root body is exactly `ws1/preview` blob c890bfbb64f27a5e6235756386840ff4a41cdb09. Unknown paths also return that root as SPA fallback. No fallback changes are necessary for a main-only redirect PR.

## Primary platform rule

https://developers.cloudflare.com/pages/configuration/redirects/ (last updated Aug 25 2026) explicitly states: redirects are always followed regardless of whether an asset matches the request. Therefore existing HTML assets can remain untouched; `_redirects` does not require deleting them. `_redirects` belongs in the build output directory; first matching rule wins; fragments cannot be source matched; destination fragments are permitted; Pages Functions are exempt and would need their own handling. Main/old cloudflare trees expose no Functions owner for these static pages.

## Safe one-PR shape

Target main, add root `_redirects` that passes through current builder into the published folder; use explicit page and canonical alias routes for old tool surfaces. Include an archive landing page where no new owner place applies. Keep original sources and resource/data paths unchanged. Do not use blanket `/tools/*`, `/media/*`, `.js` or `.json` redirects. Preserve `ws1/preview` branch/fallback. Do not auto-merge; Georg owns merge/acceptance. Check exact production URL after merge before claiming redirects live.
