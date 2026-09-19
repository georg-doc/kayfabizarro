# Dungeon Generator v2 · Ausbau statt D01-Einzelraum

Status: **BRIEFING CURRENT · IMPLEMENTATION NOT STARTED**  
Datum: 2026-09-19  
Primärer Arbeitsweg: **ChatGPT Web / Coding Agent**  
Claude Design: nur für isolierte Raumstimmungs- oder Lichtstudien, nicht als Generator-Owner.

## Ziel

Der vorhandene, zuverlässige Dungeon-Generator wird weiterentwickelt. Es entsteht kein handgebauter D01-Schaukasten und kein zweiter Generator.

Ausgangspunkt:

- `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
- `tools/world_atlas/source/lib/dungeon-grid.js`
- `tools/world_atlas/source/lib/dungeon-light.js`
- KayKit Dungeon Pack aus dem zentralen Asset-Register
- aktuelle Katalogdaten und geeignete Tiny-Treats-Module

Der bestehende Stand kann BSP-Grundrisse, zwei Ebenen, Fugen/Wände, Treppen zuerst und Recipe-JSON. Der belegte Atlas-Stand nennt 108 erzeugte Grundrisse und zwei unabhängige Prüfungen. Das ist die Baseline, nicht neu zu bauen.

## Spielbare Zielprobe

Seed wählen → zweigeschossigen Dungeon erzeugen → Eingang betreten → mehrere klar unterscheidbare Räume erkunden → Treppe benutzen → Zielraum erreichen → Ausgang/Portal benutzen → zum aufrufenden Spiel zurückkehren.

## Ausbau in vier Gates

### DG2-A · Bauteile verstehen

- aktuellen KayKit-Dungeon-Bestand aus dem Register lesen
- Boden, Wand, Ecke, Tür, Treppe, Säule, Licht und Props als Familien zeigen
- zusätzliche geeignete Tiles und Requisiten aus Katalog/Kit belegen
- Tiny Treats trennen in modulare Innenraumteile und lose Dekoration
- pro Teil Pfad, Maße, Pivot/Unterkante, Anschluss, Kollisionsrolle und Belegstatus festhalten

Keine Dateien kopieren und keine zweite Asset Library bauen.

### DG2-B · Raumtypen statt Zufallsstreuung

Mindestens fünf verständliche Raumtypen:

- Eingang
- Aufenthalts-/Bewohnerraum
- Archiv oder Werkstatt
- Schatz-/Zielraum
- Treppen-/Übergangsraum

Jeder Raumtyp erhält Regeln für freie Laufzone, Wandabstand, Türfreiraum, Licht, große und kleine Props. Props werden über belegte Zonen gesetzt, nicht gleichmäßig verstreut. Tiny Treats kollidieren zunächst nur, wenn ein konkreter Kollisionsproxy geprüft wurde.

### DG2-C · Generator v2

- beide Ebenen bleiben vollständig verbunden
- gleicher Seed erzeugt dasselbe Ergebnis
- Raumtyp-Verteilung und Dichte sind einstellbar
- keine blockierten Türen, Treppen oder Hauptwege
- keine schwebenden oder doppelten tragenden Teile
- Raum-Rezept kann exportiert und wieder geladen werden
- Debugansicht zeigt Raumtyp, Laufzone, Anschlüsse und abgelehnte Platzierungen

### DG2-D · Instanziierter Eintritt

Ein kleiner Portal-/Tür-Adapter wird vorbereitet:

`materialisieren → öffnen → Instanz laden → Spawn setzen → Ergebnis speichern → Rückkehrpunkt wiederherstellen`

Zuerst im Dungeon-Stage beweisen. Noch keine direkte Kopplung an Race, Travel oder Combat. Die Portal-Tür ist ein wiederverwendbarer Übergang, nicht Eigentümer des Dungeons.

## Nicht Teil dieses Slices

- Kampflogik
- neue Spielerbewegung
- vollständige Hub-/Travel-Integration
- universeller World Builder
- zufällige Vermischung sämtlicher Packs
- visuelle Neugestaltung der bewährten Generatorlogik

## Prüfungen

- mindestens 20 feste Seeds automatisch prüfen
- Zusammenhang beider Ebenen und erreichbaren Ausgang belegen
- Türbreite und Treppenpassage mit aktuellem Test-Actor prüfen
- Recipe-Roundtrip ohne Positionsverlust
- drei sichtbare Seeds auf Desktop, Split-Screen und schmalem Mobilformat
- Draufsicht beider Ebenen plus Spielerhöhe in drei Raumtypen
- Generator-Baseline gegen Regressionen vergleichen
- „technisch grün“ und Georgs visuelles Urteil getrennt ausweisen

## GitHub-Rückgabe

- Branch: `chatgpt-web/dungeon-generator-v2-2026-09-19`
- Stage: `/kfb-hub/stage/minigames/dungeon-generator-v2/`
- `RETURN.md`
- `SOURCE.json`
- `TEST_REPORT.md`
- Recipe-Beispiele für mindestens drei Seeds
- 3–6 Screenshots
- additive Changelog-Notiz
- Pull Request ohne Auto-Merge

## Starttext für ChatGPT Web

```text
Arbeite aus dem aktuellen GitHub-main von georg-doc/kayfabizarro. Lies vollständig:
- skills/chat/START_HERE.md
- skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
- skills/session-entry-use-what-works_v1.md
- skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/DUNGEON_GENERATOR_V2_BRIEF.md
- tools/world_atlas/START_HERE.md, SOURCE_SNAPSHOT.md, docs/ARCHITECTURE.md und CHANGELOG.md

Erweitere ausschließlich den bestehenden World-Atlas-Dungeon-Generator S13.2 zu Dungeon Generator v2. Baue keinen zweiten Generator und keinen handgebauten D01-Schaukasten. Bewahre BSP, zwei Ebenen, Fugenmodell, Treppe-zuerst, Lichtdonor und Recipe-JSON.

Beginne mit DG2-A und DG2-B: aktuellen Bauteilbestand belegen und mindestens fünf klare Raumtypen mit freien Lauf-, Tür- und Prop-Zonen definieren. Nutze zusätzliche KayKit-Dungeon-Tiles und geeignete Tiny-Treats-Module nur aus dem zentralen Register. Keine Assetkopien, keine geschätzten Namen und keine zufällige Prop-Streuung.

Gehe erst danach zu DG2-C. Prüfe Determinismus, Ebenenverbindung, Tür-/Treppenfreiheit, Bodenkontakt und Recipe-Roundtrip über feste Seeds. DG2-D bereitet nur den wiederverwendbaren Portal-/Tür-Adapter innerhalb der Stage vor; Race, Travel und Combat bleiben unangetastet.

Arbeite in einem eigenen Branch, veröffentliche die feste Stage-Adresse und liefere RETURN.md, SOURCE.json, TEST_REPORT.md, drei Recipe-Beispiele, Screenshots, additive Changelog-Notiz und einen PR ohne Auto-Merge. Trenne Proposal, Implementation, Test und Georg-Akzeptanz.
```
