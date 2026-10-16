# pharaoh_piledriver · Writer's Room wr4 · Static Test Report

Status: **STATIC PASS 24/24**, not independent music acceptance. Generated 2026-10-16 from the actual branch files; Node-like JavaScript checks reading GitHub source, not Python validator executed on complete songs.

## Counts
- Registry cards: 52; stored cards: 52; songLines: 52; printed-page stanzas: 13 × four cards.
- Lyrics: **3883 Unicode characters including all line breaks**, strictly below 5000; style prompts: 2.
- Source PDF picture pages visually checked now: **0**; motif coverage verified: **0/52**; previous dossier mapping for Pharaoh = provisional, Trust registry page mapping = provided but no new PDF render.
- Old intro comparison: **22/22** files `OPENER_ARC_R2/*.suno.txt` retrieved and checked for exact reuse of nine new intro lines; **0 collisions**. This is lexical overlap screening, not independent creative criticism.
- Independent blind review: **NOT RUN**. Scores: song **PENDING**, stand-up **PENDING**, deck faithfulness **PENDING**. Revision `wr5`: **NOT CREATED** until reviewer feedback arrives.

## Actual checks (24/24)
1. source_card_count: PASS
2. distinct_card_numbers: PASS
3. ordered_card_numbers: PASS
4. songlines_complete: PASS
5. songlines_numbered: PASS
6. no_duplicate_songline: PASS
7. starts_spoken_word: PASS
8. char_limit_strict: PASS
9. unicode_character_parity: PASS
10. stanza_count: PASS
11. four_card_lines_per_stanza: PASS
12. stanza_line_coverage: PASS
13. source_page_matches_stanza: PASS
14. titles_spoken_in_normal_case: PASS
15. intro_distinct_lines: PASS
16. no_meta_message: PASS
17. frizzlebob_at_most_once: PASS
18. no_mechanics_command: PASS
19. both_music_styles: PASS
20. distinct_voice_and_genre: PASS
21. provenance_per_card: PASS
22. honest_visual_flags: PASS
23. review_not_faked: PASS
24. intro_no_exact_collision_22_source_files: PASS

## Limits and semantic note
The source file has `artworkPrompt` but it is not evidence for a seen illustration; it was excluded from lyric authoring. Source card numbers/titles/lore/power were read; lyrics are **creative editorial interpretations**, not verbatim printable fact sheets. Pharaoh registry page and quadrant are null; 2–14 page groups use the preliminary WS0 dossier. No audio, stems, Suno or Remotion tests. The bundled Python validator passed its separate synthetic positive/negative fixture (**2/2 expected results**, after patch 0.3.1), but could not directly run against downloaded GitHub song files in this runtime. Actual song structure was checked here in JavaScript instead. The author of these files is not a valid independent blind critic.
