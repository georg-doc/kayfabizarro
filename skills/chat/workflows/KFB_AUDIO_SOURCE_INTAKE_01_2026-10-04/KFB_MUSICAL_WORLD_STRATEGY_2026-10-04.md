# KFB MUSICAL WORLD · DJ / PRODUCER / GAME AUDIO STRATEGY · 2026-10-04

**Status:** DIRECTION_ACCEPTED · IMPLEMENTATION PLANNING  
**Owner:** KFB Audio & Soundscape Baseline v1

## Product idea

The KFB world is not merely accompanied by music. It behaves like a musical toy.

A player's place, motion, weather, social context, Residents and activity continuously reshape the musical presentation. Physical SFX remain readable, but the emotional world is carried mainly by music and musically useful textures.

This differs from a conventional cartoon/arcade approach where music is a backdrop and SFX carry most moment-to-moment personality.

## Three-layer musical world

### 1. Physical reality
Rain, tyres, engine, footsteps, crowd, impacts, wind and local props.

- spatial / diegetic where appropriate;
- free-running;
- follows physical/game truth;
- never forced onto the musical grid merely to sound synchronized.

### 2. Ambient musical world
Biome / deck / time / weather / local identity.

- long-listenable;
- low-drive;
- sparse motifs and texture;
- carries chill / fun / cozy / wonder;
- can slowly evolve with weather, time and nearby Residents.

### 3. Activity / performance music
Driving, racing, disco, combat, event entrances, Resident performances.

- higher motion and rhythm;
- stronger hooks;
- can take over from Ambient Beds without sounding like a hard playlist switch.

## The game as live DJ

Runtime should expose a small musical state vector:

- `biome`
- `worldTheme` / deck family
- `motion` 0..1
- `danger` 0..1
- `social` 0..1
- `weatherIntensity` 0..1
- `timeOfDay`
- `event`
- `residentSignature`
- `voiceFocus`

The music controller maps that state to tracks and transitions. It does not write gameplay truth.

### DJ transition rules

1. **Phrase first.** Change musical state on sensible 4/8/16-bar boundaries when possible.
2. **Harmonic compatibility first.** Key/mode-compatible tracks may overlap longer.
3. **Tempo compatibility second.** Similar BPM can beat/phrase mix; very different BPM should use an ambience tail, low-pass bridge, riser-free transition texture or short stinger.
4. **Do not arbitrarily cross-mix pitched stems from unrelated songs.**
5. **Ambience is glue.** Physical world beds continue across musical changes, preventing silence or hard cuts.
6. **Contrast matters.** Action feels bigger after quieter music; silence/near-silence is a valid musical state.
7. **Diegetic sources may enter the score.** A Resident band, radio or disco can gradually become foreground music and recede again.

## Composition / asset authoring requirements

Every master should eventually be annotated with:

- BPM if known;
- key / mode when useful;
- energy 0..1;
- tension 0..1;
- activity role;
- compatible biome/deck;
- intro-safe cue;
- outro-safe cue;
- phrase size;
- loopability;
- stem availability / certification;
- transition tags: `hard-cut-safe | tail-safe | phrase-mix | bridge-needed`.

This metadata matters more to runtime mixing than a giant procedural synthesizer.

## Suno Custom Model plan

Use **one** model slot for this project and preserve the other two.

Working title: **KFB World**.

Do not train it on the whole catalog. Start with a coherent set of roughly 8–10 masters and keep 2–3 good tracks out as evaluation references.

### First training candidate set

Core Ambient identity:
- Utopia Ambient Bed
- Dystopia Ambient Bed
- Protopia Ambient Bed
- Rainy Graveyard · small-room jazz experiment

Color / texture donors:
- Cyclical Warmth
- Dorian Rests
- Lush Break 3min
- Warm Tape Saturation
- Wet Neon Road · cosmic surf experiment

Optional tenth only if the first test feels too restrained:
- Rain percussion · Beetle / Ring

Do **not** initially train on the strongest disco/combat/ring pieces. Those can be generated from the World model using stronger prompts/references, or later justify a separate model only if clearly needed.

### Holdout evaluation

Keep several tracks out of training and use them to judge whether the model has learned the common language rather than memorized one sub-style.

Suggested holdouts:
- Small-Room Groove
- Neo Surf Trip 3min
- Workshop machine pulse · Beetle / Maker Space

Generate the same small evaluation matrix before and after model training:
- quiet idyllic biome;
- uneasy nighttime biome;
- rainy road;
- playful workshop;
- higher-motion drive;
- social/disco lift.

Pass criterion: recognizable family resemblance without every output collapsing into the same instrumentation or tempo.

## Training / generation workflow

