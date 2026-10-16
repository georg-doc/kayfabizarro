# Donor check: KhazP/rwanda-f1-2026-sim (commit f94f4b8, 17.10.2026) · V-378

Repo https://github.com/KhazP/rwanda-f1-2026-sim, found by Georg. We skip its controls.

## License
- The code is **MIT** ("Copyright (c) 2026 KhazP"). We may copy it if the MIT notice stays in the file or in CREDITS.
- **Not allowed:**
  - `src/lib/sim/CarAudio.ts`: derived from Speed Dreams, GPL.
  - `src/lib/sim/visual-fx.ts`: header says "Ported from Speed Dreams osggraph", GPL.
  - **All assets**: cars, drivers, sounds, textures (mod, Assetto Corsa, CC BY-NC-SA, origin unclear).

## Usable
| Donor | File (lines) | Use at KFB | Slice |
|---|---|---|---|
| Follow shadow snapped to shadow texels | `src/lib/render/golden-hour-environment.ts` 190–193, 251–267 | Project followShadow onto the light's right/up axes and round to texel size. Removes shimmer. About 10 lines. | S0/S1 (WS1, small) |
| Tyre deformation on the GPU | `src/lib/render/tyre-deformation.ts` 64–219 | Core of **Deformer v2**: vertices behind a plane are pushed onto the plane and bulge sideways (`onBeforeCompile`, uniforms per object, matching depth/distance materials so the shadow squashes too). Drop spin/camber; drive it with plane normal + impact depth + spring-back from the wall-hit event. Copy with attribution. | Slice 3 |
| Engine sound as a loop grid | `src/lib/sim/vf26-audio.ts` 88–185, 389–489 (`LoopGrid`/`LoopVoice`) | 3–5 KFB Racer loops at different pitches, equal-power crossfade, fake rpm from speed/thrust, dip and pops on throttle lift-off. Copy with attribution. Do not copy CarAudio.ts. | Slice 3 (VFX/audio V1) |
| PMREM sky environment | `golden-hour-environment.ts` 109–178 | Bake once at 256, warm, assign **only** to metal-tagged materials as `envMap`, not as `scene.environment` (V-370 metal gloss). Reimplement, about 15 lines. **Warning:** AgX/tone mapping inside a postprocessing pass breaks our per-object `toneMapped:false` (toneSplit). Stay with ACES. | S2 / L2 step 5 |
| Fixed time step | `src/lib/f1-physics-2026.ts` 529–567 | Idea only: walk/drive controller at a fixed 120 Hz with render interpolation (`alpha = acc/dt`), clamp + max steps, or Rapier CCD. Fixes tunnelling below 50 fps (memory foot-test-fps-tunnelling). | Slice 3 (motion session) |
| Wall contact as 2D segments + impact event | `VehiclePhysics.ts` 1384–1460, `TrackColliderQuery.ts` 383–470 | Cheap, tunnel-resistant thin walls; `WALL_IMPACT {speed}` + normal triggers the deformer. Reimplement the idea. | Slice 3 |
| `smoothDamp3` camera smoother | `src/lib/render/camera-rig.ts` 504–524 | Allocation-free, critically damped follower (Unity SmoothDamp), plus the boom-follows-yaw/slip idea. Copy with attribution. | later (camera) |
| Performance tricks | different files | `renderer.compileAsync` shader warm-up before showing the scene, sky drawn last (renderOrder), pixel ratio capped at 1.5. Ideas only. | F2 |
