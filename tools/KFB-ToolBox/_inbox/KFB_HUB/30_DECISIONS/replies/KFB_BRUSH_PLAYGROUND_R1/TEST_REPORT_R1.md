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

## R1.6 · 2026-10-21 · .brushset import, Procreate 5 archives, grain replace, drawing sessions
Status: **local editor, all automated checks PASS · fidelity = SIMULATION · Georg feedback on R1.5: “funktioniert schon sehr gut, auch die Speed-Sensitivität ist gut”, Striche und Export im Repo okay.**
**Moved:** editor, tests and public evidence now live in `tools/brush-playground/` (git mv, history kept). Private brushes and private evidence belong in the git-ignored `tools/brush-playground/brushes/` and `evidence-private/`.

### New behaviour
- `.brushset` import (`inspectArchive`): XML or binary `brushset.plist` (set name, order), one folder per brush, `Reset/`, author and signature pictures skipped unread, broken brushes skipped with reason, set limits 200 MB / 4000 entries / 400 MB inflated / 300 brushes, path traversal and control characters rejected. A set with no usable brush is reported as an error.
- Brush identity = SHA-256 of `Brush.archive` + `Shape.png`: re-importing a set or a brush that is also in a set adds nothing.
- Procreate 5 fields: `dynamicsPressureSizeCurve` / `dynamicsPressureOpacityCurve` (`{x, y}` point strings, unordered) → monotone cubic curve (interpolation is ours); `dynamicsGlazedFlow`; `renderingMaxTransfer = true` read as uniform glaze (interpretation); `grainDepth`.
- Grain defaults (HEURISTIC, calibrated against 24 Procreate previews): old archives 0.85; newer archives `grainDepth`, × 0.3 for the substitute tile. Reason: the 19 set brushes with Procreate paper grains came out 0.11 too light with the strong substitute and 0.02 with the light one; the two “no texture” variants matched without grain. Procreate's blank grain → no texture, no substitute.
- Replace grain…: loads your own image (e.g. the real Procreate grain) as a new grain version; strokes keep the grain version they were drawn with.
- Save/Load drawing: `kfb.brush-playground.session/1` JSON with strokes, settings and brush references only (no image data); loading names missing brushes.
- Library grouped by set with count and a filter field; long names wrap.

### Checks actually run (2026-10-21, Chromium 156.0.8078.4 headless, Playwright 1.64.0)
- `node tests/unit.mjs`: **37 passed, 0 failed** (adds XML plist, synthetic set order/Reset/parts, broken brush skipped, traversal in set, plist missing, curve parse/identity, monotone cubic, curve thins light pressure, real set 21/21 with name and order).
- `node tests/browser.mjs`: **24 passed, 0 failed**. B01–B17 as in R1.5 (B13 now: broken set → error with reason), plus:

| # | Check | Result |
|---|---|---|
| B18 | real `GvW_Comic_Ink_Brushes_02.brushset`: 21 brushes, set name equals Node read, plist order (first = DUPA SKETCHPAINT color tilt P5), ≥ 169 fields each, group header, filter “kolinsky” → 6 | PASS · grains: 18 substitute, 1 file, 2 none |
| B19 | same set again | PASS · 0 added, 21 already imported |
| B20 | MEGA MARKER WET P5: 175 fields, size curve decoded | PASS |
| B21 | replace grain, draw, full undo/redo rebuild | PASS · old stroke region unchanged, new stroke on grain version 1 |
| B22 | save drawing, fresh tab: load without brushes names CRAYONIC, import brushes + same grain, load → identical pixel hash | PASS · 10 actions, 60 KB, no image data |
| B23 | comparison over all 21 set brushes (gate: median IoU ≥ 0.8) | PASS · median IoU 0.864, min 0.426, median abs α error 0.032 |
| B24 | drawing with INKUS MAXIMUS, KOLINSKY 2.1, DUPA Marker, PEYO 2.0 (pen, pressure ramps) | PASS |
| B14 | performance with 67 strokes | frame mean 1.84 ms / max 2.4 ms, commit ≤ 10 ms, undo rebuild 52 ms |

