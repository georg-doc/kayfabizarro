# Pilot 01 · Sedan → FR-S04-02 Receiver Handoff

**Status:** IMPLEMENTATION-READY ADAPTER SPEC · NO SEDAN CONSUMER RUN YET  
**Owner boundary:** this file describes the package handoff. Production Race / Free Roam remains the physics implementation owner.

## Current receiver

Current Free Roam donor: `fr-s04-02`.

- Race source: `a7a48a8c6e1589a18134aa619e2be22d79124c32`
- public KFB run: `35367513758`
- 62/62 public checks PASS
- current fixture: original `kart-oobi`
- Sedan package: **not mounted yet**

Therefore FR-S04-02 is validated receiver evidence, not inherited Sedan acceptance.

## Exact integration delta

The current receiver hardcodes a kart cuboid and four synthetic wheels. The Sedan package already supplies the geometry needed to replace those hardcodes:

```text
car_sedan.gltf
→ body mesh AABB
→ numeric Rapier cuboid proxy
→ four named wheel centres
→ source-derived wheel radius
→ existing FR-S04-02 vehicle controller
```

The first Sedan consumer probe does **not** need to wait for a binary collider GLB. FR-S04-02 already represents its chassis as `RAPIER.ColliderDesc.cuboid(...)`; it can consume `COLLIDER_PROXY_SPEC.json` numerically. The binary `car-sedan-chassis-proxy.glb` remains a separate Game Development Studio producer/capability gate.

## Visual binding

Do not retain the synthetic Cylinder wheel presentation when testing this package.

Use the four source nodes:

- `car_sedan_wheel_front_left`
- `car_sedan_wheel_front_right`
- `car_sedan_wheel_rear_left`
- `car_sedan_wheel_rear_right`

Front wheel presentation should use a steering parent pivot plus source-wheel spin; rear wheels spin only. Signed travelled distance / wheel radius drives spin, so reverse naturally reverses rotation.

## Physics boundary

Keep FR-S04-02's one Rapier body/controller owner and drive-intent behavior for the controlled comparison. Change only the vehicle geometry adapter first.

Do **not** silently copy the kart's mass/inertia, recovery box, suspension rest length or camera clearances as Sedan facts. The larger 4.1 m BOX1-baseline Sedan changes those geometric assumptions and they require explicit Race-owner test/tuning.

Exact machine-readable mapping: `FR_S04_02_RECEIVER_ADAPTER.json`.

## Acceptance

A Sedan PASS requires a rerun with Sedan identity loaded and the relevant receiver checks repeated. Existing 62/62 evidence remains donor evidence until then.
