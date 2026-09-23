# KFB Travel Mode Bridge v1 · Ground ↔ Animated Card Flight · 2026-09-23

Status: **TMB-1 SOURCE-FIRST SEQUENCE COMPLETE · TECHNICAL/PUBLIC PASS · GEORG SURF HUMAN REVIEW PENDING · TMB-2 HOLD**

Implementation owner:
`georg-doc/KFB-Travel-Globe`

Current Travel main at preparation:
`8614282aab2ced43bb5dda9fcf7abadf9768100a`

Coordination / public brief owner:
`georg-doc/kayfabizarro`

Current TMB branch:
`chatgpt-web/travel-mode-bridge-v1-2026-09-23`

TMB-0 result:
- Draft PR #32;
- head `048499315581d2b9916a4d3fcbaba5f3adef719c`;
- source/boundary audit **12/12 PASS · 0 FAIL**;
- **0 runtime files changed**;
- Travel Return: `_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/RETURN.md`;
- source matrix: `_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/SOURCE_REUSE_MATRIX.md`;
- transition contract: `_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/MOBILITY_TRANSITION_CONTRACT_v0.md`.

TMB-1 result:
- A · exact CardCarrier alone → public 18/18 PASS;
- B · exact ActionFigure Rig_Medium alone → public 22/22 PASS;
- C · neutral measured mount → public 41/41 PASS;
- D · exact S33 Surf candidate → public 52/52 PASS;
- current Travel D branch: `chatgpt-web/travel-mode-bridge-tmb1-surf-2026-09-23`;
- current Travel Draft PR #36 head: `88382c111acf32f6b934c15ce7b6b1f6d4d15283`;
- direct human Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/travel/travel-mode-bridge/tmb1/surf.html`;
- HUMAN_ACCEPTED: **PENDING**.

Exactly one next gate:
**GEORG HUMAN GATE · ACCEPT or REJECT the current Surf presentation candidate.**

TMB-2 Double-Space remains HOLD until that human gate is resolved.

Goal:

**Reuse the proven TinySkies/Travel Globe flight stack and the real animated KFB CardCarrier as the first seamless mobility bridge between Ground locomotion and Flight, while preparing later Drive handoff.**

This is not a new movement engine.

---

# Product intent

Long-term player experience:

`GROUND → double Space → animated KFB card/mount appears → FLIGHT → intentional descent / valid support → GROUND`

Later:

`FLIGHT → DRIVE`

when a valid drivable support / vehicle transition is available.

The player should feel that these are different modes of the **same world and same avatar**, not separate mini-games.

The first flight vehicle is the animated KFB CardCarrier already used by Travel Globe.

Do **not** use the flat/hard Frankenstein Studio reference card as the vehicle.

---

# Human visual direction · 2026-09-23

Georg reports the current cartoon deformation on Racer / HeroShot landmarks as strongly successful, especially on hero landmarks.

Treat this as positive visual direction for later World/Flight composition.

It is not a technical blocker and does not authorize a new deformation owner.

---

# Current source facts

## 1 · Travel Flight owner already exists

Private Travel repo:

`georg-doc/KFB-Travel-Globe`

Current contract:

`travel/CONTRACT.md`

Flight movement owner:

`travel/globe-v13/carpet.js`

Flight controls:

`travel/globe-v13/flight-controls.js`

Flight camera:

`travel/globe-v13/camera-rig.js`

The Carpet/TinySkies flight model already owns:

- world position;
- heading;
- speed;
- bank;
- pitch;
- altitude relative to terrain;
- drift;
- hover extension;
- Flight camera relationship.

Do not create a second Flight controller.

## 2 · Ground ↔ Flight bridge already exists

`site/world-builder/runtime-mode.js`

already proves a candidate:

- FLIGHT → `carpet.js`;
- GROUND → `wb0-ground-controller`;
- one active movement writer;
- one active camera writer;
- Flight-only FX/presentation disabled in Ground;
- exact restoration on return to Flight;
- `ground.resetFromFlight(carpet)`;
- `ground.toFlightPose()`;
- Carpet is teleported to the Ground handoff pose instead of inventing a second world coordinate.

This is the foundation.

Do not replace it with another mode manager.

## 3 · Ground owner already exists

`site/world-builder/ground-controller.js`

Current Ground semantics include:

- W/S;
- A/D;
- Q/E strafe;
- Shift run;
- Space jump;
- Ground camera;
- support/terrain reading;
- `toFlightPose()`;
- `resetFromFlight()`.

Important input fact:

Ground currently claims Space in capture phase so the older Flight Space action cannot leak through.

The double-Space transition therefore belongs in a small **mode-intent/input adapter above the Ground/Flight owners**, not by letting both control systems listen at once.

## 4 · The real animated flight card already exists

**Source truth:**

`travel/terrain-planets-v1/card-carrier.js`

This is the required vehicle.

It is explicitly:

- a subdivided 3D card;
- not a flat 2D plane;
- real thickness / bottom / rim;
- animated wave;
- edge curl;
- banking / pitch / yaw-whip springs;
- boost squash;
- calm/rest wind;
- surface sampling;
- seat planted against the actual deformed surface;
- seat normal follows the card;
- foot clipping against the actual moving card surface;
- actual KFB card artwork/ink;
- one vehicle transform owner.

The CardCarrier exposes:

- `group`
- `seat`
- `sync(state, dt, passenger)`
- `setSeatFootprint()`
- `setSeatLift()`
- `surfaceAt()`
- `applyClip()`
- `setCalm()`
- `setBarrelRoll()`

### Hard rule

**Do not substitute the Frankenstein/Studio rigid reference card.**

The old Studio CardRider is useful only for measured actor pose/footprint/profile facts.

Historical Studio feedback explicitly says:
- Surf section was broken;
- actor could rotate wildly;
- rigid/flattering Studio card must be replaced by the Travel Globe animated card.

## 5 · Current Travel passenger is CubePet-specific

Travel currently mounts the CubePet at:

`carrier.seat`

and uses:
- Pet-specific surface;
- Pet-facing;
- Pet kinetics;
- EyeRig/face;
- `pet-traegheit.js`.

The **world movement does not belong to the passenger**.

That separation is exactly what the KayKit passenger adapter must preserve.

## 6 · KayKit modern actor sources already exist

Travel Ground Movement Lab:

`site/world-builder/movement-lab.js`

Current source pin inside that module:

`10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

