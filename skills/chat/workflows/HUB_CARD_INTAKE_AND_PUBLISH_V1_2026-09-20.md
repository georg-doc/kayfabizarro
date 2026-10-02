# Hub Card Intake + Publish Contract v1

Status: **DRAFT RECON · NO AUTOMATION IMPLEMENTED**  
Date: 2026-09-20  
Owner: KFB Hub / production routing

## Problem

External Web chats can make branches, PRs and Stage candidates, but they cannot safely write arbitrary cards or to-dos straight into the public Hub. Direct edits create collisions in `kfb-hub/index.html`, stale cards and false “live” claims.

## Proposed small contract

Every external chat return may add exactly one small `HUB_CARD.json` next to its own `RETURN.md`.

Required fields:

- `title`, `lane`, `status`, `priority`;
- `sourceRepo`, `sourceBranch`, `sourceHead`, `pr`;
- `stageUrl` (only a `kayfabizarro.pages.dev` URL, or null);
- `evidence` (tests/screenshots/known failure);
- `humanGate`;
- `owner`, `nextAction`.

No chat writes the public Hub card list directly.

## Publish rule

1. A PR is **incoming**, never live.
2. After review, its card is reconciled against the current `main` by one Hub maintainer.
3. The Hub renderer consumes only the merged manifest.
4. The publishing step records:
   - exact `main` source head;
   - exact Hub HTML/manifest revision;
   - exact `cloudflare-live` head;
   - direct public URL opened with expected marker.
5. If a deployment/build times out or fails, status is **UNKNOWN/FAILED**, never “probably live”.

## Tomorrow’s manual version

Before automation exists, use one small review lane:

`incoming card → PR review → merged main → lean Hub publish commit → direct public marker check`

This makes visible cards, To-dos and Stage links current without allowing external chats to overwrite product navigation or one another’s work.
