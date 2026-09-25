# Track Core · evidence · 2026-09-26

Status: **PLANNING EVIDENCE · no new runtime tests in this slice**

## Read at planning time

### georg-doc/kayfabizarro
- PR #216 `chat/cologne-route-01-plan-2026-09-25` @ `db633acd9b31013053dc59583bd50a8f2bb59a7a`: open, not merged, planning only. Its Cloudflare Pages build failed on that commit; the PR itself has no runtime.
- RKIT-10 per #216 is **not started**: the Race branch `chat/rkit-10-modular-route-adapters-2026-09-25` does not exist (Race branch list read 26.09.2026).

### georg-doc/KFB-Stunt-Car-Race (private; read through Georg's Chrome)

Branches present (newest first, excerpt):

- `main` (24.09);
- `chat/rkit-08-09-stunts-2026-09-25` (PR #41);
- `chat/rkit-07-gc-canyon-2026-09-24` … `chat/rkit-01-track-kit-2026-09-24`;
- `claude/rkit-01-2026-09-24`;
- `chat/racer-tarch0-sp13ktra-2026-09-23`;
- `chat/racer-rstab1-geometry-2026-09-23`;
- `chat/racer-rstab0-audit-2026-09-23`;
- `wsa/track-ribbon-st01b-2026-09-19`;
- `planning/track-environment-grammar-2026-09-19`;
- others (HUD, OSM depth ink).

Game runtime track code on `main`:

- `KFB Cologne Race Option C-3/lab-v9/cologne-track.v1.js`: 381 lines, "TrackFlowDeformer". It has its own `ribbon()` and `crossPoint()`, `buildTrack(THREE, route, opts)`, `TUNNEL_SHELL`, and topology tags SURFACE_BOUND / STRUCTURE / TUNNEL.
- `KFB Cologne Race Option C-3/lab-v9/cologne-route.v1.js`: 213 lines. It has its own `TRACK_WIDTH = { NARROW 14.4, STANDARD 18.0, WIDE 21.6, HERO 28.8 }`, which differs from the RKIT width classes (10.8 / 14.4 / 18 / 21.6 per PR #204). It also has `CONTROL_POINTS`, `ANCHORS` in the dom-zentrum-v0 ENU frame, and `buildRoute()`.
- `racetrack01/src/track.js` (33 lines) and `race/src/*`: older runtimes, not analysed.

These lines were read from Georg's Dropbox mirror of the repo at `cc80f4a` (23.09). `main` has advanced since then (24.09).

**Not read yet (census gate):**
- `wsa/track-ribbon-st01b-2026-09-19`;
- `planning/track-environment-grammar-2026-09-19`;
- `chat/racer-rstab1-geometry-2026-09-23`;
- `ChatGPT_web/track-lab` (v0.8 feel, v0.10 topology);
- how the Race physics builds its track colliders.

## RKIT-11 facts from the session that triggered this slice (Blender, 25.–26.09.2026)

- Candidate files: Race branch `chat/rkit-11-rhein-run-2026-09-26`, folder `KFB Cologne Race Option C-3/rkit-11/`. Its `RETURN.md` lists defects first.
- **Transition piece v2** (`transition_lib.py`):
  - funnel from the bridge carriageway (9.85 m) to the 6 m loop lane;
  - barriers rise out of the host outside the lane;
  - host lines blend into track lines;
  - stripes grow in last;
  - the track road surface stays hidden under the host until the loop leaves the deck.
  - Visually accepted as a direction only. Georg rejected the **architecture**: separate bridge track plus separate loop track.
- Hacks this slice must remove:
  - `transition_lib.install()` replaces `sweep3d_lib.section_profile` at runtime;
  - `build_rkit11_stunts.py → host_line()` rebuilds the bridge's `BR_line_*` meshes with cuts;
  - loop frames carry special `ts` / `bs` / `tr` fields.
- Width-class mismatch seen in practice: bridge carriageway 9.85 m, loop lane 6 m, kit classes 10.8+.

## Tests in this planning slice

Blender / runtime / browser tests: **0**. Stage deployments: **0**. Live claims: **0**.
