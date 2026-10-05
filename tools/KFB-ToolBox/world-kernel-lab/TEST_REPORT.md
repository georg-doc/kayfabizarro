# TEST REPORT · KFB World Kernel Lab · POC 01

Date: 2026-10-05
Status: **SOURCE TEST PASS · BROWSER VISUAL NOT YET CERTIFIED**

## Automated core tests

Command:
`node --test tests/world-kernel.test.mjs`

Result:
**6/6 PASS**

Covered:
1. hierarchical seed determinism;
2. same seed + generator version keeps one world fingerprint across LOD;
3. generator-version change changes procedural identity;
4. canonical coarse terrain-band contributions are stable while higher detail is added;
5. deterministic landmarks are LOD-independent;
6. generated height tile returns finite transferable-friendly `Float32Array` data.

## Static checks

Passed locally:
- `node --check app.js`;
- `node --check world-worker.js`;
- `node --check world-kernel.js`;
- local HTTP `index.html` fetch succeeded.

## Browser attempt

A local Chromium screenshot attempt was made in the container. Chromium could not initialize its EGL/ANGLE display and the command timed out. No visual screenshot PASS is claimed.

Classification:
`TOOL/ENVIRONMENT LIMIT · NOT PRODUCT EVIDENCE`.

The static/browser source is therefore **Site-ready but visually unverified** until a Sites-capable publish/browser executor opens the actual private GPT Site.

## Scope not tested yet

- mobile layout in real browser;
- Worker support on final Site host;
- localStorage persistence on final Site origin;
- rapid-slider queue pressure;
- measured frame times/GPU upload behavior;
- tile seams across multiple independent tiles;
- real KFB assets or WB2 integration.
