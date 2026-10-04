# RUN NEXT · ToolBox UI Critique & Rework · CORRECTED

**Datum:** 15.09.2026  
**Status:** CURRENT EXECUTION ENTRY / CORRECTION  
**Precedence:** This file corrects the earlier UI brief where it conflicts. Do not continue from the Pilot/Carl interpretation.

## 1 · Stop condition

Do **not** continue visual implementation until the real Studio v17 information architecture and roster are represented in the design plan.

The previous drift was:

- DocCheck-red chrome;
- Dark-default shell;
- Carl/Pilot treated as the product model;
- workflow rail promoted over the Studio feature model;
- Talk/Voice/Bubbles omitted;
- roster collapsed to four custom figures.

All of those are rejected.

## 2 · Source hierarchy

Use this order:

1. **KFB FrankenStein Studio v17** = primary functional UX source and primary visual-language source.
2. Current `kfb.pets/1` / session / reader / rig / material contracts = data and implementation truth.
3. Pilot v1 = UX experiment / evidence source only.
4. Rigging Lab / CapsuleCarl = specialist workbench and regression fixture only.
5. Birthday consumer return = one real consumer workflow for Motion Casting.

### Hard rule

**Carl is not the UI/UX model.**

CapsuleCarl may validate zones, brows, nose, mouth and reader behavior. It must never define the ToolBox information architecture, roster, visual language or default workflow.

## 3 · Navigation

Primary Studio navigation remains:

`Body · Face · Motion · Voice · Messen`

The conceptual workflow:

`Select → Shape & Look → Attach & Fit → Motion & Talk → Export`

may appear only as **secondary wayfinding/status**. It must not replace the Studio tabs, feature inventory or section structure.

For split-screen it may collapse to a compact breadcrumb/step indicator.

## 4 · 39/39 coverage gate

The current inventory contains **39 Studio sections**.

Before implementation, maintain a matrix:

`Studio v17 tab / section → new location → preserved | regrouped | progressively disclosed | intentionally deferred`

No Studio capability may disappear silently.

`Progressive disclosure` means reorganize/reveal, **not remove**.

## 5 · Visual language

### Default

- **Paper / Light** theme.
- Studio/KFB visual language.
- Space-Grotesk / paper-like light surfaces / restrained KFB accents where existing Studio tokens support them.

### Rejected

- no DocCheck-red header/chrome;
- no dark default;
- no corporate DocCheck visual system as ToolBox identity.

Optional alternate theme/palette toggles may exist later, but theme changes must not alter layout, feature coverage or owner contracts.

## 6 · Progressive disclosure

Decision:

- Basis controls open;
- Expert groups collapsed;
- clear `Show all` / `Alles zeigen` control;
- explanatory-text density remains independently toggleable;
- collapsed groups must visibly indicate that more controls exist;
- user disclosure state should remain stable during the working session where practical.

Do not classify an existing function as `Expert` merely because it is inconvenient to place.

## 7 · Stage and palettes

The central stage remains spatially stable while tools change.

Scene-wide controls such as:

- light;
- ground;
- pad/base;
- background/view;

belong in a compact, independent **Stage / Bühne palette**, available across Studio tabs.

Character editing controls remain in the relevant Studio tab/palette.

For narrow/split-screen layouts, palettes toggle/drawer/stack rather than squeezing the stage into an unusable centre column.

## 8 · Talk / Voice / Speech Bubbles

These are **first-class Studio capabilities** and must be represented.

Existing source ecosystem includes the mouth/talk path, `voice` contract data and shared bubble modules such as `podcast-v2/bubbles.v4.js` / `.v5.js`.

Direction:

- entering `Voice` should make the speech-bubble workflow immediately available;
- outside Voice, bubble may be off by default but always one click away;
- after manual user activation, do not unnecessarily reset it on every tab switch;
- bubble placement belongs to the stage, not over the face controls;
- do not invent a second Talk/Voice/Bubble owner.

## 9 · Roster · FULL COVERAGE, no four-character hardcode

The roster must be driven by the **actual Studio/session/contract population**, not by the four custom figures visible in the recent design mockup.

Known current source facts include:

- **24 Cube-Pets** in the Cube-Pet character layer;
- current Studio/custom residents and KFB figures;
- FrizzleBob / Graft variants and specialist residents such as CapsuleCarl, Klo-Rolli and Recherchi where present in current Studio state.

