# RETURN · WC1 PROCEDURAL ENVIRONMENT P2

Status: **SOURCE-DERIVED GEOMETRY PASS · READY TO MOVE TO BUILDING FAMILY B0**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Outcome

The procedural environment vocabulary is now broad enough to stop inventing more small-prop families before building work.

Proven source-derived procedural roles now cover:
- tree;
- pebble / boulder / accent rock;
- bush;
- log;
- stump;
- mushroom;
- grass.

Material/Clay remains a separate parallel lane.

## Exact state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
- Draft PR: #316
- base: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01@a5fefb273b274e40b3a1e642788c87113fa6ea27`
- tested procedural head: `5f2a4444feed8f38883499de2a044f0e9e8b36eb`
- current documentation head is newer; fetch branch before continuing
- Stage: none
- merge: none
- Live: none

## Site recovery checkpoint

After the chat interruption, P2 source-object PASS was persisted to Production Control:

`WORLD-CORRIDOR-01 / e73b2e77-23a2-4dea-a744-4b455dee2e59`

## Source-object proof

Read:
`P2_SOURCE_OBJECT_ISOLATION_TEST_REPORT.md`

13/13 exact authored donors were proven in isolation before procedural transfer.

Source pin:
`a5fefb273b274e40b3a1e642788c87113fa6ea27`

Evidence run:
- run `36960716414`
- job `110693565332`
- artifact `11207717976`
- 13 donor screenshots + state JSON
- digest `sha256:9a430ac22b91bdcc66b04b8dcfe10089de66088b617734bb65b457dfa4c8dd17`
- 0 QA problems.

Important source truth:
- KayKit Forest FREE has no stumps, mushrooms or flowers;
- those families were already bridged from Kenney Nature Kit in KFB Travel;
- `stump_oldTall` is an explicit outlier / negative control, not a normal stump baseline.

## Procedural transfer

Read:
- `P2_PROCEDURAL_TRANSFER_SPEC_2026-10-02.md`
- `environment-family-p2.mjs`
- `procedural-geometry-proof.html`
- `P2_TEST_REPORT.md`

Generated geometry-only objects:
1. `SOFT_LOG_SEPARATOR`
2. `SOFT_LOG_STACK3`
3. `SOFT_STUMP_ROUND`
4. `SOFT_STUMP_DETAILED`
5. `SOFT_MUSHROOM_NORMAL`
6. `SOFT_MUSHROOM_GROUP3`
7. `SOFT_GRASS_TUFT`

No material owner, renderer owner, placement owner or frame loop was introduced.

## Final test

Repair Pass 1 fixed only the QA meaning of the texture counter:
- renderer memory contained one shadow-map texture;
- display materials had zero texture maps;
- geometry stayed unchanged.

Final PASS:
- tested head `5f2a4444feed8f38883499de2a044f0e9e8b36eb`
- run `37012562325`
- job `110855562506`
- 13/13 source donors PASS
- 7/7 procedural transfer objects PASS
- WebGL2
- 0 display-material texture maps
- 0 console errors
- 0 page errors
- 0 QA problems.

Evidence:
- source artifact `11228612568`
- source digest `sha256:3d7d60220fdae97466b503c2237161c5d5f28f7f2fb754572d48482ebfaf0826`
- procedural artifact `11228413648`
- procedural digest `sha256:162562b8da803cf4e9ae5d2a54b91036d59d84f6ee3382e23e2f6424ed108df9`

Hosted SwiftShader FPS is not product-performance authority.

## Protected owners

Unchanged:
- WB2 / WC1 renderer and world owner;
- Track Core;
- Race/Ground movement;
- authored Resident/KayKit/FrizzleBob hero assets;
- parallel Material/Clay lane.

## Binding building lineage for the next gate

Do not use P0B/P1/P2 prop deformation as the building baseline.

Building source priority remains:

`Golden/deformed samples → Elastic Grotesque → City Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE v1 → KayKit/K-Kid identity`

Style grading axis:

`Polly & Her Pals × Rocko's Modern Life × Fritz Lang / Metropolis`

Hivebound remains a soft/rounded constraint, not the building identity.

## Exactly one next gate

**PROCEDURAL BUILDING B0 · GOLDEN FAMILY SPEC**

Define the first normal procedural building family only from actual accepted/deformed KFB donors.

B0 should specify:
- normal low-rise / everyday building role first;
- exact Golden source sample(s);
- body deformation field;
- roof coupling;
- façade rule;
- role-bounded variation;
- Polly / Rocko / Metropolis grading;
- exclusions.

No material decision.
No generic “wonky house” prompt.
No universal random city generator.
