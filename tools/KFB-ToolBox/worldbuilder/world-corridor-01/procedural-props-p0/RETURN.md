# RETURN · WC1 Procedural Props P0

Status: **SOURCE-ISOLATION PASS · INTEGRATION CANDIDATE FROZEN AFTER TWO REPAIR PASSES**
Date: 2026-10-01

## Result

The Hivebound-style asset-light method is technically viable in isolation and its actual soft-form grammar is substantially better than the intentionally crude first translation.

A bounded WC1 + Clay002 integration candidate was mounted successfully far enough to prove:
`WC1 boot → Clay002 → procedural prop mount`.

The hosted SwiftShader gate cannot complete the post-mount frame measurement, and two repair passes are exhausted. Therefore no integrated PASS, no KFB visual acceptance and no performance verdict are claimed.

## Exact state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-props-p0-2026-10-01`
- Draft PR: #311
- base: `chatgpt-web/world-corridor-01-2026-10-01@1eeba2c573c8ff764cc8151ac92b241811e8bab2`
- frozen tested candidate: `94443824e6b13f38c611defd06dacedd7c6d0faa`
- Stage: none
- merge: none

## Donors

- Hivebound: `zernonia/hivebound@be10166e44f3d89db922ebb90671c10b89cd3e62` · MIT · procedural-geometry pattern donor.
- Claude Mascot Style Gallery: `henrik-thevibe/Claude-Mascot-Style-Gallery@0c7f2de521dd49eb402b01db9e6b9cb4c6d0c603` · MIT · workflow/style-adapter pattern donor only.

## Evidence

P0:
- 3 families / 48 instances / 7 calls / 6,826 tris
- browser PASS
- run 36906220603 / job 110517315973

P0B:
- 3 families / 48 instances / 7 calls / 40,354 tris
- browser PASS
- run 36907603447 / job 110521959500

Integrated Repair Pass 2:
- run 36911209819 / job 110534004159
- WC1 boot PASS to API return
- Clay002 activation PASS
- P0B mount PASS
- last marker `prop-mount-done`
- Burg eligible placement: 0 tuft / 7 pebble / 11 tree
- final readiness/frame-delta gate FAIL under SwiftShader

## Protected owners unchanged

WB2 / WC1 renderer-world owner; Track Core; Race/Ground movement; Resident/KayKit/FrizzleBob authored hero assets; current Clay002 material path.

## Files added/changed in this slice

- `.github/workflows/wc1-procedural-props-p0.yml`
- `tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-props-p0/source-isolation.html`
- `.../source-isolation-soft.html`
- `.../procedural-props-p0b.mjs`
- `.../integration-wc1-clay002.html`
- `.../qa/source-isolation.mjs`
- `.../qa/source-isolation-soft.mjs`
- `.../qa/integration-wc1-clay002.mjs`
- `.../TEST_REPORT.md`
- `.../P0B_TEST_REPORT.md`
- `.../INTEGRATION_STATUS.md`
- `tools/KFB-ToolBox/worldbuilder/world-corridor-01/clay-perf/hex-archipel.r2c-partsdiag.js` — additive diagnostic mount seam only.

## Unresolved

- KFB visual acceptance in the real island;
- representative local frame delta;
- production placement/density grammar;
- whether to turn style into a narrow adapter matrix;
- one HTTP 404 in the integrated CI page, non-blocking through prop mount.

## Exactly one next gate

Fresh slice: representative **local visible Chrome WC1 + Clay002 + P0B proof** from frozen candidate head, using local Measure / Copy JSON and no hosted-SwiftShader frame acceptance.
