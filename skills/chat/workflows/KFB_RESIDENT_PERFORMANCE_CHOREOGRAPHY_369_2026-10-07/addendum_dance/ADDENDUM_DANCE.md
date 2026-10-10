# #369 Addendum 6 · Dance engine: beat-synced choreographies and disco modes, first pass

- **Status:** FIRST PASS, made while Georg was away (2026-10-08). Waiting for his review.
- **Writes:** additive to branch `blender/resident-performance-choreography-2026-10-07`.
- **Boundaries:**
  - no merge;
  - no raw FBX;
  - no textures;
  - `.blend` stays in Dropbox;
  - the music is the CC0 Birthday Radio set already in the repo, not copied again.

## Idea

The dances largely existed as 26 Motion Library clips. What was missing was dancing together and dancing to the music. This pass adds that as an engine, built the same way as the talk engine:

| Part | File | What it does |
|---|---|---|
| Pool | `data/dance_pool.json` | Every dance clip is measured. |
| Beat grid | `data/dance_music_beats.json` | The music is beat-tracked. |
| Engine | `kfb_dance_gen.py`, pure Python | Places 4-beat clip windows on the music beats. |
| Realizer | `kfb369_dance.py` | Plays the result in Blender. |

## Pool (`kfb369_dance_pool.py`)

- **Clips:** 19 dance clips on both rigs, from Motion Library v6, prepared (wrist fix, Idle_A alignment). Locking, step hip-hop and Thriller play in place: the travel trend is removed and the bounce kept.
- **Tempo:** from the hips bounce. The autocorrelation of the detrended hips height gives a period, folded into 70–140 BPM. The local minima of the bounce give the step frames.
- **Windows:** 4-beat windows that start on a measured step. Energy = mean hand speed per height. Intensity 1–3 = energy tertiles.
- **Result:** 82 windows from 17 clips. Uprock and maraschino step are too short for a 4-beat window.
- **Style tags (by hand):** hiphop, house, latin, jazz, retro, novelty, breaking.

## Music (`data/dance_music_beats.json`)

The Birthday Radio tracks were beat-tracked with librosa 1.0.0 `beat_track`, plus RMS per beat:

| Track | BPM | Beats | Notes |
|---|---|---|---|
| drum-n-bass | 172 | 68 | the dancers step on every second beat (half time, 86) |
| reggae | 92 | 34 | |
| jazz-trio | 89 | 32 | |
| 8-bit | 99 | 19 | |

## Engine (`kfb_dance_gen.py`)

- **Unit:** a 4-beat block. Each block is filled with one window, time-scaled so its steps land on the music beats. The strip scale is the music block length divided by the window length; windows outside 0.65–1.55 are skipped, and scales near 1 are preferred.
- **Energy:** the music's energy per block sets the target intensity.
- **Modes:**

  | Mode | What happens |
  |---|---|
  | `freestyle` | every resident picks its own windows (style preference, no repeats, mirrored at random) |
  | `unison` | one shared sequence, everybody in step (line dance) |
  | `canon` | the shared sequence, each dancer one beat later, left → right (a wave through the line) |
  | `battle` | two soloists alternate 8-beat solos with high-intensity windows; the off-soloist nods along; the crowd grooves lightly and cheers or claps at the end of each solo |

- **Show:** a list of sections (mode + blocks), for example unison → canon → unison → freestyle.

**Disco floor:** 7 × 5 clay tiles light up on every beat in a running checker (each tile lights on its own beat of four). The colours are a proposal: `#ef5a22`, `#f2b632`, `#2bb3a8`, `#7a5cd6`.

## Videos (with sound)

| File | Music | Length | Content |
|---|---|---|---|
| `DANCE_A_disco_freestyle.mp4` | drum-n-bass, half time 86 | 24.2 s | 5 residents freestyle, 15 different clips |
| `DANCE_B_line_unison_canon.mp4` | reggae 92 | 22.6 s | line dance: unison → canon wave → unison → freestyle |
| `DANCE_C_dance_off.mp4` | jazz-trio 89 | 20.5 s | Farmer vs Orc, the crowd of 3 cheers or claps |

The overlay shows the section mode and a 4-dot beat counter. The video is delayed one frame so the keyed beats meet the audio.

**Sync measured** in the dance-off: the median distance between a resident's measured bounce low point and the nearest music beat is 2–4 frames (0.08–0.17 s) at a beat of 15.7 frames. The mean bias is +0.2 to +1.4 frames.

## Open

| ID | Item |
|---|---|
| DN1 | Sync is close but not tight: 2–4 frames median. A per-window phase fit (shift the strip by the window's measured bounce phase) would tighten it. |
| DN2 | Happy Birthday is in 3/4 in most versions. The 4-beat blocks ignore the bar, so phrases do not start on bar 1. A downbeat tracker would fix it. |
| DN3 | The disco floor, its colours and the tile size are Georg's look call. |
| DN4 | Uprock and maraschino step are not in the pool (shorter than 4 beats). Breakdance is missing as a style. |
| DN5 | Crowd reactions in the dance-off are generic (clap / cheer / nod). They could come from the talk engine's listener signals (stance, engagement). |
| DN6 | Line formation: the Orc in the middle covers his neighbours. A height-sorted line would help. |

## Files

**Scripts:**

- `scripts/kfb369_dance_clips.py`
- `scripts/kfb369_dance_pool.py`
- `scripts/kfb_dance_gen.py`
- `scripts/kfb369_dance.py`
- `scripts/dance_overlay.py`

**Data:**

- `data/dance_pool.json`
- `data/dance_music_beats.json`
- `data/dance_runs/*.json`

**Previews:** `previews/DANCE_*.mp4`.

**Blend copy (Dropbox):** `blend/KFB369_dance_01.blend`.
