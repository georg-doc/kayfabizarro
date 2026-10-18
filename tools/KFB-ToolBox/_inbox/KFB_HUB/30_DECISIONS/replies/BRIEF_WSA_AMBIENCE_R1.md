# WS0 → WSA work · Environment sound and atmosphere per biome (non-repetitive, organic) · V-458 · 18.10.2026

**Georg:** birdsong (different species, changing, cozy), jungle, rain/lightning/thunder (timed with the weather, Tiny Skies as the basis), snow, wind (gusts, storm, breeze), water noise (river, beach, distant waterfall), crickets, frogs, wildlife. Loops must be **non-repetitive and organic**, and work **together with the songs/soundbed**. This matters for immersion and for the biome / card zone / diorama feel.

**Tier 0:**
1. **One module `kfb-ambience.v1`** (Audio owner, DOM-free like the footsteps consumer; WS1 integrates).
   - Uses the existing AudioContext. Five layers:
     - **Bed:** long beds of 30–90 s per biome, 2–3 variants, random start, long crossfades, slow volume drift.
     - **Events:** one-shot pools (bird species, frogs, single crickets, monkeys, distant animals), Poisson-scheduled with minimum gap, no immediate repeat, pitch ±3 %, placed in the room around the listener.
     - **Weather:** rain light ↔ heavy as a crossfade. **Thunder synced to the lightning flash**: flash first, sound delayed by distance / 343 m/s. Snow = muffled, quiet bed + low-pass on everything.
     - **Wind:** parameter 0–1, breeze → gusts → storm. The **same value** drives the visual wind module (plants, fluff, balloons; V-449), so picture and sound blow together.
     - **Water emitters:** positional (river, beach waves, distant waterfall) with distance attenuation + low-pass.
   - Times of day: morning birds, day, evening, night crickets/frogs.
2. **Mix with music:** the ambience bus ducks −4 to −6 dB under deck songs, the soundbed and dialogue (sidechain, soft). Set loudness targets against footsteps/vehicles. Ambience stays the base, never a wall.
3. **Sources in this order, each file with licence and sha in a licence register** (like the footsteps):
   1. Our own stock: `media/3D_Assets/Audio/Environment/` (ambient_wind, water_babbling_loop and more); `ElevenLabs Audio/` (Seamless heavy rain, light steady rain); the JukeBox ambient beds as music, not ambience.
   2. CC0 / free for commercial use: Freesound (filter CC0), OpenGameArt CC0, Kenney.
   3. Sonniss #GameAudioGDC bundles (royalty-free, commercial use without attribution). These are large downloads, so only via Georg.
   4. Gaps: ElevenLabs Sound Effects (Georg's plan, about 40 credits/s). Better for short events and cartoon-ish sounds than for long beds. Write a request list for WS0; WS0 generates.
   - The Tiny Skies files (`birds_chirp`, `crickets_loop`, `ocean_waves`, `rain`, `thunder_1–3`, `twister`) are **reference only**, licence unclear, do not ship.
   - Not allowed: BBC Sound Effects (non-commercial), anything with NC/ND.

**Biome presets R1:** cozy meadow, jungle, beach, forest/fir, pond (frogs), each by day and by night. Plus weather overlays: rain, thunderstorm, snow, storm.

**Gate:**
- Sound studio "ATMOSPHERE": biome selector, time of day, weather, wind slider, and the music on/off to test the ducking.
- 3 minutes per biome without a noticeable repeat (Georg's ear).
- Thunder matches the flash in the demo sky.
- Licence register complete.

**Report:** RETURN with the source list, the request list for ElevenLabs gaps, and the parameters (rates, ducking, levels).
