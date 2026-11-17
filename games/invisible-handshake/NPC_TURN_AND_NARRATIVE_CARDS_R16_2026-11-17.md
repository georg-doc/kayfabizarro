# THE INVISIBLE HANDSHAKE · R16 · NPC Editorial Pulse and Meaningful Narrative Cards
**17 Nov 2026 · BOUNDED DESIGN CANDIDATE / NOT ACCEPTED OR HUMAN-TESTED**
**Owner:** `games/invisible-handshake/` in `georg-doc/kayfabizarro` · **branch:** `design/invisible-handshake-paper-r0-2026-11-17` · **Draft PR:** #475. **Current measured full-game baseline remains R14**, whose 2-person stacking and variable number of outer cards are *not* the intended geometry. **Current correction:** [R15C six-outer/single-die](SIX_OUTER_NARRATIVES_SINGLE_DIE_R15C_2026-11-17.md), and [CURRENT_STATE](CURRENT_STATE.md) (read newest addenda first). This R16 note makes NO silent runtime/site/canon changes.
**One bounded outcome:** spell out one complete human round, two possible **one-pulse** NPC models, and a minimum non-numeric way to make the fifty narrative cards tactically useful. Do not reintroduce R0 resources, old R0.6 dice economics, hidden missions, RPG NPC hands, per-card numerics or a seventh player.

## What is already user-directed versus proposed
**User-directed:** six outer public faction narrative positions **always filled at initial setup**; with `n=2..6` humans, the other `6−n` are randomly revealed NPC narratives. **At most one D6 per outer narrative card**; 3 shared colored Fear/Hope/Hate D6 normally on three distinct outer cards, center FOCUS die-free. Own human narrative is mandatory to participate; after it is removed the player first needs a whole turn to republish (or draw if hand empty). Main product 6 faction cards + 50 ordinary narrative cards, one shared deck, 2–6 humans, Solo deferred. Satirical Show/Spin/Sell interpretation matters, but no scored/mandatory creative-performance contest.

**NOT authorized yet:** how many actual NPC turns; who chooses/replaces an NPC's card; how an NPC would claim/receive Focus; automatic NPC draws; extra card-category symbols/abilities; hand stealing; next full-game end condition. The options below make those independent choices visible, rather than claiming that the user has accepted them.

## Initial setup and public-performance ceremony (all six seats visible)
1. Select n humans each occupying one of six named fictional factions (Technocracy™, Round Table, Fourth Reich, Illuminati, Holy Empire, Alien Management). Each human receives **four** random ordinary narrative cards, **chooses one to publish face-up** at their faction's position, and keeps **three** in hand. This implements the prior accounting "three cards in hand plus one already played", but now gives meaningful initial selection rather than an arbitrarily dealt human card.
2. Each **NPC faction** among the other `6−n` has **one randomly revealed narrative** at its own outer position. No NPC hand, personal draw pile or default victory condition is created just by having a public NPC narrative.
3. First player reveals **one common FOCUS narrative card from the same 50-card stock** in the die-free center; announces the topic/title. All players see and may contextualize their own card against that topic. The six faction positions are a physical stage, not a procedural hex-grid world.
4. Place three shared Fear/Hope/Hate D6 face3 on **three different occupied outer cards** by a fixed visible starting convention. Do not place any on FOCUS or stack. Choose who begins and move first-player marker clockwise in later rounds; do not add an autonomous NPC seat to the human turn order.
5. Total narrative conservation at setup: `n human public + (6−n) NPC public + 1 focus + 3n human hands + (43−3n) stock = 50`. n=2→stock37; n=6→stock25. Six faction cards are outside this narrative deck.

