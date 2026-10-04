# KFB Surface Update Runbook

## Ownership

- Production Control is the canonical owner of status, TODOs, briefings, Returns and additive history.
- Production Hub is the only human front door.
- KFB ToolBox is the only current tool router.
- Specialist Sites remain tools; products remain products.

## Routine status change (no Work required)

1. Read `KFB-SURFACE-CURRENT-01` and `KFB-PORTFOLIO-ROUTER-01` through Production Control.
2. Append the new durable CURRENT/TODO/briefing record through `kfb_web_checkpoint`.
3. Update only `surface-config/CURRENT_BOARD.json` to the matching readable snapshot.
4. Run `sync-surface-data.mjs --hub=<Hub dist directory>`.
5. Use a low-cost `PUBLISH_ONLY` pass to update the existing Production Hub Site in place.
6. Open the exact Hub URL and confirm the revision. Do not edit layout or business logic.

## Routine presentation change (no Work required)

1. Change only `surface-config/PRESENTATION.json`.
2. Run `sync-presentation.mjs` with the existing Hub, ToolBox and Control source directories.
3. The script regenerates Control's small `surface-theme.css`; no component file changes.
4. Use a low-cost `PUBLISH_ONLY` pass for affected existing Sites.
5. Verify the exact URLs. No component or business-logic edit is required.

## Escalate to Work only when

- data contracts, storage, authentication, navigation roles or application behavior must change;
- a new specialist product needs a new runtime owner;
- the deterministic sync scripts themselves must change.

Never create a second Hub, Control or ToolBox to avoid an update.
