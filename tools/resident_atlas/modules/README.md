# KFB Resident Scene Modules

Status: **candidate-only consumer seam**.

These modules make a Resident Atlas vignette mountable inside another Three.js consumer without transferring ownership of movement, collision, camera, progression or persistence.

## v1 lifecycle

`mountResidentSceneModule(def, { parent, anchor, onProgress })` returns:

- `root` — one presentation root to attach to the consumer scene;
- `update(dt)` — resident animation/activity tick;
- `dispose()` — stop local presentation and detach the root;
- `support` — requirements/recommendations for the consumer, not a collision implementation;
- `activity` — optional resident activity diagnostics.

The adapter reuses `tools/resident_atlas_s6/`; it does not copy its rigging or attachment code.

## Platformer seam

The current Free Roam Platformer candidate already separates **SOLID** collision from **VISUAL** platform tiles and measures its cell at runtime. A resident module therefore does not create its own collision island.

A future consumer integration can add a field such as:

```json
{
  "id": "clown-island",
  "theme": "grass",
  "w": 4,
  "d": 4,
  "residentModule": "clown-juggling-island"
}
```

The Platformer owner creates the normal platform/solid. After its top-center anchor exists, it mounts the resident module there and calls `update(dt)`.

## First proof

`clown-juggling-island.module.json`

- exact S6 Clown vignette;
- three authored colored KayKit juggling pins;
- deterministic 3-club cascade;
- arm/hand follow-through driven from measured hand anchors;
- no 4–6 club promotion yet;
- consumer-owned 4×4 grass support recommendation.

No Platformer runtime file is modified by this slice.


## Prepared 2.5D cutout resident lane

Candidate only:

`candidates/eumel-doccheck-project-island.module.json`

This extends the **presentation class**, not the Resident runtime.

The candidate references the 2D Animation Studio actor binding and keeps:

- world transform;
- support/collision;
- camera;
- gameplay;
- persistence

with the receiving consumer.

It is intentionally **not** added to `index.json` until the world-space `three2p5d` adapter has a browser PASS and one Resident mount is tested.

The current Clown module and its visual gate remain unchanged.
