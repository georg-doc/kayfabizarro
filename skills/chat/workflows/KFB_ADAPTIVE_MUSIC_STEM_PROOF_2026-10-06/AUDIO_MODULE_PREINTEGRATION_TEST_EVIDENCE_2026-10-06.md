# CHECKPOINT 2/3 · Audio Module Pre-Integration Test Evidence

Date: 2026-10-06
Status: TECHNICAL PASS · NOT HUMAN_ACCEPTED
Owner: KFB Audio / Jukebox / Mixer
Repo: `georg-doc/kayfabizarro`
Branch: `web/kfb-adaptive-music-stem-proof-2026-10-06`
Draft PR: #365
Implementation head tested: `0e9c57cdd35d79d8eb4943cd3c0529bb616c2a9b`
Canonical audio source: `main@276728f3f82f729cd1656b61e81d278856d736bb`

## Test environment

- browser: Codex In-App Browser, Chromium 154 user agent;
- decode target: one host-owned `AudioContext({ sampleRate: 44100 })`;
- module-created AudioContexts: **0**;
- exact QA page: `tools/KFB-ToolBox/audio/runtime/qa-browser.html`;
- actual audio fetched from the canonical pinned GitHub commit;
- browser warning/error log: **0**;
- unintentional network/decode errors: **0**.

The first CLI-launched Chrome attempt was blocked by the local process environment before a page opened. The same harness was then run in the existing In-App Browser. The first completed audio pass exposed that an arbitrary quarter-beat plausibility threshold was too strict for C/O export tails. Runtime policy was repaired to use a shared full-bar floor for C/M/N/O; the second complete browser pass was **PASS**.

## Real family decode verdicts

All source stems decoded as **44.1 kHz stereo**. Every family has identical frame length across its stems, so family-internal duration delta is **0.00 ms**.

| Family | Verdict | BPM | Stems | Decoded stem duration | Delta | Shared runtime loop end | Tail excluded for bar alignment | Nearest-beat export residual |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| C · Cozy Base | `RUNTIME_VERIFIED` | 81 | 10 | 180.959977 s | 0.00 ms | 180.740741 s | 0.219237 s | 0.295969 beat |
| M · Island Life | `RUNTIME_VERIFIED` | 112 | 10 | 249.527982 s | 0.00 ms | 248.571429 s | 0.956553 s | 0.214434 beat |
| N · Dusk/Night | `RUNTIME_VERIFIED` | 70 | 11 | 204.695986 s | 0.00 ms | 202.285714 s | 2.410272 s | 0.188016 beat |
| O · Discovery/POI | `RUNTIME_VERIFIED` | 82 | 9 | 251.399977 s | 0.00 ms | 248.780488 s | 2.619490 s | 0.420031 beat |

Declared BPM is plausible for all four exports within half a beat. The raw file ends are not exact phrase endpoints. The runtime therefore does not use the arbitrary encoded tail as the loop boundary: all stems in a family share one full-bar endpoint. Simulated inter-stem drift after 100 loops is **0.00 ms** for every family. Enter/exit still uses the single Audio-owned MusicClock and gain crossfade; no second clock owner exists.

## Master fallback

The harness intentionally returned HTTP 503 for every stem request while leaving the real family master reachable. All four families recovered through the runtime's public load seam:

| Family | Real master decoded | Fallback result | Active role | Module-created AudioContexts |
|---|---:|---|---|---:|
| C | 179.879977 s | `MASTER_FALLBACK` | `MASTER` | 0 |
| M | 249.839977 s | `MASTER_FALLBACK` | `MASTER` | 0 |
| N | 205.840000 s | `MASTER_FALLBACK` | `MASTER` | 0 |
| O | 249.959977 s | `MASTER_FALLBACK` | `MASTER` | 0 |

The current deck is decoded before replacement and remains available when a requested family is unavailable. No placeholder audio is used.

## Ambiguous source-label disposition

Technical promotion does not promote source labels into semantic truth. These layers remain `AMBIGUOUS_RETAIN_MUTED` with default gain 0:

- C `0 Backing Vocals.mp3` — sampled RMS 0.0000123, peak 0.001086;
- M `0 Lead Vocals.mp3` — sampled RMS 0.0002123, peak 0.018976;
- M `7 Other.mp3` — sampled RMS 0.0068345, peak 0.120474;
- N `0 Lead Vocals.mp3` — sampled RMS 0.0000522, peak 0.004656;
- N `1 Backing Vocals.mp3` — sampled RMS 0.0000196, peak 0.001740.

O has no Vocal/Other-labelled export layer. The signal audit proves that the ambiguous files are real and decodable; it does not claim human semantic acceptance. Keeping them muted prevents unintended vocals in the default runtime mix.

## Synthetic context/event fixtures

`qa-fixtures.mjs`: **8/8 PASS**. Fixture inputs call only `setContext()` / `emit()` and contain no track IDs, family IDs, BPM values, stem identities or gains.

| Fixture | Final Audio resolution | Evidence |
|---|---|---|
| `DAY_ROAM` | G / MOVEMENT | one injected context, stems |
| `DAY_STAY` | M / STAYING | C remains verified fallback |
| `DUSK_TO_NIGHT` | M → N | 10 old sources retired after scheduled crossfade; no hard stop |
| `POI_DISCOVERY` | M → O | event-owned mapping; 10 old sources retired after crossfade |
| `RESIDENT_DIALOGUE` | D / TALKING | Speech Focus true; host ducking ownership preserved |
| `BILLBOARD_DIALOGUE` | D / TALKING | same Speech Focus owner as Resident |
| `DRIVE_TO_STAY` | G → M | 10 old sources retired after scheduled crossfade |
| `MISSING_FAMILY_FALLBACK` | retain G | no error, no restart, no silence regression |

## Automated counts

- existing G/D adaptive proof regression: **18/18 PASS**;
- runtime registry/ownership/resolver invariants: **46/46 PASS**;
- synthetic context/event fixtures: **8/8 PASS**;
- real browser audio files: **44/44 decoded** (40 stems + 4 masters);
- per-family stem alignment: **4/4 PASS**;
- forced real-master fallback: **4/4 PASS**;
- browser warnings/errors: **0**;
- `git diff --check`: PASS.

## Runtime ownership invariants

- injected AudioContext only;
- module-created AudioContexts: zero;
- no DOM/window/document in runtime/resolver;
- no WB2 import;
- no Audio Site UI dependency;
- no World runtime write;
- D Speech Focus complements, never replaces, host TTS ducking;
- G/D identities, stems and prior verified status remain unchanged.

## Classification boundary

This evidence supports `RUNTIME_VERIFIED` for C/M/N/O. It does not support or claim `HUMAN_ACCEPTED`, Site publication, World integration, merge or Live promotion.

## One next action

Persist the final Return/changelog and leave the only next gate at the exact Claude Coworker Return.
