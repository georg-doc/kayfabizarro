# KFB ToolBox · additives Changelog

## 2026-10-01 · Global Clay Lite 512 ready for local comparison

- Implemented one lightweight shared-texture material candidate in the existing World Corridor diagnostic lane.
- Reuses only existing KFB donors `Clay002` and `clay_floor_001`; no new texture family.
- Each donor is converted at runtime into one 512² packed RGBA texture: relief direction + roughness + value variation.
- Runtime projection is triplanar X/Y/Z while original asset colour remains authoritative.
- Estimated active texture cost: ~1.33 MiB including mipmaps.
- Added `global-clay-pack.v1.js`, lightweight shader branch, donor-switch API and automatic local comparison.
- User-facing artifact: `KFB_Global_Clay_Lite_Doppelklick.html`, SHA-256 `30bc4ff8e9a39479169301e9a6b198e00a185af402108badfd3e4c481374e81e`; extracted module syntax PASS.
- Automatic comparison: current procedural Clay → Clay002 512 → clay_floor_001 512 → Clay off.
- No performance or visual winner claimed until representative M1 Max JSON returns.
- Plain-language next action: Georg runs **Globale Textur messen** and returns the JSON.

## 2026-10-01 · Blender P0A delivered · intake corrected against WC1 parity

### BLENDER RETURN
Draft PR #309 / `blender-mcp/clay-perf-p0a-2026-10-01@93af8caef6a85caa1f7fd70a59abb46edf85f0a4` delivers one source-proven building_A baked-lite family with UV1, normal/roughness maps, four deterministic variants, Blender source/scripts and QA.

### ACCEPTED
- source-pin gate 9/9 PASS;
- scale `3.2 / 1.65 = 1.939394...` confirmed;
- 1024² bake is useful as mid/far reference; near detail remains procedural/hybrid;
- PR #309 is accepted as **K2_STAGE_BAKED_LITE mechanism/reference**, not runtime performance proof.

### PARAMETER CORRECTION
P0A baked K2-stage globals:
Tools 1 · Legacy 0 · Mottle .04 · Macro .5 · LodK .6 · Stroke .7.

Current measured WC1 parity path:
Tools 0 · Legacy 1 · Mottle .05 · Macro .5 · LodK 1.0 · Stroke .55 · PrintOn 1 + near LOD gate · HexK 3 · HexRot 1 · HexFlow 0 · FacetSoft 0.

Therefore P0A is **not yet WC1_PARITY_BAKED_LITE**. No immediate rebake requested.

### NEXT
Finish `WC1-CLAY-PERF-01`, pin the optimized procedural shader/settings, then align the final baked candidate only if the baked path still wins the runtime comparison.

## 2026-10-01 · WC1 cost split identifies Clay fragment bottleneck

### MEASURED · APPLE M1 MAX
Same exact World Core R2C mode-B scene, visible Chrome:
- default: 30.3 fps / 32.96 ms;
- Clay off: 90.2 fps / 11.09 ms (**−66.4% mean frame time**) with unchanged 179 calls / 414,758 triangles;
- clouds off: 34.5 fps / 28.99 ms (**−12.0%**);
- shadows off: 29.5 fps / 33.91 ms despite calls/triangles roughly halving;
- pixel ratio 1.0: 39.1 fps / 25.54 ms (**−22.5%**).

### CONCLUSION
Hex instancing, draw-call count and shadow geometry are not the current dominant limiter. The active K1-parity K2/v10 Clay material/fragment path plus pixel footprint is the primary measured bottleneck; clouds are secondary.

### CLAY BOUNDARY
Do not remove or replace the accepted KFB Clay look. PR #301 / `work/clay-style-ssot-2026-10-01` remains visual authority: K1/H0 v8 is Golden; K2/v10 may be optimized only with locked Golden parity.

### NEXT
`WC1-CLAY-PERF-01` — bounded feature-cost decomposition and smallest Golden-preserving Clay shader/LOD optimization before Track Core integration.

