# Hürth Recovery Architecture Proofs · A/B/C

Status: **CURRENT ISOLATED PROOF SLICE · NO HÜRTH BLOCK R3**
Date: 2026-09-24
Owner: **OSM City Lab presentation / KFB ToolBox authoring**

## Goal

Prove the three architecture fixes required by the frozen Hürth R2 recovery **in isolation**:

A. **ROAD-01** — one T-junction generated from a single planar topology owner, with road / curb / path as non-overlapping material regions sharing boundaries.

B. **HOUSE-01** — one bowed Elastic V2 house whose wall and roof share one eave boundary contract and read as one object under neutral lighting.

C. **FACADE-01** — six facades that demonstrate deterministic rhythm families, asymmetrical balance and colour hierarchy without independent random scattering.

## Source

Parent recovery:
`skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`

Research:
`skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/DESIGN_PATTERN_RESEARCH_2026-09-24.md`

Exact tested Elastic donor:
- source head `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- source file `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
- copied verbatim here as `vendor/elastic-v2-donor.mjs`
- source blob `75c3d794b9341a7074038594b467f91d153486c6`

Existing palette donor retained from frozen slice:
- `vendor/racer-cologne/cologne-palette.v1.js`
- source repo `georg-doc/KFB-Stunt-Car-Race`
- source commit `cc80f4a1c6c509db9668df79fd53b13cee093a9d`
- source blob `38246785ec2c9089737b2a195673a3ad4c07bdf8`

Road boolean engine under evaluation only:
- `clipper2-ts` / countertype Clipper2 TypeScript port
- pinned npm evaluation version `2.0.1-18`
- not adopted as a KFB owner or dependency until ROAD-01 human PASS.

## Protected boundaries

- Do not edit the frozen R2 runtime.
- Do not publish a Hürth city-block candidate.
- Do not change OSM source truth.
- Do not replace Clean / Cartoon / Grotesque.
- Do not start LC-01.
- Do not hide seams with Y offsets, renderOrder, polygonOffset, patch discs or overlay ribbons.

## Proof gates

### ROAD-01
Must visibly show:
- one T-road plus one path connection;
- no overlapping/coplanar surface pieces;
- no junction patch disc;
- one mesh/topology owner;
- road / curb / path regions share exact boundaries;
- optional wireframe reveals no stacked duplicate surfaces.

### HOUSE-01
Must visibly show:
- exact V2 shell donor in isolation first;
- candidate beside it;
- candidate wall + roof share the same eave boundary vertices;
- neutral material;
- no shadows in the first acceptance view;
- no lid/gap at the eave.

### FACADE-01
Must visibly show six facades using named rhythm families:
- ABA;
- AAB;
- ABC progression;
- paired cluster;
- entrance break;
- quiet/active asymmetrical balance.

All use one block palette hierarchy:
wall dominant · roof secondary · door accent · windows subordinate.

## Done when

- browser proof boots;
- all three isolated proofs are visible and inspectable;
- source donor is shown separately before HOUSE integration;
- automated topology assertions PASS;
- Georg gives A/B/C visual PASS or explicit rejection.

Exactly one next gate:
**GEORG HUMAN REVIEW OF A/B/C ISOLATED PROOFS.**
