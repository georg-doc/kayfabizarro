# KFB Eye Actor Studio v1 · Fresh Chat Build Brief

**Date:** 2026-09-21  
**Status:** READY FOR FRESH CHAT · BUILD STUDIO FIRST  
**Owner:** KFB ToolBox / Rigging · existing EyeRig authoring line  
**Repo:** `georg-doc/kayfabizarro`  
**Execution branch:** create `chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21` from then-current `main`  
**Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`  
**No auto-merge / no Live promotion.**

## Outcome

Build one usable **Eye Actor Studio v1** as the richer authoring front end for the existing EyeRig line.

Motto:

> **Eye — including lids & brows — as actors.**

The Studio itself is the slice.

Do **not** begin Hunky/Dory, Legacy Buddy aliens, vehicles, radios, toaster faces, plants or gameplay integration before Studio v1 reaches its human gate.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this brief
5. `EYE_CLUSTER_CONTRACT.v0.md`
6. `DEFERRED_HUNKY_DORY.md`
7. `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
8. `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
9. `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js`
10. `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js`
11. `tools/2D Animation Studio/shared/eye-rig/eye-rig-protocol.v1.json`
12. `skills/chat/workflows/KFB_MOBILE_PREVIEW_CHATTERBOX_LEGACY_PET_2026-09-21/RETURN_EYE_ACTOR.md`
13. `tools/KFB-ToolBox/eye-actor-studio/EYE_ACTOR_CONTRACT.v0.md`

GitHub state overrides this snapshot. Re-fetch current main and the current EyeRig Batch PR before writing.

## Existing owners that stay owners

### EyeRig v6

Canonical 3D eye behavior donor:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Known blob at preparation:
`853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`.

It already owns:
- eyeballs;
- pupils;
- **two-eye / four-lid** construction;
- blink;
- per-eye upper/lower lid values;
- per-eye slant;
- gaze / point target;
- kinetics;
- life/wander/tremor;
- `eyeFrame()`.

Do not fork its semantic behavior API casually.

### Current orientation limit

EyeRig v6 currently has one mirrored **Y-axis splay**:
- left/right rotate outward;
- up to 45°;
- source comment explicitly leaves top/bottom orientation for later.

That is not sufficient for:
- frog-like side eyes;
- eyes mounted on oblique surfaces;
- arbitrary alien eyes;
- vehicle eyes;
- individual eye roll/pitch.

Studio v1 therefore introduces a **companion Eye Anchor / Eye Cluster layer**, not a redefinition of `splay`.

### EyeOval v1

Existing donor:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/eyeoval.v1.js`

It already proves:
- width;
- height;
- depth;
- roll-like inward tilt;

without forking EyeRig.

Current limitation:
- one shared W/H/D for both eyes;
- mirrored tilt.

Studio v1 must preserve this as a symmetric preset but add **per-eye** size/shape controls above it.

### BrowRig v2

Reuse exactly:
- volumetric/tube brows;
- skeptical/tired/etc presets;
- bend;
- lift/follow;
- eye-frame attachment.

### EyeRig Batch

Existing calibration/profile/data lane.

Do not create:
- second actor inventory;
- second profile database;
- second Medium/Large truth.

The Studio should become the richer authoring front end for this lane.

### Shared protocol

`kfb.eye-rig.protocol/1` remains the renderer-neutral behavioral vocabulary.

## Verified EAS-0 donor

Prior bounded prototype:
`chatgpt-web/mobile-preview-chatterbox-legacy-pet-2026-09-21`.

Implementation:
`f6fcdfbf6ec086759b322d96c7a312dabc991c8a`.

Tested:
`2a79d398fad090aabf56d5a5d17f37fd97fa4df7`.

Evidence:
- **20/20 static PASS**
- **5/5 syntax PASS**
- **24/24 desktop/mobile WebGL PASS**
- 0 failed resources
- 0 page/console errors

Reuse useful modules only after comparing with current main. The old stacked branch is a donor, not the new runtime owner.

## Studio v1 architecture

The Studio must stop assuming “one symmetrical pair” as the only possible face.

### Core authoring model · Eye Cluster

A host owns an **Eye Cluster** of **1–4 Eye Slots**.

Each Eye Slot has independently:
- enabled/disabled;
- position XYZ;
- Pitch/Yaw/Roll;
- quaternion;
- overall size;
- width/height/depth shape;
- lid geometry family;
- pupil size/style;
- local gaze;
- local lid/slant acting;
- material source/override.

Two equal frontal eyes are only one preset.

### Required first presets

- `pair-frontal`
- `pair-asymmetric`
- `pair-frog-side`
- `single-eye`
- `three-eye`
- `four-eye`

These are geometry/authoring fixtures, not character canon.

### Asymmetry

The Studio must allow, for example:
- left eye 1.0 scale, right eye 1.35;
- one eye taller, one rounder;
- different depth;
- different rotation;
- different placement;
- different lid expression.

