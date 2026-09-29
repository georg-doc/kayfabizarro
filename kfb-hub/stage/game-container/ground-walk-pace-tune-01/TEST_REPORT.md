# GROUND-TRAVEL-PACE-TIMING-01 · Stage Test Report

Status: **SOURCE BROWSER PASS · PUBLIC PROOF PENDING**  
Date: 2026-09-29

## Exact source
- runtime head: `ada92c557d3ef24dd18e511b4cff6f18e8b721fc`
- source handoff: `4eeee4b869fdda344339055767c6ddf224f03c99`
- Draft PR: **#291**
- source run/job: `36601155065` / `109518578915`
- artifact: `11048319690`
- digest: `sha256:5fec8973a084c5c3f5cd4957dea32bb9c7c28bd05ccb7be8eebb027b199d4e28`

Source checks:
- Travel pace/timing static **12/12 PASS**
- integration static **10/10 PASS**
- full Turbo baseline **29/29 PASS**
- Ground+Orbit regression **27/27 PASS**
- Travel cadence/timing **23/23 PASS**
- errors **0**

## Travel calibration
- W = `Running_A`
- Shift = `Running_B`
- gameplay cadence = **1.8×**
- W target = **4.4644935006 u/s**
- source-observed settled W = **4.4534271276 u/s**
- W playback = **1.7955382461×**
- Shift target = **5.4511465643 u/s**
- source-observed settled Shift = **5.4400629025 u/s**
- Shift playback = **1.7963401110×**
- 15-FPS ordinary frames drop **0** elapsed time
- 0.5-s severe stall catch-up is bounded to **0.25 s**

Direct Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

Public proof: **PENDING**
