# KFB · Current Priority Board · 15.09.2026 late

**Status:** CURRENT PERSONAL / LEAD PRIORITY VIEW. Kein Runtime-SSOT. Projekt-SSOTs und aktuelle Execution Contracts schlagen ältere Chat-/Board-Stände.

## Ziel

Elisas Geburtstag ist **16.09.2026**. Jetzt zählt ein kohärenter, spielbarer, visuell starker Birthday-World-Slice — keine weitere Planungsschicht und kein Versuch, vorher die ganze Town oder den ganzen Stage-Editor fertigzustellen.

## P0 · NOW · Direct Astra Birthday build

### P0.0 · Actor-/Motion-Handoff

**DONE / TESTED INPUT.**

Der ToolBox Birthday Return liefert die getesteten Actor-/Motion-Eingänge. Nicht neu bauen.

Source:

`tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/RETURN_BIRTHDAY_CONSUMER.md`

### P0.1 · Astra replacement build

**Owner:** `georg-doc/KFB-Travel-Globe` / Astra  
**Current execution contract:**

`_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/ASTRA_EXECUTION_CURRENT_2026-09-15.md`

**PR #8 bleibt REJECTED / UNMERGED.** Astra startet auf einem frischen nicht-destruktiven Birthday-Branch vom aktuellen Travel `main`.

Hard P0 identity:

- Travel/TinySkies world substrate, nicht generischer Sunset-Backdrop;
- echtes Terrain + Coast/Water/Beach-Lesen;
- Travel Evening sky/light/atmosphere owner;
- echter coastal lighthouse + Glow/Beam;
- animierte räumliche Clouds;
- world-space Rainbow;
- aged 3D Theatre Curtain / Proscenium als wiederverwendbarer Core-Asset-Candidate;
- Curtain states: rest · wind · impact · sideways open · open-rest · close · reset;
- WebGPU cloth donor **plus echter non-WebGPU fallback**;
- Uncle FrizzleBob + GothGirl-source Birthday actor + Hihi räumlich IN DER WELT;
- getestete Idle → Focus → Select/Celebrate → Rest-Beats;
- sichtbarer Birthday Radio D6 mit allen sechs Tracks über Travel Audio;
- drei asymmetrische Disco Balls;
- physische farbige 3D-Letter/Newton-Installation `Happy Eighteenth Birthday Elisa!`;
- ein begrenztes Fireworks/Celebration Event;
- Desktop + Mobile Landscape;
- separate WIP-Publikation;
- kein Auto-Merge vor Georg Freeplay.

### P0.2 · Astra-interne Gates

Astra darf die Gates in einem Run abarbeiten; kein neuer Lead-/Planungs-Chat dazwischen.

`A0 preflight → A1 WORLD STANDING → A2 CURTAIN/FIRST 3–5s → A3 CHARACTER LIFE/INTERACTION → A4 SOUND/CELEBRATION → A5 RESPONSIVE/PUBLISH`

Ein fehlgeschlagenes Gate wird repariert, bevor Astra weitergeht. Automated PASS ist niemals Georg-Acceptance.

### P0.3 · Georg Freeplay

Nach veröffentlichter Ersatz-WIP:

- Desktop 1440×900;
- Mobile Landscape ~844×390;
- first-click/reveal;
- Curtain feel;
- world/coast/water/light;
- alle drei Character-Präsentationen;
- D6 sechs Tracks;
- Interaktion / Restzustände;
- keine Audio-/Mixer-/Actor-Duplikate;
- Reload;
- visuelles Gesamturteil.

Erst danach Merge-/Release-Entscheidung.

## Aktuelle Quellen, die nicht wieder erfunden werden

### World

- Travel ist Terrain/Sky/Light/Water/Audio Owner.
- TinySkies gameplay branch bleibt gepinnt auf `2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`; Audit 15.09.: keine neueren Default-Branch-World-Commits.
- TinySkies `TerrainSurface.ts`, `SkyPresets.ts` und `Globe.createLighthouses()` sind die upstream world donors.

### Visual reference

Current Georg input:

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/`

- Georg mockup = Event-/Composition-Reference innerhalb der Travel-Welt;
- Gemini mockup/colour sheet = secondary LookDev/local accents;
- screenshots = source/reference evidence;
- Curtain reference WebP = aged velvet/proscenium visual target.

### Three.js technical donors

Current audited pin:

`mrdoob/three.js@8f24439631c052231f9661b81633e7ab514f25a5`

- `webgl_volume_cloud.html` → volumetric cloud technique; KFB adds calm spatial animation/adaptation;
- `webgpu_compute_cloth.html` → cloth donor; current source still WebGPU-only in practice, therefore fallback mandatory.

### Birthday audio

Six CC0 Birthday Radio MP3s already exist with provenance manifest. No new audio engine.

## Explicit creative freedom

Astra soll nicht stumpf einen Screenshot nachbauen. Innerhalb der harten Owner-/Source-/Coverage-Regeln darf und soll Astra optimieren:

- Terrain seed / coastline silhouette;
- camera/lens/reveal staging;
- clearing shape;
- prop clustering / negative space;
- asymmetry / cartoon deformation;
- cloud placement and motion;
- curtain folds/wear/damage/proscenium detail;
- local Birthday accent colours;
- fireworks choreography;
- disco/D6 response;
- bounded microinteractions.

Bessere 3D-Lösungen dürfen vom Mockup abweichen, solange dessen Intention und der stärkere Travel/TinySkies-World-Contract erhalten bleiben.

## Deferred · not a Birthday blocker

### Fable / Stage / Terraformer editor track

Der vorherige Fable-G0-/Stage-Builder-Pfad bleibt als spätere Authoring-/Editor-Linie erhalten, blockiert aber **nicht** den direkten Astra Birthday build am 15./16.09.

Nach Birthday-Freeplay kann der akzeptierte World/Scene-Stand zurück in Stage/ToolBox als Authoring Target fließen.

### Narrative Scene Layer donor

`dannylimanseta/narrative-scene-layer@082b5a43…` ist ein späterer Architektur-/Presentation-Donor für:

- scene / presentation / theme split;
- sticky poses/stances;
- explicit entrances;
- presentation variants.

Kein neuer Narrative-Engine-Scope im Birthday build.

## Parallel / nicht blockierend

- Asset Librarian: Docs/Manifest/Return versöhnen; keine Taxonomie-Großrunde.
- ToolBox: Brows/Colorpicker/Surf/Material-Surface correctness separat; kein Birthday-Blocker.
- Suno/ElevenLabs/Town-Expansion nur, wenn sie den Birthday build nicht verzögern.

## Nicht jetzt

- vollständige Town;
- universeller Stage Editor;
- universelles Full-Body IK;
- vollständige Dance Library;
- neues Lighting-System;
- neue Soundscape-Engine;
- Multiplayer-Watchparty;
- Plato Dungeon;
- Card/PDF Viewer auf dem Curtain — **nur zukünftigen `setSurfaceContent`-Seam reservieren**.
