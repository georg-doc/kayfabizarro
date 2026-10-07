# KFB · Oxijolt Physics Acceptance / Test-Architecture Donor · 2026-10-07

Status: **HIGH-VALUE PHYSICS ACCEPTANCE / TEST-ARCHITECTURE DONOR · NO CURRENT RUNTIME ADOPTION**
KFB owner impact: **none**
Island MVP scope impact: **no new REQUIRED / STRONGLY INCLUDE / OPTIONAL row**
Receiving physics/runtime owner remains: **existing WB2 / Rapier / Track / Drive owners**

## 0 · Source pin

External donor:
`pockerhead/oxijolt`

Verified source head:
`1bb4c1ac08a8ace47f0e826dc14e090f0fc784c1`

Release at that head:
**1.0.1**

Oxijolt is a Rust binding/API around Jolt Physics 5.6 with deterministic tests, character/vehicle studies, real-mesh tests, world save/restore, floating-origin rebase, debug collider line output, benchmarks and a playground that can run scenes with a window or headless.

Current build targets documented by the project are native Windows/Linux/macOS/Android families. No `wasm32` target is listed in its supported bindings.

Therefore:
**do not integrate Oxijolt/Jolt into the current KFB Web runtime.**

The value for KFB is its **test architecture and acceptance philosophy**, not a replacement physics engine.

---

## 1 · Main principle to borrow

> **Tuning is data; product laws are invariants.**

KFB should describe critical Ground / Drive / Surface behavior as stable product laws, while allowing implementation parameters to change.

Examples of candidate KFB law-style witnesses:

### KFB-G01 · Support continuity
A character crossing a declared continuous Surface seam remains supported with no unexplained grounded-state break, penetration or visible gap.

Maps primarily to:
- F-R03 Continuous Surface Truth
- F-R16 road-world seam

### KFB-G02 · Downhill continuity
A character follows a named downhill fixture without mini-hops / unintended Ground loss / visible foot-to-ground separation.

Maps primarily to:
- F-R10 locomotion feel
- F-R11 Cartoon Jump boundary
- F-R03 Surface Truth

### KFB-G03 · Step / edge behavior
A named walkable step/edge succeeds; a named non-walkable obstacle does not silently become a step.

Maps primarily to:
- F-R10
- Ground controller diagnostics

### KFB-G04 · Penetration recovery is not locomotion
Recovery from overlap/contact must not inject unexplained travel velocity or corrupt the current movement owner.

Maps primarily to:
- F-R03
- F-R14 mode arbitration

### KFB-G05 · Track / terrain seam is one physical route
Terrain → road → Track piece → bridge transitions preserve expected support/contact continuously.

Maps primarily to:
- F-R15
- F-R16
- F-R17

### KFB-G06 · Deterministic route replay
A fixed input script on the same pinned world document produces the same semantic physics digest at the declared checkpoints, within the receiving engine's accepted deterministic/tolerance model.

Maps primarily to:
- F-R05
- F-R17
- F-R18
- F-R31

These are **candidate test formulations**, not new product requirements or fixed numeric controller constants.

---

## 2 · Witness scenes rather than whole-world debugging

Borrow Oxijolt's small focused-scene approach for KFB diagnostics.

Useful KFB witnesses:

- Terrain → Road
- Road → Bridge
- Track-piece → Track-piece
- road-fit → Sculpt
- sharp terrain edge / step
- tight road curve
- slope → crest → descent
- building / prop ground contact
- Drive wheel contact on road seam
- Ground ↔ Drive handoff
- Ground ↔ Flight landing handoff
- island-local-frame / origin transition where applicable

Each witness should have:
1. one named physical assertion;
2. one fixed input/script or deterministic setup;
3. a compact semantic digest;
4. optional visible clip/X-Ray evidence.

The witness harness is diagnostic support for the current product, **not a parallel physics app**.

---

## 3 · Visible + automated acceptance

Useful Oxijolt pattern:
the same focused scene logic can be exercised with visible presentation and without a window.

KFB translation:

- automated/headless/repeatable checks may catch regressions early;
- visible browser evidence remains authoritative for product-feel / visual gates;
- Georg's F-R39 and F-R07 human steps remain unchanged.

Do not allow a deterministic digest to substitute for:
- visible locomotion feel;
- camera acceptance;
- Clay/road/contact appearance;
- target-device performance.

---

## 4 · KFB Physics X-Ray

Borrow the idea of collider wireframes as **data**, not a new renderer/physics owner.

A bounded WorldBuilder debug overlay may expose, where existing APIs allow:

- collider wireframe;
- authoritative Surface/support sample;
- Ground normal;
- contact point(s);
- current support object / Track segment id;
- wheel contact positions / normals;
- road/terrain seam;
- stable WorldObject id;
- active movement owner;
- optional local-frame/origin data.

Implementation must consume existing WB2/Rapier/Track/Drive facts.

It may not become:
- collision truth;
- a second physics simulation;
- a second camera owner.

---

## 5 · Semantic digest / deterministic acceptance route

