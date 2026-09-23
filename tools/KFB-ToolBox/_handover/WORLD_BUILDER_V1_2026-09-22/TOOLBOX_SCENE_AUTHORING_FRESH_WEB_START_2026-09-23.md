# Paste-ready · WorldBuilder as ToolBox Scene Builder · Fresh Web Chat · 2026-09-23

@GitHub

Continue the KFB WorldBuilder as a **ToolBox scene-building tool**, not as an isolated terrain demo.

Read current GitHub versions of:

1. `skills/session-entry-use-what-works_v1.md`
2. `skills/chat/START_HERE.md`
3. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
4. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
5. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
6. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`
7. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TOOLBOX_SCENE_AUTHORING_CORRECTION_2026-09-23.md`
8. `tools/resident_atlas/README.md`
9. `tools/resident_atlas/SCENE_STAGING_CONTRACT.md`
10. `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`

GitHub state wins.

## One task only

Build:

**WB1-TERRAIN-SCENE-01**

The first useful WorldBuilder must let Georg:

- generate/regenerate continuous procedural terrain;
- add one real source prop/landmark;
- add one real Resident Atlas actor;
- preview one already existing compatible idle/pose clip;
- select and place objects;
- move/rotate them;
- drop/snap them to terrain;
- save;
- reload;
- continue editing.

## Reuse

Terrain:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`

Scene editing:
existing KFB S21/S22 / Scene Patch interaction.

Characters:
Resident Atlas source/recipes. Show the chosen actor alone before integrating it.

Motion:
use an existing proven compatible clip. Do not create an animation system inside WorldBuilder.

The old `KFB Animation Lab v3` is donor evidence only until separately promoted. Current tested KayKit Motion Lab facts may be reused.

## Do not

- do not continue Sphere/Torus/Hex as macro terrain;
- do not build a second Resident Atlas;
- do not build a second Animation Lab;
- do not retarget or invent animations;
- do not copy actor/model bytes into the scene document;
- do not use Work;
- do not deploy Cloudflare in this iteration.

## Review

Return one zero-install:

`WB1_TERRAIN_SCENE_01_REVIEW.html`

Show source actor and source prop in isolation before the composed scene.

Commit the source first, read back the exact head, then create the review artifact.

STOP for Georg's feedback.

Later, after this gate works, use the same scene system for the Orc Band instead of building another one-off world.
