# Asset Librarian × Tiny Treats · Discoverability Recon v1

Status: **P0 PRE-GATE FOR C0 · BRIEFING CURRENT · IMPLEMENTATION NOT STARTED**  
Datum: 2026-09-19  
Owner: Asset Librarian / central Registry  
Consumer: C0 Baukasten catalog and ToolBox

## Befund

Tiny Treats Charming Kitchen 1.1 ist im zentralen Register vorhanden: **123 Einträge** — 118 GLTF-Modelle und 5 PNG-Texturen. Das Fehlen im Arbeitsgefühl ist somit kein Intake-Problem, sondern ein **Auffindbarkeitsproblem**.

Ein Pack gilt erst als verfügbar, wenn man es ohne internes Vorwissen über „Tiny Treats“, „Charming Kitchen“ oder die sichtbare Packfamilie findet. Ein roher Slug wie `tiny-treats-charming-kitchen-1-1-free` darf dafür nicht Voraussetzung sein.

## Owner-Grenze

- **Asset Librarian** bleibt die eine kanonische Suche, Vorschau und Quellenanzeige.
- **Registry** bleibt die maschinenlesbare Wahrheit für Asset, Pack, Pfad, Version und Status.
- **C0** erklärt Rollen und Kombinationen, kopiert aber keine Assets und baut keine zweite Bibliothek.
- **ToolBox** darf kuratierte Auswahl und Szenenrezepte verbrauchen, ist aber kein Ersatz für die Suche im Librarian.

Das Problem wird also im Librarian repariert; die ToolBox-Integration liest danach dieselben Auswahl-/Recipe-Daten.

## V1-Lieferung: klein, sichtbar, testbar

### AL1 · Pack direkt finden

- prominente Einstiegschips oder Pack-Kacheln für **Tiny Treats**
- Suche matcht Pack-Anzeigename, Pack-ID, Alias und Assetname
- „Charming Kitchen“, „Tiny Treats Kitchen“, „Küche“ und der technische Pack-ID führen zum selben Ergebnis
- Baked Goods und Charming Kitchen werden als Nachbarn verlinkt
- ein teilbarer Link öffnet die Packansicht direkt

### AL2 · Nicht nur Dateien, sondern Baukastenrollen

In der Packansicht vier lesbare Gruppen:

1. **Bauen** — modulare Wände, Ecken, Böden, Arbeitsflächen
2. **Einrichten** — Schränke, Geräte, Tische, Stühle
3. **Erzählen** — Utensilien, Backwaren, Kleinteile
4. **Prüfen** — noch ungemessene oder nur visuell bekannte Teile

Jede Karte zeigt Quelle/Pfad, Pack, Rolle, Größen-/Kollisionsstatus und einen klaren „für C0 merken“-Weg. Keine erfundenen Einsatzversprechen.

### AL3 · C0- und ToolBox-Brücke

- C0 kann eine kuratierte Auswahl als Scene Recipe/Module Manifest lesen
- ToolBox kann dieselbe Auswahl als Donorliste öffnen
- beide zeigen stets Registry-Revision und Asset-Pfad
- keine Datei-Kopie, kein zweiter Upload, kein konkurrierender Katalog

## Test

- Suche aus leerem Zustand nach „Tiny Treats“, „Charming Kitchen“, „Küche“ und Pack-ID
- direkter Packlink lädt auf Desktop und mobilem Browser
- 118 Modelle und 5 Texturen werden in der Packzusammenfassung korrekt ausgewiesen
- C0-Rezept verweist auf existente Quellen
- falscher oder alter Registry-Stand wird sichtbar als `STALE/UNKNOWN`, nicht still weiterbenutzt

## Starttext für einen frischen Web-Chat

```
Work from current georg-doc/kayfabizarro main. Read the Asset Librarian onboarding, registry schema, C0 Mini-Game Hub briefing, the Chat → GitHub → KFB Stage workflow, and this recon brief.

Treat Tiny Treats Charming Kitchen as present in the canonical registry but not discoverable enough for a human. Improve the Librarian only: pack-first entry, aliases/search, direct pack link, simple construction/scenery groups, and a C0/ToolBox recipe bridge. Do not build a second asset library, copy assets, or claim a semantic role without evidence.

Return a small branch, PR, fixed KFB Stage URL, before/after browser proof on desktop/mobile, exact registry revision, test report, changelog and one human review gate. No auto-merge.
```
