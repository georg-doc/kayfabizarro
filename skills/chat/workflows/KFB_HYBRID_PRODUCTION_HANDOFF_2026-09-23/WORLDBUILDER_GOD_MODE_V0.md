# KFB WorldBuilder · God Mode / Globe-to-Local Authoring v0

Status: **PLANNING DIRECTION · CONSUME EXISTING OWNERS · NO MEGA-ENGINE**

## Für Georg

Zielbild:

Eine KFB-Welt, die man erst **als Ganzes** sieht und dann hineinzoomt.

Von dort:
- freie Orbit-Kamera;
- Terrain formen;
- Assets / Tiles suchen und einsetzen;
- OSM-Cartoon-Gebäude;
- Racer-Strecken;
- Resident-Gruppen/Szenen;
- Card Zones;
- Blender-authored Szenen;
- alles direkt in 3D auswählen, verschieben, drehen, skalieren und absetzen.

Das ist ein sinnvoller WorldBuilder-Zielzustand.

Wichtig:
nicht alle Systeme zu einem neuen Mega-Owner verschmelzen.

## 1 · Two-scale architecture

### A · WORLD OVERVIEW / GOD VIEW

Consumes the existing Travel / TinySkies world grammar.

Purpose:
- full-world orientation;
- orbit;
- zoom-out / zoom-in;
- choose/edit region;
- later weather/day/night preview.

This is a navigation/presentation layer.

It is **not** the local terrain sculpt owner.

### B · LOCAL AUTHORING

Consumes the existing WorldBuilder terrain/editor.

Purpose:
- continuous procedural terrain;
- Raise / Lower;
- radius / strength;
- local asset placement;
- in-place editing;
- Save/Reload.

This remains the productive scene-authoring layer.

## 2 · Existing proven donors

### Continuous terrain