### The one-sentence Kayfabe layer (not a voted contest)
For each HUMAN's first publication and each later **PLAY/REWRITE**, use optional short **SHOW IT → SPIN IT → SELL IT**:
- **SHOW IT:** name/display the illustrated public card.
- **SPIN IT:** one sentence connecting it to the current central FOCUS (threat, promised cure, scapegoat, opportunity). A silent/novice player may simply read the printed Public Claim / private contradiction, with **identical legal effects**.
- **SELL IT:** name the actual chosen RULE action (which die/slot/card) and its justification; not a free second action.
KFB Freestyle's source ritual is `NAME IT → CLAIM IT → POWER IT`, not this identical phrase; R16's SHOW/SPIN/SELL is a candidate adapted from the game's own prior design brief. Source https://kayfabizarro.pages.dev/#kfb .
Only **one short narrative beat per human turn** is optional; do not force six speeches or score theatrical quality.

## Actual turn sequence (one human action per player, n humans)
**Round start:** The public Focus is already visible. Starting player briefly gives its current headline (one line, not a rule bonus). If no center card due to stock exhaustion, no new object is fabricated.
**Each HUMAN in clockwise order:**
- If own outer narrative empty: **PLAY one hand card to own slot as their action** (or DRAW one first when hand empty, then PLAY next turn). No dice action while off-stage. A per-card on-publish trigger below is an *explicit candidate extra effect attached to PLAY*, not a second chosen action.
- Otherwise take **exactly one** action: existing R14 `ADJUST ±1`, `REROLL 1–6`, `MOVE to occupied die-free outer position`, `SWAP two dice on distinct occupied cards`, `DRAW one card (up to six hand cards)`, or experimental `REWRITE` (see below).
- Resolve a triggered high 6→7 / low 1→0 **outer collapse** immediately, preserve actor/affected contributor and single-die occupancy, and resolve **at most one** linked center change according to a **separately selected** Focus collapse rule. Any cascade must be a sequential new event with legal placement; do not silently trigger three card losses from a die move.
**After all n HUMAN actions:** At most **ONE combined NPC editorial PULSE** if any NPC factions exist (Option A/B below). It is not 6−n separate NPC turns. Then next human first player rotates.
**No automatic free DRAW for human hands**. Drawing, hand use and the replenishment rule should remain legible; NPCs have no hand.

## NPC options — competing, not cumulative
**Selection common to A/B:** The NPC faction selection cursor advances clockwise **only among the 6−n actual NPC factions** after each NPC PULSE. If any NPC slot is vacant, select the first vacant NPC slot clockwise from cursor; that vacancy has priority over nonvacant NPCs. The cursor starts at the first NPC faction clockwise after starting human. If stock exhausted, a desired reveal/reframe cannot manufacture a card. This creates predictable *target timing* but unpredictable *card identity* from shuffled stock.

### NPC A · THE AUTOMATED EDITOR (first, fewest choices)
One NPC pulse at end of complete human circuit:
- If selected NPC slot vacant: flip top stock card into that position; no extra dice action. If stock empty, nothing happens.
- Otherwise draw **one** stock card, put it face-up on the selected NPC position, and move the previous NPC narrative card to **discard**, preserving any die currently attached to the **same position at the same value**. Only one public NPC headline changes per human cycle. If stock0, nothing happens.
- NPC does **not** win, burn, adjust a D6, acquire a private hand, or receive an individual autonomous turn. Its printed card may be read aloud as a single public-line “news headline”.
**Tradeoff:** One predictable editorial step per human round, card content changing randomly; risks being mere cosmetic churn. It supplies a stable NPC NPC-slot-refill pathway, but if several slots are empty it refills only one per round and can leave the six-seat stage temporarily sparse.

### NPC B · THE REACTIVE EDITOR (more tactical, still one pulse)
Same first rule when any NPC slot is empty: refill one chosen vacancy using stock.
Otherwise select next NPC faction clockwise:
- If this NPC's public narrative **has a die**, MOVE that same die to the **first clockwise occupied outer narrative without any die**. Preserve die face and one-die-per-card. If no valid destination, skip; no dice roll, no effect crossing 0/7 and no NPC trophy.
- If selected NPC narrative **has no die**, apply A's one-card reframe (top stock card replaces its existing face-up card; old NPC card to discard, die positions unchanged).
**Tradeoff:** Human players can foresee that an NPC with a die will redirect it after the human cycle and strategically exploit/prevent the shift; card identities remain random. Fewer cards may turn over than under A. No NPC high/low direct collapse in this version, so no unresolved NPC actor-trophy logic is needed.

