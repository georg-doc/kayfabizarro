# Scheinwerfer-Anker · Abnahme durch Georg · 8 Racer · WS1d · 22.10.2026

**Ergebnis (Georg 22.10.): alle 8 PASS, Feinabstimmung (Tune) später.** In der Rig-JSON steht `check: false` und `review: "Georg 22.10.: PASS, Tune später"`.

**Zweck:** Georg nimmt die halbautomatisch gesetzten Scheinwerfer-Anker ab (V-631, WS0-Job J-6). Die anderen 6 Racer sind schon „ok“.

**So lesen:** Jedes Bild zeigt links gerade von vorn, rechts schräg von vorn.
- **Grün:** Die Lampen, die das Spiel jetzt leuchten lässt.
- **Gelb gestrichelt mit Nummer:** weitere Stellen, die die Automatik gefunden hat (links und rechts gespiegelt).

Die Bilder zeigen die Modelle in Originalfarbe, ohne Heldenfarbe und Lack-Look; im Spiel ist z. B. der Graffiti-Kreuzer rot.

**So antworten:** je Racer eine Zeile, eine der drei Möglichkeiten:
- **ok**
- **Nr. X** statt grün (auch mehrere, z. B. „Nr. 1 + grün“)
- **andere Stelle:** kurz beschreiben, zum Beispiel „die runden Gläser über der Stoßstange“

Ich trage die Antwort danach in `src/data/vehicles/kfb-vehicle-rig.r1.json` ein (`headlights.lamps`, `check: false`). Danach mache ich ein neues Nachtbild.

| # | Racer | Bild | Jetzt gewählt (grün) | Hinweis der Automatik | Georg |
|---|---|---|---|---|---|
| 01 | Messing-Coupé | [Bild](img/vehicles-r1/anchors-brasswing_roadster.jpg) | je Seite oberes + unteres Glas | je Seite drei Gläser übereinander, oberes und unteres genommen | PASS (Tune später) |
| 03 | Donner-Jet | [Bild](img/vehicles-r1/anchors-crimson_thunderjet.jpg) | je Seite zwei Gläser übereinander | beide genommen | PASS (Tune später) |
| 04 | Graffiti-Kreuzer | [Bild](img/vehicles-r1/anchors-graffiti_jet_cruiser.jpg) | große runde Scheinwerfer (Automatik) | geringe Sicherheit (0,41), sieht aber stimmig aus | PASS (Tune später) |
| 05 | Eisen-Phantom | [Bild](img/vehicles-r1/anchors-iron_phantom_hovercar.jpg) | Doppel-Gläser neben dem Kühler | Automatik nahm zuerst die runden Nebelleuchten unten (Nr. 1) | PASS (Tune später) |
| 06 | Panzer-Gleiter | [Bild](img/vehicles-r1/anchors-ironclad_skycruiser.jpg) | runde Gitter-Lampen oben neben dem Kühler (Automatik) | geringe Sicherheit (0,43); Nr. 2 = kleinere Lampe darunter | PASS (Tune später) |
| 08 | Düsen-Limousine | [Bild](img/vehicles-r1/anchors-jetbound_roadster.jpg) | große runde Gläser | Automatik nahm zuerst die kleinen Positionslampen außen (Nr. 1) | PASS (Tune später) |
| 11 | Flossen-Kreuzer | [Bild](img/vehicles-r1/anchors-rustwing_cruiser.jpg) | Doppelscheinwerfer, je Seite beide | beide genommen | PASS (Tune später) |
| 13 | Straßen-Biest | [Bild](img/vehicles-r1/anchors-street_racer_hoverbeast.jpg) | runde graue Gläser oben neben dem Kühler (von Hand) | Automatik nahm die tiefen Bernstein-Leuchten (Nr. 1) | PASS (Tune später) |

**Erzeugt mit** `PW_GPU=1 node test/anchors-sheet.mjs` (mit `alle` für alle 14). Grundlage sind `test/fixtures/headlight-anchors.r1.json` (Kopie aus der Gelände-Probe) und die Modelle am Asset-Commit 9bd8e037.
