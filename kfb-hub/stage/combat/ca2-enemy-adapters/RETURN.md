# CA2-03B · Return

Status: **PUBLIC_VERIFIED · HUMAN OPEN**

## Stage

https://kayfabizarro.pages.dev/kfb-hub/stage/combat/ca2-enemy-adapters/

## Result

The frozen five-state map plays publicly on all three exact actors:

- Skeleton Warrior · Rig_Medium
- Orc Brute · Rig_Large
- Avian Swordsman · Rig_Medium comparison

Each visible actor has exactly one mixer. Root/Hips position tracks are stripped from imported clips; actor world anchors remain unchanged across all deterministic state samples.

State map:
- Skeleton: `Idle_A → Running_A → Melee_1H_Attack_Chop → Hit_A → Death_A`
- Orc: `Idle_A → Walking_A → Melee_Unarmed_Smash → Hit_A → Death_A`
- Avian: `Idle_A → Running_A → Melee_1H_Attack_Jump_Chop → Hit_A → Death_A`

## Final evidence

Workflow `35493474052`:
- branch job `106032266047`: **109/109 PASS**
- public job `106032265920`: marker PASS · Combat Stage navigation PASS · playback module body PASS · **109/109 PASS**
- branch artifact `10600470645` · `sha256:0a9cb18451fa7af3f1e4e10e3c5d59e73f4fa0bc05e58761bdbb6db43ab38713`
- public artifact `10600420826` · `sha256:99bf8505d9cb9a499751b88a888fab9271ccb80ad1bbd277574e198c19a49578`
- 0 failed resources / 0 page errors.

Runtime candidate: `8e9b368305ca7ec76bdb9e4b4b89136ef527b2fe`.
Proofed publication: `cloudflare-live@3b21c3c4a4871fc5ac2834c05d4a63c006d5fc60`.

## Public-cache repair

The first public attempt proved the new SOURCE marker but timed out because the same-path `lab.mjs` could still be served as the older CA2-03A module. The Stage now uses a versioned module URL and the final public workflow explicitly verifies that the delivered JS contains the CA2-03B Playback API.

## Boundary

No Arena HP, damage, death/reward logic, respawn, Player, Gunfight or mob-slot ownership moved into this slice. No Large weapon alignment. Avian remains comparison-only.

## Next gate

**Georg visual state-playback review.** After human acceptance, return `ENEMY_PROFILES.json` + `ANIMATION_MAP.json` to WSA for integration inside the existing three-enemy Arena logic. Dungeon Raid remains a consumer after that integration gate.
