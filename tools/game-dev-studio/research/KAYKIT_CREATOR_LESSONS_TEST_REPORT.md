# KayKit Creator Lessons · Test / Evidence Report

**Date:** 2026-09-19  
**Owner:** KFB Game Dev Studio  
**Branch:** `chatgpt-web/kaykit-creator-learning-2026-09-19`  
**Scope:** documentation/research only; no runtime, asset binary, animation, material, physics or public-site behavior changed in this checkpoint.

## Checks actually performed

### KFB control-state recovery

Read from current `georg-doc/kayfabizarro/main` before writing:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/REGISTRY.json`
5. `skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md`
6. `tools/game-dev-studio/README.md`
7. `tools/game-dev-studio/RECOVERY.md`
8. `tools/game-dev-studio/CHANGELOG.md`

Result: **8/8 control/source-owner documents fetched successfully**.

Expected absences confirmed:
- `tools/game-dev-studio/START_HERE.md` — not present.
- `tools/game-dev-studio/RETURN.md` — not present before this slice.

### GitHub branch / write verification

Base main head immediately before branch creation:

`a92e3c70029d811b76a88a15459adc20fea943bb`

Branch created:

`chatgpt-web/kaykit-creator-learning-2026-09-19`

Checkpoint 1:
- commit `ff04e34b4c217f25b5d2b299cbe252477aeffb07`
- living document fetched back from the exact branch: **PASS**

Checkpoint 2:
- commit `270570ac8c0bec25f183cbf3a47dfcaa671e308a`
- source manifest fetched back from the exact branch: **PASS**

### Creator-source review

Pinned in `KAYKIT_CREATOR_LESSONS_SOURCE.json`:

- 1 primary detailed tutorial;
- 1 official quick tutorial;
- 7 current/legacy official itch pack/reference pages;
- 1 official creator update;
- 2 exact indexed Live Show VODs;
- 1 official YouTube channel watchlist source.

Total pinned creator/reference entries including primary source: **13**.

The living document separates:
- creator-observed facts;
- KFB inference;
- KFB proposals;
- existing KFB owner decisions;
- open/untested items.

### JSON structure

`KAYKIT_CREATOR_LESSONS_SOURCE.json` was generated from a structured object and fetched back through GitHub after commit.

Result: **1/1 source manifest present and structurally serialized as JSON**.

## Runtime / visual / deployment tests

- Game runtime tests: **0** — not applicable; no runtime changed.
- Asset binary tests: **0** — no binary generated or modified.
- Browser visual tests: **0** — no public UI changed yet.
- Cloudflare deployment: **NOT REQUESTED / NOT CLAIMED** for v0.1.
- Georg visual acceptance: **PENDING / NOT APPLICABLE TO DOCUMENT CONTENT YET**.
- `game-dev` CLI: **NOT REQUIRED** for this documentation/research slice.

The existing Game Dev Studio public route remains an owner/recovery route only:
https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/

No new public revision is claimed until a later Hub/Stage wiring checkpoint is deployed and opened.

## Evidence limitations

1. The detailed YouTube source is analyzed through its creator-authored chapter structure plus current official KayKit documentation; this v0.1 does not claim a frame-by-frame transcript.
2. Live Show Episodes 0–4 are identified by the creator as the source of Mixed Bag 1. Only Episode 2 and Episode 3 exact URLs are pinned in this pass; Episodes 0/1/4 stay OPEN until exact URLs are retrieved rather than guessed.
3. The planned Godot environment/lighting tutorial is explicitly WATCHLIST because the creator update did not yet confirm publication as of 2026-09-19.
4. Proposed KFB metadata fields are not implemented and are not Asset Registry schema truth.

## Current evidence result

**DOCUMENTATION CHECKPOINT PASS**

This means the research artifact and source manifest are present at the verified branch head. It does **not** mean any proposed KayKit package, retarget, attachment, interaction or runtime integration works.

## Next evidence gate

Deep-review the five KayKit Live Show VODs and append source-grounded modeling grammar:
- object decomposition;
- primitives;
- proportions;
- bevel/edge language;
- origins/pivots;
- atlas/material method;
- variant/separate-part decisions;
- reusable KayKit-compatible prop construction heuristics.


## Final documentation wiring sanity · pre-PR

Read-only checks at branch head `f11857002e1587eb0c9bfb0a8dcee2fcd15bac0e`:

1. living document contains exact primary video ID — PASS;
2. `Rig_Medium` compatibility analysis present — PASS;
3. Platformer interactive-donor proposal present — PASS;
4. Live Show deep-review next gate present — PASS;
5. source manifest parses as JSON — PASS;
6. source manifest contains 13 pinned/reference entries including primary — PASS;
7. Hub contains exactly one `kaykit-creator-lessons` briefing card — PASS;
8. Game Dev Studio Recovery contains exactly one research section — PASS;
9. Game Dev Studio Changelog contains exactly one GDS-06 entry — PASS.

**9/9 static documentation/wiring checks PASS.**

Compare against base `a92e3c70029d811b76a88a15459adc20fea943bb` at that point reported:
- branch ahead by 10 commits;
- behind by 0;
- 10 changed files;
- all changes additive except the intended documentation/router/Hub insertions;
- no asset binary, catalog package data, runtime or consumer source changed.


## v0.2 animation / current-main sync sanity

Research update:
- added `KayKit - Animations - Overview Set 1`;
- added current Rig_Medium motion inventory analysis;
- added phase-sync / timeScale / locomotion / combat / interaction synthesis;
- added current Mixed Bag repository evidence;
- synchronized branch to current `main@3d9ac78bfabcec0c43fc453c124133764221139c` before final evidence.

### Read-only static checks

1. living document reports v0.2 — PASS;
2. exact video ID `T1KNCtAqJ7A` present — PASS;
3. phase-sync locomotion section present — PASS;
4. explicit “no source Sprint” constraint present — PASS;
5. KCL-M1 measurement gate present — PASS;
6. source manifest parses as JSON — PASS;
7. overview video source is pinned — PASS;
8. source manifest records 139 current Rig_Medium motions — PASS;
9. source manifest records 41 Mixed Bag GLTF models — PASS;
10. current `motions.jsonl` actually yields **139** KayKit Rig_Medium rows — PASS;
11. current Rig_Medium Registry contains **0** clip names matching `sprint` — PASS;
12. current Mixed Bag shard contains **47** assets — PASS;
13. Mixed Bag shard contains **41 model-3d GLTF** — PASS;
14. Mixed Bag shard contains **6 image-2d PNG** — PASS;
15. Hub contains exactly one `kaykit-creator-lessons` card — PASS;
16. latest parallel EyeRig Hub card (`Review Medium EyeRig authoring · Studio controls`) preserved — PASS;
17. branch `skills/chat/REGISTRY.json` blob equals current main — PASS;
18. branch EyeRig handover blob equals current main — PASS;
19. parallel uploaded `kfb-FACTORY+UI_asset-handoff-animation-lab (8).json` preserved — PASS;
20. branch is **0 commits behind main** after merge sync — PASS;
21. compare against current main contains exactly the intended **10 research/router files** — PASS.

**21/21 static/source/current-main synchronization checks PASS.**

### Runtime / visual status

- game runtime tests: **0** — no consumer/runtime code changed;
- animation playback measurements: **0** — KCL-M1 is the next gate, not claimed here;
- browser visual tests: **0** for this branch;
- Cloudflare deployment: **NOT PERFORMED / NOT CLAIMED**;
- Georg motion acceptance: **PENDING**;
- `game-dev` CLI: **NOT REQUIRED**.

### Important scope limitation

The 2024 animation video is used as **visual/catalog evidence**. Current motion count and clip availability come from the current KFB Registry / current official Character Animations source, not from the historical video.

The proposed phase-sync, timeScale ranges, hysteresis and event markers are KFB synthesis until KCL-M1 measures them on a real actor.



## KCL-M1 public browser closure

Publication owner correction:
- actual Cloudflare branch: `cloudflare-live`;
- KCL publication commit: `fac041eb34c9a284d724a3ee2b945bef7d020d04`;
- Cloudflare Pages: PASS.

Public browser:
- run `35468444150`, attempt 2;
- job `105981648314`;
- **39/39 PASS**;
- exact pages.dev route opened;
- 5/5 clips + profiles PASS;
- A/B transition PASS;
- 0 resource errors;
- 0 page/console errors;
- artifact `10593933655`;
- digest `sha256:5d7f6bb436d0030a3ddec3f080e0a6b041fe196cdf36cd3d34d5f5d01f71c0cf`.

`PUBLIC_VERIFIED = YES`.

Human visual acceptance remains open.
