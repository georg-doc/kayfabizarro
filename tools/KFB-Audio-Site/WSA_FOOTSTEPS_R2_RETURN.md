# WSA · FOOTSTEPS R2 · V-430 · RETURN · 2026-10-18

Status: IMPLEMENTED · SAME PRIVATE AUDIO SITE DEPLOYED AND VISIBLY VERIFIED · WS0 REVIEW PENDING. NOT HUMAN_ACCEPTED. Georg's V-389 FAIL supersedes the prior technical-pass handoff.

## Outcome and operating instruction

Open https://kfb-audio.frizzlebob.chatgpt.site/#footsteps. Visible source 0.7.3. Play steps starts the existing host once; Stop steps cancels active sources and future contacts. Select Idle/Walk/Run, surface, walking tempo and Medium/Large. Proof links are directly below the controls. No music starts automatically. Site left stopped/silent.

WS0 acts next: listen/watch the linked R2 recording and check the controls before returning to Georg. Georg need do nothing until WS0 returns. No paid generation or World integration is authorized by this repair.

## Exact owner / provenance

- Repo: georg-doc/kayfabizarro. Draft PR #413: https://github.com/georg-doc/kayfabizarro/pull/413.
- Branch: audio/kfb-racer-motor-grid-r1-v378-2026-10-17.
- Entry head: b7207674f8f03dfa2c967466610ae94c3c096f01.
- Implementation checkpoint: 3d479ec35858feaedb81698b4a7d53926619d861.
- Runtime/evidence checkpoint: 9f87ad92b3c94385f9c3aa254a4087b70a3c86c1.
- Final Return-only head is reported in the PR metadata/chat after exact readback; this file cannot contain its own commit hash.
- Current main observed before first write: c746a9567e0ea20a24b8969fe9130ac0756e7a7e.
- Site baseline source: 3e5849b0a0375664e9463a5663bbdcfec1847f4c (0.7.2 / version 12).
- SAME project: appgprj_6ac1c73dc28881919123106bd6d3e90e.
- Published source: 6c2b672506f9df38bf3b448dc7e3b828a56a7380.
- Saved version: 13; source marker 0.7.3.
- Version ID: appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_585f7684ef64819186911ba5b51d1406.
- Deployment: appgdep_6ad3f329c1308191944df353a65920fb · succeeded.
- Existing owner-only audience retained; no sharing/access change.
- Complete source, recordings and all binary bytes are committed in the existing managed Site source repository. GitHub PR stores additive source, existing asset blob references, integration patch and factual evidence; it is not a second Site.

## Repair / retained boundaries

One-click gesture-resume + shared, retryable loading; immediate stop; cancellation generation prevents a late async start after Stop. Controls bind immediately, including before 3D load. Hidden page or leaving Mix stops footsteps. Existing AudioContext injected into SFX only; PLAYER_CRITICAL bus; no new master, context, MusicClock, second audio mixer, World truth or TTS owner.

The selected native AnimationAction.time + loop count owns cadence, not an independent phase accumulator or metronome. Native Medium/Large clips are measured independently with the existing unchanged locomotion-profiles.v1.js. Stable >=70 ms contacts retain the prior qualification; brief grazing contacts do not create double steps. Effective action time scale also changes contact duration. Walking rates: 1.6875 / 1.875 / 2.15625 steps/s. Run uses the selected rig's actual Running_A duration (Medium 2.5/s, Large 1.875/s at ×1), not an invented gait.

Five distinct existing CC0 recordings per surface, no immediate sample repeat, pitch ×0.97–1.03 and small gain variation. 65 Hz highpass, 650–1100 Hz lowpass, 10 ms fade-in, short 190–240 ms decaying tail, no normalizing quiet sources up to the former loud level. Heavy-impact landing donors are never decoded/played by R2. Hop on Medium uses the selected soft surface bank and only a support false→true edge. Original Large MovementBasic has only Walking_A / Running_A: Hop is explicitly unavailable there, not faked. Full source figure is fitted into camera independently.

Catalog/Mix/Voice Acting/Soundscape/Intake/Prompt Studio/Brief preserved. Existing G/D music, master/crossfade and TTS focus architecture unchanged; outside footsteps only source/cache markers and validator expectation changed.

## Sources / licences

Active R2 bank: Kenney Impact Sounds, publisher CC0: https://kenney.nl/assets/impact-sounds. Five unique Git-blob hashes verified per bank:
- snow recordings → sand interpretation;
- concrete recordings → muted stone;
- wood recordings → muted wood;
- grass recordings → wet-clay interpretation.

These are disclosed processed Foley interpretations, NOT claimed original sand/clay recordings or accepted final clay sound design. Original KayKit CC0 licence retained, with Medium/Large models and matching native rig clips pinned to actual repo bytes. Added 18 files (15 audio + 3 Large rig/model) have exact verified source Git hashes in sources.json r2Rows. Old Chequered Ink files retained only for historical V-389 evidence and never played by R2. Optional game-dev CLI unavailable; repository-native fallback used. No ElevenLabs login, API call, key, generation, spend or credit use.

