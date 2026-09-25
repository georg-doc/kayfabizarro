# RETURN · KFB Track Core planning · 2026-09-26

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
