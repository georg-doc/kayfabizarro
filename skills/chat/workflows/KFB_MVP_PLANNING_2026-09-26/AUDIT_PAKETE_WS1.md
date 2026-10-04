# Audit-Pakete für WS1-Credits · Entwurf 2026-09-26

Idee: Du nutzt die Credits für **Kritik von außen**, nicht zum Bauen. Jedes Paket = ein frischer Chat, eine klare Frage, feste Eingaben (Links/Screenshots), Ergebnis = Befundliste mit Priorität. Im WS1-Chat jeweils `/design:design-critique` (Design) bzw. eine normale Audit-Anfrage (Technik/Game) starten und den Paket-Text einfügen.

Reihenfolge nach Nutzen: **1 → 3 → 2 → 4.**

## Paket 1 · Design-Critique: Cartoon-3D-Look
**Frage:** Liest sich KFB als eine zusammenhängende Cartoon-Welt im Geist von Hanna-Barbera-Hintergründen (Art Lozzi: flache, stilisierte Farbflächen, reduzierte Formen, starke Farbstimmungen) – und wo bricht es?
**Eingaben:** Hürth V2 (`/kfb-hub/pruefen/huerth-look/`), WorldDesign Lab, Landmark Pilot 06, Billboard B1, Graveyard, Vorhang v2, 3–5 Screenshots der Figuren mit Augen/Ohren.
**Gewünscht:** Stilregeln (Form, Farbe, Licht, Linie), was jede Seite verletzt, 5 wichtigste Korrekturen, eine Seite „KFB Look Bible“ als Vorschlag.
**Nicht:** neue Assets, Code.

## Paket 2 · Animation-Art-Critique
**Frage:** Haben unsere Bewegungen Cartoon-Appeal (Squash & Stretch, Anticipation, Timing) oder wirken sie wie Mixamo-Standard?
**Eingaben:** Motion Library v2 Contact-Sheets (#213), Orc-Band, Resident Disco S40, EarRig v5 Dangle, ToolBox-Stage.
**Gewünscht:** pro Clip-Gruppe was fehlt, welche 10 Clips zuerst veredelt werden sollten, wie ein KFB-Timing-Profil aussehen könnte.

## Paket 3 · Technik-Audit: Architektur & Baukasten
**Frage:** Ist die Architektur (ein Besitzer pro Zuständigkeit, Stage-First, Track Core als Daten, WorldBuilder-Vertrag, Hub-Registry) tragfähig, oder bauen wir parallele Wahrheiten?
**Eingaben:** #204 (Production Architecture v3), #219 (Track Core), #185 (ToolBox), #190 + World-r2-Failure-Paket, #202/#215 (Hub), Graveyard `tools/kfb-graveyard/`.
**Gewünscht:** Top-10-Risiken, doppelte Besitzer, fehlende Verträge, Vorschlag für eine Modulkarte; zusätzlich: prozedurale Welten & NPC-Sims mit schlankem Gedächtnis (AI-Town-Mechanik als Vorlage) – was ist realistisch im Browser?

## Paket 4 · Game-Design-Audit
**Frage:** Ergeben Reisemodi (Laufen, Fahren, Fliegen), Kampf, Karten/ChatterBox und Bewohner eine spielbare Schleife – oder sind es getrennte Demos?
**Eingaben:** MVP-Schleife aus `00_UEBERBLICK_MVP_WSA.md` (Region → laufen → Fahrzeug → Korridor → Landmark → Hub), Combat-Stage, Travel-Modi (TMB-2), Kartenregeln/Gameplay-Sim.
**Gewünscht:** Kernschleife in einem Satz, was davon schon trägt, fehlende Verben, Vorschlag für den ersten 10-Minuten-Spielablauf.

## Weitere Themen, falls Credits übrig
- Barrierefreiheit/Bedienbarkeit des Hubs (`/design:accessibility-review`).
- Performance-Budget im Browser (Draw Calls, GLB-Größen, WebGPU vs. WebGL).
- Lizenz-Check (Mixamo, KayKit, Kenney, OSM, MIT-Spender).
