# KFB World Authoring Tool · Hex / OSM / Landmark / In-Scene Authoring

Status: **CURRENT WORLD / ENVIRONMENT CLAUDE BRIEF · AUTHORING ONLY**  
Source repo: `georg-doc/kayfabizarro`

The objective is to turn existing KFB world-building, Hex, Dungeon, OSM and Scene-Editing donors into one practical workflow for **building inside a playable world**.

This is not a new universal engine.

## 1 · Mandatory donor inputs

Read the shared project rules from this handoff's `START_HERE.md`, then inspect these actual source corpora.

### Hex corpus

`tools/KFB-ToolBox/_inbox/KFB Hex Assets Worldbuilding (WIP Exporte WS1)/kfb-hex-worldbuilder-corpus_2026-09-22/`

Read:

- `README.md`
- `PACK_TRUTH.md`
- `CODE_MAP.md`
- `DEPENDENCIES.md`
- `HANDOVER_WSA.md`
- `NEXT_FIVE.md`

Then inspect:

- `modules/KFB_Hex_Baukasten_S0/`
- `modules/KFB_Hex_Edge_Atlas_S1/`
- `modules/KFB_Babel_Hex_Generator_v1/`
- `modules/hexrealm/`

### WhackMan donor

`tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/`

Especially:

- `SESSION_CUT_2026-09-22.md`
- `POSTMORTEM_CHANGELOG.md`
- `wm-recipe.js`
- `wm-maze.js`
- `wm-collide.js`
- `wm-gate-b.js`

### S22 Room Study failure/recovery

`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/`

Read:

1. `docs/ONBOARDING_S22_HANDOVER.md`
2. `docs/POSTMORTEM_S22_CONSOLIDATED.md`
3. `docs/POSTMORTEM_R08_S22.md`
4. `docs/EDITOR_LAYER.md`
5. `docs/WALL_NODES_S22.md`
6. `docs/MENTAL_MODEL_DIORAMA.md`
7. `docs/SPRINT_22_ROOMS.md`

Inspect:

- `KayKit_Room_Study_S21.html`
- `lib/room-recipes.js`
- `lib/dungeon-grid.js`
- `lib/kit-lab.js`

Accepted study results include R02, R07 and R09.

R08 is aborted.

R03's two-level mechanism is useful; its railing/stair composition is not accepted.

## 2 · Hard rule: Source Object Truth before composition

The S22 failure series establishes:

**No new visible 3D source object may enter a recipe, room, world or landmark composition before the actual object has been viewed in isolation.**

A filename is not object truth.

A documentation sentence is not object truth.

A loaded asset URL is not object truth.

This especially applies to:

- stairs;
- railings;
- structural supports;
- doors;
- wall junctions;
- large furniture;
- stacked props;
- landmarks;
- unusual Hex tiles;
- OSM override geometry.

Do not infer geometry from names such as `stairs_wood`, `barrier` or `wall_doorway_sides`.

A wrong object cannot be fixed by trying more rotations.

## 3 · First new tool: Source Object Inspector

Before general World composition, create or extract a compact reusable Source Object Inspector.

This is **not** another Asset Librarian.

It is the last-mile 3D truth viewer used immediately before placement.

For one selected object show:

- actual model alone;
- front / side / top / free orbit;
- bounding box;
- pivot/origin;
- local axes;
- measured width/depth/height;
- underside / ground contact;
- source path;
- source revision;
- semantic role;
- structural/fixed vs movable class;
- allowed/meaningful rotations when known;
- symmetry when relevant.

For directional objects identify:

- forward axis;
- connection face;
- travel/run axis;
- support/contact surface.

The first version should stay compact.

Its purpose is to make wrong assumptions difficult.

## 4 · Source profiles

The Inspector should emit a small machine-readable profile.

Conceptual schema:

`kfb.source-part/1`

Possible fields:

- key
- pack
- path
- commit
- bbox
- pivot
- axes
- underside
- role
- class
- symmetry
- rotationLocked
- connectionFaces
- measuredAt

For Hex tiles this feeds, but does not replace, planned Hex-specific profiles such as:

