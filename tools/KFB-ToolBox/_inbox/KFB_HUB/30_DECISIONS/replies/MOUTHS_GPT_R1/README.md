# MOUTHS_GPT_R1 – GPT-Ton-Münder als ausgerichtete Sprite-Sets

Quelle: `media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/` (main) – Sheet 1 = Design A, Sheet 2 = Design B (Kopien in `_src/`).
FrizzleBob: ws1/r3f-frame `ws1/proofs/2026-10-14-fb-v240/fb_georg_pair_front_q_side.png`, Panel vorn.

## Inhalt
- `A/`, `B/`: je 12 saubere PNGs (Leinwand 512×512, native Pixel, keine Skalierung) + `_sq80`-Varianten für zu hohe Formen, `trim/` = enge Zuschnitte, `anchors.json`.
- `review/`: 01–19, nummeriert in Sichtreihenfolge (PNG 1920×1080 und MP4 12 fps), `jump_stats.json`.
- `_tools/cut_align.py` (Schnitt, Säuberung, Anker, Stauchung), `_tools/review.py` (Retusche, Review-Bilder, Clips). Ablauf: erst `cut_align.py`, dann `review.py`.

## Säuberung
Pro Mund die größte Alpha-Komponente (Alpha > 128) plus eingeschlossene Teile, Löcher gefüllt; alles andere wird verworfen.
Rand: Alpha 1 px per Grau-Erosion eingezogen, leicht weichgezeichnet (σ 0,5). Halbtransparente oder rotstichige Randpixel bekommen die Farbe des nächsten soliden Lippenpixels. Ergebnis: 0 reinrote Pixel außerhalb der Lippen (geprüft, steht als `red_px_outside` im JSON).

## Anker (`anchors.json`)
- x = horizontale Mitte der Bounding-Box.
- Offene Formen: Oberkante der Oberlippe (Mitte) liegt auf Höhe der Oberkante von `closed` (y = 112). Der Kiefer öffnet nach unten.
- Geschlossene Formen (A: closed, smile_closed, mbp · B: closed, smile_closed, small_open): Lippenlinie auf der Lippenlinie von `closed`.
- `upperLift` (0…1, gebacken 0): dy = −upperLift × Zusatzhöhe gegenüber `closed`. Getestet mit 0 und 0,15 (`lift_dy_px`).
- Pro Mund: offset, bbox (Leinwand und Trim), Höhe und Breite im Verhältnis zu `closed`, Lippenlinie, Zusatzhöhe, `use_as` (Viseme).

## Höhe
Siehe Review 05/06 (A) und 14/15 (B). Auf FrizzleBob ist bei alter Mundbreite Platz bis zur Kinnlinie: A ≈ 2,15× closed, B ≈ 1,8× closed.
