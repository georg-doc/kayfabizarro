# Brief · Joyride J18 · FB in the cabrio, fixes from FB-CABRIO-JOYRIDE-02

To: Claude Design (Joyride), on top of J17 (`JOYRIDE_J17_2026-10-01`).
From: Coworker (Blender MCP lane), 2026-10-01. Georg judges the look; WSA owns the camera.
Read first: `START_HERE.md` in this folder (measurements), then `VEHICLE_SEAT_CONTRACT.v0.2.json` (replaces v0.1 and the j17 patch where they differ).

You are a sparring partner. If a rule below fights the J17 runtime, say so with evidence and propose the better cut. After two failed attempts at the same gate: freeze, evidence side by side.

## 1 · Build

1. **Wheel shift.** Move the `SteeringWheel` node by −0.0556 × axis (car native).
   - New centre: `[-0.3802, 0.1934, 0.2688]` (v0.1 `[-0.3802, 0.248, 0.2582]`).
   - Put it behind a switch `seat.wheelShift` with the values 0 and 0.0556; the default is 0.0556.
2. **Reach-lean off** (`reachLean` 0). Keep the arm IK.
3. **Grips follow the wheel up to ±30°, then slide.** The rim turns on; the hands keep their car-space angle.
4. **Car body roll: 0 in Joyride.** J10 / K2B already rolls the car. Remove the extra ±0.06 rad clamp, because the extra roll is gone.
5. **Hop out:**
   - the arm IK reaches 0 by the last dip frame;
   - stiffen the ear dangle through dip, flight and landing, and release it over the 10 landing frames;
   - no knee straightening in flight; blend the leg pose in only after the landing dip.
6. **Keep from J17:** bounce input ×0.25 with a hips clamp of ±3 cm, the mirror offset, the wrist toward the rim centre at 0.85, scale A, roof open, windows down.

## 2 · Do not decide (Georg)

- **Legs:** J17 straight vs the driving clip's own knees. Build both as a switch and show both stills.
- **Expressive lean** into corners (≤ 0.10 rad, not for reach): build it as a switch, off by default.
- **Chase camera distance:** this belongs to WSA / the J09 owner. Do not change the camera.

## 3 · Acceptance (numbers in RETURN; only executed tests say PASS)

| # | Test | Pass |
|---|---|---|
| 1 | Hands at 26 km/h and at race speed, full lap | wrist-to-grip ≤ 0.05 rig at 20 sampled frames; log the largest value and the wheel angle at that frame |
| 2 | Ears vs car while driving, full lap at race speed | 0 ear-through-seat / door / body at 20 sampled frames (same probe as J17) |
| 3 | Body / forearm vs rim at standstill | 0 intersections except hands on the rim |
| 4 | Hop out, every 2nd frame | no FB part (body, hands, ears) through door, seat, windscreen or body |
| 5 | Landing | shins vs seat edge: 0 intersections |
| 6 | Car roll | car body roll angle over a lap logged; it equals the J10 roll (no extra term) |
| 7 | Lap | 7/7 jumps, 0 barrier hits, lap time next to J17 (91.60 s) |
| 8 | fps on Georg's device | NOT_RUN is allowed; say so |

Stills to take and look at before returning:
- three-quarter hands at 26 km/h and at race speed;
- legs side view, both leg variants;
- hop out: 4 frames;
- chase camera straight and curve, unchanged.

## 4 · Return

The usual session cut: RETURN with problems first, TEST_REPORT, the stills, and an additive changelog. Nothing is merged or promoted.
