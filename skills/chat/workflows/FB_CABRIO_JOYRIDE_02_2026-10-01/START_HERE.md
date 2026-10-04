# FB-CABRIO-JOYRIDE-02 · Answers from the Blender lane to the J17 RETURN

To: Claude Design (Joyride J17). From: Coworker (Blender MCP lane), 2026-10-01.
Read with: J17 `RETURN.md`, `TEST_REPORT.md`, `VEHICLE_SEAT_CONTRACT.j17-patch.json`.
All numbers below are measured in the FB-CAR-01 Blender scene (FB v5b, cabrio at ×1.8, driving clip frames 80 / 140 / 200). Georg judges the look.

## 1 · My own defect first

J17 is right: in FB-CAR-01 the hands did **not** reach the wheel.
- In the reference the wrist stayed **0.07–0.12 rig (4–7 cm)** short of the grip.
- My START_HERE said "both hands on the wheel" from a picture, not from a number.
- The contract carries a seat that cannot reach. That is why J17 had to invent the reach-lean.

## 2 · Hands: move the wheel, not FB

Measured: shoulder-to-grip distance divided by arm length (upper + lower arm 0.502 rig), worst arm over frames 80 / 120 / 160 / 200. The wrist reaches at ≤ 1.00; the grip point sits mid-palm (hand 0.112 rig), so up to about 1.10 the palm still closes on the rim.

| Wheel position | Grip at 10/2 | Grips follow the wheel ±20° | ±40° | ±60° | ±106° (J17 race) |
|---|---|---|---|---|---|
| contract (as delivered) | 1.21–1.25 | 1.23–1.27 | 1.28–1.31 | 1.34–1.37 | 1.50–1.53 |
| **0.10 rig (6 cm) closer to FB, along the wheel axis** | **1.01–1.05** | **1.04–1.08** | 1.09–1.13 | 1.17–1.19 | 1.35–1.37 |
| 0.18 rig closer | 0.86–0.90 | 0.89–0.92 | 0.95–0.98 | 1.03–1.06 | 1.24–1.26 |

**Proposal (contract r2):**

1. **Steering wheel 0.10 rig closer to FB.**
   - In car-native units: −0.0556 along the wheel axis `n`, applied to the node `SteeringWheel`.
   - Measured result: wrist-to-grip **0.000–0.024 rig**, with no lean (frames 80 / 140 / 200).
   - Body and ears against the rim: 0 (arms excluded). At 0.18 the belly hits the rim (32 edges), so 0.10 is the limit.
   - Picture: `wheel_reach.jpg`.
2. **Hands slide on the rim at speed.**
   - The grips follow the wheel only up to ±30°. Beyond that the rim turns under the hands, which stay at their car-space angle.
   - This keeps the ratio at about 1.10 or below in every steering state (±40° is already 1.09–1.13). Hand-over-hand can come later as a cartoon beat.
3. **Drop the reach-lean (0.30 rad) or reduce it to a small expressive lean.**
   - It is no longer needed for the reach.
   - It is also the main cause of the ear hits, see §3.

## 3 · Ears in the car: caused by the lean, not by the ear limits

Ear sweep in the seated pose: total back 0–90° (root-heavy shares 0.65 / 0.25 / 0.10), sideways −55…+55°. Count = overlapping ear/car triangle pairs (BVH overlap) against every visible car part (seat, door, body, folded roof, interior, mirror).

| Upper body | Ears back 0° | 30° | 60° | 75° | 90° |
|---|---|---|---|---|---|
| upright (clip pose) | 0 | 0 | 0 | 0 | 0 |
| leaned forward 0.30 rad | 156–865 | 0 | 0 | 0 | 0 |
| leaned back 0.30 rad | 0 | 0 | 0 | 0–76 | 0–512 |

(Each cell: minimum to maximum over the sideways sweep.)

- With FB upright, the whole floppy envelope is free of the cabrio. **No ear-vs-car collider is needed for the cabrio.**
- The hits in J17 come from the lean, and from the body roll stacked on top of it (see §5).
- Keep the ToolBox ear limits as they are.
- If ears still touch at race speed after §2: cap the wind speed fed to `ear-dangle` while seated (starting value 12 m/s, not measured). Georg judges it.

## 4 · Hop out and landing

1. **Ears during the hop.** The reference had no ear physics in the hop. In J17 the ears swing into the car at take-off.
   - Proposal: during the hop (dip → flight → land) blend the ear dangle towards stiff (stiffness ×3 or blend to rest 0.7). Release it over the 10 landing frames.
2. **Hand / body at the start of the hop out.** The hands are still on the rim when the flight starts.
   - Fade the arm IK out during the 10-frame dip, as the contract says (`ik` 1 → 0 over the dip), and check that it actually reaches 0 before frame 1 of the flight.
3. **Shins in the seat edge on landing.** Caused by the straightened knees (j17 patch `legs`).
   - In the reference, with the clip's own knees, the legs touch the seat only lightly: LegLeft 12 triangles at standstill.
   - Proposal: no knee straightening during the hop. Blend it in after the landing dip, if Georg keeps the straight legs at all (see §6).

## 5 · J17's own caps

| j17 patch | Lane view |
|---|---|
| Bounce: input × 0.25, clamp ±3 cm | Fine. The contract spring was tuned on a test loop without real suspension. Take this into contract r2. |
| Body roll: clamp ±0.06 rad | **Better: 0 in J17.** The contract's body roll was only for my test loop, which had no physics roll. J10 already rolls the car, so adding mine doubles it. Contract r2: "car body roll only where the runtime has none". |
| Reach-lean 0.30 rad | Replace it with §2. |
| Legs: knee 0.9 down-forward, thigh 0.12 | In `legs-side-body-hidden.jpg` the legs stick out almost horizontally. That is a look question for Georg. The alternative is the clip's own knees plus the bounce cap. |
| Wrist toward the rim centre 0.85 | Fine. Re-check after §2. |
| Mirror 4 cm up, 14 cm forward | Fine. Take it into contract r2. |

## 6 · For Georg (look decisions)

1. Steering wheel 6 cm closer + hands slide on the rim at speed: yes or no?
2. Legs: straight forward (J17) or bent from the driving clip?
3. A small expressive lean into corners (not a reach-lean): wanted?
4. Camera: chase distance by vehicle length. This is for the J09/J10 owner (WSA). For example, scale the distance by length / 4.3 m: 0.64 for the cabrio.

## 7 · Files

- `BRIEF_DESIGN_J18.md`: the build brief for Design (checkable acceptance).
- `VEHICLE_SEAT_CONTRACT.v0.2.json`: contract with the wheel shift and the rule changes above (v0.1 stays in FB_CAR_01).
- `HANDOVER_WSA.md`: camera owner question, contract location, router writeback.
- `wheel_reach.jpg`: as delivered vs wheel 0.10 closer (passenger view + top view, frame 140).
- `source/`:
  - `reach.py`: reach ratios;
  - `wheelshift.py`: body vs rim;
  - `wheelfix.py`: wrist-to-grip with the shifted wheel;
  - `earenv.py`, `earenv2.py`: ear envelope.
