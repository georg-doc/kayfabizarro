# THE INVISIBLE HANDSHAKE · R0.6 · RAF Dice / Overton Pyramid Static Test Report
**Date:** 2026-11-17 · **status:** TESTED STATIC RULE ARITHMETIC, **NOT APPROVED GAMEPLAY** · **owner/branch:** `georg-doc/kayfabizarro` / `design/invisible-handshake-paper-r0-2026-11-17` · Draft PR #475.

## Files checked
- [R0.6 mechanics and art-direction source](BORROMEAN_RAF_PYRAMID_R06_2026-11-17.md)
- [R0.6 standalone JS probe](BORROMEAN_RAF_PROBE_R06.js), source file committed and exact-branch fetched afterward
- [Source-critical WSA research addendum](ATLAS_PSYCHOLOGICAL_INFLUENCE_ADDENDUM_R06_2026-11-17.md) for Chase Hughes, Mattias Desmet, PsyOps, mass psychology, NLP, nudging and R/A/F contexts
- Pre-existing R0.5 aperture [own probe](OVER_TON_WINDOW_PROBE_R05.js) remains independent.

## Actual reproducible tests
An independent **Node.js** state enumeration was executed in the container using the same mathematical model as the committed standalone JS source (three faces 1–6, six die-to-corner permutations, highest face selects one of three channels, ties contested). **The committed file itself was not downloaded/run by path in that container**; verify it separately by running `node BORROMEAN_RAF_PROBE_R06.js` from the repo checkout. No full-round R0.6 Monte Carlo simulation was run.

| Check | Outcome |
|---|---|
| 6^3 face triples × 3! assignments | **1,296/1,296 configurations enumerated** |
| Unique foreground vs tied/contested | **990 unique / 306 contested** |
| Equal rotational positional distribution | **330 per corner** |
| 3 card supply tags × 4 starting FAVOR cases each state | **15,552/15,552 legal affordability cases** |
| Zero-cost recruitment cases | **3,960** |
| One-FAVOR recruitment cases | **11,592** |
| Valid face ±1 mutations | **6,480** |
| Boundary-blocked face rotations (1 down/6 up) | **1,296** |
| Valid swaps among three distinct die locations | **3,888** |
| Final equality assertion of expected aggregate counters | **PASS** |

**Interpretation:** If each type were equally represented as a candidate in those hypothetical states, a no-cost RECRUIT choice appears in **25.46%** of `(state, card-supply, initial-FAVOR)` combinations; **74.54%** still cost 1 FAVOR. This is **not an observed player-game frequency** and may make the board a punitive purchase tax. Because +1 FAVOR occurs before each turn, cost never blocks a legal normal recruit in these simulated standalone conditions, but it may reduce the capacity to VETO/POACH later.

### Constructed physical test
Faces R4 / A3 / F3, positions R@RESOURCES, A@RULES, F@INFLUENCE → only RESOURCES suppliers recruit at 0 FAVOR. Swapping R and F positions changes the foreground to INFLUENCE, changing a matching candidate's cost to 0 and the former RESOURCES candidate to 1. No change in historical facts, card power, network scoring or ownership occurs solely from swap.

### Source verification and boundaries
- Existing `sky-dice.js` source on current GitHub main shows literal 3D borromean interlocking frames were rejected in an earlier travel visual attempt, and S60c uses familiar dice and coupled motion rather than topological interlocking as the visible shape.
- Existing `kfb-pinball-audio.js` labels R/A/F as Resonanz, Amplitude, Frequenz in the audio drone; tabletop use for political rhetoric is a **new candidate**, not evidence of an existing game rule.
- Official Hughes channel page verified by URL but specific video contents **not read**, first-party course sales outline accessed. Official Desmet site accessed, existing KFB social-psychology donor lists author hypotheses and methodological counterpoints. Independent newer nudging meta-analysis noted; future Atlas WSA study **not executed**.
- No actual source cube model isolated visually, no clay board art made. No new hub route or R0.6 physical printed masters. Human games **0**, measured turn seconds **0**, six-player full games with pyramid **0**, solo balance **unknown**. Do not classify 1,296 abstract states as 1,296 played games.

## Risks / next gate
1. "Borromean" is a meaningful three-part KFB motif, not **mathematically** equivalent to the Borromean rings topology; do not construct fake interlocked cube rings.
2. R/A/F die identities only flavor the dominant political discourse **qualitatively** in A. If the faces have no distinct decisions, either redesign compactly or remove the three-die complexity.
3. Real Overton accepts/rejects **positions on a given issue**; fixed RESOURCES/RULES/INFLUENCE corners are about competing rhetorical channels. Test B as a genuine issue-specific triangle only after A passes readability.
4. 2–6 player wait time, P04 frequency, need-fulfillment and end-event scoring, and automatic Solo changes are still untested.
5. Research scope is broad but **research not run**; WSA must first accept its own owner branch and verify primary/transcript sources.

**One human gate:** microtest one 2-player cross-sphere scenario with the same 12 proxy cards and one P03↔P04 swap, first using R0.5 2/4 aperture, then R0.6 triple-dice pyramid (and optionally Solo one turn); Georg decides **A / B / FAIL** on the actual discourse manipulation feel. R0 core stays intact until acceptance.
