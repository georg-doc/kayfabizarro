# KFB Fluff Work Motion Pack 01 · Part 1 RETURN

- **Executor:** Coworker (Blender MCP role, cloud bpy 5.0.1) · 2026-10-04
- **Brief:** `START_HERE.md` + `REUSE_MATRIX.md` in this workflow folder (PR #356, head `6366166`).
- **Status:** Part 1 complete. Nothing authored, nothing merged. **Stop here until Georg / WSA review the gap list.**

## Defects and open points first

1. **G4 needs a decision: the Large ball size.**
   - Rig_Large shoulders sit 4× wider in rest pose. Two-hand KayKit clips (Working_B, Digging) open to a hand gap of about 0.45 of body height on Orc Brute; on Medium it is 0.22.
   - **Option A:** Large workers handle a proportionally bigger Fluff ball (radius ≈0.22 of body height). G4 then becomes a plain retarget.
   - **Option B:** keep a body-scaled ball and author an arm-in correction.
2. **No push clip exists anywhere.**
   - `wheelbarrow_walk_*` is the closest donor: legs, rhythm and lean are right, but the hands sit at the hips.
   - roll_push, roll_push_heavy and steer therefore need an arm/lean edit (G1–G3).
   - Both turn donors turn left; steer_right will be a mirror.
3. **Low-Fluff values are my extrapolation.** K1 has no High/Low split. Lump, sag, crumb and roughness for Low are my choices; the High values are K1. Georg decides the look.
4. **Palette render:** the outer balls are cut off. Two framing repairs failed, so I stopped.
5. **Paired pass_receive preview, work↔dance pose distance and loop seams: NOT_RUN.**
6. **Runtime check: NOT_RUN.** Measured in Blender and my glTF evaluator only.

## Result

### Kept (no new work)

**KEEP:**
- pass_receive: gift_give/receive (both rigs);
- celebrate_short: Cheering on Medium; gesture_cheering_a / clapping_a on both rigs.

**KEEP + FIT:**
- place_small: Interact;
- knead_press: Working_B (Medium);
- pack_flatten: Working_A;
- pull_chunk: pulling_lever_a;
- collect_debris: Digging (Medium);
- patch_press: Work_A;
- pickup_react_short: a trim of joyful_jump.

**NOT NEEDED as clips:**
- work_to_dance and dance_to_work: runtime crossfade;
- PickUp for pickup: it bends; pickup stays walk-over + POP.

### True gaps (Part 2 scope)

| Gap | Role | Rigs | Basis |
|---|---|---|---|
| G1 | roll_push | Medium + Large | DERIVE / EDIT wheelbarrow_walk_a (arms to ball centre, reach, lean) |
| G2 | roll_push_heavy | Medium + Large | DERIVE from G1 + walk_b legs in place, slower |
| G3 | steer_left / steer_right | Medium + Large | DERIVE from turn_a (travel stripped) + G1 arms; right = mirror |
| G4 | knead_press, collect_debris on Large | Large | retarget + arm-in correction (or plain retarget after decision 1) |
| G5 | place_small, pack_flatten, patch_press on Large | Large | plain Medium→Large retarget (proven in this pass) |

**NEW CLIP REQUIRED: none.**

### Fluff look and bounce

- High / Low look samples: `FLUFF_LOOK_HIGH_LOW.png` and `FLUFF_LOOK_PALETTE.png`.
- Rebuild: `scripts/fluff_look.py`. Parameters: `fluff_look_params.json`. Blend: `KFB_Fluff_Look_HighLow.blend`.
- Bounce reference: `kfb_fluff_ball_bounce_reference.glb` plus `bounce_reference.json`. Contact frames, peaks and ratios are in TEST_REPORT §6.

## Files in this return

| File | What |
|---|---|
| `REUSE_MATRIX.md` | completed matrix + gap list |
| `SOURCE.md`, `TEST_REPORT.md`, `RETURN.md` | docs |
| `AUD_RobotOne_1/2.jpg`, `AUD_OrcBrute_1/2.jpg`, `AUD_RobotTwo.jpg`, `AUD_SkeletonMinion.jpg` | source audition, 4 frames per clip |
| `ROLE_Medium_RobotOne.png`, `ROLE_Large_OrcBrute.png`, `ROLE_Large_OrcBrute_RT.png` | role previews with a placeholder ball; Medium/Large side by side |
| `metrics.json` | per-clip head / hips / hand / travel metrics, both rigs |
| `FLUFF_LOOK_HIGH_LOW.png`, `FLUFF_LOOK_PALETTE.png`, `fluff_look_params.json`, `KFB_Fluff_Look_HighLow.blend` | Fluff look |
| `kfb_fluff_ball_bounce_reference.glb`, `bounce_reference.json`, `kfb_fluff_ball_bounce_reference_side.mp4`, `BOUNCE_STRIP.png` | bounce reference |
| `scripts/` | rebuild: metrics, merge, audition, roles, retarget, look, bounce |

The audition GLBs (KayKit actors with 56 or 30 merged clips) are not shipped. `scripts/mk.py` and `scripts/rt.py` rebuild them from repo sources.
