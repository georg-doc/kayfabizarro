# RETURN · WB1-TERRAIN-SCENE-01 · shared inline editor R2 · 2026-09-23

Status: **R1 FUNCTIONAL FOUNDATION · GEORG HUMAN PASS · R2 SHARED EDITOR HUMAN REVIEW PENDING**

## Result

R1 is accepted by Georg:
- Caveman texture: PASS;
- Character green Y transform: PASS;
- Character Y save/reload: PASS;
- palette/FOV layout: PASS.

WorldBuilder has now advanced to the requested newer inline editor without replacing terrain, Resident Atlas, animation or scene-document ownership.

## Repository

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

Draft PR:
`#186`

Verified pre-Return branch head after implementation, evidence, changelog, routers, Hub and PR metadata:
`68c65c37a6d621adc6c0f999b3be6e43986d1c5a`

The exact final head after this Return write is read back and reported in chat.

PR state:
- draft: yes;
- merged: no;
- auto-merge: not enabled;
- changed files before this Return refresh: 20.

## Shared inline editor owner

Promoted ToolBox module:
`tools/KFB-ToolBox/lib/edit-layer.js`

Exact promoted Git blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

That blob is byte-identical to the existing Resident Atlas S7 / Rig-Werkstatt donor. Its lineage is:

`Dungeon Room Study S21/S22 → Resident Atlas S7 second integration/extraction → ToolBox third-host promotion → WorldBuilder`

The donor Housekeeping explicitly marked `lib/edit-layer.js` as the ToolBox candidate for the third integration. No second local TransformControls/picking owner was created.

Current mini-menu:
- ✥ move;
- ⟳ rotate;
- ⤢ scale;
- ⬓ drop to the visible surface below;
- ⊹ world/local axes;
- ✕ clear selection;
- snap: 0.05 units / 15°.

One shared TransformControls instance remains the editor owner.

## WorldBuilder adapter

Canonical Source:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/WB1_TERRAIN_SCENE_01_SOURCE.html`

Source blob:
`0114d186759866f42bdc99a6d4bc662494701c50`

Standalone Chat review:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/WB1_TERRAIN_SCENE_01_REVIEW.html`

Review blob:
`099de70c7c57bfe17fc77ef80af7f4b5941aa452`

The canonical Source imports the promoted ToolBox module. The zero-install Review embeds that exact module blob and normalizes back to the canonical Source.

WorldBuilder still owns only:
- terrain settings;
- source references;
- authored object transforms;
- scene Save/Reload document.

Scale is now persisted alongside position and rotation.

## Preserved exact runtime sources

Terrain:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` · MIT

Resident:
`Caveman.glb@891eadf01e218f5fc21387e64cea1fec8332c5b6` · Rig_Medium

Texture:
`caveman_texture.png@891eadf01e218f5fc21387e64cea1fec8332c5b6`

Animation:
`Rig_Medium_CombatMelee.glb@aa16a777a970f23d3f11fb3c23dc40718b04fa88 · Melee_Unarmed_Idle`

Prop:
`Rock_3_E_Color1.gltf@891eadf01e218f5fc21387e64cea1fec8332c5b6`

## Tests / evidence actually recorded

R1 human review:
**4/4 requested human findings PASS**.

R2 shared-editor static/integration contract:
**32/32 PASS**.

Exact pinned actor/prop/animation/texture paths:
**4/4 PASS**.

Promoted shared-module identity:
**1/1 PASS** — ToolBox module blob equals donor blob `c97b3537…`.

Embedded browser self-test:
**20 assertions prepared / 0 executed**.

Automated browser runtime tests:
**0**.

Screenshots:
**0**.

No browser PASS and no R2 mini-menu human PASS are claimed.

Canonical evidence:
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/TEST_REPORT.md`

## Metadata updated in the same handoff

- `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json` — shared module registered;
- `tools/KFB-ToolBox/START_HERE.md` — shared layer routed;
- `tools/KFB-ToolBox/CHANGELOG.md` — additive R1 PASS → R2 entry;
- `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md` — R2 current gate;
- `skills/chat/START_HERE.md` — central router;
- `kfb-hub/index.html` — R2 review + Claude HOLD cards;
- Draft PR #186 body — R2 status/evidence.

## Publication

Cloudflare:
**HOLD · NOT PUBLISHED for this iteration**

Direct Stage URL:
**none**

Live:
**not promoted**

Human acceptance surface:
the chat-delivered standalone `WB1_TERRAIN_SCENE_01_REVIEW.html`.

## Unresolved

- R2 mini-menu has not yet been human-reviewed;
- embedded 20-assertion browser self-test has not been executed in this connector-only session;
- broader WorldBuilder asset palette / environment / Claude Design work remains outside this gate;
- Orc Band integration remains later.

## Exactly one next gate

**Georg human review of the shared inline-editor R2 Chat HTML:**

select Caveman and Boulder → verify object-attached menu → Move / Rotate / Scale / Drop / World-Local / Close → Save → change transform → Reload → verify position / rotation / scale restored.

STOP there. No merge, Cloudflare promotion, Live promotion, Claude Design or Orc Band integration before this human result.
