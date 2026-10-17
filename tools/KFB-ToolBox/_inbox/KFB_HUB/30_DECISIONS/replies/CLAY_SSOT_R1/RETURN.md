# RETURN · CLAY_SSOT_R1 · **v1.1 "etwas mehr Knete"** (WS0 · 17./18.10.2026)

**Brief:** Georg 17.10.: "etwas mehr Knete, wir müssen die Kerben- und Dellen-Mathematik optimieren" (a bit more clay; improve the notch and dent maths).

**Result:** `kfb-clay.v1.1.js` (sha256 `a81a3ee3…3fd0`). The `character` relief is clearly stronger, the dent maths is new, there are still no stripes, and the API is identical to v1. Golden test v1.1: **G0–G5 all PASS**, with the G2 thresholds unchanged (stripePeak ≤ 3.0, coherence ≤ 0.70). Unit test **43/43 PASS**. **v1 is untouched** (sha256 `332d6af2…bb7b`, as before). The v1 report follows below, unchanged.

## What changed (v1 → v1.1)
v1.1 is v1 with four sections replaced: the header, the profiles, the dent GLSL and the dent uniforms; 156 changed lines. These stay byte-identical: seed handling, scale relative to the object (through the skin), no UV / texture / sin-hash / fwidth, distance bands in viewport shares, colour and matte rules, material build and API.

| | v1 | v1.1 |
|---|---|---|
| Dent layers | 1 (cell 0.034 · 45 %) | **2:** small thumb-tip dents (cell 0.03 ref, 80 %, slope 0.15) and large thumb presses / drags (cell 0.075 ref, 65 %, slope 0.19) |
| Sizes | radius 0.26–0.40 cell, uniform | **log-normal** per dent (σ 0.40 / 0.35, median 0.42 / 0.34 cell): a few large, many small. Clamped so a dent never leaves the 3×3×3 window, which means no seams and no cut dents |
| Shape | mild ellipse | **oval and drawn out:** elongation 1…2.6 (small) and 1…2.8 (large), most clearly oval, a few drawn out. Each dent gets its own random 3D axis, so the field stays isotropic and has no stripe direction |
| Distribution | 2×2×2 window, offset 0.25…0.75 (regular, slightly cell-like; visible in `relief_v1_fb_face.png`) | **clusters:** presence comes from a density field of two coarse octaves (2 and 4 cells, factor 0.35…2), so there are dense patches and calm areas. The centre is fully random in the cell. The 3×3×3 window removes the cell pattern |
| Profile | Gaussian bowl + faint ring | Gaussian bowl that is **deeper at the push end** (teardrop), plus a low, wide **raised rim only on the far end** where the clay was pushed (a crescent, never a closed ring). This avoids the "moon crater" look |
| Lumps / grain / maxSlope | 0.07 / 0.028 / 0.2 | **0.16 / 0.02** (grain very subtle) / 0.42 |
| midground / background | — | proportional only: the same dent structure, sizes × their v1 size ratio, lump × 1.55, dent slopes × 1.4–1.55 of their v1 dent |
| Hash | PCG3D integer | the same; size spread comes from Irwin–Hall (3 hashes), with no trig |

Analytic gradient: with `u = q − (1 − 1/e)·a(a·q)`, `rr = |u|/R`, `t = (a·q)/(R e)` and `g = t/(1+|t|)`, the height is
`h = D·(−e^{−2.5 rr²}(1 − 0.5 g) + rim·e^{−((rr−1)/0.26)²}(1+g)²/4)`, cut off at rr = 1.5, where both terms are below 0.5 %.

## Test results (headless chrome-headless-shell 1234, ANGLE Metal, Apple M1 Max · `node tests/golden.v1.1.test.mjs` · 23 s)
| Gate | Rule (unchanged) | v1.1 result |
|---|---|---|
| G0 metric | synthetic isotropic / craters pass; with stripes they fail | PASS: 1.88 / 1.45 vs 8.96 / 6.45 |
| G1 determinism | SSIM load 1 vs load 2 ≥ 0.995 | **PASS:** 32 renders, min SSIM **1.0000**, max pixel diff **0/255** |
| G2 no stripes | stripePeak ≤ 3.0, coherence ≤ 0.70 | **PASS:** stripePeak 1.51–1.92, coherence 0.38–0.52 (v1: 1.33–1.62 / 0.38–0.46) |
| G3 scale | FB face, stage ×1 vs ×2.5, SSIM ≥ 0.98 | **PASS:** 1.000 / 1.000 |
| G4 resolution | SSIM(↓2 hi, lo) ≥ unclayed − 0.01 | **PASS:** 0.9981–0.9990 = unclayed |
| G5 colour V-346 | chroma ratio ≥ 0.95 | **PASS:** 0.957–1.030 (lowest is GothGirl full at 0.957, as in v1) |

