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

The handoff merge was followed by an actual Cloudflare Playwright run; browser evidence is recorded below. Static and browser status remain separate from Georg acceptance.

## PUBLIC DEPLOYMENT

Canonical human review target:

`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`

KFB Hub:

`https://kayfabizarro.pages.dev/kfb-hub/`

Current status: **PUBLIC DEPLOYMENT · CLOUDFLARE BROWSER PASS** for the S33 Clown deep link.

Proof:

- merge under test: `ae79765c02953704fefaa44fc0c40e21c23da372`
- workflow run: `35421198328` · SUCCESS
- Cloudflare response: 200
- Clown selected through the deep link
- `juggle-cascade-v1` mounted and advanced
- 21 scene nodes
- no console/page errors
- screenshot/report artifact: `10577298328`
- persisted report: `evidence/CLOUDFLARE_BROWSER_RESULT_2026-09-19.json`

Automated diagnostics: max arm residual `0.0001394517`; minimum club **pivot** distance `0.0247257373`. The latter is not surface-clearance acceptance and keeps catch/overlap review open.

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
