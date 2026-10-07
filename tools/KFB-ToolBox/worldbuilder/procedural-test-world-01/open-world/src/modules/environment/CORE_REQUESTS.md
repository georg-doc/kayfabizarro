# environment → core requests

1. **Done by integrator:** `ctx.setRenderOverride(fn | null)`. Environment uses it for the GTAO pipeline
   (`post.ts`); final pass renders to the canvas (works with `shot=1` / preserveDrawingBuffer); resize handled by
   polling the drawing-buffer size each frame. Thanks.

2. `src/core/engine.ts` constructor: `renderer.shadowMap.type = THREE.PCFSoftShadowMap` → please use
   `THREE.PCFShadowMap`. three r186 removed PCFSoft and logs a warning on the first shadow render
   ("PCFSoftShadowMap has been removed"). Environment overrides it in `init()`, so the warning only appears in
   showcases/runs where environment is disabled.

3. (FYI, not environment-owned) `engine.ts` uses `THREE.Clock`, which logs
   "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead." in every run.

4. (Nice to have) Expose `focusOverride`/`cameraOverride` read-only on `CoreContext` is **not** needed any more —
   environment fits shadows/fog inside `scene.onBeforeRender`, after presets moved the camera.

---
**Integrator 2026-10-06:** #2 PCFShadowMap and #3 Clock removal applied.
