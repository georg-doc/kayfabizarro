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


## Ground + Orbit Public Closure

Direct Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-orbit-integration-01/?ground=1&groundFeel=velocity`

Publication:
- `cloudflare-live@65c00aed4a9e0250b0850d1b170460d9ea66126e`
- final metadata `cloudflare-live@0f2e05889189c736d4efc69a0bfaafa0d2b2cd1a`
- Cloudflare Pages: **SUCCESS**

Final public proof:
- run `36559579811`
- job `109376914403`
- **18/18 PASS**
- artifact `11029408390`
- digest `sha256:0ec22fc23ce71dd2e6f84b34bb5d0772ba2895f5d84074ba17f50314546e48f5`
- exact tested runtime marker visible
- Hub integrated link PASS
- runtime/page/console errors: 0

Status: **PUBLIC VERIFIED**.


## GROUND-WALK-PACE-TUNE-01

Tested head: `d6e9d42149670af290d96fe19dfdc28095f2f337`
Run: `36582612505`
Artifact: `11040906054`
Digest: `sha256:ae9e6929c02fcf0357fb7c57228d168a64561f7b9d5f21f152ccd8f1f6a3289e`

- static: **6/6 PASS**
- Ground+Orbit regression: **27/27 PASS**
- Travel-Walk: **14/14 PASS**
- errors: 0

Travel profile:
- query: `ground=1&groundFeel=velocity&walkPace=travel`
- Walking_A target: 1.0997117224 u/s
- playback: 1.8×
- settled: 1.0989688245 u/s
- Run tier: Running_A @ 2.7251 u/s
- Sprint: Running_B @ 3.0254 u/s
- release → Walking_A @ 1.1019 u/s
- Orbit retained.

No public Stage claim yet.
