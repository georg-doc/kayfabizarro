# WSB · Fahrer im Dach auf alle übrigen Racer (J-7 Ausrollen, V-890) · WS0 · 27.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Stand:** J-7 läuft im Spiel (V-877/V-883, Georg q260 PASS): FrizzleBob sitzt bis zur Hüfte im Dach, Lenkrad am Anker, Hände per eingebackener IK, Ohren im Fahrtwind (V-884). Bisher nur Flammen-Dragster, Ironclad, Rustwing; alle anderen Racer steigen unsichtbar ein. FB_CANON ist gesetzt (V-804), die J-7-Sperre aus Nachtrag 31 ist damit aufgehoben.

**Auftrag:** J-7 genau wie R1 auf diese 10 Racer ausrollen: graffiti_jet_cruiser, street_racer_hoverbeast, crimson_thunderjet, brasswing_roadster, iron_phantom_hovercar, ironclad_wrecker, jetbound_roadster, rust_runner, rustfire_interceptor, rustwing_hauler. Ödland-Käfer erst nach V-886 (v4 ohne Vogel).
1. Quellen = die Spielfassungen laut `src/data/vehicles/kfb-vehicle-rig.r1.json`, lokal abgelegt in `50_BLENDER/J7/_quelle_racer_r2/` (kayfabizarro @9bd8e03, SHA256SUMS.txt). Konzeptblatt: `50_BLENDER/J7/KONZEPTBLATT_R2.md`. Je Fahrzeug eine Kopie mit angehängten Anker-Knoten, Original-Bytes unverändert, wie `_privat_meshy/<fz>_roofdrive.j7.glb`.
   Fahrzeug-Raum = Raum der Spielfassung (Ursprung, Achsen, Maßstab der GLB, wie das Spiel sie lädt); R1 baute auf den B39-Dachfassungen derselben Fahrzeuge im selben Raum. Figur 1:1 in Rig-Einheiten wie R1, das Spiel skaliert Figur und Fahrzeug gemeinsam (FB-Größe im Spiel bleibt, V-658 Punkt 4).
2. Anker wie R1: KFB_roof_land, KFB_roof_seat, KFB_roof_driver_origin, KFB_roof_steering (centre, column_dir, tilt, prop_scale 0,7), KFB_wheel_grip_L/R; Regeln aus R1 §1 (Hüfte unter Dachfläche, Beine ganz im Fahrzeug, Lenkrad-Kranz nicht im Blech).
3. Clips je Fahrzeug wie R1: `kfb_hop_roof_in_hip__<fz>`, `kfb_roof_drive_ik__<fz>`, `kfb_roof_drive__<fz>`, `kfb_hop_roof_out_hip__<fz>` (Körper as-is aus i06 und KayKit Jump, nur Wurzel in den Fahrzeug-Raum), FB aus FB_CANON. Neue Clips in einer eigenen Datei `_privat_kauf_asset/KFB_Motion_roofdriver_j7.r2.glb` (R1-Datei bleibt unverändert).
4. Vertrag `data/j7_roof_driver.contract.json` als r2 um die 10 Einträge erweitern (gleiches Schema, Schlüssel = Spiel-ID wie `graffiti_jet_cruiser`, bestehende drei mit Kurznamen unverändert), Zeitpläne `data/timelines/<fz>__roof_hip.json` mit denselben Marken (land_roof, seat_settle, pop).

**Gate für diesen Job:** Ausnahme zu Tier 0 Punkt 3: `kfb_env_bpy.run()` entfällt (keine Umgebung gebaut); G1–G7 und der blinde Kritiker gelten. Proof-Stage G1–G7 mit Knete und dem einen Licht-Rig je Fahrzeug, drei Ansichten (Seite, schräg vorn, schräg hinten) beim Fahren und ein Bild der Landung; QA-Zahlen wie R1 (Beine sichtbar 0 Bilder, Bilder mit Figur durch die Dachhaut, Hand-Griff-Abstand, Kranz-Abstand zum Blech, Augen-Prüfung QA c). Blinder Kritiker nach `CANON_3D/CRITIC_3D_R1.md`: Sitzt die Figur glaubhaft im Dach, Hände am Lenkrad, nichts im Blech?

**Ablage:** `50_BLENDER/J7/` wie R1. WSB pusht nicht; WS0 bringt den Stand ins private Repo georg-doc/KFB-Stunt-Car-Race (Branch `assets/wsb-j7-rollout-r2`). Den Einbau ins Spiel macht WS0 (src/m2/roofDriver.js liest Vertrag und Clips je Fahrzeug).

**Rückgabe:** Blatt je Fahrzeug ohne Fachbegriffe (Abnahme-Blätter als PNG plus `index.json` in `out/abnahme/` des Job-Ordners; WS0 stellt sie in die private Abnahme (KFB Abnahme, V-683) und in den Hub), QA-Tabelle, Kritiker-Urteil, RETURN-Abschnitt in `50_BLENDER/J7/RETURN.md`.
