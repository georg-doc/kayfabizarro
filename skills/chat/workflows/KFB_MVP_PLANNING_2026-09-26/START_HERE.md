# KFB MVP Dispatch Prep · WSA recon + planning approval · 2026-09-26

Status: **WSA APPROVED WITH D2/D3/D6 TUNES · BOUNDED DISPATCH OPEN · NO MASS EXECUTION**

Owner: Georg / KFB lead planning  
Branch: `chat/wsa-mvp-dispatch-prep-2026-09-26`  
Base: `main@388e90875a0b28b9241f126f26ba44456419e43d`

This folder is the token-sparse WSA entry for the next KFB production wave. It does not replace project SSOTs, HUB-CTRL, ToolBox, WorldBuilder, Racer, Travel, OSM City Lab, Resident Atlas or Animation owners.

## Read only these three first

1. `WSA_RECON_PLAN_APPROVAL_2026-09-26.md` — exact current state + decisions requested.
2. `EXECUTOR_BRIEFINGS_2026-09-26.md` — STARTABLE / WAITING / DO NOT START + copy-ready executor starts.
3. `RECOVERY.md` — refs and recovery if this planning chat disappears.

Racer working page:
- `RACER_DESIGN_EXECUTION_OVERVIEW_2026-09-26.md` — current dispatch order + direct brief links; use instead of older Hub/Racer cards.
- `CLAUDE_DESIGN_RACER_HUD_BILLBOARDS_CURRENT_START_2026-09-26.md` — startable-now fresh Claude Design wrapper.

Supporting evidence:
- `ABORTED_WEBCHAT_RECOVERY_INVENTORY_2026-09-26.md` — recent aborted/fragile-chat inventory.
- `ABORTED_WEBCHAT_RECOVERY.json` — machine-readable state.
- `LONG_JOB_CHECKPOINT_PROTOCOL_2026-09-26.md` — proposed timeout-safe C0/checkpoint workflow.
- `B2B_P1_CLOSURE_RECOVERY_BRIEF_2026-09-26.md` — closure-only recovery for green orphan PR #212.
- `CITY_BITS_WORLD_DRESSING_RECON_01_2026-09-26.md` — recover the City Builder Bits application analysis without redoing source discovery.
- `CLAUDE_DESIGN_RACER_R0_BLOCKER_RETURN_2026-09-26.md`
- existing Coworker source drafts: `00_UEBERBLICK_MVP_WSA.md`, `DRAFT_WORLDBUILDER.md`, `DRAFT_TOOLBOX.md`, `DRAFT_RACER.md`, `AUDIT_PAKETE_WS1.md`.

## Binding lead decisions already on main

From `main@388e9087…`:
- use what works and integrates best; reuse before rebuild;
- Travel Globe is **not** the world base;
- TinySkies/Travel may donate sky, weather, light/mood and accepted ground↔flight movement/camera ideas, not terrain ownership;
- mobility first for M1: card flight/God Mode + better shared orbit camera;
- ToolBox: FrizzleBob identity/rig including ears across KayKit Legacy/Medium/Large while preserving destination skeleton compatibility; add surf poses for card flight;
- Blender MCP may author set pieces; new track geometry waits for Track Core;
- rail, mine-cart and space/cosmic skins are future consumers of the same Track Core, requiring arbitrary up and gravity/motion modes.

## Current owner routes

- Hub/status: HUB-CTRL PR #202, branch `work/hub-ctrl-01-2026-09-24`.
- Production architecture/catalog: PR #204.
- ToolBox runtime owner: PR #185; r2 review recovery: PR #221.
- Environment preview: PR #218.
- WorldBuilder: PR #190; stopped World r2 recovery leads to `WORLD-R2-CONTRACT-RESET-01`.
- Track Core planning: PR #219 stacked on Cologne Route PR #216.
- Race runtime/physics owner remains `georg-doc/KFB-Stunt-Car-Race`.
- Motion Library v2: PR #213; EarRig v5: PR #214.

## Current gate

WSA recon is complete. The recorded result is **APPROVE WITH D2/D3/D6 TUNES**.

Binding rules:
- Camera-Core-0 is recon/contract only and creates no new owner/module;
- one Surface Adapter resolves final visible/support height;
- superseded Travel-world ownership wording must be corrected in PR #204 and PR #218 metadata without runtime migration;
- Playable Track R0 and Cologne OSM R0 remain HOLD.

Execute exactly one bounded first-wave slice at a time from `EXECUTOR_BRIEFINGS_2026-09-26.md`. No mass merge or Live promotion.
