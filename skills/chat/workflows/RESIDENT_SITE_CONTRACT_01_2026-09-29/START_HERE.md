# RESIDENT-SITE-CONTRACT-01 · Graveyard as terrain-aware Site Module

Status: **CLAUDE DESIGN REBRIEF · RESIDENT/SCENERY OWNER ONLY · NO WORLDBUILDER INTEGRATION YET**  
Date: 2026-09-29  
Owner: existing **Resident Atlas / Resident Scenery** Claude Design project  
Coordination repo: `georg-doc/kayfabizarro`  
Prepared from main: `09737a8f8fd7f71c979f292322c755d0f2c2168b`  
Stage: **none**. This is an authoring/checkpoint slice, not a public-review milestone.

## 0 · Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`
5. current Resident Atlas Session Cut:
   `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/`
6. current WorldBuilder routing for interface facts only:
   `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md`

GitHub state overrides chat memory. The current WorldBuilder direction is **continuous procedural terrain + productive Scene Editor**. Do not invent another terrain/world format in Resident Atlas.

## 1 · Why this rebrief exists

The last Resident/Scenery pass produced useful runtime fixes but then drifted toward asking Georg to locate/re-explain the WorldBuilder and toward making the Resident scene responsible for terrain shaping.

Correct boundary:

- **Resident / Actor:** no ground plane; does not modify terrain; consumes host contact/grounding.
- **Scene / Set / Site Module:** no world ground of its own; may declare what the site requires.
- **WorldBuilder:** sole owner that actually modifies/sculpts world terrain when it consumes a site contract.

The graveyard is the first site that proves this separation because an open grave, crypt cut, path entrance and sloped placement cannot be represented honestly by "put everything at floorY = 0".

## 2 · Current Resident facts to preserve

GitHub current Session Cut proves S11/S11b graveyard source/layout lineage and S40 host-environment conventions. Do not rebuild those.

Current **user-reported Claude session delta, not yet durable in the GitHub Session Cut**:

- ~**50 fps at 1280×720** in the current Claude preview;
- skeleton jitter cause identified: the graveyard reset skeletons to height 0 every frame while expensive ground correction was recomputed only every second frame;
- current correction is applied every rendered frame while expensive contact measurement remains throttled;
- changes below roughly **4 mm** are held to avoid support-foot flip jitter;
- Band and Disco scene-specific grounds were disabled so those scenes consume one shared host ground;
- terrain below graveyard floor tiles is lowered enough that the open grave remains open instead of being filled by the host terrain.

These are valuable findings but **must be checkpointed first**. Do not call them GitHub-proven until the next complete Claude Session Cut contains the exact source/evidence.

## 3 · First action: preserve the current good state

Before implementing a new contract:

1. export/checkpoint the complete editable Resident Atlas Claude source that currently contains the ~50 fps, anti-jitter, unified-ground and open-grave fixes;
2. append its changelog/Return;
3. record the actual test setup:
   - viewport;
   - measured FPS method/window;
   - active residents/actors;
   - draw calls;
   - triangles;
   - shadow-casting lights / shadow casters;
   - DPR/renderScale if applicable;
4. preserve the earlier Session Cut unchanged.

If any of these numbers are not currently measurable, write `UNKNOWN`; do not guess.

## 4 · Core outcome

Create **RESIDENT-SITE-CONTRACT-01** as a reusable, Resident-owned data/interface module for terrain-aware sets.

The graveyard remains the first consumer.

Done when:

- the graveyard scene can be described without owning a ground mesh or WorldBuilder terrain engine;
- its actors/props remain relative to one stable site anchor;
- open grave / crypt / path requirements survive as explicit contract data;
- one small test harness can move the same graveyard contract over neutral synthetic terrain fixtures without creating a second world runtime;
- current Resident Atlas scene/performance still works.

This is **not** a WorldBuilder integration gate.

## 5 · Site contract

Use a compact independent JS/JSON contract. Exact field names may change if an existing KFB Scene Patch/World Recipe field already owns the same fact. Reuse existing fields instead of duplicating them.

Minimum semantics:

