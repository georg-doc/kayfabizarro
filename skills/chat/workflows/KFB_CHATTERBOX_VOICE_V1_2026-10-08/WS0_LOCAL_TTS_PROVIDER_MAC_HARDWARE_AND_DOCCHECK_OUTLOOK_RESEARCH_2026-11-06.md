# WS0 / KFB ChatterBox Voice · Local TTS provider, Apple Silicon, costs, real-time and DocCheck outlook

Date: 2026-11-06 · Status: **RESEARCH / SOURCE-CHECKED PROPOSAL · NO MODEL RENDER / NO RUNTIME CHANGE**  
Existing owner: KFB ChatterBox / Resident Voice output · Draft PR #379 · `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`  
Receiving audio owner: KFB Audio / PR #365 family (one AudioContext / playback / ducking / D-bed)  
Cross-product future consumer: **DocCheck** (Audio Tutor, Micro-Learnings, narrated Flexikon / other approved educational content) · **OUTLOOK ONLY**  
Scope: WS0 research/production preparation, not a WS1/World integration. The user said 'VS0'; KFB canonical label is **WS0**. No V-number, new runtime owner, product decision, Site or Stage route created.

## 0. Actual decision: what is being preserved

Compare existing provider candidates for characterful KFB NPC/ChatterBox speech and dry KFB Radio recordings, conditioned on real locally available hardware:
- **Mac mini M4 / 16 GB unified RAM**: first local low-latency evaluation machine.
- **MacBook Pro M1 Max / 32 GB**: preferred more-memory experiment/casting and offline batch generation; internal disk constrained, so use a verified external model cache/SSD if required.
- **MacBook Air M4 / 24 GB**: temporarily available independent CPU/performance reference, *not* a permanent infrastructure dependency.

**Decision boundary:** a promising model is not an integrated provider; model download and producer-written benchmarks are not Mac-host/Game acceptance. Keep current authoritative text, source IDs, ChatterBox semantic rules, bubble, valid silence, Resident Affect and KFB Audio playing/mixing unchanged.

## 1. Current technical donor matrix (source-verified, NOT runtime-proven)

| Candidate | Source / mechanism | WS0→KFB role | Constraints / rights |
| --- | --- | --- | --- |
| **Voicebox (jamiepine)** | Open-source Tauri local speech studio with macOS MLX, multitrack stories, WAV export, REST and MCP; engine roster includes Qwen3 Base/CustomVoice/VoiceDesign, LuxTTS, archived Chatterbox, TADA, Kokoro | **High**: *offline production workbench/donor only* for casting, script batches and original radio voiceover; export artifacts into existing KFB voice-asset manifest. Do not enable its personality-LLM text rewrite on KFB canonical Card/Triplet source | Application is MIT; engine/weights/voice samples have **separate licenses**. Voicebox's HTTP server is not KFB's mixer/runtime. Verify exact model/engine support per installed version |
| **Qwen3-TTS 0.6B Base/CustomVoice** | Official Apache-2.0 open models, English & German among 10 languages; MLX-optimized path via Voicebox for supported variants | **High**: Mac mini first audition; Base for authorized-clone experiment, CustomVoice for fixed voices; 0.6B may be speed/quality trade-off | Model downloads roughly **1.2 GB** and model VRAM estimate **~2 GB** (Voicebox model-management figures, NOT Mac peak app memory). Verify per voice sample, output license and voice identity |
| **Qwen3-TTS 1.7B Base/CustomVoice** | Larger sibling, voice cloning and instructed predefined casting | **High**: M1 Max 32 GB production quality challenger; compare against 0.6B on fixed same text | Download ~**3.5 GB** and cited VRAM ~**6 GB**; framework memory overhead, coexistence and actual M1 Max performance unmeasured |
| **Qwen3 VoiceDesign 1.7B** | Voice from language descriptions, useful for distinct cartoon characters | **Conditional** high-value *offline casting*. Treat as separate model/runner benchmark | Official/Voicebox Mac MLX feature parity **must be checked**; do **not** assume identical optimized support as Base/CustomVoice or guaranteed realtime. 1.7B VoiceDesign distinct from 0.6B Base |
| **Kyutai Pocket TTS** | Lightweight 100M model, CPU streaming, multilingual incl. German; official producer reports **~200 ms first audio chunk** and **~6× realtime on an M4 MacBook Air**, using two CPU cores | **High**: first true local low-latency candidate on M4 mini; M4 Air benchmark cross-check. Also potential fallback on low-spec machines | Benchmark is a *vendor statement* for that test, not KFB latency. Python runtime/deps required. Code MIT; **model weights CC-BY-4.0**, individual stock voices have own rights/license. No official in-browser client guarantee. Built-in input pause control is currently limited |
| **Boson Higgs Audio v3 4B** | Conversational, expressive and streaming; official self-host recommendation SGLang-Omni | **Reference/conditional audition** for multi-actor performance and deliberate acting, preferably external controlled GPU | **Research/non-commercial model license**; hosted/revenue-generating game/DocCheck use needs **separate commercial license**. Repo license is not the weights license. Not a no-cost commercial default. Native Apple Silicon low-latency path unproven |
| **Spokenly** | Local Whisper/Parakeet **speech-to-text**, not a TTS engine | **WS0 authoring input** for dictating text, feedback or pronunciation notes; optional DocCheck preparation, *not* KFB speech-synthesis provider | Offline local tier advertised free; cloud plans/prices differ across pages/billing states. No microphone/STT game implementation implied |
| **Resemble Chatterbox-TTS (unrelated to KFB ChatterBox)** | Legacy expressive TTS source donor | **Archive only** pending source audition | Official repo states **retired research / not maintained since Aug 2026**; do not choose as strategic maintained production dependency |

