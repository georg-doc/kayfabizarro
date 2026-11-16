# Three.js Particle Fluids, vendored

- **From:** https://github.com/dgreenheck/threejs-particle-fluids, commit `26ebfd2` ("Release 0.2.0 and show the version in the demo header").
- **Licence:** MIT, © 2026 Daniel Greenheck (`LICENSE`).
- **What's here:** its `src/` folder, with the three changes below. Not its demo, docs, tests or assets.
- **Why vendored, not from npm:** the package's peer dependency is `three >=0.184.0 <0.185.0`, and Patch's blocks are on r186.

## Patch's changes

All are marked `Patch:` in the code, and all are worth offering upstream.

1. **One copy of the screen, not one per call** (`src/render/viewport.ts`, used by `FluidSurfaceRenderer.ts` and `GasVolumeRenderer.ts`). Each `viewportSharedTexture()` or `viewportDepthTexture()` call makes a node with its own full-screen copy per render target, which three never frees. Upstream's demo makes a new renderer for every preset, so it never builds up there. On one renderer it took GPU memory from 1.1 GB to 5.8 GB in 4.5 minutes of switching. It also did those copies every frame.
2. **A grid for skinning a mesh to a soft body** (`src/softbody/bindMesh.ts`). It tested every particle for every vertex, which froze the page for 3.7 s for the bunnies at 20,000 particles.
3. **A grid for filling a mesh with particles** (`src/softbody/voxelize.ts`). It tested every triangle for every grid cell, which took about 2 s for the demo's three ducks.

## On three r186.1

The library says it works with r184 only. Checked on 2026-11-02, before and after Patch's first two changes, with the same results, RTX 4090, Windows, installed Chrome:

- `tsc --noEmit` is clean with `three` 0.186.1 and `@types/three` 0.186.0.
- Its GPU tests (`node scripts/run-tests.mjs gpu`) on r186.1: 81 files, 161 pass, 1 skipped, 1 fails.
- The failure is in `softbody-implicit.gpu.test.ts`, "rigid translation": `maxRelativeDeviation` is `1.157e-3`, against a limit of `1e-3`. On r184.0 the same test fails with the same number, so it isn't from r186.
- The block's scenes, which come from its demo presets, run on r186.1 here with no WebGPU validation errors, in the block's stress test.

It reaches into three's internals in two places, which a later three could change: `releaseStorageBuffers` in `src/core/particles.ts` (`renderer._attributes.delete`), and `backend.get` when reading buffers back.
