# R13 free-action choice · Independent review

17 November 2026. Concept tests only. No production, supplied script or GitHub edits by reviewer.

## Contract checks

**PASS for the inspected expected-value, selection and timing implementation.** Eight independent fixtures/groups passed, including ten narrow complete runs; see `review-checks.json`. The reviewer did not rerun the main batch.

- Reroll evaluation averages the exact six possible outcomes. The actual reroll result comes from a separate RNG and is applied only after selecting the action. No actual outcome is supplied to `evaluate`; there is no clairvoyant choice.
- Every turn consumes three selection draws and one outcome draw, whether or not reroll is chosen. Setup is separate. For a given n/seed the exogenous rolls and selection draws remain paired across menus/omissions despite diverging game states.
- Among maximal-value actions, a category is chosen uniformly first, then an action within it. The mixed-policy random half uses the same category-first approach over all legal options. Many move destinations therefore do not mechanically give MOVE more random selection weight than ADJUST. This is category-uniform, not uniform across individual actions.
- `safe ±1` here means **known deterministic change**, including deliberate1→0 or6→7 reset, as clarified by the integrator. It does not mean boundary-free. The independent low-boundary fixture verified that only the triggering die resets and the input state is preserved.
- Swap exchanges location while value and die identity travel together. Same-location swaps are excluded. Flip is exactly7−value and cannot itself cross0/7.
- Invalidation happens before countdown/payment. Only opponents' surviving claims age. Claim creation happens afterward with min(2,n−1); it cannot pay on creation. The due-claim destruction fixture passed. Claim accounting and die bounds passed ten narrow complete runs.

## What the policy counters mean

`best[category]` counts turns on which at least one action in that category ties for the maximum **immediate heuristic value**. `unique[category]` counts turns where it is the only category attaining that maximum. `used` is the sampled action frequency, which includes non-greedy mixed-policy moves. These are different metrics.

None proves strategic dominance, optimal play, long-run indispensability, human preference or fun. The objective rewards own current eligibility and immediate removal of rival chips; it does not solve future holding survival, future die positions, finite cards or opponents' responses.

## Focal omission comparisons

The omitted category is removed from **actor0 only**. Opponents retain the four-action menu and may still use the omitted category, so aggregate `used` remains nonzero. Compare `focal_wins` with the matching four-action/no-omission baseline for the same n/deny policy; do not interpret overall average wins as the focal effect.

The fixed policy is not reoptimized after losing an action. Improved or worsened payouts show behavior under that policy and its altered trajectories, not proof that an action is dominated or necessary. Seed-rotated start order helps reduce a fixed starting-seat effect but is not a full seat-fairness study.

## Separate one-step snapshot probe

Read `probe.py` and its output:5,000 arbitrary four-actor position/value/chip snapshots, not a sampled stationary distribution of actual games. Chips are initially eligible where present.

Only-category-best counts: MOVE1,753; SWAP327; ADJUST303; REROLL24; FLIP0. These are useful existence examples for immediate utility, not gameplay frequency estimates.

The reroll example is coherent: a rival slot holds3+4 and a live chip, while the acting player retains their own qualifying3. Rerolling one rival die creates a1/3 chance of a blocking1 or6; a single deterministic±1 cannot immediately break that stacked3+4 slot. The reported expected score4.6667 versus best alternative3 is consistent with the stated heuristic.

The absence of unique FLIP utility in this sample supports treating it as optional under the current generic symmetric eligibility rule. It does not prove universal redundancy: a value jump can alter future options, which this one-step objective does not assess. Emotion-specific faction effects are absent.

## Limits

- Infinite replacement and value-free cards; no complete finite56-card game, faction powers, card narrative constraints or human negotiation.
- Fixed18-round horizon and pending claims; cashouts are throughput under the test endpoint.
- Build/deny/mixed are narrow score-weight scripts. Multiple labels are not evidence of a broad strategy population.
- No measured human decision time or comprehension of a four/five-category menu.
- No production implementation or rule promotion is accepted by this review.

## Completed main result review

Read all50 result rows:100 seeds each =5,000 controlled runs. No whole-batch rerun by reviewer.

**Severe finding:** at six actors with four actions and the deny heuristic, MOVE accounts for84.8% of selections and SWAP13.7%. Approximately99.9% of resolved claims are destroyed;90/100 runs produce no payouts. The build-weight heuristic behaves similarly. The menu exposes an effective repeated claim-removal path; a larger menu has not cured survival failure.

Six-actor mixed policy yields1.76 payouts/player over18 turns and83.1% resolved-claim losses. Adding FLIP gives1.97 under mixed and still90%-scale near-zero behavior under the greedy cases (86/100 whole-table zeros for six-actor five-action build/deny). It does not establish a lock remedy.

MOVE's high observed frequency is **policy-conditional prevalence**, not mathematical dominance. The one-step snapshot examples already show cases where other categories are uniquely best under the same local objective. Future consequences and human choices are not solved.

The focal omission result particularly exposes heuristic fragility: at two actors, removing ADJUST from actor0 raises its mean payouts from1.71 to6.01 despite reducing its options. The fixed greedy policy follows different trajectories and can improve when a tempting local choice is unavailable. This is NOT evidence that ADJUST is inherently harmful, dominated or removable from an optimized game. Likewise reduced focal payout without MOVE shows dependency of this policy, not global necessity.

## Disposition

**Keep as conceptual action-language evidence**, with useful distinct examples for adjust/reroll/move/swap. Optional FLIP remains unproven additional complexity under current generic qualification.

**Do not promote the free-choice holding loop as balanced.** Repeated deterministic relocation and swap can keep removing qualifying support. The user’s subsequent ideas—drawing an action or awarding an intentional tipping outcome—are NEW PROPOSALS, absent from these runs. They require explicit scoring/timing definitions before any comparison; this report does not claim to have tested them.
