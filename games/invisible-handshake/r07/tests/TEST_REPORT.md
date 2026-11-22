# Invisible Handshake R07 · Independent engine tests

17 November 2026. Tester did not modify production engine.

Engine SHA-256 actually tested: `c7bd234135545cc3d40ac67ed0a34aa4de7a9141261cdc4a42347ea0ab1b38c3`.

Reproduce: `node tests/simulate.mjs` from the R07 package (the script locates sibling site/dist).

## Executed evidence

- 1,200 complete eight-round games:100 seeds ×counts1–6 ×pyramid/window. Solo runs two seats (human proxy +System).
- 600 bounded paired diagnostics:25 seeds ×counts1/2/6 ×two frame modes ×VETO1/2 ×random/reserved final Funding.
- 51,200 completed player/System main actions.
- 90,539 state invariant checks; zero assertion, conservation, negative-Favor, capacity or nontermination failures.
- Ten explicit fixtures passed; list below.
- All4,060 three-institution subsets evaluated for all6 role agendas, withFavor3.
- Human games0; measured human turn times0; browser input/render tests not performed by this tester.

## Method and important limits

Bulk games use test-owned, deliberately inexpensive public one-ply policies in `simulate.mjs`, passing every action through the production `legal/apply` engine. These are NOT the Site chooser and do not establish its strategy or win rate. Policies rotate across six types: builder, raider, conservative, framer, opportunist and explorer. Non-explorer policies veto whenever affordable; explorer sometimes allows. The framer policy adds preference for Frame usage but does not optimize the proposed die direction; its sparse pyramid focus changes must NOT be interpreted as proof that humans cannot manipulate the pyramid effectively. It scores the current frame price, another explicit approximation.

The initially attempted full Site-chooser bulk run was interrupted for excessive computation and is not counted. An independent code review found hidden-next-event lookahead in the Site chooser; the integrator repaired it by stopping preview transitions before round advance. A dedicated six-policy fixture now confirms that changing the hidden next Event does not change the chosen action in the tested state. This is a bounded regression fixture, not exhaustive information-flow proof.

The Solo System in this implementation uses a common heuristic chooser, not the exact older R04 leftmost policy; it starts with one institution and lacks Role/Plot. The bulk test substitutes its own public policy, so the recorded solo wins below describe that proxy contest only.

`ties` and `seatWins` in the machine file mean **equal highest raw score / seats sharing highest raw score**, before Favor tiebreak. They must not be presented as final multiplayer winner counts. SoloWin uses strictly higher raw score, a raw-score-only proxy statistic, not the Site winner rule (which first uses Favor to break equal scores).

## Main matrix (100 games per row)

|Frame|Human count|Mean score per seat|POACH success|Raw-score ties|Frames used|Focus changes|Solo proxy wins|
|---|---:|---:|---:|---:|---:|---:|---:|
|pyramid|1|7.12|80.6%|11|130|9|52|
|pyramid|2|7.26|73.1%|9|207|17|—|
|pyramid|3|6.67|77.9%|15|225|22|—|
|pyramid|4|6.17|79.6%|27|262|21|—|
|pyramid|5|6.00|79.9%|32|265|29|—|
|pyramid|6|5.66|82.3%|39|264|21|—|
|window|1|7.76|59.9%|3|130|130|54|
|window|2|7.96|54.6%|17|198|198|—|
|window|3|7.21|61.1%|30|216|216|—|
|window|4|6.56|67.8%|31|238|238|—|
|window|5|6.71|70.5%|53|247|247|—|
|window|6|6.57|72.5%|55|254|254|—|

## Paired interpretation

- pyramid, VETO1: 1277/2200 successful takeovers (58.0%), 245 unaffordable fallback occurrences across150 games.
- pyramid, VETO2: 1940/2423 successful takeovers (80.1%), 74 unaffordable fallback occurrences across150 games.
- window, VETO1: 794/2016 successful takeovers (39.4%), 0 unaffordable fallback occurrences across150 games.
- window, VETO2: 1558/2271 successful takeovers (68.6%), 0 unaffordable fallback occurrences across150 games.

Cost2 reduces effective veto locking under these policies, but high takeover turnover may create a different problem: endgame last-mover advantage. Counts2/3/6 end round8 with seat0 under the rotating-start formula, and that seat disproportionately shares/holds top raw score. Roles and strategy assignment also vary; this is a warning for human tests, not a causal estimate. Do not call the game balanced.

Reserved final Funding removes the particular random final Hearing event by construction; it does not remove tactical final Audit or last-move POACH. Aggregate mean scores and policy-specific results cannot establish enjoyment. Full paired rows preserve both versions for later inspection.

## Role enumeration

|Role|Maximum score|Three-card subsets reaching11 atFavor3|
|---|---:|---:|
|Elite Recruiter|11|1000|
|Licensed Dissenter|11|300|
|Coalition Builder|11|772|
|Bottleneck Broker|11|1050|
|Rainy Day Consultant|11|1300|
|Systems Architect|11|1300|

The old Dissenter ceiling defect is corrected: all six can reach11. Access remains unequal: only300 combinations reach11 for Dissenter versus1,000 for Recruiter; these combinations are not uniformly likely chosen networks. Rainy Day enumeration assumesFavor3, so its cost is omitted from this static table. No claim of equal role strength follows.

## Explicit fixtures

- Illegal move does not mutate original — PASS.
- Seed repeatability — PASS.
- Frame tie and unique leader costs — PASS.
- Frame bounds and swap count — PASS.
- Window all12 index cost cases — PASS.
- Independent cycle score and suspended supply — PASS.
- Veto exact payment and unaffordable fallback — PASS.
- Allow transfers once and replacement conserved — PASS.
- JSON restore produces same next transition — PASS.
- Bot choice independent of hidden next event — PASS.

## Remaining acceptance questions

1. Actual human decision quality and play duration, especially six-seat waiting and last-mover advantage.
2. Meaningful pyramid rotations chosen by people/stronger frame-aware policy, versus current cheap-bot direction bias.
3. Role balancing beyond reachable ceilings.
4. Browser persistence, input, visual legibility and online publication belong to integrator/browser QA, not this report.
5. This is a playable rules candidate with passed computational invariants, not a validated final card game.
