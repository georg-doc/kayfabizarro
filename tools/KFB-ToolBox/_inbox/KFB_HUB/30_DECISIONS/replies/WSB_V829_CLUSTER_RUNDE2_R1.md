# WSB · Bemalung tauschen, Runde 2: gezielte Korrekturen (V-829) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Stand nach V-824:** Danke für die saubere Runde. Konzeptblatt `replies/FARBROLLEN_KONZEPTBLATT_WSB.md`, Nachtrag V-829 (gilt für diese Runde). Weg B (Georg q237, V-824: volles Umfärben der Meshy-Bühnen statt nur sanfter Tönung) bleibt, `cluster_map` bleibt Kanon.
- **Bestanden und fertig** (keine Änderung, gehen so ins Spiel): Theater, Utopia-Bühne, Comic-Sender, Alien-Werkstatt, Mesa, Schnee, Utopia-Bibliothek, jeweils `r824`. Das Gefängnis geht nach q232 in `r824` dunkel ins Spiel.
- **Aus der Farbrunde:** Grüne Ruinen (K2 3, Stopp-Regel). Sie geht wie geliefert mit sanfter Meshy-Tönung (V-286) ins Spiel und wird nicht weiter umgefärbt.

**Auftrag r829:** die übrigen 12 Bühnen aus `r824` (Portal A, Portal B, Dystopie-Gasse, Goblin-Bank, Retro-Spielhalle, UFO, Marmor-Terrassen, Amphitheater, Natur-Insel, Akasha-Bibliothek, Kayfabrick-Baustelle, Abenteuer-Lager) mit diesen Korrekturen, Fassung `*_r829.glb`; Hash-Bezug ist jeweils die `r824`-Datei:
1. **Keine Sprenkel:** Die Cluster-Zuordnung je Texel wird nach der Mehrheit der Umgebung geglättet. Rost, Schaum und Moos auf einer durchgehenden Fläche werden so eine Farbe statt Flecken. Betrifft Findlinge, Wasser-Schürze, Rost, Tresen und Bogen aus `kritik_v824_farbe.md`.
2. **Wasser bleibt Wasser:** Durchgehende Wasserflächen (Marmor: Schürze und Wellen) bekommen die Rolle `water` der Palette statt eines Rang-Clusters.
3. **Bewuchs (Rollen-Fix, keine Farbsperre):** Grüner und olivgrüner Bewuchs auf Pflanzen und bemoostem Fels bekommt die Rolle `leaf` statt eines Rang-Clusters, damit er nicht rot wird (Amphitheater, Akasha). Lampe, Geld (Goblin-Bank) und Rakete (Retro) bekommen kein `leaf`. Bewuchs-Gras nimmt den ruhigeren `leaf`-Ton, damit es nicht die lauteste Bodenfläche ist (Natur, Lager).
4. **Zweitfarbe bei grauen Bühnen:** Liegt grau/dunkel bei mehr als 80 % der freien Fläche, teilt sich die Boden-Familie nach Helligkeit in zwei Töne der Palette. So gibt es eine sichtbare Zweitfarbe; Zeichnung und Helligkeit bleiben.
5. **Fokus vollständig:** `pad` auf dem ganzen Ornamentrahmen samt Bildschirmkante; das Bildschirmglas bleibt 255 (UFO). Ohne Bildschirm trägt das Wahrzeichen `pad`, auch bei den Kit-Dioramen und beim Plakat der Dystopie-Gasse.
6. **Teile ohne Rolle:** Das Türkis der Portale zählt beim Clustern mit.
7. **Amphitheater:** Außenfels und Mauerwerk bekommen verschiedene Rollen (Bögen nach Rolle, V-402).

**Prüfung:** Farbrollen-Gate grün wie V-824 (für reines Umfärben abgenommener Bühnen gilt dieses Gate statt `kfb_env_bpy.run()`/G1–G7, WS0-Entscheid seit V-806). Dann blinder Kritiker nur K2 nach V-816, Golden Theater und Utopia r816, bestanden ab 7. **Das ist die letzte Farbrunde für diese Bühnen.** Was danach unter 7 liegt, geht wie geliefert mit sanfter Meshy-Tönung ins Spiel (wie Grüne Ruinen). Danach kein weiterer Umbau.

**Rückgabe:** je Bühne ein Blatt vorher/nachher (Canyon) ohne Fachbegriffe; Kritiker-Urteil; kurzer Abschnitt in RETURN.md, was je Korrektur 1–7 geändert wurde und wo.

**Danach, eigener Auftrag (nicht jetzt):** Einbettung ins Terrain (Fahrplan 5b).
