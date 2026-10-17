# V-389 · Audio-owned footstep micro-proof

Existing Site only: https://kfb-audio.frizzlebob.chatgpt.site/#footsteps
Owner project `appgprj_6ac1c73dc28881919123106bd6d3e90e`.
Source baseline: hosted source commit `d3c1df83347367ce49634a2d29972f773c322574`, Site 0.7.1 / version 11. This slice is additive 0.7.2, not a rollback to the remembered 0.5.1.

## Consumer seam (later; no World writes)

`createFootstepAudio({audioContext, destination, rows})` accepts only the existing AudioContext and its `PLAYER_CRITICAL` bus. In this Site, `await window.KFBAudioSite.resume()` returns that existing graph. It creates no AudioContext and never schedules a music clock. Existing SCORE ducking stays untouched.

`ContactTimeline.advance({owner, phase, duration, time, points, moving, surfaceAt})` consumes unwrapped native clip phase plus the same context time. `owner` is one arbitration token for the current gait, not both blending actions. `surfaceAt(foot)` queries actual left/right foot positions; this fixture has a deliberately tiny material-plane query, not a World terrain controller. A future adapter supplies actual support facts. Stationary or airborne state emits no footstep. Hidden/background backlogs are discarded.

`support(grounded, time, surface)` emits LAND only on authoritative false→true. The fixture's 0.9 s ballistic support owns height; Jump_Idle and Jump_Land are presentation only. An animation callback must never emit a landing. Resume gait after landing is not implemented in the synthetic fixture: it returns to idle deliberately.

## Measured contacts, not a BPM metronome

Unmodified ToolBox donor: `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/kfb-lib/locomotion-profiles.v1.js`, using `measureClip()` on real Mannequin_Medium with the one THREE mixer. Raw full planted intervals remain in diagnostics. Stable-plant qualification requires >=70 ms, including joined wrap intervals, because native Walking_A also contains brief height-threshold grazes. Result: two qualified contacts/cycle, walk 112.5 steps/min and run 150 steps/min at native rate. No invented jog/sprint and no gait inferred from audio duration. Changing cadence later must follow the real animation phase/playback and support owner.

The specimen is an in-place contact/treadmill preview, not a locomotion/stride-distance controller. `stanceSpeed` is measured source metadata, not a claim of validated World traversal or friction.

## One cue timeline

`timeline.packet()` exports an Audio-owned candidate `kfb.performance/1` SFX cue seam, with `sfx[]`, `vfx[]`, `lights[]`. Current SFX times are the absolute injected AudioContext seconds; downstream video must subtract an explicit chosen performance origin. No video or game clock is started here. VFX/light arrays are intentionally empty, not placeholder effects. Canonical cross-owner schema admission and karaoke dance contacts are deferred; do not replace an existing performance document with this small packet.

## Evidence boundaries

The visible drift is contact-crossing → AudioBufferSource scheduled start, plus a separate source onset estimate at 3.5% of decoded peak. It is not speaker/OS output latency and not a measurement of filter group delay. 60 Hz contact measurement adds up to one source sample interval (~16.7 ms) of uncertainty. Browser frame dispatch may add delay; all raw event times are downloadable. Maximum eight simultaneous one-shots, 120 ms same-foot refractory, 160 ms landing overlap suppression, immediate-repeat-free bank choice.

Georg still judges sonic character. Runtime/decode proof is not HUMAN_ACCEPTED. No paid generation, no motor batch, no World/WB2/PR #348, no merge or Live promotion.
