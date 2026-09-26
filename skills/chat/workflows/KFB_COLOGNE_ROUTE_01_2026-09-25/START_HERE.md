# KFB Cologne Route 01 · Hürth → Dom → Rhein → Mülheimer Brücke → SAE

## CURRENT EXECUTION OVERRIDE · 2026-09-26 · TRACK CORE FIRST

A newer Track-Core planning slice in stacked PR #219 amends this execution order after Georg's RKIT-11 review.

Current product rule:

**one base Track Core; everything else is pieces/data.**

Race PR #42 / `chat/rkit-11-rhein-run-2026-09-26@bcc422b00fc4629ac113f086cddcea3b2b107f2a` is now the frozen acceptance fixture that proved why separate bridge/loop/host sweeps are the wrong architecture.

The Perplexity track-transition research has also been reviewed. Its useful mechanisms are folded into Track Core:

- real Clothoid/Euler curvature easing;
- connector boundary-state thinking;
- staggered transition zones;
- graph/RouteRecipe semantics;
- separate style/prop/FX layers.

Its example Python generator is **not** a production donor.

The implementation order is now:

```text
TRACK-CORE-0 · Web census + core contract
→ Georg core-language gate
→ TRACK-CORE-1A · Claude Coworker + Blender MCP geometry oracle/proof
→ TRACK-CORE-1B · Web authoritative core + runtime parity
→ TRACK-CORE-2 · Claude Design transition visual grammar
→ WEB-PREP-TRACK-R0
→ CLAUDE DESIGN PLAYABLE-TRACK-R0
→ WEB REHOME / BROWSER FREEPLAY / HUMAN GATE
→ WEB PREP real OSM Route 01
→ CLAUDE DESIGN OSM composition
```

M1–M4 below remain the required **piece semantics**, but they are no longer separate geometry systems. They are built on the single Track Core.

**Track first still does not mean OSM later as a bolt-on.** The Track Core and later Web prep preserve the same RouteRecipe, metre-frame, street↔track and OSM seams from the start.

Current Track-Core source of truth is stacked PR #219:

`skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/START_HERE.md`

Prepared agent briefs there:

- ChatGPT Web: `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md`
- Claude Coworker + Blender MCP: `BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md`
- ChatGPT Web: `WEBCHAT_TRACK_CORE_1B_RUNTIME_PARITY_BRIEF.md`
- Claude Design: `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md`

The Track-R0 briefs in this folder remain prepared downstream consumers.

**Exactly one current next gate: TRACK-CORE-0 · ChatGPT Web census + core contract.**

---

**Status:** PLAN DIRECTION CONFIRMED BY GEORG · IMPLEMENTATION NOT STARTED  
**Date:** 2026-09-25  
**Planning owner:** `georg-doc/kayfabizarro` · chat workflow layer  
**Implementation owner:** `georg-doc/KFB-Stunt-Car-Race` for route/track/vehicle/physics; existing WorldBuilder / OSM City owners remain unchanged  
**Target:** one reusable route system, not one hard-coded Köln level

## 1 · Product goal

Build the first long KFB drive as one semantic route from the existing Hürth world toward central Köln, past the Kölner Dom, along the Rhine, across the Mülheimer Brücke and into Mülheim / SAE.

The same underlying route system must support three authoring sources:

1. **real geography** — OSM centre lines / corridors;
2. **authored tracks** — a human places a few meaningful bends, hairpins, ramps, loops or branches;
3. **seeded/generated tracks** — a grammar chooses compatible route gestures and constraints.

All three compile into the same route recipe and the same RKIT geometry pipeline.

## 2 · Core decision: route first, presentation second

The track is **not** a chain of rigid decorative GLBs.

The durable object is a route / centre-line with frames and semantic sections. Geometry is generated from it.

Conceptually:

```text
route source
  OSM | hand editor | seeded generator
        ↓
semantic RouteRecipe
        ↓
continuous solved spline + elevation + bank
        ↓
cross-section / edge / surface profiles
        ↓
stunt modules + branches + supports
        ↓
baked route + GLB + gameplay metadata
```

This preserves the existing RKIT principle: profile + script swept along the route.

### Consequence

The **same route segment** can be presented as:

- ordinary OSM city street with curb + sidewalk;
- rural/open road with no barriers;
- race ribbon with low or high barriers;
- fenced industrial road;
- elevated viaduct;
- wide hero track;
- stunt approach;
- narrow drift lane;
- track embedded into terrain.

Changing presentation must not require replacing the semantic route.

## 3 · Five independent layers

### A. Route geometry

Owns only where the drive line goes:

