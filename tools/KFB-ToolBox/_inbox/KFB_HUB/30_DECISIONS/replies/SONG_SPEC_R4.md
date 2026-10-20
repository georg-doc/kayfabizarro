# KFB Suno song spec R4.0: Comic Performance (V-576) · 20.10.2026

**R4.2 (20.10., Georg's clarification, pending WS0 ACK):** the song belongs to the deck's **resident** (NPC), who performs it in their diorama home, with an open address; the cards appear fractally. See section **B**. Gate R4.2: C9B (resident from the asset catalog), C9R (stage formulas and crowd cues as REVIEW). Critic `kfb.song-critic.v3` (+ `resident`, `fractalCards`). Fixtures 41/41.

**R4.1 (20.10., gate only):** the critic check ignores punctuation at the end of a quote (`"…carefully,"`). In the answer to `transferable`, "swap/swapping" describes the question and is no longer read as a text suggestion. "e.g." stays forbidden. Fixtures: 34/34.

**This file replaces SONG_SPEC_R3 (R3.7) for song mode.** R3 stays in the repo as history. `TRIPLET_SET_SPEC_R2` (spoken triplets) and `triplet_set_check.py` are **unchanged**; nothing here applies to them.
Gate: `replies/song_gate.py` **R4.2** (one script, no per-deck copies, no shadow parser). Fixtures: `replies/SONG_GATE_R4_FIXTURES/` (`python3 run_fixtures.py`).
Basis: WS0 decision matrix V-576 (ACK with TUNE) on Georg's rule-reconciliation request, building on V-361, V-362, V-374, V-376, V-528.

**Tier 0 – what is standardised:** the production handoff, not the artwork. Card truth is hard; dramaturgy is free. Every deck song is its own musical work, performed by a performer with a personality of their own. Georg's Alice song (`SONGS_BESTOF_R1/ALICE_USER_EXEMPLAR_2026-10-20.md`) is a reference, not a template: no default court, jury, electro-swing or catchphrase.

## Severity levels (gate output)
| Level | Meaning | Effect |
|---|---|---|
| `FAIL` | hard source or form error | exit 1, the song does not move on |
| `WARN` | stylistic number pattern outside the guide value | exit 0; give a reason in the dossier |
| `REVIEW` | editorial signal | exit 0; the critic or WS0 looks at it |
| `INFO` | evidence | – |

## S · Source and mapping (hard)
S1. `songlines.json` uses `"schema": "kfb.songlines.r4"` and carries `deckId` and `deckTitle` exactly as in `registry/assets/v1/decks/<deckId>.json`. A wrong deck or title is a FAIL. **Deck ID and title are hard in the metadata and the Hub, not in the first beat.**
S2. **Pinned source:** `sourcePins.deck.sha256` (registry JSON) and `sourcePins.media.sha256` (+ `rawPinned` URL) of the `media/kfb/<pdf>.pdf.json`. If a pin does not match the file the gate reads, that is a FAIL.
S3. **JSON first, PDF only by exception.** Image words come from `artworkPrompt` in the pdf.json and are logged as `visualMotifs[]` with `"visualVerified": false`. `true` is allowed only with `visualEvidence` (page, method). The canonical card fields (`cardName`, `lore`, `power`) are immutable.
S4. `bestOf` = the list of sung card numbers (for a full deck, all of them). Only real card IDs from the deck; no duplicates. A best-of without `bestOfReason` is a FAIL. Choose cards by what they add (cause, contrast, reversal, escalation, landing), **never the first N**. `metaSkipped` as in R3 A9.
S5. **Mapping `cardNumber` → lyric beat span** in `cards[]`: `{"cardNumber": n, "beats": [i, …], "cardText": "…"}`.
   - Beats are counted from 0 (the first cue tag = 0), in blocks separated by blank lines.
   - `cardText` is the **verbatim** card portion inside the beat (a string or a list for several beats). Everything else in the beat is performer text.
   - Several cards in one beat (a merged beat) are allowed: one entry per card.
   - A FAIL if: a card is not in the deck, a card is mapped but not in `bestOf`, a card is in `bestOf` but not mapped, a beat is not sung, or `cardText` is not verbatim in the beat.
S6. **Card truth in `cardText`** (R3 A2 unchanged): only words from **this** card (`cardName`, `lore`, `power`, its own `artworkPrompt`, logged `songLine`). One foreign word = WARN, two or more = FAIL (wrong card or invented content). At most one Fluff-o-lect word.

## A · Card portion
A1. **Speaking the card title is an artistic choice** (V-576, A1/C10 ACK). The mapping (S5) is what is hard.
A3. Claim and story of the card first; power at most as an aside or inversion; no dice values or rule labels (V-372).
A4. **80–95 characters per card portion is a guide value → WARN** (V-576, A4 TUNE). A deliberately long or short beat gets a sentence in the dossier.
A5. `songLine` rewrites are ≤ 10 % of the cards → WARN otherwise. A7 spellings do not count.
A6. **Cues** (V-576, A6 TUNE): stage, crowd and instrumental cues are **never in sung text**. They are allowed either
   - as a **beat of its own, on the whitelist** (`[Spoken Word]`, `[Crowd Cheering]`, `[Instrumental Break]`, `[Bell]`, `[Silence]` … see `CUE_TAGS` in the gate), or
   - as a **sidecar** in `songlines.cues[]` (`{"afterBeat": i, "cue": "…"}`) for Comic Motion and the mix.
   Brackets inside a sung beat are a FAIL; an unknown tag is a FAIL.
A7. Numbers and symbols written out (R3 A7, hard).
A8. No game words (R3 A8, hard).

## C · Frame and performer
C8. The first beat is a cue tag (default `[Spoken Word]`); a blank line between beats; no multi-line beats (hard).
C9. **Deck title in the first beat: optional** (V-576, C9 ACK). Deck identity can come from the performer in a later beat, in the title, or in the outro. If the title is never spoken, that is a REVIEW signal. The intro needs at least one beat of its own (hard); two or more is the guide value (WARN).
C9P. **Named KFB performer instead of a neutral narrator** (V-576 ACK), **verified KFB figures only**:
   - `songlines.performer = {"name", "deckId", "cardNumber", "stance"}`. The name must match a real card in the registry (FAIL otherwise). The performer may come from another deck.
   - A named figure in the frame (FrizzleBob, Uncle, Rabbit …) without a matching verified performer = FAIL.
   - The performer's voice and stance belong in the dossier/songlines, **never in STYLE** (V-362).
C10. **Dramaturgy is free:** bridges without a card between cards are allowed. Card order may be edited (`orderMode: "edited"`, REVIEW). The frame may call back to cards (REVIEW/INFO); naming a card that is **not** sung is a WARN.
C11. Refrain (≤ 8 words, ≤ 3 times), shouts and word repetition: guide values → WARN.
C12. The whole song is **< 5000 characters, Unicode `len()` including blank lines (hard)**. The last beat is `Stay Fluffy, Folks!` on its own (R3.6, hard). An outro beat before it (hard).
C13. Anti-slop (R3 C13a/b, hard): no object-acting and no slop words in performer text (frame and asides).
B6/B7/B7b. Opener quotas, intro types and callback counts are **editorial signals** (WARN/REVIEW, V-576 ACK), not quotas. Hard rule: no "and then" (KayfabeTip 1).
E16b. Tone check per deck (hard, as in R3).

## B · Resident in the diorama (R4.2, Georg 20.10.2026)
B1. **Who performs:** every deck has a resident (NPC; a duo or ensemble is also possible, e.g. the two mummies for Pharaoh Piledriver). When the deck is complete, the resident performs the deck song in their **home in the diorama**, in the deck's language, world view and themes.
   - `songlines.performers = [{"model", "asset", "role"}]`.
   - `model` = a `model-3d` name from `registry/assets/v1/catalog.jsonl` (texture variants count as their own figures, e.g. light and green orcs, Magical Girl A–D) or a KFB house figure (FrizzleBob v5).
   - An unknown model is a FAIL (C9B).
   - The earlier `performer` (card, C9P) remains valid but is no longer the default.
B2. **Open address:** other residents may be listening, or only the player. Stage formulas ("Good morning/evening", "Tonight", "front row", "make some noise" …) and crowd cues (`[Applause]`, `[Crowd Cheering]` …) are a REVIEW (C9R), unless they belong to the deck's world (`songlines.diegeticCrowd` with a reason). "Welcome to" and "Ladies and gentlemen" stay a FAIL (C9).
B3. **Fractal:** the cards are figures of this world and claim something about themselves (show it, spin it, sell it, V-373). The resident lets them appear, is one of them or tells about them. No list read out loud. Card titles stay optional (A1).
B4. **Comedy without a stage:** setup and punch, callbacks, timing and double meanings are welcome; the stand-up situation is not.
B5. **Music:** always danceable. A melancholy tint is allowed where the deck carries it (e.g. philosophy), but no sad jazz-club number. Duet voices are allowed in STYLE (voices only, no names, V-362).
B6. **Resident proposals:** `WRITERS_ROOM_R1/RESIDENT_PROPOSALS_R1.json` (60 decks, Georg confirmed them on 20.10.). Magical Girl A is reserved for Georg's Alice.

## D · STYLE (V-362, V-576)
D13. Purely musical: genre fusion, instruments, groove, voice timbre and delivery, production. **No performer, card or deck names (FAIL).** Role and story words are a WARN. Two variants, A and B, that differ musically (only one = WARN). Each variant ≤ 1000 characters (WARN).
D13b. **BPM 100–130 and danceability are an album-level preference.** A missing or different BPM, or a "slow/ballad/noir" word, is a WARN unless `songlines.bpmException` gives an audible purpose (then INFO). **Hard: main genres (family of variant A) do not repeat within a batch** (`style --batch …`, `album`).

## F · Critic (V-576): `kfb.song-critic.v2`, from R4.2 `v3`
F1. **Fresh, isolated process** (a new subagent/session with no writer's room context, read-only). It sees **only** the candidate (lyrics), the STYLE and a neutral synopsis (`<track>.synopsis.txt`, ≤ 60 words, no score and no intent of the writer). No source cards, no dossier, no drafts. It writes **no replacement text**.
F2. Guiding questions (answer `yes|partly|no` + observation ≤ 60 words):
   - `standalone`: does the number work without prior knowledge?
   - `performer`: does the performer have a personality?
   - `storyBetweenCards`: does a story emerge between the cards?
   - `individuality`: are the satire, conflict and arrangement individual?
   - `outro`: does the outro land?
   - `transferable`: could the text move to another deck with few changes? **`yes` is a warning sign.**
F3. Schema (exact fields):
   `{"schema":"kfb.song-critic.v2","song":"<file>","lyricsSha256":"…","styleSha256":"…","critic":"<model/instance>","blind":true,"inputs":["lyrics","style","synopsis"],"questions":{…},"flags":[{"beat":N,"observation":"≤30 words"}],"recommendation":"REVISE|READY_FOR_WS0"}`
   - `READY_FOR_WS0` is only allowed without a `no` and with `transferable` ≠ `yes`.
   - Quotes only from the candidate.
   - The sha256 must match the submitted revision.
   - Gate: `song_gate.py critic <x.critic.json> --lyrics … --style … --synopsis …`.
F3b. **A critique the gate rejects is discarded** and run again in a **fresh** process on the same revision (as in R3 F21). Keep the rejected JSON as `*.critic.discardedN.json`. The writer does not use it for revision.
F4. **Source check is a separate test:** S1–S6 in the lyrics gate; WS0 audits the facts. The critic does not certify card truth.
F5. **Album diversity** after every 3–5 tracks (not blind): `song_gate.py album <songlines…>` (genres, BPM, performers, openings/closings) plus a short editor's note in `SONG_WORKSHOP_STATUS.md`.
F5b. **v3 (R4.2)** = v2 + `resident` ("Is a figure speaking from their own world, whether others are listening or only one person?") + `fractalCards` ("Do the cards appear as figures of this world that claim something about themselves?"). Neutral synopsis: "performed by <figure> in their home, for whoever happens to be there".
F6. `kfb.song-critic.v1` (R3 §F) remains valid for existing critiques; the gate checks both schemas.

## E · Process
E1. One writer (WS-Song); WS0 judges the spec, sources and exceptions; Georg chooses in Suno by ear. **No Suno credits and no audio without Georg.**
E2. Order per song: dossier (source, thesis, performer, angle) → lyrics + STYLE A/B + songlines r4 → `song_gate.py lyrics` + `style` (→ `<track>.gate.txt` with command, exit code, gate sha256, source pins) → critic v2 → at most **one** revision → gate again → status.
E3. Delivery per pilot: lyrics, STYLE, gate report, critic JSON, a short status in `replies/SONG_WORKSHOP_STATUS.md`.
E4. **Comic Motion later:** per song a performance mapping (card → beat → panel) as its own file. Timestamps only from real Suno audio or stems, never estimated.
