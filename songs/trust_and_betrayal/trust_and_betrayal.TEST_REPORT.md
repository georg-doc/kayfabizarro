# trust_and_betrayal · Writer's Room wr4 · Static Test Report

Status: **STATIC PASS 24/24**, not independent music acceptance. Generated 2026-10-16 from the actual branch files; GitHub-read JavaScript checks, not the Python validator executed on complete songs.

## Counts
- Registry cards: 56; stored cards: 56; songLines: 56; printed-page stanzas: 14 × four cards.
- Lyrics: **4342 Unicode characters including all line breaks**, strictly below 5000; style prompts: 2.
- Source PDF picture pages visually checked now: **0**; motif coverage verified: **0/56**; page mapping comes from registry (provided mappingVerified:true, no new PDF render).
- Old intro comparison: **22/22** files `OPENER_ARC_R2/*.suno.txt` retrieved and checked for exact reuse of nine new intro lines; **0 collisions**. Lexical overlap screen only, not independent criticism.
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
Source `artworkPrompt` is not proof of an actual seen printed illustration; it was excluded from lyrics authoring. Creative `songLine`s are editorial interpretations rather than verbatim print. **Card #30**: printed card reported title-only in older WS0 dossier although registry has POWER; editorial lyric is OPEN pending actual PDF check. No audio, stems, Suno, SRT, Remotion or real blind review tested. Bundled Python static validator's *synthetic* positive/negative fixture passed **2/2 expected outcomes** after plugin v0.3.1 patch, not run on downloaded GitHub song bundle; actual complete-song structure was checked with these JavaScript assertions. Author is not independent reviewer.
