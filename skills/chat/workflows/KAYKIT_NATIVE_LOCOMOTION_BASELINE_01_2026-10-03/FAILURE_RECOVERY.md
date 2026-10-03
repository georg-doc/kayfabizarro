# FAILURE RECOVERY · ACTIONFIGURE-MOTION-FREEPLAY-01

Status: **ARCHIVED_FAILED_CANDIDATE**
Human verdict: **TOTAL FAIL**
Date: 2026-10-03

## Goal that failed

A neutral ActionFigure browser freeplay was supposed to make the central locomotion candidate visibly reviewable with WASD / Shift / Space.

Automated browser operation passed.
Human motion quality did not.

## Human failure evidence

Georg reported:
- wrong step length;
- strong visible jitter/wobble;
- an arm pose with the arms effectively pressed into / inside the body;
- dirty transitions;
- bad jump behaviour;
- wrong stride relationship;
- animation timing that itself reads jerky;
- overall prototype quality unacceptable.

This is not a TUNE result.
It is a foundation-level HUMAN FAIL.

## Proven conceptual cause

The project already had a canonical source-priority rule in:
`locomotion-profiles.v1.js`.

That rule says:
- KayKit Character Animations 1.1 is the canonical native locomotion source;
- KFB Motion Library / Mixamo is the variant/action layer;
- foreign variants must not overwrite native roles.

The failed Ladder-02 freeplay violated that priority by promoting mixed Motion-Library / Mixamo-derived locomotion to the main forward gait family before the native KayKit baseline had been visually accepted.

## Proven implementation limitations

The failed browser candidate:
- stripped root/hips translation from presentation clips;
- moved the actor separately through a simple controller;
- depended on playback-rate matching;
- used a generic short crossfade for gait changes;
- used simple external jump trajectory logic;
- had no authored foot-lock/stride-warp correction;
- had no pose-correction layer for arm/torso collisions;
- did not prove transition quality in Blender before runtime integration.

The automation proved state changes and loading, not motion quality.

## Hypotheses that remain unproven

- mixed-source animation style contributed to body/arm pose mismatch;
- converting travelling clips to in-place at runtime contributed to stride mismatch;
- source timing + generic crossfade contributed to perceived stutter.

These are hypotheses until isolated authoring tests prove them.

## Salvage map

| Part | Status | Use |
| --- | --- | --- |
| ActionFigure source asset | REUSE_CANDIDATE | exact actor remains valid |
| KayKit canonical profile blob 3db9fbd... | REUSE_CANDIDATE | restore source priority |
| J14 native ActionFigure measurements | REUSE_CANDIDATE | comparison donor |
| KCL-M1 native measurements | REUSE_CANDIDATE | independent comparison donor |
| central semantic state ownership idea | NEEDS_ISOLATED_TEST | keep architecture, discard current mixed selection |
| Motion Library v7 / Ladder 02 | NEEDS_ISOLATED_TEST | gap-fill donor only |
| failed browser freeplay HTML | ARCHIVED_FAILED | evidence only |
| mixed five-rung Ladder-02 primary family | REJECTED_FOUNDATION | must not remain current ActionFigure baseline |

## Lesson

Do not solve a missing middle gait by replacing the whole native locomotion family first.

Early gate:
prove the original actor + original animation pack in isolation before any gap-fill or controller integration.

## Exactly one next gate

**KAYKIT-NATIVE-BLENDER-BASELINE-01**

No controller.
No Mixamo.
No world.
No transitions yet.

First prove the native clips themselves.
