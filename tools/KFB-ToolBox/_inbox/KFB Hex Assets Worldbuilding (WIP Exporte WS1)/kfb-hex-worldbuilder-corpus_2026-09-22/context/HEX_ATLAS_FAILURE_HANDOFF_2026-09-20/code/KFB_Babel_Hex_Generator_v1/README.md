# KFB · Babel Hex Platform Generator v1

Ein Turm aus **Hex-Bändern**, gebaut aus den zwei KayKit-Hex-Packs, mit gerechneten
Sprungweiten und drei Modi in einer Seite: **Editor · Chill & Fun · Play**.

Slice-Rahmen nach `WORKFLOW.md`:

- **Ziel** — ein seedbarer Hex-Plattform-Turm, den man vom Start bis zum Ziel wirklich
  hochkommt, mit Editor und zwei Spielweisen.
- **Eigentümer** — dieses Paket. Bauteilkunde bleibt beim `KFB_Hex_Baukasten_S0`,
  Licht/Schatten bei `KFB_Free_Roam_Platformer_v1/src/lighting.js`, das Hex-Gitter bei
  `hexrealm/lib/hex-grid.js`, die Bewegungswerte bei
  `KFB_Free_Roam_Platformer_POC_v0/data/movement-config.json`.
- **Quelle** — `georg-doc/kayfabizarro@main`; Modelle über raw, nichts kopiert.
- **Geschützte Grenze** — kein Eingriff in Baukasten, POC, v1, hexrealm. Der bestehende
  Dungeon-Generator S13.2 wird **nicht** angefasst; von ihm kommt nur das UI.
- **Fertig, wenn** — 20 feste Saaten ohne zu weite Stufe planen UND der simulierte Aufstieg
  in Chill & Fun bei allen 20 Start → Ziel schafft.

## Was gemessen ist und was gerechnet

| Größe | Herkunft |
|---|---|
| Kachelmaß 2.00 × 2.31, Stufe 1.00 | Laufzeitmessung der Hexagon-Pack-Kacheln (`moduleMetrics()`) |
| Scheitel 2.82 · Doppelscheitel 4.65 | gerechnet aus impulse 13.0 / 10.5 und gravity 30.0 |
| Reichweite flach 7.80 · doppelt 12.1 | Laufgeschwindigkeit 9.0 × Flugzeit |
| erlaubte Lücke | Reichweite × 0.82 (Landung IN der Kachel, nicht auf der Kante) |
| Lücke je Stufe | Abstand der nächsten Zellmitten minus zwei Inkreise |

Die drei Zahlen aus `movement-config.json` (apexHeight, airTimeFlat, flatReachAtRun) wurden
nachgerechnet und stimmen. **Nicht** übernommen wurde die Weltskala des kubischen Packs —
hier zählt die gemessene Hexkachel.

## Die drei Modi

**Editor.** Bänder anklicken, Höhe ±, näher/weiter, schwenken, löschen. Nach jeder Änderung
wird neu gemessen; die Liste »Climb« zeigt je Stufe Höhe, Lücke, erlaubte Lücke und Klasse
(direct · double · far). Bögen und Ringe in der Szene sind derselbe Befund in Farbe.

**Chill & Fun.** Drei Regeln, jede gegen einen konkreten Verlustfall: kein Schritt über die
Kante (der Schritt wird zerlegt, man rutscht an der Kante entlang), ein Sprung mit Ziel
bekommt seinen Bogen gerechnet und landet, ein Sprung ohne Ziel kommt auf dasselbe Band
zurück. Der zweite Impuls eines geplanten Doppelsprungs feuert im Scheitel von selbst.

**Play.** Gleiche Werte, keine Hand. Fällt man unter das Rettungsmaß, setzt der Turm einen
an der letzten belegten Zelle ab.

Kamera in allen Modi: freie Orbit-Kamera, **Zoom auf den Cursor** (`zoomToCursor`). Im Spiel
wandert nur das Ziel mit; die Blickrichtung bleibt die des Spielers.

## UI

Übernommen vom Dungeon-Generator `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`:
eine 38-px-Zeile, die nie umbricht (schmal wird sie scrollbar, nicht hoch), die Leiste hinter
`☰` und rechts eingeblendet (unter 1100 px als Overlay), `⛶` für die reine Ansicht, Escape
zurück. Weggelassen: Herkunfts-, Lizenz-, Registry- und Ladeprotokoll-Tafeln — in der Leiste
stehen nur Bau, Aufstieg, Auswahl und Tasten.

## Tests (tatsächlich gelaufen, 19.09.2026)

- `TESTED RESULT` · 20 feste Saaten (Bänder 10–14, Größe 5–10, Doppelsprung an/aus):
  **20/20 ohne zu weite Stufe**, 0 abgelehnte Platzierungen im Endstand.
- `TESTED RESULT` · simulierter Aufstieg in Chill & Fun über dieselben 20 Saaten:
  **20/20 Start → Ziel**, 0 Rettungen.
- `TESTED RESULT` · Play, Kante überlaufen: Sturz und Rettung an der letzten Zelle greifen.
- `TESTED RESULT` · CapsuleCarl über `mountCarl()` gemountet, Faktor ×1.054 gemessen.
  Schlägt der Leser fehl, bleibt eine als solche gekennzeichnete Kapsel stehen.
- `NOT_TESTED` · Touch/Mobil, Gamepad, PPTX/PDF-Export, Stage-Deploy.
- `GEORG ACCEPTANCE` · offen.

Zwei Befunde, beide aus dem Bild, nicht aus der Messung:

1. Der erste Lauf war **keine** Turmarchitektur, sondern eine flache Wolke: die Stufenhöhe
   kam aus »1 bis 3 Stufen«, die Lücke aus der vollen Reichweite (3,9 Kacheln). Jetzt kommt
   die Stufenhöhe aus dem gemessenen Scheitel und die Lücke ist auf 2,2 Kachelbreiten
   gedeckelt. Die Reichweite ist die Schranke, nicht die Bauvorgabe.
2. Jedes braune Band stand auf einem grünen Sockel — die Fülllage griff irgendeine
   Deckkachel statt der Grundkachel des Bioms.

## Offene Prüffrage

Der Aufstieg ist derzeit **eine Kette**: Band i hängt nur an Band i−1. Soll v2 Abzweige und
Rückwege (zwei Wege nach oben, eine Abkürzung nach unten) bekommen, oder bleibt die
Lesbarkeit der einen Linie der Wert?

## Dateien

```
index.html      UI (S13.2-Sprache), Importmap
src/tower.js    Rezept: Bänder, Höhen, Sprungmathematik, Klassen, Export
src/build.js    Rezept → Szene: Deckkacheln, Sockel, Deko, Bögen, Auswahlring
src/player.js   Bewegung, die drei Chill-Regeln, Play-Physik, CapsuleCarl
src/app.js      Renderer, Kamera, Bestand → Kit, Leiste, Modi, Picking
```

Kein GitHub-Push (Projektregel): Lieferung ist Preview plus Export.
