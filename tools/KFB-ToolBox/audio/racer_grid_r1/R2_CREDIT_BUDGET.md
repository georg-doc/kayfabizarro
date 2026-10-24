# R2 · ElevenLabs credit budget · V-378

**Planning only · Not purchased · 0 API calls.** Credits currently shown in Georg's 2026-10-17 screenshot: **90,000**; not queried live via API.

Pricing assumption (vendor docs 2026-10-17): `duration_seconds × 40 credits × independently requested variants` for fixed-duration Sound Effects. Endpoint `POST /v1/sound-generation`, `eleven_text_to_sound_v2`, `loop` supported, duration 0.5–30 s, `prompt_influence` 0…1. Check account's actual billing before running; the public pricing page also displays a nominal 200 credits per generation for default/automatic mode, which is **not** the correct basis for these explicitly timed calls.

Vendor: https://elevenlabs.io/docs/overview/capabilities/sound-effects and https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert

## Exact fixed-duration breakdown

| Role | Seconds each | Variants | Credits | Gate |
|---|---:|---:|---:|---|
| M04 · Steady high RPM | 8 | 2 | 640 | FOLLOW-UP ONLY |
| M05 · Steady coast/overrun | 8 | 2 | 640 | FOLLOW-UP ONLY |
| H04 · Hyperspeed sustain | 8 | 2 | 640 | PILOT AFTER DONOR REJECTION |
| T04 · Drift onset | 1.5 | 2 | 120 | PILOT AFTER DONOR REJECTION |
| T08 · Sustained drift | 8 | 2 | 640 | FOLLOW-UP ONLY |
| D03 · Clay fracture / crumbs | 2.5 | 2 | 200 | PILOT AFTER DONOR REJECTION |
| D08 · Fluff harvest / spheres | 2.5 | 2 | 200 | PILOT AFTER DONOR REJECTION |
| **Four-slot pilot** | **14.5 total per variant** | **8 MP3** | **1,160** | cap first tranche |
| **All seven gaps** | **38.5 total per variant** | **14 MP3** | **3,080** | if every donor fails |

Optional *separate* derivative tasks, each requiring one post-audition purpose and a second authorization:
- Warp entry transient 2s × 2 × 40 = **160** credits
- Warp exit transient 2s × 2 × 40 = **160**
- New cartoon motor identity 10s × 2 × 40 = **800**, **only** if Georg's V8 donor is inappropriate
- New warm antigrav identity 8s × 2 × 40 = **640**, only if Kenney/S050C donors fail

Conditional full upper-planning envelope = 3,080 + 1,760 = **4,840 credits**, 5.38% of 90,000; **not a spend approval**. Distinguish this small deduplicated R2 from the older unexecuted R1 48-file plan (~11,000 credits at its fixed durations). Unused funds remain for later real-sound QA and other KFB needs.

## Cost protection
1. Review source-isolated donors and use FREE REUSE wherever credible.
2. Authorize at most the four-slot pilot, max **1,160 planned credits**, with a separate overhead cap if the live tariff differs.
3. Check each paid response, manifest the real `character-cost`/billing headers and SHA, do not blindly retry ambiguous POSTs.
4. Confirm candidates pass duration, stable pitch, seam, band-limited level and A/B with AUDIO-CAL-01, then authorize next subset or stop.
5. Preserve `media/3D_Assets/Audio/KFB Racer/grid_r1/SOURCE.json` (R1 historical prompts) but **do not run the old 48-file batch** by default.
