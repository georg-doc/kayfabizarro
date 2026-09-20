# POC · KFB Storytelling Maps · The Odyssey

Status: **PROPOSAL · ASSET INGEST NOT STARTED**
Target runtime: 2–3 minutes
Primary purpose: prove cinematic map storytelling before contemporary/political use cases.

## Why Odyssey

It exercises nearly every desired system without requiring a modern political editorial choice:

- geographic journey;
- disputed/uncertain route that can be openly labeled "kayfabuliert";
- iconic characters and events;
- ships/islands/monsters;
- abundant public-domain visual material;
- natural reason for maps, standees, route lines, dice-like fate and narrator commentary.

## Visual source strategy

Prefer coherent public-domain line art first.

Strong candidate:
**John Flaxman Odyssey illustrations (c. 1810)** — public-domain reproductions exist on Wikimedia Commons and line-art style maps naturally into KFB ink/card treatment.

Additional open-access pools:
- The Metropolitan Museum of Art: public-domain/Open Access Odyssey illustrated books and related antiquities;
- Wikimedia Commons PD files;
- Rijksmuseum public-domain / CC0 reproductions.

Every imported image gets a source record:

```json
{
  "id": "odyssey-sirens-flaxman",
  "creator": "John Flaxman",
  "date": "1810",
  "sourceUrl": "...",
  "license": "Public Domain",
  "localPath": "...",
  "depicts": ["Odysseus", "Sirens"],
  "crop": "portrait-standee"
}
```

Do not copy arbitrary Google Images results.

## Narrative geography rule

The Odyssey's exact geography is debated.

Therefore the POC should state:

**"A kayfabuliert route across the Mediterranean — story geography, not a claim of archaeological certainty."**

The route is editorial/storytelling data, separate from OSM coastline truth.

## Proposed 150-second cut

### 0–12 s · TABLE ESTABLISH

- Mediterranean board wakes from darkness.
- route line is still absent;
- FrizzleBob enters from board edge;
- browser TTS/caption establishes the premise.
- soft board ambience, one footstep family.

Lull at end.

### 12–32 s · CYCLOPS

- camera pushes toward Sicily-ish narrative anchor;
- Polyphemus standee rises;
- FrizzleBob walks/crawls around its base;
- one heavy event beat;
- short impact VFX;
- standee settles.

### 32–48 s · CIRCE

- route sweeps to next island;
- standee card rotates up;
- palette shifts briefly;
- FrizzleBob stops, reacts, points;
- small magical VFX only.

Lull.

### 48–68 s · UNDERWORLD / DESCENT

- board lighting drops;
- map becomes quiet;
- camera lowers;
- collage layer rises behind route;
- narration dominates; almost no motion.

This is the intentional slow passage.

### 68–92 s · SIRENS

- Flaxman/Siren art standees appear;
- camera travels along ship route;
- card/standee sway is restrained;
- sound uses spatial lure/whisper-like texture only if a licensed source is selected;
- FrizzleBob visibly resists / is dragged / clings to a map prop.

### 92–112 s · SCYLLA / CHARYBDIS

- route narrows;
- two opposing event standees or VFX fields;
- faster camera;
- one die/fate beat can be introduced later after Dice T4/T5 is accepted;
- short peak of spectacle.

### 112–132 s · CALYPSO / LULL

- warm island palette;
- guide sits or idles;
- camera settles to wide composition;
- narration gets room.

### 132–150 s · RETURN TO ITHACA

- route resolves;
- earlier standees fold down;
- board pulls back;
- final Ithaca standee rises;
- optional KFB punchline / absurd interpretation;
- clean recovery to map overview.

## FrizzleBob guide

Use existing Driver Graft composition through receiving-consumer integration, not a copied static model.

Desired motion samples from verified Rig_Medium pool:
- Idle_A;
- Walking_A;
- Running_A;
- Jump_Start / Jump_Full_Short / Jump_Land;
- Interact;
- PickUp;
- additional crawl/sit/special clips only after actual source verification.

The guide is a narrator with a body, not a floating UI assistant.

## Audio sketch

Use central sources only.

Examples:
- card rise → `card_draw_*.wav`;
- standee contact → `chips_place_*.wav`;
- die later → `dice_grab` / `dice_shake` / `dice_roll_*`;
- scene accent → restrained music/effect from central audio library;
- lulls → deliberate silence or ambience.

## VFX sketch

- route reveal: hand-drawn streak / beam adaptation;
- magical event: restrained particles;
- impact: FreeHit/Brackeys-style burst adapted to KFB ink;
- smoke/debris: Kenney / explosions_smoke;
- teleport/chapter jump: existing teleport sheet.

No continuous emitter soup.

## POC acceptance

The Odyssey POC is successful when:
- 2–3 minutes can be authored from a declarative manifest;
- camera transitions remain readable on desktop + mobile landscape/portrait;
- public-domain media retains provenance;
- FrizzleBob can traverse and react using real motion donors;
- VFX/SFX support story beats rather than dominate;
- lulls are visibly intentional;
- the same sequence can be replayed deterministically enough for review;
- runtime can later expose the same manifest interactively.

## Dependency gate

Do not begin this POC until T1 donor isolation is visually accepted, followed by the minimum standee/media adapter required for story art.
