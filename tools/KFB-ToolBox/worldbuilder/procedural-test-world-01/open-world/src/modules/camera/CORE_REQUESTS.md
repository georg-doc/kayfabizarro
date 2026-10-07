# camera · core requests (round 3)

1. **Occluder dithering for buildings and terrain (villages, terrain modules)** — the same screen-door band the nature
   module uses (fragments near the camera and inside the camera → player line, `uNatCam`/`uNatPlayer`). Reason: when
   the character stands with its back against a tall wall or cliff there is physically no camera spot behind it.
   The camera keeps a 1.8 m arm (so it never collapses into the head) and cuts the blocker with the near plane, but the
   near plane may not pass the helmet, so a blocker that touches the character's back can still hide the lower body.
   With band dithering on buildings/terrain the character is always visible. The camera showcase already does this for
   its own tavern and trees (`stage.ts` `ditherMaterial`, uniforms set by the camera module each frame).
2. Character: derive camera-relative WASD from `cameraRig.yaw` (or the camera world direction — the camera no longer
   turns on its own, so both are equivalent now).
3. `tools/shoot.mjs --sheet`: stamp `cameraRig.debugState()` (distance/zoom/pitch) next to the gait (optional).

Done by the integrator earlier: `ctx.getCameraOverride()`, `player.object/grounded` documented, HMR off, JPEG output.

## Round 6
4. The camera module sets `renderer.localClippingEnabled = true` and assigns its three blocker-cutaway planes
   (`clipIntersection`, `clipShadows: false`) to every built-in world material it finds (ShaderMaterials and the
   character are skipped). Inactive planes never clip. If another module ever needs per-material clipping, coordinate
   (the camera skips materials that already carry someone else's `clippingPlanes`).
5. Showcase stage: the tavern no longer dithers (buildings are cut by the planes instead); trees/bushes keep the
   foliage dither, now also right up to the character's depth.

## Round 8
6. **Character steering should use `cameraRig.yaw` (the user's orbit yaw), not `ctx.camera.getWorldDirection()`.**
   The camera now slides sideways along a wall when the character is pinned against it (integrator decision c). With
   steering taken from the actual camera direction, a held S then turns into "run along the wall" (the camera module
   freezes the slide while the player moves to prevent a feedback loop, but the steering change itself remains).
   `cameraRig.yaw` / `cameraRig.forward()` stay the user's yaw, unaffected by the automatic slide.
