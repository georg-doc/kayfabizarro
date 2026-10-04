# RETURN · KFB Motion Library 01 (Animation Intake 01, Part A) · 2026-09-24

**Status: ACCEPTED by Georg (2026-09-24) as a whole, judged from the contact sheets. A clip-by-clip review happens in the Animation Lab v2.**

## What is here
- `KFB_Motion_Library_Rig_Medium.glb` and `KFB_Motion_Library_Rig_Large.glb`: each holds one armature (23 bones, no mesh) and **33 animations**. The animation name equals the catalogue `id`.
- `KFB_Motion_Library.catalog.json`: schema `kfb.motion-catalog.v1`, one entry per clip.
- `sheets/<id>.jpg`: contact sheet per clip. Top row: Rig_Medium (Orc Raider). Bottom row: Rig_Large (Orc Brute). 6 frames each.
- `NOTICE.md`: licence note. `source/`: the two Blender scripts that produced everything.
- Raw FBX stay in Dropbox (`BLENDER MCP/_inbox/`). They are not in the repo.

## How it was made
- Every FBX carries a KayKit skeleton, because Mixamo keeps the uploaded one: Rig_Medium (28 files) or Rig_Large (5 files). Same 23 bone names on both.
- Retarget per bone as a world-space rotation delta against the rest pose, so bone-roll differences between the rigs do not twist anything. This is the method from the ORB guitar work (PR #195). Root and hips translation are scaled by hip height (Medium 0.406, Large 1.041).
- The Mixamo object motion (the body moves on the FBX object, not on the hips) is folded into root and hips.
- 30 fps (Mixamo export). Durations are read back from the exported GLBs with three.js.
- **Checked in three.js** (GLTFLoader + AnimationMixer, r169): both GLBs load, 33 clips each, every track resolves to a bone.

## Measured per clip
| id | rigs | loop | root motion | duration | |
|---|---|---|---|---|---|
| `kfb_action_fireball_a` | Medium, Large | yes | in-place | 3.4 s | best
| `kfb_climb_to_top_a` | Medium, Large | no | travel (0.846 m on Medium) | 4.0333 s | best
| `kfb_climb_up_a` | Medium, Large | yes | travel (0.292 m on Medium) | 3 s | best
| `kfb_climb_up_b` | Medium, Large | yes | travel (0.151 m on Medium) | 1.6 s |
| `kfb_dance_chicken_a` | Medium, Large | yes | in-place | 4.8 s | best
| `kfb_dance_hip_hop_a` | Medium, Large | yes | in-place | 13.6667 s | best
| `kfb_dance_house_a` | Medium, Large | yes | in-place | 19.8333 s | best
| `kfb_dance_house_b` | Medium, Large | yes | in-place | 19.8333 s |
| `kfb_dance_locking_hip_hop_a` | Medium, Large | yes | travel (0.416 m on Medium) | 17.0333 s | best
| `kfb_dance_samba_a` | Medium, Large | yes | in-place | 23.9 s | best
| `kfb_dance_slide_hip_hop_a` | Medium, Large | yes | in-place | 17.3333 s | best
| `kfb_dance_step_hip_hop_a` | Medium, Large | yes | travel (1.851 m on Medium) | 7.8333 s | best
| `kfb_dance_thriller_part3_a` | Medium, Large | no | travel (2.63 m on Medium) | 25.6 s | best
| `kfb_dance_wave_hip_hop_a` | Medium, Large | yes | in-place | 16.8667 s | best
| `kfb_idle_breathing_a` | Medium, Large | yes | in-place | 9.9667 s | best
| `kfb_idle_breathing_b` | Medium, Large | yes | in-place | 9.9667 s |
| `kfb_idle_defeat_a` | Medium, Large | yes | in-place | 1.7667 s | best
| `kfb_idle_happy_a` | Medium, Large | yes | in-place | 2.9667 s | best
| `kfb_idle_injured_a` | Medium, Large | yes | in-place | 9.3667 s | best
| `kfb_idle_kneeling_a` | Medium, Large | yes | in-place | 4.3 s | best
| `kfb_idle_laughing_a` | Medium, Large | yes | in-place | 10.4 s | best
| `kfb_idle_ninja_a` | Medium, Large | yes | in-place | 3.3667 s | best
| `kfb_idle_orc_a` | Medium, Large | yes | in-place | 5.3667 s | best
| `kfb_idle_rejected_a` | Medium, Large | yes | in-place | 4.8333 s | best
| `kfb_idle_sad_a` | Medium, Large | yes | in-place | 2.8333 s | best
| `kfb_locomotion_run_backward_a` | Medium, Large | yes | travel (0.8 m on Medium) | 0.6333 s | best
| `kfb_locomotion_run_forward_a` | Medium, Large | yes | travel (1.564 m on Medium) | 0.7667 s | best
| `kfb_locomotion_sad_walk_a` | Medium, Large | yes | travel (0.805 m on Medium) | 1.5 s | best
| `kfb_locomotion_walk_backward_a` | Medium, Large | yes | travel (0.687 m on Medium) | 1.2667 s | best
| `kfb_music_drums_a` | Medium, Large | yes | in-place | 4.7333 s | best
| `kfb_music_guitar_a` | Medium, Large | yes | in-place | 4.8 s | best
| `kfb_music_guitar_b` | Medium, Large | yes | in-place | 4.8 s |
| `kfb_music_guitar_c` | Medium, Large | yes | in-place | 8.3333 s |

## Notes for the runtime
- **Loop:** Mixamo repeats the first pose at the end. Start and end pose match within 6° on all loops except `climb_to_top` and `thriller_part3`.
- **Travel clips carry the motion in `root`/`hips`.** For a walker, either let the clip move the figure and re-base the root after each cycle by `travelMetersPerCycle`, or zero root x/y and move the figure yourself at that speed. `travelDirection` gives the direction; the figures face -Y.
- **Climb:**
  - `kfb_climb_to_top_a` has `endsOnTop: true` and rises by `ledgeHeightM`: 1.05 m on Medium, 2.70 m on Large.
  - `climb_up_a` and `_b` are wall-climb loops. They rise 0.79 m and 0.40 m per cycle on Medium.
- **Units** are metres in each rig's own scale: Medium figure ≈ 1.9 m, Large figure ≈ 3.9 m.
- **Eyes** are not baked in. The eye rig is a runtime layer (EyeRig v6), so the sheets show the plain meshes.
- **Contacts:** feet-on-ground frame ranges are measured on Rig_Medium, with a threshold of 6 % of hip height above the lowest foot position.

## Not done / open
- Hand contacts are not measured. There is no prop geometry in these clips.
- The music clips have no instruments. The guitar fit for the Orc band lives in the ORB-P1 module, not in this library.
- The drummer clip `kfb_music_drums_a` is the seated kit drummer. The Orc band drummer uses its own standing loop (ORB-P1 v5).
- Actors other than the Orc Raider and the Orc Brute (FrizzleBob, GothGirl, Black Knight) have not been previewed here. They share the bone names, so the clips should bind; the Lab is where to check.
