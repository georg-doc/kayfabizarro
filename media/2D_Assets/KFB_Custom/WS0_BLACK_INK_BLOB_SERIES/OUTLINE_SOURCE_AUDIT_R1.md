# Slop outline / alpha audit · read-only · 2026-11-06

## Verified source refs

- `georg-doc/KFB-Stunt-Car-Race/main`: `0e66e66e9ba279c32f697bd4c3c5a922757798a7`.
- `georg-doc/kayfabizarro/main`: `bf1a7ca132b3d10ab99e5de382df4964a0b007ae`.
- Race `fx/inkline2d-atlas-r1`: `38da5bc68eb37cf7372e591b12f9daa3e90a2881` (mechanism below).
- Race `fx/slop-r1`: `24f138b5ccf26c3d38b17e2a60c93d5a9b5e87ec` (earlier Slop consumer).
- Race `assets/slop-anim-pilot-r1`: `3746e3563ec326989c8da64e5b989a4d427bf163`.
- Race `assets/wsa-slop-technical-pass-r1`: `6837c1d041818986409770741c77b72680a258b3`.
- Race `assets/slop-goo-r1`: `bb6c3dff2578f20509b117d505b211c0984283df`.

Refs fetched through GitHub GET tools before inspecting their files. No repository writes, runtime changes, generated animation, or execution acceptance.

## Actual reusable distance-field outline

[src/modules/bildparallel.js at exact head](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/38da5bc68eb37cf7372e591b12f9daa3e90a2881/src/modules/bildparallel.js)

`INKLINE` selects `sdf` by default. `inkPatch()` expands the drawing plane by `rand=0.05` and computes an exterior ink contour before alpha testing. `kfbInkSdf()` samples the signed distance field and its gradient. `fwidth(vMapUv)` converts the field into screen pixels: this is screen-size adaptive, rather than simply a fixed camera-distance multiplier. Thickness responds to shadow-facing normal, real sun direction and slowly changing noise.

Parameters: `dicke=2`, `licht=2.2`, `unten=0.7`, `sonne=0.4`, `rauschen=0.65`, `frequenz=7`, `tempo=0.5`, dark color `[0.035,0.025,0.045]`; SDF `max=24`. Alternatives are alpha-neighbor `shader` and enlarged duplicate `dupe`; `vergleich` is a comparison mode. `inkMaterial()` applies the same mechanism to single images/atlas pieces; pop-ups require `inkline2d=1` on this source branch. `figureOutline.js` is a different stencil/inverted-hull mechanism for 3D figures and is not the Slop SDF path.

`inkSdfRechnen()` is a pure calculation usable outside rendering: alpha >=128 defines inside, a separable Euclidean distance transform produces signed distance, 0.5 is the boundary, outside positive, inside negative. Distances are processed separately within each atlas rectangle. `inkSdfBauen()` is the browser wrapper; `inkSdfLaden()` loads a no-color-space, linear-filtered, no-mipmap texture.

## Offline preparation already exists

[test/slopSdfBacken.mjs](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/38da5bc68eb37cf7372e591b12f9daa3e90a2881/test/slopSdfBacken.mjs) uses Sharp plus the same `inkSdfRechnen()` to bake a separate grayscale field per atlas page. Inputs: atlas JSON and optional downsample divisor; `SDF_OUT` chooses the output folder. It reports `sdf`/`sdf_max`; the owning distributor inserts metadata. It does not burn a black outline into the color artwork.

An animation precedent is already present: [pirat_bruellen.atlas.json](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/3746e3563ec326989c8da64e5b989a4d427bf163/slop_anim_r1/pilot/pirat_bruellen.atlas.json) names an atlas PNG, `pirat_bruellen.sdf.png`, `sdf_max=12`, six frames, `fps=4.17`, 3×2 layout, shared crop and 487×503 pixel frame cells (atlas1461×1006). Its note names `scripts/assets/slop_anim_atlas.mjs`, which was not located in the inspected runtime branch; do not invent a working invocation from that note. This existing private asset branch is a precedent, not a proven currently connected runtime animation consumer.

## White fringes: distinguish three mechanisms

1. [mobs2d.js `blobMat()`](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/38da5bc68eb37cf7372e591b12f9daa3e90a2881/src/npc/mobs2d.js) explicitly multiplies `kfbInsertEdge()` by zero to disable bright light-wrap; then applies `inkPatch()` when the billboard path is enabled. Disabling a synthetic bright rim is different from repairing contaminated source RGB.
2. [kfbInsert.js `insertMaterial()`](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/38da5bc68eb37cf7372e591b12f9daa3e90a2881/src/look/kfbInsert.js#L69) also has a newer `wrap:false` path. It raises alphaTest to at least0.62, looks for transparency within a24-texture-pixel neighborhood, discards bright low-saturation edge pixels, and pulls color inward along the alpha gradient. Optional `weissAus` also discards nearly pure white. This is a render-time heuristic, not a source-safe universal decontamination step. In the inspected Slop `blobMat()`, `wrap:false` is not passed: only light-wrap is manually disabled, so do not assume the newer cleanup is active for Slops.
3. [ingest_popups.py `stueck()`](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/38da5bc68eb37cf7372e591b12f9daa3e90a2881/scripts/assets/ingest_popups.py#L197) applies the extraction mask, zeros RGB only where alpha is exactly zero, trims, optionally downsizes and adds2px padding. It is not a general white-matte removal operation on partially transparent pixels. Its mask/keying paths are existing preparation machinery, to reuse only after checking the actual donor.

Kayfabizarro default-branch source search found no `inkSdfRechnen`, `slopSdfBacken`, `slop_anim_atlas`, `defringe` or `unmatte` implementation. Current Composer source instructions require true transparent alpha, no white cutting edge/halo and inspection of fringe; these are acceptance requirements, not evidence that a repair algorithm exists there. This bounded search is not a claim that every branch has been exhausted.

## Recommendation for the new animation lane

Use registered librarian singles, canonically mapped and shown in isolation, starting with one approved king/queen/boss-looking design. Visual rank is a selection preference; it does not establish combat tier. Preserve clean RGBA animation frames as the master and generate a separate per-frame SDF atlas using the existing owner mechanism. Offer an outline-rendered preview as a derivative. Keep the runtime outline adjustable.

Do not bake the animated, sun-sensitive screen-pixel outline into the master frames: its width becomes tied to export resolution and scales incorrectly in other displays; runtime outline can double it; noisy contour phase can pop at the loop seam; opaque black can merge narrow holes/droplets; bright edge-discard heuristics can erase white eyes, teeth, gems or bandages. If a standalone GIF needs the outline, export a separately named derivative with fixed size, lighting, noise phase and explicit padded margins; never replace the clean master.

First technical gate: one complete approved loop, common frame canvas/root anchor, adequate crown/prop margin, identical color/SDF rectangles, verified field orientation and `sdf_max`, light/dark/checkerboard playback at native and target sizes, no lost white facial details, no neighboring-cell bleed and deliberate last→first motion/outline phase. Existing SDF generation can run offline; outline rendering and white-edge heuristics still require a reviewed render/export adapter. No adapter was built or tested in this audit.
