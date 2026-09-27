# S9b · trucks through loops · core v0.8.1 · 2026-09-27

**Georg (27.09):** trucks should be able to drive through loops too. This closes canon question C8 of `RECON_OLD_RACER_2026-09-27.md`.

**Stage / Live / merge:** none.

## Defects and limits first

- The check is **geometric only**. It says the space is free; it does not say a truck reaches the top. Speed and grip through a loop are physics, owned by Race (D4). In cartoon physics with `locked` magnet runs this is a tuning question, not a geometry one.
- The loop body is a box: 7 m (4 m tallest truck + 3 m reserve) along road-up, road width + 0.5 m each side, ±3.25 m along the road (the longest race-scale vehicle, heavy 6.5 m). Mechs taller than a truck are out, as decided in S8b.
- The old RKIT rule (2.5–2.7 m leg clearance) is lateral clearance between the legs. It stays in `self_clearance` and is unchanged.

## What changed

- **Core v0.8.1**: new check `loop_envelope` (error severity). For every loop sample it finds the lowest point of any other part of the track (other side of the loop, legs, barriers) inside the vehicle box over the road. The track's own road under the body (±6.5 m along s) is excluded.
- New constant `LOOP_BODY_HALF = 3.25`.

## Result

All existing loops already pass. Nothing had to be rebuilt.

| Track | Loop | Free height over the road (need 7.0 m) |
|---|---|---|
| TD03 / TD04 / TD05 | roof loop H 26 | 16.79 m |
| FS01 | mini loop H 16 | 10.77 m |
| TN01 | sun loop H 60 | 43.28 m |
| seed fixture | – | 11.86 m |

Rule of thumb from a sweep (straight in, loop, straight out): **a loop of 16 m height clears trucks at every width class.**

| Width | Free height at H 16 |
|---|---|
| NARROW | 11.75 m |
| STANDARD | 12.76 m |
| WIDE | 13.40 m |
| HERO | 14.18 m |

Smaller loops fail. At 10 m (STANDARD) the free height is 2.05 m; this is the negative control in the tests. Some widths pass from 11–14 m, but the passing height does not grow steadily with width, so 16 m is the safe floor.

## Tests

`node test.mjs`: **242 / 242** expected, 0 unexpected (was 234). The eight new results are `loop_envelope` on seed, TD03 / 04 / 05, FS01 and TN01, plus the width sweep and the negative control.
