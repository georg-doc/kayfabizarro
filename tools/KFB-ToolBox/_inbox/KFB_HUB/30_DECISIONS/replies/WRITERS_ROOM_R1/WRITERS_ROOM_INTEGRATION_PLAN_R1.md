# Writers' Room → KFB Audio · Integration Preparation R1 · 20.10.2026
**Owner of this slice:** WS-Song, the Claude Code session that built the Writers' Room artifact. Branch `ws-song/workshop-r1`.

**Assignment:** WSA proposal "WS1 → KFB Audio · Writers' Room Integration Preparation R1", forwarded by Georg.

**Not part of this slice:**
- no new Site or second cloud workspace;
- no merge and no Live promotion;
- no change to KFB Audio, the mixer or the AudioContext.

## 1. Ownership (unchanged)
| What | Owner | Where |
|---|---|---|
| Durable data, versions, approvals | GitHub (SSOT) | `georg-doc/kayfabizarro` |
| Card canon | Registry | `registry/assets/v1/decks/*.json` + `media/kfb/*.pdf.json` |
| Song spec, gate, critic | Song workshop (WS-Song / WSA Writers' Room), WS0 adjudicates | `replies/SONG_SPEC_R4.md`, `song_gate.py` R4.1 |
| Audio, mixer, catalog, MusicClock, AudioContext | KFB Audio | PR #350/#352/#365, https://kfb-audio.frizzlebob.chatgpt.site/ |
| Voice/Triplet content | Voice content owner | PR #379 `planning/kfb-chatterbox-voice-layer-v1-2026-10-08` |
| Writers' Room artifact | temporary working state | https://claude.ai/artifact/9bSQcnqNd91qKXfhra5puM |

## 2. Export (Phase A): done, repeatable
Folder `WRITERS_ROOM_R1/export_2026-10-20/`, tool `export_writers_room.py`. The export can be repeated at any time; each export gets its own dated folder.
- `raw/`: all **153 documents** exactly as they are in the artifact store (60 songs, 60 card sets, 26 rules, 6 lessons, 1 meta), each with its store version.
- `kfb_writers_room_export_r1.json` (`kfb.song.writers-room-export/1`): normalised, with an origin class for each song.
- `MANIFEST.json`: sha256 for each file (155/155 checked after writing), counts and check results.
- `artifact/kfb-writers-room.v1.html`: the page source.

**Version histories:** none yet. All songs are at store version 1, because nothing has been saved in the editor so far. The manifest records this explicitly.

**Not exported:**
- browser-local view settings;
- answers from "Ideen mit Claude", which are only displayed, never stored.

Both are marked as `unexported` in the manifest. Nothing was reconstructed.

## 3. Canon vs. editorial (nothing is promoted)
| Class | Count | Meaning |
|---|---:|---|
| `CANON_DERIVED` (cards) | 60/60 MATCH | copies of the registry canon, re-derived and compared on every export; the registry stays canon |
| `EDITORIAL_CANDIDATE_GATED` | 3 | pilots: Gate R4.1 PASS + critic v2 READY; **no** WS0 or Georg approval |
| `LEGACY_TEXT_R3` | 13 | old texts (R3/opener arc), not ported to R4 |
| `PLANNING_SLOT` | 44 | slot with deck, wave and flags, no text yet |
| `SPEC_MIRROR_R4` / `EDITORIAL` | rules 19 / 7 | hard rules and guide values mirror SONG_SPEC_R4; craft notes and open questions are editorial |

**Audio:**
- No song has audio evidence in the repo.
- The four `*.takes.csv` files in the opener arc are timing tables (`UNTIMED_AWAIT_REAL_AUDIO`), not takes. The export marks them as such.

## 4. Comparison (Phase B, first pass): preserve conflicts, decide nothing
**Parallel material from PR #379 on 5 of the 60 decks.** Marked in the export as `parallelMaterial`, no winner chosen:

| Deck | #379 | Writers' Room |
|---|---|---|
| embrace_protopia | 56 cards standalone, Suno speech parts 1–4 (14.10.) | Pilot r4b, 24-card best-of, performer The Invitation |
| help_i_am_a_human | 56 standalone + 10 compact candidates | slot |
| kayfabizarro_monomyth_mayhem | 56 standalone, Suno parts 1–3 + style | slot |
| 1001_kayfabe_nights | triplets 5/6/7 + postmortem "semantic fail" | legacy R3 text in 2 parts |
| ideology_wrestling | freestyle roast first take + beat script | slot |

**WSA best-of batch 1:** all 20 decks are in the 60. Their style directions are carried over as `styleDirection`.

**Open source conflicts:** AI Kayfabe, Pulitzer Punk and Plot Pusher Posse (same as the WSA plan) are flags on the song. **Ignore Dystopia** and Human Nature Uncut are not in the 60.

## 5. What KFB Audio already has: reuse, don't rebuild
From #365 / `TRIPLET_OPENER_POOL_CONSUMER_CONTRACT_R1` and #379:
1. **Read path:** GitHub Contents API on a content branch. Record the blob SHA separately from `contentRevision`. Reload without a new Site deployment.
2. **Card source:** `media/kfb/index.json` plus the exact card JSON blob. `CardVisuals` = original PDF path + page/quadrant from the registry; crop `PENDING`, no replacement artwork.
3. **Save without a cloud backend:** local draft → editor/writeback JSON with `expectedBlob` → web chat/GitHub compare-and-commit → Reload. On a stale base the result is `REVISION CONFLICT`, fail closed.
4. **Acceptance rule:**
   - The default consumer reads `ACCEPTED` only; preview needs explicit opt-in.
   - Import clears untrusted approval claims.
5. **Audition:** the existing renderer, D bed and ducking. No second AudioContext, clock or mixer.

**The Writers' Room module adds only what is missing:**
- song level (performer, form, beats, cards → beats);
- STYLE A/B and Suno settings;
- take log;
- gate and critic receipts;
- rules and lessons.

## 6. Module contract (minimal, additive): `kfb.song.writers-room-feed/1`
One JSON file per song on a content branch, read like the triplet pool. Pilot: `pilot/big_bad_brain_wrestling.writers-room-feed.json`.
- `deck`: deckId, title, registry and media pins (sha256), PDF path.
- `performer` (verified registry card), `structure`.
- `song`: revision, `lyricsSha256`, chars, `beats[]` (index, text, cue/sung).
- `cardBeats[]`: cardNumber → beats + verbatim `cardText`, card page/quadrant, `visual.crop: PENDING`, `visualVerified:false`.
- `cues[]` (sidecar), `styles.A/B`, `suno` (settings), `takes[]` (Georg's notes, no audio evidence).
- `receipts`: repo paths of the gate, critic, songlines and dossier.
- `audio`: clips `[]`, stems `FUTURE_NOT_AVAILABLE`, timestamps only from real audio.
- `status` + `approval`: the candidate stays a candidate until WS0 and Georg sign off. The default consumer reads only `ACCEPTED`.

**Writeback** follows the same pattern as #365:
- the module produces a draft JSON with `expectedBlob`;
- the gate (`song_gate.py`) runs before every promotion to `GATE_PASS`;
- web chat or Claude Code commits.

## 7. Bridge until the module exists
The artifact stays the comfortable editor, as working state only:
- Georg saves there; `needsGate` marks what has changed.
- On request, WS-Song exports into a new dated `export_*` folder and gates the changed songs. Approved songs become feed files.
- ChatGPT/WSA writes via the prompt pack → import, or directly against the repo files.
- This needs no second database authority: the export is the record, the artifact store is not.

## 8. Pilot (Phase C, one deck)
**Big Bad Brain Wrestling r4a:**
- performer The Jobber (#4), 20 cards, 2,969 characters;
- gate PASS, critic v2 READY;
- no parallel material and no tone flags.

**Feed ready:** 35 beats, 20 card mappings, `approval.ws0/georgListening: PENDING`, `suno: NOT_GENERATED`.

## 9. One next gate
**`WS0_WRITERS_ROOM_EXPORT_ACK_R1`:**
- WS0 checks the ownership table (§1);
- WS0 confirms the parallel-material conflicts (§4) as open (no merge);
- WS0 accepts `kfb.song.writers-room-feed/1` as the contract for the KFB Audio module.

Then:
1. Georg confirms the push of `ws-song/workshop-r1`.
2. WSA integrates the BBBW feed as a read-only Writers' Room area in the existing KFB Audio Site.
