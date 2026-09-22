# KFB World Architecture Red Team · 2026-09-22

Status: **PROPOSAL / RESEARCH · NOT IMPLEMENTATION CANON · NO OWNER REPLACEMENT**

Purpose: challenge the assumption that KFB must choose one world geometry such as Sphere, Hex or Voxel before World Authoring proceeds.

This note is additive to the current Claude World Authoring brief. It does not start a new runtime and does not replace Travel, Race, OSM, Hex, Dungeon or Scene Patch ownership.

## 1 · Product requirement recovered from Georg

The KFB world is primarily a **playable stage for characters, cards, races and mini-games**.

Desired qualities:

- stylised rather than photorealistic;
- cartoon / psychedelic;
- deterministic seeds, often card-driven;
- biome and palette variation;
- day/night, weather, atmosphere and strong lighting moods;
- TinySkies-style sky, clouds, aura effects and portals remain useful donors;
- OSM should provide useful real-world structure without forcing literal realism;
- Race tracks must remain possible;
- local Hex construction is attractive;
- local Voxel/destructible/cave logic is attractive;
- terrain may have animated colour fields / "dancefloor" effects;
- discrete terrain terraces such as six height levels are desirable;
- world topology should eventually allow more than a sphere: flat, torus, hollow/inward worlds, Möbius/special surfaces and explicit edge transitions.

The characters, game loops and cards carry most of the identity. The terrain system should enable them rather than become the product by itself.

## 2 · Internal KFB facts already strong enough to reuse

### 2.1 Travel / TinySkies already proves the Sphere-specific implementation

Current Travel implementation SSOT:

`georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`

Useful existing architecture:

- one terrain-height truth in `travel/globe-v13/terrain-surface.js`;
- mesh / gameplay / prop placement consume the same terrain displacement;
- `setTerrainZones(...)` already creates flattened/tilted build zones inside that same height truth;
- World Recipe work already exists;
- support-surface resolution already exists;
- runtime mode bridge already enforces one active movement/camera writer.

Conclusion:

**do not throw away the Travel sphere implementation. Treat it as the first proven Surface Adapter / terrain donor.**

The radial sphere math is implementation-specific. The ownership lessons are general.

### 2.2 Hex corpus already owns Hex topology

Do not create another Hex grid.

Current donor corpus already contains:

- measured KayKit Hex inventory;
- edge classification;
- rotation/topology knowledge;
- solver/audits;
- Babel;
- seedable recipes;
- planned persistent `kfb.hex-world/1`.

Visible Hex geometry and logical Hex topology are not the same concern.

### 2.3 OSM already gives useful semantic world structure

KFB already caches and consumes OSM roads, footprints, rivers and anchors.

OSM should remain:

**geographic / semantic truth**

not:

**the final visible mesh style**.

This distinction is important because the current hard-edged OSM extrusion/deformation can be replaced visually while preserving footprint, road and collision truth.

### 2.4 WhackMan already contains a strong Dungeon Environment profile

WhackMan should be treated as a **production-worthy environment/light donor candidate**, not merely a mini-game visual experiment.

Current measured/source-backed ingredients:

#### Dusk baseline

`wm-boot.js`

- ACES filmic tone mapping;
- dark blue-violet world background;
- `FogExp2` depth fog;
- weak cool Hemisphere light;
- cool shadow-casting Directional light;
- low secondary cool directional contribution.

The concept is deliberately:

**cool weak sky + warm local fire + fog**.

#### Torch system

`wm-gate-b.js`

- source positions come from the measured flame position of the real mounted torch;
- visible additive glow sprite at every torch;
- physical point-light falloff, decay 2;
- only up to six actual point lights are active and are reassigned to the nearest torches;
- per-torch phase variation;
- two non-harmonic sine components drive light flicker;
- glow sprite scale/opacity also flickers.

This is both visually useful and already designed around a game-performance budget.

#### Adjustable local visibility / "Fog of War"

`wm-gate-c.js`

- one local point light follows the player;
- a continuous 0..1 control changes local visibility without changing the global dusk/fog profile;
- default 0 keeps the normal Dungeon mood.

This is best understood as a **local visibility radius / local illumination profile**, not as tile-state strategy-game fog.

