# KFB clay building / façade routing

Status: **CURRENT SHARED ROUTER · NO NEW RUNTIME OWNER**  
Date: 2026-09-29  
Purpose: make the already accepted/prepared clay-building rules discoverable across WorldBuilder, OSM City, Track/World design and Claude Design.

## Resolve sources in this order

### 1 · Source / ownership grammar: S5 Building / Façade Clay Adapter

Prepared S5 exists and is **not on main**.

Exact source:
- branch: `georg-doc-patch-2`
- branch head checked 2026-09-29: `3232a1070686896833d6b7942fcd631b9fa8cda6`
- `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S5_BUILDING_FACADE_CLAY_ADAPTER_2026-09-27/START_HERE.md`
- `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S5_BUILDING_FACADE_CLAY_ADAPTER_2026-09-27/BRIEF_CLAUDE_DESIGN_BUILDING_FACADE_CLAY_ADAPTER_S5.md`

S5 remains the best current statement of the intended adapter:
- one mixed OSM + KayKit + Kenney world;
- show each real source object unchanged in isolation before adaptation;
- preserve OSM geography/footprint/height/identity;
- preserve KayKit/Kenney source identity and modular anchors/connectors;
- WorldBuilder / OSM City owns placement and the active building renderer;
- Track Core remains road/track only;
- clay is a presentation/preprocess layer, not a second city generator;
- no generic substitute buildings and no replacement landmark identity.

### 2 · Current clay surface/material baseline: K2

The 2026-09-28 K2 handover is **ACCEPTED AS BASE**.

Source:
`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/HANDOVER_WSA.md`

For **new stages**, use:
- `clay-material.v10.js`;
- `clay-relief.v4.js`;
- `clay-toolmix.v1.js`;
- `clay-profiles.v2.js` where the consumer uses the shared profiles.

K2 explicitly says v10 is the successor for new stages while accepted older stages remain on their own frozen versions. H0 stays on its accepted v8 line; do not silently migrate H0 merely to make version numbers uniform.

### Important S5 version correction

S5 was prepared one day before K2 and still names the older H0 `clay-material.v4.js` path.

Interpret that as **provenance / H0 reuse intent**, not as the current material version for a new 2026-09-29 scene.

Do not regress a new façade adapter from K2 v10 back to v4 unless a bounded legacy comparison explicitly requires it.

### 3 · OSM / WorldBuilder building geometry and façade grammar

