# RETURN · WB1-TERRAIN-SCENE-01 · uniform scale R3 · 2026-09-23

Status: **R1 FUNCTIONAL FOUNDATION HUMAN PASS · R2 SHARED EDITOR HUMAN PASS · R3 UNIFORM-SCALE HUMAN REVIEW PENDING**

## Accepted state

Georg has accepted:
- Caveman source texture in Chat HTML;
- Character Y editing;
- Character Y Save/Reload;
- non-overlay palette/FOV;
- shared object-attached inline editor;
- Move;
- Rotate;
- free Scale gizmo;
- Drop / Absetzen;
- World / Local axes;
- Close;
- position / rotation / scale Save/Reload roundtrip.

Human result: **WB1 SHARED INLINE EDITOR R2 ACCEPTED**.

## Current R3 request

Add a simple global uniform-size gesture so a source prop can become a quick size variant, e.g. Boulder → small rock / pebble or larger rock, without removing the accepted free Scale gizmo.

## Repository

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

Draft PR:
`#186`

Verified pre-Return branch head after implementation, evidence, proposal, changelog, routers, Hub and PR metadata:
`033a4a8aea6bcf580862dd51af12f7469aa97dba`

The exact final head after this Return write is read back and reported in chat.

PR state:
- draft: yes;
- merged: no;
- auto-merge: not enabled.

## Shared edit-layer owner

Module:
`tools/KFB-ToolBox/lib/edit-layer.js`

Accepted R2 base blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

Current R3 candidate blob:
`c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`

Lineage:
`Dungeon Room Study S21/S22 → Resident Atlas S7 → ToolBox shared module → WorldBuilder`

R3 shared extension:
- `scaleBy(factor)`;
- smaller `×0.8`;
- larger `×1.25`;
- inverse defaults;
- clamp `0.05 … 20`;
- existing proportions preserved;
- free TransformControls Scale mode preserved.

Owner boundary remains unchanged: the shared layer owns selected-object authoring gestures only. It does not own terrain, assets, movement, runtime collision or host persistence.

## WorldBuilder R3 presentation

Six top-level mini-menu fields remain:
1. ✥ Move
2. ⟳ Rotate
3. grouped `− / +` uniform size
4. ⬓ Drop
5. ⊹ World / Local
6. ✕ Close

Keyboard `S` keeps the accepted free Scale gizmo.

WorldBuilder already persisted `transform.scale` in R2, so R3 adds no new scene schema.

## Proposal

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/SHARED_EDITOR_UNIFORM_SCALE_PROPOSAL_2026-09-23.md`

Proposal intent:
- validate the simple size gesture first in accepted WorldBuilder;
- after Georg PASS, treat smaller/larger as a normal shared ToolBox edit-layer capability;
- do not fork separate scale math per host;
- hosts may override factor/clamp only for measured reasons.

## Current candidate files / blobs

Canonical Source:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/WB1_TERRAIN_SCENE_01_SOURCE.html`

Source blob:
`d550d5bf8ce93dbcc17b4687dbda1afcb4f3a223`

Standalone Chat Review:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/WB1_TERRAIN_SCENE_01_REVIEW.html`

Review blob:
`f07fc23dcbd3525be7dd6d8c2e0b1b93799a313a`

Shared edit layer:
`c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`

## Evidence actually recorded

R1 human functional findings:
**4/4 PASS**.

R2 shared inline editor:
**GEORG HUMAN PASS**.

R3 static / integration:
**26/26 PASS**.

Exact pinned actor / prop / animation / texture paths:
**4/4 PASS**.

Shared edit-layer syntax:
**1/1 PASS**.

Embedded browser self-test:
**22 assertions prepared / 0 executed**.

Automated browser runtime:
**0**.

Screenshots:
**0**.

No R3 browser PASS or human uniform-scale PASS is claimed.

Canonical test report:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/TEST_REPORT.md`

## Metadata updated

- `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json` — accepted R2 base and R3 candidate separated;
- `tools/KFB-ToolBox/START_HERE.md` — shared editor R3 routed;
- `tools/KFB-ToolBox/CHANGELOG.md` — additive R2 PASS → R3 entry;
- WorldBuilder `START_HERE.md` — R3 current gate;
- central `skills/chat/START_HERE.md` — R3 route;
- `kfb-hub/index.html` — R2 accepted / R3 size gate / Claude HOLD;
- Draft PR #186 body — R3 proposal/evidence.

## Publication

Cloudflare:
**HOLD · NOT PUBLISHED for this iteration**

Direct Stage URL:
**none**

Live:
**not promoted**

Merge:
**not requested**

## Exactly one next gate

**Georg human review of WorldBuilder R3 uniform size:**

select Boulder → press `−` repeatedly to make a small rock/pebble → press `+` to enlarge → confirm `S` free Scale still works → Save → change size → Reload → verify saved size returns.

After PASS, the uniform smaller/larger gesture may be promoted as a normal shared ToolBox mini-editor capability. Until then, rollout to other hosts remains proposal-only.