#### Matte material calibration

`wm-boot.js`

Current pass deliberately suppresses the unwanted plastic-varnish look:

- roughness raised toward matte;
- metalness removed;
- environment reflection strongly reduced;
- clearcoat removed;
- material maps that reintroduce the unwanted specular behaviour are disabled in this donor.

Do not blindly apply these exact numbers to every KFB scene. Extract the behaviour as a named Environment/Material profile and compare it against source materials.

### Recommendation

Create a reusable candidate such as:

`DUNGEON_DUSK_TORCH_PROFILE`

that Dungeon Generator / ToolBox / World Authoring can consume without copying WhackMan's game code.

Keep:

- environment lighting;
- torch-light pooling/flicker;
- local visibility control;
- material calibration

separate from:

- WhackMan movement;
- WhackMan combat/pickups;
- WhackMan MazeGraph.

## 3 · Red-Team conclusion: do not choose "the world geometry"

The fragile question is:

> Should KFB be a Sphere, Hex world, Voxel world, Minecraft world, flat world or torus?

The more robust question is:

> What logical world data can be embedded onto several surface geometries?

Recommendation:

**World Recipe / topology is primary. Surface geometry is an adapter.**

Do not fork the game into one implementation per world shape.

## 4 · Proposed Surface Adapter boundary

This is a proposal, not a frozen API.

A Surface Adapter maps logical world coordinates to a local 3D frame.

Conceptually:

```
poseAt(address, heightOffset)
→ {
    position,
    normal,
    tangentU,
    tangentV,
    handedness,
    surfaceId
  }

project(worldPoint)
→ logical address

advance(address, localDelta)
→ logical address + seam/wrap information
```

The important output is not just position.

Race, Residents, props and gravity need the **local frame**:

- up/normal;
- forward/tangent;
- side/tangent;
- handedness / seam state.

### Candidate surface adapters

First-class / realistic early candidates:

- `FLAT`
- `SPHERE` — existing Travel donor
- `TORUS`

Later/special:

- `CYLINDER_OUTER`
- `CYLINDER_INNER`
- `SPHERE_INNER` / hollow world
- explicit two-sided edge world
- `MOBIUS`
- other parametric/special surfaces

### Why Torus before Möbius

Torus is a strong stress test because it wraps in two directions but remains orientable.

Möbius is non-orientable: after one loop the local frame changes handedness. There is no globally consistent "up/left/right" orientation.

That makes Möbius a valuable special-world test, but a poor first production foundation.

## 5 · Recommended world representation: hybrid, not ideological

### Layer A · Macro continuous terrain

Use for:

- Race;
- OSM;
- smooth hills;
- broad cartoon landforms;
- roads;
- large biome transitions.

Rendering:

- chunked/LOD terrain where scale requires it;
- smooth or deliberately terraced heightfield;
- baked accepted geometry for production zones.

### Layer B · Semantic Hex lattice

Use for:

- authoring cells;
- biome/state addressing;
- roads/rivers where Hex gameplay is desired;
- Card-seeded gameplay zones;
- W6/directional logic;
- tactical/story map;
- local visible KayKit Hex construction.

The Hex grid does **not** have to be visible everywhere.

A cell can control a smooth terrain patch without exposing a hard hex silhouette.

### Layer C · Local volumetric / Voxel chunks

Use only where true 3D volume is valuable:

- caves;
- tunnels;
- mining;
- destructible terrain;
- undercuts/overhangs;
- special Minecraft-like worlds.

Do not voxelise the whole macro world merely to obtain caves.

This preserves the Voxel advantages without forcing Race and OSM through cubic/block geometry.

## 6 · Six terrain levels without six literal voxel cubes

The desired six-step landscape can be stored semantically:

`terraceLevel = 0..5`

The renderer may interpret that as:

- strict six terraces;
- terraces with rounded transitions;
- smooth terrain;
- animated morph between both.

This keeps the gameplay/world recipe deterministic while allowing the visual language to change.

Hex cells can own the terrace level without forcing each cell to be a hard-sided hexagonal column.

## 7 · Dancefloor / expanding-colour terrain should be its own Surface FX layer

