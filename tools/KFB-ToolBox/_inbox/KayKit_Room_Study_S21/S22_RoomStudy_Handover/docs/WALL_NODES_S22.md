# Wandknoten · gemessene Platzierungsregel (S22)

Vertragsdokument. Gilt für jeden Raum, in dem ein Wandzug endet, abzweigt oder sich kreuzt.
Gemessen mit `tools/probe-wall-nodes.html`, geteilt als `nodeFrame()` in `lib/dungeon-grid.js`,
angewendet in `buildRoom()` (`lib/room-recipes.js`).

## 1 · Ein Knoten ist ein Gitterpunkt mit n Armen

Ecke, T, Kreuz und freies Ende sind **derselbe Fall**. Aus der Zahl der Wandarme an einem
Gitterpunkt folgt das Teil:

| Arme | Fall | Teil (Rezeptfeld) |
|---|---|---|
| 1 | freies Ende | `enden` — z. B. `wall_endcap`; **ohne Eintrag bleibt das Ende offen** (Bühnendiorama) |
| 2 gegenüber | gerade Wand | kein Teil |
| 2 über Eck | Ecke | `ecke` — `wall_corner` oder `wall_corner_small` |
| 3 | T-Knoten | `tTeil`, Standard `wall_Tsplit` |
| 4 | Kreuzung | `kreuzTeil`, Standard `wall_crossing` |

## 2 · Das Gelenk gehört auf den Gitterpunkt, nicht die Boxmitte

`nodeFrame()` liest aus der Draufsicht, welche Randflächen eine **Platte** sind (Randspanne
zwischen 0,95 und 1,15 der gemessenen Wanddicke). Quer zum Arm liegt das Gelenk auf der
Plattenachse, längs zum Arm auf der Mitte der Gegenarme — und wo es keine Gegenarme gibt,
auf der **Anschlussfläche** selbst.

Beide Grenzen sind Messwerte, keine Vorsicht: ohne Untergrenze zählt beim `wall_endcap` die
verjüngte Seitenflanke (0,92) als Arm mit, ohne Obergrenze bei der geraden `wall` die 4,00
lange Flanke.

## 3 · Die Armweite entscheidet über das Nachbarmodul

| Teil | Box | Gelenk | Arme | Armweite | Nachbarmodul |
|---|---|---|---|---|---|
| `wall_endcap` | 1,07 × 4,00 × 1,00 | 0,00 / 0,00 | 1 (−x) | **0,00** | **bleibt ganz** — kragt 1,07 nach aussen aus |
| `wall_half_endcap` | 2,00 × 4,00 × 1,00 | −1,00 / 0,00 | 2 | 1,00 | bleibt ganz |
| `wall_Tsplit` | 4,00 × 4,00 × 2,50 | 0,00 / 0,00 | 3 | 2,00 | halbieren |
| `wall_crossing` | 4,00 × 4,00 × 4,00 | Mitte | 4 | 2,00 | halbieren |
| `wall_corner` | 2,50 × 4,00 × 2,50 | 0,00 / 0,00 | 2 | 2,00 | halbieren |
| `wall_corner_small` | 1,50 × 4,00 × 1,50 | −0,24 / 0,24 | 2 | 0,76 | bleibt ganz |

Schwelle: Armweite > Modul / 4 → die anschliessende Fuge wird `wall_half` und rückt um ein
Viertelmodul vom Knoten weg. Sind **beide** Enden einer Fuge gedeckt, entfällt sie ganz.

## 4 · Was die Regel für den Grundriss bedeutet

Ein T frisst an **drei** Seiten eine halbe Fuge. Teile, die sich nicht halbieren lassen —
`wall_doorway`, `wall_gated` — dürfen deshalb nicht neben einem T oder einer `wall_corner`
liegen. Praktisch: zwischen zwei Knoten braucht jede Öffnung eine **volle** Fuge. Genau daran
ist die erste R07-Fassung mit 7 × 5 gescheitert (nur eine volle Fuge in der Nordwand, und die
trug den Durchgang); mit 8 × 5 sind es zwei — Durchgang und Gitterfenster.

`buildRoom()` meldet den Fall, statt ihn zu verschlucken:
„Fuge 6,0 N: wall_gated ist nicht halbierbar und überlappt den Knoten".

## 5 · Grenzen dieser Messung

- `wall_corner_small` ist damit **nicht** zu erkennen (alle vier Randspannen ≈ Plattendicke).
  Ecken laufen weiter über `cornerFrame()`; `nodeFrame()` wird für Ecken nicht benutzt.
- `wall_doorway_Tsplit` (8,00 breit, Strebe 5,11) fällt aus dem Schema: zwei Module Länge und
  ein breiter Pfeiler statt einer Plattenabzweigung. Nicht verwendet, nicht geraten.
- Die abgeschrägten Varianten (`wall_sloped`, `wall_Tsplit_sloped`,
  `wall_half_endcap_sloped`) sind gemessen vorhanden, aber in keinem Rezept gesetzt.
