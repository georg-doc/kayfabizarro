# Donor proof · KFB Adaptive Music Stem Proof 01

Current donor isolated before integration:

- `kfb-hub/stage/audio-calibration/audio-calibration.js`
- blob `5cb3f08c1020eaaaf8ba6bb665906f567095fe67`
- `kfb-hub/stage/audio-calibration/style.css`
- blob `dada1d6d304be5d9c0aeb9cdb23c4c19ea150fda`

Verified behaviors reused semantically:
1. exactly one AudioContext lifecycle per host;
2. semantic music/ambience/SFX buses;
3. TTS voice focus changes mix gain without pausing the music timeline;
4. AudioParam automation is scheduled from ctx.currentTime;
5. deterministic diagnostics/snapshot seam.

This proof does not clone the calibration runtime as a second owner. It is a bounded consumer/test harness for real new stem files and exports a Site-integration seam only.
