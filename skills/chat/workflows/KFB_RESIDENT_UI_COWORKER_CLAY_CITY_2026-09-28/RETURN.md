# Return · Resident UI + Coworker Clay City briefs


Date: 2026-09-28

## Result

Two bounded jobs are ready and separated by capability:

- Claude Design owns one ToolBox-style Resident UI redesign and returns a complete artifact package. It does not own GitHub or integration.
- Claude Coworker owns one playable Clay City integration tile and persists checkpoints to GitHub. It returns a Site-ingestible handoff instead of assuming private GPT Site access.

## Evidence used

- current main `51f9bc22596a0d0165f4da9e8e2ea14118466210`;
- Resident Atlas S11 session cut on main;
- Georg's screenshot showing three competing edit surfaces and Graveyard/GothGirl context leakage;
- World R6 PR #282 @ `df7220331932a28865af96d8411aac630d21dff7`;
- Halloween Bits PR #279 @ `10a2c5e29bf752215dadb60b23f07253f63e9d34`;
- current KFB Site and executor-delivery rules.

`KFB Knet-Strecke T4/M2` is required for the Coworker Track presentation. It is not yet in GitHub, but is durably identified in the authenticated Production Inbox as receipt `6d9b0cd8-bc29-4b8b-b41f-5821eef69d21`, 1,433,281 bytes, SHA-256 `101b7c66edb259520c480a618cf064f25adf0ce4781c9f7e960eb7a13abeb93a`. Coworker Desktop must verify and ingest these exact bytes; silent fallback to T2/T3 is forbidden.

## Tests

Documentation/routing slice only. No runtime, browser, Stage or public QA is claimed.

## Exactly one next gate

Dispatch `CLAY-CITY-MVP-01` to Claude Coworker. The Resident UI design job can run independently and must not block the playable World MVP.
