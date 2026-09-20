# KFB Cartoon Map Board · Tactical Game Map v1

Status: **PLANNING / DONOR AUDIT COMPLETE · IMPLEMENTATION NOT STARTED**  
Date: 2026-09-20  
Owner: KFB Cartoon Map Board presentation/story layer  
Integration lead: WSA / Race  
Public Stage baseline: `https://kayfabizarro.pages.dev/kfb-hub/stage/cartoon-map-board-p02/`

## Goal

Extend the Map Board from a geographic presentation surface into a reusable KFB tabletop / satirical tactical-game presentation layer without creating a second world, physics, Card or asset owner.

Target capabilities:

- KayKit Board Game Bits as the physical tabletop grammar;
- portrait / landscape media standees for info boards, public figures, politicians, photos and other story actors;
- colored player stands as physical bases;
- RPG dice rolls as story events;
- dice-to-standee collision reactions;
- KFB squash/stretch, hop, wobble, recoil and knockdown motion;
- later use on Europe, Near East, city, region and world maps.

The mechanics are content-neutral. Story/media data decides what a standee depicts; the engine does not rank, score or endorse political actors.

## Exact source donors

### KayKit BoardGameBits · primary visual donor

Source root:

`media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/`

Verified useful source objects:

**Stands**
- `playerstand.gltf`
- `playerstand_blue.gltf`
- `playerstand_green.gltf`
- `playerstand_purple.gltf`
- `playerstand_red.gltf`
- `playerstand_yellow.gltf`

**Player cards**
- `playercard_knight_{blue|green|red|yellow}.gltf`
- `playercard_barbarian_{blue|green|red|yellow}.gltf`
- `playercard_mage_{blue|green|red|yellow}.gltf`
- `playercard_rogue_{blue|green|red|yellow}.gltf`
- skeleton playercard variants

Measured donor example:

`playercard_knight_red.gltf`
- outer card bounds: approx. 1.20 × 1.50 × 0.10 local units;
- two material primitives;
- board/card frame uses the shared BoardGameBits texture;
- portrait art is a separate second material/texture primitive.

This makes the donor especially useful: a KFB adapter can replace only the portrait/material texture while retaining the actual KayKit card geometry and frame instead of rebuilding a generic card.

**Dice already present in KayKit**
- D4: blue / green / red / yellow
- D6 A/B/C: colored variants
- D8: blue / green / red / yellow
- D20: blue / green / red / yellow

Important inventory result:

**This KayKit pack does not contain D10 or D12 GLTFs.**

Therefore "all RPG dice types" must not be claimed from KayKit alone.

### 3d-dice · physics / missing-die donor

Preferred Three.js-compatible donor:

`3d-dice/dice-box-threejs@6945e0068eae27f22acd26debdb70f6ef2fd6063`

- MIT;
- Three.js + Cannon ES;
- explicit geometry / Cannon-shape generation;
- supports d2, d4, d6, d8, d10, d12, d20;
- d100 result handling is present;
- supports predetermined results.

Related theme source:

`3d-dice/dice-themes@0e166e5cd927a1f0a0581f2460a865b134ef1d9e`

Repository license: MIT. Preserve any per-theme / asset provenance when selecting a concrete theme.

Do **not** blindly embed the full `dice-box-threejs` runtime into the current Map Board: the donor pins an older Three.js generation than the current KFB Map Board. First isolate the donor and either:
1. adapt its Cannon/polyhedron/result logic behind a KFB compatibility seam; or
2. prove a version-safe encapsulated integration.

The BabylonJS/AmmoJS `3d-dice/dice-box` package is a useful reference but is not the preferred direct donor for this Three.js map runtime.

### KFB motion canon

`skills/kfb-cartoon-animation_v2.md`

Use its mandatory choreography:

`cause → anticipation → action → impact → follow-through → recovery`

No permanent random wobble. No generic particle/easing noise.

## Required donor-first proof

Before integration, the next runtime slice must show the exact source objects **in isolation**:

1. one colored `playerstand_*.gltf`;
2. one original `playercard_*.gltf`;
3. one original KayKit D20;
4. one 3d-dice / Cannon result or geometry proof separately.

A loaded URL or hidden asset reference is not enough.

Only after the isolated source objects are visibly proven may the adapted actor be shown.

## Tactical actor model

### Standee actor

```ts
type KfbStandeeActor = {
  id: string
  anchor: GeoAnchor | WorldAnchor
  baseAsset: PlayerStandAsset
  cardAsset: PlayerCardAsset
  orientation: 'portrait' | 'landscape'
  media: MediaSurface
  collider: StandeeCollider
  motion: StandeeMotionState
  storyRole?: string
}
```

Composition:

```text
StandeeRoot
├── exact KayKit playerstand
├── exact KayKit playercard geometry
│   ├── original KayKit frame material
│   └── replaceable front-media material only
├── collider proxy
└── motion/deformer root
```

### Media surface

The separate card-art primitive is the adaptation seam.

Supported future content:
- info graphic;
- photo;
- public figure / politician image;
- KFB Card thumbnail;
- evidence/source image;
- diagram.

Portrait is the native donor orientation.

Landscape candidate:
- rotate the actual card geometry 90°;
- remap/crop the media texture;
- adjust card height/stand socket placement;
- visually prove fit before accepting.

