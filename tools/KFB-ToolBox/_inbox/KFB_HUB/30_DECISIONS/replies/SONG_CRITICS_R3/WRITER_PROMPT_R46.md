# Writers-room pass R4.6 / R5.2 (WS0, 18.10.2026): one writer per track, then a fresh critic

You are a KFB song writer for one spoken-word track. Base folder: `R = /Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies`. Work only inside `R/SONG_CRITICS_R3/r46/`.

**Read in full:**
- `R/SONG_SPEC_R3.md` (R3.4, binding);
- the golden example `R/OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt`;
- the card source (deck JSON + PDF JSON, given per track);
- the candidate;
- the critic JSON for the candidate, if there is one;
- the style file.

**Task:** write a revised version that fixes every critic flag, without introducing new problems:
1. **Frame (C9):**
   - Beat 1 = deck title (as in the deck, e.g. with "Kayfabe") + thesis in plain words.
   - Then **at least 2 onboarding beats**: who is speaking (Uncle FrizzleBob, the narrator), what we're doing here, a stand-up setup + punch for normies.
   - **1–3 dog whistles** for experts: concrete names/terms/numbers from the card source.
   - **Outro:** a concrete satirical punch about power/money/media/us, quotable, consistent with the cards, then "Stay Fluffy!".
   - No generic aphorisms (C13b), no object-acting (C13a: things/abstractions don't act like people).
2. **Openers (B6/B7):** only on about ⅓–½ of the card lines.
   - Each opener **links** to the card before it (therefore/but/meanwhile with meaning). It gives the card a want, a grudge or an image from the card art (KayfabeTips).
   - No one-word labels repeating a word from the card's own line; no pure "then/after" time hops.
   - No opener phrase may appear in the corpus (the other tracks in `R/SONG_CRITICS_R3/inputs/` + `R/OPENER_ARC_R2`).
3. **Card lines (A):**
   - Keep the order and every card of the range.
   - Card name as in the deck (A1).
   - The card part only from words in the card (A2; numbers spoken as words are allowed and go into the songlines as `rule: "A7"`).
   - **Meaning must not shift or flip** (critics found reversals).
   - **No game rules read out** (A3), no game words such as Giant/Micro (A8).
   - Card part **80–95 characters**, whole line incl. opener ≤ 105 characters (A4, sayability).
3b. **Never name a card from the range in the intro/outro** (the gate checks this: "Rahmen nennt Kartennamen"; it breaks card recognition and spoils the reveal).
4. Callbacks (B7b): at least 2, including outro → intro image. Refrain only where there is room (C11: no frame word more than 2×).
5. **Keep the style file unchanged** (it passed the style gate); your text has to fit it (BPM/groove).

**Gate (mandatory, until PASS):**
```
cd R && python3 SONG_CRITICS_R3/gate_track.py <track_base> SONG_CRITICS_R3/r46/<new_file>.suno.txt
```
- If you change card lines with A7 number spelling, write `SONG_CRITICS_R3/r46/<track_base>.<rev>.songlines.json`: same format as the existing songlines in `inputs/` (`songLineChanges` with cardNumber/cardName/songLine/rule/reason), carrying over the old entries.
- If the gate stays red after 4 attempts, stop and report the remaining FAILs.

**Output:**
- `R/SONG_CRITICS_R3/r46/<track_base>.<rev>.suno.txt`, where rev = r4.6 for r4.5 tracks and r5.2 for r5.1 tracks;
- optionally the songlines;
- a short `…<rev>.changes.md` (≤ 15 lines: what was changed against which flag).

Change no other files. Reply with one line: gate status + file.
