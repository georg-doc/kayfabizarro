# #369 Addendum 4 · Debate r2: talk rule engine + bigger clip pool

- **Status:** FIRST PASS of the engine, plus r2b (outcome spread + look-at turns, requested by Georg on 2026-10-08).
- **Why:** Georg's review of r1: it read as one hand-cut animation with no modular variation in conversation dynamics, escalation, debate depth or engagement. Talk is a non-repetitive activity, so long conversations need a far larger pool and a dynamic component.
- **Writes:** additive to branch `blender/resident-performance-choreography-2026-10-07`.
- **Boundaries:**
  - no merge;
  - no raw Mixamo FBX;
  - no textures;
  - `.blend` stays in Dropbox.
- **Leaves alone:** r1 (`369_DEBATE`, addendum 3).

## What changed

r1 was a fixed timeline: 11 beats, one rising curve, and both residents at full engagement throughout. r2 replaces it with three layers.

| Layer | File | What it does |
|---|---|---|
| Clip pool | `data/talk_pool.json` | Windows of prepared clips, each tagged with role, function and intensity. |
| Rules | `data/talk_rules.json` | All dynamics knobs. Nothing is hard-coded in the engine. |
| Engine | `scripts/kfb_talk_gen.py` | Pure Python with no Blender. Takes a seed plus a cast profile and returns timelines, a turn log and an outcome. |

Blender only plays what the engine returns (`kfb369_talk_scene.py`). The same engine can run in the three.js runtime later. There, the dialogue layer (an LLM choosing the social exchange: speculate / contradict / dismiss …) replaces the weighted dice.

## Clip pool

**New clips:**

- **Mixamo "Gestures Pack Basic":** 12 clips not yet in the library, retargeted with the unchanged `ml_bake.retarget` onto Rig_Medium and Rig_Large and resampled from 30 to 24 fps:
  - acknowledging
  - annoyed head shake
  - being cocky
  - happy hand gesture
  - hard / normal / lengthy / sarcastic head nod
  - look away
  - relieved sigh
  - shaking head no
  - weight shift
- **Motion Library v6:** 23 more clips baked:
  - 15 idles: idle a–f, breathing a/b, standing, standing 03, looking around ×2, sad, happy, rejected, laughing;
  - cheering, clapping ×2, look over shoulder, taunt b;
  - reactions: surprised, reacting.
- **Seated talk on standing legs** (`talk_sitting_a`, `talk_meeting_a`):
  - the lower body is dropped, so the Idle_A base layer carries the legs;
  - the spine's mean lean is moved onto the Idle_A spine (the Choreo Lab "upright" variant, simplified).

**Windows:**

- Long clips are cut at calm points (local minima of hand speed) into windows of 40–100 frames.
- Every window can also play mirrored. KayKit rigs are exactly symmetric in rest (measured deviation 0.0), so the mirror is a swap of `.l`/`.r` plus a quaternion and location flip.
- **Intensity 1–3** is measured from energy tertiles: hand speed / height, plus head angular speed.
- **Hand-in-head:** an ellipsoid test against the head mesh. On Rig_Medium every window with a hit is dropped.

**Result:**

| Rig | Windows | From clips | Speaker windows | Listener windows | Seated-talk windows |
|---|---|---|---|---|---|
| Medium | 134 | 58 | 84 | 67 | 29 |
| Large | 148 | 61 | 98 | 67 | 29 |

Speaker and listener columns overlap, because some clips serve both roles.

**Functions:**

| Role | Functions |
|---|---|
| Speaker moves | explain, question, agree, insist (brag / accuse), contradict, dismiss, taunt, rage, concede |
| Listener signals | attend, approve, doubt, oppose, surprise, sulk, mock, bored, idle, celebrate |

## Rule engine (all values in `talk_rules.json`)

**Actor profile:**

