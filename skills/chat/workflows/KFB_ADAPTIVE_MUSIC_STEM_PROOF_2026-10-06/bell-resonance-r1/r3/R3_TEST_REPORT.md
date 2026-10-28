# Bell Resonance R3 · Source-Isolated Architecture / Test Report
Date: 2026-10-28 · Repo georg-doc/kayfabizarro · Research Draft PR #458 stacked on current WS0 immersive PR #455 (Audio owner PR #365).
Status: LOCAL_RESEARCH_PROOF / NO SITE ADOPTION.

## Tested evidence (actual)
1. R2 synthetic WAV source generator validation rerun with 18/18 PASS: 3 original 14s 48kHz PCM16 stereo sources and their recorded hashes.
2. For each exact source, a separate offline FFT/short-window analysis was computed: 234 frames separated by 60ms; each contains normalized RMS and eight band magnitudes. WAV file SHA256 in analysis.json matches original source. **This is real numerical analysis of an invented recording, not measurement of actual bells.**
3. Node pure-module tests: 25/25 PASS. Module is read-only and has no AudioContext, DOM, clock, gameplay or music ownership. Repo version of test uses explicitly synthetic fixture; local full analysis file separately verified.
4. Chromium/Playwright interactive fixture: **15/15 PASS** (source data load, isolated source as initial view, no AudioContext construction, real embedded WAV playback, RMS and 4+ partials active, render frames advancing, same-source vault, fictional field toggle, Egregore/Bowl source switching and playback, stop, scrubbing, zero JS errors). Browser executed the actual 14s R2 WAV content supplied as data URLs and actual HTML/JS, with source URL substitution and fetch stub because ordinary navigation was blocked. **It was not a real URL/browser product test.**
5. Six actual Chromium screenshots captured in the conversation artifact: isolated/rest, isolated/play, vault/play, fictional field, Egregore source, bowl source. Screen evidence demonstrates an independently illustrated bronze bell before the source-integrated vault. Pixel differences are nonzero between isolated and architectural scenes, based on actual PNG comparisons.
6. JS syntax: local Node --check of visual.js succeeded. Three sound files, analysis, HTML, browser QA script, pure donor module, unit tests, and six screenshot PNGs packaged in one artifact ZIP.

## Exactly what the prototype does
- 3 synthetic 14 s audio tracks from R2, 3 visible presentation modes: ISOLATED, THE VAULT, SECOND MAP;
- source-aligned 8 partial energy channels via precomputed FFT, interpolated against actual HTMLAudioElement currentTime;
- drawn cast-bronze bell, real file-driven spectral halos, semi-architectural vault, ground echo contours and an explicitly fictional Egregore/Ley overlay;
- controls source change, mode change, play/pause, stop, seek; responsive editorial shell.
- No Three.js, HRTF, live WebAudio FFT, physically simulated brass material, true cymatics, audio-reactive 3D mesh, or KFB Site integration. The visual is hand-authored procedural 2D pseudo-spatial art, not a photogrammetric historic donor.

## Failures / access blockers
The test harness first attempted localhost HTTP and direct file:// navigation: both were blocked with net::ERR_BLOCKED_BY_ADMINISTRATOR. The test harness was therefore changed to isolated Playwright page.set_content with actual WAV data bytes embedded in base64 and analysis injected without external fetch. The **actual-browser fixture passed**, but this does not clear a deployed Site's HTTP/network, audio routing, voice duck, CORS or iOS acceptance. No fabricated public URL was supplied.
Previous real historical field-recording data acquisition remains blocked: Freesound originals login-gated, Commons original OGG transfer failed in current runtime. Therefore 0 original recording downloads / listening / spectral measurements / rights-receipt attachments.

## Packaging/provenance
- Complete self-contained downloadable ZIP lives as **current ChatGPT conversation artifact** named KFB_BELL_CAMPANILE_R3_PROOF.zip; its exact SHA256 and file sizes are in R3_SOURCE_MANIFEST.json.
- GitHub source under r3/ contains a pure adapter module, self-contained Node tests, this manifest, reports, Return and routing; full illustrated HTML, synthetic WAVs, analysis and screenshots are in the ZIP, **not committed as GitHub binaries or published to any Site**. Reimport of those exact sources requires source-byte receipt and protected-owner acceptance.
- Keep existing Audio Site v11 and its PR #455 immersive candidate unchanged; do not introduce research HTMLAudioElement as a second production AudioContext or owner. Existing audio mixer must receive source and drive visuals through a narrow read-only adapter in any later productive work.

## Next gate
KFB_BELL_R3_RIGHTS_CLEARED_REAL_BELL_SOLO_AND_SOURCE_VISUAL_ISOLATION: obtain two authentic real bell recordings with explicit per-file licensing/author/checksums, play each original alone, measure credible partial/decay and provenance, then compare with synthetic. Future real Site integration must additionally clear existing WS0 #455 browser/source-isolation/publish gate before any publish; no auto merge, Stage or Live.
