# Für WSA Patch (Infinite Rooms) · R3: Ort frei wählbar, Eingang als Bodenluke, Karten-Räume ausführbar · 16.11. (Georg, V-1851)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzeptblatt: Die Karten-Räume deckt das vorhandene `replies/PATCH_TRANSFER_R1/KONZEPTBLATT.md` ab. Für Luke, Deckel und Schacht hat WS0 `replies/PATCH_TRANSFER_R1/KONZEPTBLATT_R3_LUKE.md` geschrieben (alle Pflichtfelder). Beide gelten vor dem Bau. Bildmaterial bleiben die vorhandenen Karten- und HyperNorm-Bilder, unverändert; kein neues Design-Paket.

**Kern (3 Zeilen):**
1. Dein R2 ist übernommen (Zweig `ref/infiniterooms-r2` @d1785fe im Repo `georg-doc/KFB-Stunt-Car-Race`, unverändert). Die Voxel-Zerstörung und der Generator sind gut. Ins Spiel kann R2 aber noch nicht: Der Testtunnel liegt fest am Weltnullpunkt, und dort ist bei uns der Start.
2. Georg will den Raum **im Untergrund**: Man betritt ihn durch ein rechteckiges Loch oder eine Falltür im Boden einer Viertel-Parzelle, die man auch zerstören kann. So muss kein Würfel in der Landschaft stehen, und innen darf er größer sein als außen. Ebene 1 liegt direkt unter der Oberfläche, darunter geht es später dungeonartig tiefer.
3. R3 macht daraus ein Stück, das WS0 an jeden Ort setzen kann, mit den Karten-Räumen als ausführbarem Teil.

**Pflichtbild:** `replies/KARTENVIERTEL_FT_R1/FT1L_Vergleich_Wohnhaus_Buero.png` (Kartenviertel im Spiel); für Luke, Deckel und Schacht reicht das Konzeptblatt R3_LUKE ohne eigenes Bildpaket (WS0).

**Grundlage:**
- R2 wie oben.
- Spiel-Stamm `game/integration-r2` @b13e5bab (gleiches Repo).
- Technik wie im Spiel (V-1690): WebGL, three 0.186.1, Rapier 0.19.2. Kein eigener Renderer, keine eigene Spielschleife. Die Reihenfolge `impact` → `beforePhysics` → Spielschritt → `afterPhysics` → `update` bleibt wie in R2.

**Was du baust:**
1. **Ort und Drehung:** `createInfiniteRoomsLevel({ …wie R2, origin: { x, y, z }, yaw, seed })`.
   - Netze, Kollider, Werkzeug-Treffer, Raumerkennung, Licht-Grenzen und Trümmer rechnen im lokalen Raum dieses Ursprungs.
   - Es ist immer nur eine Ebene geladen, mit sauberem `dispose()` und Wiederbetreten.
   - Prüfung: gleiche Ergebnisse bei Ursprung 0 und bei einem weit entfernten Ursprung (zum Beispiel 3000 m) mit Drehung.
2. **Eingang als Bodenluke:**
   - Ein rechteckiger Schacht von der Oberfläche in Ebene 1, oben mit einer rechteckigen Falltür passend zum Rahmen (Konzeptblatt R3_LUKE). Durch ihren Spalt sieht man den vom Licht-Rig beleuchteten Raum darunter; nach außen kein eigenes Licht, keine Emission (V-385). Der Deckel öffnet sich über einen Auslöser des Spiels oder geht über `impact` (Schuss, Bombe, Bohrer) kaputt.
   - Die Öffnung ist mindestens 3 × 3 m (FB 1,81 m mit Jetpack; später kleine Fahrzeuge).
   - Treppen im Schacht nur nach dem Walker (Setzstufe 0,30 / Tritt ≥ 1,3 lab, V-160, V-157). Alternativ ein freier Schacht zum Hinabgleiten mit dem Jetpack.
   - Schnittstellen: `entrance()` → `{ position, size, normal, open }`. Die Luke läuft als interactable über `portale.go` und löst die vorhandenen `portal.*`-Ereignisse aus (V-1442, V-1431); `infiniterooms.enter` und `infiniterooms.exit` kommen nur zusätzlich als Bereichs-Ereignisse, kein zweiter Portal-Auslöser.
   - Rahmen, Deckel und Schacht: Knete über `kfb-clay` (Profil `midground`), Farben aus den Palettenrollen der Parzelle, Kontakt-Geometrie und dunkler, nie schwarzer Kontaktton an der Fuge zum Gelände (V-565, V-570), wie im Konzeptblatt.
   - Rundherum bleibt das Gelände der Parzelle stehen. Vom Raum ist außen nichts zu sehen außer der Luke.
   - Kanten nach der Abschluss-Grammatik (V-168, V-577, `CANON_3D/sources/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`): Lukenrand, Schachtkante zum Gelände, Deckel sowie Wand-, Gang- und Raumenden enden als gerundete Abschlusskappe; freie Bruchenden über Verfall bzw. Rubbel. Nur über `kfb_edge` bzw. sein Laufzeit-Gegenstück, keine eigene Kantenlösung, keine scharfen CAD-Kanten. „Rechteckig“ gilt für den Grundriss, nicht für eine harte Schnittkante.
   - Fortbewegung: Die Luke ist ein Portal wie alle anderen und verhält sich für Fuß, Jetpack und Wagen gleich (V-1430, V-1431, V-1442); die Schnittstelle bleibt dafür offen. In R3 prüfst du Fuß und Jetpack; den Wagen nimmt WS0 im Spiel dazu (Georg plant später kleinere Spielzeug-Fahrzeuge). Der Auslöser am Deckel ist die eine Interaktionstaste I (`ACTION_KEYS.interact` über den einen Router, V-1474).
