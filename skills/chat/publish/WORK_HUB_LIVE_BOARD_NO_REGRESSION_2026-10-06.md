# ChatGPT Work/WSA · Production Hub Live Board · NO-REGRESSION MIGRATION · 2026-10-06

Status: **ONE-TIME BOUNDED WORK GATE**
Execution mode: **PUBLISH_ONLY + READ-ONLY IDENTITY CHECK**
Repo: `georg-doc/kayfabizarro`

## Outcome

Do exactly two bounded things:

1. update the **existing** Production Hub GPT Site in place so current jobs + briefing cards load live from GitHub `main/kfb-hub/current-board.json`;
2. verify the identity of the **existing** KFB ToolBox GPT Site read-only.

No other surface work.

## Read first · minimal set

1. `skills/chat/START_HERE.md`
2. `skills/chat/KFB_SURFACE_HIERARCHY_CURRENT_2026-10-06.md`
3. `skills/chat/KFB_SURFACE_CLEANUP_EXECUTION_PLAN_2026-10-06.md`
4. Issue #364
5. `main/kfb-hub/current-board.json`
6. shell source listed below

Do not perform a repo-wide audit.

## A · Production Hub identity

Existing direct Site:
`https://kfb-production-hub.frizzlebob.chatgpt.site/`

Existing Site project:
`appgprj_6ab7358322a8819183d2fa036b7b12f9`

This direct Site is the **visual authority** for the current accepted Hub look.

Important:
A Work Preview / cached embedded preview that looks different is **not design authority**.

## B · Exact shell source

Source branch:
`chatgpt-web/surface-consolidation-2026-10-04`

Prepared shell head:
`e31745433c1cdc6f111b05b7e96ada5d8ae53c68`

File:
`kfb-hub/index.html`

That source already adds:
- remote primary board loader:
  `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/kfb-hub/current-board.json`
- local `./current-board.json` fallback;
- dynamic P0/P1/parallel jobs;
- dynamic briefing cards;
- live open-question card.

Do not change the visual system while publishing it.

## C · Current board

Canonical data:
`main/kfb-hub/current-board.json`

Prepared revision:
`2026-10-06.10`

Prepared board blob:
`48decda98ed2fea369095292d7cef50e07ae009e`

The board contains current surface hierarchy and Claude Design UFO briefing.

## D · HARD UI REGRESSION FIREWALL

Before publication:

1. open the **direct Production Hub URL in a fresh browser context**, not only Work Preview;
2. capture desktop screenshot;
3. capture mobile/narrow screenshot if the current Site is responsive there;
4. record visible structure:
   - Paper/Dark visual language;
   - header/hero;
   - theme behavior;
   - search/filter;
   - Today/current cards;
   - Briefings;
   - Inbox only if it is visibly part of the accepted direct baseline;
   - quick links/tool navigation.

After publication:
repeat the same captures at the same viewport sizes.

PASS requires:
- no material color/palette change;
- no typography/layout redesign;
- no generic dashboard chrome;
- no card-radius/spacing/section-order regression;
- no resurrection of obsolete waiting-human World/Combat cards;
- no replacement branding;
- no disappearance of working controls;
- mobile/narrow view remains usable.

Only live **data/status content** may change.

If the new loader source would visibly regress the direct accepted Site:
**STOP → UI_REGRESSION_FAIL**.

Do not "fix" the regression by redesigning.
Preserve the accepted direct-site shell and graft only the loader/data seam.

## E · Publish

Update the existing Production Hub Site **in place**.

Do not:
- create another Hub;
- publish Cloudflare;
- create a new Site project;
- change unrelated Hub features;
- touch Open World/runtime code.

## F · Live-board verification

After publish, verify in the direct Site:

- current board revision is visible as `2026-10-06.10` or the current main revision if it advanced;
- #360 Coworker intake routing is current;
- #364 migration card is current;
- Claude Design UFO Tractor Beam briefing appears;
- Surface Hierarchy / cleanup links are reachable;
- no obsolete four-island/Combat human gates appear as current work.

Verify browser console/network:
- remote GitHub board request succeeds;
- no unexplained errors;
- fallback path exists.

## G · Critical no-republish proof

This proves the new workflow.

After the first Site deployment:

1. read current `main/kfb-hub/current-board.json`;
2. increment only its board revision once, e.g. `2026-10-06.10 → 2026-10-06.11`, and update `updatedAt`;
3. commit that JSON-only change to `main`;
4. fetch exact main head + board file;
5. **DO NOT DEPLOY THE SITE AGAIN**;
6. refresh/reopen the direct Production Hub URL;
7. prove the new revision appears.

Leave the new revision in place. Do not revert it.

PASS requires:
**GitHub board write → browser refresh → new visible revision, with zero Site deployment between.**

## H · ToolBox identity · READ ONLY

Current linked URL:
`https://kfb-toolbox.frizzlebob.chatgpt.site`

Goal:
determine whether this URL belongs to exactly one existing GPT Site project.

Allowed:
- inspect Site/project metadata;
- identify project/version/deployment;
- if exactly one identity is proven, write only that identity/status into:
  `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json`
  and verify GitHub head/file.

Not allowed:
- create ToolBox Site;
- publish ToolBox;
- redesign ToolBox;
- change ToolBox contents/routes;
- migrate specialist tools.

If exact identity cannot be proven:
return `TOOLBOX_IDENTITY_UNRESOLVED`.
This does not fail the Hub migration.

## I · Explicit non-work

Do not touch:
- Production Control UI;
- old Cloudflare Hub UI;
- old Cloudflare Asset Librarian;
- Project Tracker Page;
- Asset Librarian UI;
- specialist Sites;
- Open World;
- Resident/UFO implementation.

Their routing roles are already fixed in GitHub.

## J · Return

Return only:
- Production Hub Site project/version/deployment;
- shell source branch/head actually published;
- direct before/after screenshot evidence;
- desktop + narrow/mobile regression verdict;
- live board revision before probe;
- exact GitHub head after JSON-only probe;
- proof no second Site deployment occurred;
- visible revision after refresh;
- console/network result;
- ToolBox URL → exact project identity OR `TOOLBOX_IDENTITY_UNRESOLVED`;
- files changed;
- PASS / `UI_REGRESSION_FAIL` / `SITE_PUBLISH_BLOCKED`;
- one next gate.

## Done

After PASS:
- close #364;
- routine Hub content updates = Web Chat writes one JSON and verifies it;
- no future Work/Sites job for status, briefs, links or open questions.

No merge. No Cloudflare. No product promotion.
