# KFB-LOCO-WB2-PLAYER-01 · WSA / Codex execution brief · 2026-10-04

Status: **READY FOR WSA / CODEX · CURRENT NEXT GATE**
Receiving owner: **KFB WorldBuilder / WB2**
Receiving candidate: **Draft PR #348**
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`
Outcome: **one real playable Rig_Medium player in the browser-proven four-island WB2 world**
Stage route: **none for implementation/debug; use local/browser proof first**

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this file
5. current world:
   - `RETURN.md`
   - `RECOVERY.md`
   - `TEST_REPORT.md`
   - `WORLD_PROFILE.json`
6. Motion source, exact current branch/head:
   - PR #344
   - branch `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`
   - head `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`
   - `RETURN/KAYKIT_NATIVE_BASELINE_01_RETURN.md`
   - `KAYKIT_LOCO_SET_01/HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`
   - `KAYKIT_LOCO_SET_01/KFB_KAYKIT_LOCO_SET_01.v1.json`

GitHub state overrides older router prose.

## Corrected Motion truth

The native Blender baseline is **complete**.

Do not run it again.

Review actor:
**Mannequin_Medium**.

FrizzleBob v5 is second.
ActionFigure was explicitly **not** the baseline review actor.

Native baseline result:
**KEEP 21 · HOLD 3 · REJECT 0**.

Georg's binding basic locomotion:
- Walk = `Walking_B`
- Run = `Running_A`
- Sprint = `Running_B`
- Jog = speed/phase blend between Walk and Run
- KayKit Character Animations 1.1 only for the basic set.

Documented gaps:
turn in place, start/stop/pivot, strafe walk.
They do not block this slice.

## Exact motion contract

Consume the PR #344 JSON.
Do not retype/re-pick the table if it can be loaded as data.

Anchors:
- idle: Idle_A · 0 m/s · T 1.067
- walk: Walking_B · 0.980 m/s · T 1.067 · left-foot phase 0
- run: Running_A · 3.303 m/s · T 0.800 · left-foot phase 0.0833
- sprint: Running_B · 5.255 m/s · T 0.800 · left-foot phase 0.125

Required rules:
- linear weights between neighbouring speed anchors;
- at most 2 active locomotion clips;
- one shared normalized gait phase;
- phase-offset sample per clip;
- phase rate from active periods;
- root/world speed = speed parameter;
- blend local rotations and local translations;
- sample by seconds, never assumed frame numbers.

Do not average old J14/KCL conflicting speeds into this set.

## Actor for this first runtime seam

Use **Mannequin_Medium** as the deterministic first runtime fixture because it is the reviewed source actor.

Do not silently replace it with ActionFigure.

FrizzleBob Player adoption is the next appearance/Character-Select consumer after the shared runtime seam works and its exact source pin is reconciled.

## World owner contract

PR #348 already proves:
- Town;
- Dystopia;
- Utopia;
- Protopia;
- 3 Track Core ROAD_BRIDGE connections;
- one WB2 renderer/world owner;
- `spawn`;
- `baseHeightAt(x,z)`;
- `groundAt(x,z,terrainHeight)`;
- `solidAt(x,z)`;
- `buildingAt(x,z)`;
- Track Core route/support facts.

The Player consumes these facts.

Do not:
- create another terrain/collision truth;
- revive PR #332;
- import old `wi1-play.js` Motion-Library presentation;
- make Travel the macro-world owner.

## Ground movement ownership

There must be exactly one Ground movement writer and one active camera owner.

Reuse the existing KFB Ground-controller behavior/input semantics where useful.
The existing WB0 ground-controller is an owner/donor for:
- W/S forward/back;
- A/D turning;
- Shift run intent;
- camera/orbit behavior;
- later Q/E strafe;
- later Space jump.

But the existing spherical implementation must not force Travel/Globe world ownership onto WB2.

If a shared planar adapter/extraction is required:
- rehome/adapt the movement intent once into the shared Ground owner;
- keep the controller independent of Motion clip selection;
- consume WB2 support facts;
- do not create a second consumer-local locomotion state machine.

## First checkpoint scope

### Include
- one Mannequin_Medium player root;
- one AnimationMixer/presentation owner;
- accepted idle/walk/run/sprint speed-phase blend;
- WB2 Ground movement on the real world;
- terrain/road/support grounding through WB2 facts;
- current Ground camera behavior;
- W/A/S/D + Shift as the acceptance interaction;
- state/evidence showing current speed + active clip weights;
- save-safe player transform shape compatible with later persistence.

### Explicitly not in first checkpoint
- Jump integration;
- turn-in-place clips;
- start/stop/pivot clips;
- strafe-walk animation;
- weapon carry/aim;
- FrizzleBob appearance;
- ActionFigure compatibility;
- Rig_Large transfer;
- Drive/Taxi;
- Flight;
- Residents;
- Combat;
- Curtain UI.

Do not turn gaps into hidden extra scope.

## Acceptance

Repository/static:
1. no Mixamo / Motion Library clip used for basic locomotion;
2. runtime reads the PR #344 loco-set data or a byte/semantic-identical pinned generated consumer artifact;
3. only one movement writer;
4. only one actor AnimationMixer;
5. WB2 remains world/support owner.

Browser:
6. exact PR #348 four-island world boots;
7. Mannequin spawns at the existing Town safe/spawn anchor;
8. W moves forward, A/D turn, S moves back, Shift reaches the sprint end of the same speed ladder;
9. walking/running across ordinary terrain and Track does not detach from WB2 support;
10. speed ramp idle → walk → run → sprint → walk → idle has no T-pose frame or double-step at walk/run;
11. steady Medium foot creep remains within the source contract where measurable;
12. no page/console errors attributable to the slice;
13. four-island world/Track regression stays green.

Review:
- use the real integrated WB2 world, not a standalone debug page;
- automated evidence can include a side-view comparison against `KAYKIT_LOCO_RAMP_02`;
- do not manufacture a Georg gate unless the integrated movement visibly needs a feel/look decision.

## Save / persistence seam

Expose one stable player state object with at least:
- actorProfileId;
- worldId;
- position;
- heading;
- movement speed/intention needed for safe resume.

Do not build the full Lean Memory backend here.

## Stop rules

Stop and report instead of guessing if:
- the PR #344 JSON contradicts the handover;
- Mannequin cannot bind to the exact KayKit sources;
- adopting the existing Ground controller would introduce a second world owner;
- two repair passes fail the same integration gate.

## Return

Update the existing PR #348:
- implementation;
- source/evidence tests;
- `RETURN.md`;
- `RECOVERY.md`;
- `TEST_REPORT.md`;
- local/integrated browser evidence;
- additive changelog.

No new branch unless a real owner conflict requires it.
No merge.
No Live promotion.

## Exactly one next gate after PASS

**WSA-RES-SET-01**

Residents attach only after the Player/Motion seam is real in WB2.
