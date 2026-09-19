# S13.4 · Requisiten-Durchgang (Dungeon-Generator)

Stand 2026-09-17. Umgesetzt in `lib/dungeon-grid.js` (Katalog, Platzierung, `layout()`) und
`KayKit_Dungeon_Generator_S13_2.html` (Messung, Prüfungen, Plan, Schieber „Requisiten").
Grundlage: `docs/HANDOFF_dungeon_props_S13_3.md`. Bloom weiter zurückgestellt.

## Regel

Georgs Wahl aus dem Handoff, unverändert umgesetzt: **Raumbedeutung UND Streu**, Dichte ~30 %,
Requisiten an den **Rändern**, die Zellmitte bleibt frei. Eine Requisite sitzt in einer **Zelle**,
nie auf einer **Fuge** — damit ist der Wegegraph strukturell unberührt, nicht bloss geprüft.

Sechs Bedeutungen je Raum, gewürfelt aus der Saat: `lager`, `werkstatt`, `wohn`, `beinhaus`,
`schatz`, `leer`. Die Bedeutung gewichtet den Katalog; `leer` setzt nichts.

## Bestand, per Ladeversuch gemessen (nicht angenommen)

38 Kandidatennamen probiert, **13 existieren** im FREE-Tier:

`barrel_small`, `chest`, `chest_gold`, `bed_floor`, `table_small`, `chair`, `stool`, `shelves`,
`candle_melted`, `candle_triple`, `shelf_small_candles`, `banner_shield_white`, `keyring_hanging`

Verworfen (nicht im Pack): barrel, barrels, crate, crate_small, crates, box, chest_open, bed,
table, bench, bookcase, shelf, bones, bone, skull, skulls, rubble, rocks, sack, sacks, pot, pots,
bucket, ladder, coin_stack. Die Liste steht als Prüfzeile in der Seite — sie ist die Einkaufsliste,
falls Georg nachliefert.

## Was ein Platz können muss

| Bedingung | Zahl | Herkunft |
|---|---|---|
| Wand ist `solid` und trägt ein Teil | — | Fugenliste |
| kein Überstand in diese Zelle | `wall_pillar` 0,24 · `wall_shelves` 0,36 | gemessene Rahmen |
| keine Fackel auf derselben Fuge | — | S13.3 |
| keine Kerze in derselben Zelle | — | S13.3 |
| nicht im Treppenstreifen | A, B, C | `model.stair` |
| nicht an einer Brüstung (`barrier`) | 1,10 hoch · 0,50 tief | gemessen, sonst 0,37 Durchdringung |
| Wandabstand | Wandfläche + 0,15 | `faceFront/faceBack`, nicht Nenndicke |
| freie Mitte, Zelle **ohne** Durchgang | ≥ 0,30 | Weg bleibt begehbar |
| freie Mitte, Zelle **mit** Durchgang | ≥ 0,70 | halbe Breite der Türstrahlprobe (±0,6) + Luft |
| Breite längs der Wand | ≤ Modul − 1,2 | `wall_corner`-Schenkel belegt 0,5 um die Wandlinie |

Wandrequisiten hängen über dem Boden und kosten keinen Weg. Sie sitzen nur auf `wall`/`wall_half`
(`wall_cracked` ist dicker als seine Platte — das Banner steckte dort 0,11 in der Ausbuchtung), nie
auf einer Fuge mit Fackel, nie zweimal auf derselben Fuge und **nie auf derselben Wandseite wie
eine Bodenrequisite** (`shelves` steht 0–1,95 und hängt 1,22–3,18: gemessen 0,44 Durchdringung).

## Anker: die Asymmetrie der eigenen Box

Die Regel aus S13.3 gilt — mit **einer Korrektur**: „Asymmetrie ≈ 0 → Pivot auf die Mittellinie der
Wand" stimmt nicht bei 1,00 dicker Platte. `keyring_hanging` (Tiefe 0,38) verschwand damit
vollständig **in** der Wand, gemessen 0,38 Durchdringung. Richtig ist: eine mittige Box trägt
keinen Standoff, der Abstand muss von aussen kommen — **Wandfläche + halbe Eigentiefe**.

## Gates (alle grün, A1 und Q7, 8×8 und 16×16)

Neu:
- **Zellmitte bleibt frei (gerendert)** — kürzester Abstand AABB → Zellmitte, an der fertigen Szene
- **Requisiten stehen auf dem Boden** — Bodenkontakt ± 0,03, gemessen, nicht gesetzt

Mitgeschärft:
- **Strahlprobe · door begehbar** — Requisiten liegen jetzt **mit** im Strahl, und die Zeile nennt
  das versperrende Teil beim Namen. Genau das hat den 0,70-Wert gefunden: ein `table_small` mit
  0,55 freier Mitte hat die Tür an Fuge 3.5,6 versperrt.
- **Echte Durchdringungen** — Requisiten sind Teil des Fussabdruck-Audits.
- **Draufsicht · Zellmitte trägt Boden** — Requisiten werden in der Pixelprobe wie Wand eingefärbt,
  eine Kiste über der Zellmitte fällt also im Bild auf.
- **Leseprobe** — ein Schrank vor der einzigen Fackel drückt die Luminanz seines Raums; die Zeile
  „Jeder Raum hat eine lesbare Zelle" ist damit auch das Gate für Requisiten.

## Bedienung

Schieber **Requisiten** in der Leiste (Abschnitt Aufbau), 0–60 %, Standard 30. `0` schaltet den
Durchgang ab. Die Draufsicht zeichnet Bodenrequisiten als Rechteck in Originalgrösse am Rand,
Wandrequisiten als Punkt. Recipe JSON enthält `props` und `propDensity`.

## Offen

- **Nachlieferung**: Falle, Statue, Sarkophag, Altar, Käfig, Kronleuchter, Kohlepfanne und ein
  `candle_stand` fehlen weiter. Mit 13 Teilen ist die Streuung dünner als die Bedeutungen
  versprechen — `beinhaus` hat derzeit kein einziges eigenes Teil und fällt auf Kerzen zurück.
- **Fremdatlanten** (`HalloweenBits`, `GLB_graveyard`, `RPGToolsBits`) brauchen einen Eintrag in
  `PACKS` (`lib/kit-lab.js`) und eine Maßstabsprobe, bevor sie in den Katalog dürfen.
- **Bloom** weiter zurückgestellt.
