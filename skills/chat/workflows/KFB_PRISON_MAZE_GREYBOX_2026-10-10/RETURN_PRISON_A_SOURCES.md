# Prison Maze Greybox · Step A (source audit) · RETURN

Date: 2026-10-10. Executor: Blender-Coworker (Mac mini, Blender 5.2.2 via MCP).
Handover: `skills/chat/KFB_BLENDER_MCP_PRISON_MAZE_GREYBOX_HANDOVER_2026-10-10.md` on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` (`e7a97a4`).
Agreed with Georg: the job runs in three steps with a stop after each. **A: sources → Georg picks the island**; B: one terrain profile with the square and round maze; C: tower, material and joints.

Nothing in the MVP, the Island Lab code or any source file was changed.

## Defects and open points first

1. **Tiny Skies lighthouse:** not found as an asset or in the Tiny Skies example code. It stays `SOURCE_REQUIRED`. The StreakByte Port scene has its own lighthouse (Unity licence).
2. **No "Frost Orc" asset exists.**
   - Closest: KayKit texture variant B. Orc Raider (Medium) and Orc Brute (Large) both get grey-teal skin from it (Medium #93b2af, Large #73a1a7).
   - That reads frosty but not clearly blue. A bluer skin would need a palette swap on a copy of the texture.
3. **Toy Soldier details:**
   - the hat number does not exist in the source (needs a decal; untested);
   - cobalt blue No.1 needs a palette swap on a copy of the texture (untested).
4. **Character bodies are not rendered** in Step A, because of the KFB-eyes rule. Only props and data are shown.
5. **Scale:** StreakByte islands are 12–30 m across. Against a 2.17 m Rig_Medium resident, a 19 m plateau holds about 6–7 corridors across. The Lab's `FIG_SCALE` 1.6 still has to be applied to this pairing in Step B.
6. **Licence:**
   - The StreakByte FBX, the palette texture and the rebuilt `.blend` stay local (Unity Asset Store EULA: game use is fine, redistribution is not).
   - Only screenshots, scripts and data go to GitHub.

## A1 · The 8 Unity islands: VERIFIED (8 of 8)

- **Source:** StreakByte "Low Poly Floating Islands". The raw files are in the Lab under `donors/streakbyte-floating-islands/`.
- **Layout:** the Lab's extraction of the 8 demo scenes (`public/assets/streakbyte/scenes/*.json`).
- **Rebuild in Blender:** every item has its FBX, its unit scale and its matrix, giving 774 objects from 345 unique meshes. Item counts match the Lab index.
- **Coordinate mapping:** Blender object = C · M_unity · diag(−1, 1, 1) · scale(u), where C swaps Y and Z. Props sit correctly on the ground.

| Island | Size (m) | Terrain tris | Flat area / main level (m²) | Largest flat circle r (m) | Read |
|---|---|---:|---|---:|---|
| 01 Port | 24 × 21 | 1,501 | 352 / 211 | 4.0 | rock rim around a sand ring and a green centre; already reads as a bowl; has a lighthouse |
| 02 River | 12 × 12 | 648 | 113 / 85 | 4.0 | too small; a river cuts the top |
| 03 Backyard | 20 × 20 | 700 | 315 / 261 | 9.5 | one large flat lawn |
| 04 Beach | 12 × 12 | 2,751 | 108 / 87 | 2.5 | too small and split up |
| 05 Pirate Cave | 26 × 27 | 1,152 | 503 / 322 | 6.0 | cliff plateau above a beach level; cave |
| 06 Iceland | 27 × 30 | 8,676 | 437 / 310 | 6.5 | big mountain on one side; heaviest mesh |
| 07 Pond | 27 × 27 | 1,977 | 533 / 334 | 6.0 | pond in the middle |
| 08 Forest | 19 × 19 | 576 | 273 / 270 | 9.5 | simplest mesh: one flat round disk on a cone |

**Candidates for the prison (Georg decides):**
- **Port:** the strongest prison silhouette. The rock rim already reads as a wall around a bowl, and the scene has a lighthouse for the tower. Its flat centre is small (r 4), so the maze would have to run over the sand ring too.
- **Forest / Backyard:** the biggest flat round plateau (r 9.5) and the simplest mesh. Easiest to reshape into a basin or a mound, but plain as it ships.
- **Pirate Cave:** the most drama, with its cliff, cave and two levels. The maze would sit on the 322 m² lower level, with the cliff as the watch side.

## A2 · Tower donors: VERIFIED (Tiny Skies: SOURCE_REQUIRED)

| Family | Piece width | Storey | Test stacks | Fit |
|---|---|---|---|---|
| Kenney Tower Defense, round (CC0) | 1.0 m | 0.6 m | 2.85 m (low) / 4.19 m (3 middles) | height comes from the number of middle pieces; needs about ×3 next to a resident |
| Kenney Tower Defense, square (CC0) | 1.0 m | 0.5 m | 2.78 / 3.72 m | same as round |
| Kenney Pirate (CC0) | 3.2 m | 2.0 m | watch 6.8 m; roofed 12.2 m | already at resident scale (door fits 2.17 m); crenellated watch crown for a searchlight |
| KayKit Medieval Hexagon, blue (CC0) | about 1 m | — | A 2.2 m, B 2.5 m | fixed heights, not stackable |

All pivots sit at the bottom centre. For a tower whose height can change, the **Pirate kit** is the natural first choice: storeys stack cleanly at resident scale. Kenney Tower Defense is the alternative if the tower should look toy-like.

## A3 · Characters (data only, no bodies rendered)

- **Toy Soldier** (KayKit Series 6, Rig_Medium, CC0):
  - **The wind-up key is a separate mesh**, `ToySoldier_WindupKey`, rigidly parented to the `chest` bone with no skin weights. It can be hidden, detached or "stolen" on a copy without touching the source.
  - The plume is part of the hat mesh.
  - The source ships a rifle (2.49 m musket) and a trumpet, which could serve the band.
- **Frost Orc:** see open point 2.
  - Medium: Orc Raider with texture B.
  - Large: Orc Brute with texture B.
  - FrostGolem also exists.

## Files (local job folder `BLENDER MCP/PRISON_MAZE_GREYBOX_2026-10-10/`)

| File | What |
|---|---|
| `renders/A/A1_ISLANDS_34_BOARD.png` | the 8 demo islands, 3/4 view |
| `renders/A/A1_ISLANDS_TOP_SIDE_BOARD.png` | terrain from above (plateau) and full island from the side (underside) |
| `renders/A/A2_TOWERS_BOARD.png` | tower pieces and test stacks, with a 2.17 m scale post |
| `renders/A/A3_TOYSOLDIER_PARTS.png` | musket, trumpet, wind-up key, hat with plume |
| `data/A_source_manifest.json` | machine-readable source table (`kfb.prison-greybox.source-manifest/1`) |
| `scripts/a1_board.py`, `scripts/a2_board.py` | board composition |
| `blend/PRISON_A_SOURCES.blend` | scene `PRISON_A_SOURCES` (927 objects). **Local only** (contains Unity meshes). |

## Next gate

**Georg picks the island anatomy:** Port, Forest/Backyard, Pirate Cave, or another. Step B then builds one terrain profile on it with the square and the round maze. The maze layout will be a JSON graph that Blender only renders.
