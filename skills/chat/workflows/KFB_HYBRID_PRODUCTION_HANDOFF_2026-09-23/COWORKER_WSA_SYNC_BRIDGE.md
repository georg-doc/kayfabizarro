# Coworker ↔ WSA/Work Sync Bridge · 2026-09-23

Status: **PREPARED · GITHUB-BACKED · NO HIDDEN CHAT-TO-CHAT SYNC**

## Für Georg

Coworker und der ChatGPT-Work/WSA-Lead sollen nicht versuchen, sich über Chat-Erinnerung gegenseitig zu synchronisieren.

Gemeinsamer Bus:
**GitHub.**

Coworker verwaltet den aktuellen Produktionsstand.
WSA liest diesen Stand vor einem Integrations-Workshop und schreibt seinen eigenen Return zurück.

## Important limitation

There is no assumed hidden/shared conversation state between:
- Claude Coworker;
- ChatGPT Web Lead;
- ChatGPT Work/WSA.

Never say “the other chat knows this”.

Synchronization means:
- common GitHub source;
- exact heads;
- separate owner-written handoff files.

## Writer split

### Coworker owns

Current operational status:
- current lane heads;
- Production Packets;
- review artifacts;
- unresolved human gates;
- recommended next MVP.

Home:
`KFB_HYBRID_PRODUCTION_HANDOFF_2026-09-23/`

### WSA/Work owns

Workshop execution return only:
- exact inputs consumed;
- local/multi-repo actions;
- smoke tests;
- produced artifacts;
- failures;
- output heads/files.

WSA must not rewrite Coworker's current-state history while it is executing.

### Web Lead owns

Reconciliation after a meaningful milestone:
- resolve conflicts;
- refresh Hub/router;
- decide next owner / WSA need.

## WSA entry condition

Coworker may propose WSA only with:

1. CLOSED Production Packet;
2. exact repo heads;
3. accepted inputs;
4. named WSA-only capability;
5. one integration action;
6. one smoke test;
7. one stop condition.

If the WSA-only capability is empty:
**WSA NOT NEEDED.**

## WSA start prompt

> @GitHub
>
> Read current KFB Hybrid Production Handoff START_HERE, CURRENT_STATE, COWORKER_CONTROL_TOWER and the named CLOSED Production Packet.
>
> Refresh every repo/PR head.
>
> State the exact capability that requires Work/WSA and cannot reasonably be completed in Coworker/Web/Blender.
>
> Execute only that integration step.
>
> Do not redesign donors, reopen accepted visual decisions, perform broad source archaeology, merge or promote Live.
>
> Return exact input heads, changed files, smoke-test result and unresolved items.
>
> If the named capability is no longer necessary, stop and return `WSA NOT NEEDED`.

## Event-driven / semi-automatic option

If the connected GitHub app and Work surface support it, a Work task may monitor activity on the designated control PR / integration PR and notify or produce a fresh check-in when meaningful changes land.

This is **monitoring**, not automatic mutation of another chat's hidden context.

Recommended condition:
- only meaningful PR/head/Return changes;
- no hourly noise;
- no implementation action without the current CLOSED packet.

## Current recommendation

Do **not** start a WSA workshop yet.

Wait for:
1. Coworker complete ToolBox milestone;
2. Coworker current-lane check-in;
3. one accepted next MVP proposal.

Likely first useful WSA moment:
an accepted hybrid MVP requires local/private cross-repo assembly that Coworker cannot complete cleanly.

Until then:
Coworker remains operational lead.
