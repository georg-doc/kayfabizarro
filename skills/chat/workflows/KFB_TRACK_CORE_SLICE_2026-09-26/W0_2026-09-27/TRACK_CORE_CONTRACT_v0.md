# Track Core contract v0 · 2026-09-27

**Status:** W0 draft for Georg's review. It is backed by a runnable reference, `track-core/track-core.mjs`, tested with `node test.mjs`.
**Language:** JavaScript is the authoritative core (Georg, G0, 27.09). Blender/Python is oracle, preview and scenery atelier, never a second solver.
**Pipeline:** `RouteRecipe → pieces → centre-line samples → frames → slot profile + parameter curves → marking bands → checks → stream`. Consumers (runtime mesh, Rapier / route-space colliders, WorldBuilder placement, Blender import, GLB bake) read the stream and never re-solve it.

This contract merges the separate W0 files the brief listed (frame, curvature, slot, parameter curves, markings, pieces, checks) into one document, because they only make sense together. The piece schema is a separate JSON file.

---

## 1 · Frame

| Field | Meaning |
|---|---|
| `s` | arc length in metres, measured on the final 3D polyline |
| `p` | position `[x, y, z]`, metres, runtime world: right-handed, **+Y up** |
| `T` | unit tangent |
| `U` | unit road-up (surface normal of the driving surface) |
| `R` | `T × U` = **driver's right** |
| `kappa` | 1/m: plan curvature on `guide` samples (> 0 = right turn), vertical curvature on `rmf` samples |
| `bank` | radians, rotation of `U` about `T`; > 0 lowers the right edge |
| `grade` | rise per horizontal metre |
| `law` | `guide` or `rmf` (below) |
| `tags` | piece type plus recipe tags (semantic, e.g. `parkdeck_ramp`, `crossing_ok`) |