- x/y/z;
- tangent;
- curvature;
- grade;
- bank;
- width class / width target;
- anchors;
- branch topology.

OSM, the editor and the generator all produce this layer.

### B. Cross-section profile

Owns the surface around the centre-line:

- road/track width;
- curb;
- sidewalk;
- shoulder;
- slab/body;
- drainage/ground seam if needed.

Existing RKIT city street and rounded track profile are donors.

### C. Edge treatment

Independent from the surface profile:

- none;
- painted edge;
- curb;
- low race barrier;
- high race barrier;
- fence;
- guardrail;
- wall;
- transparent safety mesh;
- authored KFB variant later.

This is how one road design can vary by terrain and district without rebuilding the route.

### D. Structural / environment treatment

- ground-supported;
- embankment/skirt;
- pillars;
- arches;
- bridge deck;
- tunnel;
- cliff attachment;
- later globe-normal support.

### E. Stunt / gameplay module

A stunt is attached to or branches from the route through anchors/sockets.

Examples already present or in current RKIT candidates:

- tabletop jump;
- hero step-down jump;
- flap/dive return;
- tunnel;
- bowl;
- switch / pit;
- LOOP_REAL;
- MAG loops/cascade;
- SKYRAMP.

Race remains owner of contact, capture, flight, landing, drift assist and recovery.

## 4 · Current verified/reusable donors

Do not rebuild these from prose. Read the actual source objects/branches first.

### Race / RKIT

Current Race implementation SSOT: `georg-doc/KFB-Stunt-Car-Race`.

Relevant current candidate chain:

- PR #34 · RKIT-01 rounded route-sweep profile, supports, arches, ground skirt;
- PR #35 · RKIT-02 jumps/flaps;
- PR #36 · RKIT-03 recipe/compiler, funnels, bowl, city street, tunnel;
- PR #37/#38 · switch, pit, flap-return branch;
- PR #39 · RKIT-06 real OSM Trankgasse in the OSM frame;
- PR #40 · RKIT-07 + canyon/rollercoaster probes;
- PR #41 · RKIT-08/09 loops + skyramp.

Important: these are candidates/open PRs unless their own current state says otherwise. Do not silently treat all of them as merged Race runtime.

### OSM / World

- Hürth v0 fixed 700 × 700 m source fixture exists and is deterministic;
- World Integration 01 already mounts Hürth in the real WB2 editor and reports 26/26 selftests, with human gate still open in its Return;
- `dom-zentrum-v0` exists for central Köln;
- RKIT-06 proves OSM centre-line → RKIT geometry in the same metre frame;
- existing WorldBuilder `edit-layer.js` remains the single object-transform owner.

## 5 · Cologne Route 01 acts

The first route is planned as:

1. **HÜRTH START** — normal street/free drive, parking, acceleration;
2. **LUXEMBURGER AXIS** — road-trip transition toward central Köln;
3. **DOM / TRANKGASSE** — tight urban section and first drift-focused choreography;
4. **RHEINUFER** — wide speed/spectacle lane, optional stunt branches;
5. **MÜLHEIMER BRÜCKE** — elevation/horizon act and bridge approach;
6. **MÜLHEIM / CARLSWERK** — industrial narrow/drift finale;
7. **SAE ARRIVAL** — destination/free-roam handoff.

The route should follow real geography as its base but may exaggerate height, curvature and stunt branches in the KFB world.

## 6 · Missing core module families

Do not commission many one-off Blender pieces first.

Build these four generic families:

### M1 · CURVE_EASE / BANK_EASE

Continuous straight → curve → curve transitions with bank easing.

Purpose:
- no visible bank dip between curve modules;
- smooth curvature for real roads and generated tracks;
- supports arbitrary radii instead of a catalogue of fixed 45° meshes.

### M2 · OFFSET_S / CHICANE / HAIRPIN_180

One parametric family for:
- lateral S-offset;
- left/right chicane;
- 180° hairpin;
- chained switchbacks/serpentines.

This is the geometric basis for the Tokyo-Drift prototype.

### M3 · STREET_TO_TRACK_ADAPTER

Morph between:
- OSM street profile: road + curb + sidewalk;
- RKIT race profile: shoulder + barrier / chosen edge treatment.

It must work in both directions and preserve route continuity.

### M4 · GRADE / CREST / DIP / BRIDGE_APPROACH

Vertical route treatment with controlled vertical radius.

Purpose:
- ground → elevated track;
- bridge approaches;
- crests/dips;
- viaduct entries;
- smooth return to street/terrain.

## 7 · Tokyo Drift is a recipe, not a special track asset

