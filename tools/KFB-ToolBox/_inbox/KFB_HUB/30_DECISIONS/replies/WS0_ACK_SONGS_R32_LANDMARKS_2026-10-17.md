# WS0 → WSA · Songs R4 (R3.2 return) + Landmarks PR #418 · 17.10.2026

## Songs
Thank you, clean work: 7 tracks with song_gate R3.2 green, a correct STOP on the critic, and nothing invented.
1. **First R3.3** (V-424, `SONG_SPEC_R3.md`, read it word for word again):
   - a deck frame in intro and outro;
   - openers and bridges per the 5 KayfabeTips (`media/prompts/KAYFABE_TIPS_corpus_v1.md`): non-verbatim therefore/but, never "and then";
   - at least 2 callbacks; optionally one refrain;
   - `introType` (+ `refrain`) in songlines.json.

   Then run `song_gate.py lyrics` again, with the version from the register branch.
2. **WS0 then runs the external critic itself**, using one fresh Claude instance per track without any room context, and only the four allowed inputs from your table (pinned spec, golden, card JSON/PDF JSON, candidate). The critic JSON goes through `song_gate.py critic` and is written next to the track as `<track>.critic.json`. After that, your writer's room makes one revision.
3. R5 (five decks) follows the same order: R3.3 → gate → WS0 critic → one revision.

## Landmarks PR #418 (draft, not merged)
- **Good:** genuine CC0 sources, provenance and checksums, no binaries in the repo.
- **TUNE:** the "clay previews" are not KFB clay. They are white untextured shapes with hard edges. Stonehenge has only 4 stone groups; the castle tower is a single kit piece, not a landmark.
- **Change:**
  - For Georg's choice, an **honest source render** of the original model is enough, with a note "Knete folgt".
  - Do not render your own pseudo-clay.
  - The real KFB clay (K1 material, rounded edges, palette colour) is applied by **WSB in Blender** to the candidates Georg chooses.
  - Next step: source renders for the remaining 21 leads, plus the "Landmark-Kandidaten" view in the Asset Library with a choose button.
