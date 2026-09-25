# Track Core · Perplexity race-track research assessment · 2026-09-26

**Status:** SOURCE REVIEW / ARCHITECTURE DECISION SUPPORT  
**Input:** `tools/KFB-ToolBox/_inbox/KFB Race Track Baukasten TBD perplexity 01.md` @ `kayfabizarro/main`  
**Applies to:** `KFB_TRACK_CORE_SLICE_2026-09-26` · amends execution details, does not replace Cologne Route 01  
**Primary owner:** `georg-doc/KFB-Stunt-Car-Race`

## Executive result

The Perplexity note contains several **strong ideas for the exact flexible connector problem**, but its example Blender script is **not a production donor**.

The useful part is conceptual:

1. graph / route semantics;
2. connector frames;
3. curvature-continuous transitions, especially Clothoid / Euler-spiral ramps;
4. procedural width / height / barrier transitions;
5. geometry separate from style / prop / FX layers;
6. transition zones spanning metres rather than one hard seam.

The current KFB Track-Core decision is already a stronger implementation model:

> **one base track core + one centre-line frame type + one canonical slot profile + parameter curves over arc length `s` + separate markings + pieces as data.**

Therefore the research should be **absorbed into the Track Core**, not used to start another Blender track generator.

---

# 1 · What to adopt directly

## A · Clothoid / Euler curvature easing — ADOPT

This is the most useful new mechanism for M1 / M2.

Use a curvature ramp instead of:

`straight → instant constant-radius arc`.

Desired horizontal transition:

`κ = 0 → κ_target → κ = 0`

over explicit easing lengths.

Useful for:

- straight → curve;
- curve → straight;
- S-offset;
- chicane;
- hairpin approach/exit;
- OSM road simplification where the source line contains abrupt polyline headings.

Why it fits KFB:

- solves the visible/physical kink without requiring a prefab connector mesh;
- compatible with the Track-Core frame stream;
- can be represented as a centre-line generator + parameter curves;
- works for authored, seeded and OSM-derived routes.

**Important:** do not over-generalize. A planar clothoid is a horizontal-route solver, not the full solution for loops or arbitrary 3D stunts. Loops/ramps remain 3D centre-line generators feeding the same frame type.

## B · Standard connector state — ADOPT, but as frame state

Perplexity proposes start/end connector points with position, tangent, width, height and style.

KFB should use a richer state:

- position `P`;
- tangent `T`;
- up `U`;
- right/normal `R`;
- arc length `s`;
- curvature `κ`;
- grade / vertical slope;
- bank;
- profile parameter vector;
- marking style/state;
- semantic sockets.

This state is **not a separate mesh face**. It is the boundary condition for the next piece.

## C · Transition zones instead of one seam — ADOPT

RKIT-11 already provides a strong donor:

`transition_lib.py`

with staggered zones:

- width: 0.00–0.85;
- barriers: 0.00–0.75;
- lines: 0.30–0.80;
- mag stripes: 0.55–1.00;
- slab visibility: 0.85–1.00.

The implementation is rejected because it monkey-patches geometry and cuts host markings.

The **timing idea is good**.

Track Core should turn those timings into parameter curves:

`value(s) = smoothstep(zoneStart, zoneEnd, s)`

with no piece-specific geometry code.

## D · Graph semantics — ADOPT at RouteRecipe level

The route may be understood as a graph:

- main route;
- split;
- branch;
- merge;
- stunt socket;
- safe bypass.

But do not create a second graph runtime.

The existing RouteRecipe remains truth; graph/topology is one view of that recipe.

## E · Style / prop / FX layers separate from geometry — ADOPT

The Perplexity separation into:

- base geometry;
- material/style;
- props;
- FX;

matches KFB's direction.

KFB refinement:

- `Route / Frame`
- `SurfaceProfile`
- `EdgeProfile`
- `StructureProfile`
- `MarkingStyle`
- `EnvironmentStyle / Zone`
- `Stunt / Gameplay socket`

