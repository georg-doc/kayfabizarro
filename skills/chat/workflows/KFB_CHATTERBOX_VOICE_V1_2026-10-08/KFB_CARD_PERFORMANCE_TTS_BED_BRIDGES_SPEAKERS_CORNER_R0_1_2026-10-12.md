# KFB Card Performance: Stay Fluffy / LLM-free Bridges / TTS + Music Bed · R0.1
Date: 2026-10-12
Status: **GEORG POSITIVE SUNO LISTENING FEEDBACK; LLM-FREE/AUDIO SITE POC PREPARED; NO IN-WORLD OR SITE ACCEPTANCE**.
Owner/only writer: existing ChatterBox content + Voice output sidecar, georg-doc/kayfabizarro PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Receiving owner: **KFB Audio PR #365 and existing KFB Audio -> Voice Acting Site**, NOT a second player/mixer.
Source deck: `media/kfb/Wrinkle_Rumble_-_ADD_web_ID.pdf.json` blob `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c`, 48/48 cards.
Current source-backed text: `KFB_WRINKLE_RUMBLE_48_CARD_PERFORMANCE_STAY_FLUFFY_R0_1_2026-10-12.txt`, 48 titles in original sequence, 4,266 characters incl. Suno tags (static check), one proposed intro and final literal "Stay Fluffy!".
Configuration sidecar: `data/KFB_CARD_PERFORMANCE_BRIDGES_R0_1_2026-10-12.json`. Neither is automatic Card/Lore/Voice canon.

## Georg's actual artistic decision, preserve without overclaim
- The linked 48-card song **works musically and narratively** according to Georg's listening feedback. This is a substantive positive creative direction and reason to audition a matched TTS+bed rendition, **not** proof of the exact sound file, timing, lyrics or all individual vocal performances, which were not uploaded here.
- End any **card-based performance** with spoken **"Stay Fluffy!"**. It is one recurring signature outro irrespective of actor: Clown, Orc Band, King Kayfabian, Tavern Party or Speakers' Corner Resident. Avoid forcibly appending to ordinary gameplay, emergency notifications, functional TTS, or user spoken commands.
- **"Welcome, dear Fluffheads!"** is Georg's proposed common family intro, character-variant editorial option. The shared address "Fluffheads" references big-headed clay figures / Fluff and does not require stock AI banter. Actor variation must still be source- and personality-faithful, not uniformly generated.
- Keep one source-bound Card Triplet = **one spoken sentence/utterance** assembled from card title + condensed POWER and LORE, artworkPrompt for nonspoken visual meaning; optional silence. Multiple Cards form the higher-scale story; SHOW IT/SPIN IT/SELL IT and King Kayfabian's Quest are **higher-scale performance roles**, not three independent lines per Card.
- Use the six existing Story Mode tonal colors (tragic/comic/absurd/heroic/mystical/forbidden), with real narrative cost, progression and callbacks; emotion affects delivery, not fabricated mechanics. RULE1: no generic AI quips, faux-dramatic moral, or filler.

## LLM-free authoring architecture: selective and intentionally limited
1. Read **the original Card JSON by stable deck/card IDs and source revision**. Reuse manually composed/provenance-tagged one-card sentence candidates; missing POWER/LORE requires editorial repair, not auto-fiction.
2. For a proposed sequence, derive a tiny semantic state for each card: actor, concrete action, effect/cost, target, change in possession/status, unresolved tension and callback.
3. Read a **curated/typed compatible edge table**, not a random dictionary of words ("and then"/"but"/"therefore"). Every selectable bridge specifies `fromCardId`, `toCardId`, prior action/effect, next implication, relation kind, original source references and explicit authored audible bridge text. A deliberately absurd bridge remains **specifically caused** and its status is EDITORIAL, not original Card power.
4. Stable seeded randomization may choose among already validated edges, reordering *only when proven compatible*. Keep episode seed, narrator/cast bias, card IDs, exact text revision, semantic mode, and history. Never attribute such prose to verbatim source.
5. **If there is no compatible edge:** scene cut/silence/explicitly curated reset, pick a different Card, or request editorial review. A naive bridge pool will not generate convincing new stories by itself; non-LLM quality depends on coverage of accepted edges and the source material.
6. Compile a `PerformanceCue` for each Card/bridge with sourceId, full visible text, narrator, voice recipe, music bed intent, segment/part boundary and optional accurate audio word-time/clip-time stamps. Use existing ChatterBox as semantic owner, existing KFB Audio as transport/mixer, existing bubble/billboard as presentation. NO second kernel, audio context, state machine or presentation chrome.
7. Fractal consumers: 1 card one-liner; 3-card performance; 4-card comic page; curated/full deck (Wrinkle Rumble 48); Speakers' Corner solo; Tavern/roleplay-island ensemble; King Kayfabian Quest later when separately accepted. Ensemble may assign consecutive Cards to different speakers, but retain one single authoritative timeline, source lineage and common outro.

