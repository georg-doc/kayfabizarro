# FrizzleBob v5b · incorrect raw-GLB viewer FAIL and source-true pose/export route
**Date:** 2026-10-14 · **Severity:** FAIL, direct Georg review · **Source owner:** WS0 · **Receives:** WS1 actor slot (`ws1/r3f-frame`) / V-241 future ToolBox owner. No new V-number assigned by this audit.

## Human failure / do not promote
Georg reviewed an assistant-produced HTML viewer showing `FB_TEMPLATE_LOOK_v5b.glb` raw in bind/T-pose and rejected it: **“das ist NICHT mein FB v5!!! der hat noch nicht einmal das eye rig!!”**. The viewer was incorrectly presented as a usable current-FrizzleBob source and screenshot reference for Meshy. **This is a G0/G2 presentation failure, not a failed eye-rig source.** This bare GLB is only the structural body/armature donor, **NOT the complete V-240 FrizzleBob**. Retire `FrizzleBob_v5b_3D_Screenshot_Viewer.html` as a positive assembled-character reference. No replacement lookalike, generated eye spheres, fake rig, or independent second face implementation.

## Source truth, verified on GitHub
- `DECISIONS.md` V-240 supersedes old V-236: exact Georg-exported character recipe `replies/actors/frizzlebob.georg-2026-10-14.kfb-pets.json`, blob `aab8eeb0fb12555cd6da7a0dba0815fcbf1dd7b4`. Its `pets[0].source.glb` names `FB_TEMPLATE_LOOK_v5b.glb` @`23615cffb515d03d2b6a0164b896dd08e3bc1bed` (Git blob `24134a51793fef0dd8cab59bbf50b6b7c5960a45`), **but all live eye/lid/hair/brow/mouth/ear geometry and parameters are mounted by the face modules at runtime.**
- Existing **receiving actor implemented** in WS1 `ws1/kfb-planet/src/modules/faceMountActor.js`, `createFaceMountActor(options)` (exact script, not an inferred API), using the original `face-mount.v1`, `pet-eye-rig.v6`, `ear-dangle.v1`, `hair-tufts.v1`, old body model + exact export `src/data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json`. The same original actor is used by `#stage,actors=fb`.
- Actual **source-versus-receiver proof**: `ws1/proofs/2026-10-14-fb-v240/fb_georg_pair_front_q_side.png` (blob `6d22ebdff9e8b93a9cc1edf05bd09d4917dbd03a`): **ToolBox front | WS1 front, ToolBox ¾ | WS1 ¾, ToolBox side | WS1 side**. The pictured figure has the actual eye rig and a visible mouth. **It is the appropriate currently supported picture reference, not the raw GLB viewer.**
- Actual eye/lid source-behavior proof: `ws1/proofs/2026-10-14-fb-v240/fb_georg_blink.png` (blob `5f6222593ae5e9ca5ba7e810c1d030b743558e09`), open/closed lid views. Same code path/actor, **not a new eye-rig generator**.
- WS1 `WS1_STATUS.md` §17 records V-240 G2: 134 exact profile fields applied, source-pair luminance differences front `1.4/255`, ¾ `1.3/255`, side `0.8/255`, and cleanly mounted face. Technical evidence, NOT a fresh human G5 approval.
- WS1 `WS1_STATUS.md` §18 records the **base GLB is skinned, with 47 bones (23 Rig_Medium deform, 18 IK/control, 6 ear)**, and no embedded locomotion clips; corresponding external KFB Medium clips match the skeleton. An existing skin is therefore available; mounted facial parts and procedural motion are not automatically portable simply because the body GLB includes bones.

## One bounded correction to WS1 (no new runtime)
**Goal:** exact current Georg-configured FrizzleBob presented in full-body **bind/T-pose** with the real KFB eyes and face, source-backed front/¾/side images useful for Meshy clothing tests. Reuse the existing `createFaceMountActor` and original V-240 recipe 1:1. Existing `scripts/fb/donor-pair-p08.mjs`, `scripts/fb/r3f-views.mjs` and Stage `#actortest` are verified existing sources; first choose the shortest already working capture route.

**Procedure / acceptance:**
1. Source-isolate the **complete mounted actor** and wait for `ready` / `status().shown`; report exact model pin, recipe SHA, face module pins and pose label. Do NOT screenshot an undressed or pre-mount body.
2. Set **bind/T-pose** on the existing Rig_Medium armature, disable idle/motion and momentarily freeze life/emote only for identical screenshots; DO NOT disable the rig, eyes, pupils or eyelids. Confirm side/¾ eye socket, smile/mouth, ears and hair remain source-true.
3. Output neutral-background **full-body front, ¾ and side** at a consistent camera distance, with room for entire ears, feet and arm extremities. Show *at least one* eye open/closed/gaze proof and a **same-camera comparison with the actual approved ToolBox recipe**; state clearly that bind/T pose is a snapshot, not a new rig configuration.
4. **Only after actual source image parity** add a snapshot export experiment from the *assembled* Three.js actor, e.g. a `GLTFExporter` candidate retaining the existing SkinnedMesh/bone hierarchy where possible. Reimport and compare front/¾/side, skeleton names/weights, nodal attachments, materials, and clips. If procedural EyeRig/ear/mouth/brow animation cannot be preserved in GLB, report separately which channels require keyframe baking and do not claim an animation-ready export. FBX can be a later Blender import/export variant, not a rushed substitute or a new figure.
5. WS0 G3 verifies actual result before Georg; only then present screenshot/mockup for Meshy. No Cloudflare deployment is required merely to close this proof job.

## Do not confuse
- **GLB RAW** = body and original skeleton, not Georg's live face.
- **WS1 assembled actor** = original raw GLB + V-240 saved `kfb.pets/1` recipe + existing KFB_NATIVE face/eye/brow/mouth/hair/ear modules; this is the required source-true subject.
- **Rig export** = separate portability gate (body bones may survive; procedural expression and dangle need proven export/baking).
- **No new actor, no new face owner, no silently modified saved settings**, no generative lookalike, no unqualified screenshot.

**Single next gate:** `FRIZZLEBOB_V240_ASSEMBLED_BINDPOSE_SOURCE_PROOF` — assembled original WS1 actor, full-body multi-angle proof + eye close-up, then G3 decision about whether to authorize GLB/FBX export baking.
