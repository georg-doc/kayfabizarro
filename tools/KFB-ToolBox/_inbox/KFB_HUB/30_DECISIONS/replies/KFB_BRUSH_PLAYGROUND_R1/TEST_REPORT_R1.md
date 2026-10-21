# Brush Playground · Prototype test / evidence · 2026-10-21
Status: SOURCE CANDIDATE ONLY, not visually accepted.
Path: prototype/index.html on planning/kfb-brush-playground-r1-2026-10-21

## Delivered behavior in source
- Self-contained HTML/JS no tracking/servers; local File API reads an imported ZIP-based single .brush (Shape.png). Import not uploaded.
- Minimal ZIP central-directory reader; accepts STORED or DEFLATE if browser supports DecompressionStream('deflate-raw'), 32 MB archive cap, 10 MB decoded entry cap, 4096 px per-dimension tip cap.
- Canvas drawing with Pointer Events, coalesced events when available, size/pressure/speed/scatter controls, seed-based stamp jitter, undo/redo, clear, transparent PNG export.
- Pure tip color composited in an offscreen tint cache (repaired after first GitHub commit).
- All dynamics are manually tuned proof controls. `Brush.archive` decode, pressure curves, grain, taper, rotation semantics, bitmap alpha parity, brush-specific calibration, and .brushset import NOT implemented yet.

## Evidence actually obtained
- GitHub source write and exact readback: two commits (initial candidate d93c70e1b55acbee64770e442c25ba0c707bbc25; compositing fix 42febc8a321ecd181063d09fd5f836d1afeba12e), final source content exact readback 1/1.
- Repository-native build/test 0. Browser/import/PNG real execution tests 0. Screenshots 0. iPad/Pencil 0. Procreate visual references 0. No public Site/Stage. No PR/merge.
- Local container attempt to retrieve GitHub raw file returned connection failure. This does not prove app fails; testing remains UNKNOWN. Do not call it functional/live.
- Notion brush-to-set-to-Dropbox identity association remains UNRESOLVED; no arbitrary matching.

## Known technical limitations / actions for receiving tester
1. Direct import depends on browser deflate-raw support; where absent the import fails with error. Before usable MVP use a pinned local decompressor package (no runtime CDN), test Safari.
2. Zip parser intentionally minimal; not yet hardened with CRC verification, malicious offsets bounds, zip bombs, encrypted ZIP rejection. Keep private local use only.
3. Stamp color tinting assumes tip PNG alpha is meaningful; inspect actual Procreate shape white/black polarity and transform appropriately. Must show original shape isolated in browser first.
4. Mouse-pressure fallback is fixed .65, stylus pressure based on PointerEvent. Speed in px/ms currently approximated; calibrated curves absent.
5. Rendering currently replays all stroke points per pointermove; may have quadratic frame cost on large drawings. Benchmark and build cached committed layer / active stroke preview before large catalogs.
6. Imported tip is global: changing brushes will repaint older strokes with new tip during undo/redraw. Fix by per-stroke immutable tip reference/version before accepting multi-brush sessions.
7. Browser paint engine source is separate from KFB 3D and Comic (Re)Motion, no new owner authority. Notion editorial and Dropbox private originals remain unmoved.

## Single next gate
Receiving WS0/ToolBox executor runs the private CRAYONIC source-isolation and actual browser tests (draw/undo/PNG including switching across 2 tips) then repairs only the smallest failing seam before claiming a usable MVP. Comic (Re)Motion remains a later optional consumer.

## R1.5 · 2026-10-21 · Claude Code workshop · real CRAYONIC import, drawing and export tested in Chromium
Status: **LOCAL MVP CANDIDATE · tests PASS · fidelity = SIMULATION, not Procreate parity · Georg acceptance open.**
Executor: Claude Code (Mac, worktree `~/kfb-ws1/brush`), base `7a1e73ecb07bcbacd0518499a52aabb6373abc74`.

