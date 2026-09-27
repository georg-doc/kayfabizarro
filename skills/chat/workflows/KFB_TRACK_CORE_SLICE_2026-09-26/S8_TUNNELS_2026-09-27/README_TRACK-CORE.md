# TRACK-CORE · folder layout (Dropbox `KFB Racetrack Blender Kit/TRACK-CORE/`, mirrors GitHub PR #219)

GitHub: `georg-doc/kayfabizarro` branch `georg-doc-patch-2` → `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/<slice>/`

| Folder | Contents |
|---|---|
| `W0_2026-09-27/` | Census, contract v0, RouteRecipe schema, RETURN; `track-core/` = JS core **v0.1** + tests + seed fixture |
| `S2_B1_2026-09-27/` | RETURN, screenshots; `track-core/` = core **v0.2** (split/merge, jumps, connector) + fixtures; `blender/` = B1 importer; `out/` = streams; `b1/` = Blender file, GLB, oracle report |
| `S3_2026-09-27/` | RETURN; `track-core/` = core **v0.3** (skins, bar taper, ramp/steps, anchors, headroom) + `layout/td03.mjs`; `blender/` = importer, Uni-Center scenery, clearance check; `out/` = streams + corridor; `b1/` = TD03 and seed Blender files, GLBs |
| `S4_DESIGN_BRIEF_2026-09-27/` | Claude Design brief (EN) for the track look in the clay world (style anchor H0 Hirnwelt) + ZIP package; `blender/` = shot script; `shots/` = renders; `kit/` = three.js loader, profiles plot; `b1/` = shot state Blender file |
| `S5_CIRCUIT_2026-09-27/` | RETURN; `track-core/` = core **v0.4** (half ramps, closed circuits, `closure`) + `layout/td04.mjs`; `blender/` = importer, TD04 build, clearance, shots; `out/` = TD04 stream + plan; `b1/` = TD04 Blender file, GLB, oracle report; `shots/` |
| `S6_TWIST_ROUND_2026-09-27/` | RETURN; `track-core/` = core **v0.5** (open ends run out thin, headroom for banked decks) + `layout/td05.mjs` (twisted balcony); `blender/` = TD05 build, rounded-architecture modifiers, clearance, shots; `out/` = TD05 stream + plan; `b1/` = TD05 Blender file, GLB, oracle report; `shots/` |
| `S7_FAHRSCHULE_2026-09-27/` | RETURN; `track-core/` = core **v0.6** (pads, FORK/JOIN Weiche, drive modes, buoy skin, `pad_level`, `landing_dip`) + `layout/fs01.mjs` + OSM extract of the Otto-Maigler-See; `blender/` = site + shots; `out/` = FS01 graph stream + plan; `b1/` = FS01 Blender file, GLB, oracle report; `shots/` |
| `S8_TUNNELS_2026-09-27/` | RETURN; `track-core/` = core **v0.7** (tunnel layer: round / oval / rect / poly rings that morph, `tunnel_clearance`, `tunnel_morph`, `portal_match`, `tunnel_shell`, `buried_open`; ring palette; grid-based clearance) + `layout/tn01.mjs`; `blender/` = site (tubes, terrain, building, hollow earth) + shots; `out/` = TN01 graph stream (**.json.gz**) + plan; `b1/` = TN01 Blender file, GLB, oracle report; `shots/` |
| `_to_delete/` | Superseded importer iterations, Dropbox duplicate PNGs, W0 copies that had been overwritten with v0.2. Nothing was deleted; Georg decides. |

The newest core is always in the newest slice folder. Blender files are new per slice; no foreign .blend is saved.
