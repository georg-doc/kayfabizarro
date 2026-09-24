# FAILURE RECOVERY · WORLD-ZONE-BAKE-01 · Cologne

Date: 2026-09-24  
Classification: **FROZEN CANDIDATE · TWO REPAIR PASSES REACHED ON SAME CI GATE**  
Owner: **KFB OSM City Lab → KFB ToolBox / WorldBuilder consumer seam**

## Why this candidate is frozen

The implementation itself is preserved. The current failure is still inside the first CI gate, **Verify cached raw source and deterministic normalization**.

Three workflow runs demonstrate progressive source-lock corrections, but two repair commits have already been spent on the same gate. Per KFB recovery discipline there is no third patch on this branch.

### Run 1 · initial candidate

- run: `36025547251`
- job: `107721023980`
- head: `1814b6ef8491eec2b96db403d321d255938043c6`
- result: **FAIL**
- observed failure: exact committed `source.overpass.json` bytes were compared to the historical compact-payload SHA stored in provenance.
- repair 1: `640b22c42da526ac58493d3d516fafc93a612e43`

### Run 2 · source-file lock corrected

- run: `36026426364`
- job: `107724010317`
- head: `640b22c42da526ac58493d3d516fafc93a612e43`
- result: **FAIL**
- observed progress: cached raw-source lock passes and `build-city.mjs dom-zentrum-v0` completes with all S0 gates green.
- observed failure: exact committed `normalized.json` file bytes were still compared to the historical compact-payload SHA.
- repair 2: `bac95a752a22097d89a11278e57d5f2e45381c04`

### Run 3 · normalized-file lock corrected

- run: `36026793437`
- job: `107725273015`
- head: `bac95a752a22097d89a11278e57d5f2e45381c04`
- result: **FAIL**
- proven progress: `build-city.mjs` completes and reports:
  - source cached PASS
  - OSM IDs preserved PASS
  - local metre frame PASS
  - roads PASS
  - buildings PASS
  - deterministic reload PASS
  - bbox clipping PASS
- proven latest failure: shell parser error in the added inline Node payload-hash command:
  `syntax error near unexpected token '('`
- therefore the World Zone compiler itself was **not reached** in this run.

### Run 4 · recovery-triggered duplicate run

- run: `36027619597`
- head: recovery metadata commit `5a89a71f1d6d4b134e3386d16bd21f8384332275`
- code delta from Run 3: **none**
- status at export time: **in progress**
- this run was triggered only because the workflow listens to every push on the slice branch; it is not another repair attempt and must not be treated as new evidence unless its result is read back.

## Salvage map

Keep unchanged:

- `.github/workflows/world-zone-bake-01.yml` as workflow structure/reference, but not as a green workflow.
- `tools/osm-city-lab/scripts/build-world-zone.mjs`
- `tools/osm-city-lab/src/world-zone/compiler.js`
- `tools/osm-city-lab/src/world-zone/geometry.js`
- `tools/osm-city-lab/src/world-zone/source-locks.json`
- `tools/osm-city-lab/tests/world-zone-bake-01.mjs`
- `tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/zone-ref.js`
- `tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/fixture.scene.json`
- `tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/WORLD_ZONE_BAKE_01_REVIEW.html`

Protected architectural decisions:

- no live Overpass during normal runtime/editor use;
- versioned baked World Zone;
- WorldBuilder stores Zone manifest ref + transform only;
- no copied raw geometry in the WorldBuilder scene document;
- landmarks stay separate authored/searchable modules;
- support/collision stays based on undeformed normalized semantics;
- OSM remains geographic/semantic truth;
- no second World/terrain/editor/persistence owner.

## Source locks retained

Dataset:
`tools/osm-city-lab/data/dom-zentrum-v0/`

- source Git blob: `7220dc617782b4db7dfa80e3b3d58e54046eebb4`
- reported source payload SHA-256: `8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`
- cached source file SHA-256: `5a7d32efe5c83711d189c501d6d93af3b81ecfcea8770ba9592cc9a066b91e7a`
- normalized Git blob: `14d3f09da6e14fb7f5dc9478f78be9f876bffab9`
- reported normalized payload SHA-256: `4fced62a95499aaba0bfbd111da41db8222ef6f507a330f55e1f033b41bb8702`
- cached normalized file SHA-256: `a2c4d31c32e369d8356e0b3903677a20df9ead499cbe7d843e68eb53799a9e5e`

## What is proven vs unknown

### Proven

- cached Cologne source exists and is source-locked;
- deterministic normalization still reproduces 5,236 roads / 2,523 driveable roads / 6,351 buildings / 456 landuse / 6 water lines;
- all existing S0 normalization gates pass on Run 3;
- the branch contains a concrete World Zone compiler candidate and a reference-only WorldBuilder consumer fixture.

### Unknown / not claimed

- World Zone compiler execution PASS;
- deterministic double compile;
- final `visual.glb`;
- final baked package contents/hashes;
- support/collision contract test PASS;
- WorldBuilder save/reload test PASS;
- browser review PASS;
- PR acceptance;
- Stage/publication;
- human acceptance.

No baked World Zone package is accepted merely because compiler source exists.

## Recovery export

Machine-readable file/run/source manifest:
`tools/osm-city-lab/docs/WORLD_ZONE_BAKE_01_FAILURE_RECOVERY_MANIFEST.json`

Short timeout checkpoint:
`tools/osm-city-lab/docs/WORLD_ZONE_BAKE_01_RECOVERY_2026-09-24.md`

## Exactly one next gate

**WORLD-ZONE-SOURCE-LOCK-G0 · isolated source-lock verifier**

On a fresh bounded continuation, move the four source/payload/file hash assertions out of inline YAML shell quoting into one repository-native Node verifier, then run only:

`cached source + provenance + deterministic normalization + normalized cache locks`

Acceptance for G0:
- one script;
- zero inline `node -e` quoting in YAML;
- exact source and normalized file/payload/blob locks PASS;
- no World Zone compile yet.

Only after G0 is green may the frozen compiler candidate be reintroduced to the compile/determinism gate.

No Work. No live OSM fetch. No Cloudflare debug loop.
