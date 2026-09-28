# Return · Resident + Animation ToolBox UI + Coworker Clay City briefs

Date: 2026-09-29

## Result

Two bounded jobs are ready and separated by capability:

- Claude Design Desktop owns one integrated ToolBox-style Resident + Animation UI redesign and returns a complete artifact package. It does not own GitHub or integration.
- Claude Coworker owns one playable Clay City integration tile and persists checkpoints to GitHub. It returns a Site-ingestible handoff instead of assuming private GPT Site access.

The UI brief no longer treats Resident Atlas and Animation Lab as unrelated products. They share one current ToolBox shell, one complete inline 3D editor and one catalog-driven animation surface.

## Evidence used

- current main `51f9bc22596a0d0165f4da9e8e2ea14118466210`;
- Resident Atlas S11 session cut on main;
- Georg's screenshots showing three competing edit surfaces, Graveyard/GothGirl context leakage, intrusive status labels and preview-edge gaps;
- Motion Library v4 Draft PR #275 @ `c9c3f9aa437e969b3ec2f0a6e9a1e87b2a2f3f1a`;
- canonical catalog `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json` with 263 clips;
- Intake 04 return: 61 incoming clips, 59 admitted, 2 exact duplicates skipped, 71 uploaded files verified;
- catalog metadata for variants, prop hand/role, resident ideas and candidate `events.strike` timing;
- World R6 PR #282 @ `df7220331932a28865af96d8411aac630d21dff7`;
- Halloween Bits PR #279 @ `10a2c5e29bf752215dadb60b23f07253f63e9d34`;
- current KFB Site and executor-delivery rules.

`KFB Knet-Strecke T4/M2` is required for the Coworker Track presentation. It is not yet in GitHub, but is durably identified in the authenticated Production Inbox as receipt `6d9b0cd8-bc29-4b8b-b41f-5821eef69d21`, 1,433,281 bytes, SHA-256 `101b7c66edb259520c480a618cf064f25adf0ce4781c9f7e960eb7a13abeb93a`. Coworker Desktop must verify and ingest these exact bytes; silent fallback to T2/T3 is forbidden.

## Tests

Documentation/routing slice only. No runtime, browser, Stage or public QA is claimed. PR #275's reported asset/catalog checks are preserved as source evidence and were not rerun here.

## Exactly one next gate

Dispatch `CLAY-CITY-MVP-01` to Claude Coworker. The integrated Resident + Animation ToolBox UI job can run independently in Claude Design Desktop and must not block the playable World MVP.
