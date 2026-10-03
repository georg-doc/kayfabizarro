# RETURN · KFB Animation Intake 05 · Motion Library v5 · 2026-09-29

Scope: index, duplicate check, convert and normalise only; no motion was edited by hand.

**Input:** 108 Mixamo FBX from Dropbox `BLENDER MCP/_inbox` (29.09):
- 10 single clips;
- 7 packs: Farming, Female Basic Locomotion, Free Test, Magic Locomotion, Male Drunk, Male Locomotion (1), and Locomotion Pack.zip (unzipped here).

**Result:**
- 79 clips baked onto Rig_Medium and Rig_Large with the unchanged pipeline (`ml_bake.py` exact transfer, v2 loop and facing metrics, v2 sheet framing).
- 27 exact duplicates of library clips were not baked, and 2 files are not animations.
- The catalogue grows from 263 to **345**: the 3 AN-PERF-01 clips (gift give/receive, nutcracker march) are folded in from their patch file, plus these 79.
- Every earlier library file stays byte-identical.

## Defects and open points (read first)

1. **Most of the male locomotion packs are already in the library.**
   - `Male Locomotion Pack (1)` is the same pack the library already holds, so all 10 clips were skipped.
   - `Free Test Pack` and `Locomotion Pack.zip` contain the same male clips again (idle, jump, strafes, 90° turns, walking), so those were skipped too.
   - New from them: only gangnam style, back flip to uppercut, a samba take, the 180° left/right turns and a different run.
2. **Duplicate check method:**
   - Each clip was compared by the world-space direction of 9 limb segments per frame, yaw-normalised. The comparison ran against all 263 published library clips (read straight from the Rig_Medium GLBs) and against each other.
   - Exact copies measure at most 2.0° (same length).
   - Clips of 3–7° with the same length or a retimed length are kept and marked `variantOf`, as in intake 04: holding_walk_c, wheelbarrow_walk_b/c, pick_fruit_c, drunk_walk_b, drunk_idle_variation_b, samba_b.
3. **Two pack "turns" do not turn.** `female_left_turn_b` and `female_right_turn_b` (the "(2)" files) show no rotation; the start and end pose are equal. Mixamo's in-place setting probably removed the turn. Kept and marked; use the `_a` turns.
4. **A library label was wrong and is now corrected.** `kfb_locomotion_standing_walk_forward_a` (intake 04, labelled "Gehen mit Waffe vor der Brust") is identical to the Magic pack's "Standing Walk Forward". It is the caster walk. Label and comment are corrected; it is also the forward walk of the new `magic_caster` set.
5. **Not clean loops (one-shots or curves):** tripping, box/holding/drunk turns, box_walk_arc, wheelbarrow_walk_turn, pull_plant_a, pick_fruit_c, the magic jump chain, the drunk curves, samba_b, back flip to uppercut. `drunk_idle_a` (14°) and `drunk_idle_variation_c` (12°) need a blend when looped.
6. **Props are not included:** box, wheelbarrow, phone, watering can, plant, sapling, door. Clips carry `props` (which hand, which prop).
7. **Contact sheets:** all 79 were rendered and viewed. No floating, twisted or mirrored retarget was found. Floor contact in the kneeling farm clips follows the source; there is no ground IK.
8. **Raw FBX stay in Dropbox `_inbox/`** and never go to GitHub.

## How to use the packs (locomotionSets)

A pack is a movement **set**: one idle, walks and runs in several directions, turns and a jump. The catalogue now has a top-level `locomotionSets` block with 7 sets:

| Set | What it covers |
|---|---|
| `male_basic` | Existing Male Locomotion clips plus the new 180° turns and run |
| `female_basic` | Female Basic Locomotion |
| `magic_caster` | Magic Locomotion |
| `drunk` | Male Drunk |
| `carry_box` | Farming box |
| `carry_holding` | Farming holding |
| `wheelbarrow` | Farming wheelbarrow |

Each set lists its members by role (idle, walk, run, strafeLeft, turnLeft90, jump …) and the measured root speed per rig in m/s.

The runtime (ToolBox Animation Studio, WorldBuilder locomotion) should:
- pick the member by state and move direction;
- blend neighbouring members by speed;
- play turns when the heading changes on the spot.

This is the standard game-engine use of Mixamo packs; the clips stay single clips.

## Georg-facing notes

