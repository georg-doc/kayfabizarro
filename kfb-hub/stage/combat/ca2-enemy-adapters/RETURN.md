# CA2-03B · Return

Status: **BRANCH_VERIFIED · PUBLICATION NEXT**

## Result

The frozen five-state map now plays on all three exact actors with one mixer each and no Arena runtime ownership.

- Skeleton Warrior · Rig_Medium
- Orc Brute · Rig_Large
- Avian Swordsman · Rig_Medium comparison

State map:
- Skeleton: `Idle_A → Running_A → Melee_1H_Attack_Chop → Hit_A → Death_A`
- Orc: `Idle_A → Walking_A → Melee_Unarmed_Smash → Hit_A → Death_A`
- Avian: `Idle_A → Running_A → Melee_1H_Attack_Jump_Chop → Hit_A → Death_A`

Root/Hips position tracks are stripped in the playback harness. All actor world anchors remain stable across every frozen state sample.

## Branch evidence

Run `35493052845` · job `106031173581`: **109/109 PASS**.

- 3 actors, exactly one mixer each;
- exact state→clip map preserved;
- all 5 states sampled at deterministic 35% phase;
- finite skinned bounds;
- no collapse for any actor/state;
- stable root anchor for every actor/state;
- non-attack ground residual within gate;
- attack states do not penetrate the floor beyond tolerance;
- no failed resources or page errors.

Artifact `10599676961` · `sha256:8bc9e098a9439ace78c77da01c5f04fca63135e34fc4f2fa9d1ecb7a91a40233`.

## Boundary

No HP, damage, rewards, respawn, Arena mob state, Player, Gunfight or Large weapon alignment.

## Next gate

Publish this exact playback harness to the fixed Combat Stage and run the same 109-check proof publicly.
