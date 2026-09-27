# RETURN · WB-ZONE-SEAM-01 restart · 2026-09-27

Status: **IN PROGRESS · BUILDING CROP PASS · ROAD-PARTS GATE FAIL**

- repo: `georg-doc/kayfabizarro`
- owner: **existing WorldBuilder / OSM City Lab seam**
- branch: `chatgpt-web/wb-zone-seam-01-restart-2026-09-27`
- Draft PR: **#257**
- base: frozen PR #252 recovery head `6b08636e552f39ac5f00d0216adcf70fa40f80c6`
- consumed diagnostic: PR #255 · exact 369-id crop PASS
- runtime crop implementation checkpoint: `4cfb3eb4fb56bc189d1bb3f20c9918f680ba1185`
- current tested head: `2dbefdc216307772201b1a40a6422229c174e546`
- Stage/Human gate: **none**
- merge/live: **not authorized**

## Proven now

The real `wb-zone-seam-01.mjs` gate reaches:
- manifest id PASS;
- bake revision PASS;
- WorldBuilder storage contract PASS;
- **building crop parity PASS · 369**.

The implementation changes only baked-building selection to the PR #255 proven arithmetic mean of every serialized footprint coordinate including the repeated closing point. Landuse and other crop logic remain untouched.

## Current blocker

First newly exposed seam assertion:
- **road-parts parity FAIL · 865 actual vs 844 frozen fixture**;
- GitHub Actions run/job: `36323923983 / 108632922023`;
- World r2 static/browser/WB2 regression correctly remains unreached.

This is **repair pass 1** on the newly exposed road-parts gate. It is not repair pass 3 of frozen PR #252.

## Protected boundary

Do not change renderer, presenter, terrain, LOOK-TORSION, landmarks, actor/movement owners or Stage. Diagnose the existing frozen road-crop semantics first.

## Current next action

Repository-native source/history inspection for the exact frozen road-part crop rule. Persist the finding before any repair.
