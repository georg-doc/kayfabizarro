# RETURN · Resident Scene Modules → WSA

**Date:** 2026-09-19  
**Status:** `HANDOFF CHECKPOINT`

## DECISION

Resident scenes are treated as reusable presentation modules:

`consumer support/world → mount resident scene root → local idle/activity update → dispose`

The receiving runtime keeps world, support, collision, movement, camera, portals/progression and persistence.

## IMPLEMENTATION

Already on `main` before this handoff:

- Resident Atlas S33 Clown three-club activity;
- exact blue/green/red KayKit juggling pins;
- frozen `Idle_B` base pose + existing CCD arm follow-through;
- deterministic ballistic/phase math;
- thin scene-module manifest + S6 mount adapter;
- direct Resident Atlas deep link `?resident=clown`.

## TESTED RESULT

S33 static execution evidence already recorded:

- module/source syntax PASS;
- alternating throw sequence `L → R → L → R → L → R`;
- apex 0.85 / gravity 9.81;
- flight `0.832568 s`;
- beat `0.326497 s`;
- full six-beat loop `1.958985 s`;
- per-club state periodicity PASS;
- integer half-turn orientation closure PASS;
- 6-club v1 guard PASS;
- module contract declares consumer-owned collision.

This handoff adds documentation/routing only; it does not convert that static PASS into a browser PASS.

## PUBLIC DEPLOYMENT

Canonical human review target:

`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`

KFB Hub:

`https://kayfabizarro.pages.dev/kfb-hub/`

Current status: **PUBLIC ROUTE EXISTS; S33 exact deployed/browser revision still requires WSA verification.**

A Cloudflare-only Playwright proof is checked in at `.github/workflows/resident-scene-modules-cloudflare-qa.yml`; see `TEST_REPORT.md`. Its actual merged workflow result must be recorded before claiming a browser PASS.

No githack/rawcdn.githack URL is part of this handoff.

## DROPBOX RESULT

Read-only provenance check:

- Resident Atlas Dropbox export is older S32-era donor/provenance.
- Free Roam Platformer Dropbox export is a candidate donor, PUBLICATION NOT PERFORMED.
- Current GitHub main supersedes those exports for implementation state.

No Dropbox copy/move/upload was performed.

## RETURN / ROLLBACK

All S33 implementation is already isolated by PR #85 / merge `c867788416c50fa9c6e6ce57abc4bad85dca90d1`.  
This handoff adds only additive docs/routing/publication policy. WSA should not revert unrelated later `main` work; if the module is rejected, disable/remove the module consumer seam or revert its specific changes rather than resetting repository history.

## OPEN

See `BACKLOG.md`.

The one immediate human gate remains:

**Accept / tune / reject the visual 3-club loop before Platformer integration.**
