# TEST REPORT · PROCEDURAL BUILDING B2 · EXISTING FACADE OWNER

Status: **PASS · REAL FACADE OWNER CONSUMED**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Purpose

B2 proves the B1 source-bounded siblings receive the existing shared normal-building facade semantics without creating a second facade implementation.

B2 calls the real owner:

`wd1-city.js::buildCityLayer()`

Owner blob:
`c11b6f7156eaee808fe4689ee406f9b3480b6f0b`

Facade rule:
`kfb-facade-rule-v1`

Internal `facadeSpecs()` remains internal and unchanged.

## Real context

Seam:
- `wd1-seam.js`
- blob `95c6bfa04a4dd2106039db600b1e826ef48f4490`

Frozen Hürth fixture:
- `huerth-crop-v0.json`
- blob `c242f09421a72249edb9c9ba8e431532666ab321`

Loaded real context:
- 700 buildings
- 164 roads
- 22 landuse
- no invented geography.

Only three real topology donor records were replaced by their already-proven B1 siblings. The remaining 697 buildings and all road/neighbour context stayed real.

## Presenter result

One real `buildCityLayer()` call produced:

- facade rule: **kfb-facade-rule-v1**
- buildings: **700**
- details: **7,376**
- windows: **6,672**
- doors: **434**
- party-wall edges: **946**
- bare ordinary buildings: **2**
- FACE_NORMALS / wallNormalsOnly: **700**

Owner modified:
**false**

## Per-sibling semantic proof

### compact-simple

Sibling:
`b1/compact-simple/371401529-to-371401477`

Owner output:
- wall vertices: 260
- roof vertices: 120
- details: **20**
- doors: **1**
- windows: **19**
- shaped details: **18**
- party edges: 0
- windows on party edges: **0**
- doors on party edges: **0**
- nearest eligible road: **0.835 m**
- door-bearing edge road distance: **0.835 m**
- door within semantic road range: true
- door on/near best road edge: true
- window vertical span: **9.406 m**
- multi-floor windows: true

### ordinary-notched

Sibling:
`b1/ordinary-notched/371401481-to-371401497`

Owner output:
- details: **35**
- doors: **1**
- windows: **34**
- shaped details: **5**
- party edges: **3**
- windows on party edges: **0**
- doors on party edges: **0**
- nearest eligible road: **14.308 m**
- door-bearing edge road distance: **14.308 m**
- door within semantic road range: true
- door on/near best road edge: true
- window vertical span: **9.558 m**
- multi-floor windows: true

This is the strongest party-wall control in B2.

### large-complex

Sibling:
`b1/large-complex/371401488-to-371401495`

Owner output:
- details: **29**
- doors: **1**
- windows: **28**
- shaped details: **25**
- party edges: **2**
- windows on party edges: **0**
- doors on party edges: **0**
- nearest eligible road: **8.849 m**
- door-bearing edge road distance: **8.849 m**
- door within semantic road range: true
- door on/near best road edge: true
- window vertical span: **9.469 m**
- multi-floor windows: true

## Test

Tested head:
`99a390d3b828fc132528a65e3cff52d165299990`

Run:
`37043662315`

Job:
`110959643486`

Conclusion:
**SUCCESS**

Evidence artifact:
- id `11243896554`
- size 126,368 bytes
- digest `sha256:4591394170e0fe8d03f068e055be5c020ec0bb72a037ed8a5bfcd02cb1933bd8`

Evidence:
- `existing-facade-owner.png`
- `state.json`

QA:
- 0 console errors
- 0 page errors
- 0 QA problems

## Visual evidence

Manual review confirms:
- three separated sibling buildings;
- visible existing-owner windows and doors;
- facade details follow the Elastic body rather than floating as independent flat proxies;
- distinct ordinary-building silhouettes remain legible;
- no generic replacement chrome or second facade system appears.

The evidence page adds only extracted review groups from the owner's merged output. It does not render a second production facade path.

## Classification

**B2_EXISTING_FACADE_OWNER_INTEGRATION_PASS**

The geometry/facade chain is now proven:

`real Hürth topology/envelope corpus → B1 bounded sibling → Elastic V2 → existing FACADE_RULE v1 presenter`

## Important recovery finding

The active World Integration r2 presenter still lives in the pinned Session Cut / WB-D2 source tree.

The router-referenced stable path:
`tools/KFB-ToolBox/worldbuilder/world-integration-01/`

is not present on the current B1/B2 branch.

Therefore do not pretend a stable rehome already exists.

## Exactly one next gate

**PROCEDURAL BUILDING B3 · REAL OWNER REHOME + WORLDBUILDER CONSUMER**

Before adding more building style grammar:
1. rehome the already-proven r2 `wd1-city.js` / seam owner into the current stable WorldBuilder owner path without changing behavior;
2. keep byte/source provenance explicit;
3. route B1 sibling injection through that stable real owner;
4. prove the real WorldBuilder consumer can use the same facade chain.

No material decision.
No new facade grammar.
No generic city generator.
