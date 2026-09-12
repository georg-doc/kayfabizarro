# Source Paths · KFB Asset Librarian v1.2 Core

## Canonical inputs — unchanged

- `registry/assets/v1/manifest.json`
- `registry/assets/v1/catalog.jsonl`
- `registry/assets/v1/rigfacts.jsonl`
- `registry/assets/v1/rigfacts-summary.json`
- `registry/assets/v1/problems.json`
- `registry/assets/v1/packs/index.json`
- `tools/asset_registry/consumer_profiles.json`

v1.2 does not own or regenerate these files.

## Site source

- `tools/asset_registry/librarian/index.html`
- `tools/asset_registry/librarian/styles.css`
- `tools/asset_registry/librarian/app.js`
- `tools/asset_registry/librarian/state.js`
- `tools/asset_registry/librarian/registry.js`
- `tools/asset_registry/librarian/search.js`
- `tools/asset_registry/librarian/render.js`
- `tools/asset_registry/librarian/selection.js`
- `tools/asset_registry/librarian/preview.js`
- `tools/asset_registry/librarian/preview3d.js`

## Tests / evidence

- `tools/asset_registry/tests/test_librarian_browser.py`
- `.github/scripts/asset-librarian-browser-smoke.mjs` — v1 regression gate
- `.github/scripts/asset-librarian-v1.2-acceptance.mjs` — WSA T1–T6 runner
- `.github/scripts/asset-librarian-v1.2-env.mjs` / `-cdp.mjs` / `-ui.mjs` / `-tasks-a.mjs` / `-tasks-b.mjs` — acceptance harness modules
- `.github/workflows/asset-librarian-browser-smoke.yml`
- CI artifact: `kfb-asset-librarian-browser-smoke`

## Owner boundaries

- Asset truth: tracked files in `georg-doc/kayfabizarro`
- Deck owner: `media/kfb/kfb-index.json`
- Frankenstein workflow owner: `skills/kfb-frankensteining_v1.md`
- Stunt Car Race implementation owner: `georg-doc/KFB-Stunt-Car-Race`
- Browser role: read/search/preview/select/export candidates only
