# H15 Mindscape · Slice M3 · Naht · Rückgabe (25.10.2026)

Gleiche Datei: `KFB Billboard Kaleidoscope H15 Mindscape.dc.html`. Nur der Fragment-Shader `MS_FS` geändert, dazu ein Satz im Beschreibungstext.

## SOURCE
Georg, 25.10.: „die mittig ständig sichtbare Schnittkante … kaschieren oder fixen“.

## DECISION
Die Kante war die Spiegelfalte selbst. M1 legte die Fläche mit `mir()` zweimal um 360°. Dadurch entstanden vier senkrechte Symmetrieachsen auf der Wand, an den Rändern der Engine-Fläche (u = 0 und u = 1). Dazu kamen zwei waagrechte Falten bei ±55°. An einer Spiegelachse sieht man das Bild symmetrisch gefaltet, und das liest sich als Schnitt. Randpixel der Engine (Rahmen, Wischkanten von WHIP/SLIT) verstärken das.
Das Kaschieren über einen Deckstreifen haben wir verworfen. Gelöst ist es an der Ursache: Die Abbildung hat jetzt keine Spiegelachse mehr.

## IMPLEMENTATION
- `x = fract((1 − u + uOff) · 2 + Wellung(lat))`: Die Fläche wird gekachelt, nicht gespiegelt.
- Periodischer Versatz-Überblender: `mix(T(x + ½), T(x), w)` mit `w = smoothstep(0, .17, x) · smoothstep(1, .83, x)`. An der Stoßkante (x = 0 = 1) gilt w = 0, beide Seiten zeigen dort T(½) und laufen stetig weiter. Es bleibt keine Naht und keine Achse.
- Wellung `0,05·sin(3·lat + …) + 0,03·sin(7·lat − …)`: Die Übergangszone verläuft geschwungen, nicht als gerade Meridianlinie, und wandert mit `uOff` der Schalen.
- Randeinzug 1,2 %: Rahmenpixel der Engine werden nicht mehr abgetastet.
- Waagrechte Falte (v → 1): Dort mischt der Shader zu 50 % eine um 0,31 versetzte Probe ein, sodass die Spiegelung oben und unten nicht mehr symmetrisch ist.
- Gilt für Wand und beide Schalen, weil alle drei denselben Shader nutzen.
- Kosten: 2 bis 3 Texturabfragen statt 1 je Fragment und Schicht.

## TESTED RESULT
NOT_TESTED in Claude Design. Den WebGL-Puffer konnte ich in der Vorschau nicht abgreifen. Sichtprüfung und fps-Vergleich übernimmt der Prüfer bzw. Georg.

## OPEN
- In der Übergangszone (je ca. 30° um die frühere Achse) liegt eine weiche Doppelbelichtung. Ist sie zu sichtbar, `0.17` kleiner setzen; ist sie zu hart, größer.
- fps mit 3 Abfragen je Schicht nicht gemessen.

GEORG ACCEPTANCE: offen.
