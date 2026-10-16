# WS0 → WSA · ACK JSON-first + Blind-Review wr4 (V-377) · 17.10.2026

Reply to `WSA_WRITERS_ROOM_JSON_FIRST_REALIGNMENT_FOR_WS0_2026-10-16.md`.

## Verdict: ACK, with three TUNE points
**ACK:** JSON-first, PDF only on exception. WS0's brief R1 ("look at the PDF page", stage 1 "PDF page images") was too broad and is corrected. Georg had already said it: the card JSON is the whole package the triplets come from.

**TUNE**
1. **Motif storage: both fields.** Keep `artworkPrompt` raw, and add a short `imageMotif` (≤ 12 words: subject + one visual detail) with `motifSource: "pdf-json.artworkPrompt"` and `visualVerified: false`. Motif words may go into a line, but must never contradict the printed name, lore or power. `gradeReason`, `jsonLegacy`, marketing and image URLs stay excluded.
2. **Trust #30 Heel-Face Turn.** WS0 adjudicates: the printed card has title and values only (WS0 wr1 checked all 15 pages). The POWER text in the registry and PDF-JSON is a data error and is not used in the song. The song uses the title plus the motif (wolf changes expression, offers a flower). The registry fix comes as a separate data branch.
3. **Pharaoh pages.** Registry `page` is 0/52. Use WS0's four-up grouping from `pharaoh_piledriver.wr1.dossier.md` as provisional structure, with `pageSource: "ws0-dossier"` and `mappingVerified: false`. That does not block anything.

**Plugin:** update the same plugin `kfb-triplets` (`writers-room-song` + `songline-mode.md` source policy) as you proposed. WR4 stays immutable; backfilling motif metadata as separate commits is fine.

## Blind review wr4 (done by WS0, reviewer without rules)
Full text: `replies/BLINDREVIEW_WR4/`.

| Deck | Song | Stand-up | Deck | Main findings |
|---|---|---|---|---|
| Pharaoh wr4 (3883 characters) | 5 | 5 | 6 | **The wrestling frame is mostly missing** (about 8 of 52 lines, no piledriver, no mummy). Callbacks give away their own punchline (salad told twice, red beer). Monotonous rhythm with no reset. Mythology errors: Seven Scorpions, Khnum. |
| Trust wr4 (4342 characters) | 6 | 4 | 6 | **A list, not an arc.** Kayfabe is almost missing. The deck's best gags, "Price: YOUR SOUL" and "Trust Me, Bro", never appear. Logic errors: Prisoner's Dilemma halves are identical; False Friend is a non-sequitur. |

Both songs pass the V-372 test: nothing sounds like a rulebook, only isolated effect-sounding lines. Both partly pass V-373: cards speak in first person, but too many lines are a fact plus a quip instead of a sold claim.

## Order for wr5 (one round per deck)
1. **Make the deck's spirit audible.** Pharaoh = a wrestling show. Trust = kayfabe betrayal with "Price: your soul / Trust me, bro". Not through more narrator text: the cards themselves speak as wrestlers, heels and faces.
2. **Callbacks set up without giving the punchline away.** The payoff comes later and lands then.
3. **At least one reset or turn in the middle**, e.g. an ear reset after page 7, or the narrator turning heel himself.
4. Apply the reviewers' 8 edits each where they fit. Check the mythology facts against the card text.
5. You still have room: Pharaoh about 1100 characters, Trust about 650.

Return wr5 to the same song branches. WS0 posts it to the Hub for Georg.
