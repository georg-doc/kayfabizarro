# ChatGPT Work/WSA · Restore Accepted Hub Shell + Hard Layer Separation · 2026-10-06

Status: **P0 UI REGRESSION REPAIR · ONE SHELL PASS**
Execution mode: **BOUNDED_SLICE**
Owner: **KFB Production Hub**
Repo: `georg-doc/kayfabizarro`

## Why this rebrief exists

The last Hub migration proved the live GitHub data path, but Georg's direct review found a real UI regression:

**the live-data shell is not the accepted Hub UX candidate.**

Missing/regressed from the accepted design:
- ToolBox button prominence/behavior;
- WorldBuilder button;
- Theme toggle;
- accepted top navigation;
- associated Hub controls/functionality.

The prior "no UI regression" conclusion used the wrong visual baseline and is superseded.

## Read first · minimal

1. `skills/chat/START_HERE.md`
2. `skills/chat/HUB_SHELL_DATA_STYLE_CONTRACT_2026-10-06.md`
3. `kfb-hub/hub-ui-contract.json`
4. Issue #364
5. accepted donor and handover below
6. current direct Production Hub

Do not repo-crawl beyond named files unless a named dependency is missing.

## Accepted UI/behavior donor · BINDING

Exact candidate:
`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/code/KFB Hub UX Recovery v2.dc.html`

Blob:
`1fb367c70412d18ef9b0802c3feb2019357be525`

Handover:
`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/HANDOVER.md`

This donor corresponds to Georg's desired Hub direction:
- Heute / Briefings / Projekte / Entscheidungen / Archiv;
- ToolBox;
- WorldBuilder;
- Resident/Actor control;
- Paper/Dark Theme toggle;
- freshness/reload;
- search;
- Pocket Inbox;
- decisions.

Show/inspect this exact donor before implementation.

Do **not** use the older Paper/Dark `kfb-hub/index.html` donor as the UI baseline.

## Preserve what already works

The current Site already proved:
- GitHub live-board fetch works;
- no-republish board updates work;
- UFO briefing can arrive from live data;
- direct Site deployment works.

Do not discard these mechanisms.

Outcome is:
**accepted v2 shell/functionality + current live-board mechanism**.

Not:
another redesign.

## New hard architecture

### Shell / behavior
Stable deployed HTML/JS owns controls and behavior.

### Live data
`main/kfb-hub/current-board.json`

Status/briefing/link changes require GitHub JSON + refresh only.

### Live CSS
`main/kfb-hub/hub-live.css`

The shell must fetch this file as text using `cache:'no-store'` and inject it after local fallback/base CSS.

Simple future styling changes require GitHub CSS + refresh only.

If remote CSS fails, local fallback CSS keeps the Hub visually usable.

### Local browser state
Preserve:
- `kfb.hub.theme.v1`;
- Pocket Inbox IndexedDB;
- decisions;
- seen/read state.

Live data/style refresh may not clear them.

## Functional controls · REQUIRED

The final direct Site must visibly provide and functionally verify:

1. Heute
2. Briefings
3. Projekte
4. Entscheidungen
5. Archiv
6. ToolBox
7. WorldBuilder
8. Resident/Actor control
9. Paper/Dark toggle
10. Freshness/reload
11. Search
12. Pocket Inbox

No live data response may remove these controls.

Use stable semantic IDs/classes recorded in `hub-ui-contract.json`.

## Link behavior

### ToolBox
Button remains fixed in the shell.
Target may come from live board `surfaces.toolbox`.

### WorldBuilder
Button remains fixed in the shell.
Target comes from live board `surfaces.worldbuilder`.

If there is no accepted current World product URL, use the current World owner/Issue link rather than the failed old four-island product.

### Theme
Must switch instantly and persist through refresh/data reload.

## CSS separation

Extract/static-ize presentation so ordinary design changes can occur in CSS, not JS/data.

Required:
- static layout/presentation classes in CSS;
- JS controls state via classes/data attributes;
- no construction of ordinary layout via live data style strings;
- dynamic per-item state styling may use semantic classes or small CSS variables.

Do not perform an aesthetic redesign while separating CSS.

Pixel/visual goal:
match the accepted donor before and after refactor.

## Live CSS proof · REQUIRED

After the one Site publish:

1. verify current live CSS loaded from GitHub main;
2. make a harmless temporary CSS-only change in `main/kfb-hub/hub-live.css`;
3. verify exact GitHub write;
4. **do not deploy Site again**;
5. refresh direct Hub;
6. verify computed/visible style changed;
7. restore intended CSS through GitHub only;
8. refresh and verify restoration.

This proves future simple design tuning does not need Work/Sites.

## Data proof · retain

Also confirm current board content still updates without Site deployment.

Do not redo elaborate tests if the existing mechanism remains intact; one visible current board item is enough.

## Regression firewall

Compare the final direct Site against the accepted v2 donor at:
- desktop;
- narrow/mobile.

FAIL if any required affordance is absent.

FAIL if:
- ToolBox missing;
- WorldBuilder missing;
- Theme toggle missing;
- Pocket Inbox missing;
- Decisions missing;
- tabs collapse into the older KFB/DocCheck/filter shell;
- generic dashboard/old donor chrome returns;
- local theme/inbox state is lost.

Use:
`UI_REGRESSION_FAIL`

Do not declare PASS from source inspection alone.

## Do not

- touch Open World runtime;
- redesign Production Control;
- build/publish ToolBox;
- touch Cloudflare;
- sync Project Tracker;
- create another Hub;
- change UFO/Resident/Audio products.

## Return

Return:
- exact repo/branch/head;
- Site project/version/deployment;
- accepted donor blob used;
- changed files;
- direct before/after screenshots desktop + mobile;
- 12 required affordances PASS/FAIL;
- Theme persistence test;
- Pocket Inbox persistence test;
- live-data no-republish test;
- live-CSS no-republish test;
- console/network result;
- unresolved items;
- one next gate.

PASS only when Georg's accepted Hub UX and current live data/style architecture coexist.

No merge. No Cloudflare.
