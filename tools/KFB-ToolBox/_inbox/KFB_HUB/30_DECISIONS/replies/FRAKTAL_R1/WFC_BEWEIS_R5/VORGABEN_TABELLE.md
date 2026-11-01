# Dichte über die Fläche · V-1165 · Stand 9d6e04eb, Schalter place=r3

**Kritiker-Satz (einmal, auf dem Endstand):** „Nein: Die Karte belegt eine Verteilung, die man im Spiel nicht sieht, denn selbst das dichte Motiv ist nur eine lockere Gruppe, und Georg würde zu Recht wieder fragen, wo das Zu- und Abnehmen ist.“
Noten: Karte 7, Höhe 3, Fahrtbilder 3, 6, 5, 5 (dicht), 6 (leer), 3. Das Video und die neuen Bilder 3 und 4 hat er nicht gesehen. Sie zeigen dieselben Motive wie Fahrtbild 4 und 5.

| Georgs Ziel | Wo umgesetzt | Beleg | Stand |
|---|---|---|---|
| Dichte schwillt über größere Strecken | Tabelle `feld`: Felder 130–340 m, zweite Skala 78 m, Vorwissen aller Ebenen | Karte 0, Fahrt 2 | Karte ja; Fahrt als Wechsel von viel und nichts, kein lesbares Feld |
| Dichte Felder, Ausläufer | dieselben Felder, Exponent je Sorte (`prior_feld`) | Karte 0 | im Spiel nicht lesbar: dichtes Motiv bleibt lockere Gruppe |
| Weite leere Bereiche | Schwelle lässt Felder bei null | Karte 0, Bild 4, Fahrt 720–830 m | erfüllt |
| Hierarchie statt Hof je Fels | `eltern`: Stärke aus Feld und Nachbarn | Messung, Fahrtbild 4 | teilweise: einzelne Objekte tragen weiter ein paar Krümel |
| Wiese in Senken, dünn zum Hang | `mulde` und `hang` im Feld | – | im Bild nicht belegt |
| Arten mischen sich im Übergang | Fleck 16 m, je Blume versetzter Leseort (`mischung_m`) | Karte nicht, Fahrtbild 2, 3 | im Spiel kaum belegt |

## Messwerte
- **Solver, 768 m, 144 Zellen:** Felsen je Zelle 0 / 4 / 24 / 52 (10 %, Median, 90 %, Maximum), 38 Zellen ohne Fels; vorher 6 / 15 / 24 / 34, keine leere. Pflanzen 0 / 14 / 205 / 608; vorher 54 / 131 / 208 / 422.
- **Kugeln bis 1 m am Fels nach Stärke:** unter 0,2: 5, Mitte: 18, über 0,6: 40; vorher überall 47. Die meisten Felsen liegen weiter über 0,6.
- **Fahrt 1000 m, Umkreis 40 m vor dem Wagen:** Felsen 0–54, Büsche 0–47, Pflanzen 0–487 (Teilschritte), Kugeln 12–1712. `FAHRT_DICHTE.json`.
- **Neue Zelle im Worker:** Median 152–216 ms, 90 % unter 425–466 ms, höchstens 1–2 s, Rechner stark belastet. Vorher Median 133 ms.
- **Bildzeit: nicht gültig.** Zwei Läufe, dpr-Kontrolle 6 von 9 und 5 von 9 unter fremder GPU-Last. Keine Aussage.
- **Felsfuß, `grundStat`:** 0 ohne Grund; zählt Feld jetzt als Grund, also kein Beweis. Fast-Berühren 0 in den Draufsichten, keine Rückfälle, Reihenfolge gleiche Prüfsumme.

## Video
Kein Echtzeit-Lauf: Der Wagen springt je Bild 6 m, die Kamera steht auf Höhe der Spielkamera direkt vor ihm, ohne Wagen im Bild, 10 Bilder je Sekunde.

## Tests Stufe A (V-1107)
`placeField` PASS, `verteiler-off` PASS (48 Zellen), `place=r2`-Ausgabe bytegleich über 16 Zellen, synthetisches Gelände. Programmliste und Bild ohne Schalter in dieser Runde nicht neu gelaufen; die neuen Stellen in `placeVeg.js` und `placeWorker.js` hängen an `PLACE_R3` bzw. der Kaskade.
**Gemeinsame Dateien in dieser Runde:** `placeVeg.js`, `placeWorker.js`.
