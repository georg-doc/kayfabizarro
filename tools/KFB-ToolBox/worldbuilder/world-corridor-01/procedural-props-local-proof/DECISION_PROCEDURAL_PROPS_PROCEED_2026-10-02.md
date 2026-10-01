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

**MATERIAL ISOLATION · SAME GEOMETRY**

Hold the procedural geometry fixed and compare:
1. Clay002;
2. Derek RGB;
3. Neutral / Clay off.

Decision after that:
- if Neutral/Derek removes the generic/repetitive defect, repair/replace Clay002 treatment;
- if the defect survives without Clay002, investigate instance-aware coordinate/normal handling.

No geometry redesign in this gate.
