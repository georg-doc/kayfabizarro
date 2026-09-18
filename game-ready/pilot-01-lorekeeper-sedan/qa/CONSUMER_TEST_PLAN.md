# Consumer Test Plan · Pilot 01

## Gate A · Resident

Named consumer: current Resident Atlas / Travel receiver.

1. Load exact pinned Lorekeeper GLB.
2. Load Tome/lectern at world/habitat level; never attach it to a hand.
3. Attach Staff to `handslot.r` with the recorded special calibration.
4. Play `Idle_A`.
5. Transition to `Walking_A`; consumer owns translation and heading.
6. Verify no rig collapse, prop detachment, floor penetration or second movement writer.
7. Record runtime bounds for actor collision, Tome interaction and look-at/interact anchors.

## Gate B · Vehicle

Named consumer: selected Slice-04-derived DRIVE receiver; BOX1 remains feel/presentation reference.

1. Load exact pinned `car_sedan.gltf`.
2. Bind four exact wheel nodes.
3. Generate/validate wheel-free chassis proxy from `COLLIDER_PROXY_SPEC.json`.
4. Forward drive → controlled brake → reverse.
5. Steering / three-point turn / parking.
6. Drift → re-grip.
7. Boost.
8. Hop/jump → landing.
9. Impact/bumper.
10. Confirm physical pose has one owner; deformer/VFX/SFX consume facts only.

## Gate C · Shared events

Verify each event is emitted from authoritative runtime facts and does not independently infer a competing physics state.

## Gate D · Human review

Georg checks:

- Lorekeeper Staff/Tome relationship;
- visible scale and movement;
- Sedan scale/forward/wheels;
- collision feel;
- CAR_CHILL_LIGHT presentation;
- VFX anchors;
- exact SFX source binding once available.

## Status vocabulary

`SOURCE REVIEW | CREATED FILES | PACKAGE QA | CONSUMER TEST | HUMAN ACCEPTANCE | OPEN`

Do not collapse these stages into one "game-ready" claim.
