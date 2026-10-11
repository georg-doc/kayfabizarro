# Coconino Mesas R4 · step 1 · round 3 "grown, not baked" · RETURN

Date: 2026-10-11. Executor: Blender-Coworker. Built with Blender 5.2.2 (`bpy`) in the cloud, plus scikit-image marching cubes.

## Why this round

Georg's verdict on rounds 1–2 (`RETURN_CC_R4_STEP1_MESAS.md`, 11.10. evening):
- **Baked, not grown.** Columns pulled up to different heights with a lid on top. "The worst possible way to form terrain."
- **No hex-plate thinking**, no rounded lids, no straight white lines.
- **Natural terrain wanted.** It should follow the growth pattern and geology of mesas, read as a cartoon (Road Runner / Coyote deserts), thin upward, and have arches under the mesas.
- **Sand must behave like sand.** It blows away and runs downhill; no glued-on balls.
- **More cartoon logic** in form design.

The research behind this round is in `RESEARCH_CC_R4_MESA_FORM.md` (mesa geomorphology, Monument Valley, arches, talus and scree, Maurice Noble's Road Runner deserts, and the rules derived from them).

## Defects and open points first

1. **The blind critic did not pass.** It judged against CC1 / ME1 / ME2 plus Georg's intent.
   - Round 1: M01 4.5 · M02 3.5 · M03 5.5. Round 2: M01 5 · M02 4.5 · M03 5. The pass mark is 8.
   - Two rounds are done, so I stopped here (stop rule). Georg decides.
2. **Form still open:**
   - **M01 arch:** it reads as a wall leaned against the mesa. The top is flat and straight, the plan is rectangular, and there is a seam to the body. Wanted: a thick promontory that grows out of the body, with an uneven top and a bent plan.
   - **Gullies:** too even and too shallow, which gives a "melted" look. Wanted: varied depth and spacing, alcoves, buttresses, and short broken ledges.
   - **Foot:** a horizontal rock/sand line with regular sand peaks. Wanted: a rock-coloured talus skirt between cliff and sand, boulders at the toe of each debris cone, and softer wind drifts.
   - **M02:** wants a wider stepped rock base (2–3× the spire's width) with 2–3 secondary fingers. Right now it is a box column straight out of the sand.
3. **Material and light still open:**
   - **Tops:** the tops and the M03 bench are in sand colour, so in the front views they read as a light "lid". They should be rock-orange, with sand only in hollows.
   - **Strata:** too evenly spaced. **Sand:** too pale, with no AO and no rock bleed at the contact.
   - **Light:** the raking low light from the mood images is still missing.
4. **Rounds 1–2 stay unchanged** on the branch (`KFB_CC_M0x.*`). This round is added as `KFB_CC_M0x_R3.*` (additive).

## What changed in the build

| Part | Result |
| --- | --- |
| **One SDF per module** | No more parts glued together. Every module is a single signed-distance field, meshed once (marching cubes, voxel 0.3), lightly smoothed and decimated. One closed mesh: 1 shell, open 0, non-manifold 0, flat base at z = 0. |
| **Grown mass** | Horizontal strata mass. The top is where the hard layer ends, with a rounded rim: no lid, no slab. The radius never grows with height, so there is no overhang and every form thins upward. Taper `1 − lean·t^0.75`, with one side retreating more. Soft strata set-backs. |
| **Cliffs** | Irregular gullies (joints): deep at the foot, fading upward, some stopping short of the top. The ribs between them read as buttresses. Vertical streaks suggest rain-washed sandstone. Plan outlines have lobes and concave bays. |
| **M01** | Flat-top mesa, with an arch in a fin that runs out from one lobe. The opening sits low (soft-layer undercut) and the legs flare into the talus. |
| **M02** | Needle butte: a faceted, tapering main spire with a broken, slanted top, plus three shorter secondary spires fused at the foot. |
| **M03** | Cliff-and-bench: the lower cliff, then a soft-layer bench, then the upper cliff, shifted toward the back so one side is nearly flush. |
| **Sand and talus** | A height field rather than parts. One debris cone per gully mouth at 33° (angle of repose), concave. The cones merge into an apron that runs out longer on the lee side (wind). Fallen blocks are graded (big at the cliff foot, small farther out), half buried, and sand banks against them. The sand gets almost no surface noise (wind-smoothed). |
| **Colour** | Soft, warped strata tones (deep red, red, red-orange). No light lines and no light top band. Sandy tops and talus. The shader adds pits, crevice AO and a soft edge sheen. |
| **Sockets** | Empties in the GLB: `plateau_top`, `arch_portal` (M01), `bench_front` (M03), `talus_1/2`. |

Measured:

| | footprint (with talus) | height | triangles | gullies |
| --- | --- | --- | --- | --- |
| M01 | 12.3 × 9.9 MC | 5.1 MC = 9.0 H | 110,000 | 15 |
| M02 | 7.4 × 6.9 MC | 6.7 MC = 11.7 H | 110,000 | 10 |
| M03 | 11.7 × 9.7 MC | 5.4 MC = 9.4 H | 110,000 | 16 |

## Files (this folder, added)

| File | What |
| --- | --- |
| `CC_R4_MESA_BOARD_R3.png` | references (CC1, ME1, ME2); M01 / M02 / M03 in Hero 3/4, front, side and top; measured values; critic notes |
| `KFB_CC_M01_R3.glb`, `KFB_CC_M02_R3.glb`, `KFB_CC_M03_R3.glb` | one closed mesh each, with vertex colours and socket Empties |
| `KFB_CC_M01_R3.blend`, `KFB_CC_M02_R3.blend`, `KFB_CC_M03_R3.blend` | build scenes, with the full shader and scale props |
| `CC_M0x_R3_metrics.json` | measurements |
| `kfb_cc_mesa_v2.py`, `cc_render_r3.py`, `cc_board_r3.py` | SDF generator, render script, board |
| `RESEARCH_CC_R4_MESA_FORM.md` | the research behind the form rules |

## For Georg

1. Is this the right path (grown SDF mass, sand as a height field)? Or are the forms still too stiff?
2. Next round on the open points: arch as a promontory, deeper and more varied gullies, a rock-coloured talus skirt, the M02 base, and tops in rock colour?
3. After that, step 2 (island J1)?
