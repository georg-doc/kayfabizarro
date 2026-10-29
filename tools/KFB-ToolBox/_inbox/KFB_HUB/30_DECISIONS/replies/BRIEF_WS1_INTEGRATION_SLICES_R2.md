# WS0 → WS1 Lead (+ WS1b, WS1d, WS-NPC, WS-Audio) · Integrations-Slices Fr 30.10. bis So 1.11. (verschoben von Do) zur spielbaren prozeduralen Welt (V-963) · 28.10.2026

**Tier 0**
1. **Ein Zweig, ein Besitzer:** WS1-Lead besitzt von Do bis So den Integrationszweig `game/integration-r2` (Abzweig von `game/proc-world-ws0` beim Commit, den WS0 oben in `replies/WS0_TO_WS1.md` nennt). WS0 schreibt in dieser Zeit keinen Spielcode. WS1b–e arbeiten in eigenen Zweigen und geben nur über WS1-Lead ab.
2. **Bestand vor Neubau (V-956, V-748):** vorhandene Module einhängen, nichts nachbauen. Keine selbst gebauten Animationen. Höchstens zwei Runden je Slice, dann Frage an Georg über WS0. Keine Kritiker-Schleifen auf Details, die man im Spiel nicht sieht.
3. **Abnahme im Spiel:** normale Kamera-Entfernung, kurzer Clip je Slice. Jeder Slice hängt hinter einem Hash-Schalter, bis Georg ihn abnimmt; das Standard-HUD 3D bleibt dabei immer an (V-743).

**Warum:** Georg 28.10.: Das Wochenvolumen ist knapp (Reset So 22 Uhr). WS0 geht in einen sparsamen Steuer-Modus, WS1 fährt die Integration. Am Sonntag übernimmt WS0 wieder. Diesmal darf es keine Merge-Probleme geben: Ziel ist eine wirklich spielbare prozedurale Welt aus den vorhandenen Modulen.

**Merge-Regeln (verbindlich):**
- Gemeinsame Dateien (`src/main.jsx`, `src/m1/M1World.jsx`, `src/m1/M1Player.jsx`, `src/m1/travelState.js`, `package.json`) ändert nur WS1-Lead. Neue Funktionen kommen in eigene Dateien und hängen sich an einer Stelle ein.
- Jeden Morgen `game/proc-world-ws0` in den Integrationszweig mergen (es kommt nur noch WS0-Kleinkram dazu).
- Vor jeder Übernahme eines Slices: `npm run build`, `cp -R site-extra/h15 dist/`, dann grün `test/host.mjs`, `test/j7-roof.mjs`, `test/fb-shoulder-shadow.mjs`, `test/closing-build.mjs`, `test/terrain-seams.mjs`, `test/hud-3d.mjs`, `node test/fb-canon.mjs`, `bash test/npc-suite.sh` (bekannte Altfehler benennen) und `node scripts/ws0/feature-check.mjs`. Ohne Grün kein Merge.
- **Übergabe So bis 20 Uhr:** `UEBERGABE_INTEGRATION_R2.md` auf `ws1/status` mit genau einem Commit, Testliste mit Ergebnis, Schalterliste (an/aus), bekannten Fehlern, offenen Fragen an Georg. WS0 merged dann einen Zweig.

**Slices (Reihenfolge):**
1. **I1 Kern:** Endlos-Welt als Standard (`world=endless` wird Standard, alte Welt per Schalter), mitwandernder Weltursprung gegen Zittern in großer Entfernung, Gedächtnis je Zelle (eingesammelt, gesprengt, erledigt bleibt so). Grundlage V-815.
2. **I2 Themen-Saat statt Biome (V-951):** jeder Fleck mischt Themen nach Saat; Platzierung nur über `kfb-place` (V-748). Dazu die Verteilung der Material-Steine (Wüste usw.) über `kfb-place` statt eigener Streuung.
3. **I3 Begegnungen in der Endlos-Welt (V-941, V-942):** NPC-Szenen im Szenenformat `kfb.scene/1`, Amphitheater, Karte als Gelände je Zone in einen Pool; Auslöser zufällig oder passend zum Ort. Figuren nur mit KFB-Eye-Rig, FrizzleBob nur als FB_CANON, Texturvarianten nach Register (V-391, V-658, V-928). Emanata erst als Teil der Choreografien (Schalter `emanata=1` bleibt bis dahin).
4. **I4 Wasser:** Seen und Flüsse auch im Endlos-Gelände, aufbauend auf den Oasen (V-904).
5. **I5 Unterwegs:** auf Basis des WS0-Abschluss-Builds (Figurenwahl, Jetpack-Flug, Flugsignal, neue Fahrzeugfarben) nur Fehler beheben und Übergänge glätten. Flugsteuerung und Flug-Haltungen bleiben bei WS0 (V-910); Bewegungs-Clips kommen von WS0 nach Georgs Wahl.
6. **I6 Klang je Thema (WS-Audio):** Klangbetten für Fahrt und Flug, gekoppelt an die Themen-Saat.
7. **I7 Spielschleife:** Orientierung (freier 3D-Ziel-Pfeil nach V-694), Karten einsammeln, Karte fliegt sichtbar ins Almanach-HUD.

**Nicht in diesem Block:** Kampf und Zerstörung in der Hauptwelt (läuft als eigener WSA-POC V-962), Planeten am Himmel, Relikte.

**Rückgabe:** je Slice kurze Status-Zeile auf `ws1/status` (Commit, Schalter, Testergebnis, Clip-Pfad); Fragen an Georg nur dort, wo er entscheiden muss.
