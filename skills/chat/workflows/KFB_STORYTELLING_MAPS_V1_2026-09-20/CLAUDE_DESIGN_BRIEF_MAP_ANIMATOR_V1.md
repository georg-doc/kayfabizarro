# Claude Design Brief · KFB Storytelling Map Animator v1

Status: **READY FOR CLAUDE DESIGN · BOUNDED MULTI-SLICE BRIEF**
Date: 2026-09-20
Owner: **KFB Storytelling Maps / existing Cartoon Map Board**
Implementation home: `tools/kfb-cartoon-map-board/`
Planning branch: `planning/storytelling-map-animator-v1-2026-09-20`
Future Stage target: `https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/animator-v1/`

Do not claim that Stage route until the exact Cloudflare build is opened and the expected revision is visibly present.

## Read first · mandatory

Before writing code:

1. `skills/session-entry-use-what-works_v1.md`
2. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
3. `skills/chat/PRODUCTION_SOP.md`
4. `skills/chat/adapters/claude-design.md`
5. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
6. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
7. Storytelling Maps `START_HERE.md`
8. Storytelling Maps `RECOVERY.md`
9. `VISUAL_MOTION_SYSTEM_V1.md`
10. `CARD_RIG_V1.md`
11. `MAP_ANIMATOR_DONOR_MATRIX.md`
12. current Cartoon Map Board README/Recovery
13. current OSM City Lab README
14. current img2threejs Landmark Pilot 06 slice
15. Game Dev Studio Theatre Curtain v1 Return

GitHub state overrides this brief if current Return/Recovery has moved.

---

# Product goal

Build a **KFB Storytelling Map Animator** that turns real geodata into a physical, animated KFB stage.

It must support:

- world / continent / country / region / city maps;
- arbitrary GeoJSON / public boundary sources;
- normalized OpenStreetMap-derived city data;
- independent 3D map pieces;
- 3D landmarks;
- cinematic camera travel;
- puzzle / papercraft / cutout / popup-diorama presentation;
- progressive disclosure controlled by story beats;
- non-destructive VFX such as ripple, burn, bomb, hurricane, smoke, dust, shockwave and debris;
- later KFB card / PDF / standee embeds;
- one reusable declarative manifest shared by animator and runtime.

The map is not a flat background.

It is a **physical story stage**.

---

# Prime visual rule

The result must look like a coherent KFB-made physical object, not a generic Three.js demo with UI pasted around it.

Required look vocabulary:

- paper / cardboard / crafted surfaces;
- shallow physical depth;
- KFB ink / imperfect borders where appropriate;
- toy-like but spatially readable pieces;
- cast shadows;
- cutout / popup / hinged / raised pieces;
- selective surreal deformation;
- strong camera composition;
- short spectacle, then readable recovery.

Forbidden:

- generic dashboard chrome;
- unexplained black glass panels;
- default lilac/blue gradients;
- generic map tiles;
- generic extruded blocks where an existing donor already exists;
- filler labels;
- decorative stats;
- new fake KFB branding;
- SVG cloth substitutes;
- a second OSM runtime;
- a second landmark runtime;
- a second curtain runtime.

**Every visible element must pay rent.**

---

# Existing owners stay intact

## Geography / map presentation

Owner:
`tools/kfb-cartoon-map-board/`

Current Europe board already proves:

- OSM-derived country boundary delivery;
- independent extruded country puzzle pieces;
- Three.js orbit camera;
- physical shadows;
- explode / focus behavior;
- story anchors.

Do not rebuild Europe from scratch.

## Detailed city geometry

Owner:
`tools/osm-city-lab/`

Current donor datasets include:

- `ehrenfeld-v0`
- `huerth-v0`
- `dom-zentrum-v0`
- Hürth → Ehrenfeld corridor

Do not duplicate City Lab normalization, road-building, building geometry, ENU or attribution logic.

## Landmark authoring / Grotesque presentation

Owner:
`tools/img2threejs/`

Current donor:
`tools/img2threejs/landmarks/pilot-06/`

Current landmark direction:

- Grotesque is the **landmark-lane default**;
- OSM City Lab is the default review environment;
- world owner still controls the environment;
- landmark-specific cartoon palettes remain local.

Do not silently turn all OSM buildings into Pilot-06 landmarks.