- engagement 0 absent, 1 polite, 2 engaged, 3 dogged;
- `fuse`: how fast heat rises against this resident;
- `stubbornness`: how rarely they agree or concede;
- `stance` (Speaker's Corner only): pro / contra / neutral.

**Heat:** the shared escalation, 0–3, in bands chat / disagree / argue / outburst. The move weights depend on the band.

**One turn:**

1. The speaker picks a move.
2. The turn length depends on engagement; short moves (rage, dismiss, …) are shorter.
3. Windows of that function are chained toward the target intensity. The engine prefers windows not used recently and mirrors at random.
4. The listener sends signals that fit the move and its own engagement.
   - A dogged listener opposes more.
   - An absent listener gets bored.
   - The gaps between signals shrink with engagement.

**Dynamics:**

- Contradiction, dismissal, taunts and rage raise heat, scaled by the listener's fuse. Agreeing and conceding lower it.
- An engaged or dogged listener can cut the speaker off once heat is at "disagree" or higher.
- Patience drops with hostile moves and with boredom.

**Outcomes:**

| Outcome | When |
|---|---|
| agree | low heat after a concession |
| agree to disagree | time runs out |
| walk off | a listener's patience is used up |
| outburst | heat reaches the top |

**Speaker's Corner:** the same engine, with one speaker on a crate and a crowd with stances.

- Contra listeners can heckle. The speaker answers a heckle by insisting, raging or dismissing.
- Fans' approval cools the heat.
- Bored listeners walk off.
- The scene ends in applause or an outburst.

**Walk-off:** a turn-away (14 f) followed by KayKit `Walking_A`, with a stance-foot lock: the planted foot stays put and the body moves, so there is no sliding.

## Four seeded runs (videos)

The overlay shows:

- the cast profile;
- the heat meter;
- the current turn (speaker → move, cut off, heckled);
- a label above every head (orange for the speaker);
- the outcome.

| Run | Cast | Seed | Length | Turns | Result |
|---|---|---|---|---|---|
| A polite chat | Farmer polite, Orc polite, start heat 0.2 | 2 | 31.7 s | 7 | agree; max heat 0.34 |
| B heated argument | Farmer engaged (fuse 0.6), Orc dogged (fuse 0.9, stubborn 0.9), start heat 0.9 | 10 | 30.3 s | 6, of which 2 cut off | outburst (Orc) |
| C dogged vs absent | Orc dogged, Farmer absent | 8 | 28.8 s | 4 | Farmer walks off |
| D Speaker's Corner | Farmer B dogged on a crate; crowd: Orc contra (dogged), Farmer A pro, Lorekeeper contra (polite), Goth Girl absent | 4 | 38.3 s | 7, 3 heckles | Goth Girl walks off mid-way; applause |

**Repetition per run:** in A–C every resident plays 10–13 events from 10–11 distinct windows. The exception is the absent Farmer in C, with 5 events from 5 windows. No window repeats inside a run, except one double in D for the Orc.

**Seed sweep** (39 seeds per profile):

| Profile | Outcomes |
|---|---|
| A | 32 agree / 7 agree to disagree |
| B | 27 agree to disagree / 12 outburst |
| C | 39 walk-off |
| D | 39 applause |

## Checks

- **Hand to head:**
  - debate: the nearest Orc hand to the Farmer's head is 1.51–1.64 m;
  - corner: ≥ 0.72 m between residents (the Orc stands 2 m from the crowd because of the reach of `react_outraged`).
- **Foot rotation step per frame:**
  - 6.5–21.7° in clip blends;
  - 26.6° at the walk-off turn;
  - before the fix, NLA blends were silently 0, because `use_auto_blend` was set after the blend values. Fixed in `kfb_talk.build_nla`.
- **Previews:** every video was spot-checked as a 5-frame sheet per run.

## Open (deferred)

| ID | Item |
|---|---|
| D4 | Done in r2b (see below). |
| D5 | The turn-away before a walk-off is a pivot on the spot, not a step turn. |
| D6 | The seated-talk windows (29) have not been viewed one by one. Table-height hands from `meeting_a` may read odd. |
| D7 | Medium speakers still read small next to Large (D1 from r1). |
| D8 | Done in r2b for hecklers and walk-offs. In a two-person debate the residents already face each other, so an interrupt needs no turn. |
| D9 | Content is not visible: debate depth and the argument itself need bubbles / calls / triplets. Body language carries engagement and heat only. |
| D2 | Covered: r2 blends no longer jump; the r1 f373 step stays in r1. |

## Files

**Scripts:**

- `scripts/kfb_talk_gen.py`: rule engine, pure Python.
- `scripts/kfb_talk.py`: Blender helpers (prepare, mirror, seated graft, hand-in-head, timeline → NLA).
- `scripts/kfb369_talk_scene.py`: realizer (scene `369_TALK`, cloned residents, walk-off with foot lock, overlay track, checks).
- `scripts/kfb369_debate_r2.py`: the four runs, render; override file `data/debate_r2_params.json`.
- `scripts/kfb369_talk_pool.py`: pool builder with the hand tags.
- `scripts/kfb369_talk_intake.py`: Gestures Pack Basic retarget.
- `scripts/kfb369_talk_libclips.py`: Motion Library clips.
- `scripts/talk_overlay.py`: caption overlay + MP4 (Pillow, ffmpeg).

**Data:**

- `data/talk_pool.json`
- `data/talk_rules.json`
- `data/talk_runs/*.json`: replayable runs.

**Previews:**

- `previews/DEBATE_r2_A_polite_chat.mp4`
- `previews/DEBATE_r2_B_heated_argument.mp4`
- `previews/DEBATE_r2_C_dogged_vs_absent.mp4`
- `previews/DEBATE_r2_D_speakers_corner.mp4`
- `previews/DEBATE_r2_INTAKE_gestures_FarmerB.jpg`
- `previews/DEBATE_r2_INTAKE_gestures_OrcBrute.jpg`

**Blend copy (Dropbox):** `blend/KFB369_debate_r2_talk_engine.blend`.

## r2b · outcome spread + look-at turns

Rules are now `kfb.talk.rules.v2`. Engine run files are `kfb.talk.run.v2`. A run file also stores `finalProfiles` and `looks`.

**New rules:**

- **Drawn in** (`drawIn`): a hostile move (taunt, rage, dismiss, question, contradict, insist) can pull an absent or polite listener up one engagement level, with probability p × (0.5 + fuse). That listener's patience refills to half the new level, and heat rises by 0.15.
- **Provoking** (`provokeAbsent`): an engaged or dogged speaker facing an absent listener questions, taunts and dismisses more, and explains less.
- **Speaker's Corner:**
  - **Patience by stance** (`stancePatience`): pro ×1.2, neutral ×0.8, contra ×0.55.
  - **Crowd cost per heat band** (`crowdCost`): how fast each stance loses patience as heat rises.
  - **Answering a heckle** (`answerCost`): rage, dismiss, taunt or insist costs the heckler patience. When a heckler leaves, heat drops by 0.5.
  - **Won over** (`sway`): a calm explain or agree can turn a listener pro.
  - **Deserted** (`desertedAt`): a new outcome when at most one listener is left.

**Seed sweep** (60 seeds per profile):

| Profile | Outcomes |
|---|---|
| C, dogged vs absent | 44 walk-off · 12 drawn in then agree to disagree · 4 agree (r2: 39/39 walk-off) |
| D, Speaker's Corner | 37 applause · 15 applause after the heckler leaves · 6 outburst · 2 deserted (r2: 39/39 applause) |

**Look-at turns** (`kfb369_talk_scene.look_layer`):

- The engine emits look events:
  - on a heckle, the speaker and every listener turn to the heckler;
  - when someone walks off, the speaker or the remaining resident watches them go.
- The realizer adds a COMBINE track on top of the clips. It twists spine, chest and head (25 / 30 / 45 %) about their local Y axis. The sign is verified: +Y twist = +yaw.
  - The feet stay planted.
  - Moving targets are followed.
  - The turn is clamped to ±75°, ramps in over 10 f and out over 12 f.
  - On a target switch the turn is limited to 12° per key.

**Runs (videos):**

| Run | Seed | Length | Result |
|---|---|---|---|
| C1 absent walks off | 3 | 33.3 s | walk-off |
| C2 drawn in, stalemate | 5 | 37.2 s | Farmer drawn in → polite; agree to disagree |
| C3 drawn in, agree | 7 | 28.0 s | Farmer drawn in → polite; agree |
| D1 heckler leaves, applause | 7 | 34.6 s | Goth Girl and the Orc walk off; applause |
| D2 outburst | 12 | 29.4 s | Goth Girl walks off; the speaker's outburst |
| D3 deserted | 2 | 39.7 s | Goth Girl, Orc and Lorekeeper walk off; deserted |

**Checks:**

- Hand to head ≥ 0.63 m.
- Foot step per frame ≤ 26.7°, the largest at walk-off turns.
- `previews/DEBATE_r2b_*.mp4` were spot-checked as 4-frame sheets per run.

**Note on A and B:** the A and B run files and videos stay as r2. Rules v2 would change their seeds slightly (draw-in can now pull a polite listener in).

**Blend copy (Dropbox):** `blend/KFB369_debate_r2b_outcomes_lookat.blend`.
