# KayKit Creator Lessons · Return

**Date:** 2026-09-19  
**Owner:** KFB Game Dev Studio  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/kaykit-creator-learning-2026-09-19`  
**Base main head:** `a92e3c70029d811b76a88a15459adc20fea943bb`

## Goal

Create a durable, additive KFB living analysis of Kay Lousberg's creator videos/how-tos, starting with `Using KayKit Characters In Godot (Detailed version)`, and extract engine-independent KayKit production rules that can be used before any Godot integration.

## Actual result

Created:
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_SOURCE.json`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`
- this Return

The living document currently covers:
- character/rig/animation-library separation;
- `Rig_Medium` vs `Rig_Large`;
- attachment/socket calibration;
- material/texture variants;
- character composition / pick-and-choose;
- state-machine ownership boundaries;
- transition/event timing;
- staged retargeting;
- neutral mannequin/rig-bench proposal;
- current vs legacy KayKit generations;
- Platformer control donors;
- Dungeon/Hex modular/topology-vs-appearance grammar;
- Mixed Bag / Live Show family-vs-file-count lessons;
- functional pack boundaries;
- environment tutorial watchlist.

## Owners kept unchanged

- canonical source identity/provenance: Asset Registry / Asset Librarian;
- package presentation/evidence: KFB Game Dev Studio;
- graft/socket/attachment authoring: ToolBox / FrankenStein;
- animation calibration/retarget preview: Animation owner;
- runtime state/physics/gameplay: named consumer;
- Dungeon/Hex/Platformer scene composition: existing Baukasten/level owner.

No new runtime, Registry or asset-library owner was created.

## Evidence

See `KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`.

Current verified documentation head before metadata wiring:
`1be983ba35606b444b5bd5e75dae8ee44e1f69a0`

## Public route

Existing owner route:
https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/

No new public deployment is claimed by the documentation checkpoint.

## Unresolved

- deep, timestamped extraction of Live Show Episodes 0–4;
- exact URLs for Episodes 0/1/4 before citing them individually;
- creator modeling grammar: primitives, bevels, pivots/origins, part splitting, proportions, material workflow;
- planned environment tutorial is not yet confirmed published;
- all proposed metadata/schema fields remain proposals until separately accepted by their owners;
- no KayKit Rig Bench or Platformer interactive-donor bench is implemented here.

## Exactly one next gate

**KCL-A5 · Deep-watch KayKit Live Show Episodes 0–4 and append creator modeling grammar to the same living document.**

Focus on decisions that let KFB build or adapt KayKit-compatible objects without making Blender a required end-user skill:
- construction primitives;
- proportions;
- bevel/edge language;
- pivots/origins;
- part decomposition;
- material/atlas usage;
- variant policy;
- reusable recipes suitable for browser/tool automation.


## PR / branch review state

- Draft PR: **#107** — `https://github.com/georg-doc/kayfabizarro/pull/107`
- Head at PR creation: `2b7d70a6b6484f29f344e8f4e86e540ff570120d`
- Base: `main@a92e3c70029d811b76a88a15459adc20fea943bb`
- PR state: OPEN · DRAFT · UNMERGED
- Changed files at PR creation: **10**
- Commits at PR creation: **11**
- Additions/deletions at PR creation: **1567 / 0**

Changed files:
1. `kfb-hub/index.html`
2. `skills/chat/CHANGELOG.md`
3. `skills/chat/START_HERE.md`
4. `tools/game-dev-studio/CHANGELOG.md`
5. `tools/game-dev-studio/README.md`
6. `tools/game-dev-studio/RECOVERY.md`
7. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md`
8. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_RETURN.md`
9. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_SOURCE.json`
10. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`

Static documentation/wiring sanity: **9/9 PASS**.

No public Cloudflare deployment was performed for this branch. The existing Game Dev Studio route is not evidence for this revision.


## v0.2 return · animation timing / Mixed Bag source evidence

### Added in this continuation

Source:
`KayKit - Animations - Overview Set 1`
https://www.youtube.com/watch?v=T1KNCtAqJ7A

The video is treated as the visual animation-vocabulary source. State-machine/timeScale implementation lessons are synthesized with the first detailed Godot tutorial and current KFB/Three.js capabilities; current inventory truth comes from current sources, not the 2024 preview.

