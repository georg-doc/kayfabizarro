# KFB Asset Registry · AR1–AR4

**Status:** IMPLEMENTATION CANDIDATE · deterministic Registry + reviewable GitHub automation  
**Owner:** deterministic repo indexer + `Refresh KFB Asset Registry` GitHub Action  
**Asset source of truth:** tracked files in `georg-doc/kayfabizarro`  
**Deck owner:** existing `media/kfb/kfb-index.json` (`kfb-deck-registry/v2`)  
**Not an owner:** chat memory, the historical `media/3D_Assets/CATALOG/`, manually exported library JSON files, or the generated registry itself.

## AR1 · flat inventory

AR1 turns the current Git tree into a deterministic inventory of loadable 2D, 3D and audio assets. It records stable path identity, kind/format, Git object size, blob SHA, source commit and latest/pinned RAW URLs.

## AR2 · structural packs + explicit dependencies

AR2 adds mechanically defensible relationships only:

- structural pack = first folder below each configured asset root;
- structural `collectionPath` = first folder below the pack root;
- pack shards and `packs/index.json`;
- explicit `.gltf`, `.glb`, `.obj`/`.mtl` dependencies;
- embedded GLB/data-URI status;
- unresolved FBX/BLEND/DAE/3DS instead of guessed dependencies;
- deterministic `problems.json`;
- small reviewed override files.

`KayKit_Mystery_Series6` therefore becomes structural pack `kaykit-mystery-series6`, while folders such as `12 - June 2026 - Farmers` remain filterable `collectionPath` values without claiming gameplay semantics.

## AR3 · small explicit deck adapter

AR3 does not create a second deck owner. `media/kfb/kfb-index.json` remains authoritative for explicit deck membership, filenames, `cardGrid`, sets and rules.

AR3 only projects that existing contract into `decks/index.json` + `decks/<deck-id>.json` and verifies explicitly referenced PDF/card-JSON files. Unregistered PDFs are not silently grouped from filenames.

## AR4 · delta, validation, GitHub Action

AR4 makes the Registry operational:

- stale generated kind/pack/deck shards are removed before each build;
- `delta.json` compares the new build with the previous canonical Registry committed in Git HEAD;
- unique same-blob path changes are reported as `moved`, not guessed when ambiguous;
- dependency changes and new/resolved problems are reported separately;
- `validate.py` checks Registry self-consistency;
- asset-quality problems remain review data rather than invalidating the Registry format;
- `.github/workflows/asset-registry.yml` runs tests, builds and validates automatically;
- generated changes go to workflow-owned branch `bot/asset-registry-update` and a reviewable PR;
- the workflow never writes generated Registry output directly to `main`.

The push trigger covers relevant `media/2D_Assets/**`, `media/3D_Assets/**`, `media/kfb/**` and indexer changes. `media/3D_Assets/CATALOG/**` and generated `registry/assets/v1/**` changes do not recursively trigger refreshes.

## Run locally

```bash
python3 -m unittest discover -s tools/asset_registry/tests -v
python3 tools/asset_registry/build.py
python3 tools/asset_registry/validate.py
```

## Generated outputs

```text
registry/assets/v1/
├── manifest.json
├── summary.md
├── catalog.jsonl
├── problems.json
├── delta.json
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

## Provenance / ownership rule

Mechanical facts come from Git/file structure. Explicit model references come from the file itself. Deck grouping comes from the existing deck manifest. Reviewed exceptions live in small override files. No Registry stage silently promotes inferred gameplay meaning, rig compatibility, donor suitability or license claims to repo-exact fact.

## Calibration baseline · 2026-09-12

The manual `kfb-asset-library (8).json` export reported 12,767 loadable assets: 6,442 images, 4,642 models and 1,683 audio files. `KayKit_Mystery_Series6` contained 826 entries in that export (586 models + 240 images). The export is test evidence only; GitHub state overrides it.

The current real Farmers control `.../gltf/lettuce.gltf` explicitly references `farmer_texture_A.png` and `lettuce.bin`; both are tracked beside it. The current `media/kfb` tree also contains the exact PDF + JSON pairs referenced by all four explicit deck entries in `kfb-index.json`.

## Bot-PR prerequisite

The repository must permit GitHub Actions' `GITHUB_TOKEN` to create/update pull requests. If repository policy disables that permission, build/test/validation still run but the final PR creation step will fail visibly rather than falling back to a silent direct write.

## Next consumer

After AR4, the Registry is ready to serve **KFB Asset Librarian v1**: search/filter, 3D previews, RAW URL copy, metadata, exports and later an LLM assistant. Those consumers read the Registry; they do not become asset SSOT.
