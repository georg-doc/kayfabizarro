# Forget Utopia — first independent Triplets plugin-authoring trial — 2026-10-15

## Scope and sources
Owner: existing kfb-triplets plugin v0.2.1, no new plugin. Same branch editorial/kfb-triplets-set-r2-2026-10-15, not PR/merge. Source pinned to data/kfb-registry-title-case-2026-10-15 commit a71de421; path media/kfb/Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json; verified Git blob 8cf659592cc3aadd1b5bbab9371780b6b5c75bbd; 56 card records (1–56), no meta/OPEN exclusions.

This is a newly authored set, NOT replay of WS0 donor or Wrinkle Rumble. Authoring rules from WS0 R2 spec (its inspected current contents include updates V-275/V-277/V-280 beyond original R2) and original approved opener pool. No source material from artworkPrompt, jsonLegacy, marketing or grade.

## Output
- output/forget_utopia.suno.txt: two independently take-cuttable [Spoken Word] sets in one text file. Track character counts 2800 and 2683, both <5000; two intros built from deck/card titles; Stay Fluffy outro per set; blank line between all beats. Two tracks used because the 56-card single-track set exceeds budget.
- output/forget_utopia.takes.csv: 60 rows (56 card takes + two intros and two outros) with track/set, line_no, kind, card_number, normal-case card_title, opener, triplet, spoken_text and unset actual timings marked UNTIMED_AWAIT_REAL_AUDIO.
- output/forget_utopia.hub.json: all 56 card numbers exactly once, 56 editorial candidates; skipped []; no audio.
- output/forget_utopia.check.txt: 0 source-word failures from checker-equivalent JavaScript port against the real live-fetched pinned GitHub deck JSON, including all 56 card title fields and grammar/inflection lists. **Important**: NOT output from the exact Python checker on the real deck; it says so in its footer.

## Actual tests/evidence
- GitHub source fetched at pinned a71de421 and all 56 authored lines checked against original printed cardName, power and lore via equivalent R2 word matcher: first pass 23 lines had foreign lexical forms, repaired; second pass 56/56 matched, 0 lexical foreign words.
- New result 2 tracks, lengths 2800/2683, no duplicate opener within either; 14 approved opener usages.
- GitHub four output files each written and exact branch head plus content re-read (4/4 positive readbacks).
- **Exact Python checker, real deck + takes CSV: NOT RUN (0 tests).** GitHub connector can fetch repository content but runtime file transfer to the isolated Python container was unavailable; no false 0-FAIL Python PASS. This remains the hard technical acceptance gate for WS0.
- **Semantic read-through is editorial-only and not independently accepted.** Several compressed fragments may imply more or less than the card material; independent WS0 review required.

## Five weakest lines for WS0
1. #15 The Unfalsifiable Mission: “advancing humanity, accountability” lacks the explicit accountability-resistance mechanism, risks implying the opposite.
2. #19 The Referral: compressed “growth disguised as generosity; marketing for sharing” loses the card's specific conversion of believer to recruiter.
3. #29 The Warm Bath: “optimism sedative” is card-backed but the result “comfortable paralyzed inaction” is abstract and risks reading as a definition.
4. #36 The Vibes Audit: “tone rather than metrics” does not make the misleading measurement substitution vivid or character-performable.
5. #54 The Load-Bearing Lie: “fragile assumption, finished facade” retains imagery but weakens the source's if-false conditional that drops the whole roof.

## Acceptance state
EDITORIAL_CANDIDATE, **NOT QA GREEN**: exact Python real-deck check missing and 5 semantic risks need WS0 word-by-word audit. No recording, no Suno upload, no Site/Cloudflare, no new deck, no PR/merge.

## One next gate
WS0 reruns the **exact current Python checker** from docs/kfb-decisions-register-2026-10-11 against pinned source JSON a71de421 and output/forget_utopia.takes.csv, then independently audits every semantic claim and five weakest lines. Return to Georg only on actual 0 FAIL and editorial pass.
