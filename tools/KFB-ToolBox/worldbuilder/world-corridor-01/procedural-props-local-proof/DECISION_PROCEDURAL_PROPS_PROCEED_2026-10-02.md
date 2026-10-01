# DECISION · PROCEDURAL PROPS / TREES · PROCEED

Status: **HUMAN PROCEED · GEOMETRY/STYLE PRESERVE · MATERIAL TUNE**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01
Human: Georg

## Decision

Continue the procedural props/tree direction.

This closes the previous uncertainty about whether the Hivebound-inspired asset-light geometry path is worth pursuing.

### Accepted direction

- preserve and continue the current soft procedural prop grammar;
- trees are explicitly a positive result and should remain a core reference family;
- use procedural generation primarily for world/background dressing and scalable environmental variation;
- keep deterministic generation, family instancing and recipe/seed variation;
- later explore a narrow KFB style-adapter grammar so Claude tunes a system rather than hand-designing every prop.

### Not accepted yet

The current common material/texture treatment is not accepted.

Human observation:
- generic;
- repetitive;
- somewhat buggy.

Current source diagnosis:
- one shared Clay002 512 packed texture;
- repeated object-space triplanar projection;
- same-family InstancedMesh geometry currently shares one `claySeed` geometry attribute/phase;
- this can make repeated instances carry visibly repeated material structure;
- the generated forms themselves are not the target of this complaint.

## Protected interpretation

**Do not redesign the trees/prop forms because of this material complaint.**

Keep authored hero assets:
- Residents;
- KayKit hero/rig-critical objects;
- FrizzleBob and other rigged characters.

Procedural props are an additive world-dressing strategy, not a universal replacement of authored assets.

## Material correction · clay_floor_001 advances

Georg's follow-up visual review of `KFB_Clay002_Massstab_Doppelklick.html` changes the material diagnosis but **not** the accepted prop geometry:

1. **clay_floor_001 = best-looking state in that review**;
2. **current procedural Clay = second**, but looks comparatively buggy in the direct switch;
3. **Clay002 at 6 m / 9 m / 12 m = no convincing clay texture**, mostly tonal/shading variation.

Derek RGB was not newly ranked in this specific scale review and remains an open lightweight comparator.

The simple "Clay002 is only projected too small" hypothesis is therefore closed. Increasing the repeat period did not restore material identity.

Relevant implementation fact:
the current Global Clay Lite pack does **not** display donor diffuse RGB as a surface texture. It derives luminance gradients + centred value variation + roughness while keeping the source object's colour authoritative. Clay002 can therefore collapse to mostly relief/shading under this packing semantics.

Decision:
- do not spend the next pass on Clay002 anti-repeat, instance phase or orientation variation;
- keep Clay002 only as a negative/control state;
- advance `clay_floor_001` as the first lightweight texture candidate;
- keep current procedural Clay, Derek RGB and Neutral as direct comparators;
- preserve the accepted procedural tree/prop geometry unchanged.

The returned Derek-comparison JSON is persisted as
`../evidence/WC1_DEREK_COMPARISON_NONREPRESENTATIVE_2026-10-01T23-32-47.json`.
Its absolute frame times are **not** performance authority because even Clay-off measured ~141 ms; it is retained as diagnostic evidence only.

## Evidence

Human local review:
`evidence/KFB_WC1_P0B_LOCAL_2026-10-01T23-11-17-237Z.json`

Local hardware:
- Apple M1 Max / WebGL2;
- mounted 11 trees / 7 pebble clusters / 0 tufts under current strict Burg placement;
- props delta: +6 draw calls / +44,656 triangles;
- +0 geometries / +0 textures / +0 programs;
- returned frame-time A/B is noisy/non-authoritative for prop cost because props-on measured nominally faster than props-off.

Site Production Control:
- workflow: `WORLD-CORRIDOR-01`
- decision checkpoint: `e072b8e2-498a-460b-94e7-88b930f5336f`
- title: `Procedural Props/Bäume · PROCEED decision`

## Exactly one next gate

**MATERIAL ISOLATION · SAME GEOMETRY · CLAY_FLOOR FIRST**

Hold the accepted procedural geometry fixed and compare:
1. `clay_floor_001`;
2. current procedural Clay;
3. Derek RGB;
4. Neutral / Clay off.

Clay002 remains available only as a negative/control state.

Decision after that:
- choose the material family that preserves the accepted tree/prop forms without the generic/repetitive defect;
- only investigate instance-aware phase/orientation if the defect survives on a material that is otherwise visually preferred.

No geometry redesign in this gate.
