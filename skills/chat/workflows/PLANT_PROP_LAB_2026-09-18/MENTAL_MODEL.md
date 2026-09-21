# KFB Plant Prop Lab · Mental Model

**Status:** PROPOSAL / AUTHORING MODEL · no shared runtime contract promoted yet.

## 1 · Core idea

Treat a plant object as a **small reconstructible scene recipe**, not as one permanently fused GLB.

```text
Canonical source refs
  → PlantRecipe
    → Container
    → Plant contents
    → Styling
    → Prop rig
    → optional LivingProp layer
      → Consumer placement
```

Original GitHub assets remain unchanged.

## 2 · PlantRecipe

Suggested candidate shape:

```json
{
  "schema": "kfb.plant-prop.recipe/0.1-candidate",
  "id": "alien-planter-spiral-01",
  "seed": 1842,
  "sources": {
    "pot": {"repo":"georg-doc/kayfabizarro","path":".../pot_C_large.gltf","revision":"..."},
    "saucer": {"repo":"...","path":".../saucer_A_large.gltf","revision":"..."},
    "plants": [
      {"repo":"...","path":".../Tree_Spiral_2.gltf","revision":"..."}
    ]
  },
  "slots": {
    "potRoot": {},
    "soilAnchor": {},
    "plantRoots": [],
    "eyeAnchor": null
  },
  "style": {},
  "rig": {},
  "living": null
}
```

This is a local candidate schema until a receiving consumer proves what fields are actually necessary.

## 3 · Slots / transform hierarchy

Minimal hierarchy:

```text
PlantPropRoot
├─ PotRoot
│  └─ Saucer(optional)
├─ PlantRoot[]
│  └─ plant source
├─ RigRoot
│  └─ procedural pivot groups
└─ LivingOverlay(optional)
   └─ EyeRig / later face modules
```

Important:
- Pot and plant keep source identity.
- Plant insertion depth is a recipe transform, not baked into source geometry.
- Scaling a landscape specimen scales the composition intentionally; keep collider/support policy explicit.
- Multiple plants can share one pot or a cluster of pots can share one scene kit.

## 4 · Scale classes

Candidate semantic classes:

- `TABLETOP` — normal prop scale.
- `ROOM` — large indoor plant.
- `GARDEN` — outdoor oversized plant.
- `LANDMARK` — intentionally giant potted tree / alien botanical.
- `PROJECT_ISLAND` — platformer / hub scenic landmark.

Scale class is presentation metadata; exact numeric scale remains measured per recipe.

Crazy-Cat rule:

> An ordinary houseplant may appear at landscape scale in a giant matching pot without pretending it is a biological tree species.

## 5 · Prop rig instead of forced skeleton rig

Many source plants are rigid static meshes. Do not re-rig every mesh with bones before the idea is proven.

First rig is transform-based:

```text
root
→ pot rigid
→ plant pivot
  → optional crown/branch pivots
```

Inputs:

- time / idle sway;
- wind vector;
- player proximity;
- impact impulse;
- interaction event;
- audio amplitude later if desired.

Outputs:

- small rotation;
- bounded bend proxy;
- squash/stretch of a wrapper group;
- pulse;
- recoil and settle.

If a source is later decomposed into meaningful leaf/stem parts, an explicit part-rig may replace or extend the wrapper. That is a derived asset/package, never a silent rewrite.

## 6 · LivingProp / EyeRig layer

Use the existing public KFB eye implementation:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Do **not** fork or redraw the eye system for plants.

EyeRig v6 expects a host with a measurable body surface. Therefore Plant Prop Lab needs a thin adapter:

```text
PlantRecipe
→ authored/derived FaceHost or EyeAnchor
→ existing EyeRig v6
```

Possible host strategies, in order:

1. explicit authored `eyeAnchor` + small invisible/transparent face-host geometry;
2. measured plant crown bounding volume + generated ellipsoid/plane host;
3. exact named mesh/socket if a source happens to provide one.

Do not assume the source plant mesh itself is a suitable face surface.

The living layer owns presentation only. It may read:
- pointer/player direction;
- proximity;
- wind;
- movement/impact state.

It does not own world position, collision, gameplay health or Combat semantics.

### Living levels

