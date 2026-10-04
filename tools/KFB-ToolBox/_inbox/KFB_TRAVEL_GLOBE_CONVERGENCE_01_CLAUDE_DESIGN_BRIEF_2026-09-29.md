# KFB TRAVEL GLOBE CONVERGENCE-01 · Claude Design Execution Card

**Status:** READY · source-locked execution brief  
**Date:** 2026-09-29  
**Primary executor:** Claude Design  
**Owner:** `georg-doc/KFB-Travel-Globe`  
**Mode:** Web/Claude-first. **Do not use WSA/Work unless a concrete capability gap is proven.**  
**Human review:** only the real integrated playable result, not contract tables or isolated diagnostics.

## Outcome

Turn the existing Travel Globe / WorldBuilder runtime into one playable convergence proof where Georg can:

`start directly in world → move on Ground → reach a globe-native race route → enter Drive → drive/drift/hop the route → exit to Ground → use the already accepted Ground→Flight handoff`

The purpose is to prove that the existing TinySkies/Travel Globe host can carry Walk + Drive + Flight plus a real track **without creating another world engine**.

This is not a new world, not an OSM restart, not WFC, not a Resident/Town slice, and not a new renderer.

---

## 1 · Source lock

### Receiving host · use this stack, not bare `main`

`georg-doc/KFB-Travel-Globe`

Current default main:
`8614282aab2ced43bb5dda9fcf7abadf9768100a`

Base the convergence work on the current accepted mobility stack:

`chatgpt-web/travel-modes-01-router-2026-09-27`
head:
`e10a977501cd186fe1330e9d3fd1a7b5811beb3a`

This stack already contains the accepted Ground→Flight chain beneath it.

### Existing productive WorldBuilder / Ground

Use the existing real consumer:

`site/world-builder/`

Important current owners:
- Ground movement/camera: `wb0-ground-controller` / `site/world-builder/ground-controller.js`
- Ground character presentation/cadence: `site/world-builder/movement-lab.js`
- Flight movement: existing `travel/globe-v13/carpet.js`
- Flight camera: existing `camera-rig.js`
- Flight presentation: existing animated `card-carrier.js`
- synchronous Ground/Flight ownership bridge: `site/world-builder/runtime-mode.js`

Ground Movement Lab is already real implementation, not a proposal. It has actual KayKit/Mech profiles, Idle/Walk/Run/Jump presentation and keeps Ground as the sole world-position writer.

### Accepted Ground→Flight behavior

PR #38 / branch:
`chatgpt-web/travel-mode-bridge-tmb2-double-space-2026-09-23`
head:
`08147fb4a6726f4c0248ff79ade67eec24afdbca`

Human accepted behavior:
- first Space = immediate Ground jump;
- second fresh Space within **400 ms** = `REQUEST_FLIGHT`;
- no simultaneous Ground + Flight input/movement ownership.

Do not retune this in CONVERGENCE-01.

### Drive donor · exact source

Race owner:
`georg-doc/KFB-Stunt-Car-Race`

Use the source-proven Free-Roam receiver at:
`a7a48a8c6e1589a18134aa619e2be22d79124c32`

Relevant donor path:
`ChatGPT_web/free-roam/`

Primary donor files:
- `site/physics.js` — Slice-04-derived Rapier physical pose/contact owner;
- `site/drive-intent.mjs` — W/S, A/D, Q/E drift, Shift boost, Space hop, brake/reverse intent;
- `site/world.js` — reusable route/ramp/contact geometry examples.

Do **not** copy the whole Free-Roam app or create a third physics engine.

Current evidence only proves the Slice-04 donor inside a bounded local Travel-terrain physics frame. Treat that as the intended first receiver model.

### Track / terrain seam donor · technical evidence only

Travel PR #31:
`wsa/track-terrain-corridor-tc01-2026-09-20`
head:
`35a0b6c8380feb009bd27f1ca811064c1ad74be7`

Retain only the proven technical idea:

`spherical route samples → existing Travel terrain-zone seam → one Travel terrain truth`

**Reject its visible black-band ribbon solution.** Georg rejected that presentation because terrain penetrated the Track and close inspection failed.

### TinySkies gold-standard reference

