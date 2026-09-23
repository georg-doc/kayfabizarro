# DONOR LOCK · Billboard Media Scene · USE WHAT WORKS

**Status:** HARD GATE · SOURCE PROOF FIRST · NO FREE REDESIGN

## Mandatory skills

Read first:

- `skills/session-entry-use-what-works_v1.md`
- `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`

## Current human verdict

The first Claude Billboard result is **REJECTED · HARD FAIL**.

Visible failure evidence from Georg's screenshot:

- oversized floating UI / debug windows cover the scene;
- measurement/readout panels dominate the review surface;
- the central Card content does not load;
- only one happy-view composition is shown;
- the 3D mental model is not proven from useful alternate angles;
- the result reads as generic editor chrome rather than a world object.

Do not repair this candidate.

## Exact working donor

Use the existing Racer source:

`tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`

Exact functions:

- `renderCardQuarter(pick)`
- `buildBillboard(THREE, GLTFLoader, route, frac)`

Existing exact physical donor:

`media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb`

Existing Card contract:

- `media/kfb/index.json`
- real deck PDF from registry
- PDF.js
- quarter-page crop contract from `card-art-2d.js`
- `THREE.CanvasTexture`
- measured billboard panel

## Gate B0 · exact source proof only

Before any visual design:

1. show the real Kenney billboard in isolation;
2. show the real Card/PDF content rendered through `renderCardQuarter()`;
3. apply it to the board through the same `CanvasTexture` contract;
4. provide front, 3/4 left, 3/4 right views;
5. no floating palettes over the object;
6. no measurement dashboard;
7. no Collage/Triplet/reveal yet.

The first visible result should essentially be:

**one physical 3D billboard with one real KFB Card on it.**

Nothing else.

## UI rule

Review UI must default to nearly invisible.

Allowed:
- orbit camera;
- one tiny optional hide/show control;
- optional diagnostics behind a toggle.

Forbidden as default-visible content:
- floating inspector;
- measurement cards;
- debug badges;
- source panels;
- configuration windows;
- button walls;
- permanent explanatory text;
- developer metadata.

Every visible UI element must pay rent.

## Card failure rule

If the real Card/PDF path fails:

**STOP.**

Show:

`SOURCE CARD FAILED`

and report the exact source/load error.

Do not substitute:
- fake card artwork;
- placeholder text;
- generic ad copy;
- a blank poster;
- screenshots pretending the Card loaded.

## 3D proof rule

A hero screenshot is not enough.

Before design refinement show:
- front;
- 3/4 left;
- 3/4 right;
- one lower/side angle if the support geometry matters.

The physical donor must remain recognisable from all views.

## Seam after B0

Only after Georg confirms the exact source proof:

### B1
Add a minimal clean terrain patch + 2–3 scenic props.

### B2
Add TRIPLET mode using the same physical board/content surface.

### B3
Add COLLAGE LOOP presentation.

One gate at a time.

## Forbidden until B0 passes

- full UI/editor layout;
- Triplet generation;
- collage system;
- hero interaction;
- animated reveal;
- video;
- new billboard geometry;
- new PDF renderer;
- new Card mock;
- generic KFB dashboard.

## Rule

If the source output is not visibly there, the task has not started.
