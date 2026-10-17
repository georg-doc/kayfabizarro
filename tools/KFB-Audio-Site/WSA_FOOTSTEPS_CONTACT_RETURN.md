# WSA Footsteps · isolated contact correction and cozy default · 2026-10-18

Status: DEPLOYED_AND_BROWSER_VERIFIED; NOT HUMAN_ACCEPTED.

## Owner and exact revisions
Repository: georg-doc/kayfabizarro. Draft PR #413: https://github.com/georg-doc/kayfabizarro/pull/413
Branch: audio/kfb-racer-motor-grid-r1-v378-2026-10-17
Implementation checkpoint: bb6087564dec42251307b266cb763f2016b87385
Evidence checkpoint: 1e841be3c82001760a8e8ffd5c1a383eaf72a575
Final Return commit is the descendant containing this file; exact SHA is read back in the handoff.
Existing Site project: appgprj_6ac1c73dc28881919123106bd6d3e90e
Baseline: saved version 13 / source 0.7.3 / managed source 6c2b672506f9df38bf3b448dc7e3b828a56a7380.
Published: saved version 14 / visible source 0.7.4 / managed source d60685b70cd843a3ebe7d1f686ddcdcd5efc7c58.
Version ID: appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_886914c556a881919d429b21f55a6448
Deployment: appgdep_6ad3fcf39ee88191be78854113b157a4, succeeded.
Audience remains existing owner-private.
Acceptance: https://kfb-audio.frizzlebob.chatgpt.site/#footsteps

## Bounded correction
Georg identified the alleged continuous hammering as a Suno song in Safari. That is NOT evidence for replacing the Site donors. All 20 existing R2 donor files are retained; no speculative R3 donor replacement was published.
A separate geometry defect was reproduced: old ankle-based triggers fired while rendered soles were still roughly 3.6–19 cm above their individual support minima, depending on figure/gait.
Contacts now use actual skinned sole vertices, retain source hips position tracks, and sample the native action from the same existing AudioContext output timestamp/origin used for scheduling. No metronome, new context, second mixer or MusicClock.
Georg separately requested a softer default: stable wet-clay value now labelled “Cozy · weich & gedämpft”, low-pass 450 Hz (was 650), surface gain 0.5 (was 0.85), attack 24 ms (was 10). Other surfaces unchanged; five variants per bank and ±3% pitch remain.
Stop closes the output gate and cancels active sources. Footstep recording/video playback interlocks with live steps.
New top “Schritte” shortcut opens the existing Mix section and scrolls directly to the proof. No Site redesign.
Existing PLAYER_CRITICAL bus, music and TTS architecture retained.

## Actual evidence
316 assertions PASS: Site 172; contact core 16; card-performance 18; actual GLTF sole geometry 39; browser-fixture assertions 71. Historical R2 counts are not counted again.
Eight local observations cover Medium/Large walk/run, recording-play/live interlock, paused silence, shortcut and stopped meter.
16-second local four-surface fixture: 29 scheduled and 29 rendered contacts, 0 duplicate keys, 20/20 donor decodes, no late pre-roll; max rendered-sole versus estimated source onset 6.804 ms.
Hosted Chrome source 0.7.4 observed directly: shortcut, Cozy default, real figure/play, stop; 9 steps, 0 duplicates, one AudioContext. Max rendered-sole versus estimated source onset 8.941 ms. Stopped: armed false, activeSources 0, RMS 0.
IMPORTANT: onset values are source/attack estimates, NOT independent microphone/speaker measurements. Human perception and absolute device acoustic latency remain unaccepted.

## Linked media, never embedded
Cozy-only browser recording, 12 s:
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-cozy.mp4
Raw current four-surface capture:
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/footsteps-contact-fix.webm
Current fixture:
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/contact-fixture.json
Cozy recording PCM analysis: 48 kHz stereo, 12.00 s, mean -70.1 dBFS, peak -48.7 dBFS; intentionally very quiet, not a human audibility acceptance.
Hosted evidence: evidence/hosted-contact.json in this owner folder; screenshot remains local evidence/footstep-isolated-audit/hosted-cozy.jpg.

## Changed files
GitHub: dist/footsteps/{audio,panel,preview,sole-contacts}.mjs; dist/footsteps/LICENCES.md; dist/footsteps/proof/{contact-browser-checks,contact-geometry-qa}.json; scripts/footsteps-contact-{qa,evidence}.mjs; FOOTSTEPS_CONTACT_SITE_PATCH.diff; this Return; owner RETURN.md; baseline additive CHANGELOG.md; evidence/hosted-contact.json.
Managed Site additionally contains exact index/audio-site/validator revision/cache changes, full contact fixture, current MP4/WebM captures and cozy WAV. Media binaries are in managed Site source, not duplicated in GitHub. The patch records small index/audio-site/validator differences.
Licences: retained source-backed R2 CC0 banks; no new donors. Wet clay/sand are processed grass/snow interpretations, not original clay recordings. No non-Kenney unverified files or paid generation.

## Unresolved and next gate
No HUMAN_ACCEPTED claim. Absolute acoustic AV measurement and preferred subjective level/character remain open. No World/PR348/WB2, Hub/router/Cloudflare writes, merge or Live promotion.
One next gate: WS0 reviews the linked current Cozy recording and isolated Site playback before Georg's sonic acceptance.