```text
L0 STATIC
L1 AMBIENT       sway / pulse
L2 AWARE         eyes / gaze / blink
L3 EXPRESSIVE    brows / mouth / emotes if explicitly mounted
L4 INTERACTIVE   response to player / pickup / dialogue hook
L5 CHARACTER     only after a real consumer grants character semantics
```

Do not call every eyed plant a full Resident.

## 7 · Pattern / pot style model

Source pots use a shared texture/material. The style layer should be non-destructive.

Candidate `PotStyleRecipe`:

```text
paletteId
baseColor
projectionMode
bands[]
motifs[]
seed
roughness
accentStrength
rimPolicy
saucerPolicy
```

Projection strategies:

### UV mode
Use existing UVs if stable and visually useful.

### Cylindrical analytic mode
For pot-local position `p=(x,y,z)`:

```text
u = atan2(z,x) / TAU
v = normalized height
```

Then generate:
- horizontal bands;
- diamonds;
- zigzags;
- dots;
- scallops;
- stripe fields;
- radial/simple sun motifs.

This can be implemented with shader math or generated CanvasTexture; choose the lighter compatible approach after inspecting the consumer.

### Triplanar fallback
Useful for non-pot derived containers without good UVs.

Do not destructively repaint the source texture.

## 8 · KFB color / lighting coherence

Plant Prop Lab should not invent a standalone palette detached from World.

Create a small palette bridge:

```text
EnvironmentPalette
→ PlantPalette
  base / foliage / pot / accent / highlight
→ LightingCalibration
  daylight / sunset / night
```

Principles:
- preserve readable separation from terrain;
- avoid tinting every asset into one flat color;
- use stronger pot accents than foliage where appropriate;
- keep alien plants visually related to KFB but visibly “other”;
- verify under TinySkies-like day/night/light conditions and indoor/dungeon lighting later.

## 9 · Generator grammar

Like Dungeon Generator, separate **grammar** from **rendered instance**.

Generator inputs:

- seed;
- pot family;
- size class;
- plant source family;
- plant count;
- insertion depth;
- scale range;
- pattern family;
- palette;
- living level;
- placement class.

Generator output:

`PlantRecipe`

Rules/examples:

```text
normal house plant:
  pot + one conventional plant + quiet palette

alien garden:
  large pot + Tree_Spiral / Blob / Spikes + saturated accents

crazy-cat landmark:
  LANDMARK scale + giant pot + one familiar houseplant

cluster:
  2–5 pots + varied sizes + one accent alien specimen

living prop:
  any valid recipe + EyeAnchor + LivingOverlay
```

A seed must reconstruct the same recipe.

## 10 · Placement contract

A consumer places the **PlantPropRoot**.

Plant Lab may expose:

- support footprint;
- approximate obstacle/collider proxy;
- interaction anchor;
- eye/look target anchor;
- optional clearance radius;
- LOD/instancing hint.

It must not independently write Travel terrain/support physics.

For giant pots in landscapes:
- support surface belongs to World/Travel consumer;
- placement must not create hidden walkable platforms unless explicitly registered;
- eye/look updates remain presentation.

## 11 · Relationship to Game Dev Studio

Plant Prop Lab supplies recipes and measured source facts.

Game Dev Studio may package an accepted plant recipe as:

```text
GameReadyPlantPackage
  source refs
  recipe
  derived collider proxy
  rig adapter
  EyeRig adapter
  style/pattern recipe
  VFX/SFX hooks
  consumer test evidence
```

This becomes a new package type only after the existing Game Dev Studio Pilot 01 remains intact. It must not distract from or overwrite Lorekeeper + Sedan Pilot 01.

## 12 · Relationship to Platformer mental model

Reusable lesson from the Platformer POC:

- explicit nodes;
- explicit attachment/landing/support bounds;
- deterministic adjacency/selection;
- semantic state mapped to actor-specific presentation.

Plant equivalent:

- explicit slots;
- explicit support/clearance;
- deterministic generator recipe;
- semantic state mapped to static/rigged/living presentation.

Do not share movement code merely because the mental models rhyme.

## 13 · First proof

One page / workbench should show side by side:

1. normal Tiny Treats plant in original pot;
2. same plant in a differently styled/patterned pot;
3. Quaternius alien plant inserted into a Tiny Treats pot;
4. giant landscape-scale version;
5. one living version with EyeRig;
6. one deterministic regenerate-from-seed result.

This proves the model before a broad generator or World integration.
