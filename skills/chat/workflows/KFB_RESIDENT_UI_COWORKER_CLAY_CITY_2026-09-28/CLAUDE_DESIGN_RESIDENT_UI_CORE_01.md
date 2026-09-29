# Claude Design · RESIDENT-ATLAS-S12-01

## Execution Card · laufendes Resident-Projekt

- **Projekt:** der bereits laufende Claude-Design-Chat **KayKit Resident Atlas S12**.
- **Nicht das ToolBox-/Animation-Studio-Projekt.**
- **Model:** Opus 5.5 High beziehungsweise stärkstes verfügbares Claude-Design-Modell.
- **Reasoning:** High für den zusammenhängenden Resident-Atlas-Pass.
- **Ziel:** Resident Atlas S12 mit ruhigem ToolBox-UI, einem vollständigen 3D-Inline-Editor, Claymation-Diorama, Graveyard-Funktion und Resident-Interaktionen.
- **Kein Neustart:** im vorhandenen Resident-Atlas-Chat fortsetzen.
- **Kein GitHub-Auftrag:** vollständigen Session Cut/Download zurückgeben.
- **Stop rule:** Nur echter Source-/Runtime-Blocker oder zwei fehlgeschlagene Reparaturversuche.

## Wichtige Korrektur zur Projektgrenze

Der Resident-Atlas-Job und **KFB ToolBox Production-05 / Animation Studio** sind zwei verschiedene Claude-Design-Projekte.

Dieser Resident-Job baut **nicht**:

- die 345-Clip-Animation-Library-Oberfläche;
- Locomotion-Set-Browser und Motion-State-Studio;
- die Animation-Studio-Drop-Zone;
- das komplette ToolBox-Choreography-Lab;
- ein neues ToolBox-Shell-Artefakt.

Diese Punkte gehören in das separate öffentliche Briefing:

`CLAUDE_DESIGN_TOOLBOX_ANIMATION_STUDIO_V5_01.md`

Der Resident Atlas darf die Motion Library v5 und bestehende Choreography-/Editor-Verträge als Donor konsumieren, aber er übernimmt nicht deren Tool-Designjob.

## Verbindliche Quellen

Resident-Source:

1. `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/START_HERE.md`
2. dort `RETURN.md`, `TEST_REPORT.md`, `SOURCE.json`
3. aktueller `KFB_Resident_Atlas_S12.html#__graveyard`
4. `lib/edit-layer.js`
5. `data/graveyard-01.json` und `lib/graveyard.js`
6. vollständige Halloween-GLBs aus PR #279 @ `10a2c5e29bf752215dadb60b23f07253f63e9d34`

Clay-Look:

1. H0 Hirnwelt:
   `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
2. K2 Knet-Werkzeuge:
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`
3. T3/T4 für Komposition und Clay-Partikel; T4 auf
   `coworker/clay-city-mvp-01-2026-09-28@939224c051afb464c553ff6f9b59609503eb1b49`
4. Skydome:
   `travel/travel-v16/terrain-v16/skydome-shader.js`

H0 bestimmt den Look, K2 Material/Werkzeuge und T3/T4 Welt/VFX. Keine ähnliche Eigeninterpretation.

Motion-/Interaktionsdonor, nur soweit für Resident-Szenen nötig:

`georg-doc-patch-3@95a8197c76c2bae4d12bfc867d54debe15ffc1f2`

Der Atlas verwendet daraus ausgewählte Clip-IDs, Resident-Zuordnungen und ChoreographyRecipe-Daten. Er baut nicht den Library View.

## Auftrag A · Resident-Atlas-UI bereinigen

Das aktuelle Graveyard-UI hat mehrere konkurrierende Transformflächen, Kontext-Leaks und zu viel dauerhaft sichtbare Metadaten.

Ziel:

- aktuelle helle ToolBox-Gestaltung;
- 3D-View als Hauptfläche;
- ein kompaktes kontextuelles Mini-Menü am ausgewählten Objekt;
- genau ein einklappbarer Inspektor;
- keine doppelte Transformpalette;
- keine langen FOV-/Statusblöcke im Sichtfeld;
- kein Goth-Girl-, Ghostville- oder anderer Kontext-Leak im Friedhof;
- kleine Zustandsicons statt großer `PROVEN`-Labels;
- Narrow View mit Inspektor als Sheet/Drawer.

Inhaltliche Halloween-Farben dürfen bleiben; das Werkzeug-Chrome wird nicht schwarz/gelb.

## Auftrag B · vollständiger gemeinsamer 3D-Editor-Vertrag

Das Inline-Menü enthält konsistent:

- Verschieben;
- Drehen;
- Skalieren;
- Welt/Lokal;
- Raster;
- Absetzen/Boden;
- Fokus;
- Rückgängig/Wiederholen;
- Auswahl schließen.

Drei unabhängige Snap-Modi:

- **Grid**
- **Connector**
- **Mount**

