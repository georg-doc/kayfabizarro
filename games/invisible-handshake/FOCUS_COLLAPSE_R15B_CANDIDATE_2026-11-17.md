# The Invisible Handshake · R15B · FOCUS release through outer-die collapse
2026-11-17 · CANDIDATE ONLY, NOT R14 RULES / NOT HUMAN-TESTED. Owner `games/invisible-handshake/`, branch `design/invisible-handshake-paper-r0-2026-11-17`, Draft PR #475.
Source: [CURRENT_STATE](CURRENT_STATE.md), [R14 METHOD](r14-open-harvest/METHOD.md), [older R15 proposal](CENTRAL_FOCUS_ENTRY_GATE_R15_PROPOSAL_2026-11-17.md). Georg **rejects previous R15 option B in which a die occupies the center directly**. Do not silently keep that rule.

## Direction / constraints
- Six faction narrative slots in a **tabletop six-position arrangement**; only 2–6 actual players, one occupied outer slot per participating faction. A blank own slot requires PLAY from hand or, if hand empty, DRAW (one turn each) before that person can manipulate any Fear/Hope/Hate die. This participation rule is itself a candidate: R14 simulator does not yet enforce it.
- One neutral FOCUS card lies at the center. **No die can be placed on the center** by MOVE, SWAP, setup or redistribution. The three shared Fear/Hope/Hate D6 live only on occupied outer narrative slots (or wait centrally *without occupying a card* when no outer slot exists).
- The center is a **systemic consequence of a die collapsing at an outer card**. Actual boundary crossing is deterministic ADJUST of 6→7 or 1→0, not REROLL to 6 or 1. Actor, affected outer-card contributor and **pre-collapse placement of all dice** are visible.
- One common 56-card product: six faction cards + 50 narrative cards. At setup n outer cards, 3n hand cards and one center card are drawn from the same fifty, leaving `49-4n` stock (41 at 2 people; 25 at 6). No 57th card, extra dice, per-card modifiers, token economy or mission.
- This is a *borromean game metaphor* (a third-element system dependency), not a mathematically exact Borromean-ring topology. The earlier three R/A/F dice draft is a **historical inspiration only**; current R14 uses Fear/Hope/Hate.

## Shared candidate payout grammar
For either option below, inspect the state **before removing the outer card**, so contributor and other-die positions are well-defined.
1. **6→7 UP:** As in R14, **ACTING PLAYER** wins the affected outer card. If actor ≠ CONTRIBUTOR and a central Focus exists and the chosen A/B condition permits, **CONTRIBUTOR** receives the FOCUS card as **one** trophy, then center refills by drawing one existing stock card, if any. If actor=contributor, no Focus trophy/refill: disallow a self-harvest double jackpot. This pair of separate trophies can be a deliberate alliance or an unexpected benefit to an opponent.
2. **1→0 DOWN:** Outer card goes to discard, no outer trophy. If center occupied and A/B condition permits, central Focus card is also **discarded** and replaced by one card from stock if available. This is a public **REFRAME**, not another automatic trophy. In both directions the affected contributor loses their occupied narrative slot and must re-enter in a later turn.
3. **Order:** Focus trophy attribution belongs to the *pre-collapse* contributor and is resolved within the triggering action **before** outer slot becomes empty. That is not an off-board person's newly initiated action. Afterward reset triggering die to 3 and relocate dice on removed outer slot to other occupied outer narratives, exactly like R14; when none survive, dice wait centrally **off-card**, never on the Focus. Refill only from stock; if stock0, Focus may stay empty, game end/reentry rules still undefined.
4. **No stealth repair of R14:** 5→6 still usually leaves a 6 for the next actor. A contributor who prepared their **own** narrative might now receive Focus compensation if the next person harvests it, but a preparer of someone else's narrative does not automatically receive credit. No invisible previous-preparer markers.

## Activation A/B, only ONE active
**A · ALL COLLAPSES:** Any 6→7 or 1→0 on an outer card activates the above center grammar, provided Focus exists. High self-harvest leaves center alone. Simplest to learn, but risks rapid Focus-stock depletion and pairwise collusion.

**B · BORROMEAN SURVIVOR SPLIT:** Center only activates if the **two OTHER dice** (not the one crossing its boundary) occupy **two different, currently occupied outer narrative slots BEFORE the collapse**. Otherwise center stays unchanged while the outer card still resolves. This makes MOVE/SWAP strategically able to enable or stop a systemic Focus release. At **2 players**, survivors can be split across the two occupied outer slots, so B is possible; requiring three distinct factions would not work for two players. No extra counters or phase.

## Constructed tabletop traces (NOT simulation)
**2 players:** Tech contributes THE BELL, Round Table contributes THE COMMITTEE, center is THE NATIONAL EMERGENCY. Fear6 on THE BELL; Hope3 on THE BELL; Hate4 on THE COMMITTEE. Round Table adjusts Fear 6→7. Round Table wins THE BELL; Tech gets THE NATIONAL EMERGENCY; center refills one stock card; Tech position empties and must PLAY next turn. Both A and B trigger: Hope/Hate occupy **different slots**. If Hope3 instead sat on THE COMMITTEE with Hate4, B would not release the center; A still would.

**6 players:** Six occupied faction slots; central FOCUS = THE WORLDWIDE EMERGENCY. Fear1 on THE BELL, Hope4 on another faction, Hate2 on a third. Active rival adjusts Fear 1→0, burning THE BELL. A and B trigger; the Focus is discarded and replaced, **no one scores a trophy**. Contributor must later re-enter. A move/swap before the next collapse can rearrange B's conditions.

## Risks and next gate
- Automatic two-sided high payouts may reward intentional bilateral farming at the expense of others.
- DOWN/reframe with repeated loss of own public slot may lock players out; Focus may be depleted quickly. Both risks increase with 5–6 participants.
- The border condition B might be hard to notice and cause too few releases; A might release too often. Need ratio of center/outer trophies, focus churn, frozen seats, spent PLAY/DRAW turns and stock use.
- Distinguish actor and contributor **without ownership-only scoring**; both are public from outer slot and current move.
- FOCUS is not a 7th player, has no dice or claim marker, and cannot be attacked directly.
- No human games, engine changes, art, Stage, Site publication, auto-merge or Live promotion.
**One next gate:** use the same R14 outer rules plus proposed mandatory-entry gate, 2P and 6P fixtures with THE BELL, and **compare A vs B center activation** under paired seeds/identical automated policies, then paper-test A/B/FAIL with humans. Keep original 5→6 preparation issue visible.
