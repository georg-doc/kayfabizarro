# THE INVISIBLE HANDSHAKE · R16 NPC Editorial Pulse + Narrative Lenses · Test Report
**2026-11-17 · OWNED CANDIDATE EVIDENCE, not acceptance.** Owner `games/invisible-handshake/` · branch `design/invisible-handshake-paper-r0-2026-11-17` · Draft PR #475. Current **tested full-session baseline R14** remains historical and does not enforce six occupied outer seats or one die per card. R16 proposed behavior is a candidate described in [source](NPC_TURN_AND_NARRATIVE_CARDS_R16_2026-11-17.md).

## What was actually run
- One **independent V8 static fixture** spanning n=2,3,4,5,6 humans and `6−n` NPC public factions, with one neutral FOCUS, three one-per-card D6 and fixed fifty narrative cards.
- **46 / 46 scenario groups and 51 / 51 grouped assertions PASSED** (setup conservation, human REWRITE, three one-time lens operations, outer capture/re-entry, NPC A reframe, NPC B forced die transfer, one NPC vacancy refill and NPC B dice/no-dice choice). The independent fixture checks card conservation and single-die occupancy after each state transition. **This was not an eight-round/full-session simulation.**
- [Proposed executable Node test](NPC_TURN_AND_NARRATIVE_CARDS_R16_PROBE.js) written to GitHub and fetched back; this logged result is from a separately constructed V8 runner of the same mathematical transitions, **not an execution of the checked-out Node file**.
- Stocks n=2:37, n=3:34, n=4:31, n=5:28, n=6:25. Rewriting a human narrative moves one hand card onto the existing outer seat, its previous public card into discard, and changes hand−1/discard+1, preserving 50.
- Both NPC A editorial replacement (stock−1, discard+1) and NPC B die movement (no card moved) conserve all 50 cards. NPC vacancy refill (stock−1, occupied outer+1) conserves all 50.
- FEAR +1 stops at die6; HOPE draws exactly one stock card into the human player's hand if legal (verified five n=2..6 hand changes); HATE exchanges one chosen own-hand card for one rival-human hand card (a deterministic fixed-index proxy for a future uniformly random hand choice; five n=2..6 cases). Both hands conserve their counts. **No 7 trophy or 0 burn from a card-lens effect**.

## Limits
- No probabilistic NPC AI, actual card copy/comic content, video/game Stage, independent human critique or player timing.
- No measured mean card turnover per complete game, scoring imbalance, repeated lockout or third-party kingmaking. R14's 43,839 immediate next-player harvests remain a different model and are not resolved by this proposal.
- NPC A selected-cycle pointer, B priority and how many vacant NPC slots may accumulate need a genuine finite-stock simulation. **One NPC pulse after a complete human circuit** is a proposal, not assumed an already shipped rule.
- The 50 card LENS icons are **not assigned**, no produced 56-card playable product or R16 print PDF. Under C0, cards remain strategically interchangeable even with storytelling; C1 is only one qualitative color/icon, not unique card ability design.
- NPC-as-contributor Focus resolution uses an explicitly unapproved "reframe rather than award phantom NPC trophy" candidate; center scoring and endgame are not balanced.
- Existing six named fictional factions and the KFB public ritual are **design donors**, not ownership/visual art integrations. Actual 3D dice were not isolated visually.
- Player count 2–6 main, Solo deferred, no NPC personal hands or individual NPC turns, no secret missions, no mandatory improvised performance judged for points.

## One next gate
Georg tests a short **2-human / 4-NPC** round with actual cross-sphere proxy narrative cards, compares **NPC A replacement** vs **NPC B move-if-die**, and independently observes whether C1 `one F/H/H lens icon` gives cards distinct tactical uses without a new stat game. Compare one all-human six-seat trace. Record who says Show/Spin/Sell, card turnover, legal choices, how often NPC seats are vacant and 5→6 preparation gifts. **Human KEEP/TUNE/FAIL** before any expansion to 50 icon assignments or runtime/Site.

## Design critique before human gate
C0 still leaves cards mechanically identical. R16 C1's *three shared generic icons* deliberately cross three different domains: **board pressure (Fear), card economy (Hope), opponent-hand disruption (Hate)**. That is stronger than three colored ways of nudging dice, but no measured fun, scale or fairness is claimed. In particular, the HATE exchange is **not proven less frustrating** than random stealing and may require a visible one-for-one alternative. KFB text/art/semantic relations to Focus are the narrative layer, not a hidden mathematical modifier.
