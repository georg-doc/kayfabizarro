# KFB Animation/Motion SSOT · Foundation · START HERE

Status: IMPLEMENTATION · MEASUREMENT RECONCILIATION OPEN
Date: 2026-10-03
Owner: KFB ToolBox / Animation-Motion authoring

## Goal
Close the missing central locomotion state layer inside the existing Animation/Motion owner.

No Travel/Combat patching in this slice.

## Read
1. `../../docs/MOTION_PROFILE_ROUTER.md`
2. `../../kfb-lib/MOTION_STATE_CONTRACT.v1.json`
3. `../../kfb-lib/motion-state-machine.v1.js`
4. `../../kaykit-motion-lab-v1/MEASURED_ACTOR_PROFILES.json`
5. `../../kaykit-motion-lab-v1/PROFILE_PROPOSALS.json`
6. `../../kaykit-motion-lab-v1/BLENDER_MEASUREMENT_BRIEF.md`

## Current result
- exact tested locomotion/anim-map donors promoted into the same candidate owner line;
- central pure state machine added;
- speed-band hysteresis derives from measured speed-window overlap rather than arbitrary thresholds;
- missing evidence stays pending;
- Blender intake defined for independent exact-source measurement.

## Next
Reconcile Blender measurements with existing Three.js/KCL measurements, then build the clean ActionFigure neutral-ground prototype on this state owner.

No consumer integration before Georg visual PASS.
