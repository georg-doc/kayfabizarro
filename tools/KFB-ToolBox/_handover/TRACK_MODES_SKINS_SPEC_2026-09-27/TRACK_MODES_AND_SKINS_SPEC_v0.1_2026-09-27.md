# Track modes + skins · one track core for roads, coasters, rails, cosmic highways · SPEC v0.1 · 2026-09-27

**For:** WSA / Track Core owner.
**Source:** Georg, 27.09.2026: "machen wir so", plus the extra modes zero-g, magnetic push/pull and bounce/bumper.
**Author:** Coworker.
**Status:** DRAFT v0.1 for WSA review. v0.1 folds in Georg's answers of 27.09 (§7). It is not an order to change the running slice.

**Rules this draft keeps:**
- One track core. Pieces are data. JS is authoritative.
- Blender (LP01 etc.) is a preview/oracle only, never a second source of truth.
- Nothing here replaces decisions WSA has already taken.

## 0. What already exists (read before building)

| Source | Fact | Consequence |
|---|---|---|
| `KFB Stunt Car Race/_handover/WSA_REFERENCE_ROLLERCOASTER_V11.md` (WSA, 10.09) | v11 already uses three.js `RollerCoasterGeometry` / `RollerCoasterLiftersGeometry`. It has an arc-length table (`buildCards()`, reusable). The rails are only 0.4 apart; our wheel track is 1.7. v11 writes the ride pose directly on the curve. The racer runs three r160/WebGL + Rapier; v11 runs r178/WebGPU. | Reuse the ideas, not the v11 renderer. A locked ride must never also write the pose of a dynamic Rapier kart. |
| `rollercoaster-ride.v11.js` (Dropbox: `KFB SPinBall Wizard/KFB Pinball v1/export/kfb-rc-v11_2026-07-23/`), `animate()` ~l.1960–2040 | This is a **locked mode already in production**. Speed is advanced along the curve by gravity along the grade. A clamp holds speed between min 0.00004 and max 0.0002, arc-compensated. A **card magnet** pulls speed down to reading pace before a card, then releases a push ("Durchschlag"). Banking comes from heading change: `−atan(Δheading·8)·0.5`. | v11 is the reference for `locked` + `magnet_pull` / `magnet_push`. |
| three.js `RollerCoaster.js` (master) | `up` is fixed to world Y, yaw comes from `atan2`, and bank from heading change. **No loops or inversions are possible.** The profile is hard-coded. | Loops need our own frame law (§2). |
| LP01 v1 (27.09) | Rotation-minimising frames gave ~126° of roll after a corkscrew loop. | An explicit roll law is mandatory (§2). |
| LP01 v2 (27.09) | Clothoid loop, real junction pieces. Real physics falls short: cartoon factor 1.46. | Solved by `locked` + `magnet_push` (§3). |
| v13 | Georg: a v13 exists; its track is the same as v11's. v11 is the reference file for this spec. | Same curve, same ride logic. |

## 1. Data model (one route, many sections)

```
route := {
  id, samples: [{ s, p:[x,y,z], roll? }],       // centreline, arc length s in metres
  sections: [{ s0, s1, mode, mode_params, skin, roll_law }],
  sockets:  [{ id, s, kind }],                    // split, merge, capture, release, stilt, landmark
  zones:    [{ id, s0, s1, kind:'capture'|'release'|'bumper', params }]
}
```

- **Mode and skin are independent:** any skin can carry any mode. Defaults are listed in §4.
- **Vehicle-agnostic:** every vehicle (kart, pet, board, coaster car) uses the **same mode physics**. A vehicle only supplies parameters (mass, grip, air control), never its own rules.
- **Naming:** all ids are **strict EN**. Kayfab/wrestling or comic labels (e.g. "gutter jump") are an optional frontend layer mapped from the EN ids and never stored in route data.
- **Sections tile `s` without gaps.** A mode change always passes through a zone (§3.3).

## 2. Frame law (roll)

