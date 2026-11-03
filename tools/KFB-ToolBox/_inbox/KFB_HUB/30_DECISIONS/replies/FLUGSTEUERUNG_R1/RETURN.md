# Flugsteuerung R1 · Q-058 k und l · 03.11.
Zweig `game/flugsteuerung-r1` vom Stamm @60b6a9b6, alles hinter `flug=r2`. Kein `src/private`.
Clip `Flug_Seite.mp4`: Abheben (F), Steigen (Pfeil hoch), Schweben, Drehen (Pfeil links), Turbo (Space), Fassrolle (Doppel-Space), Landen (F), weiter Jetpack-Sprung zu Fuß. Bild `Speedlines_Rand.jpg`.
- Ein Schwebeflug für Figur und Dieselpunk-Wagen: `src/m1/hoverFlight.js`. Figur in `M1Player.jsx`, Wagen in `racerFlight.js`. Elan-Abflug und Rampenflug sind mit dem Schalter aus.
- Tastenkarte unverändert. Pfeil hoch/runter von W/S über die zuletzt gedrückte Taste getrennt (wie die Racer-Nase). A/D drehen wie die Pfeile links/rechts, Q/E seitlich, Shift schneller.
- Zu Fuß ist das Jetpack unsichtbar, nur im Flug und beim weiten Sprung sichtbar.
- Speedlines: Ring als Ellipse am Bildrand (`edgeFit` in `kfb-flight-vfx.js`), Schalter „Speed lines“ in den Einstellungen unter Game, `flylines=0` in der Adresse.
- Der Dieselpunk-Wagen hat keine Speedlines, das bleibt so.
- Wagen geprüft ohne Clip: F hebt auf ≈ 10 m, W fliegt vor, F landet, dann fährt er normal weiter.
- Vergleich ohne Schalter: keine Fehler, Programmzahlen 123 bis 137 auf beiden Seiten, unter Rechnerlast 35 stark schwankend.
- Unit-Tests grün außer `audioMixer`: dem fehlen lokale Klangdateien, Ton ist in diesem Zweig nicht angefasst.
