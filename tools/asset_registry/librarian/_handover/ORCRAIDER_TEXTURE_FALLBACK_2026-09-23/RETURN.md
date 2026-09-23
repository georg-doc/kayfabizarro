# RETURN · Asset Librarian v1.7 · Orc Raider texture fallback

**Date:** 2026-09-23  
**Status:** IMPLEMENTATION + REGRESSION PREP · NO PUBLIC PROMOTION CLAIM

## Outcome

Diagnosed and patched the white Orc Raider preview in Asset Librarian v1.7.

## Root cause

Exact selected asset:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb`

The model:

- parses correctly;
- is skinned;
- is Rig_Medium / 23 joints;
- renders geometry correctly.

The problem is material/source packaging:

- material name: `orc_texture_A`;
- the GLB provides no `material.map` for it;
- the real source PNG is:
  `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/textures/orc_texture_A.png`;
- the PNG exists at the user's pinned source commit `e0037d79af9f0546c73cee02e361f78f7d662df2`.

Existing measured donor evidence in:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-biped.v1.js`

already documents the same anomaly:

> Orc Raider material `orc_texture_A` has no map; the image is one folder level higher in `textures/`.

Asset Librarian v1.7 previously used direct `GLTFLoader` only, so the geometry rendered white.

## Fix

Added:

`tools/asset_registry/librarian/texture-fallback.js`

Behavior:

1. after normal GLTF load, inspect mesh/skinned-mesh materials;
2. only consider materials with:
   - no existing `map`;
   - a texture-like material name;
3. derive nearby source-relative candidate URLs from the same pinned/raw source URL;
4. try `../textures/`, `../../textures/`, same-dir `textures/`, and nearby `texture/`;
5. if found:
   - assign the real texture;
   - `SRGBColorSpace`;
   - `flipY=false`;
   - nearest magnification;
   - material update;
6. if none is found, fail closed and leave the original white material.

Applied to:

- detail preview: `preview3d.js`;
- Gallery thumbnails: `thumb3d.js`.

No Registry record, asset file, rig profile or handoff is modified.

## Regression coverage

Updated:

- `tools/asset_registry/tests/test_librarian_browser.py`
- `.github/scripts/asset-librarian-v1.7-browse-filters-smoke.mjs`
- `.github/workflows/asset-librarian-browser-smoke.yml`

The browser smoke now:

- opens the real Orc Raider by exact asset ID;
- waits for the detail preview to report a texture fallback;
- captures `02-orc-raider-texture-fallback.png`;
- still requires zero console/runtime errors.

The workflow syntax-checks the new helper.

## Changed files

1. `tools/asset_registry/librarian/texture-fallback.js`
2. `tools/asset_registry/librarian/preview3d.js`
3. `tools/asset_registry/librarian/thumb3d.js`
4. `tools/asset_registry/tests/test_librarian_browser.py`
5. `.github/scripts/asset-librarian-v1.7-browse-filters-smoke.mjs`
6. `.github/workflows/asset-librarian-browser-smoke.yml`
7. `tools/asset_registry/librarian/CHANGELOG.md`
8. this `RETURN.md`

## Public status

Permanent Asset Librarian route remains:

`https://kayfabizarro.pages.dev/asset-librarian/`

This slice does **not** claim the fix is live/public until:

1. CI/browser smoke passes on the exact PR head;
2. the branch is merged through the normal gate;
3. the permanent Cloudflare route is re-opened and the textured Orc Raider is visibly present.

## One next gate

Open the Draft PR and let the existing Asset Librarian browser workflow validate the exact branch head.

Do not merge/promote automatically.
