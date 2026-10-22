# HUD-UX: Zustände für alle HUD-Props · R1 · 2026-10-22 · WS0 (V-673)
**Tier 0:** Kontur ist der Normalzustand. Der Lichthof trägt den Zustand, die Cartoon-Deformation die Bewegung. Gleiche Regeln für jedes HUD-Prop.

Gilt für: Aktionsleiste (bis 6 Plätze, unten, klein), Kompass bzw. Tacho, Radio, Truhe, Zahnrad, Fluff-Zahl, Kartenfächer.

## Zustände
| Zustand | Lichthof | Deformation | Wann |
|---|---|---|---|
| Ruhe | keiner | keine | immer, nur Kontur |
| Hover | schwach (≈ 0,4) | leicht größer (≈ 1,08), kleines Kippen | Maus bzw. Fokus darüber |
| Klick | kurzer Blitz | Squash ≈ 80 ms, dann Überschwinger | beim Drücken |
| Aktiv | ruhig, warm (≈ 0,85), langsames Atmen | keine | ausgewählte Waffe, offenes Radio |
| Hinweis | pulsiert in Hinweis-Farbe | kurzes Wackeln alle 2–3 s | Kontext, z. B. im Kampf: Primär- und Sekundärwaffe |
| Abklingzeit | keiner | keine | Prop grau, Farbe füllt sich von unten nach oben wieder auf |
| Bereit | kurzer Blitz | kleiner Hüpfer | Abklingzeit vorbei |
| Neu | kurzer Blitz | Hineinhüpfen | Prop gerade eingesammelt |

## Darstellung
- **Kontur:** Inverted Hull, dunkel (#130e16), Breite an die Bildschirmgröße gebunden (2–3 px in Spielgröße).
- **Lichthof:** weiches Sprite hinter dem Prop, Grundfarbe #fff6e0; die Hinweis-Farbe schlägt WSB in 2 Varianten vor.
- **Deformation:** ein Modul für alle Props (Squash, Stretch, Wackeln, Hüpfen), nur Skalierung und Drehung des ganzen Props, kein Umbau.
- **Textur:** In Spielgröße Originaltextur gegen Knete vergleichen; es gilt, was klein besser lesbar ist.
- **Größe:** Aktionsplätze in echter Spielgröße prüfen (6 Plätze unten, 1080p und Handy-Breite).
- Lichthof und Kontur werden über `hudView.readability` aus der Props-Karte gesteuert, nicht je Prop von Hand.
