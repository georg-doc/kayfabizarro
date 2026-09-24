# RETURN · WORLD-ZONE-PACKAGE-G2

Date: 2026-09-24  
Status: **PASS · CANONICAL COLOGNE WORLD ZONE PACKAGE COMMITTED · NO PUBLICATION**

## Exact state

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/world-zone-package-g2-2026-09-24`

Workflow input head:
`4946bff61ba53a78a79daf316253c9c518f64473`

Canonical package bot commit:
`1888824ef0f28670f55e21301c18cf3254d32370`

Package:
`tools/osm-city-lab/world-zones/cologne-dom-zentrum-v0/2026-09-24.1/`

## Actual evidence

GitHub Actions:
- run: `36029199406`
- job: `107733345500`
- result: **SUCCESS**

Precondition:
- WORLD-ZONE-SOURCE-LOCK-G0: PASS

Package contract:
- `tools/osm-city-lab/tests/world-zone-bake-01.mjs`: **51/51 PASS**

Artifact:
- id: `10820369362`
- name: `world-zone-package-g2-cologne`
- compressed size: `6,964,193` bytes
- digest: `sha256:bada79942c4afd2f841db776e9b835242c942c6f41f0f1e9f619ce633634a7fd`

G2 required one packaging-only repair:
- first run created `TEST_REPORT.json` through `tee` before the deterministic file-list comparison;
- the report therefore existed in only one of the two compared package directories;
- repair moved the report copy after the 51-check comparison;
- compiler, look and deformer were unchanged.

## Canonical package structure

- `source-spec.json`
- `provenance.json`
- `query.overpassql`
- `normalized.json`
- `roads.json`
- `building-semantics.json`
- `anchors.json`
- `visual.glb`
- `support-collision.json`
- `SOURCE.json`
- `MANIFEST.json`
- `BUILD_REPORT.json`
- `TEST_REPORT.json`
- `SHA256SUMS.txt`

Raw `source.overpass.json` is deliberately **not** in the runtime package.

## Package identity

Zone:
`cologne-dom-zentrum-v0@2026-09-24.1`

Owner:
`KFB OSM City Lab`

Frame:
- local ENU/equirectangular;
- x = east;
- y = up;
- z = north;
- units = metre;
- bounds = **2279.652 × 2115.070 m**.

Source:
- OSM base timestamp: `2026-09-20T03:20:04Z`
- source blob: `7220dc617782b4db7dfa80e3b3d58e54046eebb4`
- normalized blob: `14d3f09da6e14fb7f5dc9478f78be9f876bffab9`
- reported source SHA-256: `8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`
- cached source file SHA-256: `5a7d32efe5c83711d189c501d6d93af3b81ecfcea8770ba9592cc9a066b91e7a`
- normalized payload SHA-256: `4fced62a95499aaba0bfbd111da41db8222ef6f507a330f55e1f033b41bb8702`
- cached normalized file SHA-256: `a2c4d31c32e369d8356e0b3903677a20df9ead499cbe7d843e68eb53799a9e5e`
- query SHA-256: `5ad8986f240387e70d406f3009f3f21560077b39d09b603f534fd4ba9376ab80`.

Compiler:
- revision: `1.0.0`
- SHA-256: `34d37ed13220bdb3cd704cd2b20064dd83e3037870f9292a7178b319ac583b4e`.

Look:
- style: `kfb-city-v0`
- preset: `cartoon`
- style SHA-256: `0a2869622db508f2ca55dabb285a34475adf7fef712d82d0878990141284cf6a`
- deformer SHA-256: `8abb8c68db3df9c3ca87aaaa63d88b9e1498c2343b26a00c6d602415c9f6cbc0`.

## Contents / visual result

Semantics:
- roads: **5,236**
- driveable roads: **2,523**
- buildings: **6,351**
- landuse: **456**
- water lines: **6**
- source anchors: **5**.

Baked visual:
- building vertices: **323,088**
- building triangles: **579,610**
- road vertices: **38,098**
- road triangles: **27,626**
- `visual.glb`: **11,629,496 bytes**
- SHA-256: `1300a22ce1151cd64afc5c309ef9dcd1d82f26256c9561a57c6524e205fa7659`.

## WorldBuilder contract already proven

The test suite confirms:
- `kind: "world-zone"` reference is valid;
- scene stores manifest ref + transform only;
- no copied footprint/centerline/vertex geometry in scene state;
- Save/Reload preserves manifest ref;
- Save/Reload preserves transform;
- support/collision remains undeformed semantic truth;
- landmarks remain separate modules;
- runtime/editor Overpass is forbidden.

## Publication state

Cloudflare: **not used**.  
Stage: **not published**.  
Live: **not promoted**.  
Human visual acceptance: **not claimed**.

## Exactly one next gate

**WORLD-ZONE-REVIEW-G3 · browser load/place/reload proof**

Use the existing:
`tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/WORLD_ZONE_BAKE_01_REVIEW.html`

Do not redesign it.

Prove in a real browser over local HTTP:
1. source semantics view loads;
2. baked `visual.glb` loads;
3. WorldBuilder fixture resolves Zone ref + transform;
4. reload uses only manifest + baked GLB and reports source recompute 0 / Overpass 0.

Capture one review screenshot/artifact if the browser proof passes.

No Cloudflare.
