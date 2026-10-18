# WS0 → WSA work · Racer engine with gears + flight/hyperdrive into the sound studio (ElevenLabs SFX r1) · 18.10.2026

**Georg (ear check of the racer set):** "the rest is already cool", but "for the different gears and the upshift (and the rattling or banging when braking, etc.) we need better sounds/sequences, **as in the race demo we had**". The race demo is the donor `rwanda-f1-2026-sim` (MIT), engine LoopGrid in `vf26-audio.ts`, V-378. Take only the logic, with an MIT notice; no CarAudio.ts (GPL origin).

**Material** (Georg's own paid plan): branch `assets/kfb-elevenlabs-sfx-r1-2026-10-18`, folder `media/3D_Assets/Audio/KFB_ElevenLabs_SFX_r1/`.
- `racer_r1/`:
  - loops L1 idle, L2 low, L3 mid, L4 high, L5 overrun (6 s each);
  - one-shots O1 upshift, O2b/O2c backfire (O2 is silent, don't use it), O3 crackle series, O4 downshift blip, O5 boost;
  - **reference sequences** S1 acceleration through 3 gears, S2 braking with downshifts. Use these as the timing/feel target, not as loops.
- `flight_r1/`: F1 prop loop, F2 jet/antigrav loop, F3 wind loop, F4 takeoff.
- `hyperdrive_r1/`: H1 charge, H2 jump, H3 tunnel loop, H4 exit.

**Tier 0:**
1. **One engine, played through gears:**
   - Crossfade the RPM loops L1–L4 equal-power by RPM.
   - Within a band, pitch ±10 % so neighbouring bands meet. WS0 measured the f0 of the loops as inconsistent, so align them by ear and measurement.
   - 50 ms crossfade at every loop seam (L4 has a jump, L5 drops 7 dB at the end).
2. **Gear model:**
   - 4 gears with ratios; RPM from speed and gear.
   - **Upshift** at ~85 % of the limiter: 80–110 ms ignition cut (level dip + pitch drop), then the RPM falls into the next band.
   - At the shift a transient from O1 plus, about 60 % of the time, a pop (O2b/O2c, randomised, never twice the same in a row).
3. **Throttle off / braking:**
   - Overrun L5 plus randomised crackles (Poisson rate depends on RPM; O3 sliced into single pops).
   - On braking, downshifts with O4 blips.
   - Compare against S2.

**Also:**
- Limiter on the vehicle bus (several files hit full scale).
- Integrate flight/hyperdrive as sets in the sound studio: loops with crossfade, one-shots on events.
- Level against the footsteps (Foley/Digital) and the music.

**Gate:**
- Sound studio "RACER" with a speed slider and buttons for accelerate/brake, plus a 20 s demo run: idle → 3 upshifts → braking with crackles.
- Georg judges by ear.

**Report:** RETURN with the parameters (ratios, crossfade curves, rates) and load times.
