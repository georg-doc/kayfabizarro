# FHH chip-rule stress test · Independent review

17 November 2026. Conceptual rule analysis only. No production implementation or test-script edits by the reviewer.

## Verdict

**The script supports a bounded claim-topology stress-test result, not full-game balance.** Scaling slots removes the purely cooperative occupancy shortage. It does not remove deliberate denial. The proposed **attack-no-claim variant fails to break the zero-scoring cycle** and is worse for the tested human blockers when random NPCs are present.

No stable/fun/balanced human-game claim follows. Preserve this as a rejected or unresolved candidate, not a validated fix.

## Execution and conservation

The reviewer reran the supplied `test.py` successfully:48,000 main simulations plus2,000 variant simulations,400 seeds per scenario,12 rounds. The main matrix is3 layouts ×2 move models ×4 policies ×5 human counts ×400 seeds. The variant is deliberately only the six-actor/free-move/block-policy case.

Each run asserts at most one live chip per actor and all die values within1–6. The main matrix additionally asserts:

`claims = cashed + overwritten + still_pending`.

The reviewer independently checked that accounting identity for all2,000 attack-no-claim runs too. This is **chip accounting**, not conservation of a finite56-card deck. The synthetic hand draws replacement vectors with repetition from an unlimited source. With six cooperative actors this produces66 collections, exceeding the proposed50 physical play cards; these are throughput counts, not realizable full-deck scores.

Independent deterministic checks reproduced the seed0 six-blocker loop below and verified repeatability and the scaled-build upper bound11 cashouts per human for2–6 humans. The code was not modified.

## What the implementation actually models

- Layout `three`:3 shared claim slots, exactly n human actors.
- Layout `scaled`:max(3,n) shared slots, exactly n human actors.
- Layout `six`:6 shared slots and6 full-turn actors; actors beyond n use random policy.
- One actor acts at a time in fixed order. Their surviving chip cashes at the START of their next turn. An end-of-turn claim must survive every intervening actor.
- `build` prefers an empty own-index slot, then an empty random slot. `block` targets an occupied opponent slot whose owner is due earliest. `mixed` randomly switches between these modes; `random` ignores occupancy strategy.
- `free` chooses a random legal single-die ±1 move. Bust is impossible by construction.
- `fixed` uses a synthetic three-card hand drawn from12 vectors. Non-random policies pick a legal card when available; random policy can choose a bust despite legal alternatives. A played hand card is discarded/refilled on every attempt.
- Bust resets only out-of-range dice to3 and keeps the target board claim intact. This matches the integrator's clarification: **the existing board card/chip is retained, not the played hand card**. Actual board-card identities are absent; target-chip survival is the modeled consequence.
- On a bust, claiming another empty slot remains possible. This is not a successful overwrite and does not gain the attacked chip, but it is still a new separate claim. If a later full ruleset forbids claiming after a bust, this test must change.
- The attack-no-claim flag applies only after a SUCCESSFUL attack on a slot that was occupied by an opponent when targeting began. It clears that chip and prevents a new claim anywhere that turn. A bust keeps the chip and does not trigger that restriction.

## Relevant results

Free-move mean cashouts per human across12 turns:

|Scenario|2 humans|3|4|5|6|
|---|---:|---:|---:|---:|---:|
|3 shared slots, build|11.00|11.00|5.52|3.09|1.87|
|Scaled slots, build|11.00|11.00|11.00|11.00|11.00|
|3 or scaled slots, all block|0|0|0|0|0|
|6 actors/slots, humans block; NPCs random|2.38|1.84|1.14|0.30|0.00|
|Same6-actor case, attack-no-claim|0|0|0|0|0|

At six humans, both six/scaled layouts have no NPCs. Adding empty slots alone cannot save a claim when the next actor deliberately removes it.

`zero_games` is **zero cashouts across ALL actors**, including NPCs. For the no-claim variant,22/400 total-zero games at2 humans and55/400 at3 humans do NOT show human progress: mean HUMAN cashouts remain0; NPCs can score. At4–6 humans, all400 variant games have no cashouts at all.

## Explicit zero-scoring cycle

Six actors, six slots, free legal moves, all `block`, seed0:

- Baseline: actor1 claims a slot; actor2 overwrites it and claims; actor3 overwrites that claim; and so on. Before any owner returns, their chip is gone. Over72 turns:72 claims,71 overwritten,1 pending,0 cashed.
- Attack-no-claim: actor1 claims; actor2 removes it and places nothing; actor3 sees no occupied slot and claims; actor4 removes it without claiming. The two-turn construction/destruction pattern repeats. Over72 turns:36 claims,36 overwritten,0 pending,0 cashed.

Removing the attacker's replacement reward changes the shape of the cycle, not the availability of cost-free denial. It cannot be accepted as the remedy on this evidence. A subsequent conceptual test would need to limit denial itself, create a protected scoring opportunity, or change payout timing; none of those alternatives is implemented or validated here.

## Interpretation limits

1. This is not a strategic-equilibrium analysis. Pure blockers maximize denial, not their own score; the result demonstrates a possible legal stall, not that rational or human players inevitably choose it.
2. Fixed turn order and first-n-human assignment are not rotated. Comparisons with NPCs confound human count, policy composition and the number of intervening actors.
3. The12-turn horizon censors final claims: their next payout opportunity occurs outside the run. Maximum observed cooperative payout is11, not12. Pending claims remain in the accounting; survival uses cashed/(cashed+overwritten), excluding pending claims.
4. Claims are ownership-only markers. No card motives, special powers, finite decks, narrative objectives, diplomacy, role asymmetry or decision time are modeled.
5. Free and fixed moves have different risk-selection rules. Non-random policies actively avoid fixed-hand busts where possible; random policies do not. Any difference cannot be attributed solely to card constraints.
6. The attack-no-claim variant is tested only in the named six/free/block scenario; do not generalize it to other layouts or fixed hands without further tests. It already fails its intended minimal-lock remedy in the tested case.
7. Dice values affect legality/bust, but not target desirability or thematic position. Therefore this is a topology and payout stress test, not evidence for the complete Fear/Hope/Hate mechanism.

## Recommended disposition

**KEEP** scaled occupancy as an optional count-scaling candidate; it fixes the measured cooperative slot bottleneck.

**REJECT AS A LOCK FIX** attack-no-claim in its tested form. Keep the result and explicit counterexample so it is not reintroduced as a presumed cure.

**NEXT QUESTION:** What is the smallest rule that guarantees a meaningful scoring opportunity without eliminating the pleasure of interference? Test one explicit change against this same adversarial cycle before building it. Human play remains the later acceptance gate.

Reviewed script SHA-256: `47c7f6a996088d71f2a484fe4f934d257058695ef334ea6204d7c8058f98e613`. Results SHA-256: `804060cb3cdd4d73dd58ae4d8ae31d38e463ac800dd141cad64a76719d0dc677`.