**Relief strength.** I measured the RMS of the face relief (relief on minus off, high-passed) for v1.1 / v1:

| Figure | lo | hi |
|---|---|---|
| FrizzleBob | 1.41× | 1.38× |
| GothGirl | 1.97× | 1.88× |
| Lord Hunky | 1.75× | 1.72× |

The mean is 1.7×. The metric keeps only periods under about 25 px, so part of the large dent layer and the lumps is not counted; the full relief gain is larger, as the comparison images show.

**Two steps I took back, openly:**
- The first v1.1 draft (sparse dents with a ring rim) read as moon craters, and the faces were calmer than v1.
- The second draft was too strong on flat faces (pockmarks on the suit face and on the back of the billboard).

The final values come from looking at the golden frames and the proof-stage images (suit, FB, billboard).

## Evidence (`evidence/`)
- `compare_v1_v11_{lo,hi}_*.png`: v1 on the left, v1.1 on the right, with the same frame and light (faces, full figures, stage, terrain, FB ×2.5).
- `v11_{lo,hi}_*.png`: the v1.1 golden frames.
- `relief_v11_*_face.png`: relief only (compare with `relief_v1_*`).
- `golden_results.v1.1.json`: every number, plus `reliefRatio`.

The proof-stage renders with v1.1 are in `../PROOF_STAGE_R1/evidence/`.

## Files (new; v1 files unchanged)
- `kfb-clay.v1.1.js`;
- `proof-kit.v1.1.js` (wrapper: proof-kit.v1 plus variant `v11`);
- `golden.v1.1.html`;
- `tests/golden.v1.1.test.mjs` (a copy of the v1 test with gates on v11, the same thresholds, plus relief ratio and comparison images);
- `tests/kfb-clay.v1.1.unit.test.mjs` (the v1 unit test pointed at v1.1).

Run: `node tests/kfb-clay.v1.1.unit.test.mjs`, then `KFB_CHROME=…/chrome-headless-shell node tests/golden.v1.1.test.mjs`.

## Open points (v1.1)
1. **The look is not yet approved by Georg.** The thresholds prove determinism, no stripes, scale and colour; they do not prove taste.
2. **Cost:** each dent layer searches 27 cells (v1 searched 8), with two layers. This is fine for proofs; fps on the game target is not measured. WS1 measures it before integration, and a lower-cost variant for far LOD is possible.
3. **Integration:** like v1, vendor the file byte-identically and pass profile names only. `kfb-proof-stage.v1` already uses v1.1.

---

# RETURN · CLAY_SSOT_R1 · one KFB clay material (WS0 · 17.10.2026)

Brief: Georg 17.10. (FAIL): "the claymation texture for the characters is displayed differently EVERY SINGLE TIME"; the latest WS1 preview shows stripes on the faces and the wrong scale.
Result: an audit of every clay set-up in circulation, plus one module, `kfb-clay.v1.js`, with three fixed profiles and distance bands. A golden test checks it: **all 6 gates PASS**, unit test 40/40, and the proof page is bit-identical after "neu laden".
Nothing was pushed, no settings were changed, nothing was deleted, and no file in another tool was touched. Everything lives in this folder.

---

## 1 · Audit: clay implementations in circulation

**Method:** I read the code on `gh/ws1/*`, `gh/main` and `gh/docs/…` with `git show`/`git grep` (nothing checked out), plus the replies folder, `50_BLENDER/` and the Resident Atlas cuts. `KFB Open World/` was not touched. I then **measured** the WS1 and proof set-ups with replicas (`proof-kit.v1.js`, variants `v8ws1` and `v8proof`) inside the same golden harness as v1. Blob hashes are listed so WS0 can verify them.

