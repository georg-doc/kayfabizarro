# RESIDENT-FIGHT-SANDBOX-01 · Fight test scene in Resident Atlas

Status: **CLAUDE DESIGN BRIEF · RESIDENT ATLAS / RESIDENT SCENERY OWNER · TEST SCENE, NOT A CHOREOGRAPHY PLAYER**
Date: 2026-09-29
Owner: existing **Resident Atlas / Resident Scenery** Claude Design project
Coordination repo: `georg-doc/kayfabizarro`, branch `georg-doc-patch-3`
Stage: none. Georg reviews inside Claude Design.

## 0 · Goal in one sentence

Add one new Resident scene, **Fight Sandbox**, in which Georg picks two fighters and a fight combo and watches the existing Motion Library clips play against each other, so he can decide which combos are worth real animation work.

This is a **viewing bench**. It answers "does this pair of clips read as a hit, and at which size pairing?". It does not choreograph, edit timing or add effects.

## 1 · Why here and not in the ToolBox

- Resident Atlas already owns scenes, host ground and resident actors.
- The ToolBox / Animation Production-06 plan (PR #286) owns the real **Choreography Player** as its gate G4, which is on hold. This sandbox must not grow into that player: no timeline editor, no event tracks, no VFX system, no recipe format.
- The sandbox only needs: two actors, one clip pair, one start offset, one placement, replay. All of that comes pre-measured in the data file below.

## 2 · Read first

1. `skills/chat/START_HERE.md` (repository router; GitHub state beats chat memory)
2. current Resident Atlas Session Cut and the Resident Site Contract rebrief (`skills/chat/workflows/RESIDENT_SITE_CONTRACT_01_2026-09-29/START_HERE.md`, PR #285) for the one-host-ground rule
3. this folder: `RETURN.md` (defects first), `SOURCE.json`

## 3 · Exact sources

Branch `georg-doc-patch-3`, folder `media/3D_Assets/Animations/KFB_Motion_Library/`:

| File | Use |
|---|---|
| `KFB_Motion_Library.catalog.json` | Catalogue v5 (`2026-09-29b`, 345 clips): clip → library GLB path per rig |
| `libs/Rig_Medium/*.glb`, `libs/Rig_Large/*.glb` | The clips (armature only, 24 nodes) |
| `fight/KFB_Fight_Combos.json` | **The only fight data source**: combos, per-clip measurements and staging for every pairing |
| `fight/proof_contact.png`, `fight/proof_shoulder_throw.png` | What correct staging looks like (Blender renders) |

Rigs: `Rig_Medium` = Orc Raider, `Rig_Large` = Orc Brute. Use the character/rig binding that Resident Atlas already uses for Motion Library clips. If Raider and Brute are not yet loadable as Resident actors, show that donor gap in isolation first instead of inventing a new binding.

## 4 · Scene

- **Setting:** one simple ring or pit on the shared host ground, sized for two Brutes (about 9 m across). Placeholder look, built from the existing Resident scenery vocabulary. No new art direction; Georg decides the look later.
- **Actors:** exactly two, Fighter A (attacker) and Fighter B (defender). Each can be Raider or Brute, which gives four pairings: Raider vs Raider, Brute vs Brute, Raider attacks Brute, Brute attacks Raider.
- **Idle:** both stand in `kfb_action_boxing_a` (looped) until Play.

## 5 · Controls (one compact panel)

1. **Fighter A rig / Fighter B rig**.
2. **Mode:**
   - *Standard combo:* the 13 `combos` plus the `pairedClips` shoulder throw from the data file.
   - *Free pick:* any `attacks` clip against any `reactions` clip; staging comes from `pairMatrix["<attack>|<reaction>|<rigA>|<rigB>"]`.
3. **Status badge** from the data: `LANDS`, `BODIES_TOUCH`, `HEADS_COLLIDE`, `NO_CONTACT`, plus the hit zone (head / torso / legs) or the reason for a miss. Small icons, not large labels.
4. **Spacing switch**, shown only for `BODIES_TOUCH` and `HEADS_COLLIDE`: *hit* (`hipsDistanceM`) or *bodies apart* (`clearHipsDistanceM`, which then misses by `missAtClearM`).
5. **Play · Replay · 0.25× slow motion · frame step · loop**. After the pair ends, play the listed follow-ups (`then`: taunt, dizzy, getting up) and fall back to the boxing idle.
6. **Camera:** default side view at right angles to `attackAxisYawDeg`, framing both actors; free orbit allowed.
7. **Georg's verdict per combo and pairing:** keep / rework / drop, plus one free-text line, exportable as one JSON file (`kfb.fight-sandbox-verdicts/0.1`). This list is the real output of the sandbox.

## 6 · Staging rules (from the data file, `howToStage`)

- Frames are 1-based clip frames at 30 fps, as in the catalogue.
- **Attacker** at the arena anchor, no extra rotation. The clip plays with its own root motion.
- **Timing:** start the defender clip when the attacker clip reaches `defenderStartOnAttackerFrame`. If that value is below 1, start both together and begin the defender clip at frame `2 - value`.
- **Defender placement:** rotate by `defenderYawDeg`, then translate so that the defender hips at its `impactFrame` land at `attacks[..][rigA].hipsAtContact + hipsDistanceM` along `attackAxisYawDeg`, plus `defenderSideShiftM` to the left of that axis when present.
- **Paired shoulder throw:** both actors at the same origin, no rotation, both clips start together.
- **Coordinates:** the data uses Blender coordinates (metres, Z up, yaw counter-clockwise from +X; rigs face −Y at rest). In three.js, Blender `(x, y, z)` is `(x, z, −y)`, and a Blender yaw θ is `rotation.y = θ`.
- **Rig node offset:** all positions are relative to the rig node. The library GLBs keep the old library placement on that node (glTF translation `Rig_Medium (−2.7, 0, 1.2)`, `Rig_Large (0, 0, −1.3)`). Neutralise it once per actor; do not bake it into the staging.

## 7 · Keep known defects visible (do not hide or "fix" them in the sandbox)

- **Raider vs Raider:** several strikes only reach when the big heads overlap (`HEADS_COLLIDE`). That is the open look decision (rubber-hose arm, head squash on contact, or head hits).
- **Brute attacks Raider:** high punches and the uppercut pass over the Raider's head (`NO_CONTACT`, over the head). Play them anyway.
- **Shoulder throw between different sizes** does not grab (`NO_GRAB`). Show it with that label.
- **Getting up after a knock-out:** `kfb_reaction_getting_up_a` starts face down. After knock-outs that end face up (uppercut, crescent kick, throw) the pose jumps. Show the jump; do not blend it away.
- `kfb_action_hurricane_kick_a` is excluded: the clip has no body motion.
- Contact and impact frames are **measured candidates**. The sandbox is where Georg confirms them.

## 8 · Boundaries

Do not change: Motion Library files, catalogue, other Resident scenes (Graveyard, Band, Disco, Quaternius scenes), the Graveyard Site Contract work, WorldBuilder, ToolBox Production-05/06.
Do not add: a second motion list, a timeline or event editor, VFX, a choreography recipe format, IK or clip retiming.
Performance: two actors plus one ring. The scene uses the shared host ground and no private ground surface.

## 9 · Acceptance (machine-checkable where possible)

1. `KFB_Fight_Combos.json` loads: 13 combos, 1 paired clip, 16 attacks, 9 reactions, 576 `pairMatrix` entries.
2. All four pairings play every standard combo.
3. **Placement check:** at the attacker's `contactFrame`, the horizontal distance between the attacker hips and the defender hips equals `hipsDistanceM` (or `clearHipsDistanceM`) within 2 cm × rig scale.
4. **Timing check:** when the attacker is at `contactFrame`, the defender clip is at `impactFrame` (±1 frame).
5. Status badges match the data; `NO_CONTACT` pairs still play.
6. The verdict list exports as JSON.
7. Other Resident scenes are unchanged (the scene list still loads them; no new errors in the console).

## 10 · Budget and return

- One implementation pass plus at most one repair pass on a named acceptance blocker. After two failed repairs: stop, export the Session Cut, report.
- Return: complete Session Cut, `SOURCE.json` with exact refs, `RETURN.md` (problems first), acceptance results 1–7, one screenshot per pairing for the `hook_uppercut_ko` combo at its contact frame.

## Exactly one next gate

**Georg plays the combos in the Fight Sandbox and exports his verdict list.** The Blender MCP chat then reworks only the combos marked *rework* (reach, head squash or stretch, missing get-up from the back). Those results later feed the ToolBox Choreography Player (Production-06 G4).