### Current source evidence

Re-synced during the turn to:
`main@3d9ac78bfabcec0c43fc453c124133764221139c`.

Verified:
- **139** current KayKit Rig_Medium motions / 8 sets;
- Walking_A/B/C + Running_A/B present;
- **no explicit Sprint clip** present;
- Jump_Start / Jump_Idle / Jump_Land present;
- current ranged aim/shoot/reload/bow/magic families present;
- Mixed Bag Registry shard: **47 assets = 41 GLTF + 6 PNG**;
- Mixed Bag source pin: `378b209355b13304e3cff656ec0806ca5b89df28`;
- current EyeRig authoring Hub/Registry/Handover and parallel uploaded Factory+UI file preserved when the branch was synced.

### New KFB synthesis

The living document now specifies:
- locomotion phase/foot-contact synchronization across gait transitions;
- measured speed ↔ playback-rate calibration;
- hysteresis between speed bands;
- short class-specific crossfades + optional temporary warp;
- physics-owned jump state with animation Start / Air / Land;
- phase-relative combat hit/release markers under timeScale;
- stance/equipment-aware locomotion;
- interaction/tool entry-loop-exit graphs;
- candidate `MotionClipProfile` / `MotionTransitionProfile`;
- a bounded measurement-only `Locomotion Sync Bench`.

### Tests / evidence

Static/source/current-main synchronization: **21/21 PASS**.

No runtime or animation-playback PASS is claimed:
- consumer/runtime changes: **0**;
- asset/animation binary changes: **0**;
- measured locomotion clips: **0** in this documentation slice;
- public browser deployment: **0 / NOT CLAIMED**;
- Georg motion acceptance: **OPEN**.

### PR state

- repository: `georg-doc/kayfabizarro`;
- branch: `chatgpt-web/kaykit-creator-learning-2026-09-19`;
- Draft PR: **#107**;
- branch was merged forward from current `main@3d9ac78bfabcec0c43fc453c124133764221139c` without merging PR #107 into main;
- after that sync, compare showed `behind_by = 0` and the intended **10-file** research/router diff.

### CURRENT NEXT GATE OVERRIDE

The previous KCL-A5 Live Show modeling deep-pass stays in research backlog.

The single current next gate is:

**KCL-M1 · Locomotion Sync Bench measurement pass**

Use one verified current `Rig_Medium` actor and only:
`Walking_A`, `Walking_B`, `Walking_C`, `Running_A`, `Running_B`.

Measure:
- left/right foot contacts;
- planted intervals;
- cycle duration;
- acceptable playback-rate range;
- reference translation/speed;
- naive reset transition vs phase-synced transition;
- optional crossfade warp.

Do **not** alter Travel/Race/Combat movement or invent a Sprint source in this gate.


## KCL-M1 implementation return

### Actual result

The first proposed motion gate is now implemented and technically proven:

`tools/game-dev-studio/research/kcl-m1-locomotion-sync/`

Created:
- `index.html`
- `bench.mjs`
- `SOURCE.json`
- `README.md`
- `TEST_REPORT.md`
- `MEASURED_PROFILE_CANDIDATE.json`

The bench loads the exact pinned current ActionFigure / Rig_Medium and exactly:
- Walking_A
- Walking_B
- Walking_C
- Running_A
- Running_B

It strips Root/Hips translation, measures real foot nodes across 240 intervals, derives contact/plant candidates and reference-speed/slip candidates, then compares:
- A · naive target phase 0
- B · matching-foot phase sync

with common crossfade, optional Three.js warp and speed→timeScale mapping.

### Evidence

Source/static: **20/20 PASS**.

Local browser after Repair Pass 1:
- run `35468444150`
- job `105964939873`
- **39/39 PASS**
- artifact `10591764219`
- digest `sha256:55b8cc47723a64fc9c633ad46e2008a446d666ba724d02fed6242c17354de75e`
- 5/5 real clips loaded and measured
- A/B transition executed
- 0 failed resources
- 0 page/console errors

Repair Pass 1 changed only proof-harness source-pin access. Motion code did not change.

### Measurement headline

