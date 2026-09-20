# KayfaBizarro — Asset-Kit (Tesa · Badge · Frame)

Transparente, maßstabsgetreue Vektor-Assets zum direkten Platzieren in InDesign.
Primär **SVG** (skalierbar, mm-genau). **PNG** bei 300 dpi als Fallback (font-freie Teile).

## Inhalt
- `tape-1..4.svg/.png` — Tesa-Streifen, 4 leicht unterschiedliche (24×8, 30×7, 20×9 angeschnitten, 26×8 mit Falz).
- `badge.svg` — Stamp „1–6 · 20–60 min" (mit Text). `badge-blank.svg/.png` — leerer Kasten zum Selbstbeschriften.
- `frame.svg/.png` — Bild-Rahmen (bone gefüllt + Kante + harter Schatten). `frame-open.svg/.png` — nur Kante (transparent, zum Überlagern auf ein Bild).

## Farben (RGB)
- Tesa-Gelb `#e9c14a` @ 50% · Kante `#6a5d44` @ 22%
- Badge-Rot `#b8361f` · Creme `#f3ead3` · Schatten `#6a5d44` @ 26%
- Frame-Fläche (bone) `#ece1c0` · Kante `#6a5d44`

## InDesign-Hinweise
- **Tesa:** Objekt auf **Multiplizieren** stellen (Blendmode ist im Asset nicht enthalten). Frei rotieren — die Streifen sind gerade angelegt.
- **Badge:** Text ist in `CC ClobberinTime Crunchy` (Fallback Impact) gesetzt. Fehlt die Schrift, `badge-blank` platzieren und in deiner Schrift (Irish Grover / CC ClobberinTime) selbst tippen.
- **Frame:** `frame` als Container platzieren, dein Bild leicht (~1 mm) eingerückt darüberlegen, damit die Kante sichtbar bleibt. Oder `frame-open` direkt über ein Bild legen.
- Alles ist **RGB/transparent**. Für Offset-Print in InDesign nach CMYK wandeln.
