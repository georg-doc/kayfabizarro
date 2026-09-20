# Work Integration Slice I0 · Lock & Select

Status: **EXECUTION BRIEF · TOKEN/LIMIT-SAVING PREFLIGHT · NO RUNTIME IMPLEMENTATION UNLESS EXPLICITLY CONTINUED**
Date: 2026-09-20
Owner: **existing WSA Work Lead / existing project owners**
Repo/coordination branch: `georg-doc/kayfabizarro · orchestration/wsa-mvp-consolidation-2026-09-20`

## Goal

Produce one exact, recoverable integration lock from the current seven-lane KFB state and return **one** recommended executable integration slice.

Do not attempt the seven lanes in one Work run.

## Recommended Work settings for this I0 run

- model: **GPT-5.6 Sol**
- reasoning: **Medium**
- speed / Fast mode: **OFF**
- no Astra unless source reconciliation itself fails on a genuinely hard cross-repo conflict.

This is an execution recommendation dated 2026-09-20, not a repository contract.

## Minimal read order

Read only:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/WSA_MVP_CONSOLIDATION_2026-09-20/START_HERE.md`
5. `STATUS_MATRIX.json`
6. `LATEST_INPUT_DELTA_2026-09-20.md`
7. current Recovery/Return/SSOT only for a lane whose current ref is being checked.

Do **not** read `BRANCH_CENSUS.json` front-to-back. Use it only if an exact branch/ref cannot otherwise be resolved.

Do not replay old chats or giant changelogs.

## Required output

Create/update the existing Astra Integration 01 run state:

### INTEGRATION_LOCK.json
For each of the seven lanes record only:
- existing owner;
- exact repo/ref/head;
- current gate;
- status:
  `READY | WAITING_HUMAN | WAITING_CLAUDE | BLOCKED | HOLD`;
- exact source/Return used;
- one sentence explaining why.

### RUN_STATE.md
Maximum about 1–2 screens:
- source heads fetched;
- dirty/unpushed local state;
- current blockers;
- one selected next slice;
- files/owners that selected slice may touch;
- files/owners it must not touch.

## Current lane notes to verify, not blindly trust

- **Combat:** CA2-03B playback then CA2-04 melee remains the expected gate.
- **World/Race:** TC-01 visual foundation rejected; SurfacePatch expected next gate.
- **Residents:** first real zone + donor-backed ChatterBox proof still open.
- **ToolBox/editor:** S14 technically green but human/editor gate + receiving-host sequencing must be respected.
- **Environment:** Registry/Librarian identity; KayKit Bits PR #144 still WIP/human-gated.
- **Storytelling Maps:** CardRig T2.1 remains implementation gate; PR #149 Map Animator is planning-only parallel input.
- **WhackMan:** Claude Gate A/B/C brief exists; Work waits for returned candidate instead of duplicating it.

## Selection rule for I1

Choose the slice that:
1. has no unresolved source identity;
2. has no required human/Claude predecessor still open;
3. crosses at least two existing owners through a documented seam;
4. can be proven with one browser/freeplay outcome;
5. does not require a new universal runtime.

If nothing qualifies, return the single smallest predecessor gate instead of implementing around it.

## Stop

I0 ends after:
- exact heads are locked;
- statuses are evidence-backed;
- one I1 slice is selected;
- coordination checkpoint is pushed and fetched back.

No Stage deployment.
No Live promotion.
No mass merge.
No branch cleanup.

## I1 recommendation after I0

Start a **fresh Work chat** for I1 with:
- this lock;
- RUN_STATE;
- the one selected lane's SSOT/Return;
- its bounded implementation brief.

Recommended I1 settings:
- GPT-5.6 Sol **High**
- Fast OFF
- use Astra only for a hard cross-repo integration/debugging gate that Sol High cannot resolve efficiently.

Checkpoint I1 as:
1. implementation;
2. tests/evidence;
3. Return/Hub/Stage metadata.
