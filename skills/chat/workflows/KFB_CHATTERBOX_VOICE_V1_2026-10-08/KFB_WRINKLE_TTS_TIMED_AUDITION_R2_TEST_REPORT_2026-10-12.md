# Wrinkle Rumble 48 · Offline Three-Voice Timed Audition R2 · TEST REPORT
Date: 2026-10-12
Owner: KFB ChatterBox Voice layer, Draft PR #379.
Receiver: existing KFB Audio Voice Acting Site / Audio PR #365. **No separate TTS/audio production owner.**

## Source and actual audition
Pinned original script: `KFB_WRINKLE_RUMBLE_48_CARD_PERFORMANCE_STAY_FLUFFY_R0_1_2026-10-12.txt`, Git blob `a9e6631267dac39bd04012f6402497db591c6d06`; locally reconstructed exact UTF-8 file (4,266 characters) had matching Git blob SHA1. Original deck `media/kfb/Wrinkle_Rumble_-_ADD_web_ID.pdf.json` @ `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c`, 48 Cards.
Exactly 50 spoken items in each generated take: introduction (Welcome, dear Fluffheads), cards 1..48 in original order and one final "Stay Fluffy!". Same *spoken text* and exact Card order in all three takes.

Local tools: **eSpeak 1.48.15**, FFmpeg, FFprobe, Python/scipy/wavfile; synthesize each item as dry mono 22,050 Hz WAV, record precise frame/sample offsets, then concatenate with 180 ms between card items, 350 ms after intro/outro and 500 ms after cards 8, 20 and 32, convert to MP3 mono at 44,100 Hz/112 kbit. The cue intervals use the actual uncompressed waveform timebase of each generated take, with start+end rounded to whole milliseconds. This is audio segmentation measurement **not** browser `SpeechSynthesis` events and **not** word-level ASR alignment.

| Dry-only voice audition ID | eSpeak settings | FFprobe MP3 duration | MP3 bytes | SHA256 |
|---|---|---:|---:|---|
| `dry_storyteller_m3` | `en+m3 -s190 -p42` | 239.0727 s | 3,347,426 | `ca509de1f5e52e86be8088f96ee152cee902f6d5e734f433bb109af744ddc34c` |
| `dark_orc_m7` | `en+m7 -s183 -p33` | 252.6041 s | 3,536,866 | `24592c0eba572ac610e501e6a09c396e908a6b308e931fb344f424580f550043` |
| `higher_storyteller_f3` | `en+f3 -s193 -p48` | 238.0278 s | 3,332,797 | `72f256140ff547caed8dd2cfa9a4a57ae1348ec5c9bf769bf9e8738367a6eb00` |

Audition delivery ZIP **in source conversation only**, **NOT GitHub or Site**, name `KFB_Wrinkle_48_Card_TTS_Cue_Audition_R2.zip`, 9,121,644 bytes. It contains 16 actual files: three MP3 files, three SRTs, three Card-cue CSVs, three Card-cue JSONs, MANIFEST, README, exact spoken text, and exact source with Suno tags. ZIP CRC check passed. Original copyright/source metadata remains in GitHub Card source; MP3 and JSON cue IDs cite the exact source.

**Durable cue evidence** in GitHub:
`data/KFB_WRINKLE_48_TTS_TIMED_CUE_AUDITION_R2_2026-10-12.json`, 3 voice profiles with **50 measured start/end pairs per profile** (milliseconds). Index 0=intro, 1..48=Card IDs, index 49=outro. No copied or inferred Suno timestamps.
Example dry storyteller: intro 0.000..5.374 s; Card 1 5.724..9.775; Card 2 9.955..15.630; Card 3 15.810..20.815; Card 48 232.760..237.578; final "Stay Fluffy!" 237.758..238.686. File duration 239.073 s.

## Actually executed checks and results
- Local rendered package checks **22/22 PASS** (number of voices, 3 real MP3s, 48 Card units each, 50 audio cues each, exactly same original lines, 3 SRTs, all runs under 300 seconds, cue endpoints less than audio durations, exact Git source hash, no invented D-bed, monotone cue intervals, original Card ID mapping, correct Card titles and speech text for each of 3 profiles). Zip `testzip()` = NONE (CRC PASS). 
- Additional compact GitHub cue sidecar precommit **11/11 checks PASS** for three valid sequences and source identity. New file written and read back at exact branch head.
- Local original audio not available from Suno; original KFB D conversation bed binary not accessible to this executor. **NO REAL MUSIC BED A/B** in this test. No one can infer that all three voices sound natural from technical checks.
- 0 actual Site/browser TTS audition, 0 Site version/deployment revision or public URL verification, 0 word-level real ASR aligner use, 0 speaker bubble/card crop render, 0 voice human approval, 0 merge or Live. The existing Site URL was not accessible by web inspection in this chat; do not call it live-verified. Keep World R4 STOP / NO MVP.

## Concrete receiving-Site A/B procedure
Reuse **existing KFB Audio Voice Acting** tab: choose/ingest matching rendered dry MP3 (no second runtime), audition dry; enable its existing D conversation bed with original mixer-owned speech ducking, listen again. A/B exact same recorded vocal while holding bed variables fixed; repeat with second timbre if useful. Do NOT recreate the bed with an invented synth, and do NOT mix an unverified or mislabeled Suno instrumental stem. The renderer may also select browser system voices instead of imported clips, but browser timing requires actual new measurement (R2 offline cues **must not** be reused for browser/Suno samples). Identify songbed asset and permissions, record real loudness/speech intelligibility, source IDs, voice identity, duration, two listens, and Georg KEEP/TUNE/CUT. Card/caption display must consume cue ID `wrinkle_rumble:N` for the exact matching MP3.

## One next gate
`VOICE_ACTING_EXISTING_SITE_SAME_TEXT_D_BED_A_B_AUDITION_R1`: on current **existing Site**, actual listener compare dry voice against D-bed voice and benchmark against previously approved Suno direction; then measure whether faster/high-quality local/browser neural choices improve it. **No new Site or Cloudflare public acceptance route required for this content/fixture milestone.**
