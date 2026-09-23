# RETURN · WorldBuilder → ToolBox Scene Authoring correction · 2026-09-23

## Result

WorldBuilder is now explicitly routed as the ToolBox scene-building surface.

Current first runtime target:

`WB1-TERRAIN-SCENE-01`

It combines:
- continuous procedural terrain;
- one real Resident Atlas actor;
- one real prop/landmark;
- one already existing compatible animation clip;
- scene placement;
- save/reload.

No new Resident Atlas or Animation Lab is created.

## Repository

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

Last metadata checkpoint before this Return:
`0efa1c8f2e77dd320be1befcb8c148f9d77950fe`

## Changed files

- `tools/KFB-ToolBox/_handover/FRIZZLEBOB_IDENTITY_MAP_2026-09-23.md`
- `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TOOLBOX_SCENE_AUTHORING_CORRECTION_2026-09-23.md`
- `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TOOLBOX_SCENE_AUTHORING_FRESH_WEB_START_2026-09-23.md`
- `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TOOLBOX_SCENE_AUTHORING_SOURCE_CHECK_2026-09-23.md`
- `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md`
- `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_FRESH_WEB_START.md`
- `tools/KFB-ToolBox/CHANGELOG.md`
- `skills/chat/START_HERE.md`
- `kfb-hub/index.html`
- this `RETURN.md`

## Source checks actually performed

1. Legacy Combat FrizzleBob checked in `georg-doc/KFB-Combat-Arena`: Kenney Platformer body + Pet-Studio face.
2. Current Driver Graft contract checked: separate current FrizzleBob actor.
3. Resident Atlas ownership/scene-staging contracts checked.
4. Animation Lab v3 Dropbox donor and current tested Motion Lab source checked.

Runtime/browser tests in this documentation slice:
**0**

No runtime code changed.

## Publication

Cloudflare:
**HOLD · NOT PUBLISHED**

There is no new public Stage route for this documentation-only slice.

The next implementation should return:
`WB1_TERRAIN_SCENE_01_REVIEW.html`
for zero-install review before any Stage publication.

## Unresolved

- Generic Animation Lab v3 remains donor evidence, not yet a promoted current tool.
- ToolBox source-lock work for the incorrect Claude actor build remains a separate Draft PR #185.
- The first WorldBuilder resident fixture should use a simple already-proven Resident Atlas actor/clip, not a difficult attachment case.

## One next gate

**WB1-TERRAIN-SCENE-01**

Build terrain + one real Resident Atlas actor + one existing compatible clip + one prop + save/reload, then STOP for Georg's HTML review.