3. **Karten-Räume ausführbar:**
   - Die Wand-, Boden- und Deckenmotive aus R51/R52 (Projektion je Fläche, kein Tapetenmuster, höchstens 6,8 m je Bildabschnitt) kommen als Teil des Pakets, nicht nur als Referenz.
   - Bilder holt das Paket über einen Anschluss des Spiels: `cardImage(id)` → Adresse aus der Asset-Pipeline des Spiels, keine eigenen Kopien.
   - Die Projektion der Kartenbilder auf Raumflächen (ohne Kartenkante) ist ein Vorschlag aus deiner Site. Es sind Raumflächen, keine Karten im Sinne von V-1348 (WS0); zeigen sie HyperNorm, dann als Fläche des einen Kerns. Georg nimmt sie mit dem WS0-Video aus dem Spiel ab (nach Gate und blindem Kritiker) (V-1525 beachten: keine aufgeklebt wirkenden Bilder). Fällt sie durch, kommen die Motive als integrierte, gerahmte Flächen.
   - Die Motive sind beleuchtetes, mattes Material im einen Licht- und Tonpfad (LIGHT_MODEL_R2 Regeln 8 und 9), nicht unbeleuchtet und nicht leuchtend. Es sind Bildflächen, keine Kartenobjekte (Kartenobjekte nur über das eine Kartenmodul, V-1348). HyperNorm-Bilder auf Raumflächen nur als Fläche des einen `kfb-hypernorm`-Kerns mit Manifest-Material (V-1540), keine eigene Projektions-Engine dafür.
   - Mindestens zwei Räume mit Gang und einem zweiten Ausgang.
4. **Übergang beim Eintritt:**
   - Zuerst eine Seite Choreografie (Zustände, Luke, Spieler, Kamera, Ton) als Teil der Rückgabe, dann bauen. Grundlage ist der eine Übergangsweg des Spiels (`src/world/tuerPortal.js` mit TransitionDirector und JSON-Rezept), kein zweiter.
   - Georgs Wunsch für später: kippend hineinfahren, Escher-artig mit Schwerkraft nach der Eintrittsseite. Für R3 reicht ein flüssiger Fall bzw. Gleitflug in Ebene 1. Das Kippen beschreibst du nur in der Choreografie, du baust es noch nicht.
5. **Zerstörung auf einer Effekt-Ebene mit dem Spiel:**
   - Jeder Treffer und jeder Bruch meldet `infiniterooms.impact` mit Ort, Normale, Werkzeug und Stärke.
   - Rauch, Funken, Bruchkanten und Ton macht dann das Spiel mit seinen vorhandenen Effekten. Eigene Effekte im Paket nur als Platzhalter hinter einem Schalter.
   - Trümmer: weiter dein begrenzter Pool. WS0 vergleicht ihn im Spiel mit der Viertel-Zerstörung (Georg: Best-of-Breed).
6. **Platz für Gegner:** `spawnPoints(room)` liefert freie Bodenpunkte je Raum. Die Würfelmonster setzt das Spiel selbst ein (V-1849).
7. **Ton und Licht wie R2:** nur lesend über `audioPulses()`, `nowPlaying()` und `musicPaused()`, Licht nur über den Anschluss `setRoomProfile`. Kein eigener AudioContext, kein eigenes Licht (V-841, V-385).

**Nicht in R3 (Ausblick, damit du die Schnittstellen dafür offen hältst):**
- Karten als Spielflächen im Raum (wie die Kampfarena: Karten als Plattformen, Sprunghilfe, später drehende Karten).
- Portal-Gun (Loch in eine Karte schießen, Escher-Wege).
- Kleine Spielzeug-Fahrzeuge ohne Fahrer-Rig und ein Schwebe-Modus mit dem Jetpack.
- Mehrere Ebenen nach unten (Dungeon-Tiefe).
- Höhlen- und Mineneingänge aus Georgs Meshy-Modell; die bereitet WS0 mit dem Mac mini auf.

**Rückgabe:**
- Paket R3 wie R2 (Tests, Belege, `SOURCE_LOCK`), als Zweig `wsa/infiniterooms-r3` im Repo oben oder als Paket wie R2.
- Tests zusätzlich für: Ursprung und Drehung, Luke auf und zu bzw. zerstört, Karten-Flächen vorhanden, `dispose` und Wiederbetreten ohne Reste.
- Kurzes Video auf deiner privaten Seite als Technik-Beleg: Luke in einer Geländeplatte, Hinabgleiten, zwei Karten-Räume, ein Wanddurchbruch. Dazu die Bildzeit. Die Look-Abnahme ersetzt es nicht; die macht WS0 im Spiel in einer echten Viertel-Parzelle mit Spielkamera (CANON_3D Gebiet 15).
- RETURN mit den Abweichungen. WS0 hängt R3 hinter einen Schalter in die Mitte eines zerstörten Viertels und baut die Hub-Karte für Georg.
