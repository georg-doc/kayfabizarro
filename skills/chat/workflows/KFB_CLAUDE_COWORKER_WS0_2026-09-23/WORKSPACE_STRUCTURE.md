# KFB Claude Coworker WS0 · Workspace Structure

## Permanent WS0 folder

`skills/chat/workflows/KFB_CLAUDE_COWORKER_WS0_2026-09-23/`

Contents:

- `START_HERE.md` — minimal boot;
- `OPERATING_CONTRACT.md` — permissions and boundaries;
- `CURRENT_SPRINTS.md` — current examples / moving source pointers;
- `WORKFLOWS.md` — Review / Integration Proposal / Bounded Implementation;
- `REVIEW_HTML_SOP.md` — token-light routing into the shared review system;
- `templates/` — compact reusable packets;
- `reviews/` — Coworker review outputs when repository-local review is useful;
- `integration/` — Web-aligned integration proposals / WSA slice proposals;
- `returns/` — Coworker slice Returns if a productive slice is executed;
- `CHANGELOG.md` — additive WS0 history;
- `RETURN.md` — current WS0 handoff.

Do not turn this folder into a copy of project source or project SSOTs.

## Output placement rule

### Code review

Default:
`reviews/<PROJECT>/<YYYY-MM-DD>_<PR-or-SHA>.md`

If the review belongs naturally in the project owner repo, the Slice Card may instead name a project-local path.

### Integration proposal

`integration/<TOPIC>_PROPOSAL_<YYYY-MM-DD>.md`

Status line must be one of:
- `PROPOSAL`
- `WEB_ALIGNED`
- `WSA_READY`
- `SUPERSEDED`

### Productive slice

The code goes to the **existing owner repo**, not this folder.

This folder may contain:
- Slice Card;
- coordination notes;
- review packet;
- final Return pointer.

The project owner keeps:
- runtime;
- project tests;
- project Return/changelog;
- accepted review artifact.

## Branch naming

Coworker planning/review branch in kayfabizarro:
`claude-coworker/<topic>-<date>`
or a Web-created coordination branch when Web Lead is the writer.

Productive slice:
use the exact branch named by the Slice Card in the receiving owner repo.

Never invent a new branch family after implementation starts.

## No duplicate evidence stores

GitHub is source truth.

Do not mirror:
- whole source trees;
- binary assets;
- current Returns;
- review templates;
- project changelogs.

Reference exact repo/path/ref instead.

## Review artifacts

Generated chat Review HTML is disposable presentation until accepted.

After human acceptance:
archive the exact accepted artifact in the receiving project repo with:
- source head;
- artifact hash;
- human result.

Only reusable **harnesses** are registered in the central review pool.

## WSA handoff location

Coworker prepares the proposal here.

Once `WEB_ALIGNED`, create/use the project-appropriate WSA/Work handoff named by Web Lead.

Do not make this WS0 folder the permanent WSA integration owner.
