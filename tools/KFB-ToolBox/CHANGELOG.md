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


## 2026-09-24 · AN-PROFILE-02 · Animation Studio consumption

### EXPLICIT CONTINUATION
After AN-PROFILE-01, Georg explicitly authorized continuing with the next small gate: consume the shared measured Motion Library/profile layer in the current ToolBox Animation Studio. This is additive to PR #185; it does not rewrite the earlier Coherent Stage-First result or imply its human acceptance.

### IMPLEMENTATION
The current `stage-first/src/KFB Animation Lab v3.dc.html` now consumes one immutable shared source adapter pinned to AN-PROFILE-01 PR #206 / `032c9d50...` and Motion Library PR #197. Medium/Large each lazily load their proper 33-clip library into the existing `allClips() → selectClip() → AnimationMixer` path.

Existing search, Inventar/Gallery and Data panel now surface semantic group, loop, direction/stance, root/travel, measured-derived reference speed, contact status, rate-window status and explicit action markers. Unknown Large foot contacts, hand contacts and unmeasured markers stay unknown.

No second mixer, renderer, motion database, binary copy, movement/physics/gameplay owner or persistence schema was added.

### EVIDENCE
Runtime-tested head `93d9dd6f763c064313fe5d3bef690496487145a9` · Actions run `36032905791` / job `107745811232` · **SUCCESS**.

- existing coherent static: **22/22 PASS**;
- AN-PROFILE-02 static: **34/34 PASS**;
- existing coherent Chromium: **20/20 PASS**;
- AN-PROFILE-02 Chromium: **25/25 PASS**;
- KFB Motion/profile network failures: **0**;
- Animation Studio page errors: **0**.

### PUBLICATION / GATE
No Cloudflare publication. Planned Stage route `/kfb-hub/stage/toolbox/animation-studio/` remains **NOT PUBLISHED / NOT PUBLIC_VERIFIED**.

Current next gate: direct Chat HTML human review of the 33-clip Library + measured Data surface. WorldBuilder consumption remains HOLD until that first consumer review.


## 2026-09-24 · AN-PROFILE-02 review transport recovery

### HUMAN TRANSPORT FAIL
Two DC-based Chat attachments failed: first exposed raw template variables, second produced a Chat visualization error. Both are frozen as review-transport failures; neither changes the green Animation Studio runtime result.

### RECOVERY
Replaced only the human review surface with `stage-first/review/an-profile-02-review.html`: plain Three.js + the real pinned Medium/Large Mannequins + real Motion Library GLBs + real catalogue/profile data. No DC compiler, no proxy actor, no second Animation Studio owner.

### EVIDENCE
Final run `36055391088` / job `107820911138`: **SUCCESS**.

Plain review: **13/13 Chromium PASS**. Full owner run: **114/114 PASS**. Medium 33/33, Large 33/33, real WebGL canvas, measured Data visible, Large feet unknown, `endsOnTop @ 1`, 0 page errors, 0 failed source/module requests.

### GATE
Current gate remains one human review of the plain HTML. No Cloudflare publish.


## 2026-09-24 · AN-PROFILE-02 HUMAN FAIL

### HUMAN REVIEW
The final plain Three.js review was opened in the real Chat visualization host and failed visibly:
- `source failed`;
- `GLB failed: Mannequin_Medium...`.

Georg also rejected the review composition itself: the measurement/data palettes cover/dominates the review area to the point that the 3D animation would not be meaningfully visible even if source loading succeeded.

### STATUS CORRECTION
AN-PROFILE-02 is **not human accepted** and is no longer “review-ready”.

Technical CI remains historical implementation evidence; it does not override the real human review failure.

### STOP
No further repair pass in this slice. All three review transports are frozen failed candidates.

### NEXT
**HOLD** until Georg explicitly starts a new bounded review-surface brief with:
1. source transport proven in the actual human host;
2. dominant unobstructed 3D stage;
3. measurements available without covering the performance.