`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

Use as reference for globe/tangent/quaternion/world construction and environmental behavior. Do not replace current Travel runtime with a fresh TinySkies clone unless a current source-parity check proves the Travel host irreparably diverged.

---

## 2 · Protected baseline

Before adding the track, show and preserve the current source-backed Travel world in the **real WorldBuilder host**.

Protect:
- current globe terrain + water/coast treatment;
- current cards / Sky Cards / collection behavior;
- current portal/rift behavior;
- current TinySkies-derived atmosphere effects already present in Travel;
- current Ground controls and actor presentation;
- accepted 400 ms Ground→Flight transition;
- existing camera owners;
- existing runtime-mode ownership.

The TinySkies opening/anflug animation is **not acceptance-critical**. Direct world start is allowed and preferred for this proof.

Do not spend this session rebuilding the intro.

---

## 3 · Track geometry rule

Do not import a flat race track and bend/scale it by eye.

Create the Track from the Globe itself:

`sample spherical route`
→ `local normal + tangent frame per sample`
→ `road centreline / width offsets in tangent plane`
→ `surface-following road/track mesh or Travel-owned local SurfacePatch`
→ `ramps/curves expressed in the same local frame`

Required first route only:
- broad straight / approach;
- broad ordinary curve;
- broad drift curve;
- one ramp/hop;
- start/finish gates or checkpoints;
- safe bypass / open surrounding terrain.

No loop. No city. No dense props.

The Track must visually read as part of the Globe surface and must not reproduce TC-01's black floating ribbon or terrain-poking failure.

---

## 4 · Drive integration rule

Use exactly one physical pose/contact writer while in DRIVE.

First proof architecture:

`Travel Globe world`
→ `Track entry socket`
→ `local tangent / bounded physics frame`
→ `Slice-04 Rapier DRIVE owner`
→ `Track exit socket`
→ `Travel Ground owner`

The local Drive zone may be bounded for the first proof. It does not need to make the whole planet Rapier-driveable.

Required player flow:
1. start Ground in the existing WorldBuilder/Travel world;
2. walk/run to Track start;
3. enter the one test vehicle;
4. Drive;
5. deliberate Drift;
6. hop/ramp;
7. finish / exit vehicle;
8. return to Ground without teleport/reset discontinuity;
9. use existing double-Space Ground→Flight;
10. Flight remains unchanged.

Do not implement Flight→Ground landing here. TMB-3 remains outside this proof unless Georg separately opens it.

---

## 5 · Performance-first instrumentation

Do not add visual polish before recording the baseline.

Keep a compact developer overlay or log for:
- FPS / frame ms;
- draw calls;
- visible object count;
- active collider count during Drive;
- Drive physics/update ms if measurable;
- Ground baseline vs Track visible vs Drive active.

Required A/B states:
- baseline Travel/WorldBuilder, no Track;
- Track visible, Drive inactive;
- Drive active.

The Track/Drive proof is not accepted if object/collider counts continue growing after repeated enter/exit cycles or if leaving Drive leaves a second movement writer alive.

---

## 6 · Explicit scope out

Do not add in this session:
- OSM;
- WFC / endless chunk generator;
- Residents / Resident Atlas scenes;
- Fahrschule;
- Tokyo Drift dressing;
- global Clay shader;
- T4 palette/material pass;
- Asset Librarian redesign;
- WorldBuilder search redesign;
- Water mode;
- Combat;
- new intro cinematic;
- full spherical Rapier vehicle world.

Those become consumers only after this convergence proof is playable and measured.

---

## 7 · Done when

One real integrated WorldBuilder/Travel experience can be played through:

`Ground → Track → Drive → Drift → Ramp → Ground → Flight`

and all of these are true:

- current Travel globe/cards/portal/atmosphere baseline still works;
- existing Ground animation/movement is retained;
- accepted 400 ms Ground→Flight remains unchanged;
- Drive uses the pinned Slice-04 donor, not a new physics engine;
- Track uses globe/tangent geometry rather than a scaled planar import;
- terrain does not visibly poke through the road in the representative route;
- Drive is bounded/local if necessary but transition into/out of it is clean;
- exactly one movement writer is active in each mode;
- performance numbers exist for baseline / Track / Drive;
- no unrelated system was rebuilt.

Human review question is only:

> **Does this feel like one small Travel Globe world that I can walk, drive and then fly through — and is the Globe-native Track geometrically/visually convincing enough to continue?**

Do not create additional human gates for ownership tables, router diagnostics or parameter matrices.

---

## 8 · Checkpoints / recovery

Work as one connected session, but persist three technical checkpoints internally:

1. **BASELINE LOCK** — exact current WorldBuilder/Travel world runs unchanged from the chosen source stack.
2. **TRACK FIT** — Globe-native route + road/ramp exists with no Drive yet; baseline still passes.
3. **MOBILITY CONVERGENCE** — Ground→Drive→Ground→Flight loop works with measurements.

After two failed repair passes on the same gate: stop, preserve the candidate, export the full Claude Design Session Cut / failure recovery. Do not start a third rewrite.

---

## 9 · Claude Design start message

Use this exact compact start:

> Work only on **KFB TRAVEL GLOBE CONVERGENCE-01**. Use `georg-doc/KFB-Travel-Globe` and source-lock the current accepted mobility stack at `chatgpt-web/travel-modes-01-router-2026-09-27@e10a977501cd186fe1330e9d3fd1a7b5811beb3a`. Reuse the real `site/world-builder/` Ground Movement Lab and accepted 400 ms Ground→Flight behavior. Use Race FR-S04-02 at `georg-doc/KFB-Stunt-Car-Race@a7a48a8c6e1589a18134aa619e2be22d79124c32` as the only Drive physics donor. Build one Globe-native Track from spherical/tangent frames; do not import a flat Track by eye. PR #31 is technical terrain-seam evidence only; do not reproduce its rejected black-band visual. Direct world start is allowed; do not spend time on the TinySkies opening animation. First preserve the current Travel world, then prove Track fit, then one bounded Ground→Drive→Ground→Flight loop with performance measurements. Do not add OSM, WFC, Residents, Clay/T4, Water, Combat or a new renderer. Stop after two failed repair passes on the same gate and export a complete recovery package.

