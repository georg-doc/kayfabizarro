# KFB ToolBox · KayKit Character Compatibility v0 · START HERE

**Date:** 2026-09-20  
**Status:** ACTIVE CANDIDATE · SOURCE/CONTRACT BENCH · NO RUNTIME PROMOTION  
**Owner:** KFB ToolBox / Character compatibility  
**Repo:** georg-doc/kayfabizarro  
**Branch:** chatgpt-web/toolbox-kaykit-character-compat-2026-09-20  
**Base:** main @ a6b9220a0b42d50a9de9804fad22e84dde2c322c  
**Outcome:** one compatibility contract joining existing KayKit motion, KFB graft/face, vehicle mount and prop-host work without creating a second runtime owner.  
**Intended Stage route:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-character-compat-v0/  
**Human gate:** source objects and contract first; no new ear geometry, EyeRig fork, vehicle physics or consumer integration is accepted by this slice.

## 0 · Read first

1. skills/chat/START_HERE.md
2. skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
3. skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
4. tools/KFB-ToolBox/START_HERE.md
5. tools/KFB-ToolBox/_handover/KAYKIT_MOTION_LAB_2026-09-20/START_HERE.md on PR #127 / branch chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20
6. tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md and KCL-M1 locomotion-sync donor on PR #107
7. this file, SOURCE_MATRIX.json, TEST_REPORT.md and RETURN.md

GitHub state wins over chat memory and over the pasted custom-GPT proposal.

## 1 · Bounded slice

### Goal

Turn the current separate KFB character solutions into one **compatibility layer**, not one new monolithic character runtime.

This layer describes how an actor uses:

- a canonical body/rig family;
- the existing KayKit motion profile;
- the existing KFB face/EyeRig owner;
- optional grafts and secondary-motion attachments;
- an optional vehicle mount;
- an optional static prop host.

### Protected boundaries

This slice must NOT:

- fork or replace EyeRig v6;
- fork or replace the KayKit Motion Lab / RigMotionProfile owner;
- own Race or Combat world movement, physics, damage, camera or root transform;
- replace Frankenstein/Graft geometry modules that already work;
- turn _inbox Vehicle Lab candidates into canonical runtime code;
- destructively rewrite the legacy Bath/Rover configs;
- invent an Eraser/Rubber model while no verified source has been found;
- invent new FrizzleBob ear geometry before a real donor/approved mesh exists;
- merge or promote Live automatically.

## 2 · Verified upstream owners

### Motion

PR #127, branch chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20 is the current KayKit Motion Lab candidate.

Public proof already exists at:

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/

Its architecture remains:

    RigMotionProfile
      -> ActorMotionReview / actor override
      -> consumer facts

The consumer still owns movement/physics.

### FrizzleBob graft / face

Current ToolBox sources:

- tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-biped.v1.js
- tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js
- tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/headgraft.v1.js
- tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/ears.v2.js
- tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/actor-wobble.v1.js
- tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json

Important existing rule: donor supplies form; host supplies measured placement and size. Host head is hidden, not destructively cut.

Existing ears.v2 already owns one-piece ear geometry + movement-following spring. actor-wobble.v1 exposes the same proven spring idea for new attached parts. A future new-ear slice should reuse this behavior donor rather than write a second secondary-motion system.

### EyeRig

Current shared 3D owner:

- tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js

A prop such as Pencil/Rubber gets an adapter into this owner. It does not get a copied eye implementation.

### Vehicle rigs

Current measured legacy configs:

- kfb-rig-driver (Bath 01).json · blob ec392d1fcdd8d1f2ac01ee751185f56f2a753753
- kfb-rig-driver (Rover 01).json · blob 3978516dd20dc434d69582ca3ce47fb0757b9aaf

Bath is the crucial counterexample: cut=false, base=false, cockpit=false, whole figure retained; hips sit 0.355 below measured waterline.

Rover is the legacy destructive path: cut=true, base=true, cockpit=true.

The compatibility layer therefore treats destructive cutting as **legacy input semantics**, not as the future actor asset.

## 3 · Compatibility contract

Candidate schema name:

    kfb.character-compat/0.1-candidate

Conceptual shape:

    {
      actorClass: "character | graft | prop",
      rigFamily: "Rig_Medium | Rig_Large | Rig_Prop",
      motionProfileRef: null,
      face: {
        owner: "EyeRig-v6 | existing-graft-face | none",
        hostAdapter: null
      },
      attachments: {
        rigid: [],
        secondary: []
      },
      mount: {
        mode: "world | mounted",
        seatAnchor: null,
        lowerBody: "visible | hidden | occluded",
        occlusionSource: null,
        controlTargets: []
      },
      secondaryMotion: {
        sources: []
      }
    }

This schema is a **routing/compatibility contract**. It does not become a second owner of animation, face, physics or vehicle transforms.

## 4 · Reference actors

### Goth Girl · native Rig_Medium reference

Source:

media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb

Policy:

- keep KayKit skeleton unchanged;
- look changes stay mesh/material/attachment side;
- hips are the seating anchor;
- motion stays with Rig_Medium profile;
- hair/skirt secondary treatment, if needed, is a later attachment slice.

### FrizzleBob · graft reference

Host:

media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb

Policy:

- preserve Driver Rig_Medium deform skeleton;
- preserve measured head graft;
- new ears attach as leaf/secondary structures only;
- do not insert custom bones between KayKit bones;
- Race wind is consumer motion input into a secondary-motion adapter, never vehicle ownership inside the actor.

