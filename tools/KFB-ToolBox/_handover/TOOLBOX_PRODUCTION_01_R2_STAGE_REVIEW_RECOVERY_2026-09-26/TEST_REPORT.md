# TEST REPORT · ToolBox Production-01 r2 Stage Review Recovery

Date: 2026-09-26  
Owner: ToolBox receiving owner PR #185  
Review PR: #221  
Review branch: `chatgpt-web/toolbox-r2-stage-review-recovery-2026-09-26`

## Frozen predecessor

PR #220 / `chatgpt-web/toolbox-r2-stage-review-2026-09-26` remains frozen failure recovery. It is not modified or published by this slice.

## Attempt 1 · diagnostic FAIL

- head: `ca29465273047eed0d50b3c5ffb00a5a1b45ca98`
- Actions run: `36200889669`
- browser job: `108287074092`
- source object / owner pins / PoseRig / EarRig / pack loading all passed before the gate failures.
- failure A: source framing reported `maxY 839.74` beyond safe bottom `810`.
- visual artifact showed the more important root cause: the skinned EarRig ear tips were actually clipped, while static `Box3.setFromObject()` under-reported their bounds.
- failure B: explicit `walk → walk.fast` event fired, but the second event timed out because semantic state timing used the render delta capped at 40 ms.
- artifact: `10892041579` · source screenshot only.

## Repair pass

Review-surface only; no runtime owner source changed.

1. replace static actor bounds with precise skinned visual bounds:
   `new THREE.Box3().expandByObject(figure, true)`;
2. add conservative width/height fit reserve;
3. drive semantic state timers from real elapsed time while retaining the capped render/mixer/movement delta;
4. retain explicit `kfb:semantic-transition` evidence and safe-area assertions.

## Attempt 2 · PASS

- implementation head: `8c25f3a904e4d877cc39367d8b88eed50e202491`
- Actions run: `36201152882`
- browser job: `108287867803`
- result: **33/33 PASS**
- artifact: `10892306034`
- artifact digest: `sha256:0638bd6907cc65551c9e718fefe1d2490eb1f9a2fd785e68af89d3ce2090a49f`

Measured evidence:

- all three KayKit packs loaded: General 15 · MovementBasic 11 · MovementAdvanced 13;
- PoseRig handR lower-chain: 0.3162 m vs naive child 0.0738 m;
- both three-bone ear chains found;
- source actor + ears inside safe chrome;
- actor movement: **0.546 m**;
- explicit semantic events: `walk → walk.fast → run`;
- state actor + ears inside safe chrome;
- jump semantic role reached `jump.air`;
- direct IK miss: **0.0822** with target displacement **0.2184**;
- pose actor + ears inside safe chrome;
- runtime errors after interaction: **0**;
- browser page/request failures: **0**;
- mobile 390×844: no horizontal overflow, full-height stage, actor + ears inside safe chrome.

## Screenshot review

Visually inspected from the exact successful artifact:

- `source.png`: exact `FB_TEMPLATE_LOOK_v5` source shown in isolation; both complete ear tips visible;
- `state.png`: moving actor is fully framed; ear silhouette not cropped;
- `pose-ik.png`: complete ears and red hand IK target visible;
- `mobile.png`: complete actor including both ears remains between toolbar and readout.

## Status

**CI_PASS / LOCAL_ARTIFACT_VISUALLY_VERIFIED.**  
Public Cloudflare Stage and Georg human acceptance are separate subsequent gates.