| # | Implementation (file · version) | Parameters as used | Why the look varies (✔ = measured here, ◇ = from code) |
|---|---|---|---|
| A | **WS1 kfb-planet** `src/modules/clayLook.js`. There are **three different versions**: `ws1/s1-weltboden` (f75f302d, pre-R2), `ws1/look-mesa` (480637a9, R2 + `clayFrom('house')` for the amphitheatre), and `ws1/m3-fahrhilfe` (ac568be4, R2). `ws1/preview` is a build that combines look/mesa and m3. Vendor: K1/H0 `clay-material.v8` (f8ea4c10), `clay-profiles.v2` (af57b88a), `clay-relief.v2` seed 11 (2bb843d2) | K1 golden uniforms: hand 0.5, tile 1.6 world units. Fingerprints off (the relief map is the fallback). **Knete R2** (WSB proposal): oil 0.08, `dent` figure 0.55 / vehicle 0.5, `roughness ≥ 0.95`. The shader still clamps roughness down to 0.3 after oil/cavity. A mesh named `…_head` gets `FACE_PROFILE` (stroke .35, print .25, dent .1, facet .6, crease .4). Sheen comes only via tune: 0.04 for figures, 0 for vehicles; GothGirl also gets `colorK` .95. **No `claySeed` attribute.** Clay is on only with `light=l1` or `clay=1/all`. Tone `tm=` defaults to aces, exposure 1 (eyetest 1.05). DPR `[1, 1.75]`. World scale `K` (`wscale=legacy` = ×1.54) | ✔ **Stripes on faces:** the K1 relief map holds directional hand strokes. These are "Spachtelzüge": sine ridges with a period of 7–13 texels inside stamps of 100–250 texels, plus finger fans. At hand scale (0.8 m tile) they project onto a face as parallel grooves 6–10 mm apart that cross the whole face. On the face, stripePeak is 3.3–5.7 and coherence 0.59–0.82 (v1: 1.33–1.62 and 0.38–0.46); see `evidence/relief_v8ws1_fb_face.png` and `v8ws1_lo_fb_face.png`. ✔ **Scale in world units:** FB at stage scale ×2.5 gives SSIM 0.899/0.914 against ×1 (v1: 1.000). ✔ **Resolution/DPR:** the LOD uses `fwidth(P)`, so the look depends on pixel size (cross-resolution SSIM 0.995–0.997 vs 0.998–0.999 for v1 and the unclayed figure). ◇ Three branch versions feed the previews in turn. ◇ The missing `claySeed` reads undefined GL "generic attribute" state (three only sets defaults for ShaderMaterial). All figures share one pattern position. ◇ The relief normal is turned with `modelMatrix` only, not the skin. On a posed or animated figure the relief shading keeps the bind-pose orientation. ◇ `fract(sin())` hash: the result depends on GPU precision |
| B | **Proof pages** `replies/E2_ATTACH_R1/proof*.html` (+ `clay-skin-attach.v1/2`, `clay-eyelid.v3`), vendor = the same v8/v2 blobs + `Fingerprints01_3K.png` | Hand factor **HK = 1/0.47** (×2.13 on hand, tile, print tile, facet size and profile scale). **Fingerprint texture on** (2048). `seedGeometry(layer·50 + n)` in traversal order. Sheen ≤ 0.04. `NoToneMapping`. A private hemi + key light. DPR min(2, dpr) | ✔ Relief is 2.1× coarser than in WS1, so a different look on the same figure: `v8proof_lo_fb_face.png` vs `v8ws1_lo_fb_face.png`. ✔ The fingerprint texture creates a strong stripe peak on Lord Hunky (stripePeak 10.3–11.0). ✔ Scale: SSIM 0.892/0.912. ◇ Different tone (none instead of ACES) and a different light from the game |
| C | **WSB** (`50_BLENDER`): web proofs `B1/proof/b1.html`, `B2/R2/proof/fluff_stage.html`, `B7/proof/b7_stage.html`, `STEINKIT/proof/stonekit.html`, `B13`, `B17`, `B10`, `B12`, `B16`, `B20` (copies of v8 in `B1/B2/proof/vendor`). Blender `.py` scripts | Web: v8 + HK 1/0.47 (B1 also takes `?hk=`), fingerprints on, `seedGeometry(seed0 + n)`, `setPixelRatio(1)`. Tone: B1 `NoToneMapping`; B2R2/B7/STEINKIT/B13/B17 ACES (B2R2 with `?exp=`). Blender: a plain Principled BSDF with roughness set per script (0.7–0.9; 0.35 B7 idol, 0.45 B16), CLOUDS **displace modifiers** (noise_scale 0.45), and **no clay shader** | ◇ Tone mapping and exposure differ per page, with URL overrides (`hk`, `exp`). ◇ Blender renders have no clay relief at all, and the displacement changes the mesh (V-340 says "no mesh change"). ◇ WSB itself reports "Fingerabdruck-Streifen der K1-Relief-Kachel" (fingerprint stripes from the K1 relief tile) on large stones (`STEINKIT/RETURN.md`), which matches row A |
| D | **ToolBox studio** `KFB ToolBox Production-08` → `kfb-lib/body-surface.v2.js`, family "Knete · K2" = **clay-material v10** + relief v2 **seed 31** + tool reliefs v4 seed 41 (`TOOLBOX_SOURCE_CUT_2026-10-14_r1`) | `K0 = height/1.2` from a non-precise `Box3` (skin ignored). A scale selector multiplies by ×1 / ×1.8 / ×3. hand 0.5·k, tile 1.6·k, print on (if the PNG loads), stroke 0.7, LodK 0.6, mottle .04. Face parts use their own profile `face` (dent .2, print .8, `clayRest`). `seedGeometry(seedN++)`. **Sheen 0.18** (v10 role `soft`, not clamped). "Matte clay" family sheen 0.5 / 0.22 / 0. ACES (`NoToneMapping` in one view mode). DPR min(2, dpr), 1 in low mode | ◇ A different shader generation (v10 tool zones) and a **different relief seed (31 vs 11)** give a different pattern on the same figure. ◇ Sheen 0.18 breaks V-385 (≤ 0.05). ◇ The height is measured without the skin, which is wrong for scaled armatures. ◇ The selector changes the scale. ◇ Seeds depend on order. ◇ LOD uses `fwidth` |
| E | **Resident Atlas profile `fine`** (V-053) `KFB_RESIDENT_ATLAS_*_2026-10-04/lib/diorama.js` (v10 + relief v2 seed 31 + tools seed 41). The *Island Worldbuilder Lab* has no clay "fine" profile; its `fine` is a terrain mesh option | `fine = prof('figure', scale 0.45, tools vehicle, print 0.8) × k`, where `k = figureH/1.2` and **figureH = 2.3 is assumed, not measured** (×1.92). Print off, legacy strokes off, stroke 0.7, LodK 0.6. **Quality tiers** switch sheen 0.18/0, tools all/objects/none, and DPR 2/1.25/1. Exposure per time of day 0.95/0.9/0.8 | ◇ The look changes with the quality tier: sheen, tool marks and DPR together. ◇ The k-factor comes from an assumed height |
| F | **`kfb-stage-light.v1.js`** (WS1, blob cd8bda8c, identical on look/mesa and m3) | One rig (sun, hemi = edgePalette, warm figure light, no rim/back light). `MOODS` r2 / `cozy` / `mesa`, `TONES` aces/neutral/agx/none, `applyTone(name, 1)`, `fitShadow`, `contactAO` | Not a clay implementation, but a variable. WS1 previews switch `lset=` (r2 → cozy → mesa, all on 17.10.), `tm=` and `tod=` through the URL. Proofs (B, C) and the ToolBox (D) do not use this module. **The same clay therefore looked different under different light and tone curves.** |
| G | Others: `CLAUDE_DESIGN_STAGE_LIVE_R1/vendor/k1/clay-k1-adapter.js` (v8, seed 11, print on); `MODULE_INVENTORY_R1/proofs/clay-proof.mjs` (relief seed 31, 256²) | as noted | ◇ more copies with their own seeds and settings |

