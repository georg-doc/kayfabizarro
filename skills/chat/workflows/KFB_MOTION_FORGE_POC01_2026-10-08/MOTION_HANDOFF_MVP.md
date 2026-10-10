# KFB motion handoff to the MVP (Claude Code)

Date: 2026-10-09. From: Blender-Coworker (Mac mini), issue #381. For: Claude Code building the KFB Island Worldbuilder Lab MVP.

**Read this file and `motion_handoff_mvp.json` (same folder). You should not need to search GitHub for motion data.** The JSON lists every checked-in motion batch: branch, folder, GLB per rig, clip ids, frames and loops.

## 1 · Rules that never change

1. **KFB eyes.** Every resident in the game wears the KFB eyes (eye rig v6). Never the KayKit original eyes, never no eyes. Hide the KayKit eye meshes on load.
2. **Eyes covered.** A prop may pass the face briefly. The eyes are never covered for more than 3 frames in a row.
3. **Scale.** Scale the whole actor-root group (the character and its props) by `FIG_SCALE` = 1.6 (`src/scale.ts`, `docs/SCALE_CONTRACT_K2.md`). Never scale props one by one: the prop tracks are in KayKit units relative to the actor root.
4. **Time and space.**
   - 30 fps. A clip with n frames lasts n/30 s.
   - Space is glTF: Y up, the actor faces +Z, KayKit units.
   - The actor root is the armature origin.
5. **Rigs.** The clip GLBs carry KayKit `Rig_Medium` or `Rig_Large` skeletons. The bone names match the KayKit characters, so a clip drives any character of that rig directly (`AnimationMixer` on the character root).
6. **Joins.** Clips start and end on KayKit Idle_A unless the JSON says otherwise. Loops wrap seamlessly: frame n is frame 0.
7. **Not on GitHub, ever:** raw Mixamo FBX, itch.io clay textures.

## 2 · What to use for the MVP

| Batch | Use | Branch | Clips |
|---|---|---|---|
| **CLOWN-J5** | market stage 2: the Clown juggles, stops, talks, resumes | `blender-mcp/motion-forge-poc-01-2026-10-08` | 4 (Rig_Medium) + prop tracks for pins, donuts, sweets |
| FORGE-01 | pointing, kneel-and-eat, shrug | same | 4 |
| FORGE-01-TABLE | eat / write / read at a table (loops) | same | 3 |
| FORGE-01-SEAT-JUMP | sit down and stand up at a table; jump up and down a stool or podium | same | 6 |
| PERF-369 | short shrug | `blender/resident-performance-choreography-2026-10-07` | 1 |
| EXCH-01 | reaction calls (BINGO!, BONGO., …), gift give / receive / lid | `planning/exchange-reaction-kit-01-2026-10-05` | 14 Medium / 17 Large |
| FLUFF-01 | Fluff work and play | `planning/fluff-blender-slice-01-2026-10-04` | 17 Medium / 13 Large |
| CLOWN-J3, CLOWN-J4 | **do not use** (superseded by J5) | same as J5 | — |

All catalogue patches are additive and **not applied** to `media/3D_Assets/Animations/KFB_Motion_Library/catalog.json` (main). Load clips from each batch's own GLB.

**Masterplan note:** `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` stage 2 still says "Clown (Jonglage J3)". Read it as **J5**.

## 3 · Clown J5: how to play it

Folder: `skills/chat/workflows/KFB_MOTION_FORGE_POC01_2026-10-08/pack01/clown_juggle_j5/`.

- **Clips** (`libs/Rig_Medium/KFB_Motion_clown_juggle_j5.glb`):
  - `kfb_clown_juggle_cascade3_d`, 96 frames, loop;
  - `kfb_clown_juggle_stop_j5`, 48;
  - `kfb_clown_juggle_talk_j5`, 96, loop;
  - `kfb_clown_juggle_resume_j5`, 120.
- **Props:** `data/clown_juggle_j5.prop_tracks.{pin,donut,candy}.json`.
- **Runtime:** `runtime/kfb_prop_track_player.js`. **Use it as is.** It is checked against Blender: bones within 7.7e-6, prop vertices within 9.9e-6.

