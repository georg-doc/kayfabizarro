# OPTION R1 · H13 HyperNormalisation Kaleidoscope × Inner Imagery × Binaural Sound × Voice Counselor

**Datum:** 23.10.2026 · **Status:** IDEATION / SOURCE-AUDIT / NOT BUILT · **Owner:** existing KFB_HUB Fractal Canvas Research owner; borrowed visual donor remains H13 Billboard owner; KFB Audio owns mixing if later integrated; no second dialogue/mixer/world owner.
**User clarification:** By “Normalization”, the user explicitly meant the actual **KFB HyperNormalisation Engine**.

## 0. Precise donor identity, not a generic visualizer

**Read and pinned GitHub sources:**
- `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/KFB Billboard Kaleidoscope H13.dc.html` @ `main`, blob `46670cfa5c62c3aea6aa3840d301fc7a35723407`, **code examined at source**. It describes H13 as an authored canvas collage (1024×512 main surface, full-screen 1920×960), musical form/cuts, layered image and typography plates, fraktals and hypno animations; AnalyserNode takes bass/mid/treble to camera, text, grain, color/hypno timing.
- `.../00_ONBOARDING.md` blob `af3d1331f9d51c1de6a61621fdaa8c3046e4aaf8` and `.../DOKU_H5-H13.md` blob `74f06e9947a1d1d249e1e4e99134e00f3d524901`: H4 visual lineage accepted, H13 reported finished but NOT re-tested in this research. H1–H13 are frozen, new experiments may make an H14+ copy. **Collage Engine v0 FAILED / DO NOT REVIVE**.
- `.../SPRINTPLAN.md` and `HANDOVER_WSA.md`: H14 static reproducible seeds, rights and LoC plates still outstanding; audio/time and multiple canvas performance unproven.
- `tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/HANDOVER.md`: separate future render-provider seam `provider.paint(ctx2d, W, H, now, bb)`; no proof yet of successful isolated integration.
- `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json` current GitHub main: existing **Hypernormalisation Curator** `https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site` is `SITE_DEPLOYED_PRIVATE_CURATOR`, source PR #354; **editorial/admin deck/quote curation only**, H13 runtime/3D/audio integration deferred. Existing **KFB Audio** specialist Site `https://kfb-audio.frizzlebob.chatgpt.site` is a different owner for sound/mix.
- `skills/chat/recovery/KFB_ISLAND_MVP_INBOX_DONOR_AUDIT_2026-10-07.md`: H13 as **REFERENCE/STRONG VISUAL DONOR**, not new runtime; Collage Engine v0 rejected. One engine/mixer/frame owner per consuming product.

**Interpretation:** The idea should reuse **H13's authored visual/motion grammar**, NOT claim the private **Hypernormalisation Curator** already renders interactive binaural sessions; NOT create a fresh “normalization” procedural-animation replacement. **A loaded H13 HTML file is not proof of a source-faithful donor visually isolated on target.** A later implementer must show the **original exact H13 visual output in isolation** with its asset rights and audio-reactivity first.

## 1. Product idea: a conversation-directed audiovisual Imagination Atlas

**Visitor experience hypothesis:** A visually compelling, low-friction browser encounter for creative imagination:
1. **Arrive**: an evocative, freely navigable collage/visual landscape that responds to optional audio, not a sterile clinic UI.
2. **Opt-in audio**: user selects silent, neutral ambient, monaural or binaural sound. If headphones available, stereo effect can be demonstrated; voice remains clear. Sound and mic start only after explicit action.
3. **Optional live Counselor**: visitor may speak or type one creative question. A dialogic voice (not a therapist or supernatural entity) can invite a perspective or image association and allow silence, skip and return.
4. **Visual grammar**: the model suggests only constrained, existing H13-backed `motif`, `palette`, `motionEnergy`, `sceneDuration`, `visualFamily` intents; **deterministic renderer** maps these to H13 source-backed layers and a stable seed, rather than LLM writing arbitrary GLSL/shader code or inventing assets.
5. **Return**: optional personal note of `felt / imagined / observed / external fact`, without sensitive data retention by default. No imposed interpretation/EEG-state outcome.

**Important product separation:** This is an independent creative-experience/wonder prototype **inspired by** NATHAL-related research, NOT a NATHAL® / Supra-Dialog® or Silva course reproduction and not a clinical breathwork service.

## 2. Visual donor adaptation – preserve H13 but change its use

**KEEP for first research prototype:**
- authored layered image plates, depth motion, mask/crop, fraktal/hypno/molecule/formula motifs if artistically appropriate; quality and copyright inspect per real source;
- deterministic seed/cut profiles so a visitor can revisit a session; visual output adjustable via constrained controls;
- actual H13 canvas/frame and image layer production assets shown separately before remix.

**TUNE / split out:**
- H13 originally is a **disco/music-driven montage**: 8 tracks, 80–140 BPM UI, Intro/Verse/Build/Drop/Break/Outro, audio bands create kicks, grain, flashes, whirl/ripple etc. Slow imagery mode requires **less** abrupt cuts, fewer flashes, gentler optic changes and optional stillness, **without claiming a meditative EEG effect**.
- Music beat for visual trigger must **not** be mistaken for binaural difference frequency. There are **three distinct signals**: ambient music amplitude/beat envelope; acoustic L/R carrier frequencies; conversation events. Binaural carrier/difference are *not* a beat-quantized animation timeline.
- Prefer calm motion with no rapid high-contrast flashes; reduced-motion option; stop/black-frame easy. Any use of revolving hypno spiral must be soft, opt-in and dismissible, not mandatory or sensory coercion.
- Optional truly audio-responsive visuals can use **ambience envelope**, but not infer emotions or diagnostic consciousness states from a microphone or from binaural carrier rate.

