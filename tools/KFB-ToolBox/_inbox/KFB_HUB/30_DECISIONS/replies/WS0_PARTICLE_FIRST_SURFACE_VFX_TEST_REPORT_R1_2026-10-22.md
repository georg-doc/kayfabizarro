# WS0 · Particle-First Surface VFX · Source Audit + Future Acceptance Matrix · R1

**Date:** 2026-10-22. **Status:** DOCUMENTATION QA, NOT VISUAL OR GAMEPLAY ACCEPTANCE. 
**Owner:** WS0 existing terrain register / WS1b receiving runtime. 
**Primary design:** `WS0_PARTICLE_FIRST_SURFACE_VFX_R1_2026-10-22.md` on `docs/kfb-decisions-register-2026-10-11`.

## Source-read evidence

Verified from the **existing WS1 mirror** `ws1/terrain-439@4df9362a156fabb32411a960915e38d3a68ae224` (read only):
- `ws1/kfb-planet/src/modules/vehicleRig.js` blob `b7ec3fcbdb5da92cc99195f90c3d53258429b471`, 160 pooled points, existing `dustStep`, `groundAt/groundColorAt`, source-specific opacity/rate/lifetime/height gates.
- `ws1/kfb-planet/src/m2/racerRig.js` blob `78c7165acf1e96261b1507abdce84c2d51a08e71`, current dust color from height/slope rather than organic Color Field source roles.
- `ws1/kfb-planet/src/m2/k2t.js` blob `1a09a6d700754f631492a3639919965d26f20efa`, **existing `S.drift = d.driftDir * d.drift`** and `S.lateral` source in authoritative vehicle state.
- `ws1/kfb-planet/src/m2/M2Car.jsx` blob `0897a3c60290499d5154c51fd918c4641ecee1a0`, already pulls `sg = signals?.()` and forwards ground+speed into `R1.update`, but **not drift**.
- `ws1/kfb-planet/src/vendor/vfx/kfb-flight-vfx.js` blob `be9cbb90ed1f191decc5328aefc793405a560e71`, donor `skim=240`, `puff=40`, water condition and separate VFX module, **not proof both pools currently run simultaneously**.
- `ws1/kfb-planet/test/unit/vehicleRig.mjs` blob `13d620e61a73a0caa0643ec2c83290fbca1c68cd`, source has `dustNearGroundOnly` and `fixedDrawCalls` existing tests. **Not rerun** in this turn.
- `ws1/kfb-planet/src/world/perfBudget.js` blob `ffad75cf7d63835ac4c06d6d2740943e9d369184`; `WS1_STATUS.md` on `ws1/r3f-frame` blob `0f579abab4d74ce09d1136b33e76f5cd9550e9be`; baseline performance already constrained.

**External technical docs consulted, not incorporated as third-party code:**
- https://threejs.org/docs/pages/PointsMaterial.html (point size hardware caps).
- https://threejs.org/docs/pages/Material.html (depthTest/depthWrite/alpha handling).
- https://threejs.org/docs/pages/PointsNodeMaterial.html (WebGPU backend points may only be 1 px; *not* an invitation to replace the current renderer).
Visual source: **user's supplied** TopologyAI clip frames. Shortlink/post authorship and code usage not independently verified.

## Actually executed GitHub source-text/editorial assertions

**14/14 PASS, 0 FAIL.** Exact design document blob `bd0f190326ff65771ea45d5ede91eed80e0a5707` read from register branch, and 4 source snippets from WS1 mirror + existing test. Checks actually executed in this chat:

1. original vehicleRig pool=160;
2. separate skim donor=240 recorded;
3. procedural sculpted clay clouds prohibited;
4. `k2t` genuine drift signal present;
5. `M2Car` can read shared signals;
6. `M2Car → vehicleRig` has no drift argument yet;
7. initial candidate retains fixed original pool;
8. palette role bound to actual receiving surface;
9. no colored sand passing as water spray;
10. actual 3D shadows preserved and distinct from VFX;
11. existing ground-only dust test source located;
12. single next gate preserved;
13. reversible baseline/original/candidate A/B recorded;
14. NOT IMPLEMENTED status present.

**This is textual provenance QA, not a test of image quality, rendered trajectory, correct point overlap, color output, or runtime reliability.** No new functional tests were executed.

## Future three-condition visual QA (execution proposal, not run)

| Case | Set-up | Required readout |
| --- | --- | --- |
| A: sand/drift | Real existing Racer on Canyon surface. Straight → Q/E drift → release → braking. Identical 6–10s motion replay/seed; side/chase + overhead. | Wake follows past path in world coordinates; no big round sprite disks, blobs or stock smoke; recognizably stronger during actual drift |
| B: actual water | Same source car / true water surface, owner-approved water support/wake; compare identical contact/speed pattern. | Short ballistic sprays, water-tinted particles, correct cutover from soil, no dust cloud, no fabricated fluid mesh, water ripple owner unchanged |
| C: grass/soil/biome transition | Real material transition + same camera/velocity/ground sample; height/slope alone intentionally misleading to smoke out heuristic. | Tint follows real surface palette, not terrain height, no seam-colored stripes; landing/contact/Racer shadow unchanged |