### The six candidate causes, judged
| Candidate | Verdict | Evidence |
|---|---|---|
| Scale in world units instead of relative to object size | **Confirmed, main cause** | G3: v8 SSIM 0.89–0.91 at stage ×2.5 vs v1 1.000. The factors in circulation are 1 (WS1), 2.13 (HK, proofs/WSB), height/1.2 (ToolBox), 2.3/1.2 (Atlas), and stage `K`/`wscale` on top |
| UV-dependent relief → stripes | **Stripes confirmed, but not via UV.** v8/v10 are object-space triplanar | The stripes come from **directional content in the relief map** (sine ridges, finger fans, fingerprint texture) at hand scale. G2: v8 stripePeak 3.3–11.0. The only UV dependence is the source normal map, which v8 keeps at ×0.45 |
| Random seeds per load | **Not confirmed within one set-up** | v8 replicas are stable from load to load (max 1/255). Seeds do depend on order (`n++`), differ per tool (11 vs 31), and are missing in WS1 (undefined attribute) |
| Different profiles per tool | **Confirmed** | `figure`, `FACE_PROFILE`, Knete R2, `fine`, `face`, plus the K2 tool mixes: at least 5 configurations for "figure" |
| Tone mapping / exposure | **Confirmed (code)** | None (E2, B1) vs ACES (WS1, WSB B7…) vs `exp`/`tm`/`lset` URL switches vs eyetest 1.05 vs Atlas 0.8–0.95 |
| Normal-map strength depending on distance | **Confirmed, and it also depends on resolution** | The v8/v10 LOD uses `fwidth(P)` in pixels, so DPR 1 / 1.75 / 2 change the bands. G4: v8 0.995–0.997 vs v1 = unclayed 0.998–0.999 |
| *Also found* | ◇ | Sheen 0.18 (v8/v10 role `soft`, ToolBox, Atlas tier "hoch"). The skinned normal delta is turned without the skin. `sin`-hash GPU precision. Three WS1 branch versions |