Borrow the deterministic-scene/digest idea for KFB, adapted to the receiving engine.

Candidate digest fields may include:

- exact world/island document id + source/generator revision;
- exact candidate head/build id;
- scripted input id;
- checkpoint position/orientation;
- grounded state;
- support id / Surface sample;
- active movement owner;
- Track/route segment id;
- collision/recovery event counts;
- Drive wheel-contact summary;
- save/reload checkpoint identities.

Use this for regression detection.

Do **not** claim that Rapier/KFB must become bit-identical merely because Oxijolt can test bit-identical runs under its own constraints. KFB's tolerance/determinism contract belongs to the current receiving owners.

---

## 6 · Save / detour / restore lesson

Oxijolt's rollback/save-state tests are useful as a **test philosophy only**.

KFB F-R30/F-R31 remain authoritative:

`Base Recipe → Canon/Authoring Override → Dynamic State → Player Overlay`

Oxijolt/Jolt simulation snapshots do not replace:
- WB2 document persistence;
- source identities;
- authored transforms;
- sculpt;
- RouteRecipe;
- dynamic/player state.

Useful translated question:

**after a controlled detour and full KFB unload/reload, do the declared semantic/physical checkpoints replay correctly from the canonical KFB document?**

---

## 7 · Island-local frame / rebase lesson

Oxijolt explicitly tests floating-origin/rebase behavior for:
- vehicles;
- queries;
- resting/sleeping objects;
- constraints;
- world state.

KFB translation for F-R02:

When using island-local frames / later inter-island transitions, verify that the frame change does not break:

- player;
- Vehicle/Drive;
- Surface queries;
- Track/contact;
- resting props;
- collision/support identities.

This supports the existing local-frame requirement and adds **no floating-origin owner**.

---

## 8 · Performance methodology

Oxijolt publishes scenario-specific p50/p99/max measurements and records the machine/build conditions.

KFB should borrow the method, not Oxijolt's numbers.

For F-R07:
- fixed named Ground/Drive/Flight route;
- exact candidate/build;
- target-device/browser/WebGL metadata;
- frame-time distribution;
- p50/p95/p99 or equivalent useful percentiles;
- long-frame count;
- available draw/triangle/material/query/collider counters.

The current KFB rule remains:
**only the visible/focused run on GEORG_PRIMARY_ACCEPTANCE_MACHINE can turn F-R07 GREEN.**

Cloud/headless results remain diagnostic only.

---

## 9 · Asset Librarian · future Physics Readiness lane

Potential future additive intake stage:

`SOURCE → HASH/RIGHTS → ISOLATION → GEOMETRY AUDIT → COLLIDER STRATEGY → PHYSICS PROBE → CONSUMER`

Possible recorded facts:

- triangle count / bounds / physical scale;
- degenerate/sliver/thin geometry warnings;
- static mesh suitability;
- primitive/convex proxy recommendation;
- collider source/hash;
- basic drop/contact/character-crossing probe where relevant;
- Physics Readiness status.

Rules:
- remains inside the existing Asset Librarian / Registry provenance model;
- external-search hit remains only a candidate;
- Physics Readiness never creates a second Registry;
- not required for every asset in the first Island MVP.

This is a strong candidate for a later bounded:
**KFB PHYSICS LAWS + COLLIDER QA LAB R1**.

---

## 10 · Destruction / structural-settle lesson

Oxijolt's current playground includes breakable-wall / impact-fracture demonstrations where debris can break again after hard impacts.

KFB should borrow only the structural test idea:

`STRUCTURAL TRUTH → topology settles/collapses → presentation completion / rubble / edge healing`

This aligns with the existing KFB Build–Destroy–Repair grammar.

Do not import Oxijolt destruction code or make it a new destruction owner.

---

## 11 · Explicit non-goals

For the current Island MVP:

- no Oxijolt dependency;
- no Jolt runtime;
- no Rust/C++ native build layer;
- no new Physics owner;
- no mandatory pre-MVP Physics Lab slice;
- no Ragdoll/Cloth/Motorcycle/Tank scope;
- no replacing Rapier;
- no replacing WB2 Save/Reload with `save_state()`;
- no assumption that Oxijolt determinism guarantees transfer to KFB/Rapier.

---

## 12 · Current One-Shot use

WSA may borrow these methods **inside existing acceptance work** when low-risk:

- law-style invariants;
- focused seam witnesses;
- Physics X-Ray;
- deterministic input scripts / semantic digests;
- target-specific percentile telemetry.

Do not stop the One-Shot to build a generic QA platform.

If a witness exposes a REQUIRED-row defect:
repair the receiving owner/seam.

If the first Island MVP completes, the larger reusable QA harness can become a separate bounded tool slice.

---

## 13 · Classification

**Oxijolt = HIGH-VALUE PHYSICS ACCEPTANCE / TEST-ARCHITECTURE DONOR · NO CURRENT RUNTIME ADOPTION**

Source pin:
`pockerhead/oxijolt@1bb4c1ac08a8ace47f0e826dc14e090f0fc784c1`

No Island MVP classification count changes.
