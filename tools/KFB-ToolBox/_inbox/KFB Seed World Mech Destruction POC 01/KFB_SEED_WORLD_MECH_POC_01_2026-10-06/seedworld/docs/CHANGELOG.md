# CHANGELOG · Seed World POC 01
Additive. Newest at the bottom.

## 2026-10-05 · r1
- Generator (`sw-gen.js`): seed paths after the World Kernel convention; 5 settlement types chosen per seed; terrain bands; settlements per 700 m cell; warped street grid with primaries leaving town; blocks (square / yard / built); parcels with party walls and corner street sides; BuildingRecipes with donor façade numbers; vegetation; chunk recipes.
- Geometry (`sw-mesh.js`): one deformation field; LOD0–3 shells; gable / hip / flat + parapet / shed / sawtooth roofs; ledges; instanced windows, doors, chimneys, trunks, crowns; destruction cells with support links; deterministic rubble; damaged compile.
- Streaming (`sw-world.js`): shared clay material; 121 recycled chunk slots in 4 LOD rings; module worker → Blob worker → main-thread fallback; integration ≤ 3 per frame under a 4 ms budget; hide/show of promoted buildings inside compiled chunks; raycast, collision, ground.
- Destruction (`sw-destruct.js`): promotion cap 4; Minigun and rocket damage; support score + cluster delay; fixed debris / rubble / VFX pools; 2-bit damage state; demotion through recompile.
- Mech (`sw-mech.js`): sources A (Flight Family 01) and B (Atlas CombatMech.glb + Jump_Idle / Running_HoldingRifle); real Minigun with barrel spin; straight or homing rockets; impulses; chase camera with collision.
- App (`sw-app.js`): F1 metrics, source gates 1–6, checks T1–T12, bench A–E, pumped stepping for background tabs, shader warm-up.
- Fixes during testing: shadowed `height()` in the recipe; rAF watchdog for hidden frames; camera pulled into the mech in narrow streets; dust and flash too heavy; clay microtexture too strong; promotion cap could be exceeded by a re-hit demoting building.

## 2026-10-05/06 · r2 · review rounds (from HANDOVER r1)
- Roads as ribbon meshes in warped local space (`sw-mesh.js › roads()`); terrain vertex colours no longer carry road colour.
- WoW-style controls: facing separate from camera, A/D turn (smoothed), Q/E strafe, LMB orbit, RMB steer, LMB+RMB run, wheel zoom.
- Stuck-input guards (focus loss, Meta key, `e.buttons`, 250 px jump filter).
- New `sw-fx.js`: tracers, muzzle cones, rocket exhaust, sparks, brass, muzzle light, barrel heat; fixed pools, one draw call per family.
- Chase camera rigid in the mech frame; only the boom length is smoothed.

## 2026-10-06 · r3 · walk sprint
- Modes `flight | walk | air` in `sw-mech.js`: air Space/↑ climb, ↓ descend, ground contact → walk; ground Space jump, Space×2 (≤ 0.3 s) or ↑ take-off.
- KayKit locomotion ladder (Rig_Medium @ b97b5ac5, FrizzleBob consumer profile): idle / walk / run / sprint / back / strafe / jump chain, fades from the profile, speed = native × body scale.
- Weapons on hold-to-fire action keys (1 Minigun, 2 Rockets); Tab combat camera (mouse-look, LMB/RMB fire).
- Action bar shows occupied slots only.
- Armed walking: upper body from Running_HoldingRifle (chest subtree); Minigun aligned along its barrel axis to the crosshair; blended on land/take-off.
- Camera: on occlusion the boom shortens instead of rising, minimum 70 % length; narrow-street cases handled.
- UI rebuilt responsive: full-window 3D, menu top left (Mech / Welt / Diagnose), help on ? or H key, metrics off by default (F1), Checks / Bench / Sources as a side panel; in play only mode + speed and the action bar.
- T13 (locomotion) added; reworked three times, now walks 8 headings and uses the longest run so building edges near the test spot do not block it.

## 2026-10-06 · r3.1 · cleanup + handover
- Removed dead code (`sim` stub in `sw-mech.js`, empty loop in bench D in `sw-app.js`).
- Standalone path: generated `sw-bundle.js` (modules as blob URLs); the DC uses it only when `<meta name="sw-bundle">` is present. Normal loading unchanged.
- Docs: `HANDOVER_2026-10-06_r2.md`, `INTEGRATION_OPEN_WORLD.md`, `MODULE_CONTRACTS.json`; START_HERE, BACKLOG, TEST_REPORT, ARCHITECTURE updated; r1 handover marked as superseded.
