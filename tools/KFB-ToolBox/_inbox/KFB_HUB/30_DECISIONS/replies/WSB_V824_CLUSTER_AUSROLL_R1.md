# WSB · Georg q237: Weg B „Bemalung tauschen“ ausrollen (V-824) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Georgs Wahl (q237):** B. Die Farben der Bemalung werden gegen Farben der Gegend getauscht (r816), nicht Bauteile gefärbt. `cluster_map` steht jetzt im Kanon `CANON_3D/lib/kfb_clay_bpy.py` (Sicherung `kfb_clay_bpy.vor_V824.py`, deine Fassung r816 unverändert übernommen). Konzeptblatt: `replies/FARBROLLEN_KONZEPTBLATT_WSB.md` mit Nachtrag V-824; Verfahren im Einzelnen wie `replies/WSB_V816_FARBCLUSTER_PROBE_R1.md` (Cluster nach Flächenrang 60/30/10, grüner Bewuchs-Cluster auf leaf ohne Rang und nicht auf Nicht-Pflanzen, grau/dunkel Boden-Familie mit Verlauf, Helligkeit und Zeichnung bleiben, `pad` nur am Fokus, Fokus zieht die Helligkeit).

**Auftrag:**
1. Alle 13 Bühnen aus V-817 (die 12 einfärbbaren aus Runde 4 und das Gefängnis) mit `cluster_map`, Fassung `*_r824.glb`. Ausgang sind die `*_ids_r817b.glb` (Codes, Fokus und Mesh bleiben; COLOR_1.B unverändert, wie bei r816).
2. Als Probe zusätzlich die acht Bühnen, die bisher als nicht einfärbbar galten (Akasha-Bibliothek, Comic-Sender, Dystopie-Gasse, Goblin-Bank, Kayfabrick-Baustelle, Abenteuer-Lager, Retro-Spielhalle, UFO-Cockpit). Ausgang sind die `*_ids_r812b.glb`; Kayfabrick-Baustelle und Abenteuer-Lager sind Kit-Dioramen und gehen von ihren `*.r806.glb` aus (V-806: Steinkit bleibt in COLOR_0 byte-gleich, Kayfabrick-Steine und Fluff ohne Rolle, 255). Fokus, Pflanzen und Oberseiten für diese acht nimmst du wie in r812b bzw. r806; Hash-Bezug ist jeweils die Ausgangsdatei. Weise je Bühne aus, ob sie mit `cluster_map` jetzt sauber einfärbbar ist.
3. Fokus wie in r817b (Theater Schauseite mit Kartuschen und oberen Pfeilerfeldern, Mesa Kappe, Portal B Portalring). Die unteren Theater-Pfeilerfelder liegen wegen der 10-%-Grenze bewusst außerhalb.
4. Laub-Fehler aus `kritik_v817_farbe.md` nicht mitschleppen: Buchrücken (Bibliothek), Tank-Flüssigkeit (Alien-Werkstatt), Glaslaternen (Marmor-Terrassen) und der Utopia-Blumentopf bekommen kein `leaf`.
5. Die Imbiss-Ruine (Kit) bleibt bei r806.

**Prüfung:** Farbrollen-Gate grün (Hash, Bildschirm 255, `pad` nur am Fokus, Clusteranteile je Bühne ausgewiesen, Gate M5). Dann blinder Kritiker nur K2 mit den Bildern laut Konzeptblatt (4 Kameras, Canyon und random(803)), Maßstab nach V-816: gehört sichtbar zum Biom, mehrere Palettenfarben im Verhältnis 60/30/10, Zeichnung erhalten, kein Monochrom, keine Flecken und keine harten Farbsprünge auf durchgehender Fläche. Golden sind die Theater- und Utopia-Blätter r816 (Georg q237). Bestanden heißt K2 ≥ 7 (V-816); Bühnen darunter bleiben bis zur nächsten Runde aus dem Spiel. Das Gefängnis darf weiter dunkel ins Spiel (q232).

**Rückgabe:** je Bühne ein Blatt vorher/nachher (Canyon) ohne Fachbegriffe; Kritiker-Urteil; RETURN.md mit Clustern, Zuordnung, Anteilen und Einfärbbarkeit je Bühne.

**Danach, eigener Auftrag (nicht jetzt):** Einbettung ins Terrain mit Übergängen aus Steinen und Fragmenten und Dünen-Logik (V-817, Fahrplan 5b). Sockel und Unterkante bleiben, wie sie sind.
