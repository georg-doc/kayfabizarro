# KFB Asset Registry · AR1–AR5

**Status:** IMPLEMENTATION CANDIDATE · deterministic Registry + reviewable automation + neutral consumer handoff  
**Owner:** deterministic repo indexer + `Refresh KFB Asset Registry` GitHub Action  
**Asset source of truth:** tracked files in `georg-doc/kayfabizarro`  
**Deck owner:** existing `media/kfb/kfb-index.json` (`kfb-deck-registry/v2`)  
**Not an owner:** chat memory, the historical `media/3D_Assets/CATALOG/`, manually exported library JSON files, generated registry output, or KFB Asset Librarian recommendations.

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

## AR5 · KFB Asset Librarian consumer handoff

AR5 keeps the Registry generic and makes it useful to multiple receiving tools instead of hard-wiring it to Animation Lab.

### Rig facts sidecar

`rigfacts.py` creates `rigfacts.jsonl` plus `rigfacts-summary.json` from GLTF/GLB file structure. It records only mechanically defensible facts:

- skins and joint counts;
- explicit joint names;
- skinned-mesh-node count;
- animation clip names/channel counts/target paths;
- structural skeleton signatures based on joint names + joint-local parent topology.

A matching skeleton signature is **structural evidence only**. It is not a retargeting or gameplay compatibility guarantee.

### Query + handoff

`query.py` can search/filter by name/path/pack/format/dependency status and, when the rig sidecar is present, by skin, animation clip, joint or skeleton signature.

Consumer profiles in `consumer_profiles.json` currently cover:

- `animation-lab`
- `frankenstein-studio`
- `combat-arena`
- `stunt-car-race`
- `generic-runtime`

Every exported `kfb.asset-handoff.v1` has `selectionStatus: candidate-only`. The receiving consumer remains owner of suitability and integration.

### Owner boundaries

- **Frankenstein Studio:** `skills/kfb-frankensteining_v1.md` remains authoritative. Librarian search replaces the old manual asset-library lookup; donor quality, island measurements, mounting frame and visual acceptance stay downstream.
- **Combat Arena:** the existing Combat Arena modules remain authoritative. Librarian results are candidates only; roster decisions, measured body dimensions, clip/locomotion mapping, gaze/orientation and gameplay testing remain downstream.
- **KFB Stunt Car Race:** `georg-doc/KFB-Stunt-Car-Race` remains implementation SSOT. `kayfabizarro` remains asset source/discovery; the receiving race, stunt, garage/hub or vehicle module owns integration and tested gameplay use.
- **Animation Lab:** rig facts help shortlist models, but playback/pose/retarget checks remain downstream.
- Future consumers can add a small profile without changing Registry ownership.

The intended contract is therefore:

```text
Git/file fact -> Registry / rig sidecar -> Librarian candidate -> receiving consumer validation
```

No stage silently promotes a recommendation to an implementation decision.

## Run locally

```bash
python3 -m unittest discover -s tools/asset_registry/tests -v
python3 tools/asset_registry/build.py
python3 tools/asset_registry/validate.py
python3 tools/asset_registry/rigfacts.py build
python3 tools/asset_registry/rigfacts.py validate
```

Example queries:

```bash
python3 tools/asset_registry/query.py knight --kind model-3d --rigged yes
python3 tools/asset_registry/query.py --kind model-3d --animated yes --clip walk --consumer animation-lab
python3 tools/asset_registry/query.py booster --consumer frankenstein-studio --handoff
python3 tools/asset_registry/query.py monster --consumer combat-arena --handoff
python3 tools/asset_registry/query.py ramp --consumer stunt-car-race --handoff
```

## Generated outputs

```text
registry/assets/v1/
├── manifest.json
├── summary.md
├── catalog.jsonl
├── problems.json
├── delta.json
├── rigfacts.jsonl
├── rigfacts-summary.json
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

## Tested result · real GitHub Actions · 2026-09-12

AR5 passed the full repository workflow on GitHub Actions:

- **18 / 18 tests passing**;
- canonical Registry validator: **OK**;
- rig sidecar validator: **OK**;
- Librarian query + `combat-arena` candidate handoff smoke test: **OK**.

Current real inventory remains 12,767 assets: 6,442 images, 4,642 models and 1,683 audio files across 99 structural packs plus four explicit decks.

Rig sidecar across all 4,642 models:

- 4,215 GLTF/GLB models parsed successfully;
- 372 models contain skins/rigs;
- 415 models contain animation channels;
- 115 OBJ models are explicitly `not-applicable` for rig parsing;
- 312 other model formats remain explicitly `unresolved`;
- **0 rig parse errors**.

The real smoke test found, among others:

- rigged query result: `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN.glb` (`skin=true`, 23 joints);
- animated `combat-arena` handoff candidate: `media/3D_Assets/MonsterPack_Quaternius/Big/glTF/Alien.gltf`.

The second item is deliberately a **candidate-only** result, not a claim that the Alien is already Combat Arena compatible.

## Provenance / ownership rule

Mechanical facts come from Git/file structure. Explicit model references come from the file itself. Deck grouping comes from the existing deck manifest. Rig facts come from GLTF/GLB structure. Reviewed exceptions live in small override files. No Registry stage silently promotes inferred gameplay meaning, rig compatibility, donor suitability or license claims to repo-exact fact.

## Calibration baseline · 2026-09-12

The manual `kfb-asset-library (8).json` export reported 12,767 loadable assets: 6,442 images, 4,642 models and 1,683 audio files. `KayKit_Mystery_Series6` contained 826 entries in that export (586 models + 240 images). The export is test evidence only; GitHub state overrides it.

The current real Farmers control `.../gltf/lettuce.gltf` explicitly references `farmer_texture_A.png` and `lettuce.bin`; both are tracked beside it. The current `media/kfb` tree also contains the exact PDF + JSON pairs referenced by all four explicit deck entries in `kfb-index.json`.

## Bot-PR prerequisite

The repository must permit GitHub Actions' `GITHUB_TOKEN` to create/update pull requests. If repository policy disables that permission, build/test/validation still run but the final PR creation step will fail visibly rather than falling back to a silent direct write.

## UI boundary

AR5 is the consumer handoff/API slice. A browser UI, Three.js preview and LLM chat are consumers built on top of these files/tools; they are not additional Registry owners.
