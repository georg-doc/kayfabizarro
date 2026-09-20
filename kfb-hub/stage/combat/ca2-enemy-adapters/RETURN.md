# CA2-03A · Return

Status: **PUBLIC_VERIFIED · STATE PLAYBACK NEXT**

## Public Stage

https://kayfabizarro.pages.dev/kfb-hub/stage/combat/ca2-enemy-adapters/

## Result

Exact source objects and exact animation libraries are verified for:
- Skeleton Warrior · Rig_Medium;
- Orc Brute · Rig_Large;
- Avian Swordsman · Rig_Medium comparison candidate.

Measured rest heights: Skeleton `2.59046`, Orc `4.19439`, Avian `2.32418`. All have 23 bones. Orc stays native Large scale; no Medium normalization.

Frozen first state map:
- Skeleton: `Idle_A → Running_A → Melee_1H_Attack_Chop → Hit_A → Death_A`
- Orc: `Idle_A → Walking_A → Melee_Unarmed_Smash → Hit_A → Death_A`
- Avian comparison: `Idle_A → Running_A → Melee_1H_Attack_Jump_Chop → Hit_A → Death_A`

## Evidence

Workflow `35492632529`:
- branch job `106030073603`: **32/32 PASS**;
- public job `106030073584`: marker PASS · Combat Web Stage navigation PASS · **32/32 PASS**;
- branch artifact `10599840995`;
- public artifact `10600125047`;
- zero failed resources / page errors in both browser proofs.

Proofed publication: `cloudflare-live@b11d87ac8f12e30b4098aafcc412fc41018369e6`.

## Boundary

No Arena mob slots, HP, damage, rewards, respawn, Player or Gunfight files changed. No Large weapon alignment. Rogue ranged remains HOLD.

## Next gate

**CA2-03B:** play the frozen five-state map on Skeleton Warrior + Orc Brute, with Avian as comparison. Verify deformation, grounding, one mixer per actor and state transitions. Still no Arena combat ownership.
