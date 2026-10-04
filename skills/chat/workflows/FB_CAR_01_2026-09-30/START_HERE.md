# FB-CAR-01 · FrizzleBob v5 in the cabrio: seat, hands on the wheel, hop in / out, joyride with ear wind

Status: **BLENDER REFERENCE + CONTRACT · measured (headless Blender 5.0.1)**
Date: 2026-09-30

Georg 30.09:
- Try FrizzleBob in the cabrio on a joyride. There is no current character → vehicle rigging and posing tool, so work it out here first with FB v5 and the new rig.
- Collect findings, poses and animations as the basis for a rigging path in the ToolBox.
- Use the rigged FB v5 with eyes, mouth etc.
- Getting in: the hop over the side wall (his pick, 30.09).

Georg judges the look. Every number below is measured or a starting value.

## 1 · Result first

1. **FB sits in the open cabrio with both hands on the wheel.**
   - Hands are at 10 and 2 o'clock, held by 2-bone arm IK.
   - FB sits 0.10 rig units further forward than the seat centre; otherwise its arms are 15–20 cm short.
   - The feet do not reach the pedals: the right toe is 0.26 rig units short of the gas pedal. The legs hang (kid-in-a-car look).
2. **Getting in and out is a cartoon hop over the side wall, with the door shut.**
   - FB stands next to the car, crouches, springs up, turns 90° in the air and lands seated with a small dip. Getting out is the same, mirrored.
   - The flight is clean: no intersection with car body, door, seat or windscreen.
   - At the landing the hands grip the rim, so the arms touch the wheel and dash. This is the same contact as in the driving pose.
3. **The Mixamo entering / exiting clips do not fit here.**
   - The door sill is about twice as high as FB's hips; the clips expect a sill below the knee.
   - After two repair passes (rotate the clip, then shift the start and lift) FB still passed through the side wall, door and seat. That is why the hop replaced them.
   - The clips still fit characters with longer legs; for closed cars, a door variant has to be keyed by hand (see §6).
4. **Joyride on a test loop, not the real race track.** The loop is an ellipse, 24 × 16 rig units, with a 0.9 hump, driven at 25 km/h; one lap takes 11.3 s.
   - Wheels spin; the front wheels and the steering wheel steer. Both hands follow the rim, because the grip points are parented to it.
   - FB leans out of the turns and bounces over the hump. The car body rolls slightly.
   - The ears are simulated with FB-EARS-FLOPPY-01 preset "B · Floppy", with wind = −car velocity. Tips go back 10–34° and flutter.
5. **The look is FB v5 as it is** (`FB_TEMPLATE_LOOK_v5b.glb` = v5 with the v5b ear weights): its own eyes, brows, nose and smile mouth. No colours are overridden.
   - The ToolBox cartoon eyes and lids (FB-EYES-LIDS-02) and the rig mouth are not in this GLB; they are added in the ToolBox.
6. **The cabrio needs two changes for the hop:**
   - Its side windows (door glass up to roof height) must be rolled down; here they are hidden.
   - The roof is held at its open frame (52).
7. **The interior mirror hangs right in front of FB's mouth.** Georg's call: keep it, or move / hide it.

## 2 · Files

| File | What |
|---|---|
| `FB_CAR_01_hop_in_out.mp4` | 275 frames, 30 fps: stand, hop in, drive (the driving clip), hop out |
| `FB_CAR_01_joyride_chase.mp4` | 360 frames: one lap, chase camera behind the car |
| `FB_CAR_01_joyride_face.mp4` | the same lap, camera in front of the car on FB's face; the windscreen glass is hidden for this camera only (it washed the face out) |
| `VEHICLE_SEAT_CONTRACT.json` | everything the ToolBox needs to put a character in this car: seat socket, wheel centre / radius / axis, grip rule, IK rule, hop timing and path, lean / bounce rule, roof / window state, findings |
| `POSES.json` | key poses as bone quaternions (`stand`, `seated_drive`), plus the recipes for crouch, flight tuck and landing |
| `fb_car_hop.blend`, `fb_car_joyride.blend` | the scenes (Dropbox only, not GitHub): FB rig with IK, cabrio, keyed timelines |
| `renders/` | stills: seated (face view), hop strip, joyride strip, and the rejected Mixamo entering test |

The videos are EEVEE renders without shadows, to keep render time down.
| `source/` | the Blender scripts (see §5) |

## 3 · The rigging path this suggests for the ToolBox (for the Web lane to judge)

One small, generic "vehicle seat" contract per car instead of one clip per car:

1. **Seat socket:** the hips position and facing in car space. Place the character there in the car's driving clip pose.
2. **Wheel:** centre, radius and axis. Grips at ±60° on the rim, arm IK with an outward-down pole, grip points parented to the wheel.
3. **Hop in / out:** stand point outside, apex height, yaw turn, and the four pose keys (stand, crouch, tuck, seated). This works for any open car; closed cars need a door variant.
4. **Motion layers while driving:** lean from lateral acceleration, bounce from vertical acceleration, ears from −velocity.

All the numbers for the cabrio are in `VEHICLE_SEAT_CONTRACT.json`.

## 4 · Numbers

| | Value |
|---|---|
| Scale | A: KayKit as shipped, Medium = 1.5 m (0.616 m per rig unit); car at ×1.8 |
| Seat hips (car native units) | see contract `driverSeat.hipsSocket` |
| Arm reach vs grip | arm 0.50 rig units; grip was 0.70–0.75 from the shoulder before the 0.10 shift |
| Hop | stand 20 f, crouch 12 f, flight 20 f, land 10 f; apex hips z 1.25 (rig units, car at ×1.8) |
| Joyride | 25 km/h, max lateral 0.37 g, lap 11.3 s |
| Ear tips (B · Floppy) | back 10–34°, left and right |

## 5 · Source

- `sit.py`: place FB on the driver seat, retarget the driving clip, measure the wheel.
- `ik2.py`: arm IK to the rim, forward shift, collision check.
- `hop.py`: hop in / drive / hop out timeline.
- `joy.py`: test loop, wheels, steering, lean, bounce, ear simulation (uses `sim.py` / `cfg.py` from FB-EARS-FLOPPY-01).
- `coll.py`: per-frame intersection check.
- `ev.py`, `joyrend.py`: renders.

Base files: `FB_TEMPLATE_LOOK_v5b.glb`, `KFB_CVP1_cabrio.glb` (r2), Motion Library v6 `Rig_Medium` interaction clips. The AN_PERF_01.blend helper is opened read-only and never saved.

## 6 · Next gates

1. **Georg:** the look of hop, lean and ears in the videos; legs hanging vs a pedal solution; the interior mirror.
2. **Blender MCP lane:** a door variant for closed cars (keyed by hand: step onto the sill, hold the frame, climb in, sit; door open / close); the same contract for the other 7 cars.
3. **Web lane:** decide where the vehicle seat contract lives in the ToolBox, and put FB and the cabrio into the real joyride / race track.
