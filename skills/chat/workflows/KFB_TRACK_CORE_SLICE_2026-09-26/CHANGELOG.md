# KFB Track Core · Changelog


## 2026-09-27 · universal clay edge / runoff / connector design scope

### Georg direction

The existing Claude Design track-look brief is expanded into one **universal modular clay boundary / runoff / transition kit**. This is an extension of the current Track Core, not a new track system.

Required coverage now includes:
- clay sidewalks, low/raised kerbs and ordinary road edges for OSM/city roads and paths;
- classic circuit red/white kerbs/barriers, walls, pit edges, guardrails, low/catch fences;
- asphalt, grass, gravel and **sand-bed** runoff;
- dirt-track shoulders, ditches, berms and rural fence families;
- continuous normal-road/track ↔ ramp/loop/kicker/landing adapters;
- bridge/parapet and S8 tunnel portal/service-edge/wall transitions;
- Mag/Cosmic Highway as a future source-pinned family on the same connector grammar.

Georg's existing Kabelbett example is retained as the visual precedent for plug/adapter thinking. No literal source path was found under that name, so none was fabricated; Track Core `CONNECT` / socket state remains the implementation truth.

### Updated

- `S4_DESIGN_BRIEF_2026-09-27/BRIEF_CLAUDE_DESIGN_TRACK_LOOK_S4.md`
  - added §4A universal edge/runoff/transition system;
  - added lateral runoff stacks and ten required adapter families;
  - added connector/socket design rule;
  - added source-backed donor bank and mandatory isolation proof;
  - added clay translation rules and new design evidence.
- `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md`
  - aligned the high-level Claude Design gate to the same edge/runoff scope;
  - added explicit edge-state vocabulary and V5–V10 recipes;
  - added `EDGE_RUNOFF_ATLAS.md` and `CONNECTOR_TRANSITION_MATRIX.md` deliverables.
- `START_HERE.md`
  - added a current 27.09 continuation cursor;
  - records the user instruction as a PROCEED PASS for design work;
  - older TRACK-CORE-0/G0 next-gate text remains history where superseded.

### Source candidates pinned for design isolation

Registry source observed on `georg-doc/kayfabizarro@2be8d874cd43a05b96a78d628911d6288df3276a`:

- Kenney Racing Kit — `barrierRed`, `barrierWhite`, `barrierWall`, fences/rails, border/wall corners and `roadCorner*Sand*`;
- Kenney City Kit Roads — barrier variants, construction barrier/cone/fence, bridge pillars;
- Kenney Toy Car Kit — caps, bends, bumps, hill pieces, loopings, skew connectors across track/road/striped families;
- KayKit City Builder Bits + measured `KayKit_Road_Network_S5.html` road/kerb-slot logic;
- Tiny Treats Homely House — modular fence post/rail/corner/open/straight family;
- Kenney Platformer — low/broken/rope/curved fence candidates;
- KayKit BlockBits sand forms as secondary sand references only.

These are **candidate donors**, not automatic design acceptance. The actual chosen donor object must be shown in isolation before integration.

### Evidence / tests

Documentation-only design-brief expansion:
- runtime tests: **0**
- Blender builds: **0**
- browser tests: **0**
- Stage deployments: **0**
- GitHub brief read-back checks: **2/2** updated Claude Design briefs present with the intended new sections.
- Track Core cursor read-back: **1/1** `START_HERE.md` current override present.

### Exactly one next productive gate

**Claude Design S4 / TRACK-CORE-2 source-first design pass:** isolate the selected donors, then build the edge/runoff atlas, connector transition matrix and 2–3 clay look options on the existing Track Core. No separate review site and no Stage until an integrated visual milestone is worth human review.


## 2026-09-26 (late) · SP13KTRA alignment + Blender-focused sprint plan (Claude Coworker)

### Added
- `SP13KTRA_DONOR_ALIGNMENT.md`: source reading of `KilledByAPixel/SP13KTRA@e9b2589` (re-pin; TARCH-0 had `166ad838`); alignment matrix; licence boundary (principles only).
- `SPRINT_PLAN_TRACK_CORE_BLENDER_2026-09-26.md`: G0 → W0 → B1–B5 → W1 → D1 → R0 → K1.
- `WSA_DRAFTS_TRACK_CORE_2026-09-26.md`: W0 addendum, decision memo, housekeeping list, W0 start prompt.

### Changed (execution order only; no earlier file rewritten except the START_HERE / RETURN headers)
- The language decision moves before W0 (recommendation JS; Georg answered "top" to the proposal, formal G0 pending).
- W0 must ship a runnable pure-JS reference with Node tests, not only a contract.
- The Blender lane becomes oracle + scenery atelier. 1A is split into B1–B5.
- Clothoids are downgraded from prerequisite to "prove in B2": the donor drives well with fillets + smoothed curvature.

### Tests
0 runtime / Blender / browser tests (planning). Donor source read at the exact commit above.

## 2026-09-26 · Perplexity transition research integrated

### Added

- `PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`
- `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md`
- `BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md`
- `WEBCHAT_TRACK_CORE_1B_RUNTIME_PARITY_BRIEF.md`
- `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md`

### Decision support

- adopt real Clothoid/Euler curvature easing for flexible M1/M2 route pieces;
- adopt connector boundary-state thinking, but implement it as Track-Core frame state;
- adapt universal connector faces into one canonical slot topology + parameter curves over `s`;
- retain staggered RKIT-11 transition timings as data/mechanism evidence;
- do not use the Perplexity Python sample as production architecture;
- recommend authoritative JavaScript core, Blender/Python as independent oracle; formal language gate remains Georg's decision.

### Source delta

- Race PR #42 / `chat/rkit-11-rhein-run-2026-09-26@bcc422b00fc4629ac113f086cddcea3b2b107f2a` is now pinned as the frozen Track-Core acceptance fixture.
- RKIT-11 remains not Race-driven / no Stage / no Live.

### Current agent order

`Web TRACK-CORE-0 → Georg language gate → Blender MCP 1A → Web 1B → Claude Design 2 → Playable Track R0 → Köln OSM Route 01`

### Next gate

`TRACK-CORE-0 · ChatGPT Web census + core contract`

---

## 2026-09-26 · Planning baseline (Claude Coworker)

### Added
- `START_HERE.md`: Georg's decision that everything is built on one track core and delivered as pieces:
  - one frame type;
  - a canonical slot profile with parameter curves;
  - a separate marking layer;
  - pieces as data;
  - automatic checks;
  - one recipe;
  - acceptance gates;
  - the open JS-vs-Python decision.
- `EVIDENCE.md`: census start (the geometry paths found, the refs read, what is still unread) and the RKIT-11 hacks the core must remove.
- `RETURN.md`: planning return.

### Changed
- Nothing is replaced. PR #216 stays the route plan. RKIT-10 (M1–M4) is re-scoped to be built as pieces on the core.

### Next gate
`TRACK-CORE-0 · Census + core contract`
