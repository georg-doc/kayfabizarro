# RKIT-10 · Claude + Blender MCP implementation brief

## CURRENT OVERRIDE · SUPERSEDED FOR EXECUTION BY TRACK CORE PR #219

Do **not** start this older RKIT-10 brief directly.

Its M1–M4 requirements remain valid as **piece semantics**:

- M1 CURVE_EASE / BANK_EASE;
- M2 OFFSET_S / CHICANE / HAIRPIN_180;
- M3 STREET_TO_TRACK;
- M4 GRADE / CREST / DIP / BRIDGE_APPROACH.

But Georg's newer decision after RKIT-11 is:

**one base Track Core; everything else is pieces/data.**

The current Blender executor brief is:

`skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md`

and starts only after:

1. TRACK-CORE-0 Web census/contracts;
2. Georg's core-language decision.

That newer brief incorporates the useful Perplexity mechanisms:

- real Clothoid/Euler curvature easing;
- canonical connector/frame state;
- canonical slot topology + parameter curves over `s`;
- staggered transition zones;
- common marking layer.

The Perplexity example Python generator is not a production donor.

This file is retained as Route-01 provenance/history for the M1–M4 intent.

---

**Executor:** Claude Code / Claude Coworker with Blender MCP  
**Owner:** `georg-doc/KFB-Stunt-Car-Race`  
**Outcome:** one reusable parametric connector family proving street → drift geometry → stunt socket → street on the existing RKIT route grammar  
**Do not merge automatically. Do not promote Live.**

## Start by reading current GitHub truth

Read completely, in this order:

1. `georg-doc/kayfabizarro/skills/chat/START_HERE.md`
2. `georg-doc/kayfabizarro/skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `georg-doc/kayfabizarro/skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `georg-doc/kayfabizarro/skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/START_HERE.md`
5. current `georg-doc/KFB-Stunt-Car-Race/main` → `WSA_START.md`, `RECOVERY.md`
6. Race PR #39 branch `chat/rkit-06-trankgasse-2026-09-24`:
   - `_handover/RKIT_TRACK_KIT_2026-09-24/RKIT_KIT_GUIDE.md`
   - `_handover/RKIT_TRACK_KIT_2026-09-24/WSA_HANDOVER_RKIT_2026-09-24.md`
   - `KFB Cologne Race Option C-3/rkit-03/`
   - `.../rkit-06/`
7. Race PR #40 only for the later `SWITCH_Y trim_to_seam` repair; do not regress it.
8. Race PR #41:
   - `KFB Cologne Race Option C-3/STUNT_MODULES_RKIT08_09_HANDOVER_2026-09-25.md`
   - isolate `LOOP_REAL` only if used in the composition proof.

GitHub state overrides this brief when facts conflict.

## Base rule

RKIT geometry is **profile swept along a solved route**, not a box of rigid prefab turns.

Do not respond to this task by making fixed 45°/90° decorative pieces for every possible corner.

The reusable result must accept route parameters and generate the intermediate geometry.

## Before you model anything new: source-object proof

In Blender, show these existing donors **in isolation** and capture them before integration:

1. current rounded RKIT track profile / swept curve;
2. current CITY_STREET profile;
3. current funnel/profile transition;
4. current SWITCH_Y with the PR #40 seam repair when relevant;
5. `LOOP_REAL` from PR #41 if the final proof includes it.

A loaded filename or asset URL is not proof. The actual source object must be visibly shown.

Record exact repo/ref/path for every donor in `SOURCE.json`.

## One branch

After source recovery, use one review branch in Race:

`chat/rkit-10-modular-route-adapters-2026-09-25`

Do not silently merge #39, #40 or #41.

Recommended base if still valid after recovery: PR #39 head / its complete RKIT-01→06 lineage, then port only the narrow PR #40 seam correction and any exact PR #41 source object needed for the isolated stunt socket proof.

If GitHub has moved, record the newer exact base instead.

## Build only four parametric families

### M1 · CURVE_EASE / BANK_EASE

Goal: arbitrary straight/curve transitions with continuous curvature intent and smooth bank.

Inputs should support at least:

- entry tangent;
- exit tangent or requested turn angle;
- target radius / curvature;
- length/ease distance;
- entry bank;
- target bank;
- exit bank;
- width/profile ref.

Required behavior:

- no position gap;
- tangent continuity;
- bank returns/continues smoothly, not a forced zero-bank notch between adjacent curves;
- no body self-fold at valid radius/width combinations.

Prefer a reusable route solver/helper over a new mesh primitive.

### M2 · OFFSET_S / CHICANE / HAIRPIN_180

One family, not three unrelated assets.

Support:

- signed lateral offset;
- left/right sequence;
- total length;
- target/min radius;
- 180° hairpin;
- optional bank;
- width class;
- optional runoff / edge-treatment sockets.

Prove:

1. mild S-offset;
2. left-right chicane;
3. one 180° hairpin;
4. two hairpins chained as a short serpentine.

This becomes the Tokyo-Drift geometry basis.

### M3 · STREET_TO_TRACK_ADAPTER

Morph the cross-section on one continuous route.

