# FB-CABRIO-JOYRIDE-01 · FrizzleBob drives the CVP1 cabrio as the default car in Joyride

To: Claude Design (Joyride, project "KFB World Design Setup"), on top of J15 (Session Cut 2026-09-30 r1).
From: Coworker (Blender MCP lane), 2026-09-30. Georg judges the look; WSA owns owner questions.
Status of this brief: **READY**. The Blender reference and the numbers exist; nothing here has run in Joyride yet.

Georg 30.09:
- Test FrizzleBob in the cabrio as the default in Joyride.
- Use the rigged FB v5 with the KFB eyes, mouth etc. (the ToolBox face), not a bare model.

You are a sparring partner, not an executor. If a rule below fights the J15 architecture, say so with evidence and propose the better cut. Stop at every human choice.

## 1 · What to build

1. **Default car = KFB_CVP1 cabrio**, roof open, side windows down.
   - The five KayKit city cars stay selectable; the cabrio is added to the list and becomes the default.
2. **FB sits in it and drives, visible.** J14/J15 currently hide the actor while driving.
   - FB sits in the driving pose, hands on the wheel (arm IK to the rim).
   - The wheel turns with the steering.
   - FB leans out of turns and bounces on bumps.
   - Ears blow back in the wind.
3. **Getting in / out = the hop.** Spacebar below 0.5 m/s currently cuts between car and foot.
   - For the cabrio, replace the cut with the hop: stand → crouch → jump over the side wall (door stays shut) → land seated. Getting out is the same, mirrored.
   - Timing and path are in the contract (§3). Other cars keep the J14 cut.
4. **FB's face and ears come from the ToolBox, not from a new copy:**
   - figure `FB_TEMPLATE_LOOK_v5b.glb`;
   - eyes, lids, mouth and brows through the ToolBox face modules (Production-06 r2: `kfb-lib/face-mount.v1.js`, `clay-lids.v1.js`, `ear-base.v1.js`);
   - `ear-dangle.v1.js` with the FB-EARS-FLOPPY-01 additions (preset "B · Floppy", wind contract `wind = sceneWind − characterWorldVelocity`).
   - If importing them into Joyride needs a decision about who owns what, stop and ask WSA. No second face or ear engine.

## 2 · Sources (read before building)

Branch `georg-doc-patch-3` @ `93abbf22d14335e517cac75cc79bf2022af45ee3`:

| What | Path |
|---|---|
| Blender reference, videos, findings | `skills/chat/workflows/FB_CAR_01_2026-09-30/` (START_HERE.md, three mp4s, renders/, source/) |
| **Seat contract** (seat socket, wheel, grips, IK rule, hop timing and path, lean / bounce / ears rules) | `skills/chat/workflows/FB_CAR_01_2026-09-30/VEHICLE_SEAT_CONTRACT.json` |
| Key poses (stand, seated_drive) + recipes (crouch, flight tuck, landing) | `skills/chat/workflows/FB_CAR_01_2026-09-30/POSES.json` |
| Cabrio GLB (r2 colours, light-blue glass, roof animation `C4D Animation Take`, open at frame 52) | `media/3D_Assets/Vehicles/KFB_CVP1/KFB_CVP1_cabrio.glb` |
| Car pack findings (doors, hinges, materials) | `skills/chat/workflows/VEHICLE_INTAKE_01_2026-09-30/` (+ `r2/README.md`) |
| FB figure | `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb` (1 790 024 B) |
| Ear physics additions | `skills/chat/workflows/FB_EARS_FLOPPY_01_2026-09-30/` |
| Eyes / lids | `skills/chat/workflows/FB_EYES_LIDS_02_2026-09-30/` |

Branch `main`:

| What | Path |
|---|---|
| ToolBox with FB face + ears live | `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-06/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/` |

Driving clip: `kfb_interaction_driving_a` (Motion Library v6, Rig_Medium, 151 frames, looped).

## 3 · Numbers you must not guess

All of these are in `VEHICLE_SEAT_CONTRACT.json`:

