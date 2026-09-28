# KFB Webchat · Timeout-safe execution protocol

Status: **BINDING PROCESS CORRECTION**  
Date: 2026-09-28  
Owner: Georg / KFB Production

## Problem proved on 2026-09-28

Several recent Web chats ended with the user's initial message as their only turn item. They did not reach source recovery, a first checkpoint or a Return. This is **FAILED_TO_START**, not RUNNING and not an implementation timeout.

A separate Public-Domain-Pool chat did create PR #281, completed two bounded repair passes and froze the candidate. That is **TIMEOUT/RECOVERY WITH CHECKPOINT**, not lost work.

High reasoning can increase latency, but the dominant failure pattern is oversized or ambiguous dispatch:

- a generic link to a large multi-strand briefing instead of one named executable slice;
- GitHub recon + implementation + asset transfer + tests + publication + Hub sync in one Web turn;
- binary/bulk work sent through a connector-oriented Web chat;
- no early branch/checkpoint before long research or iteration.

## Mandatory classification

Use exactly one state:

- `FAILED_TO_START`: no assistant work item and no GitHub/Site checkpoint.
- `RUNNING`: active response or externally verifiable job in progress.
- `CHECKPOINTED`: exact branch/head or Site receipt exists.
- `TIMEOUT_UNKNOWN`: response stopped; inspect branch/PR/Site before any retry.
- `FROZEN_RECOVERY`: bounded repair budget consumed; candidate and evidence preserved.
- `DONE`: named outcome and required evidence complete.

Never display `FAILED_TO_START` as RUNNING.

## Executor routing

### Web chat

Use only for one connector-friendly outcome:

- focused GitHub read/recon;
- one small text/code change on one existing branch;
- one PR/status/Return update;
- one bounded research or rights check;
- one existing candidate diagnosis from logs/source.

Default: **Sol / medium**. Use low for mechanical inventory/status work. Use high only for a hard diagnosis after exact inputs are already locked.

### Work / Codex

Use for:

- ZIP unpacking, large asset packs or many binary files;
- local validation/deduplication;
- multi-file game/runtime integration;
- real browser/gameplay/performance evidence;
- exact package assembly;
- cross-repository work requiring local checkouts.

Default: **Sol / medium** for deterministic intake; **Sol / high** for runtime integration/debugging. Astra only for a genuinely hard cross-repository architecture problem.

### Claude Design

Use for visual authoring with a closed, GitHub- or Site-downloadable Session Cut. It does not own repository archaeology, deployment or bulk asset admission.

### Blender MCP

Use for Blender-native modelling, conversion, rig/animation and measured export. It returns a closed package/manifest; the receiving owner admits it separately.

## Webchat hard bounds

Every executable Web brief must name:

1. one outcome;
2. one repo and existing branch (or one explicitly authorized branch);
3. one exact source ref;
4. one owner;
5. allowed files or a tight path;
6. protected files/owners;
7. one check;
8. one stop condition;
9. one Return;
10. one next gate.

Do not dispatch `STRAND_BRIEFINGS.md`, a Masterplan or an Inbox folder as the executable instruction. Point to one named subsection/file and paste a short self-contained command.

A Web job must not combine implementation, public deployment and unrelated Hub cleanup. Hub **status metadata** is updated in the same handoff; milestone publication is a separate gate.

## Checkpoint-first sequence

1. Read the exact named brief and source ref only.
2. Write a compact source lock / RUN_STATE checkpoint before broad work.
3. Implement the single outcome.
4. Write tests/evidence.
5. Write Return/changelog/Hub status.
6. Read back the exact head and files.
7. Stop.

For a binary/asset intake, the Site upload receipt is the first checkpoint. The bytes remain in R2 until Work/Codex downloads and validates them. Site intake is not a Git commit and `KFB Web Push` must not be described as source control.

## Recovery rule

- `FAILED_TO_START`: do not ask the same Web chat to reconstruct itself. Re-route the exact small job to another Web chat or Work/Codex.
- `TIMEOUT_UNKNOWN`: inspect PR/ref/Site receipt first. Retry only when the intended write is absent.
- Existing checkpoint: resume from exact branch/head; never repeat broad recon.
- Two failed repair passes: freeze and export; no third repair on the same foundation.

## Current examples

- Track T4/M2 Session Cut: Site receipt + R2 ZIP exists; GitHub admission still pending. Route to Work/Codex intake, not another broad Web chat.
- Public Domain Pool C1: PR #281 is `FROZEN_RECOVERY`; next gate is a manually reviewed object-ID/source-page manifest, not Repair 3.
- Halloween GLB pack: PR #279 exists; bulk unpacking belongs to local Work/Codex intake and Asset Registry checks, not Cloudflare.
- Generic Production Architecture / Resident Band starts with no assistant output: `FAILED_TO_START`.

## Definition of done

A slice handoff is incomplete when its current Hub/Site status still says RUNNING after the job failed, froze or produced a newer checkpoint. Update current status without waiting for Georg to request it.
