# RETURN · CLAY-PERF-P0A · building_A K2_BAKED_LITE · 2026-10-01

From: Blender MCP / Coworker lane. To: Web owner WorldBuilder / World Corridor 01 (WC1), WSA.
Handoff: `CLAY_PERF_P0A_GITHUB_HANDOFF_2026-10-01.md` @ `chatgpt-web/world-corridor-01-2026-10-01` / `bcb49d2`.
Status: **DELIVERED · one source-proven derivative family (1 geometry, 4 detail variants) · no runtime claim**.

## 1 · Problems first

1. **Near-view detail is lost at 1024².**
   - Detail energy of the baked candidate compared with v10 mid/far procedural (high-pass std):
     - 6 m: 86 %;
     - close facade 2.4 m: 59 %;
     - base 2.2 m: 51 %;
     - roof 2.6 m: 29 %.
   - Missing up close: the fine lines of the finger fan and the sharp dent rims.
   - Texel size at K1 scale: mean 1.4 cm (p95 3.2 cm). At fov 34° and 900 px viewport height, a pixel is 1.4 cm at about 20 m. Beyond that the 1024² bake carries the full mid/far detail; nearer it is softer.
   - **So K2_BAKED_LITE is a far/mid replacement only.** Near buildings need procedural detail on top (hybrid by distance), or 2048² maps (not built; about 4 MB per normal map).
2. **Golden mismatch is inherited from v10, not created by the bake.**
   - Luminance MAE at 6 m: baked vs v10 mid/far **1.05 %**, baked vs v10 full **1.09 %**, baked vs **K1 v8 Golden 1.84 %**.
   - v8 shows the fine hand-stroke cross-hatch; v10 shows the tool dents/smears.
   - P0A reproduces v10 as briefed. Whether v10 itself passes the Golden is a K2 / WC1 question (`02_matched_facade_6m_30deg.jpg`).
3. **The normal map uses the three.js tangent frame, not MikkTSpace.**
   - No TANGENT attribute is exported. three.js derives the frame from TEXCOORD_1 (`getTangentFrame`), and the bake encodes in exactly that frame.
   - Viewers that use MikkTSpace (Blender, other engines) show small differences on stretched charts (`09_glb_reimport_blender.png` looks right, but is not the reference).
   - Runtime requirement: three.js GLTFLoader without a tangent attribute (default).
4. **The bake is bound to world scale.**
   - Baked at the K1 Golden scale: ×1.9394 (building 3.2 m high).
   - v10 detail size follows world units. At another scale the clay detail grows or shrinks with the building. Keep this scale, or rebake per scale.
5. **v10 settings are an assumption.**
   - Used: K2 stage globals (tools on, legacy 0, mottle 0.04, macro 0.5, lodK 0.6, stroke 0.7), but Hand / Tile / PrintTile at the K1 values 0.5 / 1.6 / 4.5. The K2 stage multiplies these by 3 for its track world; the Golden contract says K1 values.
   - If WC1 runs v10 with other globals, the bake differs. Please confirm or send the WC1 values (`WAITING_FOR_WC1_SHADER_PIN` only if they differ).
6. **Bounds and base.**
   - The soften moves the base below the source origin: min y −0.0319 native (−6.2 cm at K1 scale). The footprint grows outward by 0.008–0.032 native per side, and the top rises by 0.023.
   - The origin is unchanged (0, 0, 0). K1 `footed()` lifts the soften result so min y = 0; this candidate keeps the source origin. Web decides whether to lift or sink.
   - KayKit has no anchors or connectors on building_A (no empties, no extras).
7. **The geometry is not lighter.**
   - 52,992 triangles: 64× the source and identical to the K1 / K2 procedural soften.
   - LOD is deferred per brief. Because the relief now sits in the normal map, fewer soften levels may be enough. That is the next measurable question, not done here.
8. **Tint is not in the GLB.**
   - v10 also darkens and mottles the base colour (×0.66–1.02; p1–p99 ×0.66 / 1.00 / 1.02).
   - The base colour stays authoritative (palette texture on UV0), so this multiplier is delivered only as `tint-debug-v1.png` (204 = ×1.0, 255 = ×1.25).
   - Without it, cavities in gouges read slightly lighter than in the procedural version.
9. **Variants differ in strength, not only in placement.**
   - With seeds 102 and 103, v10 places fewer tool zones on the facade, so those variants are visibly calmer (`06_variants_v1-v4_facade.jpg`). That is v10 seed behaviour, not a bake error.
   - 25 / 100 repetition quality is **untested** until Web measures it.
10. **UV1:** KFB_CLAY_UV made by Smart UV Project on the 828-triangle source and carried through the unchanged soften.
    - 0 overlaps; 44.7 % atlas fill (many small KayKit charts).
    - glTF drops UV-map names: KFB_CLAY_UV = `TEXCOORD_1` = three `uv1` / `texture.channel = 1`.
11. **No Golden image from K1 itself:** the "locked Golden" column is K1 v8 code re-rendered in my harness with K1 light and the K1 house profile, without K1's GTAO pass and outlines. It is not a screenshot of the K1 page.
12. All renders are headless Chromium / SwiftShader. **No performance claim** (Web measures that).

## 2 · Observation for WC1 (not P0A scope)

In `WC1_COST_SPLIT`, pixel ratio 1.5 → 1.0 removes 56 % of the pixels but only 22.5 % of the frame time. If the 21.9 ms of clay cost were pure per-pixel cost, about −36 % would be expected. Suggest measuring clay on/off at both pixel ratios, so the non-pixel share of the clay cost becomes visible before deciding between optimising and baking.

## 3 · What was done

1. **Source gate:** the pinned donor, with git blob hashes checked (all 9 pins match), imported unchanged in Blender 5.0.1 and rendered in isolation (`01`).
   - Facts: object `building_A`, mesh `Cube.938`, 1 material `citybits_texture`, 828 triangles, 1392 vertices, bounds (−1, 0, −1) … (1, 1.65, 1), origin 0, no children, empties or extras.
2. **Working copy:** collection `KFB_CLAY_BAKE_P0A`, source object hidden but present, UV0 untouched, plus `KFB_CLAY_UV`.
3. **Geometry:** the exact `clay-soften.v1.js` with K1 defaults, run in the browser. KFB_CLAY_UV rides through the subdivision in the colour attribute (soften keeps position / uv / color).
   - **Check:** the softened positions are identical to softening the pinned glTF directly (158,976 vertices, max |Δ| = 0).
4. **Bake:** the unmodified v10 fragment code rendered in KFB_CLAY_UV space (house profile + house toolmix, seeds 101–104), with prints, cracks and grain off. Outputs: tangent normal, roughness and tint, as floats.
5. **Maps:** dilated (nearest covered texel) and encoded as PNG.
6. **GLB:** assembled in Blender — base colour on UV0, normal and metallicRoughness on UV1, sheen as in v10. Exported, then re-imported in Blender and loaded in three.js.
7. **Comparison:** source | K1 v8 Golden | v10 full | v10 mid/far | baked, same camera (6 m, 30°, fov 34), K1 "day" light, plus close facade, roof and base.

## 4 · Exactly one next gate

**WC1 runtime comparison** `SOURCE → K2_PROC_OPT → K2_BAKED_LITE` with this GLB at ×1.9394, at 1 / 25 / 100 copies (variants v1–v4 rotating), plus a near / far switch test (baked beyond ≈ 20 m vs procedural near). Blender stops here.
