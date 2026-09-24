# KFB Motion Library · RETURN · 2026-09-24

**What:** Part A of `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md`. It covers 33 clips, retargeted onto KayKit Rig_Medium and Rig_Large, baked into one GLB animation library per rig (armature + actions, no mesh).
**Made by:** the Blender MCP chat (`ml_bake.py`, `ml_sheets.py`, log `ml_log.json`; kept in the private Dropbox `BLENDER MCP/MOTION_LIB`). Published to GitHub by Coworker.
**Licence:** Georg confirmed on 2026-09-24 that the licence question is settled, under the storage rule in intake §2: the raw FBX stay private, and the runtime clips live here as part of the game (`NOTICE.md`).

## Files
- `KFB_Motion_Library_Rig_Medium.glb` (2.5 MB) and `KFB_Motion_Library_Rig_Large.glb` (2.5 MB): 33 actions each, action name = clip id. Checked on 2026-09-24: 33 animations, 24 nodes, 0 meshes per file.
- `KFB_Motion_Library.catalog.json`: schema `kfb.motion-catalog.v1`, one entry per clip. It records:
  - duration, frames, fps, loop, root motion, travel per rig and foot contacts;
  - for the climb clips, `ledgeHeightM` and `endsOnTop`.
- `sheets/<id>.png`: contact sheet per clip, 6 frames, with Rig_Medium (Orc Raider) on top and Rig_Large (Orc Brute) below.

## Clips
| id | label | rigs | length | loop | root motion |
|---|---|---|---|---|---|
| `kfb_action_fireball_a` | Feuerball | Rig_Large, Rig_Medium | 3.4 s | yes | in-place |
| `kfb_climb_to_top_a` | Hochklettern über die Kante | Rig_Large, Rig_Medium | 4.0 s | no | travel |
| `kfb_climb_up_a` | Klettern | Rig_Large, Rig_Medium | 3.0 s | yes | travel |
| `kfb_climb_up_b` | Klettern · Variante B | Rig_Large, Rig_Medium | 1.6 s | yes | travel |
| `kfb_dance_chicken_a` | Ententanz | Rig_Large, Rig_Medium | 4.8 s | yes | in-place |
| `kfb_dance_hip_hop_a` | Hip-Hop-Tanz | Rig_Large, Rig_Medium | 13.7 s | yes | in-place |
| `kfb_dance_house_a` | House-Tanz | Rig_Large, Rig_Medium | 19.8 s | yes | in-place |
| `kfb_dance_house_b` | House-Tanz · Variante B | Rig_Large, Rig_Medium | 19.8 s | yes | in-place |
| `kfb_dance_locking_hip_hop_a` | Locking-Tanz | Rig_Large, Rig_Medium | 17.0 s | yes | travel |
| `kfb_dance_samba_a` | Samba | Rig_Large, Rig_Medium | 23.9 s | yes | in-place |
| `kfb_dance_slide_hip_hop_a` | Slide-Tanz | Rig_Large, Rig_Medium | 17.3 s | yes | in-place |
| `kfb_dance_step_hip_hop_a` | Step-Tanz | Rig_Large, Rig_Medium | 7.8 s | yes | travel |
| `kfb_dance_thriller_part3_a` | Thriller-Tanz Teil 3 | Rig_Large, Rig_Medium | 25.6 s | no | travel |
| `kfb_dance_wave_hip_hop_a` | Wave-Tanz | Rig_Large, Rig_Medium | 16.9 s | yes | in-place |
| `kfb_idle_breathing_a` | Atmen (Stand) | Rig_Large, Rig_Medium | 10.0 s | yes | in-place |
| `kfb_idle_breathing_b` | Atmen (Stand) · Variante B | Rig_Large, Rig_Medium | 10.0 s | yes | in-place |
| `kfb_idle_defeat_a` | Niederlage (Stand) | Rig_Large, Rig_Medium | 1.8 s | yes | in-place |
| `kfb_idle_happy_a` | Fröhlich (Stand) | Rig_Large, Rig_Medium | 3.0 s | yes | in-place |
| `kfb_idle_injured_a` | Verletzt (Stand) | Rig_Large, Rig_Medium | 9.4 s | yes | in-place |
| `kfb_idle_kneeling_a` | Knien | Rig_Large, Rig_Medium | 4.3 s | yes | in-place |
| `kfb_idle_laughing_a` | Lachen | Rig_Large, Rig_Medium | 10.4 s | yes | in-place |
| `kfb_idle_ninja_a` | Ninja (Stand) | Rig_Large, Rig_Medium | 3.4 s | yes | in-place |
| `kfb_idle_orc_a` | Ork (Stand) | Rig_Large, Rig_Medium | 5.4 s | yes | in-place |
| `kfb_idle_rejected_a` | Abgewiesen | Rig_Large, Rig_Medium | 4.8 s | yes | in-place |
| `kfb_idle_sad_a` | Traurig (Stand) | Rig_Large, Rig_Medium | 2.8 s | yes | in-place |
| `kfb_locomotion_run_backward_a` | Rückwärts rennen | Rig_Large, Rig_Medium | 0.6 s | yes | travel |
| `kfb_locomotion_run_forward_a` | Vorwärts rennen | Rig_Large, Rig_Medium | 0.8 s | yes | travel |
| `kfb_locomotion_sad_walk_a` | Traurig gehen | Rig_Large, Rig_Medium | 1.5 s | yes | travel |
| `kfb_locomotion_walk_backward_a` | Rückwärts gehen | Rig_Large, Rig_Medium | 1.3 s | yes | travel |
| `kfb_music_drums_a` | Schlagzeug spielen | Rig_Large, Rig_Medium | 4.7 s | yes | in-place |
| `kfb_music_guitar_a` | Gitarre spielen | Rig_Large, Rig_Medium | 4.8 s | yes | in-place |
| `kfb_music_guitar_b` | Gitarre spielen · Variante B | Rig_Large, Rig_Medium | 4.8 s | yes | in-place |
| `kfb_music_guitar_c` | Gitarre spielen · Variante C | Rig_Large, Rig_Medium | 8.3 s | yes | in-place |

## Known / open
- **`bestVariant`:** only `kfb_music_guitar_a` is accepted. All other variants are `null` (not reviewed).
- **Drummer:** the standing drummer v5 (Orc band, a separate Blender file) is not in this library. The lunge accent is still open.
- **Eyes:** eyes are a runtime layer (EyeRig), not part of these clips.
- **Next:** Part B (Animation Lab v2 in the ToolBox, Claude Design) can now load this catalogue and the two GLBs by path.
