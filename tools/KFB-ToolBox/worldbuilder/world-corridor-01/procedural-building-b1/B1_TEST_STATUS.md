# B1 TEST STATUS

Status: **MACHINE PASS · VISUAL EVIDENCE LABEL TUNE**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Initial run

Head:
`a15974d95586ac35863abe05c83157560b86e299`

Run/job:
`37040704935 / 110949823061`

Result:
**SUCCESS**

Artifact:
- id `11242746491`
- digest `sha256:6673ae1fd51f13e269b0f2cea899ba5d2afa10c486a8b7c12bef024e8b127bcf`
- 3 screenshots + state JSON

Machine assertions:
- corpus count 22;
- exact V2 pin;
- 3/3 topology preserved;
- 3/3 area target error effectively 0;
- 3/3 target aspect error effectively 0;
- 3/3 height/roof/roof-height source match;
- 3/3 V2 body + roof build;
- 3/3 base anchored;
- 3/3 separated stages;
- façade owner `kfb-facade-rule-v1`;
- one renderer;
- no material decision;
- no world integration;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

Lane results:
- compact-simple: 4-corner `371401529` → 71.84 m² / aspect 1.717 / 12.23 m from `371401477`; scale long 1.163 / short 1.017.
- ordinary-notched: 7-corner `371401481` → 154.17 m² / aspect 1.210 / 12.56 m from `371401497`; scale long 1.049 / short 1.270.
- large-complex: 9-corner `371401488` → 210.86 m² / aspect 1.128 / 12.60 m from `371401495`; scale long 0.956 / short 1.403.

## Visual evidence issue

Manual screenshot review confirms the three geometry stages are separated and readable.

However the lane selector's visible option text remains on `compact-simple` in screenshots 2/3 because the programmatic `show(i)` path does not synchronize `select.value`.

The right-hand evidence panel and machine state are correct.

Classification:
**VISUAL EVIDENCE LABEL ONLY · GEOMETRY PASS RETAINED**

## Repair Pass 1 boundary

Change only:
- set `pick.value = String(i)` inside the viewer's programmatic `show(i)` path;
- optionally assert visible selector value in QA.

Do not change:
- B1 sibling generator;
- source donors;
- envelope donors;
- scaling math;
- V2 owner;
- roof/height contract;
- façade owner;
- materials.
