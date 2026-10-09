# Motion Forge · sprint #381 T1–T4 · Clown juggling J4 + marketplace talk loop · RETURN

Issue #381 · branch `blender-mcp/motion-forge-poc-01-2026-10-08` · 2026-10-09.

**Status:** this is the tuning pass on J3, which Georg called "einbaufähig" on 2026-10-09. It was built while Georg was away and waits for his look.
- The catalogue patch is additive and **not applied**.
- J3 (`pack01/clown_juggle_j3/`, clip `cascade3_b`) stays in place.

## Defects and open points first

The external critic passed every part with notes. These tuning notes are still open:

1. **Arc reads a little "carried".**
   - The side legs rise almost vertically for about 7 frames.
   - The crossing over the head is level.
   - Proposed fix: keep about 40 % of the sideways speed on the side legs and curve the top.
2. **Crossing clubs overlap on screen** for about 3 frames per throw, as in a real cascade. The 3D gap is ≥ 0.021.
3. **Release and catch frames:** in the 3/4 cameras, a club outline touches the head outline on screen for 1–3 frames per throw.
4. **Talk loop:**
   - the ta-da opens the arms level rather than up;
   - the resume wind-up closes the 45° fan of the two clubs in the right hand.
5. **Variants:**
   - held donuts lie flat against the belly or thigh; they should sit on the fingers, through the hole;
   - the KayKit sweets have open wrapper cones, which read as bobbins at a distance;
   - the variants are small at marketplace distance.
6. **Clown eyes:** still the unreviewed AUTO_CANDIDATE profile. Review stills are in `previews/CLOWN_EYES_profile_review.jpg`.
7. **Prop tracks are data, not GLB animation.** Each prop carries one row per frame (glTF space, actor root). The runtime places the raw prop asset as a child of the actor root.

## What changed from J3 (T1)

| Item | J3 | J4 |
|---|---|---|
| Face | clubs crossed at eye height in the 3/4 camera, 24 of 96 frames | 0 frames in three cameras (3/4 left, 3/4 right, front). The face box covers eyes, cheeks and mouth. |
| Arcs | forward bow 0.70 that crossed in front of the face; the exponent blend snapped across the apex (0.66 per frame) | Three smooth segments: swing out over 12 % of the flight, cross above the head between 30 and 70 %, swing in over the last 12 %. Half-width is 1.4 rising and 1.7 falling, so the rising and falling clubs pass side by side. No bow. Largest per-frame step is 0.50. |
| Apex | 1.65 | 1.85 |
| Spin | uniform | eased: slow while passing the face, the flip happens above the head; still one turn, handle first |
| Grip | handle centre; knob 0.004 from the belly | held at the knob (0.27 down the handle); ≥ 0.049 from head, hat and body |
| Held club | parked | dips and swings forward-down through the scoop; hand loop moved 0.08 forward |
| Hips dip | jumped 1.4 cm at every beat boundary | wrapped, no pop |
| Screen check | none | `head_touch_frames` (club outline vs head/hat outline in pixels) and `face_overlap` |

Critic history:
- J4a: PASS WITH NOTES.
- J4b: FAIL, because the clubs looked like they stood on the hat in the 3/4 view, though the 3D gap was 1.0.
- J4c: PASS WITH NOTES.
- Final: the snap was found in my own step check and fixed with segment arcs; PASS WITH NOTES.

## Marketplace talk loop (T3)

```
juggle cascade3_c (96 f, loop) --line due, at frame 0--> stop (48 f) --> talk (96 f, loop while the line plays)
talk --line done, at frame 0--> resume (120 f) --> juggle frame 0
```

- **stop:** the right hand keeps its club instead of throwing at frame 0. It catches the club still in the air at f10, fanned outward about 45° from the kept club. The left hand keeps its club. Then a small ta-da and rest.
- **talk:**
  - right hand: two clubs (forward, outward);
  - left hand: one club held outward, which gestures out and up;
  - the head nods (9°) and tilts (11°).
