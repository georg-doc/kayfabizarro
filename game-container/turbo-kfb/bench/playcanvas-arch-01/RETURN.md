# PC-ARCH-01 · RETURN

Date: 2026-09-29  
Status: **FROZEN RECOVERY · REAL-BROWSER BASELINE NEXT**  
Owner: `georg-doc/kayfabizarro`

## Branch / heads

- branch: `chatgpt-web/playcanvas-arch-01-2026-09-29`
- implementation frozen at: `a072514f111ebf6068606fbf06a017f33f617102`
- current recovery/documentation head before this Return: `19880a3a48666649e8378cb4ae59368d8fd2c0fa`
- PR: none

## Goal

Understand the cheapest useful PlayCanvas world architecture before adding KFB assets.

The bench compares independent 3D Entities against hardware instancing at controlled counts, with optional shadows and device-pixel-ratio cost.

## Implemented

- PlayCanvas Engine pinned at `2.22.4`
- minimal `AppBase` host
- WebGL2
- one camera + one directional light + one ground primitive
- shared-material box grid
- independent Entity mode
- hardware-instanced mode
- counts 0 / 100 / 250 / 500 / 1000 / 2000
- shadow toggle
- device-pixel-ratio toggle
- mouse orbit / wheel zoom
- visible metric panel
- automatic sweep UI

No KFB 3D asset is loaded.

## Why it is frozen

The bench boots under GitHub Chromium/SwiftShader, but its PlayCanvas `AppStats` telemetry remains zero in that headless path.

Observed after repair 2:
- render frames advanced: 5
- timer samples: 24
- reported frame ms: 0
- reported CPU render ms: 0
- reported draw calls: 0
- reported VRAM: 0

Two repair passes on that same telemetry gate are exhausted. No repair 3.

## Actual tests

- run #1: `36594694953` · FAIL
- run #2: `36594838998` · FAIL
- run #3: `36595058236` · FAIL

Stable infrastructure checks on #2/#3:
- sparse checkout PASS
- syntax PASS
- browser install PASS
- local HTTP PASS
- app-ready / WebGL source gate PASS

Named assertions actually reached on the final run:
- 3 PASS
- 1 FAIL
- remaining 19 NOT RUN

Full report: `TEST_REPORT.md`

Recovery: `recovery/RECOVERY.md`

Manifest: `recovery/EXPORT_MANIFEST.json`

## Protected owners

Unchanged:
- Turbo/Kart runtime
- Race v0.8 / Free-Roam physics
- Ground / Orbit / locomotion
- T4 / TD03
- WorldBuilder
- Residents / Cards

## Stage

A real-browser Stage is the intended next surface because representative-device metrics are the acceptance target.

Until the exact Cloudflare route is published and opened, Stage status is **NOT DEPLOYED**.

Planned:
`https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-arch-01/`

## Exactly one next gate

**PC-ARCH-RB01 · REAL-BROWSER BASELINE**

Publish the frozen bench unchanged and gather a representative-browser snapshot for Entities vs Instanced before adding one real GLB or any physics.