### What changed against R1.4
- `prototype/index.html` rebuilt on the R1.4 candidate; new `prototype/brush-core.js` (DOM-free core shared with tests), vendored `prototype/vendor/fflate-0.8.3.umd.js` (MIT, unchanged npm copy) instead of `DecompressionStream`, `prototype/tests/unit.mjs`, `prototype/tests/browser.mjs`, `prototype/README.md`.
- `Brush.archive` is now decoded in the browser (bplist00 + NSKeyedArchiver). CRAYONIC: 52 fields; 175-field P5 archives also decode.
- R1.4 limitation 3 confirmed and fixed: CRAYONIC `Shape.png` is 1024² grayscale **without alpha**; R1.4's `source-in` tint would have stamped a solid square. Stamp is now luminance → alpha (test B02: corner alpha 0, centre 223).
- R1.4 limitation 5 fixed: committed layer + active stroke buffer, dirty-rect frames; undo replays from checkpoints every 10 actions.
- R1.4 limitation 6 fixed: each stroke stores brush id (archive SHA-256 prefix), effective parameters, seed and samples; switching brushes never repaints old strokes (B08).
- R1.4 limitations 1/2: fflate inflate (no `deflate-raw` dependency); ZIP limits (32 MB file, 64 entries, 24 MB per member checked before inflate, 48 MB total), path traversal rejected, PNG side ≤ 4096, plist size/object/cycle caps.

### Decoded field → simulation mapping (all HEURISTIC unless noted)
Pressure → size/opacity, speed → size/opacity (screen px/ms, "fast" = 4), size/opacity jitter, tilt → size/opacity with tilt threshold (pen only), shapeRotation = follow stroke, shapeScatter = random rotation, plotSpacing (fraction of diameter), plotJitter, plotSmoothing, start/end taper (normalised length × 600 px), glaze flow per stamp, **glaze type 1 read as "uniform glaze": stamps combine by per-pixel maximum, no build-up inside a stroke** (interpretation, chosen because it brought CRAYONIC mean alpha from 0.80 to 0.47 against the reference 0.48), stroke opacity caps the stroke, texturized grain (scale, polarity).
IGNORED: grain movement/rolling, grain zoom/rotation/orientation, shape orientation/azimuth, wet mix/load/falloff, pressure smoothing, Procreate size slider and limits (UI size is px), all 120+ extra fields of newer archives (listed in the inspector).
MISSING from the file: CRAYONIC grain `Brush-Artery-Charcoal-Burnt.jpg` and PASTEL grain `Brush-Preset-Oil-Pastel.jpg` are Procreate built-ins. A seeded fibrous **substitute** grain is used and labelled in red in the inspector.
Mouse/touch: constant simulated pressure (slider, default 0.60), labelled in the HUD. Eraser: same shape and size dynamics, full flow, no grain (heuristic).

### Automated checks actually run (2026-10-21, macOS, Chromium 156.0.8078.4 headless via Playwright 1.64.0)
- `node tests/unit.mjs` with `BRUSH_DIR=~/Downloads`: **28 passed, 0 failed** (bplist decode + 3 malformed-input rejections; ZIP valid/Reset-ignored/path traversal/missing shape/.brushset named/zip bomb/non-zip; seeded determinism, live = replay, pressure size and opacity, speed opacity and negative speed size, rotation follow, scatter spread, end taper, spacing; 5 private brushes decode; CRAYONIC values equal the R1.3 audit).
- `node tests/browser.mjs`: **17 passed, 0 failed** — real pointer input on the `file://` page:

