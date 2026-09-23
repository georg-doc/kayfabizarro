# KFB Elastic Grotesque Clay v1 · Hürth 01

Status: **V2 IMPLEMENTED · 21/21 BROWSER PASS · ACCEPTED BENCHMARK PINNED · V2 HUMAN 3D REVIEW PENDING · NO LIVE PROMOTION**
Date: 2026-09-23
Owner: **OSM City Lab presentation / KFB ToolBox authoring**
Receiving consumers remain Race / Travel / WorldBuilder. No new movement, collision, terrain or asset owner.

## LEAD ROUTING OVERRIDE · 2026-09-24

For Hürth / KFB 3D form-language continuation, read in this order:
1. `CHAT_RECOVERY_CURRENT.md`
2. `LEAD_OVERRIDE_2026-09-24.md`

**PR #194 V2 is the current bounded slice.** Main and older City-Lab/Grotesque documents may lag this unmerged work.

Anti-regression:
- old City-Lab `GROTESQUE` = comparison evidence only;
- Hürth 01 V1 = superseded continuation basis;
- ELASTIC `ELASTIC_GROUP_WARP_V2` = current candidate;
- do not revert to box extrusion, stacked cubist offsets, generic low-poly, Gothic dressing, or random independent building distortion.

Human chat review must preserve the **actual V2 visual truth**. The simplified self-contained Canvas mirror is REJECTED AS VISUAL AUTHORITY. Do not rebuild the renderer just to avoid iframe/CDN restrictions. Prefer the real V2 browser evidence/screenshots; use a self-contained file only when it packages the canonical renderer without visual substitution.

## Goal

Prove one reusable KFB 3D form language on a real Hürth OSM block:

**wonky 90s-cartoon spatial grammar + elastic rounded volumes + handmade clay-model surface feeling.**

The intended visual combination is:

- crooked / non-parallel / bent spatial composition rather than neutral architectural projection;
- continuous elastic deformation rather than stacked cubist discontinuities;
- rounded, chunky, readable silhouettes;
- matte, tactile, handmade clay/model finish;
- KFB asymmetry that is authored/correlated, never random transform noise.

Working name: **KFB Elastic Grotesque Clay**.

## Why this slice exists

The current OSM City Lab already has CLEAN / CARTOON / GROTESQUE presentation modes.
The existing GROTESQUE mode intentionally uses stronger stacked-ring offsets and mild cubist discontinuity.
That was useful as a stress-test, but Georg's current direction rejects the resulting faceted/kubist read.

Do not patch the old GROTESQUE mode in place during this proof.
Compare against it as the historical/current reference.

## Pinned source truth

- repo base: `georg-doc/kayfabizarro@dca52479dad9c176acde6e7c7167dc133bf50bdd`
- Hürth dataset: `tools/osm-city-lab/data/huerth-v0/normalized.json`
- Hürth source spec: `tools/osm-city-lab/data/huerth-v0/SOURCE_SPEC.json`
- current OSM presentation modes: `tools/osm-city-lab/docs/PRESENTATION_S1C.md`
- current prop/world Cartoon Deformer direction:
  `tools/KFB-ToolBox/_handover/ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/CARTOON_DEFORMER_AND_RENDER_LOOK_ADDENDUM_2026-09-15.md`
- current landmark style bridge:
  `tools/img2threejs/docs/LANDMARK_WORLD_STYLE_V1_RETURN_2026-09-19.md`
- current Race rounded-form donor:
  `georg-doc/KFB-Stunt-Car-Race/KFB Cologne Race Option C-3/lab-v9/kfb-round.v1.js`
- current vehicle presentation deformer stays separate:
  `skills/chat/workflows/VEHICLE_DEFORMER_V3_TINYSKIES_2026-09-19/START_HERE.md`

Dropbox visual references are source/reference only, not runtime truth:
- `/CLAUDE/KFB Stunt Car Race/_inbox/BG CARTOON ASSETS Midjourney GvW/`
- KayKit reference/demo collection under
  `/CLAUDE/KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos/`

## Protected boundaries

