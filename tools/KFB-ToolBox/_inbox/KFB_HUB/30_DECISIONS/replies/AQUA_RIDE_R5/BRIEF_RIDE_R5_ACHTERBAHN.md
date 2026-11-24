# Brief · Ride R5: echtes Achterbahn-Gefühl (WS0, 24.11.2026, Georg q865)

**ABSICHT:** Die Fahrt fühlt sich an wie eine Achterbahn unter Wasser, nicht wie ein gerader Röhrenflug. Steile Abfahrten mit Magenkribbeln, Schwerelosigkeit über Kuppen, tief geneigte Steilkurven, Spiralen und Überschläge, Tempo wechselt mit der Musik. Die Kamera spürt jede Kraft. Der Fisch reagiert sichtbar: Er legt sich in Kurven, und wenn man ihn frontal sieht, wechselt sein Gesicht (glücklich, ängstlich, skeptisch, verwirrt …). ECHO spricht von schlichten schwarzen 3D-Flächen am Rand, nicht von gemalten 2D-Monitoren.

**GENRE:** Cartoon-Action-Abenteuer, Unterwasser-Rollercoaster (Aqua 1.0, wiederverwendbar für KFB). Fokus: Fahrgefühl, Musik, Figur.

**OWNER:** ein Agent im Auftrag von WS0, Arbeitskopie `~/kfb-ws0/waffen-wt`, neuer Zweig `ws0/ride-r5-achterbahn` ab `ws0/ride-r4-hypernorm` (HyperNorm-Röhre bleibt, wie sie ist). Merge macht WS0, Übernahme in den Aqua-Host macht der Aqua-Chat.

**ZIEL (Georgs drei Punkte, q865):**
1. **Achterbahn-Strecke:** Fahrlinie und Fahrphysik in `src/ride/rideBahn.js` nach dem Denkmodell echter Achterbahnen neu choreografieren (Lifthill/Ansaugen → erster Drop → Airtime-Kuppen → Steilkurve mit Querneigung → Helix → Inversion/Korkenzieher → Bremsstrecke vor dem Ausstieg). Elemente nach der Songkarte `src/data/ride/cartoon_chase.songkarte.json` verteilt: Drops und Inversionen auf Drops/Einsätze, ruhige Takte = Kuppen und weite Kurven. Kein gerades Stück länger als etwa 2 s. Tempo folgt Höhe (Energie) plus Musik. Röhre, Ringe, Blasen und Engine folgen der neuen Linie (bestehende Module, nur neu ausgerichtet).
2. **Kamera spürt die Kräfte:** Querneigung mit der Schiene (Rollen in Steilkurven), Nachlauf und Vorausblick in Kurven, vertikales Federn bei Drops und Kuppen, kurzer Sichtfeld-Stoß bei Beschleunigung, leichtes Rütteln nur an Übergängen. Alles aus der Fahrphysik abgeleitet, keine Zufallswackler. Frontale Fisch-Momente (Kamera vor dem Fisch) an 3–5 Stellen der Choreografie, je kurz.
3. **Fisch-Spur für den Host:** Der Stand meldet zusätzlich `fisch: { lage: { roll, nick, gier }, stimmung, staerke, blick: { x, y }, frontal }`. `lage` = Körperneigung in Kurven, Drops, Airtime. `stimmung` aus einer kleinen festen Liste (`gluecklich`, `aengstlich`, `skeptisch`, `verwirrt`, `begeistert`, `erleichtert`) mit `staerke` 0…1 (fein/cartoon/extrem nach V-1780-Prinzip; Extrem nur bei Drops und Inversionen), aus den Bahn-Ereignissen abgeleitet (Drop → ängstlich, Airtime → begeistert, Inversion → verwirrt, ruhige Kuppe → skeptisch, Ausstieg → erleichtert). `blick` = wohin die Augen schauen (Kurveninnenseite, Monitor, Kamera bei frontal). Mimik selbst spielt der Aqua-Host auf seinem Augen-Rig; das Modul liefert nur die Spur.
4. **ECHO als schwarze 3D-Flächen:** Die mitgelieferte Monitor-Tafel des Rides wird eine schlichte schwarze 3D-Fläche (abgerundeter flacher Block, eine klare Form, keine gemalte 2D-Tafel, kein Rahmen-Bild), Text und Glitch weiter über die Sender-Ebene der Engine. Gleiche Stellen, Zeilen, `echo`/`ducken` wie R4. Die Host-Option `monitor` bleibt, die Voreinstellung ist die schwarze Fläche.
5. Schnittstelle `createRide` kompatibel zu R4; neue Felder nur ergänzend, in der Kopfzeile dokumentiert.