No hidden “mirror back to equal” step.

### 3–4 eyes

This is an **Eye Cluster architecture requirement**.

Do not blindly instantiate multiple complete EyeRig objects if that duplicates:
- host discovery;
- blink clocks;
- life state;
- profile ownership;
- material measurement.

First inspect whether the current EyeRig internals can be safely adapted behind a local candidate Eye Slot builder/controller while keeping EyeRig semantics and donor behavior.

The Studio-local cluster adapter may be experimental; canonical EyeRig v6 remains unchanged until the cluster proves itself.

## Coordinate model

Three distinct spaces:

1. **Host frame**
2. **Eye Slot anchor frame**
3. **Eye Actor local frame**

Composition:

`Host × EyeSlot(position, quaternion, scale) × local pupil/lid/brow acting`

Recommended local eye axes:
- +X = eye right;
- +Y = eye up;
- +Z = eye forward.

Author controls:
- Pitch around local X;
- Yaw around local Y;
- Roll around local Z.

## Studio layout

### Left · host / cluster / profile

Initially:
- neutral Studio FaceHost;
- cluster preset;
- Eye Slot list 1–4;
- one current real EyeRig Batch actor later in the build.

Eye Slot list must expose:
- eye ID;
- enabled;
- size;
- orientation;
- optional role label.

### Centre · dominant 3D stage

Required views:
- Front;
- 3/4 L;
- 3/4 R;
- Side;
- Top;
- free orbit;
- mobile 390×844.

### Right · grouped controls

#### Eye Slot transform
Per selected eye:
- Position X/Y/Z
- Size
- Width
- Height
- Depth
- Pitch
- Yaw
- Roll

Commands:
- reset;
- copy;
- duplicate;
- delete where eyeCount > 1;
- mirror selected eye;
- copy L→R / R→L for pair presets.

#### Pair/cluster convenience
- linked same;
- mirrored;
- independent;
- add eye;
- remove eye;
- eye count 1–4.

#### Existing EyeRig controls
- ring/placement where relevant;
- inset;
- lid fit;
- legacy splay shown as a compatibility/convenience parameter, not the general orientation solution.

#### Clay Lids
- donor / Clay toggle;
- thickness;
- concave↔convex curve;
- inner-rim offset;
- upper/lower visibility;
- clearance.

Clay lids must follow each Eye Slot's full transform and scale.

#### Acting
Canonical EyeRig expressions stay visible.

Separate Eye Actor poses:
- skeptical blink;
- aim left;
- aim right;
- tired;
- angry;
- surprised.

For 3–4 eyes, pose application needs explicit scope:
- all;
- selected;
- primary pair;
- named eye subset.

#### Brows
Reuse BrowRig v2.

Important:
BrowRig is currently pair-oriented. For 3–4-eye layouts, do not pretend it already generalizes.

Studio v1 may:
- attach brows to selected/primary pair;
- mark non-pair brow layout as `UNSUPPORTED` until a measured cluster-brow design exists.

No fake auto-brow for 3–4 eyes.

#### Materials
Resolver:
`face > body > main > fallback`.

Per Eye Slot debug:
- source;
- measured face colour;
- lid resolved colour;
- override;
- UV/texel-scale status.

#### Eye surface
- exact donor material;
- restrained shaded-eye candidate.

#### Eye shadow
- optional under-eye shadow/ring preview;
- selected/all scope.

#### Emanata 3D
- none;
- sweat;
- soot;
- anchor target: selected eye / primary pair / cluster centroid.

## Frog-side proof

A neutral rounded host is enough.

Fixture:
- two eyes moved laterally;
- Yaw strongly outward, about ±60–90°;
- optional Pitch/Roll;
- asymmetric eye sizes allowed;
- blink;
- skeptical pose;
- pupil gaze.

Evidence:
Front + Side + Top.

The eyes must look **mounted on the side**, not merely rotated while remaining front-positioned.

## Multi-eye proof

### Three-eye fixture
Example:
- two normal lower eyes;
- one smaller central/top eye;
- independent size and Pitch;
- synchronized blink all;
- then selected-eye blink/pose.

### Four-eye fixture
Example:
- two primary eyes + two smaller secondary eyes;
- different scale and/or orientation;
- no geometry collision;
- deterministic reset.

No alien character design is needed for these proofs.

## Clay Lid contract

Each lid must:
1. have visible volume;
2. have rounded outer mass;
3. keep a clean harder inner eye-facing rim;
4. preserve upper/lower independence;
5. preserve per-eye slant;
6. support concave/convex opening;
7. avoid pupil penetration;
8. avoid paper-shell appearance;
9. follow Pitch/Yaw/Roll;
10. follow per-eye non-uniform scale without tearing.

## Acting architecture

A reusable Eye Actor pose may combine:
- lid upper/lower;
- slant;
- gaze;
- pupil;
- BrowRig expression where supported;
- shadow state;
- emanata state.

It never owns body animation.

For Eye Clusters, every pose must define **scope**.

