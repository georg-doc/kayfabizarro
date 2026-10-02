# PROCEDURAL BUILDING B2 · EXISTING FACADE OWNER CONTRACT

Status: **OWNER-BOUND · NO FACADE COPY**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Existing owner

B2 consumes the actual shared ordinary-building presenter:

`tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd1-city.js`

Blob:
`c11b6f7156eaee808fe4689ee406f9b3480b6f0b`

Export used:
`buildCityLayer()`

Facade owner id:
`kfb-facade-rule-v1`

Internal `facadeSpecs()` is **not copied, exported, forked or rewritten**.

## Existing real context

Seam:
`wd1-seam.js`
blob:
`95c6bfa04a4dd2106039db600b1e826ef48f4490`

Frozen Hürth fixture:
`fixtures/huerth-crop-v0.json`
blob:
`c242f09421a72249edb9c9ba8e431532666ab321`

Real context:
- 700 buildings
- 164 road parts
- 22 landuse
- frozen OSM-derived source
- no invented geography.

## B1 siblings inserted

The real seam is loaded first.

Then only these three real topology donor records are replaced:

1. `way/371401529` → `b1/compact-simple/371401529-to-371401477`
2. `way/371401481` → `b1/ordinary-notched/371401481-to-371401497`
3. `way/371401488` → `b1/large-complex/371401488-to-371401495`

Replacement mapping:
- B1 source footprint x stays x;
- normalized source z is converted through the existing seam convention to world z = −source z;
- height → seam `h`;
- roof → seam `roof`;
- material class → seam `mc`;
- `kind` / `minH` inherited from the real topology donor record.

All other buildings and roads stay real and unchanged.

## Existing presenter call

B2 calls:

`buildCityLayer(zone, { mode:'elastic', style, CC, EG, renderer, facade:'rule-v1' })`

with:
- actual r2 `wd1-city.js`;
- exact V2 Elastic owner;
- exact `cartoon-city.js`;
- existing `kfb-city-v0.json` style.

## Evidence already exposed by owner

`buildCityLayer()` returns:
- `out.stats.facade`
- `out.detailMeshes`
- `out.support.records`

Each support record stores per-building:
- wall vertex range;
- roof vertex range;
- every detail range as `[kind:color, startVertex, vertexCount]`.

Therefore B2 can prove per sibling:
- building actually reached the shared presenter;
- windows/doors were produced by the existing owner;
- details are present in the merged real output;
- support record follows the same building;
- no new facade implementation was needed.

## Independent semantic QA

QA may inspect owner output and real context independently.

Allowed checks:
- at least one door and windows per sibling;
- no detail maps to an independently detected party-wall edge;
- door-bearing edge has a real road within the owner's 40 m semantic range;
- windows occupy multiple floor bands on these ~12 m low-rise buildings;
- non-rect detail geometry can be observed when deterministic owner output produces it;
- owner stats report `kfb-facade-rule-v1`.

This is verification only; it is not a second facade generator.

## Visual evidence

After the real full-zone presenter runs, B2 may extract each sibling's existing merged vertex ranges into temporary evidence-only groups so Georg/QA can see:
- wall;
- roof;
- windows;
- doors

for that sibling in isolation.

The extracted groups are not runtime owners and are not production geometry.

## Protected boundaries

Do not:
- modify `wd1-city.js`;
- copy `facadeSpecs()`;
- reopen World Integration locomotion recovery;
- alter Elastic V2;
- decide Clay/material;
- create a second renderer owner;
- invent roads/neighbours;
- create public Stage for this internal semantic gate.

## Exactly one gate

**B2 EXISTING FACADE OWNER INTEGRATION**

Pass when the three B1 siblings are demonstrably rendered by the real shared presenter with real `kfb-facade-rule-v1` details and real Hürth context.