**Capture/telemetry:** off vs original vs candidate (same seed/render backend/resolution/time of day), frame p50/p95 (actual target GPU), `renderer.info.render.calls`, observed live particle count vs 160 cap, draw call stability, alpha overdraw in near-camera view, source material role at sample point, unit dust height-gate, drift signal value, restart/respawn no stale particles. Existing KFB World/Racer performance gates apply; no invented "5% GPU increase" PASS.

**Potential failures/decisions to research:** actual material-role lookup from Organic Color Field/Stage (API currently unpinned), depth/fade and transparency/sorting with small point sprites, point-size caps across Apple Safari/WebGL, existing water owner/ripple integration, optional fallbacks at low frame budget.

## Scope / actual counts / next gate

- Docs/source checks: **14/14 PASS**, first document commit exact GitHub head/blob re-read `06636f109b848e14bfe6b7e24a2f5bdbe921bea0`, extended source/drift addendum exact head/blob re-read `e7b3b8534ac2d1a45526485b0083b11becf29e9a`.
- Runtime unit/CI/new Browser or GPU tests: **0**. New real visual capture/screenshots: **0**. No KFB Stage/Site work, no merge.
- **One next gate:** WS0 routes a source-isolated baseline and a bounded WS1b same-scene A/B only if it fits the existing #439 terrain owner priority. The visual behavior must be approved, not derived from passing source-text checks.


---

## 2026-10-22 · R1.1 additional source-gap closure: material/role sampler + point pixel cap

**New file:** `WS0_PARTICLE_FIRST_VFX_SOURCE_BRIDGE_R1_2026-10-22.md`, verified creation at `9982ee1a08ed24be716a963778d6d444008f2722`, blob `f9e8113a3915b7639bc22ec9b00c8284519c65fc`.

### Additional actual source-text checks (17/17 PASS, 0 FAIL)

One GitHub source-read audit executed 17 assertions over these exact paths on `ws1/terrain-439@4df9362a156fabb32411a960915e38d3a68ae224`:

| # | Executed assertion | Result |
| --- | --- | --- |
| 1 | `terrain2Palette()` exported | PASS |
| 2 | `terrain2` XZ world-organic field sampled in shader | PASS |
| 3 | `terrain2` cliff wall-chart projection present | PASS |
| 4 | no exported `terrain2ColorAt` per-pixel CPU sampler in source | PASS |
| 5 | `terrain3.flowBands` includes normalized height `hn` | PASS |
| 6 | `terrain3.flow.downhill=true` in actual JSON | PASS |
| 7 | `terrain3` field is time-updated | PASS |
| 8 | `m1-terrain.surfaceAt` is mesh-triangle **height**, not material identity | PASS |
| 9 | current `terrainDustColor` is height/slope heuristic | PASS |
| 10 | Racer call feeds that heuristic as `groundColorAt` | PASS |
| 11 | Racer dust pool cap remains 160 | PASS |
| 12 | `gl_PointSize` has no explicit `min(maxPx,...)` clamp | PASS |
| 13 | fragment shader uses radial alpha mask | PASS |
| 14 | real signed `k2t.signals.drift` exists | PASS |
| 15 | Racer call does not yet pass drift argument | PASS |
| 16 | actual Racer `vehicle-rig-dust` point output present | PASS |
| 17 | `createTerrain` dispatches both `applyTerrain2` and `applyTerrain3` variants | PASS |

New reviewed blob SHAs:
- `src/look/terrain2.js` `9ef477bb018975a10b5ff575b48525156317dfb9`
- `src/look/terrain3.js` `f5571573eafa16c4b1335ca3fea128e27b0e6e36`
- `src/data/looks/kfb-terrain2.r1.json` `9a87d3f28f2cfa644c1896ae283da0fa89cbbc7e`
- `src/data/looks/kfb-terrain3.r1.json` `3267bfa11d5a13db569dad6aa047c25d2f92d649`
- `src/modules/m1-terrain.js` `75f582f7e8f7d0a9582207990465eaff09272cbe`
- `src/vendor/palette/kfb-cartoon-palette.js` `ab328bc0fda4bc5b918e0e08a88e51df445282db`
- `src/data/looks/kfb-colorscript.r1.json` `2aaaa4824052916dd942561a9b7223e365dc7c22`

**New findings:** terrain2 source offers palette roles but no CPU-local exact pixel role lookup; terrain3 is intentionally animated and height-coupled (current §115 WS1_STATUS, 21 Oct) – **not** an interchangeable coloring function. No verified material-kind water sampler in `m1-terrain.surfaceAt`. The point sprite shader has a close-camera disc/overdraw hazard; screenshot+real GPU tests still required.

These **17/17 are additive editorial/source assertions**, not unit tests. Prior **14/14** checks were not rerun by this additional batch; do not report as a single 31/31 suite. Actual runtime/visual/CI/GPU test count for this update remains **0**.

**Existing one next gate unchanged:** WS0 selects currently active real WS1b look/source receiver and isolates original Particle-First donor before reversible same-scene visual/GPU A/B. No new Site/Stage/merge or mandated priority.
