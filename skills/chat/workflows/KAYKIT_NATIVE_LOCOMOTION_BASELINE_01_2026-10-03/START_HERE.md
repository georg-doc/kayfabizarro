# KAYKIT-NATIVE-LOCOMOTION-BASELINE-01 · START HERE

Status: **BASELINE COMPLETE · GEORG-DECIDED LOCO SET HANDED OVER · NO RUNTIME INTEGRATION YET**
Date: 2026-10-04 status correction for work completed 2026-10-03
Owner: KFB ToolBox / Animation-Motion authoring
Completed executor: **Coworker / Blender MCP**
Next executor: **WSA / Codex · WB2 Player integration**
Draft PR: **#344**
Branch: `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`

## Read first

1. `GEORG_COWORKER_REVIEW/NOTE_TO_WSA.md`
2. `GEORG_COWORKER_REVIEW/BRIEF_BLENDER_KAYKIT_NATIVE_BASELINE_01_REV.md`
3. `RETURN/KAYKIT_NATIVE_BASELINE_01_RETURN.md`
4. `KAYKIT_LOCO_SET_01/HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`
5. corrected visual references:
   - `KAYKIT_LOCO_SET_01/KAYKIT_LOCO_RAMP_02_walk_run_sprint.mp4`
   - `KAYKIT_LOCO_SET_01/KAYKIT_LOCO_WEAPONS_03.mp4`

The old top-level status **PREPARED / NOT RUN** is superseded.

## What is finished

The revised Blender gate used the correct source priority:
**KayKit Character Animations 1.1 first. Mixamo / KFB Motion Library only for proven gaps.**

Primary review actor was:
**KayKit Mannequin_Medium**.

FrizzleBob v5 is the second actor.
**ActionFigure was explicitly NOT the primary review actor.**

Native baseline result:
- KEEP 21
- HOLD 3
- REJECT 0

The full result, measurements and honest source gaps are in `RETURN/`.

## Georg's binding locomotion decisions

Current Medium basic locomotion set:

- **Walk = `Walking_B`**
- **Run = `Running_A`**
- **Sprint = `Running_B`**
- **Jog = speed/phase blend between Walking_B and Running_A**
- `Walking_A` and `Walking_C` remain calmer variants.

Current source gaps:
- turn in place;
- start / stop / pivot;
- strafe walk;
- clean native jog clip is absent by design because jog is now a blend;
- some weapon/sprint combinations remain limited.

These are documented gaps.
They are **not** a reason to rerun the native baseline.

## Runtime recipe WSA must consume

Source:
`KAYKIT_LOCO_SET_01/HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`

The runtime reproduces the accepted one-parameter speed blend:
- idle 0
- walk `Walking_B` @ 0.980 m/s
- run `Running_A` @ 3.303 m/s
- sprint `Running_B` @ 5.255 m/s

Rules:
- at most two neighbouring locomotion clips active;
- shared normalized gait phase;
- per-clip left-foot-down phase offset;
- phase rate derived from active clip periods;
- world/root movement speed equals the speed parameter;
- blend local rotations **and local translations**;
- sample animation in seconds, never by assumed frame count.

Weapon/grip corrections in Update 03 of the handover are the current source.

## Next product gate

**KFB-LOCO-WB2-PLAYER-01**

Receiving owner:
**KFB WorldBuilder / WB2 · Draft PR #348**

Goal:
attach the accepted Medium locomotion recipe to the already browser-proven four-island WB2 world.

Do not:
- rerun the Blender baseline;
- re-pick clips;
- re-rank KayKit vs Mixamo;
- use ActionFigure as a new baseline decision;
- create a consumer-local second locomotion state machine.

## ActionFigure

ActionFigure may later receive a **small compatibility smoke** for Curtain Character Select if needed.
That is not a new baseline and must not block first WB2 Player integration.

## Rig_Large

Large transfer remains a follow-up after the Medium runtime seam works.
Use the same semantic/runtime code path with separately measured Large data.
Do not assume Medium speeds/translations transfer unchanged.
