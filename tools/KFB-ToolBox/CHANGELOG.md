# KFB ToolBox · additives Changelog

Alte Einträge bleiben unverändert. Korrekturen als neue CORRECTION/SUPERSEDES-Einträge mit Bezug ergänzen. Aktuelle Momentaufnahme im MASTERPLAN/Return, Geschichte hier.


## 2026-09-25 · WorldBuilder WB2 HUMAN PASS

### HUMAN ACCEPTANCE
Georg accepted the current WB2 Terrain Sculpt R1 interaction:
- Raise / Lower terrain shaping;
- Radius / Strength;
- wheel / touchpad Brush Radius;
- hold-Space temporary Orbit;
- `1 / 2 / 3` quick Object/Orbit / Raise / Lower modes;
- Undo / Clear;
- Save / Reload;
- return to the accepted object-edit workflow.

Result:
**WB2-TERRAIN-SCULPT-01 · GEORG HUMAN PASS**

### FUNCTIONAL FOUNDATION
Accepted functional foundation now includes:
- WB1 terrain + Resident scene;
- shared inline object editor R2;
- WB2 non-destructive Terrain Sculpt;
- wheel/Space/quick-mode authoring gestures.

R3 uniform `−/+` Size remains optional/non-blocking.

### NEXT
The existing Claude Design handoff is now unblocked.

Exactly one next WorldBuilder gate:
**Claude Design authoring/UI refinement on the accepted WB2 source.**

Primary UX direction:
- reduce/collapse redundant side-panel editor copy/controls;
- keep object transforms inline at the selected object;
- keep Terrain Sculpt compact and scene-level;
- maximize 3D FOV;
- compose accepted WorldDesign look/environment controls;
- preserve terrain/edit/persistence owners.

Smooth / Flatten / material painting remain later functional slices.


## 2026-09-25 · WorldBuilder WB2 authoring interaction R1

### HUMAN REQUEST
Georg requested two faster authoring gestures on the accepted WB2 terrain-sculpt candidate:
- mouse wheel / touchpad scroll changes Brush Radius while sculpting;
- faster switching between Orbit and Raise/Lower.

### IMPLEMENTATION
The WB2 Source/Review now add:
- wheel/touchpad Radius adjustment only while Raise/Lower is active;
- logarithmic radius scaling with clamp `0.45 … 5`;
- Orbit/Object mode keeps normal OrbitControls wheel zoom;
- hold `Space` = temporary Orbit while retaining the active Raise/Lower mode;
- releasing `Space` resumes that sculpt mode immediately;
- `1 / 2 / 3` = Object/Orbit / Raise / Lower;
- existing shared-object `R` Rotate and `S` free Scale shortcuts remain unchanged.

No new editor owner or second picker was introduced.

### EVIDENCE
- existing sculpt math/geometry: **24/24 PASS**;
- current Source/Review contract: **56/56 PASS**;
- focused interaction contract: **31/31 PASS**;
- exact runtime sources: **4/4 PASS**;
- embedded browser self-test: **34 prepared / 0 executed**;
- automated browser runtime: **0**;
- screenshots: **0**.

### NEXT
Georg reviews wheel/touchpad radius, hold-Space temporary Orbit and `1/2/3` mode switching in the Chat HTML together with the existing terrain-shape gate.


## 2026-09-23 · WorldBuilder WB2 Terrain Sculpt · local review candidate

### IMPLEMENTATION
Started a new stacked WorldBuilder slice on Draft PR #190 without modifying the accepted WB1 files.

New files:
- `worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js`;
- `WB2_TERRAIN_SCULPT_01_SOURCE.html`;
- `WB2_TERRAIN_SCULPT_01_REVIEW.html`;
- `TEST_REPORT.md`;
- dedicated WB2 Return.

WB2 adds non-destructive continuous-heightfield authoring:
- Raise / Lower;
- Radius / Strength;
- visible brush footprint;
- drag strokes;
- true C2 falloff;
- Undo / Clear;
- sculpt-stroke Save/Reload;
- normal recompute.

### OWNERS
The seeded procedural terrain remains the base. Sculpting is an additive WorldBuilder terrain layer.

Selected-object editing remains owned by:
`tools/KFB-ToolBox/lib/edit-layer.js`

No voxel/hex/CSG/marching-cubes terrain and no second object picker were introduced.

### PRE-REVIEW CORRECTIONS
- corrected brush-center distance;
- isolated sculpt pointer ownership with `stopImmediatePropagation()`;
- upgraded falloff to a true quintic C2 boundary.

