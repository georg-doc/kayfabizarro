# KFB Storytelling Maps · Responsive 3D Card Rig v1

Status: **CURRENT DESIGN CONTRACT · IMPLEMENTATION NEXT**
Date: 2026-09-20
Owner: KFB Storytelling Maps / Cartoon Map Board presentation layer
Source donor: `KayKit_BoardGameBits_1.0_FREE/Assets/gltf/playercard_knight_red.gltf`
Exact donor pin: `a6b9220a0b42d50a9de9804fad22e84dde2c322c`

## Non-negotiable visual rule

**A card image / motif must never render as a visible square or rectangle in front of the physical card.**

No flat overlay plane with exposed 90° image corners.
No CSS/card sprite hovering over a rounded card.
No rectangular alpha edge visible from oblique angles.

The motif must read as **printed on / embedded into the physical 3D card surface**.

## What the KayKit donor proves

The exact GLTF has two primitives:

1. material `boardgame`
2. material `red_knight`

Measured bounds from the source GLTF:

- outer card primitive: 96 vertices, x ±0.600, y 0.000…1.500, z about ±0.050
- front-art primitive: 40 vertices, x ±0.574359, y 0.025641…1.474359, z about ±0.050

So the front-art surface is already a dedicated inset mesh region, not an arbitrary full-screen rectangle.

**Use it. Do not add a replacement front plane.**

## T2 evidence boundary

T2 proved that replacing only `red_knight` while preserving `boardgame` is technically reversible and browser-safe.

That does **not** yet prove the final responsive-card treatment for arbitrary aspect ratios.

The T2 runtime remains evidence; this contract supersedes any interpretation that "one texture swap = finished responsive card rig".

## CardRig v1 target

One source card becomes a responsive physical card family.

```text
CardRigRoot
├── KayKit frame primitive       ← exact donor topology
├── KayKit front-art primitive   ← exact donor topology
├── optional back material
├── MediaMapper
├── ShapeRig
└── PresentationRig
```

### ShapeRig responsibilities

- target aspect ratio;
- target height/width within min/max;
- preserve thickness;
- preserve rounded corner radius;
- preserve border inset;
- preserve UV continuity;
- preserve front-art alignment;
- recompute collider/bounds after shape change.

### PresentationRig responsibilities

- stand attachment;
- lean;
- hop/tilt/wobble later;
- collision response later;
- never owns card aspect geometry.

## Do not use ordinary non-uniform scale for arbitrary aspect ratios

A plain `scale.x / scale.y` stretches the rounded corners.

That is forbidden for the responsive family.

## Required deformation: rounded-card 9-slice in mesh space

Use a piecewise local-space deformation.

For each axis, split the donor into:

```text
fixed corner band | scalable center | fixed corner band
```

Let:

- source width = `W0`
- source height = `H0`
- fixed horizontal corner band = `Rx`
- fixed vertical corner band = `Ry`
- target width = `W1`
- target height = `H1`

For a source x coordinate:

```text
left corner:
  preserve local offset from left edge

center:
  scale only the center span

right corner:
  preserve local offset from right edge
```

Same for y.

Depth z is not stretched.

This is geometry 9-slicing, not texture 9-slicing.

### Why

- corner arcs stay circular/consistent;
- edge thickness stays readable;
- landscape does not turn rounded corners into ellipses;
- the card remains coherent from oblique 3D angles.

## How to derive corner bands

Do not type a guessed radius.

Measure the exact donor geometry first.

Preferred sequence:

1. inspect unique perimeter x/y bands of the outer `boardgame` primitive;
2. identify where straight edge transitions into the rounded corner arc;
3. record those donor-local thresholds once;
4. apply the same shape transform to both physical frame and inset front-art primitive through their own measured bounds.

If the front-art primitive uses a different inset/corner radius, preserve its own measured bands.

## Media mapping

The image is mapped onto the existing `red_knight` primitive.

Supported policies:

- `cover`
- `contain`
- focal crop `{x,y}`
- rotation 0 / 90° for portrait/landscape media
- safe inset

Use UV transform / texture crop or a generated CanvasTexture.

The media surface must never extend outside the front-art primitive.

## Rounded-corner guarantee

The final visual clipping comes from **real front-art mesh topology**.

An optional alpha mask may be used as a safety belt, but it is not the primary geometry solution.

From every camera angle:

- card edge remains physical;
- image cannot project beyond the rounded front-art geometry;
- z-fighting is absent;
- no separate rectangular image plane is visible.

## Aspect-ratio policy candidate

Keep it controlled rather than "any number".

Initial tunable contract:

```json
{
  "minAspect": 0.62,
  "maxAspect": 1.90,
  "minHeight": 0.8,
  "maxHeight": 2.6,
  "cornerPolicy": "fixed-world-radius-with-clamp",
  "mediaFit": "cover"
}
```

These values are **starting controls, not canon**. The first visual bench must determine acceptable min/max.

## Stand/base relationship

The card rig and stand are separate.

The exact KayKit colored stand remains the visual donor.

After card shape deformation:

1. measure new card bounds;
2. seat the lower card edge into the stand slot;
3. keep the stand undeformed unless its own donor-specific adaptation is explicitly required.

Do not stretch the stand to "fit" a bad card.

## Future rigging seam

The responsive card geometry must remain independent from animation.

Later:

```text
ResponsiveCardRig
  ↓ attach to
PropMotionRig
  ↓ driven by
Rig_Legacy / procedural KFB motion where proven
```

No animation code may mutate the permanent card topology.

## Acceptance bench

A future CardRig bench must show at least:

- portrait 0.67-ish;
- square-ish;
- KFB landscape ~1.79;
- wide 1.9;
- front and rear oblique angles;
- near grazing camera angle;
- MEDIA/ORIGINAL A/B.

Pass only if:

- zero visible square image corners;
- rounded corners retain consistent radius;
- frame thickness remains coherent;
- no z-fighting;
- front art stays aligned;
- stand seating survives all tested ratios.

## Exactly one next CardRig gate

**Source-isolated 9-slice deformation proof on the exact KayKit card mesh before this responsive geometry is used inside a storytelling map.**
