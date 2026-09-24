# WSA / Work focus handoff · 2026-09-24

Status: **NO CURRENT WORK-ONLY EXECUTION · PROTECT WORK BUDGET**

This handoff intentionally removes everything that does not genuinely require ChatGPT Work.

Current product focus:
**World Building · Resident Scenes · ToolBox · Car Racer**

## WSA / Work decision

**Do not start an execution session in Work right now.**

After recovering the interrupted chats and classifying Georg's three newest Flow Design exports, every current next gate has a cheaper capable owner:

- Web/GitHub;
- the existing product owner;
- Claude Design for visual authoring;
- Blender only for a proven time-based motion/mesh boundary;
- or Georg human review.

Production Architecture v3 already defines the Racer/Rapier path as `WEB_DEEP`, not Work. Work remains capability escalation only.

If this file is opened inside Work, read it as a routing note and return without doing a broad repository audit.

Detailed Flow intake classification, only if needed:
`FLOW_DESIGN_INTAKE_TRIAGE_2026-09-24.md`.

## Current execution queue outside Work

### Car Racer · TRACK_A real Rapier runtime proof

Owner:
`georg-doc/KFB-Stunt-Car-Race`

Current top RKIT candidate:
Draft PR #39 · `chat/rkit-06-trankgasse-2026-09-24`
head `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5`.

Executor:
**ChatGPT Web · WEB_DEEP** against the existing Race runtime owner.

Read only:
1. `_handover/RKIT_TRACK_KIT_2026-09-24/RKIT_KIT_GUIDE.md`
2. `_handover/RKIT_TRACK_KIT_2026-09-24/RACE_BRIEF_TRACK_A_RAPIER_TEST.md`
3. `KFB Cologne Race Option C-3/rkit-05/RACE_BRIEF_ADDENDUM_RKIT05_FLAP_RETURN.md`
4. current Race runtime owner/CONTRACT in `race/`.

Outcome:
load the current baked TRACK_A geometry into the existing Race/Rapier host and measure jumps/contact/pit/flap behavior. Race reports geometry findings back to RKIT; it does not silently retune RKIT.

No Work required unless the Web executor demonstrates a concrete capability gap that needs a persistent multi-repo/local-computer session.

### World Building

WORLD-ZONE-BAKE-01 is technically complete through deterministic package + real-browser load/place/reload proof.

The Flow Cologne shell is presentation-only and already exposes the right seam.

Next:
**WB-ZONE-SEAM-01 · Web/GitHub** — connect `wd1-seam.js` to the proven baked Cologne World Zone. No Work.

### Resident Card Speculation

Thin scene candidate with real Driver Graft, GothGirl and real Card.

Next:
**Georg visual face/mouth gate**, then normal Web host integration. No Work.

### Resident Band / Atlas S8

Keep actor/prop data, browser pose workflow, one-root/no-baseplate behavior and drummer reference-pose workflow.

Do not promote export-local `kfb.resident-band-module/1` as a new production runtime. Accepted content maps onto existing Resident Scene + `kfb.resident-performance.v1`.

Next:
**Georg visual/pose gate**. Blender only if the accepted drummer correction must vary over time. No Work.

### ToolBox

Coherent ToolBox + the real 33-clip Motion Library consumer pass their direct owner/browser tests.

The previously failing plain review transport is now also green at ToolBox head `ce3181bbf9114b7f00086368130fe610fd5810c7`:
- coherent browser flow: **20/20 PASS**;
- Animation Studio browser: **25/25 PASS**;
- plain review browser: **13/13 PASS**;
- GitHub Actions run `36055391088`: **SUCCESS**.

The final fix closed a malformed `loadGlb()` Promise expression in the review page. This confirms the interruption was review-transport code, not a ToolBox runtime/owner failure.

No Work task.

### Audio

AUDIO-CAL-01 is human accepted.

MUSIC-PERF-01 is technically public-verified and waits only for Georg's human review:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`

No Work.

## When Work becomes justified

Escalate to Work only after a named executor proves it needs something Web/Claude/Blender cannot reasonably provide, for example:
- persistent cross-repository/local workspace integration that cannot be bounded in Web;
- a multi-app process that genuinely needs Work's cloud computer;
- a packaging/deployment operation whose required capability is unavailable to the current owner.

Do not use Work for:
- status reconstruction;
- source census;
- Hub refresh;
- wrapper repair;
- normal GitHub integration;
- visual tuning;
- ordinary browser QA.

## Return if WSA/Work is opened anyway

Return:
**NO WORK EXECUTION REQUIRED · current tasks routed to their cheaper capable owners.**

Do not merge, promote Live or start a broad consolidation pass.
