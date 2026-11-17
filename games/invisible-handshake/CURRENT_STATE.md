> **2026-11-17 · R15B collapse-triggered Focus supersedes die-occupiable centre (UNTESTED):** Georg rejected the previous [R15 option B](CENTRAL_FOCUS_ENTRY_GATE_R15_PROPOSAL_2026-11-17.md) where the central narrative could directly host Fear/Hope/Hate dice. New [R15B center-collapse candidate](FOCUS_COLLAPSE_R15B_CANDIDATE_2026-11-17.md) keeps **all three communal dice solely on outer player narratives**. When an outer die deliberately crosses 6→7, the acting player receives the outer trophy as in R14; a different affected **contributor** may receive the central FOCUS as a separate one-card trophy, triggering refill from the same stock. At 1→0, outer and sometimes central focus are discarded/reframed with no trophies. A = all outer collapses trigger center, B = center responds only if the **two other dice lie on different occupied outer narratives before collapse** (possible even with only 2 people). No double-focus trophy on self-harvest. Both assume the proposed mandatory own-slot re-entry, not tested R14. [Static test](FOCUS_COLLAPSE_R15B_TEST_REPORT_2026-11-17.md): 51 scenario cases / 149/149 fixture checks, **not full games**. 5→6 next-player gift, collusive bilateral farming, off-board denial and card depletion remain open. Main 2–6; no hidden missions/Solo. Current **tested baseline remains R14**, original R15 A context-only is historical comparator, old center-as-direct-dice-target is rejected. Next gate: paired 2/6-seat A/B simulation, then human paper microtest; no Site/Hub/Live.

> **Current additive proposal · compulsory entry and shared FOCUS (2026-11-17; not accepted/tested R15):** Georg clarified that occupying one's public narrative position is the **condition for playing**, not a voluntary public-good donation. [Design note](CENTRAL_FOCUS_ENTRY_GATE_R15_PROPOSAL_2026-11-17.md) proposes mandatory PLAY (or DRAW if no hand card) before any F/H/H die manipulations while one's slot is empty. Separate A/B central FOCUS variants: A = shared permanent narrative context only; B = shared capturable/burnable card with a **centre-only automatic stock refill**. One centre card is taken from the existing 50, opening stock = `49−4n` for n=2–6; no 57th card. [38 static assertions](CENTRAL_FOCUS_R15_TEST_NOTES_2026-11-17.md) confirm 50-card conservation and re-entry fixture economics, **not** balance or human fun. R14 current tested baseline **remains unchanged**, including its previous legal options; this new gate has NOT been simulated at scale. Focus centre does **not** fix the original 5→6 harvest gift. No secret objectives, Solo NPCs, art, Site or game runtime. Next single human gate: 2-player A/B and 6-seat denial stress, Georg A/B/FAIL.

# The Invisible Handshake · Current working state

Consolidated17 November2026 at Georg's request. **START HERE within this game owner.** This is a handoff, not a balanced-game release. Source snapshot before consolidation: `d8ceb4156081ba06220f63266a66ad92e6c1b33d`.

Repository: georg-doc/kayfabizarro. Branch: `design/invisible-handshake-paper-r0-2026-11-17`. Draft PR475. Owner: `games/invisible-handshake/`. Existing game runtime, Atlas and KFB game retain separate ownership. Do not merge, publish or start background work merely because this handoff exists.

[Webchat start brief](WEBCHAT_HANDOFF.md) · [Prioritized Atlas queue](RESEARCH_QUEUE.md) · [Additive history](RETURN.md)

## Product intent and decisions to preserve

An intuitive, weird, satirical contest among six globally imagined power circles. Players introduce and appropriate public narratives: Show, Spin, Sell. Improvisation may enrich play but must not be a judged mandatory performance or replace a clear move. Real historical evidence, author interpretations and game fiction stay distinct. Avoid generic faction branding and AI-slop satire. Game/card/UI copy stays English; German discussion or spoken drafts may accompany it.

Starter product:56 cards =6 faction cards +50 multipurpose gameplay cards, with cover and14 pages of four cards; four-card pages can form visual micro-stories. No finalized56-card contents/art exists for the current mechanic. Cards should not require individual numeric modifiers. Three shared colored D6 embody Fear/Hope/Hate; they are fictional discourse variables, not validated social-science measurements. Resonance/amplitude/frequency remain possible presentation lenses, not extra mandatory tracks.

Six working satirical faction labels, NOT proven unified real-world organizations or final faction powers: Technocracy™, Round Table, Fourth Reich, Illuminati, Holy Empire, Alien Management. Earlier opaque names were rejected. Framing may combine technocracy/Dark Enlightenment, imperial-financial circles, alleged breakaway narratives, occult-secret-society imagery and religious/alien authority claims. Actual historical entities must be separately sourced. Do not flatten this into a local camera-company scenario.

