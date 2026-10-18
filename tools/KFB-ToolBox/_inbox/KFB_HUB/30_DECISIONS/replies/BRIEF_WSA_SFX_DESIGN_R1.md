# WS0 → WSA work · KFB sound design R1: combat, destruction, flight, hyperdrive (immersive instead of "xylophone pling-plong") · V-461 · 18.10.2026

**Georg:** the last combat-arena attempts were "very disappointing": only the first matching tones were played superficially, "xylophone pling-plong", nothing immersive. Everything should be considered together: research in public repos and in our GitHub, plus the missing sound pads (time- or event-driven) generated to fit exactly via ElevenLabs. Georg has credits and wants to invest in this, where there are no good public or procedural browser sound layers.

**Already there (WS0, 18.10.):** `combat_r1`, 18 events × 3 variants, peak-normalised WAVs (`combat_r1_norm/`):
- punch light/heavy, brass knuckles, swing whoosh, blaster, rocket, fuse, explosion small/large, hit confirmation;
- fluff burst, tree shake;
- bot angry/collapse;
- wood splinter, stone crumble, crystal shatter, domino chain.

Branch `assets/kfb-elevenlabs-sfx-r1-2026-10-18`. Take them in as the first layers. The request list only needs what is still missing.
**Budget:** Georg has approved up to 60,000 ElevenLabs credits for sound design.

**Tier 0:**
1. **Each event = layers, not a single file:** transient (attack) + body + tail/debris, each with 3–4 variants. Combine them randomly at runtime, pitch ±4 %, volume ±2 dB, never the same combination twice in a row. Distance → low-pass + quieter; room/biome → a short reverb send (ambience module V-458).
2. **Character:** cartoon clay world: punchy, warm, squishy-material, comedic but **physical** (thud, crunch, whoosh, debris). **No** retro arcade/chiptune/xylophone tones for hits and destruction. Arcade packs at most for UI.
3. **Sources in this order, everything in the licence register:**
   1. Stock on GitHub: kenney_impact-sounds, kenney_sci-fi, S050C-ArcadeShooter, Classic Arcade SFX (check: only what is physical; arcade bleeps are out), ElevenLabs SFX r1 (racer/flight/hyperdrive).
   2. CC0/free: Freesound CC0, OpenGameArt CC0, Sonniss GDC bundles (via Georg).
   3. **Procedural in the browser only for continuous sounds:** whooshes, wind, engine sweeps via Web Audio noise/filters. ZzFX/sfxr only for UI (they sound arcadey).
   4. Gaps → a request list for WS0 (prompt, length, variant count); WS0 generates via ElevenLabs.

**Event table R1** (fill it, mark per event which source covers which layer):
- **Combat:**
  - fist punch light/medium/heavy on clay / bot / tree;
  - brass knuckles (metallic accent);
  - swing whoosh;
  - blaster primary (shot with body, not "pew"), secondary rocket launch + flight loop + impact;
  - bomb: fuse loop, throw, explosion small/medium/large with debris tail;
  - hit confirmation (thud + squish);
  - block/shield;
  - bot: alert, angry (aggro), hurt, collapse (clank-crunch).
- **Destruction:**
  - fluff ball bursts (squishy pop + scattering balls);
  - tree shakes (leaf rustle, fruit falling);
  - wood crack/splinter, stone crumble, metal clang/bend, cartoon glass;
  - debris settling;
  - domino topple (single clack + chain rhythm);
  - **crystal chess piece shatters** (gem shards, V-460);
  - impact on clay ground.
- **Flight / hyperdrive:** ElevenLabs r1 exists. Integrate as sets (crossfade, events) and add whatever is missing (e.g. landing, turbulence, boost).
- **"Destruction POC":** go through the WS1/combat arena events and assign every trigger an event from this table.

**Mix:** vehicle and combat bus with a limiter; under music/dialogue duck −3 dB (combat stays present); ambience under combat −6 dB.

**Gate:**
- Sound studio "COMBAT" with an event board: every event 10× in a row → no audible repetition.
- 30 s fight demo (punch, blaster, bomb, tree, bot angry and collapsing).
- Georg judges by ear.

**Report:**
- event table with source/layer/licence;
- **request list for ElevenLabs**: event, layer, prompt, seconds, variants;
- estimated credits (~40/s).
