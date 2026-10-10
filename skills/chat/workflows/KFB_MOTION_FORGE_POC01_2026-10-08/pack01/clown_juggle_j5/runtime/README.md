# Clown J5 · prop-track player (reference runtime + proof)

This is the reference runtime for the MVP slice. It plays the Clown juggling package from `../` (J5) in three.js:

- the Rig_Medium clips from `libs/Rig_Medium/KFB_Motion_clown_juggle_j5.glb`;
- the props from `data/clown_juggle_j5.prop_tracks.<kind>.json` (`kfb.prop-tracks.v2`);
- the marketplace state machine: juggle → stop → talk (loops while a Chatterbox line plays) → resume → juggle.

**Use `kfb_prop_track_player.js` as is.** Do not re-derive the maths. It is checked against Blender (see "Proof").

## Files

| File | What |
|---|---|
| `kfb_prop_track_player.js` | `PropTrackPerformer`: an ES module for three.js ≥ 0.160 with no other dependency |
| `index.html` | demo page (stick skeleton + the KayKit pins + the podium), with "Say a line" / "Line finished" buttons |
| `test_player.py` | headless proof (Playwright + Chromium): Blender truth, held-in-hand check, state-machine run, screenshots |
| `blender_truth.json` | Blender world positions used by the test (bones and pin vertices, actor space) |
| `proof_result.json` | output of the last test run |
| `proof_sheet.png` | screenshots: juggle f0 / f6 / f13 / f20, stop f10, talk f36 |

## Use in the game

```js
import { PropTrackPerformer } from './kfb_prop_track_player.js';
// actor = the Clown scene (KayKit Clown.glb with the KFB eye rig mounted), standing on the podium top (y = 1.0).
// The clip GLB bone names match Rig_Medium, so its clips drive the Clown's skeleton directly.
const perf = new PropTrackPerformer(clownRoot, clipGlb.animations, tracksJson, [pinRed, pinYellow, pinBlue]);
// each frame:
perf.update(dt);
// speech:
perf.requestLine();                   // switches at the next juggle frame 0
if (perf.talkWindowOpen) startChatterboxLine();
perf.endLine();                       // when the line has finished; resumes at the next talk frame 0
```

### Contract

- **Timing:** 30 fps. A clip with n frames lasts n/30 s.
  - Loops wrap seamlessly: frame n is frame 0.
  - One-shot clips (stop, resume) blend their last 1/30 s into the next clip's frame 0. All joins are pose-continuous, so no cross-fade is needed.
- **Row format:** each row is `[tx, ty, tz, qx, qy, qz, qw, s]`.
  - Space: glTF, relative to the actor root, which is the armature origin on the podium top.
  - Apply the row to the **raw** prop asset (its glTF scene as shipped) as its local transform under the actor root.
  - Between rows: lerp position and scale, slerp rotation.
- **Prop order:** `prop_0..2` follow `assets[]` in the track file. The asset paths there use the Dropbox names; the repo copies live at:
  - pins and podium: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/` (`juggling_pin_red/yellow/blue.gltf`, `circus_podium.gltf`);
  - donuts: `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/` (`donut_pink`, `donut_chocolate`, `donut`);
  - sweets: KayKit Bits Bundle 1, Halloween Bits (`candy_pink_A`, `candy_orange_A`, `candy_blue_B`). These are **not in the repo yet** (CC0, in Dropbox `3D ASSETS/_INBOX/KayKit_Bits_Bundle1_1.1/`).
- **Eyes:** the Clown is never shown without the KFB eyes (Georg's rule). This demo draws only a stick skeleton for that reason.
  - Eye profile: `Clown_Head` AUTO_CANDIDATE from `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json`.
  - Values: dx 0.295, dy −0.29, ring 0.25, inset 1.18, pupil 0.34, converge 0.18, base `#f7f9f9`.
  - Hide the two KayKit eye caps on `Clown_Head`.

## Proof (2026-10-09)

Test setup: `python3 test_player.py` with three 0.169, Chromium headless.

| Check | Result |
|---|---|
| Bone positions vs Blender (handslots, head, hips; 7 frames over all 4 clips) | max **7.7e-6** |
| Pin vertices vs Blender (5 clip/frame samples) | max **9.9e-6** |
| Held-in-hand (club grip within 2 cm of a handslot), juggle | 138 / 288 prop-frames = 3 clubs × 2 holds × 23 frames, exactly the dwell |
| State machine at 60 fps (line requested at 1.0 s, finished at 6.0 s) | juggle → stop at 3.2 s (next loop start) → talk window from stop f18 → talk → resume at 8.0 s (next talk start) → juggle at 12.0 s |
| Largest prop step per 1/60 s | 0.196, in normal flight; the clip joins are smaller |

To run the demo locally, put `assets/` next to `index.html` with these files, then serve the folder: `python3 -m http.server`.
- from this package: the GLB and the pin tracks;
- from the repo: the pins and the podium.

`three` is expected at `./node_modules/three`.
