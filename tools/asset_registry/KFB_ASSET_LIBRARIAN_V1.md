# KFB Asset Librarian v1 · Consumer Contract

**Status:** IMPLEMENTATION CANDIDATE / AR5 consumer handoff  
**Asset source of truth:** tracked files in `georg-doc/kayfabizarro`  
**Registry role:** generated read layer  
**Librarian role:** search, explain, shortlist, export candidate handoffs  
**Not allowed:** silently invent gameplay roles, donor quality, license claims, rig compatibility, roster membership or implementation decisions.

## Read order

Do not load the whole library into an LLM context.

1. `registry/assets/v1/manifest.json`
2. `registry/assets/v1/delta.json`
3. `registry/assets/v1/problems.json`
4. `registry/assets/v1/rigfacts-summary.json`
5. use `tools/asset_registry/query.py` for the actual question
6. load only the returned asset records / relevant pack shard when more detail is required

## Candidate vs decision

Every Librarian recommendation is a **candidate** until the receiving consumer validates it.

```text
repo/file fact
    -> generated Registry fact
    -> Librarian candidate/inference
    -> receiving consumer decision
    -> implementation
    -> tested result
```

Do not collapse those stages.

## Supported consumer profiles

Profiles live in `tools/asset_registry/consumer_profiles.json`.

### Animation Lab

Useful for skin/joint/animation/skeleton-signature search. Matching signatures are structural evidence, not a retarget guarantee.

### Frankenstein Studio

Use the Librarian to replace the old manual `kfb-asset-library.json` search step and produce at least three plausible donor candidates. `skills/kfb-frankensteining_v1.md` remains the workflow owner. Island count/bounds, mounting frame, axis, palette fit and visual acceptance remain laboratory work.

### Combat Arena

The Librarian may surface model/audio/image candidates and rig facts. It never edits or replaces an arena roster by implication. Existing Combat Arena modules own roster decisions, measured dimensions, clip/locomotion mapping, gaze/orientation and gameplay acceptance.

### KFB Stunt Car Race

`georg-doc/KFB-Stunt-Car-Race` remains implementation SSOT. The Librarian can supply source assets to race-track, road-trip, vehicle, stunt, garage/hub and other slices, but the receiving module owns scale/orientation, collision/drivability and tested gameplay use.

### Generic Runtime

Fallback for new consumers. Add a dedicated profile once a stable receiving contract exists.

## Query examples

```bash
# rigged knight-like candidates
python3 tools/asset_registry/query.py knight --kind model-3d --rigged yes

# models with explicit Walk clips for Animation Lab review
python3 tools/asset_registry/query.py --kind model-3d --animated yes --clip walk --consumer animation-lab

# donor shortlist envelope
python3 tools/asset_registry/query.py booster --consumer frankenstein-studio --limit 5 --handoff

# candidate assets for Combat Arena
python3 tools/asset_registry/query.py monster --consumer combat-arena --limit 10 --handoff

# source candidates for Stunt Car Race
python3 tools/asset_registry/query.py ramp --consumer stunt-car-race --limit 20 --handoff
```

## LLM tool surface later

A future browser/chat app should wrap the deterministic layer with small read tools rather than expose the whole catalog:

- `search_assets(filters)`
- `get_asset(assetId)`
- `get_pack(packId)`
- `get_dependencies(assetId)`
- `get_rig_facts(assetId)`
- `find_same_skeleton(signature)`
- `export_handoff(consumerId, assetIds)`

The LLM may reason over those facts and explain why candidates look promising. It must label compatibility/suitability statements as inference until the receiving consumer has tested them.