1. Curate training masters.
2. Train one Custom Model.
3. Keep prompts short and acoustic; never use unexplained internal project language.
4. Generate two alternatives per brief.
5. Human-select one master.
6. Only then acquire/download stems if that track is likely to enter adaptive mixing.
7. Annotate the accepted master in the Jukebox.
8. Add transition metadata after listening, not by filename inference.

## Research anchors

- Suno Custom Models: minimum six owned tracks; up to three private models; v6 supports Custom Models.
- Wwise interactive music: States, Music Switch Containers, transition rules, transition segments and stingers.
- World of Warcraft: large numbers of individual cues, extensive ambient music, carefully crafted segues; ambience persists while music emerges from it and recedes back.
- No Man's Sky: custom generative music system deeply coupled to game logic while preserving the band's musical identity.
- Untitled Goose Game: high/low-energy performances segmented so gameplay can choose intensity or silence while preserving musical continuity.

## Next implementation sequence

1. Pull the free unlocked stems for the three Ambient Bed winners.
2. Update the existing KFB Audio Site to the current catalog.
3. Add musical metadata / transition annotation to a small representative subset, not the whole library.
4. Prototype one adaptive scene: **Explore → Drive → Event/Disco → Explore**.
5. Only after that prototype feels musical, train the single KFB World Custom Model and compare it against the same evaluation prompts.


## Pool design before model training

Do not optimize the future Custom Model around the current funk/surf/rockabilly bias.

The 130-deck corpus spans medicine, politics, philosophy, metaphysics, conspiracy, science-fiction, fairy tale, psychology, creativity, history, comedy and more. The musical pool therefore needs **shared grammar with broad stylistic zones**, not one dominant genre.

### Shared grammar across zones

Keep these more stable than genre:
- warm, human, slightly handmade production;
- memorable but not overbearing motifs;
- clear phrase structure for game transitions;
- negative space for dialogue/SFX;
- tonal/modal colors that can crossfade cleanly;
- moderate dynamic range, no constant maximal loudness;
- versions that tolerate reduction to ambient layers;
- optional stems for later adaptive use.

### Style zones to deliberately seed

1. **Soul / R&B / Neo-Soul** — warm Rhodes, pocket drums, bass, subtle guitar, humane emotional center.
2. **Piano / Chamber / Minimal** — felt piano, strings, woodwinds, small ensemble, reflective/philosophical/medical use.
3. **Cinematic / Epic-but-playable** — broad harmony, restrained percussion, wonder/adventure, never trailer-wall by default.
4. **Cartoon Chase / Capers** — pizzicato, brushed/snappy percussion, clarinet/brass accents, playful motion without slapstick overload.
5. **Folk / Acoustic / Storybook** — acoustic guitar, hand percussion, fiddle/woodwinds, family/fairy-tale/travel warmth.
6. **Dreamy / Metaphysical / Cosmic** — pads, processed piano/guitar, subtle pulse, spacious harmonic ambiguity.
7. **Jazz / Lounge / Noir** — small-room jazz, muted brass/woodwinds, brushes, urban/night/philosophy.
8. **Funk / Surf / Rockabilly / Groove** — retain current strength for driving, ring, disco and mischievous energy.
9. **Minimal Electronic / Systems** — restrained synth pulses and texture for AI, science, technology, data and abstract decks.

The training set should cover several zones but remain coherent through the shared grammar. If one genre appears in more than roughly a quarter of the initial training set, check for bias.


## Palette expansion complete · model training already submitted

Georg accepted the six deliberately broad palette masters: Soul/R&B, Piano/Chamber, Cinematic, Cartoon Chase, Folk/Storybook and Metaphysical/Cosmic.

This means the obvious style-zone gap is currently **not** another genre. The useful next question is whether the trained model preserves differentiation across these zones.

One possible future gap remains **Minimal Electronic / Systems**, but do not generate it yet unless model evaluation shows that AI/science/technology/data themes lack a convincing neutral electronic language. Existing synth/road/system-oriented tracks may already cover it.

### Prompt format convention

Future Suno Style prompts should be delivered as one paste-ready block:

`BPM: <value/range>. <short direction>. <style prompt>`

No separate metadata lines that the user has to manually recombine.

### Custom Model evaluation before further palette growth

When the trained model becomes available, test the same model with short prompts for:
1. Soul / humane warmth
2. Piano / reflective chamber
3. Cinematic wonder
4. Cartoon chase
5. Folk / storybook
6. Cosmic / metaphysical
7. Road / higher motion
8. Quiet ambient biome

If outputs retain clear differentiation while sharing production family resemblance, stop expanding the training pool. If one or more zones collapse toward the dominant funk/surf/groove language, correct that specific gap rather than adding random genres.