## 2026-10-01 · WC1 baseline source rehome + CI stop

### IMPLEMENTATION
Rehomed the current R2C island source under the existing WorldBuilder owner. The preserved source entry and nine dependencies are **10/10 byte-identical** to the current Claude inbox source. Added one separate instrumented entry plus an observer-only performance probe.

### TESTED
- source/owner intake: **13/13 PASS**;
- exact rehome parity: **10/10 PASS**;
- GitHub browser boot reaches live R2C + probe;
- hosted SwiftShader absolute performance gate stopped after two attempts.

### STOP / RECOVERY
Run 36861843836 passed parity + boot but sampled fewer than 30 frames in 3.5 s under hosted SwiftShader. Per stop rule, no third CI tuning pass. Candidate and artifact 11161609956 are preserved in `worldbuilder/world-corridor-01/FAILURE_RECOVERY_WC1_BASELINE.md`.

### NEXT
**WC1-GPU-BASELINE** — same unchanged candidate on representative visible Chromium/GPU hardware. After that measurement, Track Core adapter is the first additive performance delta.

## 2026-10-01 · WorldBuilder Floating-Island corridor intake

### SOURCE INTAKE
Accepted two current Claude Design exports as integration inputs:
- Hex/Floating-Island + route-layout source under `_inbox/KFB World Core R2C · Hex-Archipel Katalog/`;
- Skydome / EnvironmentHost source under `_inbox/KFB Skydome Gates SKY3/`.

### ROUTING
Opened `tools/KFB-ToolBox/worldbuilder/world-corridor-01/` under the existing WorldBuilder owner. WB2 stays the scene/terrain authoring host. Track Core 0.12 stays the only route-frame/slot/check owner; R2C route generation is layout/input only. Existing Race/Ground movement owners, Billboard scheduler/LOD and EnvironmentHost single-loop boundary remain protected.

### EVIDENCE
Source/owner intake checks: **13/13 PASS**. The island module is real source code, SKY3 modules and manifest resolve at exact blobs, WB2 source pin resolves, Track Core v0.12 snapshot resolves, and the current Billboard scheduler/provider seam is present.

### BOUNDARY
No WorldBuilder runtime rehome, Track adapter, vehicle, billboard, SKY3 integration, streaming stress, Stage, merge or Live promotion is claimed yet. Inbox source folders remain unarchived until the receiving WorldBuilder owner actually imports and pins the accepted parts.

### NEXT
**WC1-BASELINE** — rehome the exact current island source into the WorldBuilder owner, add only a tiny performance probe, and establish parity + GPU baseline before adding Track / vehicle / billboards / sky / streaming.

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


## 2026-09-29 · Shared shadow/contact + clay-building routing correction

### AUDIT
The known shadow/contact solution was present only inside ToolBox / WB-D2 / World Integration session cuts; the stable path already referenced by several design docs, `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`, did not exist on main. S5 Building/Façade Clay Adapter was also found fully persisted but branch-local on `georg-doc-patch-2@3232a1070686896833d6b7942fcd631b9fa8cda6`, so a main-only search could falsely report it missing.

### ROUTING
Added:
- `docs/LESSONS_SHADOWS.md` — fitted/snapped shadow frustum, texel-relative normalBias, thin-overlay casting rule, WB-D2 world-scale contact variant, FACE_NORMALS/contact distinction and regression checks;
- `docs/CLAY_BUILDING_FACADE_ROUTER.md` — explicit S5/H0/K2/Elastic/WorldBuilder/LOOK-TORSION source-resolution order.

### VERSION CORRECTION
S5's 2026-09-27 material references predate the accepted K2 2026-09-28 base. New stages use K2 `clay-material.v10` + current relief/toolmix unless a bounded legacy comparison requires the earlier H0 path. Accepted H0 stays on its frozen v8 line.

### BOUNDARY
No renderer, deformer, WorldBuilder, OSM presenter, track geometry, material runtime, Stage or Live surface changed. This is a documentation/routing repair only; shared integration verification remains open under issue #247.
