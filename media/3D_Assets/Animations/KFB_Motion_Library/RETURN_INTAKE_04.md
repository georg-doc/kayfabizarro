# RETURN · KFB Animation Intake 04 · Motion Library v4 · 2026-09-29

Scope: index, check for duplicates, convert and normalise only; no motion was edited by hand. 61 new Mixamo FBX from Dropbox `BLENDER MCP/_inbox` (28.09, 20:34–21:20). 59 were baked onto Rig_Medium and Rig_Large with the unchanged pipeline (`ml_bake.py` exact transfer, v2 loop and facing metrics, v2 sheet framing); 2 are exact duplicates and were not baked. The library is additive: **every v1–v3 file stays byte-identical**; the catalogue grows from 204 to 263 clips.

## Defects and open points (read first)

1. **Duplicates.** Each new FBX was compared frame by frame (16 bone rotations) with every other new FBX and with the older sources of the same name and of every walk in the library.
   - **Exact duplicates, not baked:** `Walk To Stop (1)` = `kfb_locomotion_walk_to_stop_a` (max 0.05°), `Wheelbarrow Walk (1)` = `kfb_locomotion_wheelbarrow_walk_a` (max 0.9°).
   - **Arm-space variants** (identical legs and timing; only the arms sit further out, the Mixamo arm-space setting): `walking_h` of `walking_c`, `sad_walk_b`, `left_strafe_walking_b`, `right_strafe_walking_b`, `fist_fight_b_b`. Kept because wide box bodies need wider arms; marked `variantOf`.
   - **Retimed variants** (same motion, other Mixamo speed settings): `strut_walking_b`, `scary_clown_walk_b`, `hook_punch_b`, `picking_up_object_b`. Marked `variantOf`.
   - **Same name, different motion:** `headbutt_b`, `punching_b`, `entry_b`, `holding_walk_b`. The holding walk matches `holding_walk_a` in length and travel, but the legs match half a cycle later and the arms differ.
   - No two new clips are duplicates of each other.
2. **Surprise Uppercut is the receiving side.** The character is launched up and lands on its back. It is filed as `kfb_reaction_surprise_uppercut_a` (reaction), not as an attack.
3. **Supplement files.** All 59 clips belong to existing groups, so they live in `KFB_Motion_<group>_i04.glb` (locomotion 35, action 16, reaction 4, idle 2, interaction 2). The catalogue `library` field points every clip to its file.
4. **Not clean loops:** `walking_n` (23.9°); `stop_walking`, `walking_turn_180`, `jump_up`, `fist_fight_a_a`, `fist_fight_b_b`, `jumping_over_into_combat`, `surprise_uppercut`, `walking_to_dying`, `getting_up` and `picking_up_object_b` are one-shots.
5. **Strike markers.** For 8 attack clips, `events.strike` holds a measured candidate: the frame of peak speed of the fastest hand or foot (Rig_Medium). It is meant for syncing the opponent's reaction in fight choreography and must be confirmed in the Animation Studio. No markers for headbutt or crescent kick, where the peak does not show the hit.
6. **Props are not included.** Briefcase, rifle, bag, torch, IV pole, sword, pistol and knife clips carry `props` (which hand, which prop). The objects must be attached in the Animation Studio.
7. **Contact sheets.** All 59 were rendered with the v2 framing, and every one was viewed. No floating, twisted or mirrored retarget was found.
8. **Raw FBX** stay in Dropbox `_inbox/` and never go to GitHub.

## Georg's cases

- **Nutcracker, marching with the rifle in the right hand:** `kfb_locomotion_walk_with_briefcase_a`. The right arm hangs straight with little swing while the left arm swings, so the briefcase can be swapped for the rifle. The alternative is `kfb_locomotion_walking_with_shopping_bag_a` (the bag walk): the same one-hand carry, with more lean back. For a patrol with the rifle held in both hands: `kfb_locomotion_walk_with_rifle_a` or `kfb_locomotion_standing_walk_forward_a`.
- **Resident fights (wrestling-style boxing)** can be built from these parts:
  - walk-in: `walking_l` (fists up), `walking_i` (stomping);
  - stance: `action_boxing_a`;
  - attacks: `quad_punch`, `hook_punch_b`, `punching_b`, `fist_fight_a_a`, `headbutt_b`, `hurricane_kick`;
  - reactions: `reaction_taking_punch_a`, knockout `reaction_surprise_uppercut_a`, then `reaction_getting_up_a`;
  - entrance: `jumping_over_into_combat_a`, `backflip_a`.

  Faces and timing are fine-tuned in the Animation Studio.