Primary donor:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`
MIT.

Current KFB owner:
WorldBuilder WB1/WB2.

Current WB2:
PR #190.

Do not restart terrain from Blender.

### Global sphere / atmosphere

Travel / TinySkies remains the spherical-world donor.

Useful existing owners:

`travel/KFB Travel Globe v13-1/globe-v13/intro-flight.js`

The current KFB version explicitly rebuilt the TinySkies intro as:
- one duration;
- one curve;
- great-circle slerp;
rather than several stitched camera animations.

Other existing world layers:
- `day-night.js`;
- `sky-atmosphere.js`;
- `sky-presets.js`;
- `weltstimmungen.js`;
- `rain-overlay.js`;
- world lighting owners.

Do not rebuild these as a new WorldBuilder sky stack.

### OSM

OSM remains geographic/semantic truth.

Current visual form-language POC:
PR #194 · Hürth Elastic Grotesque Clay.

Presentation may deform/exaggerate buildings.

Footprints / ids / geographic placement remain owner truth.

### Assets / tiles

Use Asset Librarian / Asset Registry.

Do not build a second asset catalogue inside WorldBuilder.

God Mode search/filter is a **consumer UI** over the existing registry.

### Residents / grouped scenes

Consume Resident Atlas.

A Resident set is a scene/prefab candidate:
- actors;
- props;
- pose/animation;
- measured relationships.

Do not flatten it into independent guessed objects.

### Scene editing

Consume accepted shared in-scene editor:
- select;
- move;
- rotate;
- scale;
- drop;
- World/Local;
- Save/Reload through existing host persistence.

No second transform owner.

### Racer

Race owns:
- route;
- banking;
- contact;
- gameplay.

WorldBuilder may:
- place/reference a Race route/visual module;
- preview environment around it.

Blender may author a visual track anatomy donor.

WorldBuilder does not become Race physics.

### Card Zones

Consume existing Card Zone contracts/recipes.

WorldBuilder places/hosts a zone.

Do not rebuild Card rendering/reveal ownership.

### Blender MCP

Use for complex authored content:
- resident performances;
- architectural/scenery pieces;
- track anatomy;
- special structures.

Export:
GLB + source/measurement/Return.

WorldBuilder consumes the accepted output.

Blender is not the world runtime.

## 3 · God Mode UX

Top-level authoring modes:

### Globe
Whole world.
Orbit/zoom.
Select region.

### Terrain
Raise/Lower.
Radius/strength.
Later optional Smooth/Flatten only after current WB2 gate.

### Place
Asset Librarian consumer:
- search;
- filters;
- packs;
- roles;
- Resident presets;
- scene presets.

Drag/place into world.

### Edit
Shared in-place editor.

### World Layers
Toggle:
- terrain;
- OSM;
- track;
- residents;
- props;
- card zones;
- lights/sky;
- diagnostics.

### Camera
- God orbit;
- region;
- ground/editor;
- named review cameras.

Camera modes do not become product/game camera owners.

## 4 · Globe ↔ Local transition

Use the proven TinySkies/KFB intro-flight grammar as camera donor.

Desired authoring transition:

`GLOBE OVERVIEW → chosen region → smooth great-circle / spatial approach → LOCAL AUTHORING CAMERA`

Reverse:

`LOCAL AUTHORING → pull back → GLOBE OVERVIEW`

One transition owner.
No stitched multi-clock camera chain.

## 5 · Persistence model

WorldBuilder stores references/settings/transforms, not copied asset bytes.

Candidate scene recipe:

```json
{
  "worldView": {...},
  "terrain": {...},
  "layers": [
    {"type":"osm-region","ref":"...","transform":...},
    {"type":"race-route","ref":"...","transform":...},
    {"type":"resident-scene","ref":"...","transform":...},
    {"type":"card-zone","ref":"...","transform":...},
    {"type":"asset","assetId":"...","transform":...}
  ]
}
```

Transforms reuse existing scene patch grammar where appropriate.

Do not invent a new global asset id system.

## 6 · KFB visual grammar

Consume:
- current 3D CartoonStyle;
- PR #194 Elastic Grotesque Clay decisions after human review;
- WorldDesign lighting/look donors.

Terrain / buildings / structures should read as one KFB world:
- large readable masses;
- rounded/bowed/skewed forms;
- physical joints;
- toy/clay material response;
- real 3D shadow;
- limited color zones.

Do not use visual noise to hide topology defects.

## 7 · Environment progression

Do not build all climate systems in v0.

Sequence:

### G0
Globe ↔ Local camera + one editable region.

### G1
Local WB2 terrain + Asset search/place + shared editor.

### G2
One OSM cartoon district + one Resident set + one Card Zone.

### G3
One Race visual/route module.

### G4
Sky/time presets:
Day / Golden Hour / Night.

### Later
Weather / clouds / seasonal atmosphere.

Reuse Travel owners rather than cloning them.

## 8 · First coherent proof

**WORLD-GOD-01**

One review artifact:

1. starts in globe overview;
2. zooms smoothly to one authored region;
3. local terrain is sculptable;
4. Asset Librarian search can place one real prop;
5. one Resident scene preset can be placed;
6. one Hürth/OSM cartoon cluster is visible;
7. shared in-place editor edits a placed object;
8. Save/Reload persists;
9. camera can pull back to globe overview.

Not required in first proof:
- whole planet editing;
- weather system;
- all Racer tracks;
- every Resident;
- full Card Zone gameplay;
- Blender geometry editing inside browser.

## 9 · Provider split

Coworker:
- contracts;
- source adapters;
- registry consumer;
- persistence;
- runtime integration.

Claude Design:
- God Mode UX;
- coherent visual composition;
- layer/drawer presentation;
- look integration after sources are pinned.

Blender MCP:
- complex authored world pieces;
- track/scenery anatomy;
- Resident performances.

Web:
- source/review slices;
- isolated proofs.

WSA:
only later if accepted modules require local cross-repo packaging.

## 10 · Next decision

Do not start WORLD-GOD-01 before:
- WB2 human gate;
- current PR #194 form-language gate;
- Production Desk exists;
- Coworker has completed the ToolBox coherent milestone or explicitly identifies this World proof as the next MVP.

This direction is prepared, not yet the active implementation gate.
