# Coconino Mesas R4 · step 1 · modules M01 / M02 / M03 · RETURN

Date: 2026-10-11. Executor: Blender-Coworker. Built with Blender 5.2.2 in the cloud workspace (`bpy`).
Brief: `BRIEF_FROM_STEERING_R4_COCONINO.md` (V-167). Reference: `REFS_COCONINO_2026-10-11/CC1_mesa_modelle_M01-M03.png`, mood ME1/ME2.
Georg's order (11.10.): R4 before the R3 tune.

Scope: step 1 only. Step 2 (island J1) waits for Georg's verdict. All geometry is generated, with no purchased assets. Nothing is wired into the Lab.

## Defects and open points first

1. **The blind critic against CC1 / ME1 / ME2 did not pass.**
   - Round 1: M01 5 · M02 3 · M03 4. Round 2: M01 5 · M02 5 · M03 4. The pass mark is 8.
   - Two rounds are done, so I stopped here (stop rule). Georg decides at the board.
2. **What the critic still sees in the form (geometry):**
   - **Caps:** they overhang like a separate slab, so the modules read as layer cake (M03 as "wedding cake"). Wanted: the cap flush with the cliff or set back a little, with the cliff running up into it.
   - **Columns:** too even (organ pipes). Wanted: widths varying 0.5–2×, plus 1–2 strata ledges that step in or out.
   - **Plan outlines:** too smooth. Wanted: lobes with concave bays.
   - **M03:** wanted as offset, asymmetric set-back terraces with chunky cliff steps.
   - **M02:** wanted as one tapering, fluted mass with superellipse cross-sections, stepped ledges and a distinct cap block. The base mass should be about 40 % of the talus diameter.
   - **Talus:** still a ring of soft lumps. Wanted: a concave apron that climbs about 25 % up the body, with blocks and fallen column pieces.
3. **What the critic sees in material and light** (Lab layer):
   - **Bands:** too thin and regular, like candy stripes. Wanted: one broad cream band under the cap plus 3–4 terracotta/salmon tones.
   - **Colour:** the body is about 15 % too saturated.
   - **Body/talus seam:** hard; it should be a soft blend.
   - **Surface and light:** pinhole speckles; AO and edge highlights are missing.
4. **Bands** are in the shader (world Z, through a constant ramp). The GLB carries only the vertex colours: red body, sand tops, talus, cacti. The cream bands do not travel with it.
5. **M02 sockets:** there are 7 ledge sockets, one per fin. That may be more than the Lab needs, so prune them if so.

## What was built

| Part | Result |
| --- | --- |
| **Form logic** | Taken from the sheet: cap layer, then main body, then erosion skirt / talus. The layers are form logic only: everything is joined and fused by **one** voxel remesh (0.32), smoothed, cut flat at z = 0 and closed, then decimated. |
| **M01 Flat Cap Mesa** | Lobed outline (aspect 1.4). Core with convex rounded columns that stand proud and have rounded tops. Cap slab with a bullnose edge. Body about 0.65 of its width. |
| **M02 Needle Butte** | Asymmetric cluster of prismatic fins (5–7 sides, rounded by the remesh). Central spire about 20 % of the base width. Flanking fins step down to one side. Small cap block on top. Steep talus with stones. |
| **M03 Stepped Mesa** | 3 tiers (scale 1.0 / 0.74 / 0.5), one stratum slab per tier. The upper tiers sit toward the back, so one side is nearly flush and the front shows wide, flat terraces (track-friendly). |
| **Talus** | Raised mound with a convex slope out to about 1.2× the footprint. Scree fans against the cliff foot and half-buried boulders. |
| **Dressing** | Small cacti and stones, as hints only. |
| **Sockets** | Named Empties (`SOCKET_*`), parented to the mesh and exported in the GLB. No socket geometry. |
| **Colour** | Vertex colours (red-orange body, sand-ochre flat tops, dusty talus, green cacti). Shader adds world-Z cream bands, pits and crevice AO. |
| **Scale** | K2 units (H = 3.64, MC = 6.4). Figure 1 H (red) and car 6 × 2.9 (blue) stand next to each module as separate objects. |

Measured:

| | footprint (with talus) | height | triangles | mesh | sockets |
| --- | --- | --- | --- | --- | --- |
| M01 | 8.6 × 6.4 MC | 4.5 MC = 7.9 H | 90,000 | 1 shell, open 0, non-manifold 0 | plateau_top, talus_1, talus_2 |
| M02 | 3.9 × 3.4 MC | 6.2 MC = 11.0 H | 21,314 | 1 shell, open 0, non-manifold 0 | ledge_01…07, spire_top |
| M03 | 9.1 × 7.4 MC | 5.0 MC = 8.7 H | 90,000 | 1 shell, open 0, non-manifold 0 | terrace_1, terrace_2, plateau_top, talus_1, talus_2 |

The sizes are chosen so that M03 + M02 fit together on one 20 MC island (J1).

## Files (this folder)

| File | What |
| --- | --- |
| `CC_R4_MESA_BOARD.png` | CC1 on top; M01 / M02 / M03 in Hero 3/4, front, side and top; measured values; critic notes, split into form vs material/light |
| `KFB_CC_M01.glb`, `KFB_CC_M02.glb`, `KFB_CC_M03.glb` | one closed mesh each, with vertex colours and socket Empties |
| `KFB_CC_M01.blend`, `KFB_CC_M02.blend`, `KFB_CC_M03.blend` | the build scenes, with the full shader and the scale props |
| `CC_M01_metrics.json`, `CC_M02_metrics.json`, `CC_M03_metrics.json` | measurements |
| `kfb_cc_mesa.py`, `cc_render.py`, `cc_board.py` | generator, render script, board |

## For Georg

1. **Direction:** do the three modules read as Coconino mesas? Which one is closest?
2. **Next:** another geometry round on the critic's form points (flush caps, varied columns with ledges, concave bays, M02 as one fluted mass, talus apron)? Or straight to step 2 (island J1) with these modules?
3. **Bands:** broad and irregular as the critic suggests, or keep the crisp thin ones?
