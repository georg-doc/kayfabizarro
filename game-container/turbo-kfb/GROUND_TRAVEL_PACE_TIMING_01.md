# GROUND-TRAVEL-PACE-TIMING-01

Status: SOURCE BROWSER PASS · PUBLICATION PENDING
Date: 2026-09-29
Owner: Turbo Ground / existing walk-controller + ground-player
Branch: `chatgpt-web/kfb-ground-travel-pace-timing-01-2026-09-29`
Base: `542eedb91f96b6f718df9e619fb3d3f746b79854`
Stage route on PASS only: `https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

## Outcome
Repair the remaining human locomotion complaint without reopening Race/Explore/legacy Ground:
- normal W remains `Running_A`;
- Shift remains `Running_B`;
- Travel gameplay cadence = **1.8×** source reference;
- world speed and clip playback are multiplied together to preserve foot/world synchronization;
- Travel-only live timing catches elapsed wall-clock time in 1/60-s slices instead of discarding time above 1/30 s.

Targets:
- W / Running_A: `2.4802741670129 × 1.8 = 4.46449350062322 u/s`;
- Shift / Running_B: `3.028414757922751 × 1.8 = 5.451146564260952 u/s`.

## Boundaries
- source `referenceSpeed` values remain measurement truth, not gameplay defaults;
- no root-motion world translation;
- no new movement owner;
- no change to Race/Explore/no-query Ground timing;
- no change to backward/strafe or actor-scale Jump;
- no Enter/Exit Kart;
- no public replacement until source browser PASS and exact Cloudflare proof.

## Recovery input
The previous global timing candidate is frozen and rejected for reuse as a foundation:
`skills/chat/workflows/GROUND_WALLCLOCK_TIMING_01_FAILURE_RECOVERY_2026-09-29/`

Only its proven root finding is reused: the live 1/30 clamp can discard wall-clock time below 30 FPS.

## Exactly one gate
Static + full Turbo baseline + existing Ground/Orbit regression + dedicated Travel 1.8× / 15-FPS wall-clock proof must all pass. Then publish the same direct Stage route for Georg freeplay.


## Tested result
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
