# KFB Resident UI + Clay City MVP · routing


Status: `READY · TWO SEPARATE JOBS`

Date: 2026-09-28

This package turns Georg's latest Resident Atlas review and World MVP direction into two non-overlapping jobs.

## Job A · Claude Design

Read `CLAUDE_DESIGN_RESIDENT_UI_CORE_01.md`.

Outcome: redesign Resident Atlas and Animation Lab/Library together inside the accepted current ToolBox design. The shared complete 3D inline editor becomes the only object-edit control surface. Motion Library v4 supplies 263 catalog-driven clips, filters, prop/strike metadata and Resident assignments. Dancing Skeletons remains content; Claude Design does not rebuild the runtime or write GitHub.

## Job B · Claude Coworker

Read `CLAUDE_COWORKER_CLAY_CITY_MVP_01.md`.

Outcome: implement one genuinely playable Clay City tile with a geometric road, verified kit buildings, Ground/Auto/Flight and a measured shared sky. Claude Coworker is the selected integration executor. It writes a bounded GitHub branch and returns a Site-ingestible handoff; it does not assume direct access to the private GPT Site.

## Current source locks

- `georg-doc/kayfabizarro main@51f9bc22596a0d0165f4da9e8e2ea14118466210`
- Resident S11 session cut: `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/`
- World R6 / Clay City direction: Draft PR #282, `work/world-m2a-r6-focus-quality-2026-09-28@df7220331932a28865af96d8411aac630d21dff7`
- Halloween Bits complete repair: PR #279, `chat/halloween-glb-import-2026-09-28@10a2c5e29bf752215dadb60b23f07253f63e9d34`
- ToolBox Animation Library design/behavior reference: PR #274 plus accepted Production-05 session cut; retain the current ToolBox design and shared UI standard.
- Motion Library v4: PR #275, `georg-doc-patch-3@c9c3f9aa437e969b3ec2f0a6e9a1e87b2a2f3f1a`; 263 unique clips. Read `RETURN_INTAKE_04.md` and the current catalogue. Intake 04 adds 59 clips, prop requirements, variants, Resident ideas and 8 candidate strike markers.
- `KFB Knet-Strecke T4/M2`: required current Track-look donor for the Coworker MVP. The exact verified package is now at `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1.zip` and remains recorded in the Production Inbox under receipt `6d9b0cd8-bc29-4b8b-b41f-5821eef69d21` (1,433,281 bytes; SHA-256 `101b7c66edb259520c480a618cf064f25adf0ce4781c9f7e960eb7a13abeb93a`). Verify and ingest this exact package before Track integration; do not substitute T2 or an older freehand look.
- Site: existing KFB Production Control only: `https://kfb-production-control.frizzlebob.chatgpt.site/`

GitHub current state overrides every snapshot. Re-fetch these heads immediately before execution.

## Shared non-negotiables

- no new Hub, ToolBox shell, Resident runtime, World runtime or sky owner;
- no generic replacement buildings or placeholder props where a verified donor exists;
- no Cloudflare Live promotion, merge or full-world build;
- timeout means `UNKNOWN`; inspect the ref before retrying;
- after two failed repair passes on the same gate, preserve recovery and stop;
- update Return, additive changelog and Hub/Site handoff in the same closure.
