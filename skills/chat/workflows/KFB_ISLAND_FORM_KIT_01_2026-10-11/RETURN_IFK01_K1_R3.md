# Island Form Kit 01 · K1 R3 · clay island base after IB1–IB3 · RETURN

Date: 2026-10-11. Executor: Blender-Coworker. Built with Blender 5.2.2 in the cloud workspace (`bpy`).
Brief: `BRIEF_FROM_STEERING_R3_INSELBODEN.md` (V-142). References: `REFS_INSELBODEN_2026-10-11/IB1–IB3`.

Scope: references only. No Lab wiring, and no purchased assets: all geometry is generated.

## Defects and open points first

1. **The blind critic against IB1–IB3 did not pass.**
   - Round 1: A 4 · B 4.5. Round 2: A 4.5 · B 5. The pass mark is 8.
   - Two rounds are done, so I stopped here (stop rule). Georg decides at the board.
2. **What the critic still sees in the form (geometry):**
   - **Silhouette:** it reads like a plate on a stalk. The body narrows too early. Wanted: about 0.7 of the top width at half depth, then a blunt, rock-heavy tip of 0.2–0.25 W.
   - **Underside:** a flat "tongue" slab still shows in the underside views of both variants.
   - **Clods:** they read as stacked horizontal pillow slabs (shelves). Wanted: 40–70 rounded nodules with deep crevices between them.
   - **Rocks:** they look too round and clean. Wanted: bigger, flattened, fractured plates, half buried, with earth lapping over their edges.
   - **Niches:** they read as clean ovals ("Swiss cheese"). Wanted: 2–4 irregular overhang caves just under the rim.
   - **Top:** still quite empty. It needs more and bigger stone groups and raised moss patches.
3. **What the critic sees in material and light.** This belongs to the Lab / God-Mode layer, not to geometry.
   - The orange is too saturated and too even.
   - The pores are a texture only (bump), and the cavity AO is weak.
   - The light is flat and frontal.
   - There is a pale seam where rock meets earth.
   - The moss balls are evenly lit.
4. **Conflict with V-152, which arrived during the build** (`NOTE_FROM_STEERING_R3b_INSELBASIS.md`). The rule is "one cohesive terrain mass … never separate rock balls".
   - **Conflicts:** the half-embedded boulders, especially A's 7 boulders toward the tip, still read as single rock balls.
   - **Fits:** the rock band is closer, because its slabs are fused into the earth.
   - **Next round:** drop the single boulders and keep the grey rock only as modelled-out rock parts and bands of the same mass.
5. **Roots dropped.** Georg's call on 11.10. ("will surely fail"). The root code stays in the generator with `roots=0`.
6. **Depth** is 0.57 W including the tip, above the anatomy rule of 0.43–0.52 W. That suits IB1/IB2 better.
7. **Material** is vertex colour plus a procedural Cycles shader (pits, cracks, AO). The GLBs carry the vertex colours only. Pits, cracks and AO do not travel with them.

## What was built

| Part | Result |
| --- | --- |
| **Base** | The Scholle v7 port (R1, preset C, 20 MC = 128), **not** the R2 blocks. Warped to a steady taper that is widest right under the rim, then remeshed and smoothed so the v7 facets and spike fins are gone. |
| **Clay clods** | Lumpy chunks in 7 overlapping tiers. Flat cuts give a flat underside (a ledge with a shadow line) and a flat-ish front. Small rim chunks sit flush with the top outline, so the earth rounds into the top. 4 lobes make a blunt, off-centre tip. |
| **Rocks** | A rock band of big faceted slabs that stick out 0.02–0.035 W; earth may spill over them from above. It covers 33 % of the rim in A and 65 % in B. Half-embedded faceted boulders sit mostly toward the tip (A: 7, B: 4). Rock vertices are projected back onto their faceted source, so the facets stay crisp. |
| **Moss** | Clumps of 3–12 balls on about 70 % of the rim, with gaps of bare earth. About a third hang down as curtains. There is a little moss in the niches. |
| **Niches** | One larger soft hollow and 4 small pockets, cut into the body before the clods go on. Each has pebbles on the floor. |
| **Top** | Sandy ground. 4–5 stone groups (1 big stone and 2–4 small ones) ringed with moss, plus moss patches and pebbles. |
| **One mesh** | Body, clods, rocks and moss are joined and fused by **one** voxel remesh (0.3), then lightly smoothed and decimated to 160k triangles. Per island: 1 object, 1 shell, open edges 0, non-manifold edges 0 (V-136). |
| **Colour** | Per vertex, from the nearest source part: clay (ochre-orange, darker with depth), rock (warm grey), moss (yellow-green), sand. |
| **Scale** | K2 units. A figure 1 H tall (red) and a car 6 × 2.9 (blue) stand on the top. They are separate objects, not part of the island mesh. |

Measured:

| | width | depth/W | triangles | boulders | band slabs | niches | open / non-manifold |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | 21.4 MC | 0.57 | 160,000 | 7 | 5 | 5 | 0 / 0 |
| B | 21.4 MC | 0.57 | 160,000 | 4 | 10 | 5 | 0 / 0 |

## Files (this folder)

| File | What |
| --- | --- |
| `K1R3_CLAY_BOARD.png` | IB1–IB3 on top; A / B in side view (same camera), underside 3/4 and 3/4 from above; 5 details (rim, boulder, niche, short band, long band); measured values; critic notes, split into form vs material/light |
| `IFK01_K1R3_A_M20MC.glb`, `IFK01_K1R3_B_M20MC.glb` | reference GLBs with vertex colours |
| `IFK01_K1R3_A.blend`, `IFK01_K1R3_B.blend` | the build scenes, with the full Cycles material and the scale props |
| `K1R3_A_metrics.json`, `K1R3_B_metrics.json` | the measurements |
| `kfb_ifk01_r3_clay.py`, `r3_render.py`, `k1r3_board.py` | generator (needs `kfb_ifk01_scholle.py` from R1), render script, board |

## For Georg

1. **Direction:** do clay clods + rock band + moss clumps fit the base you want? Which is the base, A (boulders, short band) or B (long band)?
2. **Next geometry round:** go for the critic's form points? These are the taper at half depth, round nodules instead of shelves, flat fractured rock plates, and overhang caves instead of ovals. Or is the form good enough, so the remaining work goes to material and light in the Lab?
3. **Depth:** 0.57 W is deeper than the anatomy rule. Keep it, or pull it back to about 0.5?
