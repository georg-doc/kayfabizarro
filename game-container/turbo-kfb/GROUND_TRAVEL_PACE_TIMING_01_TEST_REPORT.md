# GROUND-TRAVEL-PACE-TIMING-01 · Test Report

Status: **SOURCE BROWSER PASS · PUBLICATION PENDING**

## GROUND-TRAVEL-PACE-TIMING-01 · source browser PASS

Tested implementation head: `ada92c557d3ef24dd18e511b4cff6f18e8b721fc`  
Actions run: `36601155065` · job `109518578915`  
Artifact: `11048319690`  
Digest: `sha256:5fec8973a084c5c3f5cd4957dea32bb9c7c28bd05ccb7be8eebb027b199d4e28`

Result:
- Travel pace/timing static: **12/12 PASS**
- integration static: **10/10 PASS**
- full Turbo baseline browser: **29/29 PASS**
- existing Ground+Orbit browser: **27/27 PASS**
- dedicated Travel cadence/timing browser: **23/23 PASS**
- runtime/page/console errors: **0**

Measured Travel behavior:
- cadence multiplier: **1.8×**
- Running_A world target: **4.4644935006 u/s**
- Running_B world target: **5.4511465643 u/s**
- 15-FPS W: raw **0.8 s** = simulated **0.8 s**, dropped **0**
- settled W: **4.4534271276 u/s**
- W playback: **1.7955382461×**
- 0.8-s W travel: **3.01 u**
- 15-FPS Shift: raw **0.6 s** = simulated **0.6 s**
- settled Shift: **5.4400629025 u/s**
- Shift playback: **1.7963401110×**
- Shift release: direct `Running_A`
- 0.5-s severe stall: bounded to **0.25 s** catch-up / **0.25 s** dropped
- Orbit retained

Baseline preservation:
- Explore displacement **28.91 u**, speed **33.23 u/s**
- Race: **8 karts**, drive displacement **22.51 u**
- no-query Ground Run remains **2.4802741670 u/s**
- legacy Jump Start → Air → Land PASS
- measured Ground+Orbit profile remains **27/27 PASS**

Exactly one next gate: publish this exact runtime to the existing Pace-Tune Stage route, update Hub copy to `Travel 1.8× + Timing`, and require exact public Chromium proof before returning it for Georg freeplay.

