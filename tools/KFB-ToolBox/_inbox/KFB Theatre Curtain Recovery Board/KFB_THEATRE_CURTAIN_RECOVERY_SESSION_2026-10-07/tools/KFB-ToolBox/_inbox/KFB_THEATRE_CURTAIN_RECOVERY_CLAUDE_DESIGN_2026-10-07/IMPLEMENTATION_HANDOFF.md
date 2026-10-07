# IMPLEMENTATION_HANDOFF · for the later runtime owner

## Files
- `candidate/kfb-curtain-core.js` — the module (three.js r0.186 WebGPU + TSL; no other deps)
- `candidate/kfb-curtain-host-demo.js` — reference host: renderer, lights, env, actors, loader facts, input
- `candidate/standalone.html` — plain page mounting the demo host (no Design Component runtime)
- `/KFB Theatre Curtain Recovery.dc.html` (project root in Claude Design) — viewer with mode/material/hardware switches
- `donor-probe.html` + `donor/` — unchanged donor isolation

## Integrate (in this order)
1. Import the core into the consumer; host keeps its own renderer/camera. Requires `requiredLimits: { maxStorageBuffersInVertexStage: 1 }` like the donor.
2. Call `warmup()` before the first visible frame (≈ 900 compute pairs; measure on target GPUs).
3. Drive `update(renderer, dt)` from the host clock. Do not use `THREE.Timer` with page visibility for the curtain.
4. Map real loader progress to `setFootlights()`; set `revealAllowed` from the host's minimum-playable-bundle fact.
5. Gate on `isSupported()`; without WebGPU use `createFallbackCurtain()` (`fallback_reveal`) — product decision whether a WebGL path is needed.

## Budgets measured / not measured
- Sim per frame: 2 panels × 6 steps × 2 dispatches = 24 compute dispatches at 60 fps; cloth 65×49 vertices per panel (r3).
- Compute stage uses exactly 8 storage buffers (WebGPU default limit). Pack any new per-vertex data into an existing buffer.
- Not measured: frame time on low-end/mobile GPUs, warm-up time, memory. Measure before Live.

## Motion tuning
All opening/closing feel lives in `MOTION` (exported from the core): `aMax` = how hard the pull starts, `vMax` = run speed, `zetaOpen/zetaClose` = how much it rebounds, `overOpen/overClose` + `bounce` = the end stop. Cloth momentum = `dampeningUniform` (0.992).

## Known open seams
- Tieback quarantined (needs self-collision or a pinned tie row; do not enable as is).
- Ring-rail mode: rail sits above the arch apex and rings read small at the loading camera; pelmet mode is the default.
- Outer cloth edges briefly show a sliver of stage during impact; tune impulse falloff toward the wing if visible in product.
- Actor idle clips: binding not verified for FrizzleBob v5b or Rig_Large.
- Real visible-tab loop only checked through the Claude Design preview; confirm once in a normal browser tab (donor handover asks the same).
