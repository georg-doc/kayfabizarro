An WS0 · Knete v1.3 (Kandidat) · Stopp-Bericht nach CRITIC_3D_R1 · 16.11.

Von WS-Design (Chat „Claymation Look & Animations“), Auftrag BRIEF_CD_KNETE_V13_R1 (q718, V-1839, V-1840).

**Ergebnis:**
- **Löcher sind weg.** v1.3 zeigt in keinem Bild Löcher, Krater oder Pocken; v1.1 im selben Bild schon (FB-Kinn, Bauch, Fels).
- **Claybound-Knete ist noch nicht erreicht.** Zwei blinde Kritiker gaben REWORK, mit 7,7 und 7,0 Punkten (gefordert 8). Ihr Befund:
  - FB ist glatt, ohne sichtbare Knete-Merkmale;
  - der Fels zeigt Knete nur nah;
  - Glanz wie von Fingerfett fehlt.
- Zwei Reparaturen brachten keinen Gewinn. Deshalb Stopp; Georg sieht die Bilder nur als Stopp-Bericht.

**Dateien:**
- Kandidat: `replies/CLAY_SSOT_R1/kfb-clay.v1.3.js` (sha256 `2c905c40…e8c5`); v1.1 byte-gleich.
- Bericht: `replies/CLAY_REFERENZ_R2/RETURN_v13_stilbild.md`, mit Werten je Baustein und Bild-Bezug, Materialantwort je Profil und Runden.
- Stilbilder: `replies/CLAY_REFERENZ_R2/evidence/v13_1_gesicht_r8.jpg`, `v13_2_ganz_r8.jpg`, `v13_3_fels_r8.jpg` (Spalten Referenz | v1.1 | v1.3), dazu `check_relief_gesicht_r8.jpg` als Diagnose.

**Was v1.3 baut:** Die Plätze von v1.1 bleiben, damit clayBake und kit-figure verträglich bleiben.
- dent2 wird die Daumenfläche: flach abgeschnitten, keine Schüssel.
- dent wird die Knickfalte: eine dünne Linie auf der Fläche.
- grain werden feine, wellige Fingerrillen, nur nah sichtbar.

**Geprüft:**
- Unit 51/51.
- Golden G0–G5 PASS; G2 stripePeak höchstens 2,50.
- Kanon-Wache FB (r1j) und Knete auf allen 9 Hautnetzen.
- Kein heller Saum (0 px bei 1080p).

**Bitte entscheiden:**
1. **Figuren:** Wie viel Knete soll FB nah zeigen? Der Brief sagt „am glattesten“, der Kritiker will „Knete sichtbar“. Mehr Daumenfläche auf FB reißt G2 oder geht Richtung Dellen.
2. **Spielbeleg vor einer dritten Stilbild-Runde?** v1.2 bestand im Stilbild und fiel im Spiel durch. Vorschlag: v1.3 als `knete13` hinter einen Schalter (aus), dann Spielkamera und von vorn.
3. **Glanz:** Die Datei-Rauheit gewinnt (Maximum-Regel im Modul). Fingerfett-Glanz entsteht nur über die Datei (WSB) oder eine Regeländerung im Modul.
4. **Subsurface:** wäre eine Änderung am Lichtmodell (V-385). Bauen oder lassen?

**Nicht von der Knete** (in v1.1 identisch, auch bei „Relief aus“): Streifen im Nasenschatten und feines Raster auf FBs Wange, gestufte Bühnenschatten.

**Befund am Rande:** Auch r1j trägt an `KFB_Tail_Bunny` und `KFB_Shirt_FB` noch die alten Extras `userData.kfbClayOrig`; ich verwerfe sie beim Laden.
