# HUB-BRIEFING-SYNC-01 · Failure Recovery

Status: **FROZEN AFTER TWO REPAIR PASSES · SOURCE SYNC SALVAGED · ROOT HUB NOT REPUBLISHED**

Owner: HUB-CTRL #202 / `tools/production_desk`
Branch: `work/hub-ctrl-01-2026-09-24`

## Salvaged and current
- #222 executor board synchronized: World Stage Prep now; Track Core G0→W0; Racer HUD+Billboards parallel; completed ENV/ToolBox gates no longer presented as startable.
- #204 catalog synchronized: 96 jobs / **42 READY / 54 HOLD**; ENV Preview and WB2 Design no longer READY.
- HUB-CTRL config synchronized to current World/ENV/ToolBox/Racer/WSA truth.
- World/ToolBox/ENV product runtimes unchanged.

## Final validation attempt
Run `36213057662`:
- Production Desk builder: **16/16 PASS**
- render unit tests: **2/2 PASS**
- online registry build: **PASS**
- registry validation: **VALID**
- Desk render: **PASS**
- DOM behaviour: **FAIL**
- Cloudflare/publication: **NOT STARTED**

## Remaining DOM blockers
1. The card-face contract still sees at least one PR-number/SHA-like technical token in visible card text.
2. The test still hardcodes `vfx-sfx .btn.primary`; that current lane has no primary copy button, so the old test assumption is stale.

The second repair pass already fixed generic paste-ready selection for the first copy test and removed several visible PR-number references. Do not perform repair pass 3 on this candidate.

## Exactly one next gate
**HUB-BRIEFING-SYNC-F1 · DOM CONTRACT CENSUS ONLY**

Fresh chat:
- identify the exact remaining visible technical token(s);
- enumerate current card/button semantics rather than naming a historical lane;
- update the DOM contract/test only where it is demonstrably stale;
- no product runtime changes;
- no status architecture changes;
- no Hub redesign;
- no publication until the full Production Desk validation is green.

Timeout/Stream-cache rule remains UNKNOWN → inspect refs/runs first.
