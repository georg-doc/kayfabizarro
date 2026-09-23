# WB1-TERRAIN-SCENE-01 · test/evidence report · 2026-09-23

Status: **STATIC CONTRACT GATE PASS · 12/12 · HUMAN HTML REVIEW PENDING**

## Exact candidate

Repository: `georg-doc/kayfabizarro`

Branch: `chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

Draft PR: `#186`

Source implementation commit:
`0d1af21943756aa89044673697ce6a81dbea8673`

Source:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/WB1_TERRAIN_SCENE_01_SOURCE.html`

Source blob:
`ff0df7f88d596526a19271a18031c1301b36afe6`

Review artifact commit:
`b57e7c73023396bed5184771a1b927d7f05e0450`

Review:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/WB1_TERRAIN_SCENE_01_REVIEW.html`

Review blob:
`c9c4eaf433472a9f14ebb1f435d978e97c1c7306`

The review file declares the exact source blob above. It is a review copy of the same runtime, not a second WorldBuilder owner.

## Source proof

Actor:
- Resident Atlas `caveman`
- exact source `media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb`
- asset commit `891eadf01e218f5fc21387e64cea1fec8332c5b6`
- rig family `Rig_Medium`

Existing compatible clip:
- `Melee_Unarmed_Idle`
- `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb`
- animation commit `aa16a777a970f23d3f11fb3c23dc40718b04fa88`

Prop / landmark:
- `Rock_3_E_Color1.gltf`
- exact source `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_3_E_Color1.gltf`
- asset commit `891eadf01e218f5fc21387e64cea1fec8332c5b6`

Terrain donor:
- `ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`
- MIT
- bounded reuse from `src/engine/terrain/noise/cpuNoise.js` and `seedDomain.js`

## Executed static contract checks

1. PASS · review declares exact source blob lineage.
2. PASS · actor is shown in isolation and readiness is set only after successful load.
3. PASS · prop is shown in isolation and readiness is set only after successful load.
4. PASS · composed Scene Editor cannot open until both source proofs loaded.
5. PASS · exact Caveman source + pinned asset commit present.
6. PASS · existing `Rig_Medium` / `Melee_Unarmed_Idle` source + pinned animation commit present.
7. PASS · real source-backed prop path present.
8. PASS · pinned MIT ProceduralTerrains donor + exact bounded noise source paths present.
9. PASS · continuous procedural terrain generation + regeneration controls present.
10. PASS · selection + move + rotate + snap/drop seam present through Three.js TransformControls.
11. PASS · save/reload continuation is wired through localStorage.
12. PASS · scene document stores source references/transforms; no embedded model/octet-stream data URI found.

Static result:
**12/12 PASS**

## Runtime / human evidence boundary

The HTML includes its own `?selftest=1` browser self-test, but that browser self-test has **not** been executed in this chat tool environment.

Human visual acceptance is also **pending**.

Therefore this report does **not** claim:
- browser-runtime PASS;
- visual PASS;
- Cloudflare publication;
- Live promotion.

## Known edge to inspect during review

Current fixture rotations are yaw-only and the repaired Caveman grounding follows its parent/terrain world height.

For arbitrary pitch/roll, `dropRoot()` currently places the object root at the sampled terrain height rather than re-solving the transformed object's precise lower world-space bound. That is not a blocker for the present yaw-only fixture, but it should be checked if Georg uses pitch/roll during this review.

## Gate

**STOP for Georg's HTML review.**

No Cloudflare publication in this iteration.
