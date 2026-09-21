# Known Issues

> Dass die Modelle **nicht** im Paket liegen, ist kein Issue, sondern die Architektur:
> alle Assets via GitHub über die kanonische RAW-URL. Siehe `DECISIONS.md`.

## 1 · Assetbasis zeigt auf `main`, nicht auf eine Revision

`kit-lab.js:10` pinnt nichts. Ein Commit im Asset-Repo ändert rückwirkend das Ergebnis jeder
Seite, und jedes `AssetRef.revision` in `RECIPE_MAPPING_A0.md` ist deshalb `null`. Das ist der
größte Reproduzierbarkeitsmangel des Projekts. Empfehlung: RAW-URL auf einen Commit-SHA festlegen.

## 2 · S10 läuft auf einer anderen three-Version

14 Seiten nutzen 0.184.0, `KayKit_Cards_Hourglass_S10.html` nutzt 0.160.1. Nicht untersucht, ob
S10 auf 0.184.0 läuft. Nicht angeglichen, weil ungetestet — ein stiller Versionssprung wäre eine
Änderung ohne Nachweis.

## 3 · `tools/registry-probe.html` zeigt auf einen Branch

Die Sonde liest `registry/assets/v1/catalog.jsonl` von `bot/asset-registry-update`. Existiert der
Branch nicht mehr, ist die Sonde toter Code. Betrifft keine Produktseite.

## 4 · Kein Rezept-Import

S13.2 exportiert ein Recipe-JSON, kann aber keines laden. Ein exportiertes Layout ist damit
Dokumentation, nicht Wiederherstellung. Reproduzierbar ist ein Layout nur über Saat + Parameter.

## 5 · Pack-Lücken im FREE-Tier (kein Fehler, sondern Bestand)

`docs/PACK_GAPS.md` führt sie. Wesentlich: kein Schachsatz (S8 nutzt eigene Geometrie, bewusst und
dokumentiert), kein Brücken-/Tunnel-/Gebäude-/Laternenteil im Racing-Kit, keine Brüstungsecke und
kein halbes Brüstungsstück im Dungeon-Pack, kein Feld/Mauer/Zaun/Brücke/Marktstand im Hexagon-Pack —
weshalb dort keine Straße den Fluss kreuzt.

## 6 · `KayKit_BoardGameBits` und `kenney_racing-kit` sind nicht auflistbar

Die GitHub-Tree-API listet für diese Packs keine Modelle, obwohl Roh-URLs laden. Namen müssen per
Ladeversuch geprüft werden. Ein Verzeichnislisting als Wahrheitsquelle funktioniert hier nicht.

## 7 · Lizenznachweise unvollständig im Paket

`licenses/` enthält nur `License.txt` des Medieval Hexagon Pack — die einzige Lizenzdatei, die im
Projekt liegt. Für Dungeon, City Builder, Forest Nature, RPG Tools Bits, BoardGame Bits und die
Kenney-Kits ist die Lizenz im Projekt **nicht** als Datei vorhanden (im Code als „CC0 · Kay Lousberg"
bzw. „CC0 Kenney" geführt). Aus Besitz und Dateinamen folgt keine Freigabe zur öffentlichen
Rohdatenverteilung; die Nachweise gehören aus dem Asset-Repo nachgezogen.

## 8 · Mobile ungetestet

Responsives Layout unter 1100 px existiert und ist im Browser geprüft, aber nicht auf Hardware.
