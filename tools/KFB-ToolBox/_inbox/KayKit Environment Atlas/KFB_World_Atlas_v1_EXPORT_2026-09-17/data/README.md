# data/

**Leer, absichtlich.**

Kataloge, Presets, Rezepte und Seeds liegen in diesem Projekt **nicht** als Datendateien, sondern
als Tabellen und Regeln im Code:

| Inhalt | Ort |
|---|---|
| Pack-Basispfade (23) | `../source/lib/kit-lab.js` · `PACKS` |
| Hex-Kachelwahrheit (18 Kacheln, 6 Kanten) | `../source/lib/hex-grid.js` · `TILE_EDGES` |
| Dungeon-Bauteilliste und Fugenregeln | `../source/lib/dungeon-grid.js` |
| Lichtstimmungen (Promo / Fackeln / Nacht) | `../source/lib/dungeon-light.js` |
| Straßenanschlusstabelle (gemessenes Höhenprofil) | `../source/lib/road-solver.js` |
| Maße aller Bauteile | **zur Laufzeit gemessen** (`measured`), nicht gespeichert |

Es gibt keinen Browserzustand: projektweit 0 Treffer für `localStorage`, `sessionStorage`,
`indexedDB`. Ein Layout wird über **Saat + Parameter + Feldgröße** reproduziert, nicht über eine
gespeicherte Datei.

S13.2 kann ein Recipe-JSON **exportieren** (`kaykit-dungeon-s13-2.recipe.json`, Struktur in
`../docs/RECIPE_MAPPING_A0.md` §2.5). Ein Beispielexport liegt hier **nicht** bei: er wäre eine
Momentaufnahme einer Saat und keine Projektdatei. Er ist mit einem Klick erzeugbar.

Dieses Verzeichnis wurde nicht mit erfundenen Katalogdateien gefüllt.
