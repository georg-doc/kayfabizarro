# AN-PROFILE-01 · Motion Profile Enrichment

Status: **IMPLEMENTED CANDIDATE · METADATA ONLY · CI PENDING**  
Date: 2026-09-24  
Owner: **KFB ToolBox / shared motion metadata**

## Goal

Create one reusable measured motion-profile layer consumed by ToolBox Animation Studio / Animation Lab v2 and WorldBuilder without creating another animation runtime.

## Source / branch

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/an-profile-01-motion-profile-enrichment-2026-09-24`

Stacked source owner:
PR #197 · `claude/motion-library-01-2026-09-24@bf0eace2332a48f0b220318ad7567c68cc6dfbad`

Research/profile evidence:
- PR #107 · KCL-M1 creator/KayKit locomotion measurements;
- PR #127 · ToolBox KayKit Motion Lab rig/actor profile measurements;
- PR #197 · current 33-clip KFB Motion Library catalogue and retargeted GLBs.

Raw FBX remain private in Dropbox.

## Protected boundary

AN-PROFILE-01 does **not**:
- create a mixer or second animation runtime;
- own ToolBox actor animation state;
- own WorldBuilder world position, pathing, collision, physics or gameplay state;
- copy Rig_Medium contacts onto Rig_Large;
- infer contact/release/impact from filenames;
- promote the KayKit stock playback clamp into a per-clip rate window for the new library;
- modify or repack the two PR #197 GLB libraries.

## Reusable layer

Source catalogue:
`media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`

Companion profile catalogue:
`media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.profile-catalog.v1.json`

Read-only accessor:
`media/3D_Assets/Animations/KFB_Motion_Library/motion-profile-reader.v1.js`

Consumer contract:
`media/3D_Assets/Animations/KFB_Motion_Library/AN_PROFILE_01_CONSUMER_CONTRACT.md`

## Facts enriched

Where evidence exists:
- measured foot-contact windows;
- phase/seconds planted intervals derived from those measured windows;
- root/in-place/travel behavior;
- travel distance per cycle;
- cycle-average reference speed derived from measured travel distance and duration;
- state family;
- gait/direction/stance tags when explicitly supported;
- explicit action marker `endsOnTop` for the climb-to-top clip.

Explicitly unknown:
- Rig_Large foot-contact windows;
- hand contacts;
- per-library-clip acceptable playback-rate windows;
- contact/release/impact/recovery action markers without direct evidence;
- any stance/gait semantic not supported by source evidence.

Older KayKit stock locomotion measurements remain available under `referenceProfiles` as **REFERENCE_ONLY**.

## Evidence

Deterministic exact-branch validation:
**1603 / 1603 PASS · 0 FAIL**

Repository-native Node validator:
prepared at `source/test_an_profile_01.mjs`.

GitHub Actions:
workflow added, first query returned 0 runs; therefore **CI_PENDING**, not CI_PASS.

Browser / Cloudflare:
0 by design for this metadata checkpoint.

## Stage route

Named future Stage route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/motion-profile-catalogue/`

Current status:
**HOLD · NOT PUBLISHED · NOT PUBLIC_VERIFIED**

Per Georg's instruction, this slice does not wait on Cloudflare.

## Done when

The metadata candidate is complete when:
1. all 33 current library clips have a profile entry;
2. every populated measured/derived field traces to current source evidence;
3. unknown markers remain unknown;
4. the same layer is documented for both ToolBox Animation Studio and WorldBuilder;
5. deterministic validation is green;
6. Return/changelog/Hub routing is current.

## One next gate

After repository CI is available, integrate the shared reader into the actual current ToolBox Animation Studio / Animation Lab v2 catalogue browser first, without adding or changing animation ownership.
