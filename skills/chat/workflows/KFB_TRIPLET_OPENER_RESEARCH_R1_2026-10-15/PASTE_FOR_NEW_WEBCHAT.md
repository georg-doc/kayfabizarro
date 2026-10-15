# NEW WEBCHAT / DEEP RESEARCH TASK — KFB Opener Diversity R1

Carry out a real, cited Deep Dive into **short English narrative/dialogue openers** for the **existing KFB Triplets spoken-word tracks**. This is a bounded research and editorial shortlist task only, not new plugin/runtime production.

Start by reading the current GitHub versions of:
1. `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`;
2. `skills/chat/workflows/KFB_TRIPLET_OPENER_RESEARCH_R1_2026-10-15/DEEP_DIVE_WEBCHAT_BRIEF.md` and `SEED_FRAMES_UNAPPROVED.json` on `research/kfb-triplet-opener-diversity-r1-2026-10-15`;
3. current WS0 `TRIPLET_SET_SPEC_R2.md` and `triplet_set_check.py` in `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/` on `docs/kfb-decisions-register-2026-10-11`;
4. `skills/chat/workflows/KFB_TRIPLET_BATCH_8_R2_2026-10-15/BATCH_INDEX.json` and `RETURN.md` on `editorial/kfb-triplets-eight-decks-r2-2026-10-15`, plus selected completed takes.
GitHub truth overrides old chat assumptions.

**The problem:** there are currently 27 approved opener literals but too many variations of 'You know / Do you know / Have you heard of'. We need diverse **narrative situations**, not just synonym substitutions: 'I read a book about ...', 'I saw a film about ...', 'A friend told me about ...', 'Someone wrote in my diary: ...', 'A note under my door: ...', 'I heard a rumor about ...', 'I saw a painting of ...', 'A politician once claimed: ...', and many more. Use natural, economical and performable English; no generic AI gag or forced stand-up punchline. Explore oral anecdote, conversational pragmatics, found documents, diary/poetry album, memory, sketchbooks, overheard dialogue, report/meeting, rumour, radio, cinema, gallery, museum, stage/backstage, folklore and eccentric cartoon diction. Research these patterns on the web with trustworthy citations and independently authored language; avoid copying protected dialogue.

**Architecture guard:** one canonical Triplet per card; opener separate; present runtime joins exact `opener + " " + triplet`. NO runtime LLM, no mass story-mode variant pool, no new voice runtime. Source card name/POWER/LORE remains untouched. Proposed quoted or remembered situations are fictional performer frames, not factual external records; label attribution risks clearly. Respect semantic classes (PERSON / OBJECT / SCENE / ABSTRACT / EVENT / SYSTEM / PLACE), grammatical compatibility, Fluff-o-lect/player closure, one opener use per track and min 10-line family separation, 5000-character Suno ceiling.

**Do the work:**
- Audit/classify all 27 approved openers and 74 *unapproved initial seeds*; do not treat those seeds as researched goldens.
- Gather at least 100 candidate openings from at least 10 distinct narrative situations, with sources for patterns, not borrowed catchphrases.
- Produce 40–70 genuinely diverse curated R3 candidates with literal string, semantic eligibility, syntax join, family, fiction/attribution risks, audible cost, sample card and review status `PROPOSED`.
- Stress-test exact concatenation on >=24 genuine card Triplets across >=4 KFB decks. Include good matches **and bad rejects**. Read real source cards; never change their wording to save an opener.
- Simulate schedules for 48 / 52 / 56 / 60 card tracks; enforce one use per literal, 10-line sibling gap, class eligibility and <5000 chars. Compare variation to baseline.
- Display a **human-readable** A/B shortlist of 12–20 actual spoken card+opener combinations (not just JSON), with genuine audio-readability judgment and risks. Pick 10–20 for initial Georg PASS/TUNE/FAIL review.
- Save additive `OPENERS_R3_CANDIDATES.json`, `OPENERS_R3_COMPARISON.md`, `OPENERS_R3_TESTS.md`, `OPENERS_R3_RETURN.md` under the same research branch or a child branch if the checked GitHub owner explicitly requires it. Verify GitHub heads after each write.

**Do NOT** rewrite existing approved OPENERS, run the new entries in the eight tracks, change the KFB plugin, publish a Site, add a runtime, create a PR or merge. No new WS0 V-number without WS0 authority. The next human gate is **GEORG_OPENER_R3_SHORTLIST_REVIEW**, not immediate adoption. Return exact repo/branch/head/files, sources and actual test counts.
