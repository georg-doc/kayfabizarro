# Track Core · evidence · 2026-09-26

## Research / source delta · 2026-09-26

### Perplexity intake reviewed

Source:

`tools/KFB-ToolBox/_inbox/KFB Race Track Baukasten TBD perplexity 01.md`

Blob at current `kayfabizarro/main` read in this review:

`866ddd9f46fff6c2b9c0fc194052bb3f80256ab4`

Useful mechanisms extracted:

- graph/RouteRecipe semantics;
- connector boundary state;
- Clothoid/Euler curvature transitions;
- width/height/barrier parameter transitions;
- separate geometry/style/prop/FX layers;
- multi-metre staggered transition zones.

The example Python is **not** accepted as production donor:

- its “Clothoid” curve is a circular arc;
- endpoint propagation is explicitly simplified/incomplete;
- separate road/line/barrier meshes recreate the rejected multi-track seam problem;
- generic materials conflict with existing KFB owners;
- destructive `clear_scene()` is not production-safe.

Detailed classification:

`PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`.

### RKIT-11 is now GitHub-visible

Race PR #42:

`RKIT-11 Rhein-Run candidate: Mülheimer Brücke + Pylon-Loop + Rhein-Hüpfer`

Branch:

`chat/rkit-11-rhein-run-2026-09-26`

Exact observed head:

`bcc422b00fc4629ac113f086cddcea3b2b107f2a`

Status in its Return:

`CANDIDATE · FROZEN AS ACCEPTANCE TEST FOR THE TRACK CORE · not Race-driven · no Stage · no Live`.

Important source facts:

- `rkit-11/transition_lib.py` uses smoothstep parameter timings for width/barrier/lines/stripes/slab;
- implementation is rejected because it monkey-patches `sweep3d_lib.section_profile`, cuts host marking meshes and uses special transition frame fields;
- those timings are retained as mechanism evidence for Track-Core parameter curves;
- bridge/loop/hop become acceptance fixtures, not canonical track systems.

RKIT-11 tests reported by its own Return:

- Blender builds OK;
- loop clearance brute-force min = 0.78 m;
- headless Chromium viewer smoke = 0 page errors (pre-transition viewer);
- Georg visual Blender review occurred;
- Race drive test = 0;
- Rapier contact test = 0;
- Stage = 0.

### Prepared execution briefs

- `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md`
- `BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md`
- `WEBCHAT_TRACK_CORE_1B_RUNTIME_PARITY_BRIEF.md`
- `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md`

Current order:

`Web census/contract → Georg language gate → Blender MCP proof → Web authoritative core/runtime parity → Claude Design visual grammar → Playable Track R0 → Köln OSM Route 01`.

---

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
