# Straßenmarkierung M2 · Designlinie und Logik · Stand 2026-09-28 (Vertrag v2.2.0)

**Kernsatz:** Straßenmaß, Knetmaterial. Geometrie, Rhythmus und Konstruktion kommen aus dem deutschen Regelwerk (RMS Teil 1/2, StVO Anlage 2/3). Der Knetlook kommt nur aus Querschnitt, Material und Farbe. Kein Element erfindet eine eigene Form.

Quelle der Wahrheit: `lab-track/road-markings.m2.json`. Lesbar als `KFB Markierungen M2.dc.html`. 3D-Bau: `lab-track/road-markings.m2.js`.

## 1 · Umrechnung
- **Längen × 2.** Fahrstreifen real 3,5 m → Knetwelt 7,2 m (Kart 2,3 × 3,7 m).
- **Strichbreiten × 2,5.** Cartoon-Zuschlag nur in der Breite, damit Linien aus Kartsicht tragen.
- Sonst keine Faktoren. Enden gerade, Ecken 7,5 cm.

## 2 · Drei Strichbreiten
| | real | Knetwelt | Einsatz |
|---|---|---|---|
| S Schmalstrich | 12 cm | 0,30 m | Randlinie Stadt, Leit-, Warn-, Doppellinie, Fahrstreifenbegrenzung, Parkstände, Sperrflächenrand |
| B Breitstrich = 2 S | 25 cm | 0,60 m | Randlinie Strecke, Blocklinie, Pfeilschaft, Schraffur, Startboxen |
| Q Querstrich = 4 S | 50 cm | 1,20 m | Haltlinie, Wartelinie, Zebrabalken, Start/Ziel-Karo, Curb |

## 3 · Längsmuster
| Muster | Strich / Lücke | real |
|---|---|---|
| Leitlinie | 6 / 12 m | 3 / 6 m innerorts |
| Leitlinie im Knoten | 3 / 3 m | 1,5 / 1,5 m |
| Warnlinie | 6 / 3 m | 3 / 1,5 m |
| Blocklinie | B, 3 / 3 m | 1,5 / 1,5 m |
| Wartelinie | Q, 1,2 / 0,6 m | 0,5 / 0,25 m |
| Doppellinie | 2 × S, Abstand S | |

**Anker:** Gestrichelte Linien werden vom Ereignis rückwärts angelegt. Beim Musterwechsel gilt die Lücke des nächsten Musters. Der Rest fällt in einen freien Anfang, nie in einen Strich.
**Anfahrt auf ein Ereignis** (Zebra, Haltlinie, Sperrfläche): Ereignis ← 3 m ← drei Warnstriche ← 12 m ← Leitlinie. Vor Halt- und Wartelinie zusätzlich 6 m Fahrstreifenbegrenzung.

## 4 · Stöße und Abstände
| Element | Nachbar | Regel |
|---|---|---|
| Haltlinie | Fahrstreifenbegrenzung, Randlinie | bündig mit der Außenkante, reicht in die Randlinie, keine Stufe, keine Fuge |
| Wartelinie | Rand der bevorrechtigten Fahrbahn | eine Lücke (0,6 m) dahinter, nie darauf |
| Wartelinie | Fahrstreifenbegrenzung / Randlinie im Bogen | bündig links und rechts, Lücken gleichmäßig gestreckt (≥ 0,6 m) |
| Fahrstreifenbegrenzung Nebenstraße | Wartelinie | beginnt an ihr |
| Längslinie | Querfeld (Zebra, Karo) | endet eine Lücke ihres Musters davor, setzt eine Lücke danach wieder ein. Randlinien laufen durch |
| Parkstand-Trennstrich | Fahrbahnbegrenzung | T-Stoß, läuft bis zum Bord |
| Startbox | Kart | Querstrich 3,4 m vor dem Kart, Schenkel 1,8 m nach hinten |

