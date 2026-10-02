# ENVIRONMENT FAMILY P1 · ROCKS + BUSHES · SOURCE-DERIVED SPEC

Status: **READY FOR SOURCE-ISOLATION IMPLEMENTATION · NO MATERIAL DECISION**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01`
Draft PR: #313

## Purpose

Extend the approved procedural environment direction from trees into **rocks + bushes** without inventing a new nature style.

Tree remains the positive control.

This P1 is form-only:
- geometry;
- silhouette;
- family variation;
- scale;
- grouping.

Material/textures remain owned by the parallel material thread.

## Binding style constraint

Preserve the already recorded Hivebound wording as a shape/readability constraint:

> cozy, cute, relaxing  
> smooth stylized 3D  
> soft rounded “cushion” forms  
> not low-poly and not pixel art

KFB judgement axis:
- **Rocko** is primary for normal nature props: readable everyday cartoon personality;
- **Polly** is secondary: designed asymmetry, never random noise;
- **Metropolis** does not drive individual rocks/bushes; it belongs to larger environmental/city hierarchy.

## Positive control · TREE

Do not redesign the accepted P0B tree in this gate.

Exact frozen source:
`procedural-props-p0/procedural-props-p0b.mjs@94443824e6b13f38c611defd06dacedd7c6d0faa`

Source behavior:
- flared lathed trunk with root lobes;
- overlapping smooth blob crown;
- deterministic yaw / scale / palette variation;
- family instancing.

Human result:
**PROCEED · tree specifically positive.**

Every P1 rock/bush candidate must look like it can belong beside this tree.

---

# ROCK FAMILY

P1 does not invent “the KFB rock”.
It carries forward three existing procedural rock constructions and one authored reference corpus.

## R-A · P0B PEBBLE CLUSTER

Source:
`procedural-props-p0b.mjs@94443824...` · blob `0174e27c2ada67753f5e29161e4973087cf04d8e`

Exact construction:
- broad smooth sphere `.43`, scaled `1 × .58 × .82`;
- smaller sphere `.24`, scaled `1 × .72 × .88`;
- second lobe offset `+.37 / +.14 / +.16`;
- cluster is low and asymmetric;
- no faceted low-poly silhouette.

Role:
**small rock / pebble cluster**.

Carry:
- multi-blob asymmetry;
- low silhouette;
- round/cushion reading.

Do not turn it into a universal boulder.

## R-B · K1 GOLDEN ORGANIC ROCK

Source:
`KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/clay-catalog.v5.js`
blob `1cb40e45dc4d2ca20a554e4315b68f9331af4152`

Exact construction:
- `IcosahedronGeometry(0.6, 5)`;
- vertex-normalized sphere basis;
- analytic radial perturbation from two sinusoidal terms;
- strongest perturbation coefficient `.16`, secondary `.07`;
- final Y squash `.68`;
- base lifted to sit on ground.

Role:
**medium organic clay boulder / Golden shape donor**.

Carry:
- continuous smooth lumpiness;
- non-faceted organic surface silhouette;
- one coherent mass rather than stacked primitives.

This is the strongest source-derived candidate for the main procedural boulder family.

## R-C · T3 KNETSTRANG ACCENT ROCK

Source:
`KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/lab-track/track-look.v3.js`
blob `a4be0b0fb8a8c5e7b8589495c71015d30de7a5f2`

Exact source:
- perturbed icosahedron `blob()`;
- rock radius `2.2 + random*2.0`, then cluster scale;
- scale `1 × .62 × 1.1`;
- random Y rotation;
- low ground placement.

Status:
T3 direction received Georg's “endlich ein Design … sehr coole und ausbaufähige Basis”.

Role:
**large accent rock in nature grouping**.

Carry:
- squashed, broad cartoon mass;
- rotation variation;
- use as accent beside trees/bushes.

Do not assume its raw T3 size/material is final WC1 scale/look.

## R-D · KAYKIT FOREST AUTHORED CORPUS

Sources:
- `tools/world_atlas/source/scenes/forest-clearing.js`;
- KayKit Forest Nature Pack · CC0.

Measured source corpus:
- **43 rocks**;
- measured height/size family `0.22–4.58`;
- `Rock_1` = large boulders;
- `Rock_3` = pebbles;
- authored variants are interchangeable family siblings.

Role:
**proportion + silhouette diversity reference**.

The generator should eventually cover the same functional scale ladder:
small / medium / large,
without copying individual KayKit meshes.

---

# ROCK P1 DECISION SPACE

The source-isolation implementation must show these three generated donors unchanged in concept:

1. **PEBBLE** · P0B two-blob cluster;
2. **BOULDER** · K1 analytic organic rock;
3. **ACCENT** · T3 squashed blob rock.

Do not blend them into one averaged shape yet.

First prove the three roles side by side.

Then a later family adapter may expose **role** rather than arbitrary style sliders.

---

# BUSH FAMILY

## B-A · T3 MULTI-BLOB BUSH

Source:
`track-look.v3.js` blob `a4be0b0...`

Exact construction:
- `2 + floor(random*2)` blobs → **2 or 3 lobes**;
- each lobe radius `(2.0 + random*1.4) * scale`;
- each blob uses the same organic `blob()` perturbation;
- Y squash `.78`;
- X/Z offset up to roughly `±0.8 × radius` from `(random-.5) * r * 1.6`;
- low placement `r*.35`.

Role:
**primary procedural bush donor**.

Carry:
- 2–3 large readable lobes;
- low cushion profile;
- asymmetric overlap;
- deterministic sibling variation.

Do not add twig/leaf noise in P1.

## B-B · P0B CROWN CONSTRUCTION · TRANSFER REFERENCE ONLY

Source:
P0B tree crown.

Exact tree crown:
- four overlapping smooth sphere/blob masses;
- one dominant central lobe;
- three smaller offset lobes;
- small squash differences.

This is **not yet an accepted bush**.
It is a transfer reference explaining why the P0B tree reads as a coherent soft family.

In P1:
- it may be shown as an internal comparison;
- do not silently promote it as the default bush generator.

## B-C · KAYKIT FOREST AUTHORED CORPUS

Measured corpus:
- **22 bushes**;
- bush heights about `0.99–1.79`;
- source lesson: bushes are ground cover and need **density rather than oversized scale**;
- many authored siblings avoid repetition.

Role:
**size/proportion/variation check**.

---

# BUSH P1 DECISION SPACE

Primary generated candidate:
**T3 2–3 blob bush**.

Positive-control relationship:
it should read as a ground-level cousin of the approved P0B crown/tree language.

Authored scale check:
KayKit bush corpus.

No new leaf shapes or botanical simulation in P1.

---

# COMPOSITION / SCATTER

Two existing donors survive.

## T3 Rule of Three

Source T3 composition:
- tree = anchor;
- two bushes = support;
- one rock = accent.

Use this as one proven **cluster recipe**, not as the only landscape distribution.

## KayKit Forest bands

Source clearing proves role/density bands:
- large rocks: scale `.8–1.4`, minDist `3`;
- medium rocks: `.7–1.2`, minDist `2`;
- small rocks: `.6–1.1`, minDist `1.3`;
- bushes: `.8–1.3`, minDist `1.8`.

Those are scene-specific scatter values, not new WC1 constants.
What survives is:
- size tiers;
- density differs by family;
- bushes are denser than trees;
- small rocks can repeat more tightly than large boulders.

---

# SOURCE-ISOLATION REQUIREMENT

Before integrating into WC1, show in one internal comparison surface:

### Positive control
- current approved P0B tree.

### Rocks
- R-A P0B pebble;
- R-B K1 organic boulder;
- R-C T3 accent rock.

### Bushes
- B-A T3 2–3 blob bush;
- optional B-B P0B crown-derived transfer study, clearly labelled **TRANSFER / NOT DEFAULT**.

Each object must be visible:
- alone;
- same neutral/simple surface;
- same camera scale reference;
- no material decision;
- source label + exact donor.

This surface is internal engineering/design evidence, not a Georg blocking gate.

---

# ACCEPTANCE RULES FOR IMPLEMENTATION

Machine/source checks:
- no external GLB needed for generated candidates;
- deterministic seed reproduces geometry;
- no material owner introduced;
- no second renderer;
- exact P0B tree remains unchanged;
- generated rocks/bushes use the cited donor equations/ranges, not invented replacements.

Design checks:
- all forms are smooth/rounded, not faceted low-poly;
- silhouette stays readable without texture;
- bush = 2–3 primary lobes, not noisy foliage;
- boulder family spans small cluster / organic boulder / accent mass;
- candidates look compatible beside the approved P0B tree.

---

# Building lane remains queued

No procedural building implementation in this gate.

The completed Golden Deformation Extraction already pins the building lineage:
`Elastic Grotesque → City Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE`.

After P1 nature-family source isolation, that lineage can be used for the first building family.

---

# Exactly one next gate

**ENVIRONMENT FAMILY P1 · SOURCE ISOLATION**

Build the internal source-isolation comparison with:
- approved P0B tree;
- 3 rock donors;
- T3 bush;
- optional clearly-labelled P0B-crown transfer bush.

No Stage.
No material comparison.
No Claude freehand generation.
