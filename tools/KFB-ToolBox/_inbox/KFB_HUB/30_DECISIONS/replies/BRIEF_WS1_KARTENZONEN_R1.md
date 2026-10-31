# Auftrag WS1 · Kartenzonen als spielbare Grundlogik · WS0 · 31.10.2026 (V-1127, ergänzt V-834, V-1002, V-951, V-1006, V-963)
Georg: Zufallsbegegnungen sollen über Kartenzonen laufen, der Ziel-Pfeil zeigt die nächste Zone, Zonen unterscheiden sich in „Konfiguration“, „Anatomie“ und Farbe nach Biomlogik, der HyperNorm-Shader zeigt die Karten des jeweiligen Decks, dazu einzelne Karten im Gelände, „spielbar dann auch testbar“ zusammen mit Wasser und den anderen Begegnungen.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Laufzeit-Code im Spiel, Gate sind die Tests des Schalters. **Konzeptblatt (WS0):** Der Spieler folgt dem Pfeil, erkennt schon von weitem ein anderes Deck und eine andere Gegend, räumt ab und sammelt, dann zeigt der Pfeil die nächste Zone. Vorlage: `replies/KONZEPT_KARTENVIERTEL_R1.md` §5. Verboten: neue Platzierungsformel, Zonen als gleiche Stempel. Kameras: Spielkamera fern und nah.

**Beginn:** nach der laufenden Merge-Runde und vor der Joyride-Reihe. Das feine Verteilungsmuster bleibt gesperrt (N-024) und wird hier nicht gebraucht.

## Bau hinter `zones=1`
1. **Zonen statt Karten-Punkte:** Baue auf `cardSites` und dem 256-m-Feld aus V-834 auf, fest aus der Saat, unabhängig von der Ladefolge. Jeder Platz bekommt Deck und Zonenart aus der Saat und aus dem Biom des Orts.
2. **Zonenarten als Daten:** eine Tabelle, ein neuer Fall ist eine Zeile. Jetzt spielbar: Geländekarte (Bestand `cardRelief`) und verstreute Einzelkarten im Gelände. Das Kartenviertel ist heute eine eigene Seite `#viertel=1` auf `design/kartengebaeude-r1` (@823324d6), nicht in der offenen Welt, und die Sky-Card ist noch in einer Runde. Es bekommt darum nur die Tabellenzeile und den Haken zum Nachladen auf Abruf; der Einbau folgt nach Georgs Urteil als eigener Auftrag. Anatomie je Zone aus der Saat: Größe, Relief, Anzahl und Lage der Karten.
3. **Farbe und Shader:** Farbe aus der Themen-Mischung des Orts (V-951, V-1006) zusammen mit dem Deck, keine gesetzten Biome. Die HyperNorm-Schicht je Zone kommt aus der Deck-Saat, liegt auf dem Boden der Zone und zeigt die Karten dieses Decks (V-1002). Nimm die Fassung aus `design/kartengebaeude-r1` und prüfe die Exporte, bevor du eine neue baust.
4. **Einzelkarte:** liegt als echte Karte mit Kanon-Kante im Gelände und geht über den vorhandenen Kartenflug in den Almanach.
5. **Ziel-Pfeil:** zeigt die nächstgelegene noch nicht gesammelte Zone, bei ähnlichem Abstand die in Fahrtrichtung. Nach dem Sammeln wechselt er von selbst. Der Zustand lebt im Gedächtnis je Zelle (V-815), keine zweite Karten-Liste.
6. **Testfahrt:** Eine Start-Adresse schaltet Zonen, Wasser und die vorhandenen Begegnungen zusammen ein. Die Kartenzone wird zugleich eine Art im vorhandenen Begegnungs-Pool (I3, V-963), Auslöser zufällig oder passend zum Ort. Keine Zone liegt im Wasser oder auf einem Krater, das regelt die vorhandene Belegung `src/world/occupancy.js`.

## Rückgabe an WS0, dann Stopp
Einzelbilder aus dem Spiel in voller Größe (V-1100): drei Zonen an verschiedenen Orten mit drei Decks von weitem und nah, dazu eine einzelne Karte im Gelände und ein Video der Fahrt von einer Zone zur nächsten. Je Bild ein Satz, was abzunehmen ist. Tests nach Stufe A (V-1107), Zählwerte in `perf.json`, zwei Saaten. Commit, Tests, was ungeprüft ist. Kritiker höchstens einmal, eine Reparaturrunde je Befund.
