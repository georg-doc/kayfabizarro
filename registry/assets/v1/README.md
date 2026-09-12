# Generated KFB Asset Registry v1

This directory is the output target of `tools/asset_registry/build.py`.

**Status on the AR2 branch:** AR1 flat inventory plus AR2 structural packs/dependency resolver are implemented; generated catalog files are intentionally not hand-authored.

A real repo build creates:

- `manifest.json`
- `catalog.jsonl`
- `summary.md`
- `problems.json`
- `kinds/*.json`
- `packs/index.json`
- `packs/<pack-id>.json`

Do not edit generated records manually. Curated exceptions live under `tools/asset_registry/overrides/` with explicit provenance.
