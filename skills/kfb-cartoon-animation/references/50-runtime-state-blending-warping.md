# Runtime State, Blending and Warping

## Runtime model

Runtime animation should consume semantic motion facts, not raw device events.

Typical facts:
- actualSpeed
- localForwardSpeed
- localSideSpeed
- acceleration
- grounded
- verticalVelocity
- desiredFacing / turnRate
- sprintIntent
- jumpPhase
- travelMode
- foot/contact phase where measured

## State versus blend

Use continuous parameters when the underlying fact is continuous:
speed · direction · acceleration · aim offset · turn rate.

Use discrete states when meaning changes:
idle · start · stop · pivot · jump lifecycle · travel-mode transition · attack/reaction.

Do not build hundreds of states for every parameter combination.

## Crossfade

Crossfade works best between compatible poses/cycles.
Before blending:
- verify clips share intended skeleton/orientation;
- check pose compatibility;
- phase-align cyclic gait when evidence exists;
- bound the fade duration;
- confirm the planted foot does not visibly skate.

## Hysteresis

Adjacent gaits should not switch at a single noisy threshold.

Derive enter/exit behavior from measured/approved speed windows where possible.
If windows have a gap, expose the gap.

## Inertial / dead blending

When the runtime supports it, inertialization can preserve outgoing velocity/pose motion during short transitions without requiring every source clip to return to neutral.

Treat it as a transition presentation technique, not permission to ignore bad source poses.

## Additive / per-bone layers

Use orthogonal layers rather than combinatorial clips.

Typical layers:
1. base locomotion;
2. action/interaction;
3. look/aim;
4. emotion/posture;
5. cartoon additive lean/compression;
6. secondary dynamics;
7. contact correction;
8. face/eyes.

Each layer declares:
- affected bones/channels;
- additive or override;
- priority;
- interruptibility;
- whether root motion is allowed;
- recovery/clear behavior.

## Distance matching

Useful for actions where pose progress should correspond to remaining distance:
- stop;
- pivot;
- landing;
- interaction approach.

The movement owner provides distance/trajectory facts.
Animation chooses or advances presentation accordingly.

## Stride warping

Use to reconcile moderate mismatch between authored stride and actual movement speed.

Do not:
- stretch anatomy beyond style limits;
- use stride warping as proof a missing gait is solved;
- hide a large source-speed mismatch indefinitely.

## Orientation warping

Useful when lower-body travel direction differs moderately from authored facing.

Clamp the correction.
If anatomy/silhouette breaks, choose a different authored direction.

## Foot placement / IK

Use contact-aware IK after base motion is correct.

Input:
- authoritative ground;
- contact phase;
- desired foot target;
- rig limits.

Output:
- visual foot/leg/pelvis correction.

Do not change world/collision truth.

## Motion matching

Motion matching can replace large transition graphs when:
- source motion coverage is deep;
- metadata/features are reliable;
- runtime cost is acceptable;
- responsiveness and visible continuity improve.

Database size alone does not justify it.

Before adopting:
1. define trajectory/pose features;
2. benchmark against the simpler state/blend system;
3. compare foot slip and transition continuity;
4. verify debugging/reproducibility;
5. keep authoritative movement ownership explicit.

## Root motion

Root motion policy must be explicit.

Possible policies:
- in-place presentation;
- extracted root used as measurement;
- authoritative runtime root motion;
- shot/cinematic root motion.

Never mix policies silently between clips.

## Recovery

Every transient layer/state must define:
- completion;
- interruption;
- blend-out;
- cleanup;
- return target.
