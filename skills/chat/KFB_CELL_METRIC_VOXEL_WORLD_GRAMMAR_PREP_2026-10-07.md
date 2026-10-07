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



## Georg steering · Cube/MacroCell becomes the preferred default grammar

Current preference:

**SQUARE / CUBE / MACROCELL = DEFAULT KFB WORLD GRAMMAR CANDIDATE**

Reason:
- simpler and more scalable;
- aligns naturally with Pixel-Art/raster → world translation;
- aligns with Building façades / doors / windows / rooms;
- aligns with the measured 4-unit Dungeon module;
- aligns with local Destruction/SubCells;
- supports Terraforming, Resource mining, Tetris/Connect-Four/Match-3-style diegetic rules;
- has a strong familiar cultural grammar: blocks, rooms, construction, puzzle spaces, modular architecture and "Cube"-like combinatorial spatial logic;
- can still render as rounded, Claybound, softened or smooth rather than visibly Minecraft-like.

The visible cube is **not mandatory**.
The square/cubic **logical grid** is the preferred common grammar.

### Hex role is downgraded

HEX is now:
- OPTIONAL terrain/tactical representation;
- OPTIONAL Babel/climbing/boardgame donor;
- source of useful roads/coast/nature/connector assets where they visually fit;
- not the preferred general immersive-building vocabulary.

Do not make the KayKit Medieval Hex building family the default KFB architecture.

Current product observation:
- the existing Hex buildings read comparatively small/blocky/tabletop-like against Rig_Medium character scale;
- they are useful in fantasy/tactical contexts but weaker as the primary immersive cartoon-world building family;
- prior Hex-heavy visual candidates reinforce this concern.

The existing Hex solver/measurements remain valuable and must not be deleted or rebuilt.

### Dungeon stays high-value

The measured KayKit Dungeon family remains a strong architecture donor because:
- 4×4 module;
- 4-unit walls;
- 4.05 level spacing;
- character-compatible room/corridor grammar;
- stronger architectural modelling/style than the Hex building subset;
- direct compatibility with the 4-unit MacroCell candidate.

Dungeon is not reduced merely because Hex is downgraded.

### Cultural / narrative advantage of Cube grammar

Cube/MacroCell provides a broad, familiar symbolic language that can support:
- construction / decomposition;
- hidden contents/resources;
- rooms behind cells;
- portals;
- nested worlds;
- shifting architecture;
- destruct/rebuild;
- puzzle logic;
- Tetris/Match/Connect mechanics;
- "what is inside the next cell?" suspense;
- procedural rearrangement.

This is useful for storytelling because the audience already understands the block/cell metaphor without tutorial-heavy explanation.

### Preferred hierarchy

`World semantic state`
→ **Square/Cube MacroCell grammar by default**
→ local finer SubCells for destruction/resources
→ Dungeon adapter on the same 4-unit module where proven
→ Continuous/Smooth Surface presentation where needed
→ optional Hex/Tactical adapter only for specific worlds/modes/assets



## Open Stage / Living Diorama room grammar

Georg steering:

KFB does **not** need conventional closed interiors for every dwelling or activity space.

A MacroCell cluster may represent a room, home, workshop, shrine, shop, camp or private-life scene through:
- floor/boundary marks;
- one or two walls;
- partial façade fragments;
- furniture/props;
- lighting/material zone;
- Resident choreography/routines;
- semantic room role.

The missing walls are not automatically missing content.

This creates a deliberate **open-stage / living-diorama** grammar:
- the player/camera can see private Resident life without cutting roofs/walls away;
- scale remains compatible with Rig_Medium;
- camera collision/occlusion pressure is reduced;
- scenes can transition fluidly between "interior", "garden", "street", "biome" and "stage";
- surreal ambiguity is allowed: potted plants may read as trees, a bed may sit in an open landscape, a domestic room may bleed into a biome.

### Narrative boundary vs physical boundary

