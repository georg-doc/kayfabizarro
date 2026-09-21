# KFB Asset Librarian v1.1 · Read-only LLM tools

**Status:** IMPLEMENTATION CANDIDATE  
**Owner boundary:** Registry facts + candidate discovery only

## Purpose

Expose the existing generated Asset Registry through a small provider-neutral tool surface. This is the layer that a later ChatGPT App, OpenAI tool-calling backend, MCP server, or private site can bind to without loading the full 12,767-asset catalog into an LLM prompt.

Implementation:

`tools/asset_registry/librarian_tools.py`

The module reuses the existing `query.py` / Registry contracts. It does not create a second search index or second asset truth.

## Tools

- `search_assets`
- `get_asset`
- `get_dependencies`
- `get_rig_facts`
- `find_same_skeleton`
- `export_handoff`

## Hard rules

- read-only
- no asset writes
- no roster writes
- no automatic gameplay-role assignment
- no donor-quality claim
- no retarget-compatibility claim
- skeleton-signature equality is structural evidence only
- all exported selections remain `candidate-only`
- receiving consumer owns final suitability and implementation

## CLI calibration

List the tool catalog:

```bash
python3 tools/asset_registry/librarian_tools.py --list-tools
```

Search rigged candidates:

```bash
python3 tools/asset_registry/librarian_tools.py \
  --tool search_assets \
  --args '{"query":"Alien","filters":{"kind":"model-3d","rigged":"yes"},"consumer_id":"combat-arena","limit":5}'
```

Get exact rig facts:

```bash
python3 tools/asset_registry/librarian_tools.py \
  --tool get_rig_facts \
  --args '{"asset_id":"media/3D_Assets/MonsterPack_Quaternius/Big/glTF/Alien.gltf"}'
```

Find exact structural skeleton-signature overlaps:

```bash
python3 tools/asset_registry/librarian_tools.py \
  --tool find_same_skeleton \
  --args '{"asset_id":"media/3D_Assets/MonsterPack_Quaternius/Big/glTF/Alien.gltf","limit":10}'
```

## Next gate

After this facade is tested against the real Registry, bind it to one LLM host. The first LLM slice should stay read-only and answer questions by calling these tools rather than by ingesting the full Registry.
