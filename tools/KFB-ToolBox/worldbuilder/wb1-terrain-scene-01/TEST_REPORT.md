# WB1-TERRAIN-SCENE-01 · Test report · 2026-09-23

Status: **R1 HUMAN FEEDBACK REPAIR · LOCAL REVIEW CANDIDATE · NOT PUBLIC**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`  
Draft PR: **#186**

## Candidate files

- canonical source: `WB1_TERRAIN_SCENE_01_SOURCE.html`
- zero-install review copy: `WB1_TERRAIN_SCENE_01_REVIEW.html`
- verified source blob: `a0ae15e822ef8283abafcf84483498814b1be3b8`
- review-sync commit before this report update: `f3dfe50f4832ef7c2f36833cf983a699f6811fc0`
- review blob: `dd6379815295adf07bdf0132210e1f7e6c9a3b49`

## Reused owners / donors

### Terrain
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` · MIT.

Bounded reuse from:
- `src/engine/terrain/noise/cpuNoise.js`
- `src/engine/terrain/noise/seedDomain.js`

The candidate reuses the deterministic value-noise / FBM / bounded seed-domain mechanism. It does not import the donor's whole product runtime or UI.

### Scene editing
Existing KFB S21/S22 interaction donor:
`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/KayKit_Room_Study_S21.html`

Reused seam:
- Three.js `TransformControls`;
- click selection;
- translation / rotation;
- snap;
- drop to ground/terrain;
- localStorage save/reload.

### Resident / animation
Resident Atlas fixture:
`tools/resident_atlas/scenes/caveman-cave-camp.json`

Exact actor:
`media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb`
@ `891eadf01e218f5fc21387e64cea1fec8332c5b6`

Exact source texture declared by the Resident Atlas:
`media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/caveman_texture.png`
@ `891eadf01e218f5fc21387e64cea1fec8332c5b6`

Exact clip:
`Melee_Unarmed_Idle` from
`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb`
@ `aa16a777a970f23d3f11fb3c23dc40718b04fa88`

Exact prop:
`media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_3_E_Color1.gltf`
@ `891eadf01e218f5fc21387e64cea1fec8332c5b6`

## Human review findings and R1 repair

Georg's first visual pass found three concrete issues:

1. Caveman geometry loaded but the character texture was missing. Georg also identified this as a recurring ChatGPT-attached HTML preview problem.
2. The Character's green Y-axis handle did not move the actor vertically, while other transform handles/objects worked.
3. The control palette/sidebar overlaid the 3D field of view in the narrow ChatGPT preview.

Repairs in the canonical source:

- explicit source texture binding now consumes the existing Resident Atlas `caveman_texture.png`; the review tries `fetch → Blob → createImageBitmap → THREE.Texture` first and falls back to `TextureLoader`; no replacement material or new texture was invented;
- actor/prop roots use one-shot ground-on-spawn only; the TransformControls change handler and animation loop no longer force the Character root back to terrain Y; `Drop to terrain` remains the explicit grounding action;
- saved numeric Y is respected on reload; the embedded self-test now checks Character Y edit + Character Y reload;
- the narrow responsive layout now reserves a separate grid row for the palette instead of positioning it absolutely over the canvas.

