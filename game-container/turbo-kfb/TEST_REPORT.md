# KFB Container Turbo-01 · Browser Test Report

Tested runtime head: `b4c7bb14cb51d6c5515613593b33c0ea0e183e89`
Run: `36548532308`
Artifact: `11023896755`
Digest: `sha256:c18e1193c79165efdd410337b521d309a646c48e831d9118e4acfeb2568132e0`

## Result
**29/29 PASS**
- runtime errors: 0
- page/console errors: 0

### EXPLORE
- title + entry + mode + one player kart PASS
- Race ItemSystem off PASS
- drive displacement 28.91 u PASS
- speed 33.23 u/s PASS

### Race regression
- 8 karts PASS
- countdown → racing PASS
- player drive displacement 22.51 u PASS

### Ground consumer
- pinned ActionFigure source PASS
- exact 6 clips PASS
- starts Idle_A PASS
- no Root/Hips world translation PASS
- Walk movement + Walking_A PASS
- Run + Running_A PASS
- measured Run consumer speed 2.480274167... PASS
- Run → Walk PASS
- Stop → Idle PASS
- Jump_Start → Jump_Idle → Jump_Land PASS

## QA recovery
The prior 0.04 u failures were caused by rAF throttling in the headless runner. Deterministic `advanceBy(seconds)` fixed the proof clock without retuning gameplay.

## Stage
`cloudflare-live@563d3c1f1c0ed89bf810ba7448db8e90bf0a30f3`
Cloudflare Pages: SUCCESS.


## 2026-09-29 · GROUND-ORBIT-INTEGRATION-01

Tested runtime/QA head: `9a71c79d63cd985f0ab622e4309656ab522ccea4`
Actions run: `36557928700`
Artifact: `11029226537`
Digest: `sha256:8aadac4950f6b877cc06451613ad83788be28b47982a847d5c657ae42bf93ce3`

### Result
- Locomotion donor static: **16/16 PASS**
- Orbit integration static: **10/10 PASS**
- B2 browser regression: **29/29 PASS**
- Velocity locomotion: **22/22 PASS**
- Combined Velocity + Orbit: **27/27 PASS**
- runtime errors: **0**
- page/console errors: **0**

### Combined Ground facts
- exact semantic source clips include `Running_B`, `Walking_Backwards`, `Running_Strafe_Left/Right`;
- Walk = 0.6109509569 u/s;
- Running_A ramp = 2.5867839515 u/s;
- Running_B sprint = 3.0240851618 u/s;
- jump apex = 1.2075871706 u; nominal air = .78 s; sprint-jump travel = 3.90 u;
- Orbit mounted with drag / wheel zoom / C recenter;
- drag moved camera 7.66 u;
- zoom target distance 7.50 → 3.52 u;
- recenter yaw diff = 0;
- no root-motion world translation.

No Stage claim in this report until the dedicated public route is deployed and verified.
