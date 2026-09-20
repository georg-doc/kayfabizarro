# KFB Storytelling Maps v1 · Living Masterplan

Status: **EXPERIMENTAL LIVING DOCUMENT**
Date: 2026-09-20
Owner: KFB Cartoon Map Board presentation/story layer
Implementation home: `tools/kfb-cartoon-map-board/`
Public baseline: `https://kayfabizarro.pages.dev/kfb-hub/stage/cartoon-map-board-p02/`

This document is additive. Decisions, implementation and tested results remain separate.

## 1. North Star

Build one reusable KFB storytelling-map system that can act as:

1. **world / zone map** inside KFB games;
2. **tactical board** with physical game pieces, standees and dice;
3. **cinematic story-map player** for short narrated sequences;
4. **cut-scene module** embedded in games;
5. **authoring/editor tool** that creates the same runtime manifests.

The map is a physical stage, not a flat menu background.

## 2. Existing owners stay intact

Storytelling Maps reuses existing owners:

- geography / current Map Board presentation:
  `tools/kfb-cartoon-map-board/`;
- detailed city OSM:
  `tools/osm-city-lab/`;
- Card rendering / PDF:
  KFB CardBuilder + existing card ink owner;
- KFB actor composition:
  FrizzleBob Driver Graft / ToolBox / FrankenStein sources;
- actor animation:
  KayKit animation pool + `skills/kfb-cartoon-animation_v2.md`;
- asset identity:
  central Registry / Asset Librarian;
- audio:
  central `media/3D_Assets/Audio/`;
- VFX:
  central `media/3D_Assets/FX_Visual/`.

Receiving games keep their own movement, physics, save, progression and camera ownership outside the Storytelling Maps module.

## 3. Visual model · 2D art living in a 3D tabletop

The preferred visual grammar is 2.5D/3D:

```text
table / void / paper world
  ↓
map surface or board
  ↓
ink borders / routes / zones
  ↓
flat collage planes / labels / event art
  ↓
KayKit standees / dice / props
  ↓
FrizzleBob 3D guide
  ↓
VFX / particles / light accents
  ↓
accessible captions + compact controls
```

Historical/public-domain art is not flattened into a single image. It can be:

- cropped into card/standee fronts;
- mounted as shallow image planes;
- layered with small Z offsets for parallax;
- masked/cut out when a clean silhouette exists;
- used as backdrop panels that the camera can pass beside;
- temporarily raised from the map for a story beat.

## 4. Runtime architecture

One declarative story manifest should feed both editor and runtime.

```ts
type StoryMapManifest = {
  id: string
  title: string
  mode: 'cutscene'|'interactive'|'tactical'
  map: MapSource
  chapters: StoryChapter[]
  actors: StoryActor[]
  media: StoryMedia[]
  cues: StoryCue[]
  sources: SourceRecord[]
}
```

Core directors:

```text
StoryTimeline
├── CameraDirector
├── MapDirector
├── StandeeDirector
├── GuideActorDirector
├── DiceDirector
├── VfxDirector
├── AudioDirector
└── NarrationDirector
```

The timeline owns sequencing, not low-level renderer state.

### Story cue

```ts
type StoryCue = {
  at: number
  duration?: number
  kind:
    | 'camera'
    | 'map-focus'
    | 'route'
    | 'standee'
    | 'actor-motion'
    | 'dice'
    | 'vfx'
    | 'sfx'
    | 'narration'
    | 'lull'
  target?: string
  payload: Record<string, unknown>
}
```

## 5. Camera grammar

Camera work is semantic and anchor-based, not a pile of hardcoded XYZ coordinates.

### Shot families

**TABLE ESTABLISH**
- readable whole board;
- slow settling orbit or static oblique;
- landscape defaults to table-oblique;
- portrait defaults closer to top-down.

**MAP PUSH**
- move from full board toward a country/zone/event anchor;
- preserve enough context to know where the viewer came from.

**STANDEE CLOSE**
- frame the card face and colored base;
- shallow parallax with nearby pieces.

**GUIDE TRACK**
- follow FrizzleBob running / walking / hopping across the map;
- camera target leads slightly in travel direction.

**IMPACT ORBIT**
- short controlled arc around die/standee contact;
- no continuous action-camera spinning.

**TOP-DOWN RESET**
- return to geographic clarity after spectacle;
- ideal place for narration and a lull.

**PULLBACK TRANSITION**
- reveal that the current event is one piece on a larger board.

### Responsive camera contract

