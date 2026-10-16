# Briefing · KFB Deck Music Video R1 · cards + triplets + Suno song, cut on the beat

WS0 → new Claude Code session on Georg's Mac ("WSV", video) · 16.10.2026 · V-337.
Georg's goal: one deck song becomes a real music video. While a triplet line is sung, its card is on screen; everything is cut on the beat; the Hypernormalisation look and our quotes carry the gaps. Stage 1 is a clean 2D base layer. Stage 2 (only after Georg's PASS) adds 3D characters that perform.

## 0. Sources (all exist, read-only)
GitHub `georg-doc/kayfabizarro`:
- **Song + stems (main):** `media/3D_Assets/Sounds/kfb_deck_songs/<key>/` with `<key>.mp3` (Georg's mix), `<key>.srt`, `meta.json`, `stems/` (lead/backing vocals, drums, bass, …). Keys: `wrinkle_rumble__suno_01a` (180 BPM), `help_i_am_a_human__suno_01e` (168), `kayfabizarro_philosophy__suno_01d` (152), `kayfabizarro_monomyth_mayhem__suno_01c` (110).
- **Per-card timing (local Dropbox):** `~/Dropbox/CLAUDE/KFB_HUB/40_AUDIO/<key>/cues.csv` (one row per sung line: `kind`, `card_number`, `card_title`, `mix_start_s/mix_end_s`, `stemsum_start_s/…`, transcript), `words.json` (word timing), `<deck>.takes.timed.csv`, `RETURN.md` (known quirks, e.g. Help: mix drifts up to 4.6 s against stems; use the stem-sum time base there).
- **Cards (main):** `registry/assets/v1/decks/<deckId>.json` (cardNumber → `page` + `quadrant`, title, power, lore) and the print PDF in `media/kfb/` (e.g. `Wrinkle_Rumble - ADD web ID.pdf` + `.pdf.json`). A card image = the plain quarter-page crop of that page/quadrant. Never trim, never recolour; marginalia stay.
- **Hypernormalisation (branch `planning/billboard-quote-hypernorm-curator-2026-10-04`):** `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/` – `START_HERE.md`, `QUOTE_POOL_BATCH_01.json` + `QUOTE_RESEARCH_RESERVE_*.json` (quotes with attribution), `DECK_QUOTE_PROFILE_SEED.json` (which quotes fit which deck), `AUDIO_VISUALIZER_HANDOFF_SCHEMA.json` (beat/bar/band events), and `DONOR_PDOOM_CODE_RENDERED_MUSIC_VIDEO_2026-10-10.md` (a full three.js music video rendered deterministically from song time – read it, it is the closest model). H13 look reference (main): `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/KFB Billboard Kaleidoscope H13.dc.html`.
- **Motion recipes (Draft PR #402, branch `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15`):** `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/INTERACTIVE_MOTION_RECIPES_R2.md` – `deck.deal`, `card.flip.reveal`, `card.fan.spread`, `card.inspect.hero`, `scene.transition.card`, `speech.bubble.cue` …; rule: a recipe is data, `sample(recipe, t)` is stateless and seekable, the clock comes from the host.
- Register: branch `docs/kfb-decisions-register-2026-10-11`, `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/DECISIONS.md` (V-220, V-259, V-279, V-298, V-299, V-327, V-337).

## 1. Stage 1 · 2D base layer (this order)
**Pilot deck: `wrinkle_rumble` (48 cards, 180 BPM).** Second deck only after Georg's PASS.
1. **Analysis (Python, own venv):** beat grid, downbeats and bars from the drum stem; onsets and band envelopes (bass, drums, vocals) per frame; verify the grid against 180 BPM. Merge with `cues.csv` + `words.json` into one `timeline.json` (song time in seconds and frames).
2. **Edit list:** `edl.json` (`kfb.video-edl/0.1`): per shot `shotId`, `startFrame`, `endFrame`, `kind` (intro, card, quote, outro), `cardRef {deckId, cardNumber}`, `recipe`, `quoteId`, `audioRef`. Cuts snap to the nearest beat (card change on a bar line where possible), never inside a sung word.
3. **Shot grammar:**
   - intro: deck title + cover/first card, H13-style kaleidoscope background in the deck's palette;
   - each sung line: its card enters on the beat (deal/flip), stays complete and readable for the whole line, small hero push and beat pulses (squash/scale on drum hits, never shaking the card text); the sung line runs as a short read-along caption, phrase by phrase, synced to `words.json` (karaoke feel, no word-by-word pop);
   - instrumental gaps longer than ~2 bars: one quote interlude from the pool for this deck (text + attribution + quote id), kaleidoscope steps on the beat;
   - outro "Stay Fluffy!" with the full deck fanned out.
4. **Render:** Remotion (React, frame-exact; bundles its own ffmpeg; free for individual use, which fits Georg). Composition reads `timeline.json` + `edl.json`, no hand-placed frames. 16:9 1920×1080 first, then a 9:16 1080×1920 cut (card larger, caption below). 30 fps unless 60 is cheap.
5. **Proof before the full render:** a 30-s clip (intro + first 3 cards) + contact sheet (one frame per 2 s). WS0 checks, then Georg. Only after that the full song.

## 2. Stage 2 · characters perform (only after Stage 1 PASS)
Same EDL, extra layer via `@remotion/three` (React Three Fiber): FrizzleBob plus one partner (GothGirl or Lord Hunky/Lady Dory once their Blender repair is done) on a simple diorama stage. EyeRig v6 eyes, mouths from the approved sets driven by `words.json` visemes (V-299: Hunky GPT B, Dory GPT A), and per V-298 **single clips timed to the beat** instead of one continuous choreography: 3–4 dance moves from the Motion Library chosen for this deck, arm/eye/brow accents on hits; cutting between clips on the beat is fine. Cards stay the hero: characters present the card, never cover it.

## 3. Rules
- Workspace `~/Dropbox/CLAUDE/KFB_VIDEO/`. Never touch `~/Dropbox/CLAUDE/KFB Open World/`, never port 5180, never stop Lab 5192; stop only your own processes by PID.
- Disk: ≥ 40 GB free before a full render; renders run in the background with a time limit.
- Audio = Georg's original mix, unaltered (no re-mix, no re-time). A card is shown only with its own line (`deckId` + `cardNumber` from `cues.csv`).
- Code → GitHub new branch `video/kfb-music-video-r1-2026-10-16`, no merge. MP4s stay in Dropbox (too big for the repo). Nothing is posted anywhere.
- Lean review (V-312): diff + proof clip + contact sheet; no reviewer swarm.

## 4. Acceptance grid (measure yourself, numbers in the report)
- G1 every sung line shows exactly its card for ≥ 90 % of the line.
- G2 every cut lies within ±1 frame of a beat-grid point; no cut inside a word.
- G3 card complete, uncropped, unrecoloured; title readable at 1080p and on a phone (9:16).
- G4 caption phrases within ±80 ms of `words.json`.
- G5 A/V sync drift < 1 frame over the whole song.
- G6 every quote shown has its pool id and attribution.
- G7 no flashing faster than 3 per second (photosensitivity).
- G8 deterministic: the same frame number renders the same image twice.

Report in German to WS0 (file `replies/WSV_VIDEO_R1_STATUS.md` on your branch), one open question at most. Deliver video files as Dropbox paths (Georg clicks), proof clip first.
