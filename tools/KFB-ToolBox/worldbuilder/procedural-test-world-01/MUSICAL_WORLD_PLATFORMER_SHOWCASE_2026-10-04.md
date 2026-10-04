# KFB WB2 · Musical World / Platformer Audio Showcase · 2026-10-04

**Status:** IMPLEMENTED · TOWN AUDIO BASELINE BROWSER PASS · FULL SHOWCASE UNPROVEN · CANDIDATE FROZEN  
**Execution mode:** ONE_SHOT internal integration · no new Georg-facing micro-gate  
**Receiving owner:** KFB WorldBuilder / WB2 · Draft PR #348  
**Audio source owner:** KFB Audio & Soundscape Baseline v1 · Draft PR #352  
**Product idea:** the world behaves like a musical toy.

## Plain product outcome

The One-Shot should audibly prove one continuous musical-world loop:

**Explore → Platformer / movement lift → Drive → Event / Disco → Explore**

The player should feel that the same world is being live-mixed around them, not that unrelated songs are being started and stopped.

This is not a second music player and not a procedural-synth replacement project.

## Source locks

### Audio catalog / strategy source

Read from Audio PR #352:

- branch: `chatgpt-web/kfb-audio-source-intake-01-2026-10-04`
- current handoff head: `137735599a4747a373c3f978799880ef2b1c45d5`
- tested product head: `304bcca1bcf7be1b296b5428b58ef5313c155197`
- catalog: **69 masters / 59 RoadTrip-v2 / 29 stem families**
- strategy: `skills/chat/workflows/KFB_AUDIO_SOURCE_INTAKE_01_2026-10-04/KFB_MUSICAL_WORLD_STRATEGY_2026-10-04.md`

Protected audio rules:
- one existing consumer AudioContext / Jukebox owner;
- master = Ground Truth;
- voice ducks music/ambience without stopping the timeline;
- physical SFX remain readable;
- audio never writes gameplay truth;
- no arbitrary pitched cross-song stem mixing;
- separator stem labels are not semantic truth.

### Platformer / reachability donors

Mechanism donors only:
- Free-Roam Platformer POC: Chill assist, measured jump/air/land semantics and movement-config concepts;
- Babel Tower S2b / Hex Platform Generator brief: reachable height bands, direct vs double-jump classes, platform-band graph;
- current WB2 Ground/Player remains the receiving movement owner.

Do **not** mount a second movement loop or copy old Platformer composition/runtime wholesale.

## Three audio layers

### L0 · Physical world
Examples:
- wind / rain / tyres / engine / footsteps / impacts / crowd / prop sound;
- free-running or event-driven;
- spatial/diegetic where appropriate;
- follows real world/game state;
- does not restart or quantize merely because the music changes.

### L1 · Ambient musical world
Low-drive world identity:
- Town / general living-toy;
- Dystopia;
- Utopia;
- Protopia;
- time/weather/local Resident influence.

Primary current palette:
- `Folk / Acoustic / Storybook Bed`
- `Soul / R&B Ambient Bed`
- `Dystopia Ambient Bed`
- `Utopia Ambient Bed`
- `Protopia Ambient Bed`
- `Metaphysical / Cosmic Ambient Bed`
- `Piano / Chamber Minimal Bed`
- `Cinematic / Epic-but-Playable Bed`

### L2 · Activity / performance music
Higher movement / event energy:
- `Wet Neon Road · cosmic surf experiment`
- `Wet road rhythmic texture · Road radio`
- `Cartoon Chase / Capers Bed`
- `Workshop machine pulse · Beetle / Maker Space`
- Golden Journey Dystopia party: `Demon Lord Afro-Strut 01`
- other Jukebox masters remain eligible by context.

### L3 · Signature / transition accents
Short non-owner accents:
- Resident/event stinger;
- Card pickup / quest handoff accent;
- landing / jump / vehicle start physical one-shot;
- optional ambience bridge.

Stingers do not replace the current SFX owner.

## Runtime state vector

The existing game/world publishes state; audio consumes it:

- `biome`
- `deckFamily`
- `motion` 0..1
- `verticality` / platform band
- `airborne` / landing event
- `drive`
- `danger` 0..1
- `social` 0..1
- `weatherIntensity` 0..1
- `timeOfDay`
- `event`
- `residentSignature`
- `voiceFocus`
- optional `activeCardRef`

No audio state may change movement, quest or world truth.

## Mixing / DJ rules

1. **Do not restart music on every state tick.**
2. **Meaningful zones, not every tile/jump.** Platform bands / biome regions / event zones change music; each jump only gets physical/SFX feedback unless it crosses a semantic zone.
3. **Phrase-aware handoff.** When BPM/phrasing is known, schedule 4/8/16-bar transitions.
4. **Compatible BPM/key:** longer master crossfade is allowed.
5. **Incompatible music:** tail / ambience / short bridge / stinger, then next master. Do not force a bad beatmatch.
6. **Physical ambience is glue.** It continues across musical changes.
7. **Voice Focus:** reuse current audio ducking semantics; timeline continues.
8. **Silence / near-silence is valid.** Do not fill every second.
9. **No cross-song pitched stem soup.**
10. **Same-family stems only after listening certification.** Current 29 stem families are source inventory; Cyclical Warmth remains the known certified adaptive donor unless another family is explicitly certified.

## MVP Slice 1 · One-Shot showcase

