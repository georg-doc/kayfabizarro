# RETURN · KFB Track Core planning · 2026-09-26


## CURRENT ADDENDUM · 27.09.2026 · universal clay boundary / runoff / transition kit

**Status:** BRIEFING EXPANDED · SOURCE-BACKED DESIGN SCOPE · NO RUNTIME CHANGE · NO STAGE · NO LIVE  
**Owner:** existing Track Core workflow in `georg-doc/kayfabizarro`; receiving implementation owner remains `georg-doc/KFB-Stunt-Car-Race`.  
**Branch / PR:** `georg-doc-patch-2` · PR #219. No merge or promotion performed.

### Georg direction captured

The clay track design is now explicitly a **universal modular construction system**, not a handful of standalone kerb/fence props.

It must make continuous, designed transitions among:
- OSM/city streets and paths;
- classic Race Track;
- Dirt Track / off-road;
- runoff including gravel and **sand beds**;
- normal track ↔ ramp / loop / kicker / landing;
- bridge/elevated sections;
- S8 tunnels and portals;
- Mag / later Cosmic Highway.

Road boundaries now include sidewalks/kerbs, painted/race kerbs, red/white barriers, walls, pit edges, guardrails, low/catch fences, open verges, grass/asphalt/gravel/sand runoff, ditches, berms, parapets and tunnel service/wall edges.

### Connector decision

The visible design follows the existing **Track Core CONNECT/socket boundary state** and Georg's Kabelbett plug/adapter precedent.

- Mathematical joints stay exact.
- Clay softness may span the joint visually.
- No gap-hiding plate, duplicate road surface, second route mesh or bespoke stunt-road shell.
- Transitions are source/target states blended over the same `s` parameter grammar.
- The literal Kabelbett source file is still **UNRESOLVED / SOURCE PATH NOT PINNED**; no guessed path was written.

### Source pool prepared

The S4 brief now pins the relevant KFB Registry families for **isolation before use**:

- Kenney Racing: red/white barriers, wall, fences, rails, border/sand/wall corner families, pit and ramp pieces;
- Kenney City Roads: ordinary road barrier variants, construction barrier/cone/fence, bridge pillars;
- Kenney Toy Car: cap/bend/bump/hill/loop/skew families as modular connector vocabulary;
- KayKit City Builder Bits + measured KayKit Road Network S5 road/kerb-slot logic;
- Tiny Treats Homely House: modular post/rail/corner/open/straight fences;
- Kenney Platformer: low/broken/rope/rural fence candidates;
- KayKit BlockBits sand forms as secondary material/form references.

These are donor **candidates**, not accepted final designs.

### Files changed in this checkpoint

- `S4_DESIGN_BRIEF_2026-09-27/BRIEF_CLAUDE_DESIGN_TRACK_LOOK_S4.md`
- `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md`
- `START_HERE.md`
- `CHANGELOG.md`
- this `RETURN.md`

### Actual evidence / tests

This was a design-brief / routing checkpoint only:

- Race runtime tests: **0**
- Track Core Node tests rerun: **0**
- Blender builds: **0**
- browser tests: **0**
- Stage deployments: **0**
- GitHub S4 read-back: **1/1**
- GitHub TRACK-CORE-2 read-back: **1/1**
- GitHub current-cursor read-back: **1/1**

No existing S8/Track-Core test result is re-counted as a new test.

### Current Track Core context retained

The branch already carries slices through **S8 Tunnels**. S8's round/oval/rect/poly tunnel profiles, portal match and clearance work are real existing inputs to the design pass. Georg's present continuation instruction is treated as a **PROCEED PASS for the design lane**, not as exhaustive acceptance of shaft depth, section sizes or maze layout. Those remain open/deferred.

### Hub / Stage

No new KFB Hub human to-do and no Cloudflare Stage route were created. This is intentional: the checkpoint changes an internal production brief and does not yet expose a meaningful new integrated visual result for Georg to judge. Creating a standalone edge-table/review site would violate the productive-review policy.

### Unresolved / deferred

- exact Kabelbett donor source path: **SOURCE_REQUIRED** if Claude Design needs to cite/show that object itself;
- Cosmic Highway exact visual donor: **SOURCE_REQUIRED**; generic neon sci-fi is forbidden;
- physical/contact behaviour of sand, dirt, ditch, guardrail or runoff remains with Race/World owners;
- S8 shaft depth/grade/section-size/maze questions remain open but do not block look-system design.

### Exactly one next productive gate

**Claude Design executes the updated S4 / TRACK-CORE-2 design pass source-first:** show the selected donor objects in isolation, then deliver the edge/runoff atlas + connector transition matrix + 2–3 clay look options on the existing Track Core.

No new geometry owner, no separate review website, no Stage/Live claim until the integrated result is a meaningful visual milestone.


## CURRENT ADDENDUM · SP13KTRA alignment + sprint plan (Claude Coworker, 26.09 late)