### EVIDENCE
- sculpt math + geometry: **24/24 PASS**;
- Source + Review contract: **33/33 PASS**;
- exact pinned runtime sources: **4/4 PASS**;
- embedded browser self-test: **28 prepared / 0 executed**;
- automated browser runtime: **0**;
- screenshots: **0**.

### PUBLICATION
Cloudflare remains **HOLD · NOT PUBLISHED**.

### NEXT
Georg reviews the exact WB2 Chat HTML for hill/depression shape, Radius/Strength, artifact-free edges, Undo/Clear, Save/Reload and return to Object edit.


## 2026-09-23 · WorldBuilder accepted foundation → WB2 Terrain Sculpt planning

### REPRIORITIZATION
Georg explicitly moved the next functional gate to **WB2-TERRAIN-SCULPT-01** after accepting the current WB1 foundation. R3 uniform `−/+` size remains optional/non-blocking and may be reviewed/promoted separately.


### HUMAN DIRECTION
Georg confirms the current WB1 scene-authoring foundation works and is acceptable.

The shared inline editor remains the selected-object owner. Do not fork another WorldBuilder transform layer. Current shared module:
`tools/KFB-ToolBox/lib/edit-layer.js`

R2 accepted capabilities already include free Scale. R3 remains the separate small candidate for uniform `−/+ Size`.

### UI FOLLOW-UP
Later authoring UX may collapse/reduce side-panel scene-edit explanation/controls because Move/Rotate/Scale/Drop are owned by the object-attached inline menu. Preserve FOV and keep only genuinely scene-level controls.

### WB2 PROPOSAL
Added:
`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/WB2_TERRAIN_SCULPTING_PROPOSAL_2026-09-23.md`

First terrain sculpt gate:
- continuous heightfield only;
- Raise / Lower;
- radius / strength;
- smooth radial falloff;
- drag strokes;
- Undo / Clear;
- Save / Reload;
- normal recompute;
- no voxel / hex / tile terrain;
- procedural base remains reversible;
- coexist with shared `edit-layer.js`, no second picker.

### WSA
The WB2 proposal is routed into the WSA/Lead check-in as future-sprint intake. Runtime implementation remains Web-first and starts after the current R3 gate or explicit reprioritization.

### NEXT
**WB2-TERRAIN-SCULPT-01** is current. Build an isolated Raise/Lower heightfield brush proof on a new bounded branch and return one Chat HTML. R3 uniform size remains optional/non-blocking.


## 2026-09-23 · Shared Inline Editor · R2 HUMAN PASS → R3 Uniform Scale Proposal

### HUMAN PASS
Georg accepted the WorldBuilder shared-editor R2 integration as working well:
- object-attached mini-menu;
- Move / Rotate;
- free Scale gizmo;
- Drop / Absetzen;
- World / Local;
- Close;
- Save/Reload transform roundtrip.

Result: **WB1 SHARED INLINE EDITOR R2 ACCEPTED**.

### REQUESTED GLOBAL EXTENSION
Georg requested a simple uniform-size gesture so a source prop can quickly become a size variant, e.g. Boulder → small rock / pebble, without losing the existing free Scale gizmo.

### SHARED-LAYER R3
`tools/KFB-ToolBox/lib/edit-layer.js` now adds:
- `scaleBy(factor)`;
- smaller default `×0.8`;
- larger default `×1.25`;
- inverse default factors;
- default clamp `0.05 … 20`;
- existing non-uniform proportions preserved;
- accepted free Scale TransformControls mode unchanged.

Accepted R2 base blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

R3 candidate blob:
`c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`

### WORLDBUILDER R3
The object menu keeps six top-level fields by grouping `−/+` as one Scale field:
`Move · Rotate · −/+ Size · Drop · World/Local · Close`

`S` remains the free Scale gizmo. Scale persistence is unchanged.

Proposal:
`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/SHARED_EDITOR_UNIFORM_SCALE_PROPOSAL_2026-09-23.md`

### EVIDENCE
- R3 static/integration: **26/26 PASS**;
- pinned runtime sources: **4/4 PASS**;
- shared edit-layer syntax: **1/1 PASS**;
- embedded browser self-test: **22 assertions prepared / 0 executed**;
- automated browser runtime: **0**;
- screenshots: **0**.

### NEXT
Georg reviews the WorldBuilder R3 Chat HTML specifically for `−/+` uniform size, repeated scaling, retained free `S` Scale and Save/Reload. General rollout to other ToolBox hosts remains proposal-only until that result.
## 2026-09-23 · WB1-TERRAIN-SCENE-01 · R1 HUMAN PASS → shared inline editor R2

