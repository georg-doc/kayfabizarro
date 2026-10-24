# KFB Audio · Donor-first SFX audit R2 · V-378

Date: 2026-10-17. **SOURCE AUDIT ONLY / NO SOUNDS CREATED / NO SITE PUBLISHED**.
Owner: existing KFB Audio & Soundscape, source lane KFB Racer PR #413. This is the 27-role editorial grid, **not** a second runtime/asset registry. The earlier R1 48-render batch is **FROZEN AS SOURCE ONLY; do not run its `--execute` until new authorization**.

## Ground truth and Audio-Site
1. `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/{START_HERE,INVENTORY_AND_ARCHITECTURE,RETURN}.md`: accepted AUDIO-CAL-01 soundscape; Voice/UI/Player Critical/World SFX/Diegetic Music/Score/Local Ambience/Global Bed remain the semantic roles. Source reports 31/31 browser PASS and Georg's human listening PASS on the calibrated mix, **not** on individual R2 donor sounds. Stage evidence: `kfb-hub/stage/audio-calibration/{SOURCE.json,TEST_REPORT.md}`.
2. Audio specialist Site `https://kfb-audio.frizzlebob.chatgpt.site`: source owner `tools/KFB-Audio-Site/`, Draft PR #350, `soundscape-source.json` / `intake-contract.json` / `music-interaction-states.json`. Its Return reports verified deployment 2026-10-04 and 54 catalog tracks / 44 RoadTrip / 14 stem families. **This chat could inspect its GitHub source and historical verification, but did not open or visually confirm its present hosted revision**.
3. Site's gap list (`rain-bank`, `thunder-bank`, `crowd-bed`, `traffic-bed`, `tire-friction`, `voice-profiles`) is a **2026-10-04 snapshot**; direct repository scan now sees three rain-ish ElevenLabs files and two tire-roll files, which are **candidate sources**, not proof the weather/skid gaps are resolved. Do not generate again merely because the Site marks SOURCE_REQUIRED.
4. Travel owner `georg-doc/KFB-Travel-Globe`: `travel/globe-v13/travel-audio.js` has one audio graph, Jukebox, drone/wind/rumble, shared reverb, sample-first SFX and addressed-voice ducking (legacy donor `duckAmount=0.62`; not automatically universal). Race owner `georg-doc/KFB-Stunt-Car-Race` supplies telemetry only; preferred V8 idle is `Seamless_10–12_secon_#1-1789884544910.mp3`, HUMAN_PREFERRED, never silently replaced. Combat `georg-doc/KFB-Combat-Arena/docs/AUDIO-SOURCES-v4.json` provides 27 traceable vendored cue mappings and per-bus priority/polyphony. Boxel feedback is a presentation donor, not a gameplay source.
5. The older `media/3D_Assets/CATALOG/audio-catalog.json` counts are historical. The baseline's tested 2026-09-24 checkout counted 1,732 audio files (1,687 Audio + 45 Sounds); **not a freshly recomputed repository-wide current total**. This R2 pass checks exact relevant source directories and 27/27 primary path existence.
6. `S050C-ArcadeShooter` has its own pack license; unlike Kenney CC0, its license is NOT inferred here. Use a provenance/license check before adoption.

## Existing bank discovery (source existence, NOT audition approval)

| Family | Exact confirmed sources | Finding |
|---|---|---|
| Racer engines | 19 existing KFB Racer audio files (5 WAV, 14 MP3); original preferred V8 Idle, V8 load and Steampunk synth/Suno variants | **KEEP, AUDITION**; do not repeat R1 48 shots |
| Earlier ElevenLabs | 17 existing MP3s including tire rolls, bass/design drone, rain/quirky ambience | **KEEP, LABEL SOURCE**; file names do not prove skidding, quality or seamlessness |
| Sci-Fi | Kenney `spaceEngineLow_000.ogg`, `spaceEngineLarge_000.ogg`, `thrusterFire_000.ogg`, `lowFrequency_explosion_000.ogg`, `explosionCrunch_000.ogg` | Potential hover/thrust/impact layer donors |
| Sci-Fi arcade | `Classic Arcade SFX Complete/Scifi/{Warp.wav,Booster.wav}`; S050C `{ThrustLoop,DeepEngineLoop,TractorBeamLoop}.wav` | Distinguish short warps from true steady hyperspeed |
| Explosions | `Classic Arcade SFX Complete/Explosions/` contains 31 WAV; `Retro/` has 4 explosion WAV; `S050C-ArcadeShooter/DryStereo/` has a deep/retro explosion family | Do not regenerate ordinary booms until compared |
| Impact / debris | Kenney `impactSoft/Metal/Wood/Glass`, `Materials/` (33 files), `Combat and Gore/` (17 files), `Footsteps/` gravel | Strong component bank; no evidence of signature clay-granule or Fluff effects yet |
| Boost / machinery | `Machines/hydraulic_up.wav`, `Other/whoosh_1.wav`, `Other/elastic_twang.wav`, `Classic Arcade SFX Complete/Scifi/Booster.wav` | Try layered transitions before ElevenLabs |
| Music / voice / bed | Audio-Site B/C/D music interaction contexts; Travel narrator and music/drone/wind ducking | SFX need headroom and must not reset timelines |

