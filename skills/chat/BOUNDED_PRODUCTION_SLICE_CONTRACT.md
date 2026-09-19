# KFB Bounded Production Slice Contract

**Status:** CURRENT REFERENCE v1.0  
**Date:** 2026-09-19  
**Owner:** Georg / KFB  
**Applies to:** bounded ChatGPT Web, Work/Codex, Claude Design and comparable production slices

This contract sharpens, but does not replace:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`

GitHub state overrides chat memory.

## 1. Required cold start

Before implementation, read the current GitHub versions of:

1. `skills/chat/START_HERE.md`;
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`;
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`;
4. the named project SSOT;
5. current Recovery/Return;
6. the named slice briefing.

Then fetch the current default-branch head and active PR/branch state.

## 2. Name exactly one bounded slice

Before any implementation write, state:

- **GOAL**
- **EXISTING OWNER**
- **EXACT SOURCES / REVISIONS**
- **PROTECTED BOUNDARIES**
- **DONE WHEN**
- **HUMAN REVIEW QUESTION**
- **BRANCH**
- **FIXED STAGE TARGET**

One slice has one owner, one outcome, one branch and one Stage target.

## 3. Intent-resolution gate

Do not silently choose between materially different reasonable interpretations.

If the brief can plausibly produce different review surfaces — for example:

- evidence dashboard vs visual comparison stage;
- isolated asset proof vs integrated composition;
- technical measurements vs human scale judgment;
- runtime boot proof vs animation-quality proof;

then the slice must do one of two things **before implementation**:

1. resolve the ambiguity from current source/owner documents and state the resolved human review question; or
2. mark `INTENT AMBIGUOUS · HUMAN GATE REQUIRED` and stop before committing to a visual architecture.

A phrase such as “visual catalog”, “preview”, “measure”, “proof” or “browser seen” is not by itself an acceptance criterion.

## 4. Donor-first proof

Reuse verified donors and existing modules before creating anything new.

A loaded source URL is not proof that the required donor design was used.

For any source-mandated visual donor:

1. show the exact source object / shell / module in isolation;
2. record its exact source revision;
3. capture visible evidence;
4. only then integrate it.

Do not introduce placeholders, generic UI chrome, replacement branding, a second Asset Library or a second runtime owner when a current source/owner exists.

## 5. Human-scale and visual-comparison rule

When the human gate concerns **relative scale, composition, motion or style**, evidence must preserve the comparison.

For relative scale:

- use one shared world-space stage;
- one shared scale;
- one fixed/reference camera or explicitly comparable camera states;
- no per-object auto-fit as the acceptance view;
- actor height and whole-vignette bounds remain distinct facts.

For animation:

- “mounted”, “advanced”, low solver residual and zero console errors are technical facts only;
- visible motion, contact, clearance and readability require visual evidence;
- known OPEN visual gates stay OPEN in every consumer until explicitly accepted.

## 6. Small verified GitHub checkpoints

Save work in small checkpoints:

1. implementation/source;
2. tests/evidence;
3. Return/changelog/Hub metadata.

After **every GitHub write**:

1. fetch the exact branch head;
2. fetch/check the intended files;
3. record the result.

A timeout means `UNKNOWN`, not success. Inspect the ref/workflow/publication first. Retry only if the intended write is absent.

## 7. Stage / Hub rule

Human test surfaces use only direct:

`https://kayfabizarro.pages.dev/…`

routes linked from the KFB Hub.

GitHub Pages, githack, raw-CDN, local `file://` and localhost are not acceptance surfaces.

Do not claim `LIVE`, `DEPLOYED` or `PUBLIC_VERIFIED` until the exact Cloudflare URL has been opened and the expected revision is visibly present.

## 8. Status separation

Keep these separate:

`PROPOSAL | DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN | ARCHIVED HISTORY`

In particular:

- technical PASS ≠ visual PASS;
- browser boot PASS ≠ donor fidelity;
- public Stage PASS ≠ Georg acceptance;
- consumer mount PASS ≠ owner-module visual acceptance.

## 9. Required return packet

Keep the owning Return, additive changelog, kayfabizarro routing and KFB Hub metadata current in the same handoff.

Return:

- exact repository;
- branch / PR / head;
- changed files;
- retained owners;
- actual test counts;
- screenshots or browser proof where applicable;
- direct Stage URL when actually public;
- unresolved items;
- exactly one next gate.

Do not auto-merge or promote Live without the named human gate.

## 10. Optional CLI rule

If an optional helper CLI such as `game-dev` is unavailable, record it once and continue with repository-native checks unless sealed Game Development Studio evidence is specifically required.

## 11. Two-pass stop rule

After two failed repair passes on the same gate:

1. stop implementation;
2. preserve the candidate;
3. create the full failure-recovery export;
4. separate observed failure, proven cause and hypothesis;
5. choose one smaller next proof.

Do not spend a third pass polishing the same failed foundation.

## Paste-ready bounded-slice request

> You are working on a bounded KFB production slice. Begin by reading the current GitHub versions of:
>
> 1. `skills/chat/START_HERE.md`
> 2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
> 3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
> 4. the named project SSOT, current Recovery/Return and the slice briefing
>
> GitHub state overrides chat memory. Work on one named owner, branch, outcome and Stage route. Reuse verified donors and existing modules before creating anything new. A loaded asset URL is not proof that the actual donor design was used; show the source object in isolation before integrating it. Do not introduce placeholders, generic UI chrome, replacement branding or a second runtime owner when a current source/owner already exists.
>
> Save work in small checkpoints: implementation, tests/evidence, then Return/changelog/Hub metadata. After every GitHub write, fetch the exact branch head and intended files. A timeout means UNKNOWN, not success: inspect the ref or workflow first and retry only if the write is absent.
>
> All human test links must be direct `https://kayfabizarro.pages.dev/…` routes linked from the KFB Hub. GitHub Pages, githack, raw-CDN and local file links are not acceptance surfaces. Do not claim “live” until the exact Cloudflare URL has been opened and the expected revision is visibly present.
>
> Keep the project Return, additive changelog, kayfabizarro main router and KFB Hub current in the same handoff. Return the exact repo/branch/PR/head, changed files, actual test counts, screenshots or browser proof, direct Stage URL, unresolved items and one next gate. Do not auto-merge or promote Live without the named human gate.
>
> If an optional helper CLI such as `game-dev` is unavailable, record it once and continue with repository-native checks unless the brief specifically requires sealed Game Development Studio evidence. After two failed repair passes on the same gate, stop, preserve the candidate and create the full failure-recovery export.