Auto reference-speed candidates:
- Walking_C ≈ 0.447
- Walking_A ≈ 0.611
- Walking_B ≈ 0.751
- Running_A ≈ 2.480
- Running_B ≈ 0.284 — **AUTO_METRIC_AMBIGUOUS_HOLD**

`Running_B` is explicitly not assigned a semantic speed role because its automatic contact windows are fragmented and compensated-slip candidate is highest.

Persisted machine-readable evidence:
`kcl-m1-locomotion-sync/MEASURED_PROFILE_CANDIDATE.json`.

### Stage/public state

Stage source mirror exists at:

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

but **PUBLIC_VERIFIED is OPEN**.

KCL public run `35467428927` / job `105962230768` failed before bench boot because the Stage `SOURCE.json` returned the generic KFB HTML fallback throughout marker polling.

This is independently a repo-wide Cloudflare publication problem:
- pre-KCL TE-01 proof already failed its deployment marker;
- later Cloudflare Pages builds also failed.

Do not interpret this as a KCL animation failure.

### Ownership retained

- Asset Librarian / Registry: source truth
- ToolBox / Animation: authoring/calibration
- KCL-M1: research measurement / QA only
- Travel / Race / Combat / Platformer: movement, physics, gameplay state
- no new global mixer or locomotion owner

### Exactly one next gate

Restore one successful **current** Cloudflare/pages.dev deployment, rerun the unchanged KCL public proof, then Georg compares NAIVE vs PHASE SYNC visually.

No consumer integration, Sprint invention, or broader clip-family expansion before that human gate.


## Final synchronized handoff · 2026-09-20

Recovered after the interrupted sync and re-read current GitHub refs before writing.

### Exact Git state before this Return write

- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kaykit-creator-learning-2026-09-19`
- Draft PR: **#107**
- synced branch head: `4a52317f43469b2704c296bd2d1165fec27c6afc`
- current main base: `c95dd7f6cc03be8463cb4db7ffd7b85ac6cea1dd`
- compare: **47 commits ahead · 0 behind · 15 changed files**
- PR state: **OPEN · DRAFT · UNMERGED**
- PR diff at synced head: **+4050 / -0**
- KFB Hub blob is identical on main and branch: `ee3e546184819862ac9c8be9d586119f3ee5422b`

### Current KCL-M1 evidence

- source/static sanity: **20/20 PASS**
- real local browser/WebGL proof: **39/39 PASS**
- run: `35468444150`
- local-proof job: `105964939873`
- artifact: `10591764219`
- artifact digest: `sha256:55b8cc47723a64fc9c633ad46e2008a446d666ba724d02fed6242c17354de75e`
- scoped source clips: **5/5 loaded + measured**
- failed HTTP/resources: **0**
- page/console errors: **0**
- Repair Pass 1 affected proof-harness source metadata access only; motion code was unchanged.

Persisted measured candidate:
`research/kcl-m1-locomotion-sync/MEASURED_PROFILE_CANDIDATE.json`

Automatic reference-speed candidates:
- Walking_C ~0.447
- Walking_A ~0.611
- Walking_B ~0.751
- Running_A ~2.480
- Running_B ~0.284 — **AUTO_METRIC_AMBIGUOUS_HOLD**

These are measurement candidates, not approved consumer speeds.

### Public / Hub state

Hub now surfaces KCL-M1 as **LOCAL 39/39** and explicitly says public Stage is blocked by repo-wide Cloudflare deployment.

Intended fixed human route:

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

Current status:
- Stage source mirror: present in GitHub main
- Cloudflare/public proof: **FAILED / infrastructure layer**
- `PUBLIC_VERIFIED`: **NO**
- Georg motion acceptance: **OPEN**

The first KCL public job never booted the bench; its `SOURCE.json` request resolved to the generic KFB HTML fallback. Pre-KCL TE-01 and later Cloudflare builds showed the same publication-layer failure, so no KCL motion defect is inferred from that result.

### Owners retained

- Asset Librarian / Registry — canonical source truth
- ToolBox / FrankenStein / Animation — authoring + calibration
- KCL-M1 — research measurement / QA only
- Travel / Race / Combat / Platformer — movement, physics, gameplay state
- no second Registry
- no second global mixer
- no Godot dependency
- no Sprint source invented

### Exactly one next gate

Restore one successful **current** Cloudflare/pages.dev deployment without changing KCL motion logic; rerun the unchanged public KCL proof; then Georg compares **A · NAIVE** vs **B · PHASE SYNC** visually before any consumer integration.


## Public Stage recovery complete · 2026-09-20

This supersedes the earlier KCL public-blocker status.

### Root cause resolved

Cloudflare publication is sourced from `cloudflare-live`, not `main`.

The exact tested KCL Stage candidate was mirrored to:
`cloudflare-live@fac041eb34c9a284d724a3ee2b945bef7d020d04`

Cloudflare Pages deployment: **SUCCESS**.

No KCL motion, measurement, clip or transition logic changed for this repair.

### Public browser result

- workflow run: `35468444150`
- attempt: **2**
- public-proof job: `105981648314`
- result: **39/39 PASS**
- exact fixed pages.dev route opened
- 5/5 scoped clips loaded + measured
- WebGL + naive/phase-sync A/B executed
- movement owner preserved
- Registry read-only
- 0 failed HTTP/resources
- 0 page/console errors
- artifact: `10593933655`
- digest: `sha256:5d7f6bb436d0030a3ddec3f080e0a6b041fe196cdf36cd3d34d5f5d01f71c0cf`

Fixed Stage:
https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

### Current status

`PUBLIC_VERIFIED = YES`

`GEORG_MOTION_ACCEPTANCE = OPEN`

The machine measurements remain candidates, not approved consumer speeds.

### Exactly one next gate

Georg visually compares:
**A · NAIVE** vs **B · PHASE SYNC**.

Start with:
`Walking_A → Running_A · LEFT · fade 0.12 s · warp ON · speed-match ON`.

Judge foot sliding, double-step, hip pop, cadence and weight.

No consumer MotionProfile promotion before that human gate.


## Final public-verified handoff · 2026-09-20

### Git state before this Return write

- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kaykit-creator-learning-2026-09-19`
- synced branch head: `f3d955bd1ce9ec6d1bf121781422ee509e7b5836`
- base: `main@9b3c57ec09af8a9601a7221a84ee9a6de1e287f5`
- compare: **61 commits ahead · 0 behind · 15 changed files**
- Draft PR #107: **OPEN · DRAFT · UNMERGED**
- Hub blob identical on main/branch: `e7c8f9a57a91821e4cf2545cccf1b69b871e6a7e`

