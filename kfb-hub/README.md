# KFB Production Hub

**Permanent URL:** https://kayfabizarro.pages.dev/kfb-hub/

Human-facing navigator for the wider KFB production scope. It is deliberately **not** a new SSOT.

## What it contains

- recovery and current lead entry points;
- Asset Librarian and ToolBox links;
- KFB Town current start/session/living documents;
- Travel, Combat and Stunt implementation repositories and public previews where available;
- DocCheck project recovery through the central Registry/current lead checkpoint, including SimBlood;
- central production skills and protocols;
- search and simple category filters;
- a small **Next actions** board for Georg's current working list.

## Recovery contract

The Hub is the human bookmark after a broken/ended chat.

The current recovery path is:

1. open the Hub;
2. open **Current Lead Checkpoint**;
3. follow the current dated pointer;
4. route through `skills/chat/REGISTRY.json` to the actual project SSOT;
5. inside the project, read its own recovery/current-WIP files.

### DocCheck · SimBlood

Current SSOT:
`https://github.com/georg-doc/doccheck/tree/main/sim-blood`

Recovery:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/RECOVERY.md`

Current WIPs:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/WIP_STATUS.json`

DocCheck project surfaces use `#cc0033` as a restrained accent color. This is a UI convention, not a medical-image tint.

## Next actions contract

The To-do board is a personal convenience layer, not project truth. Task definitions live inside the static page; checkmarks are stored only in the current browser via `localStorage` and never modify GitHub, project status, owner contracts or consumer runtimes.

## Contract

1. GitHub/project SSOT wins whenever a card or task on this page is stale.
2. The Hub may link to a status; it does not promote that status.
3. Project/runtime ownership does not move into the Hub.
4. Keep the page useful for Georg: prefer a small number of durable entry links over mirroring every file.
5. For chat recovery, prefer `skills/chat/RECOVERY_PATH.md` and the current lead checkpoint linked from the Hub.
6. A checked task is not a tested result or accepted implementation.

## Maintenance

The page is intentionally dependency-free and self-contained in `index.html`. Update links, labels and current task definitions only when they remain useful for daily work. Avoid turning it into a second registry, issue tracker or project dashboard with independently maintained truth.

For DocCheck projects, the Hub should route to the project recovery file and current WIP manifest rather than duplicating those details in the page itself.
