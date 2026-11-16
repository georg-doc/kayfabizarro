# Particle physics → KFB / Claude Design · separate source donor R1

Exact original: https://patch.gg/patch/particle-physics
Actual clone_url verified through API /repo: https://git.patch.gg/patch/particle-physics.git. API/tree and central mirrorHEAD788280e4e0b3dfa7c46dcdda5a1742a97f522f92 (1.0.9). One mirror ~/.codex/mirrors/patch--particle-physics.git created --mirror --filter=blob:none; server ignored filtering, recorded once. No fallback clone/global install.

## Source closure/notices

CodeMIT©2026Patch. Upstream Three.js Particle Fluids©2026DanielGreenheck, MIT, commit26ebfd2, with3 Patch fixes explicitly documented in vendor/threejs-particle-fluids/VENDOR.md (shared viewport textures, skinning grid, mesh-fill grid). Keep rootLICENSE,LICENCE-NOTES.md,README.md and vendorLICENSE/VENDOR. Closed reusable library: all81 TypeScript files under vendor/threejs-particle-fluids/src/. Root index.ts reexports Simulation/core/fluids/softbody/cloth/gas/sdf; minimal high-level Simulation also traverses these families, do not arbitrarily delete source files. External three0.186.1; source README tested @types/three0.186.0 +@webgpu/types0.1.74 with allowImportingTsExtensions. No unrelated npm-version substitution (upstream package constrainedr184).

original/src contains separate untouched example scene/studio code for reference; it is not a KFB runtime module. Code-only packet omits all binary art/fonts/media. Art claimsCC0 apply only to individually documented source assets, not a license to invent or substitute models. LICENCE-NOTES expressly excludes Stanford bunny; never recover it from upstream under Patch's CC0 label. No sounds.

## Receiving contract and actual limitation

Import Simulation and createParticleRenderer from vendor src/index.ts. new Simulation({renderer,scene,camera,container:Box3,particles}) adds its meshes to that suppliedscene. addFluid({box}), addSoftbody({mesh,density,softness}), addCloth({width,height,pin}), addSmoke(), addFloor(), addSphere/Box/Capsule/Mesh(); colliders can follow host Object3D. await sim.step() before the ONE host renderer.render(scene,camera); dispose() host-lifecycle owned. It does not render a frame itself.

REQUIRES WEBGPU. There is no WebGL fallback: source README reports firstsim.step() on WebGLRenderer failscomputeAsync. createParticleRenderer requests compute limits1024 invocations/workgroup, sizeX1024,10storageBuffers/shaderStage; merge with host limits. Liquid reads viewport textures. Source reports multi-render-target cloud/forest renderers can fail copyFramebufferToTexture source/destinationformat mismatch, even whenlimitsmatch. This is not certified for the current Racer's WebGLrenderer.

Therefore donor intake only for later bounded owner review. Do NOT add a second renderer/frame loop, replace current Rapier, or silently convert the Racer to WebGPU. An eventual compatible WebGPU host must decide GPU compute/viewport/render ownership and any rigid-body exchange. Particle-simulation colliders are not automatic Rapier coupling. Keep current engine/tyre VFX until that receiving contract is proven. Claude Design may study liquid/jelly/cloth/smoke source separately; no integrated product claim.

## Checks actually performed

Positive exactAPI identity/license/notices; cloneHEAD verification;101 original text files688904bytes recorded inSOURCE_LOCK; all81vendorTS relative imports resolve (TypeScript .js→.ts mapping). No tsc, GPU/browser run, collision coupling, KFBintegration or sustainedperformance check performed. No production/GitHub write/publication. Upstream test numbers in VENDOR.md are donor claims, not this intake's checks.
