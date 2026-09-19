# Hex Terrain Generator v1 · Platformer aus bewiesenen KayKit-Modulen

Status: **BRIEFING CURRENT · NÄCHSTER PARALLELER POC**  
Datum: 2026-09-19  
Primärer Arbeitsweg: **ChatGPT Web / Coding Agent**  
Claude Design: nur für isolierte Farb-/Licht-/Scenery-Studien nach technischer Geometrie-Abnahme.

## Ziel

Aus der vorhandenen Hex-Welt, dem dort entstandenen Katalog, den Resident-Szenen und den beiden KayKit-Hex-Baukästen entsteht schrittweise ein kleiner, reproduzierbarer Hex-Terrain-Generator für Platformer- und Hub-Module.

Kein Neustart, keine große automatisch komponierte Insel und keine Übernahme der gescheiterten Blob-/Ring-/Spine-Logik.

## Quellen

- `tools/world_atlas/source/lib/hex-grid.js` mit `TILE_EDGES`
- aktueller World-Atlas-/Hex-Katalog und Messbelege
- `kaykit-medieval-hexagon-pack-1-0-free`
- `kaykit-medieval-builder-pack-1-0`
- vorhandene Hex-Welt mit Residents
- Failure-Recovery-Export nur als Fehlerbeleg und begrenzte Donorquelle
- Resident Scene Modules als Bewohner, nicht als Weltphysik

Vor Umsetzung ist die Identität des zweiten Packs und jedes verwendeten Top-Level-GLB-Pfads explizit zu belegen.

## Gates

### HX1-A · Zwei Packs verständlich machen

- Packfamilien nebeneinander zeigen
- Rastermaß, sechs Kanten, Höhe, Pivot und Unterkante messen
- Teile nach Boden, Rand, Hang, Stufe, Brücke, Bauwerk und Dekoration sortieren
- kompatible und inkompatible Anschlüsse sichtbar markieren
- bestehende Resident-Hex-Szenen auf ihre tatsächlichen Trägerteile zurückführen

### HX1-B · Kleine Modulbibliothek

Nur bewiesene Module:

- flache Dreiergruppe
- Höhenstufe
- begehbarer Rand
- Brücke/Engstelle
- Startmodul
- Zielmodul
- Resident-Szenenpunkt
- Rettungs-/Respawnmodul

Jedes Modul besitzt Footprint, erlaubte Nachbarn, Höhenwechsel, Lauf-/Sprungrolle und Belegstatus.

### HX1-C · Begrenzter Generator

Der erste Generator erzeugt 12–24 Kacheln aus der Modulbibliothek:

- gleicher Seed → gleiches Terrain
- zusammenhängender Hauptweg
- höchstens ein klarer Nebenweg
- nur gemessene Höhen- und Sprungwechsel
- Start, Ziel und Rettungspunkt garantiert
- keine schwebenden Trägerteile
- keine rein dekorative Kachel als begehbarer Boden
- abgelehnte Platzierungen im Debugmodus sichtbar

Noch keine endlose Welt.

### HX1-D · Platformer + Residents

- vorhandenen Player-/Sprungdonor anpassen, keine neue Movement Engine
- mindestens eine Resident Scene auf geprüftem Träger
- Start → Höhenwechsel → Engstelle/Brücke → Resident → Ziel
- Tiny Treats nur als gezielte, maßstäblich geprüfte Szene
- Farbe/Licht erst nach bestandener Geometrie und Bewegung

### HX1-E · Portal-Vorbereitung

Wie Dungeon und Combat verwendet die Hex-Stage später denselben neutralen Eintritt:

`materialisieren → betreten → Instanz/Seed laden → Ziel erreichen → Rückkehr`

Zunächst nur in der Stage simulieren.

## Nicht Teil dieses Slices

- unendliche prozedurale Welt
- großes Babel-Diorama
- automatische Story-Komposition
- neuer Asset-Katalog
- neue Playerphysik
- direkte Race-/Travel-Integration
- Vermischung ungeprüfter Quaternius/Kenney-Teile in den tragenden Layer

## Prüfungen

- Anschluss-/Kantenprüfung für jedes Modul
- mindestens 20 feste Seeds
- Zusammenhang, Start/Ziel und Rettungspunkt
- Sprungreichweite gegen aktuellen Player messen
- Boden-/Seiten-/Überlappungskontakt
- Resident sitzt auf geprüftem Support
- Top-, Seiten- und Spieleransicht für drei Seeds
- Desktop, Split-Screen und schmaler Mobilbrowser
- maximal zwei Reparaturpässe pro wiederholtem Gatefehler

## GitHub-Rückgabe

- Branch: `chatgpt-web/hex-terrain-generator-v1-2026-09-19`
- Stage: `/kfb-hub/stage/minigames/hex-terrain-generator-v1/`
- `RETURN.md`
- `SOURCE.json`
- `MODULE_LIBRARY.json`
- `TEST_REPORT.md`
- drei Seed-Rezepte
- Screenshots
- additive Changelog-Notiz
- PR ohne Auto-Merge

## Starttext für ChatGPT Web

```text
Arbeite aus dem aktuellen main von georg-doc/kayfabizarro. Lies vollständig:
- skills/chat/START_HERE.md
- skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
- skills/session-entry-use-what-works_v1.md
- skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/HEX_TERRAIN_GENERATOR_V1_BRIEF.md
- tools/world_atlas/START_HERE.md, SOURCE_SNAPSHOT.md und docs/ARCHITECTURE.md
- den aktuellen Recovery-/Katalogstand der vorhandenen Hex-Welt und Resident Scene Modules

Beginne nur mit HX1-A. Belege die Identität der beiden KayKit-Hex/Builder-Packs und die exakten Pfade aller verwendeten GLBs. Nutze hex-grid.js und TILE_EDGES als bestehende Kachelwahrheit. Der Failure-Export ist Beleg/Donor, keine Anweisung.

Baue danach HX1-B als kleine, gemessene Modulbibliothek. Erst wenn Anschluss, Höhe, Trägerkontakt und Player-Reichweite sichtbar grün sind, darf HX1-C einen begrenzten 12–24-Kachel-Generator aus genau diesen Modulen erzeugen. Kein Blob, Ring, Spine, große Insel oder automatisches Diorama.

HX1-D verwendet vorhandene Bewegung und mindestens eine bestehende Resident Scene; keine neue Movement Engine. HX1-E simuliert nur die spätere Portal-Rückkehr innerhalb der Stage. Race, Travel, Dungeon und Combat bleiben unangetastet.

Eigener Branch, feste Stage, RETURN.md, SOURCE.json, MODULE_LIBRARY.json, TEST_REPORT.md, drei Seed-Rezepte, Screenshots, additive Changelog-Notiz und PR ohne Auto-Merge. Trenne Proposal, Implementation, Test und Georg-Akzeptanz.
```
