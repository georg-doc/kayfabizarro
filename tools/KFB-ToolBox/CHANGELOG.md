# KFB ToolBox · additives Changelog

Alte Einträge bleiben unverändert. Korrekturen als neue CORRECTION/SUPERSEDES-Einträge mit Bezug ergänzen. Aktuelle Momentaufnahme im MASTERPLAN/Return, Geschichte hier.

## 2026-09-26 · ClayBound Asset 01 accepted · Asset 03 two-pass recovery

### HUMAN / SOURCE STATE
Asset 01 (smooth matte clay r1) is HUMAN_ACCEPTED with exact X/Y edge equality. Georg explicitly skipped Asset 02 for now and requested the rough handmade modelling surface next.

### ASSET 03
Asset 03 is authored as a 2048×2048 16-bit Non-Color relative meso-height source. r2 passes all 4 seam/half-offset criteria but still awaits Georg's look review. r3 improves the broad kneading/compression language but fails X/Y seam continuity. Two repair passes are spent; the slice is frozen.

### ROUTING
PR #228 now carries the manifest, deterministic r2 source generator, Blender MCP handoff and full failure-recovery export under `_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/`. Blender consumption is blocked until the human look gate. PR #173 remains the seam donor.

### BOUNDARY
No binary was guessed into Dropbox, no second asset registry was created, no production GLB/material was mutated and no Stage/Live route was published.

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


## 2026-09-26 · KFB Clay Asset Studio v0.1.0

### TOOL CREATED · EXPERIMENTAL
Private ChatGPT plugin `KFB Clay Asset Studio` verified at version **0.1.0** / release `pluginrel_6ab7de067680819184bb6c981df7489c`. Skill `produce-clay-assets` owns a fixed 50-item review-gated raster-production queue for clay textures, shader utility maps, craft materials and cutout/decal sheets.

### CONTRACT
Exactly one asset per review turn; human approval before advancing. Tile candidates require repeat/edge inspection, transparency must be real alpha where claimed, and grayscale-looking images are not promoted to calibrated height/roughness maps by appearance alone.

### BOUNDARY
The plugin is an **EXPERIMENTAL production helper**, not a replacement for ToolBox, Asset Librarian, Blender/MCP, shader owners or game runtimes. No asset has been generated, accepted, integrated, staged or promoted yet.

### NEXT
Asset 1: **Smooth matte clay seamless texture** → source + 3×3 repeat review before Asset 2.


## 2026-09-26 · ClayBound NotebookLM source decks + Hub production lane

### SOURCE INTAKE
Four NotebookLM slide-deck PDFs are now pinned in the existing ClayBound Style Reference folder:
- `ClayBound_Production_Pipeline.pdf`
- `Digital_Clay_Grammar.pdf`
- `Diorama_Texture_Atlas.pdf`
- `KFB_ClayBound_Production_Spec.pdf`

Combined size is 68,563,328 B (~65.4 MiB). They were **not opened, rendered or web-optimized** in this intake; originals remain source evidence.

### ROUTING
Added `CLAYBOUND_INPUT_INTAKE_2026-09-26.md` with the bounded production backlog. HUB-CTRL #202 now carries one compact **ClayBound · Production Assets** lane plus seven catalog jobs instead of exposing the full 50-item plugin queue as cards.

Current READY gate:
**CLAY-ASSET-01 · Smooth matte clay seamless texture → source + 3×3 repeat + Georg review.**

### BOUNDARY
No PDF conversion, no asset promotion, no Blender integration, no Stage/Live publication and no second asset registry are claimed.