`kfb.hex-tiles/1`

Generic geometry facts stay shared; Hex edge/topology data stays Hex-owned.

## 5 · Preserve structural owners

Healthy pattern from WhackMan:

`recipe → owner model → owner layout → scene`

Keep equivalent boundaries elsewhere.

Examples:

- Dungeon topology → Dungeon layout owner
- Hex topology → Hex grid / placement solver
- OSM geography → OSM source truth
- Race route → Race owner
- Scene editing → shared authoring seam

Do not move every concern into one mega-module.

## 6 · Keep four truths separate

### Source truth

What the real asset is.

### Topology truth

What connects to what.

Examples:

- Hex axial neighbours;
- road edges;
- Dungeon room graph;
- MazeGraph;
- OSM topology;
- portal connections.

### Structural layout truth

Where mandatory structural elements go.

Examples:

- walls;
- floors;
- road pieces;
- Hex terrain;
- structural stairs;
- connectors.

### Authored presentation truth

Human corrections/composition:

- prop transform;
- Resident placement;
- landmark adjustment;
- furniture;
- decorative groups;
- visual offsets.

Do not reconstruct topology by inspecting rendered meshes.

Do not let visual patches silently rewrite structural topology.

## 7 · Fixed versus movable is first-class data

S22 R03 proved that structural architecture and movable props cannot share the same relaxation rule.

At minimum distinguish:

- `STRUCTURAL_FIXED`
- `STRUCTURAL_EDITABLE`
- `PROP_MOVABLE`
- `RESIDENT`
- `LANDMARK`
- `DECORATIVE`

Automatic collision/relaxation must never move `STRUCTURAL_FIXED` objects.

A structural contact is not automatically a collision error.

## 8 · Topology for structure; editor for composition

Procedural placement is appropriate for:

- grid cells;
- topology;
- roads;
- Hex connectivity;
- Dungeon walls;
- generated structural patterns.

Interactive authoring is preferable for:

- asymmetric stairs;
- furniture;
- railings needing visual fitting;
- stacked objects;
- props;
- Residents;
- hero landmarks;
- authored decorative groups.

For difficult authored objects use:

**inspect source → place in editor → ground/contact check → visual check → save patch → export recipe**

Do not use:

**guess coordinates → render → screenshot → change numbers → repeat**.

## 9 · Existing S21/S22 editor is a real donor

Inspect the actual editor in:

`KayKit_Room_Study_S21.html`

Current proven interactions include:

- TransformControls;
- click-to-select;
- move;
- rotate;
- individual vs semantic group;
- position snap around 0.1;
- rotation snap around 15°;
- drop-to-ground;
- collision-free adjustment;
- local per-room patch storage;
- raw JSON patch export/import;
- recipe-code export / `Patch kopieren`.

Do not copy this block independently into every future page.

Extract/reuse the interaction model through the shared World Authoring / Scene Patch seam.

## 10 · Shared Scene Patch architecture

Existing draft source:

`georg-doc/kayfabizarro#168`

Checked head for this handoff:

`51f3d21cef6946adcc90820eaf100d2e42cb5391`

It is not merged to main.

Use it as architecture/provenance when accessible.

Do not silently import non-main code if Claude's project only exposes default branch.

World Authoring should combine:

**S21/S22 interaction ergonomics**

with

**shared patch/history architecture**

instead of creating a third generic editor.

## 11 · Undo / redo

The final World Authoring workflow needs real undo/redo.

Every meaningful edit should be reversible:

- move;
- rotate;
- height;
- tile replacement;
- tile rotation;
- prop add/remove;
- group transform;
- landmark transform.

Prefer the existing shared history/command seam over browser-session-only reset.

## 12 · Grounding is not only Y=0

Objects may sit on:

- terrain;
- another prop;
- stairs;
- platform;
- Hex surface;
- OSM surface;
- furniture;
- balcony/gallery;
- vehicle/structure.

Authoring therefore needs a general drop-to-surface / support-contact concept.

At minimum distinguish:

