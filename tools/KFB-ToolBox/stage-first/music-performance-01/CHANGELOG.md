# MUSIC-PERF-01 · CHANGELOG

## 2026-09-24 · Implementation

- started from current ToolBox receiving head `6224614eccfa24938394e8866aac0dea9c3db3f0`;
- created isolated stacked branch because PR #185 was advancing concurrently;
- reused exact ORB-P1 v5 GLB + module metadata and exact Rubbish Groove MP3 by Git blob;
- added reusable `kfb.resident-performance.v1` recipe;
- added Source Object / Performance A-B;
- added 8-bar / 32-beat ruler, scrub, play/pause and loop;
- song time is the only performance master clock;
- leader + guitarist enabled; drummer HOLD disabled only in integrated mode;
- added one Music entry to the coherent ToolBox shell;
- current read-only Motion Library preserved.

## 2026-09-24 · Test / repair

- initial static assertion typo repaired; implementation unchanged;
- source/owner checks reached **22/22 PASS**;
- initial paused seek stayed at 0 s in headless HTTP preview;
- Repair Pass 1 waited for media metadata but did not make authoring seek deterministic;
- Repair Pass 2 loads the exact source-backed MP3 once into the one preview transport and awaits `seeked`;
- final run `36033971182` / job `107749357266`: **SUCCESS**;
- final browser result **29/29 PASS**;
- proof artifact `10822609381`, digest `sha256:0d5950361fa3ae74b90c4b3afb31a01fdc97953616a60fa371d156518e6ff69d`;
- no BPM, phase or donor choreography retune.

## Current gate

Direct playback review / Cloudflare publication only. Runtime candidate is frozen pending Georg.
