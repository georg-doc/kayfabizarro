# THE INVISIBLE HANDSHAKE · R0.5 · Reproducible Bot Diagnostic / Overton Probe
**Date:** 2026-11-17 · **Owner:** `games/invisible-handshake` · **Branch:** `design/invisible-handshake-paper-r0-2026-11-17` · Draft PR #475.
**Evidence category:** COMPUTATIONAL SIMULATION, **not human playtesting**, not clinical/real-world behavioral evidence, not game balance acceptance.

## Setup of actually executed baseline simulation
Python 3 simulator saved locally as `invisible_handshake_sim_r05.py` and JSON `invisible_handshake_sim_r05_results.json` in this ChatGPT conversation; generated via `--games 250 --seed 20261117`. 14 scenario variants × 250 games = **3,500 simulated full eight-round games**, containing a total of 250×8×(nine multiplayer player counts 2/4/6 across three veto policies + 3 solo variants + 2 role-bonus control cases) = **112,000 human-bot turns**? **Do not use this derived number**; see exact counts by type below. Actual simulator turn count is 250×8×[(2+4+6)×3+1×3+2+6] = **94,000** player turns, plus 3×250×8 = **6,000 System actions**. Some actions are RECRUIT, POACH or PLOT; no forced storytelling was implemented. (Counts are arithmetic, not time measurement.)
- Institutions: 30 names and directed RESOURCES/RULES/INFLUENCE pairs copied from R0.3, one physical copy each; eight round EVENTS (four PUBLIC HEARING and four EXPEDITED FUNDING); 12 PLOTS (four copies each of R0 effects).
- 2–6 players: one face-up MARKET of 4, 3-card network cap, FAVOR cap3, +1 before action, one-action turns, POACH one defender reaction, score only at end of eight rounds. Four of six ROLE agendas not authored, so **no role bonus in main comparisons**. Two bonus-aware control scenarios at 2/6 using only R0.4's two authored role effects are separate and not balance claims.
- Automated player policy: seeks higher immediate score, considers rival losses, plus 18% random selection among legal actions. It is **not human decision-making** or a proof that an optimal strategy exists.
- VETO variants: `ALWAYS` whenever affordable; `SELECTIVE` when loss of defense score >=3; `NEVER` for multiplayer. Solo System, as R0.4 specified, always auto-vetoes while it has FAVOR even in the human `NEVER` experiment.
- Conservation and 0..3 FAVOR / max three network capacity asserted throughout. R0.4 solo candidate used one open System-owned Institution with deterministic recruitment/poach priorities; older R0 market-denial bot not benchmarked here.

## Results: main 2–6 player policies
| Players | Veto style | Attempts/game | Successful POACH | Mean final score/player | Shared-win % |
|---:|---|---:|---:|---:|---:|
| 2 | Always | 6.88 | **5.6%** | 4.432 | 26.0% |
| 2 | Selective | 7.37 | **11.7%** | 4.220 | 28.0% |
| 2 | Never | 6.91 | **100%** | 3.692 | 19.6% |
| 4 | Always | 17.33 | **18.6%** | 4.282 | 12.8% |
| 4 | Selective | 17.80 | **26.9%** | 4.375 | 13.6% |
| 4 | Never | 18.44 | **100%** | 3.614 | 12.0% |
| 6 | Always | 30.42 | **29.5%** | 3.729 | 12.0% |
| 6 | Selective | 30.12 | **34.8%** | 3.875 | 10.0% |
| 6 | Never | 29.66 | **100%** | 3.659 | 15.2% |

**Interpretation:** The R0 VETO is extremely efficient at two seats. The allowed RECRUIT fallback reduces outright wasted turns but can turn supposed subterfuge into repeated visible ordinary recruitment. At six seats, more available targets distribute defenders' FAVOR and open more successful POACH routes; however **30+ POACH attempts per game** under these bots may be excessive for live players. A timing claim from bot runs would be invalid.

**Ending sensitivity:** Four of eight Event cards are `PUBLIC HEARING`; probability the last random Event is that card is **50%**. Since final scoring occurs *before* end-of-round suspension clearance, a full network often loses its supplier and therefore multiple NEED scores in round eight. This can dominate results and contributes to the surprisingly low mean final scores. Needs real human test and/or a revised end-game rule. It is not a POACH bug by itself.

## Solo sidecar experiment · 250 games per veto policy
| Human veto choice | Human win % | Human tie % | Human avg final score | POACH success % |
|---|---:|---:|---:|---:|
| Always if able | 73.6% | 26.0% | 9.348 | 6.4% |
| Selective >=3-loss | 71.6% | 26.0% | 9.024 | 14.0% |
| Never (System still auto-VETOs) | 23.6% | 16.0% | 5.168 | 61.5% |

**Interpretation:** Whether the human uses VETO matters more than the System's apparent strategic intelligence. System starts with one free Institution; human has a Plot and an Agenda; these are deliberate asymmetries but unbalanced in the current diagnostic. No claim that solo is currently fun or fair.

## Overton Window R0.5 state probe · 12 pure card-cost cases × four FAVOR inputs
The independent **Node.js** `OVER_TON_WINDOW_PROBE_R05.js` was run with four Market positions and two adjacent "mainstream" slots, yielding 3 positions of the Window. **12 distinct position×card-cost checks** and **48 affordability checks (3 window positions ×4 Market slots ×4 previous FAVOR values)** all PASS. Of 48 combinations, **24 are free** and **24 cost 1 FAVOR** after normal +1 gain. There are **4 valid adjacent moves** and **8 legal shift+recruit pairs**. This is a mechanical proof of legal-cost states only. It is NOT an 8-round simulation of this new rule and does not establish whether the random market row makes a believable political discourse.

## Candidate improvements and STOP conditions, not adopted rules
1. **Veto lock:** Test one visible limited veto condition or reserve costs (one VETO per round, or different 1-FAVOR economy) **only after** human confirms that repeated POACH denial is not entertaining; no automatic extra counteraction.
2. **Finish event:** Compare R0 final Event with `score after clearing final suspension` (or finish event always different) to isolate the last-round penalty; do not silently patch the eight-round original.
3. **Overton window:** As the new candidate's outside-Market RECRUIT spends FAVOR, it *might* reduce easy VETO reserve. Test this with actual human players before claiming its size/direction.
4. **Genuine Overton semantics:** Spatial market aperture is a rough metaphor. If it feels arbitrary, reject A and only then test a one-issue five-position strip B.
5. **Solo:** Monitor automatic veto frustration and large win-rate swing; avoid building a distinct Solo deck or complex political AI.

## Source/input provenance
GitHub SSOT R0/R0.3/R0.4 was read before design. Public external game references: publisher rules of JUNTA, original Sun Tzu and Machiavelli public texts, Hegel Stanford Encyclopedia, Overton Mackinac descriptions and current KFB Freestyle page. See R0.5 design and research brief for URLs. No verified Stage page or runtime product. **No GitHub branch auto-merge, 0 human games, 0 measured turn seconds.**

**One gate:** A/B physical 2-player microgame **without vs with window**, 12 cross-sphere proxy cards and one optional solo turn; track number of POACH attempts/denials, end-score effects and whether public-discourse move feels meaningful.
