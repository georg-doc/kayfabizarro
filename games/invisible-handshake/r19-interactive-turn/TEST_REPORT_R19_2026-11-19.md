# R19 · Interactive Seven-card Turn Lab · Browser Test Report

**2026-11-19 · Browser fixture PASS, NOT human gameplay acceptance.**
Owner games/invisible-handshake/ · existing Draft PR #475. Tested source: [turn-lab.html](turn-lab.html). Reference: [R18 Tarot Hex](../R18_TAROT_HEX_SEVEN_CARD_READING_2026-11-19.md).

## What works and what has been assumed

A standalone HTML/CSS/JS 7-position tabletop shows six outer narratives and one die-free Focus, human Round Table and Technocracy, four NPC faction positions, three shared HATE/FEAR/HOPE D6, stock, hand counts, trophy counts, discard, steps and event log.

**Setup:** each human receives four sample narratives, selects one to publish and holds three; four NPC positions and shared Focus receive one narrative each. Six faction cards are outside the 50 ordinary narrative cards; opening stock 50−6−1−6=37. Initial three D6 values are 3/3/3 at distinct outer positions. Clearly marked later-turn demonstration presets (HATE6/FEAR4/HOPE3 or FEAR1) show boundary events without pretending that earlier preparation was free in this cycle.

**Turn:** the actor reads actual named cards HATE=Problem → FEAR=Reaction → HOPE=Solution with a quick title-only fallback, then takes exactly one of the demonstrated legal actions: ADJUST HATE+1, ADJUST FEAR−1, MOVE HOPE to vacant-die occupied slot7, SWAP FEAR/HOPE, random REROLL FEAR (1–6), or DRAW to hand (cap6). Clickable Tarot cards display PUBLIC CLAIM (upright/KAYFABE) or PRIVATE INCENTIVE (reversed/BIZARRO), without modifying the action economy or score.

**Resolution:** 6→7 harvests the affected outer card for the acting human; 1→0 burns it into discard. Trigger die resets to3 and relocates to a distinct occupied die-free outer position; the center never accepts a die. The default R17 A leaves Focus as context. Independently selectable and flagged UNACCEPTED R17 B Focus resolution may award another human at the pre-collapse HOPE position, reframe the center for NPC HOPE or negative collapse, and replenish the empty center no earlier than the next human round.

**End of one human circuit:** R16 **NPC A** is explicitly selected as the demonstration candidate: ONE collective NPC editorial pulse with vacancy priority, consuming one stock card, and no separate turn/hand/trophy for any NPC. The next round rotates first human. An absent own human public card requires a whole PLAY action from hand (or DRAW when empty) before dice actions, using R16's candidate re-entry gate. An official game ending is not invented; this is a **full two-human round**, not a full match. Stock and hand draw identities are authored example text, NOT the finalized 50-card printed set.

## Actual checks and environment

- **38/38 Playwright browser assertions PASS** with headless Chromium at 1260×960, plus 390px no-overflow viewport.
- Source loaded via Playwright set_content from exact HTML bytes. File-scheme navigation was blocked by sandbox administrator; no hosted route was tested.
- Tested: starting ledger50; exactly7 slots,3 distinct outer dice, die-free center; initial stock37; choosing one of four human cards while conserving stock; prepared HATE6, actual named-card causal text; 6→7 trophy, reset and legal relocation; second actor MOVE HOPE retaining face; one NPC vacancy refill consumes stock; first-player rotation; separate R17 B human-Focus transfer (two independent trophies) and next-round Focus refill; DRAW uses full action; 1→0 no trophy, own-slot later PLAY; NPC-HOPE optional reframe; 50-card conservation after all transitions; zero JavaScript exceptions.
- Locally produced and inspected desktop starting-board and resolved-round screenshots. Binary screenshots not committed to GitHub and not evidence of any public Stage deployment.
- JavaScript source syntax compiled successfully under Node v22.16.0. Optional game-dev CLI unavailable; GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED. Node, Chromium and Playwright checks suffice for this unsealed Web HTML fixture.
- **0 human games, 0 complete 2–6-player games, 0 independent gameplay acceptance, 0 public Stage/Live verification.** A browser fixture PASS is not Georg PASS.

## Unresolved and bounded

Only the two-human / four-NPC table is interactive; 3–6-human runtime, finite match ending, independent Solo, reserve-die reentry after severe card depletion, fully authored 50-card deck and complete historical claim sourcing are not implemented. R16 NPC A and re-entry are chosen proposal variants, not silently accepted rules. The optional R17 B Focus payout retains the known 2–6 human eligibility bias. R18's Tarot locations remain a narrative overlay, not a new scored power or Tarot deck. The UI uses no actual donor art or replacement logo and is not final KFB art direction.

**One next gate:** Georg examines the interactive sequence: choice of actual narrative, HATE/FEAR/HOPE reading, one action, resolution, common NPC pulse; decides KEEP/TUNE/FAIL on whether R18 positional interpretation makes a real tactical and satirical difference over R17 A. No auto-merge/Live. Formal human Stage requires a separately authorized, published and visibly verified direct kayfabizarro.pages.dev route linked from KFB Hub; the portable HTML file is NOT an accepted Stage link.
