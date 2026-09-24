# KFB Elastic Grotesque Clay v1 · Style Contract

## One-line target

**Wonky 90s-cartoon spatial grammar rendered as a rounded, tactile, hand-built clay/model world.**

## Reference roles

### Spatial / architectural grammar
Use the **crooked / non-parallel / bent / staged** background logic associated with 90s cartoon environments and Georg's Polly/expressionist reference direction.

This does **not** mean Gothic decoration.
This does **not** mean cubist fragmentation.

### Material / object feel
Use a **handmade clay-model / stop-motion maquette** feeling:
- matte;
- high roughness;
- softly rounded;
- tiny controlled surface irregularity;
- painted rather than photorealistic;
- visible contact/grounding;
- no sterile CGI plastic.

## Four independent layers

### 1. SPACE
- skewed composition;
- imperfect parallelism;
- coherent block-level pull/bend;
- perspective exaggeration may be added later as a camera layer;
- never use random per-object noise as the spatial author.

### 2. VOLUME
- rounded silhouette corners;
- continuous lean/bend/taper/belly/twist;
- chunky primary masses;
- roof as semantic cap/module;
- avoid sharp stacked vertical discontinuities for the candidate style.

### 3. DETAIL
- windows, doors, glazing, signs and card/image planes are protected identity zones;
- re-project/re-attach details after primary deformation;
- do not blur UV/material boundaries to create softness.

### 4. SURFACE
- matte clay / painted model;
- restrained micro-bump;
- subtle variation;
- no realistic scan textures required for the first proof;
- no strong Cel/outline dependency.

## Asset-class interpretation

### Ordinary OSM buildings
`OSM footprint → simple collision shell → separate elastic presentation shell`

Initial semantic classes:
- DETACHED
- ROW_HOUSE
- URBAN_BLOCK
- GARAGE / SECONDARY

### Landmarks
Use semantic bands/modules, not generic building deformation.
The accepted Dom remains a hero donor and later Golden Sample.

### Billboards / props
- board/frame/supports may become rounded, chunky and slightly bent;
- display/card plane remains protected and planar.

### Vehicles
Static toyification is separate from dynamic response:
`STATIC SHAPE STYLE + EXISTING VEHICLE CARTOON DEFORMER`

Protect windows, lights, wheels and UV/material seams.

## Candidate deformation grammar

For normalized height `t ∈ [0,1]`:

```text
offset(t) =
  coherentBlockPull * smoothstep(t)
  + authoredLean * smoothstep(t)
  + softBend * sin(πt)

scale(t) =
  1
  + belly * sin(πt)
  - taper * smoothstep(t)

twist(t) =
  authoredTwist * smoothstep(t)
```

All channels are bounded and deterministic.

## Anti-goals

Reject:
- cubist/faceted massing as candidate default;
- hard ring-to-ring jumps;
- bevel-everything;
- subdivision-plastic;
- random distortion;
- Gothic-theme dressing on ordinary houses;
- neon as a substitute for form;
- photoreal PBR micro-detail;
- destructive source edits.

## Clay surface baseline

First proof:
- roughness approx. 0.85–0.98;
- metalness near 0 for ordinary painted architecture;
- broad key + soft fill;
- soft contact shadow;
- low-amplitude procedural bump/noise;
- gentle warm/cool material variation.

Lighting is supportive evidence only in Hürth 01.
The acceptance target remains **form language first**.

## Hürth 01 hard visual gates

1. No building reads as a faceted crystal.
2. No random deformation destroys street coherence.
3. Real building type remains readable at game distance.
4. Silhouette feels rounded, chunky and drawn/modelled.
5. CLEAN mode reveals the same geographic/source world.


## Accepted benchmark + v2 translation

Georg accepted the benchmark shape language and requested a more explicit cartoon palette while preserving the handmade-clay substrate.

### Group deformation rule
The block warp is a low-frequency field shared by neighbouring buildings. Local seeded variation is secondary.

Desired hierarchy:
```text
BLOCK FIELD
  → neighbouring lean / bend / roof slope
  → building-local belly / taper / small twist
  → semantic roof
  → protected irregular facade details
```

A building may be odd; a street must still feel like one authored drawing.

### Facade-detail rule
Default generated facade:
- exactly one readable door;
- 2–3 visible windows;
- windows tall/narrow rather than square;
- irregular spacing;
- no floor-grid assumption;
- safe distance from door and facade edges;
- no bright window frame in the default recipe;
- window/door colour comes from the palette family.

### Road / curb rule
Road and path presentation must be continuous curve/ribbon geometry. Do not expose segment rectangles, corner wedges or coplanar layer competition.

### Cartoon clay palette
Current candidate family: `KFB_WONKY_90S_CLAY_V1`.

The palette is global/systemic:
`walls · roofs · doors · windows · ground · curb · road · path · sky`.

Per-building variation selects within the family; it does not invent unrelated colours.

### Future enterable-building seam · deferred
Selected buildings may later mount exact source-backed KayKit doors and route to interior instances. Do not add a generic replacement door.

Required later order:
`exact AssetRef → isolated donor proof → verify real open/close animation if present → selected-building mount → portal/instance seam`.
