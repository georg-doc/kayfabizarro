# KFB ToolBox · Cartoon Deformer + Skewed Perspective + Render Look Addendum

**Date:** 2026-09-15  
**Status:** CURRENT PRODUCT DIRECTION / ADDITIVE TO `ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/START_HERE.md`  
**Purpose:** add reusable cartoon-shape and render-language authoring tools required for Elisa's scene and future KFB world/stage work.

## 0 · No silent replacement

This document does not replace the existing ToolBox Stage/Scene Builder brief, Asset Librarian, Registry, actor rig owners, Travel world/light owners, or source assets.

It adds two first-class authoring capabilities inside the existing Stage/Actor workflow:

1. **Skewed Cartoon Perspective** — camera/composition controls for intentionally exaggerated cartoon perspective.
2. **Cartoon Deformer** — non-destructive prop/world-asset geometry deformation for deliberate bend/skew/taper/squash/twist/asymmetry.

The current Three.js IK example is a useful **handle/interaction donor** because it already demonstrates `OrbitControls`, `TransformControls`, direct target manipulation and disabling Orbit while a transform handle is dragged. It is **not** itself the prop-deformation engine.

## 1 · Visual target

**USER VISUAL DIRECTION:** combine:

- Georg's earlier Hunky & Dory / Midjourney background studies;
- intentional skewed/cartoon perspective;
- cozy-game rendering;
- claymation / tactile handmade material feeling;
- KFB asymmetry and contamination rather than clean generic cute-game polish.

The KFB-Stunt-Car-Race source folder currently contains the Midjourney study source as two large PNG sheets:

`_inbox/BG CARTOON ASSETS Midjourney GvW/`

These are reference sources. Their exact pixel-level visual grammar has **not** been connector-reviewed in this document; do not invent specific visual observations that have not been measured/seen directly.

### Rejection target

Do not reproduce the rejected Birthday/Astra look:

- flat/default Three.js appearance;
- generic smooth low-poly presentation with no art direction;
- physically implausible props;
- identical blur/blob shadows;
- rigid perfectly vertical/square scenery where the intended KFB scene needs character;
- AI-looking random distortion with no controllable authoring logic.

## 2 · Skewed Cartoon Perspective

This is a **Stage camera/composition tool**, not a destructive geometry operation by default.

P0 controls should remain compact and visual:

- FOV / focal exaggeration;
- camera height and target height;
- horizon tilt / Dutch angle;
- principal-point / framing offset where technically safe;
- near/far exaggeration preset;
- optional vertical convergence / lean preset where it can be implemented predictably;
- presets such as `Neutral`, `Subtle Cartoon`, `Skewed`, `Wide Stage`.

The purpose is to make a scene read like an intentionally staged cartoon illustration rather than a neutral architectural camera.

### Boundary

Camera perspective alone cannot produce every desired crooked/bent silhouette. Use the Cartoon Deformer for object-local shape changes. Do not fake all skew by breaking the entire world projection if that damages picking, shadows, physics or placement.

## 3 · Cartoon Deformer

Create one reusable non-destructive modifier system for **static props and world assets first**.

Hero acceptance asset: GothGirl's two speaker props. Georg must be able to make each speaker deliberately different — bent, leaned, tapered, squashed or skewed — while preserving recognizability and placement control.

### P0 modifier vocabulary

- `Bend` — axis + amount + pivot/falloff;
- `Skew / Shear` — axis pair + amount;
- `Taper` — top/bottom or chosen axis;
- `Squash / Stretch` — preserve useful volume/readability where practical;
- `Twist` — axis + amount;
- `Bulge / Pinch` — optional if cheap and stable;
- `Lean / Asymmetry` — simple artist-friendly macro built from the underlying modifiers;
- `Reset` per modifier / reset full stack.

### KISS interaction

Use stage handles/gizmos rather than a spreadsheet of numbers wherever possible.

Relevant donor interaction from Three.js IK example:

- `TransformControls` for direct manipulation;
- Orbit disabled while dragging;
- visible target/handle on the selected element;
- immediate stage feedback.

For deformation, add a small local bounding-box/cage visualization when useful. A minimal first implementation may expose pivot/top/bottom handles rather than a full Blender-style lattice.

### Non-destructive contract

The original Registry/source asset remains untouched.

Save conceptually:

`sourceAssetId + transform + modifierStack + optional baked derivative`

Rules:

- source asset is always recoverable/resettable;
- modifier order is explicit and stable;
- duplicate instances may have different modifier stacks;
- scene bundles store the deformation config;
- optional baked geometry is a derivative/export artifact, never the new source truth.

### P0 scope boundary

Apply the Cartoon Deformer to static props/environment meshes first.

Do **not** silently route skinned KFB actors through the prop deformer. Character anatomy/pose remains owned by Actor/Face/Pose/Rig systems unless a later measured deformer path is explicitly approved.