Source links and verification dates are in §7. No model binary was installed or auditioned in this research slice.

## 2. Time/cost envelope (avoid invented performance or pricing commitments)

- Locally run open-source code/models: generally **no generation API charge**, but workstation, storage, energy, model/voice obligations, setup/review and any commercial licensing remain real costs.
- Voicebox alone is not a paid API; a downloaded runtime is not a guarantee of commercial asset rights.
- Pocket TTS/approved Qwen downloadable models are sensible zero-per-request local candidates. **Review final model and voice license at ingestion**, not just repository license.
- ElevenLabs official API price examples on 2026-11-06: **v3 Conversational $0.05 / 1K text characters**, **v3 $0.10 / 1K**. Example *200-character generated line*: **$0.01–$0.02**. *1,000 uncached such lines*: **$10–$20**, excluding taxes/other plan constraints. A cached accepted static audio file has no repeat generation charge. Source: https://elevenlabs.io/pricing/api .
- GPU rental may reduce elapsed batch time, but hourly/cloud prices move and need actual provider quote at execution; **not included as binding budget**.
- Spokenly shows **free local** mode; some of its current pages list differing monthly/annual promotional Pro prices. Do not freeze a particular plan number.
- Local optional **external SSD**, ideally verified throughput/capacity, can store model caches and WAV archives. Voicebox supports `VOICEBOX_MODELS_DIR` and model directory migration. No new GPU purchase is required *for the first research audition*.
- Typical Qwen downloaded weights according to Voicebox docs: **~1.2 GB for 0.6B**, **~3.5 GB for 1.7B**, before Python, dependencies, cache duplication, output WAVs and other installed models. Keep ~10 GB+ working space if possible and avoid downloading the entire roster.

## 3. Three separate meanings of 'realtime'

1. **Static deterministic KFB Triplet or radio line**: already approved cached WAV/OGG -> immediate playback after asset readiness. No inference in game and no client GPU.
2. **Live TTS of already composed text**: text arrives from authoritative ChatterBox -> optional local/hosted TTS -> audio chunks. Measure *cold-load time*, *warm time-to-first-audio (TTFA)*, *realtime factor*, queue contention, interruptions, audio/bubble synchrony. Pocket CPU vendor benchmark ~200 ms and Qwen vendor-reported minimum ~97 ms are NOT KFB game end-to-end numbers. Mac mini is only a *developer-local* voice server; public browser players cannot automatically access it.
3. **Free NPC conversations**: adds speech recognition and/or LLM output latency, semantic checks and dialogue turn management. Not enabled by this research. A standalone running Voicebox local server is not authorization to bypass the ChatterBox source/content or 1-AudioContext contract.