---

## 2 · Concept: layers and distance

The scale is always **relative to a reference length** `scaleRef`, never to "world units". For a figure, that is its own height (measured through the skin). For props and terrain, the stage passes **its figure height**, so hand marks match the cast. In the table, sizes are in reference lengths, and the cm values are for a 1.8 m figure.

| Profile | Use | Lumps | Thumb dents | Grain | Facets | Roughness ≥ | Sheen | Mottle |
|---|---|---|---|---|---|---|---|---|
| `character` | figures, faces (V-053 "fine") | 0.085 (15 cm), slope .07 | 0.034 (6 cm cell, Ø ≈ 4 cm), 45 %, slope .075 | 0.0055 (1 cm), .028 | **none** | 0.72 | 0.04 | ±2.5 % |
| `midground` | dioramas, Meshy stages, props, vehicles | 0.12, .07 | 0.05, 50 %, .11 | 0.008, .04 | 0.09, .05 | 0.82 | 0.02 | ±3 % |
| `background` | terrain, far scenery (coarser, calmer) | 0.45, .06 | 0.2, 35 %, .08 | **none** | 0.3, .045 | 0.9 | 0 | ±3.5 % |

- **Faces without stripes:** `character` has only isotropic marks (no strokes, fans, drags or facets), and the relief is a solid 3D field with no projection that could stretch.
- **Distance bands:** each layer fades with a smoothstep over the share of viewport height that its features cover. The share comes from the projection matrix and view depth, computed per vertex, with no `fwidth`. Example for `character`: grain is fully visible from 1/190 of the viewport height (≈ 6 px at 1080p) and gone below 1/520. Dents run 1/150 to 1/480, lumps 1/50 to 1/160. **Near** shows grain + dents + lumps, **mid** shows dents + lumps, **far** shows lumps only. With the same camera framing, 540p and 1080p give the same look, and nothing pops.
- **Colour (V-346 / V-340):** mottle preserves the mean. The optional palette pull is clamped to 18 %, keeps the texel's lightness, and never lowers its chroma. Metalness is 0, and figures get no emissive.
- **Light/tone are not part of the material:** use `kfb-stage-light.v1` with `applyTone('aces', 1)`, as in the game.

---

## 3 · Module API (`kfb-clay.v1.js`, three r180, WebGL2, THREE passed in, no imports)

```js
import { applyClay, removeClay, clayOptionsFromCard, CLAY_PROFILES } from './kfb-clay.v1.js'
const h = applyClay(object3d, THREE, { profile: 'character', seed: card.id /* or material.claySeed */, scaleRef: 'object' })
// stage props / terrain: applyClay(stage, THREE, { profile: 'midground' | 'background', seed: 'utopia_stage', scaleRef: figureHeightInStageUnits })
applyClay(fig, THREE, clayOptionsFromCard(card))   // card.material.clayProfile = 'character' (name only); 'figure-fine' is an accepted alias
h.info()          // { profile, seed, scaleRef, meshes, skipped, k[] }
h.remove()        // = removeClay(object3d): original materials back
```
- `profile`: `character | midground | background`. The old names map via `PROFILE_ALIASES` (figure-fine, figure, vehicle, prop, house, terrainBg, …). Profile numbers are frozen and cannot be passed.
- `seed`: a number (used as is) or a string (FNV-1a). The default is `object.name`. Never random. The per-mesh offset is `hash(seed, mesh.name)`, so it does not depend on load order.
- `scaleRef`: `'object'` (height measured with the skin) or a number in world units at apply time. Call it after loading and before animation starts, or pass a fixed number.
- `palette` (≤ 8 hex), `pull` (clamped to 0.18), `relief: false` (colour/roughness only), `skip` (RegExp/function; default eyes, lids, mouth, teeth, decals, screen slot).
- Implementation: a new `MeshStandard/PhysicalMaterial` per mesh (the source colour, map, vertex colours, normal map ×0.5/0.6/0.4 and AO are kept), extended with `onBeforeCompile`. One program for every profile (`customProgramCacheKey = 'kfb-clay.v1'`).

