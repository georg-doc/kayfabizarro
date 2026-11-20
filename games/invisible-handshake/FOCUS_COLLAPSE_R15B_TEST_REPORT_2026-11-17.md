# R15B · FOCUS Collapse A/B · Static Fixture Report
2026-11-17 · Owner `games/invisible-handshake/` on `design/invisible-handshake-paper-r0-2026-11-17`, Draft PR #475. **Design hypothesis, not human playtest, full game simulation, or balanced rules acceptance.**
Source [R15B candidate](FOCUS_COLLAPSE_R15B_CANDIDATE_2026-11-17.md). Proposed executable source [R15B JS probe](FOCUS_COLLAPSE_PROBE_R15B.js) committed and read back; **the committed JS file itself was not executed as a Node process for this evidence**. An independently authored JavaScript fixture enumerator ran in the current chat's V8 tool environment with the same state transition definitions; results below refer to that run. No production runtime edits.

## Checks actually executed
- **5 active player counts: 2, 3, 4, 5, 6**.
- For each count: **2 A/B activation policies × 2 high/low collapses × 2 other-dice configurations** (split versus stacked) = 8 fixtures; plus two high self-harvest fixtures. **50 fixtures** across 5 sizes.
- Plus **1** exhausted stock fixture (centre present, stock0, upward collapse to another player's outer card) = **51 constructed scenarios**.
- Checks included 50-card accounting `stock + hands + occupied outer + central-focus-if-present + trophies + discard = 50`; correct count of actor/owner trophies, focus replacement or non-replacement, proper discard count and stock drain, return of affected contributor to empty-slot state.
- Total **149/149 explicit static assertions PASSED** in an independent V8 run. Category counts across the forty opponent-claim/burn fixtures: 15 high events paid outer+focus trophies; 5 high events paid only the outer trophy; 15 low events discarded and reframed the focus; 10 events did not activate Focus (categories overlap by polarity and are not totals of a mutually exclusive set).
- Expected start stock **41, 37, 33, 29, 25** for active n=2…6.
- Exhausted stock: if the center card is released and stock0, the center becomes empty rather than silently creating/recycling a card. This is a deliberately unresolved late-game state.

### Two human-readable boundary traces · manually constructed, not simulated play
**2 players:** Tech controls THE BELL; Round Table controls THE COMMITTEE; Focus THE NATIONAL EMERGENCY. Fear6 on BELL, Hope3 on BELL, Hate4 on COMMITTEE. Round Table raises Fear6→7: it receives BELL; Tech receives FOCUS; stock provides a replacement center, and Tech must re-enter. B's survivor-split condition passes. Put both Hope and Hate on COMMITTEE before the event and B withholds center payout, while A still pays.

**6 players:** one die 1 on THE BELL, remaining two dice on two distinct other occupied faction narratives; player other than BELL contributor presses die 1→0. Outer BELL is burned; in either A or B the center is discarded and refilled, nobody receives a trophy. No die was ever directly placed on the center.

## Important unknowns / risks
1. **Open-harvest preparation remains problematic:** conditional focus compensation applies only to contributor of the outer narrative, not necessarily who earlier set its die to6. Don't claim R14 43,839 next-actor-prepared gifts fixed.
2. **Pair farming/collusion:** two players can intentionally harvest each other's outer cards and collect the center; must measure winner distribution and third-party starvation.
3. **Gate B can be hard to understand at two seats** because other two dice must occupy different currently occupied outer positions, not three different players. Configuration of dice before outer card removal is essential.
4. **Center depletion:** A changes the focus more frequently; even B can spend stock rapidly. Current ending and exhausted-hand recovery undefined.
5. **Seat lockout:** losing own card enforces one or two wasted turns; remains an untested user-directed eligibility candidate rather than a successful balance fix.
6. **Solo / hidden goals / player-time/fun / published Site and KFB Hub:** none tested or delivered.

## One next gate
Paired R14-style **2-seat and 6-seat** A/B simulations using an entry-gated R14 source copy, identical starting states/random streams and opposing policies; report per-player outer and center trophies, center replacement and stock drain, contributor-versus-actor inequality, who benefited from 5→6 preparation, seat-denial, zero-action cycles, number of forced re-entries and stock/hand exhaustion. Then **2-person physical A/B**, Georg A/B/FAIL before choosing a center rule. No auto-merge or Live promotion.
