# TEST REPORT · PROCEDURAL BUILDING B1 · THREE-LANE GOLDEN SIBLINGS

Status: **PASS · SOURCE-BOUNDED SIBLINGS**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Purpose

B1 tests whether new ordinary-building siblings can be produced **without inventing a new building grammar**.

Every sibling combines:
- one real topology donor from the accepted 22-building Hürth V2 corpus;
- one real envelope donor from the same corpus;
- the accepted Elastic V2 body/roof owner;
- the existing `kfb-facade-rule-v1` ownership contract.

No topology mutation, new roof type, material decision or city generator is introduced.

## Corpus basis

Source pin:
`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

Corpus:
22 pinned Hürth V2 buildings.

Measured before generation:
- corners: 4 / 5 / 6 / 7 / 8 / 9 / 10 all occur;
- roofs: 11 flat / 7 hipped / 4 gabled;
- height: 10.13–12.66 m;
- area: 55.88–352.11 m²;
- aspect: 1.012–2.267.

Full extraction:
`B1_GOLDEN_CORPUS_EXTRACTION_2026-10-02.md`

## Three source-bound lanes

### A · compact-simple

Topology donor:
`way/371401529`
- 4 corners
- 60.72 m²
- flat
- 10.13 m

Envelope donor:
`way/371401477`
- 71.84 m²
- bbox aspect 1.717
- flat
- 12.23 m

Generated sibling:
`b1/compact-simple/371401529-to-371401477`

Result:
- corners: 4
- area: 71.84 m²
- target area error: ~0%
- target aspect error: ~0%
- height: 12.23 m
- flat roof / 0.35 m
- principal-axis scales: long **1.163**, short **1.017**
- base anchored: true

### B · ordinary-notched

Topology donor:
`way/371401481`
- 7 corners
- 115.76 m²
- hipped
- 12.60 m

Envelope donor:
`way/371401497`
- 154.17 m²
- bbox aspect 1.210
- hipped
- 12.56 m
- roof height 1.40 m

Generated sibling:
`b1/ordinary-notched/371401481-to-371401497`

Result:
- corners: 7
- area: 154.17 m²
- target area error: 0%
- target aspect error: ~0%
- height: 12.56 m
- hipped roof / 1.40 m
- principal-axis scales: long **1.049**, short **1.270**
- base anchored: true

### C · large-complex

Topology donor:
`way/371401488`
- 9 corners
- 157.21 m²
- flat
- 12.46 m

Envelope donor:
`way/371401495`
- 210.86 m²
- bbox aspect 1.128
- flat
- 12.60 m

Generated sibling:
`b1/large-complex/371401488-to-371401495`

Result:
- corners: 9
- area: 210.86 m²
- target area error: 0%
- target aspect error: 0%
- height: 12.60 m
- flat roof / 0.35 m
- principal-axis scales: long **0.956**, short **1.403**
- base anchored: true

## Generation mechanism

The generator:
1. preserves exact donor vertex count/order;
2. computes the donor principal-axis frame;
3. derives target area/aspect from a real envelope donor;
4. scales only the donor's long/short principal axes;
5. copies source envelope height and roof height;
6. passes the result to the existing V2 `buildElasticShell` / `buildElasticRoof`.

No new bend/lean/twist/taper parameters are introduced.

The synthetic id changes only deterministic per-building local variation while the sibling remains at the donor centroid and therefore shares the same coherent block-field context.

## Initial test

Implementation head:
`a15974d95586ac35863abe05c83157560b86e299`

Run/job:
`37040704935 / 110949823061`

Artifact:
`11242746491`
digest:
`sha256:6673ae1fd51f13e269b0f2cea899ba5d2afa10c486a8b7c12bef024e8b127bcf`

Machine result:
**PASS**

Verified:
- exact V2 pin;
- corpus count 22;
- 3/3 topology preservation;
- area/aspect targets;
- height/roof/roof-height match;
- V2 body + roof build;
- base anchoring;
- separated stages;
- façade owner id;
- one renderer;
- no material decision;
- no world integration;
- 0 console/page/QA errors.

Manual screenshot review found one evidence-only issue:
the programmatic lane switch did not update the visible `select` label in screenshots 2/3.

## Repair Pass 1

Changed only:
- `pick.value = String(i)` in the viewer's programmatic show path;
- QA assertion that visible selector value/text matches the active lane.

Sibling generator blob remained unchanged:
`9d45280f6497b109856254a4d71f017b8e41ff21`

Final tested head:
`191f79bed81e2e5a0b5486033532b9f0b32335a7`

Run:
`37041339236`

Job:
`110951929252`

Conclusion:
**SUCCESS**

Evidence artifact:
- id `11241588200`
- size 337,396 bytes
- digest `sha256:213cce3bcc928d21fe95b01d767bea508d9f75acb7e49433b2dd5a46d2e32e95`

Evidence:
- `01-compact-simple.png`
- `02-ordinary-notched.png`
- `03-large-complex.png`
- `state.json`

Manual review confirms:
- correct visible lane label;
- three separate stages;
- sibling remains recognizable as a bounded transformation of the topology donor;
- no new structural ornament or invented building anatomy appears.

## Classification

**B1_SOURCE_BOUNDED_SIBLINGS_PASS**

This proves the first synthetic ordinary-building family can grow from the Golden corpus without reverting to generic procedural boxes.

## Boundary

B1 still does not render the final normal-building façade.

It records:
`facadeRuleId = kfb-facade-rule-v1`

and deliberately does not clone that owner into the isolation viewer.

## Exactly one next gate

**PROCEDURAL BUILDING B2 · EXISTING FACADE OWNER INTEGRATION**

Integrate the B1 sibling objects through the existing real WorldBuilder/World Integration presenter that already owns `kfb-facade-rule-v1`.

Goal:
prove that the three B1 siblings receive the existing semantic façade behavior:
- party-wall filtering;
- road-facing doors;
- floor rhythm;
- irregular spacing/row-shift/jitter/skip;
- existing shape family;
- details following the same Elastic shell.

Do not create a second façade implementation.
No material decision.
No Stage unless a meaningful integrated visual decision emerges.