---

## 4 · Test results

**Environment:** headless Chrome (playwright headless shell 1234) on `ANGLE Metal, Apple M1 Max`. three r180 from jsDelivr, like every existing proof. The test started its own server on an ephemeral port (not 5180/5192/8765) and closed it at the end.

**Unit test** `node tests/kfb-clay.unit.test.mjs`: **40/40 PASS**. It covers profile limits, aliases, seeds, the card helper, a GLSL with no UV / sin / fwidth / texture, k invariant under armature 0.01 + stage ×3.7, eyes skipped, colour kept, pull clamped, remove and idempotence.

**Golden test** `node tests/golden.test.mjs` (5 scenes: FrizzleBob, GothGirl, Lord Hunky, Meshy Utopia stage, terrain. Fixed cameras, kfb-stage-light Mesa day, ACES 1. 800×450 and 1600×900. 2 separate page loads each. 42 s):

| Gate | Rule | v1 result | Comparison |
|---|---|---|---|
| G0 metric | the stripe metric separates synthetic cases | **PASS**: isotropic 1.88 / craters 1.45 vs faint stripes 8.96 / 6.45 (stripePeak) | — |
| G1 determinism | SSIM(load 1, load 2) ≥ 0.995, every v1 render, both resolutions (32) | **PASS**: min SSIM **1.0000**, **max pixel diff 0/255** (bit-identical) | v8ws1/v8proof also stable (≤ 1/255) |
| G2 no stripes | face relief: stripePeak ≤ 3.0 and coherence ≤ 0.70 | **PASS**: stripePeak 1.33–1.62, coherence 0.38–0.46 (FB/Goth/Hunky, lo + hi) | v8ws1 3.28–5.73 / 0.59–0.82 · v8proof 2.45–11.04 / 0.38–0.50 |
| G3 scale | FB face at stage ×1 vs ×2.5: SSIM ≥ 0.98 | **PASS**: 1.000 / 1.000 | v8ws1 0.899 / 0.914 · v8proof 0.892 / 0.912 |
| G4 resolution | SSIM(↓2(hi), lo) ≥ unclayed − 0.01 | **PASS**: 0.9981–0.9990 = unclayed 0.9980–0.9990 | v8 0.9950–0.9980 |
| G5 colour V-346 | OKLab chroma in the figure mask, clay / original ≥ 0.95 | **PASS**: 0.956–1.034 (lowest is GothGirl full at 0.956, lightness 0.968) | v8 0.976–1.039 |

**About the G2 thresholds, openly:** the first draft (coherence ≤ 0.45, raw FFT max/mean ≤ 1.6) failed even for isotropic relief. A relief lit by one directional light is seen as its derivative along the light, so even perfectly isotropic marks have a cos² orientation profile (max/mean ≈ 2). I then changed the metric to "FFT orientation peak over the fitted cos² light shape" and widened the coherence window. I set the thresholds from synthetic images (G0, built into the test) before judging v1 again. Separately, the first v1 dent shape read as moon craters, and I softened it into a Gaussian bowl with a faint rim. The test reported that as PASS, but it failed by eye.

**Proof page** `proof.html`: 30 images (3 objects × 3 profiles × 3 distances, plus 3 faces). After "neu laden" (GLBs fetched again with cache-busting, new materials, new renderer) the status is **"Ladung 2 · 30 Bilder · bit-gleich zur Ladung 1 (0 Pixel anders)"**, both in the Browser pane and headless. No overlays in the images; labels sit under them.
How to start it: `cd ~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies && python3 -m http.server 8781 --bind 127.0.0.1`, then open `http://127.0.0.1:8781/CLAY_SSOT_R1/proof.html`. The root must be `replies/` because the golden v8 replicas read `../E2_ATTACH_R1/vendor/`; the proof page itself needs only this folder. I started my own server on 8781 for the check and stopped it again; 8765 was not touched.

