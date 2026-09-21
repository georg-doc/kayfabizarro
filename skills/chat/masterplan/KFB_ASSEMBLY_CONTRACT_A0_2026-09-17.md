# KFB Assembly Contract · A0

**Date:** 2026-09-17  
**Status:** CURRENT SHARED CONTRACT DRAFT · intentionally small  
**Owner:** Georg / KFB product direction  
**Purpose:** remove manual chat-to-chat mediation without creating a universal KFB runtime.

This document defines the smallest shared recipe vocabulary that can move authored assemblies between Asset Registry / Librarian, ToolBox / Atlas and independent KFB consumers such as Travel, Stunt Race and Combat.

It is a **data/handoff contract**, not a renderer, physics engine, character controller, camera system, terrain runtime, reward system or compatibility owner.

GitHub project SSOTs remain authoritative for implementation. A consumer may reject or adapt a recipe; it must not silently rewrite the shared recipe and call the result canonical.

---

## 1 · Governing model

```text
Asset Registry / Librarian
        ↓ source identity + provenance
ToolBox / Atlas / Claude Design
        ↓ measured or authored recipe
KFB ASSEMBLY CONTRACT
        ↓
consumer adapter
        ↓
Travel / Stunt / Combat / Town / future instance runtime
        ↓
consumer test evidence
        ↓
recipe maturity / feedback
```

The shared layer describes **what is assembled and how parts relate**.

The consumer owns **what that assembly means at runtime**.

Examples:

- a `walkable` surface does not dictate how Travel's Ground controller resolves contact;
- a `drivable` surface does not dictate Stunt Race vehicle physics;
- a `seat` slot does not dictate the driver's animation controller;
- a `motionFamily` relation does not become compatibility until the receiving consumer has tested it;
- a `cameraHint` is not camera ownership.

---

# 2 · A0 primitives

A0 deliberately standardizes only five concepts.

## 2.1 AssetRef

Stable source identity for one referenced asset or authored prefab.

Minimum intent:

```text
assetRef.id
assetRef.sourceRepo
assetRef.sourcePath
assetRef.revision / blob identity where available
assetRef.relationship
assetRef.evidenceStatus
```

Useful relationship values should reuse existing KFB vocabulary where applicable, e.g.:

- `same_collection`
- `official_companion_pack`
- `official_motion_companion`
- `reference_demo`
- `tested_kfb_preview`
- `filename_note`

**Relationship is not compatibility.**

Registry / Librarian remains source/provenance owner.

---

## 2.2 TransformSlot

A named spatial seam between components.

Examples:

- `seat.driver`
- `hand.r`
- `hand.l`
- `prop.lectern`
- `prop.staff`
- `wheel.fl`
- `road.entry`
- `road.exit`
- `stunt.captureEntry`

Minimum intent:

```text
slot.id
slot.parentRef
slot.position
slot.rotation
slot.scale
slot.forward / up convention where needed
slot.evidenceStatus
```

Transforms may be authored/measured before runtime compatibility is proven. Therefore every slot keeps evidence/maturity distinct from compatibility.

---

## 2.3 Surface

Shared **semantic** description of a support/contact surface.

Minimum intent:

```text
surface.id
surface.geometryRef
surface.roles[]
surface.priority
surface.normalPolicy
surface.materialHint
surface.connectorRefs[]
```

Potential roles:

- `support`
- `walkable`
- `drivable`
- `landing`
- `stunt`
- `deck`
- `bridge`
- `road`

A0 does **not** standardize collision resolution or friction physics.

Consumer examples:

- Travel may query the highest valid `support/walkable` surface under an actor.
- Stunt Race may bind a `drivable/stunt` surface to its vehicle/contact owner.
- Combat may interpret a `walkable` surface through its own movement/nav rules.

This is the shared semantic seam behind terrain, cards, roads, ramps, bridges, decks and authored structures.

---

## 2.4 Connector

A named entry/exit or attachment seam between independently authored modules.

Minimum intent:

```text
connector.id
connector.kind
connector.transform
connector.width / clearance where meaningful
connector.forward
connector.up
connector.capabilityTags[]
```

Examples:

- road port
- track entry/exit
- bridge end
- portal
- habitat entrance
- stunt approach/release
- garage bay

Connectors describe geometry and intent; the receiving runtime still owns traversal and transition behavior.

---

## 2.5 RecipeEnvelope

Common wrapper around a reusable assembly.

Minimum intent:

```text
recipe.id
recipe.kind
recipe.schemaVersion
recipe.revision
recipe.status
recipe.maturity
recipe.consumerTargets[]
recipe.assetRefs[]
recipe.slots[]
recipe.surfaces[]
recipe.connectors[]
recipe.variants[]
recipe.evidence[]
recipe.notes
```