Order in the existing KFB Voice adapter stays **accepted fragments → accepted whole line → explicitly injected live provider → browser fallback**. Silence stays silence. Accepted text remains verbatim in bubble; pronunciation-normalized speech must keep exact source and revision trace.

## 4. WS0 production prep & audio integration (no second engine)

Keep the existing source-backed adapter and Voice Asset Identity:
`overworld/overworld/chatter-phrases.js` → `runtime/real-pool-adapter.js` → existing `VoiceRequest` → provider/pre-render manifest → existing KFB Audio playback with `onSpeaking`, ducking and D-bed. Do not allow Voicebox `personality:true`, `Compose` or rewriting to alter original Card POWER/LORE or quoted NPC semantics.

**Bounded WS0 A/B candidate** (no actual 18 rendered files yet):
- The **same one original source-pinned English Triplet per Resident**: Demon Lord / Robot One / Farmer A.
- **Three audio generation routes**, to choose after environmental preflight: Pocket TTS 100M CPU, Qwen3-TTS 0.6B CustomVoice/Base appropriate to casting, Qwen3-TTS 1.7B CustomVoice/Base (VoiceDesign can be *separate* preproduction casting, not silently substituted).
- **Whole Line vs. source-/connector-/reframe-positioned 3 fragments**; total **3 Residents × 3 engines × 2 structures = 18 candidate exports**. Neutralize text, loudness and D-bed; record the same exact source IDs/voices per comparison where provider supports casting.
- Record *model ID/hash/commit*, model license and chosen voice sample rights, local machine/OS/Metal/MLX/Python revisions, one repeatable text, speaker, Resident Affect→provider direction mapping, output duration and SHA256.
- Tests: actual audio decode/play, TTFA cold/warm p50/p95 (>=10 runs for timings), realtime factor, long-tail audio truncation, English/German pronunciation, bubble unchanged, mute/valid silence, interrupts/resume, voice over D-bed duck/no-duck, memory peak, peak disk/cache footprint, no secondary AudioContext.
- Human gate remains **Georg KEEP/TUNE/CUT listening** on real accepted actor source. No new public Site, no Cloudflare Stage, no World/R5, no new Resident/semantic authority.

**KFB Radio derivative:** once a cast voice passes, produce **dry voice-only** files with sentence/pause boundaries and edit cue manifest; KFB Jukebox/Audio overlays its own bed at playback. A TTS tool's text/SSML tags are instructions, not a verified precise pause; actual cut times are measured only on audio after rendering. Do not auto-generate full unreviewed scripts.

## 5. Mac-specific plan (recommendations, not performance claims)

| Hardware | First purpose | Avoid |
| --- | --- | --- |
| **Mac mini M4 16 GB** | Pocket CPU latency reference, Qwen 0.6B warm single-model evaluation; optionally short-lived loopback local TTS service for the private development bench | Loading multiple TTS+LLM models concurrently; promising public player access to a local 127.0.0.1 server |
| **MacBook Pro M1 Max 32 GB** | Voicebox Qwen 1.7B casting and batch exports; larger RAM headroom, external SSD for model cache | Treating 32 GB as GPU VRAM equivalence or filling nearly-full internal SSD |
| **MacBook Air M4 24 GB** | Independent comparative CPU TTFA/RTF and 0.6B smoke test while temporarily available | Make ongoing production or deployment depend on temporary access |

Acceptance gate is a **measured** waveform and app runtime on the exact target Mac; no guarantee of sub-200ms end-to-end response or of parity among model variants.

## 6. DocCheck cross-product outlook · STRICTLY FORWARD-LOOKING

