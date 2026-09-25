# Track Core · sprint plan (Blender-lane focus) · 2026-09-26

**Author:** Claude Coworker + Blender MCP.
**Supersedes for execution:** the ladder in `START_HERE.md` / `RETURN.md` (0 → language gate → 1A → 1B → 2). The existing briefs stay as detailed references. `BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md` is split into sprints **B1–B5** below.
**Inputs:** Track Core decision, `PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`, `SP13KTRA_DONOR_ALIGNMENT.md`, Race PR #42 (RKIT-11 fixture).

## 0 · Three changes to the ladder

These were proposed to Georg on 26.09; he answered "top".

1. **Decide the language before TRACK-CORE-0, not after.** The authoritative core is **JavaScript**, because:
   - editor and game are web;
   - the C-3 runtime already builds its track in JS.

   The census still reads everything, but it no longer decides the language.
2. **Reference first, not paper first.** TRACK-CORE-0 delivers the contract **plus a small runnable JS reference**:
   - samples, frames, profile function, paint;
   - Node-tested, with a fingerprint.

   A contract nobody ran is untested.
3. **Blender is the oracle, not a second solver.** Blender imports the core's output (JSON sample stream + GLB) and checks it independently. It never re-implements clothoids or frames in Python as a second truth.

   Python code in the B-sprints is limited to:
   - an importer;
   - independent checks;
   - visual proof;
   - authoring the scenery shell (pylons, cables, portal).

## 1 · Sprint overview

| # | Sprint | Agent | Needs | Output |
|---|---|---|---|---|
| **G0** | Language + ladder confirmation | **Georg** | this plan | one word: JS yes/no |
| **W0** | TRACK-CORE-0 census + contract + JS reference seed | ChatGPT Web + GitHub | G0 | contract, `track-core` JS module v0, Node tests, census table |
| **B1** | Oracle bridge: core → Blender | **Claude Coworker + Blender MCP** | W0 | importer, check suite, donor isolation sheet |
| **B2** | Curvature proof: fillet+smoothing vs clothoid | **Coworker + Blender** | B1 | κ(s)/bank(s) plots, side-by-side corners, recommendation |
| **B3** | Profile + transitions + markings | **Coworker + Blender** | B1 (W0 profile) | slot atlas, STREET→TRACK, lane takeover, marking emission proof |
| **B4** | 3D pieces: loop, kicker, landing, crossing | **Coworker + Blender** | B1, W0 frame law | RMF proof, self-overlap projection test, air re-capture envelope |
| **B5** | RKIT-11 acceptance scene from one recipe | **Coworker + Blender** | B2–B4 | bridge + loop + hop from the core, hacks gone, comparison sheet |
| **W1** | Runtime parity + contact decision | ChatGPT Web + GitHub | B5 | C-3 runtime builds from the core; `project(pos, sHint)` contact proposal; numeric parity vs Blender |
| **D1** | Visual transition grammar | Claude Design | W1 | styles, props, look on the proven core (geometry read-only) |
| **R0** | PLAYABLE_TRACK_R0 | Web + Claude Design | D1 | first closed playable track |
| **K1** | Köln Route 01 corridor | Web (+ Blender for landmarks) | R0 | OSM corridor on the same recipe |

Every sprint:
- returns a `RETURN.md` with defects first;
- has an additive `CHANGELOG.md`;
- reports real test counts;
- names exactly one next gate.

No auto-merge, no Stage, no Live without Georg's explicit yes.

## 2 · Blender sprints in detail

### B1 · Oracle bridge (core → Blender)

**Goal:** Blender shows and checks exactly what the JS core produced.

- **Importer:**
  - reads the W0 sample-stream JSON (samples, frames, params, paint) and the core's baked GLB chunks;
  - builds debug overlays: frame axes every n samples, `s` ticks, paint spans, slot polylines.
- **Independent checks** (Python, own maths; they do not call the solver):
  - frame orthogonality;
  - frame-flip count;
  - `s` monotonicity;
  - joint deltas (position / tangent / bank / height);
  - slot parity across joints;
  - co-planar duplicate faces;
  - GLB ↔ JSON frame parity.
- **Donor isolation sheet**, shown in Blender before anything new:
  - RKIT base profile;
  - CITY_STREET;
  - RKIT-08 loop;
  - RKIT-11 bridge carriageway;
  - RKIT-11 transition v2.