Geometry continuity must work even if all style/prop/FX layers are disabled.

---

# 2 · What to adapt rather than copy

## A · “Universal connector faces” → canonical slot topology

Perplexity suggests exact snap vertices / connector surfaces.

That is too rigid for:

- 6 m loop lane;
- 9.85 m bridge carriageway;
- 10.8 / 14.4 / 18 / 21.6 RKIT width ladder;
- sidewalks;
- walkways;
- barriers that grow/disappear.

Use the Track-Core decision instead:

**constant named slot set, variable values.**

Example slots:

- road L/R;
- shoulder L/R;
- barrier inner/cap/outer L/R;
- underside;
- curb/walkway optional slots.

Visibility / width / height are parameter curves.

A connection matches **slot semantics**, not raw endpoint vertices.

## B · Geometry Nodes — use as authoring/proof tool, not SSOT

Blender Geometry Nodes are useful for:

- visualizing the canonical slot profile;
- testing `s`-driven parameter curves;
- previewing Clothoid centre lines;
- art-directing style/prop scattering along a route;
- generating evidence renders.

Do not make Geometry Nodes the only authoritative track implementation.

Game + editor are web consumers. A GN-only core would force a second implementation.

Recommended architecture:

- one runtime/core implementation after the language decision;
- Blender MCP / Geometry Nodes = preview / test oracle / landmark atelier;
- export GLB or comparison fixtures from the same RouteRecipe.

## C · “Style ID on connector” → zone/profile state

Style should not decide whether two pieces are geometrically compatible.

Connectors match geometry/state.

Style is a separately blendable section/zone:

- Urban;
- Street;
- Race;
- Route 66;
- Cosmic;
- Surreal.

This permits the same route anatomy to be re-skinned without changing topology.

## D · Decals / markings — use separate marking ribbons

The research correctly wants markings to cross seams.

Do not solve this with many coplanar strip meshes or arbitrary z-offset decals.

KFB already has evidence of depth-fighting/flicker risk.

Use the Track-Core marking layer:

- STREET;
- TRACK;
- MAG;
- later custom styles.

Marking offsets/width/visibility are curves over `s`.

---

# 3 · What not to adopt from the example Python script

The example script is useful only as a sketch.

Do **not** execute it as a replacement architecture.

## A · It is not actually a Clothoid implementation

The code labels `create_curve_segment()` as “Clothoid-Annäherung” but computes a simple circular arc.

It does not implement the advertised curvature-continuous Euler spiral.

## B · It does not correctly propagate segment frames

The example repeatedly advances `current_pos.y` with simplified assumptions.

Its own comment says:

`Hier müsste die exakte Endposition berechnet werden`.

That is exactly the hard problem our frame/core must solve.

## C · It creates separate road / line / barrier meshes

That recreates the RKIT-11 failure mode:

- host geometry;
- stunt geometry;
- separate marking geometry;
- adapter hacks when they overlap.

Track Core must own the complete slot stream once.

## D · Barriers are baked into ordinary roads

KFB needs independent edge treatment:

- NONE;
- CURB;
- LOW/HIGH_BARRIER;
- FENCE_SOCKET;
- wall / water / terrain edge later.

## E · New generic materials conflict with KFB source ownership

The example creates new Urban / Highway / Cosmic colours.

KFB already has palette/material owners.

No new parallel palette system.

## F · Destructive scene clearing is unacceptable

`clear_scene()` deletes everything.

Production Blender work must preserve source objects, collections and evidence.

## G · “Alpha fade road into water” is presentation, not geometry/contact

Never make driveable geometry disappear into water merely through alpha.

Surface/contact state must remain explicit.

Visual water transition belongs to environment/material/FX layers.

---

# 4 · Stronger KFB model for flexible connector pieces

A “Versatzstück” should be:

```text
Piece =
  centre-line generator
  + start/end frame constraints
  + parameter curves over s
  + semantic sockets
  + constraints/checks
```

