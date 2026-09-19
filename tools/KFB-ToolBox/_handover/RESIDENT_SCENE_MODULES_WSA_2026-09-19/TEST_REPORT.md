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

## Cloudflare browser proof · PASS

Workflow:

`.github/workflows/resident-scene-modules-cloudflare-qa.yml`

Canonical target:

`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`

Merged handoff commit:

`ae79765c02953704fefaa44fc0c40e21c23da372`

Actual run:

- workflow run: `35421198328` · **SUCCESS**
- job: `105839115967` · **SUCCESS**
- artifact: `10577298328` · `resident-scene-modules-cloudflare-proof`
- artifact digest: `sha256:f23f9efd2ca56018658886aed1085676dde050cae8a6aa9b65cd6158d0183ca8`

Persisted machine-readable result:

`evidence/CLOUDFLARE_BROWSER_RESULT_2026-09-19.json`

Observed checks:

- Cloudflare HTTP **200**;
- deep link selected `clown`;
- `juggle-cascade-v1` mounted;
- 21 scene nodes loaded;
- activity advanced to 31 sampled frames during the proof window;
- max CCD arm residual measured `0.0001394517`;
- minimum **club pivot-to-pivot** distance observed `0.0247257373`;
- no console/page errors.

The workflow artifact contains `clown-s33.png` and `report.json`.


### Confirmation run after proof-doc merge

A second run on final proof merge `33b3785499e37b0a8b39a8465819988bc22a2703` also passed:

- workflow run: `35421390825` · **SUCCESS**
- job: `105839641004` · **SUCCESS**
- artifact: `10577653402`
- artifact digest: `sha256:4aa59b60f86a5b40eb75049f8f4556c5fd808f2b384fd3df0b1b7e0c735fec31`
- retention: through `2026-12-18T04:28:46Z`
- HTTP 200
- Clown selected
- `juggle-cascade-v1` mounted
- 21 nodes
- 32 activity samples
- max arm residual `0.0001464063`
- minimum club **pivot** distance `0.0007849185`
- no browser console/page errors

Persisted as:
`evidence/CLOUDFLARE_BROWSER_RESULT_2026-09-19_R2.json`

The captured frame shows club geometry entering the Clown head/upper-torso silhouette. Combined with the near-zero pivot-distance sample, this makes trajectory/catch tuning an explicit OPEN visual/geometry item. The automated run is green because boot/activity/error contracts pass; it does **not** assert that the juggling paths look accepted.

### Evidence boundary

This is now a real **BROWSER TESTED RESULT on Cloudflare**. It is not Georg's visual acceptance.

The `0.0247` minimum club-distance value is a **pivot-position diagnostic**, not mesh surface clearance. It shows that two club anchors become very close during the loop and therefore strengthens, rather than closes, the human/geometry review gate around catch overlap.

## Environment note

The chat execution environment itself could not resolve `kayfabizarro.pages.dev` during a direct fetch attempt. Repository CI did resolve and execute the canonical Cloudflare route successfully; the CI result above is the browser evidence.
