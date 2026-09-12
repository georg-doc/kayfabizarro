# KFB Asset Registry · AR1 Flat Inventory

**Status:** IMPLEMENTATION CANDIDATE · AR1 only  
**Owner:** deterministic repo indexer  
**Source of truth:** tracked files in `georg-doc/kayfabizarro`  
**Not an owner:** chat memory, the historical `media/3D_Assets/CATALOG/`, or manually exported library JSON files.

## What AR1 does

AR1 turns the current Git tree into a deterministic flat inventory of loadable 2D, 3D and audio assets.
It records only mechanically defensible facts:

- normalized repo path as stable `assetId`;
- kind from file extension;
- format;
- Git object size;
- blob SHA;
- source commit;
- latest RAW URL;
- commit-pinned RAW URL;
- structural `Textures/` hint for images.

It intentionally does **not** infer gameplay role, donor suitability, license, character class, pack semantics,
or model-to-texture dependencies. Those belong to later review/AR2 work.

## Current roots

The AR1 calibration scope mirrors the current exported KFB asset library:

- `media/2D_Assets`
- `media/3D_Assets`

The legacy generated catalog subtree is excluded:

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
└── kinds/
    ├── model-3d.json
    ├── image-2d.json
    └── audio.json
```

The generator reads Git tree metadata with `git ls-tree`; it does not need to open thousands of binary blobs.
The same commit and config produce byte-identical output. Commit time is used instead of a wall-clock build timestamp.

## Tests

```bash
python3 -m unittest discover -s tools/asset_registry/tests -v
```

The tests cover extension classification, RAW URL encoding, the conservative texture hint,
legacy catalog exclusion, stable path IDs and byte-level deterministic output.

## Calibration baseline · 2026-09-12

The manually exported `kfb-asset-library (8).json` supplied during AR1 design reported:

- 12,767 loadable assets total;
- 6,442 images;
- 4,642 models;
- 1,683 audio files;
- 5,132 entries under `media/2D_Assets`;
- 7,635 entries under `media/3D_Assets`.

This export is a **test/calibration reference**, not SSOT. GitHub state overrides it.
`KayKit_Mystery_Series6` is the first large control pack for AR1/AR2.

## Next gate

AR1 is ready to advance when the generator is run on the real checkout and the current commit produces the expected
inventory without relying on the manual export. AR2 then adds packs and explicit dependency resolution.
