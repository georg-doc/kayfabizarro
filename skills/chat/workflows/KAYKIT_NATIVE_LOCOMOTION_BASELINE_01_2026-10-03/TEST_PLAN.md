# TEST PLAN · KAYKIT-NATIVE-BLENDER-BASELINE-01

This gate is intentionally source-first.

## Gate A · source identity
PASS only when the exact ActionFigure source object/armature is shown in isolation.

## Gate B · native clip inventory
PASS only when exact clip names present in the three primary KayKit Rig_Medium GLBs are listed.

Known expected candidates are hints, not permission to invent missing clips.

## Gate C · native-rate pose quality
Every candidate is reviewed at playback 1.0.

Record:
- torso/arm/hand intersections;
- silhouette;
- weight and balance;
- foot contact;
- loop seam;
- visible frame/timing stutter.

## Gate D · measured gait facts
For each cyclic locomotion clip:
- contact intervals;
- step/stride length;
- cadence;
- planted-foot drift;
- inferred no-skate travel speed.

J14 and KCL values are comparison donors.
Do not average conflicts into one value.

## Gate E · jump source sequence
Review Jump_Start / Jump_Idle / Jump_Land as animation source only.

No gameplay trajectory.

## Acceptance

The deliverable is a table of KEEP_NATIVE / HOLD_NATIVE / REJECT_NATIVE.

The gate does not require a full gait ladder.

A missing Jog is acceptable and should be returned as a source gap.

## What is not a PASS

- all files loaded;
- 23/23 bones bind;
- a script reports small slip;
- a browser controller runs;
- Mixamo fills a missing role.

The gate is about actual source animation quality on the actual actor.