### UI direction

- tuned/custom/recently relevant figures may appear first;
- all current characters remain discoverable/selectable;
- `Show all` may disclose the long tail, but it must actually exist;
- search/filter must search the entire roster, including collapsed items;
- do not create a second curated four-character data source;
- do not hardcode the roster from the mockup.

### Acceptance

A screenshot showing only four available characters without an explicit functional `Show all` / search path to the complete roster is **FAIL**.

## 10 · Split-screen is a primary workflow

Design explicitly for authoring around ~832 px wide split-screen, not merely as final QA.

Required behavior:

- stage remains useful;
- primary Studio tabs stay reachable;
- palettes can be toggled/drawered;
- no crushed three-column layout;
- no essential feature depends on hover;
- progressive disclosure supports narrow working space rather than removing capabilities.

## 11 · Material / Color workflow

Preserve the required authoring functions:

- named material zone;
- visible/editable `#RRGGBB`;
- Copy Hex;
- validation;
- curated palette;
- Original / Reset;
- click-outside and Esc close picker;
- Texture/Surface where the existing material owner supports it;
- unsupported fields labelled honestly rather than rendered as dead controls.

## 12 · QA scenarios · first build

### P0 acceptance flows

1. **FrizzleBob / Graft** — material zones + Surface/Texture + core Shape/Face flow.
2. **Motion Casting / Birthday** — actor → state → candidate clip → binding/preview → accept/reject.
3. **Talk / Viseme / Mouth**.
4. **Voice request + Speech Bubble**.
5. **Cube-Pet** — material + color as proof that UI is not Graft-only.
6. **Full roster discovery** — prove access to all current Studio characters, including all 24 Cube-Pets.
7. **Split-screen ~832 px** — toggled palettes, usable stage.
8. **Export → Import roundtrip**.

### Regression / specialist smoke

9. CapsuleCarl zones/brows — specialist regression only, not UX model.
10. Klo-Rolli load/select/relevant controls.
11. Recherchi load/select/relevant controls.

Carl brow/tapering remains OPEN/DEFECT until visually proven; stored values are not sufficient evidence.

## 13 · Save / state clarity

Actor switching must not silently discard work.

Make `unsaved / saved / reverted / source draft` state legible without turning the UI into a developer dashboard.

## 14 · Required evidence before implementation claim

Return:

- 39/39 old→new coverage matrix;
- full roster count/source and screenshot proving complete discovery;
- Paper/Light default screenshot;
- 1440×900 and ~832 px split-screen screenshots;
- Voice/Talk/Bubble flow;
- Cube-Pet and FrizzleBob/Graft flow;
- Export→Import roundtrip;
- separate UI FIXED vs Rig OPEN vs Material/Contract OPEN status.

`UI PASS` ≠ Rig PASS ≠ Georg acceptance.

## 15 · Copy prompt

> STOP the current Carl/Pilot-centred redesign. Read `tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/RUN_NEXT_CORRECTED_2026-09-15.md` first. KFB FrankenStein Studio v17 is the primary functional and visual UX source. Carl/Rigging Lab is only a specialist regression fixture; Pilot v1 is only an evidence source. Keep `Body · Face · Motion · Voice · Messen` as primary navigation; the workflow rail is secondary wayfinding only. Preserve all 39 Studio sections through an explicit old→new coverage matrix. Paper/Light is default: no DocCheck-red chrome and no Dark default. Talk, Voice and Speech Bubbles are first-class. The roster must come from the actual Studio/session/contract population: all current figures remain discoverable, including all 24 Cube-Pets; never hardcode the four custom figures shown in the current mockup. Design split-screen around ~832 px as a primary workflow using toggleable palettes and progressive disclosure. Do not continue implementation until coverage matrix and full-roster design are explicit.

## 16 · Status

- **DECISION:** Studio v17, not Carl/Pilot, is the UI/UX model.
- **DECISION:** Paper/Light default; no DocCheck-red chrome; no Dark default.
- **DECISION:** Studio tabs primary; workflow band secondary.
- **DECISION:** 39/39 section coverage required.
- **DECISION:** full current roster required; four-character subset is not acceptable.
- **DECISION:** Talk/Voice/Bubbles first-class.
- **IMPLEMENTATION:** none by this correction.
- **TESTED RESULT:** existing Studio/WSA evidence only; corrected redesign not yet tested.