**FERTIG:**
1. Bildzeit höchstens +1 ms gegenüber R4 (gleiche Kamera, Readback-Methode).
2. Gate in Zahlen: Anteil gerader Strecke (Krümmung und Neigung unter Schwelle) unter 10 %, mindestens je ein Drop, eine Airtime-Kuppe, eine Steilkurve, eine Helix, eine Inversion; Querneigung der Kamera folgt der Schiene; `fisch`-Spur an jedem Ereignis gesetzt.
3. Belege unter `replies/AQUA_RIDE_R5/_privat/belege_r<n>/`: Video des ganzen Rides mit Song, Stills je Element, Protokoll (Zeitpunkte der Elemente, Stimmungs-Wechsel, Monitore). Für die frontalen Momente ein Platzhalter-Fisch, der die Spur sichtbar macht (nur im Beleg, nicht als Mimik-Lösung).
4. Stille Blind-Kritik (tools/CRITIC_BLIND_PROMPT.md, tools/qa_matrix.r1.json): frischer Kritiker je Runde nur mit ABSICHT, GENRE, Belegen; ≤ 5 Runden, Stopp nach 2 ohne Verbesserung, Paarvergleich gegen den R4-Beleg (`replies/AQUA_RIDE_R4/_privat/belege_r4/ride_r4.mp4`). PASS: keine Achse < 7, Mittel ≥ 8.
5. CI wie Stamm, Rauchtest, `KFB_SPLIT=1`-Build grün; Zweig pushen, nicht mergen. Rückgabe als neue Datei RETURN_R5 (Markdown) im Ordner dieses Briefs: Schnittstellen-Änderungen für den Aqua-Host, Gate-Werte, Kritik-Verlauf, offene Punkte.

**GRENZEN:**
- HyperNorm-Röhre, Farbwechsel und Engine-Einstellungen aus R4 nicht ändern. Keine neue Projektionsengine, keine eigenen Shader-Looks.
- Keine Mimik-Modellierung im Modul (gehört dem Aqua-Host); keine Texte außer Georgs drei ECHO-Zeilen.
- Kein Übelkeits-Zufallswackeln, keine Kamera-Tricks statt Bahn-Bewegung.
- `src/private/` nie committen; kein `npm ci`; GPU-Lock (`/tmp/kfb_gpu.lock`, es laufen parallel Feuer- und Rauch-Agenten); eigene Server mit `srv.stop()`; `df -h ~` vor Builds, ein Build-Ordner.
- Kein Animatic, keine Referenzsuche als Zwischenschritt, keine Rückfragen-Schleifen.

**DETAIL:** Stand R4 und Host-Schnittstelle: `replies/AQUA_RIDE_R4/RETURN_R4.md`. Ride-Modul `src/ride/` (createRide.js Kopfzeile, rideBahn.js Fahrphysik/Uhr, rideWelt.js Röhre, rideFx.js Blasen, rideRinge.js Ringe). Register V-2083/V-2084 (Ride R2/R3), V-2088 (HN-Kammer), V-1780 (Mimik fein/cartoon/extrem). Bewegungs-Prinzipien: cartoon-motion (Antizipation, Bögen, Nachschwingen).
