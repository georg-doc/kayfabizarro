# Invisible Handshake R08 · Independent scoring comparison

17 November 2026. Only test files modified by this tester. Production implementation remains with the integrator.

## Recommendation

Use **own-turn base-point banking**: after a player finishes their action, including its one defender response and any fallback, bank1 point per active institution plus2 for each satisfied need. Do this before the next turn or round Event. Every player gets exactly8 deposits. Add the Role agenda once at the end; multiplayer ties use Favor, then a shared win; solo equal totals remain a System win.

This is the smallest tested change that substantially reduces final-mover leverage while keeping eight rounds, the shared56 cards, Favor, existing actions, dependency links and both board modes. It adds a cumulative score display, not a spendable resource.

The comparison does **not** establish final balance. Early leads become more persistent: a player among round4 leaders also wins in71.6% of own-turn games versus42.7% final-only. This metric includes ties among round4 leaders and differs by scoring system; it is a warning about comeback opportunities, not a causal estimate of runaway leadership.

## Reproducible experiment

- Existing production R07 engine SHA-256: `c7bd234135545cc3d40ac67ed0a34aa4de7a9141261cdc4a42347ea0ab1b38c3`.
- Test-only copy adds an initial rotating-start offset; no R07 transition rule is changed. Copy SHA-256: `4cd4bac4f070f9e94013c77a41bb854d996902cc4f642a4629703d22325c49e9`.
-1,944 complete games:18 seeds ×3 rotated role/policy/start assignments ×counts1–6 ×two board modes ×three scoring variants.
-57,024 completed player/System main actions;100,401 invariant checks including terminal counterfactual transitions. Zero assertion failures.
-Exactly8 scoring deposits per player asserted for both cumulative rules. Solo remains human-first each round; its role/policy assignments rotate while System retains no Role/Plot.
-Same legal-action policies and seeds across variants isolate scoring changes. They are deliberately cheap public heuristics, NOT optimal cumulative-score strategies and NOT measured Site-chooser performance.

`compare.mjs` implements the tested adapters; `results.json` preserves all rows; `engine-start-offset.js` preserves the test source. No human games, human timing, or subjective enjoyment claims.

## Compared rules

|Variant|Credit timing|Agenda|
|---|---|---|
|Final-only baseline|Current network only after last action|Once final|
|Own-turn banking|Own base network immediately after each own completed turn|Once final|
|Round-end banking|Every network at end of each round, before next Event|Once final|

The test adapter obtains the pre-round-advance state from the existing preview transition. This avoids accidentally scoring after a Hearing clears or a new Event arrives. All real actions still pass through legal-action validation.

## Results

All figures below aggregate both board modes. Per count and rule:108 paired games. Winner share divides shared wins equally; unlike R07, actual multiplayer winners include the Favor tiebreak.

|Players|Final-only: last actor winner share|Own-turn|Round-end|Own-turn shared wins|
|---|---:|---:|---:|---:|
|2|74.1%|54.6%|57.9%|0/108|
|3|57.9%|39.4%|31.9%|4/108|
|4|57.9%|25.5%|30.1%|2/108|
|5|37.5%|29.2%|31.0%|5/108|
|6|44.8%|18.8%|23.1%|8/108|

At five players, own-turn last-actor share remains29.2%, above the equal-share reference20%; at three it is39.4% versus33.3%. The small, structured policy sample does not justify a statistical claim of fairness.

|Metric across648 games/rule|Final-only|Own-turn|Round-end|
|---|---:|---:|---:|
|Shared wins|55|19|10|
|Final action changes winner set vs PASS|357|113|146|
|Mean absolute opponent-score change at final action|3.85|0.83|3.85|
|Mean own relative-margin change at final action|5.97|4.68|6.25|
|Round4 leader among final winners|42.7%|71.6%|64.2%|
|Solo human-proxy wins /108|63|64|38|

Multiplayer shared wins fall from55/540 (10.2%) to19/540 (3.5%). Solo proxy wins are63/108 final-only and64/108 own-turn (58.3% and59.3%); round-end favors the System with only38/108 human-proxy wins. These are not human difficulty ratings.

The terminal counterfactual resolves the chosen final legal action versus an otherwise identical PASS, with ordinary responses. It is not a search over every optimal ending. Mean opponent-score impact falls3.85→0.83 because previously banked points survive; the remaining opponent impact comes from the once-final role agenda. Own final actions still matter: final relative-margin change averages4.68 rather than5.97.

Round-end banking reduces shared wins further (10/648), but preserves late-round ability to erase opponents’ current yield and hurts solo under these fixed policies. Own-turn banking better matches the requested end-turn fairness goal.

## Implementation contract and remaining limits

- Credit only when the action completes. POACH declaration and an unresolved VETO prompt do not deposit. A finished unaffordable fallback deposits once; a legal fallback recruitment also deposits once.
- Use base production only; never deposit the Role bonus eight times.
- Preview copies may calculate a deposit for evaluation but must never mutate the real state or advance the next Event.
- Persist bank/credit count/last yield with the save. On reload, continuing a pending defender response must not duplicate a deposit.
- Keep current network yield separate from banked score in the interface. An Audit now reduces a future turn’s yield; a final attack can still affect final agendas.
- Do not advertise increased comeback potential: the current evidence points the other way. The next human test should compare whether accumulated achievement feels fair without making late turns perfunctory.
- Do not reuse the simulation win rates as actual Site-bot outcomes: policies differ.

Production equivalence is checked separately by `verify-production.mjs` and `production-verification.json`. Browser rendering/input remains integrator QA.

## Production equivalence result

**PASS** on exact R08 production source SHA-256 `c8107f181091d883ee95e39bf3ede4b09a9ff67e50b4127c5405f603d367af7f`:144 games across1–6 and both modes;7,252 transitions;4,224 completed actions;3,028 non-completing/reaction transitions;427 save/restore continuation comparisons. Every gameplay state and legal action set matches the measured R07+own-turn adapter, every player finishes with8 credits, bank equals independent accumulated base production, and final score adds the agenda exactly once. Completed-game moves rejected.
