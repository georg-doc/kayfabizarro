# Briefing WSA work · Aliens r4 + Orc into the ToolBox (replaces the asset part of b34/b47)

WS0 → WSA work · 16.10.2026 · V-353. Integration only – no mesh changes, no runtime mesh hacks (V-336). Report in German, new branch, no merge.

## Assets (all on branch `assets/kfb-blender-run-r1-2026-10-16` @6ecf8577)
- `media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/LordHunky_RigMedium.toolbox.r4.glb` + `lordhunky-headpart-r4.ws0-2026-10-16.kfb-pets.json`
- `.../LadyDory_RigMedium.toolbox.r4.glb` + `ladydory-headpart-r4.ws0-2026-10-16.kfb-pets.json`
- `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.kfb-eyes.r1.glb` (original eyes as switchable nodes `KFB_OriginalEye_L/R`, KFB eye anchors `KFB_Eye_L/R_anchor`)
- Proofs and reports: `media/3D_Assets/MeshyModels/blender_run_r2/` (r4) and `blender_run_r1/`.
- Use r4, not r1/r2/r3. The r4 heads sit on the suit's grey neck collar (no extra neck), rigid on `head_part`; head-part IBMs were re-baked so the mouth decal lands on the face. Georg: TUNE accepted.

## What to do
1. Replace the two alien dropdown figures with r4 (same entries 'Lord Hunky · Space Ranger', 'Lady Dory · Space Ranger'); load tunables defaults from the r4 recipes (headScale, headOffset, neckTaper, seat block).
2. **Eyes:** baked socket shell stays visible (V-332); lids = EyeRig v6 lid shells inside the socket for now (the new E2 closed lid skin comes later as a hull on EyeRig v6, V-348 – do not build lids yourself).
3. **Dangle:** side from `dangle.parts[].side` (V-332); stiffness per part from the recipe.
4. **Mouths (swapped, V-346):** default Lady Dory = set B (full lips), Lord Hunky = set A. Mouth dropdown from `media/3D_Assets/Textures/KFB-Mouth-Sets_R3/mouth_sets.manifest.json` (branch `assets/kfb-mouth-sets-r3-2026-10-16` @eb1100f9): every figure can pick every set (also future ones via manifest), tint for tintable sets, saved in the recipe (`mouth.set`, `mouth.tint`).
5. **Orc Brute:** new dropdown entry using `OrcBrute.kfb-eyes.r1.glb`; original eyes hidden by default, KFB EyeRig on the new anchors; keep his mesh mouth and teeth (no decal mouth by default, but the mouth dropdown may offer decal sets); no FrizzleBob hair.
6. **Clay look:** all three show the KFB clay material in the ToolBox (Georg: always clay for figures, V-346).

## Acceptance (lean, V-312)
G1 r4 heads on the collar, no gap at rest and in Idle_A; G2 mouths on the face, Dory full lips / Hunky plain by default, dropdown lists all manifest sets; G3 stalks/antennae symmetric at rest, dangle with recipe sides; G4 Orc: KFB eyes, mesh mouth + teeth intact, no hair; G5 FB and KayKit figures unchanged. Diff + one short browser run + front/3/4 screenshots per figure with clay.
