# R15 proposed mandatory entry & central FOCUS · Static fixture results
**2026-11-17 · not R14 accepted, not full game simulations.** Owner `games/invisible-handshake/`, branch `design/invisible-handshake-paper-r0-2026-11-17`, PR #475. Source [design proposal](CENTRAL_FOCUS_ENTRY_GATE_R15_PROPOSAL_2026-11-17.md). Independent hand-constructed JavaScript fixture reader in ChatGPT session, not an imported R14 simulator run.

## Actually evaluated
Test state has n=2..6, 50 finite interchangeable narrative cards, three in each player's hand, one on each active player's outer position, one in the centre, six faction cards outside deck. Every test asserts:
`stock + sum(hands) + occupied outer slots + (focus present ? 1 : 0) + trophies + discard = 50`.
- For each n, setup conservation, Variant A unchanged, Variant B capture and instant centre refill, Variant B burn and instant centre refill, outer narrative capture, forced entry action PLAY, and conservation after actual PLAY: **7 assertions × 5 sizes = 35**.
- Also checked no-hand gate with stock remaining returns only DRAW, no-hand+empty-stock returns no legal move (unresolved), plus independently consistent terminal exhausted fixture: **3 assertions**.
- Total **38/38 fixture assertions pass**. **No movement/swap algorithm, six-round timing, endgame, card-effects or human play was simulated.**

| Participants | Start stock (with centre) | After B centre capture or burn+refill | After outer card capture + immediate PLAY |
|---:|---:|---:|---:|
| 2 | 41 | 40 | 41 |
| 3 | 37 | 36 | 37 |
| 4 | 33 | 32 | 33 |
| 5 | 29 | 28 | 29 |
| 6 | 25 | 24 | 25 |

**Important:** A/B currently both change the R14 opening from `50−4n` to `49−4n` because the neutral centre uses a real card. The B exception automatically draws for **centre only**; an outer slot still requires its contributor's one-turn PLAY re-entry. No new cards created.

## Source-level correction to previous diagnosis
The R14 test's `options(s,p)` function presently offers dice manipulation regardless of whether `board[p]` is occupied, and R14 builder/waiter policies *choose* to replenish own empty positions as part of a heuristic. Georg's requirement is **a new legal-action gate**, not merely a statement that old simulations already tested compulsory participation. Earlier statements describing the supply as a purely voluntary unmotivated donation were incomplete. However the gate increases the punitive impact of attacks on an outer player's slot and does **not** repair the 5→6 immediate-next-player harvest imbalance.

## Explicit unknowns and single gate
- Loss of own card may repeatedly force one seat into PLAY/DRAW, especially at 5–6 people. Need targeted policy/seat fairness simulation before claiming gate balanced.
- Variant B may dominate because central card replenishes for free, effectively becoming a trophy generator; baseline R14 has no automatic replenishment.
- Focus/meaning of centre and Show/Spin/Sell have not been tested for human comprehension.
- When own slot empty AND hand empty AND stock0, re-entry impossible. A finite game-end or recovery condition remains **undefined**, do not silently give one player a free card.
- **Next gate:** A/B microtest at 2 players first, then 6-seat stress on entry denial, centre harvest rate and 5→6 gift. Georg chooses A/B/FAIL. Secret missions, solo/NPCs, fractal stage effects and art not authorized.

No Site/Cloudflare Stage, KFB Hub live tile, full deck, independent critiquing acceptance, or R15 game runtime here.
