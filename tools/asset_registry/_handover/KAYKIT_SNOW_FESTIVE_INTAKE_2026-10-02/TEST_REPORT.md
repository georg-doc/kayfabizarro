# TEST REPORT · ASSET-INTAKE-SNOW-FESTIVE-01

Date: 2026-10-02
Owner: KFB Asset Registry / Asset Librarian

## Exact source state

- source main: `7600fa9e29d396eaa9c5a11532e63cdad7689e75`
- Snow upload: `ab65e8c46ca3c07db4294214a63384975fb7d0d9`
- Festive upload: `7600fa9e29d396eaa9c5a11532e63cdad7689e75`
- generated Registry: `bot/asset-registry-update@b211fde4a558dcfa8b1f745e1dbf4af0221b49f1`
- generated Registry sourceCommit: `7600fa9e29d396eaa9c5a11532e63cdad7689e75`

## GitHub Actions

Asset Registry workflow:
- run: `37055714664`
- job: `110999795387`
- result: **SUCCESS**
- current repository test inventory: **46 tests**
- unit/regression step: **46/46 PASS**
- Asset Librarian browser module syntax: PASS
- Registry build: PASS
- Registry validator: PASS
- rigfacts build: PASS
- rigfacts validator: PASS
- Librarian query + candidate-only consumer handoff smoke: PASS
- generated Registry diff detection: PASS
- workflow-owned bot branch update: PASS

## Generated Registry evidence

Manifest:
- total assets: **15,119**
- structural packs: **122**
- model-3d: **6,738**
- image-2d: **6,643**
- audio: **1,738**
- source commit: `7600fa9e29d396eaa9c5a11532e63cdad7689e75`

Accumulated delta from the previous canonical Registry:
- added: **351**
- removed: **0**
- moved: **0**
- changed dependencies: **0**
- new problems: **60**
- resolved problems: **0**

The 351 additions are the complete current Registry delta since the previous canonical Registry, not a claim that both new KayKit packs alone contain 351 files.

## Pack assertions

### KayKit Medieval Snow Biome

Generated shard: `registry/assets/v1/packs/kaykit-medieval-snow-biome.json`

- assets: **79**
- model-3d: **78**
- image-2d: **1**
- GLB: **57**, all reported embedded
- FBX: **21**, dependency status unresolved by the generic Registry
- explicit source license file: `License.txt`
- source license text: **CC0**

### KayKit Festive Mini-Pack

Generated shard: `registry/assets/v1/packs/kaykit-festive-mini-pack.json`

- assets: **48**
- model-3d: **46**
- image-2d: **2**
- GLB: **22**
- glTF: **1**
- FBX: **23**
- embedded model representations: **23**
- unresolved FBX representations: **23**
- Santa is present as embedded glTF plus FBX
- **no license file was found in the uploaded pack root**; no license is inferred

## Publication boundary

No Stage is required for this technical asset-intake checkpoint. No runtime, WorldBuilder, R2D, Travel, Race, Resident or Live publication is changed or claimed.
