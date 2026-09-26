# Blender MCP · CLAY-B0/B1 material handoff

Status: **READY FOR SOURCE RECON · MATERIAL RUN HELD UNTIL HASHED APPROVED PNG IS RETRIEVABLE**

Existing plan: [PR #228](https://github.com/georg-doc/kayfabizarro/pull/228), `tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/BLENDER_MCP_BRIEF.md` on that PR branch. Read its current head, `ASSET_MANIFEST.json`, NotebookLM `BLENDER_LANE_PLAN_CLAYBOUND_2026-09-26.md` and recovery before acting. Do not rebuild its proposed Clay Master or its B0–B2 plan here.

1. Verify Asset 01 r1 **actual bytes and SHA-256** (`fb952516…3c04ea5`) from its approved location. The original presentation poster is a separate look reference. Show exact clay donor image and one existing KFB source object separately before mixing them.
2. On a disposable copy, build the smallest one-model/one-material-zone color proof. Keep geometry, rig, bind state, slots, face/eyes, scale and source model identity. Confirm actual Blender node socket names in installed version.
3. Make three distinct outputs: Cycles look-dev, Eevee approximation, and runtime-safe baked GLB material. Record screenshots at same camera/light/scale, node inputs, actual engine/version, checks and GLB limits. `Normal Map` has no upstream normal input; use valid Bump chain. Bevel shader and Random Walk are Cycles-specific, not portable defaults.
4. Test two poses for texture swimming if the selected model is rigged; stable UV/tangent-space detail for moving skin. Triplanar/object mapping only for static scenery proof. Do not use Asset 03 r2 until Georg accepts its look; never use r3 (seam FAIL).
5. Return the `.blend`/GLB candidate, source receipts, screenshots and a short PASS/FAIL by tier to ToolBox. No slot collapse, blind Apply All Transforms, shader replacement in runtime, asset-library promotion or Live publication.

If approved PNG bytes are unavailable, stop at a truthful `SOURCE_REQUIRED` receipt and keep PR #228 plan available for review. **Next gate: source r1 hash check on a single named KFB model chosen by Georg.**
