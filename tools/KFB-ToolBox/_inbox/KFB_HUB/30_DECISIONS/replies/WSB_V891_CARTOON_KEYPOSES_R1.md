# WSB · Cartoon-Locomotion: Schlüsselposen zuerst als Standbilder (V-891) · WS0 · 27.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Stand:** Georg will Fortbewegung im Cartoon-Stil, Vorbild Mario 64 (V-880, Paket kayfabizarro PR #456). WS0 hat das Gate SOURCE_ISOLATION_01 erledigt: `replies/WS0_CARTOON_LOCO_SOURCE_ISOLATION_01_RETURN.md` (Rig, Messung, Werkzeuge, Kontaktbogen `75_REFS/cartoon_loco_r1/loco_source_sheet.jpg`). Befund: Gehen fast ohne Wippen und Gewicht, Stand-Füße rutschen (Walking_B, Running_B), Sprünge ohne Ausholen, Quetschen und Strecken.

Quellen und Konzeptblatt lokal: `50_BLENDER/CARTOON_LOCO/_quelle/` (Kontaktbogen, Rig_Medium_MovementBasic.glb), `50_BLENDER/CARTOON_LOCO/KONZEPTBLATT.md`.

**Auftrag (nur Standbilder, noch keine Animation, kein Export ins Spiel):** Auf FrizzleBob aus FB_CANON (V-804), Rig Rig_Medium (23 Körperknochen), mit den eingebauten Blender-Werkzeugen (Pose Library, Breakdowner, Graph Editor):
1. CARTOON_WALK_A: vier Posen Kontakt, Tief (Gewicht, Knie gebeugt, Hüfte tief), Durchgang, Hoch (Zehenstand), deutlich mehr Wippen und Armschwung als Walking_B.
2. HIGH_JUMP_A: Ausholen mit Quetschen (tief, Arme hinten), Absprung mit Strecken (lang, Arme hoch), Scheitel (gesammelt), Landung mit Quetschen.
3. START_STOP_PIVOT_A: je zwei Posen für Anlaufen (Vorlage), Bremsen (Rücklage, Füße stemmen) und Wende (Drehung über den Standfuß).
Quetschen/Strecken höchstens 8 %, kurz und volumenerhaltend (V-179, V-060), über Knochen-Skalierung und Pose; stärkere Werte nur als zusätzliche Bild-Variante für Georg; keine neue Figur, kein Eingriff am Rig; Ohren laufen im Spiel über ear-dangle und bleiben in den Posen neutral.

**Gate für diesen Job:** Ausnahme zu Tier 0 Punkt 3: `kfb_env_bpy.run()` entfällt (keine Umgebung gebaut); G1–G7 und der blinde Kritiker gelten. Proof-Stage mit Knete und dem einen Licht-Rig; Posen in Blender mit `kfb_clay_bpy` und `kfb_light_bpy` (Proof-Stage-Module, FB aus FB_CANON); daneben je Pose das Original-Clip-Bild auf derselben Figur, Bühne und Kamera gerendert (Seite und schräg vorn, groß nebeneinander, V-195). Der Kontaktbogen von WS0 ist nur Orientierung (v5b). Blinder Kritiker nach `CANON_3D/CRITIC_3D_R1.md` mit der Frage: Lesen sich Gewicht, Ausholen und Streckung auf den ersten Blick wie ein Cartoon-Held? Georg sieht nur Bestandenes und nimmt die Posen ab; erst danach animiert WSB die drei Studien (eigener Auftrag).

**Ablage:** `50_BLENDER/CARTOON_LOCO/` (Posen als Pose-Library-Assets in einer .blend plus PNG-Blätter). WSB pusht nicht; WS0 bringt den Stand ins private Repo (Branch `assets/wsb-cartoon-keyposes-r1`).

**Rückgabe:** Blatt vorher/nachher ohne Fachbegriffe (Abnahme-Blätter als PNG plus `index.json` in `out/abnahme/` des Job-Ordners; WS0 stellt sie in die private Abnahme (KFB Abnahme, V-683) und in den Hub), Kritiker-Urteil, RETURN-Abschnitt in `50_BLENDER/CARTOON_LOCO/RETURN.md`.
