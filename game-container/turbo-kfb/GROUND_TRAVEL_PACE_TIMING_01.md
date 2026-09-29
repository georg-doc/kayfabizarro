# GROUND-TRAVEL-PACE-TIMING-01

Status: IMPLEMENTATION CANDIDATE · TESTS PENDING
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