### Set comparison (Procreate preview vs simulation, decoded values, no fitting)
Good (IoU ≥ 0.9): DUPA SKETCHPAINT 0.964, KOLINSKY 2.1/2.5 0.961, GREG 0.951, DUPA Marker 0.937, STERRETT 0.933, KOLINSKY paint 0.930. Mid (0.85–0.9): KOLINSKY old, PEYO, KUNKEL, INKUS MAXIMUS, DUPA 2.1 (+ no texture, streamliner). Weak: THOMPSON 0.705, BARKS 0.716, DRUCKER 2.0 0.618, KOLINSKY chisel dry 0.596, DRUCKER 2.1 no texture 0.591, DRUCKER 2.1 0.556, KOLINSKY rough 0.426 (width error 137 %).
Open fidelity seams: DRUCKER 2.1 file grain far too strong (α 0.23 vs 0.91; `textureScale 4`, `textureZoom 0` semantics unknown; inverting the grain helps DRUCKER but breaks ACRYLOID, so polarity was left unchanged); KOLINSKY rough and chisel dry silhouettes (rolling grain / shape count fields not simulated); colour dynamics, wet mix, bleed, shape roundness, shape count and burnt edges of Procreate 5 not simulated.

### Evidence
- Public (`tools/brush-playground/evidence/`): `canvas_drawing.png` (now incl. the four set-brush strokes), `export_transparent.png`, `editor_ui_inspector_masked.png`, `editor_ipad_portrait_masked.png`, `browser-results.json` (all 24 results and the 21-row set comparison).
- Private, not in Git: `tools/brush-playground/evidence-private/r16-run4/` (full editor with isolation, library with the set, comparisons, exports, drawing JSON).

### Not tested / open
Safari/WebKit, iPad + Apple Pencil hardware, Georg's own strokes with set brushes, real Procreate grains (Replace grain… is ready for them), the remaining Procreate 5 dynamics above. Catalog/Notion/Dropbox reconciliation and Comic (Re)Motion remain deferred; the session JSON is the first stroke-recording format they could build on.

## R1.7 · 2026-10-21 · Procreate-style interface as blueprint, KFB skin, palettes
Georg's request: build the UI as close to Procreate as possible, as a blueprint rather than a 1:1 copy, with settings following Procreate's menus and palettes.

### What was built
- Code split: `engine.js` (the tested renderer, import, history, export, sessions, comparison; DOM access only to `#paper`, events to the UI), `ui.js` (interface), `index.html` (markup + styles). Core gains colour conversion and Procreate `.swatches` read/write.
- Layout after Procreate: full canvas; Actions (Add / Canvas / Share / Prefs / Help) top left; Paint / Erase / Colour top right; size and opacity sliders with eyedropper, undo and redo on the left (right-hand option). Skin: KAYFABIZARRO tokens (ink-black `#1f1a14` chrome, paper-cream `#f3ead3`, rabbit yellow `#e9c14a` active), own icons and wording, no Procreate assets.
- Brush Library: sets column, brushes with live stroke previews rendered by our engine, search; second tap on the selected brush opens Brush Studio (Procreate habit).
- Brush Studio: Procreate's 12 sections. 23 controls drive the simulation (labelled heuristic / edited), the other decoded fields are listed per section as not simulated; Shape and Grain show source isolation (as before); Apple Pencil shows the decoded pressure curves; About holds metadata, the Procreate-preview comparison and the decoded-field table; drawing pad with four preview modes; reset.
- Colour: Disc, Value (HSB, hex, system picker), Palettes (KFB Washes, KFB Inks & Papers defaults; new palette, add colour, set default, remove; `.swatches` import/export), recent colours, previous/current swatch. Palettes, recent colours and the right-hand preference are stored in this browser only (localStorage).
- `.swatches` format: ZIP with `Swatches.json` `[{name, swatches:[{hue, saturation, brightness, alpha…}|null]}]`, read leniently. **Not yet checked against a palette exported by Georg's Procreate** (none on the Mac).

### Checks actually run (2026-10-21, Chromium 156.0.8078.4 headless, Playwright 1.64.0)
- `node tests/unit.mjs`: **41 passed, 0 failed** (adds hex↔HSV round trip for KFB washes, `.swatches` build→parse round trip with empty slots, lenient read, missing Swatches.json rejected).
- `node tests/browser.mjs`: **31 passed, 0 failed**. B01–B24 ported to the new UI (commands now reached through the Actions popover, isolation checked inside Brush Studio › Shape). B05 now uses a longer fast stroke and measures its second half, because 8 mouse events were too few for the speed smoothing on the larger canvas (alpha 0.425 → 0.332). New:

| # | Check | Result |
|---|---|---|
| B25 | eyedropper on the red stroke, tool returns to brush | PASS · #c33728 |
| B26 | size slider drag: half height ≈ 28 px (logarithmic), top 386 px; ArrowDown; opacity half 0.53 | PASS |
| B27 | Brush Studio: spacing 0.4 → section and chip marked edited, pad redraws, next stroke carries spacing 0.4, Reset restores 0.071 and disables itself | PASS |
| B28 | tap active brush tool → Library; all previews rendered; select; second tap → Brush Studio | PASS |
| B29 | disc square centre → S/B 0.5; ring top → hue 0; H120 S100 B100 → #00ff00 | PASS |
| B30 | KFB Washes swatch → #e9c14a; import of a generated `.swatches` (5 slots incl. empty); export via Actions › Share round-trips identically | PASS |
| B31 | B toggles Library, Esc closes, E and I switch tools | PASS |
| B14 | performance (68 strokes) | frame mean 2.7 ms / max 5.3 ms, commit ≤ 16.5 ms, undo rebuild 145 ms |

