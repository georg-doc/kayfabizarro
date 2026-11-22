# Chip-rule stress test · R10 concept only · 2026-11-17

Owner games/invisible-handshake; same design branch/PR475. No runtime/Site change. R09 is an older prototype, not implementation of FHH design. User requested bounded comparative tests, not new UI.

## Scope / reproducibility
`python3 test.py` writes results.json. 48,000 claim-topology runs plus2,000 exploratory attack-no-claim runs;400 seeds/configuration,12 rounds. These are NOT complete56-card games: infinite replacement supply and synthetic independent card modifiers intentionally isolate chip timing. No narrative compatibility, faction powers, human psychology, finite-deck exhaustion, win threshold or balanced card design. At6players a peaceful run can score66 cards, impossible with50 physical cards: interpret throughput only, not playable full-game totals. Last-round claims remain pending; the maximum for a player is11 collections. All chips unique perowner; claims=won+destroyed+pending; all dice remain1..6 asserted.

## Exact tested rules
Start dice3/3/3; one chip per board slot, one per actor. At turn start collect owned surviving chip's card, remove chip and refill slot. Choose target; play synthetic card (always draw replacement). Stable action overwrites slot, destroying any chip there. Boundary crossing discards played card, retains targeted boardcard/chip, resets each crossed die to3; other increments persist. At turn end claim an empty slot, preferring target. No available slot means no claim. A player's earlier claim always resolved before their action.

Layouts: three shared slots; max(3,humanplayers) shared slots; six positional home slots with six active actors (missing humans are random NPCs). Home position is a preference for builder policy, NOT ownership/protection. Attacks can target any slot. NPCs use identical chips/collection rules and can win cards. Human metrics exclude NPC trophies. All human seats occupy consecutive positions0..n−1: no seat-fairness inference.

Policies: build picks unclaimed/home slot; random selects any; mixed picks build/block50:50 independently perturn; block picks opponent claim whose owner acts soonest, otherwise random. These are behavioral stress scripts, NOT rational/optimal policies. Everyone can cooperate or grief indefinitely; no equilibrium claim.

Value-free: actor chooses a random in-range ±1 change on one die; a stable change is always available, so no backlash. Fixed:3 random vectors in hand from12 symmetric/simple vectors; builder/block choose randomly among stable options if available, random chooses blind. This toy distribution is NOT approved card values; actual50cards unknown. All three vectors follow Fear/Hope/Hate order.

## Core result: mean cards collected per human,12 rounds, free ±1
|Layout / behavior|2 humans|3|4|5|6|
|---|---:|---:|---:|---:|---:|
|Three slots, mixed|5.62|5.40|2.45|1.00|0.38|
|At least one slot/human, mixed|5.62|5.40|5.25|5.22|5.12|
|Six slots, random NPCs, mixed humans|3.88|3.87|4.03|4.66|5.12|
|Three/scaled slots, all block|0|0|0|0|0|
|Six slots/NPCs, humans block|2.38|1.84|1.14|0.30|0|

Random-only sixactors produce about4.4 cards/human at everycount. Peaceful build withenoughslots gives11, demonstrating how directly behavior determines outcomes.

Fixed modifiers do not cure lock: all-block three-slots 0.54,0.30,0.15,0.02,~0.00 perhuman; zero-score runs123,187,219,354,394 outof400. With max(3,n)slots mixed fixedhand roughly5.5 perhuman, butallblock0.54→0.09. Sixslots+randomNPCs mixed fixedhand4.35,4.25,4.49,5.17,5.46. Narrative/cards themselves untested.

## Minimal counterexample
Two players, any number ofslots: A plays/claims slotX; B overwritesX (stable), destroysA andclaimsX; A overwritesX, destroysB andclaimsX. Repeat indefinitely. No boundary intervention is forced because free ±1 always admits inwardmotion. Hence a legal infinite zero-score sequence exists, independent of sample size.

Exploratory rule “successful attacker cannot claim this turn”, tested ONLY sixslots/freevalues/blockhumans/randomNPCs: human mean0 for all2–6. At2/3 some NPCs scored; at4–6 everyrun scoredzero overall. This is not proof of universal failure underallpolicies, but disproves it as anti-lock guarantee. Two-player analogue: A claims; B destroys andcannotclaim; A claims; Bdestroys. A non-scoring attacker can always deny.

## Recommendation / unanswered design decision
Do not call claim timing solved or implement it in Site. Three slots suited only small exploratory play, not6. For shared slots use max(3,n) as simple scaling candidate; six positional slots is visualalternative, not protection. Full random NPC turns add4 automatic actions per2humanround (3x totalmoves), can consume finite deck and score offhuman preparation. Use optional NPC experiment, not default solution.

Value-free cards are feasible as media components. Freechoice ofanyinward±1 removes forced backlash and makes theme mechanically interchangeable; this is a real design tradeoff, not a free simplification. Need choose whether dice are deliberate discourse controls or constraints withpressure. Do not add a newrepair in this test. Any reliable anti-lock requires a cost, restricted attack, reward for conflict or changed capturetiming; that is a user-level core-loop decision. Next gate: select one meaningful restriction/reward to test, rather than conceal zero-scoring possibility withNPCrandomness.