Keep these separate:

`SemanticRoomBoundary`
- tells Residents and story systems what this space means;
- may define routines, privacy, activity, ownership, interaction and staging.

`PhysicalBoundary`
- collision/support;
- may be absent, partial or explicit.

`VisualBoundary`
- chalk/paint/material seam;
- raised trim;
- floor tile change;
- two walls;
- props;
- light/fog/color shift;
- furniture arrangement.

A Resident may respect a "room" even when the player can visually walk around its open side.

### Resident choreography becomes essential

Open sets only work if actors make the space believable.

Resident Performance should be able to consume:
- room/scene role;
- activity anchors;
- relational positions;
- prop anchors;
- entry/exit points;
- private/public state.

Examples:
- cooking at a stove anchor;
- reading at a desk;
- sleeping/resting;
- arguing across a table;
- tending plants;
- rehearsing/music;
- repairing/building;
- greeting a player at the implied threshold.

The choreography, not four walls, proves the room.

### SceneCell / SetCell concept

A MacroCell cluster may expose a lightweight presentation record:

```
SceneCell {
  sceneRole
  boundaryProfile: OPEN | FLOOR_MARK | TWO_WALL | PARTIAL | ENCLOSED
  floorProfile
  propAnchors[]
  residentAnchors[]
  entryAnchors[]
  lightProfile?
  audioProfile?
  privacyProfile?
}
```

This is presentation/semantic metadata, not a second World truth.

### Visual storytelling advantages

The grammar supports:
- immediate readable tableaux;
- private life visible from the world;
- comic-strip-like staged compositions;
- theatrical alienation / deliberate artificiality;
- rapid changes of role without rebuilding architecture;
- Kayfabe ambiguity between "real place", "set", "toy", "map", and "performance".

The world may intentionally leave unresolved whether a scene is:
- a literal house;
- a theatrical representation of a house;
- a toy diorama;
- a biome that has adopted domestic props;
- a Resident's subjective/story space.

That ambiguity is a feature when the acting, prop logic and scene composition remain coherent.

### Camera rule

Prefer open/partial sets for Resident-heavy scenelets when a closed room would create:
- camera clipping;
- roof hiding;
- wall occlusion;
- cramped Rig_Medium scale;
- repeated interior-camera exceptions.

Do not solve those problems by shrinking Characters or rebuilding the camera around tiny rooms.

### Claybound / toy-world relation

Tier-A Characters, key props and signature scene elements still target the Claybound Gold Standard.

The open-stage grammar concerns **spatial representation**, not permission to lower material quality.

### Cultural reference direction

Useful reference families:
- minimalist/theatrical stage space;
- chalk/floor-plan architecture;
- dollhouse / open-back toy house;
- comic-strip scene resets;
- Krazy Kat-like unstable landscape/room identity;
- surreal theatre and absurdist staging.

Use as design grammar, not literal reproduction of protected works.



## Dynamic Edge Completion during Build / Attach

Georg steering:

The Edge Completion Grammar should be **stateful and reversible**, not a permanent decorative cap.

A free modular boundary is a temporary presentation state.

When a new room/module attaches to that boundary:
1. detect the formerly exposed edge;
2. dissolve/retract its temporary rounded/ruin/stage completion;
3. preserve the canonical source geometry/semantic seam;
4. bring the new module into place;
5. resolve the shared seam into the normal connected state;
6. recompute free outer boundaries;
7. generate the same completion grammar only on the newly exposed outer edges.

Target principle:

`EXPOSED_EDGE → COMPLETED_EDGE → ATTACH_PREP → CONNECTED_SEAM → NEW_EXPOSED_EDGE → COMPLETED_EDGE`

The player should read one continuous act of building, not:
`cap disappears → naked module seam → new asset pops in → new cap pops in`.

## Reuse shared KFB materialize / rebuild grammar

Do not invent a second construction VFX owner.