First modern actor fixture:

**ActionFigure · Rig_Medium**

`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb`

Current Motion Lab donor:

PR #127
`chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20@7c8cc218ec46dabb20409c9e0b5368afcf5845c6`

It already proves:
- real Rig_Medium binding;
- animation inventory;
- root-motion stripping;
- measured foot contacts;
- Walk/Run cadence;
- phase sync;
- consumer movement stays external.

Use it for presentation/rig facts only.

## 7 · CardRider measurement donor exists, but its vehicle is NOT accepted

Studio donor:

`skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/frizzlegraft-v1/cardrider.v1.js`

Useful facts/API:
- `kfb.cardrider/0.1`;
- Card units;
- measured actor footprint;
- front/rear foot;
- actor height;
- `seatLift`;
- actor yaw offset;
- base pose ref `CARD_SURF_BASE`;
- root forward axis.

Use the measurement/profile idea.

Do not reuse its rigid card implementation as the flight vehicle.

The old Studio Surf UI is known broken and is not acceptance evidence.

---

# Architecture target

## Mobility Mode Bridge

Do not create one giant universal movement controller.

Keep owners:

`GROUND owner → transition seam → FLIGHT owner → transition seam → DRIVE owner later`

The transition layer may own:

- user mode intent;
- handoff timing;
- state snapshot;
- actor presentation reparenting;
- mount/dismount choreography.

It may **not** own:
- Ground movement;
- Flight physics;
- Drive physics;
- world terrain;
- route;
- animation library;
- camera internals.

## Candidate state vocabulary

- `GROUND`
- `MOUNTING_FLIGHT`
- `FLIGHT`
- `LANDING`
- future `MOUNTING_DRIVE`
- future `DRIVE`

Transition states are presentation/handoff states, not second movement solvers.

At every frame exactly one movement owner writes authoritative world position.

---

# Input concept · Double Space

Goal:

single Space must remain Ground jump.

Double Space should request Flight without delaying or breaking normal jump.

Recommended interaction model for proof:

1. first fresh Space in Ground = normal Ground jump immediately;
2. second fresh Space during the bounded airborne/tap window = `REQUEST_FLIGHT`;
3. bridge performs the mount handoff;
4. old Ground listener must not leak into Flight after ownership changes.

The exact double-tap window is a tunable candidate and must be human-reviewed.

Do not hardcode WoW timing from memory.

Do not make single Space wait to decide whether a second tap arrives.

---

# Landing concept

Do **not** automatically force Ground mode merely because Flight passes near the surface.

That would make low flying frustrating.

First candidate:

`intentional descend + valid support + low AGL + safe handoff → LANDING → GROUND`

Use:
- Flight's real AGL;
- the existing support/terrain reader;
- explicit descent/landing intent;
- a valid non-penetrating Ground pose.

Later a user preference may permit more automatic landing.

---

# Future Drive morph

Georg's long-term direction:

