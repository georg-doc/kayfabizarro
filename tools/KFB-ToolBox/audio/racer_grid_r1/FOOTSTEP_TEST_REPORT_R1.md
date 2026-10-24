# Footstep Pilot R1 · Source/Test Evidence · 2026-10-17

Status: **PLANNING QA ONLY · NO AUDIO GENERATED / NO RUNTIME IMPLEMENTED**.

### Actual GitHub checks
- Read `FOOTSTEP_PILOT_R1.json` back from the exact V-378 PR #413 branch head.
- R1 contract / safety / costs: **26/26 static checks PASS**, executed in this chat against actual GitHub source JSON. Includes schema, owner, source head, 6 materials, all filenames, timing/one-shot proposal, jump/air silence, dedup statements, no paid authorization, 6 outputs / 7s / 280 credits.
- Exact current GitHub main directory listings (`media/3D_Assets/Audio/kenney_impact-sounds/Audio`, `media/3D_Assets/Audio/Footsteps`): **28/28 proposed source sound paths exist**; the count covers grass 5, concrete 4, gravel 4, wood 5, snow 5, carpet 5.
- **Two carpet name-pairs are byte-identical by Git blob SHA**: `footstep_carpet_001 == _002` and `_003 == _004`. Therefore 5 listed Kenney carpet files represent at most 3 distinct byte contents; no per-family five-unique assertion is made.
- New source files are `FOOTSTEP_PILOT_R1.md` and `FOOTSTEP_PILOT_R1.json` on the existing branch, exact readbacks confirmed.

### Pre-existing KFB evidence (not rerun)
- KayKit profile donor exports stance intervals / measured cadence and gait phase. It is **not evidence a consuming runtime foot-contact audio event exists**.
- `kfb-hub/stage/toolbox/kaykit-motion-lab-v1/PROFILE_PROPOSALS.json` contains proposed rig speeds and contact phase sync, not human acceptance for jog/sprint.
- Existing KFB Audio mix was HUMAN_ACCEPTED via `AUDIO-CAL-01`, with prior **31/31** browser checks; those are historical, not new Footstep tests.

### Not yet measured
- 0 actual audio decode or waveform checks, 0 isolated sample listening, 0 registered `kfb:motion-foot-contact` events in runtime.
- 0 surface material readings at physical foot positions in a current world scene, 0 footstep + mixer phase timing tests, 0 landing suppression/anti-double-count tests.
- 0 ElevenLabs requests, 0 credits, 0 generated MP3/WAV. No Site/Stage deployment or current public browser test.

### Next acceptance conditions
1. In real Rig_Medium Motion Lab fixture, use recorded clip stance intervals and existing ground support; emit **one** gated foot event per crossing and inspect against visible plant.
2. Route real Kenney/Foley donor source buffers through existing AudioContext and semantic SFX bus; crossfade/airborne/land/no-surface behavior pass without footsteps turning into a second movement clock.
3. Only then consider **six small new clay one-shots / 280 estimated credits** subject to explicit paid API execution authorization and post-download true audio QC.

Exactly one next gate: `WS0_LOCOMOTION_FOOT_CONTACT_ADAPTER_MICRO_PROOF`. 