- `GROUND`
- `SURFACE_BELOW`
- `EXPLICIT_SUPPORT`

For object-on-object placement, use the measured support/top surface.

Do not guess Y.

Do not accept visible air gaps.

## 13 · Camera/reference errors must not become geometry

WhackMan and S22 both show this failure pattern.

A visual difference may come from:

- FOV;
- camera height;
- orientation;
- occlusion;
- sightline;
- reference composition.

Before adding geometry to fix a mismatch, check the camera/viewpoint.

Do not invent geometry until source behavior and viewpoint have been inspected.

## 14 · Hex donor truth

The Hex corpus already contains:

- measured pack inventory;
- Hex dimensions;
- edge classification;
- topology;
- `solveHexTile()`;
- `auditTileFit()`;
- generation;
- Babel gameplay.

The two main KayKit packs contain 447 indexed parts.

Do not build a new Hex grid or a fifth placement solver.

Desired placement contract conceptually:

`solve(cell, constraints)`

returns one of:

- valid tile + rotation;
- multiple valid candidates;
- explicit failure + reason.

Failure is valid.

A wrong tile is not.

## 15 · Persistent Hex World document

Target direction:

`kfb.hex-world/1`

Conceptually contains:

- schema;
- seed;
- pinned packs;
- axial grid;
- cells;
- height;
- tile identity;
- valid rotation;
- props;
- paths;
- authored metadata.

It must round-trip predictably.

A generated world that cannot be saved and reopened is not yet a World Authoring Tool.

## 16 · Patch versus Recipe

Avoid a second truth.

During authoring:

- base recipe/world document = structural truth;
- Scene Patch = human editing delta.

At save/export time either:

1. save patch together with the world document; or
2. deterministically bake accepted patch values back into the authored world recipe.

Do not leave essential production corrections only in browser-local state.

`localStorage` is convenience, not project truth.

## 17 · First actual authored proof

After donor parity and Source Object Inspector, build one deliberately small authored world.

Use roughly **12–24 real KayKit Hex tiles**.

Include:

- basic terrain;
- one road;
- one bend;
- one water/river/coast relation;
- at least two elevation levels;
- one structural object;
- one movable prop group;
- one small Resident/zone location.

Include at least one asymmetric source object that first passed the Inspector.

The user must be able to:

- select a Hex cell;
- replace a tile;
- rotate only to valid orientations;
- change elevation;
- select a prop;
- move it;
- rotate it;
- drop it to a surface;
- respect fixed/movable class;
- undo;
- redo;
- save;
- reload;
- export world/patch.

Do not build an infinite world first.

## 18 · Part profile gate

Before an object may be used in the first authored proof, its source profile must exist.

Prove this with:

1. one Hex tile;
2. one asymmetric structural object such as a stair;
3. one prop or landmark-like object.

Show each alone first.

Then place it.

## 19 · OSM relationship

OSM is not replaced by Hex.

OSM remains geographic/semantic truth where used.

Long-term model:

**OSM geography + KFB presentation + authored Hex gameplay topology + shared Scene Patch authoring**

Possible later composition:

- real city roads/buildings;
- handcrafted Hex islands;
- Resident islands;
- platforming areas;
- rivers;
- shortcuts;
- portals;
- landmarks.

Do not create another OSM database/runtime.

## 20 · OSM visual style

Current OSM work already supports a presentation seam similar to:

`OSM footprint → bend + lean + taper + twist`

while preserving source footprint/collision.

Keep source geometry truth and presentation deformation separate.

The Cologne Racer lane is currently the first interactive human gate for the common visual grammar.

Until Georg accepts that gate, World Authoring should remain visually flexible.

## 21 · Landmarks

Landmarks remain source-backed named objects or explicit authored modules.

World Authoring may:

- place;
- orient;
- scale within allowed bounds;
- visually deform through an approved presentation profile.

It must not invent another landmark registry.

Every new landmark first passes the Source Object Inspector.

## 22 · Style references

`tools/KFB-ToolBox/_inbox/KFB Style References/`

Classification:

**REFERENCE_ONLY · NON_CANON**

