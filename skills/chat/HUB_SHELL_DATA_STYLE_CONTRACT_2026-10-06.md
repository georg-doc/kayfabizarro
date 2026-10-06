# KFB Production Hub · Shell / Data / Style Contract · 2026-10-06

Status: **BINDING · REGRESSION PREVENTION**
Owner: **KFB Production Hub**
Human authority: **Georg**

## 1 · Problem

Previous Hub updates repeatedly mixed:
- layout / UI;
- CSS / visual design;
- controls / behavior;
- live production data.

That allowed a data update to remove UI controls, and a shell update to reintroduce stale production data.

This must not happen again.

## 2 · Four hard layers

### A · HUB SHELL / BEHAVIOR · stable deployed code

Owns:
- semantic DOM;
- tabs/navigation;
- ToolBox button;
- WorldBuilder button;
- Resident/Actor control;
- Theme toggle;
- search keyboard behavior;
- Pocket Inbox behavior;
- Decisions/local sync behavior;
- live-data loader;
- live-style loader;
- fallback behavior.

Changes here are code/behavior changes and may require a Site shell publish.

### B · HUB LIVE DATA · mutable without Site publish

Canonical:
`main/kfb-hub/current-board.json`

Owns:
- current work;
- statuses;
- briefing cards;
- open questions;
- links/targets;
- labels/descriptions.

Routine update:
**Web Chat → GitHub JSON → refresh.**

Must never:
- remove DOM controls;
- change CSS;
- redesign layout;
- change local-storage behavior.

### C · HUB LIVE STYLE · mutable without Site publish

Canonical:
`main/kfb-hub/hub-live.css`

The stable Site shell must fetch this CSS as text from GitHub main with `cache:no-store` and inject it after the local fallback/base CSS.

Owns:
- colors;
- typography;
- spacing;
- borders/radii;
- shadows;
- responsive CSS;
- layout CSS where stable semantic selectors allow it.

Routine style update:
**Web Chat → GitHub CSS → refresh.**

No Work/Site publish for ordinary CSS/style adjustments.

If remote CSS fails:
- local deployed fallback/base CSS remains;
- controls and functionality remain usable.

Remote CSS may never execute JS.

### D · HUB LOCAL STATE · browser-local

Stable keys / owners include:
- theme: `kfb.hub.theme.v1`;
- Pocket Inbox: IndexedDB `kfb-hub-pocket-inbox-v1`;
- decisions: current Hub decision local storage/schema;
- seen/read state;
- optional Resident UI state.

A data or CSS refresh must not erase local state.

## 3 · Accepted UI donor · exact

This is the visual/functional baseline, not the older Paper/Dark donor shell:

`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/code/KFB Hub UX Recovery v2.dc.html`

Current verified blob:
`1fb367c70412d18ef9b0802c3feb2019357be525`

Handover:
`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/HANDOVER.md`

Required visible affordances:
- tabs: Heute / Briefings / Projekte / Entscheidungen / Archiv;
- ToolBox;
- WorldBuilder;
- Resident/Actor control;
- Paper/Dark toggle;
- freshness/reload status;
- search;
- Pocket Inbox;
- Today groups;
- Briefings;
- decisions workflow.

The older `kfb-hub/index.html` Paper/Dark donor is **not sufficient acceptance** if these controls disappear.

## 4 · Semantic selector contract

Stable shell must expose selectors/roles for tests and CSS:

- `[data-kfb-hub-shell]`
- `#hubNav`
- `#toolboxLink`
- `#worldbuilderLink`
- `#residentToggle`
- `#themeToggle`
- `#freshnessBar`
- `#hubSearch`
- `#pocketInbox`
- `#todayView`
- `#briefingsView`
- `#projectsView`
- `#decisionsView`
- `#archiveView`

The implementation may use equivalent stable selectors only if recorded in:
`kfb-hub/hub-ui-contract.json`.

## 5 · Static vs dynamic presentation

Static visual rules belong in CSS.

Do not hard-code static presentation into JS.

Allowed JS→style interaction:
- set `data-theme`;
- set semantic state classes/data attributes;
- set a small CSS variable for truly dynamic values;
- show/hide state.

Do not build layout by injecting style strings from live data.

## 6 · Required fixed controls

Live board data can change the targets/text where appropriate, but may not remove:

- ToolBox button;
- WorldBuilder button;
- Theme toggle;
- search;
- local Inbox;
- tabs;
- decisions access.

### ToolBox target
Read from live board `surfaces.toolbox` when valid.

### WorldBuilder target
Read from live board `surfaces.worldbuilder`.
Until a current product URL exists, route to the current World owner/Issue rather than a failed old product surface.

### Theme
Must remain local and instant.
Data loading must never reset the selected theme.

## 7 · Regression matrix

A change is DATA-ONLY when only `current-board.json` changes.

A change is STYLE-ONLY when only `hub-live.css` changes.

A change is SHELL when HTML/JS/local fallback CSS changes.

Tests:

### DATA-ONLY
Must prove:
- controls count unchanged;
- local state unchanged;
- style checksum/computed core tokens unchanged;
- current content updates.

### STYLE-ONLY
Must prove:
- data revision unchanged;
- DOM affordances/selectors unchanged;
- behavior tests unchanged;
- only intended computed styles differ.

### SHELL
Must prove:
- exact donor feature parity;
- desktop/narrow visual comparison;
- data live-fetch;
- live-style fetch;
- fallback paths;
- local-state persistence.

## 8 · Future editing rule

Simple design requests such as:
- make cards tighter;
- adjust background;
- change accent;
- make type larger;
- reduce radius;
- improve mobile spacing;

must normally be fulfilled by editing only:
`main/kfb-hub/hub-live.css`

and verifying after refresh.

No Work required.

Work is needed only when the request changes:
- DOM structure;
- behavior;
- accessibility semantics;
- data contract;
- loader architecture.

## 9 · Acceptance shorthand

**Data may change content.**
**CSS may change presentation.**
**Shell may change behavior/structure.**

No layer silently owns another layer.
