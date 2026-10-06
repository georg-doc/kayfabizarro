# PERFORMANCE BUDGET · starting values, not canon

| Budget | Value | Where |
|---|---|---|
| chunk size | 64 m | `sw-gen.js CHUNK` |
| rings | near 1 · street 2 · district 3 · far 5 (121 slots) | `sw-world.js RINGS` |
| terrain grid per LOD | 40 / 24 / 12 / 6 segments | `sw-mesh.js TERRAIN_SEG` |
| worker jobs in flight | 3 | `sw-world.js dispatch` |
| integration per frame | ≤ 3 chunks and ≤ 4 ms (first one always) | `MAX_PER_FRAME`, prop `budgetMs` |
| materials for the world | 1 (clay) + 1 FX | |
| draw calls per chunk | 1 merged + ≤ 5 instanced | |
| promoted buildings | 4 | `CAPS.promoted` |
| cells drawn | 2200 · cell windows 1800 · doors 64 | `CAPS` |
| dynamic debris | 256, retire oldest/smallest | `CAPS.debris` |
| static rubble | 1000 ring | `CAPS.rubble` |
| chips / dust / fire | 320 / 200 / 64 rings | `CAPS` |
| rounds / rockets | 96 / 24 | `WCAPS` |
| point lights | 2, always present (no recompiles) | |
| shadow map | 1 × 2048², 190 m box following the focus | `sw-app.js` |
| compact damage state | 2 bits per cell (≈ 25 bytes for a 98-cell building) | `pack2` |

## Measured (preview iframe, background tab)
The Claude Design preview is a hidden iframe, so `requestAnimationFrame` is throttled. The bench drove fixed 1/60 s steps back-to-back and measured wall time per step (CPU + GPU submit, no vsync). These numbers say what one frame costs. They are not the frame rate in a visible tab. Re-run BENCH in a top-level tab to get vsync numbers. Draw calls and triangles include the shadow pass.

| Test | frames | avg ms | p95 ms | max ms | draw calls avg/max | triangles max | visible buildings |
|---|---|---|---|---|---|---|---|
| A world baseline | 805 | 4.97 | 8.5 | 62.2 | 228 / 228 | 1.11 M | 360 |
| B Minigun on one façade | 711 | 11.34 | 19.0 | 70.7 | 237 / 266 | 1.34 M | 225 |
| C rockets into 3 buildings | 730 | 9.07 | 15.3 | 353.4 * | 225 / 243 | 1.47 M | 230 |
| D fly away during destruction | 89 | 3.78 | 8.9 | 13.3 | 62 / 195 | 1.04 M | 182 |
| E return, reconstructed | 452 | 6.05 | 9.0 | 60.9 | 167 / 206 | 1.16 M | 212 |

Peaks across A–E: debris 150 / 256 · projectiles 5 / 120 · VFX 584 / 584 (ring at cap, oldest overwritten) · promoted 4 / 4 · cascades 14 · cells lost 127.

\* The 353 ms spike in C was the first-use compile of the cell/debris/FX shader variants. Since then all variants are warmed with `renderer.compileAsync` at start-up. C has not been re-measured after that change.

## Where the cost is
- Triangles: LOD0 window instances (72 triangles each, about 8k windows near the player) are the largest share. The next lever is a cheaper LOD0 window or fewer LOD0 rings.
- Minigun CPU (B): every round raycasts the aim ray (220 m, all chunks on the segment + terrain march). Caching the aim hit per frame would remove most of it.