**No DocCheck implementation or authorization in this slice.** KFB and DocCheck may reuse the *provider contract and recorded evaluation recipe*, not share a runtime owner. Existing DocCheck VoiceIO retains **microphone, half-duplex, watchdog and playback**; existing KFB Audio remains separate. Prior donor: `tools/KFB-ToolBox/_inbox/HANDOVER_Voice-Layer_KFB_AudioTutor_2026-10-08.md` (Rev3, draft); source noted there `wissensgalaxie-session-2026-10-06/docs/RETURN_VOICEIO_REPAIR_2026-10-06.md`. The DocCheck repository `georg-doc/doccheck` is a separate product owner; not written by this KFB research.

**Possible later DocCheck consumers:** short medically reviewed Micro-Learning explainers, narrated Flexikon entries/illustrations, quiz rationales, approved audio tutoring, fact-checked educational podcasts, pronunciation-aligned captions, multilingual variants of the **same approved source/version**, and accessibility audio. Do not imply their existence as implemented features.

Reuse a per-product pipeline: **approved item/article text → medical editorial/fact and citation approval → lexicon normalization/IPA (e.g., pCO2, HCO3, ACE, eGFR, mmHg) → DocCheck-only casting → provider → content-addressed voice cache (item/version/language/voice/provider/lexicon revision) → DocCheck VoiceIO**. A changed source invalidates its audio; a TTS speaker cannot invent teaching content or correct medical facts without editorial approval. Version-linked audio/captions are mandatory; pre-record approved static micro-lessons first. Synthesis of free-form learner replies is a separately authorized future flow.

**Recommended trial:** one reviewed 60–90-second German Micro-Learning script, 10 terminology/prosody challenge phrases and one optional English rendering; compare Pocket German voice and Qwen 0.6B/1.7B against currently preferred Edge/Azure route, checking factual wording, number/unit reading, abbreviations, pronunciations, pause/chunk continuity, captions and screen-reader independence. Explicitly separate source medical review from voice QA. No generated patient-specific narration without an approved data-protection contract.

**DocCheck-specific gates:** IT-approved hosting (historical DocCheck handover explicitly rejects Cloudflare for its beta); no sending patient/learner transcripts to external providers; no keys client-side; provider/region/license/privacy approvals; instructor editorial sign-off; existing VoiceIO lifecycle tests. No borrowed KFB cartoon voice, humor, Resident Affect or game-level hosting decisions should silently become DocCheck defaults.

## 7. Primary sources consulted · 2026-11-06

1. Qwen official models/features/license (Apache 2.0, language/models/streaming): https://github.com/QwenLM/Qwen3-TTS ; blog offered by Georg: https://qwen.ai/blog?id=qwen3tts-0115 (page did not expose readable text in research; GitHub source used).
2. Voicebox official studio/REST/MCP/Apple MLX/model cache: https://github.com/jamiepine/voicebox ; model size/VRAM: https://github.com/jamiepine/voicebox/blob/main/docs/content/docs/developer/model-management.mdx .
3. Pocket TTS official README/bench/streaming/pauses: https://github.com/kyutai-labs/pocket-tts ; model card/CC-BY-4.0: https://huggingface.co/kyutai/pocket-tts (stock voice licenses independent).
4. Boson v3 official research/noncommercial model notice: https://github.com/boson-ai/higgs-audio .
5. Spokenly actual local-STT service/pricing: https://spokenly.app/ ; https://spokenly.app/pricing (pages disagree about paid tiers; recheck when purchasing).
6. ElevenLabs current developer per-character examples: https://elevenlabs.io/pricing/api .
7. Chatterbox-TTS official archive (retired Aug 2026): https://github.com/resemble-ai/chatterbox .
8. Existing KFB owners: `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/VOICE_LAYER_INTEGRATION_CONTRACT.md`; `skills/chat/KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md`; existing PR #379 and KFB Audio PR #365. GitHub wins over previous chat/model guesses.

## One next gate

**`KFB_WS0_LOCAL_TTS_THREE_ACTOR_DRY_AB_R1`** — in an explicitly authorized future local run, render, measure and listen to the 18 source-pinned candidates in the *existing* KFB Audio/Voice Acting receiving bench. No claim of actual synthesis, Mac timings, published Site or DocCheck implementation from this read-only source investigation.
