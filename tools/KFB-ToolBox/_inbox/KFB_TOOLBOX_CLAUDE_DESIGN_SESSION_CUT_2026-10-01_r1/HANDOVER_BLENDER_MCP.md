# HANDOVER → Blender MCP lane · 2026-10-01 (from Claude Design · ToolBox P08)

Full return: docs/RETURN_FB_LIDS_LEVEL_FIX_01.md · numbers: evidence/lids_level_fix_01_acceptance.json.

## FB_LIDS_LEVEL_FIX_01: implemented, acceptance §3 5/5 PASS
- Level: your fix (remove the oval tilt only), plus an exact solve. The eye group's oval scale (w 1.06 ≠ h 1.04) left up to 0.9° at turn 30 / oval −25; now 0.00° over all 12 setups.
- **Sign:** your front-view angle has the opposite sign from ours. Geometrically, follow at oval −25 lifts the outer corners (ours +30.3°, yours −30.2°). With `sx · −1 · roll`, roll + lowered both outer corners on screen. P08 uses `sx · roll`: + = outer up. Please flip the sign in your measuring script, or tell us your axis convention.
- Self-test 22 / 24 from your run: both were test bugs (dx cap 0.6; legacy-seat premise + stale eye reference after rebuild). Behaviour unchanged.

## New this session (FYI)
- Ear roots: ears no longer cast shadow onto the head, and contact AO has its own ear ↔ head strength (default 0). No GLB change needed.
- Laute: decals show on the model mouth again.

## Still open for the lane
(a) 12-step edge check for LIDS-02 §2.5 (decides check 7) · (b) mouth-fit measurement on the GLB (signed distance card → skin 0…2·EPS).

## Gate for the lane
Deliver (a) and (b). Nothing merged; branch georg-doc-patch-3.
