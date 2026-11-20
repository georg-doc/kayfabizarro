# Holding-time comparison · Independent review

17 November 2026. Concept tests only; no production or supplied test-script edits by reviewer.

## Timing and accounting verdict

**PASS for the inspected timing/accounting contract.** The exact source order is:

1. Resolve the actor's move/value change.
2. Invalidate claims affected by replacement or lost eligibility.
3. Decrement only surviving OPPONENT claims.
4. Pay and clear those reaching zero.
5. Create the active actor's new claim at the full requested countdown.

Therefore a new claim cannot age or pay on its creation turn. A claim due on this opponent action is destroyed before payout if that action invalidates it. Returning to eligibility later does not resurrect it.

Independent fixtures executed the exact source tail on controlled states: k1 paid after one opponent action; k3 after exactly three; invalidation defeated a due payout; new claims retained their full k. One-seed full runs across all36 main configurations passed `claimed = cash + lost + pending`, dice bounds and the existing one-claim-per-player assertion. See `review-checks.json`. The reviewer did NOT rerun the whole batch.

For k≤n−1, a surviving old claim resolves before its owner's next action, so creating the next one does not overwrite an unresolved own claim. Arbitrary k≥n is not supported by this assertion and was not tested.

**Finite-horizon caveat:** paying after the final intervening opponent action is equivalent to paying just before the next own turn between actions, but not at a cutoff. At18 completed rounds, the first actor's last claim may already pay in the new model even though the old next-own-start test censored that payout. Do not compare old R11 numerical totals as if the endpoints were identical. The new within-script holding-time comparisons use a consistent endpoint.

## Pairing and scope

The separate roll, movement and setup RNG streams and fixed two movement draws per turn correctly keep the exogenous action-roll schedule paired across k variants for a given n/seed. Initial actor rotates by seed modulo n. This fixes the prior random-policy RNG-consumption comparison problem.

The model still has infinite replacement, generic emotion eligibility, no card semantics/powers, no finite deck, and scripted random/mixed/deny policies. It tests actual2–6 actors with n slots; it is not the earlier six-actor NPC setup. At n2 only k1 exists; at n3 k2 equals full-round. The loop correctly deduplicates these cases rather than manufacturing independent variants.

`denial_when_possible` counts actions that destroy at least one rival claim, divided by turns with some legal claim-destroying option. It does not count destroyed chips individually, and opportunity sets differ across holding lengths. Interpret as conditional behavior in the simulated state distribution, not a causal aggression trait.

The three-slots-per-player comparison keeps only three total shared dice, one chip/player, and selects the lowest-index eligible owned slot. More card positions do not automatically provide more scoring support; that allocation preference and dice scarcity remain limitations. No private hands or multiple simultaneous claims are added.

## Swap probe

Source inspection confirms swaps exchange LOCATION while each die retains VALUE and array identity. The exhaustive output covers46,656 position/value states ×3 die pairs =139,968 candidate swaps. It reports60,480 changed eligibility vectors and79,488 unchanged.

The candidate set includes23,328 same-location swaps, which are no-ops. The23,328 equal-value swaps overlap that category; these counts must not be added as disjoint causes. Generic eligibility ignores emotion identity, so an eligibility-neutral Fear/Hope swap may still change the narrative. The probe tests qualification only, not chip aging, score, strategic value or a complete game.

## Latest action-menu clarification

The holding batch still uses the earlier forced action-roll model: odd outcome selects a die relocation; even outcome chooses±1, including0/7 boundary reset. It does NOT simulate a new free menu of safe±1, uncertain reroll, reposition and swap. Reroll is absent, and swap is a separate exhaustive qualification probe only. Carry the holding comparison forward as conditional evidence; do not label it a balance test of the revised menu.

## Acceptance limit

No human timing, comprehension or enjoyment measured. No production promotion implied. Shorter holding may improve throughput, but must be assessed from the completed batch alongside denial and pending-claim effects; passing the off-by-one checks alone does not choose the best holding length.

## Completed batch review

Read the parent-produced `results.json`:36 main configurations ×200 seeds =7,200 runs, plus1,200 exploratory one-versus-three-owned-slot runs (8,400 total). No whole-batch rerun by reviewer.

For six actors under mixed policy, reducing k from5 to2 increases mean payouts/player from1.18 to3.21 over18 rounds, while the resolved-claim destruction rate falls from79.3% to46.9%. At k1, payouts reach4.59 and destruction27.1%. These figures support shorter holding as a throughput candidate under the tested prior action model; they do not establish human enjoyment or optimal strategy.

At six actors/k2/mixed, three slots per player yield3.36 versus3.21 with one. That small descriptive difference does not establish a meaningful benefit or justify the extra table complexity. No uncertainty interval or significance analysis was performed.

**Recommended interpretation:** k2 is a defensible intermediate candidate to discuss; k1 is the more permissive candidate. Present the tradeoff rather than declaring either balanced. Retain the revised-menu and finite-horizon caveats above before transferring this result to a new prototype.