Future wind facts may include:

    speedNorm
    localVelocity
    longitudinalAccel
    lateralAccel
    angularVelocity

The existing movement-following spring is the behavior donor. KCC-1 will decide the exact new ear mesh/chain after a real visual donor is approved.

### Pencil · static prop host reference

Current real donor:

media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf

Policy:

- actorClass=prop;
- rigFamily=Rig_Prop;
- static face-host adapter measures local bounds/facing;
- existing EyeRig v6 owns pupils/lids/blink/gaze/emotes;
- prop locomotion/pose may be transform-based or later share KayKit-like semantic events, but must not pretend the Pencil has a KayKit biped skeleton.

### Rubber / Eraser

Status: **SOURCE_REQUIRED**.

Repository search found card/audio references but no verified 3D Eraser/Rubber model source in the current GitHub state.

Rule: do not substitute a generic cube, do not rename an unrelated asset, do not publish a placeholder. Add the real donor once found or provided.

## 5 · VehicleMount direction

Candidate schema:

    kfb.vehicle-mount/0.1-candidate

Responsibilities:

Vehicle/consumer owns:

- world/root transform;
- seat/mount transform;
- vehicle physics;
- control geometry;
- occlusion volume/source.

Character owns:

- local seated pose;
- local skeleton;
- face;
- local reactions;
- visibility policy application.

Required fields:

    mode: "cockpit | immersed | exposed"
    seatBone: "hips"
    pose: semantic motion state
    lowerBody: "visible | hidden | occluded"
    occlusionSource: vehicle-defined
    controlTargets: named optional sockets

Migration examples:

Bath:
- mode=immersed
- lowerBody=occluded
- cut=false stays intact

Rover:
- legacy cut=true is read as desired presentation, not as permission to permanently alter the character asset
- target lowerBody=hidden/occluded with a reversible implementation
- seat/root remains vehicle-owned

Paper Plane source candidate already measured by Vehicle Lab input:

media/3D_Assets/KFB/Paper Plane by Anonymous - 5X4zRUBadun.glb

Pinned donor measurement: 29aac1061bdd73736351cb856fa9f1e322478abc.

No DriverMount is asserted yet for Paper Plane. It first needs a measured seat/grip/occlusion review.

## 6 · New FrizzleBob ear direction

Do not replace ears.v2 in this slice.

The next ear candidate should satisfy:

- different approved geometry than current ears;
- attached under the measured head host;
- no modification of KayKit deform hierarchy;
- one or two local deformation/attachment segments per ear only if the real mesh needs them;
- reuse actor-wobble / existing ear spring semantics;
- no idle random wobble;
- deterministic response to host movement + optional Race wind facts;
- clamped root/tip excursion;
- reset has zero accumulated drift;
- no head-graft feedback loop.

Race-specific apparent wind is an **input**, for example:

    apparentWind = -localVelocity + turbulence + angularVelocity contribution

The actor may convert those facts into local ear targets. It must not read or own Race physics directly.

## 7 · Animation and pose direction

Use the Motion Lab profile layer.

Do not make raw donor clip names part of Race/Combat gameplay APIs.

Consumers request semantic states/actions; the actor profile resolves verified KayKit clips.

Vehicle pose work should be compositional where possible:

- full-body seated base;
- optional masked/additive upper-body gesture;
- local reaction layers;
- root motion measured but not applied to world/root.

Goth Girl remains the clean Rig_Medium reference for seat/gesture composition.

## 8 · Source bench / HTML

This slice creates:

kfb-hub/stage/toolbox/kaykit-character-compat-v0/

The bench is intentionally source-first:

- select a verified donor;
- render that donor alone;
- show exact repo path and source status;
- show rig/role/next gate;
- never silently substitute a missing donor;
- link the existing Motion Lab proof for the motion layer.

It is not proof that a future graft/mount/prop integration works.

## 9 · Planned bounded follow-up slices

1. **KCC-1 FrizzleBob Ear/Wind Adapter**
   - approve a real new ear donor/mesh;
   - show donor alone;
   - integrate onto current graft;
   - feed synthetic motion facts first, Race facts second;
   - numeric reset/drift + visual front/side/¾ proof.

2. **KCC-2 VehicleMount Adapter**
   - Bath first: reversible immersed occlusion;
   - Rover second: legacy cut comparison vs reversible hidden/occluded;
   - Paper Plane third only after measured mount anchors.

3. **KCC-3 Prop FaceHost**
   - Pencil real donor first;
   - static host measurement;
   - EyeRig v6 adapter;
   - Rubber only after real source is resolved.

4. **KCC-4 Pose/Animation Compatibility**
   - consume Motion Lab profiles;
   - seating + gesture masks;
   - Race/Combat consumer facts without raw clip-name coupling.

## 10 · Acceptance for this v0 slice

PASS when all are true:

- owner/branch/outcome/route are explicit;
- verified donors are named by exact repo path;
- missing Rubber source remains explicitly missing;
- current Motion/EyeRig/Graft owners are reused, not forked;
- Bath and Rover legacy behavior is documented from real configs;
- source bench loads real donor models in isolation;
- source bench has no placeholder 3D object for missing sources;
- static tests pass;
- Return and additive changelog/Hub metadata are current.

Human acceptance of actual new ears, VehicleMount behavior and Prop EyeRig is **not** part of v0.

## 11 · Environment note

GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED

The optional game-dev helper was unavailable in this chat environment. This slice therefore uses repository-native GitHub/HTML checks. Sealed Game Development Studio evidence is not required for KCC-0.
