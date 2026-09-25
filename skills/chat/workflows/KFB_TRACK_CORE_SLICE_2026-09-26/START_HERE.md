# KFB Track Core · one base track, pieces only · planning slice

## CURRENT EXECUTION DELTA · SP13KTRA alignment + sprint plan · 2026-09-26 (Claude Coworker)

Read these first; they supersede the agent ladder below for execution:

- `SPRINT_PLAN_TRACK_CORE_BLENDER_2026-09-26.md`: G0 (Georg: JS) → W0 (census + contract + **runnable JS reference**) → B1–B5 (Blender = oracle + scenery atelier, never a second solver) → W1 (runtime parity + contact) → D1 → R0 → K1.
- `SP13KTRA_DONOR_ALIGNMENT.md`: architecture of the original (`KilledByAPixel/SP13KTRA@e9b2589`, **All Rights Reserved, principles only**):
  - skeleton → evenly spaced samples → heading + bank frames → profile as a function of x → paint over s → one baked world;
  - scenery (tunnels, arches) over the same road;
  - route-space contact with windowed projection.
- `WSA_DRAFTS_TRACK_CORE_2026-09-26.md`:
  - W0 addendum;
  - decision memo (JS, Blender role, clothoids to be proven in B2, route-space contact proposal);
  - housekeeping list;
  - paste-ready W0 start prompt.

`BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md` stays as a reference; its content is split into sprints B1–B5.

**Exactly one next gate: G0 · Georg confirms JavaScript as the authoritative core, then W0.**

---

## CURRENT RESEARCH / EXECUTION DELTA · 2026-09-26

The Perplexity intake at:

`tools/KFB-ToolBox/_inbox/KFB Race Track Baukasten TBD perplexity 01.md`

has now been reviewed against the actual RKIT/Track-Core state.

Decision:

- **ADOPT:** real Clothoid/Euler curvature easing for M1/M2, connector boundary-state thinking, transition zones, graph/RouteRecipe semantics, separate style/prop/FX layers;
- **ADAPT:** “universal connector faces” become the canonical Track-Core slot topology + parameter curves over `s`; Geometry Nodes is a Blender proof/authoring tool, not a second SSOT;
- **DO NOT ADOPT:** the supplied Blender Python sample as production architecture. It uses simplified endpoint stepping, separate road/line/barrier meshes, generic materials and a circular arc labelled as Clothoid.

Current detailed review:

`PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`

Current agent ladder:

1. **TRACK-CORE-0 · ChatGPT Web + GitHub** — complete census + core contracts + language decision memo.
2. **Georg language gate** — authoritative core language; current recommendation = JavaScript, Blender/Python as oracle.
3. **TRACK-CORE-1A · Claude Coworker + Blender MCP** — source-first Clothoid/frame/slot/transition geometry proof and RKIT-11 acceptance fixture.
4. **TRACK-CORE-1B · ChatGPT Web + GitHub** — implement the one authoritative core + runtime/editor/collider parity.
5. **TRACK-CORE-2 · Claude Design** — visible transition/style grammar on the proven core only.
6. **PLAYABLE_TRACK_R0** — then assemble the first playable closed track.
7. Real Köln OSM Route 01 follows on the same core/RouteRecipe.

Prepared briefs:

- `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md`
- `BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md`
- `WEBCHAT_TRACK_CORE_1B_RUNTIME_PARITY_BRIEF.md`
- `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md`

**Exactly one current next gate remains TRACK-CORE-0.**

---