Primary player count2–6. Solo and NPC filling are deferred. An eventual triangle/power pyramid within a six-position layout should clarify actual game functions; older visual prototypes failed user expectations. No new3D rendering is needed to resolve the present rule question.

## Current R14 tested candidate

One public narrative slot per active player, three hand cards each, max hand6. Fifty gameplay cards total; after setup stock is50−4n. Three global dice start at3; two-player setup necessarily co-locates dice. Contributions are public: a card's location identifies who introduced it, NOT who may manipulate or win it.

One action per turn:
1. Adjust one die by+1 OR−1, with known result.
2. Reroll one die to a fresh1–6.
3. Move one die to another occupied narrative, retaining value.
4. Swap the positions of two dice on different occupied narratives, retaining values.
5. Draw one card if stock remains and hand is below6.
6. Play one hand card into your own empty narrative slot.

No chips, holding period, automatic refill, narrative overwrite, faction powers or secret goals in this candidate.

Crossing6→7: the ACTING PLAYER wins the card under that die, regardless of contributor. Crossing1→0: discard it without a trophy. Reset the triggering die to3. The acting player redistributes ALL dice on the removed card to remaining occupied narratives; other dice retain values. Simulation instantiated this choice uniformly at random, not strategically. Empty slot remains until its contributor spends a play action. If no narratives remain, dice wait centrally and join the next played card. Reroll cannot cross0/7.

The opposite-face flip7−value was tested separately in R13 as optional, not adopted into R14. It is distinct from adjust and reroll. Three public cards per faction, six permanently active NPC factions and mandatory improvisation are also not current rules.

No final victory threshold, session length or finite-stock endgame has been selected. Simulation cutoff is not a game ending rule.

## What the evidence actually says

| Evidence | Result | Consequence |
|---|---|---|
| [R12](r12-hold-time/REPORT.md),8,400 runs | Shorter two-opponent hold improved the OLD forced-action claim model. | Historical evidence only; do not reintroduce claims silently. |
| [R13](r13-action-choice/REPORT.md),5,000 games +5,000 snapshots | Free move/swap caused near-total denial under greedy scripts; six-player90/100 tables scoreless. | More actions did not fix chip holding. |
| [R14](r14-open-harvest/REPORT.md),6,000 games | Open harvest produces trophies; all-builder tables about4.5/player over24 own turns. | Visible scoring works under those scripts. |
| R14 preparation telemetry |43,839 resolved5→6 preparations in harvest-first groups all went to next actor; zero returned to preparer. | Preparation incentive unresolved. Not proof of optimal human play. |
| R14 hand economy |50-card conservation passes; draw/play consume turns. | Contributors pay to replenish publicly harvestable cards; voluntary supply is hard-coded, not rationally established. |

Independent reviews and source scripts are in each folder. Tests have different policies/horizons; raw numbers cannot be pooled into a universal balance ranking. No human enjoyment, optimal strategy, actual card semantics, faction fairness or solo balance proven. Legal voluntary non-scoring cycles exist, distinct from forced no-move deadlocks.

## Open decisions, ranked

1. **Preparation incentive:** can preparing a narrative give its actor a risky same-turn harvest opportunity instead of a guaranteed gift to the next seat? This is a proposed NEXT comparison, not an adopted rule.
2. **Public supply:** why voluntarily spend a turn filling one's empty slot when someone else can take the trophy? Do not conceal this by hard-coding refill as rational.
3. Define a short game ending and stock/hand exhaustion behavior after the core loop works.
4. Then compare private goals, faction differences and solo/NPCs. Random assignment alone does not balance goals.
5. Only after a legible paper loop: cards, visual style, onboarding and Site implementation.

Private goals proposal: identical threshold with Fear/Hope/Hate label variants (e.g. two personal harvests via assigned emotion), possible duplicates. NOT tested, no added component allocation or win rule accepted. See [proposal](r14-open-harvest/HIDDEN_OBJECTIVES.md).

## Site and owner boundaries

Historical game Site: https://the-invisible-handshake.frizzlebob.chatgpt.site . Last recorded R09 version3/source475642c78625d404a3add0b0be77abaebbbcc7b0; old runtime, NOT R14. This consolidation does not reopen or verify the host. No claim that the current rules are playable there.

Research Atlas is a separate owner/site, historically https://kfb-research-atlas.frizzlebob.chatgpt.site/ . Production Hub is not the Atlas. Research jobs go through existing Atlas branches, not a second source database in this game. Game docs link to evidence; satire does not turn an attributed allegation into fact.

## Division of labor and stop boundary

Webchat: one bounded rules comparison, one source inventory, or one short source packet per job; read current GitHub first, persist and read back. Do not promise webchat use is quota-free. This chat: larger conceptual synthesis, orchestration and genuinely necessary Atlas research, when Georg returns with a request. No active recurring/AFK research, automatic agent fan-out, Site rewrite or broad research run is authorized by this handoff. Next work starts when Georg invokes the brief.
