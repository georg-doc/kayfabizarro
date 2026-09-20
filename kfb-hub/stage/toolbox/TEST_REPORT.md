# TEST REPORT · KFB ToolBox Home v1

Status: STATIC CONTRACT PASS · PUBLIC BROWSER NOT RUN
Date: 2026-09-20
Branch: `toolbox/toolbox-home-v1-2026-09-20`
Stage target: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

## Static contract

**32/32 PASS** against the exact branch files after the Hub-link checkpoint.

Coverage:
- page/manifest build markers and JSON schema;
- 15 unique tool cards rendered;
- 8/8 cards with a public route use real Cloudflare pages as mini-previews;
- all public tool routes are `https://kayfabizarro.pages.dev/...`;
- no githack, raw-CDN or `file://` runtime links;
- no fabricated image thumbnails;
- Asset Librarian, Resident Atlas, World Atlas, Dungeon S13.2, Hex Realm and Motion Lab routes are present;
- 3D in-scene editor remains `adapter-gate`, not falsely promoted;
- Tiny Treats remains Venue/recipe scope and is explicitly kept out of Dungeon;
- Plant Lab route remains blocked until owner-path promotion;
- Vehicle Lab, FrankenStein Studio, Rigging Lab and Animation Lab are visible source-only cards;
- KFB Hub top navigation and never-empty fallback both link to ToolBox Home;
- branch is additive over `asset/kaykit-bits-bundle1-2026-09-20`: 3 commits ahead / 0 behind at test time;
- Asset Registry/Librarian truth, Dungeon S13.2 ownership and host scene/runtime ownership are preserved.

## Public browser

`NOT_RUN`.

The external browser reader available in this chat could not access the existing `kayfabizarro.pages.dev` pages, so that failure is not treated as evidence that the deployed routes are down. No public-pass claim is made here.

## Human gate

After Stage publication:
1. open the exact ToolBox Home URL;
2. confirm the 8 live mini-previews are useful and do not steal pointer/touch interaction;
3. confirm the Source-only cards are visibly distinct from runnable tools;
4. confirm the page is useful on mobile;
5. approve or reject the router before any Live promotion.
