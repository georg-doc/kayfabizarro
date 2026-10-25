# WSB · Nach Runde 4: neue Richtung als Probe (V-814) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Stand:** Runde 4 REWORK 22/22. Die Stopp-Regel greift, die Reparaturen am bisherigen Weg enden hier; r812b/r812c bleiben als Stand liegen. Konzeptblatt: `replies/FARBROLLEN_KONZEPTBLATT_WSB.md` mit den Nachträgen V-808, V-809, V-812, V-814.

**Probe der neuen Richtung (V-814), nur drei Bühnen mit Bühnenrahmen:** TheaterStage_A_screen, UtopiaStage_A_screen.v2, NatureIsland_A_screen. Ausgang sind die `*_ids_r812b.glb`-Bauteile, die neue Fassung heißt `*_ids_r814.glb`.
- Code je Bauteil nur noch aus Geometrie und Textur-Grundfarbe, ohne B9-Mehrheit. Die Geometrie geht vor, wie in V-812 (Oberseite, steil, schlank, Schwellen wie r812). Für den Rest bestimmt die mittlere Textur-Grundfarbe des Bauteils die Rolle, mit diesen Regeln:
  - nur Codes aus `COLOR_CONCEPT_R1`;
  - `leaf` nur für Teile, die Pflanzen sind;
  - graue und dunkle Grundfarben (C* < 15) bekommen kein `rock`, sondern die Wand-Rolle `hill[0]` mit `gradient_map`;
  - die Wand-Regel aus V-806 nimmt als Mehrheit die Codes der Bauteile in der Wand, ohne B9.
  Die fertige Zuordnungstabelle steht in RETURN.md.
- Ausnahmen V-806 gehen vor; Bildschirm 255; Farbe nach V-809 mit dem Kanon-Modul (`gradient_map` bei C* < 15).
- **Fokus, von WS0 benannt:** auf allen drei Bühnen der gemalte Ornamentrahmen oben, unten und seitlich samt der Bildschirmkante, also alle Teile des Rahmens, nicht nur `kfb_screen_frame` (Runde-4-Mangel: `pad` nur an der Innenkante). Das Gate prüft, dass diese Teile Code 5 tragen.
- **Mesa (ohne Bau):** ein Blatt mit bis zu drei Kandidaten für das Wahrzeichen, je ein zusammenhängendes Bauteil, das man von weitem liest. WS0 benennt danach den Fokus im Konzeptblatt; erst dann wird Mesa gebaut.
- Mesh, COLOR_0, Browser-Fassung und Stein-IDs (V-406) bleiben byte-gleich (Hash-Gate wie r812).

**Prüfung:** Farbrollen-Gate grün (V-812 ohne B9-Mehrheit, V-808-Fokus, Bildschirm, Hash), Gate M5; dann blinder Kritiker nur K2 mit den Bildern laut Konzeptblatt (4 Kameras, Canyon und random(803)). Die Probe gilt als Gewinn, wenn das K2-Mittel der drei Bühnen über ihrem Runde-4-Mittel liegt (Theater 6,5, Utopia Stage 7, Nature 6,5, also über 6,7).

**Einfärbbarkeit:** Die neun Bühnen, die sich nicht sauber einfärben lassen, bleiben nach V-809 vorerst aus dem Spiel. Ausnahme Gefängnis: Georg hat es dunkel-violett freigegeben (q232).

**Rückgabe:** Kritiker-Urteil; je Probe-Bühne ein Blatt vorher/nachher (Canyon) ohne Fachbegriffe; das Mesa-Kandidaten-Blatt; RETURN.md mit Zuordnung Grundfarbe → Rolle und Gate-Ergebnis.
