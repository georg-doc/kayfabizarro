# Motion Forge · sprint #381 · Clown juggling J5 (physics rebuild) · RETURN

Issue #381 · branch `blender-mcp/motion-forge-poc-01-2026-10-08` · 2026-10-09.

## Status

**Georg's notes on J4 (2026-10-09):**
- the physics at the top of the arc was wrong;
- the clubs were pushed sideways at the top;
- the clubs went too far out;
- there was no circular motion.

**His choices:**
- a cascade with hand circles;
- a brief pass in front of the face is fine.

J5 is rebuilt on that basis and waits for Georg's look. The catalogue patch is additive and **not applied**. J3 and J4 stay on the branch.

## Defects and open points first

1. **Nose in the side view.** For 1 frame per throw the club's knob sits on the nose tip on screen. The 3D gap is 0.066. A camera about 10° off true profile hides it.
2. **Face in the front view.**
   - Pins: the rising club passes the nose and one eye for about 2–3 frames per throw. This is within the agreed limit: never more than 3 frames in a row; 18–19 of 96 frames per camera.
   - Donuts and sweets: up to 26 of 96 frames, never more than 3 in a row.
3. **Talk pose:**
   - the two-club arm still reads as pointing out sideways;
   - the ta-da opens level, not upward;
   - at stop f10 the two clubs are splayed before they close into a V.
4. **Launch speed.** The hand moves at about a third of the club's launch speed. The chibi arms are short (reach 0.56) and the head sits right above the hands.
5. **Variants:**
   - held donuts lie flat against the body;
   - the KayKit sweets have open wrapper cones.
6. **Clown eyes:** the profile is still unreviewed (stills are in the J4 folder).

## What changed from J4

| Georg's note | J4 | J5 |
|---|---|---|
| Physics at the apex | three sideways segments forced onto the path; the club snapped across the top | **True ballistic flight.** x and y move at constant speed; z follows one parabola with one gravity (0.0249 units/frame², apex 2.1 above the release). |
| Pushed sideways at the top | the props were swung out and back in | Nothing is added to the path. Sideways speed is constant from release to catch. |
| Too wide | half-width 1.4 / 1.7 (beyond the arm reach of 0.56) | A narrow cascade that crosses above the head; catch to catch is about 1.3 head widths. |
| No circular motion | small hand loop, clubs parked | **Each hand runs an ellipse.** The throw comes from the inside moving up and in. The empty hand goes out over the top. The catch is on the outside moving down and out. The hand carries the club down and in, and the held club tips up and forward through the carry. |
| Spin | eased (fast at the apex) | **Constant spin.** One turn per throw, end over end. The axis is tilted 17° toward forward (mirrored per thrower) so the knob stays off the face. Clubs land handle first. |
| Head | tilted up 10°, fixed | tilted up 24°, with a 3° nod that follows each club to its high point |

The external critic's verdicts on the way here:
- J5: PASS WITH NOTES.
- J5b (spin axis tilted 50°): FAIL — the clubs cartwheeled sideways.
- **J5c: PASS WITH NOTES** (this version).

## Talk loop (state machine unchanged in shape)

```
juggle cascade3_d (96 f, loop) --line due, at frame 0--> stop_j5 (48 f) --> talk_j5 (96 f, loop while the line plays)
talk_j5 --line done, at frame 0--> resume_j5 (120 f) --> juggle frame 0
```

- **talkWindows:** stop 18–47, talk 0–95.
- **Talk pose:**
  - elbows bent;
  - the right hand holds two clubs in a narrow V;
  - the left hand holds one club low and outward and gestures out and up;
  - nod and tilt.
- **Eyes in the talk loop:** 0 frames. Every join is continuous.

## Checks

| Check | Result |
|---|---|
| GLB | 24 nodes; skeleton identical to the forge template; 4 clips; round trip ≤ 0.0144 cm |
| Prop tracks | checked against Blender vertex positions: 9.9e-6 |
| Club to head | ≥ 0.066 |
| Club to club | ≥ 0.30 in the loop |
| Body clearance (talk clips) | ≥ 0.009; two clubs in one hand touch at the knob |
| Eye guard | the Clown always has KFB eyes |

## Files

| File | What |
|---|---|
| `libs/Rig_Medium/KFB_Motion_clown_juggle_j5.glb` | `kfb_clown_juggle_cascade3_d`, `_stop_j5`, `_talk_j5`, `_resume_j5` |
| `data/clown_juggle_j5.prop_tracks.{pin,donut,candy}.json` | `kfb.prop-tracks.v2`: per clip, per prop, rows tx ty tz qx qy qz qw s; talkWindows; J5 physics in `timing` |
| `KFB_Motion_Library.catalog.patch_clown_juggle_j5.json` | clips, state machine, physics, face rule, known issues, sha256 |
| `scripts/kfb_clown_juggle.py` | `FLIGHT_MODE='ballistic'`, `HAND_MODE='circle'`, `eye_cover`, `head_pitch`; J3 / J4 modes are kept behind flags |
| `scripts/kfb_clown_juggle_talk.py` | stop / talk / resume |
| `scripts/kfb_prop_tracks_to_gltf.py`, `scripts/clown_comp.py` | converter, review comps |
| `previews/CLOWN_JUGGLE_J5_pins.mp4` | 3/4 left + side |
| `previews/CLOWN_JUGGLE_J5_pins_front.mp4` | 3/4 right + front |
| `previews/CLOWN_JUGGLE_J5_marketplace_talk.mp4` | juggle → stop → talk → resume |
| `previews/CLOWN_JUGGLE_J5_donuts_sweets.mp4` | the two variants side by side |
| `previews/CLOWN_JUGGLE_J5_motion_strip_front.jpg` | 24 consecutive frames, front camera (for checking the physics) |

Blend copy (local only): `blend/KFB_MOTION_FORGE_SPRINT381_S9_clown_j5.blend`.

## Attribution

- **KayKit (Kay Lousberg), CC0:** Clown, juggling pins, circus podium, Rig_Medium Idle_A, Halloween Bits sweets.
- **Tiny Treats (Isa Lousberg), CC0:** donuts.
