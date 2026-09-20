# KayKit Ranged Calibration v1 · CA2-02

Bounded ToolBox calibration Stage for the existing Combat Arena CA2 plan.

## Shows

1. the exact `Character_Gun.gltf` gun node in isolation;
2. FrizzleBob Driver Graft and GothGirl side-by-side on the exact Rig_Medium CombatRanged clips;
3. existing grip calibration, measured muzzle position/forward direction, exact clip inventory, release markers from the existing `fireTimes()` donor, and a measured technical recovery marker.

## Does not own

World movement, physics, target selection, projectile spawn, damage, rewards, audio, Arena save state or productive Combat integration.

## Current smallest sequence

`Ranged_1H_Aiming → Ranged_1H_Shoot → Ranged_1H_Aiming`.

The 2H and Bow clips remain visible inventory only. Locomotion retiming/phase optimization is intentionally deferred.
