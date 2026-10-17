# Brief WSA · Songs R5: five more decks through the triplet plugin + external critic (V-419) · 17.10.2026

> **R3.3 (V-424, Georg 17.10.) applies to R4 and R5:**
> - Intro and outro form the satirical, provocative frame tailored to the deck (onboarding/setup → thought-provoking outro → Stay Fluffy!).
> - Openers and bridges follow the 5 KayfabeTips (`media/prompts/KAYFABE_TIPS_corpus_v1.md`): non-verbatim therefore/but, never "and then".
> - At least 2 callbacks.
> - At most one refrain (≤ 8 words, ≤ 3 times).
> - `songlines.json` additionally gets `introType` and optionally `refrain`.
> - Read SONG_SPEC again word for word; song_gate.py checks all of it.

**Tier 0 (3 lines):**
1. Rules come **only** from `replies/SONG_SPEC_R3.md` **R3.2** (read it word for word). Golden example: `replies/OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt`.
2. Gate = `replies/song_gate.py lyrics` + `triplet_set_check.py`, both exit 0. Do not use your own gate copies (the R4 `format_gate.py` files are retired).
3. The external critic only judges (`<track>.critic.json`, SONG_SPEC §F). Its output must pass `song_gate.py critic`. The writer's room revises once.

**Block:**

| deckId | Card truth | `--media` (image words) | Note |
|---|---|---|---|
| `federal_kayfabe` | registry, 60 cards | `media/kfb/Federal_Kayfabe_-_ADD_web.pdf.json` | Two tracks (C12b) |
| `geopolitical_thrillers_conspiracy_theories` | registry, 56 | `media/kfb/Uncle_FrizzleBob_s_Kayfabizarro_-_Geopolitical_Thrillers_and_Conspiracy_Theories_-_ADD_web_ID.pdf.json` | Deck note in E16b (parody frame, never a claim) |
| `grimms_kayfabe_legends_expansion_set_02` | registry, 52 | `media/kfb/GRIMMS_KAYFABE_LEGENDS_EXPANSION_SET_02_-_ADD_web.pdf.json` | – |
| `kayfabizarro_monopolies_manipulation_murder_vol` | registry, 56 | `media/kfb/Kayfabizarro_-_Monopolies,_Manipulation_&_Murder_Vol._II - ADD web.pdf.json` | Deck note in E16b |
| `romantic_kayfabe` | registry, 56 | `media/kfb/Romantic_Kayfabe_-_ADD_web.pdf.json` | Deck note in E16b |

**Gate call per track:**
`python3 song_gate.py lyrics <track>.suno.txt --deck <deck.json> --songlines <deck>.songlines.json --media <pdf.json> [--cards <from>-<to> for part 1/2] --corpus replies/OPENER_ARC_R2 <all earlier *.suno.txt incl. R4/R5>`

Use `songlines.json` in the R3.2 form: `{deckId, introType, refrain?, songLineChanges:[{cardNumber, cardName, songLine, songName?, reason, rule?}], metaSkipped:[…]}`.
If 50+ cards don't fit with an intro of at least two beats, split into two tracks at a page boundary (C9b/C12b).

**Order:**
1. Writer's room.
2. Gate green.
3. External critic → `song_gate.py critic` green.
4. One revision.
5. Gate green.
6. A second critic pass judges only.
7. Regression check against the golden example (E17).

**Output:** one branch per deck, `songs/<deckId>-r5-2026-10-17`, containing:
- `<track>.r5.suno.txt`
- `.style.txt` (A+B)
- `.songlines.json`
- `.gate.txt`: the output of both scripts, before and after the revision
- `.critic.json` (pass 1 + pass 2)

In the chat: per track, STYLE A + LYRICS as two code blocks, plus the gate summary line. WS0 checks and puts it into the Hub.

**R4 at the same time:** run the b94 fixes through `song_gate.py` too. It already flags the R4 issues (brackets in Freud/Therapy/1001, digits, game words, a one-line intro in 1001).
