# WSB · Grundsatzwechsel Meshy-Farben: Textur-Farbcluster → Palette (V-816) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Warum:** Zwei Wege mit Codes je Mesh-Teil haben keinen Gewinn gebracht (Runde 4, V-814). Die Meshy-Meshes haben keine sauberen Bauteile, und in den Paletten liegen `top` und `hill[0]` im selben Farbton. Das Ergebnis wird einfarbig violett, und genau dieses Monochrom will Georg vermeiden (V-800/V-802). Deshalb färben wir auf Meshy-Bühnen nicht mehr über Codes am Mesh, sondern über die Farben der Textur selbst.

**Verfahren (V-816):**
1. Je Bühne die Albedo-Textur in 4–6 Farbcluster teilen (OKLab, nach Farbton und Buntheit, nicht nach Helligkeit).
2. Die Cluster nach Flächenanteil ordnen und auf die Leitfarben der Biom-Palette legen, im Verhältnis 60/30/10 (Etherington):
   - größter Cluster → Boden-Familie (`top`/`hill[0]`);
   - zweiter → `strang` (Vierteldrehung);
   - dritter → `tower` (Gegenfarbe);
   - weitere Cluster → `rock`, `sand`, `under[1]`.
   `pad` trägt nur der Fokus, nicht ein Cluster (V-808). Ein grüner Bewuchs-Cluster (Gras, Pflanzen) geht auf `leaf[0]`/`leaf[1]` und zählt nicht im Rang (V-806/V-814). Liegt derselbe grüne Cluster auch auf Nicht-Pflanzen (Embleme, Rohre, Banner), bekommen diese Stellen die Rolle nach Rang, nicht `leaf`. Grau und dunkel (C* < 15) bleibt Boden-Familie mit `gradient_map`.
3. Helligkeit und gemalte Zeichnung bleiben; nur Farbton und Buntheit gehen zur Ziel-Leitfarbe (Zug 1,0, V-809).
4. Umsetzung als Farbtabelle für die Textur bzw. als Material-Option im Kanon-Modul `kfb_clay_bpy` (Kanon-Vorschlag r816, Standard aus), nicht in die Textur gebacken und nicht in COLOR_0. Mesh, Stein-IDs (V-406) und Browser-Fassung bleiben byte-gleich (Hash-Gate).
5. Der Bildschirm bleibt ohne Rolle (V-329). Fokus mit `pad` ist der ganze Ornamentrahmen samt Bildschirmkante als eine Fläche; beim Theater ausdrücklich mit den Kartuschen und den Ornamentfeldern der Pfeiler (Mangel aus V-814). Der Fokus zieht auch die Helligkeit (V-806/V-809).

**Nur Probe im Blender-Bild:** r816 ändert den Farbcode-Kanal (COLOR_1 B) nicht; der bleibt wie r812b. Ob und wie das Verfahren in die Laufzeit kommt, entscheidet WS0 nach Georgs Wahl. Konzeptblatt mit dem neuen K2: `replies/FARBROLLEN_KONZEPTBLATT_WSB.md`.

**Probe:** TheaterStage_A_screen, UtopiaStage_A_screen.v2, NatureIsland_A_screen, PrisonPanopticon_A_screen.v2. Ausgang und Bezug fürs Hash-Gate sind die `*_ids_r812b.glb`; neue Fassung `*_r816.glb`.

**Prüfung:**
- Farbrollen-Gate grün: Hash, Bildschirm 255, `pad` nur am Fokus, Gate M5. Die Clusteranteile stehen je Bühne in RETURN.md. Liegt eine Textur zu über 80 % in einem Farbton, so dass 60/30/10 nicht erreichbar ist, wird das ausgewiesen und nicht nachgebaut; WS0 entscheidet.
- Danach blinder Kritiker mit geändertem Maßstab: K2 heißt jetzt „gehört sichtbar zum Biom, mehrere Palettenfarben im Verhältnis 60/30/10, Zeichnung erhalten, kein Monochrom, keine Flecken und keine harten Farbsprünge auf durchgehender Fläche“. Bilder laut Konzeptblatt (4 Kameras, Canyon und random(803)).
- Gewinn: K2-Mittel der vier Bühnen ≥ 7.

**Rückgabe:**
- Kritiker-Urteil;
- je Bühne ein Blatt mit drei Spalten: wie geliefert · letzter Stand (r814, beim Gefängnis r812b) · r816 (Canyon), ohne Fachbegriffe;
- RETURN.md mit Clustern, Zuordnung und Anteilen je Bühne;
- die Option als Kanon-Vorschlag unter `50_BLENDER/V803_FARBROLLEN/kanon_vorschlag/`.

**Mesa:** Fokus ist die Kappe, auf ≤ 10 % eingeengt (WS0, Kandidat 1). Mesa wird erst nach dieser Probe gebaut.