## 5 · Evidence (`evidence/`)
- `golden_results.json`: every number from section 4, per render.
- `v1_{lo,hi}_{fb,goth,hunky}_{full,face}.png`, `v1_*_fb_face_x2.5.png`, `v1_*_stage.png`, `v1_*_terrain.png`: the v1 golden frames.
- `relief_{v1,v8ws1,v8proof}_{fb,goth,hunky}_face.png`: the relief alone (relief on minus relief off, ×6). **`relief_v8ws1_fb_face.png` shows the WS1 face stripes.**
- `v8ws1_lo_*.png`, `v8proof_lo_*.png`, `none_lo_*.png`: the same frames with the WS1 clay, the proof clay, and no clay.
- `proof_near.png`, `proof_mid.png`, `proof_far.png`, `proof_faces.png`, `proof_page_reload2.png`: the proof page after the second load.
- `golden_smoke.json`: smoke run (FB only).

---

## 6 · Integration guide (through WS0; not done here)

**All tools:** vendor `kfb-clay.v1.js` **byte-identical** (sha256 `332d6af2…bb7b`) and pass a profile **name**, never numbers. Light and tone come from `kfb-stage-light.v1` with `applyTone('aces', 1)`. Figure cards: `material.clayProfile: 'character'` (the existing `figure-fine` works as an alias), plus optionally `material.claySeed`; otherwise the card `id` is the seed.

**WS1 (owner L3)**
1. Add `src/vendor/clay/kfb-clay.v1.js` + SOURCE.md (sha256). In `modules/clayLook.js`, replace the body with `applyClay(o3, THREE, clayOptionsFromCard(card))` per figure module. Remove `FACE_PROFILE`, `HEAD`, `KNETE_R2`, `FIG_TUNE`, `CLAY_TUNE` and `colorK`: sheen and roughness now come from the profile. The `SKIP` list is replaced by `SKIP_DEFAULT`; brows and nose get `character` clay, as decided in the ToolBox on 30.09.
2. Vehicles: `profile: 'midground', scaleRef: <figure height in stage metres>`. The amphitheatre (`clayFrom('house')`) and Meshy stages: `midground` with the same scaleRef. `m1-terrain`: `background` with the same scaleRef.
3. One code version for every branch, and drop the URL switches that change the look for acceptance previews (`clay=0|1|all`, `tm=`, `lset=`): clay is always on (V-346.6), with one light set per preview link.
4. A preview gate: compute `tests/clay-metrics.v1.mjs → stripeMetrics` on the stage frame (FB face, relief on/off via `h.setRelief`) and require stripePeak ≤ 3.0.

**ToolBox studio**
1. In `body-surface`, a new family "Knete v1" calls `applyClay(root, THREE, { profile, seed: card.id })`. The "Character / Midground / Large object" selector maps to `character / midground / background` (names only, no ×1.8/×3 factors). Keep K2/v10 only as a labelled "legacy" comparison, never for acceptance images.
2. Remove the sheen 0.18 path (the profile gives 0.04). Hand/size/print sliders are not part of acceptance.
3. Use `kfb-stage-light.v1` for acceptance views instead of the private `LIGHTS` (neutral/day/evening/night).
4. Face parts: v1 reads the `position` attribute in the rest pose. Morph-target expressions do not make it swim, because the morph runs after it in the shader. If a brow/nose owner rewrites the position buffer, it needs a fixed rest copy (see open points).

**WSB**
1. Web proofs (B1, B2/R2, B7, STEINKIT, B13, B17, …): replace the v8 block (HK 1/0.47, fingerprint texture, `seedGeometry`) with `applyClay` + `kfb-stage-light.v1` + `applyTone('aces', 1)`. Drop the URL overrides `hk`/`exp`.
2. **Never bake clay relief into exported GLBs** (normal map or displacement). The web module adds the relief at runtime, so baking would double it, and V-340 says "no mesh change". The CLOUDS displacement on figures and props goes for game assets.
3. Blender stills and turntables that should match the game. Equivalent node set, **untested starting values**, to be matched by eye against `evidence/v1_*`:
   - Coordinates: the rest position (Mesh › *Add Rest Position*, Blender ≥ 3.5, attribute `rest_position`; for props without a rig, Texture Coordinate › Object) × 1/scaleRef. scaleRef = the object height in its own local units, or the stage figure height for props/terrain.
   - Per layer one Bump node (Strength 1). Distance values below are for a 1.8 m reference; scale them linearly with scaleRef:

