# Paste-ready · KFB WorldBuilder v1 · Fresh Web Chat

@GitHub

We start KFB WorldBuilder v1 with **Web-first / no-Work-by-default** execution.

Read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
5. `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`
6. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md`
7. `tools/KFB-ToolBox/_handover/WORLD_BUILDING_PREFLIGHT_WEBCHAT_2026-09-22/START_HERE.md`

GitHub state overrides chat memory.

WB1-P0 is already complete on Draft PR #175. **Do not rerun P0.**

Do **WB1-P1 only**.

Before implementation:
- fetch current `main`;
- fetch PR #175 / branch `chatgpt-web/world-building-preflight-2026-09-22`;
- confirm its P0 head `17fd31a907b4346fddef7501490f738c251c2a37` or re-read if advanced;
- reconcile that completed P0 branch additively with current main without discarding P0 evidence.

Goal:
build only the small reusable Environment Profile proof and stop.

Do not implement P2 in the same cycle.
Do not build WorldBuilder UI.
Do not rebuild Cologne/OSM.
Do not build infinite terrain, Möbius, caves or voxel engine.
Do not use Work/WSA.
Do not publish to Cloudflare.

Apply gate proportionality:
minor optional donor problems are HOLD/DEFER, not blockers.

Persist:
- exact source pins;
- reuse classification;
- licenses;
- protected owners;
- additive changelog/Return;
- exactly one next gate.

After every GitHub write fetch exact branch head and intended files.

P1 donor priority:
- original WhackMan lighting sources remain source truth;
- verify and adapt `WORLDDESIGN_LAB_2026-09-23/deliverables/wd-light.js` rather than rebuilding another light implementation;
- document intentional deltas;
- keep WhackMan gameplay/MazeGraph absent.

Architecture rule:
**Material and light remain orthogonal.**

Environment Profile: dusk/world light, fog, torch pool/range/flicker, local visibility, exposure, optional environmental glow.
Material/look: separate `MaterialProfileRef`; reversible `WHACKMAN_MATTE_CANDIDATE` allowed for testing only.

Do NOT pull into P1:
Derek/Macro, Ink, Cel, Voxel, Story Palette, day/night cycle, full WorldDesign UI, standalone product build.

Return a Portable Preview Pack.

STOP after P1.
