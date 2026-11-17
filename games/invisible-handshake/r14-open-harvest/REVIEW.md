# R14 open harvest · Independent review

17 November 2026. Concept/state model only. No production, supplied script or GitHub edits by reviewer.

## Contract verdict

**PASS for the inspected finite-count accounting and transition rules.** Nine independent fixture groups include30 narrow six-round runs. Every crafted applied action was first checked against `options`; the reviewer did not rerun the6,000-run main batch. See `review-checks.json` for exact source hash.

- The actor causing6→7 wins the current public card, regardless of whose slot it occupies. The triggering die resets to3.
-1→0 discards the card without awarding a trophy; only the triggering die resets.
- All dice on the removed card relocate uniformly and independently to remaining occupied slots; their other values are retained. Co-location is possible.
- If the last card disappears, dice become unplaced. A legal own-slot play restores all unplaced dice to that slot without changing their values.
- Play consumes one hand card and is offered only for the player's vacant slot. Draw consumes one stock card, raises the hand by one and stops at6. These are full actions; no boundary adjustment is appended.
- Finite accounting is asserted after transitions: stock + hands + occupied slots + trophies + discards =50. This conserves counts, not individual identities; cards have no differentiated effects in the model.
- No chip or holding countdown remains. Exhausted stock/hands can leave no legal action; the fixed-horizon simulation then records passes rather than inventing cards.

The apply function itself does not reject arbitrary illegal caller inputs. Its game loop uses the legal generator; fixtures did likewise. This is acceptable for the bounded script but not a production input-validation claim.

## Preparation telemetry

`created.prepare` records an ADJUST5→6. `created.reroll` records a reroll from a non6 value to6. Rerolling an existing6 to6 keeps the original attribution; leaving6 clears it. Independent fixtures verified both cases.

The marker belongs to the **die**, not to a particular public card. It follows that die through moves/swaps, card removal/redistribution and potentially a no-board interval. A later harvest can therefore concern a different card than the original preparation.

`self_return / resolved` is conditional on preparations eventually harvested while still marked. `self_return / created` has a different denominator and includes invalidated or horizon-censored preparations. Do not mix them. `next_return` means the next global turn, not merely the next action that happens to resolve that die.

## Completed batch interpretation

Read all30 result rows:2–6 actors ×6 policy configurations ×200 seeds =6,000 runs,24 rounds. No whole-batch rerun by reviewer.

Across the four wholly deliberate profiles (builder, waiter and both focal variants),44,242 ADJUST5→6 preparations were created;43,839 were later harvested. All43,839 went to the next actor, and zero returned to the preparer. This is a useful visible consequence of the scripted priorities, **not an independently discovered optimal-play theorem**: every deliberate policy explicitly takes an available6→7 before doing anything else. The result exposes the preparation gift built into that rule/policy combination.

All-builder throughput is roughly4.5 trophies/player over24 turns; all-waiter roughly3.0. This does not make builder individually dominant. A lone builder among waiters earns1.85 trophies at2 actors versus6.97 for its opponent; at6 actors it earns2.87 versus4.34 for the others. Conversely, a lone waiter is not universally favored: at6 actors its4.33 is below the other builders'4.56. Turn order, policy composition, replenishment and random relocation matter.

Random profiles score only about0.3 per player and can have whole-table zero games. Mixed policies are also heuristics, not measurements of actual social play. The script does not establish equilibrium, optimality or human enjoyment.

## Legal non-scoring cycle

An independent fixture starts two public cards and all three dice at3. The actors repeatedly move the same die between the two occupied slots. After20 legal actions the original board/dice state returns, with stock/hands unchanged and zero trophies. The cycle can repeat indefinitely.

Thus the rules allow **voluntary non-progress**; they do not force every legal sequence to harvest. This is different from a forced no-move deadlock. No claim is made that players seeking a win will necessarily choose it.

## Limits and disposition

- Uniform redistribution is a policy/geometry simplification, not a tested choice of recipients or a strategic placement system.
- Refilling a vacant own slot (or drawing for that purpose) is hardcoded before shared-die preparation in deliberate policies. This is not proven rational: the replenisher spends an action supplying a public harvest opportunity. Strategic refusal to replenish or compensation for that contribution is not modeled.
- Die locations start deterministically; the first actor rotates by seed. No exhaustive seat-fairness analysis was performed.
- Card identities, narrative meanings, faction effects and secret goals are absent. The per-emotion harvest counter does not mean secret-goal play was tested.
- The24-round cutoff is not a fully specified endgame, finite-deck victory threshold or human session duration.
- Multiple dice can become free future harvest opportunities after relocation; preparation marks track the die rather than new-card identity.
- Known deterministic±1 includes deliberate overflow; reroll itself only yields1–6.

**Keep open harvest as a distinct concept candidate:** it eliminates fragile claim waiting and provides immediate, visible scoring. **Do not call the preparation incentive solved:**5→6 can hand the reward to the next actor under natural greedy priorities. Secret objectives may create other reasons to prepare or redirect, but remain a separate, untested proposal requiring explicit objectives and payoffs before comparison. No production promotion follows from this review.