## Exact existing donor inventory, no claimed new implementation
- Existing voice/cast direction: `MVP_HEURISTIC_CASTING_VOICE_DIALOGUE_PERFORMANCE_DIRECTION_2026-10-10.md` + Voice Casting Bench R2, browser voice enumeration/rate/pitch, imported clips, existing D conversation bed and true mixer ducking, beat/focus/talk events.
- Existing **Travel** `travel/travel-v16/terrain-v16/frizzlebob-voice.js` @ blob `6fc7d640313a20aee9e468c31cb8434bebfa7092`: real browser `SpeechSynthesis` voice ranking, English voice detection with onvoiceschanged, voiceURI override, rate/pitch, activity callback; historical voice list from Georg's machine is **not** portable to another browser.
- Existing **Audio baseline** `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md`: Travel audio has one context, Jukebox and voice activity duck; recorded donor duckAmount 0.62 (music gain 0.38) not universal fixed artistic setting.
- Existing **KFB Audio Voice Acting Site** `https://kfb-audio.frizzlebob.chatgpt.site`, source receipt `data/VOICE_CASTING_BENCH_R2_CONTRACT.json`: voice selector, speech and D bed duck, optional word-boundary events, local clip ingestion and export. **This workflow did not run/publish/open the Site and makes no Site revision claim.**
- Existing `media/3D_Assets/Sounds/jukebox.json` original catalog provides *Van Metronome (Instrumental)*, `KFB Metronome v3 (Instrumental)`, others, but neither this run nor a user-supplied Suno instrumental stem was actually retrieved as bytes. Do not substitute a fabricated instrumental and label it source-faithful.
- The Studio `prepareResidentTurn` ChatterBox donor is not automatically a promoted live kernel; use its accepted semantic lane if/when integrating. Existing World R4 remains STOPPED/NO MVP; no World integration from this audio slice.

## Audition ladder — prioritize voice intelligibility over maximal distinctiveness
**Level A — now, zero extra online inference:** test the **same full 48-card text** in the existing Voice Acting browser TTS across three distinct available English voices and user-editable speed/pitch; A/B dry versus existing D-bed duck. Modern system voices may sound considerably less robotic than offline eSpeak variants, but exact voices depend on installed browser/OS. Browser `boundary` word events are not universal; fall back to sentence onset/duration until measured. Use full original visible text even if muted.
**Level B — local, pre-generated:** eSpeak is cheap and variant-rich, but accent/filter changes often sound synthetic. Suitable deliberate Robot/Orc/surreal identity, **not** a guaranteed natural voice for every NPC. An actual local private eSpeak technical proxy rendered the full 48-card text, with intro/outro replaced, `en+m3, -s190, -p42` (229.77 s), plus 2 brief variants (`en+m7` and `en+f3`). Archive exists only as a conversation attachment, not uploaded into GitHub; verified with ffprobe and SHA256 in local receipt. NO actual listener QA on those samples.
**Level C — optional offline neural quality comparison:** Piper (`OHF-Voice/piper1-gpl`, GPLv3 code, voice model cards individually checked); Kokoro-82M voice variants (inspect each actual model/weights/license); Resemble **Chatterbox-TTS** (separate provider from **KFB ChatterBox** storytelling engine, with English expressive / Multilingual V3 or Turbo; provider/voice rights and real host costs checked before use). Cloud neural providers only via authorized server side bridge, never exposed browser API keys. No model installation or GPU benchmark done here.
**Character voice profile:** identity in casting data -> approved or provisional voice ID -> tempo, pitch, coloration/whisper/slur/drowsiness effect, pauses, affect/story mode, render/cache version and fallback. A performance mannerism may be expressive without distorting all phonemes; record KEEP/TUNE/CUT at artist ear-test, do not infer quality from a checkbox or pure pitch shift.
**Caching:** stable Card sourceId + composed text revision + voiceId/model/version/settings + rights. Whole-deck pre-render when sequence fixed, three-card stitches/chunks when variable. KFB Audio alone owns playback clock/mix/ducking; do not launch overlapping browser speech sessions.

## The single real next Gate: existing Voice Acting Site A/B
1. Use pinned `KFB_WRINKLE_RUMBLE_48_CARD_PERFORMANCE_STAY_FLUFFY_R0_1_2026-10-12.txt` exact spoken text, no implicit Suno lyric improvisation; last audible line "Stay Fluffy!".
2. On the **existing** KFB Audio Voice Acting tab choose two or three available English voices, render/play first three Card beats and (if stable) the full 48. Check distinctiveness/intelligibility first without music.
3. Layer existing **D conversation bed** with music ducking and compare A (dry) / B (bed, speech duck) against Georg's original Suno take. Preserve one AudioContext and normal music clock.
4. If words/beat timestamps exist, align 48 cards by original Card IDs and proper spoken titles; otherwise sample true onsets/captions (no invented timestamps); show each actual card crop/source page and speaker bubble on existing presentation owner, no new interface.
5. Capture output source, browser/OS voice identifiers, original versus TTS audio duration, both A/B audio files or browser proof, measured loudness/duck settings and human KEEP/TUNE/CUT. Audio model or user-originated stems require provenance/rights check.
6. Only after A/B exists may the receiving Audio Site be updated/published and browser revision checked. Do not create new Stage, no Cloudflare, no PR merge or Live.

## Public technical sources checked (research; NOT KFB donor adoption)
- Browser voice enumeration: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
- Limited `boundary` support: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event
- Piper official: https://github.com/OHF-Voice/piper1-gpl
- Resemble Chatterbox TTS models: https://github.com/resemble-ai/chatterbox
- Kokoro family requires version/voice license audit before any install.

## Boundary
This is additive creative/product preparation and one local CLI AUDIO-TECH fixture. The audible **Suno PASS direction is Georg's feedback**, not a separate Suno source upload. **Site A/B: NOT TESTED**, actual KFB bed mixture: **NOT TESTED**, multi-voice actor qualities: **PENDING**; public deployment: **NONE**. No second runtime, replacement branding, world geometry, or new acceptance URL.
