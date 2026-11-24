# Brief · Ride R4: Rausch durch die HyperNorm-Röhre (WS0, 24.11.2026, Georg)

**ABSICHT:** Der Ride ist kein eintöniger Röhrenflug mehr, sondern ein schwindelerregender Rausch: Nach dem Einsaugen kurz klares Wasser, dann nimmt die Fahrt Fahrt auf, und die Röhre bzw. ihr Hintergrund wird zur vorbeirasenden, nie wiederholenden HyperNorm-Engine, gemischt mit Wasser und Luftblasen. Abschnittsweise wechseln Farbe und Stimmung im Takt. Bis zum Ausstieg läuft die Engine weiter, danach landet man wieder in klarem Wasser. Drei kurze ECHO-Kommentare auf Monitoren am Rand führen die Geschichte der Flucht weiter.

**GENRE:** Cartoon-Action-Abenteuer, Unterwasser-Rollercoaster (Aqua 1.0, wiederverwendbar für KFB). Fokus: Fahrgefühl, Musik, Stimme; Lesbarkeit der Monitore nicht Pflicht.

**OWNER:** ein Agent im Auftrag von WS0, Arbeitskopie `~/kfb-ws0/waffen-wt`, neuer Zweig `ws0/ride-r4-hypernorm` ab Stamm `game/integration-r2` (aktueller Kopf). Merge macht WS0, Übernahme nach Aqua macht der Aqua-Chat.

**ZIEL:**
1. **HyperNorm-Röhre:** Die vorhandene Engine (`engine/hypernorm/adapter/fassade.mjs` → `createFlaeche`, Vorbild `src/scenelets/hnKammer.js`: Engine live als Band, Quellen wie dort) auf der Röhrenwand bzw. als Hintergrund hinter dem Glas, so dass die Ebenen schnell vorbeisausen (Bewegung aus der Fahrt, Parallaxe zwischen mehreren Ebenen/Tiefen). Kein eigener Look, Engine-Einstellungen unverändert bis auf Helligkeit/Mischung.
2. **Mischung mit Wasser:** Blasenfeld, Perlen und Blasenwolke bleiben; Wasser-Licht (sea.material) bleibt erkennbar; die Engine liegt dahinter bzw. als Schicht im Glas, nicht als flache Tapete.
3. **Dramaturgie nach Songkarte** (`src/data/ride/cartoon_chase.songkarte.json`): erster Abschnitt klares Wasser (nach dem Einsaugen), mit dem ersten Tempoanstieg blendet die Engine ein; je Songabschnitt ein Farbwechsel bzw. Übergang der Engine (sanft auf dem Takt, kein harter Schnitt); Engine läuft bis zum Ausstieg; im Ausstiegsmoment klares Wasser.
4. **ECHO-Monitore:** drei Kommentare an festen Stellen der Songkarte (ruhigere Takte, nicht auf Drops): „Free at last!“ · „But they're watching…“ · „Be careful, little fish…“ (Georgs Zeilen, wörtlich). Monitor im äußeren Blickfeld, abwechselnd links/rechts, leicht wackelnd mit der Fahrdynamik (Fliehkraft, Ruck), kurz sichtbar. Vorhandenen ECHO-Monitor-Look aus Aqua bzw. Stamm nutzen, nichts Neues gestalten.
5. **Ton bleibt beim Host** (Modul hat keinen Ton, wie bisher): Der Stand meldet `echo: { id, text, t }` im Startbild jedes Kommentars und `ducken` (0…1, Hüllkurve für leichtes Musik-Ducking um jeden Kommentar). Der Aqua-Host spielt die Stimme und duckt die Musik.
6. Schnittstelle von `createRide` bleibt kompatibel (Aqua tauscht nur den Import); neue Felder nur ergänzend, in der Kopfzeile dokumentiert.

**FERTIG:**
1. Bildzeit: Ride mit Engine auf Mittelklasse-Laptop höchstens +3 ms gegenüber R3 (gleiche Kamera, Readback-Methode); Engine `maxFps` wie in hnKammer.
2. Belege unter `replies/AQUA_RIDE_R4/_privat/belege_r<n>/`: ein Video des ganzen Rides (mit dem Song, damit Takt und Abschnitte prüfbar sind), Stills je Abschnitt; Protokoll mit Zeitpunkten der Farbwechsel und der drei Monitore.
3. Stille Blind-Kritik (tools/CRITIC_BLIND_PROMPT.md, tools/qa_matrix.r1.json): frischer Kritiker je Runde nur mit ABSICHT, GENRE, Belegen; ≤ 5 Runden, Stopp nach 2 ohne Verbesserung, Paarvergleich gegen R3-Beleg (`replies/DC_AQUARIUM/r61/ride_r61.mp4`). PASS: keine Achse < 7, Mittel ≥ 8.
4. CI wie Stamm, Rauchtest, `npx vite build` grün; Zweig pushen, nicht mergen.
5. Rückgabe als neue Datei RETURN_R4 (Markdown) im Ordner dieses Briefs: Schnittstellen-Änderungen für den Aqua-Host, Messwerte, Kritik-Verlauf, offene Punkte.

**GRENZEN:**
- Keine neue Projektionsengine, keine eigenen Shader-Looks, keine Kacheln; Bestand zuerst (HN-Kern, Blasen, Ringe, Monitor).
- Keine Texte außer Georgs drei Zeilen; Englisch.
- `src/private/` nie committen; kein `npm ci`; GPU-Lock; eigene Server mit `srv.stop()`; `df -h ~` vor Builds, ein Build-Ordner.
- Kein Animatic, keine Referenzsuche als Zwischenschritt, keine Rückfragen-Schleifen.

**DETAIL:** Ride-Modul `src/ride/` (createRide.js Kopfzeile = Schnittstelle, rideWelt.js Röhre/Dunst, rideFx.js Blasen, rideRinge.js Ringe, rideBahn.js Fahrphysik/Uhr). HyperNorm: `engine/hypernorm/` (kern.mjs, material.mjs, adapter/fassade.mjs + fassade.worker.mjs, adapter/flaeche.mjs EBENEN), Quellen und Einbindung wie `src/scenelets/hnKammer.js`. Register V-2083/V-2084 (Ride R2/R3), V-2088 (HN-Kammer).