## Actual checks — no acceptance inference

340 source/unit/evidence assertions PASS:
- existing Site validator: 172;
- existing contact core / ten-minute native phase simulation: 16;
- existing Card Performance unit checks: 18;
- R2 source/provenance: 54;
- actual recorded fixture / WAV evidence: 80.

23 local observed browser checks PASS (full individually named results in dist/footsteps/proof/footsteps-r2-controls.json):
silent inspect (0 contexts before Play), Play, relaxed/brisk tempo, Large figure, Idle count hold, Run, manual Stone, Medium support Hop, Stop count hold, all four fixture surfaces, demo+recording, 20 decoded sources, duplicate guard, visible-frame fade estimate, measurement download, Reset, Large unavailable Hop disabled, manual recording start/finish, and TTS coexistence.

Published exact-origin browser: 8/8 observations PASS: expected 0.7.3 + actual playback/one context; all four surface selectors; Large/Run/relaxed tempo; Idle count hold; Stop. Recorded source marker and UI visible in Chrome. A further direct hosted MP4 check loaded 640×480, readyState 4, duration 15.933333 s, no media error. See evidence/V430/HOSTED_BROWSER.json and DEPLOYMENT_RECEIPT.json.

D real stems reached PLAYING D (94 BPM, bar 7 beat 4) alongside ongoing footsteps. Existing TTS toggle set voiceActive=true with one AudioContext; no music timeline replacement. Toggle off and Stop stems worked afterward. This is a coexistence smoke test, not a complete new G/D sonic recertification.

The existing network-only Card Performance live-data suite could not run: api.github.com DNS ENOTFOUND in the shell. Its prior 12 assertions are NOT included in 340 and are NOT claimed passing now. Browser source requests and native GitHub connector were available. Earlier Large-hop missing-clip errors were reproduced and repaired by respecting the real clip inventory; no such new error observed after repair. Old unrelated extension-listener messages predate the deployed revision.

## Measurements / recording

Fixture: 30 steps, 0 duplicate event keys, all four surfaces, 20/20 sources decoded. ±pitch observed 0.970317–1.028243. Contact timestamp → scheduled source start p95/max: 11.156146 / 11.156369 ms (under one 60 Hz frame). No independent clock or metronome.

Visible-frame → fade-end estimate: 10 ms. This is NOT a physical speaker/output-latency or independent AV frame measurement. Native contact sampling is ~60 Hz and output device latency/filter delay are not certified. Consequently perceived contact/audio drift <=1 frame remains for WS0 to inspect in the actual clip; the scheduler measurement alone is not that human AV proof.

WAV: 15.906 s, 48 kHz stereo, peak 0.0435791 (-27.214 dBFS), RMS 0.0018759 (-54.536 dBFS), 0 clipped samples. Video: 15.933 s / 640×480 / 60 fps. Actual Chrome canvas + same-context SFX recording with gait/surface/status HUD, not a recording of the entire browser/control chrome. Working controls are evidenced separately by the observed matrix and screenshot. No microphone or second audio context.

- Audible motion clip: https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-r2.mp4
- WAV: https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-r2.wav
- Raw WebM: https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-r2.webm
- Fixture: https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-r2-fixture.json
- Controls: https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-r2-controls.json
- Report: https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-r2-report.json

MP4 SHA256 a74ca6e48e5874c935fa3a47117df3a6902e99d297174b6204b59eb71f0b5a1b.
WAV SHA256 1bfeccb852c8f68dff961e127ac44d39acb44e1d0cba2d081adb44ee0105eb9a.
The browser download-wait operation stalled/timed out; success was not assumed. Actual completed Downloads files were subsequently found, decoded and measured; exported JSON exactly matches the captured DOM fixture.

## Changed files

Hosted complete changed-file roster is in evidence/V430/CHANGED_SITE_FILES.txt (36 files). Groups: panel/preview/audio; sources/licences; 18 existing donor bytes; 6 proof artifacts; 3 preparation/QA scripts; source-marker changes in index/audio-site/validator; integration patch. Contact core and vendored measurement module unchanged. GitHub adds this named Return, owner Return override, additive baseline changelog, deployment/hosted receipts and roster.

No World, WB2, PR #348, Production Hub, router, Cloudflare config or external game runtime writes. No merge or Live promotion. Auto-triggered repository CI/mirror workflows are not used as acceptance proof.

## Unresolved and one next gate

Original clay field recordings are not available here; edited donor sound character is a candidate. Perceived softness/immersion and physical AV <=1-frame timing are not human accepted. The clip covers the rendered motion region + HUD, not full browser chrome. Network-only 12-check data regression remains unrun; future World material/support adapter and stride-distance integration remain outside this slice.

ONE NEXT GATE: WS0_FOOTSTEPS_R2_REVIEW — WS0 opens exact version 13/source 0.7.3, listens/watches the R2 clip and checks the controls, then returns PASS/TUNE/FAIL before Georg is asked. No automatic paid batch or World integration.
