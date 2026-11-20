# R14 · Harvest works; preparation is appropriated

17 November 2026. Concept simulation only, existing owner/design branch/PR475. See METHOD.md for exact rules and limits. No Site/runtime change.

## Answer

The revised system produces trophies and makes draw/play consume real turns. It does NOT make deterministic preparation privately rewarding under immediate-harvest opponents. Whoever changes5→6 exposes a guaranteed point to the next player, who can freely adjust that same die6→7. Location and faction do not protect the preparer.

Across deliberate-policy groups,44,242 adjustment preparations reached6;43,839 were subsequently harvested. ALL43,839 were harvested on the immediately following turn by another player. Zero returned to their preparer. The remaining403 are not all live claims: the endpoint can censor preparations. This metric follows the die, not necessarily the same card if relocated, though these deliberate scripts do not use relocation actions between preparation and harvest.

This is also a local rule consequence, not merely a statistical surprise: a visible active6 offers an immediate trophy to the next actor. Hidden preferences could make that player decline, but the common score gives no reason to wait.

## Throughput over24 own turns

Mean trophies/player,200 games per row/profile:

| Players | Everyone prepares | Everyone avoids5→6 and rerolls | Mixed behavior |
|---|---:|---:|---:|
|2|4.50|2.92|3.42|
|3|4.51|2.97|3.54|
|4|4.50|3.02|3.46|
|5|4.58|3.00|3.51|
|6|4.52|2.96|3.46|

No entirely scoreless game in these three profiles. This does not prove waiting impossible: the 'waiter' deliberately rerolls, which sometimes supplies the next player's6. The unrestricted random profile produced28–101 scoreless games/200 depending on player count. These are24-round stress tests, not completed games, and are not directly comparable with the older18-round claim simulations.

## Preparation versus appropriation

One builder among waiters:

| Players | Builder's mean trophies | Mean per opposing waiter |
|---|---:|---:|
|2|1.85|6.97|
|3|2.76|5.22|
|4|2.71|4.79|
|5|2.67|4.54|
|6|2.87|4.34|

In these fixed scripts the lone preparer loses relative to the others. The reverse configuration does NOT show a universal waiter advantage: at six players one waiter among builders gets4.33 versus4.56 per builder. Seat order, replenishment and cycles matter. No equilibrium, optimal-play or global dominance claim is justified.

All-builder tables progress because players continually supply opportunities to one another. That is collective productivity, not a reward tied to one's own preparation. In a hypothetical all-refusal policy, unchanged-value relocation can cycle indefinitely without scoring; the rules do not force progress.

## Cards and actions

A real finite50-card conservation assertion passes every turn. Draw adds one card (max6); play spends one hand card to fill the player's own empty slot. No automatic replenishment. In mixed tables, play takes about14% of actions and draw about7–8%. No stock exhausted in the builder/waiter/mixed runs over this horizon; no forced no-legal-action passes there. Thus basic hand handling works, but these runs do not establish the complete endgame or severe hand scarcity.

An additional incentive needs attention: the contributor pays the future replacement cost, while anyone can harvest that card. Refilling one's empty slot is hard-coded into the deliberate scripts, not proven rational. Players could prefer to let others supply the public card pool. Uniform redistribution after resolution is another fixed policy, not optimized actor choice.

Lower-boundary burning is implemented and checked. Deliberate builder/waiter scripts never choose it; mixed profiles produced21–47 burns per200 games. No claim that sabotage is balanced or sufficiently rewarding follows.

## Secret objectives

See HIDDEN_OBJECTIVES.md. They could create partly aligned interests and surprise, but random assignment is not balancing. A later clean comparison could start with identical private goals differing only by emotion label, e.g. two personal harvests via the assigned emotion. This is a proposal, not a tested threshold or new approved component.

Secret goals do not fix the core5→6 gift. They change who wants which harvest; they do not give the preparer a secure opportunity. Do not use them to conceal a basic incentive problem.

## Verdict and next step

Keep open harvesting, separate draw/play and actor ownership of earned trophies as a candidate. Do not declare the preparation loop balanced. The next bounded experiment should compare a risky same-turn harvest opportunity against the current guaranteed next-player harvest, before adding secret goals or more faction powers. No precise replacement rule is adopted here; approval/testing of any such change remains separate.

Evidence:6,000 games (5 counts×6 configurations×200 seeds), conservation/range assertions every action, independent source review and targeted fixtures. No actual card semantics, NPCs/solo, human enjoyment, diplomacy, faction powers, optimal lookahead, confidence intervals or full-game victory tested.
