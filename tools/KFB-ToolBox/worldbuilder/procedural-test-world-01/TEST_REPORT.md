# TEST REPORT · Procedural Test World 01

Date: 2026-10-03
Repo: georg-doc/kayfabizarro
Draft PR: #332

## Clean convergence

Implementation branch was created from current-main lineage and deliberately collapsed to one implementation commit:
`4418c0a59808e7cca183535537bee1b086e2d84a`.

PR implementation commit count before this documentation checkpoint:
**1**.

Changed implementation/source files:
32 intended paths only.
No unrelated current-main rollback paths appeared in the PR diff.

## Rehome

Proven World Integration manifest:
- 26 required owner files.
- B3 donor parity: 26/26 PASS.

Clean branch also carries:
- final B3 `huerth-b1` zone fixture;
- P1 environment geometry module;
- P2 environment geometry module.

## New test-world seam

PASS by source test:
- dedicated Procedural Test World entry uses WB2;
- no Travel Globe/card host import in the entry;
- legacy play owner is disabled for this host profile;
- Hürth-B1 procedural building world selected;
- future motion dock routes to central Motion SSOT #331;
- P1/P2 nature modules are available but not falsely claimed as placed.

## GitHub Actions

Exact implementation head:
`4418c0a59808e7cca183535537bee1b086e2d84a`

Procedural Test World 01:
- run 37084646318
- job 111092289059
- result **SUCCESS**

KFB Production Resource Registry R0.1:
- run 37084646355
- job 111092289232
- result **SUCCESS**

## Not yet claimed

- no public Stage;
- no human visual acceptance;
- no new locomotion integration;
- no Drive/Combat integration;
- P1/P2 nature geometry is not yet scattered/mounted into the world;
- continuous floating-island form from R2D is still a design continuation, not yet this runtime geometry.

## Next world gate

Mount a small bounded P1/P2 procedural nature cluster into this clean WorldBuilder candidate and prepare the continuous-island terrain/form seam without introducing a second world or placement owner.


## R2D WB2 browser proof · PASS

Exact head:
`57759ca9a3183cc91b2261cbceb635c1e71092cf`

Workflow:
`Procedural Test World R2D Browser`

Run/job:
`37085949746 / 111096180446`

Result:
**SUCCESS**

Evidence artifact:
- id `11260662426`
- size 132,126 bytes
- digest `sha256:d4cc01bf63aec7c6c273bc5416738de26a8c881fc31dad88e3a3f15d9b74a13a`

Browser facts:
- world id `r2d3`
- zone id `r2d-island-3`
- status `SOURCE_DERIVED_R2D_V0`
- document format `kfb-worldbuilder-scene`
- provider `kfb.r2d-worldbuilder-adapter/1`
- terrain `R2D source-derived heightfield · seed 3`
- Track Core road present
- legacy play = null
- `wi1-play.js` not loaded
- Travel Globe not loaded
- card-start not loaded
- one WB2 canvas/renderer
- 0 console errors
- 0 page errors
- 0 QA problems

This proves the source-derived R2D heightfield/Track-Core adapter boots inside the real WB2 owner.
It does not yet prove full standalone-R2D presentation parity.
