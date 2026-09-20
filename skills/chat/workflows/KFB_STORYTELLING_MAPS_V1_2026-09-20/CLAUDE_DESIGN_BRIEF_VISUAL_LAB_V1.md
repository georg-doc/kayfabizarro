# Claude Design Brief · KFB Storytelling Maps Visual Lab v1

Status: **READY FOR CLAUDE DESIGN · FIRST GATE ONLY**
Date: 2026-09-20
Owner: KFB Storytelling Maps / existing Cartoon Map Board
Current source branch: `stage/storytelling-maps-v1-t2-media-standee-2026-09-20`
Current public technical donor Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t2-media-standee/`

## Read first · mandatory

Before writing code, read:

1. `skills/session-entry-use-what-works_v1.md`
2. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
3. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
4. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
5. `skills/chat/workflows/KFB_STORYTELLING_MAPS_V1_2026-09-20/START_HERE.md`
6. `.../RECOVERY.md`
7. `.../CARD_RIG_V1.md`
8. `.../VISUAL_MOTION_SYSTEM_V1.md`
9. `.../LUDOWALA_BENCHMARK.md`
10. `.../WSA_PROP_RIG_PLANNING_NOTE.md`

GitHub state overrides this brief if the current project Return/Recovery has moved.

## Product goal

Develop the existing KFB Storytelling Maps into one reusable visual language for:

- cinematic world/zone/galaxy maps;
- tactical tabletop maps;
- short story-map cut-scenes;
- game-module world maps;
- later one authoring/editor surface.

The visual language should feel handmade, physical, cartoony, surreal and cinematic — never like a generic dashboard or an AI-generated Three.js demo.

## First gate only

**Do not build the full Storytelling Maps system.**

The first Claude Design deliverable is:

# VL1 · Responsive Rounded Card Rig Visual Lab

One exact KayKit card donor, transformed into a controlled responsive physical card family while preserving rounded corners and front-surface integrity.

Stage target for the resulting candidate:

`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/visual-lab-v1/`

Do not publish/claim that URL until the exact Cloudflare build is visibly verified.

## Exact source donor

Card:
`media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/playercard_knight_red.gltf`

Stand:
`media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/playerstand_red.gltf`

Verified donor facts:

- outer card material: `boardgame`
- art material: `red_knight`
- outer primitive: 96 vertices
- art primitive: 40 vertices
- front-art primitive is inset relative to outer card

The existing T2 Stage proves front-material replacement is reversible, but it is **not** the finished responsive rig.


## Measured VL1 geometry constants

Do not spend a repair pass guessing the donor's corner zones.

Pinned BIN inspection measured:

- outer card bounds: x ±0.600, y 0…1.500;
- outer straight-center transition: x ±0.450, y 0.150…1.350;
- **outer fixed corner band: 0.150 × 0.150**;
- front-art bounds: x ±0.574359, y 0.025641…1.474359;
- front-art straight-center transition: x ±0.450, y 0.150…1.350;
- **front fixed corner band: 0.124359 × 0.124359**.

The front donor UVs are also rounded/inset rather than a naïve 0…1 plane (rough overall range U 0.046898…0.953102, V 0.020732…0.979267).

For the first proof:
- preserve donor UV topology;
- deform geometry using these measured fixed-corner bands;
- do not recreate planar UVs;
- make any alternative threshold an evidence-backed change, not an aesthetic guess.

## Absolute visual rule

**NO visible rectangular image corners. Ever.**

The media must look printed into / embedded in the physical rounded card.

Forbidden:

- adding a rectangular PlaneGeometry in front;
- CSS image overlay;
- sprite overlay;
- image mesh extending beyond rounded card corners;
- non-uniform scaling that turns round corners into stretched ellipses;
- a new generic "close enough" card mesh.

## Source isolation first

Before the responsive adaptation appears, show the exact original KayKit card in isolation.

Label it:

`SOURCE · playercard_knight_red.gltf · unchanged`

Then show the adapted candidates separately.

A loaded URL is not proof.

The source object must be visibly recognizable.

## Required geometry method

Implement the geometry strategy in `CARD_RIG_V1.md`.

The intended method is mesh-space 9-slice / piecewise deformation:

```text
fixed rounded corner
→ scalable straight center
→ fixed rounded corner
```

on x and y.

Depth is preserved.

Corner thresholds must be **measured from donor geometry**, not guessed.

If inspection proves a different donor-native method preserves the corners better, document it before switching.

## VL1 test shapes

Show the same card donor as:

1. native portrait;
2. squarish;
3. KFB landscape around the existing card ratio (~1.79);
4. wide candidate near the upper controlled range.

Do not hide the awkward cases.

## Media mapping

Use a diagnostic test motif only.

The motif must include:

- outer-edge registration marks;
- a circle near every corner;
- a central horizontal/vertical cross;
- text showing aspect ratio.

Purpose: any distortion or square clipping must be obvious.

The media must live on the exact existing front-art primitive.

Add:

- COVER
- CONTAIN
- focal X/Y

only if the core shape proof is already clean.

## Camera proof

Every ratio must be visible through:

- front;
- 3/4 left;
- 3/4 right;
- low/grazing oblique.

No pass from front-only screenshots.

## Stand seating proof

At least portrait + landscape must be seated in the exact KayKit stand.

The stand is not stretched to hide a card problem.

## UI

Minimal.

Allowed:

- ratio preset buttons;
- ORIGINAL / MEDIA;
- front / oblique camera presets;
- small donor/proof status.

Forbidden:

- marketing hero;
- giant explanatory cards;
- glassmorphism;
- gradient blobs;
- decorative statistics;
- redundant badges;
- generic sidebar.

The object is the UI.

## After VL1 · roadmap only, not current build

These are recorded so the design direction is coherent, but Claude must not implement them in the same pass.

### VL2 · Palette + sky

Reuse, do not recreate:

- `travel/travel-v16/terrain-v16/world-context.js`
- `world-palettes.js`
- `color-worlds.js`
- `skydome-shader.js`

Goal:
one seed controls a harmonious Storytelling Maps color world shared by map, props, sky and accents.

### VL3 · Map progressive disclosure

Reuse/adapt existing effect donors before inventing effects:

- Boxel Blitz `fx-pool.v1.js`
- `dissolve.v1.js`
- ripple donors
- Travel ripple/fog
- central `FX_Visual`

Story cue vocabulary:

`DRAW · RIPPLE_REVEAL · DISSOLVE · ASSEMBLE · FOLD_RAISE · RESET`

### VL4 · Card / PDF embeds

Reuse existing Viewer/CardBuilder/PDF pipeline.

No second PDF renderer.

The rendered/cropped card output becomes media for ResponsiveCardRig.

### VL5 · Prop actor motion

Compare:

- Resident Atlas `Rig_Legacy` / `legacyAssemble()`
- CapsuleCarl-style procedural semantic motion

Do not assume all clips work.

First prove a compatibility table on the card standee.

### VL6 · Odyssey

Only after card rig + motion + map progressive disclosure are accepted.

## Palette design rules

When VL2 eventually starts:

- use existing deterministic seed functions;
- preserve story-mode palette source;
- prefer `paletteFromVector()` for card-driven variations;
- use `guardStops` / existing readability guard where applicable;
- keep ink/paper contrast readable.

Do not invent a second palette generator.

## Map animation rules

When VL3 eventually starts:

- story beat owns reveal timing;
- geography truth never depends on animation;
- effect always recovers to a stable readable state;
- only one major visual action at a time;
- lulls are deliberate;
- map pieces can assemble/disassemble physically but return to semantic anchors.

## Prop-rig planning

Later KFB prop actors may include:

- card standees;
- pencil;
- eraser;
- books/signs;
- EyeRig props.

Do not create a Storytelling Maps-only animation library.

Coordinate with existing Rig_Legacy / procedural actor adapters.

## Donor list Claude must not replace

### Card / PDF
- KFB Deck Viewer / `kfb-viewer.js` lineage
- CardBuilder
- KFB Ink owner

### Color
- `world-context.js`
- `world-palettes.js`
- `color-worlds.js`

### Sky
- `skydome-shader.js`

### Card motion
- KFB Living Illustration Lab / `kfb-living.js`

### Map / FX
- current Cartoon Map Board
- Boxel Blitz FX foundation
- central `FX_Visual`

### Motion
- Resident Atlas
- Rig_Legacy
- KFB Cartoon Animation v2
- CapsuleCarl procedural adapter
- existing EyeRig tooling

## Q&A before code

Claude must write this block into its local project notes before coding:

```text
[Q] Which exact source card is being adapted?
[A] playercard_knight_red.gltf @ pinned KFB source

[Q] Is a new front plane allowed?
[A] No.

[Q] How are rounded corners preserved?
[A] Measured donor mesh + fixed-corner piecewise deformation.

[Q] Is ordinary x/y non-uniform scaling sufficient?
[A] No.

[Q] Can the stand be stretched to fit?
[A] No.

[Q] Can a new palette/skydome/viewer be invented?
[A] No — existing donors first.

[Q] What is the first deliverable?
[A] VL1 Card Rig visual proof only.
```

## Evidence required

Return:

- exact repo / branch / PR / head;
- changed files;
- original source donor screenshot;
- four responsive card variants;
- oblique screenshots proving rounded corners;
- stand-seated portrait + landscape;
- mobile-landscape screenshot;
- actual browser test counts;
- direct Cloudflare Stage URL;
- unresolved items;
- exactly one next gate.

## Fail-fast rules

Stop rather than improvise if:

- the donor mesh cannot preserve corners with the proposed transform;
- the front-art primitive topology behaves differently than expected;
- a required source module cannot be resolved;
- two repair passes fail the same visual gate.

Export the failed candidate and evidence. Do not patch the patch.

## Exactly one human gate

**Do the responsive cards look like one coherent physical KayKit object — including rounded corners and media — from all tested 3D angles?**
