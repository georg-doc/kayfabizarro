# VS0 HANDOVER · KFB Nature Orchestra · R1 · 2026-10-26
Mode: later INTAKE / planning-to-implementation; **not implementation authorization**. Existing production owner: KFB Audio / original Audio Site. Receiving name **VS0** is user-requested; its exact current executor, branch and integration head must be identified by VS0 on pickup, not invented.

## What Georg wants
Add immersive, natural and non-repetitive soundscapes as a **new source family** alongside existing Sonus/Suno songs, certified stems, musical Ambient Beds and current environment/SFX. Real birds, leaves, frogs, crickets, wind, brook, rainfall, waves and living fauna form an *orchestrated, biome-dependent nature layer* for Dream Journeys, Mindscapes, World and global soundbed. Second add-on: rich sound made procedurally with current Three.js/Web Audio/browser facilities and, selectively, new ElevenLabs-generated clips (still source candidates). Preserve silence and narrative voice.

## Grounded acceptance context
Existing Audio Site: https://kfb-audio.frizzlebob.chatgpt.site/ (PR #350, no second site). Existing accepted AUDIO-CAL-01 mix/ducking and one AudioContext. PR #352 provides source-only Ambient Beds, draft SFX intake and a known localized frozen Sources binding repair seam; **do not import the bug or overwrite the QA-green original mixer**. PR #365 later adaptive/music/Opener history separate. Use verified current owner code and source modules, not memory. The historical calibration Stage is not a Nature Stage.

## Mandatory inputs on pickup
1. Read `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`.
2. Read PR #350 current SSOT/RETURN/RECOVERY, PR #352 intake/product recovery, PR #365 current status, and current exact KFB Audio site/source revision.
3. Read sibling `RESEARCH_AND_ARCHITECTURE_R1.md`, `NATURE_SOURCES_R1.json`, this brief, `RETURN_R1.md`, `TEST_REPORT_R1.md`.
4. Recover shared `media/3D_Assets/Audio`, `Sounds`, Asset Librarian metadata/Inbox, and Travel/World adapter hooks. Inventory current wind/water/ambience before downloading new files.
5. Name the one existing runtime host receiving the pilot. Do not clone Audio Site or World audio manager. Do not claim source/wav availability from URL alone.

## Phase 1: 3-way sample qualification
For each candidate selected from `NATURE_SOURCES_R1.json`:
(A) **rights** individual current source page CC0/PD license snapshot + downloaded bytes checksum + no attribution restrictions + original URL/file/creator metadata;
(B) **audio isolation** standalone listener samples source and records noises (traffic, voices, clipping), naturalism, time/geography, source energy, stereo field, bird species unknown until verified;
(C) **runtime fitness** actual decode + browser-compatible derivative + useful edit regions, optional seamless loop (listening proof) and sensible gain/bus/space. Unknown source stays SOURCE_REQUIRED.
Maintain source hash provenance and private master/derived clip mapping in **existing** Registry (not new registry). Production Inbox currently <=32MB per artifact; large 170MB Copenhagen storm requires sanctioned different file/package strategy, not truncation/deceptive passing.

## Phase 2: first authentic forest calibration
One documented `temperate-forest-dawn` scene through existing Audio Site/World adapter:
- broad genuine forest/wind bed(s) at global/zone level, independent offsets and crossfade;
- spatial stream emitter with camera listener, attenuation;
- several separately vetted bird snippets at canopy positions and subtle call response, not always-on looping song;
- narrator state D and optional ambient music C, with physical bed free-running;
- cloud/day/night/weather input is supplied by the real World/Mindscape host, Audio reads it only;
- controls: Nature source-only ON/OFF and source labels in *existing Audio Site* where appropriate; no generic new mixer UI.
- deterministic seed and 30-minute event trace, silence windows, non-repetition/CPU/logging.

## Phase 3: synthetics A/B research prototype
Build only after **source-only** Golden candidate established; otherwise a synthetic demo could mask absent authentic donor.

**A Native Web Audio (preferred first):** `AudioWorklet` or existing Web Audio nodes create decorrelated filtered noise shaped by low-frequency modulation for canopy/wind; stochastic filtered short grains for rain (droplets vs roof vs leaves driven by material/weather); occasional crackle/branch twig detail; convolution/delay low wetness for environment. Use physical controls `windSpeed/windGust/canopyDensity/rainIntensity/surfaceWetness/waterFlow` where actually available. Do not turn all noise layers on at full amplitude; off mode CPU-idle. AudioWorklet requires HTTPS in typical browsers; one AudioContext.

**B Three.js spatial adapter:** audio listener on authoritative camera, sound emitter attached to current 3D tree, wetland, stream, waterfall, bird/animal where real geometry exists. `THREE.PositionalAudio` provides PannerNode (HRTF vs equal-power A/B); reverb send/LPF/occlusion weights consume terrain raycast/path hints if available but never own physics. Distant sources combine into ambient canopy bed; cap near-field HRTF emitters.