- **Farming Pack:** a full work kit for residents in gardens and Clay City: box and holding carry sets, wheelbarrow push/turn/dump, digging, planting, pulling plants (with a comic stumble), picking fruit high and low, watering, cow milking.
- **Magic Locomotion:** a complete spell-caster movement set. It pairs with casting_spell, fireball and two_hand_spell_casting for mage residents and magic duels.
- **Male Drunk:** a complete comic set (idles, walks, runs, curves) for the tavern, the party after the concert, and slapstick.
- **Singles:**
  - tripping, which chains into getting_up;
  - phone pacing (37 s of background life);
  - stairs;
  - old man walk;
  - two texting walks;
  - door outwards;
  - swatting bugs.

## Verification

- Both rigs: 79 animations in 8 supplement files `KFB_Motion_<group>_i05.glb`. Every file has 24 nodes, 0 meshes and 0 skins; node names and rest transforms equal the v3 talk GLB (max difference 0).
- Animation names equal the catalogue ids. The GLB round trip against the baked actions is 0.0 cm (3 clips per rig).
- Catalogue: 345 clips, 345 unique ids; every locomotionSets member exists; sha256 for each new GLB in `libraries`.

## Skipped: exact duplicates of library clips

| Source file | Library clip |
|---|---|
| `Male Locomotion Pack (1)/idle.fbx` | `kfb_idle_idle_f` |
| `Male Locomotion Pack (1)/jump.fbx` | `kfb_locomotion_jump_a` |
| `Male Locomotion Pack (1)/left strafe walking.fbx` | `kfb_locomotion_left_strafe_walking_a` |
| `Male Locomotion Pack (1)/left strafe.fbx` | `kfb_locomotion_left_strafe_a` |
| `Male Locomotion Pack (1)/left turn 90.fbx` | `kfb_locomotion_left_turn_90_a` |
| `Male Locomotion Pack (1)/right strafe walking.fbx` | `kfb_locomotion_right_strafe_walking_a` |
| `Male Locomotion Pack (1)/right strafe.fbx` | `kfb_locomotion_right_strafe_a` |
| `Male Locomotion Pack (1)/right turn 90.fbx` | `kfb_locomotion_right_turn_90_a` |
| `Male Locomotion Pack (1)/standard run.fbx` | `kfb_locomotion_standard_run_a` |
| `Male Locomotion Pack (1)/walking.fbx` | `kfb_locomotion_walking_c` |
| `Free Test Pack/idle.fbx` | `kfb_idle_idle_f` |
| `Free Test Pack/jump.fbx` | `kfb_locomotion_jump_a` |
| `Free Test Pack/left strafe walking.fbx` | `kfb_locomotion_left_strafe_walking_a` |
| `Free Test Pack/left turn 90.fbx` | `kfb_locomotion_left_turn_90_a` |
| `Free Test Pack/right strafe walking.fbx` | `kfb_locomotion_right_strafe_walking_a` |
| `Free Test Pack/right turn 90.fbx` | `kfb_locomotion_right_turn_90_a` |
| `Free Test Pack/walking.fbx` | `kfb_locomotion_walking_c` |
| `Locomotion Pack/idle.fbx` | `kfb_idle_idle_f` |
| `Locomotion Pack/jump.fbx` | `kfb_locomotion_jump_a` |
| `Locomotion Pack/left strafe walking.fbx` | `kfb_locomotion_left_strafe_walking_a` |
| `Locomotion Pack/left strafe.fbx` | `kfb_locomotion_left_strafe_a` |
| `Locomotion Pack/left turn 90.fbx` | `kfb_locomotion_left_turn_90_a` |
| `Locomotion Pack/right strafe walking.fbx` | `kfb_locomotion_right_strafe_walking_a` |
| `Locomotion Pack/right strafe.fbx` | `kfb_locomotion_right_strafe_a` |
| `Locomotion Pack/right turn 90.fbx` | `kfb_locomotion_right_turn_90_a` |
| `Locomotion Pack/walking.fbx` | `kfb_locomotion_walking_c` |
| `Magic Locomotion Pack/Standing Walk Forward.fbx` | `kfb_locomotion_standing_walk_forward_a` |
| `Farming Pack/kneeling idle.fbx` | `kfb_idle_kneeling_a` |

Not animations: `Farming Pack/Survivalist.fbx` (character file (mesh + T-pose), not an animation), `Free Test Pack/skinning test.fbx` (Mixamo skinning test (T-pose range-of-motion), not a performance clip).

