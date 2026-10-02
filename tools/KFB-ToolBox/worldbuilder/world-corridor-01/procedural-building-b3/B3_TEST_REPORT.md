# TEST REPORT · PROCEDURAL BUILDING B3 · STABLE OWNER REHOME + REAL WORLDBUILDER CONSUMER

Status: **PASS · STABLE OWNER REHOMED · REAL WB2 CONSUMER BOOTS B1 SIBLINGS**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Outcome

B3 closes the stale-owner-path problem discovered in B2.

The proven WORLD-INTEGRATION-01 r2 export was rehomed to its manifest target paths without creating a second WorldBuilder or presenter.

Then one additive source-derived zone, `huerth-b1`, was booted through the real stable chain:

`WORLD_INTEGRATION_01_SOURCE.html → wb2d-app.js → wi1-world.js → wd1-seam.js → wd1-city.js / kfb-facade-rule-v1`

## Authoritative rehome source

`KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/EXPORT_MANIFEST.json`

The manifest marks **26 files** `requiredToStart:true`.

Pre-write inventory:
- 3 target files already existed and matched exact expected blobs;
- 23 target files were missing;
- 0 existing mismatches.

## Rehome implementation

Single Git-tree rehome commit:

`3afc04245a9120e4fb7fe9284f32ec62c0eae896`

Result:

**26 / 26 exact manifest blob parity PASS**

No owner behavior changed during the rehome.

Stable owner paths now exist:
- `tools/KFB-ToolBox/worldbuilder/world-integration-01/`
- `tools/KFB-ToolBox/worldbuilder/wb2-design-01/`
- `tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/`
- `tools/KFB-ToolBox/lib/edit-layer.js`

Shared manifest files also exist at their intended root paths:
- `wd1-seam.js`
- `wd1-city.js`
- `wd1-names.js`
- `wd1-landmark.js`
- `w0-ink.js`
- `wd-sky.js`
- `wd-donors.js`
- `wd-registry.js`
- frozen fixtures.

Important:
the exact r2 `wi1-world.js` did not require a ROOT rewrite. At the stable path its existing `../../../../` resolves naturally to the repo root, exactly matching the export manifest layout.

## Additive B1 consumer zone

Created:

`fixtures/huerth-b1-siblings-v0.json`

Blob:
`1452f44920239e870091b1803c0d2bd183679881`

Derived from exact:
`fixtures/huerth-crop-v0.json`
blob `c242f09421a72249edb9c9ba8e431532666ab321`

The fixture remains:
- **700 buildings**
- same roads/landuse/geography
- same source provenance.

Exactly three records are replaced:
- `way/371401529` → compact-simple sibling
- `way/371401481` → ordinary-notched sibling
- `way/371401488` → large-complex sibling

Old donor ids absent:
**true**

New sibling ids present:
**true**

Added one additive stable zone in `wi1-world.js`:

`huerth-b1 → fixtures/huerth-b1-siblings-v0.json`

No presenter or facade logic changed.

## Final implementation/test head

`8bcfa5853d908a2ed497ce63837879a14c967d86`

Run:
`37051696896`

Job:
`110986394871`

Conclusion:
**SUCCESS**

Evidence artifact:
- id `11246857239`
- size 144,761 bytes
- digest `sha256:c44fae26421fd849e012f3a60ac932feafb312ee333391762b115f69bd91b9c0`

## Real WorldBuilder boot facts

Boot URL:
`WORLD_INTEGRATION_01_SOURCE.html?world=huerth-b1`

Real WB2 document:
- format `kfb-worldbuilder-scene`
- version 1
- document id `wi1-world-huerth-b1`
- world ref zone `huerth-b1-siblings-v0`

World:
- id `huerth-b1`
- buildings **700**
- roads **164**
- landuse **22**
- support records **700**

Presenter:
- group `world-zone:huerth-b1-siblings-v0`
- facade `kfb-facade-rule-v1`
- buildings **700**
- details **7,376**
- windows **6,672**
- doors **434**
- party edges **946**
- wallNormalsOnly **700**

## Siblings inside the real WB2 consumer

### compact-simple
- present: true
- height 12.23 m
- flat
- support record: true
- wall vertices 260
- roof vertices 120
- details 20
- doors 1
- windows 19

### ordinary-notched
- present: true
- height 12.56 m
- hipped
- support record: true
- wall vertices 455
- roof vertices 210
- details 35
- doors 1
- windows 34

### large-complex
- present: true
- height 12.60 m
- flat
- support record: true
- wall vertices 585
- roof vertices 270
- details 29
- doors 1
- windows 28

The serialized fixture rings include their closing point, hence recorded ring lengths 5 / 8 / 10 correspond to the proven 4 / 7 / 9 unique-corner topologies.

## Protected owners verified

Terrain/sculpt owner:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js`

Scene-edit owner:
`tools/KFB-ToolBox/lib/edit-layer.js`

Renderer count:
**1**

Stable imports:
- World Integration: true
- WB2 app: true

QA:
- console errors: 0
- page errors: 0
- problems: 0

## Screenshot classification

The screenshot proves:
- the stable WorldBuilder really rendered the derived zone;
- KFB world geometry/presenter is visible;
- no boot failure or fallback page occurred.

But the default camera is immediately beside a large building wall and does not provide a useful view of the three B1 sibling designs.

Therefore:

**BOOT / CONSUMER VISUAL EVIDENCE PASS · NOT BUILDING STYLE ACCEPTANCE**

Do not use this screenshot to grade Polly/Rocko/Metropolis or final building form language.

## Classification

**B3_STABLE_OWNER_REHOME_AND_WORLDBUILDER_CONSUMER_PASS**

The technical ownership chain is now stable:

`source corpus → B1 sibling → stable WB2 owner → stable World Integration → Elastic V2 → existing FACADE_RULE v1`

## Exactly one next gate

**PROCEDURAL BUILDING B4 · REAL-WORLD DEFORMATION DESIGN MATRIX**

Return to the actual product/design question.

Inside the stable real WorldBuilder context, compare the B1 family against **existing proven deformation donors only**:
- Elastic Grotesque V2 baseline;
- City Grotesque / Cartoon-Verbieger stronger language;
- LandmarkElastic / LOOK-TORSION principles where role-appropriate;
- Polly × Rocko × Metropolis grading;
- Hivebound soft/rounded constraint.

B4 should create a controlled, useful real-world camera/view of the building family and derive a bounded deformation/style matrix from those existing donors.

Do not invent a new generic building grammar.
Do not decide material.
Do not create another owner.
