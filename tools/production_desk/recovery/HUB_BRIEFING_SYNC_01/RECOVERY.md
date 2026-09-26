# HUB-BRIEFING-SYNC-01 · Recovery

Status: **FROZEN FAILURE · SOURCE/BRIEFING SYNC PRESERVED**

Read in order:
1. `JOB_STATE.json`
2. `ATTEMPT_LOG.md`
3. `TEST_REPORT.md`
4. `NEXT_GATE.md`

Current source truth remains in:
- WorldBuilder #190 `58028b07d7618926c40ffaec3bd4053dc88c0efd`
- Architecture #204 `deec05c883de02836c3d699fa6e64d647d32a9f7`
- ENV Preview #218 `88c64c29075f31d655f4777437bb1aa82069df17`
- ToolBox r2 #221 `da20e926c38fa8576f31bffc5442d96d44fe4d1b`
- WSA/dispatch #222 `823bdb57c2ab30027cafcac9c867f5b6c3e8c9ac`

The public KFB Hub root was deliberately NOT republished because the DOM gate remained red after two repair passes.

Exactly one next gate: `HUB-BRIEFING-SYNC-F1`.
Timeout / Stream cache expired = UNKNOWN; inspect before retrying.


## Concurrent planning advance after source sync

PR #222 advanced concurrently after the briefing-sync checkpoint. Current verified planning head: `f37c620ae60aa2b6f358a53257d767641980aed6`.
The synchronized Executor Board remains present and current; the later commits add Racer cross-mode HUD navigation and confirm Track Core W0 readiness. No conflict with HUB-BRIEFING-SYNC-01 was found.

HUB-CTRL lanes that consume #222 are pinned to this newer head for freshness only. The frozen DOM/publication gate remains unchanged.
