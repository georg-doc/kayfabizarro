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
