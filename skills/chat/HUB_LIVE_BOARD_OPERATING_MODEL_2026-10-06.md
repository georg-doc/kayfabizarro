# KFB Production Hub · Live Board Operating Model · 2026-10-06

Status: **SOURCE READY · ONE-TIME SITE MIGRATION REQUIRED**
Owner: **KFB Production Hub**
Canonical live board data:
`main/kfb-hub/current-board.json`

## Problem being fixed

A Hub that requires a ChatGPT Work/Sites publication for every status, briefing or next-step change is not a usable working Hub.

The Hub shell/presentation and its frequently changing coordination data must be separated.

## New model

```
Web Chat / Production Control
        ↓
GitHub main/kfb-hub/current-board.json
        ↓
Production Hub fetches live on open/refresh
        ↓
Paper/Dark UI renders current jobs + briefing cards
```

Routine content changes require:
- one GitHub write;
- read-back verification.

They do **not** require:
- Work/WSA;
- Sites publication;
- Cloudflare;
- Hub HTML editing.

## What lives in the live board

- status/context;
- P0;
- P1/Next;
- parallel/prep lanes;
- briefing cards with copy-ready start prompts;
- open questions;
- quick links.

GitHub Issues/project SSOTs remain authoritative project truth.
The board is a routing/orientation projection, not a second implementation SSOT.

## When a Site publish is still allowed

Only when the Hub **shell itself** changes:
- UI/layout;
- loader/data contract;
- navigation behavior;
- accessibility/mobile behavior;
- new rendering feature.

Changing a job, prompt, status, link or question is **not** a Site-shell change.

## Loader contract

Remote primary:
`https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/kfb-hub/current-board.json`

Fallback:
the deployed local `./current-board.json` snapshot.

If remote loading fails, the Hub remains usable but visibly labels the fallback.

## One-time migration gate

Publish the already-prepared Paper/Dark shell update once.

Acceptance:
1. open existing Production Hub Site;
2. visible board revision equals current GitHub-main revision;
3. Claude Design UFO briefing appears from remote data;
4. change a harmless test field/revision in GitHub main;
5. refresh Site without publishing;
6. changed value appears;
7. restore/finalize board value if a temporary probe was used.

After this proof:
**routine Hub updates are GitHub-only.**