- OSM IDs, footprints and local-metre frame stay unchanged.
- City S2 / collision geometry stays unchanged.
- Roads are context only in this form-language proof.
- No new driving runtime.
- No new terrain owner.
- No replacement landmark owner.
- No source GLB is destructively edited.
- Vehicle dynamic squash/stretch remains the existing presentation-deformer lane.
- Cel shading / outline is **not** the acceptance target for this slice.

## Hürth 01 fixture

Use real cached Hürth v0 geometry only.

Preview target:
- approximately 22 real building footprints near the Hürth origin;
- real nearby road axes for spatial context;
- identical footprint/height data in all comparison modes.

Modes:

1. **CLEAN OSM**
   - direct footprint massing;
   - no expressive deformation.

2. **CURRENT GROTESQUE**
   - deliberately preserves the current stacked/faceted deformation idea as comparison evidence;
   - not a candidate default.

3. **ELASTIC GROTESQUE CLAY**
   - rounded footprint;
   - continuous height-wise lean/bend/belly/taper/twist;
   - correlated block warp;
   - semantic roof caps;
   - protected window/door modules;
   - matte clay/material micro-variation.

## Core rule

> **KFB does not cartoonize meshes blindly. KFB cartoonizes semantic form zones.**

Primary form determines silhouette.
Secondary form defines roof/frame/structural rhythm.
Protected detail retains identity and readability.
Material/lighting remains a separate pass.

## Human review questions

- Does ELASTIC read as one continuous handmade volume rather than stacked geometry?
- Does the street remain spatially coherent while becoming visibly wonky?
- Are silhouettes round/chunky rather than crystalline?
- Do windows/doors remain readable and protected?
- Does the clay/model finish support the form without becoming glossy plastic?
- Does CLEAN prove that geographic/source truth is unchanged?

## Done when

This slice is done for first review when:

- the standalone chat HTML opens;
- all three modes render the same real Hürth fixture;
- individual buildings can be focused;
- source IDs/heights/roof hints are visible;
- no OSM/collision data is mutated;
- a screenshot/browser proof exists;
- Georg gives a visual direction: **continue / tune / reject**.

No Cloudflare or Live claim in this first chat-review checkpoint.


## CURRENT V2 OVERRIDE · 2026-09-23

Georg accepted the generated clay-neighbourhood frame as the **shape/detail benchmark** and asked for a real 3D translation, with a more explicitly cartoon-like palette.

Accepted benchmark:
- `STYLE_BENCHMARK.md`
- `benchmark/KFB_EGC_STYLE_BENCHMARK_2026-09-23.jpg`
- Git blob `d6dcb90770d83513204a6ea96fd56a60c7c3a296`
- repository review derivative: **640 × 360 JPEG**
- source derivative SHA-256: `cb6de7beca127a84eb47722eb6229a4348f6a1e9ed66a6cb3af80664ff744621`

Hürth 01 v2 now implements:
- coherent low-frequency **group warp** across neighbouring buildings;
- stronger bowed / leaning / non-parallel silhouettes;
- warped roof plane + semantic roof cap;
- one varied door + 2–3 irregular tall narrow windows, no bright frame;
- continuous Catmull-Rom road/curb ribbons instead of visible rectangular segments;
- systemic `KFB_WONKY_90S_CLAY_V1` palette across wall / roof / door / window / ground / curb / road;
- separate vertical/depth layers + polygon-offset road materials to reduce overlap/z-fighting artifacts.

Current browser proof:
- tested source/runtime head: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- run `35909757979`
- **21/21 PASS**
- 3/3 WebGL2
- 0 page/console errors
- artifact `10772592799`
- digest `sha256:14033aea95c75d006d3333347809a1a147256ba31dd28bda5505570d6572aedf`

Protected boundaries remain unchanged: OSM/source/collision truth, movement owners, landmark owners and vehicle-deformer ownership.

**Exactly one next gate:** Georg reviews the actual v2 3D HTML/render. If the geometry reads like the accepted benchmark, then create the Blender-MCP / Geometry-Nodes production recipe. KayKit animated/enterable doors remain a separate later source-first gate.
