# WSB · Meshy-Bühnen: Bauteile, Code aus der Geometrie, voll (V-809, V-812) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Übernommen:** `gradient_map` (r809) steht jetzt im Kanon `CANON_3D/lib/kfb_clay_bpy.py` (Sicherung `kfb_clay_bpy.vor_V809.py`). Schwelle: mittlere Albedo-Buntheit C* < 15.

**Auftrag: die 19 B9-Bühnen mit REWORK aus Runde 3 außer Giza** (Giza wartet auf das Konzeptblatt von WS0; Atlantis bleibt). Die Kit-Dioramen der Gruppe 2 (Imbiss, Kayfabrick, RPG-Camp) haben keine B9-Stein-IDs und abgenommene Rollen je Teil: Sie bekommen nur die Farbe nach V-809 (Kit 0,85 mit Deckel), keine Bauteil-Neueinteilung. Ausgang je Bühne ist die neueste Fassung `*_ids_r808b.glb` bzw. `*_ids_r806d.glb`, wo es keine r808b gibt; die neue Fassung heißt `*_ids_r812.glb`. Konzeptblatt: `replies/FARBROLLEN_KONZEPTBLATT_WSB.md` mit den Nachträgen V-808, V-809, V-812.
- **Bauteile nach V-812** (dein `VORSCHLAG_BAUTEILE_R1.md`, übernommen): Spiel-Mesh verschweißen, an Knickkanten über 40° trennen, Bauteile über 15 % der Bühne nach Richtung teilen, danach an die Stein-IDs rasten (jeder Stein ganz an sein Haupt-Bauteil; V-406 R+G byte-gleich). Das ersetzt in V-808 die Zeile „Normalen höchstens 35° vom Mittel der Fläche“.
- **Code je Bauteil aus der Geometrie:** Oberseite → `top`, steil → `hill[0]`, schlank → `tower` (V-402; schlank wie in V-806: Höhe > 2 × Grundfläche). Die Schwellen für Oberseite und steil schlägst du vor und weist sie in RETURN.md aus. Die B9-Mehrheit entscheidet nur, wo die Geometrie keine dieser drei Formen ergibt. Die Ausnahmen aus V-806 gehen vor; genau ein Fokus-Teil trägt `pad` (V-808); Bildschirm 255.
- **Farbe nach V-809:** Meshy-Rollen-Teile Zug 1,0 ohne Deckel, `gradient_map` für Teile mit C* < 15, Kit-Teile 0,85 mit Deckel, Fokus mit Helligkeitszug.
- Mesh, COLOR_0 und Browser-Fassung bleiben unverändert (V-136, Hash-Gate wie r808b).

**Prüfung:** Farbrollen-Gate grün, erweitert um V-812 (ein Code je Bauteil, Stein-IDs byte-gleich) und die V-808-Prüfungen; Gate M5. Dann blinder Kritiker Runde 4 nach `CRITIC_3D_R1.md`, wie die Runden 1–3 nur K2 (Farbe), mit den Bildern laut Konzeptblatt (4 Kameras, Canyon und random(803)); Maßstab: Rolle erkennbar, ruhige Flächen, Zeichnung erhalten (das Maß sanft entfällt für Meshy-Rollen-Teile, V-809).

**Rückgabe:** zusätzlich zu den Kritiker-Bildern je Bühne ein Blatt vorher/nachher (Canyon), Beschriftung ohne Fachbegriffe; Gate-Ergebnis; Kritiker-Urteil; RETURN.md mit einer Zeile je Bühne (Fokus-Teil, Anteil `gradient_map`, ob sie sich sauber einfärben lässt; was nicht, bleibt nach V-809 vorerst aus dem Spiel, Kandidat Prison, Georg entscheidet in q232).
