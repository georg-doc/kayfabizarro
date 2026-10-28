# KFB Racer + Dieselpunk Drive/Flight · Spatial & Visceral Sound R1

Date: 2026-10-28 · status: RESEARCH + RECEIVER DESIGN ONLY · NOT IMPLEMENTED / NOT HOSTED
Owner: KFB Audio Site (WS0 audio preparation); World/Race/Travel remain authoritative for telemetry, input, physics, camera, environment and contact.
Receiving implementation baseline: georg-doc/kayfabizarro, Draft PR #428, audio/flight-crash-r1-2026-10-18 @945518d382ea0aacf62260325adc9a55a3eda241. No new AudioContext, Site, clock, mixer, registry, gameplay/runtime owner.
Original prompt: make KFB racer and dieselpunk driving/flying sound fatter, more visceral, immersive and binaural; analyze https://www.youtube.com/watch?v=3jdrae2g9gA and integration.

## 1. What the video actually contributes

The link is XSSR Academy's game-sound analysis of **Assassin's Creed Odyssey**, per their public mirrored announcement. The post indexes 00:00 broad world sound, 04:45 active city/NPC mix, 10:58 vertical ambience, 12:10 movement focus, 16:00 multi-layer footsteps, 19:39 voice priority / 3–4 audible voices, 21:33 virtualization, 25:47 mount/falcon state switching, 30:00 ship/song interaction, 34:23 transition masking. The YouTube page itself returned a throttling error; **these are creator-published chapter descriptions, not independently watched/listened claims**. Post source: https://telemetr.io/ch/channels/1679557048-xssracademy/posts?cursor=IBQ%3D. Video: https://www.youtube.com/watch?v=3jdrae2g9gA.

Transfer principles to KFB: acoustic perspective follows motion and height; player activity is assembled from material layers; sound-event priorities and voice virtualization prevent auditory overload; dramatic zone/mode transitions have acoustic continuity. Do not copy Odyssey assets or soundtrack. It is a design method donor, not executable code.

## 2. Current KFB source first — already actually present