| | Value |
|---|---|
| Hips seat socket | car-native units |
| Wheel | centre, radius, axis, rotate node `SteeringWheel`, ratio 8, max 120° |
| Grips | 10 and 2 o'clock, inset 0.02 along the axis, parented to the rim |
| Seat shift | FB sits 0.10 rig units forward of the seat centre; otherwise the arms do not reach |
| Hop (frames at 30 fps) | stand 20 · crouch 12 · flight 20 · land 10; yaw +90° in flight |
| Lean / bounce / body roll | rules and gains in the contract |

## 4 · The scale question: stop here first (Georg)

Two truths disagree, and this brief does not pick one for Georg:

| Source | Scale |
|---|---|
| Georg 30.09 (VEHICLE-INTAKE-01 r2) | **Scale A:** KayKit as shipped, Medium = 1.5 m (0.616 m per rig unit). The cabrio at its seat-fit scale ×1.8 is then **2.74 m** long (it is the shortest car in the pack; native length 2.47 units). |
| J14/J15 today | The walking actor is 1.85 m (`FIG_H`); cars are scaled to `vehicles.len` = 4.3 m. |

If J15 scaled the cabrio to 4.3 m like the city cars, the driver FB would be **2.35 m** tall, while the walking FB is 1.85 m. The size would jump at every get-in and get-out.

- **Proposal to put to Georg** (do not decide it yourself): one scale for driver and walker, and the cabrio scale follows the character, never `vehicles.len`.
  - Either follow A: FB 1.5 m, cabrio 2.74 m, walker 1.5 m.
  - Or keep J14: walker 1.85 m, and scale the cabrio with FB inside so that FB is 1.85 m. The cabrio is then 3.38 m.
  - Either way the cabrio is shorter than the 4.3 m city cars and the 4.1 m race-scale car. Check the lap (acceptance 8) with it.
- Show Georg one still per option: FB standing next to the cabrio, and the cabrio next to a KayKit city car.

## 5 · Acceptance (each item = measured, with the number in RETURN)

| # | Test | Pass condition |
|---|---|---|
| 1 | Cabrio loads as the default car | roof at open frame; side windows hidden; r2 colours; 0 console errors |
| 2 | FB visible while driving | FB on the driver seat in all 4 camera modes; hips within 0.05 rig units of the contract socket |
| 3 | Hands on the wheel | wrist-to-grip distance ≤ 0.05 rig units over a full lap; the wheel turns with the steering (angle logged) |
| 4 | No clipping while driving | FB body vs car body / dash / doors: 0 intersections at 10 sampled frames of the lap (hands on the rim and butt on the cushion are allowed) |
| 5 | Hop in and out | follows the contract timing; the flight never intersects car body, door, seat or windscreen (sampled every 2 frames); the other cars keep the J14 cut |
| 6 | Face | the eyes, lids, mouth and brows seen in ToolBox Production-06 r2 are on FB in Joyride (still per camera: chase, tunnel, loop) |
| 7 | Ears | wind input live; tips back 10–35° at 25 km/h (the Blender reference); 0 ear-through-head at the ToolBox audit limits |
| 8 | Lap still works | headless lap with the cabrio: 7/7 jumps, 0 barrier hits, lap time logged next to J15 (91.60 s K2B) |
| 9 | fps on Georg's device | NOT_RUN is allowed; say so |

Pictures to take and look at before returning:
- chase camera on the straight, in the tunnel and in the loop;
- hop in: 4 frames; hop out: 4 frames;
- a face close-up at a standstill.

## 6 · Do not

- No second track, camera, physics, travel or face/ear engine. Track Core v0.12 streams only.
- Do not change K2B / K2 physics, the J09 camera, the T4 look, facades or shadows.
- Do not rescale the J14 walker without Georg's decision (§4).
- After two failed attempts at the same gate: freeze, put the evidence side by side, no third guessed fix.

## 7 · Return

The usual session cut, with a full codebase export and an additive changelog: RETURN (problems first), TEST_REPORT (only executed tests say PASS), the pictures above, and the scale-decision stills.
