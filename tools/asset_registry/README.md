# KFB Asset Registry · AR1 + AR2 + AR3

**Status:** IMPLEMENTATION CANDIDATE · deterministic inventory + packs/dependencies + explicit deck adapter  
**Owner:** deterministic repo indexer  
**Asset source of truth:** tracked files in `georg-doc/kayfabizarro`  
**Deck owner:** existing `media/kfb/kfb-index.json` (`kfb-deck-registry/v2`)  
**Not an owner:** chat memory, the historical `media/3D_Assets/CATALOG/`, or manually exported library JSON files.

## AR1 · flat inventory

AR1 turns the current Git tree into a deterministic inventory of loadable 2D, 3D and audio assets. It records normalized repo path as stable `assetId`, kind/format, Git object size, blob SHA, source commit, latest RAW URL, commit-pinned RAW URL and the conservative structural `Textures/` hint.

## AR2 · structural packs + explicit dependencies

AR2 adds only mechanically defensible relationships:

- structural pack = first folder below each configured asset root;
- structural `collectionPath` = first folder below the pack root;
- pack shards and `packs/index.json`;
- `.gltf`: explicit `buffers[].uri` and `images[].uri`;
- `.glb`: JSON chunk, external URIs plus embedded buffer/image detection;
- `.obj`: `mtllib` plus texture-map references in `.mtl`;
- `.fbx`, `.blend`, `.dae`, `.3ds`: deliberately `unresolved` rather than guessed;
- deterministic `problems.json`;
- small reviewed override files for exceptional pack/dependency corrections.

For `media/3D_Assets/KayKit_Mystery_Series6/...`, the structural pack is `kaykit-mystery-series6`; folders such as `12 - June 2026 - Farmers` or `Animations serie 4` remain structural `collectionPath` values.

## AR3 · small deck adapter

AR3 deliberately does **not** invent a second deck registry. The existing `media/kfb/kfb-index.json` remains owner of explicit deck membership, filenames, `cardGrid`, sets and rules.

AR3 only:

- reads the existing `kfb-deck-registry/v2` contract;
- projects each explicit `packId` to a small `decks/<deck-id>.json` shard;
- writes `decks/index.json`;
- labels grouping as `explicit` / `manifest-explicit` provenance;
- verifies explicitly referenced `pdf` and `data` files against the tracked Git tree;
- reports missing explicit references as `MISSING_DECK_PDF` / `MISSING_DECK_DATA`.

Unregistered PDFs are not silently grouped into decks. Filename-based deck inference remains out of this small AR3 slice.

## Current source roots

Asset inventory:

- `media/2D_Assets`
- `media/3D_Assets`

Explicit deck contract + represented files:

- `media/kfb/kfb-index.json`
- `media/kfb/`

Excluded legacy/generated subtree:

- `media/3D_Assets/CATALOG/`

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
├── packs/
│   ├── index.json
│   └── <pack-id>.json
└── decks/
    ├── index.json
    └── <deck-id>.json
```

The same commit + config + override files produce byte-identical output.

## Overrides

Manual corrections are explicit source inputs, not edits to generated registry output:

```text
tools/asset_registry/overrides/
├── packs.json
└── dependencies.json
```

Every override is emitted with `reviewed-override` provenance. Deck corrections remain owned by the existing deck registry unless a future explicit decision changes that contract.

## Tests

```bash
python3 -m unittest discover -s tools/asset_registry/tests -v
```

AR1 covers classification, RAW URL encoding, legacy catalog exclusion, stable IDs and byte-level determinism. AR2 covers structural packs, glTF/GLB/OBJ dependencies and unresolved formats. AR3 covers explicit deck projection and missing representation reporting.

## Calibration baseline · 2026-09-12

The manually exported `kfb-asset-library (8).json` reported 12,767 loadable assets: 6,442 images, 4,642 models and 1,683 audio files. `KayKit_Mystery_Series6` contains 826 entries in that export (586 models + 240 images).

The export is calibration evidence only, never SSOT. GitHub state overrides it.

A real KayKit control case is `.../12 - June 2026 - Farmers/gltf/lettuce.gltf`: it explicitly references `farmer_texture_A.png` and `lettuce.bin`; both are tracked beside it.

## Next gate

AR3 is complete as an adapter when the explicit deck contract builds deterministic shards and missing explicit files surface as problems without changing the deck owner. AR4 adds validation, delta generation and the GitHub Action / bot-PR update path. Browser/UI and LLM Asset Librarian remain consumers of the canonical registry, not owners of it.
