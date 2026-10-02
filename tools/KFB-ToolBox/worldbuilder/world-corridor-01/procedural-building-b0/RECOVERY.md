# RECOVERY · PROCEDURAL BUILDING B0 → B1

Status: **RECOVERABLE · B0 PASS · NEXT = B1 GOLDEN FAMILY SIBLINGS**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Fresh-chat instruction

Do not ask Georg to reconstruct this chat.

Read:
1. `SOURCE.json`
2. `RETURN.md`
3. `B0_TEST_REPORT.md`
4. `B0_GOLDEN_FAMILY_SPEC_2026-10-02.md`
5. parent WC1 `START_HERE.md` / `RETURN.md`

GitHub state overrides chat memory.

## Exact lane

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-building-b0-2026-10-02`
- Draft PR: #319
- base: `chatgpt-web/wc1-procedural-environment-p2-2026-10-02@b36e79cfc3bf927fd975ced7f2e9961ba8e930ab`
- tested B0 head: `86d5512fdf40b5fc9a2f83b2be6ff6666e82f062`
- Stage: none
- merge: none
- Live: none

Fetch the branch head before writing; documentation commits will be newer than the tested implementation head.

## Last proven result

**B0_GOLDEN_FAMILY_SOURCE_ISOLATION_PASS**

Three exact Hürth controls:
- `way/371401529` · 10.13 m · flat
- `way/371401492` · 12.46 m · gabled-hint
- `way/371401475` · 12.19 m · hipped-hint

Binding V2 geometry pin:
`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

B0 body/roof wrapper is an exact no-regression consumer of the accepted V2 owner.

Final run/job:
`37034478056 / 110929154453`

Artifact:
`11238965649`
digest:
`sha256:b867700e2974c2392391195cc57cee6c267b85acd0ee41172b6c34f274776650`

All three:
- body parity true;
- roof parity true;
- base anchored true.

Hashes:
- flat body/roof: `852d0622 / aace587c`
- gable body/roof: `f9a30346 / 56ab2bad`
- hip body/roof: `0f0d0b3c / 87803dcb`

Visual evidence:
- four isolated stages at X `-10.5 / -3.5 / +3.5 / +10.5`;
- screenshots manually reviewed as separated/readable.

KayKit side donor:
- raw `building_A@2ff8b350`;
- bounds `2 × 1.6499998569 × 2`;
- original materials;
- no deformation/adaptation/fallback.

## Repair history

### Initial
Source transport failed before geometry assertions:
`building_A.gltf → building_A.bin` jsDelivr relative dependency 404.

### Repair 1
Reused existing pinned raw-GitHub transport.
Machine parity PASS.
Visual evidence layout failed because stage normalization cancelled offsets.

### Repair 2
Fixed only stage centering + added stage-separation assertions.
Geometry module remained unchanged.
Final PASS.

Repair budget for B0 is exhausted but gate is green; no further B0 repairs are needed.

## Design authority

Building lineage:
`Golden/deformed samples → Elastic Grotesque V2 → City Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE v1 → KayKit/K-Kid identity`

Style grading:
`Polly & Her Pals × Rocko's Modern Life × Fritz Lang / Metropolis`

Hivebound:
soft/cozy/rounded constraint only.

Material/Clay:
separate lane.

## Known open items intentionally deferred

- roof overhang/lid tune;
- final material;
- final skewed-perspective camera strength;
- complex/concave footprints;
- garages;
- towers/landmarks;
- district/neighborhood distribution;
- city population/streaming.

## Exactly one next gate

# PROCEDURAL BUILDING B1 · GOLDEN FAMILY SIBLINGS

Use the **full existing 22-building Hürth V2 fixture** as the family corpus.

Before generating:
- measure its actual footprint topologies;
- areas / aspect ratios;
- heights;
- roof roles;
- source-material classes.

Then generate only bounded siblings derived from observed source roles/ranges.

Do not:
- invent arbitrary roof or footprint archetypes;
- expose a universal random-building style slider set;
- decide material;
- build a whole city generator.
