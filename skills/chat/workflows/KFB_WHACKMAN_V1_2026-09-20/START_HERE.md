# KFB WhackMan v1 · START HERE

Status: **EXPLORATIVE CLAUDE DESIGN POC BRIEF · DUNGEON-FIRST · IMPLEMENTATION NOT STARTED**  
Date: 2026-09-20  
Spatial / authoring owner: **existing World Atlas / Dungeon Generator**  
Gameplay status: **candidate mini-game module, not a new universal runtime owner**  
Coordination: **KFB Modular Mini-Game Hub + WSA/Astra consolidation**

## Goal

Build one playable KFB 3D maze-chase level that reuses the existing Dungeon Generator and current KFB actor/rigging sources.

Primary experience:

`third-person character + free orbit camera + dungeon maze + pickups + several pursuers + temporary role reversal`

The first proof must add value to the existing Dungeon/World-Atlas authoring stack instead of becoming a disposable Pac-Man clone.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/session-entry-use-what-works_v1.md`
5. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
6. `skills/KFB Setup Game Design/kfb-frankensteining_v1.md`
7. `skills/kfb-cartoon-animation_v2.md`
8. `skills/chat/adapters/claude-design.md`
9. `CLAUDE_DESIGN_BRIEF.md`
10. `SOURCE_DONORS.json`

## Existing-tool correction

**Do not restart with asset measurement.**

World Atlas already contains the measured Dungeon model/catalogue, S13.2 generator and its probes/audits. S14/S21 already contains the in-place editor/recipe-patch proof. Registry/Asset Librarian already owns asset discovery.

Claude Design should consume those sources and build only the WhackMan-specific adapters:
- S13.2 recipe → WhackMan MazeGraph;
- existing actor sources → Player/Pursuer gameplay;
- LegacyFaceHost → existing EyeRig v6;
- pickups/state/AI/camera.

If Claude is currently remeasuring the whole Dungeon pack in a new WhackMan HTML, stop that branch of work and return to the existing S13 model/generator.

## Bounded result

Claude Design builds **one** editable/playable POC candidate and returns the full source/export.

Do not build:
- a procedural multi-theme generator first;
- a BlockBits/Voxel version first;
- an FPS/Doom mode first;
- Storytelling Map integration first;
- a second EyeRig;
- a second Dungeon generator.

Those are later consumers/skins after the first Dungeon maze proves the shared seams.

## Planned review route

`https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/whackman-v1/`

This route is a target only. Do not call it public/live until the exact Cloudflare revision is opened and verified.
