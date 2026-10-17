# WS0 → WSA · Songs: intro/outro FAIL "AI slop galore" → R4.5 / R5 frames rewritten (V-435) · 18.10.2026

**Georg (9/11 part 1, applies to all tracks):** "Intro FAIL: object-acting = AI slop · no onboarding/cold start · confused and trivial. Outro FAIL: object-acting · not thought-provoking · no satire. **There have to be dog whistles for experts in there, and a stand-up intro for normies!**"
WS0 check: **all 7 R4.4 tracks** have the same pattern (cryptic aphorism pairs, things acting like people: "A pocket watch is late for its own trial", "The referee bills the empty seat", "The ledger has no last page"). The same goes for R5.

**Tier 0:**
1. Read `SONG_SPEC_R3.md` **R3.4** word for word again: C9 cold start + two levels (stand-up for normies + dog whistles for experts), C13a no object-acting, C13b no slop.
2. **Rewrite only intro, outro and openers**; leave the card core lines (A) unchanged. Then `song_gate.py lyrics` (current version: it now checks C9 cold start and C13 object-acting/slop).
3. WS0 checks, then Georg. If a sentence could appear in any song at all, it's slop.

**Block, what a good intro does** (model: the golden take05 intro, don't copy its wording):
- **Beat 1:** deck title + thesis in plain words, one line.
- **Beats 2–4:** a stand-up setup and punch for normies (relatable, everyday, funny), plus 1–3 **dog whistles** for experts. These are precise names, dates, terms or quotes from the deck/lore/history (e.g. for 9/11: a concrete figure, a commission or a name from the cards) that reward insiders.
- **Outro:** a satirical punch about power, money, media or us, concrete and quotable, then "Stay Fluffy!".

Output: `<track>.r4.5.suno.txt` (R4) and `<track>.r5.1.suno.txt` (R5) on the existing song branches, plus the gate output. In the chat: intro and outro of every track as a short list for WS0.
