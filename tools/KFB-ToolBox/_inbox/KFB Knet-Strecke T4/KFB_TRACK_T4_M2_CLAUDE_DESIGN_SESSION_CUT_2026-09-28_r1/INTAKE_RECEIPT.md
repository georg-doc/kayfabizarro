# INTAKE RECEIPT · T4/M2 → CLAY-CITY-MVP-01 · Checkpoint 1

Executor: Claude Coworker Desktop · 2026-09-29
Branch: `coworker/clay-city-mvp-01-2026-09-28` (based on World R6 PR #282 head `09077e1fe0c1a03c7d8283cc3280b8c3dfae884c`)

## Source package (verified before unpacking)
- file: `Dropbox/CLAUDE/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1.zip` (copied there by WSA from `Dropbox/Mac/Downloads`, original untouched)
- Production Inbox receipt: `6d9b0cd8-bc29-4b8b-b41f-5821eef69d21`
- bytes: **1,433,281** · expected 1,433,281 → MATCH
- SHA-256: **101b7c66edb259520c480a618cf064f25adf0ce4781c9f7e960eb7a13abeb93a** → MATCH
- archive: 50 files; internal `CHECKSUMS.sha256`: **49/49 OK**

## Content checks
- JSON parse: m1.json, m2.json (v2.2.0), transition-profiles.v1.json, clay-particle-profiles.v1.json, EXPORT_MANIFEST.json, SOURCE.json → OK
- JS syntax (ES module parse): 10 lab modules + support.js → OK
- gzip magic OK; `td03.stream.json.gz` decompresses to 3,784,081 bytes; JSON keys `schema, core, id, ds, slots, joints, samples, markings` → OK
- images: 13 JPEG + 3 PNG, all valid headers

## Placement
Verbatim under `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/` — same receiving convention as T2/T3/T3 v2/T3 v3 (all under `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke …`).

One derived file, added only because `START_HERE.md` §3 makes it a mandatory pre-step and T4 does not load without it:
- `lab-track/data/td03.stream.json` = `gunzip -k` of the packaged `.gz`, 3,784,081 bytes, SHA-256 `fb0413f58b1f80a6b6af379f3109b312af4b033778320dc1376e1894d040577f`.

No file of the package was modified. T2/T3 remain history, not a fallback.

## Status
T4_M2_CANDIDATE (Georg 28.09.: "für den jetzigen Stand reicht das"; tune pass M2.1 open). Visual owner for the integrated track segment in CLAY-CITY-MVP-01. Track Core remains geometry/contact owner.
