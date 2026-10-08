# Motion Forge Pack 01 · sprint #381 item 1 · seat and height transitions · RETURN

- **Issue:** #381 (sprint) · branch `blender-mcp/motion-forge-poc-01-2026-10-08` · 2026-10-09
- **Status:** Georg approved the jumps on 2026-10-08 and the stand-up rev c on 2026-10-09 ("top! kann eingecheckt werden"). The catalogue patch is additive and **not applied**.

## Defects and open points first

1. **Farmer nose and the sandwich.** On stand-up f17–f21 the Farmer's nose passes just behind the sandwich: 1 vertex on f19/21/22, against the real mesh. The head already tilts back up to 12°; an earlier tilt would read better.
2. **Orc fist swing.** The Orc swings a forward fist while rising, f13–f19. It comes from KayKit `Sit_Chair_StandUp`.
3. **Inherited grip.** Stand-up f0–f7 keeps the eat clip's own grip on the sandwich.
4. **Lost leg-joint offsets.** `kfb_forge.make_action` keyed location on the hips only, so KayKit's upper-leg joint offsets in `Sit_Chair_*` were lost (up to 0.09).
   - Fixed for this batch: `kfb_seat_sit_down_table_b` (M) was rebuilt and `kfb_seat_stand_up_table_c` keys every moving bone.
   - **Still affected:** the checked-in table clips (`kfb_activity_table_*_b`, Sit_Chair_Idle) lack a constant 0.03 upper-leg offset on Rig_Medium. Not visible in the previews; flag for a later rebuild.
   - Rig_Large clips are retargeted from rotations only, so they are unaffected.
5. **Tuning notes from Georg (later):**
   - jump landings: the head and loose parts swing on after impact;
   - a short timing check pass over all clips;
   - podium takeoff closer to the base;
   - the Orc's stiff in-air legs.
6. **GLBs are not a Blender glTF export** (live export crashed Blender twice). They come from a pose dump plus `scripts/kfb_pose_dump_to_glb.py`:
   - the skeleton is copied from `KFB_Motion_forge01_table.glb`;
   - the bone mapping was checked against that exporter output (eat frame 0: 2e-6);
   - round trip against the authored poses: max 0.0003 cm (Medium), 0.05 cm (Large).

## Clips (30 fps, one-shot, root motion baked into the hips)

| Clip | M frames | L frames | What |
|---|---:|---:|---|
| `kfb_seat_sit_down_table_b` | 51 | 51 | KayKit `Sit_Chair_Down` behind the working spot → arms to the activity's frame 0 → scoot in with the stool |
| `kfb_seat_stand_up_table_c` | 41 | 41 | KayKit `Sit_Chair_StandUp`, no seated scoot; the body moves back only once the hips leave the seat; the legs push the stool, which coasts out |
| `kfb_move_jump_up_stool_b` | 66 | 73 | onto the Dungeon stool (top 0.50 / 0.89) |
| `kfb_move_jump_down_stool_b` | 46 | 54 | down from the stool |
| `kfb_move_jump_up_podium_b` | 67 | 76 | onto the Clown circus podium (top 1.00 / 1.78) |
| `kfb_move_jump_down_podium_b` | 47 | 56 | down from the podium |

- **Stand-up, measured:**
  - Hands and arms never inside the table slab. From f8 on they are clear of the sandwich and plate too (BVH test).
  - Stool still until f11 (M) / f9 (L), pushed f11–15 / f9–14, then friction ×0.70 per frame.
  - Stool travel 0.64 (M) / 1.99 (L).
  - Touchdown f15 / f14, then one foot planted (no skating), never below the floor.
  - End spot = scoot distance (0.43 / 1.09); the belly is 0.08 / 0.10 of the character scale clear of the table.
- **Jumps:**
  - Cartoon gravity rev 2: anticipation hold, fast rise, 2-frame apex hang, fall about 2.3× harder than the rise, landing compression hold. The heavy rig gets a longer load and a slower recovery.
  - Edge clearance checked with a BVH ray test against the real prop mesh.
  - Air time: stool 12 / 15 frames up, podium 13 / 18 frames up.
- **Per-frame data for the runtime is in the catalogue patch:** stool offsets, root end offsets, takeoff and contact frames, prop tops.
- **Critic:** external critic FAIL on the first stand-up (the stool slid while still carrying the seated weight), then PASS WITH NOTES after 2 repairs. Jumps: PASS WITH NOTES.

## Files

| File | What |
|---|---|
| `libs/Rig_Medium/KFB_Motion_forge01_seat_jump.glb`, `libs/Rig_Large/KFB_Motion_forge01_seat_jump.glb` | 6 clips each, skeleton only (24 nodes, no meshes / skins) |
| `KFB_Motion_Library.catalog.patch_forge01_seat_jump.json` | clips, stool curves, jump data, props, sha256 |
| `scripts/kfb_seat_transitions.py` | sit-down (and the superseded stand-up rev b) |
| `scripts/kfb_seat_standup_c.py` | stand-up rev c: `build_planted`, `simulate_stool`, `render_cycle` |
| `scripts/kfb_jump_props.py` | jumps: `build_up_down`, `edge_clearance` |
| `scripts/kfb_pose_dump.py`, `scripts/kfb_pose_dump_to_glb.py`, `scripts/kfb_verify_seat_jump_glb.py` | crash-free GLB path + round-trip check |
| `previews/SEAT_S2_sit_eat_standup_stool_push.mp4` | sit down → eat → stand up, Farmer + Orc, front ¾ + side, 30 fps |
| `previews/JUMP_J3_cartoon_gravity.mp4` | stool and podium up/down, 30 fps |

## Attribution

- **KayKit** (CC0): rigs, `Sit_Chair_Down/StandUp`, `Jump_Start/Idle/Land`, Dungeon stool + table_medium, Mystery Monthly Clown circus_podium.

## Next gate (one)

Sprint #381 item 2 (Stammtisch): 2–4 residents at one table.