Use them for:

- shape language;
- materiality;
- clay/grain;
- colour rhythm;
- rounded massing;
- exaggeration.

Do not freeze the World visual canon before Georg reviews the Racer style gate.

## 23 · TinySkies / Travel

Do not delete or fork Travel/TinySkies.

It remains an existing owner where already used.

For World Authoring it is a possible donor for:

- atmosphere;
- macro terrain;
- water;
- sky;
- scale;
- lighting.

The world document/editor must not depend on TinySkies aesthetics.

Local flat/Hex worlds must remain possible.

## 24 · WhackMan lessons

### MazeGraph

Logical navigation/topology can exist separately from rendered Dungeon geometry.

Keep that separation.

### Additive bounce

`wm-collide.js` keeps canonical positions separate from cartoon visual offsets.

General principle:

`rendered position = canonical position + visual offset`

Do not let presentation bounce rewrite saved world positions.

The specific module remains donor code and requires its own consumer proof before general reuse.

## 25 · Babel future gameplay

Babel already proves:

- seedable Hex climbing;
- Editor;
- Chill & Fun;
- Play;
- calculated jump reach;
- double jump;
- rescue;
- recipe export.

Preserve it.

Do not rebuild it as part of the World Editor.

Later the same Hex World data may support:

- branches;
- alternate paths;
- shortcuts;
- endless ascent;
- sky/moon destination;
- W6 choices;
- procedural towers.

These are future gameplay modes, not first-slice scope.

## 26 · Reusable zones/islands

Central product goal:

**build once, reuse elsewhere.**

A reusable zone may reference:

- Hex topology;
- biome/palette;
- props;
- Residents;
- landmarks;
- Scene Patch;
- seed;
- entry port;
- exit/return port.

Do not export only baked anonymous meshes.

Preserve semantic source identities.

## 27 · Storytelling / Tactical Map

The future map consumes the same world/zone data.

It is another representation of the same geography/topology.

It must not become a separate world truth.

Not first-slice scope.

## 28 · UX direction

The world is the primary interface.

The editor is an overlay on the world.

Default view should contain only:

- scene;
- current authoring mode;
- selected object/cell;
- essential actions.

Prefer object-local controls over giant persistent inspector panels.

Avoid:

- SaaS dashboards;
- giant sidebars;
- explanatory card walls;
- permanent debug tables;
- generic editor chrome.

Every visible control must pay rent.

## 29 · First delivery sequence

### Gate A · donor parity

Boot and inspect:

- Hex Baukasten;
- Edge Atlas;
- Babel;
- S21/S22 Room Study editor donor.

No redesign.

### Gate B · Source Object Inspector

Prove three source objects in isolation.

### Gate C · shared authoring seam

Prove:

- select;
- move;
- rotate;
- group;
- snap;
- drop-to-surface;
- fixed/movable behavior;
- undo;
- redo.

### Gate D · small Hex world

Build the 12–24 tile authored proof.

### Gate E · save/reload

Round-trip world + patch without losing edits.

Stop for Georg review.

Do not proceed automatically to city-scale OSM, infinite worlds or endless Babel.

## 30 · Failure stop rule

Do not run repeated coordinate-repair loops.

If the same visible placement class fails twice:

**STOP.**

Inspect the source object again.

Check pivot, axes, support surface and camera.

Use the editor instead of another coordinate guess.

After two failed repair passes preserve candidate + failure recovery.

## 31 · Claude Design Session Cut

At a coherent checkpoint export:

- complete current editable source;
- exact intake revision;
- donor revisions;
- source profiles produced;
- world document;
- patch data;
- changed files;
- additive changelog;
- supplementary screenshots;
- unresolved items;
- exactly one next gate.

Do not rely on Claude chat history.

Do not claim GitHub/Cloudflare publication.

Georg manually uploads the Session Cut; Web/WSA reconciles it.

## First human gate

Ask Georg only:

**Can I now build and correct a small world directly in the 3D scene without falling back into coordinate-guessing or rebuilding source objects?**

If the answer is no, fix the authoring workflow before expanding the world.
