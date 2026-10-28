# Receiving brief · KFB Racer/Dieselpunk Spatial Audio R1

Status: RESEARCH HANDOFF / ENGINEERING NOT YET AUTHORIZED BY THIS DOC
Date: 2026-10-28
Source: sibling RACER_DIESELPUNK_SPATIAL_AUDIO_R1_2026-10-28.md and SOURCE_ATLAS_R1.json.
Owner of sound synthesis, source preparation, buses: existing KFB Audio Site v20 / PR #428.
Owner of game telemetry, listener/camera, physics, contact, world: named Race/Travel/WS1 receiving runtime, never the Studio buttons.
No Cloudflare Stage or new GPT Site for the research phase.

## One target outcome
In real one-vehicle gameplay, A/B demonstrate a more physical and spatial sound while drive/takeoff/glide and environment zones use the current 26+12 prepared donor assets and a source-proven material accent. One authoritative World adapter, one Audio owner, one audioContext, one host tick. The next work is not another sound dashboard.

## Read before any productive write
1. skills/chat/START_HERE.md; CHAT_GITHUB_KFB_STAGE_WORKFLOW.md; FRESH_CHAT_SLICE_PROTOCOL.md.
2. tools/KFB-Audio-Site/RETURN.md; WSA_RACER_GEARS_R1_RETURN.md; WSA_FLIGHT_CRASH_R1_RETURN.md on exact PR #428 base; current HEAD first.
3. dist/racer/CONSUMER.md, FLIGHT_CONSUMER.md, engine.mjs, manifest.json; dist/ambience/CONSUMER.md; existing voice and Combat bus owner.
4. KFB-Stunt-Car-Race/MASTERPLAN.md + RECOVERY.md, current Race ownership and v0.8 accepted feel; relevant Travel Globe runtime masterplan and active World receiving brief.
5. PR #455/453 only after verifying whether its older v11 branch can be cherry-picked as individual source-backed components, no complete-site replacement.

## Required first seam
- Source isolation: audition existing L1/L2/L3/L4/L5 and P01–P06 independently; read exact source manifest, rights and hashes. Show that the actual donor plays, rather than a file only resolving.
- Gameplay mapping: one real vehicle sends existing supported drive/flight facts; material/traction and acoustic zone may be bound ONLY from actual host truth. Do not fabricate a surface ID or camera pose for green tests.
- Acoustic treatment: HRTF on at most two real external emitters; one tunnel/open zone EQ and early-reflection A/B; dry direct player motor remains understandable in cockpit.
- Safe fallback: stereo/speaker + mobile low-cost HRTF limit, one listener, single shared context, no added duck, Stop kills all sources.
- Actual listening: 20s drive, short tunnel, takeoff and glide, with RoadTrip radio + speech focus and silent world state; headset and speakers.
- Extend optional granular/DSP/psychedelic only after demonstrated perceptual improvement. Never reuse rejected A2 synthetic tyre drone.

## Assertions the Integration Tester must prove (no runtime claim in this research)
No extra AudioContext or self-owned clock, finite source count, 0 old late events after stop, 0 contact duplicates, no music timeline reset while ducking, HRTF position and occlusion obey owner transforms, a realistic ramp/shift without overrun seam thump, correct dry→tunnel→dry, no flattening to silence of glide wind, degrade on low-end browser. Capture exact device/browser, source revision, wave peaks, CPU/voice counts and *audible* headphone A/B. Independent critic judges whether the sound is visceral, not merely louder.

## Stop/review authority
Race/World integrator writes the adapter; Audio Site owner writes only its consumer/renderer. If no authorized World host exists, preserve the candidate source and owner contract; do not make a second game. Two non-improving repairs on any optional seam quarantine it; real P0 blocker needs Production Guard classification. No auto-merge or Live.

ONE NEXT GATE: WS1/Race receiving owner maps real drive/flight/surface/zone telemetry to existing KFB Audio consumer, beginning with the source-isolated A/B one-vehicle proof.
