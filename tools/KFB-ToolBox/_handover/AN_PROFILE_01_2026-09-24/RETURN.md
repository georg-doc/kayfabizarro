# RETURN · AN-PROFILE-01 · Motion Profile Enrichment

Date: 2026-09-24  
Status: **IMPLEMENTED CANDIDATE · DRAFT PR · METADATA VALIDATED · FINAL-HEAD CI CHECK PENDING**

## Repository / branch / PR

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/an-profile-01-motion-profile-enrichment-2026-09-24`

Draft PR:
**#206**  
https://github.com/georg-doc/kayfabizarro/pull/206

Stacked base:
`claude/motion-library-01-2026-09-24` · Motion Library PR #197

Source-owner head:
`bf0eace2332a48f0b220318ad7567c68cc6dfbad`

Handoff head immediately before this Return write:
`e6e6200ce485574483b9582b8d52f3721c2ae046`

The exact final branch head must be read back after this Return commit; do not substitute the pre-Return head for the final handoff head.

## Outcome

AN-PROFILE-01 now supplies **one reusable additive companion profile layer** for the current 33-clip Motion Library.

It is shared by:
- ToolBox Animation Studio / Animation Lab v2;
- WorldBuilder.

It does not create another animation runtime, mixer, movement owner or persistence schema.

## Implemented

### Shared profile catalogue

`media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.profile-catalog.v1.json`

Schema:
`kfb.motion-profile-catalog/1.0`

Coverage:
**33 / 33 current Motion Library clips**

Populated where source evidence exists:
- measured Rig_Medium foot-contact windows;
- phase/seconds planted intervals derived from measured contact windows;
- duration/fps/frame count;
- loop state;
- root/in-place/travel behavior;
- travel distance and direction;
- cycle-average reference speed derived from measured travel / duration;
- state family;
- explicit gait/direction/stance tags where supported;
- explicit `endsOnTop` climb marker.

Kept unknown:
- Rig_Large foot contacts;
- hand contacts;
- per-clip acceptable playback-rate windows for the retargeted library;
- unmeasured contact/release/impact/recovery action markers;
- stance/gait semantics without direct evidence.

### Reference-only prior measurements

PR #107 and PR #127 KayKit stock locomotion measurements are retained under `referenceProfiles` as **REFERENCE_ONLY**.

They are not silently promoted into the 33 retargeted clips.

### Read-only consumer accessor

`motion-profile-reader.v1.js`

Provides catalogue lookup, reference speed, planted intervals, action-marker lookup and reference-profile access.

It contains no `AnimationMixer` and owns no playback/movement/gameplay state.

### Consumer contract

`AN_PROFILE_01_CONSUMER_CONTRACT.md`

ToolBox and WorldBuilder are pointed at the same metadata source; consumer-local copies are explicitly rejected.

## Source evidence

- PR #107 · KCL creator/KayKit locomotion measurements.
- PR #127 · ToolBox KayKit Motion Lab.
- PR #197 · KFB Motion Library 01.
- Dropbox raw archive checked read-only for `Climbing To Top.fbx`; raw FBX remain private and were not copied or mutated.

## Actual tests / evidence

### Exact-branch deterministic validation

**1603 / 1603 PASS · 0 FAIL**

Checks cover:
- exact 33/33 source/profile id match;
- measured-field preservation;
- planted interval bounds;
- travel reference-speed arithmetic;
- unknown-marker guards;
- cross-rig contact guard;
- rate-window non-inheritance;
- explicit action/stance evidence;
- read-only consumer-accessor contract.

### KFB Hub source

Inline JavaScript syntax:
**1 / 1 PASS**

AN-PROFILE-01 card:
present.

### Repository-native Node validator

Prepared:
`source/test_an_profile_01.mjs`

Local container execution:
**0 assertions executed · ENVIRONMENT BLOCKED before Node start**

Observed materialization error:
`curl: (6) Could not resolve host: raw.githubusercontent.com`

This is not counted as PASS or FAIL.

### GitHub Actions

Workflow:
`.github/workflows/an-profile-01.yml`

Observed run:
`36030451044`

Status at the earlier checkpoint:
`in_progress`

Therefore this Return does **not** claim `CI_PASS`.
The exact final head is checked after the Return commit.

### Browser / screenshots

Browser runtime tests:
**0 by design**

Screenshots:
**0 by design**

Reason:
no visible runtime/UI behavior was changed; this slice is metadata + consumer contract only.

## Changed files

Before this Return: 12 files. With this Return: 13 files.

1. `.github/workflows/an-profile-01.yml`
2. `kfb-hub/index.html`
3. `media/3D_Assets/Animations/KFB_Motion_Library/AN_PROFILE_01_CONSUMER_CONTRACT.md`
4. `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.profile-catalog.v1.json`
5. `media/3D_Assets/Animations/KFB_Motion_Library/motion-profile-reader.v1.js`
6. `media/3D_Assets/Animations/KFB_Motion_Library/source/test_an_profile_01.mjs`
7. `skills/chat/START_HERE.md`
8. `tools/KFB-ToolBox/CHANGELOG.md`
9. `tools/KFB-ToolBox/_handover/AN_PROFILE_01_2026-09-24/SOURCE.json`
10. `tools/KFB-ToolBox/_handover/AN_PROFILE_01_2026-09-24/START_HERE.md`
11. `tools/KFB-ToolBox/_handover/AN_PROFILE_01_2026-09-24/TEST_REPORT.md`
12. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md`
13. `tools/KFB-ToolBox/_handover/AN_PROFILE_01_2026-09-24/RETURN.md`

## Routing / Hub

Updated additively:
- ToolBox `CHANGELOG.md`;
- central `skills/chat/START_HERE.md`;
- KFB Hub source;
- current Animation Intake 01 handoff.

The router and Hub updates were built from their current `main` versions at write time to avoid regressing newer parallel work.

No merge or Live promotion was performed.

## Stage

Named route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/motion-profile-catalogue/`

Status:
**HOLD · NOT PUBLISHED · NOT PUBLIC_VERIFIED**

This is a named future acceptance route only. It was not opened or claimed live. Per Georg's instruction, this slice does not wait on Cloudflare.

## Unresolved / intentionally unknown

- final-head GitHub Actions result must be read after this Return commit;
- PR #206 is stacked on PR #197 and should not be merged independently into main without resolving the parent;
- actual ToolBox Animation Studio / Animation Lab v2 reader integration is not part of AN-PROFILE-01;
- WorldBuilder runtime integration is not part of AN-PROFILE-01;
- Rig_Large contacts, hand contacts, per-clip rate windows and unmeasured action markers remain unknown by design.

## Exactly one next gate

**ToolBox Animation Studio / Animation Lab v2 catalogue consumption**

Load the existing Motion Library catalogue + AN-PROFILE companion through the read-only reader, expose measured/unknown facts in the current catalogue browser, and preserve the existing ToolBox mixer/actor owners.

WorldBuilder consumes the same proven layer only after that first consumer seam is verified.