Reuse the existing shared presentation direction prepared for:
- UFO transfer / rematerialize;
- Build / Repair / Rebuild;
- Clay particles/chunks;
- source-object restoration.

Useful common vocabulary:
- readable wobble / squash;
- edge softening;
- clay crumbs/chunks;
- material breakup;
- assembly / settle;
- reveal of the source-proven final mesh;
- seeded, stable irregularity;
- no random per-frame flicker.

The **world/build owner decides the structural state**.
The shared transition grammar only presents the change.

## Canonical seam vs presentation seam

Keep three layers separate:

### Canonical seam
Structural truth:
- module A face;
- module B face;
- connection/opening state;
- support/contact;
- save/reload identity.

### Completion shell
Temporary presentation while the seam is exposed:
- rounded cap;
- wubble / soft clay roll;
- trim continuation;
- masonry continuation;
- baseboard ending;
- ruin crumbs / clay pellets;
- terrain blend.

### Build transition
Short-lived presentation between exposed and connected states.

The Completion shell must never be baked into structural truth in a way that blocks later attachment.

## Build choreography

Preferred transition, adaptable by profile:

### A · Prepare
- NPC/God Mode selects or brings the new module;
- target edge receives subtle anticipation wobble;
- existing completion shell loosens/compresses rather than vanishing instantly.

### B · Open seam
- rounded cap retracts, melts, crumbles or folds toward the boundary;
- clay crumbs/particles are pooled and bounded;
- underlying canonical connection face becomes available.

### C · Attach
- new module translates/snaps/settles to its canonical transform;
- optionally use a tiny squash/overshoot;
- structural state changes only at the authoritative attachment event.

### D · Heal
- shared internal seam visually closes;
- material/trim/baseboard/masonry continuity resolves across both modules;
- redundant cap debris fades/recycles.

### E · Re-finish
- boundary scan runs again;
- new external wall/floor/corner edges receive the same Edge Completion Grammar;
- local ruin/clay crumbs are seeded only where appropriate.

This gives one visually continuous construction gesture.

## Example · 1×2 room becomes 1×3

Initial:
`[A][B]`

Exposed edge on B:
`[A][B)~`

where `)~` is the temporary soft completion.

Build C:
`[A][B)~  +  [C]`
→ cap opens
→ C snaps/settles
→ B-C seam heals

Final:
`[A][B][C)~`

Only the new outer edge of C is completed.

The same rule applies to:
- Tiny Treats Bakery/Restaurant-style scene modules;
- Dungeon modules;
- workshop/home/Resident scenelets;
- BlockBits;
- future procedural buildings.

## Different build actors, same structural result

### Resident / NPC construction
Presentation may include:
- carry / push / hammer / repair choreography;
- Fluff/work motions;
- staged pauses;
- collaborative building.

### God Mode
Presentation may be:
- faster;
- direct placement;
- short clay materialize/settle;
- optional beam/hand/tool affordance.

### Rebuild / repair
Uses the same completion and heal logic in reverse/partial form.

The final canonical module graph must be identical regardless of who performed the build.

## Performance rules

Do not simulate every cap as soft-body clay.

Prefer:
- reusable generated cap geometry;
- small vertex-deform/wobble parameters;
- pooled clay crumbs/chunks;
- shared materials;
- deterministic seeds;
- transform/scale animation for most assembly;
- local recomputation only around changed edges.

When a module is added, recompute only:
- the changed seam;
- its adjacent corners;
- newly exposed boundary edges.

Do not rebuild the whole settlement.

## Acceptance

A build transition passes when:
- there is never an obviously raw connector face in the normal visible sequence;
- the old completion naturally yields to the new module;
- the internal seam reads connected, not double-capped;
- the new outer edge ends in the same finished visual language;
- source asset identity remains intact;
- save/reload reconstructs the same structural result without relying on transition state;
- transition remains performant when repeated.



## Bidirectional Build / Destruction Boundary Grammar

