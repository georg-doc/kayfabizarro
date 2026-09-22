# CA2 browser state sequence

Status: **R2 LOCAL BROWSER PASS · MINIMUM WARRIOR LOOP COMPLETE · MAGE HOLD · PUBLICATION PENDING**

This file records the required human/browser proof sequence. It is not a substitute for screenshots or browser telemetry.

| Step | Required visible proof | Current evidence |
| --- | --- | --- |
| 1 | FrizzleBob Driver Graft spawns with face/eyes and weapon attachment | **PASS** · outer graft owns rig + mouth; 2 eye actors / 8 visible eye meshes; gun visible. Inner legacy warnings are diagnosed, not missing outer ownership. |
| 2 | Idle uses the admitted Idle clip | **PASS** · browser telemetry reports `Idle` |
| 3 | Ground movement transitions to Walk/Run while Player.v2 remains the ground writer | **PARTIAL** · real keyboard Walk probes move the player and return to `Idle`; sustained Run capture remains open. |
| 4 | Shoot uses graft muzzle anchor and returns to locomotion | **PASS** · `Idle_Gun -> Idle_Shoot -> release`, marker `0.0417 s`, release `0.0533 s`, existing graft muzzle. |
| 5 | Hit reaction plays without duplicate player mixer | **PASS FOR MVP LOOP** · three real actor clicks register three hits; existing single Driver mixer remains owner. |
| 6 | Death/respawn restores actor, eyes, weapon and muzzle attachment once | **PASS FOR NEXT-CARD RESPAWN** · clear then `Next card` returns HP 100/phase play and a fresh Warrior. |
| 7 | Skeleton Warrior spawns, moves, attacks, hits and defeats through MobBrain | **PASS** · HP `3 -> 2 -> 1 -> 0`, one kill. |
| 8 | Skeleton Mage spawns, moves, attacks, hits and defeats through MobBrain | **HOLD / NON-CRITICAL** · retained in catalog as `C_MVP_MAGE_ADAPTER`, excluded from MVP pool. |
| 9 | Run rewards/flow complete with existing Arena ownership | **PASS** · 1 reward die, 1 Pop, 1 skull, 3 coin drops, visible Card/Floor clear. |
| 10 | Narrow viewport remains usable and readable | **PASS** · `390 × 844`, controls readable, application errors 0. |

Additional gates:

- Audio: **PASS** · 22/22 loaded, 0 missing, 2,931,032 bytes, unmuted after gesture.
- Page/console errors: **PASS WITH WARNINGS** · app errors 0, console errors 0, two shader-sigma warnings.
- Performance: repaired package reached play in about 8 s and showed about 70 render calls at desktop size. Public comparison remains pending because the failing candidate was not published.

Current evidence: `C_MVP_A_R2_CORE_LOOP_2026-09-22.md`.

## Capture requirements

- Use the direct Cloudflare Stage route only after the exact revision is present.
- Capture at least one frame for steps 1–9 plus one narrow-viewport frame.
- Record console/page errors, failed assets and attachment/mixer duplication symptoms.
- Record before/after performance values on the same browser/device profile.
- Georg freeplay/visual acceptance remains a separate final gate.
