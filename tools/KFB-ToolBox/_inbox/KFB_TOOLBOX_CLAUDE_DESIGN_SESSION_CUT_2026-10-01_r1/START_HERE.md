# START HERE · KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1

Entry point: `KFB ToolBox Production-08.dc.html`. Serve it over HTTP (`python3 -m http.server` in this folder), not file://.
P08 = P06 (all rigging) + P07 (3D inline editor). Own storage key `kfb-toolbox-production-08`; on first load it copies the key P06 and P07 shared.

Standalone `KFB ToolBox Production-08 standalone.html`: **FAIL**. The shell renders, boot stalls, values never bind. r2's P06 standalone shows the same defect (it was never checked in a browser). Use the HTTP route.

1. Actor **FrizzleBob · Ear Rig v5** → Rigging › Eyes, Clay volume › Hinge: "Lid line = Level (head)", "Lid roll · + = both outer corners up". Button "Run acceptance 1–5 (front-view lid angle)".
2. Look at the head from above: no dark band at the ear roots. Contact shadow rows: "Ears cast shadow" Off/On, slider "Ear roots · ear ↔ head" (0 = none).
3. Studio › Face › **Laute · 13 shapes**: each button puts its decal on the model mouth; Rest brings back the painted mouth.
4. Studio › Scene: one gizmo with snap (grid / connector / mount), ⬓ measured drop, undo / redo, F = focus.
5. Diagnostics › Run PRODUCTION-01 self-test (about 3 min).

Read next: RETURN.md → HANDOVER.md → HANDOVER_BLENDER_MCP.md → HANDOVER_WSA.md → TEST_REPORT.md.