```
juggle (loop) --line due, at juggle frame 0--> stop --> talk (loops while the line plays)
talk --line done, at talk frame 0--> resume --> juggle frame 0
talkWindows: stop 18–47, talk 0–95 (start the Chatterbox line inside a window)
```

```js
import { PropTrackPerformer } from './kfb_prop_track_player.js';
const perf = new PropTrackPerformer(clownRoot, clipGlb.animations, tracksJson, [prop0, prop1, prop2]);
perf.update(dt);                          // every frame
perf.requestLine();                       // a line is due
if (perf.talkWindowOpen) startLine();     // Chatterbox
perf.endLine();                           // the line has finished
```

The Clown stands on the circus podium, with the actor root at y = 1.0 (`podiumTop` in the track file). Then scale the group (podium included) by 1.6.

## 4 · Prop-track contract (`kfb.prop-tracks.v2`)

- **Header:** `fps`, `space`, `columns`, `assets[]` (prop_i = assets[i]), `podiumTop`, `timing`, `throws`.
- **Per clip:** `frames`, `loop`, `next`, `talkWindows`, `props[{id, track}]`. A track holds one row per frame.
- **Row:** `[tx, ty, tz, qx, qy, qz, qw, s]` in glTF space, relative to the actor root.
- **Apply:** the row is the local transform of the **raw** prop asset (its glTF scene as shipped), parented under the actor root.
- **Between frames:** lerp position and scale; slerp rotation.
- **One-shot clips:** the last frame blends into the next clip's frame 0.
- **Asset names:** `assets[]` in the track files uses Dropbox folder names. Map them to the repo paths in §5.

## 5 · Assets in the repo

| What | Path (main) |
|---|---|
| Clown | `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/characters/Clown.glb` |
| Pins | `…/11 - May 2024 - Clown/assets/gltf/juggling_pin_{red,yellow,blue}.gltf` |
| Podium | `…/11 - May 2024 - Clown/assets/gltf/circus_podium.gltf` |
| Donuts | `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/{donut_pink,donut_chocolate,donut}.gltf` |
| Sweets | **not in the repo**: KayKit Bits Bundle 1 · Halloween Bits (CC0), `candy_pink_A`, `candy_orange_A`, `candy_blue_B`. Use pins or donuts until Georg adds them. |
| Eye profiles | `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json` |

## 6 · Character card draft: Clown

The JSON holds a **draft** `kfb.character-card/1` card for the Clown (see `docs/SPEC_CHARACTER_INTEGRITY_R1.md`). It is not approved yet: Georg has not reviewed the eye profile.

- **Eyes:** `Clown_Head` AUTO_CANDIDATE, with these values:
  - dx 0.295, dy −0.29;
  - ring 0.25, inset 1.18;
  - pupil 0.34, converge 0.18;
  - base `#f7f9f9`.
- **Prop grip:** the juggling pin is held 0.27 down its axis, at prop-local (0, −0.27, 0).
  - The test checks this point against `handslot.r` and `handslot.l`.
  - three.js sanitizes the names to `handslotr` and `handslotl`.

## 7 · Open tuning (not blocking)

- **Side view:** the club knob sits on the nose tip for 1 frame per throw.
- **Talk pose:**
  - the two-club arm still reads as pointing sideways;
  - the ta-da opens level, not upward.
- **Hands:** the hand moves at about a third of the club's speed at release.
- **Donuts and sweets:**
  - held donuts lie flat;
  - the KayKit sweets have open wrapper cones.
- **Missing pieces:**
  - the Clown eye profile is unreviewed;
  - the sweets are not in the repo.

## 8 · Credits and licences

KFB is free-to-play and a portfolio piece.

- **KayKit** (Kay Lousberg), CC0: rigs, Idle_A, characters, Clown, pins, podium, Dungeon furniture, Halloween Bits.
- **Tiny Treats** (Isa Lousberg), CC0: donuts, Pleasant Picnic.
- **UniMate** (L. Mou et al., 2026): checkpoints are **CC BY-NC 4.0**, and the credit line is required.
  - Clips: `kfb_gesture_point_low_a`, `kfb_action_kneel_eat_a`.
  - Arm motion of `kfb_activity_table_eat_b` and `kfb_activity_table_read_b`.
- **Adobe Mixamo:** source of `kfb_gesture_shrug_georg_a`, under the Mixamo terms.
