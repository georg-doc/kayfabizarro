# HUD Papier – Photoshop-Vorlage R2

Datei: `HUD_Papier_Vorlage_R2.psd` (3200 × 1800 px). Das ist das Spielbild in doppelter Größe (16:9). Gemessen am 20.11. im laufenden Spiel.

## So benutzt du sie
1. Öffne die PSD. Jedes Papierteil ist eine eigene Ebene, liegt an seiner echten Stelle und heißt wie die Datei, die das Spiel lädt.
2. Male oder lege dein neues Papier in diese Ebene, oder ersetze ihren Inhalt. Innerhalb des pinken Rahmens bleiben, ausgerissene Ränder und Transparenz sind erwünscht.
3. Die Ebene **Referenz · Knöpfe heute** zeigt, wo die Knet-Knöpfe, Pfeile, die Karte und das Porträt sitzen. Die kommen weiter aus dem Spiel. Das Papier muss unter ihnen Platz lassen, darüber malst du nichts.
4. Die Ebene **Maße** vor dem Export ausblenden. **Referenz · HUD heute** ist ein ausgeblendetes Bildschirmfoto zum Vergleichen.
5. Export: *Datei → Exportieren → Ebenen als Dateien* (PNG-24 mit Transparenz, „Auf Ebeneninhalt zuschneiden“), oder pro Ebene *Exportieren als* mit 100 %. Die Dateinamen bleiben die Ebenennamen.
6. Die PNGs in einen Ordner legen und mir sagen, wo. Ich setze sie ein, kein Umbenennen nötig.

## Maße (Pixel in der Vorlage)
Breite × Höhe, linke obere Ecke x / y. Im Spiel ist alles halb so groß (Bezugshöhe 900).

| Ebene | Größe | Lage x / y | hängt an | wofür |
|---|---|---|---|---|
| `streifen_radio` | 672 × 152 | 556 / 60 | links oben | Radio: Pause, Weiter, Ton, Pfeil |
| `streifen_fluff` | 1160 × 224 | 1244 / 28 | links oben | Fluffleiste: 6 Kugeln + Pfeil |
| `karte_rund` | 412 × 412 | 2744 / 24 | rechts oben | runde Minimap (Karte innen 344 px rund) |
| `tag` | 380 × 68 | 2760 / 444 | rechts oben | Zielschild unter der Karte |
| `rund_klein` | 140 × 140 | 2608 / 40 | rechts oben | Zahnrad (darunter gleiche Größe: Szenen-Knopf) |
| `leiste_v` | 148 × 660 | 40 / 600 | links | Leben (links); rechts gespiegelt = Tempo |
| `leiste_v_rechts` | 148 × 660 | 3012 / 600 | links | Tempo (heute gespiegelt aus leiste_v; eigene Datei geht auch) |
| `flicken_links` | 352 × 248 | 48 / 1508 | links unten | Inventar (Rucksack) |
| `flicken_rechts` | 352 × 248 | 2800 / 1508 | rechts unten | Reise (Fahrzeug) |
| `streifen_aktion` | 1272 × 300 | 964 / 1472 | Mitte unten | Aktionen: Faust, Bombe, Sprung, Hand |
| `stapel_almanach` | 480 × 386 | 28 / 28 | links oben | Almanach-Stapel (Kartenbild liegt darauf) |
| `portrait_rund` | 292 × 292 | 920 / 1464 | Mitte unten (mit dem Aktionsstreifen) | Rahmen ums Porträt (Bild innen 220 px rund) |
| `flyout` | 600 breit, Höhe wächst mit Inhalt | ausgeblendetes Beispiel | am Pfeil | Klappmenüs (Waffen, Würfe, Reise, Radio, Ziele, Szene). Breite 600 oder 760. Die Ränder so bauen, dass man das Papier in der Höhe strecken kann |

## Was beim Bauen zählt
- **Licht von oben links**: Schatten fallen nach rechts unten. Den Schlagschatten setzt das Spiel selbst; bitte keinen in die PNGs malen.
- **Breitere Bildschirme**: Teile mit „links“ bleiben links, Teile mit „rechts“ wandern mit dem rechten Rand, der Aktionsstreifen bleibt in der Mitte. Die Lücken dazwischen werden breiter, die Teile bleiben gleich groß.
- **Schärfe**: 2× reicht bis 1440p. Für 4K kannst du jede Ebene in 3× bauen. Das Seitenverhältnis bleibt gleich, ich skaliere dann.
- **Karte**: Das Spiel zeichnet in die Mitte von `karte_rund` einen Kreis von 344 px. Den Ring darum gestaltest du, die Mitte bleibt frei.
- **Porträt**: Das Bild ist ein Kreis von 220 px innerhalb von `portrait_rund`. Du baust nur den Rahmen.

Pfeile, Knöpfe, Fluffkugeln und Nadeln sind Knete aus dem Spiel und stehen nicht in dieser Runde.
