# CA2 browser state sequence

Status: **R1 RECHECKED · FINITE ACTORS PASS · RELEASE/TARGETING FAIL · NOT PUBLISHED**

This file records the required human/browser proof sequence. It is not a substitute for screenshots or browser telemetry.

| Step | Required visible proof | Current evidence |
| --- | --- | --- |
| 1 | FrizzleBob Driver Graft spawns with face/eyes and weapon attachment | **PASS** · outer graft owns rig + mouth; 2 eye actors / 8 visible eye meshes; gun visible. Inner legacy warnings are diagnosed, not missing outer ownership. |
| 2 | Idle uses the admitted Idle clip | **PASS** · browser telemetry reports `Idle` |
| 3 | Ground movement transitions to Walk/Run while Player.v2 remains the ground writer | **PARTIAL** · real keyboard Walk probes move the player and return to `Idle`; sustained Run capture remains open. |
| 4 | Shoot uses graft muzzle anchor and returns to locomotion | **FAIL / R2** · target click enters `Idle_Gun`, reports weapon not ready, records no release, then returns to `Idle`. |
| 5 | Hit reaction plays without duplicate player mixer | **BLOCKED BY RELEASE/TARGETING** |
| 6 | Death/respawn restores actor, eyes, weapon and muzzle attachment once | **BLOCKED BY RELEASE/TARGETING** |
| 7 | Skeleton Warrior spawns, moves, attacks, hits and defeats through MobBrain | **PARTIAL** · finite source bounds/scale/position pass alone and with Mage; defeat is blocked by release. |
| 8 | Skeleton Mage spawns, moves, attacks, hits and defeats through MobBrain | **PARTIAL** · finite source bounds/scale/position pass alone and with Warrior; defeat is blocked by release. |
| 9 | Run rewards/flow complete with existing Arena ownership | **BLOCKED** · 0 shots, 0 hits, 0 kills after real target clicks. |
| 10 | Narrow viewport remains usable and readable | **PASS** · `390 × 844`, controls readable, application errors 0. |

Additional gates:

- Audio: **PASS** · 22/22 loaded, 0 missing, 2,931,032 bytes, unmuted after gesture.
- Page/console errors: **PASS WITH WARNINGS** · app errors 0, console errors 0, two shader-sigma warnings.
- Performance: repaired package reached play in about 8 s and showed about 70 render calls at desktop size. Public comparison remains pending because the failing candidate was not published.

Current evidence: `C_MVP_A_R1_BROWSER_REPAIR_2026-09-22.md`.

## Capture requirements

- Use the direct Cloudflare Stage route only after the exact revision is present.
- Capture at least one frame for steps 1–9 plus one narrow-viewport frame.
- Record console/page errors, failed assets and attachment/mixer duplication symptoms.
- Record before/after performance values on the same browser/device profile.
- Georg freeplay/visual acceptance remains a separate final gate.
