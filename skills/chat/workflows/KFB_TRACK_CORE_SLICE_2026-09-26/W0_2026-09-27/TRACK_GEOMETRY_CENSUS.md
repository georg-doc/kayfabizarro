# Track geometry census · W0 · 2026-09-27

**Author:** Claude Coworker, W0 of the Track Core sprint plan. Georg assigned W0 to the Coworker on 27.09.
**Scope:** every known path that builds a centre line, frames, a cross-section, markings or track colliders.

## How this was read

- **kayfabizarro:** read on GitHub at exact SHAs (all branches, blobless). `main` = `89a8f0a7d8a9e2e1948e8079f16eb89b616ac7db`.
- **KFB-Stunt-Car-Race (private):** not reachable from this session's GitHub grant. It was read from Georg's local clone in Dropbox (`CLAUDE/KFB Stunt Car Race`).
  - Local `main` = `df1e35b5692273e8a48eaa219697c927e2c39faa`, taken from `FETCH_HEAD` of the clone's last fetch. Branch heads come from the same `FETCH_HEAD`.
  - Files in the local working tree may lag branch heads. Where only a mirror or doc was read, the entry is marked **[mirror]** or **[doc]**.
- **RKIT Blender kits:** read from `CLAUDE/KFB Racetrack Blender Kit/RKIT-xx/scripts/`. These are the sources of Race PRs #34–#42, which are not merged.

## Handedness (cross-cutting finding)

- Every donor (JS and Python) builds its lateral vector as `n = up × forward`. With forward `+Z` and `+Y` up in a right-handed world, that is `+X`, which is the **driver's left**.
  - The donors agree with each other, so nothing is broken today.
  - The Track Core contract fixes the name: `R = T × U` is the driver's right, and the legacy `n` equals `−R`. Adapters for old consumers flip one sign.
