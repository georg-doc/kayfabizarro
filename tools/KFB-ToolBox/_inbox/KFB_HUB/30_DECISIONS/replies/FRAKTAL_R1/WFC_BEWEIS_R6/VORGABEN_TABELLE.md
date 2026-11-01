# Masse im Feld · V-1174 · Stand bef2ac1a, Schalter place=r3

**Kritiker-Satz (einmal, auf dem Endstand):** „Nein: Das Ab und Auf ist nur im Vergleich der Bilder zu erkennen, im Einzelbild aber bis auf Bild 1 und den Palmenhain kaum, und solange hohes Gebüsch, Felsfelder und ein ruhiger Boden fehlen, sieht Georg weiter Gruppen statt Felder.“
Noten: Blick 6, Boden heute 4, Boden ruhig 5, Fahrtbilder 5, 6, 4, 4, 7. Das Video hat er nicht gesehen.

| Auftrag | Umsetzung | Beleg | Stand |
|---|---|---|---|
| Bäume ans Feld | Bäume nur noch aus dem Löser, Feld `wald`, alter Pass nur noch Oasen und ausgedünnte Formationen | Bild 1, Fahrt 2, 5 | erfüllt im Bau; lockerer Hain, keine geschlossenen Kronen |
| Gebüsch als hohe Masse, Rand | `hochbusch` r 1,2–2,1 m, Waldmantel am Rand | Fahrt 3, Bild 2 | nicht erreicht: flache Kuppen. Modelle sind breit und niedrig, einheitlich skaliert (V-574) |
| Felsfelder mit großen Felsen | `felsgross` r 1,6–2,8 m | Fahrt 1, 3 | nicht belegt: einzelne Felsen im Bild |
| Lesbar auf einige hundert Meter | Büsche und Bäume der Kaskade bleiben jetzt in der Ferne (vorher ab 64 m aus) | Fahrt 2, Bild 1 | teilweise, klein am Horizont |
| Ruhiger Boden | `ground=j17` gibt es im Stand nicht. Vorhanden: `calm=1` (V-654, V-800) | Bild 2 und 3 | hilft Lesbarkeit, Bild wird ausgewaschen |
| Ferne über Bodentönung | Nicht klein: Boden-Shader und Feldtextur, gehört WS1 | – | nur Vorschlag |

**Bild 1–3 nutzen eine feste Kamera auf 4–4,5 m Höhe ohne Wagen, mit mehr Himmel als die Spielkamera.** Die Fahrt ist echte Spielkamera mit Taste W und Echtzeit, Rechner belastet. Strecke nicht gemessen, das Positions-Protokoll blieb leer. Das Video habe ich nur über Einzelbilder geprüft.

**Messung:** Neue Zelle im Worker Median 297 ms, 90 % unter 621 ms, höchstens 1,5 s, 495 Objekte Median, bis 5431, längste Hauptfaden-Scheibe 4,8 ms, keine Fehler, Last 12–14. Vorlauf ohne Wald 152–216 ms, R4 133 ms. **Bildzeit weggelassen,** Rechner war belastet (Last 12–70). Kugel-Kern: rund 28 000 von 40 000 Plätzen belegt.

**Tests Stufe A:** `placeField` PASS, `verteiler-off` PASS (48 Zellen). Programmliste und Bild ohne Schalter nicht neu gelaufen. **Gemeinsame Dateien:** `placeVeg.js`, `placeWorker.js`.
