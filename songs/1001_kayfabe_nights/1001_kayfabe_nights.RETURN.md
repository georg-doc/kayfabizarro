# 1001 Nights R3.2 · two-track mechanical candidate
- Canonical spec blob 29637879615503e4f6b134e27081b00016f6d443, shared song_gate.py blob cc9d8172b3a076470b1ca44f687b44de01aae1eb.
- 56 playable cards: 5–32 (PDF pages 2–8); 33–60 (pages 9–15); meta 1–4 listed in songlines.json.
- Part 1: 2605 Unicode characters, intro 2 beats. Part 2: 2564 characters, intro 2 beats.
- Old R4.1 and original R4 retained for audit.
- Shared R3.2 gate pending actual CI; original exact legacy checker handled by existing workflow, no private copies of song_gate.py.
- Independent critic pending F19–F22; next gate shared CI PASS before external review.
.


## V-419 · R3.2 shared-song-gate · 2026-10-17
- **Current R3.2 delivery:** `1001_kayfabe_nights.part1.r4.2.suno.txt` (printed pages 2–8; #5–32; 28 cards; 2605 Unicode characters) + `1001_kayfabe_nights.part2.r4.2.suno.txt` (printed pages 9–15; #33–60; 28 cards; 2564 characters). Each track has two intro beats and its own outro/Stay Fluffy. Cards #1–4 metaSkips with reasons in songlines.json; card #17 The Giant humanizing tone fixed, #26 Thirty-Nine sung as A7.
- **Binding:** SONG_SPEC_R3.md R3.2 blob `29637879615503e4f6b134e27081b00016f6d443`; shared song_gate.py blob `cc9d8172b3a076470b1ca44f687b44de01aae1eb`, checked out read-only at register `f253bf4b5edb6ac8e2a702a284767fa0e844e7e3`. No local song_gate clones.
- **Actual QA:** GitHub Actions [39043908065](https://github.com/georg-doc/kayfabizarro/actions/runs/39043908065) 2/2 shared `song_gate.py lyrics` steps **EXIT 0 / PASS**, 28/28 and 28/28 card coverage, intro=2 each, opener=8/7. Historical original strict checker [39033060994](https://github.com/georg-doc/kayfabizarro/actions/runs/39033060994) PASS for same 56 playable source card cores. Last CI on metadata-only commit PASS. Seven-track program total includes this deck's two tracks.
- **Blind F19–F22:** zero external reviewer sessions/scores/flags/critic JSON; no writer post-critic revision; no human approval. Critic inputs isolated in register reply `WSA_REPLY_V419_SONGS_R32_2026-10-17.md`. Never pass this Return or old drafts to critic.
- **Unresolved:** artistic judgment / real singing, previous old R4 versions preserved; source PDF drawings not newly visually opened; original cover/rule meta excluded intentionally.
- **One next gate:** `WS0_V419_EXTERNAL_CRITIC_F19_F22`: independent instance returns scores/flags only and passes shared `song_gate.py critic` before one writer revision and WS0 acceptance.
