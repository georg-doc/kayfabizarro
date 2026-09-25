# WSA drafts · Track Core · 2026-09-26

**Status:** DRAFTS for WSA / housekeeping. Nothing here is decided until WSA or Georg confirms it.
**Author:** Claude Coworker. Every draft is paste-ready.

---

## Draft 1 · Addendum to `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md`

Append this to the W0 brief before it is started.

> **W0 addendum (26.09, SP13KTRA alignment + reference-first)**
>
> 1. **Language:** the authoritative core is JavaScript, pending Georg's G0 confirmation. Do not re-open the language question in the census; record only facts that would contradict it.
> 2. **Deliver a runnable reference, not only a contract.** It is a small pure JS module (no Three.js, DOM or engine globals) with:
>    - `buildSamples(recipe)`: arc-length resampled stream at fixed spacing;
>    - `frameAt(s)`: heading + bank frame, re-orthogonalised; a per-piece flag for rotation-minimising transport on loops;
>    - `pointAt(s, x, lift)`: cross-section as a *function* of lateral x with parameters `params(s)`, sampled at named slots;
>    - `paintAt(s)`: gameplay paint (`type`, lateral span) with explicit priority rules;
>    - `project(pos, sHint)`: windowed nearest-sample projection (branch-safe at crossings and loops);
>    - a route fingerprint (cumulative heading hash) for tests;
>    - two curvature laws for M1/M2: circular fillet + smoothed curvature, and true clothoid. Blender sprint B2 compares them.
> 3. **Census must additionally read:**
>    - Race `chat/racer-tarch0-sp13ktra-2026-09-23` (TARCH-0 donor proof, R3 banking / body / barrier-layer tests);
>    - `chat/racer-rstab1-geometry-2026-09-23`;
>    - `wsa/track-ribbon-st01b-2026-09-19`;
>    - `planning/track-environment-grammar-2026-09-19`;
>    - the C-3 lab track and route modules;
>    - **the current Race contact / collider path** (how the car touches the road today).
> 4. **Donor rule:** SP13KTRA (`e9b2589`) is All Rights Reserved. Principles only (see `SP13KTRA_DONOR_ALIGNMENT.md`). No code, constants or text.
> 5. **Output folder:** Race, next to `KFB Cologne Race Option C-3/`, named by WSA (proposal: `track-core/`). Additive only.

---

## Draft 2 · Decision memo for Georg / WSA

> **Track Core · decisions requested (26.09)**
>
> | # | Decision | Recommendation | Why |
> |---|---|---|---|
> | D1 | Authoritative core language | **JavaScript** | Editor and game are web. The C-3 runtime already builds its track in JS. One implementation instead of two. |
> | D2 | Role of Blender | **Oracle + scenery atelier** | Independent checks, visual proof, authoring pylons / cables / portal. Never a second solver. |
> | D3 | Clothoids | **Prove before adopting everywhere** | SP13KTRA drives well with circular fillets + smoothed curvature for bank / AI. Blender B2 compares the two on 5 fixtures; clothoids likely for hairpins and OSM fit only. |
> | D4 | Road contact in Race | **Proposal:** route-space projection for road contact and progress; Rapier for dynamics, props and air | Branch-safe at crossings, hairpins and loop self-overlap (donor principle). Race owns the decision; the core exposes `project(pos, sHint)`. |
> | D5 | Tunnels / bridges / arches | **Scenery over the same road** | No second road surface, no terrain cuts (TARCH-0 + donor). |
> | D6 | OSM crop `rhein-muelheim-v0` | **WSA OK needed** | Fetched 25.09 from Georg's Mac; S0 PASS; not on GitHub; blocks only B5's OSM provenance, not the core. |

---

## Draft 3 · Housekeeping list for WSA

> 1. **kayfabizarro PR #219** (`georg-doc-patch-2`):
>    - stacked on #216;
>    - GitHub reports `mergeable:false` because #216's branch moved; needs a rebase or merge of #216 first;
>    - branch name is a web-upload default; rename to `chat/track-core-slice-plan-2026-09-26` optional.
> 2. **kayfabizarro PR #216:** Route 01 plan; now downstream of the Track Core; its RKIT-10 Blender brief is marked superseded for execution.
> 3. **Race PR #42** (`chat/rkit-11-rhein-run-2026-09-26`):
>    - stacked on Race PR #41;
>    - frozen acceptance fixture;
>    - its GLBs are not Draco-compressed (unlike the repo's other GLBs).
> 4. **Race PRs #34–#41 (RKIT-01…09):** open candidate chain. The core census decides which parts are donors and which are superseded. Do not merge piecemeal before W0.
> 5. **Hub:** the Track-Core lane card lives in the Production Desk config (HUB-CTRL PR #202). The generated `kfb-hub/index.html` is not hand-edited.
> 6. **Donor pin:** SP13KTRA moved from `166ad838` (TARCH-0) to `e9b2589`. Record the re-pin in the Race SOURCE_PINS.
> 7. **OSM:** `rhein-muelheim-v0` (Dropbox `KFB Racetrack Blender Kit/RKIT-11/osm/`) is waiting for WSA OK before promotion to `tools/osm-city-lab/data/`.

---

## Draft 4 · Start prompt for the W0 web chat (EN, paste-ready)

> You are starting **TRACK-CORE-0** for KFB.
>
> Read in this order:
> - `georg-doc/kayfabizarro` PR #219 → `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/START_HERE.md`, then `SPRINT_PLAN_TRACK_CORE_BLENDER_2026-09-26.md`, `SP13KTRA_DONOR_ALIGNMENT.md`, `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md` + the W0 addendum in `WSA_DRAFTS_TRACK_CORE_2026-09-26.md`;
> - then Race PR #42 RETURN.
>
> Deliver:
> - the census table (every track-geometry and contact path at an exact ref, classified donor / superseded / consumer);
> - the core contract;
> - a small pure JS reference module with Node tests and a route fingerprint.
>
> Rules:
> - SP13KTRA is All Rights Reserved: principles only.
> - No Race physics changes. No Stage / Live. No auto-merge.
> - Additive files only.
> - Return with defects first and exactly one next gate (**B1 · Blender oracle bridge**).
