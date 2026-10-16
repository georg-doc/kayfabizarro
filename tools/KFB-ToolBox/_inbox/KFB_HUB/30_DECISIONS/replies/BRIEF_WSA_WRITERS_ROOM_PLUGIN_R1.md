# Brief WSA · Writer's Room als ChatGPT-Plugin R1 (V-374)

**For:** WSA (ChatGPT web chat with the kfb-triplets plugin). **From:** WS0, 16.10.2026.

## Goal
Georg runs the song writer's room himself in ChatGPT: he names a deck, gets STYLE + LYRICS in the chat to edit, and every result is saved on GitHub at the same time. WS0 reads it there and comments. That saves Claude tokens.

## Use what exists
Extend the existing **kfb-triplets** plugin (skill `compose-card-performance`). Same plugin, a new skill `writers-room-song`, no new plugin.

## Binding rules
They are on branch `docs/kfb-decisions-register-2026-10-11`, folder `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/` (`DECISIONS.md` + `replies/`). Read V-361 to V-373 in full. Short version:
1. **Writer's room flow (V-361):** deck dossier → writing pass → blind review → one revision → Georg. Formats are tools, not templates.
2. **The song tells the card, not its rule (V-372).**
   - Source is the whole card package: name, lore, image motif (look at the PDF page) and power. Power appears only as a meta-satirical aside, never like a rulebook.
   - The 4 cards of a printed page are a micro-story and become one stanza. Put a blank line between stanzas.
   - In the intro, every sentence that needs a pause gets its own line.
3. **Every card performs itself (V-373).** Show it, spin it, sell it: each line is the card selling its own claim. The voice switches roles; contradictory cards each get full conviction.
4. **No intro formula (V-366).** No "Meta-Message", "Uncle FrizzleBob" at most once, and "Comic Card Karaoke" only as a free sing-along element that differs per song. Compare against all earlier intros (`replies/OPENER_ARC_R2/*.suno.txt`) for repeats.
5. **Song versions of card lines (V-364).** Use `songLine` per card where the printed text breaks when spoken. The card itself stays canonical. Log every change.
6. **STYLE is purely musical (V-362).** Genre, production, instruments, groove, tempo, mood, and one voice described only by its delivery (or an explicit duet). No story props, no job roles. Give two options with different voice and genre. Groovy, danceable.
7. **Length:** under 5000 characters including newlines, starting with `[Spoken Word]`. Card names follow the printed text in normal case (V-271).

## Blind review inside the plugin
Run it as a **separate pass** that sees only the lyrics and a short deck description, not the rules.
- Scores 1–10 for song, stand-up and faithfulness to the deck.
- The three biggest weaknesses.
- Up to 8 edits.
- Extra questions: "Does it sound like a rulebook?" and "Does each card sell its claim?"

Then do one revision and show it.

## Output
**In the chat:** STYLE A and LYRICS as two code blocks directly one after the other, then STYLE B, then the review scores.

**On GitHub:** new branch `songs/<deckId>-wr<N>-<date>` (no PR, no merge), folder `songs/<deckId>/`, containing:
- `<deckId>.wr<N>.suno.txt`
- `.style.txt` (A and B)
- `.dossier.md` (purpose, page/stanza table, arc, sources: booklets and Substack https://cancelthiscomic.substack.com/archive)
- `.songlines.json`
- `.blindreview.md`

## First test
Redo **Pharaoh Piledriver** and **Trust & Betrayal** under V-372/V-373. The current WS0 versions in `replies/OPENER_ARC_R2/*.wr3.suno.txt` follow the old triplets and still put the power first. Use the deck PDFs (`media/kfb/` or Georg's upload), the card JSON from the registry, and `replies/OPENER_ARC_R2/*.wr1.dossier.md` as preliminary work.

## Return
Branch, commit, both character counts, review scores, and an honest list of what the plugin cannot do yet.