A0 does not require every recipe to use every field.

Possible recipe kinds later include:

- actor
- resident
- scene
- terrain
- landmark
- vehicle
- track
- stunt

These are recipe families, not new runtime owners.

---

# 3 · Recipe maturity

Reuse the Atlas maturity logic.

### L0 · Reference indexed
Identity/provenance only.

### L1 · Visual annotation
Real reference inspected.

### L2 · Asset-matched
Concrete source candidates mapped with evidence/confidence.

### L3 · Static reconstruction
Owned assets assembled and evidenced.

### L4 · Reusable recipe
Assembly expressed as reusable data/rules.

### L5 · Consumer-tested
A real receiving runtime has loaded/used the recipe successfully.

**Only the receiving consumer may grant its own L5 evidence.**

A recipe may be L5 in Travel and still be untested in Stunt Race.

---

# 4 · Consumer adapter rule

Each implementation SSOT owns a small adapter rather than its own copy of the recipe.

```text
shared recipe
   ↓ read-only input
Travel adapter → Travel runtime
Stunt adapter  → Stunt runtime
Combat adapter → Combat runtime
```

Adapters may:

- map shared Surface roles to local contact APIs;
- resolve supported asset formats;
- select local animation/controller behavior;
- bind local camera/recovery/progress hooks;
- reject unsupported capabilities;
- report test evidence.

Adapters must not silently:

- fork source identity;
- overwrite shared transforms and still call them the same recipe revision;
- promote untested compatibility;
- introduce a second movement or physics owner.

A consumer-specific variant belongs either in explicit variant data or in the consumer adapter.

---

# 5 · Initial proof pair

A0 is proven with two deliberately different recipes rather than a broad schema exercise.

## Pilot A · Resident

**Lorekeeper + lectern + staff**

Purpose:

- prove AssetRef;
- actor/prop TransformSlots;
- relative composition;
- evidence/maturity;
- one recipe usable by more than one scene/runtime without re-measuring by eye.

## Pilot B · Track

**KFB Stunt Race Flow Loop**

Purpose:

- prove route/track recipe wrapping without making Assembly A0 the track generator;
- Surface semantics;
- entry/exit Connectors;
- scenery/stunt anchor seams when they exist in a real accepted use case;
- independent Stunt runtime ownership.

The two pilots are intentionally unrelated enough to expose whether A0 is genuinely generic or merely renamed scene data.

### Current Pilot-B restraint · T1/T2 v0.6

For the current Race proof, only semantics that already exist in the Flow Loop belong in the shared recipe:

- the `RecipeEnvelope`;
- the generated road `Surface` with roles such as `support / drivable / road`;
- the existing entry/exit connector geometry;
- spawn/placement slots only where actually needed;
- deterministic Track-DNA / geometry parameters required to reproduce the same route.

Do **not** invent `stunt` / `landing` surface roles, stunt approach/capture/release connectors or AssetRefs for generated geometry merely to populate A0. Those seams enter A0 only when a real T4 stunt or concrete asset requires them.

Race-local feel/contact tuning — acceleration, steering, grip/drift, rubber-rail soft field/bounce/cooldown, recovery and guided driving — is not Track Recipe data merely because it influences the same play experience. Those values remain Race adapter/runtime configuration even when the track recipe is shared.

---

# 6 · Future vehicle / actor composition constraint

### DECISION / OUTLOOK · not current implementation scope

KFB vehicles must eventually be able to use both:

1. ordinary static/rigged vehicle shells;
2. more unusual KFB rigs/composites that themselves function as vehicles or vehicle bodies.

A future racing assembly may therefore look like:

```text
Vehicle Contact / Dynamics Root
        ↓
Vehicle Visual Root
        ↓
vehicle shell OR KFB rig/composite
        ↓ seat.driver TransformSlot
Driver Actor Root
        ↓
cartoon inertial response
        ↓
secondary motion chains
```

Example target:

- FrizzleBob seated in/on a KFB vehicle/rig;
- acceleration/braking/lateral inertia visibly deform/lag the driver in a controlled cartoon way;
- impacts can generate bounded squash/overshoot;
- FrizzleBob's ears and other secondary parts respond to airflow, vehicle acceleration and suspension/body motion;
- the visual response remains non-destructive to the actual vehicle contact proxy and physics owner.

Potential future signals exposed by the vehicle runtime to presentation layers:

```text
longitudinalAcceleration
lateralAcceleration
angularVelocity
impactImpulse
suspension/body response
relativeAirflowVector
speedNormalized
stuntState
```

Those are **presentation inputs**, not a request to move vehicle physics into the actor rig.

This outlook is explicitly OUT OF SCOPE for Stunt Track Lab T1/T2. T1/T2 only preserve the hierarchy/seams so the later feature does not require a rewrite.