## Material / colour rule

Georg direction:
`face > body > main colour`.

For real KayKit actors:
- use actual face material/texture family;
- match texel density;
- use modal sampling for flat KayKit palette textures where appropriate;
- show provenance;
- no unverified fallback disguised as certainty.

Future colour direction may use KayKit palette logic plus current Cologne look work.

The exact source behind spoken “Cologne Wastefax” remains unresolved. Do not guess.

## Required build sequence

### EAS1-A · donor reconstruction
- branch from current main;
- exact EyeRig v6 donor;
- exact BrowRig v2 donor;
- exact EyeOval v1 donor;
- import only proven EAS-0 pieces.

### EAS1-B · Studio shell
- cluster list;
- dominant 3D stage;
- compact author controls;
- mobile-safe layout.

### EAS1-C · Eye Slot transform
- per-eye position;
- per-eye size + W/H/D;
- Pitch/Yaw/Roll;
- quaternion debug;
- symmetric/asymmetric pair proof.

### EAS1-D · Eye Cluster 1–4
- add/remove Eye Slots;
- 1/2/3/4 fixture presets;
- all/selected acting scope;
- no duplicate profile owner.

### EAS1-E · Clay Lid authoring
- four-lid pair proof first;
- then verify lids on selected slots in 1–4 cluster;
- clearance and orientation.

### EAS1-F · pose shelf
- canonical + higher-level poses;
- skeptical;
- one-eye aim;
- deterministic neutral.

### EAS1-G · material/zone debug
- face > body > main;
- provenance;
- zone debug;
- texel scale.

### EAS1-H · eye shading + tired shadow

### EAS1-I · eye-relative 3D emanata

### EAS1-J · one real Batch actor
Exactly one existing actor/profile consumer.

Do not expand roster.

## Explicitly deferred

Until Studio v1 human acceptance:
- Hunky;
- Dory;
- Legacy Buddies;
- blank/template alien head;
- eye-stalk/dangle physics;
- Dory mouth;
- vehicle eyes;
- toaster/radio faces;
- living plants;
- heart eyes;
- spiral/dizzy geometry;
- oversized cartoon pupil/catchlight mode;
- combat triggers;
- bulk batch processing.

## Parked Hunky / Dory consumer

After Studio acceptance:

### Hunky
- teal/blue;
- likely two stalk eyes;
- more damping / less bounce;
- skeptical + aim-heavy acting.

### Dory
- softer material;
- more squash/stretch;
- more follow-through;
- surprised/worried acting;
- mouth later.

Proposed chain:

`measured stalk root → dangle/secondary stalk → Eye Slot anchor → Eye Actor`

The user-described faceless Medium template head is **SOURCE_REQUIRED**. Current audit did not pin one exact intended source. No substitute is authorized.

## Acceptance matrix

Technical:
- exact donors visible first;
- Eye Slots 1–4;
- per-eye size/W/H/D;
- per-eye Pitch/Yaw/Roll;
- asymmetric pair;
- frog fixture ≥60° outward yaw;
- three-eye fixture;
- four-eye fixture;
- pupil gaze stays local to eye;
- lids survive orientation and scale;
- deterministic reset;
- 0 resource/page errors;
- 390×844 works.

Visual:
- Clay lids read as volume;
- inner rim clean;
- lower lids not eyeliner;
- strongly rotated eyes read mounted;
- unequal eyes look intentional;
- 3/4 eyes feel like one authored face system, not cloned widgets;
- skeptical/aim readable.

Data:
- existing Batch profile consumed;
- Eye Cluster companion metadata versioned/reversible;
- no second profile database;
- colour provenance explicit.

## Evidence

Return:
- repo/branch/PR/head;
- changed files;
- actual test counts;
- donor screenshots;
- pair asymmetric screenshot;
- frog Front/Side/Top;
- 3-eye screenshot;
- 4-eye screenshot;
- Clay Front/3/4/Side;
- mobile 390×844;
- one real Batch actor;
- exact Stage;
- `RETURN.md`;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- additive changelog.

## Human Stage

Only:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`

No public/live claim until the exact route visibly contains the expected revision.

## Exactly one final human gate

Ask Georg:

**Does the Studio now treat eyes as true independent actors — variable count, size, shape, 3D orientation, lids and gaze — while still feeling like one coherent KFB face system rather than cloned technical eye widgets?**


## 2026-09-21 · CORRECTION · Eyelid geometry gate

Before further Eye Actor Studio visual work, read:
`EYELID_GEOMETRY_CONTRACT.v1.md`.

The previous mobile-safe software Canvas fallback is **REJECTED** because it replaced real KFB 3D assets and volumetric lids with a 2D simulation.

The previous tube/stroke-looking lid interpretation is also **REJECTED**.

New mandatory sequence:
**real host → real eyeball → one volumetric upper lid proof → lower lid/closure → slant/curve → asymmetry/frog → cluster**.

Do not rebuild the whole UI first.