## 4 · Cozy / Claymation KFB render preset

Add a Stage-level visual preset/target that can be tuned but gives a coherent baseline.

### Substrate

- soft broad key light;
- colored/warm-cool fill rather than flat ambient-only light;
- real soft cast/contact shadows;
- restrained AO/contact grounding;
- high-to-medium roughness as default for matte/clay/painted surfaces;
- low metalness unless material actually calls for metal;
- gentle material variation / tactile imperfection;
- rounded/beveled readability where source geometry supports it;
- atmosphere/depth separation for world scenes;
- restrained grading only after lighting/materials are correct.

### KFB contamination layer

- deliberate asymmetry;
- selective skew/deformation;
- odd scale relationships when compositionally useful;
- imperfect prop alignment;
- characterful silhouettes;
- visual jokes/contrasts where authored, not random noise.

**Principle:** `Cozy / claymation substrate + KFB skew`, not generic cute-game rendering and not blanket distortion.

## 5 · Integration into ToolBox UI

Do not create two more top-level tabs.

### In `Stage`

Selected camera:

`Camera → Cartoon Perspective`

Selected static prop/world asset:

`Object → Transform · Cartoon Deform · Material`

The Resource Picker remains the route for adding assets.

### In `Actor / Pose`

Character posing continues through rig handles / IK / direct joint controls. Static held/nearby props may use Cartoon Deform if they are independent static meshes.

### One context palette

Only the currently relevant controls are visible. No permanent deformer dashboard. No explanatory paragraphs in the normal authoring surface.

## 6 · Elisa acceptance cases

Before broad world authoring, prove these small cases:

### D1 · Speaker deformation

Load the two GothGirl speakers and make them visibly related but intentionally non-identical:

- Speaker A: subtle lean + taper;
- Speaker B: different lean/bend + slight squash/skew;
- both remain credible speaker objects;
- save scene;
- reload;
- same deformation returns.

Georg must be able to tune the result interactively.

### D2 · Cartoon camera

Use the same small stage with GothGirl + speakers + stool and prove:

- neutral camera;
- subtle cartoon perspective;
- stronger skewed-cartoon composition;
- no broken picking/placement/shadows in the chosen P0 path.

### D3 · Render target

One approved frame must visibly demonstrate:

- cozy/clay tactile rendering;
- soft real grounding/shadows;
- deliberate skew/asymmetry;
- no flat default Three.js look.

This is a Georg visual gate, not an automated PASS.

## 7 · Relation to KayKit Reference Atlas

The current KayKit Reference Atlas v1 research package is preserved on:

`chat/kaykit-reference-atlas-2026-09-15`

Pinned checkpoint head reported/verified for this planning pass:

`89acd27ee7981d20bf196768bed7011b306011da`

Its `RETURN.md` states:

- Asset Librarian remains read-only discovery/reference;
- ToolBox remains compatibility/integration owner;
- no ToolBox/runtime feature was implemented;
- top-level Dropbox reference collection was inventoried;
- visual frame-by-frame annotation remains open because of connector/image handoff limits;
- the recovery branch must not be merged to `main` until Georg's local-commit situation is reconciled.

Therefore:

- **G0 research checkpoint = available as evidence packet**;
- **not promoted to main / not runtime implementation**;
- ToolBox can consume its findings as pinned planning input without pretending the Atlas branch is merged product truth.

## 8 · Updated implementation gates

Keep the existing Elisa sequence, but include the new visual proof before full scene assembly:

`G0 Atlas → G1 GothGirl/Hihi Actor → G2 Pose → G3 Curtain → G3.5 Cartoon Deformer + Cartoon Perspective + Cozy/Clay render proof → G4 Stage/Resource placement → G5 Terraformer/Worldbuilder → G6 full Birthday scene → G7 consumer integration`

No automatic continuation across Georg gates.

## 9 · Status

- **DECISION / USER DIRECTION:** add Skewed Cartoon Perspective as a reusable Stage composition tool.
- **DECISION / USER DIRECTION:** add Cartoon Deformer for deliberate prop/world bending/distortion; GothGirl speakers are the first acceptance case.
- **DECISION / USER DIRECTION:** visual target combines Georg's Hunky & Dory background direction with cozy-game / claymation rendering and KFB asymmetry.
- **SOURCE FACT:** Three.js IK example provides OrbitControls + TransformControls + CCDIK interaction patterns suitable as a posing/handle donor.
- **SOURCE FACT:** Midjourney background source folder exists in KFB-Stunt-Car-Race as two large PNG sheets; this document does not claim pixel-level inspection.
- **TESTED RESULT:** KayKit Atlas research package exists on the recovery branch; no ToolBox runtime implementation yet.
- **PROPOSAL:** modifier vocabulary and exact authoring controls above; validate with the speaker acceptance case before broadening.
- **IMPLEMENTATION:** none by this addendum.
