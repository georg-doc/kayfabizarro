# R14 · Open harvest with finite hands

17 November 2026. Owner games/invisible-handshake; existing branch design/invisible-handshake-paper-r0-2026-11-17, draft PR475. Donor R13 at59a1bd0065f50f6bf1113fb95adba16aaa801da1. Parent builds and writes GitHub; mechanics_review independently inspects and checks. No runtime or Site changes.

## Frozen rule interpretation

Two to six active players, no NPCs. Fifty interchangeable narrative cards plus six faction cards outside the stock. Start one public card per player, three hand cards each, remaining stock50−4n; max hand6. Three shared emotion dice start at3, positions i modulo n. No chips, claims or holding interval. Position identifies the contributor, NOT exclusive access or scoring rights.

One action: adjust a die±1; reroll one die to1–6; move a die to a different occupied card; swap two dice on distinct occupied cards; draw ONE card; or play ONE hand card onto your own empty public slot. No automatic draw/refill; no overwriting, no flip, no recycling discards. Anyone may manipulate any active die. Only deterministic adjustment crosses0/7.

At7 the acting player wins the card underneath; at0 it is discarded without a trophy. Its contributor's slot becomes empty. Reset only the triggering die to3. ALL dice on the removed card move to remaining occupied cards, keeping other values. To instantiate the authorized actor choice, the simulation uses a uniform destination policy, independently per displaced die. This is not optimized placement. If no cards remain, dice wait centrally with their values until a play action places them on the new card.

Fixed24-round horizon, not complete-game victory or exhaustion. Every turn asserts exactly50 cards across stock, hands, board, trophies and discards, hands0–6, dice1–6 and no die on an empty slot. 200 seeds per5 counts ×6 policy configurations =6,000 games.

## Policies and pairing limits

Builder and waiter ALWAYS harvest a visible6 first. Otherwise both play onto an empty own slot if possible, or draw if that slot is empty and hand is empty. Builder then advances a highest active die by1. Waiter refuses deterministic5→6 and instead rerolls a lowest active die. Thus waiter is an opportunistic reroller, NOT a literal pass-only policy. Neither optimizes sabotage/redistribution or long-term rewards.

Random selects an available action CATEGORY uniformly, then a concrete action within it. Mixed chooses random30% of turns, otherwise builder at even seats and waiter at odd seats. Composition therefore changes with player count; it is not a faction-fairness test. Focal configurations: player0 waiter among builders, or builder among waiters. Starting actor rotates by seed modulo n. Setup positions remain fixed; do not claim full seat fairness.

Separate RNG streams for choices, reroll outcomes and redistribution. Outcome and redistribution draws occur every turn, but selection draws vary by policy; seeds are reproducible, NOT a fully paired counterfactual design. Focal comparisons describe fixed scripts, not optimal-strategy advantage. No uncertainty intervals.

## Telemetry

A die changing from below6 to6 is marked with creator, turn and source (adjust='prepare', reroll='reroll'). If later harvested while still6, count resolution, same-player return and immediately-next-turn return. Mark follows the DIE through moves, swaps or redistribution, not the narrative card. Leaving6 clears the mark; reroll6→6 retains it. Created-minus-resolved includes invalidated/censored states; it is not all live pending. Ratios are conditional on harvested marked dice.

Draw/play frequencies and stock exhaustion are reported. No real card effects, faction powers, diplomacy, meaningful emotion differences, secret objectives, strategic search, human enjoyment or full-game stopping criterion tested.