```js
{
  schema: "kfb.site-placement/0.1-candidate",
  id: "resident-graveyard-01",
  anchor: { position, rotation, scale },

  footprint: {
    polygon,          // local XZ extent used for placement / conflict tests
    supportMode       // e.g. TERRAIN
  },

  gradeZone: {
    polygon,
    mode,             // LEVEL / FOLLOW_SLOPE / NONE
    maxCut,
    maxFill
  },

  blendZone: {
    polygon,
    falloff
  },

  cutouts: [
    // open grave, crypt/cellar void, pond, trench, etc.
    { id, polygon, depth, profile }
  ],

  keepTerrain: [
    // explicitly preserve host terrain here
  ],

  sockets: {
    entries: [],
    paths: [],
    residentSpawns: [],
    propAnchors: []
  },

  bounds: {
    visual,
    interaction
  },

  budget: {
    lodClass,
    contactUpdateClass,
    detailDistanceClass
  }
}
```

### Binding ownership rule

The contract **describes** desired terrain relationship. It does not execute terrain deformation.

No Resident module may call a new private terrain sculptor. A later WorldBuilder consumer decides how its existing terrain owner satisfies `gradeZone`, `blendZone` and `cutouts`.

## 6 · Graveyard mapping

Map the existing graveyard to the contract rather than redesigning it:

- current plaza/tile footprint → `footprint` / `gradeZone`;
- outer edge around the set → `blendZone`;
- open grave → first mandatory `cutout`;
- crypt/subsurface clearance, if genuinely required by source geometry → another `cutout`;
- gate → entry/path socket;
- current dancing skeleton positions → resident spawn sockets;
- gravestones, fences, props → prop anchors relative to site anchor.

Do **not** flatten the whole world around the cemetery. Level only what the set actually requires.

## 7 · Test fixtures, not a second WorldBuilder

The Resident project may use three tiny synthetic terrain fixtures solely to validate the contract:

1. level meadow;
2. gentle cross-slope;
3. path-edge / local rise.

The harness may visualize requested grade/blend/cutout regions and place the current set against them.

It must not become:
- a terrain editor;
- a procedural world generator;
- a WorldBuilder replacement;
- a new Scene Patch owner;
- a new human review product.

No Georg gate is required for this internal contract proof unless the real Resident scene becomes visually ambiguous.

## 8 · Grounding/performance rule recovered from this pass

Preserve these mechanisms as reusable Resident performance rules:

### Measure slow, apply fast
Expensive contact measurement may be throttled. The latest accepted correction must still be applied every render frame.

### Ground hysteresis
Tiny measured changes around support-foot swaps must not cause root-height oscillation. Keep the current ~4 mm threshold as **current candidate data**, not universal canon, until measured across more clips/scales.

### One host terrain
Band, Disco, Graveyard and later Resident scenes must not carry hidden competing ground surfaces when mounted in a world.

### Distance-budgeted clay/detail
Fingerprint/tool-mark/relief detail, expensive contact sampling and secondary scene detail should expose distance/LOD classes so world consumers can reduce cost away from the camera. Do not hardwire Racer-specific distances in Resident Atlas.

## 9 · Protected boundaries

Do not change in this slice:

- WorldBuilder terrain engine;
- WorldBuilder save/reload;
- WorldBuilder OSM/Cologne seam work;
- Race/Track owner;
- Travel/TinySkies owner;
- Resident animation/motion ownership;
- Motion Library;
- Scene Patch owner;
- Asset Librarian;
- current graveyard source layout unless required by the contract extraction.

Do not ask Georg where the current WorldBuilder is. The router above is the source pointer.

## 10 · Issue classification / budget

**CORE_BLOCKER**
- site cannot be represented without a private Resident terrain engine;
- current graveyard performance/regression breaks;
- open grave cannot remain an explicit cutout in contract data.

**MINOR / QUARANTINABLE**
- one prop clips on the synthetic slope fixture;
- one optional graveyard decoration has a bad pivot;
- one scene-specific light needs later tuning.

One diagnostic pass maximum for minor issues, then defer.

After two failed repairs of the same contract/placement gate: stop and export full failure recovery.

## 11 · Return required

Return:

- exact Claude Session Cut version that first preserves the current ~50 fps / grounding fixes;
- changed files;
- actual measured performance facts;
- the standalone site-contract JS/JSON module;
- graveyard mapping;
- internal fixture results;
- unresolved items;
- exactly one next gate.

Exactly one next gate after this slice:

**WORLD-SITE-CONSUMER-01 · Fresh Web WorldBuilder slice consumes the accepted graveyard site contract through the existing terrain/Scene Editor owners.**

Do not start that WorldBuilder integration inside the Resident/Scenery Claude project.
