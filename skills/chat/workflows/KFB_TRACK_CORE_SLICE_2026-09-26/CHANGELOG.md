# KFB Track Core · Changelog

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
