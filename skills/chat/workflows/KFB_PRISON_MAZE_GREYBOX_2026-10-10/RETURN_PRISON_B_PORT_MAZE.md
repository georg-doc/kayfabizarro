# Prison Maze Greybox · Step B (Port island, square vs round maze) · RETURN

Date: 2026-10-10. Executor: Blender-Coworker (Mac mini, Blender 5.2.2 via MCP).
Georg's choice after Step A: **Port** is the base. Its anatomy (rock rim, sand ring, bowl, underside) becomes the plan for an own KFB island.
Nothing in the MVP, the Island Lab or any source file was changed. The StreakByte Port scene in `PRISON_A_SOURCES` is untouched; Step B works on a copy.

## Decisions for Georg first

1. **Wall height.** The walls are 1.6 m; the Rig_Medium resident is 2.17 m.
   - At the gate on the rim, the player looks down into the bowl and sees most of the maze. Inside, the walls are at head height.
   - Options:
     - **low (1.6 m):** readable from the third-person camera; the guard on the tower sees everyone, which fits the panopticon idea;
     - **high (about 2.6 m):** a real "lost" maze, but the camera then needs to tilt or the walls need to fade.
2. **Square or round maze.**
   - Square: a stepped outer outline, typical labyrinth look.
   - Round (rings and spokes): fits the circular rim and the tower in the middle, with longer escape routes (23–29 cells).
3. **Basin or mound.** One slider controls both, and the same graph builds on either.
   - **Basin (Kessel):** the tower stands low, the rim acts as a wall, the gate looks down into the maze.
   - **Mound:** the tower stands on a hill and the maze climbs.

## Defects and limits

- The outer walls of the square maze step around the clipped grid. On the mound they read as a zigzag.
- Walls overlap at corners (separate pieces, bevelled). That is fine for a greybox; a game build would merge them.
- The terrain is the Port mesh with its top refined once (4,303 faces). The basin edge shows the low-poly facets.
- The tower is a **placeholder**: the Kenney Pirate watch stack (6.8 m). The searchlight, guard and cannon slot come in Step C.
- The pink post is a neutral 2.17 m height reference, not a resident.
- This is a greybox, not a navmesh or gameplay test.

## What was built

| Part | Result |
|---|---|
| **Terrain** `B_TERRAIN_PORT_CANDIDATE` | Copy of the Port terrain, centred, main ground at z = 0. Top refined once inside r < 10.5 m. Grass and inner rock props removed from the copy. |
| **Basin / mound slider** | Shape key `BASIN_DEPTH_2m5`, range −1 to +1. At +1 the centre sinks 2.5 m (flat floor r < 6.5 m, smooth slope to r = 10 m). At −1 the centre rises 2.5 m. At 0 the original. Reversible; the mesh is not edited. |
| **Maze graph** `prison_maze_graph.json` (`kfb.prison-maze-graph/1`) | **The source of truth.** Square and polar layouts, seeds 1–3 each. Cells, open passages, walls (line / arc / radial), courtyard cell, gate cell, checks. |
| **Generator** `kfb_prison_maze_graph.py` | Perfect mazes (recursive backtracker, one route between any two cells), seeded, repeatable. Walkable disk r = 9.4 m; tower courtyard r = 3.0 m; cell pitch 2.1 m (1.5 m corridor + 0.6 m wall). Gate to the south. The courtyard passage sits where the escape route is longest. |
| **Builder** `kfb_prison_maze_build.py` | Builds walls from the graph. Every 0.35 m it samples the ground under each wall side (raycast on the evaluated terrain), so walls follow basin or mound. Walls are 1.6 m high, sink 0.35 m into the ground and are bevelled 0.18 m. Material: earth sides, grass top. Re-run after moving the slider. |

## Checks

| Maze | Cells | All reachable | Escape route (cells) | Walls |
|---|---:|---|---:|---:|
| square seed 1 / 2 / 3 | 48 | yes | 23 / 23 / 15 | 71 |
| polar seed 1 / 2 / 3 | 54 (12 + 18 + 24) | yes | 23 / 24 / 29 | 95 |

- The builder script was verified by md5 in Blender before running (`d6b8d09c…`).
- Six wall meshes, about 1,600 faces each before the bevel.

## Files

| File | What |
|---|---|
| `B_OVERVIEW_BOARD.png` | square vs round, basin vs mound, player eye at the gate |
| `B_RECONFIG_BOARD.png` | three seeds per layout from above (the "reconfiguration" proof: same island, courtyard and gate; new graph = new maze) |
| `prison_maze_graph.json` | maze graphs (source of truth) |
| `kfb_prison_maze_graph.py`, `kfb_prison_maze_build.py`, `b_board.py` | generator, Blender builder, board composition |
| local only: `blend/PRISON_B_PORT_MAZE.blend` | scenes `PRISON_A_SOURCES` + `PRISON_B_PORT` (contains Unity meshes, so it stays local) |

## Next gate

Georg picks: wall height (low / high), square or round, basin or mound. Then **Step C** on that choice:
- the tower as a module stack, with a platform for the Toy Soldier guard and a rotating lamp head with a light cone (lighthouse logic);
- a cannon slot from the Tower Defense kit as an outlook;
- the clay / masonry joint proof on the walls;
- two lighting states.
