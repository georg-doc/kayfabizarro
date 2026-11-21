# TEST EVIDENCE · DOM-free KFB Audio Runtime Package

Date: 2026-10-06
Implementation head: `127f62607f04ff33b78348b12ce85696e9e6244d`
Owner: KFB Audio / Jukebox / Mixer
Scope: repository-resident runtime package only; no WB2 runtime write and no Site publication.

## Exact GitHub readback

Verified on branch `web/kfb-adaptive-music-stem-proof-2026-10-06`:

- `tools/KFB-ToolBox/audio/runtime/kfb-audio-runtime.mjs`
  - blob `169d32c7c6f75683e321550fd6200858ec20c061`
- `tools/KFB-ToolBox/audio/runtime/music-resolver.mjs`
  - blob `a81e7bd432c4cbca30361bb4897bcfeacfc99c53`
- `tools/KFB-ToolBox/audio/runtime/runtime-registry.v1.json`
  - blob `7fe383d24802364d6e3491e2d9296b5c0ce32f36`
- `tools/KFB-ToolBox/audio/runtime/qa.mjs`
  - blob `0d958e2c7644b1a870f3d25391baf2495cdb2ed6`
- M/N/O Suno completion pack
  - blob `6aac9231aeb31af51b52a4c9240ae427af060b61`

## Runtime ownership invariants

Exact committed source readback establishes:

- AudioContext is constructor input and required;
- runtime contains no DOM `document` dependency;
- runtime contains no DOM `window` dependency;
- runtime does not construct `AudioContext` or `webkitAudioContext`;
- destination/SCORE bus is injected;
- World state enters through `setContext(kfb.audio.context.v1)`;
- discrete facts enter through `emit(kfb.audio.event.v1)`;
- evidence is read-only through `getEvidence()`.

## Resolver / capability invariant harness

A local Node invariant harness mirroring the committed resolver/registry contract ran **17/17 PASS**.

Covered:

1. runtime registry schema;
2. G remains `SITE_RUNTIME_VERIFIED`;
3. D remains `SITE_RUNTIME_VERIFIED`;
4. C remains `SOURCE_PRESENT_RUNTIME_UNVERIFIED`;
5. planned M is not exposed as runtime family;
6. no DOM document dependency;
7. no DOM window dependency;
8. no AudioContext constructor;
9. context validation;
10. idle -> STAYING;
11. motion -> MOVEMENT;
12. TALKING priority over movement;
13. work resolution;
14. race resolution;
15. MOVEMENT -> G mapping;
16. TALKING -> D mapping;
17. unavailable STAYING does not fake an audio family.

## GitHub Actions

Commit `127f62607f04ff33b78348b12ce85696e9e6244d` triggered existing workflow:
- `KFB Production Resource Registry R0.1`
- run `37474723115`

At evidence capture the workflow was still in progress. This workflow is repository/resource-registry CI, not a dedicated WebAudio runtime proof, so no adaptive-audio runtime PASS is inferred from it.

## Explicitly not proven in this slice

NOT RUN:
- WB2 browser integration;
- World -> Audio adapter end-to-end;
- real C Cozy runtime decode/listening;
- M/N/O assets, because they do not exist yet;
- cross-family G <-> D audible transition inside the World;
- day/night profile behavior;
- 100+ world registry loading/streaming.

These remain future integration gates.
