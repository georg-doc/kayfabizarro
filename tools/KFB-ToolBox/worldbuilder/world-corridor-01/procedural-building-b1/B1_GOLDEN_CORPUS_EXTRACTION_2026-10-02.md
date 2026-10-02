# PROCEDURAL BUILDING B1 · GOLDEN FAMILY CORPUS EXTRACTION

Status: **SOURCE-MEASURED · NO SYNTHETIC BUILDINGS YET**
Date: 2026-10-02
Owner: **KFB WorldBuilder / World Corridor 01**

## Purpose

B1 does not start by inventing house types.

It measures the full **22-building Hürth V2 fixture** already pinned by the accepted Elastic Grotesque viewer and uses that real corpus as the first ordinary-building family distribution.

Binding source:
- `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/viewer.mjs`
- pin `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- Hürth normalized source blob `936a5d990d2f394ae2bccbb4607d0821ca67a191`

No geometry has been changed in B1 yet.

---

# 1 · Corpus truth

Pinned ordinary-building count:
**22**

Observed exact footprint corner counts:

| corners | count |
|---:|---:|
| 4 | 8 |
| 5 | 4 |
| 6 | 2 |
| 7 | 1 |
| 8 | 4 |
| 9 | 2 |
| 10 | 1 |

Important:
the accepted corpus is **not** “all rectangles”.

Only 8/22 are simple four-corner footprints.

Therefore a future procedural sibling system must not collapse the family to one box archetype.

---

# 2 · Roof roles

Observed source roof classes:

| roof role | count |
|---|---:|
| flat | 11 |
| hipped-hint | 7 |
| gabled-hint | 4 |

No other roof class exists in this 22-building Golden fixture.

Therefore B1 may use only:
- flat;
- hipped;
- gabled

unless a later source-proven donor adds another role.

## Roof-height evidence

### flat
- count: 11
- source roof height: **0.35 m for all 11**

### hipped
- count: 7
- range: **1.40–2.00 m**
- median: **1.70 m**

### gabled
- count: 4
- range: **1.40–2.00 m**
- median: **1.70 m**

No dormer/chimney/awning roof grammar is justified by this corpus.

---

# 3 · Height distribution

All 22:
- min: **10.13 m**
- Q1: **12.36 m**
- median: **12.51 m**
- Q3: **12.58 m**
- max: **12.66 m**
- mean: **12.36 m**

This is a very important constraint.

The corpus does **not** support a broad “random building height” slider.

21/22 buildings cluster tightly around roughly 12.1–12.7 m.

`way/371401529` at **10.13 m** is the one visibly shorter Golden control.

Therefore the first sibling family should stay low-rise and tightly height-bounded.

## By roof

### flat
- count 11
- 10.13–12.64 m
- median 12.46 m

### hipped
- count 7
- 12.19–12.66 m
- median 12.56 m

### gabled
- count 4
- 12.46–12.62 m
- median 12.55 m

---

# 4 · Footprint area distribution

All 22:
- min: **55.88 m²**
- Q1: **71.60 m²**
- median: **109.47 m²**
- Q3: **156.80 m²**
- max: **352.11 m²**
- mean: **132.48 m²**

These quartiles give a source-derived way to discuss scale without inventing arbitrary labels.

B1 working bands may therefore be described statistically as:

- lower quartile: `≤ 71.60 m²`
- middle half: `71.60–156.80 m²`
- upper quartile: `≥ 156.80 m²`

These are **measurement bands**, not new building archetypes.

## By roof

### flat
- 58.89–352.11 m²
- median 107.43 m²

### hipped
- 55.88–157.73 m²
- median 111.50 m²

### gabled
- 71.25–334.43 m²
- median 136.84 m²

This means roof role does not uniquely determine footprint size.

Do not encode “gable = large” or “hip = small” as a universal rule.

---

# 5 · Aspect-ratio distribution

Bounding-box long/short aspect ratio:

All 22:
- min: **1.012**
- Q1: **1.133**
- median: **1.265**
- Q3: **1.500**
- max: **2.267**
- mean: **1.352**

Therefore the Golden family spans:
- nearly square;
- ordinary rectangular;
- clearly elongated.

Again, B1 should not reduce this to one square footprint.

Source-derived statistical bands:
- compact quartile: `≤ 1.133`
- middle half: `1.133–1.500`
- elongated quartile: `≥ 1.500`

These are measurement bands only.

---

# 6 · Material-class observation

Observed source classes:
- `building-warm`: **11**
- `building-pale`: **11**

In this particular fixture:
- all 11 flat roofs are `building-warm`;
- all hipped/gabled roofs are `building-pale`.

This is an **observed source correlation**, not a B1 material rule.

Material/Clay remains a separate lane.

Do not encode that correlation into geometry identity.

---

# 7 · Exact 22-source corpus

Sorted by footprint area:

| id | corners | area m² | aspect | height m | roof |
|---|---:|---:|---:|---:|---|
| way/371401482 | 4 | 55.88 | 1.553 | 12.66 | hipped |
| way/371401483 | 5 | 58.89 | 1.491 | 12.64 | flat |
| way/371401529 | 4 | 60.72 | 1.385 | 10.13 | flat |
| way/371401475 | 4 | 63.35 | 1.244 | 12.19 | hipped |
| way/371401491 | 6 | 71.25 | 1.129 | 12.52 | gabled |
| way/371401480 | 5 | 71.51 | 1.725 | 12.62 | gabled |
| way/371401477 | 4 | 71.84 | 1.717 | 12.23 | flat |
| way/371401465 | 8 | 80.52 | 1.147 | 12.27 | flat |
| way/371401469 | 8 | 80.65 | 1.332 | 12.36 | hipped |
| way/371401471 | 8 | 107.22 | 1.223 | 12.11 | flat |
| way/371401496 | 6 | 107.43 | 1.230 | 12.54 | flat |
| way/371401566 | 4 | 111.50 | 2.267 | 12.58 | hipped |
| way/371401481 | 7 | 115.76 | 1.532 | 12.60 | hipped |
| way/371401499 | 5 | 133.87 | 1.012 | 12.36 | flat |
| way/371401497 | 4 | 154.17 | 1.210 | 12.56 | hipped |
| way/371401493 | 9 | 155.57 | 1.075 | 12.48 | flat |
| way/371401488 | 9 | 157.21 | 1.091 | 12.46 | flat |
| way/371401490 | 10 | 157.73 | 1.075 | 12.50 | hipped |
| way/371401492 | 4 | 202.17 | 1.286 | 12.46 | gabled |
| way/371401495 | 5 | 210.86 | 1.128 | 12.60 | flat |
| way/371401494 | 4 | 334.43 | 1.502 | 12.58 | gabled |
| way/371401485 | 8 | 352.11 | 1.382 | 12.52 | flat |

---

# 8 · What B1 may legitimately derive

B1 sibling generation may only vary dimensions already observed in the 22-source corpus.

Allowed:

## Footprint topology
Use one of the **actual 22 source footprints** as the topology seed.

Do not synthesize a brand-new corner graph in the first sibling proof.

## Scale
A selected source footprint may be uniformly or mildly anisotropically scaled only to another **observed corpus envelope**.

The first proof should use source-derived target bands rather than unconstrained random scaling.

## Height
Stay inside the observed low-rise range.

Because the distribution is narrow, the first proof should strongly prefer the 12.1–12.7 m cluster and retain the 10.13 m short control as a real but uncommon role.

## Roof
Use only:
- flat;
- gabled;
- hipped.

Roof heights stay within observed values.

## Deformation
Always use the accepted V2 owner.

Do not generate fresh bend/lean/twist coefficients from a new style layer.

## Façade
Always route through `kfb-facade-rule-v1`.

No second façade system.

---

# 9 · What B1 must not infer from this corpus

The corpus does not justify:

- towers;
- 1–2 storey cottages;
- 5–7 storey blocks;
- civic buildings;
- factories;
- dormers;
- balconies;
- awnings;
- rooftop clutter;
- shops;
- row-house typologies;
- universal district rules.

Those may be useful later, but they need their own real donors.

---

# 10 · B1 first sibling proof · source-grounded proposal

Do not create a giant generator.

Build one bounded family sheet using **three source anchors** from different observed parts of the corpus:

### Sibling lane A · compact/simple
Source topology from a real 4-corner compact donor.

Target stays inside lower-area source band.

### Sibling lane B · ordinary/notched
Source topology from a real 5–8 corner donor near corpus median.

Target stays inside middle-half area/aspect range.

### Sibling lane C · large/complex
Source topology from a real 8–10 corner or large 4-corner donor in the upper area quartile.

Target stays inside upper-quartile source envelope.

These are not named architectural styles.

They are measured positions inside the Golden corpus.

For each lane, the proof should show:
1. exact source donor;
2. accepted V2 source deformation;
3. one bounded sibling made by source-envelope scaling only.

No arbitrary topology mutation.

---

# 11 · Style-axis interpretation

## Polly
Variation should come from:
- source topology;
- coherent V2 block field;
- designed elastic deformation.

Not random extra corners.

## Rocko
Everyday character comes from:
- ordinary source mass;
- elastic V2;
- façade irregularity;
- source-bounded proportion change.

Not fantasy attachments.

## Metropolis
B1 stays city fabric.

Large upper-quartile members may strengthen street rhythm, but B1 does not become monumental.

---

# 12 · Result

The 22-building Golden corpus gives a much narrower and more useful first family than a freehand procedural-building prompt:

- 7 observed footprint corner counts;
- 3 roof roles;
- tightly bounded low-rise height;
- broad but measured footprint scale;
- real aspect-ratio diversity;
- V2 as existing deformation owner;
- FACADE_RULE as existing façade owner.

The first synthetic siblings can therefore be generated without inventing a new design grammar.

## Exactly one next gate

**PROCEDURAL BUILDING B1 · THREE-LANE SIBLING SOURCE ISOLATION**

Choose exact donor ids for:
- compact/simple;
- ordinary/notched;
- large/complex;

then create one bounded sibling per lane using only:
- source topology;
- observed source envelope scaling;
- accepted V2 deformation;
- existing roof roles;
- FACADE_RULE v1 contract.

No material decision.
No Stage.
No city generator.
