# KFB Brush Playground R1 · changelog (additive, newest first)

## 2026-10-22 · R1.9 · Clipping masks (Claude Code)
- Clipping masks after Procreate: switch in layer options, clipped rows indented with an arrow to the base.
- Group compositing shared by view, live strokes, export and tests: base coverage, opacity, blend and visibility carry the group; Normal exact via source-atop, other modes reset to the base alpha; merge down into the base with the same maths.
- Unit 41/0, Chromium 41/0 (4 new clipping tests).

## 2026-10-22 · R1.8 · Layers (Claude Code)
- Up to 16 layers plus background colour; Procreate-style Layers panel with opacity, 16 blend modes, alpha lock, up/down, duplicate, merge down, clear, delete.
- Action-based document with copy-on-write checkpoints: every layer action undoable, replays exact; blend modes against the paper; eyedropper samples the composite.
- Sessions `session/2` (old `session/1` files load into Layer 1); PNG transparent = visible layers.
- Unit 41/0, Chromium 37/0 (6 new layer tests).

## 2026-10-21 · R1.7 · Procreate-style interface, KFB skin, palettes (Claude Code)
- Brushes moved to the git-ignored `tools/brush-playground/brushes/` (Georg's go).
- New interface after Procreate's layout: Actions, Paint/Erase/Colour, size/opacity sidebar with eyedropper, Brush Library with stroke previews, Brush Studio (12 Procreate sections, status per control, drawing pad), colour Disc/Value/Palettes, `.swatches` import/export, shortcuts; KFB design-system colours, own icons.
- Code split into `engine.js`, `ui.js`, `index.html`; core adds colour conversion and `.swatches` read/write.
- Unit 41/0, Chromium 31/0 (7 new UI tests).

## 2026-10-21 · R1.6 · .brushset, Procreate 5 curves, grain replace, sessions (Claude Code)
- Editor moved to `tools/brush-playground/` on Georg's request (“nicht so tief”); planning docs stay in this folder.
- `.brushset` import with set name/order, Reset/ skipped, content-hash identity (no duplicates), grouped and filterable library.
- Procreate 5 pressure curves (size, opacity), `grainDepth`, `renderingMaxTransfer`; grain defaults calibrated against 24 Procreate previews; blank grain = no texture.
- Replace grain… (own grain image, versioned per stroke); Save/Load drawing as JSON without brush data.
- Unit 37/0, Chromium 24/0; real Comic Ink #2 set 21/21, median IoU 0.864. Private brushes and the Dropbox share link not committed.

## 2026-10-21 · R1.5 · local CRAYONIC editor tested (Claude Code)
- Editor rebuilt on the R1.4 candidate: in-browser `Brush.archive` decode, luminance → alpha stamp (CRAYONIC shape has no alpha channel), per-stroke brush/params/seed, uniform-glaze interpretation of glaze type 1, labelled substitute grain for missing Procreate built-in grains, eraser, undo checkpoints, PNG exports, comparison with each file's Procreate preview stroke.
- New DOM-free `brush-core.js`, vendored fflate 0.8.3 (MIT), Node unit suite (28/0) and Chromium suite with pen pressure/tilt via CDP (17/0).
- Fidelity documented, not claimed: CRAYONIC close in silhouette and tone, flatter texture; PASTEL too light; ACRYLOID not simulated.
- No public brush assets, no PR, merge, Site or deployment. Next gate: Georg's local CRAYONIC look check.

## 2026-10-21 · R1.0–R1.4 (earlier chats, summarised from RETURN.md)
- R1.0 product/Remotion plan; R1.1 `.brushset` + MegaPack source audit; R1.2 Notion catalog audit; R1.3 archive dynamics audit; R1.4 first unverified editor source candidate.
