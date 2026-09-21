# KFB StoryMap v1 (SMA1) — additive changelog

History is additive. Earlier entries are not rewritten. A later entry that corrects or
replaces one marks it `SUPERSEDES` and keeps both. Full narrative detail lives in
`docs/SMA1-GATE.md`; this file is the append-only timeline.

## 2026-09-20 (reconstructed from docs/SMA1-GATE.md)

### IMPLEMENTATION
SMA1 base fork from `tools/kfb-cartoon-map-board/src/app.js` @ `dadf2fa3`: Europe board,
country pieces with centroid pivots, flat/table/flyover/pop-up cameras, RAISE/STAND_UP/
SLIDE/ROTATE/FLIP/PULSE/SNAP/EXPLODE actions, radial ripple (adapted from the Travel
carpet-waver donor), img2threejs landmark lane (Eiffel/Giza/Stonehenge/Pentagon/
Spasskaya/Kremlin-wall).

## 2026-09-21 (reconstructed from docs/SMA1-GATE.md)

### IMPLEMENTATION
KFB ink-canon outline (bow 0.196, three presets Ink/Bend/Torn) replacing the donor's
zig-zag polyline edge. Neighborhood-measured DSATUR + Oklab graph coloring against a
curated "Spielbrett · Druckfarben" tone set (7 primary tones × 3 brightness levels,
sea/seabed included in the palette). Voxel view (D6 height step, chamfer distance-to-
coast terracing). KayKit board-game-bit figures (one per country, registry-verified
names). First water pass: `kfb-fluid-v1/kfb-fluid-shader.js`, copied from the attached
"KFB ToolBox Bench" local folder, driven by a map-derived wet-cell mask.

### TESTED RESULT
67 boundaries measured on the full 40-country map, 0 tone duplicates, ΔE min 19.6.
Three boot-race deadlocks (coloring, selection, retry button) fixed by moving all three
onto an independent 500ms idempotent sweep instead of a one-shot post-boot step.

### UNRESOLVED
Documented at the time: the water fill color (`#6fadbc`) sat close enough to the board's
sea-bed plate color that the layer read as nearly invisible at alpha 0.78 — worked around
by darkening the seabed to `#1d5b60`, not by changing the water shader.

## 2026-09-22

### DECISION
Georg identified `kfb-fluid-v1/kfb-fluid-shader.js` as itself a diminished form of the
Card Zone Lab v2 fluid shader, not the source — and handed over a freshly source-locked
donor module verified 10/10 against the real running donor blob
`43eea82f8727d3581e50374d6263e48a28241d3b` (GLSL, texture contract, material flags,
`uTime` semantics). Directive: replace the Bench-derived shader with this donor, keep
map-owned lake/river geometry separate from the shader as before.

### IMPLEMENTATION
`kfb-fluid-v2/card-zone-v2-fluid-source.js` added verbatim. `sma1-map-animator.js`
rewired: `buildWater()`/`setFluid()`/`fluidKeys()` now call the new donor's
`createCardZoneV2FluidMaterial` / `loadTextures()` / `setCardZoneV2ConstantFlow`; a new
map-owned `buildSeaGeometry()` replaces the old shader module's bundled geometry builder.
`kfb-fluid-v1/` deleted. Docs (`docs/SMA1-GATE.md`, `github.md`, DC "Quellen" panel)
updated to point at the new donor.

### TESTED RESULT
Mesh/material/uniform/texture parity against the donor confirmed programmatically
(7 950 wet cells, 31 800 verts, correct material flags, textures loaded). A live WebGL
`drawElements` call for the water mesh's exact index count was captured directly,
confirming the mesh reaches the GPU. One real bug found and fixed in this pass: the
Details-panel diagnostic (`waterInfo()`) referenced a `uAlpha` uniform that only exists
on the retired Bench shader and threw on every call.

### UNRESOLVED — reported by Georg as a regression, not resolved this session
Water shows no visible shader effect in live use (reported twice). Root-cause work this
session could rule IN "the integration is wired correctly" but could NOT rule in or out
"the rendered result looks right," because the automated preview tooling used to check it
freezes the render loop almost completely once the tab isn't foregrounded (measured: 1
GPU frame across a 6–14 second window). One solid structural lead: the new donor
permanently zeroes its foam highlight term (`u=0.5` fixed, by original design) where the
old Bench shader always contributed a faint sparkle — a real, spec-compliant, but
visually calmer change. Full account in `POSTMORTEM-2026-09-22.md`; next steps in
`SPRINTPLAN.md` item 1–2.

### OWNER BOUNDARY
This export is a handover/measurement artifact, not itself a merged implementation SSOT.
`kfb-fluid-v2/card-zone-v2-fluid-source.js` remains source-locked — do not edit it
in-place; if the visual result needs to change, that is a decision for Georg / the donor
owner, applied as a documented project-side deviation, per `SPRINTPLAN.md` item 2.
