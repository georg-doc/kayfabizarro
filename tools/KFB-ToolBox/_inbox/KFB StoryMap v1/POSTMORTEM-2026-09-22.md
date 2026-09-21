# Post-mortem · Fluid shader source-lock swap · 2026-09-22

## Auftrag

Replace the ToolBox-Bench-derived water shader (`kfb-fluid-v1/kfb-fluid-shader.js`) —
identified by Georg as itself a diminished form, not the source — with a new
source-locked donor (`card-zone-v2-fluid-source.js`) verified 10/10 against the real
running `KFB Card Zone Lab v2.dc.html` donor blob `43eea82f8727d3581e50374d6263e48a28241d3b`.

## Was gebaut wurde

1. `kfb-fluid-v2/card-zone-v2-fluid-source.js` copied verbatim from the handed-over
   GitHub path (branch `chatgpt-web/card-zone-v3-h0-parity-2026-09-21`) — no edits to the
   GLSL, uniforms, texture contract, or material flags.
2. `sma1-map-animator.js` rewired: `buildWater()` now calls
   `createCardZoneV2FluidMaterial` + `loadTextures()` + a new map-owned
   `buildSeaGeometry()` (plain quad mesh from the wet-cell mask) + the donor's
   `setCardZoneV2ConstantFlow` to write `aFlow=[0,0]` for still water. `setFluid()` and
   `fluidKeys()` updated to the new export names (`CARD_ZONE_V2_FLUIDS`).
3. `kfb-fluid-v1/` deleted (three files: shader, README, CONTRACTS).
4. `docs/SMA1-GATE.md`, `github.md`, and the DC's "Quellen" panel label updated to point
   at the new donor.

## Was verifiziert wurde (programmatisch, wiederholt bestätigt)

- `waterInfo()` diagnostic: mesh built, `visible:true`, `inRoot:true`, 7 950 wet cells,
  31 800 vertices / 47 700 indices, correct `y` (2.65, above `BOARD_TOP` 2.35).
- Material: `ShaderMaterial`, `transparent:true`, `depthWrite:false`,
  `polygonOffsetFactor/-Units -2/-4` — matches the donor's material contract exactly.
- Textures: `uHasMap:1` — `waterdudv.jpg` and `water.jpg` both loaded successfully from
  the raw GitHub URLs, correct color spaces per the donor's loader.
- A WebGL `drawElements` call with the water mesh's exact index count (47 700) was
  captured live via a `drawElements` prototype hook — the mesh genuinely reaches the GPU,
  more than once, across independent test runs.
- No shader compile errors, no console errors, no uncaught exceptions during build.

**Conclusion of this layer: the swap is wired correctly and matches the source.**

## Ein echter Bug, gefunden und behoben

`waterInfo()` (the Details-panel / debug readout) still read `m.material.uniforms.uAlpha.value`
— a uniform that only exists on the old Bench shader, not on the new donor material. Every
call threw `TypeError: Cannot read properties of undefined`. Fixed by reading `uHasMap`
instead. This did not affect rendering, only the diagnostic call.

## Was NICHT verifiziert werden konnte — der eigentliche offene Punkt

Georg reported twice, from his own live tab, that turning "Wasser" on shows no visible
shader effect — a flat, uniform dark teal, indistinguishable from the seabed plate under
it. This session could not confirm or deny that report with certainty, for a documented
and reproducible reason:

- `document.hidden` was `true` throughout every check this session ran, including via
  `eval_js_user_view` against Georg's own opened tab. The render loop
  (`startLoop()` in `sma1-map-animator.js`) runs on a dual `requestAnimationFrame` +
  `setInterval(16)` driver specifically because rAF is known to stall in this tool's
  preview (see `docs/SMA1-GATE.md`, "Tooling note carried from VL1"). Under a hidden/
  backgrounded tab, browsers throttle BOTH drivers — measured directly: a
  `drawElements` hook captured exactly **one** draw call across a 6–14 second window,
  repeatedly. The canvas was, for all practical purposes, frozen.
- Toggling water on/off and sampling canvas pixels produced byte-identical results in
  every attempt — consistent with "the loop isn't ticking," not conclusive proof the
  shader itself renders wrong when it IS ticking.
- One structural finding that IS solid, independent of the throttling problem: the new
  donor's fragment shader fixes `float u = 0.5`, which forces `shore = 1.0` and therefore
  `foam = 0.0` **unconditionally** — this is intentional per the brief ("keep the source
  foam block constructively OFF"). The OLD Bench shader had no such shore gating and
  always contributed a faint sparkling foam highlight
  (`col += vec3(0.7,0.72,0.7) * foam * 0.5` with foam only gated by wave noise, never by
  `u`). **So even where both shaders are otherwise equivalent, the new one is
  structurally calmer / less visually "alive" than what Georg was looking at before.**
  Combined with a dark `uCol` (palette sea color `#6fadbc`, itself darkened further by
  ACES Filmic tone mapping and the scene's fog), the remaining base-noise modulation may
  read as flat at this camera zoom even when genuinely animating.

**Net verdict: the code is source-correct; whether it LOOKS right is unresolved.** This
export ships with that gap named, not papered over.

## Lehre

Automated preview tooling in this environment cannot be trusted to verify animated /
time-based rendering — it silently freezes the render loop when the tab isn't
foregrounded, and every pixel-comparison test this session ran was contaminated by that
before being caught. Any future claim about a shader "looking right" or "looking wrong"
needs a human eyeball on a real, focused, running tab — not a headless pixel diff.
