# KFB World Materials · einfacher Produktionsplan

Status: **AKTIVER PLAN · ERST EINE GLOBALE TEXTUR, DANN MISCHUNGEN**
Date: 2026-10-01
Owner: bestehender KFB WorldBuilder / gemeinsamer Materialpfad

## Die einfache Frage

Wie bekommen wir einen handgemachten KFB-Look, der auf einer großen Welt performant bleibt?

Die Antwort wird **nicht** vorab auf "voller Clay-Shader" festgelegt.

Wir vergleichen drei kleine, klar getrennte Wege:

1. **Global Clay Lite** — eine kleine globale Clay-Textur für möglichst viele Objekte.
2. **Derek RGB** — eine einzige farbige RGB-Kachel, triplanar projiziert und aus der jeweiligen Quellfarbe eingefärbt.
3. **DIY Material Mix** — derselbe leichte Materialkern, aber mit wenigen auswählbaren globalen Materialfamilien wie Clay, Plaster, Fabric und Wood.

Der aktuelle K1/H0-Clay-Look bleibt visueller Referenzpunkt, aber nicht automatisch die endgültige technische Implementierung.

## Bereits vorhandene Spender

Der bestehende KFB-Texturpool wird wiederverwendet. Keine neue Texturbibliothek erfinden.

### Clay / Ton
Verifiziert vorhanden:
- `media/3D_Assets/Textures/Clay002/`
- `media/3D_Assets/Textures/clay_floor_001/`

Weitere Clay-Kandidaten sind bereits im WorldDesign-Lab/Texturpool registriert, u. a. Clay001 und Clay004.

### Plaster / Putz
Verifiziert vorhanden:
- `media/3D_Assets/Textures/Plaster001/`

WorldDesign Lab kennt zusätzlich u. a. PaintedPlaster009, Concrete024 und chipped_concrete.

### Fabric / Filz / Stoff
Verifiziert vorhanden:
- `media/3D_Assets/Textures/Fabric048/`

WorldDesign Lab kennt zusätzlich u. a. Fabric030, Fabric069, Carpet016, rough_linen, hessian_230 und velour_velvet.

### Wood / Holz
Verifiziert vorhanden:
- `media/3D_Assets/Textures/Wood036/`

WorldDesign Lab kennt zusätzlich Planks039, WoodFloor044 und WoodSiding013.

Diese Ordner sind **Spender**, keine automatisch akzeptierten Produktionsmaterialien.

## Variante A · Global Clay Lite

Das ist der erste Test.

Ziel:
**eine einzige kleine globale Clay-Textur**, die auf Häusern, Props, Gelände und Inselteilen wiederverwendet werden kann.

Regeln:
- 512² zuerst;
- 1024² nur, wenn 512² sichtbar nicht reicht;
- triplanare Projektion in Weltkoordinaten;
- Quellfarbe des Assets bleibt erhalten;
- keine individuelle 4-MB-Fingerprint-Datei pro Look;
- keine pro-Objekt-Texturkopien;
- keine sechs Werkzeugspuren;
- möglichst eine gepackte globale RGBA-Kachel oder ein einzelner globaler Satz, falls ein zweiter Kanal technisch wirklich nötig ist.

Erster Spendervergleich:
- `Clay002`
- `clay_floor_001`

Es werden nur diese beiden gegeneinander getestet. Danach wird **eine** Basis weitergeführt.

Was die Textur liefern soll:
- handgemachte Oberflächenunruhe;
- leichtes Relief / Druckgefühl;
- Rauheitscharakter;
- keine lesbaren individuellen Fingerabdrücke auf mittlerer/weiter Entfernung.

Nahdetails wie einzelne Fingerabdrücke können später optional als sehr billiger Nahbereichs-Zusatz zurückkommen.

## Variante B · Derek RGB

Zweiter Ein-Textur-Kandidat aus KFB WorldDesign Lab v1.

Prinzip:
- eine gemalte RGB-Kachel;
- dieselbe Kachel wird triplanar auf X/Y/Z projiziert;
- R/G/B wählen drei Farbtöne;
- die drei Farbtöne werden aus der ursprünglichen Materialfarbe des Assets abgeleitet.

Dadurch kann dieselbe Textur auf unterschiedlich gefärbten KayKit-Objekten arbeiten, ohne jedes Asset neu zu bemalen.

Der vorhandene Derek-Preset ist bewusst leicht:
- kein prozeduraler Clay;
- kein Grain;
- kein Bump;
- keine Makro-Wertmodulation;
- keine stochastische Doppelprobe im getunten Derek-Preset;
- Source-Gloss teilweise erhalten;
- Cel-Licht/Ink kann separat zugeschaltet werden.

Derek ist nicht automatisch "billig"; er wird im selben lokalen GPU-Test gemessen.

## Variante C · DIY Material Mix

Erst nachdem A und B gemessen sind.

