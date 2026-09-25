# TRACK-CORE-0 · Web census + core contract brief · 2026-09-26

**Executing agent:** **ChatGPT Web + GitHub**  
**Owner:** `georg-doc/KFB-Stunt-Car-Race`  
**Outcome:** complete track-geometry census + one implementation-ready Track-Core data contract  
**Implementation in this gate:** **NO**  
**Stage / Live:** **NO**

This is the immediate next gate.

## Start order

Read current GitHub state, not chat memory:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/START_HERE.md`
5. `.../EVIDENCE.md`
6. `.../PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`
7. Cologne Route 01 / PR #216 current recovery and RouteRecipe direction;
8. current `georg-doc/KFB-Stunt-Car-Race` main + current Race PR/branch state;
9. Race PR #42 / `chat/rkit-11-rhein-run-2026-09-26` → `rkit-11/RETURN.md`, `SOURCE.json`, `transition_lib.py`.

GitHub state overrides all dated refs below.

---

# Goal

Before any more track geometry is implemented, determine exactly:

- which track/route/sweep/collider paths already exist;
- which path owns what;
- what gets reused;
- what becomes reference/test oracle;
- what is superseded;
- what the **single Track Core contract** must be.

No new geometry implementation in this gate.

---

# 1 · Complete the geometry census

Read exact source at exact refs for all current/relevant paths.

Minimum census:

## Current / recent Race paths

- `KFB Cologne Race Option C-3/lab-v9/cologne-route.v1.js`
- `.../lab-v9/cologne-track.v1.js`
- current Race physics/collider generation that consumes the track;
- current accepted movement/feel host used by the intended playable Race;
- `ChatGPT_web/track-lab` v0.8 feel path;
- v0.10 topology path;
- PR #14 S-T01 Track Ribbon;
- `wsa/track-ribbon-st01b-2026-09-19`;
- `planning/track-environment-grammar-2026-09-19`;
- `chat/racer-rstab1-geometry-2026-09-23`;
- TARCH current geometry if it still owns useful continuous-body logic.

## RKIT paths

- RKIT-01 base sweep;
- RKIT-03 recipe/compiler/profile logic;
- RKIT-04 switch/merge;
- RKIT-06 OSM Trankgasse;
- RKIT-08/09 3D stunt sweep;
- RKIT-11 bridge + transition + stunt integration.

## World / OSM seams

- current OSM City road-centreline/export contract;
- Hürth / continuous corridor donor;
- WorldBuilder route/road authoring seam if it consumes RouteRecipe.

Do not read giant unrelated histories.

---

# 2 · Classify every path

Create:

`TRACK_GEOMETRY_CENSUS.md`

For each path record:

- repo / branch / head / path;
- language;
- inputs;
- outputs;
- frame definition;
- width/profile definition;
- bank/grade behavior;
- marking behavior;
- collider/contact ownership;
- split/merge support;
- 3D loop/stunt support;
- OSM support;
- tests/evidence;
- status:
  - `CORE_DONOR`
  - `CONSUMER_TO_KEEP`
  - `TEST_ORACLE`
  - `LEGACY_REFERENCE`
  - `SUPERSEDED`
  - `REJECTED_FOUNDATION`.

No vague “similar” classifications.

---

# 3 · Define the centre-line frame contract

Create:

`TRACK_FRAME_CONTRACT_v0.md`

Minimum state:

```text
P      position
T      unit tangent
U      unit up
R      unit right
s      arc length
kappa  signed horizontal/plan curvature or generalized curvature facts
grade  longitudinal slope
bank   roll around T
tags   semantic route/piece tags
```

Clarify:

- coordinate handedness;
- metre units;
- Blender transform;
- OSM local frame mapping;
- orientation propagation;
- how 2D roads are the flat special case;
- how 3D loop/ramp generators populate the same frame type.

Do not create separate “loop frames”.

---

# 4 · Define curvature-easing / Clothoid contract

The Perplexity research is accepted as **mechanism inspiration**, not code.

Write:

`CURVATURE_EASE_CONTRACT_v0.md`

Cover:

- straight → Euler/clothoid ease → constant/target curvature → ease → straight;
- curve → curve transitions;
- mirrored S-offset;
- chicane;
- hairpin approach/exit;
- endpoint constraints;
- min-radius constraint;
- length/ease constraint;
- OSM simplification use.

Specify desired continuity:

- position continuous;
- tangent continuous;
- curvature continuous where ordinary road/track semantics require it.

Do not pretend the Perplexity example implements a clothoid; it does not.

For loops and arbitrary 3D stunts, define a separate 3D centre-line generator interface feeding the same frames.

---

# 5 · Define the canonical slot profile

Create:

`TRACK_SLOT_PROFILE_v0.md`

One stable named slot topology.

At minimum evaluate slots for:

- road left/right;
- shoulder left/right;
- barrier inner/cap/outer left/right;
- underside;
- curb;
- walkway;
- optional structure attachment references.

The slot count/semantics remain stable.

Variation becomes values/visibility, not new mesh topology.

Explicitly prove the contract can describe:

- 6 m loop lane;
- 9.85 m RKIT-11 bridge carriageway;
- 10.8 / 14.4 / 18 / 21.6 RKIT classes;
- city street with curb + sidewalk;
- bridge walkways/parapets;
- race track with barriers;
- barrier-free road.

---

# 6 · Define parameter curves over s

Create:

`TRACK_PARAMETER_CURVES_v0.md`

Minimum curves:

- centre lateral offset;
- road width;
- shoulder width;
- curb width/height/visibility;
- walkway width/visibility;
- barrier height;
- barrier thickness/profile scale;
- underside/deck depth;
- road surface lift;
- per-slot visibility;
- marking blend weights;
- material/profile references;
- optional support/structure cues.

Required interpolation primitives:

- step only when intentionally semantic;
- linear;
- smoothstep;
- ease-in/out;
- curve ramp / explicit sampled curve.

RKIT-11 transition-zone timings are a donor for curve schedules, not geometry code.

---

# 7 · Define markings as an independent layer

Create:

`TRACK_MARKING_CONTRACT_v0.md`

Styles at minimum:

- `STREET`
- `TRACK`
- `MAG`

Support:

- centre line(s);
- lane lines;
- edge lines;
- tram/median bands where needed;
- stripe/pattern spacing;
- width;
- visibility/blend over `s`.

No host-line cutting.

No monkey-patching another sweep.

Avoid coplanar flicker; reuse current project depth-layer discipline.

---

# 8 · Define Piece schema

Create:

`TRACK_PIECE_SCHEMA_v0.json` + readable companion doc.

A piece contains:

- id/type;
- centre-line generator;
- start/end frame constraints;
- parameter curves;
- sockets;
- constraints;
- assist/gameplay metadata references;
- style/environment hints only as non-geometric refs.

Required piece types to support later:

- STRAIGHT;
- CURVE_EASE / BANK_EASE;
- OFFSET_S;
- CHICANE;
- HAIRPIN_180;
- STREET_TO_TRACK;
- GRADE / CREST / DIP / BRIDGE_APPROACH;
- LOOP;
- KICKER;
- LANDING;
- FUNNEL / LANE_TAKEOVER;
- SPLIT;
- MERGE.

A piece does **not** own its own sweep implementation.

---

# 9 · Define automatic checks

Create:

`TRACK_CORE_CHECKS_v0.md`

At minimum:

- endpoint position error;
- tangent discontinuity;
- curvature discontinuity where required;
- bank discontinuity;
- grade discontinuity;
- slot-set mismatch;
- slot-value jump;
- self-intersection;
- road-body fold;
- split/merge duplicate/coplanar faces;
- clearance envelope;
- structure collision;
- g/load envelope;
- marking continuity;
- RouteRecipe → frame output determinism;
- GLB/frame parity later;
- runtime collider/frame parity later.

Give units/tolerances as proposals, not invented accepted canon.

---

# 10 · Bind one RouteRecipe

The Cologne Route #216 recipe remains the single route truth.

Document exactly how:

`RouteRecipe → pieces → Track Core frames/parameter curves → render/collider/GLB consumers`.

No second route compiler.

---

# 11 · Language decision memo

Create:

`TRACK_CORE_LANGUAGE_DECISION_MEMO.md`

Compare only real options:

## JavaScript authoritative core

Pros/risks for:

- browser game;
- future editor;
- tests;
- geometry generation;
- collider generation;
- Blender import/export workflow.

## Python authoritative core

Pros/risks for:

- Blender/RKIT current scripts;
- geometry R&D;
- headless Blender;
- duplication required for web consumers.

## Hybrid

Only acceptable if one side is an **oracle/consumer**, not a second authoritative solver.

Current recommendation to evaluate:

**JavaScript authoritative core + Blender/Python numerical/visual oracle.**

Do not silently decide it in code.

Stop for Georg's language gate after returning the memo.

---

# 12 · Research-source handling

The Perplexity input is inspiration.

Record:

### Adopt

- Clothoid/Euler transition concept;
- connector boundary state;
- graph/RouteRecipe semantics;
- style layers;
- transition zones.

### Do not adopt

- provided Python generator as production base;
- separate road/line/barrier mesh generator;
- generic material system;
- destructive scene clearing;
- fake “Clothoid” circular arc;
- simplified current-position stepping;
- alpha geometry tricks for water;
- new parallel track graph/runtime.

---

# Deliverables

Under the current Track-Core workflow folder, return:

- `TRACK_GEOMETRY_CENSUS.md`
- `TRACK_FRAME_CONTRACT_v0.md`
- `CURVATURE_EASE_CONTRACT_v0.md`
- `TRACK_SLOT_PROFILE_v0.md`
- `TRACK_PARAMETER_CURVES_v0.md`
- `TRACK_MARKING_CONTRACT_v0.md`
- `TRACK_PIECE_SCHEMA_v0.json`
- `TRACK_CORE_CHECKS_v0.md`
- `TRACK_CORE_LANGUAGE_DECISION_MEMO.md`
- updated `EVIDENCE.md`
- additive `CHANGELOG.md`
- `RETURN.md`.

No runtime implementation.

## Done when

- every known geometry path is classified at exact refs;
- no owner ambiguity remains;
- contracts are sufficient for another agent to implement without inventing architecture;
- JS/Python choice is presented as one compact human gate.

## Exactly one next gate

**GEORG TRACK-CORE LANGUAGE GATE**.

After that choice, route to the prepared Track-Core implementation/proof briefs.