## New files

| File | Clips | Bytes | sha256 |
|---|---|---|---|
| `libs/Rig_Large/KFB_Motion_action_i05.glb` | 1 | 66856 | `f31f616dce55c2c1…` |
| `libs/Rig_Large/KFB_Motion_dance_i05.glb` | 2 | 316800 | `ca45e8bbfe30a2d2…` |
| `libs/Rig_Large/KFB_Motion_gesture_i05.glb` | 1 | 73224 | `b60537c97324b86b…` |
| `libs/Rig_Large/KFB_Motion_idle_i05.glb` | 8 | 443532 | `bbd62f68673bd6ad…` |
| `libs/Rig_Large/KFB_Motion_interaction_i05.glb` | 12 | 763076 | `047f1144d4ff07d8…` |
| `libs/Rig_Large/KFB_Motion_locomotion_i05.glb` | 53 | 1404716 | `a0ce8a2f38c998ad…` |
| `libs/Rig_Large/KFB_Motion_reaction_i05.glb` | 1 | 38136 | `965378a598f5819d…` |
| `libs/Rig_Large/KFB_Motion_talk_i05.glb` | 1 | 311172 | `3d431bf1a6a1ac48…` |
| `libs/Rig_Medium/KFB_Motion_action_i05.glb` | 1 | 66788 | `0845838f8f7f3d3f…` |
| `libs/Rig_Medium/KFB_Motion_dance_i05.glb` | 2 | 316728 | `4fa67f961d1b848a…` |
| `libs/Rig_Medium/KFB_Motion_gesture_i05.glb` | 1 | 73016 | `9dae61305e13df7d…` |
| `libs/Rig_Medium/KFB_Motion_idle_i05.glb` | 8 | 443876 | `7b2e949e74be875b…` |
| `libs/Rig_Medium/KFB_Motion_interaction_i05.glb` | 12 | 764240 | `fb9ce3da92fc119a…` |
| `libs/Rig_Medium/KFB_Motion_locomotion_i05.glb` | 53 | 1406180 | `736fdef8149ba8f9…` |
| `libs/Rig_Medium/KFB_Motion_reaction_i05.glb` | 1 | 38068 | `d924198158306302…` |
| `libs/Rig_Medium/KFB_Motion_talk_i05.glb` | 1 | 311100 | `f8b8cd9111932530…` |

`KFB_Motion_Library.catalog.json` replaces the intake 04 catalogue (263 → 345); `sheets/<group>/<id>.png` has one sheet per new clip.

## New clips (79)

Speed: m/s for travelling clips, Rig_Medium.

