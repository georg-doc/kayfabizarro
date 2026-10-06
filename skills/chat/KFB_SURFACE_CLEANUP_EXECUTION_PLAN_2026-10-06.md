# KFB Surface Cleanup · Execution Plan · 2026-10-06

Status: **READY · ONE SMALL WORK GATE, EVERYTHING ELSE GITHUB ROUTING**
Owner: **KFB Production Hub / Surface Consolidation**

Binding hierarchy:
`skills/chat/KFB_SURFACE_HIERARCHY_CURRENT_2026-10-06.md`

## Outcome

Georg should normally need only:

1. **Production Hub** — overview / what matters now;
2. **ToolBox** — specialist tools;
3. **one current product Site** when reviewing/using a product.

GitHub is the underlying SSOT.

Production Control, old Cloudflare surfaces, Project Tracker and old Stage pages must not be required for daily orientation.

## Phase 0 · DONE IN SOURCE

Already completed on `main`:
- binding surface hierarchy;
- Site registry roles;
- old Cloudflare Hub UI v2 marked legacy donor;
- old Cloudflare Asset Librarian marked stale legacy mirror;
- Project Tracker marked optional/non-canonical;
- Production Control demoted to ledger/history;
- Asset Librarian GPT Site marked canonical specialist tool;
- Hub live-board data model includes jobs, briefings, open questions and surface roles.

No Work needed for this phase.

## Phase 1 · EXACTLY ONE WORK / SITES JOB

Purpose:
publish the already-prepared Hub loader shell **without changing the accepted UI**.

Work must:
- use the existing Production Hub Site/project;
- preserve the exact direct-site Paper/Dark look;
- treat the direct Site in a fresh browser as the visual baseline;
- treat stale Work Preview / cached preview as non-authoritative;
- publish only the remote live-board loader;
- verify the live board + dynamic briefing cards;
- prove one later GitHub board update appears after refresh without another deployment.

Work must not:
- redesign;
- change typography/layout/colors/spacing/card chrome;
- resurrect Pocket Inbox / old waiting-human cards if absent from the current direct Site baseline;
- add/remove major UI sections for cleanup;
- redesign Production Control;
- redesign ToolBox;
- touch Cloudflare;
- touch Open World.

Detailed brief:
`skills/chat/publish/WORK_HUB_LIVE_BOARD_NO_REGRESSION_2026-10-06.md`

## Phase 2 · ToolBox identity verification · READ ONLY inside same Work job

Question:
Does the already-linked
`https://kfb-toolbox.frizzlebob.chatgpt.site`
map to exactly one existing GPT Site project?

Work may:
- inspect existing Site/project metadata;
- report exact project/version/deployment if found;
- persist that identity to GitHub registry if unambiguous.

Work may not:
- create a new ToolBox Site;
- redesign ToolBox;
- publish ToolBox;
- reconcile its tool content in this job.

If identity cannot be proved:
`TOOLBOX_IDENTITY_UNRESOLVED`
and stop that substep.

This is nonblocking for the Hub migration.

## Phase 3 · NO WORK · after Hub migration PASS

Routine operation becomes:

```
Web Chat
  → update main/kfb-hub/current-board.json
  → fetch exact head/file
  → user refreshes Production Hub
```

No Sites publish.

No Cloudflare publish.

No Work.

## Surfaces after cleanup

### CURRENT / DAILY
- Production Hub → overview.
- ToolBox → specialist tools.
- current product Site → actual product review/use.

### UNDERLYING AUTHORITY
- GitHub → SSOT / Issues / PRs / Returns.

### ON-DEMAND ONLY
- Production Control → decisions / Returns / audit history.

### NON-CANONICAL
- Cloudflare Hub UI v2 → legacy design donor.
- Cloudflare Asset Librarian → stale mirror.
- Project Tracker Page → optional private scratchpad.
- old ToolBox Stages/Home/standalones → history/donor.

## UI regression rule

The current direct Production Hub visual presentation is the acceptance baseline.

No code/source claim of "Paper/Dark" overrides visible regression.

Required:
- capture direct Site before;
- publish loader update;
- capture direct Site after in fresh browser context;
- compare same viewport;
- layout/style/content chrome must remain materially unchanged;
- only current data/status may differ.

Any visible design regression:
`UI_REGRESSION_FAIL`

Do not repair it by redesigning.
Restore/preserve the accepted shell and retry only the loader seam.

## Close condition

Surface cleanup is considered operationally complete when:
1. Hub live-board migration PASS;
2. no-republish proof PASS;
3. ToolBox identity = VERIFIED or explicitly UNRESOLVED;
4. Production Control/Cloudflare/Project Tracker remain outside daily navigation;
5. #364 closes.

