# Georg Brush Playground · prototype (R1.5)

Local browser paint editor that reads a real Procreate `.brush` file on the user's device and draws with a **simulation** of it. Not Procreate's renderer, not a public product.

## Open it

Double-click `index.html` (works from `file://`, no server, no network). Then **Import .brush…** and pick a private brush file. The file is read inside the tab and never uploaded; nothing is stored after the tab closes.

## What it does

- Imports a single `.brush` (ZIP): `Brush.archive` (binary plist, NSKeyedArchiver) is decoded in the browser, `Shape.png` becomes the stamp (luminance → alpha), `Grain.png` is used when present, `QuickLook/Thumbnail.png` (Procreate's own preview stroke) is the comparison reference. `Reset/`, author pictures and signatures are ignored.
- Source isolation panel: the original shape as stored, the derived stamp, the grain status (a missing Procreate built-in grain is replaced by a **labelled substitute**), the decoded fields with their mapping status (HEURISTIC / IGNORED / MISSING).
- Drawing: Pointer Events with coalesced samples; pen pressure and tilt from the hardware, a labelled simulated pressure for mouse/touch; speed from timestamps in screen px; seeded rotation, scatter, jitter, spacing, taper, glaze flow; per-stroke grain.
- Color, size, opacity, eraser, editable dynamics (prefilled from the archive, reset button).
- Undo/redo/clear with exact deterministic replay; every stroke keeps its own brush and parameters; checkpoints every 10 actions.
- Export transparent PNG or PNG on paper at canvas resolution (1600×1000).
- Compare: recovers path and pressure from the Procreate preview silhouette, replays it with the decoded parameters (no fitting) and reports overlap, width, opacity and texture metrics.

## Files

| File | Role |
|---|---|
| `index.html` | editor UI, canvas renderer, inspector, comparison |
| `brush-core.js` | DOM-free core: bplist reader, safe ZIP inspection, field mapping, seeded stamp generator (shared with tests) |
| `vendor/fflate-0.8.3.umd.js` | ZIP inflate, MIT (`vendor/FFLATE_LICENSE.txt`), copied unchanged from npm `fflate@0.8.3`, sha256 `462ef804…7b83` |
| `tests/unit.mjs` | Node core tests (synthetic fixtures generated at runtime; optional private brushes via `BRUSH_DIR`) |
| `tests/browser.mjs` | Chromium functional tests with real pointer input (pen pressure/tilt via CDP) |

## Tests

```bash
BRUSH_DIR=~/Downloads node tests/unit.mjs
```

```bash
PLAYWRIGHT=~/kfb-ws1/kfb-planet/node_modules/playwright BRUSH_DIR=~/Downloads EVIDENCE_PRIVATE=~/kfb-ws1/brush-evidence-private/run node tests/browser.mjs
```

The browser suite needs the three private brushes (`The_CRAYONIC (1).brush`, `The_PASTEL.brush`, `The_ACRYLOID_dry_2.0.brush`) in `BRUSH_DIR`. Screenshots that show the isolated shape or the Procreate preview go to `EVIDENCE_PRIVATE` only. `../evidence/` receives only drawn output, masked UI shots and metrics.

## Protection

Never commit `.brush`/`.brushset` files, extracted `Shape.png`/`Grain.png`/thumbnails or derived stamp data. The editor has no upload, telemetry, account or storage.
