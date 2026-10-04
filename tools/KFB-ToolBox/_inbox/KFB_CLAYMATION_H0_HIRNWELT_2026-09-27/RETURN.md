# RETURN · H0 Hirnwelt · 27.09.2026

## Georgs Frage: Häuser modifiziert oder ausgedacht?

Weder noch. Die Häuser sind **unveränderte KayKit-City-Builder-Bits** (`building_A…H`, CC0). Die Cartoon-Fassaden
kommen aus zwei Modulen, die auf jedes Low-Poly-Modell passen:

1. **Vorstufe** `clay-soften.v1.js`: unterteilt bis Kantenlänge 0,18, verschweißt nach Lage, Taubin-Glättung
   (λ 0,5 / μ −0,53, 8 Schritte), Beulen mit 1,8 % der Objektdiagonale. Kanten runden sich, die eingelassenen
   Fenster- und Türboxen verschieben sich unterschiedlich — daher die leicht schiefen Fenster.
2. **Knet-Material** `clay-material.v4.js`: Handspuren, Druckfacetten, Falten, Fingerabdrücke über die Fassade;
   die Farben bleiben die der KayKit-Textur.

Dazu eine Knet-Plinthe unter jedem Haus. Muster und Zahlen: How-to Abschnitte 1, 2, 5.

## Geliefert

| Punkt | Status |
|---|---|
| Hirn aus Messdaten (BodyParts3D, 44 Netze) als Welt | IMPLEMENTED · BROWSER TESTED · VISUALLY ACCEPTED (Georg) |
| Flüsse in den Sulci | IMPLEMENTED · VISUALLY ACCEPTED |
| Straße auf den Graten mit Brücken | IMPLEMENTED · VISUALLY ACCEPTED |
| Orte nach Funktion der Region (12) | IMPLEMENTED · BROWSER TESTED |
| KayKit Medium + Large aus dem Resident Atlas (14) | IMPLEMENTED · BROWSER TESTED |
| Kugel-in-Kugel für Wolken und Bäume | IMPLEMENTED · VISUALLY ACCEPTED |
| How-to, Changelog, Onboarding, WSA-Notiz | IMPLEMENTED |

## Offen

- Ladezeit ≈ 40 s (Vorstufe zur Laufzeit)
- Orte-Kamera an der Sternwarte zu nah
- Figuren nicht gegen die Straße geprüft
- eine Runde, keine Kreuzungen
- Broca-Region fehlt in BodyParts3D 3.0