### Concrete duplicate proof
Within `Classic Arcade SFX/Explosions` and `Classic Arcade SFX Complete/Explosions`, **11/11 identical shared filenames also share byte-identical Git blob SHA**. Within the two `Scifi` folders, **9/9 shared names are byte-identical**. Treat these 20 as duplicate copies, not additional unique sound designs. This is a scoped Git-object comparison; more duplicates elsewhere are not excluded.

## 27 semantic slots · source-first decision
`R2_CANDIDATES.json` is the machine-readable source. Summary: **20 existing-source audition slots, 7 conditional-generation gaps**, with **26 distinct primary donor files** among the 27 mapped roles (load WAV intentionally reused for M02/M05). Do not confuse 27 slot paths with 27 unique assets or 27 accepted sounds. Gaps: steady high motor, steady coasting motor, hyperspeed sustain, drift-onset squeal, sustained drift, clay fracture, soft bass/Fluff harvest. Some are only **conditional** because a composite of existing samples may pass.

The 4-slot audition-and-generation pilot (only *after existing donors fail the required sonic property*) is **H04 Hyperspeed sustain, T04 Drift onset, D03 Clay fracture, D08 Fluff harvest**. All prompts should be dry, isolated, spatially neutral masters (or steady pitch on a loop), no music/ambience, one physical action, no cinematic soup, no extraneous trailer boom. Have WS0 approve full English text prompts after source-isolated auditions; this R2 file records behavior and timing, not a purchased generation job.

## Audio Site and soundbed acceptance
Mix owner remains one AudioContext per host. Keep B/C/D music-context adaptation separate from TTS/voice-focus ducking; `PLAYER_CRITICAL` landing/bump/boost remains readable, `WORLD_SFX` impacts can be spatial, `GLOBAL_BED` (wind/weather) and `LOCAL_AMBIENCE` should be restrained. Test in all three AUDIO-CAL-01 scenes, especially the dense ring/performance and quiet graveyard. Bass impact and Warp sustain must not mask music bass, narrator frequencies or the existing low drone. For each loop: decode/duration, pitch-stationarity, RMS/waveform/spectral boundary plus blind A/B. For one-shots: dry onset, believable 1–3 s tail, no music/reverb baked in unless intentionally chosen. Record origin, Git blob SHA, license, target role, mastering level; no auto-promotion from `INBOX_ONLY`.

## Tests and limitations
Current-turn GitHub directory reads: 27/27 primary donor paths exist on main at `904f0e95968999c7e8af77cc6667161bd4f3f788`; 26 distinct. SHA-equal 11/11 explosion + 9/9 sci-fi duplicate mappings. **0 decoded files listened to, 0 current live Site browser checks, 0 ElevenLabs generations, 0 new runtime acceptance tests.** Site deploy and AUDIO-CAL-01 checks are historical proven evidence only. Any source donor listed `AUDITION_EXISTING` is *not* sound approved.

## Exactly one next gate
**WS0_SOURCE_ISOLATED_A_B_PILOT_SELECTION**: make a 27-slot quick-listening sheet in the existing Audio Site or approved one-off reviewing surface (no second runtime); audition 26 unique primary files plus a few siblings; mark KEEP/REJECT/ADAPT and test one coherent Motor/Hover/Impact family against AUDIO-CAL-01 before requesting any paid ElevenLabs pilot.
