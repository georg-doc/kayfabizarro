# R2 Bell Modal Prototype — TEST REPORT
Date: 2026-10-28. Local Python offline, no host/audio Site change.
- Actual generated file outputs: 3 stereo PCM16 WAVs at 48kHz, 14 seconds each.
- Actual visual evidence: 2 plots computed from emitted synthetic samples, one spectrogram and one frequency-response plot.
- Source-specific real church bell binaries: 0. Physical historic bell mode measurements: 0. Public page metadata and license claims checked for 7 original sources, no binary download success.
- Separate archive pages include Freesound 852491/850511 (CC0 on pages, login-gated) and five Commons PD/CC0-page candidates (blocked audio binary download in this session).
- Local validator: **18/18 PASS**, with 4 checks per WAV (format, duration, peak, SHA256) = 12; 6 further checks (5 modes, genuine Egregore signal modification with pre-roll preserved, decay, bowl sustain, stereo differences, synthetic labeling).
- Initial 17/18 FAIL due to an incorrect test-window expectation: checking first 1s instead of shared silence pre-roll ending 0.8s. Diagnostic yielded zero difference for first 0.75s, but a real difference from 0.8s. Test corrected and all 18 rerun. Source code was not patched to hide a failing sound.
- Measured synthetic reference FFT peaks (Hz): 200.04, 99.98, 239.87, 401.18, 300.66, 528.63, 684.17, 1051.03. These peaks are from the actual synthesized WAV and agree with authored modal input within FFT tolerance, **not** measured historical bells.
- WAV sample peaks: -6.38 / -6.41 / -11.97 dBFS; no clipping. Relative sound quality and psychoacoustic comfort not human accepted.
- ZIP of samples + original Python generator + validator + plots + local JSON: sha256 5c323a9a9fdf5bfbd37b4be9dc6fcd65adc465f4f17700daa7380ba491726b7d. ZIP exists in this conversation's file output, not committed as a binary to repo.
- Actual played/heard-by-human proof: 0. Full WebAudio browser tests: 0. Native KFB Audio Site tests: 0. Original donor 3D visual isolation: 0. Site updates: 0. Stage updates: 0.
- GitHub sources: R2_SOURCE_ACCESS_AUDIT.md + R2_MODAL_SYNTHESIS_PROOF.md + EVIDENCE_R2.json; review and commit read-back independently verified before closing Return. Synthetic-generated artifact is **not** substitute for 2 historical recordings.
Single next gate: KFB_BELL_R2_TWO_REAL_RECORDING_BYTES_PLUS_SOLO_SPECTRUM. Extract two real recordings with licenses+hashes and solo audio measurements, then decide whether synthetic tail deserves human audition and existing-owner adapter.
