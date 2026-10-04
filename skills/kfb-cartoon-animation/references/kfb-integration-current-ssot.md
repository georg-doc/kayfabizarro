# KFB Animation · aktueller Arbeitsstand

Status date: 2026-10-04
Status: **NATIVE BASELINE COMPLETE · DECIDED MEDIUM LOCO SET READY FOR WB2 CONSUMER**
This file is the plain-language KFB routing reference for the portable animation skill. Current project/branch Returns still win for exact implementation facts.

## Was ist der Stand?

The failed mixed-source browser candidate remains archived evidence.

The corrected KayKit-native Blender review on Motion PR #344 is **complete**.

Correct review priority:
1. KayKit Character Animations 1.1;
2. Mixamo / KFB Motion Library only for proven gaps.

Correct review actors:
- primary: **Mannequin_Medium**;
- second: **FrizzleBob v5**;
- ActionFigure was explicitly **not** the native baseline review actor.

Native baseline result:
**KEEP 21 · HOLD 3 · REJECT 0**.

## Georg's decided Medium locomotion set

- Walk = `Walking_B`
- Run = `Running_A`
- Sprint = `Running_B`
- Jog = speed/phase blend between Walking_B and Running_A
- Walking_A / Walking_C remain calmer variants.

Machine-readable handover:
Motion PR #344 →
`KAYKIT_LOCO_SET_01/KFB_KAYKIT_LOCO_SET_01.v1.json`

Reference handover:
`KAYKIT_LOCO_SET_01/HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`

Corrected visual reference:
`KAYKIT_LOCO_RAMP_02_walk_run_sprint.mp4`

## Documented gaps

These are known gaps, not unfinished baseline work:
- turn in place;
- start / stop / pivot;
- strafe walk;
- Rig_Large coverage beyond its thinner native set.

Do not send Blender back through the native baseline to solve them.

## Wer macht jetzt was?

**Next executor: WSA / Codex.**

**Task: KFB-LOCO-WB2-PLAYER-01**

Receiving world:
WB2 Draft PR #348.

Goal:
one Mannequin_Medium player uses the accepted KayKit speed/phase blend in the real browser-proven four-island world.

The consumer may not:
- re-pick or re-time the clips;
- make ActionFigure the baseline actor;
- restore the failed Mixamo-first ladder;
- create a second locomotion state machine;
- change WB2 world/support ownership.

## Was muss Georg tun?

Start the WSA/Codex integration job from the current PR #348 brief.

No further Blender baseline action is required.

## Was passiert danach?

1. WSA/Codex proves the Medium Player/Motion seam in WB2.
2. Resident placement/Save/Reload follows through `WSA-RES-SET-01`.
3. FrizzleBob/Character Select consumes the same shared player seam after its exact source pin is reconciled.
4. Rig_Large is probed against the same semantic code path with its own measured capabilities.
5. Drive and later Flight attach without replacing the Ground owner.

## Binding source priority

For the basic locomotion set:
1. KayKit Character Animations 1.1;
2. accepted native variants;
3. supplementary sources only for documented gaps.

Consumers must not create local gait tables that contradict the Motion owner.

## Technischer Nachweis — nur für die ausführenden Chats

Motion owner:
PR #344 · branch `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`
current corrected head: `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`.

Read:
- `RETURN/KAYKIT_NATIVE_BASELINE_01_RETURN.md`
- `KAYKIT_LOCO_SET_01/HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`
- `KAYKIT_LOCO_SET_01/KFB_KAYKIT_LOCO_SET_01.v1.json`

Receiving owner:
PR #348 · read `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/KFB_LOCO_WB2_PLAYER_01_BRIEF.md`.