Same semantic shot, different responsive solution:

```text
desktop / landscape:
  oblique tabletop
  wider lateral composition
  side-by-side context

portrait:
  more top-down
  tighter focal group
  fewer simultaneous labels / expanded standees
```

Do not solve mobile by shrinking desktop UI over the picture.

## 6. Cinematic rhythm and lulls

KFB motion still follows:

`cause → anticipation → action → impact → follow-through → recovery`.

Story-map rhythm adds:

`establish → focus → action → reaction → breathe → reframe`.

A **lull** is intentional:
- camera settles;
- VFX clears;
- one or zero actors move;
- sound tail decays;
- narration/caption gets space;
- next object is staged before action resumes.

Typical initial lull range: roughly 0.8–2.0 s, tuned by playback rather than fixed as canon.

Do not animate every layer continuously.

## 7. Tactical tabletop grammar

Primary visual donor:
`media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/`.

Use exact KayKit source objects before adapting:

- colored player stands;
- playercards;
- D4 / D6 / D8 / D20;
- tokens / pawns / meeples / flags / buildings where semantically useful.

The playercard donor contains a separate art material primitive. That is the preferred seam for photo / illustration / information-card media replacement while preserving the original card geometry.

D10 and D12 are not in this KayKit pack.

Preferred missing-die / physics donor:
`3d-dice/dice-box-threejs@6945e0068eae27f22acd26debdb70f6ef2fd6063`
(MIT, Three.js + Cannon ES).

## 8. FrizzleBob guide / narrator

The guide candidate is the existing **FrizzleBob Driver Graft**, not a new character implementation.

Verified registry relationship:
- host: KayKit Driver / Rig_Medium;
- composition: `frizzlebob-driver-graft`;
- motion pool: 139 Rig_Medium clips in registry snapshot;
- current selection status remains candidate/consumer-owned.

Useful motion families for Storytelling Maps:
- Idle;
- Walk / Run;
- Jump start / full / land;
- Interact / pickup;
- sit / crawl / special clips when explicitly verified;
- gestures / reactions from the existing pool.

Guide choreography examples:
- run along a route line;
- stop and point at a standee;
- hop onto a country tile;
- duck behind an information board;
- crawl under a large card;
- react to a rolling die;
- sit during a lull while narration continues.

No generic perpetual mascot motion.

## 9. Narration / TTS

First POC can use browser `speechSynthesis`.

Contract:
- captions always exist;
- TTS is optional enhancement;
- voice availability and exact pronunciation are not deterministic across browsers;
- playback timing must not depend on one specific installed voice;
- later pre-rendered TTS can replace browser speech without rewriting the story manifest.

Narration cue stores text + intended duration/beat, not a browser voice ID as canon.

## 10. VFX grammar

Reuse central assets; do not invent a new VFX library.

Relevant sources already present:

- `FX_Visual/brackeys_vfx_bundle/` — CC0 particles / flipbooks;
- `FX_Visual/kenney_smoke-particles/` — CC0 smoke;
- `FX_Visual/explosions_smoke/` — collision sparks, smoke, fire impact, teleport, impact ring;
- `FX_Visual/FreeHitVfx/` — stylized hit-system donor; engine-specific source, useful for texture/layer/preset ideas;
- `FX_Visual/Beams_BinbunVFX/` and mysterious-object set for later specialist cues.

Story-map use:
- route spark / travel streak;
- standee rise dust;
- die impact spark;
- teleport / map jump;
- smoke or debris after a violent beat;
- subtle light pulse for chapter focus.

VFX is punctuation. Lulls deliberately clear it.

## 11. SFX / audio grammar

Central audio truth:
`media/3D_Assets/Audio/`.

The repository documents 1006 existing sounds overall; use the central manifests where applicable.

Especially relevant direct Board/Card sounds:

- `card_draw_1/2/3.wav`;
- `card_fan.wav`, `card_fan_2.wav`;
- `chips_drop.wav`;
- `chips_place_1/2/3.wav`;
- `chips_stack*.wav`;
- `dice_grab.wav`;
- `dice_roll_1/2/3/4.wav`;
- `dice_shake_2/3/4.wav`.

Semantic mapping:

```text
standee appears      → card draw / chip place
standee folds away   → card draw reversed-like timing or soft board contact
token move           → chip place
dice pickup          → dice grab
dice anticipation    → dice shake
dice throw/contact   → dice roll + physical impact
chapter reveal       → restrained musical accent
lull                 → silence / ambience, not filler
```

