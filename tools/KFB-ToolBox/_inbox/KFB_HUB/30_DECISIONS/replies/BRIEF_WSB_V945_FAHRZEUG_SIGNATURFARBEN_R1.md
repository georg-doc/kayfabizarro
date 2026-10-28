# WS0 → WSB · Signaturfarben für die 14 Dieselpunk-Fahrzeuge: erst Farbkonzept als Bild (V-945) · R1 · 28.10.2026

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

**Für diesen Auftrag:** Schritt 1 ist nur das Farbkonzept als Bild (kein Umbau der Fahrzeuge). Abnahmeweg für reines Umfärben ist das Farbrollen-Gate nach V-806 (statt `kfb_env_bpy.run()`/G1–G7); die Icon-Bilder entstehen auf der Icon-Bühne mit Knete (`kfb_clay_bpy`; Abnahmebilder immer mit Knete) und dem einen Licht-Rig über `CANON_3D/lib/kfb_light_bpy.py` (die Icon-Bühne nutzt genau dieses Modul). Nach Georgs Ja schreibt WS0 das Konzeptblatt, dann folgt Schritt 2 (Einfärben). Weiter gilt: Fahrzeug-Geometrie bleibt unverändert (V-574), Kopien statt Überschreiben der Quellen (`MeshyModels/_browser/dieselpunk_vehicles/` bleibt unberührt), Ablage im Branch `assets/wsb-vehicle-colors-r1` des privaten Repos georg-doc/KFB-Stunt-Car-Race, kein Löschen ohne Georgs Ja, vor großen Schritten `df -h /` (über 8 GB frei).

**Warum:** Georg 28.10. (Hub q289 zu den Fahrzeug-Icons V-940): „klein sind die Cars nicht zu unterscheiden“. Vor allem die fast einfarbig grauen und braunen Wagen sollen – im 3D-Modell und im Icon – je eine eigene Signatur-Grundfarbe und ggf. eine Akzentfarbe bekommen. Wagen mit Aufklebern/Graffiti behalten eher ihre Originalfarben, Farben und Übergänge müssen zu den Motiven passen. Nicht pauschal tönen: Scheiben bleiben dunkel (V-912), Aufkleber, Rost, Schmutz und Schatten bleiben erhalten.

**Einstieg (lesen):**
- Icon-Bogen R2 (Ist-Stand): Branch `design/hud-icons-vehicles-r1` @fcc13ae, `design/HUD_ICONS_R1/sheets_r2/vehicles_r2.png`, Icon-Bühne = Skript icon_stage.py im Unterordner tools des Ordners design/HUD_ICONS_R1 desselben Branches (Schalter `KFB_ICON_YAW`, `KFB_ICON_FIT=silhouette`).
- Fahrzeugliste: genau diese 14 ids aus `src/data/vehicles/kfb-vehicle-rig.r1.json` im Spiel-Branch `game/proc-world-ws0` – rustwing_cruiser, graffiti_jet_cruiser, street_racer_hoverbeast, crimson_flame_dragster, crimson_thunderjet, ironclad_skycruiser, brasswing_roadster, iron_phantom_hovercar, ironclad_wrecker, jetbound_roadster, rust_runner, rustfire_interceptor, rustwing_hauler, wasteland_beetle (II-Fassungen und Mech-Dummy nicht Teil dieses Auftrags); Modelle wie im Spiel geladen (kayfabizarro @9bd8e037 `<id>_browser.v3.glb`, Käfer: v4 ohne Vogel aus V-886, Datei `50_BLENDER/V886_KAEFER/out/abgabe_r5/variante_q86/wasteland_beetle_browser.v4.glb`, Kritiker PASS).
- Farbquelle (verbindlich, Kanon Gebiet 6): `replies/COLOR_CONCEPT_R1.md` mit den Farbrollen und `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js`; Grenzen Chroma ≤ 0,195 und kein Mittelgrau.
- Umfärbe-Weg (verbindlich): Weg B / `cluster_map` in `kfb_clay_bpy` (V-824, Textur-Farbcluster nach Flächenrang, V-816) – keine eigene Masken-Methode; Farbrollen-Gate und Kritiker-Maß nach V-806.
- Register (Branch docs/kfb-decisions-register-2026-10-11, Ordner tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/): V-292 (Story-Mode-Farben), V-385 (ein Licht-Rig), V-574, V-801/V-803 (Farbrollen, zweifarbige Props), V-806, V-816, V-824, V-886, V-912, V-940.

**Auftrag Schritt 1 (nur Bild):**
1. **Farbvorschlag je Fahrzeug:** eine Grundfarbe für die lackierten Flächen, optional eine Akzentfarbe (Felgen, Streifen, Kanten), beide aus den Rollen der Palette (Quelle oben); die 14 Farbtöne untereinander klar verschieden (auch klein in Icon-Größe). Reichen die Paletten-Rollen dafür nicht, keine Farben außerhalb der Palette erfinden, sondern als offene Frage an WS0 zurück. Graffiti-/Aufkleber-Wagen (z. B. Graffiti-Kreuzer, Straßen-Biest, Rostfeuer-Muscle, Flammen-Dragster) behalten ihre Originalfarben; nur falls nötig ein Akzent, der zum Motiv passt.
2. **Zonen statt Pauschal-Tönung:** über Weg B (`cluster_map`) werden nur die Lack-Cluster getauscht; Scheiben dunkel nach V-912 (auch die zweite durchsichtige), Aufkleber, Graffiti, Rost, Chrom, Reifen, Schatten und AO bleiben.
3. **Bogen für Georg:** je Fahrzeug links heute, rechts Vorschlag, als Icon (gleiche Bühne wie R2) und darunter eine Reihe in kleiner Icon-Größe für die Unterscheidbarkeit; mindestens 1600 px breit, Beschriftung nur die Fahrzeugnamen, keine Zahlen. Prüfung durch den blinden Kritiker (Unterscheidbarkeit klein, keine pauschal getönten Scheiben/Aufkleber, Farbübergänge an Motiven), dann an WS0.

**Rückgabe:** Branch, Bogen-Pfad, Farbtabelle je Fahrzeug (Name, Grund, Akzent je mit Paletten-Rolle, „Original behalten“), Kritiker-Urteil, offene Fragen an Georg nur dort, wo er entscheiden muss. Schritt 2 (Einfärben der Modelle und Icons) erst nach Georgs Ja.
