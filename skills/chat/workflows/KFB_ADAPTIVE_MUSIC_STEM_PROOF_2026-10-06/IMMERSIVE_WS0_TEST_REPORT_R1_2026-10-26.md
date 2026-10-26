# WS0 Immersive Sound / Current Audio MVP · TEST REPORT R1
Date: 2026-10-26 · branch `feature/kfb-audio-site-immersive-ws0-2026-10-26` · base actual Audio v11 current owner PR #365 head `9325a4af861d0a07e1986490f7ee42aa3f047819`.
**SCOPE:** additive source code and a mock WebAudio integration contract. No Site deployment.

## Actual performed checks (tool-isolate, current exact fetched branch source)
**17/17 source/static+syntax PASS** (GitHub exact file-readback after HTML and JS writes):
- parsed `immersive-ambience.mjs` and `audio-site.js` as JS after stripping module import/export in V8; zero syntax errors;
- source requires existing injected AudioContext and GLOBAL_BED destination; no module context constructor and no host `close()`;
- three source-described modes ICEBERG / ONEIRIC / ORGANIC_AIR;
- Site imports new source, injects `buses.GLOBAL_BED`, preserves B/C/D voice focus, and still constructs exactly one Site AudioContext;
- Site public API keeps `musicContext` and `adaptiveMusic` plus additive `immersiveSound`;
- seven HTML IDs/selectors exist and legacy Catalog/Mix/Voice/Soundscape still present;
- synth provenance explicit, field recording not falsely claimed.

**18/18 executable mock-WebAudio functional checks PASS** (actual function compiled and invoked from exact GitHub fetched `immersive-ambience.mjs` source in V8):
- injected context/output required; initial idle/zero module contexts; three modes; source starts six oscillator voices + a buffer;
- repeated start does not create additional oscillator graph; palette changes including invalid selection; depth clamp;
- user-triggered accent when active; stop is idempotent, stopped accent silenced; restart uses new voices; dispose; no restart after dispose; change callbacks.
Mock recorded **0 contexts constructed, 13 oscillators, 2 buffers** over start/stop/restart/accent sequence. The mock is not a browser AudioContext nor real acoustic output.

**Repository runnable QA added**: `tools/KFB-ToolBox/audio/card-performance-self-service/qa-immersive.mjs` contains **26** executable Node assertions for integration, DOM IDs and functional API. This Node harness was added and inspected, **not run in an actual Node process** in this current chat; do not call its 26 checks PASS absent an actual executed process.

## Unknowns / NOT tested
- actual original Iceberg source object listening in isolation **0**; original `atmo-engine.js` source inspected as internal donor; loaded file ≠ audible donor proof;
- real Chrome/Safari AudioContext API, sample decode, device output, room/spatial psychoacoustics, iPhone resume, speaker/headphone comparison, node lifetime profiling **0**;
- actual `audio-site.js` full site bootstrap with its managed JS/CSS/catalog/Voice bundle **0** because the current repository fragment doesn't include the entire Site-managed dependencies (missing `adaptive-stems.mjs`/`voice-bench.js`/`music-interaction-states.json` in exported current branch folder);
- no source-generated WAV, no human audio acceptance, no 60–120s Dream mix, no imported CC0 source, no Three.js spatial acceptance.
- current existing owner Source 0.7.1 / Site v11 browser PASS carried from owner Return; **not** retested here, do not claim existing Site changed.
- Site publisher tool not available this turn. New version deployed **0**, exact URL with new revision opened **0**. No Cloudflare/public Stage.

## Classifications
- CODE_SOURCE_PRESENT: YES
- SOURCE STATIC+MOCK: 17/17 + 18/18 PASS
- REPOSITORY_NODE_QA: SCRIPT_PREPARED_NOT_EXECUTED
- SITE_SOURCE_BUNDLE: RECONCILIATION_REQUIRED
- AUDIO_BROWSER_ACCEPTANCE: UNKNOWN / 0 tests
- HUMAN_LISTENING: NOT PERFORMED
- SITE_PUBLICATION: NOT PERFORMED
- LIVE/MERGE: NO

## One next gate
`WS0_AUDIO_SITE_IMMERSIVE_V11_BROWSER_SOURCE_ISOLATION_AND_PUBLISH` — compare actual managed Site v11 with this branch, audition original internal Iceberg alone and candidate palettes alone, execute existing+new tests with real Web Audio/browser and independently judge, update **same Site** only on green, visually prove exact revision. No second Site/runtime.
