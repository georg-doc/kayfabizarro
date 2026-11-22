# R25 · Capture odds, three dice and card-economy conservation · Static test report

**22 November 2026. Source:** [R25 narrative-capture concept](R25_NARRATIVE_CAPTURE_SUM_PRESSURE_CARD_ECONOMY_2026-11-22.md) + [R25 committed fixture](R25_CAPTURE_CARD_LEDGER_PROBE.js). **Design/test evidence only; no full gameplay, playtest, browser or deployment.**

## What was ACTUALLY executed

1. The **exact committed R25 JavaScript fixture** was fetched back from its GitHub branch and evaluated in the ChatGPT **Code Mode V8 environment** with a compatibility shim for Node's `node:assert/strict` methods `ok`, `equal`, `deepEqual` and for `console.log`. Result: **PASS**. This is **NOT** an execution of the original file under Node, nor a CI workflow.
2. An **independent, shorter locally authored Node.js sanity script** was run in the terminal for card conservation, staged PUBLISH/MOVE/FAIL/CAPTURE/REFRESH and depleted-stock control, returning 150 ledger audits, 120 transitions, 20 scripts, five stock-empty samples. This Node script is an **equivalent independent check**, not a claim that the checked-out repo file itself ran in Node.
3. A direct HTTP download of the exact GitHub blob in the container failed because internet DNS was unavailable; the Code Mode source readback/evaluation was used rather than claiming a Node source check that did not occur.

## Exact V8 source-fixture counts

| Assertion / fixture dimension | Result |
| --- | ---: |
| Pressure range tested | 3..18 |
| D20 faces enumerated at each of 16 pressure sums | 20 (320 comparisons) |
| Ordered 3D6 outcomes enumerated | 216 |
| 3D6 CDF levels checked | 16 (3,456 comparisons) |
| Distinct entire staged model scripts (n=2..6 × fail policy A/B × refresh 1/3) | **20** |
| Fifty-card ledger audits | **150** |
| Asserted state transitions in source fixture | **120** |
| Exact no-phantom-stock fail-closed cases | **5** |
| Complete automated game matches | **0** |
| Human player sessions | **0** |
| New R25 HTML/browser tests | **0** |
| Public site / Cloudflare Stage revision verified | **0** |

The source fixture preserves **6 occupied outer card slots**, die positions at three distinct outer slots, faces 1..6, central die-free FOCUS; each ordinary narrative ID from 0..49 occurs **exactly once** among the six outer slots, one center, n human hands, stock, trophies and discard. In the sample, the participant publishes one existing hand card, moves a die legally, loses or exchanges a staked card on failing a Claim, then an eligible current actor claims FOCUS, replaces one or three outer cards, resets dice faces to 1, and receives exactly one center trophy. Additional scenarios exhaust one hand and draw one from stock, or exhaust stock and verify no invented replacement cards. **These are constructed transitions, NOT simulations of human card choice, match length, balance or NPC strategy.**

## Exact mathematical comparison (single unmodified claim attempt)

| Visible pressure S | D20 ≤ S | 3D6 random roll ≤ S |
| ---: | ---: | ---: |
| 3 | 3/20 = 15% | 1/216 ≈ 0.46% |
| 6 | 6/20 = 30% | 20/216 ≈ 9.26% |
| 9 | 9/20 = 45% | 81/216 = 37.50% |
| 12 | 12/20 = 60% | 160/216 ≈ 74.07% |
| 15 | 15/20 = 75% | 206/216 ≈ 95.37% |
| 18 | 18/20 = 90% | 216/216 = 100% |

**These are theoretical single-attempt odds**, conditional on a visible S. They are not observed victory probabilities: who gets the next claim, when a player chooses to challenge, when a player runs out of hand cards, how often the table resets and which card is collected can dominate overall win rates. No automatic "Solution" win is encoded.

## Findings, caveats and next gate

- **A linear D20 is the cleanest first comprehension comparator** for Georg's "hard initially, easier later" idea. It requires one **separate randomizer**; the colored board dice stay untouched. Three separate D6 give a steeper nonlinear curve and certain eventual success when S18. Neither has been physically tested.
- **Hand loss vs redraw is consequential:** if trophies win, fail-and-draw extra cards is not necessarily a failure cost. R25 tests a real hand stake (lost on fail) versus a softer discard+replacement policy. Optional PUBLISH creates visible public card change from the existing three-card private hands; both use real card IDs and no numeric card powers.
- **Refresh 1 vs 3** only verified card conservation and distinct occupied die slots; it does not measure memory burden. Refresh 1 plus center=two newly exposed ordinary narratives per success. Refresh 3 plus center=four. Both remove previous ordinary cards to discard, never steal faction identity.
- **R23's deterministic TILT at beat19** was under continuous mandatory MOVE+TURN without card draws/claims/resets. R25's optional Claim capture and zero-hand DRAW change case length: do not carry the 19-beat statement forward as universal.
- **Stock exhaustion, reserve access, turn order at reset, and scoring** are candidates. The test never executes a closed 2–6-human match or the original R19 HTML.

**ONE NEXT PRODUCT GATE:** six actual titled/illustrated outer cards plus Focus in 2H+4NPC, three pressure D6 and one real isolated capture randomizer D20: humans stage narrative MOVE+TURN and choose early/late CLAIM, paying one named hand-card stake; compare losing it vs drawing replacement, and refreshing one vs three outer cards; short 6H tempo comparison. Georg **KEEP/TUNE/FAIL** on sum-capture and living cards. Independent R24 Claude Design 3D scene continues separately; do not wait for WSB or claim visual/Stage acceptance.
