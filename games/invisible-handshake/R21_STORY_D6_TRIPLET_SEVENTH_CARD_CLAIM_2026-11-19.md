# The Invisible Handshake · R21 · Problem / Reaction / Solution + Story D6 + Seventh Card Claim

**19 Nov 2026 · BOUNDED GAME-DESIGN CANDIDATE, NOT ACCEPTED OR IMPLEMENTED.** Owner remains `georg-doc/kayfabizarro` → `games/invisible-handshake/` → `design/invisible-handshake-paper-r0-2026-11-17` → draft PR #475. User proposal after R20: always use **PROBLEM → REACTION → SOLUTION** as a three-card beat; apply the already existing KFB **Story-Mode D6** (tragic, heroic, forbidden etc.) as tonal/emotional stipulation; let SOLUTION **claim the seventh card**, then perform one card-win resolution. Do not resurrect R19's three numerical emotion dice, stat tracking or NPC phase. This is a **new alternative to R20**, not simultaneously an adopted replacement.

## Exact source and adaptation boundary

Verified read-only KFB sources on the current branch:
- `Kayfabizarro_Freestyle_Rules_v18-4.md` §3: Story-Mode die rolls **at the beginning of each original KFB turn** with faces 1 Tragic, 2 Comic, 3 Absurd, 4 Heroic, 5 Mystical, 6 Forbidden. The original rule says it is a frame, not a cage.
- `media/prompts/frizzlebob_modes.md`: the same Story-Mode order, connected to existing narration registers; the mode sets presentation rather than numeric victory.
- `media/prompts/KAYFABE_TIPS_corpus_v1.md`: **Therefore / But** causal linking and concrete cards/objects.
- R20: rapid UNO-like single-card plays, brief causal reasons, no card numbers, six faction identities +50 regular narratives as a **planning budget**, not finished card art.

**R21 adapts the KFB D6 deliberately:** roll **once per completed triplet**, not once per individual player's move, so one tonal condition applies consistently to all three beats. Keep six original English labels exactly. HATE / FEAR / HOPE are interpretations of player effects, NOT a second die, numerical axis or mandatory printed classification.

## Minimal repeatable procedure (n=2–6 humans)

1. **SETUP:** each human is dealt 5 of the 50 ordinary narrative cards. Put one extra ordinary card face-up at the middle as the **seventh, contestable FOCUS**. The six surrounding spaces stay empty at start; they are **two alternating groups of three** (latest two completed episodes), not six independent NPC positions. Opening stock is `49 - 5n` = 39 / 34 / 29 / 24 / 19 for n=2..6. The six faction cards may identify each player's worldview but have no abilities. No NPC bots, numeric card powers or separate judges.
2. **ROLL:** roll the one original KFB Story-Mode D6 **before the Problem turn**. Its result remains in force through Reaction and Solution. Exactly one die; numeric face used only to look up its canonical story mode, **not** printed on any cards.
3. **PLAY:** clockwise, a player places one real card from hand into the next of three shared spaces and gives **one short card-specific causal clause** using the rolled mode. **Problem:** “This is the problem because ...” **Reaction:** “Therefore this happens ...” **Solution:** “But this promises to solve it ...”. A novice may name the title and concrete printed claim. No vote on creativity or ideological truth. There are exactly three cards in a completed triplet.
4. **CLAIM trigger:** SOLUTION **ends the triplet and triggers inspection of the central FOCUS**, reading its short PUBLIC CLAIM and, as the delayed reversal, its PRIVATE INCENTIVE. **A claim is an event trigger, not an automatic personal prize for the third player.**
5. **RESOLVE:** use **one** of the two alternatives below, not both. Once resolution ends, archive the visible triplet, replace a claimed center from stock if one exists, roll new Story D6 and start the next Problem. Maintain only the last two triplets around the center; when new cards enter full exterior slots, move the oldest triplet into the ordinary discard/archive. Every ordinary card stays in exactly one zone.

### A · zero-notation reading/control (recommended first comprehension baseline)

The three played narratives **jointly claim** the central card as a completed “case”. Move that center to a **shared resolved pile**, reveal the next center from existing stock. The SOLUTION player does **not** automatically earn a personal trophy for acting third. End the fast UNO-style race when a player empties their hand, with the caveat that pure free-play and first-to-empty may be dominated by initial seating and give no card-choice incentives. This is a **reading/control**, not yet proof of a competitive game. No symbols added to cards.

### B · one visible mark, genuinely competitive CARD WIN (focused challenger)

On text-only paper proxies give each of the 50 cards **one small nonnumeric identifying shape** from three distinct abstract marks (e.g. circle, triangle, diamond). This is a disposable mechanics mark, **not new KFB visual canon, branding or new card numbers**. The current FOCUS shows one such mark.