This is the first audible proof and belongs inside the existing Golden Journey, not in a separate debug page.

### Beat A · Town Explore

Player enters/free-roams Town.

Target:
- physical Town ambience;
- low-drive musical bed, selected from Folk/Storybook or Soul/R&B family;
- no constant percussion pressure;
- voice interaction ducks, does not stop, the bed.

### Beat B · Platformer / movement lift

Use one short authored traversal/assist passage if the current One-Shot movement owner exposes the required jump/assist state.

Music behavior:
- stay in same world identity;
- motion/verticality may raise energy by selecting a higher-energy compatible master at a phrase boundary;
- `Cartoon Chase / Capers` is a candidate only when traversal becomes genuinely playful/fast;
- jump and landing do not restart music;
- landing gets readable physical feedback.

If the One-Shot current movement owner does not yet expose a safe Jump/Assist seam, do not add a second Platformer controller. Keep the musical movement proof on run/drive and consume this exact contract when Jump enters the same owner.

### Beat C · Drive

On taxi/vehicle transition:
- engine/tyre SFX remain physical;
- music transitions from Ambient to Road/Movement;
- preferred current donors: Wet Neon Road / Wet road rhythmic texture;
- enter on phrase boundary where practical;
- leaving vehicle returns toward world ambience without a hard song reset.

### Beat D · Dystopia world + party

Approaching Dystopia:
- physical ambience persists;
- road music hands off to `Dystopia Ambient Bed`;
- reaching the party promotes `Demon Lord Afro-Strut 01` / Resident Disco performance;
- social/event state may temporarily dominate the score;
- after the party the system must demonstrably return to the Dystopia ambient world.

### Beat E · Utopia / Protopia

Golden Journey world change:
- Utopia → `Utopia Ambient Bed` family;
- Protopia → `Protopia Ambient Bed` family;
- Lorekeeper/deep reflective moment may bias toward Metaphysical/Cosmic or Piano/Chamber without making a separate dialogue audio engine.

### Beat F · Card / deck musical continuity

For the three MVP future decks:
- Dystopia / Utopia / Protopia world identity already maps to the corresponding deck semantics.
- Card transfer may trigger a short accent or bias the next musical selection.
- Do not attempt per-Card full song generation in Slice 1.
- Lean Memory may store a compact music receipt: track id + biome/deck/event/seed/unlock.

## MVP Slice 2 · Hex/Babel musical platformer

This extends the same system after Slice 1 proves the runtime seam.

The level/platform generator owns geometry. Audio only consumes semantic bands.

Each generated 8–14-step route may annotate:
- `musicZoneId`
- `energyBand`
- `deckFamily`
- `transitionClass`
- optional `signatureAccent`

Suggested band grammar:
- start / low band → ambient;
- rising traversal → pulse or light rhythmic bed;
- high/fast band → Chase / Road / Cinematic lift;
- rest platform → reduced ambient;
- goal / observatory → Cinematic or Metaphysical reveal.

### Moshpit junctions

A Card/deck crossover may intentionally juxtapose styles.

Safe MVP behavior:
- sequential phrase-aware handoff;
- shared physical ambience;
- short non-pitched bridge / percussion / stinger;
- choose a compatible master from the second deck/style family.

Not safe by default:
- pitched stems from unrelated songs layered together;
- arbitrary tempo-stretched mashups;
- automatic harmony inference presented as certified.

## Showcase acceptance

The integrated One-Shot should make these audible without opening an audio debug tool:

1. Town has a low-drive musical identity.
2. Moving faster / platform traversal changes energy without restarting on every jump.
3. Entering Drive promotes a road/movement layer while engine/tyres remain readable.
4. Crossing into Dystopia changes world music coherently.
5. Party/Disco visibly and audibly takes over.
6. Leaving the party returns to the Dystopia ambient bed.
7. Utopia and Protopia have distinct accepted ambient identities.
8. TTS/dialogue ducks music and then restores it.
9. No obvious overlapping two-song cacophony.
10. Save/reload reconstructs a valid current musical state from world/event/unlock data.
11. One audio owner / one Jukebox path / no duplicate AudioContext.
12. No console/page errors attributable to audio.

## Internal evidence

Add to the deterministic One-Shot evidence log:
- current/target track ids;
- reason for transition;
- state vector snapshot;
- transition class;
- scheduled/actual transition time;
- active physical ambience ids;
- voice duck state;
- audio owner identity.

This log is internal evidence, not a Georg-facing mixer dashboard.

## Product boundary

This showcase proves the **system concept**, not final mastering.

Do not block the One-Shot on:
- perfect key detection for all 69 masters;
- certification of all 29 stem families;
- full 130-deck audio mapping;
- generative Custom Model runtime;
- exact per-raindrop beat synchronization.

Those become additive after the first musical-world loop feels good in gameplay.

## Next executor

**WSA / Codex One-Shot integrator on PR #348** consumes this as an internal presentation seam while continuing the existing recovery/completion run.

Georg does not need a new setup action before the integrated candidate exists.


## 2026-10-04 freeze evidence

Canonical69-master consumer, shared physical ambience and Town playback are implemented and browser-proven. Entire Explore/Drive/Party/world-transition sequence and actual full concert/dance are not proven; latest Golden stops before Taxi entry. Preserve the implemented module; do not misread the original PREPARED plan as current implementation truth or infer a full musical/whole-game PASS. Resume via `FAILURE_RECOVERY_2026-10-04.json` only.