### HUMAN PASS
Georg accepted the repaired R1 functional foundation in the ChatGPT review:
- Caveman texture: PASS;
- Character green Y transform: PASS;
- Character Y save/reload: PASS;
- palette/FOV layout: PASS.

### DONOR RESOLUTION
The requested newer editor already existed as a mature shared donor:
- Dungeon Room Study S21/S22 defined the object-attached mini-menu contract;
- Resident Atlas S7 / Rig-Werkstatt was the second real integration and extracted `lib/edit-layer.js`;
- its Housekeeping explicitly marked that file as a ToolBox candidate for the third integration.

WorldBuilder is that third host.

### PROMOTION
Promoted the existing S7 module byte-identically to:
`tools/KFB-ToolBox/lib/edit-layer.js`

Promoted blob = donor blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

No duplicate TransformControls/picking owner was created.

### WORLDBUILDER ADAPTER
WorldBuilder now consumes the shared layer and exposes the S7 object menu:
- ✥ move;
- ⟳ rotate;
- ⤢ scale;
- ⬓ drop to visible surface below;
- ⊹ world/local axes;
- ✕ close;
- snap 0.05 / 15°.

Scale is now part of the WorldBuilder scene transform and survives Save/Reload. The previous local TransformControls owner, local ray picker and side Move/Rotate/Drop controls were removed.

### EVIDENCE
- shared editor Source/Review/static integration: **32/32 PASS**;
- exact pinned actor/prop/animation/texture paths: **4/4 PASS**;
- promoted shared module identity: **1/1 PASS**;
- embedded browser self-test: **20 assertions prepared / 0 executed**;
- automated browser runtime: **0**;
- screenshots: **0**.

### NEXT
Georg reviews the new shared-editor Chat HTML: select object → mini-menu → Move / Rotate / Scale / Drop / World-Local / Close → Save/Reload. Cloudflare, Live, merge, Claude Design and Orc Band integration remain HOLD until this mini-menu gate.
## 2026-09-23 · WB1-TERRAIN-SCENE-01 · R1 human feedback repair

### HUMAN FINDINGS
- Caveman geometry rendered without its expected texture in the ChatGPT HTML preview; Georg identified this as a recurring cross-preview symptom.
- the Character green Y-axis transform was ineffective because terrain grounding rewrote root Y during gizmo changes / animation frames;
- the responsive palette/sidebar overlaid the 3D field of view in the narrow ChatGPT preview.

### REPAIR
- reused the Resident Atlas explicit Caveman texture source `assets/gltf/caveman_texture.png`; no replacement texture/material;
- added a review-host texture loader using fetch/Blob/ImageBitmap first, TextureLoader fallback, sRGB and glTF `flipY=false`;
- changed scene roots to one-shot ground-on-spawn and removed automatic Character root re-drop from TransformControls + render loop; `Drop to terrain` remains explicit;
- saved numeric Character Y is now respected on reload;
- replaced the narrow absolute overlay with a two-row responsive grid so controls reserve layout space instead of covering the canvas;
- documented the recurring ChatGPT attachment-host texture limitation at `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/CHATGPT_HTML_TEXTURE_PREVIEW_LIMITATION_2026-09-23.md` and linked it from the shared review pool.

### EVIDENCE
- repaired Source static/contract checks: **26/26 PASS**;
- pinned actor/prop/animation/texture source paths: **4/4 PASS**;
- Source/Review integrity: **5/5 PASS**;
- embedded browser self-test: **15 assertions prepared / 0 executed**;
- automated browser runtime: **0**; screenshots: **0**.

### HUMAN RE-REVIEW
Georg opened the repaired R1 ChatGPT attachment and confirmed the Caveman texture is now visible.

**TEXTURE_VISIBLE_IN_CHAT_ATTACHMENT · PASS**

The successful review-host adapter is now documented globally for Web/WSA/other chats. The source asset/Resident Atlas remain unchanged.

### NEXT
Georg re-reviews the same local `WB1_TERRAIN_SCENE_01_REVIEW.html` for Character Y movement, unobstructed field of view and Character-Y save/reload. Texture is already HUMAN PASS. Claude Design, Orc Band, Cloudflare and Live remain HOLD.
## 2026-09-23 · WB1-TERRAIN-SCENE-01 local review candidate

### IMPLEMENTATION
Added the bounded WorldBuilder runtime source and the zero-install review copy under
`tools/KFB-ToolBox/worldbuilder/wb1-terrain-scene-01/`.

