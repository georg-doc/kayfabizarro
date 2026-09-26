# Gemini clay image · seam QA · 2026-09-26

Source: [Gemini JPEG on main](https://github.com/georg-doc/kayfabizarro/blob/4daf059b14e1355e5af2edbb2c413ff31e9581be/tools/KFB-ToolBox/_inbox/KFB%20Style%20References/ClayBound%20Cozy%20Platformer%20%2B%20Editor/Gemini_Generated_Image_wm5askwm5askwm5a.jpeg). Git blob `f42be72881e66c05f0b9488264f4e782ea2e5f5b`; file SHA-256 `05ae7c6fc97ce7b4094288ca01dca626f32e88d3e182f521f3db6f0b86041d33`; 2048×2048 RGB 8-bit JPEG.

Verdict: **visual reference promising; raw seamless tile FAIL**. Handmade orange clay relief has tactile folds, presses and small pits. The 3×3 repeat shows horizontal and vertical joins and the same large relief pattern recurring every tile. It is a style/meso relief donor for the queue, not an approved Asset 01 smooth matte seamless texture. It does not replace PR #228 Asset 03 r2/r3 or settle their separate human gate. Directional highlights and shading are baked into the JPEG; do not treat its RGB as lighting-neutral albedo or infer a physically reliable height/roughness map.

## Reproducible check

- Compare opposite edges per RGB channel over all 2048 pixels, no seam blending or offset: left/right mean absolute error **5.538/255**, 95th percentile **14/255**; top/bottom **5.534/255**, 95th percentile **14/255**. Immediate in-image neighbors at left and top: **4.304/255** and **3.911/255** respectively. MAE alone is not a perceptual certification; the repeating 3×3 contact sheet makes the visible joins and repeated relief apparent.
- Human Web Chat gate: inspect the original at 100%, 3×3 at fit and 100%, both x/y joins, tile scale on a rotating neutral-light Blender sphere/plane, and coarse-distance repetition. Record PASS/FAIL with screenshot, source SHA, dimensions, method and intended use.
- If adapting: preserve the source, derive one candidate with a real wrap/offset repair (use PR #173's seam-lab donor where applicable); keep the recognizable handmade shapes without copying a dominant periodic motif. Re-test both edges and 3×3 at target UV scales. After two failed repair passes, freeze and return for design review. No silent promotion to the material master or game.
