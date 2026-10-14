# MOUTHS_GPT_R2 – TUNE: tieferer Anker, Kontaktschatten, Höhe ≤ 1,7×, Design C

Quellen (main, `media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/`; Kopien in `_src/`): sheet1 = A, sheet2 = B, `Claymation-Mund-Sprite-Sammlung.png` = sheet3 = C (dünne Wurst-Lippen).

## Inhalt
- `A/`, `B/`, `C/`: je 12 PNGs auf 512×512 mit Kontaktschatten, `noshadow/` (gleich ohne Schatten), `trim/` (enge Zuschnitte), `*_full.png` (ungestauchte Originale der hohen Formen) und `anchors.json`.
- `review/` 01–29: PNGs 1920×1080 (höchstens 4 Münder pro Bild, Vergleiche als Paare) und MP4-Clips mit 12 fps, dazu `jump_stats.json`.
- `_tools/cut_align.py` und danach `_tools/review.py`. Die FB-Retusche ist derselbe Code wie in R1 (`MOUTHS_GPT_R1/_tools/review.py`).

## Änderungen gegenüber R1
- **Anker:** Leinwand-Anker (256, 220) = Mitte + Lippenlinie von `closed`. Darüber bleibt Platz.
  - Geschlossene Formen setzen ihre Lippenlinie auf den Anker.
  - Offene Formen wachsen nach oben und unten: Oberkante Oberlippe = Oberlippe closed − upperLift × Zusatzhöhe.
- **upperLift:** gebacken 0,35. Getestet mit 0,3 und 0,4 (Clips 08/09, 17/18, 27/28). Für andere Werte gilt `dy_from_baked`.
- **Höhe:** A und B höchstens 1,7× closed.
  - C: `closed` ist ein einzelner Strich, das Maß „× closed“ ergibt dort keinen Sinn. Deshalb bekommt C dasselbe absolute Gesichtsbudget wie A (1,7× A-closed auf FB = 54 px im 452-px-Panel). Für C sind das 169 px nativ.
- **Kontaktschatten:** warmes Dunkelbraun. Ein enger Ring (σ 3, 40 %) plus ein weicher Fall nach unten (σ 9, 8 px tiefer, 38 %). In die PNGs gebacken; Parameter in `anchors.json`.

## Sichtreihenfolge
01 FB-Retusche · A: 02–04 Formen, 05 Schatten, 06 Höhe, 07 Overlay, 08/09 Talk, 10 Reaktionen · B: 11–19 analog · C: 20 Säuberung, 21–23 Formen, 24 Schatten, 25 Höhe, 26 Overlay, 27/28 Talk, 29 Reaktionen.
