# SUPERSEDED · DO NOT RUN

Georg decision 2026-10-06: this UI problem is sufficiently specified for direct ChatGPT Work/WSA repair. Do not spend Claude Design tokens here.

Current brief:
`BRIEF_WORK_STYLE_REFERENCE_BROWSER_VIEWER_R2_DIRECT_REPAIR_2026-10-06.md`

This Claude Design brief remains provenance only.

---

# BRIEF · Claude Design · Style Reference Browser/Viewer R2

Status: **WAITING FOR R2A EXPORT PACKET**
Date: 2026-10-06

## Executor
**Claude Design**

## Outcome
Redesign only the **Style References browsing/viewing experience** inside the existing KFB Asset Librarian.

Do not design a second Site.
Do not redesign the whole Asset Librarian.
Do not use the current Asset-grid layout as the default interaction model.

## Input
Read the portable GitHub packet produced by R2A:

`tools/asset_registry/librarian/reference-browser-r2/design-handoff-current/`

Read:
- exact current source snapshot;
- current state;
- desktop/mobile screenshots;
- FAIL analysis;
- representative data sample;
- protected boundaries.

No private Site access is required.

## Product problem
The current implementation stores and searches the right data but fails at the core visual task:

**the user cannot properly see and judge the reference drawings themselves.**

Tall tutorial sheets are cropped into cards and a partial Inspector.
Search/filter/intake chrome dominates the screen.
The experience behaves like an Asset catalog, not a visual-reference library.

## North star

**Browse visually → inspect the complete source → collect → compare/use**

The actual drawing/tutorial board must be the dominant UI object.

## Required R2 experience

### Gallery
- dense but visual-first;
- meaningful uncropped/less-cropped previews;
- creator/source/category secondary;
- quick Add to Set;
- inspected/saved status compact;
- compact search;
- filters collapsed/chips/sidebar, not two rows of permanent controls.

### Viewer
- full-height/full-width useful display of portrait tutorial boards;
- complete drawing visible;
- fit width / fit page / 100% / zoom;
- next/previous reference;
- next/previous board inside a multi-board source;
- full-screen/lightbox mode;
- keyboard-friendly navigation.

For a two-board Etherington source:
**both boards must be individually visible and navigable.**

### Metadata
Keep compact:
- title;
- creator;
- verification;
- source;
- inspected state;
- Add to Set;
- notes/construction principles.

Raw URLs and enum-like provenance values are secondary detail, not headline UI.

### Compare
Design a lightweight 2–4 reference compare mode if it strengthens the workflow.
It must help prepare Reference Sets/Claude packs, not become a generic moodboard.

### Intake
Move URL/private-file intake behind:
**+ Add reference**

Use modal/drawer/sheet.
It must not dominate browsing.

### Mobile
- reference visuals first;
- full-screen viewer;
- swipe/next/previous;
- filters in sheet;
- persistent Add to Set;
- preserve existing five-icon nav only if it still earns its space.

## Visual language
Preserve the accepted KFB Paper/Dark family.
Do not create:
- generic SaaS dashboard;
- generic Pinterest clone;
- giant editorial hero;
- replacement branding;
- second navigation shell.

## Deliverables
Produce:
1. desktop Browse;
2. desktop Viewer with a tall two-board Etherington tutorial;
3. desktop Compare;
4. mobile Browse;
5. mobile Viewer;
6. interaction notes;
7. component/state map for Work integration;
8. explicit before→after mapping of each Georg FAIL item.

Prefer a working Claude Design prototype if available, plus exportable source/assets.

## Human success criterion
A user must be able to open Style References and immediately answer:

**“What is actually drawn on this reference?”**

without opening the original website in another tab.

## Protected boundary
- same Asset Librarian Site;
- same data model;
- same 58 built-in corpus;
- same local Saved Sets/Cards/Notes;
- provenance/source-isolation retained;
- no Registry replacement;
- no runtime changes;
- no publication/merge.

## Exactly one next gate
**GEORG_VISUAL_REVIEW_STYLE_REFERENCE_BROWSER_VIEWER_R2**
