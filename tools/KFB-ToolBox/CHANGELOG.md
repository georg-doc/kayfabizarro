# KFB ToolBox · additives Changelog

Alte Einträge bleiben unverändert. Korrekturen als neue CORRECTION/SUPERSEDES-Einträge mit Bezug ergänzen. Aktuelle Momentaufnahme im MASTERPLAN/Return, Geschichte hier.


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
