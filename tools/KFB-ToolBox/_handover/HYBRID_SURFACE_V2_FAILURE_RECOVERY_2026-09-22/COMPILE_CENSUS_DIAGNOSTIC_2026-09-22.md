# Hybrid v2 compile census diagnostic · partial result

Status: **DIAGNOSTIC PARTIAL · FROZEN FOR THIS GATE**  
Branch: `chatgpt-web/toolbox-hybrid-v2-compile-census-2026-09-22`  
Draft PR: **#170**

## Exact five records from the frozen 58/63 proof mismatch

The diagnostic reproduced the frozen proof moment and identified the five concrete decorated materials counted effectively visible but lacking a compile marker:

1. **FrizzleBob Driver · Driver_Head · material index 1**
   - exact object path: `FrizzleBob · Driver Graft/graft-root · graft-driver/frizzlebob/figure/Rig_Medium/Driver_Head`
   - classification: **MATERIAL_VISIBLE_FALSE**
   - this material is referenced by geometry but intentionally has `material.visible=false`; it is not a shader failure.

2. **Black Knight · BlackKnight_ArmLeft**
3. **Black Knight · BlackKnight_LegLeft**
4. **Black Knight · BlackKnight_LegRight**
5. **Black Knight · BlackKnight_ShoulderLeft**

For the four Black Knight records the diagnostic proved:
- exact source node is attached to actor root and scene;
- active material is the v2 hybrid material;
- material is visible;
- object/ancestor visibility is true;
- camera layer matches;
- indexed geometry is non-empty;
- material is draw-referenced;
- normal isolate does not submit the node;
- disabling frustum culling diagnostically still does not submit it;
- no console/resource error occurs.

The exact BlackKnight GLB JSON was also inspected at actor pin `bdaea0648f27c0f16e0a737bfba237eb54dd4cbb`: all four nodes are direct children of `Rig_Large`, each has one valid primitive with material 0 and skin 0. The static source therefore does not explain the renderer non-submission by missing primitive/material/scene attachment.

## Stop

The diagnostic made real progress (five identities found; one record fully classified), but repeated instrumentation still does not evidence-classify the four Black Knight records. Do not continue blind renderer-census repair in this branch.

## Independent seam finding

Georg's screenshot shows a visible line on a broad flat wall. Separately, source inspection proves the current shared RGB macro texture generator is **not tileable**:

- `createRgbBrushTexture()` paints random strokes/blobs once in the 0…size canvas;
- then sets `RepeatWrapping`;
- there is no toroidal stroke duplication, periodic generation or opposite-edge normalization.

`RepeatWrapping` repeats a texture; it does not make mismatching edge pixels seamless.

Therefore a dedicated seam-only next slice may replace only the macro texture generator with a truly tileable version and assert opposite-edge continuity, without changing clay/grain, head scaling or consumer ownership. This is independent of the unresolved Black Knight census.