At the end of SOLUTION inspect the three played card marks:
- **EXACTLY ONE** of the three matches the central mark → the **player who placed that uniquely matching card wins the seventh FOCUS card as a trophy**, whether they played Problem, Reaction or Solution. Replace the center from the same stock.
- **ZERO matches or TWO/THREE matches** → **nobody wins the center**; leave it face-up for the next triplet. No adjudicator, tie vote, modifier, card ability, cost or hidden luck event. The third player can strategically help or prevent a unique match by their card choice, but is not guaranteed the prize. The apparent “solution” may thus make *another* player's card win.
- The causal story and D6 tone are still spoken; the mark decides only the objective CARD WIN, never whether someone's satire was “good”.

**Why this matters:** three authors collaborate on the official account, yet one institution may be the *sole* beneficiary. A rival can even play a second matching mark at Solution to make the lucrative FOCUS stay unclaimed. “Moment, was habe ich da gespielt?” is an outcome of the group's actual plays, not a scored joke or narrator verdict.

**Provisional endgame for B only:** after the triplet during which a human first emptied their hand, most central trophies wins; tie → fewest cards remaining; further tie shared. Any empty-handed player is skipped only until that final triplet resolves. This ends games without printing numbers on cards; the victory condition is a test hypothesis, **not canon**. For A, first to empty hand remains the quick control. There is no forced draw in this first constrained 5-card scenario; all cards can be played to the current causal slot. An optional draw/pass rule is later and must not be quietly inserted.

## Exact constructible three-card example

Mode: **FORBIDDEN** (the original KFB D6 face6, not a new “hateful” die). Center **THE NATIONAL EMERGENCY** with paper-proxy mark **circle**, PUBLIC CLAIM “Exceptional measures are temporary”, PRIVATE INCENTIVE “The renewal form has no final date.”

- Person A plays **THE LEAK** (diamond) as PROBLEM: “The leak exposes the private renewal schedule.” 
- Person B plays **THE BELL** (circle) as REACTION: “Therefore the ministry declares a permanent alert.”
- Person C plays **THE SAFETY ADVISORY** (triangle) as SOLUTION: “But safety is only guaranteed by extending the emergency.”

SOLUTION triggers the center reveal. In optional B, **only THE BELL matches the center's circle**: person **B** takes THE NATIONAL EMERGENCY as a seventh-card trophy, although **C authored the official solution**. In control A, the seventh card is resolved jointly, not awarded to C. The PRIVATE INCENTIVE reveals why the promised solution might be the real problem. Colors/shapes in this example are invented test markings, **not existing KFB printed card features**.

## Game-theory checks and risks, explicitly open

- **Seat lock with naïve “SOLUTION always wins”:** in plain continuous clockwise play, with **3 players only seat3** finishes a triplet, and with **6 only seats3 and6** finish; awarding each center personally to SOLUTION would make a structurally unfair card-win game. This is the main reason not to implement automatic personal Solver win.
- **Pure verbal play is not UNO mechanically:** without an objective card-choice constraint or earned win condition, every card may be justified and the first-empty-hand outcome can become predetermined. Option B uses only one visible symbol and a single resolution comparison, no numerals.
- **Unique-match rule is position-symmetric before strategy:** for a fixed center symbol and uniformly independent three-valued marks, exactly one match occurs in **12 of 27** possible triplets, and each Problem/Reaction/Solution position uniquely matches **4 of 27**; this is a structural illustration, not real hand distribution/play data. The last player sees more information and may have an advantage; measure it.
- **Temporal change:** rolling D6 once per episode (R21) rather than per turn (original KFB) speeds setup but could reduce tonal contrast; compare once-per-three against original only if first prototype feels flat.
- **Card content:** each narrative still needs a concrete subject, claim, motive; optional shapes may make matches strategic but could trivialize meaning. Test real card-title recall, one-sentence length and whether the private motive creates a surprising retrospective.
- **Two players:** alternate clockwise for the three plays; one person may take Problem **and** Solution in a triplet, the next episode begins with the other person. No dummy third player. **Five/six players:** one ordinary turn per card, no NPC filler or separate reactions.
- **Deck conservation:** 50 ordinary narratives across hands, current central card, six surrounding slots, won/shared cards, discard and stock; six faction identity cards outside this ledger. Never mint a 51st ordinary card.
- **Research/art separation:** this is a text-mechanic candidate, no existing donor art adopted, no Source Object claim and no Stage, Site, PR merge or Live promotion.

## Next single gate

Paper microtest **2 humans and 6 humans** with original KFB Story-D6, 5-card hands and real title/claim/motive proxies: A without marks vs B with one simple mark. Track mean/max seconds per three-card episode, card-specific causal links, center claims and unique-match tie blocks, whether solver/last mover exploits the mark, and players' spontaneous satirical retrospective. Georg **KEEP / TUNE / FAIL** on competitive seventh-card claim *versus* a purely shared narrative claim. No R19 integration, 50-card art production or completed-game claim until actual play evidence.
