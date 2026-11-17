# R13 · Free choice exposes a claim-denial loop

17 November 2026. Existing owner, design branch and draft PR475. No Site/runtime changes. Full method in METHOD.md; source, results, fixtures and independent review included.

## Main finding

All four action types have distinct immediate uses, but unrestricted movement dominates the tested deliberate policies, and movement plus swapping almost eliminate scoring. The shorter hold alone does not solve this. Do not promote this free menu as a balanced game.

Four-action menu, 18 rounds, mean trophies per player:

| Players | Mixed policy trophies | Denial policy trophies | Denial games entirely scoreless /100 |
|---|---:|---:|---:|
|2|5.38|1.82|23|
|3|2.29|0.17|68|
|4|2.06|0.11|75|
|5|1.93|0.03|89|
|6|1.76|0.02|90|

At six players under denial, move accounts for84.8% of turns, swap13.7%, adjust1.4%, reroll0.2% (rounding).99.9% of resolved claims are destroyed. The build-weighted policy behaves similarly:0.02 trophies/player and90 scoreless tables. Mixed behavior gives movement47.9%, swap21.1%, adjust17.7%, reroll13.4%, but half its decisions are random by construction; that spread is not evidence of balanced utility. Mixed resolved-claim loss remains83.1%.

The loop is understandable: a supporting die can be taken from a rival's claimed card and brought to the actor's own card in one action. The next actor can do it again. Only three shared dice support up to six signature cards. Swapping can also transfer a blocker while acquiring a useful die. These policies expose a failure case; they do not prove all human strategies fail.

## Distinct uses, not four equally strong options

- Move: steal support while opening your own claim. Frequently the best immediate category.
- Swap: trade your extreme-value blocker for the rival's useful die, attacking and preparing in one action.
- Adjust: controlled boundary crossing or exact eligibility changes. Deterministic does not mean harmless:1→0 or6→7 resets to3 and replaces the card.
- Reroll: risky attack on stacked stable dice. If a rival has3 and4 together, changing one by±1 cannot immediately invalidate that card. Rerolling one has a2/6 chance of producing1 or6 and invalidating it. This can preserve the actor's separate claim opportunity.

A separate5,000-snapshot probe found unique immediate-best categories: move1,753; swap327; adjust303; reroll24; flip0. Remaining snapshots have ties. This is neither a reachable-state census nor long-run strategic dominance.

Focal omission tests remove only one option from player0; opponents keep all four. Removing move reduces already scarce focal scoring at every tested count. Other removals show policy-dependent effects. In particular, removing adjust at two players improves focal trophies from1.71 to6.01: the greedy policy's own action evaluation can harm its later outcome. Therefore action frequencies and omission deltas must NOT be presented as optimal strategy or a clean causal ranking. No statistical intervals computed.

## Opposite-face flip

Flip means7−value:1↔6,2↔5,3↔4. It changes no location and cannot cross a boundary.2→5 is a useful immediate eligibility change, but2→3 via adjust already qualifies under the current generic rule.1↔6 remains blocked;3↔4 stays eligible. Five-action denial at six players still yields about0.02 trophies/player,99.9% claim loss, and86 scoreless tables; flip use is0.1%. It does not repair the loop. Mixed-policy improvement is partly a changed distribution of deliberately random choices, not evidence that flip is strategically necessary.

Keep flip as an optional design idea, not an adopted fifth core action. Value-sensitive or emotion-specific goals could change its role; these are not modeled.

## Latest user steering: draw and intentional tipping

Drawing a new hand card may become a full turn action. It is NOT simulated here because this model has no hand or card-play effects. A future comparison must connect drawing to an actual playable option, maintain the agreed hand limit, and decide whether drawing replaces automatic refill; otherwise a draw-only turn is an unmodeled pass and can hand opponents a payout.

User proposes earning cards by developing or defending a chip-marked narrative, including deliberate upper/lower tipping, rather than solely waiting in3–5. Record as PROPOSAL, not a rule change or test result. The current simulation gives no trophy on tipping; changing that requires a fresh scoring comparison.

Recommended next bounded question: can a claim be resolved through a meaningful stability OR tipping outcome instead of unrestricted support theft followed by waiting? Define who receives the card when its die crosses0/7 (chip owner, acting player, or nobody) before testing; these alternatives have different incentives. Do not award every tipping actor automatically, which could reduce play to collecting easy boundary targets. Fear/Hope/Hate should explain the distinct public reaction; their names currently have no asymmetric mechanical effect.

## Evidence and next step

5,000 simulated games:3,000 menu comparisons and2,000 focal omissions;5,000 separate static snapshots. Seven explicit fixture groups plus independent checks; accounting and range assertions every turn. No human fun, real card semantics, finite deck, faction balance, solo or optimal play tested. Next step: specify and compare one claim-resolution variant centered on stabilization versus tipping, with a coherent draw/play hand loop, before any Site implementation. Existing prototype unchanged.
