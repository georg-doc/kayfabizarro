# RETURN · KFB Choreography Lab 01 · 2026-09-29

Scope: two tests on Rig_Medium (Orc Raider), built from the published Motion Library clips (GitHub `georg-doc-patch-3`, `libs/Rig_Medium/*.glb`):

- **Test A:** seated upper body on standing legs.
- **Test B:** three sample scenes (gift, argument, brawl) written as choreography contracts `kfb.choreo.v0`, resolved by a small player and rendered as storyboards.

No library file was changed. Research and sources are in `CHOREO_RESEARCH_01.md`.

## Defects and open points (read first)

1. **Rig_Medium only.** Rig_Large (Brute) was not tested. The rules are rig-independent, but the numbers (head spacing, reach) must be measured per rig.
2. **Storyboards, not animation.** Each strip is six posed moments, with no transitions and no playback. Blends between clips, hit-stop and camera shake are written into the contract but not shown.
3. **No give/receive clip exists.** The handover is built from the carry pose (arms layer from `jogging_with_box`) plus arm aim/stretch towards the box. It reads, but a real "offer" motion would be better (Mixamo search or Cascadeur).
4. **Readability of the reveal.** The surreal object (a teal ring with one eye, placeholder) and the popping lid are small and seen edge-on from the side camera. The real object and the camera come later.
5. **Arm stretch is visible but rough.** The forearm stretches 1.6–2.6× (capped at 2.6). The fist still misses the face by 24 cm (hit 1), 11 cm (hit 2) and 10 cm (hit 3), because the personal-space rule pushes the actors apart first. The burst hides the gap in the storyboard. The look (rubber-hose stretch vs. stepping in) is Georg's call.
6. **Heads touch in close moments.** A personal-space rule pushes the actors apart (7–39 cm per shot). The leaning pose in the last brawl shot still shows the heads close.
7. **Strike markers are measured candidates** from intake 04, and the reaction impact frames are detected from the head jolt. Both need confirming in the Animation Studio.
8. **Speaker corner** has no scene yet: the contract supports it (one actor, talk clips, bubbles), but it was not built.
9. **The graft test shows the pose, not the gesture quality.** The chibi arms are short, so seated talk gestures stay small. Whether they read well enough standing is Georg's call.

## Test A · seated upper body on standing legs

**Method:**

- Legs, hips and root come from `kfb_idle_breathing_a` (looped).
- Chest, head and arms come from the seated clip (local rotations).
- The spine is re-solved so the torso keeps its seated orientation relative to the root.
- Two variants:
  - **keep lean:** the seated forward lean stays;
  - **upright:** the clip's mean spine lean is removed, the sway stays.

Torso lean (hips → head base, degrees from vertical, forward positive; mean / min / max):

| Clip | Seated original | Graft, keep lean | Graft, upright |
|---|---|---|---|
| standing reference `idle_breathing_a` | −0.5 / −2.2 / 1.4 | | |
| `talk_sitting_a` (44 s) | 2.5 / −3.9 / 6.9 | 11.2 / 6.2 / 16.9 | 4.9 / −0.1 / 10.6 |
| `talk_meeting_a` (47 s) | −10.2 / −21.9 / 19.2 | 14.1 / 10.1 / 21.5 | 6.2 / 2.2 / 13.6 |
| `throw_dice_a` (5.7 s) | 6.3 / 3.3 / 10.4 | 3.9 / 2.8 / 5.5 | 1.5 / 0.4 / 3.2 |

Sheets `A_<clip>.png` have three rows: top is the seated original, middle is keep lean, bottom is upright. Each row shows six moments.

**Reading:** "upright" looks like normal standing talk. "keep lean" reads as leaning in (conspiring, arguing). The dice clip works standing, with both hands shaking in front. The meeting clip keeps its table-height hands, which fits a counter or a bar.

## Test B · choreography contracts and storyboards

### Scenes

| Scene | Beats | Storyboard |
|---|---|---|
| `gift_a` | A walks in carrying the box (walk_to_stop legs + carry arms) → arrives → both reach, the box passes with a squash → B presents it, the lid pops, the object rises → B's head shakes over the box, "?!" → A cheers, "♥" | `B_gift_a.png` |
| `argue_a` | Arguing a/b over each other → pointing / waving off → blow-up: yelling, angry gesture, grawlix bubbles | `B_argue_a.png` |
| `brawl_a` | Jab series → B takes it → B hooks back → A takes it → A's punch → B: surprise uppercut knockout, stars → A taunts "HA!" → B gets up → B fumes "#@%!" | `B_brawl_a.png` |

