# KFB Hub · Status Sync v1 · Web/GitHub Brief · 2026-09-25

Status: **READY · HUB-CTRL OWNER · NO UI REDESIGN**
Owner: PR #202 / tools/production_desk

## Outcome

The public KFB Hub shows fresh production state within minutes without requiring a Cloudflare rebuild for every status change.

## Existing useful mechanism

The current Desk shell already polls every ~75 seconds from:

`bot/production-desk-update/registry/production/v1`

via raw GitHub, before falling back to main/embedded state.

Keep this.

The public site therefore does **not** need a Cloudflare deployment for ordinary status refresh.

## Current failure

The bot registry is stale because the scheduled GitHub Action only runs from the default branch, while the Production Desk workflow/config remains on HUB-CTRL PR #202.

Result:
- public shell may be live;
- live registry is hours old;
- “8 hours old” is a pipeline problem, not merely UI copy.

## First implementation

1. Preserve HUB-CTRL #202 as the only Hub owner.
2. Keep `bot/production-desk-update` as the live read source.
3. Make one small, independently reviewable autosync core that can safely exist on main without promoting the rejected Hub shell.
4. Core includes only what is necessary to refresh the registry:
   - production-desk builder/config contract;
   - workflow;
   - registry validation;
   - bot-branch publication.
5. Do **not** promote the current rejected desk UI with it.
6. Schedule target: every 30 minutes or better; manual dispatch remains available.
7. Heartbeat should be 1 hour; stale warning at 2 hours.
8. After any important KFB product handoff, Web/GitHub Bridge may also trigger/write the status mirror immediately rather than waiting for schedule.

## Current content source

Use current HUB-CTRL config and current Architecture v3 source.

Current high-priority state must include:
- ToolBox Production-01 · PROCEED PASS;
- World Integration-01 · PROCEED PASS;
- Ear Rig / EAR-DANGLE-01;
- Hub UX Recovery Claude Design Sprint;
- Racer LOOP_REAL gate;
- Resident Disco S40 bridge;
- current NPC-LIFE / Travel / Billboard states.

Remove superseded “needs Georg” cards for:
- WB-W0;
- Hürth architecture proof;
- WB2 Claude-Design waiting state.

History stays in GitHub/archive, not Today.

## Decision truth

Hub decision UI may create local `kfb.hub-decision/1` packets.

A later Web/GitHub Bridge may persist accepted decision packets into repository status truth.

Do not let client-side localStorage masquerade as shared state.

## Test

Technical:
- update a harmless status marker in source;
- build registry;
- bot branch advances;
- raw bot manifest shows the new checkedAt/content hash;
- public Hub reload fetches the new bot manifest without Cloudflare deployment;
- Reload visibly reports UPDATED / NO CHANGE / ERROR.

Human:
- Georg sees the status change on the exact public Hub route within the expected freshness window.

## Public route

`https://kayfabizarro.pages.dev/kfb-hub/`

No alternative human acceptance URL.

## Stop rule

Do not redesign the Hub in this slice.
Do not create a second status database.
Do not introduce a Cloudflare Worker/D1 backend unless the raw-GitHub status path is proven insufficient.

Exactly one next gate:
**PUBLIC HUB FRESHNESS PROOF · bot registry update visible without Cloudflare redeploy.**
