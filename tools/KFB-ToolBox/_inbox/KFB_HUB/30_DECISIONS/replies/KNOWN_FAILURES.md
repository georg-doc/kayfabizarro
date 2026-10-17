# KFB known failures · required reading for every session (V-393)

Read this before every job. If one of these happens: **stop and report to WS0, do not keep tuning**. A known failure gets one local attempt at most, then it goes to the module owner.

| # | Failure (has happened repeatedly) | Rule | Correct source / module |
|---|---|---|---|
| F1 | **Figure without KFB eye rig** (raw KayKit/Meshy eyes): V-200, V-201, V-214, mummies on 17.10. | Figures are always delivered and staged with the KFB eye rig, unless the figure card says `eyeRig: none` with a reason (V-061, V-219, V-227) | `figures/<id>.figure.json` (V-391); EyeRig v6; EYE-CLEANUP-01 anchors |
| F2 | **Wrong part removed**: Orc Brute lost teeth or got a wrong mouth | Remove only the original **eyes**; keep mouth, teeth, brows, ears unless the card lists them under `originals.remove` | figure card `originals.remove/keep` |
| F3 | **Proof without clay material** | Always clay (V-346), figure sheen ≤ 0.05 | clay-material.v8 + figure profile |
| F4 | **Bright seam / halo** at silhouettes and shadow sides (rim or back light, fresnel, sheen): V-382 plus 5 rounds at WSB on 17.10. | No rim and no back light. Separation comes from the warm character light on the camera side + contact AO | `kfb-stage-light.v1` (V-392) |
| F5 | **Light gap under feet, balls and props** (fixed bias number from a different scale) | Bias is derived from texel + depth range, never a fixed number; parts that sit in each other get contact AO, not more bias | `kfb-stage-light.v1`: `fitShadow`, `contactAO` |
| F6 | **Every stage builds its own light** | No stage builds light/shadow itself; deviations only as module parameters | `kfb-stage-light.v1` |
| F7 | **Private light tricks per layer** (unlit card, separate tone curve, emissive face) | One rig, one tone curve, one material response | LIGHT_MODEL_R2 (V-385/386) |
| F8 | **Raw KayKit GLB as actor in a stage** | Stages load only figure cards | V-391 |
| F9 | **Overlays cover the subject** | Clean image, controls at the edge | V-383 |
| F10 | **Foot or drive test below 50 fps counted as PASS** | Test at ≥ 50 fps and at 30 fps throttled | V-138, V-379 |
| F11 | **Credits/costs without a cap** (e.g. 4 variants × 12 prompts) | State the credit budget before every generation; 1 variant first | V-388 |
| F12 | **Internal tool names to Georg** ("Motion Lab", stage ids) | Only the five places from TOOL_MAP | V-390 |
