An WS0 · Knete v1.2 „Lichtkante“ · Georg PASS 15.11.

Georg hat am 15.11. das Stilbild „Lichtkante“ mit PASS abgenommen. Das Bild zeigt FB aus der SSOT r1i als „Datei | Look“, Kanon-Wache bestanden. Daraus ist kfb-clay v1.2 entstanden.

**Dateien:**
- Ordner: `KFB_HUB/30_DECISIONS/replies/CLAY_SSOT_R1/`
- `kfb-clay.v1.2.js` (sha256 `9c60ecd6…88be`); v1.1 bleibt unverändert.
- Was sich ändert und was geprüft wurde: oberster Abschnitt in `RETURN.md`.
- Stilbild, Harness und Belege: `replies/CLAY_LICHTKANTE_R1/` (RETURN.md, evidence/fb_ssot_*_r3.png).

**Inhalt:**
- Nur die großen Daumendrücke (dent2) bekommen eine Lichtkante: flacherer Boden, steilere Wand, höherer Wulst, überwiegend als Halbmond.
- maxSlope steigt in allen drei Profilen auf das 1,5-Fache.
- Die kleinen Dellen rechnen exakt wie v1.1.

**Geprüft:**
- Unit 43/43, Golden G0 bis G5 PASS.
- v1.2 trifft das abgenommene Stilbild auf höchstens 1/255.

**Bitte im Spiel:**
1. kfb-clay.v1.2.js byte-gleich nach `src/vendor/clay/` legen. Den Import in `claySSOT.js` hinter einen Schalter setzen; v1.1 bleibt der Rückweg.
2. clayBake ist verträglich. Die größte dent2-Gradienten-Komponente liegt bei 0,878 (character), die Grenze `RANGE.dent2` bei 0,9. Vorschlag: auf 1,2 anheben, dann `test/claybake.mjs`.
3. Knetkorn (V-1451): Die Wiederaufnahme-Bedingung „Lichtkante statt Abdunklung“ ist erfüllt, sobald der Adapter die v1.2-GLSL nimmt.
4. FB-Web-Kanon (WSB) mit v1.2 neu backen. Dabei aus r1i die alten `userData.kfbClayOrig`-Extras an `KFB_Tail_Bunny` und `KFB_Shirt_FB` entfernen: Wer `applyClay` oder `removeClay` auf die Datei anwendet, bekommt sonst ein JSON-Objekt statt eines Materials.
5. Beleg im Spiel mit Fahrkamera und von vorn, mit FB-Kanon-Wache, dann Hub-Karte.

**Offen:**
- Der Krater-Check lief nur per Sicht. In mittlerer Entfernung lesen sich einzelne Bodendellen noch leicht als kleine Krater.
- Die Kosten am Gelände (live) sind nicht gemessen.
- Eine Register-Zeile habe ich nicht geschrieben; das ist deine.
