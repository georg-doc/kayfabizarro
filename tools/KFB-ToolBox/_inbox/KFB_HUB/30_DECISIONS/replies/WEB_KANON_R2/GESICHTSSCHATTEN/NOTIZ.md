# Gesichtsschatten (V-1773) · Blatt und Befund (WSB, 14.11.2026)

**Blatt:** `G1_gesichtsschatten.jpg`, aus dem Spiel-Lader.
- Stamm @3cc44c4a + `assets/private` @82c4957e, Release-Schalter; Spiel-Szene, Spiel-Licht, Spiel-Schattenweg.
- FB-Gesicht von vorn und dreiviertel bei Spiel-Sonne steil (51°) und flach von der Seite (12°, Sonne abgesenkt, FB so gedreht, dass sie von seiner rechten Seite kommt).
- Links „heute“, rechts „mit Gesichtsschatten“.

**Aufbau des A/B:** Jedes Paar ist im selben Bild gerendert.
- Der Schalter setzt nur `castShadow` an den Brauen- und Nasen-Netzen des Face-Mounts (`faceMountActor.js` Z. 175). Genau das wird zwischen den beiden Bildern umgeschaltet; Kamera, Pose und Licht bleiben gleich.
- Getrennte Ladevorgänge taugen nicht: FB steht jedes Mal einige Millimeter anders und der Blick wandert.
- Die Flags sind geprüft: ohne Schalter werfen Nase und Brauen nicht, mit Schalter werfen sie; der Mund wirft und empfängt nie.

## Befund: Im Spiel ändert der Schalter heute nichts
- Gemessen: **0 Pixel Unterschied** zwischen „heute“ und „mit Gesichtsschatten“ in allen vier Paaren (`pixelvergleich_spiel.json`).
- Das gilt auch, wenn alle Schattenkarten neu gerechnet werden, und ebenso mit `figschatten=1` (feine Eigenschatten-Karte, V-1627).
- **Ursache:** die Figuren-Eigenschatten-Ausnahme (q300, `applyFigureShadow` in `terrain3.js`, `uFigSkip` aus `FIG_SKIP` = 1,6·K in `M1World.jsx`). Werfer, die weniger als etwa eine Figurlänge zur Sonne vor dem Punkt liegen, zählen auf Figuren nicht. Nase und Brauen liegen immer direkt vor dem eigenen Gesicht und fallen deshalb immer heraus.
- **Gegenprobe**, untere Zeile des Blatts, nicht Spielstand: Mit `uFigSkip` = 0 erscheint bei flacher Sonne der Nasenschatten neben der Nase. Gemessen sind rund 8 500 Pixel vorn und 4 200 dreiviertel deutlich anders; bei steiler Sonne nur etwa 60, weil der Schatten senkrecht nach unten fällt.
- **Zusätzlich:** Die Sonnen-Schattenkarte deckt 20,8 m mit 2048 px ab (1 cm je Texel), weichgezeichnet mit Radius 5 und normalBias 1,5 cm. Auf Figuren wirkt sie mit Stärke 0,55. Auch ohne die Ausnahme bleibt der Nasenschatten deshalb weich und schwach.

## Folgerung (Spiel-Entscheidung WS0/Georg, nichts geändert)
Damit Nase und Brauen sichtbar werfen, bräuchte es zum Beispiel:
- eine Ausnahme von `uFigSkip` nur für Gesichtsteile als Werfer;
- oder einen eigenen, feinen Gesichtsschatten.

Das wäre eine Änderung am Figuren-Schattenweg (q300/V-1729), kein Schalter-Wert. Auf Wunsch rechne ich dafür einen Diff mit Beleg.
