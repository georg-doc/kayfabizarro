# Reparaturrunde Verteilung · V-1132 · Stand 3331e98b, Schalter place=r3

**Urteil:** Blinder Kritiker auf dem Endstand: **Nein, nicht zeigen.** Georgs Vorwurf „unmotivierte Ansammlungen“ trifft laut Kritiker weiter auf Bild 5 und Bild 3 rechts voll zu, auf den Außenbogen in Bild 4 teilweise.

| Georgs Vorgabe | Wo umgesetzt | Bild | Stand |
|---|---|---|---|
| Kügelchen am Übergang großer Fels zu Gelände | Tabelle: Zustände `kugel`, `fussperle`, `perle`, `fuss`, `krume` auf 1 m, 0,5 m, 0,25 m, bedingt auf das Felsobjekt | 1, 2, 3 | teilweise: Fahne da, lange Fußabschnitte leer |
| An der Schnittstelle groß und dicht, auslaufend klein | Abstandskurven gegen den gemessenen Fußumriss (`fuss`, `fuss-profil.mjs`) | 1, 3 links | teilweise: im Mittel gemessen, je Sektor unzuverlässig; Bild 2 und 3 rechts falsch |
| Farbe aus Fels oder Boden | `farbe` in der Tabelle, Boden live im Kugel-Kern (`groundBandHook`) | 1, 2, 3 | erfüllt |
| Gleiche Logik bei Büschen | dieselben Zustände, Bezug `busch` | 4 | schwach: wirkt als Kette, Größen umgekehrt |
| Keine gesetzten Kränze, keine Ringe | offene Seite über `seite`, kein Bau je Objekt | 1, 2, 3 | erfüllt; Bild 4 wirkt vorn wie ein Ring |
| Knet-Kügelchen über `ballCore` (TIER0 Zeile 9) | `addBall` in `placeVeg.js`, `createBallCore` still. Vorher nicht: `kugel` und `krume` liefen über `addPebble` auf einem eigenen InstancedMesh | 1–5 | erfüllt; Kritiker: glatt, wenig Knet |
| Ansammlung nur mit Grund: Materialcode auf kahler Fläche | Ebene `quelle`, `frei.keim*` mit `kahl` (V-1036) | 5 | **nicht erfüllt im Bild:** rund 15 Kugeln statt Zweier- oder Dreiergruppe (V-1004) |
| Ansammlung nur mit Grund: Elternobjekt, Hangfuß, Rinne | Stein und Kies nur hangab am Fels; freie Kieshaufen gestrichen | 1, 3 links | Elternobjekt teilweise; Hangfuß und Rinne ohne Bild, also ungeprüft |
| Mehrere Blumenarten | fünf Arten aus dem Bestand (`pack-flora-r3.mjs`) | 1, 3, 6, 7, 8 | erfüllt über die Bilder, je Bild meist nur eine |
| Rispe raus | Flower_4 entfernt | alle | erfüllt |
| Arten wechseln fleckweise | Ebene `art`, Nachbarschaftstabelle | 8 | **im Bild nicht belegt** |
| Grobe Grasblätter | KayKit-Blätter ersetzt durch drei Quaternius-Gräser, Modelle unverändert | 1, 2, 7 | erfüllt laut Kritiker |
| Ufer | nicht bearbeitet, kein Bild | – | ungeprüft |

## Messwerte
- **Bildzeit, 1×1-Tor, dpr-Kontrolle gültig (8 von 9):** r3 gegen r2 je Thema: Moos 14,5 gegen 13,5 ms, Pastell 12,8 gegen 11,9 ms, Wüste 14,0 gegen 14,6 ms. Andere Sitzungen belasteten die GPU, also Differenzen werten. Der Lauf davor war ungültig (4 von 9).
- **Rechenzeit neue Zelle im Worker:** Median 144 ms, 90 % unter 186 ms, höchstens 314 ms (Last 14–25). Unter stärkerer Last derselbe Stand 318 ms im Median.
- **Fuß, drei Stellen je 128 m:** Dichte Fels 13–15 je m² bei 0–0,25 m, 0,5–0,6 bei 1–2 m. Radius Median 0,057–0,061 m innen, 0,026–0,027 m bei 1–2 m. Belegter Umfang Median 69–75 %. Alle 8 Sektoren voll bei 5–13 % der Felsen. Bei 2–3 m steigt der Radius wieder auf 0,035–0,053 m: dort liegen fremde Kugeln.
- **Grund-Prüfung `grundStat`:** 0 Ansammlungen ohne Grund. **Die Prüfung ist zu weich:** Ein Elternobjekt bis 12 m zählt als Grund, das Bild widerspricht ihr.
- **Freie 4-m-Zellen** 73–75 %, Fast-Berühren 0, keine Rückfälle, Reihenfolge gleiche Prüfsumme.

## Tests Stufe A (V-1107)
`placeField` PASS, `verteiler-off` PASS (48 Zellen auf dem Endstand). `place=r2`-Ausgabe bytegleich über 16 Zellen, synthetisches Gelände (vor der letzten Tabellenänderung, sie betrifft nur r3). Programmnamen und Bild ohne Schalter gegen 3f047405: gleiche Namen, Bildabweichung innerhalb der Streuung, gelaufen vor den letzten Änderungen in `ballCore.js` (nur im Zweig `minPx`) und an der Tabelle.
**Gemeinsame Dateien berührt:** `ballCore.js`, `groundAlbedo.js`, `kfb-place-field.v1.mjs` (Nachbarn ohne Wirkung werden übersprungen), `placeVeg.js`, `placeWorker.js`.
