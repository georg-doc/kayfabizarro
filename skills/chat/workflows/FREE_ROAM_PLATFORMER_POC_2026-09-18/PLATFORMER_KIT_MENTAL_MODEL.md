# Platformer Game Kit · Mental Model / Asset Truth

**Date:** 2026-09-18  
**Status:** REQUIRED PRECONDITION FOR FREE ROAM PLATFORMER REBUILD  
**Source pack:** `media/3D_Assets/Platformer Game Kit - Dec 2021/`

## 0 · Why this document exists

The first Claude Design Project-Island composition loaded real assets but did not demonstrate that the modular kit had been understood. Visible symptoms included small disconnected islands, open/exposed module faces, unsupported/floating-looking assemblies and a scene language that diverged from the two source previews.

The repair rule is the same one that worked for the KFB Hex and Dungeon labs:

> **Inventory first → measured mental model → reference reconstruction → generator/composition logic → gameplay.**

Do not infer the kit from filenames alone.

## 1 · Governing references

Use these existing KFB examples as process references:

- `tools/world_atlas/source/KayKit_Hex_Tile_Model_S12.html`
- `tools/world_atlas/source/KayKit_Dungeon_Model_S13.html`
- `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
- `tools/world_atlas/source/tools/measure-hex.html`
- `tools/world_atlas/source/tools/probe-dungeon-parts.html`

Key lesson from S12/S13:

- measure, do not guess;
- distinguish semantic roles before generation;
- derive adjacency from real geometry;
- test finished geometry independently from the solver/model;
- preserve known failures in the explanation so the same wrong assumption is not repeated.

## 2 · Canonical visual references

The source pack contains exactly two reference images:

- `Preview.jpg`
- `Preview2.jpg`

These are the first visual truth for **how the pack is intended to be assembled**.

They are not source scene files, so exact world transforms/camera cannot be claimed unless recovered elsewhere. Therefore call the result:

`REFERENCE-GUIDED RECONSTRUCTION`

not exact historical scene recovery.

Required reconstruction goal:

- same modular construction language;
- same kind of closed/supporting island masses;
- same use of side/corner/center pieces;
- similar platform thickness and readable ground plane;
- same broad prop/nature/mechanics relationships;
- no unexplained hovering or exposed internal seams;
- calibrated camera close enough for side-by-side visual comparison.

## 3 · Asset Atlas S0

Before changing the Project Island scene, build:

`Platformer_Kit_Atlas_S0.html`

It must enumerate **every source GLTF** and group by source family:

- Character;
- Cubes;
- Enemies;
- Level and Mechanics;
- Modular Platforms / 2D;
- Modular Platforms / 3D;
- Modular Platforms / Single Cube;
- Modular Platforms / Single Height;
- Nature;
- Powerups and Pickups.

For each asset show:

- exact GitHub path;
- rendered thumbnail / orbitable preview;
- local axes;
- source origin/pivot;
- AABB min / max / size;
- geometric bottom Y;
- geometric top Y;
- visual center;
- mesh/node names;
- material/texture dependencies;
- whether skinned/animated;
- semantic family;
- proposed role only after measurement.

For walkable/platform pieces additionally determine:

- candidate walkable top plane;
- footprint;
- module width/depth;
- module height;
- exposed-edge classes;
- internal join edges;
- whether underside/side is visually closed;
- allowed 90° rotations;
- compatible neighbours.

Do not automatically treat `minY` as the actor ground plane or `maxY` as a walkable surface. Probe actual upper-facing triangles / rendered geometry where needed.

## 4 · Platform module grammar

Derive a small explicit grammar from the actual measured parts.

Likely semantic families to verify, not assume:

```text
CENTER
SIDE
CORNER
BOTTOM
SIDE_BOTTOM
SIDE_CENTER
CORNER_BOTTOM
CORNER_CENTER
SINGLE
2D_CENTER
2D_END
NATURE_ROCK_PLATFORM
```

The mental model must answer:

- Which modules may have an outer edge exposed?
- Which require another module beside them?
- Which pieces cap bottom/side faces?
- What is the horizontal grid step?
- What is one vertical module step?
- How are corners closed?
- How are multi-cell platforms built without holes?
- How are tall islands stacked?
- Can 2D pieces be mixed safely with 3D pieces?
- Which Nature rock platforms are standalone rather than grid fillers?

This should become data, e.g.:

`data/platformer-module-grammar.json`

No generator before this table exists.

## 5 · Ground / support truth

Use one transform convention:

```text
AssemblyRoot
  → platform modules
  → decorative props
  → gameplay anchors