## Theatre Curtain

Owner:
**KFB Game Dev Studio**

Existing separate candidate:

- Draft PR #114
- branch `chat/gds-theatre-curtain-v1-2026-09-20`
- runtime `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`
- fixed Stage `https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

The Animator **consumes** this module later.

It must not clone/rebuild it.

---

# Data model

The Animator must be data-driven.

Candidate:

```ts
type StoryMapProject = {
  id: string
  seed: string
  source: MapSourceSpec
  hierarchy?: MapHierarchyNode[]
  pieces: MapPieceSpec[]
  landmarks: LandmarkSpec[]
  timeline: StoryBeat[]
  camera: CameraPreset[]
  palette?: PaletteSpec
  sky?: SkySpec
  sources: SourceRecord[]
}
```

## MapSourceSpec

Support adapters, not one hardcoded map:

```ts
type MapSourceSpec =
  | { kind:'geojson', url:string, attribution:string }
  | { kind:'openplanet-boundaries', scope:string }
  | { kind:'osm-city-lab', datasetId:string }
  | { kind:'local-manifest', path:string }
```

The source adapter owns loading/translation only.

The map animator never edits the factual source geometry in-place as if presentation were data truth.

---

# Map-piece contract

Every country / region / zone that is treated as a puzzle piece gets a stable semantic root.

```text
MapPieceRoot
├── sourceGeometry       ← factual outline
├── fillSurface
├── sideWall
├── ink/border
├── contentAnchors
├── landmarkAnchors
├── transformRig
└── fxAttachment
```

Each piece stores:

- source id;
- source geometry hash/ref;
- canonical local position;
- canonical rotation;
- canonical elevation;
- presentation transform;
- deformation state;
- visibility state;
- semantic anchors.

## Absolute rule

**Semantic geography and presentation transform are separate.**

A country may fly away, wobble, tilt, fold or explode visually.

Its source identity / hierarchy / authored anchor position does not change unless the project explicitly edits data.

---

# Puzzle / papercraft grammar

The map should support multiple physical readings of the same source geometry.

## FLAT

Thin paper/card layer.

Use for:
- overview;
- geographic clarity;
- quiet narration;
- dense labels.

## BOARD

Current Cartoon Map Board reading:
- shallow extrusion;
- cast shadows;
- independent tiles;
- tabletop camera.

## PUZZLE

Visible gaps / seams between pieces.

Actions:
- separate;
- slide;
- rotate;
- reassemble;
- shuffle;
- lock back into canonical location.

## POP-UP

Selected map elements hinge or rise out of the board.

Examples:
- landmark stands up;
- mountain/structure unfolds;
- location panel rises as cardboard;
- building cluster lifts as a shallow diorama.

## CUTOUT

2D image / illustration cutouts mounted into the world.

Use existing CardRig / media rules:
- no ugly rectangular image corners where a physical cutout is required;
- real alpha/silhouette or real rounded card surface;
- physical shadow;
- thin but non-zero depth when appropriate.

## DIORAMA

Small local 3D set appears above/inside a geographic piece.

Examples:
- one city block;
- one landmark scene;
- one battle/incident vignette;
- one absurd KFB mini-scene.

Diorama does not become a second world runtime.

---

# View / camera modes

Camera states are semantic presets.

Required families:

## FLAT VIEW
Near orthographic / high top-down.

Purpose:
- map readability;
- labels;
- edit mode;
- source inspection.

## TABLE VIEW
Oblique physical-board view.

Purpose:
- puzzle / card / standee feel;
- visible shadows and depth.

## FLYOVER
Low cinematic travel over the map.

Purpose:
- route narration;
- crossing borders;
- world/region transitions.

## DIVE
Map → region/city/landmark.

Purpose:
- hierarchical drilldown;
- handoff to OSM City or local diorama.

## POP-UP CLOSE
Frames a raised landmark/card/papercraft element.

## IMPACT ORBIT
Very short controlled arc around an event.

## RESET / PULLBACK
Return to readable geography after spectacle.

Responsive behavior remains semantic:
- wide screen = more lateral/oblique;
- portrait = more top-down / tighter;
- mobile landscape must remain directly usable.

---

# Map animation vocabulary

The Animator needs reusable semantic actions.

```text
SHOW
HIDE
ADD
REMOVE
DRAW
FILL
UNFILL
RAISE
LOWER
STAND_UP
LAY_FLAT
SLIDE
ROTATE
FLIP
FOLD
UNFOLD
EXPLODE
ASSEMBLE
SHUFFLE
SNAP_HOME
PULSE
WOBBLE
DEFORM
RESTORE
FOCUS
DIM_OTHERS
```

Each action must have:

- duration;
- easing;
- optional anticipation;
- optional overshoot;
- recovery;
- deterministic seed where variation is decorative.

No animation preset is allowed to permanently corrupt canonical piece geometry.

---

# Progressive disclosure

Story beats control three scopes independently.

## 1 · GEOGRAPHY

Which areas are:
- visible;
- raised;
- filled;
- outlined;
- dimmed;
- exploded;
- assembled.

## 2 · STORY OBJECTS

Which:
- landmarks;
- standees;
- cutouts;
- cards;
- tokens;
- props;
- diorama objects

are visible/raised.

## 3 · INFORMATION

Which:
- labels;
- captions;
- dates;
- values;
- callouts;
- source notes

are visible.

Do not reveal all three scopes at once by default.

A useful story rhythm is:

`place → reveal → act → react → breathe → reframe`.

---

# VFX architecture

VFX is presentation punctuation.

It does not own geography.

Use a `MapFxDirector` that receives semantic events.

Candidate:

```ts
playFx({
  preset: 'ripple' | 'burn' | 'bomb' | 'hurricane' | 'smoke' | 'dust' | 'shockwave' | 'debris' | 'ink',
  target: pieceId,
  intensity: 0.0..1.0,
  seed,
  duration,
  destructivePresentation: false
})
```

## Reuse before new FX

Inspect/reuse first:

- Boxel Blitz FX foundation;
- `fx-pool.v1.js`;
- `dissolve.v1.js`;
- existing ripple systems;
- Travel ripple/fog;
- central `media/3D_Assets/FX_Visual/`.

Do not make a new particle engine unless a donor cannot satisfy a measured need.

## RIPPLE

Use for:
- event propagation;
- area activation;
- reveal from a point;
- shock response.

Can drive:
- map fill;
- ink reveal;
- local height pulse;
- outline intensity.

## BURN

Presentation layer only by default.

Possible ingredients:
- edge darkening;
- ember/smoke particles;
- progressive mask/dissolve;
- paper curl/deformation later.

Do not edit source polygons.

Do not fake burn with one CSS/SVG gradient.

## BOMB / IMPACT

Possible ingredients:
- anticipation;
- impact flash;
- shockwave;
- debris;
- local tile lift;
- wobble;
- temporary separation;
- smoke;
- recovery or authored persistent damage state.

Avoid generic screen shake spam.

## HURRICANE

Possible ingredients:
- directional vortex field;
- debris/paper strips;
- landmark sway;
- map-piece wobble/tilt;
- cloud/fog pass;
- selective piece displacement;
- recovery.

Do not animate every object identically.

## Other useful presets

- FLOOD / WAVE
- EARTHQUAKE
- INK SPILL
- FREEZE
- STORM
- TELEPORT
- PORTAL
- CONFETTI / absurd celebration
- PAPER TEAR
- DISSOLVE
- SMOKE / FOG reveal

All effects need a quiet recovery state.

---

# Deformation

Two kinds must stay distinct.

## Geographic piece transform

Rigid movement of a whole country/region:
- translate;
- rotate;
- tilt;
- scale for cinematic emphasis;
- hinge;
- stand-up.

## Cartoon deformation

Optional non-rigid presentation:
- bend;
- taper;
- twist;
- squash;
- ripple deformation.

Reuse existing KFB deformation donors where they fit.

For landmarks, current Grotesque deformation logic remains the first donor.

Do not apply building-style Grotesque deformation to country outlines without an explicit visual experiment.

---

# OSM / Cologne / Hürth / Ehrenfeld donor lane

The first useful source-backed local examples are already present.

## Hürth

Current City Lab dataset:
`tools/osm-city-lab/data/huerth-v0/`

Known current source-backed content:
- roads;
- 700 buildings;
- landuse;
- green polygons;
- water lines;
- KayKit forest POC in the presentation layer.

## Ehrenfeld

Current City Lab dataset:
`tools/osm-city-lab/data/ehrenfeld-v0/`

Known current source-backed content:
- 372 roads;
- 1,808 buildings;
- dense urban geometry.

## Hürth → Ehrenfeld corridor

Current source:
`tools/osm-city-lab/data/corridors/ehrenfeld-huerth-v0/`

Use as a later flyover / route-transition donor.

Do not re-fetch or renormalize it for the Animator unless City Lab requires it.

## Cologne Dom / Zentrum

Current source:
`tools/osm-city-lab/data/dom-zentrum-v0/`

Contains:
- cached real OSM;
- normalized local-metre geometry;
- provenance;
- design context;
- Dom/HBF/Altstadt/Rhine context.

This is the preferred real Cologne drilldown donor.

---

# Grotesque landmark lane

Use existing img2threejs work.

Current authoring donor:

`tools/img2threejs/landmarks/pilot-06/`

Current source direction:
- Grotesque = landmark authoring default;
- OSM environment = default review environment;
- Travel/TinySkies = comparison context;
- modular landmarks keep their own palette identity.

The Animator should treat landmarks as external authored assets with anchors.

Candidate:

```ts
type LandmarkSpec = {
  id: string
  source: string
  sourcePin: string
  geoAnchor?: {lat:number, lon:number}
  mapAnchor?: string
  style: 'source'|'grotesque'|'soft-cubist'|'boxel'
  scale: number
  groundMode: 'map'|'diorama'|'floating'
}
```

Do not silently fabricate a real-world position for a surreal/experimental landmark.

Mark such placements explicitly:
`STYLE_INTEGRATION_ONLY_NOT_GEO`.

---

# KFB palette / sky

Reuse existing Storytelling Maps visual-system owners.

Color:
- `world-context.js`
- `world-palettes.js`
- `color-worlds.js`

Sky:
- `skydome-shader.js`

One seed may control:
- palette variation;
- decorative map jitter;
- VFX variation;
- subtle camera variation.

It must not randomly alter:
- factual geography;
- factual labels;
- source landmark identity;
- authored story order.

---

# Cards / PDF / media

Later integration only.

Reuse:
- KFB Viewer;
- CardBuilder;
- Responsive CardRig;
- KFB Ink owner.

The Animator does not implement another PDF renderer.

Cards can:
- lie flat on the map;
- stand up;
- hinge;
- pop out;
- act as scene panels;
- become destination/info markers.

---

# Theatre Curtain · separate reusable deliverable

The curtain is **not part of the map renderer**.

It is a reusable external transition module.

Current existing candidate already provides:

```js
mountKFBTheatreCurtain(...)
curtain.update(dt)
curtain.setState('open'|'close'|'impact'|'reset')
curtain.impulse(...)
curtain.reset()
curtain.dispose()
```

## Exact source donor

Official Three.js donor:

- repo: `mrdoob/three.js`
- pinned commit: `7300402f96c23bfa2174ffc0da01fb4e277d33da`
- version: `0.186.0`
- file: `examples/webgpu_compute_cloth.html`
- blob: `0b3c18d87ac0d2428e6a558b6d09889e425dd537`

The official donor uses:
- Verlet cloth;
- fixed top vertices;
- spring constraints;
- wind;
- collision;
- real cloth mesh.

## KFB candidate

Game Dev Studio PR #114 currently provides:
- two physical cloth panels;
- rail/rings;
- side gathering;
- idle wind;
- KFB fabric maps;
- impact;
- reusable module seam;
- CPU Verlet/WebGL fallback.

Technical evidence:
- 22/22 local PASS;
- 25/25 public PASS.

Human cloth acceptance is still separate.

## Animator integration rule

Claude Design must **not** create another curtain.

Later:
`StorytellingMapAnimator → CurtainTransitionAdapter → Game Dev Studio Theatre Curtain module`.

Loading flow candidate:

```text
close curtain
→ wait closed-wind
→ load/swap map project
→ prewarm shaders/assets
→ open curtain
→ map reveal beat starts
```

If the required curtain module is unavailable:

`SOURCE MODULE FAILED`

No SVG theatre curtain.
No CSS curtain.
No replacement sheet animation.

---

# Authoring UI

The Animator is an object-first visual tool.

Preferred layout:

## Main stage
Dominant 3D viewport.

## Source strip
Compact access to:
- map source;
- hierarchy;
- landmarks;
- cards;
- props;
- FX.

## Beat rail
Ordered story beats.

Each beat can own:
- map action;
- camera;
- landmark action;
- VFX;
- caption/narration;
- lull.

## Inspector
Only for selected object/beat.

No permanent giant control dashboard.

## Playback
- play;
- pause;
- previous beat;
- next beat;
- scrub;
- reset canonical state.

## Export
Export one `StoryMapProject` / `StoryMapManifest`.

The runtime should play the same manifest.

---

# First Claude deliverable only · SMA1

Do **not** build the entire roadmap in one Design pass.

## SMA1 · Source-backed Map Piece Animator

Use:

1. current Europe Cartoon Map Board source;
2. one Hürth/Ehrenfeld/Cologne source-backed reference panel;
3. one existing Grotesque landmark source shown in isolation.

### Required visible proof

A. exact existing Europe Map Board donor visible in isolation;

B. exact one country piece visible separately;

C. same piece demonstrates:
- FLAT;
- TABLE;
- RAISE;
- STAND_UP;
- SLIDE;
- ROTATE;
- EXPLODE / separate;
- SNAP_HOME / assemble;

D. camera:
- flat;
- table;
- flyover;
- pop-up close;
- reset;

E. one existing landmark source object shown in isolation, then anchored to the selected piece;

F. one **RIPPLE** effect only, sourced from existing KFB FX logic;

G. canonical-state reset proves every spectacle returns to the correct map position.

### Explicitly deferred from SMA1

- burn;
- bomb;
- hurricane;
- full particle library;
- PDF/card integration;
- FrizzleBob;
- standee animation;
- multiplayer;
- full editor;
- Odyssey;
- Near East content;
- curtain integration;
- custom shader suite.

Those are roadmap items after SMA1 visual acceptance.

---

# SMA2 · FX + progressive disclosure

After SMA1 acceptance:

- FILL / UNFILL / DRAW / HIDE;
- ripple reveal;
- burn;
- bomb;
- hurricane;
- smoke/dust/debris;
- one VFX recovery test;
- effect presets stored in manifest.

---

# SMA3 · OSM city + landmark drilldown

After SMA2:

`Europe → Germany → Cologne/Hürth/Ehrenfeld → landmark/diorama`

Use current City Lab outputs, not a second city generator.

Prove:
- hierarchy transition;
- map-to-city flyover;
- one real source-backed landmark;
- one explicit surreal landmark placement;
- return to higher-level map.

---

# SMA4 · Papercraft / popup diorama

Prove:
- hinge;
- popup landmark;
- cutout;
- small 3D diorama;
- paper/contact shadow;
- fold/unfold;
- canonical recovery.

---

# SMA5 · Theatre Curtain adapter

Only consume the separate Game Dev Studio module.

Do not edit the curtain runtime inside the Animator.

---

# Acceptance requirements

For each implemented slice:

- source object screenshot **before** integration;
- integrated screenshot;
- desktop;
- mobile landscape;
- at least one oblique camera;
- exact repo/branch/head;
- exact donor revisions;
- actual browser test count;
- 0 hidden fallback assets;
- unresolved items;
- exactly one next gate.

## Visual pass questions

1. Does the map still read geographically?
2. Do pieces feel physically separate when intended?
3. Do transitions feel authored rather than generic?
4. Does the papercraft treatment read as one coherent world?
5. Does spectacle recover cleanly?
6. Is the landmark visibly the real donor?
7. Is the UI smaller than the scene?
8. Is anything visible that does not carry action, state or KFB identity?

---

# Failure rules

If a required donor fails:

Show:
`SOURCE ASSET FAILED`

Do not substitute generic geometry.

If two repair passes fail the same visual gate:
- freeze candidate;
- export code/state/evidence;
- use Claude failure-recovery template;
- stop.

Do not patch the patch.

---

# Exactly one next gate

**SMA1 only: prove the existing Europe Map Board as a reversible animated puzzle-piece stage with flat/table/flyover/stand-up views, one real Grotesque landmark donor and one reused ripple effect — all returning cleanly to canonical geography.**
