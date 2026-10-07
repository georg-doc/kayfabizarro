# KFB Open World · Road / Track Core Ownership Canon · 2026-10-07

Status: **BINDING CORRECTION · APPLY TO CURRENT WORLD BUILDER INTEGRATOR**
Owner: **KFB Track Core + WorldBuilder**
Human authority: **Georg**

## Correction

The Open World must not own a second bespoke road-geometry system beside Track Core.

Coworker road/network work may be reused for **planning semantics only** where sound:
- seeded network topology;
- connectivity;
- route intent;
- road hierarchy;
- settlement alignment;
- river/bridge crossing intent;
- POI/access relationships.

It does **not** own the final road mesh/contact/profile/junction presentation.

## Canonical ownership

### World / procedural planner owns

- where a route should go;
- graph connectivity and semantic road class;
- terrain constraints and continuous Surface Truth;
- settlement/bridge/river relationship;
- procedural generation of RouteRecipe-level intent.

### Track Core owns the reusable road construction kit

Use the existing Track Core mechanism for both ordinary roads and race/stunt roads:

- graph/recipe compilation;
- canonical slot/profile system;
- RouteRecipe;
- CONNECT/socket semantics;
- curve/transition construction;
- minimum-radius constraints;
- junction/roundabout/intersection grammar;
- cross-section generation;
- road/track/bridge/tunnel/ramp/stunt pieces;
- drive/contact surface geometry;
- kerbs/sidewalk profile where configured;
- persistent module/segment identity.

The exact existing APIs must be inspected and reused rather than replaced. Current known donor capabilities include Track Core graph compilation/expansion and modular profiles/sections; do not invent a parallel spline/sweep owner.

### Joyride owns required visible road/track language

For presentation where applicable:
- rounded clay road/track body;
- Joyride J14/T4/K2 profile language;
- kerbs / red-white race kerbs for race profiles;
- road markings;
- clay barriers / band heads;
- accepted transition/presentation grammar.

Joyride presentation does not become terrain, palette, world-generation or route-planning owner.

### Continuous Terrain / Surface Truth owns

- macro ground mesh;
- authoritative support height;
- terrain collision outside the constructed drive surface;
- terrain contributions/cut/fill under routes;
- sculpt delta;
- road/terrain seam reconciliation.

Track Core road geometry must consume/contribute through declared Surface Truth APIs. No road module may become a second terrain-height owner.

## One road family, multiple recipes

Ordinary world roads and race/stunt sections are variants of the same modular construction family.

Examples:

```
RoadNetworkIntent
  -> RouteRecipe
      -> village road profile
      -> country road profile
      -> bridge profile
      -> race profile
      -> stunt/loop/tunnel profile
  -> Track Core compile/build
  -> Joyride/KFB presentation adapter
  -> Surface Truth contribution/contact reconciliation
```

Do not implement:

```
CoworkerBezierRoadMesh
+
TrackCoreRaceMesh
```

as two independent geometry/contact owners.

## Current Coworker defects — classification

The observed Bézier-sweep seam/tangent cracks and tight-bend inner folding are useful defect evidence, but repairing that bespoke sweep does not establish the desired final ownership.

Analytic Bézier tangents and inner-radius clamps may be retained only if they are reusable inside or upstream of the Track Core recipe/compiler path.

Do not spend product integration effort perfecting a parallel road renderer that will later be discarded.

## Integrator requirement

Before the current WSA Integrator commits to road geometry:

1. inspect exact current Track Core graph/RouteRecipe/profile/junction APIs;
2. source-isolate the actual Joyride road/track donor design;
3. map Coworker network output into Track Core recipe-level input;
4. prove ordinary road, junction, bridge approach and race profile from the same owner family;
5. prove Surface Truth/contact agreement;
6. persist RouteRecipe/segment identities through save/fresh reload.

## Acceptance

Required product proof must include:
- ordinary village/town road;
- curved road with no folding/cracks;
- real junction/intersection;
- bridge approach/crossing;
- at least one race-track section;
- shared construction owner verified;
- no duplicate bespoke road geometry owner;
- source-isolated Joyride presentation;
- terrain/contact continuity;
- save/fresh reload of authored route/module state.

This correction does not add a new MVP feature. It clarifies ownership of already-required Road + Joyride Track capabilities.
