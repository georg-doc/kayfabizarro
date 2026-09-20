# Work Integration Slice I0 · Lock & Select

Status: **EXECUTION BRIEF · TOKEN/LIMIT-SAVING PREFLIGHT · NO RUNTIME IMPLEMENTATION UNLESS EXPLICITLY CONTINUED**
Date: 2026-09-20
Owner: **existing WSA Work Lead / existing project owners**
Repo/coordination branch: `georg-doc/kayfabizarro · orchestration/wsa-mvp-consolidation-2026-09-20`

## Goal

Resume the **existing WSA Lead / Recovery & Integration Work conversation** and use its already-established project context instead of cold-starting a second integration lead.

Produce one exact, recoverable integration lock from the current seven-lane KFB state and return **one** executable integration slice.

Do not attempt the seven lanes in one pass.

## Recommended Work settings for this I0 run

- model: **GPT-5.6 Sol**
- reasoning: **Medium**
- speed / Fast mode: **OFF**
- remain on **Sol / Medium** for source locking and slice selection.
- after the lock, the same WSA Lead may switch to **Sol / High** for a hard implementation pass, or to **Astra** only when a genuinely difficult cross-repo integration/debugging gate justifies the higher allowance use.

This is an execution recommendation dated 2026-09-20, not a repository contract.

## Context reuse rule

The active WSA Lead is already the integration owner and already has useful local conversation context. Reuse that context for intent and continuity, but **re-fetch GitHub before relying on any implementation fact**.

Do not ask the WSA Lead to reconstruct its own prior work. Do not replay old chats.

If the existing conversation has become confused, contradictory, or too context-heavy to execute cleanly, stop after writing the Integration Lock and open a fresh implementation chat from the lock. Otherwise continue in the same WSA Lead.

## Minimal GitHub refresh

Read/re-fetch only:

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

**Default: continue in the same existing WSA Lead conversation.**

After I0:
1. keep the Integration Lock and RUN_STATE as the compact execution context;
2. load only the selected lane's current SSOT/Return + bounded implementation brief;
3. continue with **Sol / Medium** if the slice is straightforward;
4. switch to **Sol / High** when implementation/debugging needs more reasoning;
5. switch the same WSA Lead to **Astra** only for a genuinely hard cross-repo integration/debugging problem where the additional capability is worth the higher allowance use.

Open a fresh Work chat only if:
- the existing WSA Lead has become context-confused or contradictory;
- the selected slice deserves a clean implementation boundary;
- or the accumulated conversation context is clearly causing inefficient rereads.

Fast remains OFF.

Checkpoint I1 as:
1. implementation;
2. tests/evidence;
3. Return/Hub/Stage metadata.

Checkpoint I1 as:
1. implementation;
2. tests/evidence;
3. Return/Hub/Stage metadata.
