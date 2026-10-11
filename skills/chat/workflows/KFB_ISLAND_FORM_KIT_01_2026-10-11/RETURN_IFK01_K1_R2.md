# Island Form Kit 01 · K1 R2 · rock-block body after M1 · RETURN

Date: 2026-10-11. Executor: Blender-Coworker. Built with Blender 5.2.2 in the cloud workspace (`bpy`), because Blender on the Mac mini stopped answering.

## Why R2

Georg reviewed R1 on 11.10. and gave a big TUNE:
- the grass sits on top like a lid plate;
- the outline is contoured like hex parts;
- some spikes pull sideways instead of down;
- the fake roots are a total fail;
- the holes are badly modelled;
- the whole thing looks like cut-off toy parts.

Georg chose golden candidate **M1** as the target: `lab-docs/golden/protopia-makerspace_2026-10-11/M1_farm-maker_racetrack.png`. Roots are dropped for now.

## Defects and open points first

1. **External critic, blind against M1: not passed.**
   - Round 1: A 5 · B 4 · C 4.
   - Round 2: A 5 · B 5.5 · C 4. The pass mark is 8.
   - I stopped after two repairs (stop rule). Georg decides at the board.
2. **What the critic still sees:**
   - The grass top reads as a flat sheet. It needs lumps, tufts and varying thickness.
   - The light is flat and even, and every block is the same beige.
   - The body is too deep (0.68–0.73 W, spires included; target 0.6–0.75 of the top width) and ends in one cone instead of 3–5 hanging lobes.
   - Some edge segments run straight for too long.
   - The portal still reads as a boxy notch, and the pipe is small.
3. **My read on the layer.** Most of the remaining gap is material, light and top dressing (Knete canon, island theme colours, tufts and bushes), not block geometry. That work belongs with the Lab and the God-Mode tools, not with more geometry rounds.
4. **Not one closed mesh.** The ground is one closed mesh, but every rock block is its own closed mesh, because M1 is built from blocks. This contradicts the old "one closed mesh per island" rule from the postmortem, so steering has to decide.
5. **Mac mini.** Blender MCP has hung since the glTF export of R1. Georg has to restart it in three steps. The R1 GLBs were never written.

## What was built

| Part | Result |
| --- | --- |
| **Ground** | One closed mesh inside a smooth outline with bays and points. Rolling top (up to +4 % W, never below 0, so block tops stay hidden). Yellow-green in the centre, deeper green at the edge. Short rounded lip. |
| **Rock blocks** | Chiselled, irregular boxes: one cut per axis, jittered, tight 2-segment bevel, hardened normals. About 5 % are grey stone. A third of the tall rim blocks carry a horizontal crack, built as two stacked pieces. |
| **Tiers** | Three tiers at radius factor 1.0, 0.84 and 0.64, each tucked under the one above, which leaves a visible ledge. Fill blocks inside, a bottom cap, 2–3 off-centre hanging spires of different lengths, and 4 floating rocks of different sizes. |
| **Grass drapes** | Soft sheets that wrap over the top of about half the rim blocks and hang 0.3–0.65 of the block height down the front. The hem length varies; solidify, subdivision and shrinkwrap make them follow the block. Bare rock in between. |
| **Material and light** | Two-tone sandstone (ochre on upward faces, grey-brown on lower faces) multiplied by ambient occlusion in the joints. Low warm key light, orange rim light, sky-blue fill. |
| **C · openings** | Road-tunnel portal 2.2 × 1.8 MC (≥ 1.6 H clearance): three recess boxes getting darker with depth, stacked jambs, a lintel and an upper block, rock fill at the sides, moss on the lintel. Rim blocks in front of it are cleared. Drainage pipe sticking out of a tier-1 block face (wall, rim, dark inside) with a stain below. |

## Files (this folder)

| File | What |
| --- | --- |
| `K1R2_ROCKBLOCK_BOARD.png` | reference M1, then A / B / C in side view, 3/4 from above and underside; measured values and critic notes |
| `IFK01_K1R2_A_M20MC.glb`, `…_B_…`, `…_C_…` | reference GLBs (generated geometry only) |
| `IFK01_K1R2.blend` | the build scene |
| `K1R2_metrics.json` | width, depth, object and triangle counts |
| `kfb_ifk01_r2b.py`, `r2b_render.py`, `k1r2_board.py` | generator, render script, board |

## For Georg

1. Is the direction right (blocks in tiers, drapes, spires)? A, B or C as the base?
2. Can the body be built from several closed parts, against the one-mesh rule?
3. Next step: a material and light pass in the Lab (Knete, island theme, tufts), or another geometry round here?
