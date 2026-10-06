# Seed World · Backlog · 2026-10-06 r2

## Look
- **Roofs look stripy** — `surface()` stripe 0.84 every second row + per-quad jitter; row count changes with LOD; probable shadow acne (no `normalBias`). See HANDOVER r2 §4.1.
- **Shadows jump at times** — sun follows the focus point without texel snapping; check correlation with chunk LOD swaps. See HANDOVER r2 §4.2.
- Hipped-roof shape shift on first hit · rubble teleport on demote · K2 clay material instead of clay_floor_001 stand-in.

## Verify
- Full T1–T13 run + bench A–E after the walk sprint → `TEST_REPORT.md`, `benchmark.json`.
- Georg top-level tab test → PASS / TUNE / FAIL.

## Integration slice → KFB Open World (WB2, PR #348)
- See `INTEGRATION_OPEN_WORLD.md` and `MODULE_CONTRACTS.json`. Wait for the Coworker return on PR #348 before any write there.
- Reconcile the mech ladder with `KFB_KAYKIT_LOCO_SET_01` (walk Walking_B 0.98, run 3.303, sprint 5.255, shared gait phase).
- Generator: `heightAt` injection, `overrides` (suppress/replace parcels), `zoneRecord`, `streetSplines`, `streetAnchor`.

## Gameplay (POC only)
- Walk on rooftops (via Open World support-surface resolver when integrated)
- Action bar slots 3–8 (Thermal Detonator, Barrel Roll …) — Combat Arena decision
- Minigun aim: one raycast per round → batch
- Triangle load 1.1–1.5 M (LOD0 window instances)

## Done in the walk sprint (2026-10-06)
Modes flight / walk / air · locomotion ladder · jump + double-Space take-off · hold-to-fire 1/2 · Tab combat camera · action bar · responsive UI · camera occlusion rule · armed upper body.
