# Test Report · Card Performance 48 / LLM-Free Bridges / TTS Audition R0.1
Date: 2026-10-12 · Scope: one bounded ChatterBox/Voice **authoring + local TTS technical** sidecar. No browser/Site delivery/true KFB mix.

## Verified GitHub source and new files
- Source: `media/kfb/Wrinkle_Rumble_-_ADD_web_ID.pdf.json` @ blob `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c`, original 48 Cards.
- Spoken content: `KFB_WRINKLE_RUMBLE_48_CARD_PERFORMANCE_STAY_FLUFFY_R0_1_2026-10-12.txt` @ blob `a9e6631267dac39bd04012f6402497db591c6d06` (4,266 codepoints, original card order, 48 one-card beats, proposed intro and mandatory final line).
- Bridge sidecar: `data/KFB_CARD_PERFORMANCE_BRIDGES_R0_1_2026-10-12.json` @ blob `3bed0198690d5411de04bc834144d9036206a9e6`.
- Research/next gate: `KFB_CARD_PERFORMANCE_TTS_BED_BRIDGES_SPEAKERS_CORNER_R0_1_2026-10-12.md` @ blob `ff522d7b048d28a9bc39e6c315ffb4e3c820280a`.
- All three files actually retrieved on named branch. Raw source title, power and lore semantics inspected for three Card bridge samples; remaining 45 are exact-title/ordered candidate text checks, **not proof that every compressed POWER/LORE clause is exact**.

## Real checks
**Source + contract readback: 14/14 PASS** in GitHub tool JS:
1. 48 performance card rows; 2. same 48 original Card titles in order; 3. <5,000 codepoints; 4. exact proposed intro present; 5. final spoken phrase exactly Stay Fluffy!; 6. no multiple original titles per card line; 7. pinned source blob; 8. sidecar first three card source IDs/titles; 9. all three POWER cues found verbatim in respective original POWER fields; 10. all three LORE cues found verbatim in original LORE; 11. exactly two sequential editorial bridge edges; 12. no duplicate semantic/audio runtime; 13. no false Site A/B completion claim; 14. positive creative feedback not mislabeled as Site test.

**Local audio tool checks: 14/14 PASS**:
- `espeak 1.48.15` + installed FFmpeg/FFprobe produced **3 real mono MP3 files**: entire 48-card adapted source speech `en+m3 -s190 -p42` = **229.77 seconds**, **3,217,232 bytes** SHA256 `6085a95e630a3a978ff8d6cdf200064cc889e29f74ca785cf344ec571ff7bc7f`; 6.09s `en+m7 -s175 -p34` SHA256 `65bb47f7f41849803da43070033a8e49a0385b0a738f34d5b3f2d4e673eda370`; 5.75s `en+f3 -s183 -p50` SHA256 `21a0c57a656909910b5288fc2c2de85aca8e3367abb24842d7ba25eff3251763`.
- All 3 duration probes matched 3 recorded durations, all 3 file SHA256 hashes matched receipts, package 5 files, ZIP CRC passes; local TTS speech text uses proposed intro and ends with Stay Fluffy!; avoids Suno stage tags in literal spoken text; source has three anchor title checks.
- The exact eSpeak speech source is a 4,243-character local text adapting the Suno 48-card source's opening and final line; the GitHub file is the durable 4,266-char Suno-format counterpart. The MP3 package/text/receipt are conversation downloads **only**; GitHub contains verified provenance and how to reproduce, not binary MP3 data.

## Actual negative / not run
- 0 native browser-system voice renders on Georg's actual platform in this chat.
- 0 real KFB D conversation bed mixes; source bed bytes could not be retrieved here.
- 0 original Suno vocal/instrumental stem ingestions; original Suno audio not uploaded.
- 0 Georg listening decisions on these three eSpeak MP3s (known SFX/dry audio limitations).
- 0 timed visual card crops / true word alignment; 0 in-world ChatterBox/Resident Player; 0 new GPT Site publication or URL verification.
- No Piper/Kokoro/Resemble Chatterbox-TTS installed or benchmarked in this slice.
- Source category `EDITORIAL_CANDIDATE`, no broad 48-card authoring PASS or full semantic bridge generator PASS.

## A/B acceptance gate — one single consumer
`VOICE_ACTING_EXISTING_SITE_SAME_TEXT_D_BED_A_B_AUDITION_R1`: in **existing KFB Audio Voice Acting Site** play same source through actual browser TTS, choose 2+ distinct available English voices, compare dry and existing D bed ducked, record truthful timing, word/caption support, full 48 Card sequence and exact final Stay Fluffy. Judge intelligibility/personality against Georg's Suno take; record small audible proof / human KEEP/TUNE/CUT; only then update the existing Site if authorized.

World R4 remains stopped. No Cloudflare, Stage, Live, merge or router/Hub change.
