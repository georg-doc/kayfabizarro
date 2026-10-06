# Style Reference Browser / Viewer R2 · UX findings + future execution plan

Status: **LATER DESIGN SLICE · NOT STARTED**
Date: 2026-10-06
Owner: **KFB Asset Registry / Asset Librarian**

## Why R2 is needed

Georg's current Style Reference screenshot shows a working feature set but an inefficient daily-browsing surface.

Observed problems from the current UI:

1. Search + seven filter/reset controls consume most of the first viewport.
2. URL intake is visually dominant and mixed with normal browsing.
3. A direct Blogger image URL becomes a long encoded filename / `DISCOVERY_ONLY` card.
4. The Inspector spends a large area on a generic `URL` placeholder and raw URL-derived title.
5. The large editorial hero heading pushes actual cards below the fold.
6. Browsing and inspection do not feel like one continuous visual workflow.
7. The useful reference image should dominate inspection, but metadata currently dominates when preview resolution fails.
8. Saved/reference-set actions are less visible than search/intake chrome.

The issue is not the Paper/Dark visual language itself. The problem is information hierarchy and browsing density.

## Desired R2 product model

**Browse fast → inspect visually → collect → compare/use**

### Browser
Prefer:
- compact sticky search;
- collapsible filter rail or compact filter chips;
- source/category collection navigation;
- dense visual card grid/masonry;
- obvious curated-vs-discovery badges;
- sort: curated / recent / inspected / saved / source;
- quick add-to-set directly on thumbnail;
- intake moved to a secondary action/drawer.

### Viewer / Inspector
Prefer:
- actual reference visual as dominant object;
- fit / 100% / zoom;
- source board/page navigation when multiple visuals exist;
- title + creator + verification compactly above/below visual;
- construction principles / notes in secondary panels;
- related assets/references as lower-priority rail;
- source isolation state clearly visible;
- easy next/previous navigation without returning to grid.

### Compare
Later useful mode:
- 2–4 references side by side;
- synchronized metadata strip;
- add selected refs to one Reference Set;
- ideal for Claude Design pack preparation.

### Intake
Move from permanent top-of-page form to:
- `+ Add reference` action;
- modal/drawer;
- URL / private file / photo options;
- canonical-resolution feedback inside the intake flow.

## Mobile
Current five-icon mobile nav may remain as a donor.
R2 should prioritize:
- visual cards first;
- filters in sheet/drawer;
- full-screen inspector;
- swipe next/previous;
- persistent Add to Set action.

## Execution split

### R2A · ChatGPT Work/WSA · HANDOFF PREP
Because Claude Design cannot access the private Site directly:

Work exports a portable design packet containing:
- exact current Site source/component snapshot relevant to Style References;
- desktop screenshot(s);
- mobile screenshot(s);
- current state/interaction inventory;
- protected existing Asset/Motion behaviors;
- this UX findings document.

No redesign yet.

### R2B · Claude Design · VISUAL/INTERACTION DESIGN
Claude Design receives the portable GitHub packet.

Outcome:
- compact Browser;
- visual-first Inspector;
- mobile variant;
- optional Compare mode;
- clear intake separation.

Claude Design must preserve existing Paper/Dark/KFB donor language and may not invent a generic SaaS dashboard.

### R2C · ChatGPT Work/WSA · INTEGRATION
Integrate the accepted R2 design into the **existing** Asset Librarian Site and run regressions.

No second Site.

## Protected boundaries

- existing Asset Librarian owner/site retained;
- Asset/Motion functionality retained;
- Style Reference data model retained;
- Reference Sets retained;
- no second Registry;
- no generic SaaS/card-wall redesign;
- no source/provenance weakening;
- no Cloudflare substitution.

## Exactly one future gate

**R2A_EXPORT_CURRENT_STYLE_REFERENCE_UI_FOR_CLAUDE_DESIGN**
