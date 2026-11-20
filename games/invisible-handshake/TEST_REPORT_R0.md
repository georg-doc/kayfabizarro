# The Invisible Handshake · Paper R0 test report

2026-11-17 · Design-only, source-bound test evidence. No human test, no public/Stage verification. Source: [PROTOTYPE_R0.md](PROTOTYPE_R0.md).

## Actual checks run

| Check | Actual result | What this does *not* prove |
|---|---|---|
| 56-slot arithmetic | 6+30+12+8=56; fourteen four-card pages + separate cover = 15 content pages | Fun, balance or final artwork |
| 1/2/4/6 player institution capacity | PASS 4/4 configurations: max controlled 3/6/12/18; with 4 Market cards, 23/20/14/8 Institutions remain outside table-controlled areas at max capacity | Supply quality at particular shuffle orders |
| Plot deals | PASS 4/4: initial Plot hands 1/2/4/6, remaining Plot stock 11/10/8/6, total 12 in each configuration | Whether two or more plots per player are enough |
| Eight-round clock | PASS 4/4 arithmetic: 8/16/32/48 participant turns at 1/2/4/6 players; eight Events reveal once | Actual seconds per turn or social downtime |
| Worked build example | PASS 1/1 arithmetic: N01 + N02 + N05 = 9 provisional points; R01 bonus not met | Strategic superiority |
| Worked poach + veto + fallback | PASS 1/1 accounting: Jules Favor 1→2→1, Mara 3→2; N05 retained, Jules recruits N06. Jules network provisional 9+2=11 | Reaction behavior in real groups |
| Worked solo prioritization | PASS 1/1: leftmost N05 (RULES supplier) discarded against currently unmet RULES need; N03 recruited; provisional 9 | Solo win over eight rounds |
| PDF structure (local conversation artifacts) | PASS: card PDF 3 A4 pages; 12 unique IDs each extracted once. Quickstart PDF 1 A4 page; solo heading present | Printer margins, physical cutting, commercial print readiness |
| Visual PDF inspection | PASS: rendered 4/4 pages via local PDF renderer; checked card sheet and quickstart; no apparent clipping in inspected pages | Desktop/mobile/printed color fidelity |
| Live browser/Stage validation | NOT RUN; no URL published | Deployment |
| Human playtest / stopwatch | 0 sessions, 0 timed turns | All game-fun and duration targets |

## Gate-by-gate status

| Player count | Supply / finite clock | Main unresolved gate |
|---|---|---|
| 1 | Arithmetically finite, single deterministic market-discard System | Is threshold 8 achievable without rote optimization? Test 8 rounds with actual shuffled 30-card supply |
| 2 | Direct POACH / one-player VETO window and guaranteed fallback; finite 16 turns | Can repeated 1-Favor VETO cause uninteresting repetitive stand-offs? |
| 4 | Max 12 controlled + 4 Market; finite 32 turns | Whether combo networks converge to the same three-tag solution |
| 6 | Max 18 controlled + 4 Market leaves 8 outside; finite 48 turns | Stopwatches needed for 20–40 s turns and ≤45-min whole game; does group targeting produce leader-lock? |

### Reasoned risks, *not* measured outcomes
- **Leader lock:** If the leader always has one Favor to VETO, repeated POACH fails. RECRUIT fallback avoids a wasted turn but may not solve repeated standoffs.
- **Kingmaking:** Later players may still use AUDIT to deny a leader points in the final round. This is visible and finite, but social impact untested.
- **Degenerate optimum:** Three-card directed cycles can score 9 base points. A full network is EXPOSED to POACH and PUBLIC HEARING; whether that tradeoff is sufficient remains unmeasured.
- **No early elimination:** Verified structurally (no removal of Role or player); not a human engagement finding.
- **Resource count:** One explicit counter, FAVOR (0–3). Suspension is a binary card orientation, network size and score are derived states rather than banked resources.
- **Solo difficulty:** Current deterministic opponent is a market-denial mechanism, not a full competing network; pressure likely needs playtest before calling it balanced.
- **Initial event no-op:** PUBLIC HEARING and EXPEDITED FUNDING can both have no effect in round one when everyone owns zero institutions. This is intentionally documented, not hidden.

## Required human test protocol (not yet performed)

Test three-card-network gameplay with 12 real samples first (one or two players), using short partial rounds to exercise: (1) RECRUIT and satisfied NEED; (2) POACH, VETO and RECRUIT fallback; (3) AUDIT and suspension until round boundary. Record number of rules explanations and moments in which an action has no interesting consequence.

For a true 1/2/4/6-person full-clock test, the actual 56-slot inventory must first be made available as mechanically identical, clearly numbered unillustrated stand-ins; **do not mistake these for approved new card designs**. Use 8 rounds; time each turn, reactions, total game, idle time at six; track repeated vetoes, exposed targets, final scores, ties, story performance uptake and disagreements. No interpretation as PASS before these measurements exist.

## Stage / source provenance
- Briefing source: `skills/chat/research/hidden-cosmology-atlas/packages/historical-texts/GAME_MECHANICS_BRIEF.md` on Research Atlas branch.
- Current KFB reference: https://kayfabizarro.pages.dev/#kfb, inspected for contextual distinction.
- Original official Illuminati/INWO PDFs yielded 403 on direct request; no full original-edition audit claimed.
- **No Dropbox modification, no KFB gameplay code, no Cloudflare KFB Stage publication, no KFB Hub acceptance URL.**

**Next and only human gate:** Georg tests the 12-card physical microloop and reports KEEP / TUNE / FAIL on decision quality; then one appropriately bounded full-capacity proxy playtest can be authorized.
