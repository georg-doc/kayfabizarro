# KFB Bell / Resonance / Egregore · WS0 Production Brief R1
**Date:** 2026-10-28 | **Mode:** researched design/production preparation, not runtime authorization.
**Receiver:** Existing KFB Audio Site PR #365, current WS0 immersive candidate PR #455; existing private Site v11 until an exact update is visibly verified.
**Goal:** one independently auditioned and measured 60–120 second Bell Mindscape. Reusable source-backed content for 14 concept slides and optional future KFB gameplay; no new engine, site or audio owner.

## 0. Current blocker and protected source
The 2026-10-26 immersive PR #455 remains unrendered/unpublished: 17/17 static and 18/18 mock WebAudio passed; isolated original Iceberg listening, real browser and site publication 0. Reconcile the incomplete repo Source0.7.1 export with the actual managed Site before any future build. Preserve AudioContext, MusicClock, GLOBAL_BED, B/C/D music, G/D stems, existing Voice Acting/Triplet/Opener, narrator duck and recording rights. The bell research is additive, NOT a competing product gate.

## 1. Solo-source pilot, not placeholder content
Source B-01 Freesound 852491: short Rouvenac outdoor village bell, page declares CC0. Source B-02 Freesound 850511: indoor church bell ambience, page declares CC0. Before import capture individual page/license and author, file ID/checksum, place/date, original format/channel/sample rate and rights evidence; **do not assume it is the same bell** as B-01 without provenance. Source B-03: KFB-owned **clearly labeled synthetic** modal bell designed after measured parameters of one accepted real source. Heritage donors WDR, Austrian bell archive, William Hibbert, CCCBR require individual recording permissions. Existing Dropbox files named PickupBells are arcade samples, not authentic church bell recordings; F19_klangschale names likely indicate character/voice clips, not confirmed singing bowls.

For each: listen to the complete original **alone**, capture sound/videographic ear evidence, identify noise/room/attack/decay, FFT and peak estimate with confidence, verify no clipping or loudness mistake. An accessible URL is not a donor audition.

## 2. Content metadata contract (proposal, not new SSOT)
BellSource:
- sourceId; type church_bell/handbell/carillon/bowl/gong; region, site, castDate, recordingDate, recorder, originalLink;
- rights: explicit per-file evidence URL, stated license, permitted derivatives/commercial usage, review date, checksum, approved export;
- original audio file ref and actual technical attributes (codec, sample rate, channels, duration, sourceGain);
- measuredMode[]: mode label, peakFrequencyHz, relativeAmplitude, decaySeconds, detunePairCents, method/confidence, or null pending actual analysis;
- strikePitchEstimateHz separate from modal frequency and tuning reference;
- historical notes separately from cultural belief and KFB invented narrative fields;
- status RESEARCH_LEAD → RIGHTS_VERIFIED → SOURCE_ISOLATED → AUDIBLY_REVIEWED → ADOPTED.
SceneRecipe: sceneId, sourceIds, contextState, narrativeOverlayId, localEmitterLocation, roomIRId, note if modeled/synthetic, 3D listener semantics, intensity, wetDry, source/visual mapping, accessibility, stop/exit cleanup, next portal/card state request (owned by World/Deck, not Audio).
No setting secretly upgrades a mythology label into measured physics.

## 3. Actual bell DSP and design controls
A sampled real clapper attack should anchor recognizability; modal tail is independent per-partial gain/decay. The usual five named modes are hum, prime, tierce, quint, nominal; use actual extracted values for any claim about the source. Approximate unmeasured example relative to prime 200 Hz: 100/200/240/300/400 Hz; mark SYNTHETIC ILLUSTRATION. Warble means measurable close-frequency modes with beating, not arbitrary tremolo. A singing bowl rubbed continuously requires different excitation than a struck church bell. Options include sample A/B, spectrally informed offline additive tail, modal filter bank, and deliberately supernatural inharmonic resynthesis. Attack, spectral body, long room decay and SILENCE need independently mixable gates.

Before coding new DSP check source ownership and whether existing PR #455 three synth palettes can serve as layer. Optional offline precise binaural/isochronic renders should reuse existing previously researched SBaGenX or SynapSeq rather than forcing a second realtime engine. Prior Dropbox donor report: /CLAUDE/KFB_HUB/30_DECISIONS/replies/RESEARCH_BINAURAL_SHEPARD_SPATIAL_R1.md, 2026-10-24. Verify current code/tool license before using. Suno generates musical beds and ElevenLabs fictional Foley, neither certifies exact frequency or historic recording provenance.

