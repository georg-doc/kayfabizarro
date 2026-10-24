# WSA Footsteps · Wood default / carpet experiment / supplied banks · 2026-10-18
Status: IMPLEMENTED, SAME PRIVATE SITE DEPLOYED, AUTHENTICATED CHROME VERIFIED.
Georg explicitly accepted the 0.7.5 contact timing (“timing passt jetzt”); that contact algorithm is UNCHANGED. New sounds/levels are NOT HUMAN_ACCEPTED.

## Exact owner and revisions
Repo georg-doc/kayfabizarro; Draft PR https://github.com/georg-doc/kayfabizarro/pull/413
Branch audio/kfb-racer-motor-grid-r1-v378-2026-10-17
Start head 663719df9dd647a6d8e62d11b2e70791a3e9a3ac.
Implementation 888f6686b52276d7a9d696e46ec082a2a5e5d6cb; evidence 177e001da3e2ddb70806d8d82fe53453f05ca1a5.
Final Return descendant is fetched exactly in the handoff.
Same project appgprj_6ac1c73dc28881919123106bd6d3e90e; existing custom owner-only audience unchanged.
Baseline saved version 15 / source 0.7.5 / managed source d348af543d9999fe2e0f2d8e4739ce0ac7d4d38b.
Published saved version 16 / visible 0.7.6 / exact managed source 4444d29751de8bb24bd007f4abbc7289ac202cde.
Version ID appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_9146a8cc87d0819180ff5681e2b45b9c
Deployment appgdep_6ad415f821fc8191881d3ac7b759aa57, succeeded.
Acceptance URL https://kfb-audio.frizzlebob.chatgpt.site/#footsteps

## User-directed sound changes
Wood is the DEFAULT, retaining its existing cutoff/envelope/reference energy. Former Cozy (wet-clay) is reduced 6 dB, clearly labelled Gras/Lehm.
New carpet-wood experiment uses the same five Wood donor takes with 580 Hz lowpass, 110 Hz highpass, 28 ms attack, 190 ms tail and -3 dB reference energy. It is a processed interpretation, NOT a newly recorded carpet.
Added all 32 supplied step takes: Foley carpet/concrete/gravel/vinyl and Digital grass/gravel/snow/wood, four per bank. Each real contact plays ONE alternative take, no immediate repetition. Numbers 1–4 are not gait speeds, L/R labels or loops.
The supplied foley_creak_1.wav is a separate single accent button/consumer cue, never a walking variant.
Imported leading silence is trimmed with 2 ms pre-roll; the existing PCM shaping and peak cap attenuate the otherwise loud raw files. Foley banks use -2 dB, Digital -4 dB relative to Wood reference energy. This is a candidate calibration, not certification of identical perceived loudness.
No source WAV was overwritten. All supplied raw bytes remain pinned; processing is applied by the SAME audio module on playback.

## Provenance / licensing
User-pinned source commit c746a9567e0ea20a24b8969fe9130ac0756e7a7e:
media/3D_Assets/Audio/Footsteps/ and digital/.
33/33 imported Git blob hashes match the original publisher-linked Dropbox archive exactly.
Publisher archive SHA256 6824581dd5ed3f5162e85090b11155562759291b72fc5f6cc92bed67e7025e24.
Publisher https://ci.itch.io/400-sounds-pack checked 2026-10-18: Chequered Ink permits commercial game incorporation, optional credit, but not resale/redistribution of unchanged assets as one's own asset pack. NOT CC0.
Full per-file paths/blobs: dist/footsteps/imported-sources.json; receipt: LICENCES.md. No standalone asset pack is offered.
Existing Kenney/KayKit receipts retained. No paid calls, account credentials or generation.
GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED; repository-native checks used.