The slice reuses:
- deterministic terrain primitives from `ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` (MIT);
- the existing S21/S22 TransformControls / select / snap / drop / local-patch seam;
- Resident Atlas Caveman · `Rig_Medium` · existing `Melee_Unarmed_Idle`;
- the exact KayKit Forest `Rock_3_E_Color1.gltf` landmark.

Source actor and source prop are isolated gates before the composed scene can unlock. The scene document stores source references and transforms, not model/animation bytes.

### REPAIR
One bounded repair pass corrected posed grounding from world-Y to parent/terrain-Y and made Scene Editor unlock depend on successful isolated actor + prop loads.

### EVIDENCE
- source static/deterministic logic: **21/21 PASS**;
- exact pinned donor paths: **3/3 PASS**;
- review-copy integrity/parity: **5/5 PASS**;
- automated browser runtime: **0**;
- screenshots: **0**.

Browser/visual acceptance is therefore still a human gate; no browser PASS is claimed.

### PUBLICATION
Cloudflare remains **HOLD · NOT PUBLISHED**. No Stage or Live route changed.

### NEXT
Georg reviews `WB1_TERRAIN_SCENE_01_REVIEW.html`. Claude Design, Orc Band integration and wider terrain modes remain HOLD until that review.

## 2026-09-23 · WorldBuilder → ToolBox Scene Authoring correction

### USER DIRECTION
WorldBuilder is part of the ToolBox: continuous terrain plus scene composition from real Resident Atlas actors/props, with existing animation/motion sources available for preview. The Orc Band is a later integration scene, not a separate one-off world.

### SOURCE VERIFIED
Legacy Combat-v3 FrizzleBob is a Kenney Platformer character with Pet-Studio face and is distinct from both the Cube-Pet rabbit and the current Driver Graft. Resident Atlas ownership and the current Motion Lab seam were rechecked. Animation Lab v3 exists as donor source but remains unpromoted.

### ROUTING
Added `FRIZZLEBOB_IDENTITY_MAP_2026-09-23.md` and corrected WorldBuilder through `TOOLBOX_SCENE_AUTHORING_CORRECTION_2026-09-23.md`. Current first runtime gate is `WB1-TERRAIN-SCENE-01`: terrain + one real Resident Atlas actor + one existing compatible clip + prop placement + save/reload.

### BOUNDARY
WorldBuilder does not become a second Resident Atlas, Animation Lab or game runtime. No runtime files, Cloudflare publication or Live state changed in this documentation slice.

## 2026-09-21 · Fluid/Card/Voxel intake and Theatre Curtain route

### SOURCE VERIFIED
Dropbox and GitHub contain the same 23 files for the new ToolBox Bench/Card Zone/Voxel intake. Fluid, Beam and Seeds retain their supplied Bench evidence; CardStack is not tested as a module and Voxel is a terrain-v10 mirror pending owner reconciliation.

### ROUTING
Added a source-first consolidation brief and a ToolBox source card. Added the existing public Theatre Curtain v1 as a real preview route plus a separate Core v2 host-adapter brief for loading, cutscenes and instance transitions.

### BOUNDARY
No candidate module was promoted, no game runtime owner changed, and no Live consumer integration is claimed.

## 2026-09-19 · Cartoon Vehicle Deformer Lab v2 intake

### SOURCE RECEIVED
Added Georg's complete 32-file Vehicle Deformer Lab v2 export under `_inbox/` without replacing
the earlier v1 intake. The package declares 61 ground fixtures, 10 flight candidates and 23
deterministic sequences.

### TESTED RESULT
Fourteen JavaScript syntax checks and three JSON parses pass. Local HTTP browser boot passes for
the Hatchback ground fixture and the Airplane A flight inventory. The flight deformer remains
explicitly unimplemented; human visual acceptance of the ground sequences is pending.

### ROUTING
Added a public Stage candidate route plus the bounded Vehicle Lab v3 / TinySkies flight brief.
No Race or Travel physics ownership moved into ToolBox.

## 2026-09-14 · T1-Onboarding

### DECISION
Ein ToolBox-Arbeitsbereich für Studio v17, Rigging v1 und Animation v2 WIP; getrennte Übergaben, Eingänge und Archive. Runtime-Owner der Spiele bleiben unverändert.

### IMPLEMENTATION · Dokumentation
START_HERE, lokaler Masterplan, Arbeitsregeln, Specs, Contracts, Deliverables, Workflows, Font-Inventar, Quellen-/Modulverzeichnis, frischer Chat-Auftrag und Return-/Job-Templates angelegt. Keine Tool-Runtime, kein Default-Preset, keine Fontdatei verändert oder veröffentlicht.

