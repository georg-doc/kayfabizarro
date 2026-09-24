# MUSIC-PERF-01 · TEST REPORT

**Date:** 2026-09-24  
**Status:** CI PASS · DIRECT PLAYBACK REVIEW CANDIDATE  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `web/music-perf-01-2026-09-24`  
**Tested head:** `d834f1d4819dc972e2f4aeeedee4c559cbe8afbd`

## Owner/source validation

Workflow: `MUSIC-PERF-01 QA`  
Run: `36033971182`  
Job: `107749357266`  
Conclusion: **SUCCESS**

Static/source/owner checks: **22 / 22 PASS**

They prove:

- `SOURCE.json` uses `kfb.music-performance-source/1`;
- reusable recipe uses `kfb.resident-performance.v1`;
- exactly one shared song reference exists;
- BPM = **100**;
- phase offset = **0.465 s**;
- bar offset is explicit;
- start / loop / finish markers are explicit at 0 → 32 beats;
- leader and guitarist preserve Georg PASS;
- drummer preserves HOLD and is disabled only in integrated Performance mode;
- `bounce | strum | drum` all exist in the exact ORB donor;
- source-isolation is mandatory;
- ORB donor identity = `orb-kayfabizarros-band v5`;
- exact GLB blob = `446b044ed7c68bf877afc0f456f0aa87cc390b46`;
- exact donor metadata blob = `35de1a9d6138b0a27b61f07056f26970ac56dada`;
- exact song blob = `368eb5ae8fafcfba1cce3ba3f80488378fe056b0`;
- one preview `<audio>` element only;
- no per-performer `new Audio()`;
- song `currentTime` is the master beat clock;
- current read-only Motion Library owner remains preserved;
- ToolBox coherent shell has one additive Music entry;
- exact build marker = `MUSIC-PERF-01-v1`.

Syntax: **PASS** for runtime + browser QA.

## Chromium playback proof

Browser checks: **29 / 29 PASS**

Environment:
- Ubuntu 24.04
- Node 22
- Playwright 1.51.1
- Chromium 134

Source Object mode:

- exact ORB donor id/version/blob loaded;
- exact song blob loaded;
- one song owner;
- source mode is first/default;
- leader visible;
- guitarist visible;
- drummer visible;
- 32 beat cells visible;
- song duration = **120.024 s**;
- one seekable media range.

Beat scrub proof at beat **3.5**:

- beatPos = **3.5**
- bounce time = **3.5 / 8 s**
- strum time = **0.5 / 1 s**
- source drum time = **1.5 / 2 s**

Performance mode:

- leader visible;
- guitarist visible;
- drummer HOLD hidden;
- donor itself remains unchanged.

Real playback proof:

- before audio time **2.865 s**
- after ~0.9 s audio time **3.8238 s**
- beat clock **4.000 → 5.598**
- bounce action phase **4.000 → 5.3187**
- no page errors;
- no failed HTTP requests;
- mobile boots exact donor;
- mobile has no horizontal overflow or page errors.

## Proof artifact

Artifact: `music-perf-01-proof`  
Artifact ID: `10822609381`  
Size: 611,920 bytes  
Digest: `sha256:0d5950361fa3ae74b90c4b3afb31a01fdc97953616a60fa371d156518e6ff69d`

Files:

1. `01-source-object.png`
2. `02-performance.png`
3. `03-mobile.png`
4. `results.json`

## Repair history

- run `36033269166`: static PASS, browser FAIL because paused authoring seek remained at 0 s;
- Repair Pass 1 waited for media metadata; browser remained non-seekable in the HTTP harness;
- Repair Pass 2 made the single review transport source-backed and deterministically seekable by loading the exact MP3 bytes into one Blob URL, then awaiting `seeked`;
- final run `36033971182`: PASS.

No BPM, phase, choreography or donor animation was retuned during either repair.

## Evidence boundary

Automated PASS proves source identity, one-song ownership, exact timing math, deterministic seek, action phase-lock, source isolation, integrated performer filtering, real playback progression and responsive boot.

It does not prove that Georg prefers the Music Performance UI, the 8-bar working window, or this camera/stage recipe. Those are the direct playback review gate.


## Public Cloudflare verification · 2026-09-24

**Result:** 22 / 22 PASS  
**Run:** `36047130373`  
**Job:** `107793328531`  
**Branch test head:** `580cf86765b82d2b9e2f9cb2b6bffab0c12b60e6`  
**Deploy head:** `5658557e8d23a68ea1f5f6183d237c9a3284e29a`

Routes:
- `https://kayfabizarro.pages.dev/kfb-hub/stage/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`

Artifact:
- ID `10829491166`
- digest `sha256:d9461a8b85e30b2e53d32b8d26db3af7fbd365147e65b048c465e10c657c2b56`
- `01-public-performance.png`
- `02-stage-card.png`
- `results.json`

The successful public run proves the exact build marker, ORB/song source pins, one-song ownership, public beat seek/phase lock, integrated performer visibility, real playback progression, navigator link, and 0 page/HTTP failures.

First public attempt `36046685204` failed only because the Stage navigator had not propagated yet. No runtime change followed; the final pass changed test ordering to diagnose the direct candidate and navigator as separate publication facts.
