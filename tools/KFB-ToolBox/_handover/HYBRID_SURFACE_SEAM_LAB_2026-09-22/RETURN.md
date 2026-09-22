# RETURN · Hybrid Surface Seam Lab

Date: 2026-09-22  
Status: **PUBLIC VERIFIED · HUMAN GATE OPEN · UNMERGED**

## Source state

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-hybrid-seamless-macro-2026-09-22`  
Draft PR: **#171**

Tested/deployed runtime marker:
`8a64b33a917417402b6932fc152ec9f3bcf32fb1`

Public-proof workflow head:
`fa07441f3d6cfd310623a514dc1ec40cce9e1ada`

## Outcome

The visible-repeat issue was traced to a non-tileable source canvas, not an inherent triplanar limitation.

Old generator:
- random brush canvas;
- RepeatWrapping;
- opposite edges mismatch;
- measured Δmax **136**.

New generator:
- toroidal wrapped strokes/blobs;
- explicit opposite-edge normalization;
- RepeatWrapping over matching borders;
- measured Δmax **0**, Δmean **0**.

The Seam Lab lets Georg toggle the old and new macro texture on the same real KFB scene.

## Public Stage

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-seam-lab/

## Tests

Public Cloudflare browser:
**17/17 PASS**

No failed resources. No page/console errors.

## Retained owners

No World Atlas, actor/rig, gameplay, physics, Registry, OSM or Race ownership moved.

## Separate open issue

The frozen Hybrid v2 Black Knight compile-census issue is not fixed or hidden by this slice.

## One next gate

Georg visually compares **Legacy non-tileable** vs **Tileable macro** in `Seam close-up`.

If the line is gone, the tileable macro generator becomes the reuse candidate for the next visual Hybrid iteration.