### SOURCE FACT
Der gepinnte Eingang enthält 14 Dateien (3 HTML, 5 Markdown, 6 JSON). Separater Modulbaum und exportierte Build-Anleitung fehlen in diesem Ordner; eingebettete Ressourcen wurden nicht vollständig extrahiert.

### DECISION · UI
Lesbarkeit zuerst. Normale Webfont/System-Fallback für UI; kein Special Elite oder Brandfont in Controls. Fonteys PRO und weitere Art-Fonts sind kein Startblocker.

### UNRESOLVED
17 fehlende lokale Fontreferenzen laut Autoren-Housekeeping; genaue Dateiliste/Verwendungsstellen noch zu liefern. Lab-Graft-Default muss gegen tatsächliches Bundle geprüft werden. Kein Browser-/Integrations-/Roundtrip-PASS durch diesen Dokumentationsstand.

### CLARIFICATION
`kfb.pets/1` bleibt der Input/Output-Vertrag. Logische Actor-/Role-/Fit-Trennung rechtfertigt keinen stillen Schemawechsel. Alle gelieferten Farb-/Mod-/Rig-Snapshots bleiben WIP bis expliziter Abnahme.


## 2026-09-18 · 2D Animation Studio alignment

### DECISION
ToolBox and 2D Animation Studio keep separate renderer/source ownership but share one semantic EyeRig control surface. EyeRig v6 remains the 3D donor; SVG/2D uses an adapter against the same gaze/blink/emote/kinetics/life vocabulary.

### IMPLEMENTATION · contracts/docs
- added `docs/2D_ANIMATION_STUDIO_BRIDGE.md`;
- added a dedicated cross-tool handover;
- added 2D Studio to the ToolBox owner table;
- linked the EyeRig Batch lane to the cross-render bridge;
- registered the 2D Studio/protocol/Eumel paths in `TOOLBOX_MANIFEST.json`;
- preserved `kfb.eye-profile/0.1-candidate`; renderer binding remains companion candidate metadata.

### OPEN
Cross-render runtime proof is still pending: DocCheck Eumel 2D + one approved Rig_Medium actor must consume the same semantic eye sequence. No claim of common whole-body clip tracks.


## 2026-09-18 · Dropbox v18 EyeRig cross-check

Read-only donor audit confirmed the Dropbox FrankenStein Studio v18 session carries `pet-eye-rig.v6.js` text-equivalent to the current GitHub EyeRig-v6 donor after line-ending/trailing-whitespace normalization. The same Dropbox session contains Animation Lab v3, but no GitHub/current-tool promotion is inferred from presence alone.


## 2026-09-18 · Cross-render EyeRig Phase A proof

### IMPLEMENTATION
A shared semantic proof is now implemented under `tools/2D Animation Studio/proofs/cross-render-eye-v1/`.

3D proof target is FrizzleBob Driver Graft on the measured Rig_Medium host, reusing the existing public `mountGraft()` + EyeRig-v6 owner rather than mounting a temporary second eye system.

2D proof target is source-exact DocCheck Eumel.

Both consume the same `eye-clips.v1.json` sequence through one semantic runner.

### EVIDENCE
Static syntax/JSON/source-pin/sequence checks PASS.

### OPEN
Browser runtime and visual sync remain untested here. This is Phase A protocol proof only; first generic Medium EyeProfile approval remains an EyeRig Batch gate and becomes Phase B.


## 2026-09-20 · KayKit Motion Lab v1 · public candidate

### SOURCE
Draft PR #127 on branch `chatgpt-web/toolbox-kaykit-motion-profiles-2026-09-20`.

### IMPLEMENTATION
Three-actor motion/profile candidate using exact existing sources:
- FrizzleBob through current `mountGraft(animation:'host')`;
- GothGirl direct · Rig_Medium;
- Black Knight direct · Rig_Large.

Includes real clip enumeration/binding, foot-contact measurement, phase-sync A/B, speed→timeScale, hysteresis preview and measured Walk/Run handoff candidates.

### TESTED
- static/source: **25/25 PASS**
- local browser: **87/87 PASS**
- public Stage: **87/87 PASS**
- 0 failed public resources
- 0 public page/console errors

### BOUNDARY
No consumer movement/physics owner changed. Animation Lab remains an unpromoted target under ToolBox; no second Registry/mixer/runtime was introduced.

### NEXT
Human three-actor motion review. Attachment proposals remain a separate visible gate.
