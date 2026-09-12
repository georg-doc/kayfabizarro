# KFB Asset Registry · AR1 + AR2

**Status:** IMPLEMENTATION CANDIDATE · AR1 inventory + AR2 packs/dependencies  
**Owner:** deterministic repo indexer  
**Source of truth:** tracked files in `georg-doc/kayfabizarro`  
**Not an owner:** chat memory, the historical `media/3D_Assets/CATALOG/`, or manually exported library JSON files.

## AR1 · flat inventory

AR1 turns the current Git tree into a deterministic inventory of loadable 2D, 3D and audio assets. It records normalized repo path as stable `assetId`, kind/format, Git object size, blob SHA, source commit, latest RAW URL, commit-pinned RAW URL and the conservative structural `Textures/` hint.

## AR2 · structural packs + explicit dependencies

AR2 adds only relationships that can be defended mechanically:

- structural pack grouping: first folder below each configured asset root;
- structural `collectionPath`: first folder below the pack root;
- pack shards and `packs/index.json`;
- `.gltf`: explicit `buffers[].uri` and `images[].uri`;
- `.glb`: JSON chunk, external URIs plus embedded buffer/image detection;
- `.obj`: `mtllib` plus texture-map references in `.mtl`;
- `.fbx`, `.blend`, `.dae`, `.3ds`: deliberately `unresolved` in v1 rather than guessed;
- deterministic `problems.json` for missing files, case mismatches, outside-pack references, parse errors, unresolved formats and same-name duplicates;
- small reviewed override files for exceptional pack/dependency corrections.

AR2 does **not** infer gameplay role, character class, donor suitability, license, animation compatibility, semantic variants or deck meaning.

### Pack rule

For `media/3D_Assets/KayKit_Mystery_Series6/...`, the structural pack is:

```text
packId: kaykit-mystery-series6
packRoot: media/3D_Assets/KayKit_Mystery_Series6
```

and folders such as `12 - June 2026 - Farmers` or `Animations serie 4` become `collectionPath` values. This makes the large KayKit set filterable without pretending those folder names prove gameplay semantics.

## Current roots

- `media/2D_Assets`
- `media/3D_Assets`

Excluded legacy/generated subtree:

- `media/3D_Assets/CATALOG/`

Decks under `media/kfb` remain owned by the existing deck registry and are handled separately in AR3.

## Run

```bash
python3 tools/asset_registry/build.py
```

Outputs:

```text
registry/assets/v1/
├── manifest.json
├── summary.md
├── catalog.jsonl
├── problems.json
├── kinds/
│   ├── model-3d.json
│   ├── image-2d.json
│   └── audio.json
└── packs/
    ├── index.json
    └── <pack-id>.json
```

The generator uses `git ls-tree` for identity/existence metadata. AR2 opens only model/material files that must be parsed for explicit dependencies; it does not render assets.

The same commit + config + override files produce byte-identical output.

## Overrides

Manual corrections are explicit source inputs, not edits to generated registry output:

```text
tools/asset_registry/overrides/
├── packs.json
└── dependencies.json
```

Every override is emitted with `reviewed-override` provenance. If hundreds of manual entries become necessary, the structural model is wrong and should be revised instead of expanding overrides indefinitely.

## Tests

```bash
python3 -m unittest discover -s tools/asset_registry/tests -v
```

AR1 tests cover classification, RAW URL encoding, legacy catalog exclusion, stable IDs and byte-level determinism. AR2 tests cover pack/collection grouping, glTF external dependencies, embedded GLB assets, OBJ+MTL textures, missing references, case mismatches, outside-pack references and explicit unresolved FBX status.

## Calibration baseline · 2026-09-12

The manually exported `kfb-asset-library (8).json` reported 12,767 loadable assets: 6,442 images, 4,642 models and 1,683 audio files. `KayKit_Mystery_Series6` contains 826 entries in that export (586 models + 240 images).

The export is calibration evidence only, never SSOT. GitHub state overrides it.

A current real KayKit control case is `.../12 - June 2026 - Farmers/gltf/lettuce.gltf`: it explicitly references both `farmer_texture_A.png` and `lettuce.bin`; both files are tracked beside the glTF. AR2 should therefore report that model as `complete` with two explicit dependencies.

## Gate

AR2 reaches its gate when a real checkout build demonstrates that representative glTF/GLB/OBJ dependencies resolve correctly, missing references appear in `problems.json`, and the same commit rebuilds byte-identically. GitHub Action automation remains AR4; the browser/UI remains post-v1 consumer work.
