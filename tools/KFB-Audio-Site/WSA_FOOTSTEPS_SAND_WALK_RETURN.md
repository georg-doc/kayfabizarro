# WSA Footsteps · soft sand, matched levels, first Walk contact · 2026-10-18
Status: DEPLOYED + AUTHENTICATED CHROME VERIFIED. NOT HUMAN_ACCEPTED.

## Exact owner
Repo georg-doc/kayfabizarro; Draft PR https://github.com/georg-doc/kayfabizarro/pull/413
Branch audio/kfb-racer-motor-grid-r1-v378-2026-10-17
Implementation 0a6dc7faf859f0ab41bbc0250d4ef12964efa8de; evidence 577b5db348bec16b7677c7dbf8fd8fa357d77c79.
Final Return head is the descendant containing this file, read back in the handoff.
Existing Site project appgprj_6ac1c73dc28881919123106bd6d3e90e, owner-private unchanged.
Baseline version 14 / source 0.7.4 / managed commit d60685b70cd843a3ebe7d1f686ddcdcd5efc7c58.
Published saved version 15 / visible source 0.7.5 / managed commit d348af543d9999fe2e0f2d8e4739ce0ac7d4d38b.
Version ID appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_ba22ddf88e2c8191ac6ad212bc3a3b86
Deployment appgdep_6ad4001ce230819193ad073b427b89fe, succeeded.
Exact URL https://kfb-audio.frizzlebob.chatgpt.site/#footsteps

## Georg feedback and bounded changes
Georg says Sand sounds like hard earth/stones, Walk contact seems wrong, and surface volume must not differ strongly.
Sand is re-shaped from the SAME five source-verified CC0 snow donors: 620 Hz lowpass (was 1100), 32 ms soft attack, 280 ms tail. Not a new field recording and no paid generation.
All 20 variants are now filtered/enveloped first, then energy-matched against a FIXED 240-ms per-contact reference window (target RMS .010 before host output .5; .12 pre-host sample peak ceiling). Different source lengths no longer defeat matching. Random gain variation reduced to .96–1.00. This is signal-energy matching, NOT a claim of identical perceived loudness.
shapePCM is pure PCM processing; it creates no context/clock and invents no synthetic placeholder source.

Walk root cause: 0.7.4 triggered near each foot's LOWEST point later in stance, not first touch/support handover, and the fixed floor did not follow the supporting sole.
Walk now measures the first sustained alternating lower-sole support crossover, and applies a vertical ground constraint in this AUDIO PREVIEW on a fixed plane at y=0. Native bones/GLBs are unchanged. Medium phases .146745/.646649; Large .146152/.646115, instead of late .45/.95 minima.
This preview grounding is NOT an authoritative World collision/support implementation. Run source contact behavior is retained, with geometry regression tested.
The same injected AudioContext and PLAYER_CRITICAL semantic bus remain owner; no new mixer/MusicClock, no music/TTS changes.

## Tests actually run
401 assertions PASS: Site 172; contact core 16; card performance 18; actual Medium/Large Walk/Run geometry 39; real-donor PCM shape/level 62; final browser-fixture assertions 94.
20/20 processed variants: common reference-energy target .010; numerical spread ~0 dB before random variation. This does not certify perceptual loudness.
Final local 16 s four-surface capture: 30 scheduled + 30 rendered contacts, 0 duplicate keys, one host context; max rendered-contact vs estimated audio onset 6.153 ms; all soles meet fixed walking plane within numerical precision. Stop: unarmed, zero sources, RMS zero.
Additional Large relaxed Sand Walk: 14 rendered contacts, max estimated AV 9.212 ms, fixed-plane contact, stopped output zero.
Hosted Chrome 0.7.5: Sand selection, Play/figure/Walk, Stop verified; 15 steps, 0 duplicates, one context, max estimated AV 8.542 ms; fixed-plane sole clearance <1e-9 m; Stop zero sources/RMS.
IMPORTANT: AV values compare rendered geometry with PCM-threshold onset estimates, NOT independently recorded speaker/microphone timing. Subjective sand quality and equal perceived loudness remain human listening decisions.
Earlier evidence counts and old recordings are not current proof.

## Media and evidence (links only)
Current 16.017 s browser capture with sound, all four surfaces:
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/sand-walk.mp4
Opened exact hosted link: duration 16.016667, readyState 4, no media error.
Raw current capture:
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/sand-walk.webm
Full fixture:
https://kfb-audio.frizzlebob.chatgpt.site/footsteps/proof/sand-walk-fixture.json
GitHub fixture is the same snapshot with bulky profile curves omitted; assertions do not use curves.
Hosted compact snapshot: evidence/sand-hosted.json. Screenshot retained locally: evidence/footstep-isolated-audit/sand-hosted.jpg.
No media embedded in chat.

## Changed files and protected boundary
dist/footsteps/{audio,panel,preview,sole-contacts,sample-shape}.mjs; dist/footsteps/LICENCES.md; scripts/footsteps-{contact-qa,contact-evidence,surface-qa}.mjs; proof/sand-walk-fixture.json; FOOTSTEPS_CONTACT_SITE_PATCH.diff; this Return; owner RETURN.md; baseline CHANGELOG.md; evidence/sand-hosted.json.
Managed Site also retains exact index/audio-site/validator marker/cache differences (in patch) and new WebM/MP4 binaries. Full media is stored in managed Site source, not duplicated in GitHub.
Existing 20 audio donor bytes/hashes unchanged; CC0 receipts retained. No new asset licence assumptions.
No World/WB2/PR348, Production Hub/router or Cloudflare configuration writes; no new Site, context, paid generation, merge or Live promotion.
Source-helper safety pause resolved by proving native Site HEAD d60685b and GitHub head 577b5db are DIFFERENT repositories; helper committed/pushed exact candidate d348af before packaging.

## Unresolved / one next gate
No subjective or acoustic acceptance claim. The sand is an intentionally softened snow-foley interpretation, not original sand; a future genuinely better source requires its own audition/licence check.
One next gate: WS0 listens to the linked 0.7.5 four-surface Walk comparison and checks perceived sand character/level and first-touch sync before Georg acceptance.
