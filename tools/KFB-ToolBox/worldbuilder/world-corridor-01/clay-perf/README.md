# Clay-Shader schlanker machen · Messplan

Status: **DIAGNOSE READY · NO VISUAL TUNING YET**
Date: 2026-10-01

Human-facing task:
**Find which parts of the current Clay shader cost frame time, without changing the island world or the accepted Clay look.**

Internal recovery id:
`WC1-CLAY-PERF-01`

## What stays fixed

- exact World Core R2C island world;
- mode B / instanced construction;
- same camera/world content;
- current K1-parity K2/v10 settings;
- Clay visual authority remains K1/H0 Golden via PR #301;
- no Track Core, vehicle, Billboard or SKY3 integration in this diagnostic.

## Diagnostic-only code

- `clay-material.v10-partsdiag.js`
  - copy of the active v10 material with five diagnostic feature gates;
  - all gates default to ON, so default pixels follow v10;
  - not a new Clay owner or production material.
- `hex-archipel.r2c-partsdiag.js`
  - exact R2C world logic routed through that diagnostic material;
  - no world/layout/geometry changes.
- shared `../performance-probe.js`
  - one-click automatic Clay component test and pixel-ratio matrix.

## Automatic passes

The user-facing HTML runs:

1. current Clay default;
2. base relief off;
3. dents / gouges / cracks off;
4. fingerprints off;
5. facets / creases off;
6. mottle/color-noise off;
7. base relief only;
8. Clay fully off at original pixel ratio;
9. Clay on at pixel ratio 1.0;
10. Clay off at pixel ratio 1.0;
11. Clay on at pixel ratio 0.5;
12. Clay off at pixel ratio 0.5.

Each pass records fps, mean/p95/p99/max frame ms and renderer/world facts.

## Georg-facing package

Preferred file:
`KFB_Clay_Bausteine_Test_Doppelklick.html`

Current generated snapshot:
- size: 269,170 bytes;
- SHA-256: `384ddabe1977b4b959f4e6c78508eb7a3142e2c75226e2e7d8f94aaf82d2c754`.

Usage:
- open the HTML with Google Chrome;
- keep the tab visible;
- click **Clay-Bausteine messen**;
- wait about 45 seconds;
- click **Download JSON**;
- return the JSON to the Web chat.

No Terminal, local server, unsigned app, Gatekeeper bypass or Cloudflare required.

## What the result decides

We optimize only the largest measured shader cost.

Do not infer the winner from code complexity alone.

The first production optimization must:
- preserve the locked near/mid/far Clay appearance where the feature is visible;
- reduce/fade/skip work where the feature cannot be seen;
- be remeasured in the same local GPU harness;
- be compared against the Blender baked-lite reference only after the procedural state is pinned.

## Current Blender reference

Draft PR #309:
`blender-mcp/clay-perf-p0a-2026-10-01@93af8caef6a85caa1f7fd70a59abb46edf85f0a4`

Useful as K2-stage baked-lite mechanism/reference.

It is not parameter-identical to the current WC1 parity shader; no immediate rebake is requested.

## Exactly one next action

Georg runs **Clay-Bausteine messen** and returns the JSON. Then Web implements the smallest Golden-preserving optimization against the measured largest cost.
