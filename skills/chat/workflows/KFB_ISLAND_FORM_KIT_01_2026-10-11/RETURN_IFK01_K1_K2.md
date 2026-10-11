# Island Form Kit 01 · K1 underside families + K2 silhouette line-up · RETURN R1

Date: 2026-10-11. Executor: Blender-Coworker (Mac mini, Blender 5.2.2 via MCP). Go: steering reply `REPLY_BLENDER_FORM_KIT_01_R1.md` (V-119, Georg 11.10.).
Scope: references only, in K2 units (H = 3.64, MC = 6.4). No runtime. Nothing in the Lab, the MVP or any other branch was changed. No purchased assets are used: all geometry is generated.

## Defects and open points first

1. **C · thick roots read as tusks.** In the side view the five main roots look more like fangs than roots. The nine thin roots do read as roots. The risk of a Scholle v6 "Würste" look is therefore not gone. Georg decides at the board.
2. **B · openings.** The cellar breach and the tunnel bore have ragged, light rims: the patch is rounded onto a circle, which stretches neighbouring faces. The pipes are small at this scale.
3. **Body fuller than the anatomy rule.** At half depth the width is 0.67–0.69 R (rule 0.59 R). The deepest point sits 0.06 R off centre (rule 0.07–0.56 R). Preset C gives only 3 spikes, at the low end of the rule. This is v7 as it is; nothing was tuned towards the rule.
4. **Spike pick differs from the browser bench.** JS uses `sort(() => R() - 0.5)`, whose order depends on the engine. The port uses a seeded Fisher-Yates pick instead. Everything else follows `buildScholle()` / `soften()` step by step, with the same RNG (mulberry32).
5. **Not included:**
   - Knete material v10;
   - terrain on the top;
   - island theme colours (V-051). Colours are the v7 preset.
6. **K2 sizes.**
   - S, M and L are the same shape at three sizes (same seed per row).
   - Depth grows with width (≈ 0.47 W, from the anatomy rule), so an L island is about 33 H deep. **Open for Georg:** keep that, or cap the depth for large islands?
   - Pole and car are present on every island but too small to see at the K2 board scale.
7. **GLB export and blend copy are not finished.** Blender stopped responding during the glTF export of the three K1 islands. The renders, metrics and scripts are complete. The GLBs follow once Blender answers again.
8. **Housekeeping.** By mistake I created an empty folder `3D ASSETS/BLENDER MCP/` at the root of `Dropbox/CLAUDE/`. It holds no files. Deleting it needs Georg's OK.

## What was built

| Part | Result |
| --- | --- |
| **Port** | `kfb_ifk01_scholle.py`: Scholle v7 `buildScholle()` + `soften()` from `scholle-bench.js` (03.10.). One mesh: flat top with bands → vertical rim → faceted inverted cone (rings 32 → 16 → 13 → 10 → 8 → 6 → 4, zipped) → apex. Spikes are pulled corners. Clay is 2× midpoint subdivision + Taubin, with the top pinned. Georg's v7 decisions are kept: soft over facets, no stone band, no base plate. |
| **K1 · A anatomy baseline** | v7 preset C "Garten" at 20 MC (128). Closed mesh, 6,944 triangles (434 facets before clay). |
| **K1 · B blasted clod** | A + strata bands (topsoil, clay, sand, rock, deep rock) with terraced flanks + 3 flat fracture faces (fresh, lighter rock) + 2 pipes, a cellar breach and a tunnel bore. All are cut into the same mesh and face the side camera. Closed, 7,848 triangles. |
| **K1 · C root ball** | A + strata + 5 thick and 9 thin roots. They start in the topsoil just below the rim and hang down: base flare, kinks, slow taper, closed tips. They are extruded out of the body, never attached. Closed, 8,808 triangles. |
| **K2 · silhouettes** | 6 plan outlines (round, long 1.9 : 1, bean, twin, stepped plateau with a +1 MC inner terrace, 7-edge shard with a deeper body) × S 12 MC / M 20 MC / L 40 MC (equal-area diameters). All 18 are closed meshes. |
| **Checks** | Every island is measured against `ISLAND_ANATOMY_RULES.md`: depth/W, plate/W, taper at 0–100 %, spikes, offset of the deepest point, triangles, non-manifold edges (0 for all 21). |
| **Cameras** | K1: one side camera (ortho, 12°) for A, B and C; an underside 3/4 view (22° from below); a top view. K2: one fixed scale for all 18 (side full scale, top half scale). |

Measured K1 values (rule: depth 0.43–0.52 W, plate 0.013–0.041 W):

| | depth/W | plate/W | width at 50 % | spikes | triangles |
| --- | --- | --- | --- | --- | --- |
| A baseline | 0.47 | 0.028 | 0.69 R | 3 | 6,944 |
| B blasted | 0.47 | 0.027 | 0.67 R | 8 | 7,848 |
| C roots | 0.42* | 0.025 | 0.96 R* | 17* | 8,808 |

\* The roots count as body in the measurement.

## Files (this folder)

| File | What |
| --- | --- |
| `K1_UNDERSIDE_BOARD.png` | A / B / C: side view (same camera), underside 3/4, top, measured values |
| `K2_SILHOUETTE_BOARD.png` | 6 outlines × S / M / L at one scale, scale bar |
| `K1_metrics.json`, `K2_metrics.json` (`kfb.island-form-kit/1`) | measurements per island, plus the anatomy ranges |
| `ifk01_params.json` | everything needed to rebuild: preset, families, outlines, sizes, seeds |
| `kfb_ifk01_scholle.py` | the port and the families (Blender) |
| `k_boards.py` | board composition |
| local only: `renders/K1/*`, `renders/K2/*` | 9 + 36 single renders |

## For Georg (at the boards)

1. **K1:** A, B or C, or a mix? For example B's strata and openings plus C's thin roots only.
2. **K1 · C:** keep the thick main roots, or drop them?
3. **K2:** which outlines go into the island vocabulary? Should depth grow with width, or be capped for L?

## Next gate

Georg chooses at the boards. Then:
- K3: transition golden references (island edge with a Track Core road, J17 look, three seam treatments);
- the Lab generator matches the chosen form.
