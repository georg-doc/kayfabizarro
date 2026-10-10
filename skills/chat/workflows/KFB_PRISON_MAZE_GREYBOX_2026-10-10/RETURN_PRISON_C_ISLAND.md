# Prison Maze Greybox · Step C (bridge, brick walls, lighthouse tower) · RETURN

Date: 2026-10-10. Executor: Blender-Coworker (Mac mini, Blender 5.2.2 via MCP).
Based on Georg's notes on Step B (2026-10-10):
- one main access over a bridge, with a guard post at the gate and the racetrack attaching at the far end;
- the Toy Soldiers can blow up the bridge as a last measure, and robot builders in yellow miner helmets rebuild it (later);
- brick walls with a seamless pattern, darker and gloomier overall;
- a real crown with crenellations on the tower;
- a rotating lighthouse section under the crown, with the guard and cannon fixed on top;
- the tower height makes up for the terrain.

Nothing in the MVP, the Island Lab or any source file was changed. Raw Unity data stays local.

## Defects and open points first

1. **The Port rim is only about 0.6 m wide at the south.** The gate therefore stands on a **stone bridgehead** (6.4 × 3.5 m block) that extends the island. The gate's inner face reaches 0.3 m into the outer maze ring.
2. **The lantern is the Kenney `tower-watch` piece.** Its windows are small, so the light seems to come from inside the wall. A real lamp head or a lantern with larger openings would read better.
3. **Beam:** a transparent cone plus a spot light. The spot barely lights the maze floor at dusk. At 180° the beam is hidden behind the tower in the top view.
4. **The tower keeps Kenney's pale blue-grey.** Everything else is darker. Darken it as well, or keep it as the bright focal point? Georg decides.
5. **Bridge-end socket:** for now just data (position, heading, width, "single main access"). The real RKIT track hookup is open.
6. **Not built yet:** the bridge blow-up and rebuild, the robot crew with miner helmets and headlamps, clay cannon shots, Hypernormalization screens on the walls.
7. **Graph v2:** the maze graph changed, so the gate is centred in both layouts (one bridge for both). The seeds are the same, but the mazes differ from the Step B boards. The v1 graph stays on the branch.

## What was built

| Part | Result |
|---|---|
| **Brick walls** | The builder now writes UVs along each wall (u = metres along the wall, v = world height). One procedural brick runs without stretching over straight, curved and sloped walls. Dark umber / grey-brown bricks, near-black mortar, dark moss cap, slight bump. Material `C_WALL_BRICK`. The Step B earth look is kept as `style='earth'`. |
| **Darker terrain** | `C_TERRAIN_DARK` is a copy of the Port material (value 0.55, saturation 0.75). The source material is unchanged. |
| **Gate and bridge** | Kenney Pirate `castle-gate` on the bridgehead. Six plank segments (two `platform-planks` side by side, 3.78 m deck, 16.2 m long), rails, posts and side beams. **Each segment is its own collection** (`BRIDGE_SEG_01..06`), so a blow-up and rebuild can address segments one by one. |
| **Racetrack socket** | `SOCKET_bridge_end_main` at (0, −28.9, 0), heading −Y, width 3.78. The socket data sits in custom properties and in `prison_island_layout.json`. |
| **Guard / cannon slots** | Blue pads (not characters): on top of the gate, at the island end of the bridge, and on the tower deck. Pirate `cannon` on the deck, aimed at the gate. |
| **Tower** | `tower-base-door` + middle storeys + `tower-watch` as the **rotating lantern** + `tower-top` as the **fixed crenellated crown**. The lantern turns once every 8 s (linear, looping) and carries the cone and the spot light. The deck, the cannon and the guard slot do not turn. |
| **Height rule** | The number of middle storeys comes from the ground under the tower: the lamp must clear rim (0) + wall (1.6) + 2 m. **Basin:** ground −2.35, 2 storeys, lamp 5.0, deck 8.4. **Mound:** ground +2.65, 0 storeys, lamp 6.0, deck 9.4. The beam aims at the maze floor 8.5 m out (pitch 36° / 32°). |
| **Two lighting states** | Dusk (low warm sun, dark blue sky) and cold day. Only sun and sky change; nothing is lit per object. |

## Files

| File | What |
|---|---|
| `C_OVERVIEW_BOARD.png` | dusk, cold day, tower close-up, bridge and gate |
| `C_BEAM_TERRAIN_BOARD.png` | beam sweep (4 frames) and tower height on basin vs mound |
| `prison_island_layout.json` (`kfb.prison-island-layout/1`) | gate, bridgehead, bridge, socket, slots, tower stack, height rule, beam |
| `prison_maze_graph_v2.json` | maze graph v2 (gate centred) |
| `kfb_prison_island_build.py` | builds gate, bridge, socket, slots, tower, beam, darker terrain, lighting |
| `kfb_prison_maze_build.py`, `kfb_prison_maze_graph.py` | updated: brick UVs and material; gate centring |
| `c_board.py` | board composition |
| local only: `blend/PRISON_C_ISLAND.blend` | scenes `PRISON_A_SOURCES` + `PRISON_B_PORT` (with Step C) |

## Next gate

Georg's look at Step C. Open choices:
- the tower colour (dark, or bright focal point);
- a real lamp head versus the `tower-watch` lantern;
- square or round maze, and wall height (still 1.6 m).

After that, as a separate job:
- the bridge blow-up / rebuild gag with the robot crew (miner helmets, headlamp);
- clay cannon shots.
