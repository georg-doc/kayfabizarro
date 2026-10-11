# Coconino R4 · step 2 · island J1 "Sunset Mesa Serpentine" · RETURN

Date: 2026-10-12. Executor: Blender-Coworker. Built with Blender 5.2.2 (`bpy`) in the cloud, plus scikit-image marching cubes.
Brief: `BRIEF_FROM_STEERING_R4_COCONINO.md` (V-167), step 2.

Gate: Georg's verdict on step 1, round 3 was PASS with tune later (`VERDICT_GEORG_CC_R4_STEP1_R3.md`). That verdict also set the embedding pattern: structures stand in the terrain, never set on top.

## Defects and open points first

1. **The blind critic did not pass.** It judged against CC2 (J1) / ME1 / ME2. Round 1: 4. Round 2: 4. The pass mark is 8.
   - Two rounds are done, so I stopped here (stop rule). Georg decides.
2. **Form still open:**
   - **Top:** it reads as a shallow dish with a raised rim. The right-hand terrace reads as a pale flat slab with a straight edge, which comes close to a lid. Wanted: an irregular stepped plateau edge (2–3 terraces) with no continuous edge.
   - **Road:** only one long S-bend climbing onto the terrace. Wanted: a longer serpentine across the whole island, climbing beside the mesa.
   - **Underside:** cohesive and layered, but the layers are too even (pancakes) and the overall shape is a spinning top. Wanted: shallower (about 0.6×), varied layer thickness, vertical fractures cutting the layers into blocks, and 2–3 hanging lobes instead of a nub.
   - **M02:** still the box column. Its taper and secondary spire belong to the module tune Georg already noted.
3. **Material and light still open:**
   - **Mesas:** the strata tones on the mesas are too weak. They should stay without lines.
   - **Sand:** too pale and fine-grained.
   - **Top surface:** a waffle artefact (decimation plus nearest-grid colour lookup).
   - **Light:** too flat.
4. **The road is a placeholder only.** A flattened grey band (half width 5) with cut-and-fill banks and no piers.
   - The centre line is delivered as 25 Empties `TRACK_ANCHOR_00…24`, plus `SOCKET_track_entry` / `SOCKET_track_exit` and `CC_J1_track_anchor.json`.
   - Entry at about +0.8, exit at about +7.4 (onto the terrace), so they sit at different heights.
   - Track Core builds the real J17 road in the Lab.

## What was built

| Part | Result |
| --- | --- |
| **One SDF, one mesh** | Island clod, ground, terrace, rim rocks, both mesas and the road band form one signed-distance field, meshed once. Width 20.9 MC. One closed mesh, open 0, non-manifold 0. 260k triangles. |
| **Mesas** | M03 (bench mesa) and M02 (needle butte) are taken unchanged from round 3: `kfb_cc_mesa_v2.py` is executed in island coordinates. Their sand aprons are the island ground (embedding pattern). Clipped to the island outline. The road band is kept clear. |
| **Ground** | Gentle undulation. A middle terrace front-right at about +7 with a gullied edge. Rock outcrops break through the rim on part of the edge. |
| **Underside** | An inverted cliff-and-bench clod, depth 0.43 W. The strata ledges dip and wave around the island, so they are not concentric rings. Sparse joints, two blunt lobes, plum-grey at the bottom. No separate rocks (V-152). |
| **Colour** | Soft strata tones (no lines), warm ochre sand, rock-ochre terrace top, grey road band. The clay sandstone shader from round 3. |
| **Sockets** | `SOCKET_track_entry`, `SOCKET_track_exit`, `SOCKET_M03_plateau_top`, `SOCKET_M02_plateau_top`, `SOCKET_viewpoint_front`. Track anchors as Empties. |

## Files (this folder, added)

| File | What |
| --- | --- |
| `CC_J1_BOARD.png` | CC2 (J1 half) and ME2; J1 in Hero 3/4, side, underside 3/4 and top; measured values; critic notes |
| `KFB_CC_J1.glb` | one closed mesh with vertex colours, sockets and track anchors (Empties) |
| `KFB_CC_J1.blend` | build scene, with the full shader and scale props |
| `CC_J1_metrics.json`, `CC_J1_track_anchor.json` | measurements; track centre line (x, y, z) with half width |
| `kfb_cc_j1.py`, `j1_render.py`, `j1_board.py` | island generator (needs `kfb_cc_mesa_v2.py`), render script, board |

## For Georg

1. Is the direction for J1 right: one clod, embedded mesas, layered underside, road placeholder?
2. Next: another J1 round on the form points (stepped plateau edge, longer serpentine, block-cut underside)? Or the mesa tune first, then J1?
3. Then the R3 island-base tune on variant A.
