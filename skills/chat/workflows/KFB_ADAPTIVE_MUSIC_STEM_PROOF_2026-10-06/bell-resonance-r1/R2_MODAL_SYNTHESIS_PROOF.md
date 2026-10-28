# Bell Modal R2 — Synthetic Acoustic Test, NOT historical data
Date 2026-10-28. Offline Python NumPy/SciPy renderer produced three **original synthetic** 48kHz stereo PCM16 WAVs, duration 14.000s each. The output bundle and generator + validator are attached to the current conversation; no binaries are imported into KFB GitHub or KFB Audio/Asset Registry.

## Three actual waveform objects
1. 01_MODAL_BELL_ISOLATED.wav: struck modal model with 5 main church-bell partials, 3 higher inharmonic partials, distinct attack/decay and split mode beating.
2. 02_IMPOSSIBLE_BELL_EGREGORE.wav: same model attack, deliberately added fictional stereo detuning/subharmonics and spectral glide.
3. 03_FICTIONAL_RUBBED_BOWL.wav: continuously excited fictional metallic bowl resonance, not real Tibetan singing-bowl evidence.

## Mode parameters / measured FFT peaks (all SYNTHETIC)
| Mode | Authored Hz | Relative amplitude | e-fold tau seconds | Measured from model WAV Hz |
|---|---:|---:|---:|---:|
| hum | 100 | 0.25 | 10.5 | 99.98 |
| prime | 200 | 0.40 | 7.0 | 200.04 |
| tierce | 239.8 | 0.27 | 5.8 | 239.87 |
| quint | 300.7 | 0.15 | 3.5 | 300.66 |
| nominal | 401.2 | 0.32 | 2.8 | 401.18 |
| high 1 | 528.6 | 0.16 | 1.1 | 528.63 |
| high 2 | 684.2 | 0.12 | 0.9 | 684.17 |
| high 3 | 1051 | 0.13 | 0.45 | 1051.03 |
The ratios originate from idealized campanology conventions, not from historic recordings. The FFT uses a Hann-windowed section 1.4–6.4s after start, zero-padded 524288-point transform. There is no claim that musical "432 Hz" or Schumann frequency is the bell's measured pitch.

## Actual tests
Independent local validator: **18/18 PASS** on output file format (3), 14s duration (3), peak <-5 dBFS (3), SHA256 match (3), mode peaks (1), Egregore difference with shared pre-roll (1), long bell decay (1), bowl sustained (1), nonidentical stereo channels (1), truthful synthetic identity (1). Initial 17/18 failure was an overlong pre-roll test window (first 1s even though 0.8s attack); corrected to first 0.75s, rerun full 18/18. This checks numeric waveform content, **not** browser playback or human ear acceptance.
Measured local peaks: modal bell -6.38 dBFS; Egregore -6.41 dBFS; bowl -11.97 dBFS. See EVIDENCE_R2.json for hashes and actual FFT. Synthetic spectrogram/FFT plot were created and inspected; true real bell recordings and any acoustic-room measurements remain 0.

## Reuse mapping
These original synthetic objects can act as independent **design audition sources only**. Do not create a second AudioContext/mixer/Jukebox. Future WS0 takes the chosen source through the existing one-owner audio graph; show the isolated physical/visual donor before placement. Visuals can map hum/prime/tierce/quint/nominal envelopes into concrete bell or architectural deformation, use beating for paired halos, and silence as dramaturgy. The archival-source gate is still OPEN.
