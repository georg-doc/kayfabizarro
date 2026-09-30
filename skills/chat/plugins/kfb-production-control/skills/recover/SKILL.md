---
name: recover
description: Recover a KFB production slice from Production Control and current GitHub/project truth after a fresh chat, context loss or handoff. Read-only workflow; use whenever the user asks to resume, recover, continue, or find the current KFB gate.
---

# Recover KFB production

Workflow argument: `$ARGUMENTS`

1. Invoke `/kfb-production-control:control` semantics for source hierarchy and owner boundaries.
2. Call `kfb_web_read` for the exact workflow when `$ARGUMENTS` names one. If no workflow is supplied, use current conversation/project context only when it identifies one unambiguously; otherwise read recent Production Control records and resolve the narrowest matching workflow before implementation.
3. Read current GitHub/project SSOT, Return/Recovery and exact branch/PR/head named by the durable record.
4. Reconcile conflicts in favor of current GitHub/project truth.
5. Do not modify code, checkpoints, GitHub or deployment merely to recover.

Return a compact recovery block with:

- workflow;
- owner;
- repo / branch / PR / exact head (or explicit non-Git source state);
- last proven result;
- current artifact/session-cut reference if any;
- unresolved/deferred items;
- exactly one next gate.

If the MCP connection itself is missing, report `MCP_BINDING_PENDING`; do not reconstruct durable state from chat memory.
