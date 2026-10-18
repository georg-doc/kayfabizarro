# WS0 → WSA work (running audio chat) · Update: storage on GitHub, the three audio orders in order, sources · 18.10.2026

**Order** (one after another in this chat):
1. **Ambience per biome** (b114, V-458): the one you're working on now. Continue as planned.
2. **Racer engine with gears** (b113): LoopGrid like the race demo, upshift with ignition cut + bang, crackle on braking, flight/hyperdrive as sets.
3. **Sound design combat/destruction** (b115, V-461): layered events instead of "xylophone pling-plong".

**Material that's already there:** branch `assets/kfb-elevenlabs-sfx-r1-2026-10-18`, folder `media/3D_Assets/Audio/KFB_ElevenLabs_SFX_r1/`:
- `racer_r1/` loops + one-shots + reference sequences S1/S2 (O2 silent, use O2b/O2c instead);
- `flight_r1/`, `hyperdrive_r1/`;
- **`combat_r1/` + `combat_r1_norm/`**: 18 combat/destruction events × 3 variants, peak-normalised.

Georg has approved **up to 60,000 ElevenLabs credits** (about 7,200 used so far). Gaps as a request list to WS0 (event, layer, prompt, seconds, variants); WS0 generates.

**Storage on GitHub** (the main repo is public):
- **Public branches only:** CC0, our own work, ElevenLabs output from Georg's plan.
  - Folder per set: `media/3D_Assets/Audio/<Set>/`.
  - A licence register per set (`LICENCES.json`: file, source, licence, sha256).
  - Its own branch per delivery: `audio/<topic>-<date>`.
  - No main merge without Georg.
- **Not raw on public branches:**
  - Sonniss GDC (royalty-free, but no redistribution of unchanged files);
  - the 400 Sounds Pack (Chequered Ink, not CC0);
  - anything with NC/ND, or unclear.
  - These stay in Georg's Dropbox (`KFB_HUB/40_AUDIO/…`) and are referenced only by manifest (path + sha256). At runtime they go into the game only processed/bundled.
- **No new repo needed.** For private files, the game workstation fetches them via the claude.ai Dropbox connector (V-462). You put only manifests on GitHub, never raw files.
- Do **not** ship the Tiny Skies sounds (licence unclear; reference only).

**Common rules for all three orders:**
- One audio context.
- Buses: music / dialogue / ambience / vehicle / combat / UI. Ambience ducks −4 to −6 dB under music and dialogue, −6 dB under combat; combat −3 dB under dialogue; limiter on vehicle/combat.
- Wind parameter shared with the picture (V-449). Thunder synced to the lightning flash.
- Every event varies (layers, variants, pitch/volume jitter, no immediate repeat).
- Gate always through Georg's ear in the sound studio.
