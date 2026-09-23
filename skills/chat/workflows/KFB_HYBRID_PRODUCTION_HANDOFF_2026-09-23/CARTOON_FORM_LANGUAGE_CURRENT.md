# KFB 3D Cartoon Form Language · Current Direction · 2026-09-23

Status: **CURRENT CONTROL-PLANE SYNTHESIS · SOURCE-BACKED HÜRTH POC #194 ACTIVE**

## Why this file exists

Georg has a parallel 3D-form-language chat developing a KFB visual language around reference axes including:

- **Rocko's Modern Life** — skew, asymmetry, bent/bowed geometry, graphic silhouette;
- **Wallace & Gromit / Aardman** — clay mass, hand-made surface, tactile volume.

The parallel form-language chat has now produced a durable source-backed GitHub lane:

- Draft PR **#194** — `KFB Elastic Grotesque Clay v1 · Hürth 01`;
- branch `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`;
- browser-tested implementation head `1db61b9c882e178000cf700a7d5f4d18ec03eba0`;
- current branch head `2db8f327e2580c745aa2d14ee9866a15925eb64d`;
- **16/16 browser assertions PASS**, **3/3 WebGL2**, zero page/console errors;
- human visual gate pending;
- no Cloudflare/public Stage.

This file remains the control-plane synthesis. PR #194 owns the richer implementation/source evidence for the current architecture proof.

## Existing verified KFB sources

### KFB 3D CartoonStyle v1

`skills/KFB_3D_CartoonStyle_v1.md`

Blob:
`5fe583af82f8b728f8d6c75542c1b323c626179a`

Current useful grammar:
- big shape first;
- round by default;
- toy/clay mass;
- readable silhouettes;
- few large secondary forms;
- generous thickness;
- bold bevels;
- limited material/color zones;
- avoid tiny hard-surface fragmentation.

### WorldDesign cartoon backlog

`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/docs/COMIC_CARTOON_BACKLOG.md`

Blob:
`7239bad5a794fe3f007df39089c96ca42c7e41ca`

Relevant current ideas:
- claymation bump / static surface irregularity;
- stop-motion hold/jitter as optional motion grammar;
- limited palette;
- cartoon outlines/rim;
- simplified large color masses.

### Prior staging direction

Archived Town design reference:
blob `2f8c80f7d00452e4e0dd85f7a428994d7a7c5d2f`

It records 1990s hand-built cartoon staging, asymmetric perspective, strong silhouettes and physical-looking geometry, with Rocko's Modern Life and Wallace & Gromit among Georg's named references.

That old project brief is archived history; only the generic style reference is reusable.

## Current synthesis for production

Use as a **form grammar**, not literal franchise imitation.

### Shape

Prefer:
- bowed walls;
- skewed boxes;
- soft taper;
- asymmetric rooflines;
- chunky curved supports;
- big readable masses;
- visibly seated/interlocking joints;
- deliberate non-perfect geometry.

Avoid:
- thin flat planes pretending to be volume;
- many coplanar overlays;
- tiny rectangular facets;
- generic low-poly triangulation;
- perfectly sterile CAD symmetry.

### Surface

Prefer:
- matte/semi-matte;
- toy/clay;
- subtle static handmade irregularity;
- broad light rolls;
- physical 3D shadow.

Avoid:
- fake blurred shadow discs;
- glossy plastic everywhere;
- noise used to hide topology defects.

### Structural anatomy

Every structural relationship should read physically:
- pillar enters/seats in barrier;
- prop grip enters hand correctly;
- roof sits on wall;
- bridge support meets deck;
- terrain stays outside/under structural envelope.

This is especially relevant to the current Racer R3d failure.

## First consumers

### Blender MCP
Best current authoring laboratory for:
- track/barrier anatomy;
- support seating;
- building rounding;
- prop/body shape studies.

### Racer
Candidate:
one representative banked curve + barrier + underside + support/frame A/B.

### OSM / World
Later:
translate flat/extruded building masses into skewed/bowed/rounded KFB building anatomy while preserving OSM footprint/geography ownership.

### Landmarks
Continue the already-proven principle:
rounded continuous structural curves instead of visible BoxGeometry chains.

## Current implementation carrier

Use:
`skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/`

Current gate:
**GEORG HUMAN VISUAL REVIEW · HÜRTH 01**.

Until that decision:
- do not generalize the grammar into Blender Geometry Nodes;
- do not promote it as the global default;
- do not change OSM, collision, terrain, landmark or vehicle owners.

After the human decision, fold only accepted measurements/rules back into the broader KFB form-language guidance.
