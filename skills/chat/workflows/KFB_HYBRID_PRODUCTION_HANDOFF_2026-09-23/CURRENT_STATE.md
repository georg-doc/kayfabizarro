# KFB Hybrid Production Handoff · Current State · 2026-09-23

Status: SNAPSHOT · refresh exact heads before writing

## ToolBox · active Coworker build

Owner PR:
`georg-doc/kayfabizarro#185`

Source-lock head:
`2833674b36be707fa4d14c8b532faee78ef3ba28`

Production packet lives on prior control-plane PR #191:
`TOOLBOX_SOURCE_SAFE_INTEGRATION_01.md`

Coworker session reported:
- freshness gate PASS;
- exact Stage-First / Studio / saved-pets Dropbox identity hashes match;
- accepted R2 `edit-layer.js` API verified;
- Base-Pet contract source recovered in repo:
  `media/3D_Assets/kfb-pets.json`
  blob `cef6cca9cc69a6cb3c0b4a9d39f6b15579cbf055`;
- full source roster can be reconstructed from pinned inputs without hardcoded replacement identities;
- mounted Dropbox files make the actual Stage-First and Studio sources locally consumable rather than prose-reconstructed.

### Decision

Coworker's proposed internal vertical slice is **approved as an implementation checkpoint**, not as a new Georg gate.

Internal order may be:
1. real Stage-First shell;
2. real roster seam;
3. accepted R2 editor;
4. Goth Girl + Save/Reload;
5. expand to current FrizzleBob + saved Cube-Pets + Orc Warband + Animatronic;
6. tests;
7. one coherent ToolBox review artifact.

Human milestone remains the complete Source-Safe Integration 01 outcome.

## WorldBuilder

Current WB2:
`georg-doc/kayfabizarro#190`

Head:
`8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e`

Candidate includes:
- Raise / Lower;
- Radius / Strength;
- quintic smooth falloff;
- Undo / Clear;
- sculpt Save/Reload;
- accepted shared object editor preserved outside Sculpt mode.

Technical:
- 24/24 sculpt math/geometry PASS;
- 33/33 source/review contract PASS.

Human review remains open.

## Travel

`georg-doc/KFB-Travel-Globe#38`

Current branch head:
`08147fb4a6726f4c0248ff79ade67eec24afdbca`

Human decision:
**TMB-2 ACCEPTED · 400 ms**

Post-decision:
- 119/119 PASS;
- build PASS;
- verify PASS.

No active Travel human gate.
TMB-3 intentional landing remains HOLD.

## Racer

`georg-doc/KFB-Stunt-Car-Race#33`

Current branch head after recovered review persistence / human feedback:
`71e7051b2eea1ad731912b634f44ce5ba0218736`

Runtime/test represented:
`dad35bdf0f3e19fdc2c5902e154140353db590f9`

Technical:
**24/24 PASS**

Human:
**R3d TUNE**

Current blockers:
- dark terrain/deep geometry intersects barrier in views;
- stepped barrier silhouette;
- dark rectangular track/underside artifacts;
- support/frame bases look cut off rather than seated.

The exact recovered R3d HTML is now committed in the Racer review folder.

Vehicle Grounding / Contact remains HOLD.

Next planning target:
**Racer Anatomy Foundation**
with one CLOSED packet comparing:
- smallest deterministic procedural topology repair;
- optional Blender MCP visual-mesh A/B on one representative banked curve/barrier/support section.

## Blender MCP

Proof:
`georg-doc/kayfabizarro#192`

Head:
`b49fb6e1adde070d658e1cc21dadb3294164cb29`

Clown JUG-P1:
- reproducible Blender Python;
- GLB export;
- GIF;
- measured deformed-mesh clearance;
- Georg visual PASS ~80 %.

Current live Blender work:
**Orc Warband / KayfaBizarros performance**.

Read-only Dropbox recon now shows a newer authoring checkpoint than the GitHub Blender proof:
- `module.json` = `orb-kayfabizarros-band` / ORB-P1 / **v4** / `candidate-only`;
- current authored files include `orb_band_module_v4.blend`, `orb_band_module_v4.glb`, `orb_band_module_v4.gltf.json`, `orb_preview_v4.gif` and `orb_contact_sheet_v4.png`;
- Dropbox `module.json` modified 2026-09-23 19:03Z;
- the retained `KAYFABIZARROS_BAND_POC_REVIEW.html` still identifies the older v2 review surface.

Therefore: **Warband v4 is an active authoring candidate, not yet a GitHub-returned or human-accepted milestone.**
PR #192 remains the durable GitHub proof until the Warband owner persists its own Return/evidence.