### Evidence
Public (`tools/brush-playground/evidence/`): `editor_ui_canvas.png`, `editor_ui_studio_masked.png`, `editor_ui_palettes.png`, `editor_ipad_portrait.png`, `editor_ipad_studio_masked.png`, `canvas_drawing.png`, `export_transparent.png`, `browser-results.json`. Masked = shape, derived stamp, grain and Procreate preview hidden; stroke previews and the pad are drawn output. Private: `tools/brush-playground/evidence-private/r17-run3/` (unmasked Studio, Library, colour, palettes, comparisons).

### Open
Real iPad + Apple Pencil and Safari; a real Procreate `.swatches` file; layers, selection, transform, adjustments, smudge; drawing directly on the Studio pad; the fidelity seams from R1.6.

## R1.8 · 2026-10-22 · Layers
Georg: “ja, mach mit Ebenen weiter”.

### What was built
- Document model in `engine.js`: up to 16 layers (id, name, visible, opacity, blend, alpha lock) plus a background colour layer. The document is a pure function of the action list (`stroke`, `clear`, `layer-add/delete/move/set/dup/merge`, `bg`), so undo, redo, sessions and replays stay exact. Checkpoints every 5 actions (max 12) share unchanged layer canvases; a frozen layer is copied on its next write.
- View = background + visible layers with their opacity and blend mode (16 canvas blend modes), so Multiply works against the paper like in Procreate. Live strokes render inside their layer's position in the stack. Strokes record their layer and the alpha-lock state (`source-atop`).
- Layers popover after Procreate's panel (top bar, key L): thumbnails, name, blend letter, visibility; options with name, opacity (live preview, one undo step on release), blend mode, alpha lock, up/down, duplicate, merge down, clear, delete; background colour row (hide → transparency checker; swatch takes the current colour). Actions › Canvas: “Clear layer”, dark paper = background colour ink black (undoable).
- Eyedropper samples the composite as seen. PNG transparent = visible layers, PNG on paper = plus background colour. Sessions now `kfb.brush-playground.session/2`; `session/1` files load into Layer 1.

### Checks actually run (2026-10-22, Chromium 156.0.8078.4 headless)
- `node tests/unit.mjs`: **41 passed, 0 failed** (unchanged core).
- `node tests/browser.mjs`: **37 passed, 0 failed**. Pixel helpers now read the layers without background (`KFB.flatCanvas()`), the eyedropper test compares with the view pixel (40 % red over paper → #e9c6b1). B22 also loads the same drawing rewritten as `session/1` → identical hash. New:

| # | Check | Result |
|---|---|---|
| B32 | new layer above and selected, stroke lands only on Layer 2, hide/show restores exact hash, thumbnails drawn, “2 / 16” | PASS |
| B33 | Multiply against what lies below: view pixel 59,105,129 → 56,96,107; label “M”; undo/redo | PASS |
| B34 | opacity slider drag: preview without history entry, one entry on release (0.29), undo → 1 | PASS |
| B35 | alpha lock: zig-zag over the edge → 0 px outside the existing paint, 11,848 red px inside | PASS |
| B36 | duplicate → move down → merge down → delete (2 → 3 → 3 → 2 → 1 layers), every undo and redo pixel-identical | PASS |
| B37 | background hidden → view α 0; swatch → violet in view and in PNG on paper; layers unchanged; undo → paper cream | PASS |
| B14 | performance with 2 layers, 70 strokes | frame mean 4.66 ms / max 9.9 ms, commit ≤ 26 ms, undo rebuild 63 ms (31.9 ms in the previous run) |

Bug found and fixed on the way: a `//` comment I put into a one-line test helper disabled the rest of the line (known trap, see memory); 7 tests failed until it was moved into `/* */`.

### Evidence
Public: `tools/brush-playground/evidence/editor_ui_layers.png` (+ the earlier UI shots, refreshed), `browser-results.json`. Private: `tools/brush-playground/evidence-private/r18-run5/` (B32 layers panel, comparisons, exports).

### Open
iPad/Pencil and Safari; layer groups, clipping masks, reference layer, drag-to-reorder, selection/transform; per-frame cost grows with the number of visible layers (measured only with 2).
