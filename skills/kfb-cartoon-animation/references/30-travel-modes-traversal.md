# Travel Modes and Traversal

Travel Mode is a movement/physics domain above gait.

Suggested conceptual domains:
- GROUND
- AIRBORNE
- CLIMB / HANG / LEDGE
- SWIM
- FLIGHT
- VEHICLE / MOUNT
- SPECIAL_TRAVERSAL

The authoritative movement owner decides physical mode. Animation consumes facts and presents them.

## Ground

Ground contains gait semantics such as walk, jog, run, sprint, backward, strafe, turn and jump transitions.

## Airborne

Typical presentation:
jump.start → rise → apex/fall → pre-land → land → recovery.

Distance-to-ground can inform landing preparation, but collision/trajectory remains authoritative elsewhere.

## Climb / hang / ledge

Contact targets dominate:
- hands;
- feet;
- ledges;
- rungs;
- body clearance.

Prefer authored contact poses combined with target alignment/warping.
Do not play a generic climb loop through arbitrary geometry.

The traversal system owns reachable surfaces and movement constraints.
Animation owns contact pose, phase and correction.

## Swim

Use a separate propulsion grammar.
Do not reuse ground run cycles with vertical offsets.

Movement system owns buoyancy/velocity.
Animation owns stroke, body pose, turns and transitions.

## Flight

Flight physics owns trajectory, velocity and collision.
Animation consumes:
- speed;
- acceleration;
- climb/dive;
- bank/turn;
- takeoff/landing;
- braking/hover states where applicable.

Animation may present:
- body/wing posture;
- bank anticipation;
- pitch;
- drag/overlap;
- takeoff/landing compression.

Do not allow animation root motion to become an untracked second flight controller.

## Vehicle / mount

Vehicle physics remains owner.
Rider/driver presentation may consume:
- steering;
- throttle/acceleration;
- braking;
- suspension/contact;
- seat;
- hands/feet;
- lean/bank.

Use stable seat/hand/foot anchors and bounded IK.
Do not duplicate vehicle steering in the rider animation graph.

## Special traversal

Vault, mantle, rope, zipline, rail, wall-run and interaction locomotion should define:
- physical owner;
- entry condition;
- target/contact anchors;
- authored alignment assumptions;
- warp allowance;
- interrupt/cancel rules;
- exit state.

## Transition policy

Travel-mode changes are semantic discontinuities.
Treat enter/exit transitions explicitly rather than blending unrelated loops through each other.
