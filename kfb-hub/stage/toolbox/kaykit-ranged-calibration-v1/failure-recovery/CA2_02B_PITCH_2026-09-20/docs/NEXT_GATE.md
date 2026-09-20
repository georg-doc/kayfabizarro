# NEXT GATE · frozen-Aim external gizmo calibration

Exactly one gate:

1. same exact `Character_Gun.gltf`;
2. same Rig_Medium `handslotr`;
3. freeze `Ranged_1H_Aiming` at one explicit action time/normalized phase;
4. lock position offsets, scale, muzzle derivation and release timing;
5. use Georg's external/universal 3D gizmo to rotate the gun;
6. show live world muzzle pitch;
7. visually align gun as forearm extension / approximately horizontal;
8. export one transform into `WEAPON_PROFILES.json`;
9. rerun one Aim → Release-frame browser proof.

Do not integrate the gizmo into this failed slice; consume its exported transform.
