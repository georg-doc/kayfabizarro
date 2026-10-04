# KFB Authoring Recovery · ToolBox / WorldBuilder / Orc Band · 2026-09-23

Status: **CURRENT RECOVERY / ONBOARDING ONLY · NO IMPLEMENTATION IN THIS HANDOFF**

Purpose:
recover cleanly after repeated Web-chat timeouts and route the next fresh chat into exactly one productive lane.

Global rule:
read `skills/session-entry-use-what-works_v1.md` first.

Normal human review:
**GitHub checkpoint → zero-install REVIEW.html in chat → Georg feedback.**
No Cloudflare debug loop.
No Work/WSA unless an explicit capability gap remains.

---

## Sanity result

The timeout did **not** lose the important authoring handoffs.

At the latest recovery readback:
- `kayfabizarro/main` had advanced beyond earlier chat snapshots;
- all three current authoring lane briefs exist on current `main`;
- the KFB Hub source contains current ToolBox, WorldBuilder and Orc-Band cards;
- `cloudflare-live` also contains those cards, although the full Hub blobs differ because other lanes are changing concurrently.

Do not infer failure from stale chat output.

GitHub state wins.

---

# Lane A · ToolBox · CURRENT P0 AUTHORING PRIORITY

Read:

`tools/KFB-ToolBox/_handover/TOOLBOX_STAGE_FIRST_DEFAULT_V1_2026-09-23/START_HERE.md`

Claude brief:

`tools/KFB-ToolBox/_handover/TOOLBOX_STAGE_FIRST_DEFAULT_V1_2026-09-23/CLAUDE_DESIGN_BRIEF.md`

## Goal

Turn the existing proven ToolBox pieces into one functional default ToolBox shell using the actual **KFB ToolBox Stage-First Concept** UI.

Do not create another rig/editor/tool family.

## Actual visual donor

Dropbox:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/design/KFB ToolBox Stage-First Concept.dc.html`

Use the source itself.

Do not redraw from prose.

## Current v0.5 intake

Full export:
`tools/KFB-ToolBox/_inbox/KFB ToolBox v0.5.zip`

Review:
`tools/KFB-ToolBox/_handover/TOOLBOX_V05_EXPORT_INTAKE_2026-09-23/START_HERE.md`

Classification:
**intake/provenance, not promoted owner tree.**

Useful current runtime is concentrated in the Stage-First tree; the full ZIP contains substantial historical ballast.

## Proven sources to consume

Eye owner:
`pet-eye-rig.v6.js`

Legacy eyes:
Draft PR #162
`chatgpt-web/legacy-eye-batch-17-2026-09-21@7b1b52a60d64c9dc710514a59d1a7365f8a168e7`

Eye Actor Studio:
Draft PR #159
`chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21@306bb882594f002670069708a853d55eb099fb54`

Medium/Large batch:
Draft PR #104
`toolbox/eye-rig-batch-2026-09-18@e277c3456651d314a01adea046e0105d2a12cdd1`

KayKit compatibility:
Draft PR #147
`chatgpt-web/toolbox-kaykit-character-compat-2026-09-20@d230909626ae24844d2b3109bc45a757b04b1959`

FrizzleBob secondary-motion facts:
Draft PR #148
`chatgpt-web/frizzlebob-secondary-motion-kcc1a-2026-09-20@cb3b80eac105fe6c5fa69bc9a4b5dd98a3f17631`

In-place editor source:
Draft PR #120
`toolbox/inline-3d-edit-layer-intake-2026-09-20@c52e4139d2b5f311ef5dc9a8cfdecbd8944a469f`

Second host candidate:
Draft PR #133
`world-atlas/inline-detail-editor-e1-2026-09-20@69943c8d57aeb8202aaa3b1673697cec58152aac`
This remains a frozen/static candidate; use S21 source interaction as the proven donor.

FrizzleBob graft:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`

## First useful ToolBox milestone

