# POSTMORTEM · Hybrid Surface v2 frozen candidate

## SOURCE / goal

The bounded goal was to improve the real-asset Hybrid Surface v1 proof without changing consumer owners:

- stronger clay/grain/handmade materiality;
- softer seam behavior;
- preserve original color/maps and useful source roughness/specular character;
- measured head-size-based cross-rig scaling;
- same exact Dungeon + five real actors.

## WORKING PARTS

### Proven
- Browser boots and reaches `ready`.
- Exact Dungeon recipe and all exact actors load.
- Head proxies resolve after the Object3D measurement correction.
- Head-size normalization is deterministic and measured.
- Legacy remains shorter than the Medium reference.
- Black Knight remains taller than the Medium reference.
- One shared RGB texture is used for the macro field.
- Grain is procedural 3D FBM and introduces no second texture projection.
- Original map/color references are preserved.
- Original roughness/metalness values are preserved at the base material.
- Actor source roughness distribution remains non-uniform (observed values include 0.30, 0.40, 0.42, 0.45, 0.50, 0.85, 0.98 and 1.00).
- Environment shader programs compiled in the proof.

## FAILURE EVIDENCE

Run 4 stops at:

`FAIL visible actor shaders compiled`

Observed actor stats:
- meshes: 67
- decorated materials: 64
- preserved special materials: 7
- compiled decorated shader markers: 58
- proof-counted effectively visible decorated materials: 63
- effectively visible compiled: 58

Run 3 showed the same 58/63 mismatch. The Run-4 visibility-accounting repair did not change the result.

## PROVEN CAUSES

- **PROVEN:** the current proof does not observe `onBeforeCompile` for five decorated actor materials before it reaches the compile gate.
- **PROVEN:** simply following ancestor `visible` state does not explain those five records.
- **PROVEN:** the current statistics do not name the five mesh/material records, so the proof cannot yet distinguish a legitimate dormant/variant path from a renderer/program problem.
- **PROVEN:** continuing to adjust the same census without identifying the records would violate the two-pass recovery rule.

## HYPOTHESES — NOT RULES

Any of these may explain some or all five, but none is proven yet:
- geometry/material is technically visible in the scene graph but not submitted to the renderer;
- variant/dormant sub-mesh logic not reflected by simple visibility flags;
- frustum/culling or zero-contribution geometry;
- material sharing / draw-path behavior;
- proof expects compilation of materials that a valid frame never needs.

Do not weaken the assertion or modify the shader based on these hypotheses.

## SALVAGE

The shader/material candidate and head-scale calibration are preserved unchanged at the frozen runtime head. They remain **REUSE_CANDIDATE / NEEDS_DIAGNOSTIC**, not accepted production defaults.

## PUBLIC DEPLOYMENT

None for v2. Do not publish the failed candidate as a human Stage.

The public v1 Stage remains the last verified human surface:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-scene-lab/`

## GEORG ACCEPTANCE

None for v2.

## OPEN

One diagnostic gate: identify the exact five decorated actor materials not observed compiled, source-isolate them, and classify the renderer path before deciding whether code or proof should change.
