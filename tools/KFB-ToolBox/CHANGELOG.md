# KFB ToolBox · additives Changelog

Alte Einträge bleiben unverändert. Korrekturen als neue CORRECTION/SUPERSEDES-Einträge mit Bezug ergänzen. Aktuelle Momentaufnahme im MASTERPLAN/Return, Geschichte hier.

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


## 2026-09-24 · Billboard B1 · content-fit face

### SOURCE
Accepted Billboard B0 was forked literally; `bb-scene.js` and `bb0-boot.js` remain byte-identical.

### IMPLEMENTATION
Draft PR #198 / `chatgpt-web/billboard-b1-2026-09-24`.
One B1 boot seam lets the accepted billboard frame/posts and content plane change width together from the real source aspect.
Modes: real KFB card quarter, cover, Travel YouTube poster/player and SHOW IT → SPIN IT → SELL IT.

### EVIDENCE
- first automated 20/20 candidate screenshot-rejected for black media surfaces;
- one repair pass only;
- tested runtime `58a8b92d55548c6436ac60b15b521d8eff269afd`;
- local **20/20 PASS**;
- public **21/21 PASS**;
- public 4-mode artifact **10788012554**;
- 0 page/console errors; 0 failed public assets.

### STAGE
https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b1/

### NEXT
**Georg B1 picture review.** C1 remains HOLD.


## 2026-09-25 · Billboard B2a final · front-only inline YouTube

### HUMAN TUNE
Georg accepted B2a except for mirrored YouTube visibility on the billboard rear and explicitly asked ChatGPT to fix/check it in.

### IMPLEMENTATION
- PR #199 / `chatgpt-web/billboard-b2a-css3d-2026-09-24`;
- final runtime `89065825448846beb2649082fc0c1bf25df20ccb`;
- CSS backface rule retained;
- renderer-independent rear protection added: accepted panel world normal dot camera direction gates `CSS3DObject.visible`;
- front hemisphere keeps the real clickable iframe;
- rear hemisphere shows only the original Kenney/WebGL billboard body.

### EVIDENCE
- CSS-only first attempt: **28/29 FAIL**; iframe still exposed on rear;
- repaired integration: **29/29 PASS**;
- public Cloudflare: **24/24 PASS**;
- 0 page errors; 0 tracked public HTTP errors;
- Stage `983929385c3be74a42ec88c29f601c08b90b5a05`;
- public artifact `10836432703`;
- `04-video-back.png`: no mirrored iframe.

### STATUS
**B2a HUMAN_ACCEPTED · CHECKED IN**

### NEXT
B2b research/options memo only; no runtime implementation yet.

## 2026-09-26 · Billboard B2b-P1 frozen recovery

- Draft PR #211 / `chatgpt-web/billboard-b2b-research-2026-09-25`.
- Frozen candidate head: `2348c069a99b57149d6a2685496b5ce1b40ebe1a`.
- A+ CanvasTexture COLLAGE built from the existing Gate-1 donor.
- Protected B2a modes/rear fix retained.
- Static proof: green (4 protected byte compares; 12/12 contract/provenance; 4/4 boundary; 2/2 syntax; 124/124 scheduler).
- Browser Repair 2: **39/40**, 0 page errors, 0 HTTP errors, 11 compositions.
- Only failed assertion: one queued interval callback increments ticks once during mode exit (**725→726**), then the counter is stable.
- Stop rule applied; no Repair Pass 3 and no B2b-P1 Stage publication.
- Recovery export: `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_P1_2026-09-25/failure-recovery/START_HERE.md`.
- Exactly one next gate: isolated post-switch lifecycle/quiescence semantics test.