A-side:
- CITY_STREET road;
- curb;
- sidewalk;
- no race barrier by default.

B-side:
- RKIT race surface;
- shoulder;
- edge treatment / barrier socket.

Inputs:
- transition length;
- street width;
- track width class;
- curb/sidewalk fade;
- selected edge-treatment profile.

Must work in both directions.

Do not move the route centre-line just to hide a profile mismatch.

### M4 · GRADE / CREST / DIP / BRIDGE_APPROACH

Parametric vertical treatment.

Support:
- start/end height;
- length;
- maximum grade;
- vertical ease / crest radius;
- optional constant elevated section;
- support-profile ref.

Prove:
- ground → elevated bridge approach;
- crest;
- dip;
- elevated → ground return.

No vertical wall or one-frame height jump.

## Edge treatment must be independent

Do not bake “race barrier” into every generated road.

Implement or expose a small edge-treatment contract compatible with at least:

- `NONE`
- `CURB`
- `LOW_BARRIER`
- `HIGH_BARRIER`
- `FENCE_SOCKET`

If actual fence/guardrail art is not already a verified donor, keep it as a socket/semantic output rather than inventing replacement art.

This separation is mandatory because the same route must later render as city street, country road, industrial fenced road or race track.

## Proof recipe

Build one compact authored recipe using the new families:

```text
CITY_STREET
→ STREET_TO_TRACK
→ OFFSET_S
→ CHICANE
→ HAIRPIN_180
→ TRACK
→ LOOP_REAL socket + safe bypass
→ GRADE / short bridge approach
→ TRACK_TO_STREET
→ CITY_STREET
```

Important:

- the loop remains an existing source object/module, not rebuilt;
- do not claim it is Race-drive-tested;
- no new physics;
- no invisible air rail;
- safe bypass remains present;
- the proof is geometry/metadata only.

## Data / compiler requirement

Extend the existing recipe/compiler path rather than making a Blender-only manual scene.

The new proof must be rebuildable from scripts + recipe.

Output should preserve the existing baked-route concept:

- centre-line frames;
- tangent;
- width;
- bank;
- grade;
- section tags;
- anchors/sockets;
- covered/tunnel/bridge/stunt tags where relevant.

Add a small explicit profile layer, e.g.:

```json
{
  "surfaceProfile": "CITY_STREET|RKIT_TRACK",
  "edgeProfile": "NONE|CURB|LOW_BARRIER|HIGH_BARRIER|FENCE_SOCKET",
  "structureProfile": "GROUND|PILLARS|BRIDGE"
}
```

Names may differ, but these concerns must remain separate.

## Geometry checks

Run repository-native / Blender checks and report actual counts.

At minimum:

- route closure/endpoint error where applicable;
- seam position error at every module boundary;
- tangent angle discontinuity;
- bank discontinuity;
- height discontinuity;
- body self-intersections excluding intentionally adjacent faces;
- coplanar duplicate deck faces at split/merge;
- street↔track top-surface continuity;
- hairpin true radius vs outer edge offset;
- support/deck clearance for bridge approach;
- GLB re-import;
- baked-route ↔ GLB frame parity.

Do not turn a numerical PASS into a visual acceptance.

## Visual evidence

Create:

1. isolated donor sheet;
2. isolated M1 sheet;
3. isolated M2 sheet;
4. isolated M3 sheet;
5. isolated M4 sheet;
6. final proof recipe overview;
7. chase-height views through S/chicane/hairpin;
8. street→track and track→street close-ups.

If Blender MCP is unavailable, record that once and continue with the existing repository-native Blender scripts/headless workflow. Do not block the slice merely because the optional helper is absent.

## Files / handoff

Under a new `KFB Cologne Race Option C-3/rkit-10/` folder, return at minimum:

- `RETURN.md` — defects first;
- `CHANGELOG.md` — additive;
- `SOURCE.json`;
- route recipe JSON;
- baked-route JSON;
- scripts/library changes;
- GLBs or the existing repo-appropriate compressed form;
- test JSON/reports;
- visual sheets.

Update the existing RKIT handover/guide additively. Do not rewrite old results.

## Do not do in RKIT-10

- do not build the full Hürth→SAE course;
- do not fetch new OSM for all Köln;
- do not build a track editor UI;
- do not modify Race physics, vehicle, camera, HUD or audio;
- do not create a second route compiler;
- do not create one-off “Tokyo Drift track” geometry;
- do not build new loop/skyramp art;
- do not replace WorldBuilder;
- do not merge or promote Live.

## Done when

RKIT-10 is ready for human review when:

1. each of M1–M4 is shown in isolation;
2. the recipe rebuilds the same geometry deterministically;
3. the final proof moves continuously from city street → drift geometry → existing stunt socket → bridge/elevation → city street;
4. edge treatment can change independently from route and surface;
5. checks are recorded with real counts;
6. branch/PR/head and exact changed files are returned;
7. exactly one next gate is named.

## Next gate after success

`COLOGNE-ROUTE-01-P0 · OSM Route Corridor`

Pin and segment the real Hürth → Dom → Rhein → Mülheimer Brücke → SAE corridor, then classify each segment against the proven grammar before commissioning any additional Blender geometry.
