# Motion2MixamoRig · KFB offline motion donor intake · 2026-10-14

Status: RESEARCH ONLY · PARKED / RETRIEVABLE · NOT TESTED · NOT AN IMPLEMENTATION ORDER.
Owner: KFB Animation / KayKit Motion Library. Existing branch: `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`, Draft PR #344.
Donor: https://github.com/MaxLiu22/Motion2MixamoRig (main, version 0.1.0, Apache-2.0 code).
Purpose: retain external source and explicit later gate; never lose this lead between new Wireface/Resident/Triplet slices.

## Verified upstream capability
A single full-body human video -> GVHMR human skeleton -> Mixamo rotations -> animated skinned GLB, skeleton_motion.npz, run.json and video comparisons. Photo mode yields **static pose** and orbit preview, not video motion. Blender 4.2+ sidebar calls external Python 3.10+ and imports generated GLB. Can reuse extracted skeleton on another Mixamo rig without new inference. Weights ~5 GB on first use. Sources: upstream README and blender_extension/README.md, checked 2026-10-14. Issue #2 'The upper torso issues' open on inspection; torso/arm performance unverified.

## KFB fit and strict boundaries
USE CASE: optional OFFLINE motion-authoring donor for resident acting, gesture, dance, band, wrestling, Triplet scenelets; complement body acting for speaking Wireface characters.
NOT a lip-sync, face, eye, viseme or TTS solution. It MUST NOT displace accepted EyeRig v6, FrankenStein FaceHost, Composer face driver, KFB ChatterBox dialogue, Audio owner or create new runtime.
KFB animation priority: native KayKit Character Animations 1.1 (accepted Medium walk Walking_B, run Running_A, sprint Running_B) -> existing accepted KFB Motion Library (33 clips each on Rig_Medium and Rig_Large) -> new imported donor only for **documented acting gap**.
Existing KFB baseline: media/3D_Assets/Animations/KFB_Motion_Library/RETURN.md (33 clips/rig, 23 bones; existing Mixamo Blender retarget/bake source under source/); skills/kfb-cartoon-animation/references/kfb-integration-current-ssot.md. Never assume direct skeletal compatibility with KayKit because Motion2MixamoRig expects Mixamo-rigged FBX; demonstrate mapping.

## Provenance / license holds
Repository code Apache-2.0 does NOT grant commercial rights to SMPL-X model (default non-commercial), GVHMR/research weights, or source footage. Separate written rights verification required before any commercial KFB motion generated with these assets. Do not upload raw source FBX or restricted model/weights. Mixamo FBX distribution constraints remain binding. No model download, Blender job, body retarget, screenshots, QA, Site or Stage took place in this research intake.

## Retrieval hooks
Tags: Motion2MixamoRig, GVHMR, SMPL-X, Blender extension, Mixamo, KayKit, resident acting, Body Motion, Wireface, KFB Triplet, FrankenStein Composer, Asset Librarian, KFB Motion Library.
Future Animation / Wireface slice planning MUST consult this file as an OPTIONAL donor if authored body acting is actually missing, but it is **NONBLOCKING** for the current Wireface face/voice and Triplet work.
No current Composer PR #355, ChatterBox Voice PR #379 or Audio PR #365 changes authorized by this intake.

## One conditional next gate
`MOTION2MIXAMORIG_KAYKIT_OFFLINE_DONOR_PROBE_R1` — only when body-acting gap is demonstrated and rights gate is resolved:
- Record a licensed ten-second one-person full-body acting gesture.
- Isolate original upstream Mixamo GLB and extracted motion in Blender, show unaltered source motion first.
- Retarget using **existing** KFB Motion Library/Blender process to Mannequin_Medium (then optional FrizzleBob/GothGirl).
- Compare against closest accepted native/motion-library clip, test shoulder/torso/hand/foot errors and root translation.
- Bake separate reversible clip and inspect in actual KFB character with existing EyeRig + Wireface mouth and single Audio owner if the face pipeline is already accepted.
- Report exact upstream commit + KFB source/branch, license provenance, rendered evidence and measured results; human creative KEEP/TUNE/CUT only on real evidence.

Research checkpoint only. No Stage or GPT Site required; do not promote Live/merge or request a new KFB runtime owner.
