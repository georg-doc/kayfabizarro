# KCL-M1 · Test / Evidence Report

Date: 2026-09-19  
Owner: KFB Game Dev Studio research  
Branch: `chatgpt-web/kaykit-creator-learning-2026-09-19`

## Scope

This checkpoint tests the **source structure and owner boundaries** of the Locomotion Sync Bench.

It does not claim:
- browser boot;
- GLB network load;
- measured runtime foot-contact values;
- visual superiority of phase sync;
- approved timeScale ranges;
- consumer integration.

## Existing source evidence

The current KayKit `Rig_Medium_MovementBasic` donor already has measured clip durations in existing KFB casting evidence:

- `Running_A` — 0.800 s
- `Running_B` — 0.800 s
- `Walking_A` — 1.067 s
- `Walking_B` — 1.067 s
- `Walking_C` — 1.600 s

KCL-M1 does not treat those durations as gait-role proof. It remeasures the real actor/clip combination in-browser.

## Static/source checks

1. exactly five source clips — PASS
2. no Sprint source — PASS
3. Root/Hips translation is stripped — PASS
4. real foot nodes are measured — PASS
5. 240 intervals per cycle — PASS
6. planted-interval derivation exists — PASS
7. reference speed derives from planted-foot motion — PASS
8. compensated slip metric exists — PASS
9. phase-sync target entry exists — PASS
10. naive target entry remains phase 0 — PASS
11. Three.js crossfade is used — PASS
12. optional fade warp is surfaced — PASS
13. desired speed maps to timeScale — PASS
14. candidate rate clamp is bounded — PASS
15. no keyboard/input ownership — PASS
16. no world movement/velocity writer — PASS
17. two simultaneous A/B visual lanes — PASS
18. measurement profile export exists — PASS
19. human approval flags remain false — PASS
20. human Stage target is a `kayfabizarro.pages.dev` route — PASS

**20/20 static/source checks PASS.**

## Donor reuse verified

### Travel Ground Movement Lab

Reused:
- controller-owned clip cleaning;
- foot sampling approach;
- source-derived cadence thinking.

Not copied:
- player input;
- Ground movement;
- world position;
- Travel jump/controller state.

### KFB Rig Embed v3

Preserved:
- one mixer per host;
- animation presentation does not own movement/physics.

KCL-M1 uses two isolated hosts only because it is an A/B laboratory: one mixer per A/B actor. There is no shared consumer actor here.

## Current source pins

See `SOURCE.json`.

Actor:
- ActionFigure / Rig_Medium
- blob `4785276defdb929cb397954eb74b76aecb84486b`

MovementBasic:
- blob `98e965e886ec539e80f8984a77a29b0c1c02e5e5`

## Browser / runtime status

- browser boot: **NOT RUN**
- ActionFigure visible: **NOT RUN**
- 5/5 source clips loaded: **NOT RUN**
- foot nodes resolved: **NOT RUN**
- automatic measurements generated: **NOT RUN**
- A/B transition visibly compared: **NOT RUN**
- console/page errors: **NOT RUN**
- public Cloudflare Stage: **NOT DEPLOYED**
- Georg motion preference: **OPEN**

## One next gate

Publish the exact candidate to:

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

Then run a browser proof covering source marker, WebGL boot, 5/5 measurements, A/B transition state and zero page/console errors. Human review follows automated proof.


## Runtime proof · 39/39 local browser PASS

### Repair history

**Pass 0 / first local run:** the bench itself loaded and measured all five source clips successfully. The workflow then failed in the test harness because the proof tried to read `snap.source`; the bench intentionally exposes source metadata at `window.__KFB_KCL_M1__.source`, outside `snapshot()`.

**Repair Pass 1:** changed the local/public proof scripts only. No bench, clip, contact, transition, timeScale or source-asset logic changed.

Result on commit `72e6eae20699c605c015514600d1ecec792ee127`:

- workflow run: `35468444150`
- local-proof job: `105964939873`
- **39/39 PASS**
- source actor + real MovementBasic GLB loaded
- 5/5 clips measured
- real left/right foot contacts resolved for every clip
- WebGL canvas present
- naive + phase-sync lanes present
- A/B transition executed
- ownership checks PASS
- source pin PASS
- failed HTTP/resources: 0
- page/console errors: 0
- artifact: `10591764219`
- artifact digest: `sha256:55b8cc47723a64fc9c633ad46e2008a446d666ba724d02fed6242c17354de75e`
- artifact files: `desktop.png`, `local-browser.json`

### Auto-measured candidate summary

