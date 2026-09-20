# KFB Hub · Paper/Dark + Stage/Live Preview Slice · RETURN

Date: 2026-09-20  
Owner: **KFB Production Hub**  
Repository: `georg-doc/kayfabizarro`  
Branch: `work/kfb-hub-paper-dark-previews-2026-09-20`  
Draft PR: **#141**  
Base: `main@a6b9220a0b42d50a9de9804fad22e84dde2c322c`  
Review-packet head immediately before this Return seal: `3b583dc226c56d4b8529f69d0f3003ec2cc440ce`

## Goal

Improve only the existing KFB Hub presentation:

- addressable filter/tab routes;
- current Stage/Live visual preview tiles;
- a more physical editorial Paper/Dark visual system.

No project runtime, status truth or deployment ownership moves into the Hub.

## Actual result

### Hash routes

The filter state is now shareable/bookmarkable.

Examples in the Hub URL fragment:

- `#stage` (alias `#live`);
- `#briefings`;
- `#todo`;
- `#tools`;
- `#projects`;
- `#recovery`;
- `#town`;
- `#skills`;
- `#history`;
- `#all`;
- DocCheck equivalents such as `#doccheck-stage`.

### Paper / Dark

The Hub has an explicit Paper/Dark toggle with browser-local persistence.

Paper uses warm off-white stock, restrained rust/green accents, subtle rule/fiber texture and harder editorial edges. Dark retains the same physical/editorial grammar rather than becoming generic SaaS dark mode.

### Stage / Live preview tiles

The Stage/Live view derives and deduplicates the current canonical `kayfabizarro.pages.dev` targets already present in the Hub's `links`, `todos` and `briefings` arrays.

Current derived inventory at this slice:

- **KFB: 19 unique targets = 8 Stage + 11 Live**
- **DocCheck: 4 unique targets = 4 Live**

Each tile requests a current screenshot with a maximum one-hour cache. If that image cannot load, the tile falls back to a lazy, non-interactive frame of the same public target. Clicking the tile always opens the direct public target.

The gallery does **not** crawl every historical directory in `kfb-hub/stage/`. That tree contains rejected/failure evidence as well as current candidates; blindly surfacing every folder would promote stale history. The existing Hub routing remains the current presentation source.

## Tests

Static evidence: **18/18 PASS**.

Covered:

- inline JavaScript parse;
- KFB and DocCheck target derivation;
- Paper/Dark tokens and persistence;
- `#stage` / `#live` aliasing;
- DocCheck hash prefix;
- real anchor filter controls;
- preview gallery creation;
- existing-data derivation;
- URL deduplication;
- one-hour snapshot freshness;
- same-target fallback;
- duplicate legacy-card suppression in Stage view;
- responsive 3 / 2 / 1-column grid;
- direct public target links.

Evidence:
- `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/PAPER_DARK_PREVIEWS_2026-09-20/SOURCE.json`
- `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/PAPER_DARK_PREVIEWS_2026-09-20/TEST_REPORT.md`

## Changed files before Return seal

- `kfb-hub/README.md`
- `kfb-hub/index.html`
- `skills/chat/CHANGELOG.md`
- `skills/chat/REGISTRY.json`
- `skills/chat/START_HERE.md`
- `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/PAPER_DARK_PREVIEWS_2026-09-20/SOURCE.json`
- `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/PAPER_DARK_PREVIEWS_2026-09-20/TEST_REPORT.md`

This `RETURN.md` is added as the final handoff document after that roster.

## Public / human gate

**No new candidate Cloudflare URL is claimed.**

The canonical public Hub may still show the previous deployed revision. No real-browser branch visual proof, PUBLIC_VERIFIED claim or Georg visual acceptance has been recorded for this candidate.

## Unresolved

- direct Cloudflare Stage publication of the exact PR head;
- real-browser check at desktop / split / mobile widths;
- confirm screenshot tiles load reliably from the public Hub environment;
- Georg visual acceptance of Paper and Dark presentation.

## Exactly one next gate

Publish the exact Draft PR #141 head through the existing Cloudflare publication path to one fixed `kayfabizarro.pages.dev` Stage review route, open that exact route, and verify hash routing, Paper/Dark toggle and representative Stage/Live preview tiles at desktop, split-screen and mobile widths.

Do not merge or promote Live before that gate.
