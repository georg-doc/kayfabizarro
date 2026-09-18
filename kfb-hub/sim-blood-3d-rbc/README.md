# RBC MVP Viewer · v0.2 candidate

Minimal browser proof for the 3D Morphology Lab RBC slice. No backend, no build step,
no bundler. Open `index.html` over any static host (or `file://` where module imports
are permitted) — three.js 0.184.0 is loaded from a pinned, integrity-checked import map.

## Files

- `index.html` — viewer UI (DocCheck tokens, `#c03` as accent only, `#9c3` for the primary action)
- `rbc-geometry.js` — deterministic geometry, presets and manifest builder (math SSOT for the browser lane)

## Controls

- morphology: Normal / Sphärozyt / Echinozyt
- visual mode: **A · 3D Explorer** (studio, plastic, optional semi-transparent) and
  **B · Mikroskop-Projektion** (orthographic top view, stain from local cell thickness)
- orbit drag, wheel/pinch zoom
- parameter panel: live sliders for the full parameter contract
- `Manifest kopieren` — copies the schema-compliant asset entry for the current state
- `GLB exportieren` — binary glTF of the current mesh (~550 kB at the shipped tessellation)

## Deep links

Reproducible review links:

```text
index.html?m=normal&v=explorer
index.html?m=spherocyte&v=explorer
index.html?m=echinocyte&v=microscope
index.html?m=normal&v=explorer&transparent=1
```

## Determinism

Geometry is a pure function of `preset + parameters + seed`. The seed feeds a mulberry32
PRNG used for the rim harmonics, the surface-variation phases and (only for
`spiculeDistribution: surface-jittered`) the spicule jitter. There is no unseeded randomness,
so the same record always rebuilds the same mesh.

## Self-test hooks

`window.__rbc` exposes `setPreset`, `setMode`, `setTransparent`, `manifest()`, `triCount()`,
`fps()`, `bench(n)` and `exportGLBBase64()` for evidence capture and performance checks.

## v0.2 additions (2026-09-18)

- **Physical controls (Q1)**: the sliders are now `membraneArea`, `reducedVolume ν` and
  `areaDifference Δa₀` plus the three surface-variation parameters. Diameter, thickness,
  central depression and all spicule values are derived and shown read-only under
  "Abgeleitete Form".
- **LOD switch (Q3)**: Authoring 23.3k · Runtime 5.8k · Embed 2.9k triangles.
- **Transition prototype (Q6)**: scrub slider plus 6 s playback, Normal → Echinozyt or
  Normal → Sphärozyt; playback runs on the Runtime LOD.
- **`Alle 6 GLB exportieren`**: exports every preset × LOD combination in one go. Commit the
  files under `runtime/glb/` to make the static embed path work.
- **`selfcheck.html`**: 33 geometry/render/GLB assertions with a JSON report — run it after
  every change to the generator.
- **`../rbc-embed/index.html`**: minimal `<model-viewer>` article block; uses the committed
  static GLB when present, otherwise generates it in-page and labels the source.

## Status

R&D proof. Morphology review state `RND_ONLY` for all three states — no medical freigabe. Active-lab candidate normalized to Reference Wave 3 taxonomy (`RBC-SPH`, not the returned `RBC-SPHERO`).
See `../../evidence/RBC_MVP_REVIEW_v0.1.md`.
