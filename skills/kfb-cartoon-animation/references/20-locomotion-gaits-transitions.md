# Locomotion, Gaits and Transitions

## Locomotion facts

Every locomotion decision should consider:
- actual speed;
- desired speed;
- local forward/side velocity;
- acceleration/deceleration;
- desired facing;
- turn rate;
- grounded state;
- vertical velocity;
- slope/contact;
- sprint intent;
- current/previous semantic state;
- foot/contact phase where known.

## Continuous speed, discrete meaning

Speed is continuous.
Gait and transition meaning are semantic.

Do not bind raw speed directly to arbitrary clip names.

Ground gait vocabulary may include:
idle · start · walk · walk.fast · jog · run.easy · run · sprint · stop · backward · strafe · turn · jump.start · jump.air · jump.land.

Project SSOT decides the exact available states.

## Walk

Typical read:
- clear weight transfer;
- planted support;
- moderate COM motion;
- pelvis/chest counter-rotation;
- controlled arm counter-swing;
- deliberate contact/roll.

## Jog

Treat jog as a useful low-intensity running presentation family, not a universal biomechanical threshold.

A dedicated jog may read better than a 50/50 walk/run blend because the cycle's support, flight, arm drive and rebound can differ qualitatively.

## Run / run.easy

Typical read:
- clear rebound;
- quicker leg recovery;
- stronger stance compression;
- more active counter-rotation;
- flight becomes a natural part of the read;
- forward propulsion is distinct from a fast walk.

Use an authored intermediate such as run.easy when it preserves silhouette/cadence better than heavy time-warping.

## Sprint

Typical read:
- decisive propulsion;
- stronger acceleration lean during launch;
- forceful arm drive;
- aggressive hip/knee recovery;
- short contact;
- larger compression/stretch contrast.

Do not hard-code universal torso angles, cadence or m/s values.

## Starts, stops and pivots

These are first-class animation problems.

Useful coverage:
- start;
- stop;
- emergency/strong stop where needed;
- 90/135/180 pivots;
- turn-in-place;
- left/right foot variants only when source coverage and product need justify them.

A loop crossfade is not a complete start/stop system.

## Hysteresis

Use separate up/down handoff behavior derived from measured/approved clip speed windows when possible.
Do not chatter between gaits around one threshold.

If measured windows do not overlap, flag the gap. Do not invent a safe blend band.

## Phase/contact synchronization

For cyclic gait transitions:
- align comparable contact phases when evidence exists;
- preserve planted-foot ownership;
- do not blend through a plant as if both feet were weightless;
- record phase offsets where source measurement supports them.

## Playback rate

Playback rate may reconcile moderate speed differences within an approved range.

Preferred repair order:
1. bounded play-rate adjustment;
2. phase-aware blend;
3. stride/orientation/contact correction;
4. another authored gait/transition.

Do not time-warp one walk clip until it becomes a sprint.

## Directional locomotion

Separate:
- travel direction;
- facing/aim direction.

They diverge for strafe, lock-on, backing away, conversational walk and camera-relative control.

Do not rotate a forward run sideways and call it a finished strafe.

Author strong cardinal/critical directions; use bounded orientation warping for interstitial coverage when anatomy and silhouette remain valid.

## Foot truth

Foot correction stack:
1. authored contact phase;
2. authoritative ground/collider;
3. foot-lock decision;
4. ankle/ball/toe pivot;
5. leg IK;
6. pelvis compensation;
7. slope/orientation correction;
8. plant/release smoothing.

IK repairs environment mismatch. It does not rescue a bad cycle.

## Jump

Treat jump as a lifecycle:
launch preparation → jump.start → rise/air → fall/pre-land → jump.land → recovery.

The movement/physics owner controls trajectory.
Animation presents pose, compression, stretch, contact and recovery.