Georg steering:

The same Edge Completion system must work in **both directions**.

### Construction direction
`EXPOSED_EDGE → COMPLETED_EDGE → ATTACH_PREP → CONNECTED_SEAM → NEW_EXPOSED_EDGE → COMPLETED_EDGE`

### Destruction / removal direction
`CONNECTED_SEAM → DAMAGE / DETACH → NEW_EXPOSED_EDGE → RUIN_COMPLETION → SETTLE / COLLAPSE / STABLE_RUIN`

The structural owner decides:
- which cells/modules survive;
- which seams disconnect;
- which upper cells lose support;
- whether they collapse, settle or remain supported;
- persistent damage/rebuild state.

The presentation layer decides only how the resulting exposed boundary reads.

## Ruin Completion

When destruction creates a new exposed wall/floor/corner boundary, do not leave the raw connector/slice visible.

Generate a **Ruin Completion shell** using the same universal grammar:
- softened / rounded broken edge;
- visible wall/material thickness;
- continued masonry/trim/baseboard logic where appropriate;
- slight asymmetry / deformation;
- bounded clay crumbs / rubble;
- optional dust / debris settle;
- optional terrain/vegetation blend later.

The ruin should read as a finished cartoon state of the world, not as a missing module.

## Support / settle interaction

Example:
- lower floor cells are destroyed;
- upper cells lose support;
- STRUCTURAL profile may collapse them;
- SETTLE profile may drop them vertically to the nearest supported level;
- after final transforms stabilize, boundary completion recomputes only around the changed cells/seams.

Do not continuously regenerate caps during every intermediate physics frame.

Preferred sequence:
1. damage state changes;
2. local collapse/settle resolves;
3. final supported topology is known;
4. boundary scan runs;
5. Ruin Completion is generated on the resulting exposed edges.

This avoids expensive visual churn and prevents caps appearing on pieces that are still moving.

## One grammar, multiple actors

The same structural/presentation system may be triggered by:
- Destruction POC / weapon damage;
- Resident/NPC work;
- repair/rebuild activity;
- God Mode add/remove;
- scripted world events;
- later resource/mining actions.

The actor changes choreography, not world truth.

## Rebuild symmetry

A ruined boundary may later be rebuilt:

`STABLE_RUIN → REBUILD_PREP → RUIN_COMPLETION loosens/retracts → missing cells/modules restore → seams reconnect → final external boundaries re-finish`

This makes Build / Destroy / Repair / Rebuild visually related operations instead of separate effect stacks.

## Visual goal

A damaged building may remain as:
- readable ruin;
- partial open-stage scene;
- lowered/settled toy structure;
- exposed domestic tableau;
- later rebuild target.

The result should still feel compositionally intentional and Claybound-compatible.

## Performance rule

Reuse:
- fixed rubble/debris pools;
- shared rounded-cap geometry families;
- deterministic edge seeds;
- local boundary recompute only;
- one shared material family;
- no per-cell soft-body simulation.

The existing Seed World destruction donor already demonstrates bounded promoted cells and fixed debris/rubble pools; reuse that architecture direction rather than creating a second destruction runtime.


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

Prefer **Cube/MacroCell first**.

Candidate relationship:

`World semantic state`
→ **Square/Cube MacroCell grammar as default**
→ SubCells for Destruction/Resource detail
→ Dungeon adapter where the measured 4-unit module fits
→ Continuous/Smooth presentation where Joyride/OSM needs it
→ optional Hex adapter for Tactical/Babel/specific terrain or asset families

Hex is no longer a peer default in this proposal.

Cross-grid or cross-mode portals/anchors map stable semantic IDs, not raw mesh coordinates.


## One next gate

**KFB CELL METRIC LAB · CUBE/MACROCELL DEFAULT · RESOURCE + DUNGEON + DESTRUCTION · HEX OPTIONAL DONOR ONLY**
