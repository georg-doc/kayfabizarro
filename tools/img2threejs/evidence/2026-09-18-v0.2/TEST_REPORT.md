# Dom v0.2 · Geometriekorrektur · 2026-09-18

**Status:** IMPLEMENTATION + STATIC / NUMERICAL TESTED RESULT. Neuer Browserrender und Georgs Abnahme: **UNVERIFIED**.

## Anlass / sichtbarer Befund

Georg lieferte `Bildschirmfoto 2026-09-18 um 16.15.22.png`: Der vorherige Viewer zeigt tatsächlich ein Modell, aber große seitlich herausragende Dachpyramiden und störende Querstreben. Georg beurteilt die Grundstilrichtung als möglicherweise passend für KFB, sofern die Geometrie korrigiert wird. Das ist keine Abnahme der kaputten Geometrie.

Screenshot-SHA-256: `94bc857fb8165abe26521c365b3c05ee035232bedf4bc5d33c3d522689149bf8`; 164850 Bytes. Herkunft: Anhang dieses Chats. Die PNG selbst wurde nicht ins Repo kopiert; dieser Eintrag behauptet keinen dort vorhandenen Bildbeleg.

Die Codeursache ist konkret: v0.1 verwendet seitlich gedrehte `ConeGeometry`-Pyramiden als Langhaus-/Seitenschiffdächer. Das Problem ist nicht eine zu hohe Polygonzahl. Der vorherige Quellstand ist weiterhin unverändert verfügbar.

## Implementierter Eingriff

Neue, separate Quelle: [v0.2/index.html](../../prototypes/koelner-dom/v0.2/index.html), Quell-Commit `3df61d811e2bbb51af80ff8cb38d3a79b627ffe4`.

- Geschlossene Sattel- und Pultdachprismen statt liegender Kegel; durchgehend definierte Traufen und Firste.
- Eigenes geschlossenes Kreuzdach an der Vierung. Alle vier angrenzenden Dachquerschnitte treffen dessen Anschlusskoordinaten.
- Seitenschiffdächer am Querschiff getrennt; anschließende Wandhöhen und Chorabschluss angepasst.
- Originale Dimensionen der beiden Haupttürme, achtseitige Spitzen, Materialien und Beleuchtung beibehalten. Keine hochauflösende Neumodellierung.
- Unbegründete horizontale Stangen entfernt; kleine Türmchen mit Auflagepunkten im Baukörper; Streben zwischen expliziten Endpunkten.
- Plattform auf den Grundriss erweitert; einfache Fenster auf Außenflächen gesetzt.
- Bedienfeld außerhalb der 3D-Fläche, zusätzliche Front-/Seiten-/Rückansicht und an die verfügbare Fläche angepasste Kamera. Diese UI-Änderungen sind implementiert, nicht browsergeprüft.

## Tatsächlich ausgeführte Prüfungen

`node tests/check_roofs_v02.mjs` mit Node v22.16.0: **53/53 PASS**. [Unveränderte JSON-Ausgabe](geometry-checks.json).

Das Skript führt die echten, im ausgelieferten HTML enthaltenen Dach-Datenfunktionen aus. Es lädt weder Three.js noch einen Ersatzrenderer. Geprüft: endliche Positionen, Dreiecksflächen größer null, geschlossene Kantenpaare mit konsistenter Orientierung, positives Volumen, vier exakt übereinstimmende Dachanschlüsse, gemeinsame Trauf-/Firsthöhe, begrenzter Dachgrundriss, weiterhin achtseitige Hauptspitzen, Dependency-Pin und Syntax des vollständigen JavaScript-Moduls.

Die zehn Dachkörper verwenden zusammen **86 Dreiecke**: neun Prismen mit je acht Dreiecken und das Kreuzdach mit 14. Die Geschlossenheitsprüfung bezieht sich auf diese einzelnen Dachkörper, nicht auf ein global verschweißtes Gebäudemesh oder einen fertigen Collider.

### Ergänzende Quellrechnung zum Low-Poly-Budget

Indexdreiecke im Modell einschließlich Fundament, ohne Boden, Platz und Kontextwürfel. Dies ist eine anhand der Konstruktoren und Schleifen berechnete Inventur, **keine Browsermessung**.

| Bauteile | v0.1 | v0.2 |
| --- | ---: | ---: |
| Wände / Fundament | 84 | 84 |
| Alle Dächer / Fassadengiebel | 75 | 86 |
| Langhausstäbe | 48 | 0 |
| Haupttürme einschließlich ihrer alten/neuen Anbauten | 288 | 200 |
| Kleine Spitzen | 224 | 224 |
| Strebewerk | 288 | 192 |
| Fenster | 432 | 336 |
| Portal | 60 | 20 |
| **Summe** | **1499** | **1142** |

Grundlage: Box ohne Unterteilung = 12 Indexdreiecke; geschlossener Zylinder bei einer Höhenunterteilung = 4 × Radialsegmente; Kegel in Three.js r161 = 3 × Radialsegmente, einschließlich der dort mitgezählten entarteten Spitzendreiecke. [Gelesene r161-Zylinderquelle](https://github.com/mrdoob/three.js/blob/r161/src/geometries/CylinderGeometry.js), Blob `f27e14e7b6a761cd4371bd8f00e32e4caa9591bb`. Die Zahlen sind nicht mit sichtbaren Flächen oder Draw Calls gleichzusetzen. Der Viewer zählt die tatsächlich erzeugte Geometrie zusätzlich zur Laufzeit.

## Browsergrenze

Eine Umgebungsprobe mit dem vorhandenen v0.1-Viewer über `http://127.0.0.1:8765/` wurde vor dem Seiteneinstieg mit `net::ERR_BLOCKED_BY_ADMINISTRATOR` verweigert. Auch der direkte Browseraufruf der CDN-Bibliothek wurde blockiert; der Python-Netzabruf scheiterte an DNS-Auflösung. Es wurde keine Richtlinie umgangen.

Daher: kein eigener neuer WebGL-Frame, kein v0.2-Screenshot, kein Interaktions-/Mobile-PASS. Die mathematischen Dachprüfungen werden nicht in eine sichtbare Gesamtmodell-Abnahme umgedeutet. Georgs vorhandener Screenshot belegt nur den sichtbaren vorherigen Stand und dessen Fehler.

## Identität / Recovery

HTML: 16774 Bytes; SHA-256 `122960a8870f79c6c78d8b87fe01aedc73c2b469e4306e1900936528bf25c5c6`; Git-Blob `c0a3fd9d01b137f7819b3c90e5247a88686599aa` nach GitHub-main-Readback identisch zum lokalen Kandidaten.

Nächster Schritt: v0.2 öffnen, Front/Seite/Rückseite und freie Drehung prüfen. Hauptkriterien sind fehlende herausragende Dachpyramiden, geschlossene Anschlüsse, aufliegende Türmchen und freie Sicht trotz Bedienelementen. Architekturtreue, Mobile-Performance, GLB-Export und ToolBox-/World-/Race-Integration bleiben offen. Original und v0.1 nicht verändern.
