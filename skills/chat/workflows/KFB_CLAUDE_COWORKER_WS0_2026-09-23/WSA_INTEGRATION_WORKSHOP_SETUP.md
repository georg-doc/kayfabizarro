# KFB · WSA Integration Workshop Setup · 2026-09-23

Status: **PREPARED FOR NEXT REAL WSA/WORK INTEGRATION SLICE**

## Für Georg

WSA soll künftig nicht mehr „alles zusammensuchen und reparieren“.

Bevor WSA startet, sind die Teile schon vorbereitet:
- aktuelle Quellen;
- klare Zuständigkeiten;
- kleine Integrationsaufgabe;
- Tests;
- Review-HTML;
- Stop-Regel.

WSA macht dann nur noch den Schritt, den Web/Coworker wirklich nicht sinnvoll erledigen können.

## Role split

### Web Lead

Owns:
- current GitHub truth;
- owner decisions;
- sequencing;
- approval of integration proposal;
- final reconciliation after WSA.

### Claude Coworker

Owns when authorized:
- code review;
- bounded adapters/integrations;
- tests;
- Review HTML;
- small repair iterations;
- preparing the WSA Slice Card.

### Claude Design

Owns:
- visual authoring;
- design composition;
- editable Session Cuts;
- visual exploration that benefits from its authoring surface.

### WSA / Work

Owns only the missing capability named in the Slice Card.

Examples:
- simultaneous local multi-repo checkout;
- private/local binary transfer;
- OS/browser automation unavailable elsewhere;
- exact local packaging/build seam;
- final cross-repo smoke integration;
- release artifact creation that cannot be done through normal GitHub/Web tooling.

WSA is not:
- source archaeology;
- visual ideation;
- routine bug fixing;
- Hub maintenance;
- ordinary code review;
- repeated HTML debugging.

## Entry gate

Before WSA starts, require:

1. `WEB_ALIGNED` integration proposal;
2. exact current heads refreshed;
3. named owner for every touched subsystem;
4. closed repo/file roster;
5. already-passing project tests where applicable;
6. Georg-reviewed Review HTML for visual inputs where applicable;
7. one missing capability that justifies WSA;
8. one success check;
9. one stop condition.

If #7 is empty:
**do not use WSA.**

## WSA Slice Card

Use the Coworker:
`templates/SLICE_CARD.md`

Add this WSA section:

### WSA-only capability

Why Web/Coworker cannot finish this step:

### Repositories mounted

- repo + exact SHA;
- repo + exact SHA.

### One integration action

One sentence.

### Smoke test

One command/browser path/result.

### Stop immediately if

- source head moved;
- owner conflict appears;
- smoke test fails at first integration transition;
- required source is missing.

## Execution style

Ideal WSA job:

> Take these exact already-reviewed heads. Perform only the named local/cross-repo integration action. Do not redesign, research or widen scope. Run the one smoke gate. If it fails, preserve the first failing transition and stop.

## Checkpoints

1. local integration implementation;
2. smoke/evidence;
3. Return/export.

No open-ended repair loop.

## Failure return

WSA returns:
- exact inputs;
- exact local changes;
- first failing transition;
- logs/screenshots if relevant;
- whether source candidate was preserved;
- one recommended Web/Coworker repair.

Then Web/Coworker repairs outside WSA.

A new WSA run happens only after a new prepared candidate exists.

## Human review / Cloudflare

Do not use Cloudflare as the WSA edit-refresh loop.

Preferred:
`Coworker/Web source → Review HTML → Georg → prepared heads → WSA integration`

After WSA:
- return to Web for reconciliation;
- generate/reuse Review HTML if human inspection remains useful;
- publish Cloudflare only for a meaningful milestone/shared acceptance surface.

## Capacity-aware routing

Tool choice follows task fit first, available capacity second.

Current planning note from Georg:
Claude currently has a newly refreshed usage window and may have more practical room for Coworker/Design work than ChatGPT/WSA.

Use that capacity by shifting suitable work to:
- Coworker reviews;
- Coworker bounded integrations;
- Claude Design visual work.

Do not reserve work for WSA merely because it was historically done there.

Do not hard-code quota dates as project truth; recheck available capacity when a workshop starts.

## Candidate future workshop

A good first workshop is **not automatically ToolBox shared-editor integration**.

Try that first in Coworker if WorldBuilder R2 passes.

Use WSA only if the ToolBox integration then reveals a real local/multi-repo capability gap.

Potential later WSA examples:
- cross-repo Travel ↔ Racer integration needing both private repos locally;
- packaging a multi-repo accepted World/Resident/ToolBox composition;
- final local browser/OS smoke of an accepted integrated MVP.

## WSA workshop start text

> Read current `skills/chat/START_HERE.md`, `HUMAN_READABLE_STATUS.md`, Web-first execution, Claude Coworker WS0 Recovery and this WSA setup. Refresh every named repo/PR head. Execute only the attached Slice Card. Web/Coworker have already performed review, ordinary implementation and human HTML iteration. Name the WSA-only missing capability before changing code. Do not redesign, research broadly, use Cloudflare as a debugger, merge or promote Live. If the one smoke gate fails, preserve evidence and stop.

## Return to Georg

First say in plain language:
- what WSA actually connected;
- whether it worked;
- what Georg needs to test.

Then give:
- repo/branch/head;
- tests;
- logs;
- next gate.
