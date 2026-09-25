# RETURN · Billboard B2b · Living Mockup / Collage Research · 2026-09-25

Status: **RESEARCH COMPLETE · GEORG CHOICE PENDING**
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/billboard-b2b-research-2026-09-25`
Draft PR: **#211**
Base: accepted B2a branch / PR #199
Runtime changed: **NO**
Cloudflare route: **NONE — research-only slice**

## Delivered

Primary memo:
`tools/KFB-ToolBox/_handover/BILLBOARD_B2B_RESEARCH_2026-09-25/OPTIONS_MEMO.md`

Recommendation:
**A+ · CanvasTexture collage compositor + deterministic no-repeat scheduler + small provenance-tracked pool + lightweight Living Screen treatment.**

The first POC should stay intentionally small:
- 1 new `COLLAGE` mode;
- existing accepted B2a billboard host;
- one CanvasTexture;
- 4 composition recipes;
- 4 grade presets;
- 6–12 curated KFB/CC0 stills;
- no local video layer initially;
- `FLAT_COLLAGE` vs `LIVING_SCREEN` treatment;
- deterministic seed + no-repeat memory;
- no editor.

## Reuse found

A major finding is that KFB already has a real collage donor:
`drawCollageFace()` + `BillboardContent` in the original Billboard Gate-1 `bb-scene.js`.

B2b should improve that donor rather than start over.

## Content-source conclusion

Do not scrape random “public domain” content live.

External imagery should be curated into the normal KFB asset/registry pipeline with explicit provenance.

Best initial sources:
- Smithsonian Open Access CC0;
- Library of Congress Free to Use and Reuse;
- Chronicling America for old headlines/newspaper fragments;
- Europeana PDM/CC0 allow-list;
- Wikimedia Commons PD/CC0 allow-list.

## Related WSA handover

Prepared separately:
`tools/KFB-ToolBox/_handover/BILLBOARD_B3_CARTOON_BODY_WSA_HANDOVER_2026-09-25.md`

This lets WSA / Blender MCP later round and soften the 3D billboard body while preserving B2a media semantics.

## Actual tests

- SOURCE JSON parse: **1/1 PASS**
- stack/base identity: **1/1 PASS**
- runtime/browser: **0 by design**
- public Stage: **not applicable**

## Unresolved / choices

Georg only needs to choose:
1. A flat Canvas POC or recommended **A+** Living Screen toggle;
2. KFB-only first pool vs tiny CC0 pack immediately;
3. starting visual recipe: torn-history / newspaper-headline / carnival-ad / mixed hypernormalisation;
4. B2b-P1 next, or B3 body first/in parallel.

## Exactly one next gate

**Georg chooses B2b-P1 option/tone (or B3 first).**
