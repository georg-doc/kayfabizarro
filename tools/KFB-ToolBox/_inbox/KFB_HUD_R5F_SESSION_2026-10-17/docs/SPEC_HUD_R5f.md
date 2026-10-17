# KFB HUD R5f · Ein Tastenstil, ein Icon-Set

Design only (V-228). Basis: `r5e-hud.js`. Modul: `hud-r5/r5f-hud.js`. Board: `KFB HUD R5f Board.dc.html`.

## Regeln
- **Taste (Icon):** Fläche in der Farbe (Lack-Aufbau: heller Kopf, Grundton, dunkle Unterkante als Anhebung). Kein Sockel, keine Kontur, kein Badge. Holz/Lack/Plakette als Auswahl entfällt.
- **Glyphe:** volle Silhouette in dunklem Holzbraun `#52301A` (GL), Details als Aussparung (SVG-Maske), keine Zweitfarbe, keine Funken. Ca. 70 % der Tastenbreite. Gleiche Glyphen außerhalb von Tasten in einer Farbe.
- **Text-Taste:** Holz mit Tinten-Text; Hauptaktion (Kayfabricate, Kayfabrizieren) Gelb.
- **Mulde:** leerer Platz oder nicht verfügbar. Blasse Glyphe (Tinte 30 %), wenn die Funktion existiert, aber kein Ziel da ist („i“).
- **Klapp-Hinweis:** Tinten-Dreieck oben rechts in der Fläche.
- **Fluff-Kugel:** Knete: matt, feines Korn (einmal erzeugtes PNG über CSS-Variable `--kfb-clay`), weiches Licht, leicht unrund, kein Glanzpunkt.
- **Fluff-Fach:** feiner Glasrahmen in der Sortenfarbe (hell oben links, dunkler unten rechts), innen leicht vertieft.

## Farben
| Familie | Primär | Spezial |
|---|---|---|
| Faust | #F7A066 | #EE6B3B |
| Schwert | #93BCEC | #5A93D6 |
| Blaster | #6FD6C8 | #22B3A3 |
| Magie | #D2A6EC | #B06AD9 |
| Fortbewegung | #A6DA84 | #6FBF4A |

Interagieren #FFD21F. Neutral #E8C894. Ecke rechts unten (Ton, Info, Einstellungen) dezent: Fläche #F4E7CC, Glyphe #8A6644, 58 %. Rucksack: Beutel-Glyphe mit Item-Zahl mittig ausgespart, Fläche wie Zielwahl-Taste (`ybtn`, #E8BC37). Kontext: Trank #F58A9C, Bombe #AEB6CF, Kostüm #8CCBEA, Pilz #F2876E, Bonbon #FFC864.

## Federung
`D.FEEL` (in r5d-hud.js, Standard = R5d-Werte). R5f: hover 0.5 (Hover-Squash 1,06/0,95 statt 1,12/0,90), hoverMs 640, Icon-Drehung ±4° statt ±9° über 820 ms ease-in-out, Verlassen 380 ms, Loslassen 560 ms. Drücken unverändert 90 ms.

## Leiste
Abstand im Paar 6 px, zwischen Gruppen 18 px (1080p). Reihenfolge: Waffen-Paar · Fortbewegungs-Paar · Kontext-Platz · Interagieren.

## Offen
- Kontext-Items: eine gemeinsame Farbe statt fünf?
- Waffenwechsel außerhalb des Rucksacks, Auslöser der Kontext-Items, „Almanach-Fächer darunter“ (R5d) unverändert offen.
