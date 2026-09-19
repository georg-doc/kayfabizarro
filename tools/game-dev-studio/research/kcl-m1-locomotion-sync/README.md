# KCL-M1 · Locomotion Sync Bench

Status: **PUBLIC BROWSER 39/39 PASS · AUTO-MEASURED PROFILES · HUMAN MOTION GATE OPEN**  
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


## Current measured result

Local GitHub Actions browser proof:

- run `35468444150`
- job `105964939873`
- **39/39 PASS**
- artifact `10591764219`
- digest `sha256:55b8cc47723a64fc9c633ad46e2008a446d666ba724d02fed6242c17354de75e`
- real ActionFigure + pinned MovementBasic loaded
- 5/5 requested clips measured
- WebGL + A/B transition executed
- 0 failed resources
- 0 page/console errors

Persisted profile candidate:

`MEASURED_PROFILE_CANDIDATE.json`

Automatic reference-speed candidates:

```text
Walking_C  0.447
Walking_A  0.611
Walking_B  0.751
Running_A  2.480
Running_B  0.284  ← AUTO_METRIC_AMBIGUOUS_HOLD
```

Do not treat this ordering as a semantic speed taxonomy. `Running_B` has fragmented low-foot intervals and the highest compensated slip candidate; it stays HOLD until visual/manual review.

Default A/B proof successfully executed:

```text
Walking_A → Running_A
LEFT contact
fade 0.12 s
warp ON

A naive target entry: 0%
B phase-sync entry: ~9.6%
source left-contact candidate: ~30%
```

At desired speed 1.5, Walking_A hits the temporary 1.8× bench clamp while Running_A maps to ~0.60×. That is evidence that 1.5 is not a sensible shared default for judging both clips; approved speed/rate ranges remain human-open.

## Public blocker

The pages.dev route is **not PUBLIC_VERIFIED**.

The KCL public proof failed before the bench booted because `SOURCE.json` resolved to the KFB HTML fallback during the whole marker window. Independent pre-KCL TE-01 proof and later Cloudflare Pages builds failed at the same deployment layer.

Do not repair KCL animation code in response to this infrastructure failure.

## Current one gate

Restore a successful current Cloudflare/pages.dev deployment, rerun the exact public proof unchanged, then Georg compares NAIVE vs PHASE SYNC visually before any consumer integration.


## Public browser proof · 39/39 PASS

The earlier Cloudflare blocker is resolved.

Root cause:
- Cloudflare deploys from `cloudflare-live`;
- KCL Stage files had existed only on `main`;
- the public URL therefore returned the generic Hub fallback.

Publication repair:
- `cloudflare-live@fac041eb34c9a284d724a3ee2b945bef7d020d04`;
- mirrored only the exact tested KCL `index.html`, `bench.mjs`, `SOURCE.json` plus current Hub;
- Cloudflare Pages deployment check: SUCCESS.

Public proof:
- workflow run `35468444150`, attempt 2;
- public-proof job `105981648314`;
- exact fixed Stage URL opened successfully;
- **39/39 PASS**;
- 5/5 scoped clips loaded + measured;
- WebGL + naive/phase-sync A/B executed;
- 0 failed HTTP/resources;
- 0 page/console errors;
- artifact `10593933655`;
- digest `sha256:5d7f6bb436d0030a3ddec3f080e0a6b041fe196cdf36cd3d34d5f5d01f71c0cf`.

`PUBLIC_VERIFIED = YES`.

The remaining gate is human motion judgment only.

## Current one gate

Open the fixed public Stage and compare **A · NAIVE** vs **B · PHASE SYNC**.

Start with:
- Walking_A → Running_A
- LEFT contact
- fade ~0.12 s
- warp ON
- speed-match ON

Judge:
- foot sliding;
- double-step;
- hip pop;
- cadence;
- perceived weight.

Do not promote a consumer MotionProfile until Georg accepts the visual result.