| roll_law | Use | Rule |
|---|---|---|
| `auto_bank` | flat and gently hilly parts | `up` = world up, rolled by `−atan(Δheading·k)·0.5` (v11 formula; k = 8, **clamp ±35°**). |
| `explicit` | designed banked curves, S-curves, corkscrews | `roll(s)` from the samples, interpolated smoothly (no steps). |
| `loop` | vertical loops and inversions | Lateral = guide vector (the loop's side axis) projected perpendicular to the tangent. `up` = tangent × lateral, so it points to the loop centre. This is the rule that fixed LP01 v1. |

**Check F1:** at every section border the frame is continuous: Δup < 5° per metre and no flip.

## 3. Driving modes

`body` is the Rapier body type. `dynamic` means real contact physics; `kinematic` means the core writes the pose. **The two are never mixed on the same body at the same time.**

| mode | body | What happens | Main params |
|---|---|---|---|
| `free` | dynamic | Normal driving. The car may leave the track. | none |
| `assist` | dynamic | Spring force toward the ideal line in the **track frame** (never world Y), only beyond a dead zone. Drift stays possible. Optional speed floor on climbs. | `dead_zone` (0.35·width), `k_lat`, `v_floor?` |
| `locked` | kinematic | The car rides at `s`, with speed from the speed rule: gravity along the grade, clamped to `[v_min, v_max]`. Covers coaster, magnet track, rail/mine cart and loops. | `v_min`, `v_max`, `g_scale` |
| `zero_g` | kinematic or dynamic-light | Gravity scaled toward 0; pet/car float animation. Steering nudges within the tube radius. For airtime hills and cosmic-highway float passages. | `g_scale` (0–0.2), `tube_r`, `duration` |
| `magnet_pull` (catch) | switches dynamic → kinematic | Pulls the car onto the line and brakes or holds it to a target speed (v11 reading magnet). Used for catch tracks and capture zones. | `v_target`, `pull_len`, `strength` |
| `magnet_push` (catapult) | kinematic | Boosts to `v_launch` over `push_len`, then optional release into `free`/`zero_g` (a jump over the Rhine). Replaces "real physics" for the loop: LP01 needs about 1.46× speed. | `v_launch`, `push_len`, `release_to` |
| `flight_free` | dynamic | Free flight or free fall after a launch or bounce. Air control per vehicle params. Landing anywhere drivable. | `air_control`, `g_scale` |
| `skydive_guided` | dynamic + assist | Guided flight: a spring toward an authored air line or landing socket, in the track frame. The player can steer out within `leave_r`, which releases into `flight_free`. | `land_socket`, `k_air`, `leave_r` |
| `bounce` / `bumper` | dynamic | Surface restitution plus an impulse along the surface normal. For cloud trampolines and the jump pads over the Rhine. The landing target is authored, and an optional assist pulls toward the landing socket in the air. | `restitution`, `impulse`, `land_socket?`, `air_assist?` |

### 3.1 Speed rule (locked family)

```
v += (-g · g_scale · grade) · dt ;  v = clamp(v, v_min, v_max) ;  s += v · dt
```

- **v11 parity:** grade = tangent.y. v11 advances progress in normalised units with arc compensation; the core works in metres, so no compensation table is needed.

### 3.2 Loop recipe (LP01)

`magnet_push` on the run-up → `locked` + `loop` roll law through the ring → `release` → `assist` on the run-out.

**Checks:**
- **L1:** speed never drops below `v_min` anywhere in the ring.
- **L2:** no frame flip (F1).

### 3.3 Capture and release (automatic switching between free driving and track)

- **Capture zone:** the car enters `[s0, s1]` with heading error < 25°, lateral offset < 0.5·width and speed inside `[v_lo, v_hi]`. The core then blends the pose from the dynamic body to the track pose over `blend_t` (0.3–0.6 s), with position and rotation eased, and switches the body to kinematic.
- **Missed capture:** the car stays in `free` and rolls onto the authored fallback line, e.g. the through lane at the LP01 junction. It is never teleported.
- **Release zone:** the kinematic body is handed back to dynamic with the current velocity vector, so no speed jump.

**Checks:**
- **C1:** no position jump > 0.25 m and no rotation jump > 10° per frame during capture or release.
- **C2:** a missed capture never traps the car. A drivable way out always exists.

### 3.4 Junctions everywhere: ground and air ("Weiche" as a general choice point)

- **A junction is any fork:** two or more options leave one choice point, e.g. through lane vs loop, or `flight_free` vs `skydive_guided` after a Rhine jump pad.
- **Decision window:** in `[s0, s1]` before the fork, steering input picks the option. Without input the authored **default option** is taken, so there is never a dead end.
- **Hints:** each option is announced by **glowing HUD arrows / branch signs** (default). Optionally also by in-world clay signage from the design-language job. The hint shows the target mode, e.g. a magnet icon for `magnet_pull` or a parachute for `skydive_guided`.
- **Air junctions:** after a `magnet_push` launch or a `bounce` pad, the same rules apply in the air. The choice picks the air mode; the landing sockets are authored.

**Checks:**
- **J1:** every junction has a default option and a hint for every option.
- **J2:** the decision window is ≥ 1.5 s at the design speed.

## 4. Skins = ribbon layer sets (view only)

The same centreline and frame for every skin. The layers are offsets in the track frame.

| skin | layers (lateral / height) | default mode |
|---|---|---|
| `road` | edge L/R ±lane/2, centre stripe, barriers ±(W/2+0.2) at 1 m | `free` / `assist` |
| `race` | + curbs at the edges, run-off | `free` |
| `coaster` | 2 round rails (tube), spine below, ties every n m | `locked` |
| `rail` / `mine` | 2 rails at gauge, sleepers, ballast band | `locked` |
| `cosmic` | 2–4 glowing bands, no deck (or a glass deck), particles | `zero_g` / `assist` |
| `magnet` | coaster skin + pulsing field rings at the zones | `magnet_pull/push` |
| `cloud` / `bumper` | soft pad surface, no rails | `bounce` |

**Rules:**
- **Skin change at a section border:** a short 3–6 m transition piece. The layers morph or fade; no hard cut.
- **Junctions ("Weiche"):** shared deck up to a gore nose, then the inner layers start (LP01 v2).
- **Look:** clay material, colours and rail cross-sections come from the design-language job (Claude Design). This spec only fixes names, offsets and rules.

## 5. What goes into the JSON (additive to `routes.json`)

- `sections[]`
- `zones[]`
- `roll` per sample (explicit laws only)
- `skin` per section
- `sockets[]` with `kind`

The existing fields stay unchanged.

## 6. First consumer: LP01 v3 (Coworker, Blender preview only)

**Sections:**
1. T: `road` + `free`.
2. L split: `road` + `assist`.
3. Capture zone.
4. Run-up: `magnet` + `magnet_push`.
5. Ring: `coaster` + `locked` + `loop`.
6. Release.
7. Run-out: `road` + `assist`.
8. Merge.

**Blender deliverables:**
- skin preview as ribbon layers;
- zone markers;
- stilt sockets;
- the same checks (F1, L1, C1-geometry).

## 7. Georg's answers (27.09)

1. **v13 exists** and has the same track as v11. v11 stays the reference file.
2. **Names are strict EN.** Kayfab/wrestling/comic names (e.g. "gutter jump") are optional frontend labels only.
3. **Rhine jump pads depend on the travel mode, with the same physics for all vehicles.**
   - Free roaming/flight and guided skydive are treated **like junctions** (§3.4).
   - Options are shown by glowing HUD arrows / branch hints (default), optionally also as clay 3D signage.

## 8. Open

- Frontend label set (Kayfab/comic): later, and only if Georg wants it.
- Mapping of the travel modes (overworld/travel globe) onto these section modes: to be checked against the travel runtime (`_handoff/KFB_Travel_Runtime_Review_v3.md`) before any build.
