# TEST REPORT · BILLBOARD-CONTEXT-WORLDLOOK-01

Status: **FAILURE_RECOVERY · TECHNICAL_ASSERTIONS_PASS · VISUAL_EVIDENCE_INCOMPLETE**
Date: 2026-10-02
Owner: Billboard Media Residency consuming K2 clay + Travel WorldContext
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/billboard-context-worldlook-01-2026-10-02`

## Source lock

Upstream Consumer-01:
- PR #324
- tested head `ffda55d76c89e69e18f036d3929613d2839d4e0e`
- closure head `174be3e64e029b441ee8d1bdc84b4e378a530713`
- WorldContext proof: `forget_utopia#7`
- accent `#ffb27a`
- world seed `1985738440`
- biome `fractured`

K2 current donor blobs:
- material v10 `d994a9b656131be3b7a13d45edcb4253d34f3620`
- profiles v2 `af57b88ae382a36514f9fa50beed5ab6ca18647a`
- relief v2 `2bb843d29e9f2571f87d9e6210f34240b1a0a1a9`
- relief v5 `1dfd171e08b14f996601189a7f2c108101f84132`
- toolmix v1 `b9a039ccfb90ea04910db3cf05928817d92e9399`
- current integration donor `fc31353ede12696717fa4943200f89e4b7eb67a0`

Protected upstream R11/Consumer files remained unchanged.

## Candidate

Implementation head 1:
`7f08630bdd593a585dbec8a38e2e5bd2c99edf59`

Repair head:
`804a75f6d18c0ff3ecba47bb3e275a4a47f17fc7`

WorldLook policy:
- physical Kenney billboard donor body only;
- K2 `clay-material.v10`;
- K2 prop profile + `TOOLMIX.vehicle`;
- Travel WorldContext accent consumed verbatim: `#ffb27a`;
- Travel WorldContext seed: `1985738440`;
- no 3-stop -> 8-role palette mapper;
- no wd-look/K2 shader stacking;
- content plane excluded from Clay material;
- H13 unchanged.

## Attempt 1/2

Run `37047686935`
Job `110973056364`
Artifact `11244483951`
Digest `sha256:553a7c69e3485a2390ff48c427e306f1d57cd55cc54278688422a09dc724a6c3`

Result: **11/13 checks PASS**.

Actual K2 adaptation already succeeded:
- bodyMeshes 4
- clayMaterials 4
- accent `#ffb27a`
- seed `1985738440`
- source materials preserved
- H13 remained live
- no first-party failures

Two red assertions were proof timing defects:
- source Box3 captured before accepted B1/H13 content-fit scaling;
- panel material UUID captured before legitimate H13 panel-material setup.

A full-page screenshot also timed out.

## Repair pass 2/2

Repair changed:
- source Box3 and panel material measurement moved immediately before K2 adaptation;
- screenshots limited to visible WebGL canvas;
- WorldLook architecture unchanged.

Run `37050667691`
Job `110982972706`
Artifact `11246921214`
Digest `sha256:e0f2b89eda8c54439228c8aedf39f94d2075e624356f0a2ce05f30df769b8dd7`

Functional result: **13/13 assertions PASS**.

Confirmed:
- candidate HTTP PASS;
- unadapted donor state observable;
- H13 live;
- real WorldContext accent available;
- K2 body adaptation applied;
- exact accent `#ffb27a` consumed;
- exact WorldContext seed `1985738440` consumed;
- 4 body meshes / 4 K2 materials;
- source materials retained;
- geometry bounds unchanged:
  source = adapted = min [-2.1,0,-1.00602], max [2.1,4.2,0.99402];
- content plane untouched;
- H13 still live after K2 adaptation;
- exact K2 v10 material blob pinned.

K2 bake in this headless proof: **8784 ms**.

The run still concluded FAIL because the adapted WebGL-canvas screenshot timed out while Playwright waited for the continuously animated element to be stable.

Important:
- this is a visual-evidence transport/capture failure;
- it is not a failed functional assertion;
- first-party failures: **0**;
- no third repair pass is allowed under the bounded two-pass rule.

External noise:
- existing H13 Wikimedia source probing produced external 404s;
- non-blocking and outside first-party ownership.

## Visual evidence status

Available:
- source-before-adaptation screenshot from both attempts.

Missing:
- stable captured adapted front/3⁄4/back screenshots.

Therefore **VISUAL_ACCEPTANCE is NOT CLAIMED** even though the technical assertions are green.

## Status

Do not claim READY / Stage / Live.

Exactly one next gate:
resume the frozen candidate in a browser evidence environment where an animated WebGL canvas can be captured without Playwright element-stability waiting (for example direct framebuffer/canvas export or another approved browser surface). Capture adapted front + 3/4 + back only; do not change K2/WorldContext code unless the visual output itself reveals a defect.
