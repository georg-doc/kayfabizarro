# KFB Babel Tower S2b → Hex Platform Generator v1

Status: **P1 · BRIEFING CURRENT · SOURCE EXPORT GATE OPEN**  
Datum: 2026-09-19  
Primärer Arbeitsweg: ChatGPT Web / Coding Agent  
Claude Design: nur als belegte visuelle Quelle, nicht als Generator-Owner

## Ziel

Aus dem brauchbaren **KFB_Babel_Tower_S2b**-Ansatz wird ein kleiner, reproduzierbarer Hex-Plattform-Generator: nicht aus den bisherigen kubischen Platformer-Assets, sondern aus den beiden KayKit-Hex-Baukästen. Er erzeugt bewusst aufgebaute Höhenpfade, die mit dem aktuellen Player wirklich erreichbar sind.

Der Babel-Turm ist dabei ein **gemessener Design-Donor**, kein Befehl, die vorhandene Claude-Komposition oder ihren Code blind zu übernehmen.

## Was S2b bereits wertvoll macht

Der Screenshot zeigt eine relevante Prüflogik: direkte Stufen, Doppelsprung-Stufen, belegte Kontaktflächen, gesetzte Verbinder und eine sichtbare Höhenarchitektur. Diese Ideen bleiben erhalten:

- Weg ist wichtiger als Fläche
- Höhe ist messbar
- Kontakt/Anschluss ist sichtbar
- Sprung ist begrenzt und nachvollziehbar
- ein Turm kann aus kleinen, lesbaren Bändern bestehen

Die angezeigten Zahlen sind **Recovery-Hinweise**, nicht universelle Maße. Sie müssen gegen den aktuellen KFB-Player, das tatsächliche Raster und die echten KayKit-Modelle neu geprüft werden.

## Quellen und Katalog

- Öffentlicher Katalog: https://kayfabizarro.pages.dev/asset-librarian/
- Maschinenlesbare Packliste: https://github.com/georg-doc/kayfabizarro/tree/main/registry/assets/v1/packs
- Hex Pack A: `kaykit-medieval-hexagon-pack-1-0-free`
- Hex Pack B: `kaykit-medieval-builder-pack-1-0`
- Raster-/Kanten-Donor: `tools/world_atlas/source/lib/hex-grid.js` mit `TILE_EDGES`
- Vorhandene Resident-Hex-Welt und ihre Trägerteile
- verwandter, allgemeiner Brief: `HEX_TERRAIN_GENERATOR_V1_BRIEF.md`

Der vollständige ausführbare S2b-Export ist auf GitHub noch nicht eindeutig auffindbar. Bis er als Export/Commit mit Pfad belegt ist, bleibt der Screenshot **visuelle Recovery-Evidenz**; kein Chat darf den angeblichen S2b-Code erfinden.

## Gates

### BT0 · S2b-Quelle sichern

- vollständigen S2b-Export oder gepinnten GitHub-Pfad ablegen
- tatsächliche Player-/Sprungwerte und Kameramodus notieren
- die sichtbaren Bauteile ihren echten Packpfaden zuordnen
- Salvage klar trennen: Mess-/Kontaktlogik behalten; große automatische Insel-/Diorama-Komposition nicht übernehmen

Ohne BT0 nur Katalog- und Messarbeit, kein Turm-Generator.

### BT1 · Zwei Hex-Packs verstehen

Für beide Packs sichtbar belegen:

- Boden, Rand, Hang, Stufe, Brücke/Verbinder, Bauwerk, Deko
- Footprint, sechs Kanten, Pivot, Unterkante, Höhe und erlaubte Nachbarn
- Material-/Skalenunterschiede
- welche Teile tragend sind und welche nur erzählen

Die beiden Packfamilien dürfen nebeneinander stehen, aber ihre Maße/Anschlüsse werden nicht stillschweigend gleichgesetzt.

### BT2 · Drei Modulbeweise

Noch kein Zufallsgenerator:

1. zwei benachbarte flache Hex-Module
2. ein anschließender Höhenwechsel
3. eine Brücke/Engstelle oder ein Verbinder

Zu jedem: Draufsicht, Seitenansicht, Spieleransicht, Kontakt-/Kollisionsbeleg und gemessene Erreichbarkeit.

Wenn eines scheitert, wird es repariert oder dokumentiert — keine neue Insel bauen.

### BT3 · Babel-Recipe-Generator

Erst danach erzeugt ein seedbarer Recipe-Generator 8–14 Stufen/Bänder:

- Start, ein klarer Hauptweg, ein Ziel/Observatorium
- direkte und, falls belegt, Doppelsprung-Übergänge als explizite Klassen
- Verbinder nur an erlaubten Kanten
- Start → Ziel immer erreichbar
- kein offener tragender Rand, kein schwebendes Trägerteil
- Resident- oder Scenery-Punkt erst nach belastbarer Geometrie
- Debug zeigt Höhe, Kontakt, Sprungklasse und abgelehnte Platzierung

Kein endloser Turm, keine randomisierte Dekorwolke, keine kubische Default-Plattform als Ersatz.

## Lieferung

- Branch: `chatgpt-web/babel-hex-generator-v1-2026-09-19`
- Stage nach erfolgreichem Browser-Test: `/kfb-hub/stage/minigames/babel-hex-generator-v1/`
- `SOURCE.json`, `MODULE_LIBRARY.json`, `BABEL_RECIPE.json`, `RETURN.md`, `TEST_REPORT.md`, Bilder und additiver Changelog
- PR ohne Auto-Merge; erst menschlicher Lauf-/Lesbarkeitscheck

## Starttext für einen frischen Web-Chat

```
Work from current georg-doc/kayfabizarro main. Read the full Babel Hex Platform Generator brief, the general Hex Terrain Generator brief, the C0 catalog brief, the Asset Librarian recon brief, the fresh-chat protocol and use-what-works rule.

First locate and pin the complete KFB_Babel_Tower_S2b export. If it is not present, report that exact missing source and do only BT1/BT2 catalog-and-measurement work. Use both KayKit Hex packs, never cubic platformer defaults. Reuse the proven grid/contact ideas, but remeasure every jump against the current player.

Build only three measured modules before a small 8–14-step seeded Babel recipe. Return a branch, PR, fixed KFB Stage URL, module library, recipe, tests, screenshots, changelog and one human gate. No auto-merge and no giant island.
```