Global review-host note:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/CHATGPT_HTML_TEXTURE_PREVIEW_LIMITATION_2026-09-23.md`

## Human R1 re-review · texture result

Georg opened the repaired ChatGPT-attached R1 HTML and confirmed:

**TEXTURE_VISIBLE_IN_CHAT_ATTACHMENT · PASS**

This human result validates the review-host texture adapter for this WB1 artifact. It does **not** prove a universal ChatGPT renderer root cause and does not change the Resident Atlas/source asset.

Remaining R1 human checks:
1. Character green Y handle moves vertically without snapping back;
2. palette/control area does not cover the 3D field of view;
3. save/reload preserves the authored Character Y after those checks.

## Tests actually run after R1 repair

### Source static + repair contract
**26/26 PASS**

Checks include:
- source and review module syntax;
- source/review runtime parity and current source-blob marker;
- exact Caveman texture path + persisted resident texture reference;
- fetch/ImageBitmap lane + TextureLoader fallback;
- sRGB + glTF `flipY = false` texture setup;
- one-shot initial terrain grounding;
- no Character auto-drop in Gizmo changes;
- no Character auto-drop in the animation loop;
- explicit `Drop to terrain` retained;
- terrain regenerate still deliberately snaps scene objects to regenerated terrain;
- Character Y edit and Character Y reload assertions present;
- narrow layout reserves space for controls and removes the old absolute sidebar overlay;
- exact donor pins, MIT notice and reference-only scene document retained.

### Exact pinned donor/source path checks
**4/4 PASS**

- Caveman actor exists at the pinned asset commit.
- Boulder prop exists at the pinned asset commit.
- Rig_Medium CombatMelee animation file exists at the pinned animation commit.
- `caveman_texture.png` exists at the pinned asset commit (10,870 bytes).

### Review-copy integrity
**5/5 PASS**

- source module parses;
- review module parses;
- review runtime is byte-equivalent to Source after removing only the review title/comment;
- review marker points to current Source blob `a0ae15e822ef8283abafcf84483498814b1be3b8`;
- review remains explicitly local/not-public.

### Embedded browser self-test

The repaired HTML contains **15 assertions** including explicit texture binding, Character Y authoring and Character Y save/reload.

Executed in this connector-only session: **0/15**.
## Browser / visual evidence

Automated browser runtime tests: **0**.  
Screenshots: **0**.

Reason: this gate deliberately does not publish to Cloudflare, and the current session could not materialize the connector-backed GitHub HTML through its raw-download endpoint into the local Chromium environment. The embedded `?selftest=1` browser harness therefore remains **prepared but not executed**.

No browser PASS, visual PASS, or live/public claim is made.

## Human review order

1. Open `WB1_TERRAIN_SCENE_01_REVIEW.html`.
2. Confirm **Source actor** shows the real textured Caveman and existing `Melee_Unarmed_Idle`.
3. Confirm **Source prop** shows the real Boulder source object.
4. Enter **Scene editor** only after both isolated sources loaded.
5. Regenerate terrain.
6. Select the Character and confirm the green Y handle moves it vertically without snapping back; test prop transforms as well.
7. Confirm the palette/control area does not cover the 3D field of view.
8. Use `Drop to terrain`, then Save.
9. Change X/Y/Z or rotation.
10. Reload saved and confirm the edited Character Y is restored.
11. Continue editing.

## Human R1 re-review · PASS

Georg accepted the repaired local HTML candidate:

- Caveman texture: **PASS**;
- Character green Y transform: **PASS**;
- Character Y save/reload: **PASS**;
- palette / field-of-view layout: **PASS**.

Human result: **WB1-TERRAIN-SCENE-01 R1 FUNCTIONAL FOUNDATION ACCEPTED**.

Next requested slice: replace the local WorldBuilder transform UI with the newer shared Dungeon/Resident inline 3D Edit Layer donor (object-attached mini-menu including move / rotate / scale / drop / world-local / close), while preserving the accepted terrain, texture and persistence foundation.
## Shared Inline 3D Editor · R2 candidate

After the accepted R1 functional foundation, WorldBuilder now consumes the promoted shared ToolBox edit layer instead of owning a second local TransformControls/picking implementation.

Exact promoted module:
`tools/KFB-ToolBox/lib/edit-layer.js`

Exact Git blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

This is byte-identical to the existing Resident Atlas S7 / Rig-Werkstatt donor, itself extracted from Dungeon Room Study S21/S22. No reimplementation was introduced.

WorldBuilder adapter now exposes the S7 object-attached mini-menu:

- ✥ move;
- ⟳ rotate;
- ⤢ scale;
- ⬓ drop to visible surface below;
- ⊹ world/local axes;
- ✕ close selection;
- shared snap: 0.05 units / 15°.

Scale is now part of the WorldBuilder scene transform and survives save/reload.

### Static / integration contract
**32/32 PASS**

Checks cover:
- exact shared donor blob;
- canonical Source and bundled Review module syntax;
- Review normalization back to canonical Source;
- current Source/edit-layer markers;
- one-gizmo donor contract;
- pointerup selection with 4 px drag threshold;
- visible-only picking;
- all six mini-menu controls;
- shared drop path;
- world/local gizmo-space toggle;
- scale load / persistence / reload assertion;
- removal of the old local TransformControls owner, local ray picker and obsolete side-button handlers;
- editor disabled in source-object views and enabled in Scene Editor;
- object-attached menu follows camera;
- close-selection state sync;
- embedded self-test expanded to **20 assertions**.

### Exact pinned runtime source paths
**4/4 PASS**

- Caveman actor;
- Boulder prop;
- Rig_Medium CombatMelee animation file;
- `caveman_texture.png`.

### Shared module identity
**1/1 PASS** — promoted ToolBox file is byte-identical to donor blob `c97b3537…`.

### Browser / visual
Embedded browser self-test: **20 assertions prepared / 0 executed** in this connector-only gate.

Automated browser runtime tests: **0**.  
Screenshots: **0**.

No browser PASS or human mini-menu PASS is claimed yet.

### Current human gate

Open the new shared-editor review and verify:

1. click Caveman / Boulder → compact menu appears at the object;
2. ✥ move;
3. ⟳ rotate;
4. ⤢ scale;
5. ⬓ drop;
6. ⊹ toggles world/local axes;
7. ✕ clears selection;
8. Save → change transform → Reload restores position / rotation / scale.
## Publication

Cloudflare: **HOLD · NOT PUBLISHED**.  
No Stage or Live route is claimed by this report.

## Next gate

**Georg human HTML review of WB1-TERRAIN-SCENE-01.**

Do not start Claude Design, Orc Band integration, Sphere/Torus macro terrain, a second Resident Atlas, or Animation-Lab promotion before this human gate.
