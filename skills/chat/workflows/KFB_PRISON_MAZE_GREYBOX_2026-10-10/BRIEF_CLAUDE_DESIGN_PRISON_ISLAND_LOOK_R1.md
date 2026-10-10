# Brief · Claude Design · Prison Island look R1 (colour, texture, dressing)

Date: 2026-10-10. From: Blender-Coworker (Mac mini), on Georg's request. For: Claude Design (DocCheck workspace).
Repo: `georg-doc/kayfabizarro`, branch `blender-mcp/prison-maze-greybox-2026-10-10`, folder `skills/chat/workflows/KFB_PRISON_MAZE_GREYBOX_2026-10-10/`.

## 1 · Goal

Art-direct the **colour, texturing and dressing** of the KFB Prison Island on top of the finished Blender greybox. The result is a **style spec** that the Blender-Coworker applies and rebuilds from data.

Georg decides the look. Deliver 2–3 directions he can choose from, not one final answer.

No game runtime, no MVP change, no publishing.

## 2 · Read first

| File (same folder) | What |
|---|---|
| `RETURN_PRISON_C_ISLAND.md` | current state: bridge, brick walls, lighthouse tower, open points |
| `C_OVERVIEW_BOARD.png` | dusk and cold day, tower close-up, bridge and gate |
| `C_BEAM_TERRAIN_BOARD.png` | beam sweep; tower height on basin vs mound |
| `B_OVERVIEW_BOARD.png`, `B_RECONFIG_BOARD.png` | square vs round maze, basin vs mound, three seeds each |
| `prison_island_layout.json` | gate, bridgehead, bridge, racetrack socket, guard slots, tower stack, height rule |
| `prison_maze_graph_v2.json` | maze graphs (walls typed `inner` / `boundary`; gate and courtyard are openings) |
| `A2_TOWERS_BOARD.png`, `A3_TOYSOLDIER_PARTS.png` | source tower pieces; Toy Soldier parts (wind-up key, musket, shako) |

If they apply, also read `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md` and the KFB clay surface canon. Do not invent a second clay canon.

## 3 · What exists (facts)

- **Island:**
  - our own copy of the StreakByte "Port" island: rock rim, sand ring, bowl, rocky underside;
  - one slider turns the centre into a basin (−2.5 m) or a mound (+2.5 m).
- **Maze:**
  - square or round (rings and spokes), built from the graph JSON; perfect maze with one escape route;
  - walkable disk r = 9.4 m, tower courtyard r = 3.0 m;
  - cell pitch 2.1 m: corridor 1.5 m, wall 0.6 m thick, **1.6 m high**, bevel 0.18 m.
- **Walls today:**
  - procedural dark brick, 0.56 × 0.27 m, near-black mortar, dark moss cap;
  - UVs run along each wall (u = metres along the wall, v = world height), so any pattern stays seamless over straight, curved and sloped walls.
- **Tower** (Kenney Pirate pieces, CC0):
  - door base, then 0–2 middle storeys (count follows the ground);
  - `tower-watch` as the **rotating lantern** with a light cone (one turn per 8 s);
  - `tower-top` as the **fixed crenellated crown**, with deck, cannon and guard slot.
- **Access:**
  - one main bridge (6 separate plank segments, 3.78 m deck) from a stone bridgehead with the Pirate castle gate;
  - the racetrack attaches at the far end (socket `bridge_end_main`).
- **Guard slots** (blue pads): gate top, bridge start, tower deck. The guards are KayKit Toy Soldiers.
- **Lighting:** two states, dusk and cold day; only sun and sky change.

## 4 · Georg's direction (2026-10-10)

1. **Darker and gloomier overall.** Walls must not be plain grey; keep the brick look and its seamless pattern.
2. **Prison bars and barbed wire belong to the visual language.** For example:
   - a mix of barbed-wire fence and bars built **into the walls**, such as a wire crown on wall tops;
   - bar inserts in wall segments.