It is **not** primarily a mesh asset.

Examples:

### CURVE_EASE

- target curvature/radius;
- Euler/clothoid ease length;
- turn angle;
- bank curve;
- width/profile curves.

### OFFSET_S

- signed lateral offset;
- total length;
- max curvature;
- mirrored pair of curvature ramps.

### CHICANE

- left/right or right/left;
- offsets / apex spacing;
- target curvature;
- optional width/runoff expansion.

### HAIRPIN_180

- approach Euler ramp;
- constant/high-curvature core if needed;
- exit Euler ramp;
- optional outer-width expansion / bowl;
- bank curve.

### STREET_TO_TRACK

No new centre-line is required unless the route itself changes.

Only parameter curves change:

- road width;
- shoulder;
- curb/walkway visibility;
- barrier height/visibility;
- markings;
- surface lift/material role.

### LOOP

A 3D centre-line generator with:

- start/end frame equality contract;
- curvature/load envelope;
- profile curves;
- barrier/slim curves;
- assist metadata.

Same core surface generator consumes it.

---

# 5 · Recommended continuity targets

For ordinary roads / track pieces:

- position: continuous;
- tangent: continuous (G1 minimum);
- curvature: continuous where practical (G2 target for M1/M2);
- grade: continuous;
- bank: continuous;
- profile slot values: continuous;
- marking curves: continuous or intentionally faded.

For a stylized hard event, KFB may intentionally violate visual smoothness, but the discontinuity must be authored/semantic rather than an accidental connector seam.

---

# 6 · Agent routing

| Gate | Executor | Owns | Must not own |
|---|---|---|---|
| TRACK-CORE-0 | **ChatGPT Web + GitHub** | full census, core contract, schemas, language decision memo | Blender art / visual redesign |
| TRACK-CORE-1A | **Claude Coworker + Blender MCP** | Clothoid/slot/parameter-curve geometry proof, RKIT-11 acceptance fixture, visual/source evidence | Race physics, second compiler |
| TRACK-CORE-1B | **ChatGPT Web + GitHub** | authoritative core implementation after language decision, tests, runtime/editor parity | visual style invention |
| TRACK-CORE-2 | **Claude Design** | transition look grammar: markings, edges, material/prop/environment blends using pinned core output | core geometry / movement / physics |
| PLAYABLE-TRACK-R0 | **Claude Design** after Web input pack | track composition / readability | missing module fabrication |
| Runtime freeplay / OSM mapping | **ChatGPT Web + Race owner** | integration, browser tests, OSM RouteRecipe mapping | new city/controller owner |

---

# 7 · Language recommendation

Current decision is still formally open.

**Recommendation: authoritative Track Core in JavaScript.**

Reason:

- game runtime = web;
- future simple editor = web;
- RouteRecipe = JSON/data;
- one JS core can produce frames/geometry/collider data for both;
- Blender can import the core output / GLB or use Python as a numerical visual oracle;
- avoids permanent JS/Python divergence.

Python / Blender remains valuable for:

- independent geometry verification;
- visual inspection;
- GLB evidence;
- landmark/shell authoring;
- comparing numerical results against the JS core.

Do not implement two authoritative solvers.

---

# 8 · Next execution order

1. **TRACK-CORE-0 · Web census + contract**
2. Georg language gate (JS recommended)
3. **TRACK-CORE-1A · Blender MCP geometry oracle / proof**
4. **TRACK-CORE-1B · Web authoritative implementation + parity**
5. RKIT-11 rebuilt from one core, no hacks
6. **Claude Design transition-style proof**
7. PLAYABLE_TRACK_R0
8. real Cologne OSM Route 01

The earlier Cologne Route execution brief should not jump to Track R0 before Track Core proves the generic transition mechanism.

## Exactly one next gate

**TRACK-CORE-0 · ChatGPT Web census + core contract.**
