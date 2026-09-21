# KFB Toy / Clay Form Language v0

Status: CANDIDATE STYLE CONTRACT · additive to existing Tiny Treats / KayKit / City Grotesque sources.
Owner of this candidate authoring grammar: KFB ToolBox.
Landmark owner remains: tools/img2threejs/.
Asset identity remains: Registry / Asset Librarian.

## North star

Build the soft toy icon of the object, not a miniature engineering reconstruction.

Target blend:
- KayKit chunkiness;
- Tiny Treats friendliness;
- clay / resin softness;
- collectible-boardgame readability;
- KFB silhouette exaggeration.

Do not interpret this as Monopoly-level abstraction or generic chibi.

## Macro-form rule

A first-read prop should be approximately 80–90% macro massing. Detail exists only when it changes silhouette, identity or interaction. If a detail fails all three, remove it.

## Primitive library

Preferred: rounded box/slab, capsule/capsule beam, squashed sphere, rounded cylinder, smooth tapered/lathed spire, soft arch, large inset or raised pill.

Hard edged boxes, thin rods, dense lattice and tiny facade pieces are not first-line primitives.

## Visible corner mass

A bevel is not a technical anti-alias. It must be visible at intended camera distance. Default rounded-box radius is about 14% of the smallest dimension, clamped below half-thickness.

Micro-bevel-only results fail the style gate.

## Detail budgets

- XS prop: 1–4 visible parts.
- S prop: 3–6 visible parts.
- M landmark: 5–10 primary parts, up to 16 total hero parts.
- L hero landmark: 8–16 primary parts; secondary structure requires a named reason.

v0 samples:
- panel: max 4 parts;
- Eiffel: max 14 parts;
- Cologne Cathedral: max 16 parts.

## Material language

Default metalness 0, roughness about 0.8–0.9, clean colour blocks and soft shadows. No generic grime/noise pass before form acceptance.

Clay, painted wood, matte plastic and resin are valid later surface families. Surface and geometry stay separate switches.

## Landmark rule

Ask: Which 2–5 masses make this recognizable in silhouette?

Eiffel: four leaning legs, two decks, upper taper, mast, one arch cue if needed.

Cologne Cathedral: twin towers, twin spires, broad west facade, long nave, one portal / rose-window cue.

Do not preserve filigree because it exists in the real structure. Preserve it only when it is necessary for recognition at review distance.

## Reliability rules

1. Start with the shared primitives, not bespoke triangle soup.
2. Enforce a part budget in code.
3. Compare silhouette at mobile/map distance before adding detail.
4. Keep one material family per major mass until geometry passes.
5. If the result feels technical, first enlarge radii and delete parts; do not add texture.
6. If the result feels generic, restore one iconic feature; do not restore all details.
7. Source donors remain visible in isolation before derived work.

## v0 benchmark

The lab starts with the real Tiny Treats Charming Kitchen toaster in isolation, then allows switching to the rounded three-button panel, Eiffel toy landmark and Cologne Cathedral toy landmark.

Passing tests prove only that the grammar is technically reproducible. Georg visual acceptance decides whether it becomes a preferred KFB authoring language.