## Verification

- Each rig has 59 animations across 5 files, with 0 meshes and 0 skins. Every file has 24 nodes, and node names and rest transforms equal the v3 `KFB_Motion_talk.glb` (max difference 0.0).
- Catalogue: 263 clips, 263 unique ids, and a sha256 for each new GLB in `libraries`. Every new id has an action in its file, and vice versa (checked after export).
- New optional fields: `variantOf`, `props`, `tags`, `comment`, `residentIdeas`, `events.strike`.

## New files

| file | clips | bytes | sha256 |
|---|---|---|---|
| libs/Rig_Medium/KFB_Motion_locomotion_i04.glb | 35 | 956100 | 3c739b9aa00d8bbc… |
| libs/Rig_Large/KFB_Motion_locomotion_i04.glb | 35 | 949780 | b3ee5e7d118b2f33… |
| libs/Rig_Medium/KFB_Motion_action_i04.glb | 16 | 675512 | 507c0cc643a2dd50… |
| libs/Rig_Large/KFB_Motion_action_i04.glb | 16 | 675448 | 3b38a92e67dc86cf… |
| libs/Rig_Medium/KFB_Motion_reaction_i04.glb | 4 | 223652 | fe38c7da70b5d074… |
| libs/Rig_Large/KFB_Motion_reaction_i04.glb | 4 | 224272 | 4f03263a96a5b72a… |
| libs/Rig_Medium/KFB_Motion_idle_i04.glb | 2 | 121620 | 5e0fa5216840eaca… |
| libs/Rig_Large/KFB_Motion_idle_i04.glb | 2 | 121140 | 23537a5459df5e1a… |
| libs/Rig_Medium/KFB_Motion_interaction_i04.glb | 2 | 134436 | aba646d8bb1e3201… |
| libs/Rig_Large/KFB_Motion_interaction_i04.glb | 2 | 134232 | 751a060f15c0c4f5… |

`sheets/<group>/<id>.png` for the 59 clips.

## Clips

Travel is metres per cycle for Rig_Medium / Rig_Large. Strike is the candidate frame and limb. Resident ideas are suggestions, not decisions.