## Consumer/game readiness, not World installation
New DOM-free consumer.mjs injects the EXISTING AudioContext and PLAYER_CRITICAL destination, selects the same stable surface ids and consumes real contact events. No context creation, clock/timers, DOM, WB2 or Site UI imports.
Default wood; start/stop/setSurface/emit/snapshot/dispose; unique cue id dedupe; stationary/airborne steps rejected; creak separate. No invented jog, sprint or landing signal.
Source packet and exact example: dist/footsteps/CONSUMER.md.
This is a tested Audio-owned consumer seam, NOT a claimed game/World runtime installation. Protected World/PR348/WB2 files remain untouched. A later authorized World integrator maps actual support/contact events into this seam.

## Tests actually run
1067 assertions PASS (unique group counts, not rerun totals):
- Site validation 172
- existing contact core 16
- card performance 18
- native Medium/Large Walk/Run geometry 39
- real-donor PCM shaping / intended level targets / bounded peaks 176
- consumer/source/variant tests 511
- current browser recording assertions 135
Consumer tests use a graph TEST DOUBLE plus REAL donor bytes decoded through ffmpeg. They are NOT browser/human audio acceptance.
53 unique source audio files / 58 bank variants (five Wood files reused for carpet-wood); 33 new source hash checks.
All 13 selectable surfaces exercised in Chrome with actual contact scheduling, different variants and Stop; all stopped with zero active sources/RMS and no duplicates. Separate creak and first-load cancellation checked; a late async load cannot restart creak after Stop.
Current 16 s local comparison: Wood → carpet-wood → Foley carpet → Digital wood, 30 scheduled + 30 rendered contacts, 0 duplicate keys, one context, max rendered-sole vs estimated PCM onset 7.453 ms.
Hosted Chrome confirms source 0.7.6, 13 choices, Wood default, decoded 58 variants, Wood playback, Foley-carpet contact playback and Stop. Hosted snapshot: evidence/carpet-hosted.json; after Stop unarmed, zero sources/RMS, one existing context.
sole-contacts.mjs has NO diff versus accepted managed source d348af. No geometry/contact phase retune.
IMPORTANT: PCM threshold onset is an estimate, NOT independently recorded acoustic speaker/microphone AV timing. Equal energy and controls working do not mean equal perceived volume or human acceptance.
First cold host start exceeded the initial 8-second automation wait while sequentially loading the expanded banks; it subsequently completed and playback worked. Cached replay/selection was immediate. This remains a first-load UX/performance limitation, not a hidden PASS or timing defect.

## Current linked media / visible proof
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/wood-carpet.mp4
Exact hosted media opened: 16.0 s, readyState 4, no media error.
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/wood-carpet.webm
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/wood-carpet-fixture.json
GitHub fixture omits only bulky profile curves; full native Site snapshot retained.
13-control evidence: evidence/carpet-controls.json. Hosted snapshot: evidence/carpet-hosted.json.
Screenshot retained locally at evidence/footstep-isolated-audit/carpet-hosted.jpg; no media embedded in chat.

## Changed files
dist/footsteps/{audio,sample-shape,panel,preview,consumer}.mjs; CONSUMER.md; LICENCES.md; imported-sources.json; assets/imported/ (33 exact source blobs); proof/wood-carpet-fixture.json; scripts/footsteps-{contact-qa,contact-evidence,surface-qa,consumer-qa}.mjs; FOOTSTEPS_CONTACT_SITE_PATCH.diff; evidence/carpet-{controls,hosted}.json; this Return; owner RETURN.md; baseline CHANGELOG.md.
Managed Site also contains full current WebM/MP4 and index/audio-site/validator marker/cache updates represented in the patch. No media binaries duplicated in GitHub.
Preserved one AudioContext, existing semantic buses, music and TTS ducking, all existing tabs. No Hub/router/World/Cloudflare configuration writes, merge, Live promotion or second Site/runtime.

## Open items / one next gate
New sound character and subjective balance remain listening candidates. Cold initial bank loading needs later bounded UX/performance tuning. Actual World adapter installation is not done or claimed.
One next gate: WS0 listens to the linked Wood/carpet comparison and reviews the new bank selection before Georg sonic acceptance.
