# TEST REPORT · BILLBOARD-CONTEXT-REAL-WORLD-01

Status: **FAILURE_RECOVERY · RECEIVING-OWNER SOURCE CLOSURE BLOCKED**
Date: 2026-10-03
Owner: KFB Travel Combat v25 receiving the proven Billboard stack
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/billboard-context-real-world-01-2026-10-03`
Draft PR: **#338**
Candidate head: `cb495ab82c33e4880035836bfcae7a945d44b183`

## What was implemented

One additive module:
`travel/KFB Travel Combat v25/terrain-v25/billboard-context-world.v1.js`

Two small runner seams:
- optional mount behind `?billboardWorld=1`;
- one `billboard` step in the existing `createTravelManager` pipeline before `render`.

Protected ownership in the candidate:
- renderer / scene / camera = Travel v25;
- frame loop = Travel `createTravelManager`;
- real zone/card = current Academy + zone-ring;
- physical body = accepted Kenney Billboard + K2 v10;
- ambient face = frozen H13;
- no independent rAF, renderer, camera, island registry or Resident mapping.

Real target:
- `forget_utopia#1`
- `The Glossy Horizon`
- current Academy DECK_ZONES card 1/6
- placement intended from actual Academy holder / ring
- y intended from Travel `safeGroundAt`
- zone metadata intended from `ring.zoneOf(card)`.

## Attempt 1/2

Workflow run: `37091855680`
Job: `111113683713`
Artifact: `11263390637`
Digest: `sha256:dd2452695663d413ecf611f7d163bd585fb88156aa5050b5021a2722770ec143`

Owner/static gates:
- protected receiving-owner pins PASS;
- static owner gate PASS.

Browser:
- HTTP 200 for raw `.dc.html`;
- only 1/1 executed assertion because Travel never booted;
- wait for `__travelPOC.billboardWorld.ready` timed out;
- 8 first-party failures.

Exact initial missing host dependencies:
- `themes/kfb-med.css`
- `themes/kfb-shell.css`
- `support.js`
- `cardbuilder/kfb-card-format.js`

Therefore attempt 1 did **not** test the Billboard runtime. It failed before `travel-poc.js` booted.

## Repair pass 2/2 · source-closure investigation

The repair did not change functional Billboard or Travel code.

Verified donor availability:
- v16 standalone host: `travel/travel-v16/index.html`
  blob `e58349405eda0f5fcce68da7b87c229b8ae8348e`;
- shared Travel CSS:
  `kfb-med.css` `f4eb17f856d7dbed4e5cc7babf44510de5d3efe6`;
  `kfb-shell.css` `79be81a6450936819c8f080ea9abbb5cb7cef559`;
- shared DC runtime:
  `cb009b69ec6b5e00f48c6287a587fe7e0c6c421b`;
- Travel/Overworld card-format:
  `210f48f19e0bec06574ff7bf676b54282a84523e`.

A complete dependency scan of `terrain-v25` then found additional parent-level dependencies:
- `../modules/kfb-hit-response.js`
- `../modules/kfb-combat-cues.js`
- `../modules/kfb-combat-travel-adapter.js`
- `../modules/kfb-combat-def.js`
- `../modules/kfb-combat-sfx.v2.json`
- `../zone-index.json`
- `../zone-registry.json`
- `../schrittmass.json`
- `../cardbuilder/kfb-card-format.js`.

Important source result:
- current `main`: no shared Combat module files and no `schrittmass.json` at the expected v25 workspace path;
- `travel/a0-exact-mirror-2026-09-17`: same incomplete v25 cut;
- `chatgpt-web/combat-ca2-04a-source-hold-2026-09-21`: no root/shared `modules/`;
- `prep/walk-drive-combat-2026-09-18`: no root/shared `modules/`;
- `travel/wip/travel_globe_wsa`: has Runtime/CSS/CardBuilder but only `modules/kfb-mech-combat.js`, not the required shared Combat owner files;
- zone registry/index data exist in later Worldbuilding donor cuts, but substituting those plus reconstructed Combat modules would create an unverified replacement workspace.

The project documentation itself says these modules are shared owners and that the v25 DC should be opened in its design workspace. The GitHub cut does not currently contain enough source to reproduce that workspace.

## Conclusion

The Real-World Billboard candidate is **preserved but not browser-proven**.

The blocker is not a measured Billboard defect. It is a receiving-owner source-closure defect in the current GitHub Travel v25 cut.

No stubs, substitute Combat modules, replacement zone contracts or fake standalone owner were introduced.

## Exactly one next gate

**TRAVEL-V25-SOURCE-CLOSURE-01**

Recover/persist the actual shared Travel v25 workspace dependencies under a stable source owner (or provide the canonical existing host that already supplies them). Only after that source closure should `BILLBOARD-CONTEXT-REAL-WORLD-01` resume from candidate head `cb495ab82c33e4880035836bfcae7a945d44b183`.