Connector verbindet kompatible Pflaster-, Weg-, Zaun- und Pfeilerkanten. Mount befestigt Props an gemessenen Rig-Ankern. Köpfe selbst sind keine Mount-Props.

Abgelehnte Snaps zeigen einen kurzen Grund. Rasterweite, Connector-Toleranz und Mount-Offset liegen im einen Inspektor, nicht in einer weiteren Palette.

Der Atlas implementiert den Vertrag für Graveyard/Residents. Das separate Animation Studio konsumiert denselben Vertrag später in seinem eigenen Projekt.

## Auftrag C · Graveyard erhalten und sauber weiterbauen

Unverändert erhalten:

- vier Dancing Skeletons;
- acht Takte Tanz;
- Takt 9 Zerfall;
- Takt 10 Zusammensetzen;
- fliegende Knochen;
- Kollisionen mit Grabsteinen, Sarg und Säule;
- Gate- und Audio-Funktionen;
- Diorama-/Inventar-Auswahl;
- echte Halloween-Modelle.

Event-Zuordnung:

- Zerfall = `prop_break`;
- zurückkehrende Knochen dürfen `land` auslösen;
- finales Einrasten = `reassemble_complete`.

## Auftrag D · Wegband und Pflaster

- K2-Größenklasse: mittel wie Props, mit reduzierter Reliefamplitude;
- Pack-Textur als einmal geladene, geteilte Detail-/Maskenquelle behalten und in KFB-Palette abtönen;
- `flat clay` nur als Low-End-/Diagnose-Fallback;
- KayKit A+B als Kern, C als Rand, D als Saum;
- Quaternius-Höhe an KayKit angleichen;
- gemeinsame Quaternius-Textur genau einmal laden;
- `pathBand` besitzt Platzierung und Dichte, nicht Material;
- manuelle Korrekturen bleiben editierbar und exportierbar.

## Auftrag E · Claymation-Diorama, Skydome und Schatten

Kein grauer Boden und kein neutraler Viewer als Produktionsansicht.

Pflicht:

- H0/K2/T4-Look tatsächlich anwenden;
- Terrain, Residents und Props im gemeinsamen Claymation-Look;
- Skydome mit Tag, Abend, Night-Space und Basic;
- Qualitätsstufen off/basic/full;
- T4-Clay-Partikel für Footstep, Land, Impact, prop_break und reassemble;
- Clay-Spuren nach Größenklasse: grob Terrain, mittel Props, fein Characters.

Grounding-/Shadow-Gate:

- sichtbare Oberfläche, Snap-/Fußkontakt und Shadow Receiver verwenden dieselbe finale Oberflächenhöhe;
- genau ein Schattenvertrag pro Objekt;
- keine abgelösten Schatten, dunklen Streifen, Doppelschatten, Z-Fighting, schwebenden Füße oder Terrain-Clippings;
- Prüfung auf flachem Terrain, Hang und Pflaster-/Terrain-Naht;
- Beauty-, Shadow-off- und Receiver-/Kontakt-Diagnose.

## Auftrag F · Resident-Interaktionen im Atlas

Der Atlas zeigt ausgewählte Resident-Szenen, ohne das Animation Studio nachzubauen:

- Geschenk;
- Gespräch/Debatte;
- kurze Rauferei;
- Speaker Corner oder Monolog;
- eine Default-Aktivität.

Die Szenen konsumieren exportierte `ChoreographyRecipe`-/Motion-IDs. Im Atlas genügen kompakte Auswahl, Playback und Resident-spezifische Overrides. Tiefes Clip-Tagging, Retargeting, Intake und Set-Authoring bleiben im ToolBox Animation Studio.

Emotionen bleiben modular zu Body-Clips:

- Eyes;
- Eyebrows;
- Clay-Eyelids;
- Mouth/Face;
- Emotion-Preset.

Clay-VFX konsumiert die gemeinsamen Events und erfindet keinen Resident-Sonderstandard.

## Abgabe

Vollständiger Resident-Atlas-Session-Cut mit:

- aktualisiertem interaktivem HTML;
- Desktop- und Narrow-Ansicht;
- bereinigtem Graveyard-UI;
- vollständigem Inline-Editor;
- einem einklappbaren Inspektor;
- Grid/Connector/Mount;
- Claymation-Diorama samt Skydome;
- Grounding-/Shadow-Diagnose;
- Dancing Skeletons und Wegband;
- mindestens drei kurze Resident-Interaktionsbeispiele;
- JSON-Export der Atlas-/Scene-/Editor-Korrekturen;
- `START_HERE.md`;
- `RETURN.md` problems first;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- Screenshots/Beweisbilder;
- Checksummen;
- genau einem nächsten Gate.

PASS, wenn der Resident Atlas klarer, ruhiger und funktional vollständig ist, der Claymation-Look sichtbar den Donors entspricht und keine Schatten-/Kontaktfehler kaschiert werden.

Nicht Teil des PASS-Gates: ein vollständiger 345-Clip-Library-Browser. Dieser wird separat in KFB ToolBox Production-05 gebaut.
