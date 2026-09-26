# KFB Aborted / Fragile Web-Chat Recovery Inventory · 2026-09-26

Status: **RECONSTRUCTED FROM GITHUB + DROPBOX + CURRENT PROJECT HANDOFFS · WSA REVIEW**

Purpose: prevent work from disappearing when a Web chat times out, shows `Stream cache expired`, loses the final answer, or dies during long research / browser / workflow jobs.

This is not a new runtime owner. GitHub/project SSOTs remain authoritative.

## Status vocabulary

- **RECOVERED_COMPLETE** — the chat may have broken, but the intended slice is fully persisted and needs no continuation.
- **RECOVERED_OPEN_GATE** — implementation/research is persisted; exactly one named gate remains.
- **ORPHANED_CLOSURE** — substantial work exists and is technically proven, but Return/Recovery/Hub/Stage closure is missing.
- **RECON_NOT_FORMALIZED** — useful source/recon exists, but the chat never produced the intended application memo/brief.
- **INTENTIONAL_HOLD** — stop was correct; missing inputs are prerequisites, not lost work.
- **UNKNOWN_NO_TRACE** — no durable evidence found; do not reconstruct architecture from chat memory.

## Recent fragile-chat inventory

| ID | Likely chat/slice | Durable evidence | Current state | What is still open |
|---|---|---|---|---|
| A1 | **Billboard B2b-P1 · Living Collage** | kayfabizarro PR **#212**, head `5e0d6d7f32d2f5de1faa17933cf3bf12f1b42e99`; workflow `36081170177` | **ORPHANED_CLOSURE** | Technical proof is green (**40/40**, 0 page errors, 0 tracked HTTP errors; artifact **10841409354**), but PR #212 contains implementation/workflow files only: no slice Return/Recovery/TEST_REPORT/Hub metadata/Stage handoff. Georg visual gate never got a durable review route. |
| A2 | **Reddit/GitHub/demo research for KFB World/Games** | PR **#204**, `EXTERNAL_DEMO_RESEARCH_RADAR_2026-09-26.md`, final architecture head `31df655615d7f911afbe2767a9aac287e2335999` | **RECOVERED_COMPLETE** | Pass 2 A–L is complete: **73 HTTPS source/demo links**, routing validation **15/15**, final handoff sync **8/8**. Broad research is explicitly stopped by default; resume only for a named product question. Main follow-on `ENV-PREVIEW-01` was already implemented separately. |
| A3 | **ToolBox r2 receiving-owner recovery** | PR #185 owner + failed review PR #220 + recovery PR **#221** head `e935f7ebbc2c40691248cd6910840a9f4b746a93` | **RECOVERED_OPEN_GATE** | First Stage-review slice exhausted two passes and froze correctly. Fresh review recovery is **33/33 browser PASS**, ears fully framed. Still needs existing-owner Cloudflare Stage publication + Hub link + Georg human review. No feature expansion before that gate. |
| A4 | **World r2 receiving-owner recovery** | WorldBuilder PR **#190** + `world-integration-01/failure-recovery/` | **RECOVERED_OPEN_GATE** | Two runtime repair passes exhausted. Hürth boot/source/network were not the problem; stale selftest semantics were. Next gate is exactly `WORLD-R2-CONTRACT-RESET-01`: **test contract only first**, then one bounded regression run. No runtime patch pass 3. |
| A5 | **Hub UX v2 timeout/recovery** | PR **#217**, final handoff head `2b4d800d1e0213c3b344eb3e2ee4b6664447a1ce` | **RECOVERED_OPEN_GATE** | Candidate has 18/18 builder + 31/31 contract + 20/20 public Chromium proof and Georg **PASS_WITH_TUNE**. Known unresolved item: mobile remains broken. Candidate is **NOT LIVE**. Next choice is separate `HUB-MOBILE-TUNE-01` or explicit later Live/merge gate. |
| A6 | **Shared Environment Preview / Skydome-light-world-match continuation** | PR **#218**, head `6718eef05f2b6dd0d79ae04884b33f3396c34379` | **RECOVERED_OPEN_GATE** | Local candidate is green: 30/30 static owner/contract + 15/15 Chromium/WebGL. Only shared `ground` is proven; `terrainPatch`/`worldZone` fail closed. Next gate: publish unchanged candidate as additive Cloudflare Stage comparison + Georg visual review. |
| A7 | **Racer / RKIT / flexible pieces / Cologne route planning** | PR **#219** + downstream PR **#216**; Race PR #42 frozen fixture | **RECOVERED_OPEN_GATE** | Planning is durable. Current gate is **G0 JavaScript decision → W0 Track-Core census/contracts/reference**. Playable Track R0 must not start. RKIT-11 remains acceptance fixture. Dropbox OSM crop `/CLAUDE/KFB Racetrack Blender Kit/RKIT-11/osm/rhein-muelheim-v0/` exists but promotion/provenance is still a WSA/OSM gate. |
| A8 | **Claude Design Playable Track R0** | PR #222 blocker intake + PR #216 branch-only R0 brief | **INTENTIONAL_HOLD** | Claude Design correctly returned SOURCE_REQUIRED. The closed R0 input package does not exist yet because Track Core is not proven. Do not copy the brief to main or invent replacement recipes. |
| A9 | **KayKit City Builder Bits · city-liveliness / traffic props recon** | current main Asset Registry `registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`; existing S4/S5 city/road scenes | **RECON_NOT_FORMALIZED** | Source inventory is already strong: **41 exact model assets**, including `trafficlight_A/B/C`, `streetlight`, crossing/junction/road pieces, bench, fire hydrant, dumpster/trash, cars, buildings and watertower. What is missing is the requested application matrix: which assets become World/OSM/Race dressing, which are road-semantic fixtures, placement rules, scale/source-isolation evidence and first small city-liveliness proof. |
| A10 | **Biome / procedural Nature / Card-Zone environment consolidation** | PR #204 prepared jobs/briefs: `WORLD-ENV-CONSOLIDATE-01`, `WORLD-BIOME-MOOD-01`, `WORLD-NATURE-01`, `WORLD-RECIPE-01`, `CZ-ENV-01`; Combat Spindle Sky donor already pinned in older World handoff | **INTENTIONAL_HOLD / BACKLOG_PRESERVED** | Not lost. Environment consolidation remains the receiver; Biome/Nature/World Recipe/Card Zone stay dependency-gated. Current Georg decision supersedes old wording that Travel Globe/TinySkies is the world base: only source-backed sky/weather/light/mood and useful mechanisms are donors. |

