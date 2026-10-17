# #369 Addendum 3 · Debate (culture mechanic), first pass

- **Status:** FIRST PASS, waiting for Georg's look decision.
- **Writes:** additive to branch `blender/resident-performance-choreography-2026-10-07`.
- **Boundaries:** no merge, no FBX, no textures, `.blend` in Dropbox only.

## What it is

Scene `369_DEBATE`: Farmer B (Rig_Medium) and Orc Brute (Rig_Large) argue in turns, 2.6 m apart and facing each other.

- The whole scene is built from existing clips only:
  - Motion Library `talk` / `gesture`;
  - PR #358 exchange reactions;
  - KayKit `Idle_A` as the base layer.
- Every clip is wrist-fixed (MLBWn) and quaternion-aligned to `Idle_A`.
- The `BEATS` table in `kfb369_debate.py` is the single source of the choreography. Edit it, or override it through `data/debate_params.json`.

At 24 fps:

| Frames | Farmer | Orc |
|---|---|---|
| 10–120 | explains (`kfb_talk_talking_e`) | listens (idle) |
| 116–216 | boggles (`kfb_react_boggle_a`) | contradicts, then argues (`kfb_react_contradict_a`, `kfb_talk_arguing_a`) |
| 176–255 | gets angry (`kfb_gesture_angry_gesture_a`) | outraged (`kfb_react_outraged_a`) |
| 256–336 | waves it off (`kfb_react_dismiss_a`, `kfb_gesture_dismissing_gesture_a`) | yells (`kfb_gesture_yelling_a`) |
| 334–410 | shakes her head (`kfb_gesture_thoughtful_head_shake_a`) | disappointed (`kfb_react_disappointed_a`) |

## Checks

**Hand-in-head audit on Farmer B.** This addresses U1 from the #369 RETURN: raised-hand clips hit the chibi head on Rig_Medium.

- 26 Medium clips were audited after the wrist fix.
- Clean, with 0 samples inside the head:
  - talk: `talking_a`, `talking_c`, `talking_e`, `talking_f`;
  - gesture: `angry_gesture`, `dismissing_gesture`, `thoughtful_head_shake`, `talking_a`;
  - reactions: `boggle`, `contradict`, `dismiss`, `outraged`, `disappointed`, `amused`.
- Still hitting the head: `talk_arguing_b` (14 samples), `talk_talking_d` (14), `meeting_a` (22), `watercooler_a` (9) and `gesture_strong_gesture_a` (8).

**In the debate scene:**

- Farmer hand-in-head: 0.
- Orc hand-in-own-head: 0.
- Nearest Orc hand to the Farmer's head: 1.40 m.
- One Orc foot rotation step of 41° at f373 (blend into `react_disappointed`). Open.

## Open (deferred)

| ID | Item |
|---|---|
| D1 | The Farmer's gestures read smaller than the Orc's. Possible fixes: a stronger Medium clip set, a head-pitch / lean layer, or emanata (EyeRig / PetMouth own face and speech; nothing was added here). |
| D2 | The Orc foot step at f373. |
| D3 | Speaker's-corner monologue variant (one resident on a crate, a listener reacting) is not built yet. |

## Files

- `kfb369_debate.py`
- `../PREVIEWS/DEBATE_r1_side.jpg`
- `../PREVIEWS/DEBATE_r1_threequarter.jpg`
- Blend copy (Dropbox): `blend/KFB369_debate_r1.blend`
