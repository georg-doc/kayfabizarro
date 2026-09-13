# KFB Asset Librarian v1.2 Core

**Status:** implementation candidate for the WSA six-task acceptance gate  
**Mode:** static, read-only, no LLM/API key required  
**Asset / Registry SSOT:** `georg-doc/kayfabizarro`

v1.2 turns the already browser-tested v1 Registry consumer into a daily-use production site. It deliberately does **not** create a new index, duplicate Registry truth, call an LLM, or write back to assets/Registry.

## Start

Serve the repository root over HTTP, not `file://`:

```bash
python3 -m http.server 8000
```

Open:

`http://localhost:8000/tools/asset_registry/librarian/`

## Daily workflow

1. Search/filter the canonical Registry.
2. Switch between compact list and visual cards.
3. Inspect exact path, asset ID, source commit/blob, pinned/latest RAW, dependencies, rig facts and review items.
4. Preview GLB/GLTF, images/textures or audio.
5. Add candidates to the persistent local Selection Tray.
6. Choose a consumer profile.
7. Copy/download `kfb.asset-handoff.v1`.

All selections remain `candidate-only`. The receiving consumer owns final suitability and implementation.

## v1.2 additions

- collection filter
- Registry problem/review-queue filter
- list + cards result modes
- cheap image thumbnails; no grid of 3D canvases
- exact identity/provenance block
- dependency navigation
- skeleton signatures + structural-evidence warning
- 3D camera fit/reset, wireframe, autoplay and clip selector
- image dimensions + checkerboard preview
- audio controls + duration/volume, no autoplay
- persistent local Selection Tray (`localStorage`)
- no interactive LLM UI in Core

## Acceptance gate

`.github/scripts/asset-librarian-v1.2-acceptance.mjs` runs the six real WSA tasks:

1. Orc Raider + texture
2. Rover Round → Stunt Car Race
3. Rig Medium characters → Animation Lab
4. CapsuleCarl + CharacterTemplate → Frankenstein Studio
5. Bath + Space Ranger Jetpack → Frankenstein Studio
6. Audio preview → Generic Runtime

The browser gate also checks the review queue, no console/runtime errors, and local selection persistence.

See `SITE_QA.md` and `RETURN.md` for the review result.