| Clip | Duration | Reference speed candidate | Slip / actor height | Primary contact notes | Status |
|---|---:|---:|---:|---|---|
| Walking_C | 1.600 s | 0.447 | 1.73% | L ~34.6%, R ~85.0% | measured candidate |
| Walking_A | 1.067 s | 0.611 | 1.38% | L ~30.0%, R ~80.4% | measured candidate |
| Walking_B | 1.067 s | 0.751 | 3.09% | L ~30.4%, R ~75.0% | measured candidate |
| Running_A | 0.800 s | 2.480 | 6.63% | L ~9.6%, R ~59.6% | measured candidate |
| Running_B | 0.800 s | 0.284 | 10.94% | fragmented multiple low-foot spans | **AUTO_METRIC_AMBIGUOUS_HOLD** |

These values are automatic measurement candidates, not approved KFB world speeds.

The automatic reference-speed ordering is:

`Running_B < Walking_C < Walking_A < Walking_B < Running_A`

This **must not** be interpreted as semantic slow/normal/fast ordering. The most useful result is that `Running_B` is not safely classifiable from the current automatic plant metric and is therefore held out of speed-band mapping until visual/manual review.

### Default A/B execution

Default bench run:

- source: `Walking_A`
- target: `Running_A`
- LEFT contact
- fade: 0.12 s
- warp: ON
- desired speed: 1.5
- source phase candidate: ~30%
- naive target entry: 0%
- phase-sync target entry: ~9.6%
- Walking_A rate candidate hit the temporary clamp: 1.80×
- Running_A rate candidate: ~0.60×

The clamp hit is itself useful evidence: desired speed 1.5 is above `Walking_A`'s measured reference regime. The `0.45 … 1.8` bench range remains a technical candidate, not an approved locomotion policy.

See `MEASURED_PROFILE_CANDIDATE.json` for persisted machine-readable values.

## Public Cloudflare gate

KCL public-proof run `35467428927`, job `105962230768`, failed **before the bench booted**. During the full marker poll, the KCL `SOURCE.json` URL returned the KFB HTML fallback rather than JSON.

Cross-checks show this is not KCL-specific:
- the preceding TE-01 public proof had already failed its Cloudflare deployment-marker gate before KCL publication;
- later Cloudflare Pages builds also failed;
- therefore no KCL animation/runtime defect is established by the public failure.

Current public state:

`PUBLIC_VERIFIED = OPEN / BLOCKED BY REPO-WIDE CLOUDFLARE DEPLOYMENT`

The local 39/39 browser PASS is technical evidence only and does not replace the required pages.dev human gate.

## Exactly one next gate

Restore a current successful Cloudflare/pages.dev deployment **without changing KCL motion logic**, then run the exact public browser proof and let Georg compare the visible A/B transition. Only after that human gate should any MotionProfile be proposed to Travel, Race, Combat or Platformer.


## Public Stage browser proof · 39/39 PASS

This section supersedes the earlier public Cloudflare blocker status while preserving it as deployment-history evidence.

### Publication repair

Cloudflare publication source is `cloudflare-live`, not `main`.

Repair commit:
`fac041eb34c9a284d724a3ee2b945bef7d020d04`

Mirrored:
- exact KCL Stage `index.html`;
- exact KCL Stage `bench.mjs`;
- exact KCL Stage `SOURCE.json`;
- current KFB Hub entry.

Cloudflare Pages deployment: **SUCCESS**.

### Public browser evidence

Run `35468444150`, attempt 2  
Public-proof job `105981648314`

Exact route opened:

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

Result:
- deployment marker matched source head `d5c112af24df803462f0a326a85925f34170a5ed`;
- HTTP PASS;
- bench ready;
- no bench error;
- exact five clips;
- five profiles;
- duration/contact/reference-speed/slip checks for 5/5 clips;
- consumer movement owner preserved;
- Registry read-only;
- pinned source verified;
- WebGL canvas present;
- naive lane present;
- phase-sync lane present;
- A/B transition executed;
- failed resources: 0;
- page/console errors: 0.

**PUBLIC_BROWSER_RESULT 39/39 PASS**

Artifact:
- ID `10593933655`
- digest `sha256:5d7f6bb436d0030a3ddec3f080e0a6b041fe196cdf36cd3d34d5f5d01f71c0cf`
- contains screenshot + public-browser JSON.

### Status

`PUBLIC_VERIFIED = YES`

`GEORG_MOTION_ACCEPTANCE = OPEN`

No consumer integration is implied by technical PASS.

## Exactly one current gate

Georg visually compares **A · NAIVE** and **B · PHASE SYNC** on the public Stage, starting with Walking_A → Running_A. Judge foot sliding, double-step, hip pop, cadence and weight. Only after that visual gate may a MotionProfile be proposed to named consumers.
