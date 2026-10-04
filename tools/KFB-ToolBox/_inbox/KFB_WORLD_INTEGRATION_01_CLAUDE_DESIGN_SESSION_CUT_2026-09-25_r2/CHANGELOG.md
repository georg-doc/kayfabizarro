# CHANGELOG · WORLD-INTEGRATION-01

## r1 · 2026-09-25
- NEU `worldbuilder/world-integration-01/`: wi1-world.js · wi1-actor.js · wi1-play.js · wi1-selftest.js · WORLD_INTEGRATION_01_SOURCE.html; DC `KFB WORLD-INTEGRATION-01 · Hürth.dc.html` (Tweaks: motionSet, walkCadence, legend, selectionRing).
- GEÄNDERT `wb2-design-01/wb2d-app.js`: Welt-Profil (WORLD_ID/prepare, STORAGE_KEY/DOC_ID, patchDoc, terrain.tile, dressTerrain, stage, initPlay/setPlay, Tab, Render-Loop, Save/Reload mit Spielerpose, Boot lädt gespeicherte Welt, Welt-Drawer: Ink/Names/Sky/Motion set, Selbsttest-Knopf, Review-Tabs + Status-Meta in der Welt aus). Basis vor dem Edit: `returns/…/base/wb2d-app.WB2-DESIGN-01.js` (Blob 8a1e725e).
- GEÄNDERT additiv `wd1-city.js`: `groundMapFor(zone,{rect,px})`; Straßenketten nach Klasse, Breite = breitestes Glied.
- GEÄNDERT additiv `wd1-names.js`: Modus `posts` (Eckmasten, Schilder parallel zur Straße, am Mast, zum Gehweg).
- Runde 2: Detailkarte, Skydome, Motion-Sets, Orbit ohne Grenzen, Kontaktschatten, UI-Ballast raus.
- Runde 3: Lab-Binderegel + Sprungkette, Eckmasten, shadowFollow, Tile 192 m.

## r2 · 2026-09-25 abends · Continuation (Georg: PROCEED PASS auf r1)
- Lokomotion als Consumer: KayKit 1.1 kanonisch, 12 Zustände + 4 Playback-Varianten (markiert), Messung je Clip (Tempo, Richtung, Aufsatzphase, Halte-Frame, Rest-Rutschen).
- Gait Governor: Tempo pro Bild über `walker.setParams({speed})`; Hysterese + Verweildauer; phasensyncrone Crossfades; Auslauf statt Schnitt.
- Befund: walk-controller normalisiert die Eingabe → r1-Rückwärts lief mit Gehtempo (behoben).
- Strafe mit Running_Strafe_* und gemessener ±61°-Ausrichtung; Posturen crouch/sneak/crawl (C/Z/X).
- Sprung: Air ab Apex statt ab Clip-Ende.
- Tusche: `inkRule` (unsichtbar · colorWrite aus · depthWrite aus · Opazität ≤ 0,02) + Pixelbeweis `inkGhostProbe`.
- wd1-city additiv: FACE_NORMALS (heller Streifen unter dem Dach / dunkler Fußstreifen), HOST SUPPORT, detailMeshes.
- Weltprofile Alstädten + Köln Dom/Hbf (Landmarken geschützt, validiert).
- Selbsttest 55 Assertions; DC-Tweaks world/paceUp/sprint; Zonenwahl im Scene-Drawer.
