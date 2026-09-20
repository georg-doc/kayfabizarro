# KFB Storytelling Maps · Visual / Motion System v1

Status: **CURRENT REUSE MAP + DESIGN CONTRACT**
Date: 2026-09-20
Owner: existing Storytelling Maps / Cartoon Map Board presentation layer

Purpose: define what must be reused before Claude Design touches the Storytelling Maps look.

## Prime rule

Apply `skills/session-entry-use-what-works_v1.md`.

If an existing KFB module already does the job, Claude Design must **show the donor output first and reuse it**.

No generic replacement sky.
No generic dissolve shader.
No generic card viewer.
No invented palette system.
No replacement ink.
No duplicate animation library.

## 1. Palette / color-world owner candidates

### Existing deterministic story-color source

`travel/travel-v16/terrain-v16/world-context.js`

Already provides:

- six KFB Story Modes;
- `STORY_PALETTES`;
- `hashStr`;
- `joinSeeds`;
- `mulberry32`;
- `paletteFromVector()`;
- deterministic card semantic vectors.

This is the preferred source for seed-stable Storytelling Maps color logic.

### Existing named palette source

`travel/travel-v16/terrain-v16/world-palettes.js`

Already provides:

- 8 named palettes;
- story-following palette;
- from-cards palette;
- rainbow mode;
- `resolvePalette()`.

### Rule

Storytelling Maps should consume/adapt these modules or a deliberately extracted shared seam after owner review.

Do not copy their hex/RGB numbers into a fresh "AI palette" file.

## 2. Card design / PDF owner

Current deck/card truth remains the existing KFB Viewer / CardBuilder line.

Relevant sources:

- `KFB Comic Card Deck Viewer v4 (WS0)/`
- `kfb-viewer.js` lineage documented in `docs/KFB_VIEWER_V1_DOKU.md`
- current v4 HOUSEKEEPING / RETURN for active/superseded distinctions
- CardBuilder / Card format / Ink owners already referenced by Storytelling Maps.

Viewer capabilities already documented:

- pdf.js render pipeline;
- Page/Card modes;
- progressive disclosure;
- crop/layout resolver;
- headless `loadDeck()`;
- Shadow DOM mounting.

### Rule

Storytelling Maps does not build its own PDF renderer.

It requests a rendered card/media surface from the existing Viewer/CardBuilder seam, then maps that surface into ResponsiveCardRig.

## 3. Living card / image motion donor

`KFB Comic Card Deck Viewer v4 (WS0)/KFB Living Illustration Lab.dc.html`
+
`kfb-living.js`

Evaluation already records:

- card-adaptive analysis;
- Boil;
- Ken Burns;
- card-specific visual treatments.

This is the first visual-motion donor to inspect for "living paper/card" behavior before inventing card animation.

## 4. Skydome owner candidate

Reuse:

`travel/travel-v16/terrain-v16/skydome-shader.js`

It already provides:

- procedural S / A variants;
- space;
- watercolor/static skyboxes;
- palette input;
- camera-following dome;
- controlled exposure/energy.

The module explicitly keeps card readability in mind.

### Rule

Storytelling Maps gets a compact adapter such as:

```text
StoryMapSky
→ setPalette(...)
→ setMode(...)
→ setVariant(...)
→ follow(camera)
```

Do not replace this with an arbitrary gradient/background shader.

## 5. Map draw / reveal / hide vocabulary

Storytelling Maps needs progressive disclosure tied to story beats.

The effect vocabulary should be built from existing donors.

### Existing sources to inspect first

- Boxel Blitz `fx-foundation`: `fx-pool.v1.js`, `dissolve.v1.js`
- Boxel Blitz ripple implementations
- Travel terrain ripple/fog systems
- Overworld documented paper/card flip, dissolve and ripple/wave treatments
- central `media/3D_Assets/FX_Visual/`

### Semantic effect families

**DRAW**
- border/route traced from an anchor;
- country/zone appears progressively;
- ink or paper edge leads the reveal.

**RIPPLE REVEAL**
- a local beat expands across map geometry;
- use for event propagation, not every click.

**DISSOLVE**
- zone or collage media disappears/reappears;
- preserve map-state semantics separately from presentation state.

**ASSEMBLE**
- regions slide / lift / lock into place;
- shadows and contact should sell physical board pieces.

**FOLD / RAISE**
- standee or card rises from map plane.

**PULLBACK / RESET**
- restore geographic readability after spectacle.

### Rule

Effects are triggered by semantic story cues:

```text
beat
→ cue
→ effect preset
→ recovery
```

