# TEST REPORT · WC1 Procedural Props Local Visible Proof

Status: **DIRECT FILE BOOT PASS · LOCAL PERFORMANCE/HUMAN VISUAL RESULT OPEN**
Date: 2026-10-01
Owner: KFB WorldBuilder / World Corridor 01

## Exact implementation

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01`
- Draft PR: #313
- tested head: `c5926ba110f002be9a72a96b58680faf488e974e`
- local review HTML: `KFB_WC1_P0B_LOCAL_REVIEW.html`
- generated local-review SHA-256: `7950487a5ca7d30b4449d5e4dbc4a66ae746bcfb22a828d2fee947e51649993e`

The HTML loads the frozen runtime candidate:
`94443824e6b13f38c611defd06dacedd7c6d0faa`

It does not use the local-proof branch as runtime source.

## CI role

GitHub Actions run:
- run: `36914864960`
- job: `110546226193`
- result: **SUCCESS**
- evidence artifact: `11189536955`
- artifact digest: `sha256:413daa83819accced85ea138c88a85348f03591a15af67ce573b1f72b6a60343`

The browser test opens the HTML directly through a `file://` URL. No local server is used.

Assertions:
- frozen source pin is exactly `94443824e6b13f38c611defd06dacedd7c6d0faa`;
- Clay002 is active;
- no second renderer;
- owner marker remains `WC1 existing renderer/world owner`;
- frozen Burg placement remains 0 tufts / 7 pebbles / 11 trees;
- no page errors;
- only the previously known optional 404 class is tolerated.

## What is deliberately not claimed

Hosted SwiftShader FPS is not product-performance evidence.

CI does **not** press Measure A/B and does not produce a visual acceptance verdict.

The representative gate is the downloaded HTML opened in visible local Chrome on Georg's hardware.

## Human/local review operation

1. open `KFB_WC1_P0B_LOCAL_REVIEW.html` directly in Chrome;
2. inspect Burg and toggle `procedural props` on/off;
3. use Burg / Kosmos / Top / Horizon as needed;
4. choose `Fits`, `Too generic` or `Undecided`;
5. click `Measure A/B`;
6. return via `Copy JSON` or `Download JSON`.

Measurement exports:
- visible/hidden state;
- user agent;
- GPU vendor/renderer when exposed;
- DPR/canvas/renderer pixel ratio;
- fps and mean/p95/p99/max frame ms;
- draw calls / triangles / geometries / textures / programs;
- props-off vs props-on delta;
- exact source and donor pins;
- visual judgement.

## Gate

**DIRECT_FILE_BOOT = PASS**

Exactly one next gate:
**GEORG LOCAL VISIBLE RESULT** — visual judgement + returned A/B JSON from this exact artifact.
