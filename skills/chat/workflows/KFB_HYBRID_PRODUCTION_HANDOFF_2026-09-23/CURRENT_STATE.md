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

A distinct new check-in from the currently running Rocko/Wallace form-language chat was **not found as a separate current GitHub source** at this check.

This handoff therefore records the direction in:
`CARTOON_FORM_LANGUAGE_CURRENT.md`
without pretending the missing other-chat export was recovered.

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
