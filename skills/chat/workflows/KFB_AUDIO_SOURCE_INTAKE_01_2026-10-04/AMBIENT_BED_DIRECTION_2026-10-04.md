# KFB Audio · Ambient Bed Direction · 2026-10-04

**Status:** DIRECTION_ACCEPTED · PROMPT AUTHORING NEXT  
**Owner:** KFB Audio & Soundscape Baseline v1

## Product direction

KFB audio should use three cooperating layers rather than forcing literal SFX to carry the whole atmosphere:

1. **Physical soundscape**
   - rain drops, wind, tyres, engine, crowd, water, impacts;
   - free-running / spatial / event-driven;
   - supports visual truth, including rain particles and screen droplets;
   - does not need to be beat-synced to music.

2. **Ambient musical bed**
   - low-drive instrumental score / texture;
   - cozy, idyllic or uncanny depending on biome/world state;
   - slower energy than road/radio songs;
   - phrase-aware fades and DJ-style transition logic;
   - may use weather/material cues as musical texture, but is not a literal weather recording.

3. **Jukebox / movement music**
   - more rhythmic / memorable / forward-moving;
   - road, radio, action, performance and event use;
   - masters remain Ground Truth; stems remain source-only until certified.

## Deck semantic sources for first MVP ambient families

Canonical JSONs on main:

### Utopia / Forget Utopia
`media/kfb/Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json`

56 Cards. Semantic tone examples:
- polished promise;
- finished-city sheen;
- rescue/future seduction;
- hollow perfection / distance from the present.

### Dystopia / Ignore Dystopia
`media/kfb/Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json`

56 Cards. Semantic tone examples:
- permanent countdown;
- catastrophe always approaching;
- frozen spectatorship;
- bureaucratic / media dread.

### Protopia / Embrace Protopia
`media/kfb/Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json`

56 Cards. Semantic tone examples:
- open notebook;
- erasable line;
- imperfect first draft;
- incremental action / playful readiness.

These JSONs are semantic inspiration only. They are not external-generator prompt text.

## External-model anti-pattern

Never send unexplained internal project language to Suno, ElevenLabs or another external model.

Forbidden as unexpanded prompt content:
- `KFB`;
- internal deck IDs such as `forget_utopia`;
- module/owner/workflow names;
- internal lore references that do not describe an audible result.

Translate internal context into explicit musical/acoustic facts:
- tempo / energy;
- tonal/modal color;
- instrument family;
- density / negative space;
- room/space;
- transient/decay character;
- rhythm regularity;
- emotional tension;
- environmental texture.

Avoid ambiguous words when they may be interpreted as unrelated sounds. For example, specify “single close thunderclap with low rolling tail” rather than an underspecified “crack”.

## Transition direction

- ordinary physical weather layers free-run;
- Ambient Beds crossfade phrase-aware, preferably over 4/8/16-bar windows when musical;
- road/action masters may DJ-transition into/out of Ambient Beds;
- synchronized Suno texture experiments may bridge the two layers;
- do not force rain-screen animation or individual raindrop events onto the music clock.

## Current positive donor family

The current experimental Suno families are useful style/mixing donors:
- Rain percussion · Beetle / Ring · 107 BPM
- Rainy Graveyard · small-room jazz experiment · 89 BPM
- Stormfront Ring · rockabilly electro-funk experiment · 120 BPM
- Wet Neon Road · cosmic surf experiment · 104 BPM
- Wet road rhythmic texture · Road radio · 105 BPM
- Workshop machine pulse · Beetle / Maker Space · 119 BPM

All stems remain `source-only`.

## Next authoring step

After the existing Site candidate is updated, create three first-pass Ambient Bed prompts from the canonical Utopia / Dystopia / Protopia JSONs.

Target: long-listenable, low-fatigue, low-drive masters that can sit under biome exploration and blend into Jukebox/road music.
