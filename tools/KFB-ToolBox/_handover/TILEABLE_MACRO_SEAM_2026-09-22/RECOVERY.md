# RECOVERY · Tileable Macro Seam Lab · 2026-09-22

Status: **LOCAL BROWSER VERIFIED · PUBLIC / HUMAN GATE PENDING**

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

Workflow run `35676780027` · job `106584849995`: **17/17 PASS**.

Edge/local discontinuity score:
- old average: **14.242**
- tileable average: **1.375**

X ratio: `14.582 → 1.027`  
Y ratio: `13.903 → 1.723`

Artifact: `10672902748`  
Digest: `sha256:f447a439217a00fb295ac0fccd88b8b611ca718d732bd6ee09a46945dfe34133`

No failed resources and no page/console errors.

## Boundary

This is not yet a public Stage and not Georg-accepted. Do not merge or promote to v2 consumers.

## Next gate

Publish the exact candidate to the fixed Cloudflare Stage route and visually compare **Old repeat ↔ Tileable macro** on the wall seam. No additional shader/style changes before that review.