- **Heading.** `psi = 0` drives towards +Z, and `psi > 0` turns right. `T = (−sin psi·cos phi, sin phi, cos psi·cos phi)`, where `phi` is pitch.
- **Legacy mapping.** Donors use `n = U × T` (driver's left). The adapter uses `n = −R`.
- **Blender.** `rkit_lib.to_bl(x, y, z) = (x, −z, y)`, unchanged.
- **OSM.** Local ENU uses x = east, y = up, z = north. That is an odd permutation (mirrored), so the OSM → RouteRecipe adapter must flip one axis. Which axis is decided in K1 and checked by a known-landmark chirality test (for example, the Dom is west of the Rhine).

**Frame laws (one frame type, two ways to fill it):**
- **`guide`.** For flat, graded and banked road: `U0 = normalize(Y − T·T.y)`, then rotated by `bank` about `T`. This covers every 2D road; a flat route is the special case `phi = 0`.
- **`rmf`.** For 3D pieces (LOOP, later corkscrew, cascade): a rotation-minimising frame (double reflection), seeded from the previous frame.
  - At the end of an `rmf` run, the residual twist against the exit `guide` frame is distributed linearly over the run. This is the closure rule of track-lab A0.
  - Result in the test fixture: world up is restored exactly after the loop, with no roll flips.

## 2 · Curvature and ease (clothoid)

- **Plan pieces** define `kappa(s)`. Position integrates heading with the midpoint rule at `ds` (default 0.5 m).
- **CURVE_EASE / HAIRPIN_180 / SPIRAL:** linear curvature ramp (Euler/clothoid) `0 → 1/R` over `ease` metres, arc, then ramp down.
  - If the turn is too small for the ease, the piece becomes a pure clothoid pair.
  - Defaults: `ease = 0.6 R` (curves), `0.8 R` (hairpins), `0.5 R` (spirals); each is a parameter.
- **OFFSET_S:** heading `A·sin²(πs/L)`, with `A` solved numerically for the requested lateral shift. Curvature is continuous and zero at both ends.
- **LOOP:** vertical `kappa = kmax·sin²(πs/L)`, `kmax = 4π/L`, lateral drift `D·smootherstep(s/L)`. This is the RKIT-08 law; `L` is solved from height `H`.
- **Required continuity:**
  - position C0;
  - tangent C1;
  - curvature continuous within one law. The only curvature step allowed is at a `guide`↔`rmf` boundary, where both sides have `kappa = 0`.
- **B2 (Blender sprint):** compares clothoid against fillet-plus-smoothing on 90°, hairpin, S, chicane and OSM corners. Clothoid is the reference default because it costs nothing here.

## 3 · Bank and grade

- **Auto-bank** is `gain·kappa` (default 26, the donor rule), clamped to ±24°, and smoothed with a triangular window of ±24 m.
  - It uses `guide` samples only; the window never reaches into `rmf` runs. This is the v4 lesson.
- An explicit `bankDeg` on a piece overrides auto-bank. The parking-deck spiral uses −6°, because auto-bank tilted the spiral 24° into the deck above it and the self-clearance check caught that.
- **Grade:** a piece's `rise` with an ease (default `smootherstep`), so grade is continuous at joints.

## 4 · Slot profile

- **14 named slots, fixed order and count:**
  - left side: `under_L, barrier_out_bot_L, barrier_out_top_L, barrier_in_top_L, barrier_in_bot_L, shoulder_L, road_L`;
  - right side: `road_R`, then the right-hand mirror of the same set, ending at `under_R`.
- Each slot is `(lateral, lift)` in the frame, and a world point is `p + R·lateral + U·lift`.
- **Defaults** (RKIT fixed-barrier profile at the 18 m reference, metres):
  - shoulder 1.98 (drop 0.28);
  - barrier gap 0.72, thickness 1.62;
  - inner top 1.35, outer top 1.18;
  - deck depth 2.25.
- **Barrier visibility** `barrierVisL/R ∈ [0,1]` blends the barrier tops between flush (sunk 0.35 m below the road, invisible) and full height. That blend is the taper.
- Because the slot count never changes, any two profiles interpolate without a seam. **A transition is only a parameter blend.**
- **Coverage:**

| Case | How the contract describes it |
|---|---|
| 10.8 / 14.4 / 18 / 21.6 classes | width |
| 28.8 bowl / landing pad | width 28.8 as a special profile |
| barrier-free road | `barrierVis = 0` |
| 6 m magnet lane or 9.85 m bridge carriageway | width + offset |
| city street with curb and walkway | shoulder as walkway, barrier as curb (low `barrierH`). Extra curb/walkway slots are v0.2 if Claude Design needs them. |

## 5 · Parameter curves over s

- **Names:** `width, offset, shoulderW, shoulderDrop, barrierGap, barrierT, barrierH, barrierOuterTop, deckDepth, barrierVisL, barrierVisR`.
- **A piece sets a target per name:** `{to, ease: step | linear | smoothstep | smootherstep, zone: [u0, u1]}`, where `u` is 0…1 along the piece. Values carry over between pieces.
- **Staggered zones make the taper.** Georg's rule is that barriers taper in and run longer than the lane pattern. The RKIT-11 donor preset `TR_STAGGER` is:
  - width 0–0.85
  - barrier 0–0.75
  - lines 0.30–0.80
  - stripes 0.55–1.0
- `step` is allowed only when it is semantically intended. The stream exposes it, and the test fixture flags a hard barrier step for review.

## 6 · Markings: their own layer

- **Styles are data:**
  - `TRACK`: edge lines;
  - `STREET`: edge lines plus a dashed centre line, 3 m on / 3 m off;
  - `MAG`: edge lines plus bars on a 3 m pitch;
  - `NONE`.
- The core emits **bands** `{style, id, side, s0, s1, lat, w}` over metric `s`. It never cuts the road mesh or another piece's markings.
- **Consumers** draw bands as surface splits (co-planar) or decals with the project's depth-layer discipline. The S-T01 UV shader is the precedent for markings as material.
- A style change between pieces is a new band set starting at the joint. Blending line width and position through a transition uses the `lines` zone in v0.2.

## 7 · RouteRecipe and pieces

- **Schema:** `kfb.route-recipe/0.1-draft`, the successor of RKIT-04 `kfb.rkit.route-recipe.v0` (same semantics, see census #15). Its fields are `id, units, start{p, headingDeg}, defaults{widthClass, markings, profile, autoBank}, pieces[]`.
- **Every piece has** `id, type`, type parameters, and optionally `width | widthTo`, `params{}`, `markings`, `bankDeg`, `rise`, `tags`. The schema is in `TRACK_PIECE_SCHEMA_v0.json`.
- **Implemented in the seed:** `STRAIGHT, CURVE_EASE, HAIRPIN_180, OFFSET_S, SPIRAL, WIDTH_STEP, LOOP`.
- **Specified, not implemented yet (S2):**
  - `CHICANE` (two OFFSET_S);
  - `CREST / DIP` (rise with bell ease);
  - `KICKER / LANDING`, where the airborne span is tagged `air` and has no surface (RKIT-02/09 profiles);
  - `STREET_TO_TRACK` (profile blend preset);
  - `FUNNEL / LANE_TAKEOVER` (width + offset blend);
  - `SPLIT / MERGE`.
- **SPLIT / MERGE are graph edges, not pieces with their own sweep:**
  - `SPLIT_HALF`: HERO 21.6 → 10.8 | 10.8, the Rhein-Run D1 answer;
  - `SWITCH_Y`: one lane in, two same-width lanes out.
  - A branch route starts at a socket frame of the parent, with a lateral offset. While the decks touch, the inner barriers are `barrierVis = 0`, and they rise at the gore (1.0 m gap, RKIT-04 rule).
  - Georg asked for a switch with a default option and HUD arrows. That lives in `junctions[]` of the recipe; data only, Race owns behaviour.
- **One compiler.** OSM routes, authored routes and seeded routes all compile through `compileRecipe`. There is no second route compiler, and the PR #216 route recipe is this schema.

## 8 · Checks (per compile, real counts)

| Id | What | Proposed limit |
|---|---|---|
| `s_monotonic` / `s_matches_arc` | `s` strictly increasing and equal to chord length | 0 / 1e-6 m |
| `frame_orthonormal` | T, U, R orthonormal | 1e-6 |
| `frame_flips` | consecutive R never reverse | 0 |
| `tangent_kink` | jump of the measured turning rate between neighbours | 0.5 °/m |
| `curvature_step` | κ jump within one law | 0.01 1/m |
| `bank_rate` | roll change | 1.5 °/m |
| `slot_parity` | all 14 slots finite at every sample | 0 |
| `inner_edge_fold` | outermost inner slot stays inside the plan radius | ≥ 0.5 m margin |
| `self_clearance` | section corners of parts ≥ 40 m apart along s | ≥ 2.5 m, unless both are tagged `crossing_ok` |
| `fingerprint` | FNV-1a over the rounded stream; must be deterministic | stable across runs |

- **Later (B1 / W1):** GLB ↔ stream frame parity; runtime collider ↔ stream parity; duplicate / coplanar faces at splits; g-load and assist envelope (RKIT-08 formulas); marking continuity through blends.
- **The limits are proposals, not canon.** Georg or Race confirms them on the first real track.

## 9 · Drive modes hook (from the modes spec v0.1)

- Pieces may carry `mode` and `roll_law` tags (`free | assist | locked | magnet_push | magnet_pull | zero_g | flight_free | skydive_guided | bounce`).
- **New from Georg (27.09):** in magnet sections, stopping on track is allowed (`hold_allowed`).
  - The player brakes with S (optionally with a "magnetic wheels" power-up) and gets a free camera.
  - The camera swings back to the driving view when the car moves; pulling away uses the magnet push.
  - There is no automatic stop.
- The core only carries these tags. Race owns behaviour, contact, camera and physics, for all vehicles alike.

## 10 · Stream (what consumers get)

- **Schema:** `kfb.track-core.stream/0.1` with `{core, id, ds, slots[14], joints[], samples[], markings[], fingerprint}`.
- **Each sample:** `{s, p, T, U, R, kappa, bank, grade, law, tags, prm{…}, marking, slots[[lat, lift]×14]}`.
- **`slotWorld(sample, i)`** returns the world point of slot `i`.
