# PROCEDURAL BUILDING B0 · GOLDEN FAMILY SPEC

Status: **SOURCE-DERIVED SPEC · NO NEW BUILDING STYLE INVENTED**
Date: 2026-10-02
Owner: **KFB WorldBuilder / World Corridor 01**

## Outcome

Define exactly one first procedural building family:

**B0 · ORDINARY LOW-RISE ELASTIC FAMILY**

This is not a random city generator.

It is a source-derived family for normal everyday buildings, calibrated from the already accepted Hürth V2 geometry and later proven façade semantics.

No material decision is made in B0.

---

# 1 · Authoritative Golden source

The authoritative ordinary-building shape donor is:

`tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/`

Pinned:
`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

Exact source files:
- `viewer.mjs` blob `5eb0b96b8324ee26d49d3da820d912aac4ee04d5`
- `elastic-grotesque-clay.mjs` blob `75c3d794b9341a7074038594b467f91d153486c6`
- Hürth normalized source `tools/osm-city-lab/data/huerth-v0/normalized.json` blob `936a5d990d2f394ae2bccbb4607d0821ca67a191`

The V2 viewer itself pins **22 real Hürth OSM buildings** and compares the identical source footprint in:
1. CLEAN OSM;
2. CURRENT GROTESQUE;
3. ELASTIC GROTESQUE CLAY.

Georg's later WorldBuilder brief records the decision explicitly:

**V2 geometry @0c59e92d is the basis.**

The follow-up R2 geometry was rejected; only its colour/palette work remained useful.

Therefore B0 starts from V2, not R2 and not the simplified P0B/P1/P2 prop deformation.

---

# 2 · Exact B0 Golden control buildings

B0 uses three buildings already pinned by the accepted V2 viewer.

They were selected deterministically to give one ordinary, simple four-corner control for each roof class already present in V2.

No roof type is invented.

## GOLDEN-FLAT · way/371401529

Source:
`tools/osm-city-lab/data/huerth-v0/normalized.json@0c59e92d`

Facts:
- OSM/source id: `way/371401529`
- height: **10.13 m**
- roof: **flat**
- roof height: **0.35 m**
- material class: `building-warm`
- footprint corners: **4**
- footprint area: **60.72 m²**
- footprint bbox: **7.38 × 10.22 m**
- perimeter: **31.82 m**
- source edge range: **6.35–9.57 m**

Role:
**compact everyday flat-roof control**.

## GOLDEN-GABLE · way/371401492

Facts:
- source id: `way/371401492`
- height: **12.46 m**
- roof: **gabled-hint**
- roof height: **1.40 m**
- material class: `building-pale`
- footprint corners: **4**
- footprint area: **202.17 m²**
- footprint bbox: **13.79 × 17.73 m**
- perimeter: **57.55 m**
- source edge range: **12.18–16.59 m**

Role:
**larger everyday gable control**.

## GOLDEN-HIP · way/371401475

Facts:
- source id: `way/371401475`
- height: **12.19 m**
- roof: **hipped-hint**
- roof height: **1.70 m**
- material class: `building-pale`
- footprint corners: **4**
- footprint area: **63.35 m²**
- footprint bbox: **7.89 × 9.82 m**
- perimeter: **32.13 m**
- source edge range: **6.95–9.11 m**

Role:
**compact everyday hipped-roof control**.

## Why these three

They prove that the first family can support:
- compact vs larger footprint;
- 10–12.5 m low-rise height;
- flat / gable / hip roof behavior;
- one coherent deformation language.

They deliberately exclude:
- landmarks;
- towers;
- concave footprints;
- complex L-shapes;
- garages/carports as a primary role;
- civic/industrial special masses.

Those come later only from their own donors.

---

# 3 · Body deformation owner

Binding geometry source:

`elastic-grotesque-clay.mjs@0c59e92d`

## Source-proven construction

`buildElasticShell()`:
- starts from the real source footprint;
- rounds the footprint before extrusion;
- uses at least **8** vertical steps, default **12**;
- deforms every vertical ring through the same object-normalized field;
- keeps base and top as one continuous shell.

The source computes roundness radius from source scale:

`clamp(min(minEdge, height) × roundness, 0.42, 2.05)`

with donor default:
`roundness = 0.15`.

## Accepted V2 field components

The actual V2 field combines:
- coherent block-level lean;
- coherent block-level bend;
- coherent block-level height slope;
- smaller local per-building lean;
- smaller local per-building bend;
- smaller local per-building slope;
- belly / soft inflation;
- taper;
- cumulative twist;
- contextual block-pull toward the local group anchor.

Donor defaults in the accepted V2 source:

- localLean: `0.018`
- localBend: `0.018`
- localSlope: `0.009`
- belly: `0.105`
- taper: `0.070`
- twistDeg: `4.2`
- blockPull: `0.024`

These values are **B0 Golden calibration values**, because they are the actual accepted V2 basis.

They are **not** promoted as universal values for every future KFB building role.

## Base anchoring

At `t = 0`:
- smooth height factor = 0;
- belly term = 0;
- lean/bend/block-pull displacement = 0;
- twist = 0.

Therefore the source footprint remains anchored at the base.

B0 must preserve this invariant.

---

# 4 · Designed distortion, not random wobble

The accepted V2 source contains two separate variation scales:

## Block field

`coherentBlockField()` provides correlated deformation across neighboring buildings.

This is critical.

The street should not look like every house rolled its own unrelated random skew.

## Local deviation

A deterministic per-building seed adds smaller deviations.

Therefore B0 rule:

**neighborhood coherence first, individual wobble second.**

This is the direct source-backed mechanism for the **Polly** axis:
designed spatial disagreement rather than noise.

---

# 5 · Roof coupling

Binding source:
`buildElasticRoof()` from V2.

The roof starts from:
- the deformed **topRing**;
- the deformed per-vertex **topY** values;
- the same building deformation params.

Therefore roof and body already share the same final body field.

B0 must not create a second independent roof deformer.

## Existing roof roles

### flat
V2 shrinks both local roof axes only slightly across layers:
- `su = 1 - .075t`
- `sv = 1 - .075t`

### gabled
V2:
- weak shrink on one roof axis;
- strong collapse on the perpendicular axis.

Source:
- `su = 1 - .11t`
- `sv = 1 - .90t`

### hipped
V2:
- symmetric collapse.

Source:
- `su = 1 - .70t`
- `sv = 1 - .70t`

All roof modes use:
- **6 layers**;
- source roof height;
- a small crown/puff term.

## Known Golden limitation

The WorldBuilder follow-up records an unresolved V2/R2 visual issue:

> roofs still sit on top like lids; they need a small overhang.

B0 must record this as **OPEN**, not silently “fix” it from imagination.

The first proof should reproduce the accepted V2 roof coupling exactly.

A future B1 tune may test a bounded overhang using real visual evidence.

---

# 6 · Façade authority

The original V2 `protectedDetails()` proves that doors/windows can follow the deformed shell.

But it is **not** the current ordinary-building façade authority.

For normal buildings B0 uses:

**`FACADE_RULE v1`**

Source:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd1-city.js`