Do not bake psychedelic gameplay effects into the terrain topology.

Proposed event data:

```
{
  center,
  startTime,
  radius,
  speed,
  color,
  falloff,
  mode,
  seed
}
```

Possible modes:

- expanding ring;
- expanding filled blob;
- ripple;
- pulse;
- contour bands;
- heat/cold field;
- biome takeover;
- temporary emissive field;
- small visual displacement.

On continuous terrain:

- shader samples logical/world coordinates and evaluates the event field.

On visible Hex terrain:

- per-instance attributes or cell-state texture drive the same event semantics.

This allows one KFB "Street-Fighter / Dancefloor" effect language to work on Flat, Sphere and Torus rather than rebuilding it for each geometry.

### Physics rule

If the animation is only presentation:

**do not move collision.**

If terrain height really changes gameplay:

update the one authoritative terrain/support-height source and rebuild/rebake the affected collision region.

## 8 · OSM translation: preserve meaning, replace presentation

Recommended pipeline:

`cached OSM → portable semantic world model → KFB presentation compiler → Surface Adapter`

OSM should contribute:

- roads;
- building footprints;
- rivers/water;
- land use;
- tags/roles;
- landmark anchors;
- optionally real elevation.

Then KFB decides how those semantics look.

### The current OSM hard-edge problem

Current cartoon deformation can still read as stacked/extruded cards because the presentation mesh begins from hard polygonal extrusion.

Do not solve this by deforming harder.

Test a separate presentation copy that can use:

- rounded/filleted footprint corners;
- low-resolution swept envelopes;
- broad roof masses;
- controlled subdivision/curvature;
- taper/bend/lean on the rounded envelope.

Keep:

- original OSM polygon for source truth;
- original/derived simple collision footprint;
- stable OSM id.

Presentation may be soft and cartoon-like while geography remains exact enough for gameplay.

## 9 · Existing external repos worth studying before writing more infrastructure

These are **research donors**, not automatically dependencies.

### ZyFou/ProceduralTerrains

Repository:

`https://github.com/ZyFou/ProceduralTerrains`

Why it matters:

- Three.js/WebGL terrain engine;
- Tile / Infinite World / Planet modes;
- engine separated from editor UI;
- deterministic serialisable noise;
- chunk/LOD architecture;
- paint layers;
- water / atmosphere / clouds;
- save/load and undo/redo;
- production exports;
- real-world terrain import.

KFB use:

**architecture study for renderer-neutral terrain recipes, authoring/runtime separation, chunking and baking.**

Do not adopt its React editor wholesale.

### gunyakov/three-hex-map

Repository:

`https://github.com/gunyakov/three-hex-map`

Why it matters:

- Three.js Hex terrain;
- instanced terrain layers;
- no mesh per tile;
- shader-driven blending;
- animated water;
- rivers/lakes derived from neighbouring cells;
- instanced vegetation;
- tile fog states;
- live shader tuning.

KFB use:

**study its rendering strategy for a KFB Hex renderer / Surface FX layer.**

Audit the exact license file before reusing code.

### Uber H3

Repository:

`https://github.com/uber/h3`

Why it matters:

- mature hierarchical geospatial Hex indexing;
- lat/lon → stable Hex addresses;
- neighbour/ring/polygon operations.

KFB use:

**possible semantic bridge from OSM/geography to Hex addresses.**

Do not use H3 as the visible renderer.

If adopted, use the original Uber Apache-2.0 line or an explicitly compatible binding; do not silently switch to differently licensed forks.

### OSM2World

Repository:

`https://github.com/tordanik/OSM2World`

Why it matters:

- mature OSM → 3D interpretation;
- broad OSM tag handling;
- glTF/3D export pipeline;
- active source base.

KFB use:

**study its tag/feature interpretation and preprocessing rather than reinventing every OSM rule.**

KFB can still compile the semantic result into its own cartoon presentation.

### willjoe/terranian

Repository:

`https://github.com/willjoe/terranian`

Why it matters:

- OSM + elevation → browser 3D world;
- buildings, roads, land use, forests and water;
- driving mode;
- especially useful separation:
  `geo/data/world` are renderer-independent and Three.js is isolated in the scene layer.

KFB use:

