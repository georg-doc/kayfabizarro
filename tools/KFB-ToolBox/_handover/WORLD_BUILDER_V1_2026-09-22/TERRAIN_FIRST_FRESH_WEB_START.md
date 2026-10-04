# Paste-ready · WorldBuilder Terrain-First Scene Editor · Fresh Web Chat

@GitHub

Read current GitHub versions of:

1. `skills/session-entry-use-what-works_v1.md`
2. `skills/chat/START_HERE.md`
3. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
4. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
5. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
6. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`
7. current WorldBuilder / Scene Patch / S21-S22 source-object editor donors
8. current `ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` README + relevant engine/editor files.

GitHub state overrides chat memory.

## Direction reset

Do NOT continue WB1-P2R1.

WB1-P2 remains research evidence only.

Do NOT make visible Hex geometry the macro world surface.

The primary WorldBuilder surface is now:

**continuous procedural terrain**

Hex is optional local/semantic content placed into/on the terrain.

## Use what works

Primary terrain/editor donor:
`ZyFou/ProceduralTerrains` · MIT.

Reuse/adapt the smallest real working terrain/editor mechanisms rather than reimplementing them from prose.

Reuse the existing KFB S21/S22 / Scene Patch / source-object transform interaction for scene editing.

## One slice only

Build **WB1-TERRAIN-EDITOR-01**:

- one procedural continuous terrain;
- seed + minimal terrain controls;
- one authoring camera;
- small real source-object picker;
- place;
- select;
- move;
- rotate;
- scale;
- drop/snap to terrain;
- save/reload;
- one Hero Landmark;
- one small prop group;
- optional one Hex object only as placed content;
- accepted P1 Environment Profile reference.

No:
- Sphere/Torus;
- Hex macro-world;
- full OSM;
- infinite world;
- voxel world;
- gameplay;
- new transform/editor system;
- Work/WSA.

First prove the reused terrain source/mechanism and reused Scene Editor donor in isolation, then connect the seam.

Human gate:

Georg can generate terrain, place/edit a real object, save/reload and continue editing.

## Review transport

Do **not** deploy this iteration to Cloudflare.

After the first useful implementation checkpoint:

1. commit the exact source to the named GitHub branch;
2. fetch/read back the exact head;
3. generate one zero-install `WB1_TERRAIN_EDITOR_01_REVIEW.html` from that exact head;
4. bundle/in-line JS/CSS so Georg does not need Python, Terminal, Node, GitHub Desktop or a local server;
5. use only pinned remote asset URLs where binary assets are needed;
6. return the HTML artifact directly in chat;
7. wait for Georg's visual/product feedback.

After feedback, repair the branch and regenerate the HTML artifact.

Cloudflare/Hub publication happens only after Georg says the candidate is worth a public milestone.

Return the GitHub head + the generated HTML review artifact and STOP.
