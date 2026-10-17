# TEST REPORT · CLAY-PERF-P0A · 2026-10-01

Only executed checks say PASS / FAIL. Environment: Blender 5.0.1 (bpy, EEVEE), three.js 0.160.0 in headless Chromium (SwiftShader), Python 3.11 + numpy / scipy / Pillow.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Pinned sources: git blob hash of all 9 downloaded files = pin | PASS 9/9 | SOURCE.json `pins_verified_git_blob` |
| 2 | Source isolation, unchanged donor | PASS: 828 tris, 1 mesh, 1 material, bounds (−1, 0, −1)…(1, 1.65, 1), origin 0 | evidence/01, source_facts.json |
| 3 | Source not overwritten | PASS: donor read only; working copy in collection `KFB_CLAY_BAKE_P0A`, source hidden in the .blend | source/*.blend |
| 4 | UV0 preserved | PASS: TEXCOORD_0 carries citybits_texture; the soften copies uv unchanged | GLB JSON, reimport.json |
| 5 | KFB_CLAY_UV non-overlapping | PASS: 0 overlapping texels at 1024²; fill 44.7 % | uv1_stats.json |
| 6 | Soften identical to K1 / K2 soften of the pinned donor | PASS: 158,976 vertices, max abs Δ position = 0 | harness `compareRef` |
| 7 | Triangles source / candidate | 828 / 52,992 (3 soften levels) | render_info.json, reimport.json |
| 8 | Bake coverage | 44.7 % of the texels, 0 NaN, 4 seeds | map_stats.json |
| 9 | Parity baked vs v10 mid/far (same camera, 6 m) | Luminance MAE 1.05 %; detail energy 86 % | pixel_metrics.json, evidence/02 |
| 10 | Parity at close range | **FAIL as near replacement**: detail 29–59 % (roof / base / facade at 2.2–2.6 m); expected for 1024² mid/far | evidence/03–05 |
| 11 | Baked vs K1 v8 Golden (6 m) | MAE 1.84 % (inherited v10↔v8 difference, see RETURN §1.2) | evidence/02 |
| 12 | No directional lighting in the maps | PASS by construction: maps hold tangent normal, roughness and a tint multiplier only; no light term is read | p0a_bake_harness.html |
| 13 | GLB re-import (Blender) | PASS: 52,992 tris, 2 UV maps, 3 images 1024², 0 missing; material on UV1 for normal / roughness | reimport.json, evidence/09 |
| 14 | GLB load (three.js GLTFLoader) | PASS: normalMap channel 1, normalScale (1, −1), sheen 0.12 × #fff1e0, no tangent attribute, FrontSide | render_info.json |
| 15 | Variants v1–v4 load and differ | PASS (visual) | evidence/06 |
| 16 | Texture formats / sizes | PNG 1024² RGB: normal 0.89–1.07 MB, roughness 0.12–0.14 MB, tint-debug 0.06 MB; GLB 2.89 MB | file listing |
| 17 | Runtime performance | NOT_RUN (Web owns it) | — |
| 18 | 25 / 100 repetition quality | NOT_RUN | — |
| 19 | Georg look check | NOT_RUN | — |