### NPC as contributor on a HUMAN-caused high/low collapse — small optional rule to compare
The **human actor** always gets the outer NPC card on upper 6→7, consistent with R14; at 1→0 it is discarded. Because an NPC has no hand/trophy score, **do not award it the Focus trophy automatically**. **Candidate neutral rule** when a high NPC card collapses: the center Focus is **REFRAMED** (its old card discarded and the next stock card revealed, if any), rather than paying a nonexistent NPC winner. When a human's own faction narrative collapses under another's move, actor/contributor center compensation remains R15B's **unapproved** candidate. A negative collapse can similarly reframe Focus. Keep this as an explicit hypothesis in all tests; NEVER count NPC/center rewards as settled.

## Cards as strategy: two distinct layers, one optional minimum icon
### First: what the older R14 actually models
All 50 narrative cards are interchangeable for scores and actions; apart from physical identity/story and location, choosing `THE BELL` rather than another title does not alter legal play. Simply making the table talk more will **not** fix this strategic interchangeability. The original [Illuminati / INWO](https://www.sjgames.com/inwo/rules/inwo-rules-12.pdf) distinguishes Groups, Plots, Resources and explicit special abilities; transplanting its many stats/abilities would breach KISS. The opportunity is to give each card one **qualitative narrative LENS**, reusing Fear/Hope/Hate rather than numeric points.

### C0 · no new printed icons (control)
Every ordinary card may be displayed, shown, spun and sold, and its *position* determines who can play and who loses a turn upon collapse. No numerical attributes. **Limit:** cards remain mechanically identical. C0 is the correct zero-complexity control, not the proposed finished design.

### C1 · one nonnumeric Fear/Hope/Hate LENS icon per card (FIRST card-agency candidate)
One clearly printed pictogram on each *future* narrative card, assigned editorially from card content (**NOT** random or calibrated numerical bonus). **One of three universal on-PUBLISH / on-REWRITE effects**:
- **FEAR · ESCALATE:** raise the face of **one** legally positioned shared die by **exactly +1**, but stop at 6; the lens effect **cannot** cross 6→7 or score a trophy.
- **HOPE · DE-ESCALATE:** lower one positioned die by **exactly −1**, stopping at 1; the lens effect **cannot** cross 1→0 or burn a card.
- **HATE · REDIRECT:** MOVE **one** positioned die to another **occupied die-free** outer narrative slot, preserving value; if no target exists, do nothing.
No per-card extra modifiers, unique text attacks, new tokens, permanent ongoing skills, fourth die, or faction power. If no legal die/action for the lens, the card still enters play but effect fizzles. Every effect is visible and short.

**PLAY:** When human's own public position empty, they spend their one action playing any held card there and *may* invoke its lens ONCE during this same action; this is not an independent chosen D6 action while offstage. The lens makes re-entry tactically useful and supports distinct hand choices.
**REWRITE (NEW whole-turn action, only if own position already occupied):** Play one card from hand into one's own occupied public narrative position, move old public card to DISCARD, and trigger the **new card's one** qualitative lens once. If die already at this same faction position, it remains there at same face. No hand card gained from the displaced card. This consumes a held card, changes the actual visible narrative, and competes with spending a turn on DRAW or an outright R14 dice action. **One outer card per faction and same one-die cap always maintained.** 
**NPC card reveals and automatic edits do not invoke lens effects** in this first test (no chain of auto abilities from random public cards).
**C1 distribution:** deliberately leave all 50 final icon assignments **unwritten** until a 6–12 proxy-card microtest; a roughly even split is a design hypothesis, not a balanced rule.

**This is the minimum nonnumeric differentiation** that makes one drawn card tactically different from another. It still does not produce 50 distinct mechanics—and that is deliberate. Narrative-specific meanings come from its original art/copy and how PLAY/REWRITE contextualizes it with the common Focus.

## Steal / trade / recapture ideas — defer until C1 actually matters
- **HIJACK RANDOM HAND CARD:** if both have an occupied own narrative, spend one action to take a face-down random card from a rival's hand and give a chosen one from yours. Hands conserve; introduces interpersonal bargaining but **means almost nothing without distinct lenses or another functional card identity**. Candidate only.
- **CAPTURE AS TROPHY OR TO HAND:** at high outer collapse actor could choose one public score card or capture card into hand to replay its Lens. This could change the win economy and counter 5→6 incentives, but requires explicit endgame scoring/hand-cap rules. **Not adopted.**
- **SWAP TWO PUBLIC NARRATIVES:** possible but risks confusing contributor/faction ownership and Focus reward rights. Do not add until basic REWRITE is understood.
- No single-effect card can create multiple free deck draws or chained collapses in C1; potential cascade rules are separate, not automatically accepted.

## Two manual one-round traces (NOT measured games)
**2 human players + 4 NPC Narratives:** Tech publishes `THE BELL` from four starting choices and keeps three hand cards; Round Table publishes `THE COMMITTEE`, keeps three. Four NPC cards are randomly face-up, Focus is `THE NATIONAL EMERGENCY`; stock=37, three dice face3 on three distinct outer positions. Tech says “The Bell warns of the emergency; the registry bills every alarm”, adjusts its Fear die 3→4 as its one action. Round Table chooses REWRITE by playing `THE SAFETY ADVISORY` with FEAR lens over its own existing card, discards THE COMMITTEE and raises Fear 4→5 without harvesting. Then a **single** NPC pulse: A replaces one NPC narrative (old to discard, top stock card to seat); B instead moves a die if the selected NPC seat bears one, otherwise reframes. A human speech line may be from printed Claim, not an invented performance.
**6 humans + 0 NPC:** Six humans each publish one narrative and keep three cards, Focus is revealed from stock=25. On each person's turn they may adjust/roll/move/swap/draw, or publish/rewrite using one icon if C1 selected. There is **no NPC pulse**. A high collapse may remove human narrative and require next turn PLAY/DRAW. Human timing and no-action cycles remain OPEN.

## Why it might work / why it might fail
- More cards **actually enter and change the public table** through REWRITE and the chosen NPC pulse; the visible story changes without declaring a fourth resource.
- Three familiar D6 colors become **qualitative card lenses**; players choose whether to risk a 5→6 preparation via card or take an existing deterministic 6→7/1→0 ADJUST as main action. **C1 cannot itself score/burn**. The old 5→6 gift still needs a separate test; do not imply it is fixed.
- Increased ability to REWRITE the card at one's own position may permit defense-by-replacement or repeat-icon cycles. The old narrative goes to discard, and held cards are finite, so that choice competes with DRAW. Every change remains visible.
- Changing an NPC public card automatically each round can turn the stage into a rapid-news feed without the card's *meaning* changing its game mechanics if C0. C1 is recommended for the smallest semantic distinction.
- No arbitrary NPC modifier dice roll, no extra NPC hand, no individual NPC turn per nonhuman faction. A predictable selection cursor and unpredictable shuffled cards offer deliberate tactical anticipation and uncertainty.
- A 6-player human game has no NPC pulse and potentially lower involuntary card turnover; measure narrative variety across n=2 and n=6 before balancing.

## Evidence limit and one next gate
**Concept/design only.** [Static proof](NPC_TURN_AND_NARRATIVE_CARDS_R16_TEST_REPORT_2026-11-17.md) will verify five setup counts and fixed conservation of one NPC reframe/refill and one human REWRITE/PLAY. No human playing time, full-game A/B win rate, faction balance, source dice art reuse, performance acceptance, finished deck or published Stage.
**ONE NEXT GATE:** a **2-human + 4-NPC** short paper loop testing A vs B NPC pulse, with the SAME 6–12 proxy cards optionally assigned C1 icons, and then one all-human 6-seat stress sketch. Record NPC steps and card turnover, empty-slot lifetime, DRAW/REWRITE count, focus changes, spoken-story overhead and whether the actual printed card mattered. Georg selects KEEP/TUNE/FAIL before any full-game R16 simulator or 50-card icon layout.
