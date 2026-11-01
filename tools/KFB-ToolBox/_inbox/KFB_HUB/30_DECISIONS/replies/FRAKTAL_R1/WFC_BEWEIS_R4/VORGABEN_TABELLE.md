# Verteilung, letzte Runde · V-1132 · Stand 5aa08e74, Schalter place=r3

**Kritiker-Satz (einmal, auf dem Endstand): „Nein: Der grobe Fehler ist behoben und die Elternlogik erkennbar, aber das Dichteprofil, die Blumenmonotonie in 6 und der nicht lesbare Busch in 4 würden denselben Auftraggeber zu Recht erneut abweisen lassen.“**
Noten: Fels Moos 6, Pastell 5, Wüste 5, Busch 4, Materialcode 4, Dolde 3, Stiel 5, Artenwechsel 6, Spielkamera 6.

| Punkt | Modell und Ursache | Bild | Stand |
|---|---|---|---|
| Materialcode | Keime stoßen sich ab, je Keim eine große Kugel und ein bis zwei Begleiter | 5 | besser, nicht sauber: 25 Gruppen an drei Stellen, 11 einzeln, 10 Zweier oder Dreier, 4 mit vier oder fünf Teilen. Bild 5 zeigt ein Paar, im Spiel kommen auch größere Gruppen vor |
| Busch-Fuß | Vermutung „Krone verdeckt die großen Kugeln“ hielt nicht: Vorn verdeckt die Krone den Boden nicht. Ursache war, dass die feinste Stufe die Kontaktzone besetzte und die große breiter streute. Jetzt ein Band-Modell für Fels und Busch, Fußumriss auch für Büsche gemessen | 4 | Größe fällt, Kette weg; links eine versetzte Traube. Busch liest sich als glatter Brocken, das ist das Modell (V-574) |
| Fremde Kugeln bei 2–3 m | Sie gehören zu Nachbarobjekten: Eigene Kugeln dort 0–0,04 je m², fremde 50–116 je Stelle um Felsen. Der Radius fällt jetzt je Träger stetig | – | geklärt |
| Bild 3 rechts | Fels mit Nachbarn, große Stufe zu breit, dazu Rauschen auf den Fußstufen. Rauschen dort aus, große Bänder schmal. Am Einzelfall nicht einzeln ein- und ausgeschaltet | 3 | abgelöste Gruppe weg |
| Weitere Ursachen | Kieshaufen entstanden über eine freie Quelle bis 7 m vom Fels: gestrichen. Gras und Blumen aus dem Oasen-Ring galten als Fels und zogen Kugeln an: nur noch Stein, Baum und Busch sind Eltern | 6 | behoben |
| Artenwechsel | Fehlte im Spiel, die Flecken waren zu groß. Tabelle geändert: Fleck rund 6–12 m, jede Art eine Palettenrolle | 8 | im Bild belegt; Bild 6 wirkt weiter einartig |
| `grundStat` | Kugeln und Steine brauchen Berührung mit dem Eltern (bis 0,5 m, Kette bis 1,2 m) oder sind Code | – | 0 ohne Grund an drei Stellen; der Kritiker nennt trotzdem den Klumpen links in Bild 1 und die Traube in Bild 4, die Kettenregel lässt das zu |

**Offen:** Dichte direkt an der Kante, Hof rundum statt einseitiger Fahne (belegter Umfang Median 69 %, V-749 nennt 40–50 %), Dolde als Hauptton, Kugeln glatt, Sockelbild wechselt. Kugeln um das Fahrzeug in Bild 9: vermutlich Antrieb, nicht geprüft.
**Draußen in dieser Runde:** Ufer, Hangfuß, Rinne.

## Messwerte
- Bildzeit, 1×1-Tor, dpr-Kontrolle 9 von 9, GPU fremd belastet: r3 gegen r2 Moos 15,3 gegen 15,1 ms, Pastell 15,4 gegen 13,7 ms, Wüste 15,0 gegen 13,9 ms.
- Neue Zelle im Worker: Median 133 ms, 90 % unter 165 ms, höchstens 285 ms, 968 Objekte im Median, längste Hauptfaden-Scheibe 2,7 ms, keine Fehler.
- Fuß Fels: 11–13 Kugeln je m² bei 0–0,25 m, 0,7–0,9 bei 1–2 m, Radius Median 0,063 auf 0,026 m. Freie 4-m-Zellen 72–75 %, Fast-Berühren 0 in den Draufsichten ohne Bäume und Formationen, keine Rückfälle, Reihenfolge gleiche Prüfsumme.

## Tests Stufe A (V-1107)
`placeField` PASS, `verteiler-off` PASS (48 Zellen). `place=r2`-Ausgabe bytegleich über 16 Zellen, synthetisches Gelände. Programmnamen ohne Schalter gegen 3f047405 gleich. Bild ohne Schalter: Rechner stark belastet, Streuung hoch; an zwei Stellen im Thema-Hash liegt der Abstand etwas über der Streuung (0,055 gegen 0,039, 0,058 gegen 0,041), im Standard-Hash innerhalb. Stufe B ist nicht gelaufen.
**Gemeinsame Dateien auf dem Branch seit 3f047405:** `ballCore.js`, `groundAlbedo.js`, `kfb-place-field.v1.mjs`, `placeVeg.js`, `placeWorker.js`.
