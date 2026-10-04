# KFB ToolBox · UI/UX RESET · Minimal Stage-First

**Datum:** 15.09.2026  
**Status:** CURRENT DESIGN DIRECTION / NEXT REWORK BRIEF  
**Trigger:** user rejection of the current cluttered redesign screenshots.  
**Important:** do not inject this into an already-running generation mid-flight unless Georg explicitly chooses to; use it for the next clean redesign/repair pass.

## 1 · Verdict on current redesign

The current redesign direction is **REJECTED PROTOTYPE / ARCHIVED HISTORY**.

Do not incrementally beautify it.

Rejected characteristics:

- stacked header/navigation rows;
- workflow band + Studio tabs + extra mode rows competing simultaneously;
- explanation paragraphs in the working surface;
- source/provenance/status/meta text permanently visible;
- cards nested inside cards/panels;
- controls separated by unnecessary prose;
- stage reduced to a secondary area;
- developer/contract language exposed to the normal authoring workflow;
- visual density worse than the original Studio.

## 2 · One governing rule

> **EVERY PIXEL / WORD / LETTER / CELL HAS TO PAY RENT.**

If an element does not directly help the user:

- choose an actor;
- see the actor;
- edit the actor;
- animate the actor;
- make the actor talk;
- measure/fit the actor;
- save/export the result;

then it does not belong in the default working surface.

## 3 · Product goal

A clean, fast **character authoring stage**, not a documentation dashboard.

The UI should feel closer to a focused creative tool / compact character editor than to an admin panel.

The full Studio feature set remains available, but **feature coverage does not mean simultaneous visibility**.

## 4 · Information architecture

Keep the five real Studio domains:

`Body · Face · Motion · Voice · Messen`

### REMOVE from default UI

- no workflow band;
- no numbered `Select → Shape → ...` header row;
- no second navigation row;
- no permanent tutorial/explanation rail.

One navigation layer is enough.

## 5 · Single top bar only

Maximum one global bar, approximately compact desktop-tool height.

Suggested contents, in one row:

`KFB ToolBox` · `Actor ▾` · `Body Face Motion Voice Messen` · flexible spacer · minimal save state · Theme · Export/…

Rules:

- no second header directly underneath;
- no subtitle such as `UI Pilot`, `Authoring mode`, `Step 2`, etc. in normal use;
- if width is insufficient, low-frequency actions collapse into `…`, not another row;
- Paper/Light remains default theme.

## 6 · Stage dominates

The actor stage is the primary object.

Desktop target:

- stage receives the clear majority of usable width/height;
- character is large enough for face/pose/material judgement;
- camera presets/zoom are compact stage controls, not a large footer bar;
- no permanent left roster column unless explicitly opened;
- no permanent two-sided inspector cage around the stage.

The stage should continue to feel spacious even while a tool palette is open.

## 7 · Actor selection

Default state: one compact `Actor ▾` control/chip in the top bar.

On activation:

- open searchable roster palette/popover/drawer;
- favourites/recent/custom may appear first;
- **full actual roster remains searchable/discoverable**;
- all 24 Cube-Pets and current Studio/KayKit/custom residents must not be reduced to a four-character mockup;
- later universal KayKit coverage should consume Registry-driven population rather than hardcoded entries.

Close the roster after selection unless user pins it open.

## 8 · One context palette

Normal state: at most **one primary context inspector/palette** beside or over the stage.

Examples:

- Body palette when Body is active;
- Face palette when Face is active;
- Motion browser when Motion is active;
- Voice/Talk palette when Voice is active;
- Measure tools when Messen is active.

No nested dashboard of many simultaneous cards.

### Controls

A normal control row should usually be:

`Short label    [control]    reset/…`

No explanatory paragraph under every slider.

Use concise group names and compact disclosure arrows for additional controls.

## 9 · Progressive disclosure without hiding the product

Default:

- common controls visible;
- less-common controls in clearly named collapsed groups;
- one `Show all` option if useful;
- collapsed state must remain discoverable.

Do not use progressive disclosure to remove functionality.

Do not classify functions as Expert merely because the layout is inconvenient.

## 10 · No meta ballast

The following do **not** belong permanently in normal UI:

- source file paths;
- owner/module names;
- schema names;
- binding counts;
- provenance paragraphs;
- `working with ...` explanation cards;
- long warnings about contracts;
- implementation notes.

Put technical evidence behind one compact optional:

`… → Diagnostics / Source info`