Ziel:
KFB kann wie ein gebautes Diorama / eine Collage wirken, ohne dass jedes Material einen eigenen komplizierten Shader bekommt.

Materialfamilien zunächst:
- Clay;
- Plaster;
- Fabric/Felt;
- Wood.

Wichtig:
**derselbe leichte Shader-Kern** für alle Familien.

Default:
Ein Objekt oder eine Zone verwendet **eine** globale Materialtextur.

Mischungen:
- Zwei Texturen dürfen an ausgewählten Übergängen gemischt werden, wenn der Effekt sichtbar etwas bringt.
- Drei oder vier Texturen gleichzeitig pro Pixel sind **kein Default**.
- 3–4-fach-Blending wird erst gebaut, wenn ein 2er-Blend visuell nicht reicht und die Messung Budget übrig lässt.

Die Collage-Idee entsteht primär durch **Materialzuweisung**:
- anderes Material je Objektgruppe / Deck / Inselzone / Prop;
- nicht durch permanentes Mischen aller Texturen auf jedem Pixel.

## Sinnvoller Hybrid

Der wahrscheinlich interessante Produktionsweg ist nicht "Clay oder kein Clay", sondern Entfernung + Materialrolle.

### Nah / Hero
- optimierter echter Clay-Look;
- Fingerprints / Dellen nur dort, wo sie sichtbar sind;
- Figuren und wichtige Hero-Props dürfen mehr kosten.

### Mittel
Vergleich:
- Global Clay Lite;
- Blender Baked Lite;
- Derek RGB;
- optional ein sehr kleiner prozeduraler Nahdetail-Zusatz.

### Fern
- Derek RGB oder Global Clay Lite;
- günstiges Cel-Lighting;
- keine Fingerprints / Facetten / teuren Clay-Mikrodetails.

### Gelände
Separater Vergleich:
- Global Clay Lite;
- Derek RGB;
- WorldDesign Lab `TERRAIN · COMBINED REF`.

Gebäude-/Figuren-Ergebnis wird nicht automatisch auf Gelände übertragen.

## Warum erst eine globale Textur

Der aktuelle prozedurale Clay-Pfad benötigt viel Shader-Arbeit und mehrere große Texturen.

Eine kleine globale Kachel hat dagegen:
- kontrollierbaren GPU-Speicher;
- keine Asset-Vervielfachung;
- identische Ressource für viele Instanzen;
- einfachere LOD-/Distanzstrategie;
- klare Messbarkeit.

Darum wird **nicht** mit einem 4-Textur-Mix begonnen.

## Messplan

Immer dieselbe Inselwelt, Kamera und Hardware.

Erster Vergleich:
1. SOURCE / kein zusätzlicher Look;
2. aktueller Clay-Referenzlook;
3. Global Clay Lite 512;
4. Derek RGB.

Nur wenn Global Clay Lite 512 sichtbar zu grob ist:
5. Global Clay Lite 1024.

Danach optional:
6. Plaster;
7. Fabric;
8. Wood;
9. erster gezielter 2er-Mix.

Messen:
- fps;
- mean / p95 / p99 frame time;
- draw calls;
- triangles;
- texture count;
- geschätzter zusätzlicher GPU-Texturspeicher;
- renderer pixel ratio;
- gleiche sichtbare Hardware.

Visuell immer:
- Nah;
- Mittel;
- Fern;
- Gelände;
- ein Gebäude/Prop mit erhaltener Quellfarbe.

## Entscheidungsregel

Kein Kandidat gewinnt nur durch FPS.

Gesucht ist der **billigste Look, der in der vorgesehenen Entfernung noch klar nach KFB aussieht**.

Wenn eine 512²-Globaltextur 80–90 % des gewünschten Eindrucks bei deutlich geringeren Kosten liefert, ist sie für Mittel/Fern wahrscheinlich sinnvoller als voller prozeduraler Clay.

Der volle Clay-Look kann trotzdem im Nahbereich bestehen bleiben.

## Bestehende Donoren

WorldDesign Lab v1:
`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/`

Wichtige Dateien:
- `deliverables/wd-look.js`
- `deliverables/wd-macro.js`
- `deliverables/textures/derek-rgb-ref.png`

Bestehender Materialpool:
`media/3D_Assets/Textures/`

Aktuelle Clay-/Performance-Evidence:
- `evidence/WC1_CLAY_PARTS_2026-10-01.json`
- `clay-perf/WORLDDESIGN_LAB_FALLBACK_HYBRID.md`

## Genau der nächste praktische Schritt

**Global Clay Lite bauen und messen.**

Nur zwei Clay-Spender:
`Clay002` und `clay_floor_001`.

Eine einzige 512² globale Textur wird ausgewählt und triplanar in der bestehenden Inselwelt getestet.

Danach erst kommt Derek RGB als zweiter Ein-Textur-Vergleich.