**Status:** DIRECTION CONFIRMED BY GEORG (26.09.2026) · IMPLEMENTATION NOT STARTED
**Planning owner:** `georg-doc/kayfabizarro` · chat workflow layer
**Implementation owner:** `georg-doc/KFB-Stunt-Car-Race` (route / track / vehicle / physics)
**Relation:** amends [KFB Cologne Route 01](../KFB_COLOGNE_ROUTE_01_2026-09-25/START_HERE.md) (PR #216). It does not replace it.
It re-scopes RKIT-10: the four adapter families M1–M4 are built as **pieces on one track core**, not as more geometry code next to the existing code.

## 1 · Why this slice exists

Georg reviewed the RKIT-11 Mülheimer Brücke with its Pylon-Loop in Blender on 25.09.2026 and stopped further patching. His words, condensed:

- the track connection must be **our normal track**;
- an extra bridge track plus an extra loop track contradicts any sensible kit logic;
- we need a slice that **only delivers pieces**, starting from our base track design;
- modular, flexible and freely combinable, with automatic checks and seamless editor and game integration;
- no proprietary fixes and no fiddly per-case adaptations.

The trigger was concrete. At the loop entry the loop lane lay on the bridge deck as a separate plate. Barrier noses sat on the centre line, and street markings and track markings ran over each other. The fix built that night was a transition piece; see the RKIT-11 RETURN in Race. It worked visually, but only by

- monkey-patching the stunt sweep's profile function;
- cutting the bridge's lane-line meshes from the stunt script;
- adding special frame fields.

That is exactly the pattern this slice ends.

## 2 · Diagnosis

The kit currently has **several geometry paths** that each re-solve "profile along a line":

| Path | Where | Own special logic |
|---|---|---|
| RKIT base sweep (flat frames, bank, grade) | Race PRs #34–#39, `rkit_lib` / `rkit3_lib` / `rkit4_lib` | profile swaps, fixed-barrier profile |
| RKIT 3D stunt sweep (loop / ramp frames) | Race PR #41, `sweep3d_lib`, `stunt_lib` | per-frame taper `ts` and slim `bs` |
| RKIT-11 bridge deck | RKIT-11 `build_rkit11.py` | own closed deck section, own lane-line ribbons |
| RKIT-11 transition | RKIT-11 `transition_lib.py` | monkey-patch plus host marking cuts |
| Game runtime track | Race `KFB Cologne Race Option C-3/lab-v9/cologne-track.v1.js` (TrackFlowDeformer), `cologne-route.v1.js` | own ribbon builder, own width classes |
| Older runtimes | `racetrack01/src/track.js`, `race/src/*`, branches `wsa/track-ribbon-st01b-2026-09-19`, `planning/track-environment-grammar-2026-09-19`, `chat/racer-rstab1-geometry-2026-09-23` | not yet read, census required |

There are also **three marking paths**: RKIT edge lines, RKIT mag stripes and the bridge lane lines.

Every new combination therefore needs a new fix. The problem is structural, not cosmetic.

## 3 · Decision (Georg, 26.09.2026)

Build **one track core**. Everything else becomes a piece: pure data plus a small centre-line generator, with no geometry code of its own.

### 3.1 · One centre-line frame type
Position, tangent, normal/right, up, arc length `s`. The same type covers straight, curve, bank, grade, loop, kicker, landing and bridge deck. Flat 2D route frames are a special case of it.

### 3.2 · One canonical slot profile
A fixed, named vertex set that never changes count:

- road L/R;
- shoulder L/R;
- barrier inner / cap / outer L/R;
- underside;
- optional walkway / curb slots.

Everything variable is a **parameter curve over `s`**:

- width;
- lateral centre offset;
- barrier height;
- barrier size;
- shoulder width;
- curb / walkway;
- road-surface lift;
- per-slot visibility.

Because the slot count is constant, **any two profiles can be interpolated without a seam**. That is the whole transition mechanism.

A bridge deck is this profile with deck parameters: walkways as wide shoulders, the parapet as a barrier variant. Only the authored shell (pylons, cables, portal) stays a landmark.

### 3.3 · Markings are their own layer
Marking style sets, for example:

- `STREET`: centre double line, lane lines, edge lines, tram strip;
- `TRACK`: edge lines;
- `MAG`: stripes.

They are drawn as ribbons over `s` and lane offsets. A style change is a parameter blend, for example host line → track line, so markings are never cut or patched.

### 3.4 · Pieces are data
Each piece is a centre-line generator plus parameter curves plus sockets:

- STRAIGHT;
- CURVE_EASE / BANK_EASE (M1);
- OFFSET_S / CHICANE / HAIRPIN_180 (M2);
- STREET_TO_TRACK (M3);
- GRADE / CREST / DIP / BRIDGE_APPROACH (M4);
- LOOP;
- KICKER;
- LANDING;
- FUNNEL / LANE_TAKEOVER;
- SPLIT / MERGE.

Staggered transition zones (barriers rise first and run longest, lines blend, stripes last) are zone timings in the parameter curves. They are not code.

### 3.5 · Automatic checks, per piece and per composition
Every piece and every composition is checked automatically:

- position, tangent, bank and height continuity at every joint;
- equal slot sets at every joint;
- self-intersection;
- clearance envelopes, for example loop vs. pylons and hangers;
- g-loads and assist needs (mag adhesion, boost length);
- marking continuity.

The output is a report with real counts.

### 3.6 · One recipe, one implementation
The `RouteRecipe` from PR #216 is the single source of truth.

Editor, game and Blender all build from it. Blender becomes preview and landmark atelier; it is not a geometry source.

**Open decision for Georg:** the core should exist once. Editor and game are web, so the natural single implementation is **JavaScript**, shared by editor, runtime collider generation and the Blender import (GLB). The existing Python kit becomes reference and test oracle. This is a direction decision and is not yet taken.

## 4 · Boundaries (unchanged from #216)

- Race owns contact, flight, landing, assist, recovery and physics. The core delivers frames, geometry, sockets and envelopes only.
- WorldBuilder owns world and terrain; OSM City owns geography. No second WorldBuilder, no second OSM system.
- No second route compiler: the core sits **under** the #216 compiler.
- No auto-merge, no Live promotion.

## 5 · Acceptance gates for the core slice

1. **Census first:** every existing track-geometry path above (and any found later) is read at an exact ref and classified: donor / superseded / keep as consumer. No new code before the census.
2. **Core proof in isolation:** frame type, slot profile and marking layer, with one straight, one M1 curve and one loop piece. All joints must pass the checks with real counts.
3. **Transition = interpolation:** STREET → TRACK and the RKIT-11 lane takeover are rebuilt as parameter blends with **zero** piece-specific geometry code.
4. **RKIT-11 acceptance scene:** Mülheimer Brücke deck + Pylon-Loop + Rhein-Hüpfer rebuilt from one recipe, with no special code. It must look the same in Blender (GLB import) and in the game runtime.
5. **Runtime parity:** the game builds its track mesh and colliders from the same core output. Frame parity between baked route and GLB is checked.
6. Exactly one next gate named in the RETURN.

## 6 · What stays frozen until the core exists

- RKIT-11 (bridge, loop, hop, transition) is frozen as a **candidate and acceptance test**. It is persisted in Race branch `chat/rkit-11-rhein-run-2026-09-26` (stacked on PR #41).
- No further RKIT one-off geometry.

## 7 · Georg's ideas recorded for later (not in scope)

- **"Hundeklappe" (dog flap):** where the loop comes back down across the straight lane, a flap hinged at the top lets straight-through traffic push through. Loop traffic drives over it as normal track.
- Alternative loop entries: a full-width funnel, or the loop setting back down so there is no dead end.
- Water pads on the Rhine as cartoon lifebuoys (accepted for now; later other props or the water surface itself).

## 8 · Next gate

**TRACK-CORE-0 · Census + core contract.** Read all geometry paths at exact refs, write the classification and the core data contract (frame, slot profile, parameter curves, marking styles, piece schema, check list). Stop there for Georg's language decision (§3.6).