near appropriate ground / road, the flight device may transition into a vehicle rather than directly into on-foot Ground.

Prepare the transition contract so later it can hand to:

`DRIVE owner`

with:
- position;
- heading;
- support;
- momentum policy;
- actor/vehicle presentation.

Do not implement Drive in this slice.

Race/Drive keeps its physics/contact owner.

---

# K-Kid / KayKit passenger goal

The animated card must support modern KayKit actor rigs, not only CubePet.

Do not build a special card for each character.

Candidate seam:

`kfb.card-passenger-profile/1`

Suggested facts:

- actor source / ID;
- rig family;
- measured body height;
- measured footprint;
- seat footprint;
- seat lift;
- root forward axis;
- yaw/orientation offset;
- scale;
- pose/clip ref;
- root-motion policy;
- clipping policy;
- secondary-motion limits;
- optional EyeRig/face owner refs.

The CardCarrier remains unchanged in ownership.

Passenger profile tells it **how the actor sits/stands on the moving surface**.

---

# Surf presentation

The player should read as actively riding/surfing the animated card.

Do not fake this by moving the actor root independently of the card.

First proof should separate:

1. real ActionFigure source alone;
2. animated CardCarrier alone;
3. ActionFigure on CardCarrier in a neutral measured mount;
4. Surf pose/presentation candidate.

For the Surf candidate:
- prefer existing measured Pose/CardRider semantics where valid;
- use real Rig_Medium hierarchy;
- no root motion;
- card owns translation;
- actor pose/AnimationMixer owns presentation only;
- bank/pitch/acceleration may feed bounded pose/secondary-motion facts.

Do not use the historically broken Studio Surf presentation as-is.

## Later rig expansion

After one Rig_Medium human PASS:
- another Rig_Medium actor;
- then one Rig_Large actor;
- Legacy only later.

Do not make all KayKit characters a first-gate requirement.

---

# Gate sequence

## TMB-0 · Source Lock + seam map ONLY

Fresh Web Chat.

No runtime implementation.

Verify current source and persist:
- Travel exact main/head;
- `carpet.js`;
- `flight-controls.js`;
- `camera-rig.js`;
- `card-carrier.js`;
- `runtime-mode.js`;
- `ground-controller.js`;
- `movement-lab.js`;
- Motion Lab PR #127;
- Studio CardRider measurement donor + known rejection.

Create:

`SOURCE_REUSE_MATRIX.md`

and a minimal transition contract proposal.

STOP.

## TMB-1 · Animated Card + one Rig_Medium passenger

After TMB-0.

Isolated proof only.

Use:
- real animated Travel CardCarrier;
- real ActionFigure Rig_Medium.

Source-object-first order:
1. card alone;
2. actor alone;
3. mounted actor;
4. candidate Surf presentation.

No Ground transition yet.

Human gate:
**Does the KayKit actor convincingly ride the exact animated Travel card without floating, clipping, wrong facing or rigid-card regression?**

## TMB-2 · Ground → Flight double-Space handoff

Use existing `runtime-mode.js`.

Add only the input/transition seam.

Prove:
- single Space = jump;
- second fresh Space requests Flight;
- one movement writer at all times;
- actor/card mount transition preserves world position/heading;
- no Flight FX/camera before handoff;
- no Ground input after handoff.

## TMB-3 · Flight → Ground landing

Intentional descent + valid support + low AGL.

Prove:
- no forced landing during ordinary low fly-by;
- safe support pose;
- no teleport/pop;
- card can leave/hide cleanly;
- same actor resumes Ground movement.

## TMB-4 · WorldBuilder consumer proof

**HOLD until WB1-P2 Surface Adapter proof is accepted enough for consumption.**

Then reuse the same mobility seam in one small WorldBuilder scene.

WorldBuilder provides world/support/authoring context.

Travel remains Flight owner.

Ground locomotion remains its named owner.

## TMB-5 · Drive transition

Future only.

---

# What NOT to do

- no new flight physics;
- no second Ground controller;
- no second camera system;
- no flat Frankenstein card;
- no new global vehicle framework;
- no WorldBuilder integration before the Surface Adapter gate;
- no Racer physics integration in this preparation slice;
- no 20-character rider matrix;
- no Work/WSA;
- no Cloudflare debug loop.

---

# Review / preview policy

Use Web/GitHub first.

For human visual gates, provide a **zero-install clickable review surface** or a bounded Stage review if needed.

Do not require Georg to set up Python, CLI or a local server.

No Work unless a later explicit capability gap is documented through the Work Escalation Card.

---

# Exactly one next gate

**TMB-0 · Source Lock + seam map only.**

No implementation in the first fresh chat.
