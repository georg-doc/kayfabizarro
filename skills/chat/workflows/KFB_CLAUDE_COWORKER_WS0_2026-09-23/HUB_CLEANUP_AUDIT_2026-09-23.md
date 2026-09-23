# KFB Hub Cleanup Audit · 2026-09-23

Status: **SOURCE CLEANUP PREPARED · NOT PUBLISHED**

## Für Georg

Vorher wirkte der Hub wie eine Mischung aus aktueller Aufgabenliste und Archiv.

Jetzt ist die aktive Navigation auf das reduziert, was du tatsächlich gerade prüfen/entscheiden kannst. Alte Briefings bleiben erhalten, werden aber nicht mehr standardmäßig als aktuelle Arbeitsaufträge präsentiert.

## Before

KFB Hub source on current main contained:
- **36** TODO cards total;
- **56** built-in briefing cards;
- Today briefing selection hardcoded to older Combat / Surface Adapter / Lead Work / Curtain items;
- quick links still pointed to dated 18 Sep recovery cursors.

Several briefing cards still used words such as `CURRENT`, `P0 NOW` or `READY` even though newer Returns/PRs had advanced their lanes.

## After

TODOs:
- **8 total**;
- 4 current KFB P0 human/active gates:
  1. WorldBuilder R2;
  2. Travel TMB-1E;
  3. Racer R3b;
  4. ToolBox Resident-set portability;
- 2 KFB P1 follow-ups:
  - Claude Coworker;
  - Orc Band;
- 2 DocCheck SimBlood items retained.

Briefings:
- historical entries remain in source;
- default Briefings view shows **6 explicit current start points** only;
- old entries shown through search / All are relabeled:
  `REFERENCE · VERIFY CURRENT`;
- copying an old start prompt now prepends:
  `REFERENCE ONLY — do not execute ... without checking the current project Return / PR head first.`

Current briefing allowlist:
- Claude Coworker WS0;
- Web-first Execution;
- ToolBox current Stage-First/source-lock path;
- WorldBuilder current R2 gate;
- shared In-scene Editor contract;
- Orc Band POC.

Quick links now point to:
- WorldBuilder PR #186;
- Travel PR #37;
- Racer PR #33;
- ToolBox PR #185;
- current Production Router.

## Safety

Nothing historical was deleted.

No project source, runtime or archived evidence changed.

This is navigation hygiene only.

## Static evidence

- Hub JS syntax compile check: **PASS** after cleanup.
- curated TODO count: **8**.
- current Briefing allowlist: **6**.
- stale-copy warning present: **PASS**.
- Cloudflare publication: **not run**.

## Coworker maintenance rule

Future Claude Coworker Hub work should use:
`HUB_HYGIENE.md`

Default Coworker action:
REVIEW_ONLY audit in chat.

Actual Hub edits require a bounded write / Slice Card.

## Next

Human look at the GitHub-source cleanup is enough before merge.

Public Hub publication can wait for the next meaningful publication batch.
