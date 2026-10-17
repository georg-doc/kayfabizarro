# Brief WSA work · ToolBox-Studio figure roster R1 (V-409) · 17.10.2026
**Tier 0:** figures only from their figure card (KFB eye rig + clay) · light only from the stage light module · a known failure means stop and report. **Your blocks:** [Figure] + [Georg-facing].

**Place:** the existing **ToolBox-Studio** (ToolBox with the Studio, Animation, Rigging and Motion tabs). Georg's term; "Figure workshop" in older briefs means the same thing. No new tool.

## Job: add three new characters, each through its figure card (`replies/FIGURES_R1/figures/<id>.figure.json`)
1. **Lord Hunky and Lady Dory, fixed r4** (alien TUNE V-353; content of Hub b61). The GLBs are on branch `assets/kfb-blender-run-r1-2026-10-16`: `media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/LordHunky_RigMedium.toolbox.r4.glb` and `LadyDory_RigMedium.toolbox.r4.glb`. They have a head without a neck, a visible collar, eye sockets, and the mouth swap. Add both to the Studio dropdown using the eye rig settings from the cards. **Georg tunes and saves** (V-317). The saved values go back into the card, and the status becomes approved.
2. **Norman** (V-380, Hub b71): through `norman.figure.json`; show "Source only" first, then the face candidate, with the tuning panel and copy button.
3. **Brain-Cyborg** (V-349): as soon as WSB delivers job **B10** (Blender: brain head in the Space Ranger collar, see below). Until then the dropdown entry is visibly "in progress". Do not build a substitute.

## Light and rendering in the Studio
Until the shared WS1 modules arrive (`kfb-stage-light.v1` + figure loader, V-392/V-409), the Studio may keep its own renderer for tuning, provided it follows the rules: no rim or back light, figure sheen ≤ 0.05, clay material, a warm character light from the front-top on the camera side. Switch over as soon as the modules are on GitHub.

## Return
Staging link, screenshots front/¾ with clay for each figure, Georg's saved values, and the updated cards. No live release without Georg.
