# External critic R1 (SONG_SPEC §F) · R4.3 songs · 17.10.2026

One fresh Claude instance per track (blind, four inputs only: spec R3.3, golden take05, card JSON/pdf.json, candidate). Every critic JSON passes `song_gate.py critic` (exit 0). Before this, WS0 fixed a gate bug: apostrophes such as "Baba's" were read as quotation marks.

| Track | cardTruth | performance | arc | sayability | tone | styleFit | Verdict | Flags (rules) |
|---|---|---|---|---|---|---|---|---|
| `frizzlebob_bloedsinnland_alice.r4.3.suno.txt` | 3 | 3 | 4 | 2 | 4 | 3 | revise | 12 (A2, A3, A4, A8, B6, B7, B7b, C11, C9) |
| `dream_wrestling_with_kayfabe_freud.r4.3.suno.txt` | 4 | 3 | 3 | 3 | 4 | 4 | pass | 12 (A2, A3, A4, B6, B7, B7b, C11, C9) |
| `the_kayfabe_money_trail_9_11.part1.r4.3.suno.txt` | 3 | 2 | 3 | 3 | 4 | 4 | revise | 12 (A2, A4, B6, B7, C9) |
| `the_kayfabe_money_trail_9_11.part2.r4.3.suno.txt` | 3 | 2 | 2 | 3 | 3 | 3 | revise | 12 (A2, A3, A4, B6, B7, C9, E16b) |
| `1001_kayfabe_nights.part1.r4.3.suno.txt` | 3 | 3 | 3 | 3 | 5 | 4 | pass | 12 (A3, A4, A8, B6, B7, B7b, C9) |
| `1001_kayfabe_nights.part2.r4.3.suno.txt` | 3 | 2 | 2 | 3 | 4 | 3 | revise | 12 (A2, A3, A4, B6, B7, B7b, C9) |
| `the_carnival_of_unsolved_problems_therapy.r4.3.suno.txt` | 4 | 3 | 4 | 3 | 4 | 3 | revise | 12 (A1, A3, A4, B6, B7, C9) |

**Next step (E18):** the WSA writer's room works through the flags **once** per track, then runs `song_gate.py lyrics` again. A second critic pass then only judges. After that, WS0 → Georg.