```

Each assembly exposes:

- `walkableSurfaceY`;
- walkable polygon/bounds;
- landing bounds;
- obstacle bounds;
- visual bounds;
- support/bottom bounds;
- spawn/anchor points.

Rules:

- adjacent modules share the same support plane within epsilon;
- decorations never define ground unless explicitly promoted;
- tree/rock origins never determine platform ground;
- actor feet use an ActorAdapter foot offset, not the model origin;
- collision and visible platform transforms must be the same frame;
- rescue/checkpoint anchors are above verified walkable support.

No invisible emergency slab may mask a broken visual assembly in the reference reconstruction.

## 6 · Reference Reconstruction S1

Build:

`Platformer_Preview_Reconstruction_S1.html`

Required UI:

- reference selector: Preview 1 / Preview 2;
- reference image panel;
- live 3D reconstruction;
- camera presets;
- optional transparent reference overlay;
- asset list used in reconstruction;
- support/ground overlay;
- bounding-box / seam diagnostics toggle.

First rebuild **one** preview convincingly. Then the second.

Do not enlarge islands yet.

Acceptance:
- module contacts are intentional;
- no center/internal piece is left as an exposed outer wall unless the reference shows it;
- vegetation/props sit on measured support;
- camera comparison is understandable;
- all used asset refs resolve;
- reconstruction recipe can export/import.

## 7 · Derived Project-Island grammar S2

Only after S1, derive larger playable islands.

Do not simply scale the small preview assemblies.

Instead use the proven module grammar to build wider platforms with the same construction language.

Island recipe:

```text
IslandNode
  moduleCells[]
  walkableBounds
  landingBounds
  decorations[]
  residentAnchors[]
  pickupAnchors[]
  portalAnchor?
  outgoingJumpEdges[]
```

Each jump edge stores:

- source landing/takeoff region;
- target platform;
- distance;
- height delta;
- preferred approach;
- assist eligibility;
- manual-game eligibility.

This platform graph is gameplay metadata over the same visible assemblies.

## 8 · Actor ground calibration

Every playable actor gets a measured adapter:

```text
actorId
sourceRef
visualForward
scale
footOffset
capsule/footprint
supported semantic states
actual clip map
rootMotionPolicy
```

Do not place different actors at the same model-origin Y and call it grounded.

At minimum calibrate:

- default Platformer Character;
- one ordinary KayKit / Resident biped;
- FrizzleBob / Graft;
- CapsuleCarl.

Carl uses procedural presentation and its own support offset.

## 9 · Animation truth

Reference Platformer Character embedded clips are authoritative for that actor:

```text
Idle
Walk
Run
Duck
Jump
Jump_Idle
Jump_Land
HitReact
Punch
Wave
Yes
No
...```

Do not create new clip names.

For KayKit/KFB actors:
- resolve actual source library;
- test binding;
- map semantic state → actual clip;
- preserve one mixer owner;
- report missing states honestly.

A clip dropdown remains diagnostic only.

## 10 · Easy / Fluid / Fun movement model

This mode is meant for quick, expressive traversal rather than dexterity punishment.

Recommended control preset for this mode:

```text
WASD        camera-relative planar movement
Shift       faster run
Ctrl/C      Duck / Dip where supported
Space       jump
Space in air once  optional double-jump
LMB drag    orbit
wheel       zoom
F           recenter
R           rescue to last safe support
```

Keep the older KFB/Travel-style preset as an explicit alternative, not silently deleted.

### Movement clamps

Use tunable, visible parameters:

- acceleration/deceleration;
- max walk/run speed;
- turn rate;
- air-control gain;
- maximum assisted yaw correction;
- jump impulse;
- double-jump impulse;
- max fall speed;
- coyote time;
- jump buffer;
- landing recovery time.

No teleport disguised as movement.

## 11 · Heuristic assisted jump

In Easy / Fluid / Fun mode:

1. collect reachable outgoing jump edges;
2. score by facing, distance, height delta and current velocity;
3. highlight best candidate;
4. on jump, compute a real arc using the shared movement solver;
5. allow bounded steering/heading correction;
6. synchronize animation to physical takeoff/air/contact;
7. only apply a small landing magnet when already close to a valid landing volume;
8. if missed, rescue after fall.

The assist may make a plausible target easy; it may not snap across the world.

### Double jump

Optional first POC:
- one extra impulse in air;
- use a real supported jump presentation or reuse the same verified Jump presentation;
- do not invent a source clip;
- allow bounded retargeting, not full teleport correction.

## 12 · KFB Game Mode

Same island graph and movement owner.

Game mode reduces/removes assist:
- smaller or no landing magnet;
- reduced air steering;
- target highlight optional;
- hazards/pickups/checkpoints matter;
- fall respawns.

Do not build a second physics engine.

## 13 · Independent tests

Like S13, do not test the model only against itself.

Use separate probes:

### Geometry probe
Check module seams / exposed edges / support continuity.

### Contact probe
Ray or shape cast downward at representative landing points and platform joins.

### Visual probe
Reference image vs reconstruction, preferably screenshot evidence.

### Gameplay probe
Repeated real jumps across graph edges with landing/contact facts.

A generator reporting “all nodes placed” is not proof that the scene is visually or physically correct.