## Highest-risk items

### 1. Billboard B2b-P1 is the only clear recent closure orphan

The implementation exists and its CI is green, but the usual handoff envelope was never completed.

Do **not** rebuild it.

Recommended recovery slice:
1. fetch PR #212 exact head + workflow artifact;
2. source-isolate the existing Gate-1 collage donor and current P1 result;
3. write missing `SOURCE.json`, `TEST_REPORT.md`, `RECOVERY.md`, `RETURN.md`, additive changelog;
4. preserve the exact 40/40-tested runtime;
5. only then package the unchanged candidate for KFB Stage + Hub human review;
6. stop at Georg visual PASS/TUNE/REJECT.

### 2. City Builder Bits is the only clear recent recon orphan

The source pack itself is not missing. It is already structurally indexed and used by older S4/S5 scenes.

What the interrupted chat appears not to have persisted is the **product application decision**.

Recommended bounded output:
`CITY_BITS_WORLD_DRESSING_RECON_01`

Classify the 41 real model assets into:
- **road-semantic**: traffic lights, crossing/junction/road fixtures;
- **city dressing**: streetlight, bench, hydrant, dumpster/trash, boxes;
- **vehicle ambience**: hatchback/police/sedan/stationwagon/taxi;
- **building/background**: A–H, with/without base, watertower;
- **nature accent**: bush.

For every adopted group:
- show actual source objects in isolation;
- measure scale/socket/orientation;
- name consumer owner;
- define deterministic/sparse placement rules;
- do not turn the pack into a second OSM/road/world generator.

First useful proof should be a **small existing Hürth/Cologne street fixture dressed with 3–5 source-exact props**, not a new city generator.

## Recovered but deliberately not restarted

- External broad research A–L: complete; only question-triggered follow-up.
- World r2 failed runtime: contract reset only.
- ToolBox #220 failed review: superseded by #221 recovery.
- Playable Track R0: prerequisites intentionally missing.
- Hub v2: no redesign restart; mobile tune is a separate bounded slice.
- RKIT one-off geometry: frozen behind Track Core.

## Older explicit timeout-frozen items still visible in current Hub/recovery

These are not from the latest chat wave, but they are examples the new protocol must catch:

- **Legacy Web Pet v0 / PR #157** — normal Web/Hub host proof passed, arbitrary-page injection timed out twice; next gate is observability-only `LWP-EXT-F1`.
- **TinySkies × OSM publication recovery** — source candidate was green, Cloudflare marker publication failed twice; recovery says repair marker only, do not rebuild the scene.
- **Hürth R2** — two visual repair passes failed; frozen and routed to architecture proofs rather than R3 patching.

## What cannot be reconstructed reliably

A Web chat that:
- never wrote a branch/file/comment;
- never produced a Session Cut / Dropbox export;
- and is absent from current project handoff history

is **UNKNOWN_NO_TRACE**.

For those, do not recreate supposed decisions from memory. The new long-job protocol exists specifically so every substantial chat leaves a durable checkpoint before doing expensive work.

## Exactly one next meta-gate

**Adopt the timeout-safe long-job protocol and recover the two real orphans first: A1 B2b-P1 closure and A9 City Builder Bits application recon.**
