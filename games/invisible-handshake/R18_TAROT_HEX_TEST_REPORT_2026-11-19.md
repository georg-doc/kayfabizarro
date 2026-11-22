# R18 Seven-card Tarot Hex · Static Test Report

**19 November 2026 · STATIC GEOMETRY / CARD BUDGET ONLY, NO GAMEPLAY ACCEPTANCE.**
Owner: games/invisible-handshake/ · Draft PR #475 · [R18 design](R18_TAROT_HEX_SEVEN_CARD_READING_2026-11-19.md) · [reproducible source](R18_TAROT_HEX_STATIC_PROBE.js).

## What was actually executed

Ran the same pure JavaScript function saved in R18_TAROT_HEX_STATIC_PROBE.js in an isolated V8 JS execution during this chat. It completed without thrown assertions. The GitHub source file and design document were written and read back on the branch after each write. **This is structural enumeration, not a full game simulation or independent human test**. There was no Node CLI invocation, no device/browser proof, no PDF, new sprite, donor-image adoption, Site deployment, Stage or Live verification.

| Check or enumeration | Result |
|---|---:|
| Exactly seven distinct spread positions, six outer vertices, one center | PASS |
| Hexagon perimeter uses six unique outer positions | PASS |
| Seven distinct provisional textual card titles | PASS |
| Unchanged six faction + fifty narrative card budget | **56 PASS** |
| Player-count setups | **5** (2, 3, 4, 5, 6 humans) |
| Legal distinct three-die placements across all counts | **600** (120 per count) |
| Legal MOVE outcomes from enumerated placements | **5,400 PASS** |
| Legal SWAP outcomes | **1,800 PASS** |
| Legal trigger-die placements after single outer-card removal | **1,800 PASS** |
| Six-faction placement permutations for six outer vertices | **720 PASS** |
| Four card-conservation ledgers × five player counts | **20 PASS** |
| Dice wrongly placed on FOCUS | **0** |
| Constructed 2-human positive collapse and 6-human HOPE MOVE | PASS |

The conservation checks cover (1) original occupied board, (2) one outer trophy/discard, (3) *optional separate* R17 B outer+Focus capture, (4) later Focus refill from existing stock. They are arithmetic only: no dynamic event deck, card exhaustion policy or complete match simulation.

| Human / NPC outer slots | Opening stock | R17 B optional other-human HOPE eligibility in enumerated actor/position states |
|---|---:|---:|
| 2 / 4 | 37 | 40 / 240 = 1/6 |
| 3 / 3 | 34 | 120 / 360 = 1/3 |
| 4 / 2 | 31 | 240 / 480 = 1/2 |
| 5 / 1 | 28 | 400 / 600 = 2/3 |
| 6 / 0 | 25 | 600 / 720 = 5/6 |

These are *uniform state counts*, not probabilities measured in actual strategic play. The count independently reproduces the earlier R17 B player-count imbalance and **does not validate R18's satirical gameplay or reading quality**.

## Unresolved / intentionally not claimed

- **0 human sessions, 0 timed turns, 0 complete R18 games, 0 human verdicts**.
- No measured effect of Tarot position labels on strategy, fun, accessibility, card identity or six-player downtime.
- No verified production art, image/source isolation, print sheets or finished 50-card narrative text inventory.
- No new RPG oracle scoring, no seven-card draw added to the deck, no balance adjustments to 5→6, NPC pulse, R17 B payout, stock exhaustion or finite end condition.
- Previous 6,000 R14 bot games had a **different geometry**, so must never be counted as R18 game evidence.
- The supplied seven-position image provides labels/reading structure only, not a verified source for supernatural efficacy or any existing KFB visual asset.

## Single next product gate

Physically compare **R17 A plain** to **R18 B seven-position reading overlay** on the same seven named proxies, first with **2 humans +4 NPC**, then a short **6-human** trace. If using multi-turn NPC behavior, explicitly fix R16 **NPC A** collective pulse, not NPC B. Record seconds per action, exact HATE/FEAR/HOPE title references, whether position/lens altered a *meaningful choice* and whether payoff is understandable. Keep the optional R17 B Focus-payoff challenger separately labeled. Georg decides KEEP / TUNE / FAIL for the reading overlay, not for the old R0.4 network product. No merge, promotion or Stage.
