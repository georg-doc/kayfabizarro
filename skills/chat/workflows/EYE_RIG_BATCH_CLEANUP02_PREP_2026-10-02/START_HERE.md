# EYE-RIG-BATCH-CLEANUP02-01 · Start Here

Status: **PREPARED · NOT INTEGRATED · NO PUBLICATION CLAIM**  
Date: 2026-10-02  
Owner: **KFB ToolBox / Rigging**  
Consumers: **Resident Atlas · KFB Combat Arena**  
Branch: `chatgpt-web/eye-rig-cleanup02-consumer-prep-2026-10-02`

## Goal

Prepare the verified EYE-CLEANUP-02 KayKit derivatives as one source-pinned intake for the **existing** Batch EyeRig owner, then make that same approved profile layer consumable by Resident Atlas and Combat without creating a second face/runtime owner.

## Exact sources

- Cleanup candidate: `georg-doc/kayfabizarro@1820a1c034e9741acedb4d8ba3118cbd1fc776ba`
- Cleanup Return/data/contact sheet: `skills/chat/workflows/EYE_CLEANUP_02_2026-10-02/`
- NoEyes GLBs: `skills/chat/workflows/EYE_CLEANUP_01_2026-10-01/glb/`
- Existing EyeRig owner: Draft PR **#104**, `toolbox/eye-rig-batch-2026-09-18@e277c3456651d314a01adea046e0105d2a12cdd1`
- Eye implementation: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
- Brow implementation: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js` · blob `ccc91a7f48adbf999ed33ca1708bbe5d1c738d0f`

GitHub state wins over chat summaries.

## Cleanup intake

EYE-CLEANUP-02 reports **26 done · 5 none · 0 blocked**, with **31 entries** because Action Figure Head B is separate.

`done` means only: the NoEyes derivative and anchor evidence are available. It does **not** mean the EyeRig profile is visually approved.

Special human-decision cases remain explicit:

- Skeleton Warrior / Rogue / Mage: NoEyes removes the separate glowing-eye mesh and therefore its `Glow` material. Do not silently choose this over the original.
- Prototype Pete: raised eye bumps were removed although the brief expected `none`.
- Action Figure / Head B: texture cleanup, with a faint old-oval edge possible.
- Legacy Orc A/B: unskinned head-node anchors.
- Creepy: intentional asymmetric eye anchors.
- Avian: genuine side-eye normals.
- Lorekeeper / Protagonist_A: glasses remain.

## Eyebrows · binding direction

**Source brows stay.** Eye cleanup must preserve brows wherever present.

Later controllable brows reuse the existing `BrowRig` from `brow-rig.v2.js`:

- anchor: existing public `eyeFrame()` seam;
- independent left/right tilt and bend;
- height / x / y / lift / follow;
- length / thickness / taper / mask;
- symmetric or asymmetric construction;
- existing brow expression presets;
- existing export schema `kfb.brow-experiment/0.2`.

This slice does **not** invent a second brow system and does **not** mutate `kfb.eye-profile/0.1-candidate`. Brow state remains a companion export until an actual consumer proof warrants a broader contract.

Activation guard: source brows are preserved now for reversibility. When `BrowRig` is enabled later, the authored/source brow must be hidden or masked **non-destructively per actor**; when BrowRig is disabled, the source brow remains visible. Do not pre-delete brows during Eye-Cleanup/EyeRig intake.

## Consumer boundaries

**ToolBox** calibrates and approves EyeRig/BrowRig presentation profiles.

**Resident Atlas** keeps cast/recipe/scene ownership. `data/cast.js` is deliberately untouched here because EYE-CLEANUP-02 did not resolve its actors through that file. Before any later recipe edit, pin the current Atlas source and show the actual NoEyes donor in isolation.

**Combat Arena** keeps movement, AI, targeting, damage, lifecycle and rewards. Approved eye/brow presentation can be consumed later, but this prep does not alter Combat. Skeleton Warrior requires an explicit decision because the cleanup changes its glowing-eye presentation.

## Required donor-first gate

For any actor before integration:

`pinned source → actual NoEyes object in isolation → Front + 3/4 against contact sheet → EyeRig v6 profile → motion check → human approval → consumer reference`

A loaded URL is not donor proof.

## Stage

Existing EyeRig Stage route:

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/

No new Stage revision is deployed or claimed by this preparation slice.

## Done when

This preparation slice is done when:

1. all 31 cleanup entries are normalized into one exact-source manifest;
2. the 26/5/0 counts and special exceptions validate;
3. BrowRig v2 is pinned as the future riggable eyebrow layer;
4. ToolBox / Resident Atlas / Combat owner boundaries are explicit;
5. Return and test evidence are persisted;
6. no consumer runtime, merge or Live promotion has occurred.

Exactly one next gate after this prep: **ToolBox loads the pinned cleanup candidate set into the existing Batch EyeRig workbench and performs source-isolation + EyeRig profile review, starting with ordinary Rig_Medium actors and keeping the four special human-decision actors quarantined.**