Georg should be able to:

1. choose an actor;
2. see Legacy EyeRig front / 3/4;
3. adjust/save one eye anchor;
4. select a real object/attachment;
5. move/rotate it in place;
6. save/reload the small authoring state.

This is enough.

Do not block on every actor/vehicle/weapon.

## Fast HTML micro-fixtures after shell works

- Legacy EyeRig review;
- one weapon/hand orientation;
- one alternate Rig_Medium body + FrizzleBob graft;
- one vehicle FaceHost using canonical EyeRig v6;
- one source asset on neutral floor / Resident Atlas scene preset.

These should be cheap HTML review loops, not Cloudflare projects.

---

# Lane B · WorldBuilder · CURRENT P0 PRODUCT SLICE

Read:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`

Fresh Web:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_FRESH_WEB_START.md`

Claude follow-up **only after Web HTML PASS**:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md`

## Current truth

WB1-P0 / PR #175:
source/reuse/license research complete.

WB1-P1 / PR #177:
Environment Profile human-scope PASS.

WB1-P2 / PR #180:
technical research evidence only;
human visual FAIL;
rigid Hex/Sphere/Torus direction is superseded as product gate.

Do not repair P2.

## Current direction

**Continuous procedural terrain first.**

Primary donor:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`
MIT.

Use existing KFB S21/S22 + Scene Patch interaction for object editing.

Hex is optional local/semantic content, not macro ground.

## Next gate

`WB1-TERRAIN-EDITOR-01`

Human outcome:

- generate/regenerate terrain;
- place real source object;
- move/rotate/scale;
- drop/snap to terrain;
- save;
- reload;
- continue editing.

Review:
`WB1_TERRAIN_EDITOR_01_REVIEW.html`

No Cloudflare during normal iteration.
No Work.

After this functional HTML PASS, Claude Design may improve visual authoring UX/look without replacing the terrain engine or Scene Patch.

---

# Lane C · Ideation → fresh POC · The KayfaBizarros Orc Band

Read:

`tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/START_HERE.md`

Fresh Web:

`tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/FRESH_WEB_START.md`

## First POC

Exact bandleader:
`character_orcB.gltf`

Source-backed drummer:
Orc Brute / Orc War Drum / Drumstick.

Scenery:
existing Orc-Warband camp donor.

Music:
exact
`Rubbish Groove 2min A extend 01.mp3`

One shared beat clock.

Goal:
visible bandleader bounce + drum motion visibly in time with the track.

No Tourbus.
No Combat.
No new audio engine.
No beat-detection AI.
No Cloudflare.

Review:
`KAYFABIZARROS_BAND_POC_REVIEW.html`

---

# Hub status

Current KFB Hub source already has:

- `ToolBox · Stage-First Default funktional machen`;
- `WorldBuilder · Terrain-First Scene Editor`;
- `WorldBuilder · Claude Design nach Terrain-Editor PASS`;
- `The KayfaBizarros · Orc Band Beat POC`.

Both current `main` and `cloudflare-live` contain these card IDs at recovery readback.

Do not run another Hub publication cycle just to start work.

---

# Fresh-chat operating rule

The recovery chat itself does **not** implement all three lanes.

On entry:

1. re-read current `main`;
2. re-read this recovery file;
3. verify the three lane briefs still exist;
4. give Georg a compact three-lane status;
5. ask/accept which **one lane** to execute;
6. then read only that lane's full brief and work one bounded gate.

Do not:
- reconcile every historical PR;
- merge old candidates;
- republish Hub;
- monitor Cloudflare;
- use Work;
- reopen P2 geometry research;
- turn optional micro-fixtures into blockers.

Timeout rule:
if a tool call times out, mark UNKNOWN, inspect GitHub ref/file, and continue from actual state.

Exactly one next gate for the fresh recovery chat:

**Select one lane: ToolBox Stage-First / WorldBuilder Terrain Editor / Orc Band POC.**
