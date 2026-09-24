# KFB ToolBox · additives Changelog

## 2026-09-24 · TOOLBOX-COHERENT-INTEGRATION-01

### IMPLEMENTATION
Promoted the exact accepted Stage-First v1 donor into PR #185 without modifying its donor file, then added one coherent adapter that reuses the existing real roster, current Driver Graft owner, current Resident Atlas, shared `edit-layer.js` and `kfb.scene-patch.v1`.

The candidate supports one flow: roster actor → current Driver Graft → real Resident → select → Move → Rotate → free Scale → Drop → Save → Reload → continue editing. Missing mandated Resident/Driver sources fail visibly; no cube/generic fallback, second renderer, second editor or second persistence schema was introduced.

### EVIDENCE
Runtime-tested head `1f59903bfae25e959e106cf4fd1d06dd2cf62588`: **22/22 static + 20/20 Chromium PASS**. Actions run `36027616075`, job `107728032734`, conclusion SUCCESS.

### PUBLICATION
No Cloudflare iteration publish. Status is **CHAT REVIEW READY**, not PUBLIC_VERIFIED/live.

### NEXT
Exactly one next capability after human acceptance: **TB-EYE-01 · EyeRig Production Studio**.

Alte Einträge bleiben unverändert. Korrekturen als neue CORRECTION/SUPERSEDES-Einträge mit Bezug ergänzen. Aktuelle Momentaufnahme im MASTERPLAN/Return, Geschichte hier.

## 2026-09-23 · Texture workaround consumed · no new ToolBox chat

### VERIFIED UPSTREAM FIX
PR #186 / head `e0a9327bcc6406ec3e093f57b14ec81569988406` documents and human-verifies the ChatGPT attachment texture adapter:
`fetch → Blob → createImageBitmap → THREE.Texture` with `TextureLoader` fallback.

Georg confirmed the repaired Caveman texture is visible in the ChatGPT HTML attachment.

### CORRECTION
ToolBox must consume this review-host adapter where needed instead of opening another texture-debug chat or re-investigating the same limitation.

### CURRENT USE OF RESIDENT SETS
Goth Girl, Orc Warband and Animatronic remain useful fixtures, but primarily to expose the remaining import/export issues: source resolution, multi-part assembly, pose, grounding, attachments, animation and export/reload fidelity.

### EXECUTION
Continue in the current ToolBox chat. `FRESH_WEB_START.md` is recovery-only.

## 2026-09-23 · Cross-chat 3D preview portability failure

### HUMAN OBSERVATION
Across three current ChatGPT HTML-preview lanes, Georg reports roughly ten repeated failures of the same class: missing models, missing textures/maps, replacement/fallback geometry, lost pose/grounding and lost prop attachments.

### EXISTING RULE CONFIRMED
The current browser-3D skill already requires canonical RAW asset URLs and explicitly rejects relative `./assets/...` paths for standalone export. The repeated failures show that asset-URL correctness alone is not enough for compound scenes.

### DECISION
Stop using isolated rebuilt objects as the next ToolBox gate. Use complete known-good Resident Atlas combinations as transport fixtures.

### CURRENT P0
`TB-RESIDENT-PORTABILITY-01`:
- Goth Girl;
- Orc Warband;
- Animatronic.

Each must survive donor → review import → export/reload with model identity, textures, pose, grounding, prop placement/attachment, actor count and animation intact.

### SEQUENCE
Only after this passes: FrizzleBob lineage review → full Studio roster → Stage-First ToolBox integration → Claude Design refinement.

## 2026-09-23 · ToolBox source review brief finalized

### SOURCE CORRECTION
The source-review gate now distinguishes three FrizzleBob lineages: current Driver Graft, legacy Cube-Pet, and legacy Combat Platformer (Kenney Platformer body + Pet-Studio face).

### ROUTING
Added `TOOLBOX_SOURCE_LOCK_2026-09-23/FRESH_WEB_START.md`. The next Web chat builds only `TOOLBOX_SOURCE_REVIEW.html`; no combined ToolBox UI resumes until Georg confirms the real actor sources and Studio roster.

## 2026-09-23 · ToolBox source-lock correction after Claude Round 1

### HUMAN REVIEW FAIL
The first Stage-First Claude build kept the desired shell but used the old Cube Bunny as FrizzleBob, did not preserve later saved Cube-Pet configuration, and did not expose the full current Studio actor source.

### SOURCE EVIDENCE
Compared three `kfb.pets/1` states: Stage-First bundle 1.2.7, current GitHub 1.2.8, later user-saved Dropbox 1.2.9. The later file contains measured Bunny body/pad/ground data absent from 1.2.7 and additional tuning differences such as Penguin eye/mouth/body values.

### CORRECTION
Current FrizzleBob remains the Driver Graft through `mountGraft()` + `kfb-pet-graft-driver.v4.json`. The Claude Round-1 file is frozen as a rejected foundation. Next gate is an isolated source review before any further consolidation.

### NEXT
`TB-SOURCE-LOCK-01` — show real Driver Graft, later saved Cube-Pets and actual Studio roster separately, then ask Georg to confirm sources.

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
