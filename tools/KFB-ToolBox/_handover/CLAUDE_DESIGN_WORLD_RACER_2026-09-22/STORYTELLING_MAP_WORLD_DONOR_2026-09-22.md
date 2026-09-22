# KFB Storytelling Map → World / Tactical Map donor note · 2026-09-22

Status: **CURRENT DONOR ASSESSMENT · ADDITIVE WORLD INPUT · NOT A NEW WORLD OWNER**

Source reviewed:

`tools/KFB-ToolBox/_inbox/KFB StoryMap v1/`

Current package status:

**OPEN BUG · WATER LOOK UNRESOLVED · NOT LIVE-VERIFIED AS A COMPLETE CURRENT PRODUCT**

The package is nevertheless highly relevant as a World/Tactical representation donor.

---

## 1 · Source truth

The current Europe board is not an OSM-Europe renderer.

Its broad Europe geography currently comes from **OpenPlanetData country-boundary GeoJSON**, projected into one physical puzzle board.

OSM remains the correct source lane for local/city drilldown through the existing OSM City Lab.

Useful hierarchy direction:

`Europe boundary board → country/region → OSM City/zone → landmark/local diorama/world instance`

Do not rewrite the Europe source as OSM merely because its visual role is map-like.

---

## 2 · Strongest reusable architecture: canonical geography vs presentation

SMA1 already keeps a canonical transform for each map piece:

- canonical position;
- canonical rotation;
- canonical scale.

Presentation actions operate on a pivot wrapper and remain reversible:

- RAISE;
- LOWER;
- STAND_UP;
- LAY_FLAT;
- SLIDE;
- ROTATE;
- FLIP;
- PULSE;
- EXPLODE / ASSEMBLE;
- SNAP_HOME.

`RESET` restores the same canonical geography and the runtime exposes a measurable canonical error.

This is directly useful for World/Tactical design:

**world state / geography remains truth; map animation is presentation.**

A tactical or storytelling view may exaggerate, raise, fold, separate or animate a zone without changing the underlying World Recipe, route, portal or save-state identity.

---

## 3 · Recommended role in the wider KFB architecture

Do not make Storytelling Map a second World runtime.

Recommended relationship:

`World Recipe / Zone IDs / routes / instances / event state`
→ **Map Representation Adapter**
→ one of several presentations.

Candidate presentations:

### WORLD

Playable 3D world.

### STORY

Physical animated papercraft/story stage.

Use for:

- historical narrative;
- event explanation;
- cutscenes;
- progressive disclosure;
- map-piece spectacle.

### TACTICAL

Readable tabletop/meta-navigation view.

Use for:

- current zone;
- nearby destinations;
- Race/event locations;
- portals/instances;
- unlocked/active story nodes;
- route overview;
- cards/tokens/standees as markers.

This should complement Open World navigation, not replace it with a conventional level-select menu unless a specific game mode needs that.

### RELIEF / VOXEL

Optional terrain/height reading of the same source area.

Use for:

- terrain authoring;
- elevation overview;
- biome/height debugging;
- stylised tactical terrain.

All representations should consume the same stable semantic IDs.

---

## 4 · Camera / physical-board grammar worth preserving

Current SMA1 already provides:

- FLAT;
- TABLE;
- FLYOVER;
- POP-UP close;
- reset/pullback behavior.

This is a useful camera vocabulary for both Story and Tactical views.

Do not copy camera numbers blindly into the World runtime.

Reuse the **semantic camera roles**.

---

## 5 · Ink / no-Ink is a useful presentation switch

Current board supports two meaningful edge readings:

### OUTLINE / TUSCHE

KFB ink-band presentation through the current ink canon.

### SHADOW

No drawn ink; pieces lift slightly and physical shadows / dark side walls create separation.

This is useful for future map modes because World/Tactical may need:

- KFB papercraft ink;
- cleaner toy-board view;
- source/debug view.

Do not force ink into the playable 3D world geometry.

Treat it as a representation profile.

---

## 6 · The Voxel/relief proof is directly relevant to World Authoring

The StoryMap does **not** reuse the old procedural voxel field as if it understood map data.

Instead it builds its own map-derived raster and only reuses compatible donor concepts.

Important current pattern:

1. rasterize the same source country polygons;
2. preserve water as empty cells;
3. compute coast distance with a two-pass chamfer transform;
4. derive stepped terrain from that distance;
5. use one `InstancedMesh`;
6. use a D6 height quantum:
   `heightStep = cell / 6`.

Current real elevation hook:

`VOX.elevationAt`

exists but is currently `null`.

So current relief is **coast-distance-derived**, not factual elevation.

This is an excellent donor for the proposed World concept:

`terraceLevel = 0..5`

where gameplay/state may remain discrete while presentation may later render:

- hard voxel terraces;
- rounded terraces;
- smooth terrain;
- animated transitions between them.

Do not treat coast-distance relief as real topography.

---

## 7 · Water architecture: reuse the separation, not the current look

Current StoryMap water has one valuable architecture:

**one map-owned wet-mask truth**.

The same source polygons produce:

- land mask;
- lake holes;
- water cells;
- water geometry.

The shader does **not** decide geography.

Current source-locked shader:

`kfb-fluid-v2/card-zone-v2-fluid-source.js`

is correctly wired programmatically.

However:

**the visual water result is unresolved and Georg reports it as effectively flat / wrong.**

Known current facts:

- source-lock parity is programmatically proven;
- water mesh reaches the GPU;
- textures load;
- no shader compile error;
- current source donor intentionally disables its foam term;
- the dark palette/tone mapping may make remaining modulation visually weak;
- automated hidden-tab testing froze/throttled the render loop and cannot prove animated appearance.

Worldbuilding rule:

**reuse wet-mask / geometry / flow separation. Do not promote the current StoryMap water appearance as KFB World water canon.**

Water look stays a separate human-visible shader gate.

---

## 8 · Ripple is already a useful Surface-FX donor

SMA1 already has one non-destructive radial ripple derived from existing Travel/card-wave mathematics.

It:

- starts from a selected semantic piece;
- alters top-face presentation only;
- decays;
- restores source geometry;
- does not change canonical geography.

This is a good donor for the World preflight's first expanding Surface-FX event.

Do not invent a new FX engine for the Flat/Sphere/Torus proof.

Adapt the event semantics to the Surface Adapter rather than copying country-mesh assumptions.

---

## 9 · BoardGameBits / standees belong in the KFB world-toy vocabulary

SMA1 already proves source-backed KayKit BoardGameBits as physical map figures.

Current verified family includes examples such as:

- meeples;
- pawns;
- D4 / D8 / D20;
- flags;
- small buildings.

The pieces are attached to the semantic country root so presentation transforms remain coherent.

Related existing donor:

`tools/world_atlas/source/KayKit_Domino_Run_S9.html`
+
`tools/world_atlas/source/lib/domino-rig.js`

That donor already proves:

- real KayKit domino source assets;
- measured standing transform;
- measured contact trigger;
- real toppling dynamics;
- branching domino chains.

Recommendation:

Create a reusable **World Toy Props** vocabulary later, consuming existing source assets/modules:

- card standees;
- KFB cards;
- meeples/pawns/flags;
- dice;
- houses/buildings;
- domino chains;
- hourglass;
- signs/books/other physical props.

These can appear both:

- on Tactical/Story maps;
- physically inside KFB Town/Open World;
- as mini-game/event props.

Do not create a StoryMap-only duplicate prop library.

Every new asymmetric prop still follows Source Object Inspector first.

---

## 10 · Tactical Map / meta-navigation recommendation

A Tactical Map can become an optional physical meta-layer over the Open World.

Example uses:

- show current location;
- show discovered Race routes;
- show active mini-games;
- show portals/instance entrances;
- show residents/events/cards;
- preview destination mood/biome;
- select or inspect a destination;
- optionally trigger travel only when the receiving World owner supports it.

For the Racer analogy:

a Race can appear as a physical card/token/route on the Tactical Map, but the Race itself remains a real world/instance route with Race-owned movement.

Do not turn KFB into a disconnected Mario-Kart-style menu unless a specific game mode intentionally wants that.

---

## 11 · StoryMap project data and World data

The old Storytelling Maps planning already proposes a declarative `StoryMapProject`.

Do not merge that blindly into World Recipe.

Recommended boundary:

### World Recipe owns