- **Review workflow (Georg 25.09):** Claude sets the view in Georg's open Blender (local view); Georg orbits and does not save. Screenshots are only for self-checks.

**Done when:** a W0 fixture round-trips JS → Blender with 0 check failures, and the donor sheet is shown.

### B2 · Curvature proof

**Goal:** decide with evidence how much clothoid we need.

- **Same five fixtures, two laws each:**
  - 90° corner;
  - 180° hairpin;
  - S-offset;
  - chicane;
  - OSM-like polyline corner.

  (a) circular fillet with smoothed curvature driving bank; (b) true clothoid in / arc / out. Both are produced by the **JS core** (W0 exposes both laws).
- **Blender shows for each fixture:**
  - κ(s) and bank(s) plots;
  - the edge polylines at the **full width including barriers**;
  - chase-cam views.
- **Checks:**
  - **inner-edge fold** (half-width vs radius);
  - max bank rate;
  - lateral jerk proxy.
- **Output:** recommendation per piece family, for example "clothoid for hairpin / street fit, fillet for broad corners". Georg decides on the chase views.

**Done when:** both laws are shown on all fixtures, the fold check is automatic, and there is one recommendation.

### B3 · Profile, transitions, markings

**Goal:** prove "transition = parameter blend" and "markings = surface split".

- **Slot atlas**, all from one profile function, labelled:
  - barrier-free road;
  - CITY_STREET (curb + walkway);
  - RKIT standard / wide;
  - 6 m mag lane;
  - 9.85 m bridge carriageway;
  - deck with walkway + parapet.
- **STREET → TRACK and the RKIT-11 lane takeover** as `params(s)` curves using named presets (for example `TR_STAGGER_26`, which carries the RKIT-11 timing donor).
- **Marking emission:**
  - lines as co-planar splits of the same surface strip;
  - pads and mag stripes as the only lifted decals;
  - checks: z-fight / duplicate faces, line continuity through the style blend.

**Done when:**
- no monkey-patch;
- no host-line cuts;
- 0 slot-parity breaks;
- Georg has looked at both transitions in Blender.

### B4 · 3D pieces

**Goal:** loops, ramps and crossings on the same frame type.

- **Loop:** the frame law switches to rotation-minimising transport where pitch passes ±90°. Check: no flips, up follows the road, clearance envelope.
- **Kicker / landing:**
  - airborne span marked in the stream (no surface);
  - landing re-capture window defined as an `s`-range + lateral tolerance.
- **Projection test:** `project(pos, sHint)` at
  - the loop self-overlap;
  - a figure-8 crossing;
  - a hairpin.

  It must return the correct branch in 100 % of the sampled points.

**Done when:** all three pieces pass the checks, and the projection success rate is reported.

### B5 · RKIT-11 acceptance scene

**Goal:** the frozen RKIT-11 scene rebuilt **from one recipe on the core**.

- **Road:** deck, loop, lane takeover and hop ramps all come from the core stream.
- **Scenery:**
  - pylons, cables, portal and lifebuoy pads are scenery keyed to route frames (authored in Blender, placed by `frameAt(s)`);
  - ground follows the causeway / corridor rule.
- **Comparison sheet** against PR #42 renders, and every hack listed in the PR #42 RETURN is ticked off.
- **OSM:** still needs WSA OK. B5 uses the pinned fixture transforms from PR #42 and states that it does.

**Done when:** 0 special-case geometry code, all checks green, and Georg's look review is done.

## 3 · Risks

- **W0 slips:** the B-sprints cannot start without the JS reference. Mitigation: B1 can start on a *minimal* W0 seed (samples + frames only).
- **Clothoid cost:** B2 exists to avoid over-engineering. The donor is evidence that smoothing may be enough.
- **Race contact:** route-space contact vs Rapier colliders is a Race decision (W1). The core only has to make both possible.
- **Look drift:** geometry is read-only for Claude Design (D1); Georg decides the look.
- **Licence:** donor principles only; no SP13KTRA code, constants or text in KFB files.

## 4 · Exactly one next gate

**G0 · Georg:** confirm "JS is the authoritative core; the Blender lane is the oracle" → then **W0**.
