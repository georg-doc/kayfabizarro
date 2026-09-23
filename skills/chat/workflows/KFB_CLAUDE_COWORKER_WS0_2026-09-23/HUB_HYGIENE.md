# KFB Hub Hygiene · current-routing rule

Status: **CURRENT WS0 MAINTENANCE RULE**

## Für Georg

Der Hub soll keine historische Aufgabenwand sein.

Default:
- **Heute** zeigt nur echte aktuelle Entscheidungen/Tests.
- **Briefings** zeigt nur aktuelle Startpunkte.
- Alte Briefings bleiben auffindbar, aber klar als **Referenz · aktuellen Stand prüfen** markiert.
- Historische Dateien werden nicht gelöscht.

## Why

Old briefs remain useful evidence, but become dangerous when they still look executable after a newer Return/PR has superseded them.

The Hub is a navigator, not the archive.

## Current display rules

### Heute

Maximum:
- 4 visible P0 items per focus on the default Today view.

A Today item must point to:
- a current human gate;
- a current implementation decision;
- or one immediate next action.

Do not put:
- historical repairs;
- completed source audits;
- future ideas;
- parked P1/P2 work;
- stale recovery cursors.

### Briefings

Default Briefings view shows only the explicit `currentBriefingIds` allowlist.

All older entries may remain in the source catalogue for search/reference.

When an old entry is shown through search / All:
- badge it `REFERENCE · VERIFY CURRENT`;
- copied start text must begin with a warning to read current project Return/PR first.

### Quick links

Quick links must route to current:
- production workflow;
- current owner Return/PR;
- current ToolBox/WorldBuilder/Racer/Travel gate.

Do not label dated recovery documents as “Current” after their lane has advanced.

## Coworker role

Claude Coworker may run a periodic `REVIEW_ONLY` Hub audit:
1. refresh current project PR heads;
2. identify cards whose text/gate is older than the current Return;
3. propose keep / update / reference / archive;
4. return the audit in chat.

Actual Hub writes require a bounded Slice Card.

## No deletion by default

Cleanup means:
- remove from Today;
- remove from current Briefings allowlist;
- mark as reference/history;
- update routing.

Do not delete source/history unless Georg explicitly asks.

## No Cloudflare for hygiene

GitHub Hub source may be cleaned immediately.

Public Hub publication is batched with the next meaningful accepted publication cycle.


## Hub is not the delivery surface

The Hub helps Georg find current projects and gates.

It must **not** be the only way to reach a current human review.

Whenever a chat asks Georg to inspect a specific HTML:
- that chat must attach/provide the direct clickable review artifact;
- the Hub may point to the project/PR for context;
- Georg must not need to search the Hub, ToolBox preview catalogue or GitHub tree to locate the review file.

For one-off zero-install reviews, Chat is the delivery surface; Hub is navigation.
