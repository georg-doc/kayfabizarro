# KayKit locomotion set: status, handover and integration proposal

Coworker (Blender MCP), 2026-10-03. For WSA and for the next Coworker run. Georg decides what is built.
Branch: `coworker/kaykit-native-locomotion-baseline-01-2026-10-03` (PR #344). Nothing is merged.

## 1. Decisions Georg made today (binding)

| # | Decision |
|---|---|
| D1 | KayKit Character Animations 1.1 is the only source for the basic set. Mixamo and the Motion Library are additive only, for proven gaps. |
| D2 | Walk = `Walking_B`, run = `Running_A`, sprint = `Running_B`. Walking_A and Walking_C remain as calmer variants. |
| D3 | No separate jog clip. The jog is the speed blend between Walking_B and Running_A (see the reference video). |
| D4 | Quaternius UAL 1+2 is parked as a reserve (on GitHub under `media/3D_Assets/Quaternius_Universal_Animation_Library/`). It is not needed for the basic set. |
| D5 | Order of work: (1) basic set on Rig_Medium → (2) sword, pistol and rifle carry/aim on walk and run → (3) transfer to Rig_Large → (4) a bounce/squash-and-stretch layer for the legacy characters. |
| D6 | The review actor is the KayKit Mannequin; FrizzleBob v5 is the second actor. |

## 2. What exists and has been checked

| File | What it shows | Where |
|---|---|---|
| `KAYKIT_LOCO_RAMP_01_walk_run_sprint.mp4` | idle → walk → run → sprint → walk → idle, then the same at half speed. KayKit clips only. | GitHub (this folder) + Dropbox `BLENDER MCP/KAYKIT_LOCO_SET_01/` |
| `KAYKIT_LOCO_WEAPONS_01.mp4` | sword, pistol and rifle on walk, run and sprint, carrying and aiming | same |
| `KAYKIT_LOCO_RAMP_01_Mannequin_Medium.glb`, `KAYKIT_LOCO_WEAPONS_01_Mannequin_Medium.glb` | the baked test animations (each one clip) | Dropbox |
| `ramp.py`, `compose.py` | the scripts that build them (blend logic below) | GitHub + Dropbox |
| `ramp_slip.json` | foot creep per segment of the ramp | GitHub + Dropbox |
| `../RETURN/` | the native baseline: all clips measured, contact sheets, KEEP/HOLD verdicts | GitHub |

Georg's verdict on the ramp video: "looks great, finally usable". This is the visual reference for the runtime.

## 3. The locomotion recipe (what the runtime must reproduce)

One speed parameter drives everything. There are no state jumps between walk, run and sprint, only weights.

| Anchor | Clip | Speed (m/s, rig units) | Cycle T (s) | Left-foot-down phase |
|---|---|---|---|---|
| idle | Idle_A | 0 | 1.067 | — |
| walk | Walking_B | 0.980 | 1.067 | 0.000 |
| run | Running_A | 3.303 | 0.800 | 0.0833 |
| sprint | Running_B | 5.255 | 0.800 | 0.125 |

Rules, all checkable:

1. **Weights.** Between two neighbouring anchors, the weights are linear in speed. At most two clips are active at once.
2. **One shared phase (0..1).** Each clip samples at `t = ((phase + leftFootDownPhase) mod 1) · T`. This makes the left foot land at the same moment in both clips. Without this alignment the blend looks like stumbling.
3. **Phase rate.** `Σ wᵢ/Tᵢ / Σ wᵢ` over the active locomotion clips. Idle runs on its own clock.
4. **Root speed equals the speed parameter.** The character moves at exactly the blended speed. The clips are in place, so this is what keeps the feet planted.
5. **Blend local rotations (slerp) and local translations (lerp) of every bone.** Translations matter: the KayKit clips animate bone translations (hips bob, etc.). Blending rotations only gives the wrong leg length and visible sliding. This was a real bug in my first test.

Measured foot creep in the ramp (max per contact; PASS ≤ 4.4 cm = 2 % of height):

| Segment | Max creep |
|---|---|
| walk ↔ run blend | 2.9 cm |
| run | 0.5 cm |
| run ↔ sprint blend | 3.6 cm |
| sprint | 3.4 cm |
| walk | 4.9–6.5 cm (heel-to-toe roll of Walking_B, not a slide; my contact test counts the roll) |
| idle → walk start | 10 cm |
| walk → idle stop | **19 cm** (last step before standing) |

Starting and stopping are the weak spots. Neither KayKit nor Quaternius has start or stop clips. Proposed fix: shorter blend windows, and stop on a foot contact (wait for the next left- or right-foot-down phase before blending to idle). Turn in place and strafe walk are still open. They are not needed for the first slice.

## 4. Weapons (what the weapon video shows)

- **The weapon sits on a `handslot.r` node under `hand.r`.** This is the KayKit convention, copied from KayKit Adventurers: translation `(0, 0.0961, -0.0575)`, rotation quaternion `(0, 0, 0.7071, 0.7071)`. Mirror it for the left hand: `(0, 0, -0.7071, 0.7071)`.
- **The Mannequin GLB has no handslot nodes.** I add them in the test GLB. The runtime must add them, or use the GLB I deliver.
- **Weapon files used:**
  - sword: `KayKit_Adventurers_2.0_FREE/Assets/gltf/sword_1handed.gltf`
  - pistol: `KayKit_Mystery_Series6/UltraTurboHeroMan/.../UltraTurboHeroMan_Blaster.gltf`
  - rifle: `KayKit_Mystery_Series6/6 - Toy Soldier/.../ToySoldier_Rifle.gltf`

  All three attach with identity on handslot.r; no extra rotation is needed.
- **Layering = upper-body mask.** The legs come from walk, run or sprint. These bones come from the weapon clip: `spine, chest, head, upperarm.*, lowerarm.*, wrist.*, hand.*`.
  - pistol aim: upper body from `Ranged_1H_Aiming`
  - rifle carry: upper body from `Running_HoldingRifle`, phase-synced to the legs
  - rifle aim: upper body from `Ranged_2H_Aiming`
  - rifle sprint: native `Running_HoldingRifle`
  - sword: no upper-body clip; the normal arm swing carries the sword
- **Three.js note:** `AnimationMixer` has no bone masks. Split each clip's tracks by bone name into a "lower" clip and an "upper" clip, then play both. The split clips are deterministic, so I can deliver them pre-split in the GLB.
- **Open defects:** see §7.

## 5. Rig_Large transfer (next Coworker step, facts already checked)

- Rig_Large has **the same 23 bone names** as Rig_Medium, in a different order. Clips transfer by bone name: copy local rotations.
- Proportions differ:

  | | Rig_Medium | Rig_Large |
  |---|---|---|
  | hips height | 0.406 | 1.041 |
  | thigh | 0.227 | 0.569 |
  | shin | 0.149 | 0.413 |

  So hips translation and root speed are scaled by about 2.6 (leg-length ratio). Speeds and phases are measured again on Large rather than assumed.
- Built-in check: Rig_Large has native `Walking_A` and `Running_A`. The transferred Medium versions must match them in speed (±10 %) and slip. If they don't, the transfer method is wrong.

## 6. Proposal for the WSA integration slice

**Slice name (proposal):** `KFB-LOCO-SLICE-01`: one playable character with KayKit locomotion and weapon carry in the KFB world.

**Split of work:**

| Owner | Delivers | Must not |
|---|---|---|
| Coworker | One canonical GLB per rig: `KFB_KAYKIT_LOCO_SET_01_Rig_Medium.glb` / `_Rig_Large.glb` with all needed clips, handslot nodes and pre-split upper/lower clips. One `loco_set.json` with the table from §3 (clip, speed, T, phase offset, mask) and the weapon table. Reference videos per rig. Measured numbers. | build runtime or controller code |
| WSA | Runtime: input → speed parameter → blend per §3, weapon switch, camera. Capture a side-view video in the same framing as the reference. | re-pick or re-time clips; average conflicting numbers; reorder priorities; mix sources. A conflict is reported, not solved silently. |
| Georg | Look decisions; accepts the slice by comparing the runtime capture with the reference video | — |

**Acceptance conditions (all must hold):**

1. All clips come from `KFB_KAYKIT_LOCO_SET_01_*.glb`, and only KayKit clips are referenced.
2. Speed thresholds, phase offsets and masks are read from `loco_set.json`, not hard-coded differently.
3. Steady walk, run and sprint: foot creep ≤ 4.4 cm on Medium. The runtime capture shows no visible sliding against the reference video.
4. A ramp of 0 → 5.26 → 0 m/s shows no pose pop, no T-pose frame and no double-step at the walk/run boundary.
5. Weapon switch (none / sword / pistol / rifle) keeps the legs unchanged, and the weapon stays in the hand in every frame.
6. Rig_Medium and Rig_Large use the same code path; only the JSON and GLB differ.
7. Every deviation from the reference is listed in the return, with a video frame.

**Not in this slice:** turn in place, strafe walk, start/stop clips, jump integration, combat attacks, the legacy bounce layer, travel modes.

## 7. Weapon video findings (Coworker review, Georg has not judged yet)

| Segment | Verdict | Finding |
|---|---|---|
| Sword · walk | OK | Blade forward at hip height, swings with the arm. |
| Sword · run | **DEFECT** | The Running_A arm swing lifts the hand to chest/face height, and the blade sweeps up in front of the face (video 2.5–5.0 s, every arm swing). A run with a sword needs a calmer sword arm. KayKit has no 1H sword-hold clip. Options: (a) reduce the right-arm swing (partial upper-body weight), (b) use the sword arm from `Melee_Blocking` or `Melee_2H_Idle` as the upper layer, (c) accept it. Georg decides the look. |
| Sword · sprint | OK | Blade stays mostly horizontal. |
| Pistol · walk/run, arms free | **DEFECT** | With a normal arm swing, the muzzle swings across and into the chest. Proposal: the pistol is holstered when not aiming. When drawn, it always uses the `Ranged_1H_Aiming` upper body. |
| Pistol aim · walk/run | OK | The arm points forward; legs and upper body read as one movement. |
| Rifle · walk/run (upper body from `Running_HoldingRifle`) | OK | The rifle is held across the body and the arms stay calm. Recommended carry pose. |
| Rifle · sprint (native) | OK | Same legs as Running_B. |
| Rifle aim · walk/run (`Ranged_2H_Aiming`) | OK | The rifle points forward. The upper body rides on the hip sway of the walk; acceptable at walk speed, slightly wobbly at run speed. |

Weapon orientation: all three models point their long axis along handslot +Z (sword along +Y). With identity attachment they are correct; checked in a straight side view, because a 3/4 view makes a forward-pointing barrel look like it points down.

## 8. Update 02: Georg's review of the weapon video, and fixes (`KAYKIT_LOCO_WEAPONS_02.mp4`)

Georg's verdict on video 01: **the sword works**. The blaster and rifle orientation was wrong.

### Root cause 1: the aim clips are not loops

`Ranged_1H_Aiming` and `Ranged_2H_Aiming` are one-shot "raise and aim" motions. The hand rises during the first ~0.35 s, then holds the aim pose. Video 01 looped them, so every ~1.07 s the arm dropped back to the hip and the weapon turned sideways before aiming again.

**Rule:** play them once and clamp on the last frame. In Three.js this is `LoopOnce` + `clampWhenFinished = true`. The raise itself is the "draw" motion.

### Root cause 2: a single grip cannot serve free-swinging arms

The KayKit handslot convention (identity attachment) is correct only for the sword. Measured in the held aim pose, the handslot's forward axis points sideways-backward: 58° off for the pistol, 47° off for the rifle. With a free arm swing, the hand also rolls differently in walk and in run. So every weapon needs a **grip per mode**: a fixed local rotation of the weapon under `handslot.r`. It is solved from the clip so that the long axis stays on target across the whole cycle.

| Carry grip (weapon node local rotation under `handslot.r`, glTF, quaternion x,y,z,w) | Target | Deviation over the cycle |
|---|---|---|
| Pistol · walk (Walking_B arms) `(-0.45652, 0.53669, 0.45830, 0.54177)` | barrel → running direction, top up | mean 4.6°, max 7.8° |
| Pistol · run (Running_A arms) `(-0.18962, 0.77310, 0.27080, 0.54133)` | same | mean 4.8°, max 8.9° |
| Rifle staff · walk `(-0.44898, -0.54364, -0.45429, 0.54451)` | muzzle forward-up, 70° from vertical; hand on the stock wrist (model origin) | mean 4.9°, max 7.7° |
| Rifle staff · run `(0.71433, 0.28074, 0.50018, -0.40093)` | same | mean 4.8°, max 8.9° |
| Rifle staff · sprint (Running_B arms) `(0.59965, 0.37473, 0.59965, -0.37473)` | same | **mean 28°, max 46°**: the Running_B arm pump swings the rifle; not clean |
| Pistol · aim (`Ranged_1H_Aiming` hold pose) `(0.01303, 0.87145, 0.02287, 0.48978)` | barrel → running direction | mean 0.8°, max 2.6° (walk); max 4.0° (run, the same grip works) |
| Rifle · aim (`Ranged_2H_Aiming` hold pose) `(0.02406, 0.36505, 0.01135, 0.93061)` | barrel → running direction | mean 0.6°, max 1.3° |

- **A single grip for walk and run is 20–27° off.** Runtime rule: slerp the carry grip between the walk grip and the run grip with the same weight as the leg blend.
- When aiming, the weapon uses its aim grip (table). One aim grip serves walk and run. During the 0.35 s raise the barrel swings into place; this is the draw motion.
- **Rifle staff carry, why:** Georg's direction is to hold the rifle like a staff, by the stock wrist, not in a firing pose. This fits the Toy Soldier patrolling with a bayonet rifle. An upright staff (35° from vertical) passed through the large Mannequin head, so 70° forward was chosen: the minimum head clearance rises from 0.57 to 0.91 units in the run.
- **Open:** a rifle sprint with this grip. Proposal: limit the rifle carry to walk and run, or reduce the right-arm swing in the sprint. Georg decides.
- **Not in scope yet:** shooting while running (Georg: later, if a running-shot animation is needed).

### What WSA must take over

Per weapon, store these in `loco_set.json`:

1. `carryGrip.walk` and `carryGrip.run`, as quaternions.
2. `aimClip`, played once and clamped.
3. `aimGrip`, as a quaternion (table).

The weapon node sits under `handslot.r` (§4).

## 9. Erratum (Coworker, 2026-10-03): frame-rate bug in my render scripts

- **Bug.** My cloud render scripts set the scene to 30 fps *after* the glTF import. Blender's importer converts animation seconds to frames with the scene fps at import time (default 24). So the animation was laid out at 24 fps and then rendered as 30 fps video.
- **Effect on the videos.** `KAYKIT_LOCO_RAMP_01_walk_run_sprint.mp4` and `KAYKIT_LOCO_WEAPONS_01.mp4` play the motion about **25 % too fast**. Their caption bars drift out of sync with the motion as the video goes on: label, speed and weapon visibility were keyed per output frame, the pose per 24-fps frame. The first version of weapons video 02 was hit as well (wrong grip per segment); it was never delivered.
- **Not affected.** All measurements: speeds, slip, phases, grips and seams come from my own glTF evaluator in seconds. Also unaffected: the GLB files and the live review scene built by `blender_native_review.py`, which sets 30 fps before importing.
- **Partly affected.** The contact sheets of the native baseline (`RETURN/sheets/`): poses were sampled at 1.25× the labelled frame number. Each sheet still shows the clip's own poses, but the "fN" labels are off.
- **Fix.** `bpy.context.scene.render.fps = 30` before `import_scene.gltf`, and render frame f for time f/30. The corrected videos are `KAYKIT_LOCO_RAMP_02_walk_run_sprint.mp4` and `KAYKIT_LOCO_WEAPONS_02.mp4`; they replace 01 as the visual reference (01 is kept, additive).
- **Rule for every runtime and tool.** Sample clips in seconds. Never assume a frame rate from the file.

## 10. Update 03: Georg's tuning pass on video 02 (`KAYKIT_LOCO_WEAPONS_03.mp4`) — supersedes the carry grips in §8

Georg accepts video 02 in principle and asked for two corrections. Both are applied in video 03.

1. **Pistol carry.**
   - What was wrong: in video 02 the barrel was forced to point forward the whole time. That twisted the gun in the hand while the arm swung.
   - The rule now: when carried, the pistol stays fixed in the hand and points along the extended forearm, the way a person runs with a pistol. Strictly forward is only for aiming.
   - So we keep two separate modes: run with the weapon in hand (carry grip) and run and aim (aim grip, aim clip).
2. **Rifle staff carry.**
   - What was wrong: the rifle was rolled 180° about its long axis, so the bayonet sat on top.
   - The fix: the rifle's top (sights) now points up and the bayonet sits under the barrel. Muzzle direction and hand position are unchanged.

| Grip (weapon node local rotation under `handslot.r`, glTF, x,y,z,w) | Target | Fit over the cycle |
|---|---|---|
| Pistol carry · walk `(0.17625, 0.46044, 0.46650, 0.73438)` | barrel along forearm (lowerarm→wrist), top up | mean 11.7°, max 17.1° (wrist bend) |
| Pistol carry · run `(0.21411, 0.58285, 0.12783, 0.77337)` | same | mean 27.3°, max 47.5°: the wrist bends a lot in Running_A, the gun stays fixed in the hand by design |
| Pistol aim `(0.01303, 0.87145, 0.02287, 0.48978)` | unchanged from §8 | — |
| Rifle staff · walk `(-0.54364, 0.44898, 0.54451, 0.45429)` | muzzle forward-up 70° from vertical, sights up, bayonet under the barrel | mean 4.9°, max 7.7° |
| Rifle staff · run `(-0.28074, 0.71433, 0.40093, 0.50018)` | same | mean 4.8°, max 8.9° |
| Rifle staff · sprint `(-0.37473, 0.59965, 0.37473, 0.59965)` | same | mean 28°, max 46°; still open (§8) |
| Rifle aim `(0.02406, 0.36505, 0.01135, 0.93061)` | unchanged from §8 | — |

The values are also in `grips2.json`; the script that computes them is `grip3.py`. Runtime rule from §8 still holds: slerp walk ↔ run carry grip with the leg-blend weight.

Status: Georg wants this checked in as the WSA handover, then the next steps planned together. Video 03 + this handover are the reference; nothing is merged.