**Defects / open first**
- **G0 open:** JS as the authoritative core is recommended; Georg answered "top" to the proposal; formal confirmation pending.
- **W0 not started:** the B-sprints need at least a minimal JS reference (samples + frames).
- **Contact still unread:** Race's current contact / collider path is unread. The route-space contact proposal (D4) is a draft for Race / WSA.
- **Donor not run:** SP13KTRA was not run in a browser for this addendum; it is a source reading. No donor code, constants or text were transferred.
- **Stack not mergeable:** #219 is still `mergeable:false` (stacked on the moved #216).

**Added:** `SP13KTRA_DONOR_ALIGNMENT.md`, `SPRINT_PLAN_TRACK_CORE_BLENDER_2026-09-26.md`, `WSA_DRAFTS_TRACK_CORE_2026-09-26.md`.

**Exactly one next gate:** G0 (Georg: JS), then W0.

---

## CURRENT ADDENDUM · Perplexity transition review + agent routing

**Status:** RESEARCH REVIEW + EXECUTION BRIEFS COMPLETE · IMPLEMENTATION STILL NOT STARTED · NO STAGE · NO LIVE

### Assessment outcome

The Perplexity intake is useful for mechanisms, not as code:

- **use:** real Clothoid/Euler curvature easing, connector boundary state, transition zones, graph/RouteRecipe semantics, separated style layers;
- **adapt:** connector faces → canonical slot topology + parameter curves over `s`; Geometry Nodes → proof/authoring consumer;
- **reject as production base:** supplied example Python generator.

The example code's advertised Clothoid is a circular arc and its endpoint propagation is explicitly incomplete. It also creates separate road/marking/barrier geometry, which conflicts with the Track-Core decision.

### New source truth

Race PR #42 is now readable:

- branch: `chat/rkit-11-rhein-run-2026-09-26`;
- exact observed head: `bcc422b00fc4629ac113f086cddcea3b2b107f2a`;
- status: frozen Track-Core acceptance fixture;
- not Race-driven; no Stage; no Live.

The useful RKIT-11 transition timing donor is preserved, while its monkey-patch / host-line-cut architecture remains rejected.

### Prepared execution briefs

| Gate | Executing agent | Brief |
|---|---|---|
| TRACK-CORE-0 | ChatGPT Web + GitHub | `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md` |
| TRACK-CORE-1A | Claude Coworker + Blender MCP | `BLENDER_MCP_TRACK_CORE_1A_PROOF_BRIEF.md` |
| TRACK-CORE-1B | ChatGPT Web + GitHub | `WEBCHAT_TRACK_CORE_1B_RUNTIME_PARITY_BRIEF.md` |
| TRACK-CORE-2 | Claude Design | `CLAUDE_DESIGN_TRACK_CORE_2_VISUAL_GRAMMAR_BRIEF.md` |

Detailed assessment:

`PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`.

### Recommendation, not yet decision

Authoritative core: **JavaScript**.  
Blender/Python: independent numerical/visual oracle + GLB/landmark atelier.

The formal language decision remains Georg's gate after TRACK-CORE-0.

### Tests in this update

This update is documentation/research/briefing only:

- new Race runtime tests: **0**
- new Blender builds: **0**
- new browser tests: **0**
- new Stage deployments: **0**

Historical RKIT-11 test facts remain attributed to PR #42 and are not counted as new tests.

### Exactly one next gate

**TRACK-CORE-0 · ChatGPT Web census + core contract.**

Do not start Playable Track R0 before the Track Core gate sequence has proven the generic transition mechanism.

---

**Status:** PLAN COMPLETE · NO IMPLEMENTATION · NO STAGE · NO LIVE

## Defects / open first
- **Census incomplete:** four track-geometry branches in Race, and the physics collider path, are not read yet. That is the first gate.
- **Language decision open:** the core has to exist once, and JS vs. Python is still undecided. JS is recommended because editor and game are web. Georg decides.
- **RKIT-11 is frozen, not accepted:** its bridge, loop, hop and transition are an acceptance test for the core, not kit canon.
- **Hub card not added:** `kfb-hub/index.html` is a generated file (see the 24.09 incident), so no hand-edited Hub card was added. WSA adds the card through the Production Desk config if wanted.

## Repository / branch
- `georg-doc/kayfabizarro`, branch `georg-doc-patch-2` (web-upload branch name; the intended name was chat/track-core-slice-plan-2026-09-26), stacked on PR #216 (`chat/cologne-route-01-plan-2026-09-25`).
- Companion candidate: Race branch `chat/rkit-11-rhein-run-2026-09-26`, stacked on Race PR #41.

## Files
- added: `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/{START_HERE,EVIDENCE,CHANGELOG,RETURN}.md`

## Outcome
Georg's rule is now recoverable: **one base track, everything else is pieces**. There are no parallel track systems and no per-case fixes. Transitions are interpolations of one slot profile, and markings are their own layer. The recipe from #216 stays the single truth.

## Tests
0 (planning).

## Exactly one next gate
**TRACK-CORE-0 · Census + core contract** (see `START_HERE.md` §8).
