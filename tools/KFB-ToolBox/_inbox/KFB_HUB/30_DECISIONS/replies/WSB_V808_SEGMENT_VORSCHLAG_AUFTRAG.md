# WSB · Meshy-Bühnen nach Georgs Wahl (V-809) + Vorschlag Bauteile · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Georgs Wahl (q230, V-809):** Richtung „voll“. Rollen-Teile auf Meshy-Bühnen bekommen die Biom-Farbe ganz (Zug 1,0 auf Farbton und Sättigung; Helligkeit und gemalte Zeichnung bleiben). Für Meshy-Rollen-Teile ersetzt das „sanft“ aus V-286: Deckel ΔE00 ≤ 18 und das Maß sanft 8–18 entfallen für sie. Aus V-806 bleibt: Teile ohne Rolle 0,18; das Fokus-Teil (pad) zieht auch die Helligkeit; Amphitheater-Bögen voll; Kit-Teile 0,85 mit Deckel; die Wand- und Turm-Regel; dazu V-808. Konzeptblatt mit Nachtrag V-809: `replies/FARBROLLEN_KONZEPTBLATT_WSB.md`. Wichtig für Georg: Auch die braun-grauen Modelle (Prison) müssen sich einfärben lassen. Was sich nicht sauber einfärben lässt, bleibt vorerst draußen, bis Farbe und Diorama-Übergänge dafür stehen.

**Teil 1 · Probe braun-grau (Bau erlaubt, nur Diagnose):** Ausgang sind die `*_ids_r808b.glb`. Prison und Theater je mit „voll“ und, für Teile mit wenig Farbsättigung, einer Verlaufs-Abbildung: Helligkeit der Textur → Farbton der Rolle bei gleicher Helligkeit, Zeichnung bleibt. Die Schwelle „wenig Sättigung“ legst du fest und nennst sie in RETURN.md; WS0 prüft sie am Blatt. Die Verlaufs-Abbildung baust du als Option in `kfb_clay_bpy` und legst sie wie r803/r803b als Kanon-Vorschlag ab (`50_BLENDER/V803_FARBROLLEN/kanon_vorschlag/…r809_vorschlag`), nicht in COLOR_0 und nicht in die Textur gebacken; die Übernahme entscheidet WS0. Mit den Kanon-Werkzeugen, Farbrollen-Gate grün (V-808-Prüfungen; die Ausnahme-Teile sind nur von der Mehrheitsprüfung der Flächen ausgenommen, nicht vom Gate und nicht von der Einfärbung), Gate M5. Ohne Kritiker und nicht an Georg; das Blatt geht an WS0. Bevor etwas daraus Georg vorgelegt wird, laufen Gate und blinder Kritiker (Runde 4). Blatt-Form, damit Georg es später lesen kann: je Bühne zwei Bilder nebeneinander, „vorher“ und „nachher“, eine Palette (Canyon), Beschriftung ohne Fachbegriffe.

**Teil 2 · nur ein Vorschlag, kein Bau.** Dein Befund zu r808b ist nachvollzogen (`DIAGNOSE_V808_nur_WS0.jpg`): Die Flecken auf der Bühnenlippe, im Sockel und im Mesa-Felskörper bleiben, weil die B9-Teile Texturflecken sind und keine Bauteile.
- Arbeite eine Seite aus: Codes über Bauteile des Spiel-Meshes, getrennt an Knickkanten und unabhängig von den B9-Teilen, ein Code je Bauteil.
- Darauf gehört:
  - wie die Bauteile entstehen und woran man sie prüft (Gate-Prüfung);
  - was das für die Stein-IDs der Sprengsel bedeutet (V-406) und wie beides nebeneinander bestehen kann;
  - die V-806-Ausnahmen und genau ein Fokus-Teil (V-808) bleiben gültig;
  - glatte, gekrümmte Flächen ohne Knick (Bühnenlippe, Mesa-Felskörper) und die bekannte Fehlform, dass eine Fläche zu viel schluckt (Mesa-Wahrzeichen 46 % in der Knick-Probe);
  - „Bauteil“ meint nur die Einteilung für den Code in COLOR_1; Mesh, COLOR_0 und die Browser-Fassung bleiben unverändert (V-136, Hash-Gate wie r808b);
  - wie der Code je Bauteil bestimmt wird und welche Zeile von V-808 der Vorschlag ablösen würde;
  - Probebilder von Theater und Mesa, ungetönt mit eingefärbten Bauteilen, ohne Kritiker, nur als Diagnose für WS0; keine GLBs in die B9-Quellordner schreiben.
- Ablage: `50_BLENDER/V803_FARBROLLEN/VORSCHLAG_BAUTEILE_R1.md` + Probebild. Ob gebaut wird, entscheidet WS0 nach dem Probeblatt aus Teil 1.

**Rückgabe:** Probeblatt Teil 1 mit Gate-Ergebnis; Pfad des Vorschlags und der Probebilder; je eine Zeile in RETURN.md.
