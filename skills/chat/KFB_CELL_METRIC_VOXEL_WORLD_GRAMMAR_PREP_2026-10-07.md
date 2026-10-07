# KFB Cell Metric / Voxel World Grammar · PREP · 2026-10-07

Status: **ARCHITECTURE PREP · NO RUNTIME WRITE**  
Owner: **KFB World / receiving World**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/kfb-cell-metric-voxel-world-grammar-2026-10-07`

## Product idea

Treat Voxel/Cell not only as a render style, but as a **shared world grammar** for:
- terrain height / terraforming;
- building footprint and façade bays;
- portals/openings;
- dungeon alignment;
- destruction / rebuild;
- puzzle/minigame rules;
- Story/Tactical relief;
- alternative visible Voxel/BlockBits render modes.

The logical cell is world truth.
Visible cubes/blocks are one possible presentation.

## Measured source facts

### KayKit Dungeon
Current measured dungeon module:
- floor module: **4 × 4**;
- wall length: **4**;
- wall height: **4**;
- level spacing: **4.05**;
- rooms: minimum **2 × 2 modules**;
- corridors: exactly **1 module** wide.

Source:
`tools/world_atlas/docs/HANDOFF_dungeon_S13.md`

### Rig_Medium
Measured examples:
- Farmer_A: approx **2.41** high;
- Farmer_B: approx **2.33** high;
- both Rig_Medium.

This makes a **4 × 4 × 4 MacroCell** a plausible candidate for a room/building module: a Medium character fits with comfortable headroom.

Do not canonize this yet. It is a candidate that must be measured against more Rig_Medium actors, vehicles, doorways, BlockBits and movement/camera.

### StoryMap
Existing donor:
- one InstancedMesh;
- D6 vertical terrace quantum;
- `heightStep = cell / 6`;
- `terraceLevel = 0..5`.

### Legacy Voxel World
Older Mech Voxel World donor uses `CELL = 3`.
This is donor evidence, not permission to overwrite it silently.
A future common metric needs an explicit adapter/migration decision.

## Candidate metric

### MacroCell
Candidate:
`MACRO = 4 world units`

Semantic meaning:
- one room/bay-scale world module;
- one Dungeon cell;
- one façade/portal frame;
- one coarse building/terrain authoring unit.

Examples:
- 1×1 MacroCell = kiosk/shed/single room-scale unit;
- 2×2 = 8×8 world-unit small dwelling / small building footprint;
- 3×3 and above = larger authored building grammar.

This is semantic planning, not an interior-simulation requirement.

### Vertical terrain quantum
Candidate:
`TERRACE = MACRO / 6 ≈ 0.667`

This preserves the proven D6 idea:
- terrain can change in small readable steps;
- a whole 4-unit room-height jump is not required for every terrain edit.

### Optional SubCell
Do not require Destruction Cells to equal one MacroCell.

Use:
- MacroCell for World/Dungeon/Building grammar;
- smaller source-derived cells for façade bays, slabs, damage and local destruction;
- adapters map local cells to their parent MacroCell / WorldObject.

This preserves the existing Seed World destruction grammar instead of forcing every damage piece into a 4×4×4 cube.

## Pixel-art / raster → voxel translation

Any 2D or procedural source can be rasterized into the common grid.

Possible inputs:
- grayscale height map;
- color-coded biome/material map;
- mask;
- OSM footprint;
- procedural noise/field;
- authored Pixel-Art-style image;
- Story/Tactical source.

Example:

`pixel/raster sample → cell(x,z) → height/terrace + material + biome + semantic tags`

Resolution becomes an art-direction/performance knob:
- larger cells = simpler, more toy-like, faster;
- smaller cells = finer geography, more instances/data.

Do not confuse input pixels with final render voxels.
The same cell field can render as:
- visible hard blocks;
- rounded blocks;
- BlockBits;
- merged/chunked mesh;
- smooth/continuous surface.

## Building grammar

A MacroCell can carry:
- floor/room role;
- façade role;
- edge opening;
- portal;
- window;
- doorway;
- support class;
- material/palette family;
- occupant/activity reference.

Doors/windows should preferably live on **cell faces/seams**, matching the existing Dungeon principle that edges/seams carry wall/opening truth.

No rendered interiors are required for the semantic grid to remain useful.

## Dungeon seam

The existing Dungeon module being exactly 4 units makes it a strong compatibility candidate.

Potential relation:

`World MacroCell 4×4 → remove/open one face → Dungeon portal / entrance → Dungeon 4×4 module grid`

Portal owns:
- semantic connection;
- entrance transform;
- destination.

The World cell does not become the Dungeon owner.

## Destruction / rebuild

Reuse the proven Seed World pattern:

`INTACT_COMPILED → local hit/edit → PROMOTE → editable/destructible cells → persist delta → DEMOTE/REBUILD`

Do not keep the whole world as active physics cubes.

Persist cell state compactly.
Current destruction donor already proves 2-bit local cell states and fixed pools.

## Support / gravity profiles

The same Cell Truth may use different response policies.

### STRUCTURAL
Use support graph / local collapse.
Best for buildings and believable destruction.

### SETTLE
Unsupported cells fall vertically to the nearest supported level.
Useful for toy-block worlds and stylized rebuild.

### PUZZLE
Explicit game rule may apply:
- Tetris-like settling;
- Connect Four;
- Match-3 / Candy-Crush-like matching;
- color cascade;
- score/combo logic.

### TERRAIN
Column height changes; no free-falling voxel physics.

Important:
**Puzzle behavior is a consumer rule, not universal world physics.**

A building should not become Match-3 merely because the same grid can support Match-3.

## Existing puzzle donor

The earlier Mech Voxel World design already used the terrain cell grid for:
- colored Gems;
- Match-3 in X/Z;
- cascades;
- bounded pops;
- player pushing;
- one-frame world pulse.

This is strong evidence that the common cell field can support diegetic puzzle rules without a separate UI board.

## KayKit BlockBits

Current Registry contains:
`kaykit-blockbits-1-0-free`

Inventory:
- 40 3D models;
- bricks;
- colored/decorative/striped blocks;
- tree;
- water;
- wood;
- shared BlockBits texture.

Use as:
- built structures;
- special zones;
- transition/hero block families;
- visible toy grammar.

Do not require GLTF BlockBits for every terrain cell.
Mass terrain should normally use cheaper shared primitive/instanced/chunk geometry.

## Render/runtime strategy

### Editable / near
- instanced cells / rounded boxes;
- editable matrices/attributes;
- local promotion for destruction.

### Static / far
- merge/chunk compiled cells;
- lower-frequency updates;
- impostor/LOD where useful.

### Hero
- real KayKit/BlockBits/Claybound assets;
- exact source identity retained.

Same logical world state, different presentation cost.

## Voxel water

Do not build per-cell fluid simulation by default.

Cell field can own:
- WATER material/state;
- river mask/path;
- water level.

Presentation may be:
- hard voxel water;
- animated material in a voxel trench;
- one continuous water surface;
- later specialized fluid presentation.

Card Zone Lab v2 is a visual/material donor, not universal water ownership.

## Current Open World relationship

This prep does **not** replace:
- Continuous Surface Truth;
- Track Core;
- Joyride contact;
- current frozen Island MVP contract.

Potential future relation:

`World/Cell Truth → Surface Adapter`
- Continuous / smooth;
- Voxel / D6 terrace;
- Rounded Voxel;
- BlockBits Toy;
- Story/Tactical relief.

For Drive:
- Track Core remains smooth road/contact owner;
- voxel/terrace world may remain visible around it.

## Recommended bounded proof

Use one tiny **20×20 cell island**.

One shared saved state.

Prove:
1. D6 Raise;
2. D6 Lower;
3. one 2×2 MacroCell building footprint;
4. one portal face aligned to a 4-unit Dungeon module;
5. one building locally promoted to destructible cells;
6. destroy;
7. support policy test:
   - STRUCTURAL;
   - SETTLE;
8. rebuild;
9. same saved state rendered as:
   - Visible Voxel Toy;
   - Rounded Voxel;
   - smooth/continuous presentation if feasible;
10. fixed-camera and target-GPU performance comparison.

Do not add full interiors, city-scale world or puzzle modes to this proof.

## Decision status

Promising architectural candidate:
**YES**

Canonical global cell size:
**NOT YET FROZEN**

Best current candidate:
**4-unit MacroCell with D6 vertical terrain quantum**

Reason:
- exact measured Dungeon module match;
- Rig_Medium character scale is plausible;
- 2×2 gives a useful small-building footprint;
- StoryMap D6 donor maps naturally;
- Destruction can remain finer local cells.


## Resource payload / mining layer

A cell may also carry an optional **resource payload**.

Candidate fields:
- resourceType;
- grade / richness;
- amount / depletion state;
- reveal rule;
- regeneration rule if any;
- source/provenance or biome-generation seed.

Examples:
- earth/clay/stone/wood/ore/fluff-like material;
- buried prop/relic;
- build material;
- biome-specific collectible.

Important:
- resource state is data, not a permanently spawned inventory object;
- mining/removal mutates the cell/resource state and may expose a lower layer or empty/support state;
- ordinary cells should remain cheap until interacted with;
- rarity/resources may be generated deterministically from world seed + position + biome.

This gives one diegetic loop:
`WORLD CELL → inspect/mine/destroy → resource yield → build/repair/terraform`.

Do not make a full economy or crafting system part of the first Cell Metric proof.

## Hexagonal projection / Hex-prism cells

A hexagonal version is technically best understood as a **hexagonal prism cell** rather than a cube.

Existing KFB Hex truth is already measured and should be reused rather than replaced:
- pointy-top hex;
- 2.0 flat-to-flat × 2.309 point-to-point in the current KayKit Medieval Hex pack;
- six horizontal neighbours;
- measured edge classes/connectivity;
- existing solver / Hex World direction.

A stacked Hex-prism world gives:
- six horizontal neighbours;
- plus vertical up/down relationships when stacked;
- natural radial/organic terrain flow;
- reduced square-grid directional bias;
- very readable biome/territory/strategy topology.

### Strengths of HEX_PRISM
Best suited to:
- terrain/biome cells;
- islands;
- tactical/world maps;
- territory and route planning;
- natural-looking neighbourhood propagation;
- elevation terraces;
- resource fields;
- Babel / climbing / boardgame-like worlds.

### Strengths of CUBE/SQUARE
Best suited to:
- buildings;
- façades;
- rooms;
- Dungeon alignment;
- destructible architecture;
- Tetris / Connect Four / Match-3;
- orthogonal roads/interiors;
- Pixel-art/raster projection.

Therefore do not force one geometry to win globally.

## Candidate common cell abstraction

Conceptually:

```
Cell {
  id
  shape: SQUARE | HEX
  coord
  elevation / layer
  material / biome
  resource?
  supportProfile
  semanticTags[]
  objectRefs[]
}
```

Adjacency is delegated to the shape/grid owner:
- SQUARE: 4-way / optional diagonals / vertical;
- HEX: 6-way / vertical.

Presentation is delegated to the Surface Adapter:
- hard voxel/block;
- rounded block;
- hex prism;
- KayKit Hex source tile;
- smooth terrain;
- Story/Tactical relief.

This preserves one semantic idea without inventing one universal geometry runtime.

## Scale relationship

Do **not** resize the existing measured KayKit Hex pack to the 4-unit MacroCell by assumption.

Current measured Hex source width is 2.0 flat-to-flat. The 4-unit square MacroCell candidate and the existing KayKit Hex metric are therefore not numerically identical today.

Possible future options:
1. keep native Hex metric and use an adapter between grids;
2. group multiple native Hex cells into one semantic Macro region;
3. derive a separate 4-unit procedural hex-prism profile;
4. scale only after source-isolated visual/contact proof.

No option is canonical yet.

## Resource + Hex combination

Hex terrain is especially attractive for resource generation because neighbourhood fields are simple and isotropic-looking:

`seed + biome + hex coord → resource field`

This can create:
- ore/stone/clay veins;
- Fluff/resource clusters;
- fertile/forest cells;
- corruption/alien fields;
- archaeological/resource zones.

Extraction still uses the same semantic resource contract as square/cubic cells.

## Updated architecture preference

Prefer **one Cell Grammar with multiple grid/surface adapters**, not one world forced into one tessellation.

Candidate relationship:

`World semantic state`
→ Square/Cube adapter for Dungeon/Building/Destruction/Puzzle
→ Hex adapter for Terrain/Biome/Tactical/Resource fields
→ Continuous adapter where Joyride/OSM needs smooth macro terrain

Cross-grid portals/anchors map stable semantic IDs, not raw mesh coordinates.


## One next gate

**KFB CELL METRIC LAB · SQUARE/CUBE + HEX_PRISM ADAPTERS · RESOURCE PAYLOAD · DUNGEON/DESTRUCTION/RESOURCE PROOF**
