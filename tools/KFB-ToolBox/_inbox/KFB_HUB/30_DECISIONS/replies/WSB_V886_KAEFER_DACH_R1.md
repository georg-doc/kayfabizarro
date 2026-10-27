# WSB · Ödland-Käfer: Vogel weg, Dach geschlossen (V-886) · WS0 · 27.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7; für diesen Job ersetzt, siehe Gate unten); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Stand:** Georg hat entschieden (Hub q259, Antwort A): Der weiße Vogel auf dem Dach des Ödland-Käfers kommt weg, das Dach wird sauber geschlossen und der Rost weitergemalt, sodass man keine Stelle sieht. Keine Dachluke.

**Quelle (einzige):** https://github.com/georg-doc/kayfabizarro/blob/9bd8e03/media/3D_Assets/MeshyModels/vehicles/wasteland_beetle/wasteland_beetle_browser.v3.glb
Der Vogel ist im Meshy-Netz mit dem Dach verschmolzen, kein eigenes Teil. WS0 hat waagrechte Schnitte bei z 3,90 / 4,10 / 4,22 (Modell-Einheiten) probiert: tiefer schneiden reißt ein Loch ins Dach, höher bleiben Vogelreste stehen. Löcher mit Blender-Füllen ergaben zerrissene UV-Inseln.

**Auftrag:**
1. Vogel entfernen, Dachfläche in der Rundung des übrigen Dachs neu schließen (gleiche Krümmung, keine Delle, keine Kante).
2. Textur an der Stelle aus dem umgebenden Rost und Lack weitermalen (Projektion oder Klonen aus dem eigenen Atlas); keine fremde Textur, Farbe und Körnung wie daneben.
3. Alles andere bleibt unverändert: Maßstab, Ursprung, Achsen, Vertex-Positionen außerhalb der Dachstelle, Materialnamen. Nachweis: Begrenzungsbox v3/v4 gleich, größte Vertex-Abweichung außerhalb der Dachstelle unter 0,001 Modell-Einheiten. Der Käfer behält im Spiel den unsichtbaren Einstieg (Vertrag `kfb-vehicle-rig.r1.json` Eintrag `wasteland_beetle`).
4. Ablage als neue Fassung `wasteland_beetle_browser.v4.glb` neben v3 im selben Ordner (v3 bleibt), im Repo georg-doc/kayfabizarro auf eigenem Branch `assets/wsb-kaefer-dach-r1`.

**Gate für diesen Job:** Für eine reine Netz- und Texturreparatur an einem Meshy-Fahrzeug gelten statt `kfb_env_bpy.run()` die Proof-Stage-Bilder G1–G7 mit Knete und dem einen Licht-Rig; dazu ein Vergleich v3/v4 aus vier Kameras (oben, schräg vorn, Seite, schräg hinten) und eine Nahaufnahme der Dachstelle. Blinder Kritiker: Ist an der Dachstelle irgendetwas zu sehen? Bestanden nur ohne sichtbare Stelle.

**Rückgabe:** Commit-Link zu v4 auf `assets/wsb-kaefer-dach-r1`, Blatt vorher/nachher ohne Fachbegriffe in die private Abnahme (KFB Abnahme, V-683), Kritiker-Urteil, RETURN-Abschnitt. Den Einbau ins Spiel macht WS0.
