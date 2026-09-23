# Claude Design Brief · Billboard / Media Residency Scene

## GATE B0 · EXACT BILLBOARD + CARD SOURCE PROOF

**STOP. Do not design yet.**

The prior Claude result is rejected.

Before any Media Residency styling, use the working Racer donor exactly:

- `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`
- `renderCardQuarter(pick)`
- `buildBillboard(THREE, GLTFLoader, route, frac)`
- real `billboard.glb`
- real KFB PDF/Card via `media/kfb/index.json`

First visible output:
- real physical billboard;
- real Card visible on its measured content plane;
- front;
- 3/4 left;
- 3/4 right;
- nearly no UI.

If the Card fails, stop with `SOURCE CARD FAILED` and the exact error.

No placeholder Card.
No measurement dashboard.
No debug-panel wall.
No Triplet.
No Collage.
No Reveal.

Stop after B0 and wait for Georg.


## Design task

Create a compact, reusable KFB roadside-media diorama that visually proves one physical billboard can host several dynamic content styles without becoming generic UI.

Use a real source-backed billboard as the physical carrier.

## Source donors

Physical donor family:
- Kenney `billboard.glb`
- `billboardDouble_exclusive.glb`
- `billboardLow.glb`
- `billboardLower.glb`
- `overhead.glb`
- `overheadLights.glb`
- `bannerTowerRed.glb`
- `bannerTowerGreen.glb`
- optional KFB Poly billboard donor

Existing runtime donor:
`tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`

Reuse its proven logic:
- `buildBillboard()`
- `renderCardQuarter()`
- PDF.js/Card rendering
- CanvasTexture on measured board plane

## Scene

One mini-diorama only:

- small clean terrain patch;
- no black/debug underside;
- one hero billboard;
- 2–3 scenic rocks / weeds;
- optional small lamp or CCTV;
- subtle local light;
- orbit-friendly composition.

Keep the physical sign readable from several angles.

## Three required visual modes

### 1 · CARD / PDF

Show a real KFB Card/PDF source on the board.

Prepare visual states for:
- FIT_CARD
- COVER_CROP
- DETAIL_CROP

Never stretch portrait art into the billboard aspect ratio.

### 2 · TRIPLET

Show a billboard/media persona with a small signature slogan pool.

Visual grammar:

`POV → SHOW IT → SPIN IT → SELL IT`

The board can change text through:
- typographic panel flip;
- slide/cut;
- layered type;
- short timed sequence.

Keep one stable seeded message per encounter/visit.

Do not design a slot-machine/random-meme wall.

### 3 · COLLAGE LOOP

Make a restrained HyperNormalisation / paper-cutout style composition:

- 2–4 image/card/poster fragments;
- torn/irregular alpha edges;
- one large type fragment;
- slow crossfade or hard cut;
- slight parallax / scale drift.

Video is optional later. Do not require it here.

## Optional hero-interactive state

Prepare one visual concept for:

`DEFAULT → INSPECT → REVEAL`

The reveal may expose:
- alternate slogan;
- hidden layer;
- Card fragment;
- system/fact layer.

No full chat UI needed in this slice.

## ChatterBox boundary

Claude designs only the presentation state.

Later runtime may bind:
- billboard/media persona;
- signature Triplet pool;
- local event;
- Card/cluster;
- seed.

ChatterBox owns text/content.
The billboard adapter only presents it.

## Visual style

Aim for:
- retro roadside;
- motel / drive-in / carnival / hand-painted advertising;
- KFB paper/collage rhythm;
- readable at distance;
- bold silhouettes;
- asymmetry and slight imperfection.

Avoid:
- sleek SaaS screen;
- generic neon cyberpunk;
- floating HUD cards;
- replacing the 3D sign with a flat UI rectangle.

## Deliverable

Return:
- editable design/session export;
- hero view;
- side/3/4 view proving real physical sign;
- CARD mode;
- TRIPLET mode;
- COLLAGE mode;
- optional REVEAL mode;
- exact donor(s) used;
- unresolved visual questions.

No runtime/public Stage claim.

## Human gate

Georg decides:
- whether the physical sign feels KFB;
- whether Triplets read as world media rather than UI;
- whether collage feels deliberate instead of visual noise;
- whether the module is worth turning into a reusable Scene Lab template.
