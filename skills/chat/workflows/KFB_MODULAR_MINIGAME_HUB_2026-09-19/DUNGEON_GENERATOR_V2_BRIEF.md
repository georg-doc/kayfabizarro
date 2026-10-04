# Dungeon Generator v2 · produktiver KayKit Dungeon Raid

Status: **CURRENT BRIEF · COMBAT-DEPENDENT · IMPLEMENTATION NOT STARTED**  
Datum: 2026-09-19  
Arbeitsweg: **ChatGPT Web / Coding Agent**  
Generator-Owner: vorhandener World-Atlas-Dungeon-Generator S13.2  
Combat-Owner: `georg-doc/KFB-Combat-Arena`

## Entscheidung

Dies ersetzt die frühere, zu breite Fassung von Dungeon v2.

Der Dungeon bleibt **vollständig KayKit Dungeon Pack**: Architektur, Türen, Treppen, Requisiten, Fallen, Banner, Kisten und Schatzraum stammen aus dem originalen, registrierten Dungeon-Kit. **Tiny Treats gehören nicht in diesen Brief und nicht in den Raid.** Bakery, Diner und Küchen sind eine eigene Venue-Generator-Linie.

Es entsteht kein D01-Schaukasten und kein zweiter Dungeon-Generator. Der belegte S13.2-Generator bleibt der einzige Grundriss-, Zwei-Ebenen-, Treppen- und Recipe-Owner.

## Produktprobe

Ein Seed erzeugt einen begehbaren zweigeschossigen KayKit-Dungeon:

1. Eingang und klare Wegführung,
2. mindestens ein vertikaler Übergang,
3. eine gefüllte Schatzkammer,
4. nach freigegebenem Combat-Gate ein kleiner **Dungeon Raid** mit echten, nachweisbaren KayKit-Skelett-Mobs,
5. Rückkehr über eine neutrale Portal-/Tür-Naht in die aufrufende Stage.

Die Schatzkammer ist kein bloßes Icon: sie nutzt echte registrierte Dungeon-Requisiten – mindestens Kiste, Fass, Kiste/Crate, Tisch oder Stuhl, Banner und eine lesbare Gefahren- bzw. Fallenrolle, sofern die exakten Modelle im Pack vorhanden sind.

## Verbindliche Quellen

Zuerst vollständig lesen:

- `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
- `tools/world_atlas/source/lib/dungeon-grid.js`
- `tools/world_atlas/source/lib/dungeon-light.js`
- `registry/assets/v1/packs/kaykit-dungeon-pack-1-1-free-2.json`
- `skills/session-entry-use-what-works_v1.md`
- [KayKit Dungeon Pack · Originalseite](https://kaylousberg.itch.io/kaykit-dungeon-pack)
- [Combat Arena Integration v2](./COMBAT_ARENA_INTEGRATION_V2_BRIEF.md)

Der Pack ist die äußere Asset-Grenze. Das bedeutet nicht, dass jede Datei in einem Raum liegen muss: jede verwendete Raum-Rezeptur benennt die exakten registrierten Modelle; eine kleine Kit-Galerie zeigt die relevanten Familien vollständig.

## Reihenfolge und Gates

### DG2-A · Kit- und Rezeptbeweis

- Register auslesen statt Namen zu raten.
- Familien sichtbar und messbar machen: Boden/Wand/Ecke, Tür/Gate, Treppe/Übergang, Säule/Decke, Licht, lesbare Requisite, Schatz, Gefahr.
- Den 1.1-Bestand für Treppen und Decken explizit prüfen.
- Für jedes Teil: exakter Pfad, Unterkante/Pivot, Rasteranschluss, Durchgangs- und Kollisionsrolle.
- Drei kleine, reproduzierbare Raumrezepte speichern: Eingang, Übergangsraum, Schatzkammer.

**Gate:** keine Ersatzgeometrie, keine Tiny Treats, keine unbestätigten Modellnamen.

### DG2-B · vorhandenen Generator erweitern

- S13.2 behält BSP-Grundriss, zwei Ebenen, Wände/Fugen, Treppen-zuerst und Recipe-JSON.
- Raumrezepte werden additiv zugeordnet; sie dürfen keinen zweiten Layout- oder Kollisions-Owner erzeugen.
- Seed-Reproduktion, zusammenhänglicher Weg, Tür- und Treppenfreiheit sowie Recipe-Import/Export im Browser prüfen.

**Gate:** Drei Seeds sind begehbar, deterministisch und ohne schwebende bzw. blockierende Props.

### DG2-C · gefüllte Schatzkammer

- Verteilung mit klarer Lesbarkeit: Hauptkiste als Ziel, unterstützende Beute/Requisiten, Banner/Licht zur Orientierung, eine sichtbare Gefahr.
- Nichts wird mit eigener Deko-Geometrie “nachgebaut”.
- Der Raum braucht einen sicheren Eintritt, einen freien Zielblick und einen freien Rückweg.

**Gate:** Screenshot und freie Laufprobe aus Eingang, Zielblick und Rückweg; Mensch entscheidet über Stimmung und Lesbarkeit.

### DG2-D · Raid-Adapter erst nach Combat-Gate

Der Dungeon besitzt nur Raum, Spawnpunkte, Begegnungs-Trigger und Rückkehr-Naht. Combat besitzt Spielerbewegung, Treffer, Schaden, Mob-Zustände, Defeat, Reward und VFX.

Voraussetzung ist die erfolgreiche **CA2-A/B**-Probe:

- FrizzleBob Driver Graft ist als sichtbarer spielbarer Actor bewiesen,
- zwei echte KayKit-Gegner-Rigs mitsamt Clips sind in der Arena bewiesen,
- ein konkreter KayKit-Skelett-Mob inklusive Modell, Clip und Lizenz/Registry-Pfad ist nachgewiesen.

Fehlt der letzte Nachweis, heißt der Status **MISSING_ASSET**, nicht “mit Ersatzmodell weiterbauen”. Keine künstliche Skeleton-Figur, keine neue Kampflogik im Dungeon.

## Lieferung

Kleiner Branch, kein Auto-Merge, fester KFB-Stage-Pfad:

`kfb-hub/stage/minigames/dungeon-raid-v2/`

Beilegen:

- `RETURN.md`, `SOURCE.json`, `TEST_REPORT.md`, additiver `CHANGELOG.md`;
- drei Seed-Rezepte und ihre exakten Asset-Listen;
- Kit-Galerie, Schatzkammer und – nur bei bestandenem Combat-Gate – Raid-Screenshot/Video;
- echte Browserchecks und genau **ein** menschliches Gate: Lesbarkeit, Loot-Raum, Combat-Lesbarkeit, Rückkehr.

## Nicht tun

- Tiny Treats in den Dungeon mischen;
- D01 als neue Architektur reanimieren;
- unregistrierte “passende” Props oder selbstgebaute Ersatzmeshes einsetzen;
- Combat, Generator und Portal in einen untrennbaren Owner verschmelzen;
- technischen Pass als Spiel-/Vibe-Freigabe ausgeben.
