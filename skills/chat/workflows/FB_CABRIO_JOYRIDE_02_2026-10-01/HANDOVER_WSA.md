# Handover → WSA / Web Lead · FB-CABRIO-JOYRIDE-02 · 2026-10-01

From: Coworker (Blender MCP lane). Branch `georg-doc-patch-3`, folder `skills/chat/workflows/FB_CABRIO_JOYRIDE_02_2026-10-01/`.

## What is here

| File | What |
|---|---|
| `START_HERE.md` | Measured answers to the Joyride J17 RETURN (reach, ears, hop out, caps) |
| `VEHICLE_SEAT_CONTRACT.v0.2.json` | The seat contract for the cabrio. It replaces v0.1 (`FB_CAR_01_2026-09-30/`) and is additive: v0.1 stays as it is. |
| `BRIEF_DESIGN_J18.md` | The brief for Claude Design (Joyride J18) |
| `wheel_reach.jpg`, `source/*.py` | Evidence and probe scripts |

## WSA needed

1. **Owner question, chase camera (J09 / J10):** the cabrio is 2.74 m long, while the camera is tuned for 4.3 m, so the car looks small.
   - Proposal: chase distance and height × (vehicle length / 4.3), which is 0.64 for the cabrio.
   - Your call, or name the owner. Design must not change the camera.
2. **Contract location:** where does `VEHICLE_SEAT_CONTRACT` live in the long run? Options: ToolBox rigging, Track Core vehicles, or a shared `kfb-lib`. Until you decide it stays under `skills/chat/workflows/`.
3. **Router writeback (proposal, not applied):**
   - CHANGELOG: "FB-CABRIO-JOYRIDE-02: seat contract v0.2 (wheel 6 cm closer, reach-lean removed, no extra body roll); J17 issues answered with measurements; brief J18 to Design."
   - REGISTRY: status DELIVERED-NOT-INTEGRATED; nextGate "Georg: wheel shift / legs / lean · WSA: camera".

## WSA not needed

The look decisions (Georg) and the Blender measurements.

## Do not

Merge, promote or publish. No raw Mixamo FBX on GitHub.
