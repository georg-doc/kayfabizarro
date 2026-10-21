# Georg Brush Playground

Local browser paint editor that reads real Procreate `.brush` and `.brushset` files on the user's device and draws with a **simulation** of them. Not Procreate's renderer, not a public product. Owner: KFB ToolBox (planning docs stay in `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/KFB_BRUSH_PLAYGROUND_R1/`).

## Open it

Double-click `index.html` (works from `file://`, no server, no network). Then **Import .brush / .brushset…**. Files are read inside the tab and never uploaded; nothing is stored after the tab closes unless you save a drawing.

Private brushes can live in `brushes/` next to this file. That folder and `evidence-private/` are git-ignored and never pushed.

## Interface (R1.7)

Procreate's layout is the blueprint, KFB's palette the skin (ink-black chrome, paper-cream text, FrizzleBob yellow for the active state); icons and wording are our own.

- **Canvas first**, paper in KFB cream (dark paper in Actions › Canvas).
- **Top left: Actions** with Add (import brush/set, palette, drawing), Canvas (dark paper, clear), Share (PNG transparent / on paper, drawing .json, palette .swatches), Prefs (right-hand interface, simulated pressure), Help (status labels, shortcuts).
- **Top right: Paint, Erase, Colour.** Tapping the active paint or erase tool again opens the **Brush Library** (sets on the left, brushes with live stroke previews on the right, search). Tapping the selected brush again opens the **Brush Studio**.
- **Left sidebar:** size (logarithmic, 2–400 px) and opacity sliders, eyedropper between them (or Alt-click), undo and redo.
- **Brush Studio:** Procreate's sections (Stroke path, Stabilization, Taper, Shape, Grain, Rendering, Wet mix, Color dynamics, Dynamics, Apple Pencil, Properties, About this brush). Every control shows the decoded archive field and a label: *heuristic* (simulated by us), *edited*, *not simulated* (decoded, shown only) or *missing*. Drawing pad with pressure swell, light pressure, fast stroke and dark-pad previews; reset to decoded values.
- **Colour:** Disc (hue ring + saturation/brightness square), Value (HSB sliders, hex, system picker), Palettes (KFB Washes and KFB Inks & Papers as defaults, new palette, add colour, Procreate .swatches import/export), recent colours.
- Shortcuts: B, E, I, [ ], ⌘Z, ⇧⌘Z, Esc.

- **Layers (R1.8):** top-bar button (L). Procreate's panel as blueprint: top layer first, thumbnail, name, blend letter and visibility per row; tapping the letter opens name, opacity (live preview, one undo step), blend mode (16 modes, computed against what lies below including the paper), alpha lock, up/down, duplicate, merge down, clear, delete. Background colour row at the bottom (hide for transparency, swatch takes the current colour). Up to 16 layers. Every layer action is undoable; checkpoints share unchanged layers (copy-on-write). Eyedropper samples the composite as seen. PNG transparent = visible layers; PNG on paper adds the background colour. Drawings are saved as `session/2`; `session/1` files from R1.6/R1.7 load into Layer 1.

- **Clipping masks (R1.9):** in the layer options (not for the bottom layer). A clipped layer shows only where the nearest non-clipped layer below (its base) has paint; its own content outside stays intact. The group takes the base's coverage, opacity and blend mode and hides with the base. Normal is exact (`source-atop`); other blend modes are masked by the base and the group alpha is reset to the base alpha, so grainy bases do not fill up. Merge down of a clipped layer applies it into the base with the same maths. Clipped rows are indented with an arrow to the base.

Not in the playground yet: selection, transform, adjustments, smudge, layer groups, reference layer.

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
| `index.html` | markup and styles of the Procreate-style interface |
| `engine.js` | rendering, import, history, export, sessions, Procreate-preview comparison, stroke previews (events to the UI) |
| `ui.js` | interface: tools, sliders, popovers, Brush Library, Brush Studio, colour, palettes, shortcuts, test hooks |
| `brush-core.js` | DOM-free core: bplist and XML plist readers, safe `.brush`/`.brushset` inspection, field mapping, pressure curves, seeded stamp generator, colour conversion, `.swatches` read/write (shared with tests) |
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