**architecture donor for an OSM WorldModel.**

The project is small/new, so it should not become KFB foundation without source audit.

### kenjinp/hello-terrain

Repository:

`https://github.com/kenjinp/hello-terrain`

Why it matters:

- large-world variable LOD;
- elevation editing;
- terrain holes;
- painting/overlays/wetness;
- modern compute/plugin architecture.

KFB use:

**research donor for continuous terrain and local holes.**

It is currently WebGPU / react-three-fiber oriented, so it is not the first integration target for the existing KFB WebGL2/Three.js runtime.

### Zylann/godot_voxel

Repository:

`https://github.com/Zylann/godot_voxel`

Why it matters:

- mature editable volumetric terrain;
- tunnels/overhangs;
- chunk paging;
- smooth Transvoxel and blocky modes;
- instancing.

KFB use:

**architecture study for local caves/destructible volume only.**

Do not port a Godot voxel engine into Three.js.

### mscroggs/mathsteroids + Three.js parametric geometry

Repositories/docs:

- `https://github.com/mscroggs/mathsteroids`
- Three.js `ParametricGeometry` / `ParametricFunctions`

Why they matter:

- real gameplay/topology examples across Flat, Sphere, Torus, Möbius, Klein bottle and others;
- Three.js already supplies parametric geometry functions including Möbius/Klein examples.

KFB use:

**prove that topology/world shape can be treated as a replaceable embedding rather than a new game per shape.**

Do not confuse "can render a Möbius mesh" with "movement/gravity/seams are solved".

## 10 · Baking / runtime budget

Authoring and shipped play do not need the same cost profile.

### Authoring

May keep:

- semantic cells;
- source ids;
- editable splines;
- procedural parameters;
- authoring patches;
- source profiles.

### Production runtime

Prefer:

- instanced repeated assets;
- chunked/LOD terrain;
- preprocessed OSM;
- baked accepted static geometry where appropriate;
- simplified collision/support meshes;
- shader-based low-cost Surface FX;
- recipes/semantic ids retained for gameplay.

Do not fetch/process a full live OSM city on every boot if a reviewed KFB world recipe can cache the result.

## 11 · Seeds and Cards

A Card/Zone seed can deterministically select several independent axes:

```
worldSeed
surfaceProfile
biomeProfile
paletteProfile
weatherProfile
environmentLightProfile
surfaceFxProfile
topologyVariant
```

Keep these independent.

A colour-card seed should not silently force a different physics topology.

## 12 · Proposed architecture spike before large World implementation

Do **not** replace the current World Authoring Gates A–C.

Add one small Red-Team gate before expanding into a full 12–24-tile world:

### Surface Adapter micro-proof

Use the same tiny authored data on:

1. FLAT
2. SPHERE
3. TORUS

Same logical content:

- seven real Hex cells;
- one short OSM-derived/local-metre road spline;
- one real prop;
- one expanding Surface FX pulse;
- one Environment profile.

Acceptance:

- same recipe data;
- same source identities;
- no duplicated movement/world owner;
- correct local up/tangent frame on all three surfaces;
- Hex/road/prop stay seated on the surface;
- FX reads similarly on all three;
- switching surface changes embedding, not gameplay recipe.

This is an architecture proof, not the new final KFB world.

### Defer

- Möbius;
- hollow-world driving;
- full OSM city;
- infinite chunks;
- caves;
- destructible volume.

Only start those after the Surface Adapter boundary survives Flat/Sphere/Torus.

## 13 · Recommendation

The strongest path is currently:

**portable semantic World Recipe**
+
**replaceable Surface Adapter**
+
**continuous macro terrain**
+
**semantic/local visible Hex**
+
**local volumetric chunks where needed**
+
**shared Environment Profiles**
+
**shared Surface FX**
+
**baked/instanced runtime output**

This preserves the best parts of:

- Travel/TinySkies;
- OSM;
- Racer;
- Hex/Babel;
- WhackMan Dungeon lighting;
- Voxel/cave ideas

without making any one of them the mandatory geometry of every KFB world.

## Status

This is a Red-Team proposal.

It does not supersede the current Claude World Authoring brief until Georg explicitly accepts the architecture direction.
