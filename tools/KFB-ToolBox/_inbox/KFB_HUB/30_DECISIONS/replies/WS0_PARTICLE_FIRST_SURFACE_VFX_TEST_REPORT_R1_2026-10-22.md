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
