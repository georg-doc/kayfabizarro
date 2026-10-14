# KNOWN_ISSUES · answers to WS1 `ws1/asset-intake/frizzlebob-v5/TOOLBOX_FINDINGS_R1.md` (branch ws1/r3f-frame)
*Checked against this cut (Production-08, 14.10.2026). Nothing fixed here.*

| # | Status | Evidence in this version |
|---|---|---|
| A1 pose-rig vs T-pose | **confirmed** | Studio and Rigging run `_studioBones(rt, dt)` every frame: the active pose profile (pose-rig.v1) when it is on, otherwise the default idle (FB: KayKit stock Idle_A). There is no »bind pose« switch, so ToolBox images never show the GLB's T-pose. This is also the »wrong base pose« Georg noticed on 14.10. |
| A2 v5 / v5b under one id | **confirmed** | The id `frizzlebob-earrig-v5` loads v5b @23615cff (ACTORS.md). Export: `variant: 'earrig-v5'`, `source.glb` v5b. |
| A3 settings only in localStorage | **confirmed** (key now `kfb-toolbox-production-08`) | Not fixed in code. This cut carries Georg's export as a file: `data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-14.json`. |
| A4 acceptance without entry snapshot | **confirmed** | `eyeSocketAcceptance` writes `window.__kfbSockAcc = { rows, socket, hinge }`, eyesLids02 writes `__kfbLidAcc`, the level fix writes `__kfbLvlAcc`. None contains the actor entry. Not re-run in this cut. |
| A5 brows covered at dy 0.21 | **confirmed, value now known** | Georg's entry: `original.brows` scale 0.99 · spread −0.028 · **lift 0.242** · depth −0.056 · tilt −8 · yaw 16 · sx 1.21. Replaces WS1's estimate of 0.18. |
| A6 unpinned network sources | **confirmed** | pet-mouth.v1 @8922d4b1 sets `MOUTH_BASE` (+ FEMALE_, RED_) to `raw…/main/media/3D_Assets/Textures/…`. Local pet-library.v6 sets `PET_BASE` to main. Hair donor and models are pinned. |
| A7 painted mouth in ¾ | **not re-checked in this cut** | Georg's FB uses `parts.mouth: 'original'` (model mouth, decals on the model mesh), not the painted rig mouth. MOUTH-FIT-01 is not ported to v5. No ¾ check was run for this cut. |
| A8 two eyeoval versions | **confirmed** | P08 loads the face chain at @8922d4b1 (eyeoval.v1 without `pupilSeatDelta`) and was not changed. |
| A9 lid mechanism unclear | **resolved by Georg's decision 14.10.** | FB v5 runs with **EyeRig shells**: `clayLids.on: false`, EyeRig lids u −0.07 · l −0.4 · s 0. Clay lids (hinge, slide, flap, skin) stay as options. The final lid comes from Blender (handover/BLENDER_BRIEF_FB_LIDS_A_2026-10-14.md). |
| A10 lip track on setTimeout | **confirmed** | `_lipRun` / `lipStop` use setTimeout/clearTimeout. The voice path has a 380 ms fallback timer. |
| A11 ink canon loaded with model brows | **not re-measured, no action** | P08 code unchanged since WS1 checked it. |
| A12 three 0.160 vs 0.186.1 | **confirmed** (ToolBox on 0.160.0) | Import map pinned to unpkg three@0.160.0. |

## Additional, found while cutting (not in WS1's list)
- **A13 · stale export label.** `meta.exportedBy` reads »KFB ToolBox Production-02 · Rigging« in P08.
- **A13b · `partColors` is not exported.** The brow/nose colour of model parts (added 14.10.) is saved in the workspace but is neither written to kfb.pets/1 nor read on import.
- **A14 · Standalone build does not start** without a server (known since 01.10.). The WSA port should start from the .dc.html + support.js.
- **A15 · Owner overlap.** `clay-lids.v1.js` is an EyeRig lid owner next to the EyeRig Workbench (KFB_ACTIVE_WORK_MAP: no parallel EyeRig owner). Decide before the port.
- **A16 · Acceptance runs check hinge/slide only.** There is no skin/flap acceptance. Check 7 (lid edge sharpness) and editor checks E1–E9 were not re-run.