| id | label_de | source | frames | sec | loop (Δ°) | travel m | variant | strike | what it does | resident ideas |
|---|---|---|---|---|---|---|---|---|---|---|
| `kfb_locomotion_walking_d` | Gehen | Walking (1).fbx | 30 | 1.0 | yes (0.0) | 1.103 / 2.831 |  |  | Calm everyday walk, about 1.1 m/s, upright, arms held slightly away from the body, low bounce. | Default walk for most residents; good neutral base for the Animation Studio. |
| `kfb_locomotion_walking_e` | Gehen | Walking (2).fbx | 42 | 1.4 | yes (3.3) | 0.977 / 2.509 |  |  | Relaxed stroll, slower (about 0.7 m/s), wide loose arm swing, right hand carried a bit higher. | Easy-going or bored residents; FrizzleBob on a lazy day. |
| `kfb_locomotion_walking_f` | Gehen | Walking (3).fbx | 113 | 3.767 | yes (2.7) | 1.009 / 2.59 |  |  | Very slow cautious walk (about 0.27 m/s over 3.8 s), upper body leaning back, hands in front of the body. | Sneaking, nervous or elderly residents; a guard creeping up. |
| `kfb_locomotion_walking_g` | Gehen | Walking (4).fbx | 32 | 1.067 | yes (0.1) | 1.256 / 3.223 |  |  | Brisk normal walk, about 1.2 m/s, arms low and close. | Busy city residents, errand runners. |
| `kfb_locomotion_walking_h` | Gehen | Walking (5).fbx | 32 | 1.067 | yes (0.1) | 1.173 / 3.012 | arm-space of `kfb_locomotion_walking_c` |  | Same walk as kfb_locomotion_walking_c (Male Locomotion Pack), only the arms are held further out (Mixamo arm-space setting). | Use on bulky box bodies where walking_c lets the arms cut into the torso. |
| `kfb_locomotion_walking_i` | Gehen | Walking (6).fbx | 41 | 1.367 | yes (0.5) | 1.31 / 3.362 |  |  | Heavy stomping walk: strong forward lean, high hip bounce, long stride. | Brute, orcs, a grumpy heavy; the angry-resident approach before a fight. |
| `kfb_locomotion_walking_j` | Gehen | Walking (7).fbx | 64 | 2.133 | yes (0.7) | 2.038 / 5.232 |  |  | Hunched lopsided walk with the body turned about 40 degrees; the left arm dangles and swings far, the right barely. Reads tired or tipsy. | Exhausted, drunk or injured residents; comic relief after a lost fight. |
| `kfb_locomotion_walking_k` | Gehen | Walking (8).fbx | 45 | 1.5 | yes (0.1) | 1.25 / 3.208 |  |  | Loose easy walk, about 0.83 m/s, arms close to the body. | Casual background walker. |
| `kfb_locomotion_walking_l` | Gehen | Walking (9).fbx | 50 | 1.667 | yes (0.0) | 0.667 / 1.713 |  |  | Slow prowl with both fists raised and the body turned sideways: a fighter closing in. | Walk-in for resident brawls and wrestling scenes; Brute or orc before the first punch. |
| `kfb_locomotion_walking_m` | Gehen | Walking (10).fbx | 76 | 2.533 | yes (5.1) | 1.843 / 4.731 |  |  | Walk with a stumble: the character trips, nearly falls flat forward, catches itself and walks on. | Clumsy residents, slapstick moments, a drunk on the way home. |
| `kfb_locomotion_walking_n` | Gehen | Walking (11).fbx | 56 | 1.867 | no (23.9) | 1.26 / 3.235 |  |  | Wide-legged walk with bent knees and the upper body leaning back; slow and swaggering. | Cowboy-style swagger, a boss resident, a pirate on land. |
| `kfb_locomotion_standard_walk_a` | Normal gehen | Standard Walk.fbx | 36 | 1.2 | yes (0) | 1.242 / 3.188 |  |  | Plain standard walk, about 1.0 m/s; the reference walk of this intake. | Neutral default for any resident. |
| `kfb_locomotion_standing_walk_forward_a` | Gehen mit Waffe vor der Brust | Standing Walk Forward.fbx | 35 | 1.167 | yes (0.0) | 1.287 / 3.303 |  |  | Walk with both hands held together in front of the chest and the body turned about 45 degrees, as if carrying a rifle at the ready. Arms barely swing. | Armed guard or soldier on patrol; Officer Doppeldenk on duty. |
| `kfb_locomotion_happy_walk_a` | Fröhlich gehen | Happy Walk.fbx | 34 | 1.133 | yes (0.0) | 1.248 / 3.203 |  |  | Bouncy happy walk with high hip bounce and forward lean. | Cheerful residents, FrizzleBob in a good mood, a dancer walking to the party. |
| `kfb_locomotion_happy_walk_backward_a` | Fröhlich rückwärts gehen | Happy Walk Backward.fbx | 32 | 1.067 | yes (0.2) | 0.91 / 2.336 |  |  | Happy bouncy walk backwards, about 0.85 m/s. | Leading a group, waving someone along, a band member walking backwards in front of the crowd. |
| `kfb_locomotion_brutal_to_happy_walking_a` | Vom Grobian zum Fröhlichen | Brutal To Happy Walking.fbx | 44 | 1.467 | yes (0.2) | 1.267 / 3.252 |  |  | Rough stomping walk with large arm swings that turns friendly within the cycle. | Brute or orc who is tough outside and soft inside; a mood switch after a win. |
| `kfb_locomotion_female_tough_walk_a` | Tougher Gang | Female Tough Walk.fbx | 39 | 1.3 | yes (0.1) | 0.987 / 2.532 |  |  | Confident tough walk, about 0.76 m/s, firm steps, arms held close. | Any self-assured resident, the boss of a gang, a bouncer. |
| `kfb_locomotion_sad_walk_b` | Traurig gehen | Sad Walk (1).fbx | 45 | 1.5 | yes (0.1) | 0.805 / 2.066 | arm-space of `kfb_locomotion_sad_walk_a` |  | Same sad walk as kfb_locomotion_sad_walk_a with the arms held further out (arm-space setting): head down, slow. | Sad residents with wide box bodies. |
| `kfb_locomotion_strut_walking_b` | Stolzieren | Strut Walking (1).fbx | 49 | 1.633 | yes (0.0) | 1.054 / 2.707 | retimed of `kfb_locomotion_strut_walking_a` |  | Strut, a retimed variant of kfb_locomotion_strut_walking_a (49 instead of 44 frames, small arm differences). | Show-offs, a champion entering the ring. |
| `kfb_locomotion_scary_clown_walk_b` | Gruseliger Clownsgang | Scary Clown Walk (1).fbx | 29 | 0.967 | yes (0.0) | 0.85 / 2.182 | retimed of `kfb_locomotion_scary_clown_walk_a` |  | Creepy clown walk with hands raised, a variant of kfb_locomotion_scary_clown_walk_a (29 instead of 30 frames, different arms). | Spooktober residents, a creepy carnival figure. |
| `kfb_locomotion_holding_walk_b` | Gehen mit Last | Holding Walk (1).fbx | 42 | 1.4 | yes (11.3) | 1.15 / 2.953 |  |  | Walk while carrying something in front of the body; same length and travel as kfb_locomotion_holding_walk_a but a different motion (legs match it half a cycle later, arms differ). | Carrying a crate, a cake, the Brickfish. |
| `kfb_locomotion_walk_with_briefcase_a` | Gehen mit Aktenkoffer | Walk With Briefcase.fbx | 32 | 1.067 | yes (0.0) | 1.144 / 2.937 |  |  | Walk with a briefcase in the right hand: the right arm hangs straight with little swing, the left arm swings freely. | Georg: Nutcracker marching with the rifle in the right hand instead of the briefcase. Also office residents. |
| `kfb_locomotion_walk_with_rifle_a` | Gehen mit Gewehr | Walk With Rifle.fbx | 102 | 3.4 | yes (0.0) | 2.943 / 7.555 |  |  | Walk carrying a rifle low in front with both hands; arms almost still, 3.4 s cycle. | Toy soldier or Nutcracker on patrol; a hunter. |
| `kfb_locomotion_walking_with_shopping_bag_a` | Gehen mit Einkaufstüte | Walking With Shopping Bag.fbx | 50 | 1.667 | yes (0) | 1.256 / 3.224 |  |  | Walk with a bag in the right hand: right arm swings little, left arm swings; slight backward lean. The bag walk Georg mentioned. | Shopping residents; alternative for the Nutcracker rifle-in-right-hand march. |
| `kfb_locomotion_iv_pole_walking_a` | Gehen mit Infusionsständer | Iv Pole Walking.fbx | 48 | 1.6 | yes (0.0) | 0.301 / 0.772 |  |  | Very slow shuffling walk holding an IV pole in one raised hand (about 0.19 m/s). | Patient residents (MedKayfab), a hospital scene. |
| `kfb_locomotion_torch_walk_forward_a` | Gehen mit Fackel | Standing Torch Walk Forward.fbx | 34 | 1.133 | yes (0) | 1.186 / 3.043 |  |  | Walk with the right hand raised as if holding a torch; right arm still, left arm swings. | Night patrol, dungeon explorers, an angry-mob scene. |
| `kfb_locomotion_walking_up_the_stairs_a` | Treppe hochgehen | Walking Up The Stairs.fbx | 37 | 1.233 | yes (0.5) | 0.347 / 0.892 |  |  | Walking up stairs; the hips rise about 0.34 m per cycle (Rig_Medium). | Any resident on stairs; needs step height to match the stairs. |
| `kfb_locomotion_walking_turn_180_a` | Im Gehen umdrehen | Walking Turn 180.fbx | 31 | 1.033 | no (180.0) | in place |  |  | Turn around by 180 degrees in one walking step, on the spot. | Guard turning at the end of a patrol line. |
| `kfb_locomotion_stop_walking_a` | Anhalten | Stop Walking.fbx | 91 | 3.033 | no (34.9) | 0.806 / 2.069 |  |  | Walk that slows to a stop within 3 s. | Arriving at a spot, stopping to talk. |
| `kfb_locomotion_left_strafe_walking_b` | Seitwärts links gehen | Left Strafe Walking.fbx | 32 | 1.067 | yes (0.0) | 1.218 / 3.126 | arm-space of `kfb_locomotion_left_strafe_walking_a` |  | Same side step left as kfb_locomotion_left_strafe_walking_a (Male Locomotion Pack) with the arms further out. | Wide box bodies; circling an opponent. |
| `kfb_locomotion_right_strafe_walking_b` | Seitwärts rechts gehen | Right Strafe Walking.fbx | 32 | 1.067 | yes (0.0) | 1.218 / 3.126 | arm-space of `kfb_locomotion_right_strafe_walking_a` |  | Same side step right as kfb_locomotion_right_strafe_walking_a with the arms further out (32 instead of 31 frames). | Wide box bodies; circling an opponent. |
| `kfb_locomotion_walk_strafe_left_a` | Seitwärts links gehen (Variante) | Walk Strafe Left.fbx | 45 | 1.5 | yes (0.3) | 0.613 / 1.574 |  |  | Slower, calmer side step left (about 0.41 m/s) with a longer cycle. | Shuffling sideways past someone, a crowd scene. |
| `kfb_locomotion_run_with_sword_a` | Rennen mit Schwert | Run With Sword.fbx | 25 | 0.833 | yes (0.0) | 2.035 / 5.224 |  |  | Run, about 2.4 m/s, with a raised weapon in the right hand and a strong forward lean. | Warband orcs, skeleton warriors, a charge in a battle scene. |
| `kfb_locomotion_jump_up_a` | Hochspringen | Jump Up.fbx | 17 | 0.567 | no (83.3) | in place |  |  | Short jump upwards from a crouch, in place (0.57 s). | Joy jump, reaching for something, a reaction to a surprise. |
| `kfb_locomotion_backflip_a` | Rückwärtssalto | Backflip.fbx | 66 | 2.2 | yes (1.2) | in place |  |  | Backflip on the spot; the hips rise to about three times their standing height. | Show-offs, acrobats, a wrestling entrance; Officer Doppeldenk between breakdance moves. |
| `kfb_action_boxing_a` | Box-Deckung (tänzeln) | Boxing.fbx | 57 | 1.9 | yes (0.0) | in place |  |  | Boxing guard, bouncing on the feet with fists up, in place; loops cleanly. | Idle between blows in resident fights; the fight stance to cut back to. |
| `kfb_action_fist_fight_a_a` | Faustkampf A | Fist Fight A.fbx | 141 | 4.7 | no (59.6) | 0.643 / 1.649 |  | 82 hand.l | A 4.7 s fist-fight combo with evasive moves; does not end in its start pose (59.6 degrees). | Choreographed brawl: play against kfb_reaction_taking_punch_a on the opponent. |
| `kfb_action_fist_fight_b_b` | Faustkampf B | Fist Fight B (1).fbx | 141 | 4.7 | no (66.8) | 0.714 / 1.833 | arm-space of `kfb_action_fist_fight_b_a` | 87 hand.l | Same fist-fight sequence as kfb_action_fist_fight_b_a (including the drop to the ground) with the arms further out. | Wide box bodies in the same brawl. |
| `kfb_action_headbutt_b` | Kopfstoß | Headbutt (1).fbx | 54 | 1.8 | yes (0.1) | in place |  |  | Headbutt, shorter than kfb_action_headbutt_a (54 instead of 64 frames) and clearly a different motion. | Orcs and Brute; wrestling-style clash. |
| `kfb_action_hook_punch_b` | Haken | Hook Punch (1).fbx | 66 | 2.2 | yes (0.1) | in place | retimed of `kfb_action_hook_punch_a` | 29 hand.r | Hook punch, close to kfb_action_hook_punch_a but 2 frames longer and with a slightly different body motion. | Classic haymaker in resident fights; the opponent plays kfb_reaction_surprise_uppercut_a or kfb_reaction_taking_punch_a. |
| `kfb_action_punching_b` | Schlagen | Punching (1).fbx | 37 | 1.233 | yes (0.0) | in place |  | 22 hand.l | Punch sequence, a different motion from kfb_action_punching_a. | Quick jabs in a brawl. |
| `kfb_action_quad_punch_a` | Viererschlag | Quad Punch.fbx | 66 | 2.2 | yes (0.0) | in place |  | 20 hand.r | Four quick punches in a row, in place. | Flurry before the knockout; the punching-bag gag. |
| `kfb_reaction_surprise_uppercut_a` | Vom Uppercut ausgehebelt | Surprise Uppercut.fbx | 106 | 3.533 | no (178.1) | 1.479 / 3.797 |  |  | Being hit by an uppercut: the character is launched up, flips and lands flat on the back (travels about 1.5 m). | Knockout reaction for the loser of a resident fight; follow with kfb_reaction_getting_up_a. |
| `kfb_action_hurricane_kick_a` | Wirbeltritt | Hurricane Kick.fbx | 56 | 1.867 | yes (0.0) | 2.505 / 6.431 |  | 25 foot.l | Spinning jump kick that travels about 2.5 m forward. | Martial-arts residents, a flashy finisher. |
| `kfb_action_inside_crescent_kick_a` | Sicheltritt | Inside Crescent Kick.fbx | 81 | 2.7 | yes (0.2) | in place |  |  | Crescent kick with a small jump, in place. | Martial-arts residents. |
| `kfb_action_jumping_over_into_combat_a` | Drübersprung in den Kampf | Jumping Over Into Combat.fbx | 126 | 4.2 | no (156.0) | 2.887 / 7.411 |  |  | Vault over an obstacle (about 2.9 m forward) and land in a fight stance. | Entrance into a brawl or over the ring ropes. |
| `kfb_action_mutant_swiping_a` | Mutant schlägt um sich | Mutant Swiping.fbx | 81 | 2.7 | yes (0.0) | in place |  | 40 hand.l | Wild two-handed swipes with fast hands, in place. | Monsters, mutants, a furious orc. |
| `kfb_action_punching_bag_a` | Sandsack | Punching Bag.fbx | 97 | 3.233 | yes (0.0) | in place |  | 32 hand.r | Working a punching bag, in place; needs a bag prop in front. | Gym or training scene, a boxer warming up. |
| `kfb_action_warming_up_a` | Aufwärmen | Warming Up.fbx | 190 | 6.333 | yes (0.0) | in place |  |  | 6.3 s warm-up routine including a drop to the floor. | Before a match, sports residents, a training montage. |
| `kfb_action_lifting_a` | Schwere Last heben | Lifting.fbx | 217 | 7.233 | yes (0.1) | in place |  |  | Deep bend down to lift something heavy with both hands, then stand holding it; 7.2 s. | Strongman, moving a crate, lifting the Brickfish. |
| `kfb_action_shooting_gun_a` | Pistole schießen | Shooting Gun.fbx | 158 | 5.267 | yes (0.1) | in place |  |  | Aiming and firing a pistol with the right hand, in place. | Officer Doppeldenk, a duel scene. |
| `kfb_action_two_hand_spell_casting_a` | Zauber mit zwei Händen | Two Hand Spell Casting.fbx | 104 | 3.467 | yes (0.0) | in place |  |  | Spell cast with both hands, in place; the body turns about 65 degrees. | Wizards, a shaman, magic effects. |
| `kfb_reaction_taking_punch_a` | Schlag einstecken | Taking Punch.fbx | 171 | 5.7 | yes (0.1) | in place |  |  | Taking a series of hits over 5.7 s without falling, in place. | Opponent side for kfb_action_fist_fight_a_a, quad_punch and punching_b; loops cleanly. |
| `kfb_reaction_walking_to_dying_a` | Im Gehen zusammenbrechen | Walking To Dying.fbx | 93 | 3.1 | no (170.2) | 0.82 / 2.106 |  |  | Walks, collapses and ends lying on the ground. | Dramatic defeat, poisoned resident, a slapstick death. |
| `kfb_reaction_getting_up_a` | Aufstehen vom Boden | Getting Up.fbx | 229 | 7.633 | no (127.4) | 0.208 / 0.534 |  |  | Getting up from lying on the back to standing, 7.6 s. | After every knockout or fall; follows kfb_reaction_surprise_uppercut_a. |
| `kfb_idle_knife_idle_a` | Stehen mit Messer | Knife Idle.fbx | 135 | 4.5 | yes (0.1) | in place |  |  | Standing with a knife held in front, body turned about 60 degrees; loops cleanly. | Pirates, bandits, a threatening resident. |
| `kfb_idle_looking_around_a` | Umschauen | Looking Around.fbx | 195 | 6.5 | yes (0.1) | 0.304 / 0.781 |  |  | Standing and looking around for 6.5 s with a small drift of about 0.3 m. | Lost or curious residents, a guard scanning the area. |
| `kfb_interaction_entry_b` | Eintreten | Entry (1).fbx | 281 | 9.367 | yes (0.0) | in place |  |  | Entering a room (9.4 s): a different motion from kfb_interaction_entry_a. | Arriving at a party or a meeting. |
| `kfb_interaction_picking_up_object_b` | Gegenstand aufheben | Picking Up Object (1).fbx | 95 | 3.167 | no (87.1) | in place | retimed of `kfb_interaction_picking_up_object_a` |  | Picking up an object, a variant of kfb_interaction_picking_up_object_a (95 instead of 104 frames). | Picking up props, the Brickfish before a throw. |
