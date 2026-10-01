# M2M-KFB-RETARGET-P0 · Start Here

Status: ACTIVE DONOR COMPATIBILITY PROOF
Date: 2026-10-01
Owner: KFB ToolBox / motion authoring
Repository: georg-doc/kayfabizarro
Branch: chatgpt-web/m2m-kfb-retarget-p0-2026-10-01
Base: 1c9c9706764ce41ce1282f60e358195afed207e5
Stage: NONE — no human Stage until an actual retarget/export candidate exists.

## Outcome

Decide whether Mesh2Motion can serve as an animation-intake / retarget / clip-preview donor in front of existing KFB motion consumers.

It must NOT replace:
- KFB Motion Lab / KCL locomotion timing and phase-sync ownership;
- Resident Atlas animation/scene ownership;
- Combat Player / AnimationMixer / gameplay owners;
- FrizzleBob face / eye / ear owners;
- KayKit source rigs or source animation libraries.

## Donor pin

Mesh2Motion/mesh2motion-app
- commit: 79f3f61a9852ef70234a5a4a7c13ed87f7a71833
- rig-human.glb blob: 832a222a611bd0ee9112c64145a3a49df9b89b3e
- code: MIT
- 3D models / rigs / animations: CC0 per donor LICENSE files

## KFB control

GothGirl / Rig_Medium is the P0 control because its KFB ground truth already exists.

Exact KFB base:
- GothGirl.glb: media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb
- blob: b56f67e4ddb7db95ff54fef526148a49289f3915
- size: 323724 B
- 23 bones / 6 meshes / 0 embedded clips
- prior KFB evidence: 55/55 source clips bound

Animation control:
- Rig_Medium_General.glb blob 5d16cb6815fc8371705147188813f851c10ba26a
- Rig_Medium_MovementBasic.glb blob 98e965e886ec539e80f8984a77a29b0c1c02e5e5

## Source-isolation result before CI

Actual GLB hierarchy analysis against the donor mapping grammar gives:
- 19 / 23 KayKit target bones mapped = 82.6%;
- root / hips / spine / chest / head covered;
- both arm chains through wrist covered;
- both leg chains through foot + toe/ball covered;
- only hand.l/r and handslot.l/r remain unmapped.

The hand result is not yet classified as a defect. Mesh2Motion hand_l/r maps to KayKit wrist.l/r, and the rest-pose distances support that anatomy:
- M2M lowerarm_l -> hand_l ≈ 0.279788
- KayKit lowerarm.l -> wrist.l ≈ 0.260044
- KayKit wrist.l -> hand.l ≈ 0.073826

Thus KayKit hand + handslot remain downstream descendants of the mapped wrist chain.

Classification so far:
STRUCTURAL_COMPATIBILITY_PASS / VISUAL_RETARGET_OPEN

## Current gate

Run a repository-native CI test that:
1. checks out the exact Mesh2Motion donor pin;
2. reads the exact KFB GothGirl and Rig_Medium General GLBs;
3. invokes Mesh2Motion's own BoneChainResolver + BoneAutoMapper;
4. verifies the expected 19/23 map and the wrist/hand seam;
5. invokes HumanChainConfig and verifies the effective core retarget chains.

Only after that PASS:
- run one actual browser retarget/export on GothGirl;
- inspect the exported GLB in the existing KFB motion consumer;
- then consider FrizzleBob v5b and Rig_Large.

No Stage, merge or Live promotion in this gate.
