# REACTIVE-CLAY-WORLD-R0 · the world reacts

Status: HOLD UNTIL WORLD-FLIGHT-CLAY-C0 PASS  
Executor: Work · Sol High  
Visual motion targets: Claude Design only after source isolation  
Geometry donor: Blender MCP only where true geometry is required

## Goal

Prove that the Clay world behaves like a responsive toy without turning the browser game into a full soft-body simulation.

## Three bounded proofs

### A · Road / terrain dent

One vehicle contact creates a small temporary dent, rut or wheel mark.

- local only;
- bounded radius and lifetime;
- smoothly restores;
- does not alter navigation ownership or permanent world data;
- uses the current terrain/surface adapter.

### B · Prop or building bounce

One selected prop and one building presentation root react to impact:

- squash, tilt or hop;
- clear cartoon anticipation/overshoot;
- return exactly to the authored transform;
- collision remains owned by the existing physics/game host;
- no cumulative drift.

### C · Living idle

One building family receives a very subtle, phase-offset idle pulse:

- low amplitude;
- deterministic seed;
- pauses/reduces outside the camera or beyond the chosen distance;
- never deforms doors, walkable surfaces or collision meshes into unusability.

## Shared response profile

Use one small data contract rather than bespoke scripts per asset:

```json
{
  "response": "clay-bounce-v1",
  "squash": 0.05,
  "lift": 0.12,
  "tilt": 0.04,
  "attackMs": 90,
  "settleMs": 520,
  "idleAmplitude": 0.008,
  "seed": "zone-or-card-seed"
}
```

Values above are vocabulary examples, not accepted tuning.

## Performance rule

Prefer shader/presentation transforms, instancing-friendly per-instance values and event-driven updates. Do not add high-resolution dynamic geometry or a physics body to every building.

## Acceptance

- three proofs visible in one small test zone;
- original transforms recover exactly;
- no collision/navigation regression;
- no unbounded per-frame allocation;
- desktop and narrow viewport remain usable;
- one toggle can disable reactive presentation for A/B comparison.

## Not in R0

Permanent terrain editing, destruction, network sync, every prop, Residents building structures, full vehicle damage, or global soft-body physics.
