# CA2-03A · Return

Status: **SOURCE / CLIP ENUMERATION VERIFIED · STATE PLAYBACK NEXT**

## Result

Three exact resident/enemy actors are source-proven without Arena integration:
- Skeleton Warrior · Rig_Medium;
- Orc Brute · Rig_Large;
- Avian Swordsman · Rig_Medium comparison candidate.

The Large tier is not a scaled Medium substitute: Orc Brute stays at source scale and uses only Rig_Large libraries.

## Frozen first state map

- Skeleton Warrior: `Idle_A → Running_A → Melee_1H_Attack_Chop → Hit_A → Death_A`.
- Orc Brute: `Idle_A → Walking_A → Melee_Unarmed_Smash → Hit_A → Death_A`.
- Avian comparison: `Idle_A → Running_A → Melee_1H_Attack_Jump_Chop → Hit_A → Death_A`.

These are exact names from the browser-enumerated libraries. They are adapter candidates, not Arena state owners.

## Evidence

Run/job `35492453999 / 106029613333`: **32/32 PASS**. Artifact `10599820951`.

## Next gate

CA2-03B: play the frozen five-state map on Skeleton Warrior + Orc Brute and use Avian as side-by-side comparison. Verify deformation, grounding, one mixer each and state transitions. Still no HP/damage/rewards or Arena mob runtime.