Audio should follow the KFB rule: one event-defining cue, optional support, then silence.

## 12. Editor direction

Do not begin with a generic DAW/editor shell.

The authoring tool should emerge from the runtime manifest.

Minimum authoring concepts:

- **Board**: choose map/board level and style;
- **Shelf**: sources, standees, props, VFX, SFX, actors;
- **Shot rail**: ordered cinematic beats;
- **Inspector**: only properties for the selected beat/object;
- **Playhead**: preview the same runtime;
- **Source panel**: provenance/license for media.

The first usable editor should likely be **shot/storyboard-first**, not a freeform giant scene editor.

## 13. Ludowala benchmark lessons

Ludo Wala is a benchmark, not a code/asset donor.

Useful product lessons from its current public site:

- board treated as a physical tabletop rather than menu background;
- physical die with visible tumble/bounce/settle;
- dynamic light/shadow;
- orbit + pinch/zoom;
- orientation-responsive camera: wide screens oblique, upright phone more top-down;
- theatrical effects can throw pieces around while canonical game position remains unchanged;
- responsive phone-first controls;
- most small feedback sounds synthesized live, with recorded sounds reserved for events that benefit from them.

KFB adaptation:
- preserve semantic state separately from theatrical presentation;
- use responsive camera grammar, not only responsive CSS;
- let 2D collage material become physical standees/planes;
- use spectacle in short bursts, then return to geographic readability.

Do **not** copy Ludo Wala branding, board design, toy set or proprietary assets.

See `LUDOWALA_BENCHMARK.md`.

## 14. Supporting production tools

### Game Development Studio

Useful later for:
- asset package/provenance checks;
- vendoring exact VFX/SFX packages;
- sealed browser/render comparisons;
- performance evidence once many layers/VFX are active.

Current environment note:
`game-dev` CLI was checked once in this chat and was unavailable. Per KFB workflow, repository-native checks continue; this does not block the web POC.

### Build 3D Game Rooms

Useful selectively, not as core map owner:
- authored 3D diorama cutaways;
- special room/table environments around the board;
- Blender camera blocking for a complex hero beat;
- a story transition that physically leaves the map and enters a room.

Do not route ordinary 2D/2.5D map authoring through a room pipeline.

## 15. Product ladder

**S0 · Europe Map Board**
Already PUBLIC_VERIFIED technical baseline.

**T1 · exact tabletop donor isolation**
Current gate.

**T2 · media standee**
Exact KayKit card + stand; replace only media face; portrait/landscape.

**T3 · standee motion**
Hop / squash / wobble / recovery.

**T4 · dice collision**
D20 actual collision drives standee response.

**T5 · full dice family**
KayKit visual donors where present; 3d-dice donor for missing types.

**S1 · responsive Storytelling Map runtime**
Mobile portrait/landscape camera + density rules.

**S2 · Odyssey POC**
2–3 minute narrated story-map proof.

**S3 · Near East interactive/tactical demo**
Conflict zones + info standees, after neutral mechanics are accepted.

**S4 · authoring/editor**
Runtime manifest editor.

**S5 · game-module consumers**
KFB World/Zone/Galaxy and named game cut-scenes.

## 16. Current next gate

T1 only: exact donor isolation page.

No Odyssey asset ingestion, no Near East content, no dice-to-standee impact and no editor implementation before the T1 donor page is visibly proven.


## T1 PUBLIC VERIFIED · 2026-09-20

Exact Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`

Verified on the public Cloudflare route:

- browser checks: **9/9 PASS**;
- exact Cloudflare marker: PASS;
- route HTTP 200;
- exact KayKit playerstand donor: loaded;
- exact KayKit playercard donor: loaded;
- exact KayKit D20 donor: loaded;
- external Three/Cannon D10 donor: ready;
- D10 roll resolved with a natural result;
- page/script errors: **0**;
- failed HTTP requests: **0**;
- desktop screenshot: captured;
- mobile-landscape screenshot (844×390): captured.

Evidence:
- workflow run: `35522576654`
- job: `106109086411`
- artifact: `10608862542`
- digest: `sha256:eeafbfab2b3cd8b0a79d0588537740129f5749ef7518fe5effbe30a3f7eed787`
- publication commit: `ea77610ba57b3ed5aa8f045978643d8a8030b3ba`

This is a technical/public donor proof, not Georg's visual donor-identity acceptance.

Exactly one next gate remains:
**Georg reviews whether all four donors are visually/source-identifiable enough to proceed to T2 Media Standee.**
