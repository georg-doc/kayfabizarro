# TEST REPORT · Resident Scene Modules WSA handoff

**Date:** 2026-09-19  
**Branch:** `resident-atlas/wsa-handoff-2026-09-19`

## Static handoff sanity · PASS

Executed against the handoff branch after the documentation/routing changes:

- `SOURCE_STATE.json` parses;
- current Astra `SOURCE_BASELINES.json` parses;
- current Astra active source baseline contains no `raw.githack.com` / `rawcdn.githack.com`;
- WSA handoff names WSA as existing integration lead;
- handoff contains the Cloudflare Clown review route;
- backlog includes Platformer consumer proof, activity library, 4–6 club gates and owner cleanup for the old BOX1 githack workflow;
- `STAGE_LIVE_WORKFLOW.md` contains the Cloudflare-only public URL rule;
- central router contains the same active publication rule;
- KFB Hub contains the `Resident Scene Modules · WSA review` card;
- the classic inline Hub script containing the new card parses.

Result: **11 files checked · PASS**.

## S33 implementation evidence · inherited tested result

The underlying S33 implementation was already tested before this handoff and is not reclassified here:

- source/module syntax PASS;
- throw order `L → R → L → R → L → R`;
- ballistic flight `0.832568 s`;
- beat `0.326497 s`;
- six-beat loop `1.958985 s`;
- phase periodicity PASS;
- integer half-turn orientation closure PASS;
- 6-club guard PASS.

## Cloudflare browser proof · workflow added

Workflow:

`.github/workflows/resident-scene-modules-cloudflare-qa.yml`

Target:

`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`

It checks:

- Cloudflare HTTP response;
- deep-link selects `clown`;
- `juggle-cascade-v1` mounts;
- activity samples advance;
- scene node count is nontrivial;
- club-clearance diagnostic becomes finite;
- arm-residual diagnostic becomes finite;
- no console/page errors;
- screenshot artifact `clown-s33.png`;
- JSON artifact `report.json`.

At handoff-authoring time this workflow has not yet run on the merged handoff commit. Do not mark `BROWSER TESTED RESULT` until the actual workflow run is green and the artifact is inspected.

## Environment limitation

This chat's direct Cloudflare fetch attempt could not resolve `kayfabizarro.pages.dev` because the execution environment had temporary DNS failure. That is not evidence that the site is down. Browser proof is delegated to the repository CI workflow above, on the canonical Cloudflare URL only.