| Profile | Lumps: Noise Texture 3D | Dents: Voronoi F1 Euclidean, mask = Color.r < density, height = −exp(−2.5 (d/0.33)²) | Grain: Noise | Facets: Voronoi | Principled |
|---|---|---|---|---|---|
| character | Scale 11.8/ref (15 cm), Detail 1, Bump distance 7.1 mm | Scale 29.4/ref (cell 6 cm, bowl r 2 cm), density 0.45, depth 1.1 mm | Scale 182/ref (1 cm), 0.18 mm | off | Roughness max(src, 0.72), Metallic 0, Sheen ≈ 0 (Blender's sheen model differs; 0.04 is negligible), no Emission |
| midground | 8.3/ref (22 cm), 10 mm | 20/ref (9 cm, r 3 cm), 0.5, 2.4 mm | 125/ref (1.4 cm), 0.38 mm | Scale 11.1/ref, tilt ≈ 0.05 (Bump on Distance-to-Edge) | Roughness ≥ 0.82 |
| background | 2.2/ref (81 cm), 32 mm | 5/ref (36 cm, r 12 cm), 0.35, 7 mm | off | 3.3/ref, 0.045 | Roughness ≥ 0.9 |
   - Distance bands: in Blender, scale the Bump strength with camera distance via a Camera Data › View Distance driver. Use the same viewport shares: grain gone below 1/520 of the image height, dents below 1/480, lumps below 1/160.
   - Tone: three's ACES Filmic does not exist in Blender (see open points).

---

## 7 · Open points
1. **Tone match Blender ↔ game:** three `ACESFilmicToneMapping` has no Blender equivalent. Options: Blender "Standard" + ACES in post, or WS0 switches the game to `NeutralToneMapping` (= Khronos PBR Neutral, which exists in both). That is a WS0/Georg decision; WS1 chose ACES with Mesa.
2. **The look is not yet approved by Georg.** The thresholds prove determinism and the absence of stripes, not taste. The profile values are WS0 starting values: `character` is deliberately subtle (V-053), and `midground`/`background` are untested on real game stages (only Utopia + synthetic terrain).
3. **Posed figures:** the golden scenes are static (bind pose). The skin path of the normal transform is implemented (`skinMatrix`) but not measured under animation. Next step: G1/G2 on 3 fixed animation frames.
4. **`scaleRef` and pose:** `'object'` measures in the current pose. Recommendation: apply before the mixer starts, or add a card field `material.clayScaleRef` later (WS0 schema decision, `FIGURE_SCHEMA_R1`).
5. **Face parts rewritten on the CPU** (ToolBox brow/nose owners): they need a rest copy of their positions, like `clayRest` in body-surface.v2. Not part of v1.
6. **The claySeed hypothesis in WS1** (undefined generic attribute) comes from code reading, not reproduced. It goes away once v1 replaces the code.
7. Fingerprint photo texture (cgbookcase via joebinns): not used in v1 (no licence check, and a stripe source on Hunky). If Georg wants visible fingerprints, a procedural, isotropic variant in `character` is the safer route.
8. Integration in WS1 / ToolBox / WSB / WSA (Claude-Design stage `vendor/k1`) is done by WS0 per this guide. Older copies (G) keep their state until then.

## Files
`kfb-clay.v1.js` (SSOT module) · `proof.html` · `proof-kit.v1.js` (shared stage for test/proof, not API) · `golden.html` (headless harness) · `tests/kfb-clay.unit.test.mjs` · `tests/golden.test.mjs` · `tests/clay-metrics.v1.mjs` · `vendor/kfb-stage-light.v1.js` (byte copy, blob cd8bda8c from `gh/ws1/m3-fahrhilfe`) · `assets/` (test GLBs from `gh/ws1/m3-fahrhilfe`, `gh/assets/meshy-stages-utopia-comic-2026-10-15`, `gh/assets/meshy-dieselpunk-vehicles-2026-10-15`, `E2_ATTACH_R1/assets`; sha256 of FB = figure card) · `evidence/`.
Run: `node tests/kfb-clay.unit.test.mjs`, then `KFB_CHROME=~/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell node tests/golden.test.mjs` (without `KFB_CHROME` it tries the Chrome channel, which failed to launch in this environment).
