# THE INVISIBLE HANDSHAKE · R15C spatial correction · Six outer narratives, one die per card

**Date:** 2026-11-17 · **Status:** USER-CORRECTED DESIGN INVARIANT / not yet R14-tested. **Owner:** `games/invisible-handshake/`; **repo:** `georg-doc/kayfabizarro`; **branch:** `design/invisible-handshake-paper-r0-2026-11-17`; Draft PR #475. **Current full-game measured baseline remains R14**, which used a different, now superseded placement model. No unapproved player/AI rules, no new component, Site or merge.

## Georg's two corrections (binding for next concept/model)
1. **EXACTLY SIX OUTER NARRATIVE CARDS** are normally present on the tabletop, regardless of whether there are **two through six HUMAN PLAYERS**. With n humans, the other `6-n` faction narratives are randomly revealed **NPC factions**; e.g. 2 humans + 4 NPC narrative positions. A slot can be **temporarily empty after its card is harvested/burned**. A central shared FOCUS card is separate, and never takes a die.
2. **AT MOST ONE** of the three shared **Fear/Hope/Hate D6** may occupy each outer narrative card at a time. All three dice are normally located on three **different** occupied outer cards. MOVE chooses another **occupied, die-free outer narrative card**; SWAP exchanges two dice between their separate occupied outer cards, retaining faces. Dice neither stack nor occupy center.

**Therefore:** The earlier R14/R15 statements `one outer card per active human only`, `with two people 3 dice must stack`, and `NPCs deferred` do **not** describe Georg's intended six-card table. The proposed `R15B BORROMEAN SURVIVOR SPLIT` gate ("two other dice must be on different cards") is **tautological** whenever all three dice are on legal positions. **REJECT that variant; do not revive it.** A centre response to any *outer* 6→7 or 1→0 remains a *candidate*, not approved. Earlier R15 center-as-direct-dice-target also remains rejected.

## Setup/finite supply — corrected arithmetic
Fixed product: **six faction cards + fifty multipurpose narrative cards = 56**. n=2–6 humans each start with 3 hand cards; the **six outer narrative positions** (n human + 6−n NPC) each take one ordinary narrative card; **one ordinary focus narrative card** lies in the centre. All are sourced from the original 50 and are distinguishable by location, not card stats.

`STOCK = 50 - 6 OUTER - 1 FOCUS - 3*n HUMAN HAND = 43 - 3*n`

| Human players n | Human outer positions | Random NPC outer positions | Six outer cards | One focus | Human hand cards | Stock |
|---:|---:|---:|---:|---:|---:|---:|
| 2 | 2 | 4 | 6 | 1 | 6 | **37** |
| 3 | 3 | 3 | 6 | 1 | 9 | **34** |
| 4 | 4 | 2 | 6 | 1 | 12 | **31** |
| 5 | 5 | 1 | 6 | 1 | 15 | **28** |
| 6 | 6 | 0 | 6 | 1 | 18 | **25** |

R15 earlier `49-4n` setup stock and two-player starting stock 41 are **invalid for this intended six-outer-card board**. Both expressions happen to equal 25 at n=6, masking the error. Faction cards are outside the 50-narrative-card accounting.

## Spatial gameplay and collapse (candidate semantics)
- Initial placement: spread the three dice onto **three distinct** of the six occupied outer narratives; all show 3 as in R14, no dice on the centre. Which three get them may follow fixed symmetric faction positions; **no NPC decision policy or automatic NPC extra turn is authorized merely by displaying NPC factions**. A neutral NPC card remains a public narrative which human players can manipulate and claim (subject to future NPC ownership/scoring decisions).
- **MOVE:** exactly one die moves to an occupied die-free outer card. **SWAP:** two occupied dice exchange positions. Values and colors remain with their respective dice. **ADJUST/REROLL** act on the die at its outer card as in R14; only ADJUST to 7 or 0 triggers an outer collapse.
- **COLLAPSE:** the affected outer narrative may be won or burned; the triggering die resets to 3. Any die displaced from a removed card relocates to an **occupied die-free outer card**, preserving single occupancy. With five remaining outer cards after a single removal, this is always possible; if later fewer than three cards remain, unused dice wait in an **off-card reserve**, not on the Focus and not stacked. Reserve dice re-enter only via a separately defined legal rule; R14's earlier "all waiting dice join newly played card" would violate single occupancy and is superseded.
- **FOCUS:** never hosts a die; may be conditionally released/reframed by an outer collapse. The former all-collapse R15B-A is a **candidate** only. Actor gets the affected outer card on 6→7 in R14. If its **contributor is an NPC**, who (if anyone) receives centre compensation remains **UNRESOLVED**; do not silently transfer it to an absent human or create new NPC scoring. Negative collapse may reframe/replace Focus; test churn and deck pressure.
- **Human entry gate:** Georg's earlier clarification that humans must hold their own public narrative to act still applies as a *new proposal* (not yet simulated). NPC vacant-card refill is **undecided**: avoid assuming it occurs instantly for free or costs an autonomous NPC turn. Record the need to choose timing separately, because it affects stock conservation and opportunity frequency.
- **No multiple die per card in cascades.** A future cascade can resolve **sequential** outer cards/centre reactions only after each board update and legal die relocation. Do not conflate moving a die with automatically destroying a second card; extra chained rewards are **not adopted**.

## Technical fallout / cold-start warning
Existing `r14-open-harvest/test.py` **allows stacking** and initializes dice at `i % n`, causing 2-player co-location. Existing `options()` allows dice to MOVE onto occupied-with-dice slots. Existing R15/R15B 2-player static fixtures model only two outer cards and therefore **cannot validate** this rule. They remain historical recorded evidence of *other* models, not test results for the intended geometry. Before new Monte Carlo, create a separately named copy or adapter with six always-present faction positions, single-die occupancy, 50-card conservation and NPC refill/scope decisions made explicit. Do not edit the R14 baseline or claim older 6,000 simulated games establish the corrected system.

## One next gate
**First:** validate six outer+focus setup at n=2–6; all legal MOVE/SWAP states with no stack, and one removal with die relocation/reserve. **Then:** decide one narrowly defined NPC action/refill model and one centre payout treatment for NPC contributors, and run paired 2/6-person tests. Only afterward compare the high/low Focus-collapse payout, re-entry denial, 5→6 preparation and card exchange ideas. Preserve Georg A/B/FAIL after a real paper microtest. No Stage URL, KFB Hub Live tile, art, background job, auto-merge or promotion.