Do not introduce a newly modeled generic card until the rotated donor approach has been tested and rejected.

## Standee motion grammar

### Hop / move

Use the KFB Jump family:

```text
cause
→ anticipation squash
→ launch
→ vertical stretch
→ short ballistic arc
→ landing preparation
→ squash/contact
→ card/base follow-through
→ settle
```

The base is the ground-contact owner. The card may lag slightly behind the base during launch/landing to sell cardboard flexibility.

### Idle

Allowed:
- very rare tiny card settling;
- subtle authored breathing-like flex only when semantically needed.

Forbidden:
- constant bobbing;
- random rotation;
- permanent attention-seeking animation.

### Dice impact

Collision is first physical, then cartoon-staged.

Proposed response family:

```text
small impulse
→ tilt / wobble
→ damped settle

medium impulse
→ recoil + base skid / short hop
→ overshoot
→ wobble
→ settle

large impulse
→ decisive tilt
→ loss of support
→ knockdown / topple
→ one bounce
→ settle
```

Thresholds must be derived from normalized impulse relative to actor scale/mass during the POC. Do not freeze arbitrary world-unit values in planning.

Use impact point and direction so the reaction follows the actual die contact.

## Dice actor model

```ts
type KfbDiceActor = {
  type: 'd4'|'d6'|'d8'|'d10'|'d12'|'d20'|'d100'
  color: 'blue'|'green'|'red'|'yellow'|string
  visualSource: 'kaykit'|'3d-dice'
  body: PhysicsBody
  result?: number
  storyCue?: string
}
```

Visual rule:
- prefer exact colored KayKit dice where the type exists;
- use the pinned 3d-dice donor for missing types / result geometry after source isolation;
- keep KFB color/material treatment consistent.

Physics rule:
- Cannon/convex geometry or a proven equivalent owns collision;
- Three.js mesh follows the physics body;
- impact events are emitted to KFB motion, not hardcoded directly into standee transforms.

## Impact event seam

```ts
type TacticalImpactEvent = {
  sourceId: string
  targetId: string
  point: Vec3
  normal: Vec3
  relativeVelocity: Vec3
  impulse: number
  timestamp: number
}
```

Pipeline:

```text
die physics collision
→ normalized impact event
→ standee response classifier
→ KFB choreography
→ recovery
```

This seam lets later non-dice events reuse the same wobble/knockdown logic.

## Info boards / overlays

Info boards should use the same physical standee family, not a second UI object system.

Map state:

```text
INFO BOARDS OFF
→ geographic map only

INFO BOARDS ON
→ selected declarative standees appear at geographic anchors
```

On click:
- board pops up from its base;
- card art/material becomes visible;
- camera may optionally frame it;
- second click / close returns it to the board.

For dense mobile views, only selected/priority standees should expand; do not recreate the current label pile-up with 3D cards.

## Near East follow-up

The planned Near East demo should consume this tactical-prop layer rather than inventing special conflict-zone UI.

Recommended first story proof after this tactical lab:

```text
Near East map
→ conflict overlay ON
→ click one zone
→ one standee/info board rises
→ roll one D20
→ D20 collides with a neutral demo standee
→ standee visibly wobbles or topples from actual impact
→ recovery/reset
```

Political/media content is data; the physics/motion proof should first use neutral source art or an explicitly supplied image so mechanics can be accepted independently of editorial content.

## Bounded implementation ladder

### T1 · exact donor isolation

Stage page shows:
- playerstand_red;
- playercard_knight_red;
- D20_red;
- 3d-dice physics/geometry donor;

each alone, labeled with exact source path/revision.

**Done when:** source objects are visibly identifiable and not substitutes.

### T2 · media standee adapter

- exact playercard geometry;
- original frame retained;
- front art material replaced by one controlled media texture;
- portrait + rotated-landscape A/B;
- exact playerstand base.

**Done when:** media replacement changes only the intended front surface.

### T3 · standee motion

- hop;
- landing squash/stretch;
- impact wobble;
- full recovery.

**Done when:** playback visibly follows the KFB motion sequence and returns to a stable state.

### T4 · D20 collision

- one KayKit D20;
- Cannon-based throw;
- collision event;
- standee wobble / knockdown response.

**Done when:** response direction and magnitude depend on the measured collision, not a scripted timer.

### T5 · RPG dice set

- KayKit for D4/D6/D8/D20;
- pinned 3d-dice donor for D10/D12 and percentile support;
- one unified roll/result API.

### T6 · Map integration

Only after T1–T5:
- tactical props on the Map Board;
- mobile/landscape density rules;
- Near East story demo;
- conflict overlays;
- info-board on/off.

## Protected boundaries

No:
- second Map/World runtime;
- second KFB Card renderer;
- second asset registry;
- replacement of KayKit source geometry with generic stand-ins;
- new global physics owner for Race/Travel;
- automatic political scoring/ranking;
- Live promotion before the named human gate.

Map Board owns only tabletop presentation/story interactions inside its own Stage experiment.

## Exactly one next gate

**T1 · exact donor isolation page**: visibly prove KayKit playerstand + playercard + D20 and the pinned Three/Cannon dice donor separately before any combined tactical actor is built.
