# PC-ARCH-01 · RETURN

Date: 2026-09-29  
Status: **PUBLIC_VERIFIED SOURCE/BOOT · REAL-BROWSER DEVICE BASELINE NEXT**  
Owner: `georg-doc/kayfabizarro`

## Branch / heads

- branch: `chatgpt-web/playcanvas-arch-01-2026-09-29`
- implementation frozen at: `a072514f111ebf6068606fbf06a017f33f617102`
- current owner head before this Return update: `7f76ce8a9ff9966ce45c37090b2c9be65ae288ce`
- PR: none
- publication branch: `cloudflare-live@d61eb7c45bb2b9a947ece4574db1d38fafa56abf`

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

## Headless telemetry recovery

The bench boots under GitHub Chromium/SwiftShader, but its PlayCanvas `AppStats` performance telemetry remains zero in that headless path.

Observed after repair 2:
- render frames advanced: 5
- timer samples: 24
- reported frame ms: 0
- reported CPU render ms: 0
- reported draw calls: 0
- reported VRAM: 0

Two repair passes on that same telemetry gate were exhausted. The headless performance gate is frozen; no repair 3.

## Actual local/headless tests

- run #1: `36594694953` · FAIL
- run #2: `36594838998` · FAIL
- run #3: `36595058236` · FAIL

Stable infrastructure checks on #2/#3:
- sparse checkout PASS
- syntax PASS
- browser install PASS
- local HTTP PASS
- app-ready / WebGL source gate PASS

Named assertions actually reached on the final local run:
- 3 PASS
- 1 FAIL
- remaining 19 NOT RUN

Full report: `TEST_REPORT.md`

Recovery: `recovery/RECOVERY.md`

Manifest: `recovery/EXPORT_MANIFEST.json`

## Public Stage proof

Direct Stage:

`https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-arch-01/`

Public proof workflow:
- run: `36596233422`
- attempt 1: FAIL during deployment propagation; child `SOURCE.json` returned root fallback HTML
- attempt 2: **SUCCESS with no code change**
- successful job: `109504616254`
- proof head: `81eb98469cbf46976f82409f208685bb60dfad0d`
- artifact: `11045904163`
- artifact digest: `sha256:e4430fb2f565ee7235c6490017925bce09173cc3bc1eff97b4b074de4454f76f`

Verified on the exact public route:
- expected `SOURCE.json` marker returned
- frozen implementation head matches `a072514f...`
- PlayCanvas engine reports `2.22.4`
- public browser reaches ready state
- Entity control present
- Instanced control present
- 2000-count control present
- Hub card present
- page errors: 0
- console errors: 0

This proves public source delivery and browser boot. It does **not** establish representative-device performance numbers.

## Protected owners

Unchanged:
- Turbo/Kart runtime
- Race v0.8 / Free-Roam physics
- Ground / Orbit / locomotion
- T4 / TD03
- WorldBuilder
- Residents / Cards

## User correction · 2026-09-29

The primitive cube bench is **diagnostic evidence only** and must not become a world foundation, asset strategy or new authoring path.

Georg explicitly rejected the implication that KFB should now be rebuilt upward from cubes.

Correct architecture direction:
- start from the **complete existing PlayCanvas Vehicle Physics donor**;
- preserve its working vehicle, camera, controls, reset and physics;
- instrument and decompose that donor in place;
- measure what the donor already costs;
- disable/remove donor subsystems and scene groups one at a time to identify cost;
- only after that, swap in real existing KFB/T4 assets one bounded family at a time.

Do not create a primitive replacement world.

## Superseded next gate · 2026-09-29

Georg rejected primitive/cube benchmarking as a product foundation.

The real donor path is now completed in:
`game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/RETURN.md`

Result:
- exact Vehicle Physics public runtime captured;
- 42 runtime files / 22,054,130 bytes;
- self-host 11/11 PASS;
- public KFB Stage 11/11 PASS;
- `https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-donor-01/`

This primitive bench remains **archived diagnostic evidence only** and is no longer a current human/product gate.

## Exactly one current next gate

**PC-LOOK-01 · TEXTURE / MATERIAL ONLY**

Start from immutable Donor-01. Do not modify physics, camera, controls, collision or geometry yet.