- Racer R1 (Audio owner PR #421, inherited into #428): \`tools/KFB-Audio-Site/dist/racer/{engine.mjs,CONSUMER.md,manifest.json}\`. Four mechanical gears and four RPM bands; L1 idle, L2 low, L3 mid, L4 high, L5 overrun, shift and exhaust one-shots; ±10% ordinary pitch, ~50ms prepared loop seams, ~80–110ms ignition cut. 26 private processed files; source hashes and rights manifests. **Human ear character/seams still OPEN.**
- Flight R1 (PR #428): same \`racer/engine.mjs\`, \`FLIGHT_CONSUMER.md\`, \`FLIGHT_WS0_GAPS.json\`. Five existing modes prop/jet/jetpack/turbine/antigrav, twelve prepared propulsion donors, signed bank/climb, throttle, airbrake, wind during engine-off glide, boost; gearless by default. No invented gears. **No actual World flight adapter.**
- Ambience V-458: \`dist/ambience/kfb-ambience.v1.mjs\` and \`CONSUMER.md\`; five biomes/dayparts/weather, wind, rain, thunder delay and positional water, listener with metre-based positions. 36 curated CC0 files, attribution/provenance. **No actual World biome adapter.**
- Combat/destruction: existing \`dist/combat/\` receives unique authoritative impact/fracture/contact/settle facts; only explicit explosive:true gets boom. Existing priorities, temporal clustering and polyphony stay.
- Shared KFB Soundscape Baseline: \`skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/\` is Georg-accepted calibration, semantic buses and no second universal engine. Existing RoadTrip/Jukebox/radio is diegetic music and must remain independent; voice duck never stops musical timelines.
- Old dedicated Race source pool: \`media/3D_Assets/Audio/KFB Racer/\` includes verified asset names KFB_V8_Muscle_Idle_Loop_12s_48k.wav, KFB_V8_Load_Loop_10s_48k.wav, KFB_V8_Rev_Sweep_8s_48k.wav, KFB_Steampunk_SciFi_Engine_Idle_Loop_12s_48k.wav and KFB_Steampunk_SciFi_Engine_Throttle_8s_48k.wav. Names/pointers are known; individual sound quality is **NOT newly auditioned**.
- Historical Race A1 sonic direction accepted but exact source package missing; **never recreate A1 from prose**. A2 sustained oscillator friction rejected. A3 generated palettes/patterns and Psychedelic Scratch rejected. Do not resurface those as a new tire solution.
- Immersive PR #455 (2026-10-26) has source-backed Iceberg/Oneiric/Organic_Air candidate palettes but is stacked on older Audio Site #365/v11, not the verified Flight v20 chain. Do **not** paste its old Site bundle onto v20; reconcile as a selective soundscape donor after source isolation. PR #453 is research history, not receiving runtime.
- Audio Site protected private sources and private Dropbox bundle stay private. Public GitHub here gets code/manifests/docs only, no ElevenLabs audio, access tokens or proof media.

## 3. Creative grammar: weighted materials, not just loudness

| Module / semantic role | Auditory action | Gameplay read-only truth | Current state |
| --- | --- | --- | --- |
| DRIVE_MOTOR_BODY / PLAYER_CRITICAL | Warm mechanical pulse and exhaust body; blend low→high RPM, on-/off-load, decel | Existing speedKmh/throttle/brake/gear/rpm; future engine load if authoritative | Existing four-gear loop grid, retune/acoustic enrichment PROPOSED |
| DIESEL_MECHANICS / PLAYER_CRITICAL | Valve cough, loose metal, belt/fan, vibration/seat creak; sparse deterministic strain accents | On-load, clutch, stress/torque or authored animation facts | SOURCE_AUDITION_REQUIRED, no placeholder-generated loops |
| TYRE_SURFACE / PLAYER_CRITICAL | Gravel spray, tyre roll, mud/snow/water, grip loss, suspension contact; layer separately by surface and actual slip | wheel/contact provider's grounded, slip, material, normal impulse, surface wetness | GAP; rejected A2 synth forbidden |
| FLIGHT_PROPULSION / PLAYER_CRITICAL | Existing prop/jet/turbine/antigrav/jetpack modes; thrust pressure, climb, bank, engine-off wind | Current mode, throttle, bank, vertical, airbrake, engineOn, speed | IMPLEMENTED IN AUDIO SITE, World mapping OPEN |
| AIRFLOW_CABIN / PLAYER_CRITICAL + LOCAL_AMBIENCE | airframe whistle, turbulence, crosswind, cabin panel/rattle, wind shielding | airspeed if available, orientation, canopy/seat vs chase camera | Proposed directional/filter augmentation; avoid invented aerodynamic state |
| SPATIAL_TRAFFIC / WORLD_SFX | Other engines/aircraft pass left/right/above/behind with HRTF, distance LPF, short doppler | other vehicle transforms/relative velocity from World traffic owner | PROPOSED; no AI/opponent or traffic truth created |
| ACOUSTIC_ZONES / LOCAL_AMBIENCE | Underpass, bridge, canyon, factory, tunnel, open sky: short early reflections, EQ/occlusion/zone tails | existing World zone tags, raycast/portal/camera truth | PROPOSED; cheap zone-first path |
| CARTOON_MOTION accents / PLAYER_CRITICAL | One authentic brief rebound/airborne/landing accent; exaggerated timing, not an endless synthetic cue | input-independent contact/airborne/impact facts | map existing Race telemetry/Combat events only |
| SONIC_MINDscape / GLOBAL_BED | REAL→DREAM→REAL tail/IR/filter transitions for portal/Gutter/strange-fractal | World/Portal state change with finite duration | PR455/453 are donors only; optional after core driving proof |
| MUSIC/VOICE MIX | voice intelligibility, radio alive, no duplicated duck | existing music/dialogueActivity, local priorities | EXISTING MIX OWNER; preserve |

**Density hierarchy.** In the cabin, give PLAYER_CRITICAL direct motor + contact closest focus; keep outside traffic/world and atmospheric reflections behind it. Music is independent, addressed voice intelligible. For external/chase view, direct-to-reflection ratio changes and exterior exhaust grows; do not simply move the entire onboard engine into an HRTF node co-located with the listener.

**Visceral but not fatiguing.** Layers must add information: transient attack for perceptual weight, low-mid body for mass, brief metallic texture for identity, restrained high-band air. EQ each layer instead of stacking five loud loops. Keep headroom and silence; run 60–120s repetition listening, not only ten-second demos. Engine-load data should alter timbre and gain independently from pitch.

## 4. Proposed signature moments

1. **Dieselpunk acceleration**: warm rough idle → rising load/exhaust pressure → slight valve chatter → authenticated gear cut/air gulp → backfire (existing O1/O2 donors) → overrun when throttle closes. Under heavy load at steady RPM, more body and less clean whine.
2. **Gravel corner → puddle → landing**: authoritative tyre/surface layers, single wet spray, short suspension thump; then settling tail. No constant drift oscillator. Contact strength & time drive gain and density, not keyboard events.
3. **Industrial tunnel**: before entrance, short early reflection and slight high-frequency damping; inside, rear exhaust reflection/low-frequency persistence, narrow traffic sources; exit returns to open dry sound. Reflection is shared by other spatial sources but radio stays dry/independent.
4. **Cliff flyby**: prop/jet loads from real flight telemetry; cliff edge produces one short distance-bounded echo; other aircraft fly past in HRTF; listener height fades ground ambience rather than hard-muting the world.
5. **Engine-off glide**: power tails down while wind, flap/canopy and far environment persist; cancellation on restart must not leak ghost loops. Use existing v20 engineOn semantics.
6. **Fractal portal**: optional Oneiric/Organic_Air acoustic coloration on a named world zone, returning to original dry state. No continuous fake psychoacoustic tones under mandatory gameplay cues.

## 5. Binaural distinction and technical choice

**Primary meaning:** headphone spatialization by directional HRTF (interaural timing/spectral difference). Native Web Audio \`PannerNode.panningModel="HRTF"\` on **mono external 3D emitters** only; Three.js \`PositionalAudio\` is a wrapper only where the World host already shares the same listener/context. Perceptual result differs by browser/head shape; headphone/listener A/B is mandatory.

- Listener position/orientation follows **one existing World camera/listener truth**, with optional authored seat/cockpit acoustical perspective; do not create a second camera listener. Existing \`ambience\` already has HRTF on water; reuse its coordinate/unit convention.
- Onboard player motor/body: mostly nonpositional/diegetic stereo with small relative interior details. Do not HRTF-localize its entire engine to the camera, which can attenuate/disappear at close distances or during camera changes.
- Remote vehicles and airborne flybys: short HRTF sources, distance falloff, source direction, low-pass occlusion and priority. Compute optional Doppler from *authoritative relative radial velocity* and change playbackRate carefully; modern Web Audio PannerNode has no reliable native velocity/Doppler API. Avoid double-processing pitch already mapped from RPM.
- Occlusion: start with existing geometry/zone material and one or two raycasts per audible source at a **bounded cadence**, filter and gain with smoothing; add early reflections and optional short ConvolverNode impulse only after audible A/B. No imagined physics-accurate wave diffraction.
- Speaker/mobile fallback: \`equalpower\` or stereo-bus mix where HRTF percept is poor; content must remain intelligible in mono, on laptop speakers and on headphones. Do not call binaural beat difference-tones a spatial-audio replacement.
- **Optional** binaural beats for a Mindscape are an unrelated music/psychoacoustic layer; do not place a continuous beat under critical vehicle feedback and do not promise health effects.

Native Web Audio \`PannerNode\`, \`BiquadFilterNode\`, \`ConvolverNode\`, \`DynamicsCompressorNode\` and \`GainNode\` are sufficient for the first spatial seam. \`AudioWorklet\` is later only if a measured custom granular/physical process needs stable low-latency DSP; budget worker CPU and compatibility, no replacement mixer/AudioContext. Resonance Audio Web SDK is ARCHIVED (2026-04-19) and is not a production adoption candidate; FMOD/Wwise/Steam Audio can be authoring/ideas references but not automatically drop-in Web/Three.js runtimes.

## 6. Actual integration direction: thin owner adapter

The Audio Site already exposes \`createRacer({audioContext, destination})\`, \`setTelemetry\`, \`setMix\`, \`tick\`, \`emit\`, \`stop\`; Ambience has \`setContext\`, \`setWaterEmitters\`, \`setMix\`, \`tick\`, \`emit\`. No replacement service needed.

World/Race/Travel should provide an **adapter sending existing authoritative facts**:
- already supported now: \`mode, speedKmh, throttle, brake, gear?, rpm?, bank, vertical, airbrake, geared, engineOn\` (plus existing weather/biome/wind);
- PROPOSED fields, requiring owner confirmation before code: \`listenerPose, cameraPerspective, sourcePose, otherVehicleVelocity, surfaceMaterial, grounded, wheelSlip, suspensionImpulse, acousticZoneId, portalPhase\`;
- explicit unique event IDs for impacts, contacts, transitions. Audio never guesses hit/portal/track state from visuals.
- existing host tick and audioContext.currentTime control all scheduled voices. No standalone RAF/timer, no second AudioContext, no duplicate MusicClock or registry.

Plan a small \`WorldSoundProjection\` adapter in the **actual World/Race host owner**, not in shared Audio as physics; Audio can add a bounded spatial renderer as a **consumer of already authoritative transforms**. Preserve accepted v0.8 drive feel, current traction/contact and existing camera. UI remains source-first; no new HUD/brand.

## 7. Source acquisition / licensing / candidate arbitration

**First:** solo-audition and source-isolate existing KFB Racer V8/Steampunk loops, 26 prepared gear sounds, 12 flight sounds, 36 CC0 ambience, existing Race contact pool, Combat tail assets. Group duplicate lineage and check rights/version; URL existence is not source isolation or hearing acceptance. Private ElevenLabs processed sounds stay in private Dropbox/current owner-private Site; GitHub gets manifests only.

**Only source gaps:** three authentic tyre/skid families (dry gravel, wet/asphalt, clay/soft earth) + suspension body/underbody, short diesel valve/weld/metal rattle, one dry underpass/tunnel impulse or measured short reflection, flyby/airframe rush, optional jetpack shutdown, quiet nonexplosive contacts. Use stock-first. Existing \`FLIGHT_WS0_GAPS.json\` remains authority for current four generation wishes.

Kenney Impact Sounds CC0 offers collision/foley candidates (https://kenney.nl/assets/impact-sounds), not an audited tyre bank. Freesound has per-file licences; filter CC0 or maintain full CC-BY credits (https://freesound.org/help/faq/). Do not treat all Freesound as CC0 or import NC material. Granular engine synthesis concept (https://github.com/Jonas-Hack/Granular-Synthesis-for-Engine-Audio) is a **research-only algorithm example**: no source code copied, licence unverified, and its known piston transient artifacts make it a later option. Prefer the currently working multi-loop grid and measured auditions.

## 8. First bounded listening/game proof (one receiving owner)

A one-vehicle **DRIVE → TUNNEL → OPEN → TAKEOFF → GLIDE** scene, not a standalone simulator. A/B:
A = exact existing current audio chain, unchanged;
B = same chain + bounded spatial world emitters, a *single* real source-backed material/contact layer, one tunnel/sky acoustic transition.

Begin with (1) single-source isolation recordings, then (2) gameplay hookup, then (3) single-site audible comparison. Test with headphones plus speaker fallback; pace slow→fast, voice/radio overlap, tab suspend/resume, Stop and route switch. Only extend to multiple vehicles/traffic and Mindscape after perceptual benefit is proven without extra runtime ownership.

Hard gates: 1 AudioContext, 1 owner clock/mixer, 0 audio gameplay writes, no double duck, no leaked sources or late events after stop, no duplicate spatial listener, exact asset rights, real telemetry/physics/contact receipts, explicit HRTF fallback; document browser audio and ear review separately. Suggested performance budget (not measured): 4–8 close HRTF emitters desktop and 1–3 mobile, dynamically prioritize/virtualize; benchmark actual devices before declaring such numbers production limits. No Stage request for this research artifact; current owner-private Site is an existing reference surface, not newly verified in this turn.

## 9. References (evidence tier)

Primary user video (creator's chapter list mirrored; full playback NOT accessed):
- https://www.youtube.com/watch?v=3jdrae2g9gA
- https://telemetr.io/ch/channels/1679557048-xssracademy/posts?cursor=IBQ%3D

Official sound/Web technologies:
- https://www.w3.org/TR/webaudio-1.1/
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
- https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
- https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
- https://threejs.org/docs/pages/PositionalAudio.html
- https://docs.beamng.com/modding/vehicle/sections/sounds/engine_audio/ (engine/exhaust/on-load layering)
- https://github.com/resonance-audio/resonance-audio-web-sdk (archived)
- https://kenney.nl/assets/impact-sounds
- https://freesound.org/help/faq/
- https://github.com/Jonas-Hack/Granular-Synthesis-for-Engine-Audio

This document names design candidates, not adopted source audio or a performed game-audio test.
