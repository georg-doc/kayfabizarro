# KFB Animation/Motion SSOT · Foundation · START HERE

Status: TECHNICAL CONVERGENCE PASS · LADDER 02 FORWARD READY · HUMAN LOOK OPEN
Date: 2026-10-03
Owner: KFB ToolBox / Animation-Motion authoring

## Current owner

- Repository: `georg-doc/kayfabizarro`
- Draft PR: **#333**
- Branch: `chatgpt-web/motion-ssot-convergence-2026-10-03`
- Tested implementation head: `aaf7f899caee381ede876a50276e0a3d2aaeb6c8`

PR #333 is the single current Motion/Locomotion owner. Travel, Combat, World and Residents consume this owner later; they do not fork local gait/state tables.

## Current source truth

1. `../../kfb-lib/MOTION_STATE_CONTRACT.v1.json`
2. `../../kfb-lib/motion-state-machine.v1.js`
3. `../../kfb-lib/locomotion-ladder-profile.v1.js`
4. `../../kaykit-motion-lab-v1/evidence/blender-ladder-02/LOCOMOTION_LADDER_02.json`
5. `../../kaykit-motion-lab-v1/evidence/blender-ladder-02/RETURN.md`
6. `../../../../media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`
7. `RECOVERY.md`
8. `TEST_REPORT.md`

## Proven now

- complete Motion Library v7 source closure is present: **395 clips**;
- Intake 07 adds 25 clips and rejects 16 duplicates;
- Ladder 02 technical forward order is **walk → jog → run.easy → run → sprint**;
- all four forward handoffs are within the measured ±25% playback envelope;
- the central state machine consumes those measured windows; no consumer-local thresholds are needed;
- phase offsets remain explicit evidence;
- old KCL/Motion-Lab measurements remain an independent same-clip cross-check and are not silently overwritten;
- exact-head Foundation CI is **26/26 Node tests PASS**, plus syntax/JSON/reconciliation smoke PASS;
- Production Resource Registry and Asset Registry Refresh also PASS on the exact head.

## Still open

Human look choice only:
- jog: `jog_forward_a` vs `jogging_a`;
- run: `medium_run_a` vs `running_d`;
- sprint: `sprint_a` vs `fast_run_a`.

Technical directional gaps:
- no side jog;
- backward jog remains HOLD;
- left strafe run remains HOLD;
- left running turns missing;
- run stop still ends with about 45° turn.

## Exactly one next product gate

Build **one clean neutral ActionFigure / Rig_Medium freeplay prototype** using this same central owner:
- WASD
- Shift
- Space
- normal play view
- no Travel Globe
- no consumer-local motion state machine

The prototype is for Georg's visual/freeplay choice and acceptance. After that PASS, dock the same owner into procedural World **#332**, not Travel.

No merge, Stage publication or Live promotion is authorized by this Return.


## CURRENT · ActionFigure freeplay review

The technical freeplay build is complete and browser-proven.

**Nächster Ausführender: Georg.**

**Deine Aufgabe:** Open the private KFB Production Control Site link delivered in chat, use WASD / Shift / Space, and choose Jog A/B, Run A/B, Sprint A/B.

**Danach:** ChatGPT Web/GitHub persists the selected look and docks the same Motion owner into procedural World #332.

You do not need to inspect GitHub, CI or deployment metadata.

Tested implementation head:
`f1ce90d31a18973fa981bc982309c4bb01b204b8`

Review:
**SITE REVIEW · NOT PUBLIC STAGE**


## CURRENT OVERRIDE · HUMAN FAIL / KAYKIT-NATIVE RESTART

The prior mixed Ladder-02 ActionFigure freeplay is no longer a review candidate.

**Product verdict: TOTAL FAIL.**
Technical browser PASS is retained as evidence only.

### Binding source priority

For ActionFigure / Rig_Medium:
1. **KayKit Character Animations 1.1 native clips first**
2. native KayKit variants / playback only after isolated review
3. Mixamo / KFB Motion Library only for an explicitly proven gap

This restores the existing canonical rule in `locomotion-profiles.v1.js` blob `3db9fbd482e6a527c417e79af826138ff28efa33`.

### Current next gate

**KAYKIT-NATIVE-BLENDER-BASELINE-01**

Next executor:
**Coworker / Blender MCP**

Task:
show the real ActionFigure with original KayKit General / MovementBasic / MovementAdvanced locomotion clips at native rate on a neutral grid; measure and classify each as KEEP_NATIVE / HOLD_NATIVE / REJECT_NATIVE.

No Mixamo.
No browser controller.
No gait transitions yet.
No runtime jump trajectory.
No World / Travel integration.

### Georg

**Du musst jetzt nichts tun.**

Next human-facing result:
one Blender review package + native clip quality table.
