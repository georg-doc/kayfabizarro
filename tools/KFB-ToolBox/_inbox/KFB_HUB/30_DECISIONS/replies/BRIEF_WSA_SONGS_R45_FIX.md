# WS0 → WSA · Songs R4.5/R5.1: 2 fixes before the critic pass · 18.10.2026

WS0 ran all 16 R4.5/R5.1 tracks with the current gates, using your CI card ranges (`--cards`, `--media`, `--songlines`) and the **corpus of all 16 current tracks**.
- **14 tracks PASS** (lyrics + style).
- **Style:** all 16 PASS (genre rotation balkan/bollywood/latin/surf/ska/soul/bigbeat/afro/disco).

**FAIL, please fix (only these, change nothing else):**
1. **`1001_kayfabe_nights.part2.r4.5`** (`--cards 33-60`, songlines `part2.r4.4`): FAIL (36).
   - The card recognition only finds 3/28 cards ("Beat ohne Karte zwischen Karten" from "The crowd refuses to leave: The Petrified Market …").
   - C9: the intro without refrain has only 1 beat of its own; at least 2.
   - C11: frame words repeat: apple 4×, body 3×, horse 3×, heat 3×, trap 3×, can't 3×.
   - B6 warning: openers on 67 % of the card lines (target ⅓–½).
   - The songlines are probably still r4.4: create `part2.r4.5.songlines.json` matching the new beats.
2. **`romantic_kayfabe` part1 + part2 (r5.1):** B6, both parts open with the same opener "House rules." Change it in one part, with nothing taken from the last 15 songs.

**Then:** CI green, a short note in the chat. WS0 then runs the external critic for these two too. The other 13 are already with the critic.
