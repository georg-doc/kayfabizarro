# RETURN · WC1 Procedural Props Local Visible Proof

Status: **HUMAN PROCEED ON PROCEDURAL PROPS/TREES · MATERIAL TUNE OPEN**
Date: 2026-10-02

## Human decision

Georg explicitly wants the procedural props/tree direction to continue.

Positive result:
- procedural form language is good enough to pursue;
- trees are specifically called out as very cool;
- geometry/style grammar is now **PROCEED**.

Open issue:
- the shared material/texture makes the scene look generic, repetitive and somewhat buggy;
- this is treated as a **material/texture TUNE**, not a rejection of the procedural forms.

Canonical decision:
`DECISION_PROCEDURAL_PROPS_PROCEED_2026-10-02.md`

Site Production Control decision:
`WORLD-CORRIDOR-01 / e072b8e2-498a-460b-94e7-88b930f5336f`

## Outcome

The frozen WC1 + P0B geometry direction is retained as a KFB production path for scalable world/background dressing.

Keep:
- soft procedural tree grammar;
- pebble/prop grammar;
- deterministic recipes/seeds;
- family instancing;
- later style-adapter iteration across stable families.

Do not replace authored hero Residents/KayKit/FrizzleBob assets with this system.

## Exact state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01`
- Draft PR: #313
- frozen runtime source: `94443824e6b13f38c611defd06dacedd7c6d0faa`
- first local review artifact: `KFB_WC1_P0B_LOCAL_REVIEW.html`
- material isolation review source now also exists: `KFB_WC1_P0B_MATERIAL_REVIEW.html`
- Stage: none
- merge: none
- Live: none

## Local evidence

Returned local review JSON:
`evidence/KFB_WC1_P0B_LOCAL_2026-10-01T23-11-17-237Z.json`

Representative hardware:
- Apple M1 Max / WebGL2;
- 11 trees / 7 pebble clusters / 0 tufts under current strict Burg placement;
- props add +6 draw calls / +44,656 triangles;
- +0 geometries / +0 textures / +0 programs;
- returned props-on/off frame delta is not accepted as a stable cost estimate because props-on measured nominally faster than props-off.

## Source diagnosis for repetition

Current Global Clay Lite path:
- one shared Clay002 512 packed texture;
- object-space triplanar sampling;
- same-family instanced geometry shares one `claySeed` geometry attribute/phase;
- instance transform and colour vary, but the material coordinate seed does not vary per instance.

This is a plausible technical explanation for the observed repetitive/generic material character.

## Material follow-up · clay_floor_001

Follow-up human review on the parent WC1 material comparator supersedes the earlier assumption that Clay002 mainly needed a larger world repeat.

Visual result:
- **clay_floor_001 = best**;
- **current procedural Clay = second**, but comparatively buggy in the direct switch;
- Clay002 6 / 9 / 12 m still reads mostly as shading rather than a convincing clay texture;
- Derek remains open because it was not newly ranked in that specific scale review.

Technical refinement:
Global Clay Lite packs donor diffuse into luminance-gradient/value channels and keeps source object colour authoritative. Therefore the next useful question is **which donor/material family survives this lightweight semantics**, not whether Clay002 gets another anti-repeat pass.

Updated material review:
`KFB_WC1_P0B_MATERIAL_REVIEW.html`
now exposes the same frozen geometry with:
- clay_floor_001;
- current procedural Clay;
- Derek RGB;
- Clay002 negative control;
- Neutral.

Implementation checkpoint:
`42671b14167ee1872f0f75ce2f2edd57af24e235`.

Nonrepresentative diagnostic JSON retained:
`../evidence/WC1_DEREK_COMPARISON_NONREPRESENTATIVE_2026-10-01T23-32-47.json`.
Do not use its absolute fps/frame-time values as a performance verdict.

## Protected owners

Unchanged:
- WB2 / WC1 world+renderer;
- Track Core;
- Race/Ground movement;
- authored Resident/KayKit/FrizzleBob hero assets.

## Exactly one next gate

**MATERIAL ISOLATION · SAME GEOMETRY · CLAY_FLOOR FIRST**

Hold the accepted tree/prop geometry fixed and compare:
1. clay_floor_001;
2. current procedural Clay;
3. Derek RGB;
4. Neutral / Clay off.

Clay002 remains available only as a negative/control state. Do not add instance-aware phase/orientation until a visually preferred material still proves that it needs it.

No tree/prop geometry redesign in this gate.


## 2026-10-02 · deformation-lineage correction

Do not derive future procedural buildings from the reduced P0B proof deformation.

Binding routing:
`USE_WHAT_WORKS_DEFORMATION_ROUTING_2026-10-02.md`

Recovered proven lineage:
- Elastic Grotesque Clay V2;
- City Cartoon/Grotesque;
- LandmarkElastic;
- LOOK-TORSION architecture semantics;
- FACADE_RULE v1.

P0B trees/props remain approved as procedural family-generation donors, not as the authoritative building deformer.

Exactly one current next gate is now:
**GOLDEN DEFORMATION DONOR EXTRACTION** — source-backed donor sheet first; Claude building brief only after that.


## 2026-10-02 · Golden extraction + Environment Family P1

The **form/deformation lane** is now explicitly separated from the parallel material lane.

Completed source-backed routing:
- `USE_WHAT_WORKS_DEFORMATION_ROUTING_2026-10-02.md`;
- `STYLE_AXIS_POLLY_ROCKO_METROPOLIS_2026-10-02.md`;
- `GOLDEN_DEFORMATION_DONOR_EXTRACTION_2026-10-02.md`.

Completed Environment Family P1:
- source-derived spec: `ENVIRONMENT_FAMILY_P1_ROCKS_BUSHES_SPEC_2026-10-02.md`;
- reusable geometry-only module: `environment-family-p1.mjs`;
- internal source-isolation surface: `environment-family-p1-source-isolation.html`;
- test report: `ENVIRONMENT_FAMILY_P1_TEST_REPORT.md`.

P1 classification:
**SOURCE_DERIVED_GEOMETRY_PASS**

Verified donor roles:
- P0B tree = positive control;
- P0B pebble = small rounded cluster;
- K1 Golden rock = medium organic boulder;
- T3 Knetstrang rock = large accent mass;
- T3 Knetstrang bush = 2–3 lobe low cushion bush;
- KayKit Forest remains authored scale/variation corpus.

Modular Repair Pass 1:
- first modular direct-`file://` test timed out because the internal HTML imports a neighboring ES module;
- transport-only repair switched internal QA to localhost;
- no geometry/material/runtime-owner change.

PASS:
- tested head `b56f77165b82113757c222b1cfb80ed350553215`;
- run `36959777774`;
- job `110690683930`;
- evidence artifact `11207815421`;
- digest `sha256:95bc5a84d5d01e9ba1bf2dc10c56e8913aa04384906e162187616909d913e8c8`;
- 5/5 objects;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

The geometry module intentionally owns no material, renderer, placement, or frame loop.

### Parallel material lane

Material/Clay evaluation remains a separate parallel concern and is not advanced by this P1 result. P1 does not select Clay002, clay_floor_001, Derek, procedural Clay or any replacement material.

### Exactly one next gate for the FORM/ENVIRONMENT lane

**ENVIRONMENT FAMILY P2 · EXISTING PROP VOCABULARY EXTRACTION**

Recover the next already-existing prop families before creating any new ones, prioritizing logs / stumps / mushrooms / grass / markers only where real KFB/KayKit donors exist.

No material arbitration.
No procedural-building implementation yet.
