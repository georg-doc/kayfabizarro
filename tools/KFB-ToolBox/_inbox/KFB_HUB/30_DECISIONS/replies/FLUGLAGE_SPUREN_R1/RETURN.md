# Fluglage und Spuren in der Knete R1 · Rückgabe an WS0 (03.11.)

**Zweig:** `game/fluglage-spuren-r1` @c075b44a (vom Stamm @cb50ba6), lässt sich konfliktfrei mit `game/inkblobs-r1` zusammenführen. **Schalter:** `fluglage=1`, `knetespur=1`.

## 1 · Fluglage
- **Figur:** Vorlage nach vorn, Schräglage in Kurven und Ohrenwind gibt es im Stamm schon (`FLY_KIN` im Loco-Actor, `earWind` am Ohr-Slot). Ich habe daran nichts geändert. Die Seitenaufnahme zeigt es: Geradeaus liegt die Figur nach vorn, in der Kurve geht sie in Schräglage, die Ohren wehen nach hinten.
- **Kamera neu:** Im Flug zu Fuß (Schwebeflug `flug=r2` und Jetpack) kippt sie mit der Schräglage in die Kurve, höchstens 7°, kritisch gedämpft. Die Fassrolle zählt nicht mit. Gekippt wird nur beim Zeichnen (über die Projektion); Physik, Zielstrahlen, Kamera-Steuerung und HUD bleiben gerade. Gemessen: Linkskurve −6,4°, Rechtskurve +6,2°, danach zurück auf 0.
- **Belege:** `Fluglage_Seite_gerade_Kurve.jpg` (mitfahrende Prüfkamera seitlich, ohne Kamerakippen), `Fluglage_Spielkamera_Kurven_Horizont.jpg` (Spielkamera seitlich gedreht, links und rechts, Horizont schräg), Clips `Fluglage_Seite.mp4` und `Fluglage_Spielkamera.mp4`.
- **Kosten:** eine Matrix je Bild, nicht messbar.

## 2 · Spuren in der Knete
- **Bau:** Flicken auf dem Geländematerial nach dem Muster von inkPatch, ohne Geometrie. Jede Spur bekommt ein Höhenprofil (Mulde bzw. Rille mit aufgeworfenem Wulst), das nur über die Normale im Licht des einen Rigs wirkt. In der Tiefe ist die Knete etwas dunkler und glatter, und die Bandfarbe wird verschmiert: in der Rille in Zugrichtung, in der Mulde nach außen. Das wirkt im Biom-Gelände und in terrain3.
- **Quellen:** Landung der Figur nach Sprung oder Flug ergibt eine Mulde, die mit der Fallgeschwindigkeit wächst. Landet der Wagen, gibt es je Rad eine Mulde. Beim Drift zieht jedes Hinterrad eine Rille aus Stücken von etwa 4 m. Die Wagen-Telemetrie meldet dafür jetzt `air` und `drift`.
- **Sitzung:** Ringpuffer mit 64 Spuren, die älteste fällt heraus. Ein Drift von 3 s füllt etwa 28 Plätze.
- **Belege:** `Knete_Mulden_Landung.jpg` (zwei Mulden nach Landungen, in der vorderen ist Lila hineingedrückt), `Knete_Rillen_Drift.jpg` (Doppelrillen mit Wulst nach einem Drift), Clips `Knete_Mulden.mp4` (feste Kamera seitlich: Abheben, Landen, die Mulde entsteht) und `Knete_Rillen_Wagen.mp4`.
- **Kosten** (`bildzeit_knetespur.json`, 64 Spuren im Blickfeld, je zwei Läufe): mit Spuren 18,1 und 17,2 ms Renderzeit, ohne 23,1 und 21,9 ms. Mit ist also sogar schneller; das ist Messrauschen unter Last (14 bis 19). Messbare Mehrkosten zeigen sich nicht. Pixel ausserhalb des Spurbereichs und weiter als 140 m rechnen nichts.

## Offen bzw. nicht geprüft
- Der Clip vom Wagen ist unruhig: Die mitfahrende Kamera verliert den schnellen Wagen in Rauch und Hügeln. Das Standbild zeigt die Rillen klar.
- Rillen sind in Kurven aus geraden Stücken zusammengesetzt; aus der Nähe sieht man an den Stoßstellen leichte Knicke.
- Im Prüflauf sprang die Figur beim Laufen mit Space nicht, deshalb sind die Mulden-Belege Landungen aus dem Flug. Normale Sprünge legen eine Mulde ab einer Luftzeit von 0,18 s.
- Das Kamerakippen gilt nicht für den Wagenflug (Racer), nur für den Flug zu Fuß.