Blob:
`c11b6f7156eaee808fe4689ee406f9b3480b6f0b`

Rule id:
`kfb-facade-rule-v1`

## Source-proven semantics

- party walls remain blank;
- edges shorter than **2.4 m** are skipped;
- door goes on the street-facing eligible edge where possible;
- fallback uses the longest eligible edge;
- floor rhythm derived from **3.0 m** floor height;
- per-building window spacing is selected from **2.6–3.8 m**;
- row shift: `0.1`;
- skip probability baseline: `0.13`;
- horizontal jitter: `0.2`;
- vertical jitter: `0.05`;
- long street façades may receive extra doors;
- one deterministic base shape family per building;
- detail shapes already include:
  - rect;
  - arch;
  - trap-up;
  - trap-down;
- details are transformed through the same deformed shell field.

## Critical transfer rule

B0 anti-generic façade behavior is therefore:

**semantic irregularity, not decorative randomness.**

Do not invent another window-grid system.

---

# 7 · KayKit / K-Kid cartoon DNA side donor

B0 may use authored KayKit City Builder Bits only as a **cartoon construction / proportion side donor**.

It is not the deformation Golden.

Verified source:

`media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/building_A.gltf`

Pinned:
`2ff8b350beefe02912bbff6eeeead3882e583d08`

Existing KFB FACADE-A/B source records:
- `building_A` target height: **3.2**
- `building_E` target height: **3.8**
- source object is loaded unchanged before K1 softening/material comparison.

Use from KayKit:
- economical cartoon part proportions;
- clear doors/windows/roof silhouette;
- readable construction at small scale;
- non-photoreal source identity.

Do not:
- copy its exact material;
- force every OSM footprint into `building_A`;
- replace real footprint truth with a generic prefab box.

---

# 8 · Geometry vs lens / skewed perspective

B0 preserves the existing two-layer rule.

## Geometry layer

Owns:
- rounded footprint;
- lean;
- bend;
- belly;
- taper;
- twist;
- slope;
- contextual pull;
- roof/body coupling;
- deformed façade placement.

## Presentation layer

May later amplify the look with:
- wider FOV;
- film offset;
- low-oblique framing;
- tilted camera/up-vector where appropriate.

But camera perspective is **not** baked into the geometry.

The original Hürth V2 comparison viewer itself used a comparatively neutral **48° FOV**.

Other City Grotesque review work used stronger skewed-perspective presentation.

Therefore B0 source-isolation should evaluate geometry with a neutral camera first.

---

# 9 · Style-axis grading

The family is judged against the already-persisted three-axis line.

## Polly & Her Pals

Pass condition:
- distortion reads intentionally composed;
- nearby buildings share a coherent field;
- planes/rooflines can disagree without reading as broken;
- no independent random wobble soup.

