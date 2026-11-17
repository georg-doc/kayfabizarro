# Invisible Handshake · Independent mechanics review for R0.7

17 November 2026. Analysis of the existing rules, not human playtesting or acceptance of a new build. No production files modified.

## Sources actually read

Repository `georg-doc/kayfabizarro`, branch `design/invisible-handshake-paper-r0-2026-11-17`, owner `games/invisible-handshake/`:

- [PROTOTYPE_R0.md](https://github.com/georg-doc/kayfabizarro/blob/design/invisible-handshake-paper-r0-2026-11-17/games/invisible-handshake/PROTOTYPE_R0.md), blob `bbf2b68bb09f79af14bd50810a05e49abfe0873c`.
- [PROXY_12_AND_SOLO_R04_2026-11-17.md](https://github.com/georg-doc/kayfabizarro/blob/design/invisible-handshake-paper-r0-2026-11-17/games/invisible-handshake/PROXY_12_AND_SOLO_R04_2026-11-17.md), full text read.
- [BORROMEAN_RAF_PYRAMID_R06_2026-11-17.md](https://github.com/georg-doc/kayfabizarro/blob/design/invisible-handshake-paper-r0-2026-11-17/games/invisible-handshake/BORROMEAN_RAF_PYRAMID_R06_2026-11-17.md), blob `5a711778c1318d68e3bd4309510784a6d4c2493c`.
- [SIMULATION_R05_REPORT_2026-11-17.md](https://github.com/georg-doc/kayfabizarro/blob/design/invisible-handshake-paper-r0-2026-11-17/games/invisible-handshake/SIMULATION_R05_REPORT_2026-11-17.md), blob `dc786d0434c3671e1504e9b8bdd7f6c15c1b2d7f`.

The R05 bot results were read, not independently reproduced. They describe proxy policies, four missing role agendas and no human timing. Their always-VETO two-player success rate of 5.6% warrants a diagnostic, not a claim of proven unfun gameplay.

## Keep the existing game

Preserve one shared 56-card set (6 roles +30 institutions +12 plots +8 events), four-card public market, three institutions per network, one held Plot, eight rounds, one main action each turn, +1 FAVOR before action capped at3, at most one defender reaction, no elimination and optional narration without scoring. RESOURCES/RULES/INFLUENCE are channels, not additional currencies. Needs require another active supplier. No self-supply, hidden historical truth score, free-form judicial voting or second solo deck.

## Recommended bounded R07 candidates

1. **VETO costs 2 FAVOR.** POACH still costs1, Compromising File costs0, one defender only, fallback RECRUIT remains. Compare directly against cost1 with identical seeds and bot policies. Once-per-round VETO would chiefly change multiplayer pile-ons; it leaves most two-player locks intact because there is normally only one hostile turn per round. Cost2 creates a visible reserve tradeoff without a new token or exception. It does not guarantee a balanced takeover rate.
2. **Reserve one EXPEDITED FUNDING for round8.** Shuffle the other seven events. The count remains four Hearing +four Funding and all eight are used. This removes the 50% involuntary final Hearing lottery. Keep tactical Plot suspensions through final scoring, since otherwise the last player's Injunction becomes a dead card. Make the final Funding visible in setup and explain it. Compare separately from VETO tuning; do not conflate their effects.
3. **Complete costs explicitly.** Every RECRUIT, including fallback and Bailout, pays the selected frame's0/1 cost unless a card explicitly waives it. Bailout pays before gaining its1 Favor. After a failed POACH, fallback may be unaffordable; in that case the turn ends without recruitment. Never allow a negative balance or silently make fallback free. Reserve sufficient Favor before attacking if fallback matters. Alternative free-fallback rule is possible, but must be declared and separately measured.
4. **Three MOVE THE FRAME copies within12.** Use3 Audit +3 Broker +3 Bailout +3 Frame. This reuses the existing four effect families and reduces the chance that the headline board remains static. No separate free rotation on every turn. In setup ensure at least one Frame is among the dealt initial Plot hands by swapping with the first held Plot if necessary; do not promise all six players a Frame with only three copies. Record this non-random tutorial aid and allow a fully random advanced setup.
5. **Frame alternatives stay exclusive.** Pyramid: R/A/F each start3 in original positions; unique high die gives free matching supply, ties cost1; a Frame Plot chooses one legal ±1 step or swaps two positions and then recruits. Window: start slots2–3 free in the four-card market; Frame shifts one position without wrapping then recruits. Never apply both price functions. Call both a gameplay framing metaphor, not a validated model of political acceptability.

## Important existing role defect

The Licensed Dissenter's +2 for an unmet need mathematically compensates exactly the2 points sacrificed by that need. With three active cards its maximal base+agenda is9; the Elite Recruiter can reach11 with a complete three-channel cycle. This is a structural ceiling difference, independent of bot skill. Do not fill four missing roles and call all six balanced without addressing this.

Smallest candidate fix: `THE LICENSED DISSENTER: +2 if your active network contains exactly two distinct SUPPLIES channels.` A two-channel network can have all three needs met, making11 attainable, while the Elite Recruiter continues to seek all three channels. Both remain situational, not equal probabilities. Treat this as R07 text, preserving the older +unmet-need rule as historical.

For remaining four role agendas, prefer explicit end-state predicates that can each coexist with a nine-point network. Examples to TEST, not accepted card copy: a balanced dependency cycle; three distinct thematic spheres; two institutions sharing a NEED; finishing with3 FAVOR. Do not make six roles secretly six fixed different difficulty settings. Return role-specific scores/wins and condition frequencies. No new role power is necessary for the first playable build.

## Solo and player types

Use existing R04 network-owning System as the transparent beginner opponent: one starting institution, no role/Plot, +1 Favor, same cap/costs, leftmost eligible POACH to satisfy an unmet System need, otherwise leftmost helpful recruit, replace leftmost when full, VETO if affordable. Human first each round, score against System, ties favor System. Apply R07 VETO and final-event changes to both. Display the forthcoming System rule in plain language, not a fictional intelligent dossier.

This baseline is deterministic and exploitable. An optional strategic bot can use the SAME legal-action engine and public information, not private hands or future deck peeking. It may evaluate net own score gain, opponent score loss, favorable frame access and Favor reserve. Label this computer difficulty separately from rules. Solo win rate from bots is not a human difficulty rating.

Multiplayer prototype may be shared-screen/pass-and-play, with1–6 human/bot seats and a privacy handoff for the held Plot. If no room service exists, say explicitly that remote synchronized multiplayer is not implemented. This still provides an online playable solo and local2–6 prototype. Do not suggest that six names in a menu prove six networked browsers work.

For simulation and future human tests include: builder (max own dependencies), raider (relative-score POACH), conservative (reserve/VETO), framer (frame impact), opportunist (best immediate gain), exploratory/random. Rotate seats, roles and policies. These are strategies, not psychological diagnoses of real players. All use identical legality.

## Downtime and presentation

Keep one reaction prompt only for the attacked owner; no table-wide poll. Show affordable actions, score changes and dependency arrows before confirmation. Keep new information local: board focus changes, market refill, stolen node and satisfied/broken links. Fixed three-node capacity is helpful at six seats. A3D table is a view of canonical state, not a second rules engine. Provide a readable2D list/action panel and reduced-motion option; neither camera control nor narration should be required to finish a legal turn.

Eight rounds at six seats means48 actions, not a measured duration. Digital animations should be skippable; no automatic public timer forfeits a turn. Log turn counts and clicks; collect actual human duration later.

## Independent test plan for the implementation

**Core invariants:** unique physical card IDs across all zones;56-card classification; institution conservation30; correct role/Plot/event disposal; max3 institutions/1 held Plot/Favor0..3; active suppliers only; suspended targets/need status explicit; successful POACH transfers once; VETO spends once and opens only one fallback; illegal actions don't alter state; seeded reproducibility; exactly8 rounds and no postgame turn; save/load roundtrip.

**Edge fixtures:** zero Favor after attack +paid fallback; payout ordering on Bailout; replacement is chosen before evaluating target network; simultaneous Hearing on six full networks; final Funding; last-turn Audit; tie for highest pyramid die; ±1 at1/6; all six swaps/permutations; market refill under each window position; plot stock exhaustion; last institution supply refill; role agenda true/false cases.

**Simulation matrix:** player counts1–6, pyramid/window modes, seeded paired comparisons for VETO1/2 and final event random/reserved, balanced role/seat assignments. Report game completion, legal error count, takeover attempts/successes, veto/fallback failures, Frame usage/focus changes, score/tie distributions and first/last-seat effects. Do not tune on one policy alone or set an unsupported universal target for theft frequency. A minimum useful initial matrix is100 seeds ×6 counts ×2 modes; optional paired rule variants separately.

**Human gate after playable delivery:** Can a new player complete one round without explanation, recognize why a dependency changed, and choose a framing action because it matters? Does the game remain engaging while waiting at six? Is the satire specific to incentives rather than decorative labels? These questions cannot be passed by enumeration or synthetic bots.

## Current status

Independent design critique complete. Engine tests pending receipt of implementation. No human games, no timed turns, no claims of game balance or enjoyment. R07 proposals above require implementation and comparative tests before claiming improved behavior.
