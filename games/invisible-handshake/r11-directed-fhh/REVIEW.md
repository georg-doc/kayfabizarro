# R11 FHH directional chip candidate · Independent review

17 November 2026. Concept/state test only. No production edits or new game implementation by this reviewer.

## Verdict

**The exact eligibility, movement, boundary and continuous-survival rules are represented consistently in the tested examples.** The observed payout rate remains low. This is not evidence that the loop is balanced, robust against denial, or ready for UI promotion.

The generic emotion eligibility avoids making the single Hope die a unique scoring bottleneck: any of Fear, Hope or Hate can qualify. It does NOT remove the broader scarcity: three dice can make at most three of six distinct slots eligible at once, and a claim must survive five intervening actors.

## Reproduction and independent checks

- Reran supplied `test.py` unchanged:1,200 controlled runs,400 seeds per policy,18 rounds/108 actor turns per run;129,600 actor turns in the batch.
- The script's five boundary/continuity assertions passed.
-15 supplementary independent fixtures passed: six eligibility combinations; all six action-roll mappings and option counts; move-away invalidation with no resurrection; reset only the triggering die while preserving the input state; and5→6 claim loss followed by6→7 card replacement.
-40 paired build/deny calls returned identical wins, breaks, claim counts and zero flags. Batch aggregate results match exactly. These are not independent strategy replications, and no full batch action traces were retained for a stronger trajectory claim.
- Reran constructed `example.py`: exactly two payouts, turn8 and turn18; boundary replacements turn5 at slot2 and turn11 at slot5. It is a predetermined illustration, not a sampled match.

## Exact checked semantics

A slot qualifies when at least one resident die is3–5 and every resident die is2–5. Empty slots fail. A lone2 fails;3+2 qualifies;3+1 or3+6 fails. Values do not cancel each other and no die identity has a privileged qualification role.

Odd action rolls move the selected die to any different slot, preserving its value; even rolls choose±1 for that die. This code does not implement geographic adjacency or clockwise-only movement. Narration/card meaning does not constrain legal options.

Every action immediately removes any existing chip whose slot becomes ineligible. Returning to eligibility later does not restore that chip. Only the active owner may claim at the end of their turn. Their surviving chip pays at the next own-turn start, before the next action.

A boundary attempt reaching0 or7 replaces the card at that die's current slot, clears its chip, and resets only that die to3. Other dice retain location and value. The actor does not receive the discarded card as a trophy.

**Important distinction:** claim loss and card replacement are separate thresholds. A lone3→2 already breaks a claim;5→6 always breaks eligibility;0/7 later replaces the story/card. Under valid reachable state, a live chip cannot coexist with a1 or6 die, so it has already disappeared before that die crosses0/7. The explicit boundary-chip clearing is defensive consistency, not usually a second chip loss. A reset to3 can improve the target's future eligibility.

## Results and limits

|Policy label|Trophies per player over18 turns|Whole-table zero-payout runs|Low breaks|High breaks|
|---|---:|---:|---:|---:|
|Random|1.4725|0/400|1049|634|
|Build heuristic|0.8117|8/400|1533|613|
|Deny heuristic|0.8117|8/400|1533|613|

This is low throughput, particularly for the identical heuristic runs. It is not a recommendation to play randomly: the random policy consumes an additional random-choice draw, changing future D6-roll schedules. Equal seeds therefore do not create matched exogenous-roll paths between random and heuristic runs. The policies are narrow greedy scripts, not optimal play or human psychology.

The build/deny weights often favor the same move because acquiring a die for oneself simultaneously removes it from a rival. Merely changing the denial coefficient did not produce independent behavioral diversity in the reported sample.

Other important limits:

- Six actors only. No full solo or2–6-human/NPC scaling test was performed here.
- Fixed starting locations0/2/4 and fixed turn order; seat means do not establish fairness.
- Infinite replacement counters, no finite50-card supply, hand management, actual card effects, faction powers, victory threshold or narrative compatibility.
- No elapsed human decision time, fun, comprehension or diplomatic interaction measured.
- Final claims are censored by the18-turn horizon; the most a continuously successful actor could cash is17 times.
- `cards[slot]` is a replacement counter, not a recorded original-card identity. The example's named cards come from the scenario description; only slot transitions and payout/discard timing are numerically verified.
- The batch asserts die bounds and eligibility at cashout, not a comprehensive finite-card conservation model. Do not describe it as one.

## Constructed example check

The first six actions demonstrate Hope moving between Technocracy and Fourth Reich, Fear moving to Round Table, Hope5→6 invalidating Fourth Reich's claim, then Hope6→7 discarding the Bell/resetting Hope3. Aliens acquire Hate4 and claim.

Round Table cashes its surviving card at turn8. Its action lowers Alien Hate3→2 and invalidates that claim. Hate1→0 at turn11 discards the old Alien signature and resets only Hate3. Aliens then take Fear4 at turn12, hold the resulting eligible new slot through the intervening turns, and cash the replacement signature at turn18. The Bell is never won; it was discarded at turn5.

The exact final card title is not tracked in the test state, so the wording should remain 'replacement signature' unless a separate narrative identity ledger is supplied.

## Disposition

**KEEP AS A CONCEPT CANDIDATE:** explicit action-roll mapping, location/value separation, any-emotion eligibility, and distinct claim-loss/card-reset thresholds are explainable and testable.

**DO NOT PROMOTE AS BALANCED:** three dice/six slots plus next-own-turn survival remains punitive in these runs. The next conceptual comparison should change just one element—holding duration or qualification—and retain the present case as baseline. No fix was implemented or validated in this review.

Source SHA-256 `223bc1dcf5458679b8a40173e6988dad1e049016b8935a24f3471a5c757d0ab4`; result SHA-256 `672b292b3ebb9fc2bf7ac17f0fbccf0d8c4fc9367767042841ec14a096d689f5`.
