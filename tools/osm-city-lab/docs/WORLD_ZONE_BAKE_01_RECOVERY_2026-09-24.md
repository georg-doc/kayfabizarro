# RECOVERY · WORLD-ZONE-BAKE-01 · Cologne OSM World Zone compiler

Date: 2026-09-24  
Status: **RECOVERED AFTER CHAT/TIMEOUT · IMPLEMENTATION COMMITS PRESENT · TEST/BAKE STATUS MUST BE READ BACK**

## Exact repository state recovered

Repository: `georg-doc/kayfabizarro`

Slice branch:
`chatgpt-web/world-zone-bake-01-cologne-2026-09-24`

Recovered branch head:
`bac95a752a22097d89a11278e57d5f2e45381c04`

Branch base when created:
`main@2575328ba20dada6c1ad38fe4c4dcf56bfb2ded6`

Current main observed during recovery:
`1227b738c1d69f1ef04e0382844f358bfd6db2bd`

The branch is ahead of its original base and current main has advanced independently. Do not rewrite/recreate the recovered commits. Reconcile current main only after the slice implementation/test state is known.

## Commits that landed during the interrupted turn

1. `1814b6ef8491eec2b96db403d321d255938043c6`  
   **WORLD-ZONE-BAKE-01: add deterministic Cologne zone compiler**

   Added:
   - `.github/workflows/world-zone-bake-01.yml`
   - `tools/osm-city-lab/scripts/build-world-zone.mjs`
   - `tools/osm-city-lab/src/world-zone/compiler.js`
   - `tools/osm-city-lab/src/world-zone/geometry.js`
   - `tools/osm-city-lab/tests/world-zone-bake-01.mjs`
   - `tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/WORLD_ZONE_BAKE_01_REVIEW.html`
   - `tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/fixture.scene.json`
   - `tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/zone-ref.js`

2. `640b22c42da526ac58493d3d516fafc93a612e43`  
   **WORLD-ZONE-BAKE-01: lock cached source byte hash**

   Corrected the distinction between:
   - historical source payload SHA recorded in `PROVENANCE.json`; and
   - exact committed `source.overpass.json` file-byte SHA.

3. `bac95a752a22097d89a11278e57d5f2e45381c04`  
   **WORLD-ZONE-BAKE-01: lock normalized cache byte hash**

   Corrected the same payload-vs-file-byte distinction for `normalized.json`.

## Protected source locks

Dataset:
`tools/osm-city-lab/data/dom-zentrum-v0/`

OSM source Git blob:
`7220dc617782b4db7dfa80e3b3d58e54046eebb4`

Reported source payload SHA-256:
`8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`

Committed source file SHA-256:
`5a7d32efe5c83711d189c501d6d93af3b81ecfcea8770ba9592cc9a066b91e7a`

Normalized Git blob:
`14d3f09da6e14fb7f5dc9478f78be9f876bffab9`

Reported normalized payload SHA-256:
`4fced62a95499aaba0bfbd111da41db8222ef6f507a330f55e1f033b41bb8702`

Committed normalized file SHA-256:
`a2c4d31c32e369d8356e0b3903677a20df9ead499cbe7d843e68eb53799a9e5e`

## Recovered intended architecture

Owner remains:
**KFB OSM City Lab → KFB ToolBox / WorldBuilder consumer seam**

Pipeline:
`cached source/query/provenance → normalized metre semantics → deterministic World Zone compiler → versioned baked package → WorldBuilder Zone ref + transform`

WorldBuilder scene document remains:
`kfb-worldbuilder-scene` version 1.

The fixture stores:
- one `kind: "world-zone"`;
- a manifest path/revision;
- position / rotation / scale only.

It does **not** store copied building footprints, road centerlines or generated vertices.

Landmarks remain separate searchable/authored modules.

Runtime/editor Overpass remains forbidden.

## Current evidence state

Confirmed by GitHub readback:
- branch and all three commits exist;
- intended source/compiler/WorldBuilder files exist in branch history;
- no duplicate retry is required.

Not yet claimed:
- GitHub Actions PASS;
- deterministic compile PASS;
- baked package committed by the workflow;
- browser/review PASS;
- PR;
- Cloudflare/Stage publication;
- human acceptance.

A timeout is not success. The next action is to inspect the exact workflow run/ref before any retry.

## Immediate continuation

1. Inspect Actions for `bac95a752a22097d89a11278e57d5f2e45381c04`.
2. If the workflow produced a later bot commit, fetch that new branch head and package files.
3. If it failed, inspect the exact failed step and repair only that gate.
4. Only after green repository-native evidence, continue with minimal Return/changelog/PR metadata.

No Work. No live OSM fetch. No Cloudflare debug loop.
