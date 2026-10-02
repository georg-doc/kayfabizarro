# TEST REPORT · PROCEDURAL BUILDING B0 · GOLDEN SOURCE ISOLATION

Status: **PASS · GOLDEN GEOMETRY PARITY + VISUAL SOURCE ISOLATION**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/wc1-procedural-building-b0-2026-10-02`
Draft PR: #319

## Purpose

B0 does not invent a new building deformer.

It proves that the first ordinary low-rise family can be anchored directly to the accepted Hürth V2 geometry owner while keeping the later normal-building façade owner separate.

## Golden controls

All three controls come from the accepted 22-building Hürth V2 fixture:

| Role | Source id | Height | Roof |
|---|---|---:|---|
| compact-flat | `way/371401529` | 10.13 m | flat |
| larger-gable | `way/371401492` | 12.46 m | gabled-hint |
| compact-hip | `way/371401475` | 12.19 m | hipped-hint |

Binding V2 source:
`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

Binding module:
`tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`

## B0 implementation

`building-family-b0.mjs`

B0 is intentionally a no-regression wrapper around:
- `buildElasticShell()`
- `buildElasticRoof()`

No second body/roof deformer is created.

Normal-building façade owner remains:
`kfb-facade-rule-v1`

B0 source-isolation does not clone/render that rule; it records the owner id and proves body/roof parity only.

KayKit `building_A` is loaded separately as a raw cartoon proportion/source-identity donor:
- pin `2ff8b350beefe02912bbff6eeeead3882e583d08`
- raw bounds: **2 × 1.6499998569 × 2**
- original materials: true
- deformed: false
- material adapted: false
- fallback: false

## Initial run · source transport fail

Head:
`1dfe0077679c855f96734bf708158699e6d4e357`

Run/job:
`37032658557 / 110923074620`

Artifact:
`11238755880`
digest:
`sha256:2c1567a850db427ac823a381096844c76ac76e75eaca2b04d685ee1a6d0b477c`

Failure:
jsDelivr transport loaded `building_A.gltf` but the relative `building_A.bin` dependency returned 404.

Classification:
**SOURCE TRANSPORT / QA HARNESS · GEOMETRY NOT REACHED**

## Repair Pass 1

Only changed:
- raw KayKit donor transport to the existing proven pinned `raw.githubusercontent.com` path;
- QA waits for explicit B0 ready contract instead of `networkidle`.

B0 geometry module remained unchanged.

Head:
`5496bba829138a2507e33fccf96fa99769098e4f`

Run/job:
`37033679788 / 110926503919`

Machine assertions:
**PASS**

Evidence artifact:
`11237983944`
digest:
`sha256:76400b1ae18756dd28e60d00ed942c3dbdd501cbb206a5f52a2c44c37c594ea3`

Manual evidence review then found a viewer layout defect:
the normalization code cancelled stage offsets, visually overlapping Clean / V2 / B0 under the KayKit donor.

Classification:
**VISUAL EVIDENCE LAYOUT FAIL · NOT GEOMETRY**

Machine parity remained valid.

## Repair Pass 2 · final allowed repair

Changed only:
- source-isolation stage-centering math;
- QA assertions for four separated stage centres.

B0 geometry module stayed byte-identical:
blob `fdf888dade2debe50f7023b8b12662755508b08c`.

Tested head:
`86d5512fdf40b5fc9a2f83b2be6ff6666e82f062`

Run:
`37034478056`

Job:
`110929154453`

Result:
**SUCCESS**

Evidence artifact:
- id `11238965649`
- size 376,753 bytes
- digest `sha256:b867700e2974c2392391195cc57cee6c267b85acd0ee41172b6c34f274776650`

Evidence contains:
- `01-compact-flat.png`
- `02-larger-gable.png`
- `03-compact-hip.png`
- `state.json`

## Final parity facts

### compact-flat · way/371401529
- body hash accepted/B0: `852d0622`
- roof hash accepted/B0: `aace587c`
- body parity: true
- roof parity: true
- base anchored: true

### larger-gable · way/371401492
- body hash accepted/B0: `f9a30346`
- roof hash accepted/B0: `56ab2bad`
- body parity: true
- roof parity: true
- base anchored: true

### compact-hip · way/371401475
- body hash accepted/B0: `0f0d0b3c`
- roof hash accepted/B0: `87803dcb`
- body parity: true
- roof parity: true
- base anchored: true

## Final visual-evidence layout facts

All three review states assert four separated stage centres:

X:
`-10.5 / -3.5 / +3.5 / +10.5`

Z:
approximately `0`.

Meaning:
1. Clean Source
2. Accepted V2
3. B0 Parity Wrapper
4. raw KayKit building_A

are genuinely isolated in the evidence surface.

Manual screenshot review confirms the four objects are visually separated and readable.

## Protected boundaries

Verified:
- source pin exact;
- Hürth fixture count = 22;
- body/roof parity exact;
- base anchored;
- façade owner = `kfb-facade-rule-v1`;
- façade clone rendered here = false;
- renderer count = 1;
- material decision = false;
- world integrated = false;
- KayKit donor raw/original.

## Classification

**B0_GOLDEN_FAMILY_SOURCE_ISOLATION_PASS**

B0 establishes the first normal low-rise procedural-building family without moving backwards from the accepted Elastic Grotesque V2 geometry.

It does not yet:
- create synthetic building siblings;
- integrate FACADE_RULE into an isolated clone;
- solve the known roof-overhang/lid tune;
- choose material;
- integrate into WC1.

## Exactly one next gate

**PROCEDURAL BUILDING B1 · GOLDEN FAMILY SIBLINGS**

Derive siblings from the existing **22-building Hürth V2 fixture corpus**, not from generic prose.

B1 should:
- extract observed footprint topology / scale / height / roof distributions from those 22 real controls;
- preserve V2 body/roof owner and FACADE_RULE v1;
- generate a bounded family sheet using only source-observed roles and ranges;
- keep Polly × Rocko × Metropolis as grading axes;
- keep material separate.

No universal random-city generator.