---

# 7 · Automation / moderation reduction

Target workflow:

```text
1. asset enters Registry
2. Librarian resolves identity/provenance
3. Atlas / ToolBox authors or measures recipe
4. recipe validator checks refs/schema/evidence
5. recipe is indexed as candidate
6. consumers discover compatible recipe kinds/capabilities
7. consumer adapter loads it
8. consumer tests it
9. L5 evidence or FAIL is returned
10. recipe revision is corrected once at source when the shared data is wrong
```

Georg should normally need to intervene only for:

- product/visual intent;
- human freeplay/look acceptance;
- real cross-consumer variant decisions.

He should not need to manually relay transform corrections, asset paths or already-recorded compatibility evidence from chat to chat.

---

# 8 · Explicit non-goals

A0 is **not**:

- Universal KFB Physics;
- Universal Character Controller;
- Universal Terrain Engine;
- Universal Camera;
- ECS/framework migration;
- a second Registry;
- a second World Builder;
- a way to make every consumer accept every recipe.

If A0 begins acquiring runtime systems rather than data semantics, stop and push that behavior back to the owning consumer.

---

# 9 · Current cross-project ownership

- **Asset Registry / Librarian:** source identity, provenance, discovery/reference facts.
- **ToolBox / Atlas / Claude Design:** composition, measurement, authored recipe candidate, visual evidence.
- **Travel/WB0:** Travel world placement, support/contact interpretation, ground locomotion, persistence, Travel runtime.
- **Stunt Race:** vehicle/contact behavior, Track Core, guided stunt assist, racing camera integration, stunt recovery.
- **Combat Arena:** combat-specific capability/runtime semantics.
- **`/world/`:** rapid authoring/UX POC; candidate producer, not runtime owner.

No owner moves because this document exists.

---

# 10 · Current consumer proofs

## Travel/WB0

Travel now has a thin A0 Surface consumer adapter in its implementation SSOT. Current cards, ROAD meshes, ramp, BlockBits and structure proof are expressed through A0-style Surface semantics before entering the existing Travel-owned highest-valid-support resolver.

Important boundary: `surface.priority` is only a near-height tie-breaker in Travel. It never allows a lower surface to beat a geometrically higher valid support. This is Travel adapter behavior, not A0 physics.

Travel-specific geometry lookup forms remain adapter-local and are not promoted into A0 merely because the proof uses them.

## Stunt Race

Race accepts the same central A0 contract for T1/T2 v0.6 with a thin Race adapter. The target proof is:

```text
Flow Loop v0.6
→ central A0 RecipeEnvelope
→ thin Race Adapter
→ same Track Core / same gameplay
→ Human Freeplay
→ Race-specific L5 evidence
```

The T1/T2 feel candidate is frozen while this seam is proven. No feel tuning should occur merely to make A0 fit.

The existing T3 Parallel-Transport-Frame work remains an isolated geometry spike and does not replace the T1/T2 gate. T4 stunt semantics are deferred until a real accepted stunt exists.

---

# 11 · Next implementation action

A0 itself should remain a document/validator-level seam while the consumer proofs proceed.

Parallel next work:

- **Stunt T1/T2:** preserve the accepted Flow Loop / chill rail feel while proving RecipeEnvelope + current real Surface/Connector data through the Race adapter. No invented fields and no relocation of Race-local physics/feel tuning.
- **World:** continue human browser testing of the existing highest-valid-support implementation through the new A0 Surface adapter for terrain/cards/roads/ramps/bridges/decks.
- **Atlas:** shape the first Lorekeeper reusable recipe using AssetRef + TransformSlot + RecipeEnvelope rather than inventing a parallel handoff format.

Only after those paths expose a real missing field should A0 grow.

---

# Additive history

## 2026-09-17 · DECISION

Establish a very small shared KFB Assembly Contract so Georg no longer has to manually mediate reusable asset/transform/surface/connector knowledge between World, Atlas, ToolBox, Stunt and other consumers.

## 2026-09-17 · DECISION

Future KFB racing presentation must permit rig/composite vehicles and independently deformable/secondary-motion drivers such as FrizzleBob with inertia-reactive body motion and wind-reactive ears, while preserving the vehicle/contact runtime as the sole physics owner. This is an outlook constraint, not T1/T2 scope.

## 2026-09-17 · CROSS-PROJECT ALIGNMENT

Travel and Race both accept A0 as a shared Recipe/Data seam while retaining independent runtime ownership. Travel proves A0 Surface semantics through its highest-valid-support adapter. Race freezes T1/T2 v0.6 feel while proving the Flow Loop RecipeEnvelope through a thin Race adapter. Generated geometry does not require fabricated AssetRefs; stunt/landing semantics are deferred until a real T4 use case exists.
