# R12 · Shorter claims and separate dice actions

17 November 2026. Owner: `games/invisible-handshake/`, draft PR 475. Concept tests only; no Site or runtime changes.

## Controlled comparison

Two to six active players, one public signature card each, no NPCs. Three shared Fear/Hope/Hate dice have a location and a value. A card qualifies with at least one die at 3–5 and no die at 1 or 6. One chip per player, placed at turn end. Losing eligibility destroys the claim permanently. Crossing 0 or 7 discards that card without a trophy, replaces it, and resets only the triggering die to 3.

The earlier action roll remains fixed: 1/3/5 relocates Fear/Hope/Hate; 2/4/6 changes the corresponding value by +1 or −1. Resolve the action and invalidate claims before aging surviving opponent claims and paying those due. Newly placed claims never age on their creation turn.

Compare a full round (n−1 opposing turns), two opposing turns capped at n−1, and one opposing turn. At two players these are identical; at three, two turns equals the full round. Payout after the last opposing action is equivalent between turns to payout at the next own turn, but differs at a finite simulation cutoff. Do not directly compare totals with R11.

Tests: 7,200 main runs, 200 seeds per configuration, 18 rounds, random/mixed/denial policies. Another 1,200 runs compare one versus three cards per player. Separate seeded streams and a fixed number of random draws pair action-roll schedules across holding variants. Starting seats rotate. Accounting and die bounds are asserted. Independent timing fixtures and source review passed.

## Results

Mean trophies per player in the mixed policy:

| Players | Full round | Two opposing turns, capped | One opposing turn |
|---|---:|---:|---:|
| 2 | 8.84 | 8.84 | 8.84 |
| 3 | 5.05 | 5.05 | 7.07 |
| 4 | 2.97 | 4.20 | 5.95 |
| 5 | 1.90 | 3.68 | 5.14 |
| 6 | 1.18 | 3.21 | 4.59 |

At six players, destroyed claims as a share of resolved claims fall from 79.3% to 46.9% to 27.1%. Pending claims are excluded. Under the denial heuristic, the corresponding losses are 87.3%, 55.5%, 32.4%, with trophies of 0.83, 3.20, 5.24 per player. No table ended entirely scoreless in the 200 six-player denial runs at either shorter hold; one did at full-round holding. This does not prove deadlocks impossible.

**Next paper-test candidate:** survive the next two opposing turns, or until your own return if earlier. It improves throughput while retaining substantial counterplay. Physical countdown handling still needs a human test. One-turn holding gives only the next seat a direct response before payout; seating effects are not quantified.

## Three public cards per faction

With the same two-turn hold and mixed policy, trophies change from 8.84 to 9.57 at two players, 4.20 to 4.35 at four, and 3.21 to 3.36 at six. Extra slots allow extreme dice to be parked away from a claimed card. Six-player claim destruction changes from 46.9% to 48.4%.

These modest descriptive gains do not yet justify tripling the layout. There are still only three shared dice and one chip per faction. Eighteen public cards plus eighteen hand cards and six factions would occupy 42 of the 56 cards before trophies and discards; that finite-deck constraint is not modeled.

## Distinct action options

- **Adjust:** safely choose +1 OR −1. The outcome is known, including any deliberate boundary crossing.
- **Reroll:** replace a value with a fresh D6 result. It may rise or fall. It cannot itself produce 0 or 7, but 1 or 6 can invalidate a claim.
- **Move:** relocate one emotion die, preserving its value.
- **Swap:** exchange two dice's locations, preserving their identities and values.

The holding-time batch does not test this free-choice menu. Start by testing one action per turn; allowing all actions in sequence would require a new comparison.

A separate exhaustive swap probe covers 46,656 position/value states and 139,968 pair swaps. Eligibility changes in 60,480 cases (43.2%). The total includes 23,328 same-location no-ops, which should not be offered as actions. Equal-value swaps overlap this category; do not add the counts.

Example: Hope 5 on A and Hate 1 on B swap locations; A loses eligibility and B may gain it. Hope 4 swapped with Hate 4 changes the narrative but not generic eligibility. Emotion-specific faction goals remain untested.

## Evidence boundary and next gate

Infinite replacement cards; no actual hand semantics, finite 50-card deck, faction powers, optimal strategies, or human comprehension/enjoyment measured. These are throughput stress tests, not proof of a balanced game. Keep one signature card per faction for the next paper test. Validate the two-turn countdown and then compare the separate action choices before changing the prototype. The existing Site does not implement this FHH concept.