| # | Check | Result |
|---|---|---|
| B01 | page loads from file://, no errors | PASS |
| B02 | private CRAYONIC import, 52 fields, shape 1024², stamp isolated (corner α 0 / centre 223), substitute grain labelled | PASS |
| B03 | pen pressure via CDP (`pointerType: pen`, force 0.05→1.0) reaches the stroke | PASS · thickness 8.7 → 42.2 px |
| B04 | pen tilt 60° (tiltSize .39) | PASS · 38.1 → 47.4 px |
| B05 | speed: slow ≈0.19 vs fast ≈2.3 screen px/ms (mouse) | PASS · mean α 0.433 → 0.143, thickness 28.4 → 32.1 (run-to-run timing varies) |
| B06 | color #c0392b, size 140, opacity 0.4 | PASS · rgb 191,55,41 · max α 0.22 · wider |
| B07 | undo×2/redo×2 and ⌘Z/⇧⌘Z restore identical pixel hash | PASS |
| B08 | second brush (PASTEL), switch back, undo/redo rebuild: first CRAYONIC stroke region unchanged, 2 brush ids in history | PASS |
| B09 | eraser removes paint, undo restores hash | PASS · alpha sum 286 → 5 in band |
| B10 | clear is undoable | PASS |
| B11 | transparent PNG download: 1600×1000 RGBA, corner α 0, painted pixels equal canvas; paper PNG opaque | PASS · 249,006 painted px |
| B12 | comparison against the Procreate preview stroke of each file | PASS (gate: CRAYONIC IoU ≥ 0.75) · table below |
| B13 | broken file and fake .brushset rejected with readable message, nothing added | PASS |
| B14 | performance: 240-sample pen stroke + 52 replayed strokes | PASS · frame mean 2.74 ms / max 3.0 ms, commit ≤ 20.6 ms, undo rebuild 15.7 ms at 62 strokes |
| B15 | no network requests besides file:/blob: | PASS |
| B16 | 820×1180 viewport, no horizontal scroll | PASS |
| B17 | no console errors in the whole run | PASS |

### Comparison with original Procreate strokes
Reference = `QuickLook/Thumbnail.png` inside each brush file (440×276, rendered by Procreate). Path and pressure are recovered from the reference silhouette (column centroid, perpendicular width → pressure), replayed at an **assumed** slow constant speed 0.25 px/ms with the decoded parameters; no per-brush fitting.

| Brush | Silhouette IoU | Width error | Mean α sim / ref | Texture σ sim / ref | Grain | Reading |
|---|---|---|---|---|---|---|
| CRAYONIC | 0.867 | 9.9 % | 0.472 / 0.484 | 0.109 / 0.191 | substitute | silhouette, taper and tone close; grain texture too flat (real grain missing) |
| PASTEL (holdout) | 0.883 | 11.5 % | 0.457 / 0.648 | 0.131 / 0.225 | substitute | shape good, simulation ~30 % too light |
| ACRYLOID dry 2.0 (holdout) | 0.754 | 55.2 % | 0.378 / 0.349 | 0.344 / 0.091 | file | **not simulated**: square texture shape + rolling grain (movement .21, scatter 0) produce Procreate's bristle streaks; our texturized grain makes blobs |

A global square-root spacing mapping was tried on all three and rejected (no consistent gain). The stroke direction of Procreate's preview path is assumed left → right.

### Evidence
- Public, in `../evidence/` (drawn output and masked UI only): `canvas_drawing.png`, `export_transparent.png` (the B11 download), `editor_ui_inspector_masked.png`, `editor_ipad_portrait_masked.png`, `browser-results.json`.
- Private, **not in Git**: `~/kfb-ws1/brush-evidence-private/run6/` — `editor_full_private.png` (isolated shape, stamp, grain label, Procreate preview next to simulation), `B02_inspector_isolation.png`, `B12_compare_0..2.png`, both PNG exports, `results.json`.

### Not tested / open
Safari/WebKit and iPad + Apple Pencil (no WebKit engine and no device in this run; Pencil pressure/tilt only proven through Chromium's pen pipeline), real hand-drawn strokes by Georg, human visual acceptance, `.brushset` import, grain movement/rolling, wet mix, Procreate pressure curves of newer archives, memory on very large sessions (checkpoints hold up to 6 × 6.4 MB).
