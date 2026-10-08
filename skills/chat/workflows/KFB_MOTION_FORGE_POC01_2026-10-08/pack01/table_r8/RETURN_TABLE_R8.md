# Motion Forge Pack 01 · table activity rev 8 · RETURN

- **Issue:** #376 · branch `blender-mcp/motion-forge-poc-01-2026-10-08` · 2026-10-08
- **Status:** Georg approved the look on 2026-10-08 ("sieht jetzt gut aus") after one change: the stool was pushed back so the feet dangle. The catalogue patch is additive and **not applied**.

## Defects and open points first

1. **Current preview: `previews/FORGE_TABLE_R8d_atlas_sitting_eat_write_read.mp4`.** It shows the stool pushed back and the new pencil. The older `R8c` video predates both and stays only for the record.
2. **GLB round trip not measured.** The GLBs come from the Blender glTF exporter. The export also caught unrelated scene objects, so I stripped it down to the one skeleton and the three clips (pygltflib).
   - Checked: the skeleton is identical to `KFB_Motion_forge01.glb` (only one quaternion sign flip on `toes.r`, which is the same rotation).
   - Checked: hips height equals the seat height (0.50 M / 0.89 L).
   - Checked: durations match the frame counts at 30 fps.
3. **Remaining notes from the external critic:**
   - The bite piece is hard to see.
   - The sandwich shrinks along the actor's X axis, so a pure side camera does not see it get shorter.
   - Reading and Orc writing leave small arm-to-table contact.
   - The blue blueprint sheet does not match the reading journal.

## What was built

| Clip | Frames (30 fps, loop) | Lower body | Upper body |
|---|---|---|---|
| `kfb_activity_table_eat_b` | 65 | KayKit `Sit_Chair_Idle`, unmodified | arms from `kfb_action_kneel_eat_a` 16–80, raised 22° (M) / 8° (L); right hand IK-blended to the mouth at the bite; head −14° |
| `kfb_activity_table_write_b` | 48 | same | both hands IK on the sheet, elbows out and up; right hand 2 small loops per cycle |
| `kfb_activity_table_read_b` | 20 | same | arms from the eat clip 16–26 ping-pong; head −14° |

- **Seating** follows the Resident Atlas (`tools/resident_atlas_s6`: `lib/atlas.js sitOn`, Goth Girl in `data/cast.js`).
  - The hips bone goes on the top centre of the stool box. The only correction is a constant vertical offset, baked into the clip's hips: +0.019 (M), −0.345 (L).
  - This replaces the rev 5–7 leg and pelvis solvers, which pulled the knees into the body and made the Orc float.
- **Chest and head stay in the sit clip.** The kneel source bends the chest to the floor and dropped the head onto the plate.
- **Rig_Large** has no KayKit chair sit, so it uses the Medium clip retargeted.

## Furniture (KayKit units, kit factor 1)

| | Medium (Farmer B) | Large (Orc Brute) |
|---|---|---|
| Stool | Dungeon `stool`, top 0.50 | same × 1.78 (Orc = 1.78 H) |
| Stool push-back after sitOn | 0.227 | 0.308 |
| Table | Dungeon `table_medium`, top 1.00, yaw 90° | same × 1.78 |
| Table near edge (from the actor, glTF Z) | 0.045 | 0.198 |

- **Rejected tables:**
  - Dungeon `table_small`: its centre stretcher hits the shins.
  - Witch `Table_Small`: a closed nightstand.
  - Goth Girl stool (0.80 bar stool): too high for a 1.00 table, so the thighs hit the slab.
- **Props:**
  - Eat: Tiny Treats Picnic `plate_A` + `sandwich`, eaten away in 4 bites (one per loop).
  - Write: RPG Tools `blueprint` × 0.5 + `pencil_A_short` × 1.5 on `handslot.r`.
  - Read: RPG Tools `journal_open`, propped toward the reader.
- All placements are in the catalogue patch.

## Files

| File | What |
|---|---|
| `libs/Rig_Medium/KFB_Motion_forge01_table.glb`, `libs/Rig_Large/KFB_Motion_forge01_table.glb` | 3 clips each, skeleton only |
| `KFB_Motion_Library.catalog.patch_forge01_table.json` | clips, furniture placement, props, eaten-away timing, provenance |
| `scripts/kfb_table_atlas.py` | rebuild: `stage_variant`, `build_clip`, `build_write`, `push_stool_back`, `render_seq` |
| `previews/FORGE_TABLE_R8d_atlas_sitting_eat_write_read.mp4` | eat / write / read, Farmer + Orc, front ¾ + side (current) |
| `previews/FORGE_TABLE_R8c_atlas_sitting_eat_write_read.mp4` | older: before the push-back and the pencil change |
| `previews/TABLE_R8_STOOL_BACK_side_back.png` | final stool placement, side + back, both rigs |

## Attribution

- **KayKit** (CC0): rigs, `Sit_Chair_Idle`, Dungeon, RPG Tools, Tiny Treats.
- **UniMate** (CC BY-NC 4.0): the arm motion in eat and read comes from `kfb_action_kneel_eat_a`. See `../ATTRIBUTION.md`.

## Next gate (one)

Georg plays the three clips in the world runtime with the furniture and props from the patch. Bite-piece tuning is parked for later (Georg).
