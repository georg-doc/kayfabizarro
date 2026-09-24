# RETURN · WORLD-ZONE-COMPILE-G1

Date: 2026-09-24  
Status: **PASS · DETERMINISTIC COMPILER PROOF COMPLETE · CANONICAL PACKAGE NOT YET COMMITTED**

## Exact state

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/world-zone-compile-g1-2026-09-24`

Tested head:
`e4bf5058488c555de9abd05420cfcc78169b48a1`

Parent G0 Return:
`78d0d344ccb8af90da620967a1dfc997f2c78844`

Repair history inside G1:
- initial run found a single syntax defect: missing closing brace in `geometry.js`;
- one bounded repair commit `e4bf5058488c555de9abd05420cfcc78169b48a1`;
- second G1 run PASS.

## Actual evidence

GitHub Actions:
- run: `36028566910`
- job: `107731234187`
- result: **SUCCESS**

Precondition:
- WORLD-ZONE-SOURCE-LOCK-G0: **14/14 PASS**

Compiler/contract:
- `tools/osm-city-lab/tests/world-zone-bake-01.mjs`: **51/51 PASS**

Artifact:
- id: `10820173119`
- name: `world-zone-compile-g1-cologne`
- size: `6,961,364` bytes compressed artifact
- digest: `sha256:a71f5ffd24f0a8a7b0447f8a800a0a90273ec9dac55a4a445bd9c1febfe1bba2`

## Compiler result

Zone:
`cologne-dom-zentrum-v0@2026-09-24.1`

Counts:
- roads: **5,236**
- driveable roads: **2,523**
- buildings: **6,351**
- landuse: **456**
- water lines: **6**

Baked visual:
- building vertices: **323,088**
- building triangles: **579,610**
- road vertices: **38,098**
- road triangles: **27,626**
- `visual.glb`: **11,629,496 bytes**

Two independent builds produced byte-identical package files, including `visual.glb`.

## Contract facts proven

PASS:
- source/query/provenance/normalized locks;
- local metre frame;
- roads/buildings present;
- required package file roster;
- GLB magic/version/non-trivial size;
- support/collision remains undeformed normalized truth;
- support references roads/building semantics rather than visual mesh;
- landmarks remain separate;
- Kölner Dom OSM source anchor preserved;
- runtime/editor Overpass forbidden;
- raw Overpass payload excluded from runtime package;
- deterministic file list and file bytes;
- all compiler build gates;
- WorldBuilder `kind: world-zone` reference valid;
- WorldBuilder scene stores manifest ref + transform only;
- Save/Reload preserves Zone ref;
- Save/Reload preserves transform.

## Scope preserved

No package has been committed into the canonical `world-zones/` path yet.

No Cloudflare publication.
No Live promotion.
No human visual acceptance claim.

## Exactly one next gate

**WORLD-ZONE-PACKAGE-G2 · commit the already-proven Cologne package**

On a fresh branch from this tested head:
1. run G0 as precondition;
2. compile the canonical package into the repository path;
3. compare it once against a temporary second build with the same 51-check contract;
4. store TEST_REPORT + SHA256SUMS with the package;
5. commit the package once.

Do not change compiler/look/deformer behavior in G2.
Do not publish to Cloudflare.
