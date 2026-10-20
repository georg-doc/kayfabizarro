# Song Workshop · process and roadmap (for WS0) · as of 20.10.2026
**Branch:** `ws-song/workshop-r1`, additive only. Every completed step is pushed. The chronological status is in `SONG_WORKSHOP_STATUS.md`.

## Roles
| Who | Does |
|---|---|
| Georg | creative direction, confirms residents, listens and chooses in Suno, final word |
| WS-Song (Claude Code) | writes songs, spec/gate, critic runs, Writers' Room, exports, status |
| Blind critic | fresh subagent per track. It sees only lyrics, STYLE and a neutral synopsis, and writes no replacement text |
| WS0 | approves the spec, ownership and exceptions; checks sources |
| WSA / ChatGPT | via the prompt pack → import in the Writers' Room; later the KFB Audio module |
| KFB Audio | audio, mixer, catalog (unchanged) |

## Process per song
1. **Resident** from `RESIDENT_PROPOSALS_R1.json` (figure, home, how the cards appear, musical direction).
2. **Draft:**
   - in the Writers' Room (Georg or ChatGPT import) or by WS-Song as `*.draft.json`;
   - `build_track.py` produces lyrics + songlines r4 (card → beat mapping) + synopsis.
3. **Gate:** `song_gate.py lyrics` + `style` (R4.2) → `*.gate.txt`. Hard means source and form; everything else is a signal.
4. **Critic:**
   - fresh, blind, `kfb.song-critic.v3`, checked with `song_gate.py critic`;
   - a rejected critique is discarded and run again.
5. **At most one revision**, then gate and critic again; the result is final.
6. **Album comparison** after every 3–5 tracks (`song_gate.py album`).
7. **Georg in Suno** (by hand, no API): takes, settings and choice go into the Writers' Room.
8. **Export:**
   - Writers' Room → `WRITERS_ROOM_R1/export_<date>/` (`export_writers_room.py`, MANIFEST sha256);
   - approved songs → `kfb.song.writers-room-feed/1` for KFB Audio.

## Roadmap
| Step | Content | State |
|---|---|---|
| 1 | Spec/Gate R4 + fixtures | done (R4.2, 41/41) |
| 2 | 3 pilots (stage version r4a/b) | done, superseded by the resident principle |
| 3 | Writers' Room + 60-deck selection + export + KFB Audio integration plan | done |
| 4 | Residents for 60 decks | done, Georg confirmed 20.10. |
| 5 | **3 pilots as resident performances (r5)** + critic v3 | **in progress** |
| 6 | Georg listens to the 3 pilots in Suno | after 5 |
| 7 | Next groups of 3–5 decks (WSA batch 1 first) | after 6 |
| 8 | WS0 ACK for R4.2 + feed contract, then the KFB Audio pilot | waiting for WS0 |

## Open for WS0
- ACK/TUNE on SONG_SPEC R4.2 (section B: residents, open address, fractal cards) and on critic v3.
- `WS0_WRITERS_ROOM_EXPORT_ACK_R1` (ownership, #379 parallel material, feed contract).
- Tone entries (E16b) for new decks.
- Georg's open question: may a resident set up "Stay Fluffy, Folks!" in advance?