**C Tone.js optional:** single polyphonic sparse pad (detuned sine/triangle/modal/slow filter), through existing KFB SCORE bus and KFB MusicClock, **no Tone.Transport clock authority** or Tone-owned AudioContext. Compare authored Sonus Ambient Bed vs Web Audio pad; default KEEP source master where superior. `OfflineAudioContext` renders deterministic synth snapshot for regression checks.

**D ElevenLabs text-to-SFX (candidate-only):** current API documents `loop`, `duration_seconds` 0.5–30, `prompt_influence` and `eleven_text_to_sound_v2/v3` model selector. Product can emit 4 variations via UI and supports seamless-loop option (audition seam, don't trust label); sound effects include ambient textures and drones. https://elevenlabs.io/docs/overview/capabilities/sound-effects ; https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert . Commercial/redistribution terms depend on authenticated account/plan and intended usage: don't label output CC0. Prompt each gap from physical/acoustic observations, never unexplained KFB terms; source `AI_GENERATED_CANDIDATE`, `rightsEvidence=ACCOUNT_PLAN_REVIEW_REQUIRED`, `ecologySpeciesUnverified`.
 
Self-contained ElevenLabs audition prompts (EN; audition ONLY, do not insert blindly):
- `Outdoor broadleaf forest canopy in a gentle variable breeze. Distant diffuse leaves moving above head, airy stereo space, irregular low gusts, realistic natural field ambience, no birds, no human voices, no music, no machinery. 24-second seamless background loop.`
- `Light rain falling onto moss, undergrowth and wet broad leaves at a woodland edge. Intermittent close droplets, gently changing density, natural outdoor acoustics, no music or voices, no repetitive pulse. Seamless 24-second ambience.`
- `Quiet wetland at dusk, distant small water movement and restrained insects, scattered isolated frog croaks from different distances, natural uneven spacing, no tropical parrots, no music or speech, 25-second ambient texture.` **Ecological plausibility of AI fauna is uncertain; prefer recording when available.**
- `Very soft slow evolving tonal atmosphere for reflective exploration, subtle warm harmonic partials and filtered air, sparse spectral motion, no percussion, no lead melody, no birds or literal animal calls, leaves clear space for narrated speech, 24-second seamless ambient pad.` Musical ambience is distinct from nature recording.

## Biome recipe shortlist (growth, not first-day scope)
| Scene | Authentic baseline | Procedural companion | Music/voice |
|--|--|--|--|
| temperate forest dawn | woodland birds, leaf field, local creek | diffuse canopy wind | quiet C, D narration |
| woodland dusk/wetland | insects, pond frog chorus, distant water | soft wind, irregular insect microtexture | C optional, D focus |
| coast/rocky shore | long sea waves, nearby surf, gusts | weather-driven air and spray detail | C/Sonus horizon bed |
| meadow high summer | wind grass + location-true insect/far birds | vegetation flutter | no automatic soundtrack |
| storm approaching | real thunder/rain, interval quiet | changing rain density and spectral occlusion | score duck/quiet |
| nocturnal desert | geographically verified arid fauna/air (SOURCE_REQUIRED) | low wind/sand whisper | dream pad only if intentional |
| surreal dream/Protopia | real ecological anchor from selected biome | gradual formant/spectral texture, intentional inversions | Utopia/Protopia sources + narration; explicit dream flag |

## QA and evidence acceptance
- 13 discovery candidate rows page-CC0 noted; 0 imported, 0 acoustic QA. Need **source isolate** at least 1 candidate before moving to real mix.
- Compute trace nonrepetition: count same clip recurrence, intervals and near-field polyphony; record 10-minute fatigue and 30-minute structured replay. Numeric thresholds provisional, not acceptance without listening.
- Verify Nature ON/OFF + two spectral/synthesis variants; same scene seed; 2 browsers incl. mobile Safari; headphones vs built-in; tab restore; one WebAudio context; phrase clock/timing unchanged; dialogue clear.
- Separately review orchestration (source realism, silence, location-true fauna) vs generative texture (synthetic/noisy vs organic) vs mixing (music/D focus). Do not classify synthetic nature as recorded biophony.
- Independent Tester and Critic classify source/visual/listening evidence; Production Guard escalation for actual integration. No Georg acceptance invented for source JSON.

## Actual next gate (single)
**VS0 AUDIO NATURE SOURCE-ISOLATION + FOREST ADAPTER INTAKE**: pin current owner and choose 4–8 high-quality individual sources from this candidate list; confirm license+binary+source-isolated listening of at least one; create one forest source-only proof inside existing owner; optionally compare one low-cost synthetic canopy wind A/B; document what failed and what remains. Do not implement other biomes, a new Site, or a Cloudflare Stage before this first source proof.
