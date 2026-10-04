# KFB AUDIO CUSTOM MODEL EVAL 01

**Status:** READY_FOR_HUMAN_GENERATION  
**Model:** Georg's freshly trained Suno Custom Model  
**Purpose:** diagnose breadth, family resemblance and unwanted genre collapse before more training/input expansion.

## Test protocol

Generate **one pair per prompt**. Do not download stems for evaluation outputs. Only unlock/download a result if it is independently useful as a production master.

Score informally:
1. style match;
2. shared-world identity;
3. unwanted funk/surf/groove bias;
4. long-listen fatigue;
5. game-transition usefulness.

## Fixed prompts

### 1 · Quiet Biome
BPM: 68. Quiet, sunlit, restorative. Instrumental ambient exploration bed with soft piano, gentle acoustic guitar, warm analog pads, sparse woodwinds and almost weightless percussion. Slow breathing harmony, small memorable motif, lots of negative space and natural human timing. Cozy without becoming sentimental. No vocals, no funk groove, no EDM, no big climax.

### 2 · Humane Soul
BPM: 78. Warm, social, grounded. Instrumental neo-soul world bed with Rhodes, rounded bass, soft pocket drums, muted clean guitar and restrained analog textures. Intimate and welcoming, with rich chords and a relaxed pulse that supports conversation and wandering rather than dancing. No vocals, no slap bass, no showy funk, no EDM.

### 3 · Reflective Chamber
BPM: 66. Thoughtful, intimate, clear-minded. Instrumental chamber ambient bed led by felt piano, warm strings and soft clarinet or woodwind. Simple motifs evolve slowly with natural pauses and restrained emotion. Suitable for philosophy, medicine, memory or quiet discovery. No vocals, no trailer orchestra, no busy percussion, no sentimental swell.

### 4 · Cinematic Wonder
BPM: 84. Expansive, curious, adventurous. Instrumental exploration score with piano, warm strings, restrained brass, subtle low percussion and airy synth atmosphere. Broad harmony and patient melodic fragments suggest scale and discovery without becoming bombastic. No vocals, no trailer booms, no massive drums, no victory ending.

### 5 · Cartoon Chase
BPM: 124. Agile, mischievous, playful. Instrumental caper music with pizzicato strings, clarinet, muted brass, upright bass and crisp light percussion. Short motifs bounce between instruments with quick stops, elastic phrasing and forward motion. Cartoon energy without childish slapstick. No vocals, no circus music, no comedy honks, no EDM.

### 6 · Folk Storybook
BPM: 86. Warm, timeless, welcoming. Instrumental acoustic world bed with guitar, fiddle, upright bass, gentle hand percussion and occasional woodwind. Human timing, simple melodic storytelling and warm room ambience. Suitable for family, travel, history and fairy-tale spaces without sounding twee. No vocals, no festival stomp, no ukulele cliché.

### 7 · Cosmic Metaphysical
BPM: 70. Spacious, strange, contemplative. Instrumental cosmic ambient bed with soft analog pads, processed piano, distant guitar harmonics, low warm drones and a barely-there pulse. Slowly shifting harmony and fragments of melody feel mysterious but comforting. No vocals, no sci-fi effects, no horror drone, no EDM, no cinematic climax.

### 8 · Musical Moshpit / Road Transition
BPM: 104. Eclectic, coherent, forward-moving. Instrumental game-world crossover that begins as warm ambient exploration and gradually gains road energy: Rhodes, acoustic textures, muted guitar, analog pulse, rounded bass, restrained drums and occasional playful brass or woodwind. Blend contrasting colors into one flowing arrangement rather than a genre mashup. No vocals, no dominant funk riff, no EDM drop, no trailer climax.

## Readout

A good model should make these clearly different while still feeling as if they belong to one world.

FAIL pattern:
- most prompts collapse into the same groove/instrumentation;
- every track becomes funk/surf;
- quiet prompts become overproduced;
- action prompts lose melodic identity;
- all outputs share the same tempo/arrangement shape.

PASS pattern:
- style zones remain recognizable;
- production/family resemblance survives;
- quiet vs motion contrast is strong;
- outputs leave space for game SFX/dialogue;
- crossfade/transition opportunities are obvious.

## Next owner

Georg generates/listens. Then ChatGPT / Audio Site compares the returned results and decides whether any targeted palette correction is needed before game integration.