Normal users should never need to see it.

### Errors

Only actionable errors surface in context, briefly:

`This clip does not bind to this rig.`

Not a paragraph explaining the entire animation contract.

## 11 · Body / Materials

Keep the working surface visual and direct.

For selected material zone:

- zone name;
- swatch;
- compact color picker;
- editable Hex;
- Copy Hex if useful;
- palette toggle;
- Texture/Surface where supported;
- Reset/Original.

Color picker closes on click-outside and Esc.

Do not surround every material zone with a large card.

## 12 · Face

Face must prioritize what the user sees:

- eye / brow / nose / mouth controls;
- tight camera/face preset where useful;
- immediate stage feedback;
- Talk test available without switching apps.

Broken technical controls such as Carl brow/tapering must not be presented as working merely because the UI has a slider.

## 13 · Motion

Motion surface:

- selected actor stays large on stage;
- search/filter clips;
- concise category chips/tabs;
- Play / Stop / Rest;
- compact compatibility state only where needed;
- later Performance Suite appears as real motion categories, not a second app.

**ALL current KayKit characters/rigs must ultimately remain selectable in this surface.**

## 14 · Voice / Talk / Bubbles

First-class, but compact.

Suggested visible controls:

- text/sample field;
- voice choice;
- Speak/Stop;
- Talk/Viseme test;
- Bubble on/off;
- minimal Bubble style/position affordance where needed.

No explanation card describing what Voice is.

Speech bubble lives on/around the stage, not in a text-heavy developer panel.

## 15 · Messen / Fit

Measurement tools should work primarily **on the stage**:

- compact measure mode;
- visible guides/anchors/values near the object;
- only the necessary numerical controls in the palette.

Do not turn measurements into a report page.

## 16 · Split-screen is a primary design mode

Around ~832 px width:

- preserve a large useful stage;
- top bar remains **one row**;
- context palette becomes drawer/overlay/pinned compact panel;
- actor roster becomes overlay/palette;
- no stacked navigation headers;
- no squeezed three-column layout;
- touch/click targets remain usable.

Mobile/narrow authoring does not need every palette open simultaneously.

## 17 · Micro-interactions

Minimal does not mean dead.

Use restrained feedback:

- selected tab/actor state;
- fast palette open/close;
- small save confirmation;
- smooth camera reframe when switching task context;
- direct highlight of selected material/part;
- no gratuitous animated chrome.

## 18 · Copy discipline

Default working UI copy should be **labels, values and actions**.

Good:

`Body` · `Face` · `Idle_A` · `Skin` · `Reset` · `Speak` · `Export`

Bad:

`Working with FrizzleBob/Graft`  
`This contract owns the current source state...`  
`You are currently in the Shape & Look phase...`

Tooltips may provide one short sentence for genuinely ambiguous controls.

## 19 · Functional coverage still mandatory

A clean UI is not permission to lose functions.

Before acceptance, maintain the existing Studio-section coverage matrix internally/documentarily, but **do not render that matrix inside the product UI**.

Coverage/documentation belongs in QA docs; authoring controls belong in the app.

## 20 · First redesign deliverable

Before writing the full implementation, produce only:

1. one **1440×900** stage-first mockup;
2. one **~832 px split-screen** mockup;
3. one interaction map for:
   - actor select;
   - Body/material edit;
   - Motion preview;
   - Voice/Talk/Bubble;
   - Export.

No explanation-heavy prototype.

Georg reviews the concept **before** the full rebuild proceeds.

## 21 · Acceptance checklist

A mockup fails immediately if:

- it has more than one persistent header/navigation row;
- explanation paragraphs are visible during normal authoring;
- developer/source/contract meta dominates the page;
- stage is not the dominant visual area;
- actor selection is hardcoded to four characters;
- essential Studio functions disappeared;
- split-screen creates stacked chrome or crushed stage;
- the UI needs prose to explain how to use ordinary controls.

## 22 · Status

- **DECISION / USER REJECTION:** current cluttered redesign is rejected; do not patch it into acceptance.
- **DECISION:** completely new minimal stage-first UI/UX concept.
- **DECISION:** every pixel/word/control must justify its presence.
- **DECISION:** one navigation layer / one persistent header row maximum.
- **DECISION:** no explanatory/meta ballast in normal UI.
- **DECISION:** full functionality remains available through contextual progressive disclosure.
- **IMPLEMENTATION:** none by this reset brief.
- **TESTED RESULT:** none for the new concept yet.