- **resume:** a 24-frame wind-up into the loop's frame-0 pose, then the loop's 96 frames. The club that is airborne in loop frames 0–10 is still held in the right hand there, which is a standard 3-club start.
- **talkWindows** (clip frames), in the catalogue patch and in every prop-track file:
  - stop: 18–47;
  - talk: 0–95;
  - resume: none.
  The Chatterbox line or bad joke can start once the clubs are caught.
- **Joins:** the bone jump at every join is at or below a normal frame step (0.033 vs 0.051), and the prop tracks are continuous, so no blending is needed.
- **Idle_A base:** every clip boundary falls on a whole Idle_A cycle (24 frames).

## Variants (T2)

Same timing and arcs; one prop-track file per kind:
- `pin`: KayKit juggling pins.
- `donut`: Tiny Treats Baked Goods (Isa Lousberg, CC0) — pink, chocolate, plain.
- `candy`: KayKit Bits Bundle 1, Halloween Bits (CC0) — wrapped sweets that tumble end over end. The asset's X axis is turned into the tumble axis inside the tracks.

All kinds have 0 face frames in all clips. Club to body is ≥ 0.048.

## Checks

- **GLB:** pose dump → `kfb_pose_dump_to_glb.py`.
  - 24 nodes, skeleton identical to the forge template, no meshes or skins.
  - 4 clips; round trip ≤ 0.0084 cm.
- **Prop tracks:**
  - converter self-check 2.3e-5 (2,160 points per kind);
  - independent check of pin vertices against Blender world positions: 1.7e-5.
- **Eye guard:** `kfb_eye_guard.check()` runs before every render. The Clown always shows KFB eyes.
- **Body bake:** deterministic within 5e-5.

## Files

| File | What |
|---|---|
| `libs/Rig_Medium/KFB_Motion_clown_juggle_j4.glb` | four clips: `kfb_clown_juggle_cascade3_c`, `_stop`, `_talk`, `_resume` |
| `data/clown_juggle_j4.prop_tracks.{pin,donut,candy}.json` | `kfb.prop-tracks.v2`: per clip, per prop, rows tx ty tz qx qy qz qw s; asset paths; talkWindows; next state; timing; throws |
| `KFB_Motion_Library.catalog.patch_clown_juggle_j4.json` | clips, state machine, timing, prop kinds, eye profile, known issues, sha256 |
| `scripts/kfb_clown_juggle.py` | cascade: `setup(kind)`, `bake_body`, `prop_tracks`, `clearance`, `face_overlap`, `head_touch_frames`, `export` |
| `scripts/kfb_clown_juggle_talk.py` | stop / talk / resume: `bake`, `prop_tracks`, `check`, `continuity`, `export` |
| `scripts/kfb_prop_tracks_to_gltf.py` | Blender matrices → glTF rows (Mg = C⁻¹ Mb C) |
| `scripts/clown_comp.py` | review comps and videos |
| `previews/CLOWN_JUGGLE_J4_pins.mp4` | 3/4 left + side, 3 loops |
| `previews/CLOWN_JUGGLE_J4_pins_front.mp4` | 3/4 right + front, 3 loops |
| `previews/CLOWN_JUGGLE_J4_marketplace_talk.mp4` | juggle → stop → talk → resume, with the TALK WINDOW tag |
| `previews/CLOWN_JUGGLE_J4_donuts_sweets.mp4` | the two variants side by side |
| `previews/CLOWN_EYES_profile_review.jpg` | eye profile stills (3/4 left, front, 3/4 right) |

Blend copies (local only):
- `blend/KFB_MOTION_FORGE_SPRINT381_S7_clown_juggle_j4.blend`
- `blend/KFB_MOTION_FORGE_SPRINT381_S8_clown_j4_talk.blend`

## Attribution

- **KayKit (Kay Lousberg), CC0:** Clown, juggling pins, circus podium, Rig_Medium Idle_A, Halloween Bits sweets.
- **Tiny Treats (Isa Lousberg), CC0:** donuts.

## Next gate (one)

Georg looks at the four previews and the eye stills. Then wire the state machine into the MVP slice marketplace, with Chatterbox lines started inside the talk windows.