The bubbles use symbols only (!, ?!, ♥, #@%!), so they need no language.

### Contract `kfb.choreo.v0` (scene JSON)

- `actors`: A/B with rig and role.
- `stage`: position and `face` per actor. A position can be `auto:reach` (fight) or `auto:handover` (gift).
- `props`: a gift box with a size class (S/M/L) and dims, `hold: twoHands`, an owner, and contents.
- `tracks.<actor>[]`: one entry per segment.
  - `start` is a frame, `afterPrev`, or `{event, align: reactHit}`.
  - `base` is the full-body clip.
  - Optional layers: `upper` (with `upperBones: torso` to leave the arms alone) and `arms` (arms layer, looped).
  - Optional timing: `in`, `out` (for example `reactHit+30`), `loop`, `holdEnd`.
  - `anchor` is `endAtStage` or `continue`.
- `events[]`:
  - `strike`: actor, segment, the clip's strike marker, fx such as `hitstop:4`, `burst`, `shake`;
  - `handover`: from, to, fx `squash`;
  - `open` and `reveal`;
  - `bubble` and `stars`;
  - times are frames or references like `B.segment5.end+20`.
- `shots[]`: storyboard moments.

The player writes `B_<scene>.resolved.json`: the computed stage, the segment start and end times, the detected reaction frames, the stretch factors, the spacing pushes, and a note on why a segment was re-aimed.

### Rules the lab found (for the ToolBox player)

1. **Head spacing:** hips at least 2 × face-front + 6 cm apart. On Rig_Medium the face front is 0.73 m ahead of the hips, so the spacing is 1.51 m. The same rule applies to talk and gift scenes.
2. **Strike reach:** the fist reaches 0.44 m but the face is further away. At the strike frame, aim the upper arm at the face and stretch the forearm, with a ±4 frame ease.
3. **Reaction sync:** start the reaction so that its own impact frame (the first head-jolt peak) lands on the attacker's strike frame. For `taking_punch_a` only the first hit is used (`out: reactHit+30`).
4. **Re-aim turned clips:** if a clip's hips heading at its in-frame is more than 100° off the rest facing, rotate it to face the partner (surprise uppercut: 153°).
5. **Continuity:** `continue` carries the hips position over. For lying poses it uses the head-to-hips body axis. Once the actor stands again, it faces the partner and keeps the head spacing.
6. **Props:** the box sits between `handslot.l` and `handslot.r`. At the pass, both actors' hands aim at the box sides. When it is opened, the box is presented 0.78 m in front at 0.62 m height, so it is not hidden under the big head.

### Resolved numbers (brawl)

| Moment | Frame | Note |
|---|---|---|
| hit 1 (quad punch) | 59 | B's `taking_punch` starts at 49 (its jolt is at local 11); forearm stretch 2.6 (cap), miss 24 cm |
| hit 2 (hook, B) | 158 | stretch 2.44, miss 11 cm |
| hit 3 (punching b) | 231 | uppercut reaction from in-frame 30, re-aimed; stretch 1.63, miss 10 cm |
| B down | 302–372 | holds the last frame for 70 frames with stars |
| getting up | 372–601 | continues from the lying body axis |

## Tool split (recommendation)

- **Blender MCP (this chat):** clip preparation, grafts, measurements, test renders.
- **ToolBox Animation Studio:** the choreography player on the same contract, and Georg's fine-tuning of timing, faces and fx.
- **Claude Design:** the player and editor UI.
- **WSA or extra web chats:** not needed.

## Files

| File | What |
|---|---|
| `CHOREO_RESEARCH_01.md` | Research, tool decision and sources |
| `CHOREO_LAB_01_RETURN.md` | This report |
| `renders/A_kfb_talk_sitting_a.png`, `A_kfb_talk_meeting_a.png`, `A_kfb_throw_dice_a.png` | Graft test, three rows each |
| `renders/B_gift_a.png`, `B_argue_a.png`, `B_brawl_a.png` | Storyboards, six moments each |
| `scenes/*.json` | Contracts as authored |
| `resolved/*.resolved.json`, `resolved/A_graft.json` | Computed numbers |
| `source/glb.py` | Reads GLB animation data |
| `source/build.py` | Loads the clips from the published GLBs onto Rig_Raider by world-space transfer; round-trip error 0.28 cm against the library bake |
| `source/common.py`, `source/graft.py` | Test A |
| `source/choreo.py` | Player v0: resolves a contract and renders a storyboard |

The working `.blend` is not delivered (344 MB). `source/build.py` rebuilds it from the published GLBs.