Primary mechanisms:
- coherentBlockField;
- slope;
- bend/lean;
- controlled twist;
- later presentation lens.

## Rocko's Modern Life

Pass condition:
- an ordinary low-rise building gains cartoon personality;
- still immediately reads as a house/building;
- façade irregularity feels everyday/cartoon, not fantasy;
- silhouette stays simple enough to parse quickly.

Primary mechanisms:
- rounded footprint;
- belly/taper;
- low-strength lean/bend;
- FACADE_RULE irregularity;
- KayKit economy/readability.

## Fritz Lang / Metropolis

For B0, this axis is intentionally **weak**.

The first family is background/everyday city fabric.

Pass condition:
- it clearly remains low/mid hierarchy;
- it leaves skyline authority for later tower/landmark families.

Do not inject monumentality into B0.

---

# 10 · Hivebound softening constraint

Carry only the already accepted wording:

- cozy;
- cute;
- relaxing;
- smooth stylized 3D;
- soft rounded cushion forms;
- not low-poly;
- not pixel art.

For B0 this means:
- smooth the reading of the Elastic shell;
- keep forms soft/rounded;
- do not replace the Elastic/Grotesque deformation grammar with generic cozy-game boxes.

---

# 11 · B0 variation envelope

The first procedural family may vary **only source-backed dimensions**.

## Allowed B0 roles

- compact flat control;
- compact hip control;
- larger gable control.

## Allowed variation sources

- exact source footprint dimensions;
- exact source height;
- existing flat/gable/hip roof type;
- deterministic V2 deformation seed;
- coherent block field;
- existing FACADE_RULE seeded details.

## Not allowed in B0

- new roof archetypes;
- dormers;
- balconies;
- awnings;
- chimneys invented from prose;
- random façade panels;
- arbitrary L-shape generation;
- landmark/tower deformation strengths;
- per-building independent “style sliders”;
- material variation as identity.

A later family may add a source-proven feature only after a real donor is isolated.

---

# 12 · First procedural-family contract

The implementation after this spec should expose a narrow contract, not a generic style object.

Conceptual input:

```
B0Building {
  sourceRole: compact-flat | compact-hip | larger-gable
  sourceFootprintScale
  heightScale
  deterministicSeed
  blockFieldContext
}
```

The generator internally owns:
- footprint rounding;
- V2 body field;
- source-backed roof;
- FACADE_RULE v1 placement.

Do not expose every underlying deformation coefficient as a design slider in the first proof.

The Golden should define the family before parameter freedom does.

---

# 13 · B0 source-isolation proof requirement

Before WC1 integration, the next implementation must show:

For each of the three exact Golden controls:
1. **CLEAN SOURCE**
2. **ACCEPTED V2 ELASTIC**
3. **B0 PROCEDURAL FAMILY OUTPUT**

Same:
- source footprint;
- source height;
- neutral camera;
- neutral/simple display material.

Also show raw `building_A` separately as a KayKit cartoon-DNA side reference.

Machine evidence must prove:
- exact source ids;
- exact V2 deformer pin;
- same footprint/height;
- base anchored;
- roof consumes deformed top ring;
- façade rule id = `kfb-facade-rule-v1`;
- no material decision;
- no second renderer/runtime owner.

This is internal design/engineering evidence unless it exposes a real human product decision.

---

# 14 · Explicit exclusions / known open items

## Open but not B0 blockers

- V2 roof-overhang/lid issue;
- final material/Clay choice;
- final skewed-perspective camera strength;
- concave/complex footprints;
- garages;
- row-house party-wall family behavior beyond existing FACADE_RULE;
- neighborhood/district distributions;
- landmark/tower families;
- procedural city population/streaming.

## Hard exclusions

- R2 geometry as building basis;
- P0B/P1/P2 prop deformer as building basis;
- generic “wonky house” generation from prose;
- universal random bend/twist/taper sliders;
- new façade grammar;
- material-first design evaluation.

---

# Result

B0 now has a real source-backed identity:

**Body**
`Elastic Grotesque Clay V2 @0c59e92d`

**Golden controls**
`way/371401529 flat`
`way/371401492 gabled`
`way/371401475 hipped`

**Façade**
`FACADE_RULE v1`

**Cartoon source identity side donor**
`KayKit City Builder Bits building_A @2ff8b350`

**Grading**
`Polly × Rocko × Metropolis`

**Softening**
`Hivebound cozy / smooth / rounded constraint`

No part of this family was invented from a generic building checklist.

---

# Exactly one next gate

**PROCEDURAL BUILDING B0 · SOURCE-ISOLATION IMPLEMENTATION**

Build one internal comparison that uses the three exact Hürth controls and reproduces:
- clean source;
- accepted V2 Elastic;
- B0 family candidate;

plus isolated raw KayKit `building_A` as the side donor.

No Stage.
No material decision.
No city generator.