## 5 · Situationen
- **Stadtstraße mit Parkbucht (Regelfall):** Bucht im Gehweg, 4 m tief, Stände 11,4 m, 4 je Bucht. Bord läuft an den Enden unter 45° zur Fahrbahnkante zurück. Fahrbahnbegrenzung S durchgehend. Trennstriche nur zwischen Ständen.
- **Fußgängerüberweg:** Balken Q, Lücke Q, 6 m lang, parallel zur Fahrtrichtung, symmetrisch zur Achse über die Fahrbahn. Randlinien laufen durch, Mitte mit Anfahrtsfolge beidseitig.
- **Einmündung mit Wartelinie:** Randlinie folgt dem Bordradius (6,3 m) in die Nebenstraße. Über die Öffnung läuft der Fahrbahnrand als Leitlinie im Knoten (3/3 m, symmetrisch, 3 m Lücke an den Bogenanfängen). Wartelinie siehe §4. Dahinter 6 m Begrenzung, 3 m, drei Warnstriche, Leitlinie. *Offen: Anschlussstücke.*
- **Linksabbieger:** Fahrbahn weitet sich, Mitte teilt sich an der Spitze der Sperrfläche. Sperrfläche Rand S, Schraffur B 45°, Teilung 3 m. Dahinter Leitlinie im Knoten, dann Begrenzung bis zur Haltlinie Q. Pfeile L, SR, S.
- **Sackgasse:** Zebra 12 m vor dem Gehwegende. Asphalt, Randlinien und Warnlinie laufen gerade weiter, Platzsand weht darüber (Verwehung).
- **Rennstrecke:** Randlinie B bündig an der Kehle, keine Fahrstreifen. Start/Ziel zwei Reihen Q-Quadrate von Randlinie zu Randlinie. Startboxen B, 6 m versetzt. Curbs nur am Kurvenscheitel, 3-m-Blöcke Q rot/hell.
- **Magnetzone / Loop:** Randlinie wird Blocklinie B 3/3 signal, 3 m Lücke zum durchgezogenen Teil. Boost-Pfeile aus TD03 im 6-m-Takt.
- **Boxengasse (D1 reserviert):** Einfahrt vier Blockstriche signal, dann Randlinie B. In der Gasse Begrenzung S signal, Boxen 10 m.
- **Parkdeck (Ausnahme):** Senkrecht 5 × 10 m, Rückbegrenzung S, Trennstriche T-Stoß, zur Gasse offen. Fahrgasse 12 m Einbahn, Pfeile mittig alle 36 m.

## 6 · Pfeile
Eine Familie: Schaft B, 10 m lang, ein Kopf (1,6 × 1,8 m, leicht eingezogene Basis), ein Bogen (Radius 0,9 m), Nebenarm bei 42 % der Länge. Sieben Typen: S, L, R, SL, SR, LR, SLR. Seitliche Reichweite 2,7 m ab Streifenmitte, mindestens 0,6 m Luft zur Randlinie.

## 7 · Übergänge
- **Takt-Auslauf:** Linie, die enden muss, zerfällt in ihren 3-m-Takt. 7 Stücke, erstes 0,8 Takt, linear bis Strichbreite. Kein Zufall.
- **Stärkewechsel:** Strecke B → Stadt S als Keil über 20 m, Außenkante bündig.
- **Punktraster (Knetfleck-Regel):** Flächen gehen nur über ein Comic-Raster ineinander über. Raster 1,2 m, euklidischer Punkt (cos u + cos v), nur die Größe wandert. Ungerichtet für gleichrangige Massen (30 m), gerichtet als Verwehung (14 m, an den Borden 6 m früher). Nie über Markierungen, außer Verwehung (Markierung liegt darunter). *In T4 noch M1-Kugelfelder.*

## 8 · Farbe
- Rollen: **hell** Grundfarbe aller Markierungen · **signal** Magnet, Boost, Boxengasse · **rot** nur Curbs · **curb** Bordstein, nie so hell wie Markierung.
- **Regelwerk-Schalter:** DE Mitte hell, US Mitte signal. Die Mitten-Farbe gilt für alles, was Gegenrichtungen trennt (Mittellinie, Sperrfläche zwischen Gegenrichtungen). Quer- und Gleichrichtungslinien (Halt, Warte, Zebra, Pfeile, Begrenzung gleicher Richtung) bleiben hell, auch in US.
- Welten A Canyon · B Bikini-Bucht · C O-Town tönen die Rollen leicht zum Biom (Werte im JSON).

## 9 · Querschnitt und 3D-Bau
- Knetwurst flach gewölbt: x [-1, -0,7, 0, 0,7, 1] · h [0,012, 0,042, 0,055, 0,042, 0,012] m + 0,008 Lift. Enden gerade (Stirnwand).
- Bänder folgen der Fahrbahn Sample für Sample (auch im Loop), Höhe aus den Fahrbahn-Slots 6/7.
- Zwei Geometrien je Szene (hell, signal), Material `markH` / `markS` wie bisher.
- API: `buildRoadMarkingsM2({ THREE, S, N, ds, A, M2, MR1, seedGeometry, rulebook })` → `{ hell, signal, pieces, ends, Lro, info }`. `MR1` nur für Runout-Rampe und Länge.

## 10 · Offen
Liniendicke-Tune · Anschlussstücke Einmündung · Punktraster in T4 · US-Schalter in T4 · Symbole (Rad, Bus, P, Schrift) · Lernebene Fahrschule · Situationen ohne Ort auf TD03.
