# FB-EYES-LIDS-02 · Surface seat by default, one mirrored turn, level lids, lids: hinge | slide × round | cut

Status: **BUILD INSTRUCTION FOR KFB TOOLBOX STUDIO (Claude Design, Rigging / FaceHost) · reference built in Blender on the real model**
Date: 2026-09-30
Model: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1`
Pet entry: `frizzlebob-earrig-v5` (Georg's export 2026-09-30): `eye.anchor` dx 0.455, dy 0.21, ring 0.255; `eye.oval` 1.06 / 1.04 / 0.98, tilt −25; `clayLids` on false, mech glide
Code read: ToolBox Production-06 `kfb-lib/face-mount.v1.js` (`EYE_DEF`, `socketEyes`, eye setters), `kfb-lib/clay-lids.v1.js` (hinge, glide, fold), `pet-eye-rig.v6.js` (`setAnchor`, `build`)
Builds on: `skills/chat/workflows/FB_EYE_SOCKET_CLAY_LIDS_01_2026-09-30/` (socket frame and hinge lids; P06 passed its acceptance 1–7)

Georg judges the look. Every number below is a starting value, exposed as a slider.

Georg, 30.09:
- Eyes moved outward along the side of the head should turn outward by themselves, so the rig fits other head shapes without editing each eye.
- Hinge is the better default.
- Keep the "two half-sphere caps sliding up and down" as an option for other characters.
- A thick claymation lid with a hard-cut edge (Wallace & Gromit) as a future option; round fits FrizzleBob and the standard characters. Build it into the construction now.
- (Review of the first renders, 30.09) The lids must be level by default, not tipped outward.

## 1 · What is wrong today (read in the code, measured on the model)

1. **The automatic turn already works, but only where the seat is `surface`.**
   - `setAnchor()` calls `build()`, the patched `build()` calls `socketEyes()`, and the seat follows the head normal under the anchor. Measured on FrizzleBob (turn 0):

     | anchor dx | 0.345 | 0.40 | 0.455 (Georg) | 0.52 |
     |---|---|---|---|---|
     | outward yaw | 21.4° | 25.2° | 28.8° | 33.4° |
     | upward pitch | 10.8° | 11.1° | 11.4° | 11.9° |

   - But `EYE_DEF.socket` in `face-mount.v1.js` is still `'legacy'`. Only the P06 actor loader injects `'surface'` for entries without the field. Every other host that mounts the face (P05, Cube Pets, Resident Atlas) still gets the straight-ahead legacy seat.
2. **Two independent turn sliders.** `eye.turnL` and `eye.turnR` are separate. To turn both eyes further out, Georg has to set each one and keep them equal by hand.
3. **The clay lids default to `glide`, and `on: false`.** Georg's export carries exactly that. Glide builds each lid edge with `glideRim()`: the front edge is blended to a fixed back latitude (−0.35) by a smoothstep over the longitude, and the convex term uses `max(0, cos lon)`. That gives the S-bend and the kink at ±90° longitude, i.e. an irregular rim. Hinge (LIDS-01) does not have this.
4. **The lids tip with the eye oval.** `socketEyes()` rotates the whole eye group about `n` by the oval tilt (`−sx · tilt`; Georg's value −25°). The lid shells hang in that group, so their hinge line and edges tip by 25°, outer corners down. The oval tilt is meant to shape the eyeball; the lid line should stay level unless an emote slants it.
5. **No sliding lid and no hard lid edge exist.** `fold` is a rigid clamshell (it rotates, it does not slide). The lid lip is always the half-round bead.

## 2 · Changes

### 2.1 Seat: `surface` becomes the default everywhere

- `EYE_DEF.socket = 'surface'` in `face-mount.v1.js`. A saved `'legacy'` stays legacy.
- Remove the P06-only injection at the actor loader (it becomes redundant).
- Nothing else changes: the anchor setters already re-seat (§1.1).

### 2.2 One mirrored turn

- New `eye.turn` (degrees, −30 … 60, + = outward, default 0). It turns **both** eyes outward by the same amount, mirrored.
- New `eye.turnFine = { l: 0, r: 0 }` (degrees, −10 … 10), only for fine correction of a single eye. UI: collapsed under "Fine tune per eye".
- In `socketEyes()`: `ang = splay·45° + turn + (sx < 0 ? turnFine.l : turnFine.r)`. Everything else stays (rotate about up, re-seat on the skin from 0.5 U behind S).
- **Migration on load:** if `turnL` / `turnR` exist and `turn` does not, then `turn = (turnL + turnR) / 2`, `turnFine.l = turnL − turn`, `turnFine.r = turnR − turn`. Export writes only `turn` and `turnFine`.
- Replace the two sliders "Left eye / Right eye · turn further out" with one slider "Turn · both eyes outward (°)".
- Reference (dx 0.455): turn 0 / 10 / 20 → yaw 28.8° / 38.8° / 48.8°, left and right within 0.1°. `renders/seat_turn.png`, bottom row.
- Brows do not follow the turn in this slice (`brow.turn` stays Georg's call).

### 2.3 Lids: `mech` and `lip` are two independent fields

```
clayLids.mech: 'hinge' (default) | 'slide' | 'glide' (legacy) | 'fold' (legacy)
clayLids.lip:  'round' (default) | 'cut'
```

- **Defaults for new saves:** `on: true`, `mech: 'hinge'`, `lip: 'round'`.
- **Saved entries keep their values.** Georg's FrizzleBob entry has `on: false, mech: 'glide'`: do not migrate it silently. Offer one button, "Use the new default (hinge, round)", in the Clay lids panel.
- The menu shows Hinge and Slide at the top, and Glide and Fold under "Legacy".

#### Hinge (default, unchanged from LIDS-01)

Keep `hingePositions()`. Only the lip ring (§2.5) and the level frame (§2.4) change.

#### Slide (new): the lid edge is a constant latitude that moves up and down

In the same socket frame `(h, v, n)`, unit sphere, then oval-scaled × R + C, as the hinge:

- **Point:** `(cos a · sin s, sin a, cos a · cos s) · r`.
  - `s` = longitude around the vertical axis `v`: 72 steps over −180° … 180°, a **closed loop**.
  - `a` = latitude.
  - The lower lid mirrors `a → −a`.
- **Coverage:** from the margin latitude `θ` to 89° (the pole). The rim is therefore the same latitude all the way round: no S-bend and no kink by construction. From the front, the opening is a band with parallel edges.
- **Melt at the sides:** thickness and bead × `prof(s)`, with `w = clamp((|s| − 30°) / 80°, 0, 1)` and `prof = 1 − smoothstep(w)`. The gap uses `max(prof, 0.3)`, so the lid never touches the ball.
  - Without the melt, the rim stands out of the head as a brim at the sides and behind the eye; FrizzleBob's eyes stand 76 % out of the head.
  - The melt changes only the thickness. The margin line on the ball stays one latitude.
- **Motion** (same closures `cu` / `cl` from EyeRig):
  - `θu = lerp(slideOpenU, seam − overlap, cu)`
  - `θl = lerp(slideOpenL, −seam − overlap, cl)`
  - Start: `slideOpenU` 58°, `slideOpenL` 50°; seam −5°, overlap 2.5° (the hinge values).
  - The slide opens less than the hinge because its edge does not converge to corners.
- **Slant:** rotate the lid pair about `n` by `−sx · slant · 0.85`, exactly as the hinge does.
- **Lower lid:** gap + 0.006, thickness × 0.93, bead × 0.8, as the hinge.
- **Topology is fixed.** Write `slidePositions(o, theta, lower, out)` as a twin of `hingePositions()`, and wrap the index buffer in the longitude direction (row 71 connects to row 0).

### 2.4 Lids stay level: `clayLids.tilt: 'level' (default) | 'follow'`

- `'level'`: the lid hinge (hinge) or the latitude axis (slide) is the **untilted** socket frame `(h0, v0, n)`: `h0 = normalize(up × n)`, horizontal. Only the emote slant rotates the lids (`−sx · slant · 0.85` about `n`, as today).
- The lids still hug the oval eyeball: build a lid point `p` in the level frame, express it in the tilted eyeball frame, then oval-scale it. In the eye group's local space: `p_local = S_oval · Rz(counter-tilt) · Rz(slant) · p`, where the counter-tilt is exactly the inverse of the tilt `socketEyes()` put on the group.
  - In practice: the lid node's `rotation.z` = counter-tilt + slant term. If the oval scale sits on a node above the lid node, nothing else changes. If not, apply `S_oval` in the lid positions.
- `'follow'` reproduces the first-draft behaviour (lids tip with the oval), kept for characters that want slanted lids at rest.
- The same applies to the rigid EyeRig shells when they are shown (`clayLids.on = false`): counter-rotate `e._lids` by the oval tilt.
- Measured with `'level'`: the hinge corners now sit equally deep in the head, within −1.0 … −1.3 cm over all states (with the tilt: −1.1 … −1.9 cm), and all other checks in §3 are unchanged.

### 2.5 Lip profile (both mechanisms)

The ring per row runs: outer surface (back → margin), lip, inner surface (margin → back). Only the lip part changes.

- **`round`** (default, FrizzleBob and the standard characters): today's ring, i.e. the bead `exp(−(Δ/0.22)²)` plus the half-round lip in 6 steps. Thickness `hThick` 0.14, bead 0.07.
- **`cut`** (thick claymation lid, hard edge):
  - Thickness `cutThick` 0.28 × R, no bead.
  - The outer surface ends at `θ + c`.
  - Then a 45° chamfer to `(ro − c, θ)`, with `c = min(cutChamfer, 0.45 · t)` and `cutChamfer` 0.04.
  - Then a **flat edge face** at angle `θ` down to the inner radius: two ring points, `(ro − c, θ)` and the midpoint.
  - Hinge corners: thickness and chamfer are still × `cos(ψ)^taper`, so the corners stay shared.
- **Hard edges in three.js:** insert each of the two chamfer vertices **twice** in the ring (same position, consecutive). The zero-area quad between the copies contributes nothing to `computeVertexNormals()`, so the normals split there. The flat face lights as a face, and the topology stays fixed.
- New sliders, visible only when `lip = 'cut'`: `cutThick` (0.1 … 0.45) and `cutChamfer` (0 … 0.1).

## 3 · Reference and measurements (`MEASURE.json`, `source/build.py`, Blender 5.0)

`renders/lids_4x6_front.png`:
- rows: hinge + round, hinge + cut, slide + round, slide + cut;
- columns: open, neutral, half, closed, angry, sad.

`renders/lids_4_threeq_side.png`:
- the same four rows;
- columns: ¾ neutral, side neutral, ¾ closed.

`renders/seat_turn.png`:
- top row: anchor dx 0.345 / 0.40 / 0.455 / 0.52 with turn 0 (the automatic turn);
- bottom row: turn 0 / 10 / 20 at dx 0.455.

| Check | hinge + round | hinge + cut | slide + round | slide + cut |
|---|---|---|---|---|
| Upper/lower corner gap, all 6 states | 0 | 0 | no corners | no corners |
| Corner signed distance to the head | −1.3 … −1.0 cm (inside) | same | — | — |
| Rim latitude spread, all 6 states | — | — | < 1e-5° | < 1e-5° |
| Rim at the eye sides (±90°), signed distance to the head | — | — | −2.3 … −0.9 cm (inside) | same |
| Sclera pixels when closed (front / ¾) | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

- The front rim of the slide varies in height by 0.02 R (2.4 mm). That comes from the gap melt towards the sides; the latitude itself is constant.
- All renders use `tilt = 'level'`. Pupils keep the free gaze of LIDS-01: the rest gaze is head-forward and does not turn with the socket.
- Brows, nose and the painted mouth are hidden in the renders.

## 4 · Acceptance (machine checks in the ToolBox)

1. **Default seat:** a face mounted in any host without `eye.socket` gets `'surface'`. A saved `'legacy'` stays legacy and is byte-identical to today.
2. **Automatic turn:** on `frizzlebob-earrig-v5`, stepping `anchor.dx` through 0.345, 0.40, 0.455 and 0.52 gives an outward yaw within ±1° of the table in §1.1, rising at every step.
3. **One turn:**
   - `turn` 10 gives left and right yaw equal within 0.1°, 10° ± 0.2° above turn 0.
   - A saved `turnL` 6 / `turnR` 10 loads as `turn` 8, `turnFine` −2 / +2, with the same eye placement as before.
4. **Hinge corners** (LIDS-01 check 2) pass for `lip` round and cut.
5. **Slide rim:** in all 6 states, every margin vertex of each slide lid has the same latitude within 1e-4 rad in the socket frame.
6. **Closed means closed:** at closure 1, no sclera pixel in the front or ¾ view, for all four combinations.
7. **Cut edge is hard:** the vertex normals on either side of the chamfer differ by > 35°. On `round`, no two neighbouring lip normals differ by > 20°.
8. **Legacy unchanged:** `mech` glide and fold build exactly as today, and so does Georg's saved FrizzleBob entry until he presses the button.
9. **Untouched:** ears, brows, nose and mouth do not change.
10. **Level lids:** with `tilt = 'level'` and slant 0, the hinge axis (or the slide's latitude axis) of each eye is horizontal within 0.5° in world space, for any `eye.oval.tilt`. With `'follow'` it tips by the oval tilt.

## 5 · Notes for Georg's look review (observations, not decisions)

- **Hinge, "open" state (74°):** from the front, the upper lid reads as a thin arc at the top edge of the eye. If that looks too wide open, lower `hOpenU` (for example to 66°).
- **Slide** gives a different expression: a straight, level band (sleepy, deadpan). Fits other characters more than FrizzleBob.
- **Cut** reads mainly in the ¾ and side views (flat edge face). From the front it mostly reads as a thicker lid.

## Exactly one next gate

**ToolBox Studio: implement §2.1–2.5, run acceptance 1–10 on `frizzlebob-earrig-v5`, then Georg judges the four combinations.**
