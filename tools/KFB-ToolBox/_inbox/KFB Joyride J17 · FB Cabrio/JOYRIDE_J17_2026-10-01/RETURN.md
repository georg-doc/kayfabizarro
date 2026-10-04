# RETURN · FB-CABRIO-JOYRIDE-01 · Joyride J17

Datum: 2026-10-01 · Seite `KFB Joyride J17 · FB Cabrio.dc.html` · Basis J16 r2 (Race-Tube) · Status **DESIGN PROOF · CANDIDATE**

## Probleme zuerst

1. **Hände am Lenkrad halten nur bei Stadttempo (Abnahme 3).**
   - Bei 26 km/h ist der größte Abstand vom Handgelenk zum Griff 0,032 Rig (bestanden). Über eine Rennrunde sind es links 0,197 und rechts 0,249 Rig (durchgefallen).
   - Ursache 1: Mit dem Fahrclip auf FB sind die Arme 5–7 cm zu kurz. Blender hat dasselbe gemeldet (»15–20 cm zu kurz«, bleibt auch nach der Verschiebung um 0,10 knapp).
   - J17 löst das mit einer »Reichweiten-Lehne«: spine und chest kippen nach vorn, höchstens 0,30 rad. Diese Grenze wird dauernd erreicht, FB hängt also sichtbar nach vorn.
   - Ursache 2: Bei Renntempo steht das Lenkrad auf ±106° und die Lehne auf ±0,35 rad (Vertragsgrenze). Dann liegt der obere Griff außer Reichweite.
   - **Nach zwei Anläufen gestoppt, wie der Brief verlangt.** Mögliche Schnitte für Georg: Die Hände rutschen am Kranz mit (Griffwinkel folgt nur einem Teil der Lenkung). Oder das Lenkrad dreht bei Tempo weniger. Oder die Lehne sinkt mit dem Tempo. Oder FB bekommt längere Arme bzw. ein Sitzkissen.
2. **Beim Fahren schneidet FB noch das Auto (Abnahme 4 durchgefallen).**
   - Im Stand sind Armaturenbrett, Instrumente, Sitz und Spiegel frei. Übrig bleiben Unterarm gegen Kranz (43 Kanten), Körper gegen Kranz (10) und Unterarm gegen Nabe (10).
   - Bei Renntempo kommt mehr dazu: Die Ohren werden in Sitzlehne, Tür und Innenraum geblasen (bis 170 Kanten je Bild). Der Körper geht bei voller Lehne in den Sitz (bis 70).
   - Die Ohr-Grenzen (maxBack 40/25/25) kommen aus dem ToolBox-Preset und bleiben hier unangetastet. Ein Ohr-gegen-Auto-Kollider ist eine Frage an den Owner ear-dangle.v1.
3. **Hop raus: der Flug ist nicht sauber (Abnahme 5 halb).**
   - Hop rein: 8 Flugproben, 0 Treffer.
   - Hop raus: 7 Proben, 105 Treffer. Davon 156 Kanten Ohren gegen Karosserie und Innenraum, dazu Hand und Körper am Start des Flugs (je rund 10).
   - Beim Landen im Sitz stecken die Unterschenkel noch in der Sitzkante (84 Kanten in 4 Proben).
   - Auch hier: nach zwei Anläufen (Beine im Sitz strecken, Beine im Flug mitführen) gestoppt.
4. **Die Verfolgerkamera ist auf ein 4,3-m-Auto eingestellt.** Das 2,74-m-Cabrio wirkt darin klein, FB ist auf der Geraden kaum zu erkennen. Die Kamera gehört J09/J10 und wurde nicht angefasst. Vorschlag: Kameraabstand nach Fahrzeuglänge. Das entscheidet der Owner.
5. **Bounce und Body Roll mussten gedeckelt werden.**
   - Die Vertragsfeder (k 60, c 7) mit ungedämpftem Beschleunigungseingang drückte die Hüfte auf der Rennstrecke 8 cm nach unten, die Unterschenkel gingen in die Sitzkante. J17 nimmt den Eingang × 0,25 und begrenzt auf ±3 cm, damit bleibt die Hüfte im 0,05-Rig-Fenster (gemessen 0,049).
   - Body Roll ist auf ±0,06 rad gedeckelt. J10 rollt das Auto schon selbst, beides zusammen kippte das Cabrio in Kurven um über 20°.
   - Beide Deckel sind Tuning außerhalb des Vertrags und brauchen Georgs Blick.
