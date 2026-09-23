# REJECTED OUTPUT / FAILURE RECOVERY · Billboard Media · 2026-09-23

## Human verdict

**REJECTED · HARD FAIL**

The first Claude Billboard result is not an acceptable KFB Media Residency proof.

## Visible failure evidence

From Georg's screenshot:

- floating panels obscure a large part of the scene;
- measurement/readout UI dominates the viewport;
- Card source/content is absent on the billboard;
- the result shows a single happy-view composition rather than proving the physical 3D object;
- scene judgement is harder because the editor chrome is visually louder than the billboard;
- the source-backed Racer Card/Billboard path is not visibly reappearing.

## Rules violated

`skills/session-entry-use-what-works_v1.md`

and:

`skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`

Especially:

- source before composition;
- donor separately proven;
- no generic UI leak;
- FOV/task before safe area;
- screenshot before PASS language;
- wrong fork is discarded, not patched.

## Recovery decision

Do not patch the current Claude candidate.

Classify:

`ARCHIVED_FAILED_CANDIDATE`

Restart from the existing Racer source:

`tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`

## Recovery sequence

### B0 · exact source proof

Only:

- real Kenney `billboard.glb`;
- real Card via `renderCardQuarter()`;
- same measured CanvasTexture surface;
- clean orbit view;
- front + left 3/4 + right 3/4.

No design embellishment.

### Human confirmation

Georg confirms that the actual donor/card path is visibly present.

### B1 · scene dressing

Only after B0:
- clean terrain;
- 2–3 rocks/weeds;
- one optional light.

### B2 · Triplet

Only after B1.

### B3 · Collage

Only after B2.

## Explicitly banned before B0 approval

- measurement dashboard;
- floating debug cards;
- full inspector;
- button wall;
- fake Card;
- placeholder Card;
- fake billboard;
- Collage mode;
- Triplet mode;
- Hero interactive mode.

## One next gate

**Show exact billboard + exact real Card with minimal UI and 3D angle proof.**