- geographic/world zone identity;
- surface address;
- routes;
- portals;
- instance anchors;
- persistent world state;
- biome/environment references;
- source asset references.

### Story/Tactical manifest owns

- camera beats;
- reveal order;
- captions;
- map-piece presentation transforms;
- temporary VFX;
- selected tokens/cards;
- narration timeline.

The Map manifest references World IDs.

It does not fork them.

---

## 12 · Theatre Curtain is a transition module, not Map rendering

Current existing owner:

**KFB Game Dev Studio**

Current candidate:

- Draft PR #114;
- branch `chat/gds-theatre-curtain-v1-2026-09-20`;
- current PR head checked 2026-09-22: `cd9c04cbf009b1211b9b6b008162b9d322d6e152`;
- tested runtime head: `3bdfdd2e9de648871102d91c89612a5b7ee3c4ab`;
- fixed Stage:
  `https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`;
- automated evidence: 22/22 local + 25/25 public.

Current v1 already has:

- two physical cloth panels;
- CPU Verlet/WebGL simulation;
- structural/shear/bend constraints;
- weighted hem;
- repeated top attachments;
- rail/rings;
- physical open/close gathering;
- deterministic wind;
- impact;
- four real KFB fabric sets;
- reusable API.

Do not create another curtain in StoryMap, World, Race or Dungeon.

---

## 13 · Georg human curtain direction · 2026-09-22

Current product decision:

**KEEP the Theatre Curtain module as the transition foundation. Do not restart it.**

Current visual gate is **NOT accepted as finished**.

Required next visual work:

1. change the opening grammar from mostly top-rail side gathering toward a more recognisable **theatre lower-third tieback / swag**;
2. ideally add a visible cord/tieback mechanism;
3. investigate/remove unnatural line/crease artifacts visible during strong cloth bending/gathering;
4. only after cloth geometry/motion reads correctly, explore an older worn theatre fabric look;
5. aging may later include restrained wear/burn-hole ideas, but must not hide geometry defects;
6. optional KFB 3D wordmark may hang/sway in front as a separate world/stage object.

This is a visual/physics refinement of the existing cloth engine.

It is not a new curtain runtime.

---

## 14 · Curtain in the MVP

The current Playable MVP brief already includes Theatre Curtain Core for loading/entry/reveal.

Keep that requirement.

Recommended first MVP use:

`outer world → curtain cover → load/prewarm instance → reveal → mini-game → curtain cover → restore world state → reveal`

Possible later consumers:

- Race start/reveal;
- Dungeon/minigame entry;
- Combat raid intro/outro;
- Story/Tactical map reveal;
- card/cutscene transition.

Consumer owns:

- loading;
- pause/resume;
- router/instance state;
- save state;
- audio.

Curtain owns:

- cloth;
- transition state;
- optional presentation text;
- impulse/fabric behavior.

---

## 15 · What World Building should take now

Bring into the World Building preflight/source matrix:

### REUSE / ADAPT

- canonical geography vs presentation-transform separation;
- map-derived raster as shared mask basis;
- D6 height quantization / terrace semantics;
- coast-distance relief as a stylised fallback, clearly not factual elevation;
- one semantic wet-mask truth;
- ripple as a reusable first Surface-FX donor;
- Ink / Shadow as representation profiles;
- BoardGameBits and Domino donors as World Toy Props;
- camera-role vocabulary.

### RESEARCH / LATER

- Tactical Map as another representation of World Recipe;
- hierarchical Europe → local city/zone drilldown;
- card/standee-based event navigation.

### DO NOT PROMOTE

- current StoryMap water look;
- coast-distance relief as real elevation;
- StoryMap as second OSM runtime;
- StoryMap as second World owner;
- new curtain runtime.

---

## 16 · One future Story/Tactical integration gate

After the World Recipe / Surface Adapter preflight exists, a later bounded proof should render **the same tiny World fixture** two ways:

1. playable World view;
2. physical Tactical/Story board view.

Same IDs:

- seven Hex cells;
- route;
- prop;
- destination/event node;
- Environment Profile reference.

The Tactical view may raise/animate pieces and show tokens/cards.

The World view remains playable.

Changing map presentation must not alter the World Recipe.

That is the clean proof that Storytelling Map and Worldbuilding share data without becoming the same renderer.