| id | Label (DE) | Pack / source | Frames | Loop | Speed | Comment |
|---|---|---|---|---|---|---|
| `kfb_locomotion_ascending_stairs_a` | Treppe steigen | — / Ascending Stairs.fbx | 42 | yes | 0.25 | Climbing stairs: high knee steps with the body rising about 0.3 m per cycle; 1.4 s loop. |
| `kfb_locomotion_old_man_walk_a` | Gehen wie ein alter Mann | — / Old Man Walk.fbx | 47 | yes | 0.42 | Slow hunched shuffle (about 0.42 m/s), strong forward lean, short steps. |
| `kfb_locomotion_texting_and_walking_a` | Gehen und tippen | — / Texting And Walking.fbx | 100 | yes | 0.84 | Walking about 0.84 m/s while typing on a phone held in both hands; head down. |
| `kfb_locomotion_walking_while_texting_a` | Gehen und aufs Handy schauen | — / Walking While Texting.fbx | 121 | yes | 0.59 | Slower walk (about 0.59 m/s) looking at a phone held in one hand. |
| `kfb_locomotion_walk_backwards_a` | Rückwärts gehen | — / Walk Backwards.fbx | 117 | yes | 0.31 | Careful backward walk (about 0.31 m/s), body turned about 20 degrees, looking back over the shoulder. |
| `kfb_locomotion_walking_o` | Gehen | — / Walking (12).fbx | 26 | yes | 0.63 | Short brisk walk cycle (0.9 s, about 0.63 m/s) with the body turned about 25 degrees. |
| `kfb_reaction_tripping_a` | Stolpern | — / Tripping.fbx | 64 | no | 0.78 | Walks, trips and falls flat on the face; ends lying down (travels about 1.7 m). |
| `kfb_interaction_opening_door_outwards_a` | Tür nach außen öffnen | — / Open Door Outwards.fbx | 124 | yes | 0.36 | Walks up, pushes a door outwards and walks through (4.1 s, travels 1.5 m). |
| `kfb_talk_pacing_on_phone_a` | Telefonieren und auf und ab gehen | — / Pacing And Talking On A Phone.fbx | 1130 | yes | 0.06 | Long phone call (37.7 s): walks back and forth and turns while talking with the phone at the ear; gestures with the free hand. |
| `kfb_gesture_swatting_bugs_a` | Insekten wegschlagen | — / Swatting Bugs.fbx | 201 | yes | 0.33 | Walks a few steps while swatting at flies around the head with both hands (6.7 s). |
| `kfb_idle_box_idle_a` | Stehen mit Kiste | Farming Pack / box idle.fbx | 184 | yes |  | Standing idle holding a box in front with both hands, leaning back a little under its weight. |
| `kfb_locomotion_box_turn_a` | Mit Kiste umdrehen | Farming Pack / box turn.fbx | 47 | no | 0.17 | In-place turn of about 135 degrees while holding a box (1.6 s). |
| `kfb_locomotion_box_turn_b` | Mit Kiste umdrehen | Farming Pack / box turn (2).fbx | 32 | no | 0.14 | Shorter in-place turn of about 80 degrees while holding a box (1.1 s). |
| `kfb_locomotion_box_walk_arc_a` | Mit Kiste im Bogen gehen | Farming Pack / box walk arc.fbx | 37 | no | 0.78 | Walking a curve (about 0.78 m/s) while carrying a box; body leans back. |
| `kfb_idle_holding_idle_a` | Stehen mit Last | Farming Pack / holding idle.fbx | 180 | yes |  | Standing idle holding something in front with both hands. |
| `kfb_locomotion_holding_turn_left_a` | Mit Last nach links drehen | Farming Pack / holding turn left.fbx | 31 | no | 0.21 | Turn left on the spot of about 170 degrees while holding something in front (1.0 s). |
| `kfb_locomotion_holding_turn_right_a` | Mit Last nach rechts drehen | Farming Pack / holding turn right.fbx | 40 | no | 0.09 | Turn right on the spot of about 150 degrees while holding something in front (1.3 s). |
| `kfb_locomotion_holding_walk_c` | Gehen mit Last | Farming Pack / holding walk.fbx | 42 | yes | 0.82 | Carry walk from the Farming Pack; same length as kfb_locomotion_holding_walk_a with only small pose differences (3 degrees). |
| `kfb_idle_wheelbarrow_idle_a` | Stehen mit Schubkarre | Farming Pack / wheelbarrow idle.fbx | 45 | yes |  | Standing idle holding the handles of a wheelbarrow, bent slightly forward. |
| `kfb_locomotion_wheelbarrow_walk_b` | Schubkarre schieben | Farming Pack / wheelbarrow walk.fbx | 29 | yes | 1.11 | Pushing a wheelbarrow (about 1.1 m/s), a retimed variant of kfb_locomotion_wheelbarrow_walk_a (29 instead of 30 frames). |
| `kfb_locomotion_wheelbarrow_walk_c` | Schubkarre schieben | Farming Pack / wheelbarrow walk (2).fbx | 29 | yes | 1.11 | Pushing a wheelbarrow, second Farming Pack take: same timing as wheelbarrow_walk_b with less forward lean. |
| `kfb_locomotion_wheelbarrow_walk_turn_a` | Schubkarre im Bogen schieben | Farming Pack / wheelbarrow walk turn.fbx | 33 | no | 1.12 | Pushing a wheelbarrow through a curve (1.1 s); not a straight loop (first and last pose differ 28 degrees). |
| `kfb_locomotion_wheelbarrow_walk_turn_b` | Schubkarre im Bogen schieben | Farming Pack / wheelbarrow walk turn (2).fbx | 33 | no | 1.10 | Second take of the wheelbarrow curve, more upright. |
| `kfb_interaction_wheelbarrow_dump_a` | Schubkarre auskippen | Farming Pack / wheelbarrow dump.fbx | 188 | yes |  | Tips the wheelbarrow forward to empty it, then sets it down (6.3 s). |
| `kfb_interaction_cow_milking_a` | Kuh melken | Farming Pack / cow milking.fbx | 137 | yes |  | Crouched low, both hands working in front at knee height as if milking (loops). |
| `kfb_interaction_dig_and_plant_seeds_a` | Graben und säen | Farming Pack / dig and plant seeds.fbx | 166 | yes |  | Kneels down, digs a hole with the hands, drops seeds, stands up again (5.5 s). |
| `kfb_interaction_plant_a_plant_a` | Pflanze einsetzen | Farming Pack / plant a plant.fbx | 227 | yes |  | Kneels and sets a plant into the ground with both hands, then stands (7.6 s). |
| `kfb_interaction_plant_tree_a` | Baum pflanzen | Farming Pack / plant tree.fbx | 273 | yes |  | Plants a small tree: kneels, places it, pats the soil and stands (9.1 s). |
| `kfb_interaction_pull_plant_a` | Pflanze herausziehen | Farming Pack / pull plant.fbx | 141 | no |  | Bends down, grabs a plant and pulls hard, stumbling back as it comes out (4.7 s; not a loop). |
| `kfb_interaction_pull_plant_b` | Pflanze herausziehen | Farming Pack / pull plant (2).fbx | 143 | yes |  | Second take of pulling a plant: shorter tug without the stumble (4.8 s, clean loop). |
| `kfb_interaction_pick_fruit_b` | Obst pflücken | Farming Pack / pick fruit.fbx | 240 | yes |  | Reaches up to pick fruit from a tree with one hand, several times (8.0 s). |
| `kfb_interaction_pick_fruit_c` | Obst pflücken | Farming Pack / pick fruit (2).fbx | 182 | no |  | Fruit picking, a retimed variant of kfb_interaction_pick_fruit_a (182 instead of 187 frames). |
| `kfb_interaction_pick_fruit_d` | Obst pflücken | Farming Pack / pick fruit (3).fbx | 214 | yes |  | Picks fruit from the ground: squats down, gathers, stands up (7.1 s). |
| `kfb_interaction_watering_a` | Gießen | Farming Pack / watering.fbx | 169 | yes |  | Watering plants with a can held in one hand, swaying it over the bed (5.6 s). |
| `kfb_idle_female_idle_a` | Stehen (Female-Paket) | Female Basic Locomotion Pack / idle.fbx | 251 | yes |  | Quiet standing idle with weight shifts (Female Basic Locomotion Pack), 8.4 s loop. |
| `kfb_locomotion_female_walking_a` | Gehen (Female-Paket) | Female Basic Locomotion Pack / walking.fbx | 30 | yes | 1.10 | Light walk (about 1.1 m/s) with narrow steps and hip sway. |
| `kfb_locomotion_female_running_a` | Rennen (Female-Paket) | Female Basic Locomotion Pack / running.fbx | 22 | yes | 2.45 | Light run (about 2.45 m/s) with forward lean. |
| `kfb_locomotion_female_jump_a` | Springen (Female-Paket) | Female Basic Locomotion Pack / jump.fbx | 51 | yes |  | Jump in place with a crouch before and after (1.7 s). |
| `kfb_locomotion_female_left_strafe_walk_a` | Seitwärts links gehen (Female-Paket) | Female Basic Locomotion Pack / left strafe walk.fbx | 29 | yes | 1.28 | Sidestep walk to the left (about 1.28 m/s), body facing forward. |
| `kfb_locomotion_female_right_strafe_walk_a` | Seitwärts rechts gehen (Female-Paket) | Female Basic Locomotion Pack / right strafe walk.fbx | 29 | yes | 1.28 | Sidestep walk to the right (about 1.28 m/s). |
| `kfb_locomotion_female_left_strafe_a` | Seitwärts links laufen (Female-Paket) | Female Basic Locomotion Pack / left strafe.fbx | 21 | yes | 2.34 | Fast sideways run to the left (about 2.3 m/s). |
| `kfb_locomotion_female_right_strafe_a` | Seitwärts rechts laufen (Female-Paket) | Female Basic Locomotion Pack / right strafe.fbx | 21 | yes | 2.34 | Fast sideways run to the right (about 2.3 m/s). |
| `kfb_locomotion_female_left_turn_a` | Nach links drehen (Female-Paket) | Female Basic Locomotion Pack / left turn.fbx | 35 | no |  | Turn 90 degrees left on the spot (1.2 s). |
| `kfb_locomotion_female_left_turn_b` | Nach links drehen (Female-Paket) | Female Basic Locomotion Pack / left turn (2).fbx | 36 | yes |  | Second "left turn" from the pack: the body barely turns and start and end pose are equal, so it reads as an idle weight shift. |
| `kfb_locomotion_female_right_turn_a` | Nach rechts drehen (Female-Paket) | Female Basic Locomotion Pack / right turn.fbx | 34 | no |  | Turn 90 degrees right on the spot (1.1 s). |
| `kfb_locomotion_female_right_turn_b` | Nach rechts drehen (Female-Paket) | Female Basic Locomotion Pack / right turn (2).fbx | 35 | yes |  | Second "right turn" from the pack: barely turns (see female_left_turn_b). |
| `kfb_idle_magic_standing_idle_a` | Magier-Stand | Magic Locomotion Pack / standing idle.fbx | 56 | yes |  | Spell-caster ready stance: body turned about 50 degrees, hands raised and ready. |
| `kfb_locomotion_magic_walk_back_a` | Magier: rückwärts gehen | Magic Locomotion Pack / Standing Walk Back.fbx | 37 | yes | 0.80 | Caster stance walking backwards (about 0.8 m/s), keeping the hands up. |
| `kfb_locomotion_magic_walk_left_a` | Magier: nach links gehen | Magic Locomotion Pack / Standing Walk Left.fbx | 36 | yes | 0.88 | Caster stance sidestep to the left (about 0.9 m/s). |
| `kfb_locomotion_magic_walk_right_a` | Magier: nach rechts gehen | Magic Locomotion Pack / Standing Walk Right.fbx | 37 | yes | 0.91 | Caster stance sidestep to the right (about 0.9 m/s). |
| `kfb_locomotion_magic_run_forward_a` | Magier: vorwärts rennen | Magic Locomotion Pack / Standing Run Forward.fbx | 23 | yes | 2.55 | Caster run forward (about 2.55 m/s) with the body turned and hands ready. |
| `kfb_locomotion_magic_run_back_a` | Magier: rückwärts rennen | Magic Locomotion Pack / Standing Run Back.fbx | 20 | yes | 2.10 | Caster run backwards (about 2.1 m/s). |
| `kfb_locomotion_magic_run_left_a` | Magier: nach links rennen | Magic Locomotion Pack / Standing Run Left.fbx | 24 | yes | 2.29 | Caster run to the left (about 2.3 m/s). |
| `kfb_locomotion_magic_run_right_a` | Magier: nach rechts rennen | Magic Locomotion Pack / Standing Run Right.fbx | 24 | yes | 2.57 | Caster run to the right (about 2.6 m/s). |
| `kfb_locomotion_magic_sprint_forward_a` | Magier: sprinten | Magic Locomotion Pack / Standing Sprint Forward.fbx | 18 | yes | 3.63 | Caster sprint (about 3.6 m/s), strong forward lean. |
| `kfb_locomotion_magic_turn_left_90_a` | Magier: 90° links drehen | Magic Locomotion Pack / Standing Turn Left 90.fbx | 47 | no |  | Caster stance turn 90 degrees left on the spot. |
| `kfb_locomotion_magic_turn_right_90_a` | Magier: 90° rechts drehen | Magic Locomotion Pack / Standing Turn Right 90.fbx | 44 | no | 0.04 | Caster stance turn 90 degrees right on the spot. |
| `kfb_locomotion_magic_jump_a` | Magier: Sprung aus dem Stand | Magic Locomotion Pack / Standing Jump.fbx | 72 | no | 0.03 | Jump from the caster stance with a big crouch (2.4 s, one-shot). |
| `kfb_locomotion_magic_jump_running_a` | Magier: Sprung im Lauf | Magic Locomotion Pack / Standing Jump Running.fbx | 33 | no | 2.53 | Jump while running (takes off, flies about 2.7 m forward); ends in the air (one-shot). |
| `kfb_locomotion_magic_jump_running_landing_a` | Magier: Landung im Lauf | Magic Locomotion Pack / Standing Jump Running Landing.fbx | 42 | no | 2.21 | Landing from the running jump and running on (about 3.1 m). |
| `kfb_locomotion_magic_land_to_idle_a` | Magier: Landung zum Stand | Magic Locomotion Pack / Standing Land To Standing Idle.fbx | 34 | no | 0.75 | Landing from a jump into the caster stance (1.1 s). |
| `kfb_idle_drunk_idle_a` | Betrunken stehen | Male Drunk Pack / drunk idle.fbx | 219 | yes |  | Swaying drunk idle with a stagger step; 7.3 s (first and last pose differ 14 degrees, blend when looping). |
| `kfb_idle_drunk_idle_variation_b` | Betrunken stehen (Variante) | Male Drunk Pack / drunk idle variation.fbx | 120 | yes |  | Drunk idle variation from the Male Drunk Pack; same length as kfb_idle_drunk_idle_variation_a with small pose differences. |
| `kfb_idle_drunk_idle_variation_c` | Betrunken stehen (Variante) | Male Drunk Pack / drunk idle variation (2).fbx | 154 | yes |  | Second drunk idle variation: bigger sway and a near fall (5.1 s). |
| `kfb_locomotion_drunk_walk_b` | Betrunken gehen | Male Drunk Pack / drunk walk.fbx | 91 | yes | 0.58 | Drunk walk from the Male Drunk Pack; same length as kfb_locomotion_drunk_walk_a with small pose differences; body turned about 30 degrees. |
| `kfb_locomotion_drunk_walk_backwards_a` | Betrunken rückwärts gehen | Male Drunk Pack / drunk walk backwards.fbx | 48 | yes | 0.82 | Drunk stagger backwards (about 0.8 m/s), strong backward lean. |
| `kfb_locomotion_drunk_walking_turn_a` | Betrunken im Gehen drehen | Male Drunk Pack / drunk walking turn.fbx | 78 | no | 0.58 | Drunk walk that curves to the side (2.6 s; not a straight loop). |
| `kfb_locomotion_drunk_turn_a` | Betrunken umdrehen | Male Drunk Pack / drunk turn.fbx | 48 | no |  | Drunk turn of about 90 degrees on the spot with a wobble. |
| `kfb_locomotion_drunk_run_forward_a` | Betrunken rennen | Male Drunk Pack / drunk run forward.fbx | 56 | yes | 1.73 | Drunk run (about 1.7 m/s) with flailing arms and a big forward lean. |
| `kfb_locomotion_drunk_run_backward_a` | Betrunken rückwärts rennen | Male Drunk Pack / drunk run backward.fbx | 34 | yes | 1.59 | Drunk backwards run (about 1.6 m/s), leaning far back. |
| `kfb_locomotion_drunk_running_left_turn_a` | Betrunken rennen mit Linkskurve | Male Drunk Pack / drunk running left turn.fbx | 46 | no | 1.57 | Drunk run curving left by about 90 degrees. |
| `kfb_locomotion_drunk_backward_walking_turn_a` | Betrunken rückwärts gehen und drehen | Male Drunk Pack / backward walking turn.fbx | 60 | no | 0.63 | Drunk backward walk that curves (2.0 s). |
| `kfb_locomotion_drunk_run_backward_arc_right_a` | Betrunken rückwärts im Bogen rennen | Male Drunk Pack / run backward arc right.fbx | 38 | no | 1.38 | Drunk backward run curving right. |
| `kfb_locomotion_left_turn_b` | Nach links drehen | Locomotion Pack / left turn.fbx | 47 | no | 0.04 | Turn left on the spot of about 180 degrees (Locomotion Pack, 1.6 s); a different clip from kfb_locomotion_left_turn_a and left_turn_90_a. |
| `kfb_locomotion_right_turn_b` | Nach rechts drehen | Locomotion Pack / right turn.fbx | 50 | no | 0.05 | Turn right on the spot of about 180 degrees (Locomotion Pack, 1.7 s). |
| `kfb_locomotion_running_d` | Rennen | Locomotion Pack / running.fbx | 22 | yes | 2.84 | Plain run (about 2.8 m/s) from the Locomotion Pack; different from running_a/b/c. |
| `kfb_action_back_flip_to_uppercut_a` | Rückwärtssalto mit Uppercut | Free Test Pack / back flip to uppercut.fbx | 176 | no | 0.05 | Back flip that lands into a rising uppercut (5.9 s, body turned about 45 degrees). |
| `kfb_dance_gangnam_style_a` | Gangnam Style | Free Test Pack / gangnam style.fbx | 372 | yes |  | The horse-riding dance: bouncing gallop steps with crossed wrists and a lasso arm (12.4 s). |
| `kfb_dance_samba_b` | Samba | Free Test Pack / samba dancing.fbx | 717 | no | 0.01 | Samba from the Free Test Pack: same length as kfb_dance_samba_a with small pose differences, turned about 90 degrees at the start. |
