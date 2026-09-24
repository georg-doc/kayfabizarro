# KFB WorldBuilder v1 · Claude Design start · 2026-09-24

Paste this whole file as the first message of a fresh Claude Design project. Everything you need is in here. Do not go searching the repo beyond the URLs listed.

Continues `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` (same folder): its gate is met (Web editor R2 PASS, WB2 sculpt ACCEPT, Georg 24.09). New since then, by Georg: the world is a **sphere**, sky/weather come from TinySkies, Elastic Grotesque Clay is the default building view. Its "must not rebuild" list still applies: terrain-height truth, scene persistence, TransformControls/edit seam, Resource Registry, OSM truth, movement/camera owners.

## What Georg wants to see

One coherent browser app, **KFB WorldBuilder v1**: a small round world he can shape, dress and walk on.

1. **A sphere world** covered by one continuous procedural terrain (not hex tiles, not voxels, not the Travel Globe mesh).
2. **Sky from TinySkies**: sky dome, clouds, day/evening/night, rain, world mood.
3. **Terrain editing** on that sphere: Raise / Lower brush with radius (mouse wheel) and strength, Undo, Clear, Save / Reload.
4. **Object editing**: pick a real KFB/KayKit object, place it on the ground, move / rotate / scale / drop to terrain, Save / Reload.
5. **Look**: KFB Elastic Grotesque Clay as the **default** view for buildings; Clean / Cartoon / Grotesque stay available through a **view switch**. Ground gets the triplanar RGB-palette material.
6. **Walk**: one character walks over the sphere (camera follows, WASD). Existing KayKit clips first; Mixamo clips come later via `ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md` (same folder). Characters appear with their approved eye rig on by default (EyeRig Atlas profiles, see that file §2b).

Done when Georg can: shape a hill, place three objects, switch sky to rain and to night, switch the view, walk a character across his hill, save, reload, keep editing.

## Fork these — copy, do not rebuild

Load at runtime from jsDelivr, pinned. Print one line on screen per donor proving it loaded (e.g. "WB2 sculpt @8922d4b1 loaded").

| Part | Source (copy/import exactly) |
|---|---|
| Terrain + object editor (accepted by Georg: R2 editor PASS, WB2 sculpt ACCEPT) | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e/tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html` + `.../terrain-sculpt.js` in the same folder |
| Shared object editor (the only allowed transform/selection owner) | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e/tools/KFB-ToolBox/lib/edit-layer.js` |
| Sphere / planet terrain approach (MIT) | `https://github.com/ZyFou/ProceduralTerrains` @`f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` — Planet mode: engine split from UI, seeded parameters, chunk/LOD. Take the architecture and MIT code where it fits; not its React shell. |
| Sky, clouds, weather, day/night, moods | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/travel/wip/travel_globe_wsa/globe-v13/` → `sky-presets.js`, `sky-atmosphere.js`, `day-night.js`, `weltstimmungen.js`, `rain-overlay.js`, `starfield.js`, `sun-shadow.js`, `light-budget.js`. Rule: world mood shifts **hue**, not saturation/lightness. Take only sky/weather/light — nothing else from Travel. |
| Ground material (triplanar, RGB palette, macro texture) | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB%20World%20Design%20Setup%20(1)/WORLDDESIGN_LAB_2026-09-23/deliverables/` → `wd-look.js`, `wd-macro.js`, `textures/` (shader injection; SOURCE stays lossless) |
| Building look + view switch | `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/` shows the tested V2 (@`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`, folder `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/`). Reuse its deformer as the default, keep the other three modes switchable. |
| Real objects | `registry/assets/v1/packs/<slug>.json` gives exact pinned paths per asset (KayKit, Kenney, Tiny Treats). Use those paths; do not guess file names. |

## Rules (non-negotiable)

- **Take what works, show the picture, say what changed.** If a donor runs, copy it; never re-derive it.
- One transform owner (`edit-layer.js`), one picker, one terrain height truth: `finalHeight = baseHeight + sculptDelta`, projected onto the sphere.
- No hex/voxel ground, no Travel terrain, no new sky system, no simplified look-alike copies.
- Every "fixed" names what is different in the picture.
- Stop after the Done-when list. No extra features.

## Delivery

Export the project (all files, unchanged multi-file). Coworker publishes it as a review page under `kayfabizarro.pages.dev/kfb-hub/pruefen/worldbuilder-v1/` and links it in the KFB Hub. No single-file bundling.
