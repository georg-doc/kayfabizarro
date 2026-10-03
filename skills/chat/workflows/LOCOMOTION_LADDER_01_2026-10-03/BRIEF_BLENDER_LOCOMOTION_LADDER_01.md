# BRIEF · LOCOMOTION-LADDER-01 · Blender MCP lane · 2026-10-03

- From: Claude Coworker (production lead), on Georg's request
- To: Blender MCP lane (Claude Cowork with Blender)
- Type: **measurement and data only.** No runtime, no state-machine code, no Three.js, no ToolBox/Travel/Combat edits.
- Owner split (unchanged, from `HANDOVER_WSA_CHAT.md` 2026-09-30): Blender lane = measurement, clip bakes, data files, Blender reference views, briefs. **No runtime owner.**

## Why

Georg tested the latest locomotion integration: "W works, animation and locomotion don't." WSA froze that branch (no push, no PR, no integration). WSA's own list of what is missing:

- `W` drives a natural acceleration curve
- automatic gait changes Idle → Start → Walk → Jog → Run → Sprint, and back when slowing down
- gait chosen from real speed and move direction, not from number keys
- stride length, foot contact and playback speed without sliding
- phase-synced transitions between gaits
- direction changes, backwards, side steps, turns

Most of the **data** for this already exists in the Motion Library and the ToolBox Motion Lab, but nobody has put it together as one gait ladder. That is this job. The browser controller that uses it comes afterwards, built elsewhere.

## Read first (do not re-measure what is already measured)

1. **Motion Library v6** (your own work): `KFB_Motion_Library.catalog.json`, `RETURN_INTAKE_06.md`. Dropbox: `3D ASSETS/BLENDER MCP/MOTION_LIB_v6/`. GitHub: `media/3D_Assets/Animations/KFB_Motion_Library/`. Already there: 148 locomotion clips with `travelMetersPerCycle`, foot `contacts`, `rootMotion`, `forwardYawDeg`, `travelYawDeg`, and `locomotionSets` (`male_basic`, `female_basic`, `magic_caster`, `drunk`, `carry_*`, `wheelbarrow`) with `speedMs` per rig.
2. **ToolBox KayKit Motion Lab v1**: `kfb-hub/stage/toolbox/kaykit-motion-lab-v1/README.md` + `SOURCE.json` (head `3ab2a439`, 87/87 browser PASS, human gate open). It measured the KayKit pair on Rig_Medium: Walking_A ref ~0.611, Running_A ref ~2.480, handoff ~1.108, and showed the problem: the gap is so wide that playback has to stretch to Walk ~1.80× and Run ~0.45×. That is the sliding Georg sees.
3. **KayKit packs on Dropbox**, `KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/`: `MovementBasic` (Walking_A/B/C, Running_A/B, Jump_*) and `MovementAdvanced` (Walking_Backwards, Running_Strafe_Left/Right, Sneaking, Crouching, Crawling, Dodge_*). Motion Lab v1 only loaded General + MovementBasic.
4. **Existing locomotion profile work** (read, do not redo): `KFB ToolBox Production-01-1/.../data/kfb-locomotion-profiles.Rig_Medium.frizzlebob-earrig-v5.consumer.json`; branches `chatgpt-web/kfb-ground-locomotion-profile-consumer-01-2026-09-29`, `chatgpt-web/kfb-container-walk-pace-tune-01-2026-09-29`, `chatgpt-web/kaykit-creator-learning-2026-09-19` (KayKit creator guidance).
5. **World scale** (Georg, 30.09.): KayKit original proportions with **one common factor for all rigs** (Medium ≈ 1.5 m). The v6 `speedMs` for Rig_Large are in Large's own bake scale; report both.

## Tasks

1. **Gait ladder per rig (Rig_Medium first, Rig_Large second).** Pick one clip per rung from what exists:
   `idle · walkStart · walk · jog · run · sprint · walkStop · runStop · walkBack · runBack · strafeWalkL/R · strafeRunL/R · turnInPlace 90/180 L/R · jumpStart · jumpAir · jumpLand`.
   Prefer **one consistent style family** per ladder (do not mix the KayKit look with Mixamo `male_basic` inside one ladder without saying so). Propose a default ladder and, if useful, one alternative family.
2. **Per rung, record:** clip id, library file, loop yes/no and loop quality (`loopPoseDiffDeg`), natural speed (m/s, per rig, also in common world scale), cycle length and duration, **left-foot-down phase** (0..1) as the sync marker, `rootMotion`, `forwardYawDeg`, `travelYawDeg`.
3. **Speed bands.** For each pair of neighbouring rungs: the speed where one hands over to the next, and the playback-rate window each clip needs to cover its band. **Flag every rung that needs more than ±25 % playback stretch** (the KayKit Walk/Run problem). For such gaps, say whether an existing clip fills them.
4. **Phase sync check.** For each neighbouring pair: are the same-foot contacts alignable; report the phase offset to apply.
5. **Slip check.** Each loop clip played in place at its natural speed: foot slip during contact in cm (Medium) and as % of actor height. Mark PASS / HOLD with your threshold stated.
6. **Gaps.** Rungs with no usable clip (likely candidates: clean start, clean jog, clean sprint). Give Mixamo clip **names** Georg could download into `BLENDER MCP/_inbox`. **Do not download.**
7. **Visual check for Georg.** Per his preference: open the ladder directly in his running Blender (clips side by side on a grid, each moving at its natural speed, with footprint markers) so he can orbit and judge. No render loop, no HTML viewer needed.

## Output

- `LOCOMOTION_LADDER_01.json` (data, schema stated at the top), next to the Motion Library.
- Additive catalogue entry `locomotionSets.kfb_ladder_v1` (and alternative if proposed). Every existing library and catalogue field stays byte-identical, as in intake 06.
- `RETURN.md`: a short plain-language part for Georg first (what works, what is missing, what he should look at in Blender), then the technical detail.
- Push to GitHub on your own branch (suggested `blender-mcp/locomotion-ladder-01-2026-10-03`). No merge, no stage, no live.

## Not in this job

No browser controller or state machine, no Three.js, no edits in ToolBox, Travel, Combat or Resident Atlas, no hand-editing of motion (ask Georg first if a clip needs a fix), no new owner, no downloads.

## Stop rules

Stop and report if: a needed clip does not bind to the rig; measured values contradict Motion Lab v1 by more than 10 % for the same clip (report both, do not pick silently); two attempts at the same measurement fail.

## What happens afterwards (for context, not your job)

1. Georg looks at the ladder in Blender and says OK or corrects it.
2. A short locomotion contract is written from your data (speed bands, transitions, acceptance).
3. One test page: one character on neutral ground, normal WASD + Shift + Space, no lab panels.
4. Georg's visual PASS. Only then Travel, island world and Combat take it over.