3. **Square prison windows as a maze building element** (square, like in *Crazy Cat*, Georg's reference). Through them you see the inmates from the side, or they look out.
4. **Take window openings and bars from the KayKit Dungeon set and insert them into our masonry.** Do not use the whole Dungeon wall pieces.
   - Sources in the repo: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/`.
   - Pieces: `wall_window_open`, `wall_window_closed`, `wall_gated`, `wall_corner_gated`, `wall_archedwindow_gated`, `barrier`, `barrier_column`.
   - Extract only the window frame, the bars and the grate as insert parts.
5. Later, not in R1 (design notes welcome):
   - the guards blow up the bridge as a last measure, in a cartoon way;
   - robot builders in **yellow miner helmets** rebuild it, maybe with a lit headlamp;
   - clay cannonballs that burst;
   - Hypernormalization screens on a few wall pieces (performance: only a few).

## 5 · Tasks

1. **Palette.**
   - Hex colours for dusk and cold day: terrain (top, sand, rock rim, underside), brick, mortar, cap, bars/metal, barbed wire, wood (bridge), stone (bridgehead), tower, lantern glow and beam.
   - **Decide the tower colour** with Georg: dark like the rest, or a bright focal point.
2. **Materials per element.** Plain values a Blender material can take: base colour, roughness, bump/brick parameters, emission for the lantern. Keep the brick UV convention from §3.
3. **Wall module catalogue.** Each module needs an id, a sketch, dimensions and source pieces (if any):
   - `wall_brick`: today's wall;
   - `wall_brick_bars`: bar insert in a wall segment;
   - `wall_brick_window`: square window with bars, see-through;
   - `wall_wire_crown`: barbed-wire or bar crown on top;
   - optional: corner, end and gate-side pieces.
4. **Placement rules as data**, so the builder can place modules from the graph without hand work. Examples:
   - windows only on `inner` walls next to a corridor at least two cells long;
   - at most N windows per maze;
   - wire crown on all `boundary` walls;
   - bars facing the courtyard.
5. **Tower dressing:**
   - a lantern head that reads as a lighthouse (bigger openings or a lamp head) instead of the small Kenney windows;
   - crown details: corbels and crenellations, flag;
   - the cannon look (clay later).
6. **Bridge and gate dressing:** checkpoint feeling at the bridge start (barrier, sign), wear and soot. Prepare the bridge segments for a later blow-up.

## 6 · Constraints

- **Dimensions are fixed** by the graph: pitch 2.1 m, corridor 1.5 m, wall 0.6 × 1.6 m.
  - A window in a 1.6 m wall sits at chest height of a 2.17 m resident.
  - If a real window needs wall above it, propose **taller cell-block segments** (for example 2.4 m) as a module. Do not raise all walls; wall height is still Georg's open choice.
- **Style:** KayKit-like chunky low poly, bevelled edges, palette-texture logic. Modules must snap to the 2.1 m grid and to arcs on the round maze.
- **Residents:** any Toy Soldier, inmate or robot drawn in a reference shows the **KFB eyes**: never the original eyes, never no eyes.
- **Licence:**
  - The island terrain comes from a Unity Asset Store pack, so use the renders only as reference; never re-export its mesh or texture.
  - KayKit and Kenney pieces are CC0.
  - For the helmet: `media/3D_Assets/Hard hat by joney_lol - ccKTHG1Mpd.glb` exists in the repo; check its licence before use.
- **No second system:** no new runtime, no new terrain or maze owner. The graph JSON stays the source of truth; you add style data on top.

## 7 · Deliverables

1. **2–3 look directions** as images. Paint-overs on the boards are fine. Each must show the walls with bars, windows and wire, the tower, and the bridge with the gate, in dusk and day.
2. **`prison_island_style_r1.json`** containing:
   - the palette (both lighting states);
   - material parameters per element;
   - the module catalogue (ids, dimensions, source pieces, insert positions);
   - placement rules referencing the graph wall kinds;
   - the tower dressing choice.
3. **`RETURN_CLAUDE_DESIGN_PRISON_LOOK_R1.md`**: what was decided, what is open for Georg, which parts the Blender-Coworker must build.

Put the files next to this brief on the same branch (additive; no merge).

## 8 · Next gate

Georg picks a direction. The Blender-Coworker then:
- extracts the Dungeon window and bar parts;
- builds the modules;
- places them from the rules and applies the palette;
- renders the same board views for comparison.