Do not create `tokyo_drift_track.glb` as a one-off.

The first drift proof should be a RouteRecipe composed from M1/M2/M3/M4 plus existing RKIT profiles.

Same geometry, different Race assist profiles:

- **CHILL / SHOW:** strong capture + commit + recover;
- **DRIVE:** reduced assistance, player can overcook the corner;
- later profiles may vary traction or vehicle setup without replacing geometry.

Use the existing semantic assist sequence:

`free → capture → commit → release → recover`.

## 8 · One compiler, three authoring modes

### OSM mode

`OSM road graph → selected route/corridor → simplified/fitted route anchors → RouteRecipe`.

The OSM line remains provenance and geography truth; the authored track may use a controlled deviation envelope for KFB exaggeration.

### Simple editor mode

The player/designer places only meaningful controls:

- route point / handle;
- Turn;
- S-Bend;
- Hairpin;
- Loop socket;
- Jump socket;
- Bridge / elevation gesture;
- Branch / merge;
- Snap to OSM road.

The compiler fills all intermediate spline frames, transitions, banking, profile morphs and supports.

### Seeded generator mode

A grammar chooses compatible gestures under constraints:

- available distance;
- min radius;
- max grade;
- terrain envelope;
- stunt difficulty;
- no-repeat/seed;
- start/end anchors.

It outputs the same RouteRecipe as OSM/editor mode.

## 9 · Simple editor product model

The future editor should edit **intent**, not individual mesh vertices.

A minimal first UI can be:

```text
[Road] [Turn] [S] [Hairpin] [Jump] [Loop] [Bridge] [Branch]
```

Place/drag a small number of anchors in the world. Each node exposes only useful parameters such as:

- direction/radius;
- length;
- width class;
- elevation;
- bank strength;
- edge treatment;
- optional stunt recipe;
- safe bypass yes/no.

Preview regenerates from the route compiler.

WorldBuilder owns world placement/terrain authoring. Race/RKIT owns route compilation and track geometry. Do not create a second WorldBuilder or a second Race runtime.

## 10 · Proposed common data contract

Illustrative shape only; implementation may refine names without changing the separation:

```json
{
  "schema": "kfb.route-recipe.v1",
  "source": { "type": "osm|editor|seeded", "ref": "..." },
  "anchors": [
    { "id": "A0", "p": [0,0,0], "gesture": "street" },
    { "id": "A1", "gesture": "hairpin", "radiusM": 28 },
    { "id": "A2", "gesture": "loop_socket", "moduleRef": "LOOP_REAL" }
  ],
  "sections": [
    {
      "from": "A0",
      "to": "A1",
      "surfaceProfile": "CITY_STREET",
      "edgeProfile": "NONE",
      "structureProfile": "GROUND"
    }
  ],
  "assistProfile": "CHILL"
}
```

Compiler output remains the familiar RKIT form:

- baked centre-line / frames;
- width/bank/grade/tags;
- anchors/sockets;
- support stations;
- GLB geometry;
- gameplay-free stunt metadata.

## 11 · First bounded implementation slice

**Name:** `RKIT-10 · Modular Route Adapters v1`

Build only:

1. M1 curve/bank easing;
2. M2 S/chicane/hairpin;
3. M3 street↔track morph;
4. M4 grade/crest/bridge approach;
5. one small proof recipe:
   `CITY_STREET → S-BEND → HAIRPIN → TRACK → LOOP socket/bypass → TRACK → CITY_STREET`.

Do not build Hürth→SAE in full yet.

Stop after the generic grammar proves that ordinary OSM street and spectacular race/stunt geometry can share one route without a seam.

## 12 · Gate after RKIT-10

Only after RKIT-10 geometry is proven:

**COLOGNE-ROUTE-01-P0 · Route Corridor**

Pin the actual Hürth → Dom → Rhein → Mülheimer Brücke → SAE OSM corridor, split it into manageable chunks and classify each route section against the reusable grammar.

Then commission only the remaining genuinely missing geometry.

## 13 · Protected boundaries

- no second vehicle controller;
- no second OSM city system;
- no second WorldBuilder;
- no editor that directly edits thousands of mesh points;
- no one-off asset for a shape that should be parametric;
- no hidden air rail;
- no claiming loops/skyramp are drive-tested until Race proves them;
- no full Köln geometry dump when a route corridor is sufficient;
- no auto-merge or Live promotion without the named human gate.

## 14 · Next gate

**Run RKIT-10 as a Blender/Claude/MCP geometry slice and return an isolated source-object proof of each new family before composing the small street→drift→stunt→street recipe.**