No permanent "everything moves" state.

## 6. Map-piece physical grammar

Current Europe Map Board proves independent extruded pieces.

Next visual direction can add:

- draw-on border;
- progressive fill;
- physical assemble/disassemble;
- controlled explode/recombine;
- local lift;
- ripple-driven highlight;
- dissolve/hide.

But map geometry truth stays separate from presentation animation.

## 7. Prop motion / legless actor class

User direction:

- KayKit Media Standees;
- later pencil;
- eraser;
- other KFB prop characters;
- optional EyeRig;
- same broad motion vocabulary where technically compatible.

### Proven donor

Resident Atlas `Rig_Legacy`:

- 6 bones: Body, Head, armLeft, handSlotLeft, armRight, handSlotRight;
- 30 clips in one legacy GLB;
- no leg bones;
- existing `legacyAssemble()` attaches rigid source pieces to the animation skeleton.

This is highly relevant to a **legless prop actor class**.

### Important boundary

Do not claim that every standee/prop automatically supports all 30 clips.

A new `PropRigLegacyAdapter` must prove per prop:

- which bones are actually used;
- which clips remain visually meaningful;
- what geometry is rigidly attached to Body/Head/arms;
- where EyeRig lives;
- whether a procedural fallback is better.

### CapsuleCarl comparison

The existing Platformer actor adapter documents CapsuleCarl as:

- procedural;
- 0 bones;
- same semantic state vocabulary;
- breathing/hop/squash/jump/land/hit generated procedurally.

Therefore Storytelling Maps has two legitimate motion lanes:

```text
A · Rig_Legacy driven
B · procedural KFB motion
```

A prop chooses the proven lane; do not force one onto everything.

## 8. Shared PropActor candidate contract

```ts
type PropActorProfile = {
  id: string
  geometrySource: string
  motionClass: 'rig-legacy' | 'procedural'
  eyeRig?: EyeRigProfile
  attachments?: AttachmentProfile[]
  groundAnchor: string
  clips?: string[]
  proceduralStates?: string[]
}
```

Potential actors:

- responsive card standee;
- pencil;
- eraser;
- book;
- sign;
- dice-adjacent mascot props.

## 9. EyeRig

Use the existing EyeRig owner/tooling.

Do not paint generic googly eyes into a texture if a prop is intended to become an EyeRig actor.

The prop's face/eye sockets must be measured and registered like other actor adaptations.

## 10. Camera

Continue the Storytelling Maps semantic camera grammar already recorded:

- TABLE ESTABLISH
- MAP PUSH
- STANDEE CLOSE
- GUIDE TRACK
- IMPACT ORBIT
- TOP-DOWN RESET
- PULLBACK TRANSITION
- LULL HOLD

Responsive camera is part of the design, not a CSS afterthought.

## 11. Progressive disclosure

A story beat should control three scopes independently:

```text
GEOGRAPHY
what map pieces are visible

STORY OBJECTS
which cards/standees/props are raised

INFORMATION
which label/card detail/caption is disclosed
```

This enables:

- location first;
- event second;
- explanation third.

Do not reveal all labels/cards/data simultaneously.

## 12. Seed contract

One seed should be able to reproduce:

- palette selection;
- controlled palette variation;
- decorative scatter;
- reveal variant;
- optional camera micro-variation;
- non-semantic prop jitter.

Do **not** seed:

- source geography;
- factual labels;
- authored story order;
- card identity unless the game mode explicitly draws randomly.

## 13. "Every pixel pays rent"

Required hierarchy:

1. map/story action;
2. physical object;
3. camera composition;
4. only then UI.

Avoid:
- giant permanent panels;
- generic glassmorphism;
- arbitrary neon outlines;
- filler toolbars;
- badges that restate visible information.

## 14. WSA planning seam

Receiving game/WSA consumers should plan for Storytelling Maps to export **presentation actors**, not take ownership of consumer movement/physics.

Likely shared future seam:

```text
Storytelling Maps PropActor profile
→ consumer adapter
→ existing consumer movement/physics stays owner
```

The proposed PropRigLegacyAdapter should be coordinated with Resident Atlas / ToolBox rather than copied independently into each game.

## 15. Current implementation order

1. ResponsiveCardRig source-isolated geometry proof.
2. Media surface mapped to the responsive rounded card.
3. PropRigLegacyAdapter / procedural comparison on the card standee.
4. Story map reveal/assemble micro-scene.
5. Palette + skydome integration from existing donors.
6. Viewer/CardBuilder embed.
7. Odyssey cinematic proof.
8. only later broad editor integration.

No mega-build.