## 4. Existing Audio routing and psychoacoustics
- Physical bell in world: positional/diegetic source via native Web Audio PannerNode HRTF and current World-to-Audio event adapter; listener attached to existing 3D camera, no second camera owner.
- Background field/mood: existing GLOBAL_BED and Score orchestration with smooth crossfade and speech duck; source original can be soloed DRY with music genuinely muted for proof.
- Reverb: dry/synthetic or rights-cleared impulse response through existing ConvolverNode; a real room IR is not automatically suitable for all bell towers.
- Binaural beats, if selected, are **head-fixed stereo** L/R difference tones: never place them through a 3D PannerNode because each ear then receives both tones; use a speaker/mono alternative and headphone listening selector. Binaural spatial HRTF is a DIFFERENT phenomenon.
- 7.83 Hz Schumann is an ELF electromagnetic resonance, only a symbolic modulator/sonification in a bell world. Never present output audio as captured terrestrial electromagnetism.
- Panning and modulation must not mask Card voice/critical SFX; maintain existing D Speech Focus and original musical clock.

## 5. Visual sound truth
A source object is physically shown ALONE before mixing: original instrument, actual heritage photo/model rights, own clay representation, single-source partial visualization, then composed scene. A loaded URL is not evidence of donor identity.
- clang/attack envelope → one transient bronze/clay deformation;
- hum/prime/tierce/quint/nominal timecourses → five concentric solid resonance rings;
- split modes' beat → two halos repeatedly coinciding/separating;
- impulse/room IR → architectural delayed vault echoes;
- near/far/occlusion model → moving audible-horizon map; water proximity alone is NOT energy measurement;
- Ley/Egregore/morphic field overlay → explicitly fictional/social narrative topology, distinct visual layer;
- true nodal/cymatic simulation must be distinguished from visual approximation.
Drive render from RMS/FFT/partial coefficients with deterministic seeds and frame budget. Reduced-motion and visual contrast options required.

## 6. 90-second dramaturgy
0–15 s: authentic recorded outdoor bell alone, data/source caption and town geometry.
15–30 s: five measured partials heard/seen separately, one intentional silence.
30–45 s: listener moves past tower; environmental near/far and optional real IR emerge.
45–65 s: ritual/Ley overlay appears and one invented modal tail shifts to impossible register; historic original identity remains.
65–80 s: same original bell interpreted via dystopian compulsory timekeeping or protopian restoration; mood and space change, not provenance.
80–90 s: original intact toll, decaying to silence; restore prior MusicClock/duck/mood cleanly.

## 7. Future test matrix and gate
**Rights/source:** 2 authentic and 1 synthetic object individually identified, 3/3 audio solo auditions, 2/2 third-party licenses individually verified, archival reconstruction labeled.
**DSP:** modal peaks measured with uncertainty, attack/body/tail separable, mono vs stereo and headphone vs speaker A/B, no clipping; 20 start/stop/reload repetitions without leaking graph nodes or spawning context.
**Spatial:** source fixed/listener moved, direct/reverb/occlusion transitions, binaural head-fixed difference remains intact.
**Visual:** five exact signal-linked responses; material donor isolated, reduced-motion and performance check.
**Owner/site:** preserve and rerun existing v11 Audio/voice/cards/B/C/D + #455 real-browser regressions prior to any eventual in-place Site update; confirm exact Site version visually. NO Stage/Cloudflare unless separately required.
**Current counts:** 0 Bell binaries imported, 0 bell solo audition, 0 measured modal profiles, 0 new browser/audio/spatial tests, 0 published Site changes, 0 new runtime. These are targets, not R1 PASS.

## 8. Deliverable routing
Artifact 1: 14 slides from SLIDE_STORYBOARD_R1.md, with independent source/object/visual/audible cue provenance and all illustrations original or explicitly licensed. Artifact 2: Bell Atlas / Impossible Campanile demonstration inside existing Audio site owner after successful intake; optional portable scene could later feed KFB Mindscape but has no gameplay authority now. Artifact 3: optional structured BellSource JSON in existing Asset Librarian/canonical catalog, never a second audio registry.
Existing current product gate remains WS0_AUDIO_SITE_IMMERSIVE_V11_BROWSER_SOURCE_ISOLATION_AND_PUBLISH. **One bell-specific next gate:** KFB_BELL_R1_THREE_SOURCE_RIGHTS_SOLO_AUDITION_MODAL_MEASUREMENT. No automatic site creation, merge, Live or runtime publication.