### KCL-M1 technical evidence

Local browser:
- **39/39 PASS**
- run `35468444150`, local job `105964939873`
- artifact `10591764219`
- digest `sha256:55b8cc47723a64fc9c633ad46e2008a446d666ba724d02fed6242c17354de75e`

Public browser:
- publication branch `cloudflare-live`
- KCL publication commit `fac041eb34c9a284d724a3ee2b945bef7d020d04`
- Cloudflare deploy: PASS
- run `35468444150`, attempt 2
- public job `105981648314`
- **39/39 PASS**
- artifact `10593933655`
- digest `sha256:5d7f6bb436d0030a3ddec3f080e0a6b041fe196cdf36cd3d34d5f5d01f71c0cf`
- 0 failed resources
- 0 page/console errors

Public Hub status:
- publication commit `3c1135bc5d24727a011735a4d4bf2ff707b1757c`
- Cloudflare deploy: PASS
- Hub marks KCL-M1 **PUBLIC 39/39**

### Fixed human Stage

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

### Current status

`PUBLIC_VERIFIED = YES`

`GEORG_MOTION_ACCEPTANCE = OPEN`

No consumer MotionProfile has been promoted. No Sprint source has been invented. Travel/Race/Combat/Platformer still own movement, physics and gameplay state.

### Exactly one next gate

Georg visually compares **A · NAIVE** vs **B · PHASE SYNC**.

Initial review:
- Walking_A → Running_A
- LEFT
- fade 0.12 s
- warp ON
- speed-match ON

Judge:
- planted-foot sliding;
- double-step;
- hip pop;
- cadence;
- perceived weight / naturalness.

Only after human acceptance should KCL-M2 define the first reusable consumer MotionProfile seam.
