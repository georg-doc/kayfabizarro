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
