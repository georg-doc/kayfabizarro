# Georg Brush Playground

Local browser paint editor that reads real Procreate `.brush` and `.brushset` files on the user's device and draws with a **simulation** of them. Not Procreate's renderer, not a public product. Owner: KFB ToolBox (planning docs stay in `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/KFB_BRUSH_PLAYGROUND_R1/`).

## Open it

Double-click `index.html` (works from `file://`, no server, no network). Then **Import .brush / .brushset…**. Files are read inside the tab and never uploaded; nothing is stored after the tab closes unless you save a drawing.

Private brushes can live in `brushes/` next to this file. That folder and `evidence-private/` are git-ignored and never pushed.

## What it does

- **Import**: single `.brush` or whole `.brushset` (set name and order from `brushset.plist`, XML or binary; one folder per brush; `Reset/` copies, author pictures and signatures skipped unread; a broken brush is skipped with its reason). The same brush imported twice (as file and inside a set) is one entry: identity = SHA-256 of `Brush.archive` + `Shape.png`.
- **Decoding**: `Brush.archive` (binary plist, NSKeyedArchiver) in the browser: 52-field 2016 archives and 169–175-field Procreate 5 archives, including pressure curves for size and opacity.
- **Source isolation**: original shape as stored, derived stamp (luminance → alpha), grain status: file grain, labelled **substitute** for a missing Procreate built-in grain, none for Procreate's blank grain, or **your own grain image** (Replace grain…).
- **Drawing**: Pointer Events with coalesced samples; pen pressure and tilt from hardware, labelled simulated pressure for mouse/touch; speed in screen px/ms; seeded rotation, scatter, jitter, spacing, taper, glaze flow, uniform glaze; per-stroke grain.
- Color, size, opacity, eraser, editable dynamics (prefilled from the archive, reset button), grouped and filterable brush library.
- **History**: undo/redo/clear with exact deterministic replay; each stroke keeps its own brush, parameters, seed and grain version; checkpoints every 10 actions.
- **Export**: transparent PNG or PNG on paper (1600×1000). **Save drawing (.json)** stores strokes and settings only (no brush data); **Load drawing…** replays it once the same brushes are imported and names any missing brush.
- **Compare**: recovers path and pressure from the brush file's Procreate preview (`QuickLook/Thumbnail.png`), replays it with the decoded parameters (no fitting) and reports overlap, width, opacity and texture metrics.

## Files

| File | Role |
|---|---|
| `index.html` | editor UI, canvas renderer, inspector, comparison, sessions |
| `brush-core.js` | DOM-free core: bplist and XML plist readers, safe `.brush`/`.brushset` inspection, field mapping, pressure curves, seeded stamp generator (shared with tests) |
| `vendor/fflate-0.8.3.umd.js` | ZIP inflate, MIT (`vendor/FFLATE_LICENSE.txt`), unchanged npm copy, sha256 `462ef804…7b83` |
| `tests/unit.mjs` | Node core tests (synthetic fixtures at runtime; private brushes from `brushes/` if present) |
| `tests/browser.mjs` | Chromium functional tests with real pointer input (pen pressure/tilt via CDP) |
| `evidence/` | public-safe evidence: drawn output, masked UI shots, metrics JSON |

## Tests

```bash
node tests/unit.mjs
```

```bash
node tests/browser.mjs
```

Defaults: brushes from `./brushes` (falls back to the old `Demo Brushes` folder in the HUB reply, then `~/Downloads`), Playwright from `~/kfb-ws1/kfb-planet/node_modules`, private evidence to `./evidence-private/run`. Override with `BRUSH_DIR`, `PLAYWRIGHT`, `EVIDENCE_PRIVATE`. The browser suite needs `The_CRAYONIC (1).brush`, `The_PASTEL.brush`, `The_ACRYLOID_dry_2.0.brush`, `GvW Inktober MEGA MARKER WET P5.brush` and `GvW_Comic_Ink_Brushes_02.brushset`.

## Protection

Never commit `.brush`/`.brushset` files, extracted shapes/grains/thumbnails, derived stamp data or private screenshots. The editor has no upload, telemetry, account or storage.