6. **Beine:** Der Fahrclip knickt die Knie um 90°, FBs Unterschenkel lagen dann in der Sitzkante. J17 streckt die Knie nach vorn-unten, die Beine hängen (»Kind im Auto«, wie in Blender).
7. **Gesicht:**
   - Ohne gespeicherten ToolBox-Eintrag zeigt face-mount die gemalten Originale. Georgs gespeicherter FB-Eintrag liegt nur in seinem Browser.
   - J17 setzt deshalb fest ein: Rig-Augen mit Ton-Lidern (hinge/round, Oval 1,06/1,04/0,98/−25 aus MEASURE.json), Rig-Brauen und Rig-Mund, die gemalte Nase bleibt.
   - Von vorn verdeckt der Lenkradkranz den Mund. Das ist in Blender genauso.
8. **Befund zum Check-in:**
   - `KFB_CVP1_cabrio.glb` liegt auf georg-doc-patch-3 @93abbf22, 147 548 Byte, und lädt per jsDelivr. Die GitHub-Liste meines Werkzeugs zeigt keine .glb-Dateien, deshalb hatte ich die Datei gestern fälschlich als fehlend gemeldet.
   - Der Check-in ist vollständig. Es muss nichts nachgereicht werden.
9. **Andere Figuren:** ActionFigure und Black Knight stehen weiter im J14-Maßstab (1,85 m / 2,30 m). Maßstab A gilt in J17 für FrizzleBob, und nur FB bekommt den Cabrio-Sitz. Mit einer anderen Figur im Cabrio läuft der J14-Schnitt.

## Was läuft

- Das Cabrio ist das Standardauto: r2-Farben, Glas als Originalmaterial (hellblau, α 0,45), Dach bei Frame 52 offen, Seitenfenster `Window.2` und `Window` ausgeblendet.
- Das Cabrio hat Maßstab A: 1 Cabrio-Einheit = 1,10949 m, Länge 2,739 m. `vehicles.len` wird dafür nie benutzt.
- FrizzleBob v5b ist die Standardfigur, zu Fuß und am Steuer im selben Maßstab (0,616381042 m je Rig-Einheit, 1,813 m mit Ohren).
- FB ist beim Fahren in allen vier Kameramodi sichtbar. Die Hüfte sitzt exakt im Vertragssockel (Fehler 0,000 Rig, mit Bounce 0,049).
- Die Arme greifen per 2-Knochen-IK auf 10 und 2 Uhr am Kranz. Die Griffe hängen am Kranz, die Hände legen sich auf das Rad.
- Das Lenkrad dreht mit × 8, begrenzt auf 120°. Mit A/D kommt der Winkel aus k2b, bei Spurhilfe aus der Gierrate. Beides wird geloggt.
- Die Lehne kommt aus dem Vertrag. Nach der Lehne folgt die Arm-IK.
- Hop rein und raus laufen im Vertrags-Zeitplan (20/12/20/10 und 10/20/12/20 Bilder bei 30 fps) auf der Bézier-Bahn aus hop.py, mit Drehung 90→180° bzw. 180→270°. Die Tür bleibt zu. Die anderen Autos behalten den J14-Schnitt.
- Ohren: Floppy-Preset über den gepinnten ear-dangle.v1, Wind = −Figurgeschwindigkeit. Bei 26 km/h gehen die Spitzen im Mittel 22,5° / 22,6° nach hinten (p10–p90 11–37°).
- Der Innenspiegel sitzt 4 cm höher und 14 cm weiter vorn und hängt weiter am Scheibenrahmen. Die Ohrspitzen berühren ihn nicht mehr. Der Wert steht in `VEHICLE_SEAT_CONTRACT.j17-patch.json`.
- Runde: headless 91,60 s (gleich J16), 7/7 Sprünge, 0 Bande. Browser-Autopilot 90,85 s, 7/7, 0 Bande.

## Offen für Georg

- Wie soll der Griff bei Tempo gelöst werden (siehe Punkt 1)?
- Dürfen die Ohren bei Renntempo ins Auto, oder braucht ear-dangle einen Kollider?
- Wie wirkt die vorgebeugte Haltung (Reichweiten-Lehne 0,30 rad)?
- Wie wirken die hängenden Beine?
- Braucht es einen Kameraabstand fürs kleine Auto (Owner J09/J10)?
- fps auf Georgs Gerät sind nicht gemessen. In der Vorschau lagen sie bei 6–35 fps, das Gesicht allein kostet dort sichtbar.
