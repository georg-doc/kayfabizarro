# R15C · Six outer Narratives + Single-die occupancy · Static Verification
**2026-11-17 · owner:** `games/invisible-handshake/` · `georg-doc/kayfabizarro`, branch `design/invisible-handshake-paper-r0-2026-11-17`, Draft PR #475. **Status:** static geometry and finite-card arithmetic checked; gameplay/balance not tested.

## User-authorized correction
- At setup **six public outer narrative cards always**: n=2–6 human faction participants + (6−n) randomly revealed NPC faction narratives. The **one extra FOCUS** card at center is die-free. Temporary outer vacancies after removal are possible.
- **At most one shared Fear/Hope/Hate D6 per outer card**; three dice normally on three different occupied outer cards. MOVE targets an occupied die-free outer card; SWAP exchanges distinct die positions. Both meaningful and legal in two-player games because NPC narratives remain on the board.
- The prior R15B `two other dice on different slots` condition is automatically true in a normal legal three-placed-dice state, so it **cannot discriminate center activation**. Marked REJECTED.
- Historical R14 robot sim and R15B fixtures allowing two outer cards or stackable dice are **NOT** validation of the corrected layout.

## Reproducible static test
Source committed: [SIX_OUTER_SINGLE_DIE_STATIC_PROBE_R15C.js](SIX_OUTER_SINGLE_DIE_STATIC_PROBE_R15C.js). An **independent V8 enumeration** implementing its specified rules was executed in the conversation. The committed script was read back from GitHub but **not independently run as a checked-out Node process**; this distinction matters.

Six distinct seats with three distinguishable dice give **6×5×4 = 120** legal die-placement permutations, each enumerated for n=2,3,4,5,6 human-player counts:

| Check | Count verified |
|---|---:|
| Initial die placement and finite-card accounting | **600** |
| Legal MOVE into occupied die-free narrative | **5,400** |
| Legal SWAP between two different die-bearing cards | **1,800** |
| One outer-card collapse with resulting 50-card conservation | **600** |
| Legal triggering-die relocation among five surviving outer cards | **1,800** |
| Reserve rule when fewer than three outer cards occupied | checked as static example |
| Human games / full engine sim / measured turns | **0** |

Stocks by n participants and NPCs:
| Humans | NPC positions | Outer narrative cards | Center focus | Human hands (3 each) | Undrawn stock |
|---:|---:|---:|---:|---:|---:|
| 2 | 4 | 6 | 1 | 6 | **37** |
| 3 | 3 | 6 | 1 | 9 | **34** |
| 4 | 2 | 6 | 1 | 12 | **31** |
| 5 | 1 | 6 | 1 | 15 | **28** |
| 6 | 0 | 6 | 1 | 18 | **25** |

**Important limitations / next simulation gate**
- Tests verify six-card initial spatial invariants and card conservation for single-collapse cases only; they do not establish which faction owns NPC rewards or when NPC empty slots refill. These affect full-game economies and need an explicitly selected finite-deck policy.
- If an NPC plays autonomous turns, how often and using which choices is not specified by just revealing NPC narratives. No artificial actions were invented for this static test.
- After repeated collapses with fewer than three public outer cards, dice reserve behavior becomes necessary; physical reactivation timing is not yet validated.
- Actor vs contributor Focus payout, NPC as a contributor, chain reactions, 5→6 preparation incentive, enforced re-entry and denial at six seats, actual fun, full-game stopping rule and solo remain untested.
- Keep the original R14 `test.py` and R15B source/result intact as historical models. Build a separate receiving simulator only after NPC actions/refill and treatment of NPC Focus compensation are explicitly fixed.

**One next gate:** Choose one minimum NPC slot/refill/turn policy and NPC-contributor payout behavior, then run 2-player/4-NPC and 6-player/0-NPC **paired** tests of center collapse and entry gate with no die stacking. 2-player physical microtest next; Georg A/B/FAIL on strategic legibility. No Stage/live, merge or full deck production.
