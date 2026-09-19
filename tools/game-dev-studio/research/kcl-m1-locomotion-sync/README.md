# KCL-M1 · Locomotion Sync Bench

Status: **IMPLEMENTATION CANDIDATE · SOURCE/STATIC QA PENDING · BROWSER/HUMAN GATE OPEN**  
Owner: **KFB Game Dev Studio research**, consuming current Asset/ToolBox motion truth.  
Does not own: Travel/Race/Combat/Platformer movement, physics, gameplay state, canonical animation assets, or a shared global mixer.

## Goal

Prove whether the current KayKit Rig_Medium locomotion clips can be turned into smooth, reusable KFB motion profiles without changing consumer physics.

Exactly five source clips are in scope:

- `Walking_A`
- `Walking_B`
- `Walking_C`
- `Running_A`
- `Running_B`

No Sprint clip is invented.

## Source

See `SOURCE.json`.

Neutral donor:

`ActionFigure.glb · Rig_Medium`

Animation donor:

`Rig_Medium_MovementBasic.glb`

Both are pinned to the exact source snapshot listed in `SOURCE.json`.

## Reused KFB donors

### Travel Ground Movement Lab

`travel/wip/travel_globe_wsa/world-builder/movement-lab.js`

Reused ideas:

- source/actor compatibility first;
- strip Root/Hips translation so animation does not become a second movement solver;
- sample real feet on the real rig;
- derive a cadence/reference-speed candidate from foot motion.

Not reused:

- Travel Ground controller;
- Travel player/world position;
- Travel input;
- Travel jump physics.

### KFB Rig Embed v3

`tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`

Preserved rule:

> one host owns the animation mixer; consumer movement remains separate.

KCL-M1 uses a neutral raw Rig_Medium actor so face/graft motion cannot contaminate the locomotion measurement.

## Runtime measurement

For each of the five clips the bench samples the two foot bones across 240 intervals and derives:

- clip duration;
- dominant horizontal locomotion axis;
- low-foot / planted intervals;
- left/right contact-phase candidates;
- reference translation-speed candidate from planted-foot motion;
- compensated planted-foot slip;
- foot-cycle excursion.

Automatic values are marked **candidate evidence**. The bench does not auto-approve playback-rate ranges or transition feel.

## A/B proof

Two identical actors are shown together:

**A · NAIVE**

`source contact → target starts at phase 0 → crossfade`

**B · PHASE SYNC**

`source contact → target starts at matching left/right contact → crossfade`

Optional Three.js crossfade time-warp can be toggled independently.

Both lanes use the same source/target clips, desired speed, playback-rate mapping and fade duration; phase entry is the intended experimental variable.

## TimeScale

When `speed → timeScale` is enabled:

`playbackRate = desiredSpeed / measuredReferenceSpeed`

with a conservative candidate clamp of `0.45 … 1.8`.

This is a bench constraint, **not an approved global KFB range**. Georg/human review must determine useful visual bounds per clip/profile.

## Export

The bench can export:

`kcl-m1-motion-profiles-candidate.json`

Schema:

`kfb.motion-profile-candidate/0.1`

The export is measurement evidence only. It is not automatically written into the Registry or a game consumer.

## Stage target

Planned human-review route:

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

Do not call this route deployed or verified until the publication mirror is committed and the exact Cloudflare URL is opened successfully.

## Pass ladder

1. exact source pins resolve;
2. five clips load and bind;
3. both foot bones resolve;
4. automatic measurement completes for 5/5 clips;
5. A/B actors run with one local mixer each;
6. phase-sync mode enters target at the selected foot-contact candidate;
7. source/target playback-rate mapping is inspectable;
8. browser has no errors;
9. Georg compares A/B visually;
10. only then may a measured profile be proposed to a named consumer.

## One next gate

Publish this candidate to the fixed Cloudflare Stage route and run browser QA; then Georg judges whether the phase-synced transition actually reads better than the naive transition before any consumer integration.
