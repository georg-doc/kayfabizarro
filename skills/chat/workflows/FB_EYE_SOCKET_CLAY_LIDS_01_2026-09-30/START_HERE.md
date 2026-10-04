# FB-EYE-SOCKET-CLAY-LIDS-01 · Seating the eyes and building clay lids

Status: **BUILD INSTRUCTION FOR KFB TOOLBOX STUDIO (Claude Design, Rigging / FaceHost) · reference built in Blender on the real model**
Date: 2026-09-30
Model: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1`
Pet entry: `frizzlebob-earrig-v5` (Georg's export 2026-09-30)
Code read: `pet-eye-rig.v6.js` (owner), `kfb-lib/face-mount.v1.js` (`yawEyes`), `kfb-lib/clay-lids.v1.js`, `frizzlegraft-v1/eyeoval.v1.js`

Georg judges the look. Every number below is a starting value, exposed as a slider.

## 1 · What is wrong today (measured on the model)

1. **The eyes look straight ahead; the head surface at the eyes does not.**
   - Under each eye anchor, the head faces **28.9° outward and 11.4° upward**.
   - EyeRig v6 seats each eye along the straight view axis (`splay` 0, no pitch).
   - `yawEyes` only adds yaw, set by hand, and has no pitch.
2. **Therefore the lid corners do not sit in the head.** The lids hinge on the eye's local X axis, and that axis is not tangent to the head. Signed distance of the corners to the head surface (R = 0.12 m):

   | | Outer corner | Inner corner |
   |---|---|---|
   | Today | **+5.1 cm, outside** (0.43 R) | −7.3 cm, inside |
   | Socket frame (below) | −1.0 cm, inside | −1.0 cm, inside |

   The outer upper lid therefore stands proud of the head as a dome (`renders/before_after.png`, top row).
3. **The clay lids do not share their corners.**
   - In `clay-lids.v1.js`, *glide* describes each lid edge by longitude around the vertical axis, with its own back rim (−0.35). Upper and lower lid are two separate caps that only overlap.
   - *fold* hinges through the centre, but on the same wrong axis.

   In the export `clayLids.on` is `false`, so the screenshots show the rigid EyeRig shells. The clay lids would inherit the same frame and the same fault.

## 2 · Construction (per eye, at build time)

### 2.1 Socket frame: the eye sits in the head

- `S`: the head surface point under the anchor, found exactly as today (ray along the view axis at `ex, ey`).
- `n`: the area-weighted mean normal of the head faces within **1.2 R** of `S`.
- `h`: the horizontal tangent `normalize(up × n)`, flipped so it points to the **outer** side of that eye. This is the hinge / corner line.
- `v`: `n × h`, pointing up.
- **Oval tilt:** rotate `h` and `v` about `n` by `-sx · tilt` (the same sign as `eyeoval.v1` `e.rotation.z`).
- **Eyeball centre:** `C = S − n · R · (0.24 + inset · 1.15)`, the same depth rule as today but along the normal.
- **Oval scale:** `w` along `h`, `h` along `v`, `d` along `n`.

This replaces the hand-set `splay`. Keep `splay` only as an extra offset on top (default 0). Add `eye.socket = 'surface' | 'legacy'`; the default for new pets is `'surface'`, and `'legacy'` reproduces today exactly.

### 2.2 Pupils stay free (they do not turn with the socket)

- The pupil pivot does **not** inherit the socket rotation. Rest gaze = head forward (+ `converge`), and drift, track and saccades work as now.
- Result: the eyeball turns outward to sit in the head, but the look direction does not change.
- **Clamp:** if the gaze would put the pupil under a lid, the pupil hides behind the lid. The lids never move for the pupil.

### 2.3 Lids: one hinge, two shells, shared corners

**Coordinates:**
- Both lids lie on one sphere around the eyeball: radius = eyeball × (1 + gap).
- `ψ` runs along the hinge, from corner to corner (−90° … +90°).
- `φ` is the angle around the hinge, measured from `n` toward `v`.
- Point: `(sin ψ, cos ψ · sin φ, cos ψ · cos φ)` in `(h, v, n)`, then oval-scaled × R + `C`.

**Coverage:**
- Upper lid: `φ ∈ [θu(ψ), θu(ψ) + 150°]`.
- Lower lid: the mirror image, `φ ∈ [−θl(ψ) − 150°, −θl(ψ)]`.
- The part behind the head surface simply disappears inside the head.

**Why the corners always close:** at `ψ = ±90°` every `φ` gives the same point. Upper and lower lid therefore always meet exactly at the two corners, whatever the edge shape, blink or emote. Gaps or poking corners are impossible by construction.

**Edge shape:** `θ(ψ) = θ − curve · cos²ψ · (1 − closure)`, which is convex when open and becomes a straight seam when closed. Start: `curveU` 0.10, `curveL` 0.06.

**Clay body:**
- Thickness `t` (start 0.14 R).
- A rounded bead along the edge: `+ bead · exp(−(Δφ / 0.22)²)`, bead start 0.07 R; the lip is closed with a half-round.
- **Gap and thickness are both multiplied by `cos(ψ)^0.7`,** so the lid melts into the eyeball at the corners instead of ending in a lump.
- Gap = the measured amount by which iris and pupil stand out of the sclera (`ext − 1`, as `clay-lids` already measures) + `fit`.

**Lower lid:** gap + 0.006, thickness × 0.93, bead × 0.8, so the two lids never z-fight at the seam.

**Shadows:** the lids receive shadows but do not cast them (LESSONS_SHADOWS).

### 2.4 Motion: only the hinge angles move

- **Blink and emotes** change `θu` and `θl` only. The closure values come from EyeRig as today: `cu = (1.30 + up.rotation.x) / 1.18`, `cl` likewise.
  - `θu = lerp(74°, seam − overlap, cu)`
  - `θl = lerp(66°, −seam − overlap, cl)`
  - seam −5°, overlap 2.5°.
- **Slant:** rotate the whole lid pair about `n` by `−sx · slant · 0.85` rad (the same as EyeRig v6 `_lids.rotation.z`). Angry (−) = inner end down. The hinge stays through `C`, so the corners slide along the eyeball's rim and stay shared.

## 3 · FrizzleBob v5 numbers (Blender coordinates, see `MEASURE.json`)

| Quantity | Value |
|---|---|
| Head half-height U | 0.4707 m |
| Eye radius R (U × ring 0.255) | 0.120 m |
| Depth | 0.24 R |
| Head normal at the eyes | ±0.473 x, −0.858 y, +0.198 z (28.9° out, 11.4° up; left and right match within 0.1°) |
| Eye centre, today | x ±0.214, y −0.364, z 1.785 |
| Eye centre, socket frame | x ±0.201, y −0.368, z 1.780 |

## 4 · Acceptance (machine checks in the ToolBox)

1. **Corners in the head:** both corner points of each eye have a signed distance to the head ≤ 0, and the difference between inner and outer is ≤ 0.1 R.
2. **Shared corners:** the upper and lower lid corner vertices coincide within 1e-4 R in every state (open, neutral, half, closed, angry, sad).
3. **Closed means closed:** at closure 1, no sclera pixel is visible from the front view or the ¾ view.
4. **Pupil never clips:** no pupil vertex lies outside the inner lid surface at any gaze within `track`.
5. **Legacy unchanged:** with `socket = 'legacy'` the build is byte-for-byte today's placement.
6. **Mirror:** left and right frames mirror within 0.1°.
7. **Untouched:** ears, brows, nose and mouth are unchanged. The brows follow their own `brow.turn` (29° ≈ turn 0.64 if Georg wants them to follow). That is his call, not part of this slice.

## 5 · Reference

- `renders/before_after.png`: top row today, bottom row the socket frame. Front, ¾ and side view, lids in the neutral state.
- `renders/lid_states.png`: open, neutral, half, closed, angry, sad. Top row front, bottom row ¾.
- `source/build.py` (Blender 5.0): builds the reference from the GLB above. `source/measure.py`: the numbers in `MEASURE.json`.

Brows and the painted mouth are hidden in the renders. The Carl brows sit at their GLB rest transform, not at the ToolBox placement. The pupil size in the renders is approximate.

## Exactly one next gate

**ToolBox Studio: implement 2.1–2.4 behind `eye.socket` and `clayLids.mech = 'hinge'`, run acceptance 1–7 on `frizzlebob-earrig-v5`, then Georg judges the look.**