Do not restart the current Blender scene.
Next meaningful checkpoint should return:
- .blend;
- script where practical;
- GLB;
- preview;
- source/measurement record;
- Return.

## 3D cartoon form language

Verified existing sources:
- `skills/KFB_3D_CartoonStyle_v1.md`
  blob `5fe583af82f8b728f8d6c75542c1b323c626179a`;
- WorldDesign comic backlog:
  `tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/docs/COMIC_CARTOON_BACKLOG.md`
  blob `7239bad5a794fe3f007df39089c96ca42c7e41ca`;
- archived Town design direction contains Georg's references to Rocko's Modern Life + Wallace & Gromit as staging/material references, not literal assets/styles:
  blob `2f8c80f7d00452e4e0dd85f7a428994d7a7c5d2f`.

The parallel form-language lane has now persisted a source-backed current candidate:

`georg-doc/kayfabizarro#194`
branch `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`
current head `2db8f327e2580c745aa2d14ee9866a15925eb64d`.

Hürth 01 proves:
- 22 real Hürth OSM buildings;
- CLEAN vs exact current City-Lab GROTESQUE vs new ELASTIC GROTESQUE CLAY;
- explicit source-object isolation before composition;
- OSM/S2/collision ownership unchanged;
- tested implementation head `1db61b9c882e178000cf700a7d5f4d18ec03eba0`;
- browser evidence **16/16 PASS**, **3/3 WebGL2**, 0 page/console errors;
- Cloudflare Stage **NOT PUBLISHED**;
- human visual acceptance **PENDING**.

Current human gate:
**Hürth 01 visual decision — continue / tune / reject the Elastic grammar.**

`CARTOON_FORM_LANGUAGE_CURRENT.md` remains the control-plane synthesis, but PR #194 is now the richer implementation/source lane.

## Curtain

Recovery owner:
`georg-doc/kayfabizarro#189`

Head:
`dfd39255811e6f5b7cdde4092beb753d2b40713b`

Rejected:
SVG/2D substitute.

Ready Claude recovery prompt:
`tools/KFB-ToolBox/_handover/CLAUDE_CURTAIN_VISUAL_REFINEMENT_2026-09-23/CLAUDE_RECOVERY_PROMPT.md`

Exactly one next gate:
**exact Theatre Curtain v1 donor unchanged**.

## Billboard

Recovery owner:
`georg-doc/kayfabizarro#188`

Head:
`00583a6758b09da4533cc7773a29205f5099fa8f`

Rejected:
generic UI/debug-heavy substitute with missing real Card.

Ready Claude recovery prompt:
`tools/KFB-ToolBox/_handover/CLAUDE_BILLBOARD_MEDIA_DESIGN_2026-09-23/CLAUDE_RECOVERY_PROMPT.md`

Exactly one next gate:
real Kenney billboard + real KFB Card through existing Racer donor path, minimal UI, front + both 3/4 views.

## Old control-plane

PR #191 contains useful Production Flow v2 provenance but is now dirty against current main.

Use this fresh handoff branch as the short operational recovery point.
Do not extend #191 indefinitely.


## Production Desk

Prepared current operations artifact:

- `PRODUCTION_DESK_V0_BRIEF.md`
- `PRODUCTION_DESK_STATE.json`
- `COWORKER_PRODUCTION_DESK_START.md`

Purpose:
current operational mirror beside the KFB Hub.

Coworker builds PD0 after Opus 5.5 recovery checkpoint, then resumes ToolBox.

It does not become a project SSOT.

## Review Scene Base

Prepared:
`REVIEW_SCENE_BASE_V1.md`

It extends the accepted `threejs-focus-review-v1` review harness with:
- source isolate;
- exact owner environment or neutral calibration;
- fail-closed asset loading;
- real 3D scene shadow where relevant;
- direct chat delivery;
- durable artifact persistence.

No second review framework.

## VFX / SFX

Prepared Web slice:
`VFX_SFX_CONSOLIDATION_01.md`

Paste-ready start:
`VFX_SFX_WEBCHAT_START.md`

Current source-backed VFX donors include:
- KFB Cartoon Combat VFX v10.1;
- Brackeys masks/flipbooks;
- FreeHitVfx SOP/source;
- 74-item 2D Cartoon Smoke pack;
- Tiny Swords 2D effect assets;
- Boxel feedback POC;
- Lorekeeper/Sedan VFX event-map owner pattern.

Current SFX donor:
- KFB Pinball Audio v1;
- combat cue/layer lineage must be source-pinned before promotion.

Next gate:
**VFX-01 Review Bank first.**
SFX implementation waits for VFX donor-family selection.