- Width classes disagree:
  - C-3 `TRACK_WIDTH = {NARROW 14.4, STANDARD 18, WIDE 21.6, HERO 28.8}`;
  - the adopted ladder (WSA D2, PR #204) is **10.8 / 14.4 / 18 / 21.6** (28.8 is a special profile only);
  - S-T01, RKIT and the new core use the adopted ladder;
  - C-3 must be mapped when it consumes the core.

## Summary

| # | Path | Lang | Lines | Frame law | Status |
|---|---|---|---|---|---|
| 1 | Race `KFB Cologne Race Option C-3/lab-v9/cologne-route.v1.js` (local clone) | JS | 213 | flat horizontal normal, Catmull | LEGACY_REFERENCE |
| 2 | Race `…/lab-v9/cologne-track.v1.js` TrackFlowDeformer (local clone) | JS | 381 | bank as vertical **shear**, one mesh per marking | REJECTED_FOUNDATION |
| 3 | Race `…/lab-v9/cologne-play.v1.js` contact host (local clone) | JS | 401 | 2D projection, shear-consistent | CONSUMER_TO_KEEP |
| 4 | `kfb-hub/stunt-race/track-lab/track-lab-a0.mjs` (A0 + T3 spike) [mirror of Race `ChatGPT_web/track-lab`] | JS | 62 (minified) | **parallel transport + closure twist** | CORE_DONOR |
| 5 | `…/feel-lab-v08.mjs` accepted v0.8 feel (Race `5dd2142b`) [mirror] | JS | 345 | same | CONSUMER_TO_KEEP |
| 6 | `…/feel-lab-v09.mjs` (v0.9, rejected topology) [mirror] | JS | 420 | open/closed transport, `addStrip` | LEGACY_REFERENCE (code donor) |
| 7 | `race-track-adapter.mjs` + `FLOW_LOOP_RECIPE_A0.json` (`kfb.assembly-a0/0`) [mirror] | JS/JSON | 43 + 83 | refs only | CORE_DONOR (recipe validator, ownership split) |
| 8 | S-T01 Track Ribbon (Race PR #14, tested `9d67a259`) [mirror] | JS/JSON | 467 + 181 | transport | TEST_ORACLE |
| 9 | v0.10 topology blockout (Race PR #4 `12da68a3`) [mirror] | JS/JSON | 127 + 348 | none | TEST_ORACLE (split/merge/overpass semantics) |
| 10 | TARCH-0 proof (Race PR #33) [mirror] | HTML/JS | 126 | n/a | LEGACY_REFERENCE |
| 11 | TC-01 terrain corridor (Travel-Globe PR #31) [mirror] | JS | 289 | sphere normal | LEGACY_REFERENCE |
| 12 | RKIT-01 `rkit_lib.py` + `kfb_route.py` (PR #34 `f368dd0c`) | Py | 476 + 69 | runtime shear port | TEST_ORACLE (cross-section donor) |
| 13 | RKIT-02 `rkit2_lib.py` jumps/flaps (PR #35 `37047b5a`) | Py | 271 | flat frames | TEST_ORACLE (KICKER/LANDING) |
| 14 | RKIT-03 `rkit3_lib.py` + `route_compiler.py` (PR #36 `ac4a57cf`) | Py | 650 + 266 | flat frames, bank rule | TEST_ORACLE |
| 15 | RKIT-04 `rkit4_lib.py` + `route_compiler.py` + `track_a_stunt_8.recipe.json` (PR #37 `3c002235`) | Py/JSON | 248 + 323 | offset frames | **CORE_DONOR** (recipe schema `kfb.rkit.route-recipe.v0`, split/merge rules) |
| 16 | RKIT-08 `stunt_lib.py` loops (PR #41 `22c3b2e2`) | Py | 273 | pitch-rotated up | **CORE_DONOR** (loop maths, envelopes, clearance) |
| 17 | RKIT-09 `sweep3d_lib.py` + `skyramp_lib.py` (PR #41) | Py | 100 + 145 | 3D T/N/U | TEST_ORACLE |
| 18 | RKIT-11 `build_rkit11.py`, `build_rkit11_stunts.py`, `transition_lib.py` (PR #42 `bcc422b0`) | Py | 424 + 318 + 130 | 3D, monkey-patched profile | SUPERSEDED as geometry · TEST_ORACLE as acceptance scene |
| 19 | SC01 / SC02 scenery builders + `scenery_route.py` (kayfabizarro PR #226) | Py | 400 + 390 + 107 | flat right rolled by bank | CONSUMER_TO_KEEP |
| 20 | LP01 v1–v5 route proofs (PR #226) | Py/JSON | 580 (v5) | guide vector + roll | LEGACY_REFERENCE (zones / junctions / modes / skins / cable-rule schema) |
| 21 | World Flight Clay C0 `track-module-c0.mjs` (kayfabizarro PR #243) | JS | 51 | flat, true driver-right | CONSUMER_TO_KEEP (WorldBuilder placement seam) |
| 22 | OSM `cologne-dom-zentrum-v0` world-zone `roads.json` (PR #241) | JSON | 5.1 MB | ENU metre frame | CONSUMER_TO_KEEP (upstream seam) |
| 23 | OSM corridor consumer contract (Hürth → Ehrenfeld) | MD/JS | 152 | ENU | CONSUMER_TO_KEEP |
| 24 | `osm-city-drive/src/city-geometry.mjs` `appendRibbon` | JS | 319 | flat per segment | LEGACY_REFERENCE |
| 25 | Race `race/` Slice-04 Rapier `physics.js` + `world.js` (local clone) | JS | 13.6 KB + 15.2 KB | world arcs | CONSUMER_TO_KEEP (Rapier contact owner) |
| 26 | Race `racetrack01/src/track.js` (local clone) | JS | 33 | Kenney tile chain | LEGACY_REFERENCE |
| 27 | World Atlas `track-chain.js` / `road-solver.js` | JS | 146 / 163 | tile grid | LEGACY_REFERENCE |
| 28 | Track socket / stunt registry (PR #204) | JSON | — | n/a | LEGACY_REFERENCE (owner rules carried over) |

## Records that decide the core

### 4 · track-lab A0 (+ v0.9 variants): prime JS donor for frames
- **Functions:** `resample` (even arc length), `tangents`, `transportedFrames` (parallel transport by quaternion with the closure twist distributed linearly), `sample(s)`, `selfTest` (orthogonality < 1e-3, right-vector continuity), and an FNV hash over the stable-stringified recipe.
- **Adopted as principle in `track-core.mjs`:**
  - even samples;
  - rotation-minimising frames on 3D pieces (double-reflection form);
  - twist closure distributed along `s`;
  - self-test plus fingerprint.
- **Not adopted:**
  - sample-index dash patterns (`i%34<20`), which are replaced by metric marking bands;
  - one global road width, which is replaced by the slot profile and parameter curves.

### 15 · RKIT-04 route compiler: prime recipe donor
- `kfb.rkit.route-recipe.v0` is a real, compiled schema. It defines:
  - `segments` (straight / arc with `len`, `radius`, `turn`, `width_profile`);
  - `elevation` rules (hold / smoothstep / module);
  - `modules` (JUMP_HERO_30, JUMP_BASE_12, BRIDGE_CROSSING, WIDTH_FUNNEL, STUNT_BOWL, PIT_LANE);
  - `reserved_slots`;
  - `rules` (pillar spacing, min soffit, crossing clearance 4.5 m).
- The new recipe (`kfb.route-recipe/0.1-draft`, contract §7) keeps those semantics. It changes three things:
  - pieces carry their own clothoid ease;
  - width and barrier changes are parameter curves, not separate module sweeps;
  - split/merge becomes graph edges.
- `rkit4_lib` also supplies the split rules: fixed-barrier profile, gore gap 1.0 m, gore nose, and dashed divider only where the lanes no longer overlap.

### 16 · RKIT-08 stunt_lib: loop donor
- Teardrop loop with `κ = kmax·sin²(πs/L)`, `kmax = 4π/L`, lateral drift `D·smootherstep(s/L)`.
- Also provides the energy envelope, the magnet-assist envelope, self-clearance and cascades.
- `track-core.mjs` LOOP uses the same curvature law and drift, then frames it with the core's rotation-minimising law.
- **Test result:** apex exactly H; up = −Y at the apex; world up restored after exit.

### 1–3 · C-3 Cologne runtime (local clone)
- Catmull route with a flat normal; bank is applied as a vertical shear (`y += sin(bank)·off`), so the road never narrows in plan when banked.
- `cologne-track` builds one mesh per marking and its own width classes.
- Georg rejected this multi-path pattern on 26.09. It stays the running game until the core replaces its route and track builders.
- `cologne-play` (contact) must move from 2D shear projection to frame-local `(R, U)` projection. That is W1 / Race-owned.

### 12 / 14 · RKIT-01 / 03 cross-section
- `TB` fractions are the runtime profile:
  - road 1.00; shoulder 1.22; barrier inner 1.30, outer 1.48;
  - inner top 1.35 m, outer top 1.18 m, outer bottom −1.15 m;
  - underside drop 2.25 m.
- At the 18 m reference these become the core's `PROFILE_DEFAULTS` in metres: shoulder 1.98, barrier gap 0.72, barrier thickness 1.62. This is the RKIT-04 "fixed barrier" rule: only road width changes with the width class.
- **Stale constants:** RKIT-02 still carries `G_RACE 19 / V_MAX 41`. D1 (PR #204) says g 15 / 27 m/s, which RKIT-08 / 09 use. Any RKIT-02 envelope must be recomputed at D1.

### 18 · RKIT-11 transition
- `transition_lib` monkey-patches `sweep3d_lib.section_profile`, and the stunt script cuts the bridge's lane lines. Both are superseded.
- Its zone timings survive as a parameter-curve preset:
  - width 0–0.85
  - barrier 0–0.75
  - lines 0.30–0.80
  - stripes 0.55–1.0
  - slab 0.85–1.0
- Its flush-barrier depth (`SINK 0.35`) survives as the core's barrier-visibility blend.

## Not read (open)
- Race branch heads other than what the local working tree holds: `wsa/track-ribbon-st01b`, `planning/track-environment-grammar`, `chat/racer-rstab1-geometry` at `9e4636a1`. Their mirrors were read.
- Race v0.10 `test.mjs` / `browser-test.mjs` (not mirrored).
- A WorldBuilder seam that consumes a route recipe: none exists yet.
