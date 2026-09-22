# RECOVERY · Tileable Macro Seam Lab · 2026-09-22

Status: **PUBLIC VERIFIED · HUMAN VISUAL GATE OPEN**

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-tileable-macro-seam-2026-09-22`  
Draft PR: **#173**

## Proven cause

The prior RGB brush bitmap was not tileable. It painted random strokes/blobs once into a canvas and then enabled `RepeatWrapping`. Repeating a bitmap does not make mismatched opposite edges seamless.

## Current candidate

Only the macro texture generator changes:
- periodic/toroidal 3×3 authoring;
- center tile cropped to the same 256×256 texture;
- same seed;
- frozen v2 material donor unchanged;
- clay/grain, roughness, head-scale and consumer owners unchanged.

## Evidence

Local proof: workflow `35676780027`, job `106584849995`: **17/17 PASS**.

Public proof: workflow `35677711287`, public job `106588167104`: **17/17 PASS**.
Exact Cloudflare marker observed:
`5a7c57e77c81546e71e6f30404a84f02ddbf7cf5`

Public artifact:
- id `10673323485`
- digest `sha256:862e85d95cc0d3050e22cf856b5ba473b5ed34206b19d4fcb071a8880e6aad71`

Edge/local discontinuity score:
- old average: **14.242**
- tileable average: **1.375**
- X: `14.582 → 1.027`
- Y: `13.903 → 1.723`

Public browser: HTTP 200, 0 failed resources, 0 page/console errors.

KFB Hub routing proof: workflow `35678440295` PASS. Both public pages contain `tileable-macro-seam-lab`:
- `https://kayfabizarro.pages.dev/kfb-hub/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/`

## Public Stage

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/tileable-macro-seam-lab/`

## Boundary

This is still a human review candidate. Do not merge or promote into Hybrid v2 consumers yet. The Black Knight compile-census recovery remains a separate frozen issue.

## Next gate

Georg visually compares **Old repeat ↔ Tileable macro** on the wall seam. No additional shader/style changes before that review.