**Do not reuse:** `collage-engine v0` as implementation donor; randomize every slider to look “creative”; commercial music or rights-uncleared LoC images; claims that private Curator Site is itself the full visual generator.

## 3. Audio and voice architecture – three owners, one experience

```text
Visitor GUI (one session state, real stop/pause)
 ├── Existing H13 visual grammar donor → visual renderer / scene state
 ├── Binaural/monaural/ambient generator → existing Audio owner/mixer if KFB-integrated
 └── Counselor dialogue/state → one voice transport with typed input fallback
      └── constrained visual intent events, no direct renderer ownership
```

**Real browser voice feasibility:** Official OpenAI **GPT-Live** and **Realtime API** now support browser WebRTC voice sessions with mic permissions, interruptible dialog, text/events and server-side credentials. Sources:
- https://developers.openai.com/api/docs/guides/voice-webrtc
- https://developers.openai.com/api/docs/guides/voice-agents
- https://developers.openai.com/api/docs/guides/live
- https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites

**Not automatic:** Publishing a GPT Site does **not** by itself guarantee that ordinary ChatGPT Voice is embedded into a third-party/site DOM. A true public site must have a voice transport, secure session/auth route, backend for API credentials, consent for microphone use, interruptions/latency, caption + type fallback, usage/privacy/cost planning. ChatGPT Voice inside the ChatGPT app is a separate product experience.

**Recommended sound rules:**
- binaural L/R oscillators remain distinct from voice; users can adjust tone and voice balance separately, choose silent/mono, and stop all audio immediately;
- independent real mic/voice/visual session control; **duck ambient + binaural sounds during counselor speech and microphone/listening** without accidentally breaking stereo;
- one existing KFB AudioContext/mixer when consumer is KFB; no Resemble Chatterbox-TTS vs KFB ChatterBox-Dialogue vs Speakrail confusion; **Voice agent transport is a separate technical seam**, not inherently an existing ChatterBox full-duplex feature;
- no auto-playing voice, no involuntary recordings, no publishing/transmitting private reflections without explicit separate consent; do not log chats by default.

## 4. Counselor role and safety

**Voice persona:** attentive, curious, brief, non-directive, asks one question at a time, offers alternative impressions, encourages visitor-defined mental images rather than planting determinate external factual claims. Optional switches `silent guide`, `gentle questioner`, `critical source checker`, `pause`. Avoid mystic authority, diagnosis, trauma probing or leading suggestions about spiritual entities.

**Two independent mental-image pathways:**
- **Self-imagery**: user closes/opens eyes as preferred; visual display can remain ambient. The web tool does *not* claim to see or decode inner images.
- **External screen imagery**: the visitor describes an image/theme; model emits limited H13 `motif/scene` parameters and screen responds. This is **voice-directed artistically generated imagery**, not capture of real neural images.

**Breathwork:** only spontaneous normal breathing / neutral attention if at all. No self-guided holotropic respiratory cadence, hyperventilation, breath-hold endurance, psychospiritual escalation or “altered-consciousness reward.” Separate research gallery may describe professionally facilitated Grof practices.

## 5. Research options and prototype order

| Candidate | Scope | What must actually be shown | Confidence |
|---|---|---|---|
| **V0 · isolated H13 donor** | existing exact H13 HTML + assets, only original controls | screenshot/video of exact visuals plus source references; show 2–3 different actual patterns | **SOURCE FOUND, VISUAL ISOLATION NOT RUN** |
| **V1 · calm visual grammar** | make an additive copy, no new render stack | before/after image showing faithful H13 motif and reduced intensity, pause/reduced-motion | **DESIGN ONLY** |
| **V2 · user-directed screen images** | local typed prompts mapped to 5 bounded visual params; no external model required to test | one prompt → deterministic seed → reproducible motif; no invented objects | **DESIGN ONLY** |
| **V3 · optional binaural audio** | local Web Audio Sound Perception Lab, explicit start/stop | headphone L/R separation, volume/ducking/mono, user-visible sources | **DESIGN ONLY** |
| **V4 · optional Voice Counselor** | consentful WebRTC voice, secure API key backend, captions/type path, controlled visual events | actual end-to-end dialog+barge-in+visual scene and silence/no-mic fallback | **DESIGN ONLY / TECHNICAL DEPENDENCY** |

**Do not conflate V1 visual donor acceptance with V4 voice transport, EEG efficacy or clinical utility.**

## 6. Current decision / exact next gate

This is a concept inquiry, **no code deployment**, and no new Site/public route needs to be named or created now. Distinct ideas should stay under the existing research owner until one concrete consumer receives the feature. Avoid creation of yet another general ToolBox/Counselor Site.

**One next gate:** WS0/visual donor owner must **show the actual H13 source visual output in isolation** and confirm its assets/rights and calm rendering feasibility, then nominate the existing KFB Audio Site/owner and the future voice transport as *separate technical seams* **before** implementation is authorized. If source image isolation is impossible, record `VISUAL_DONOR_PROOF_REQUIRED`; do not quietly replace the H13 look with a generic shader.

**Scope:** no feature implementation or user study, no audio clinical claims, no independent voices recording, no Site/Stage/public verification, no merge.