Current proven WorldBuilder/World Integration sources:
- Elastic Grotesque Clay V2 geometry basis:
  `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
  pinned by the WorldBuilder docs at `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`;
- `kfb-facade-rule-v1` from WB-D2;
- `FACE_NORMALS` from World Integration r2;
- host/support behavior from World Integration r2;
- shared shadow/contact recipe:
  `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`.

Evidence paths:
- `tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell 2-1/SESSION_2026-09-25_WB-D2/CHANGELOG.md`
- `tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell 2-1/SESSION_2026-09-25_WB-D2/HANDOVER_WSA.md`
- `tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/HANDOVER.md`

These are not merely style notes. World Integration r2 records the façade rule, normal repair and support behavior as global OSM presentation behavior and its Recovery explicitly says to preserve them.

### 4 · LOOK-TORSION architecture result

Binding cross-project policy:
`skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`

Georg's result is **ARCHITECTURE PASS ONLY**.

Retain:
- cumulative height-dependent geometric torsion;
- anchored base;
- a shared final deformation field for roof and body;
- role/height-dependent magnitude family.

Do **not** infer:
- a universal final twist/bend angle;
- acceptance of the grey isolated proxy's materials, lighting or shadows;
- permission to create a second deformer.

The next visual calibration belongs in the real WorldBuilder/world context.

### 5 · Current 2026-09-29 World Core R0A donor

Current main source:
`tools/KFB-ToolBox/_inbox/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/`

GitHub main currently labels it **CANDIDATE · visual donor only**.

Its recipe uses:
- K2 v10 clay material/tool mix;
- actual KayKit / Kenney / Tiny Treats donors;
- `transition-atlas.v1 bend()` for the candidate's building bend/twist/height rhythm;
- baseplate-free kit variants where available;
- terrain embedding / sink and a clay seam around buildings.

That candidate does **not** become a new universal deformation owner by existing. If accepted, its recipe is a visual donor that the receiving World/Core runtime reconciles with the established WorldBuilder/S5 ownership.

Routing correction: the R0A design page footer names `export/WORLD_CORE_MOBILITY_R0A_2026-09-29/START_HERE.md`, but that export subpath is not present on main. The actual handover is the sibling file `WORLD_CORE_MOBILITY_R0A_2026-09-29/START_HERE.md`. Treat the footer path as stale display text, not as evidence that the handover is missing.

Its current `START_HERE.md` says contact shadows are outside R0A runtime ownership. That is valid as an ownership boundary, but design/runtime consumers must still read the shared shadow recipe rather than rediscovering the known bright-seam problem.

## The five layers must stay separate

“Clay façade” is not one shader switch. Resolve these layers independently and then compose them:

1. **Source truth / placement**  
   OSM footprint/height/identity or kit model/anchors/connectors.

2. **Massing deformation**  
   Elastic / accepted deformation semantics. Preserve the anchored base and keep roof/body on the same final deformation field.

3. **Façade detail grammar**  
   `kfb-facade-rule-v1` for normal OSM shells; source-native doors/windows/details remain protected where they already exist. Party-wall and street-facing rules stay semantic, not decorative guesswork.

4. **Clay surface**  
   K2 material/relief/tool mix for new stages. Surface clay does not replace source geometry ownership.

5. **Normals + support + contact**  
   FACE_NORMALS, roof relationship, terrain support and the shared texel-relative shadow/contact recipe.

Do not solve a defect in layer 5 by replacing layer 2 or 4.

## Binding façade behavior already proved

For normal OSM buildings:
- FACADE_RULE v1 applies globally unless a protected landmark owner takes over;
- party walls remain blank;
- window rows and door placement follow the existing semantic rule rather than one generic façade stamp;
- doors/windows follow the deformed shell;
- roofs remain coherent with the shell; concave problematic footprints may route to the proven flat-roof fallback;
- wall normals are not averaged with cap/roof triangles;
- support changes move walls, roof, windows and doors together;
- no fake base plate is added to hide terrain/contact mistakes.

For kit buildings:
- show the original donor first;
- retain recognizable source identity;
- retain modular snap/anchor geometry;
- clay softening/deformation is visual/preprocess adaptation, not re-modelling into an unrelated procedural box;
- source-native details should not be erased and then re-invented generically.

## Source-isolation gate

Before integrating a building family, the evidence must show:

1. exact real source object/group unchanged;
2. same source with clay adaptation;
3. close façade/roof/base view;
4. integrated mixed streetscape/world view.

A loaded asset URL or a donor name in code is not proof that the actual donor design survived adaptation.

## Do not

- create a second WorldBuilder, city generator or universal deformer;
- move OSM footprints for composition;
- deform Track Core geometry as a substitute for the building adapter;
- replace source-native KayKit/Kenney buildings with generic boxes;
- restore stale H0 material versions in a new K2-era scene;
- let windows/doors/roofs remain in undeformed coordinates while the body bends;
- hide contact errors behind plinths/base plates;
- accept bright roof/contact bands as clay shading;
- hard-code one torsion angle as “the accepted KFB amount”.

## Current open items

1. S5 is fully present but branch-local on `georg-doc-patch-2`; it is easy to miss in a main-only search.
2. S5's material-version references predate the accepted K2 v10 baseline and need this override.
3. World Core R0A is still a visual candidate according to current GitHub main; its bend rhythm is not automatically a promoted shared owner.
4. The H0/K2 preprocessing/per-pixel cost still needs the receiving runtime's performance decision; S5 already asks for runtime-vs-prebaked evidence.
5. Shared shadow/contact consumption remains open under issue #247 even though the recipe itself is known.

## Fresh-chat instruction

When a task mentions any of these phrases —

`clay buildings`, `Knetgummi-Fassade`, `wonky façade`, `OSM clay`, `building deformation`, `Hirnwelt building look`, `Elastic Grotesque`, `FACADE_RULE`, `LOOK-TORSION`

— read this router before creating or tuning building geometry.
