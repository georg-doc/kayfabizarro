# Hinweis WSA work · Planeten-Katalog · WS0 · 31.10.2026 (V-1136)
Die Ablage funktioniert: Register r10 hat dasselbe Schema wie der eingebaute Zwölfersatz, WS1 baut die elf neuen Bilder nach dem laufenden Test ein. Kein neuer Bildlauf, keine Änderung an den Bildern. Du baust keinen Spielcode. Nur das Register auf `assets/sky-planets-r1` ergänzt du, damit künftige Runden ohne Rückfrage ankommen.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Für diesen Auftrag (WS0-Entscheidung):** Reine Datenarbeit, kein Konzeptblatt, kein Kritiker. Gate ist ein Prüfskript über das Register.

**Ergänzen**
1. **Fester Pfad:** `src/assets/world/sky-planets-r1/planet-registry.current.json` zeigt immer auf das gültige Register. Alte Fassungen bleiben. Heute liegt die neueste in einem Unterordner und WS1 muss nach dem Namen fragen.
2. **Einbaustand bei allen Einträgen:** `integrationStatus` fehlt bei zwölf von 23. Der Zwölfersatz ist in `game/integration-r2` eingebaut, P03 provisorisch. P19 und P20 fehlen im Register; trag sie als nicht eingebaut nach, soweit du sie führst, sonst nenne sie in der Rückgabe.
3. **Klassen als eigene Felder, nicht als Tags:**
   - `bodyArt`: Vorschlag zur Körper-Art, passend zu `bodies` in `src/data/looks/kfb-sky-r1.json` auf `game/integration-r2`. Das sind Shader-Arten, die letzte Zuordnung trifft WS1.
   - `bodyClass`: Hauptkörper oder Trabant. Trabanten sind immer einzelne Bilder.
   - `skyLayerHint`: nah, mittel, fern für eine spätere Staffelung. Nur Vorschlag, Größe legt die Ebene nicht fest.
   - `structureAxis`: waagerecht, senkrecht, Gegen-Diagonale, zellig, mäandernd, wirbelnd, wie in deiner Richtungsregel.
   - `bakedLight`: Richtung des gemalten Lichts.
4. **Technik je Eintrag:** Bildgröße, Alpha-Prüfung bestanden oder offen, Spieltestpunkt wie bei P22.

Parallaxe und Asteroidengürtel bleiben zurückgestellt (V-1136): nur Felder vorbereiten, nichts umsetzen. Keine Metergrößen, kein Eintrag im Platzierungskatalog.

**Rückgabe an WS0, dann Stopp:** Branch, Commit, Ergebnis des Prüfskripts, was du nicht sicher zuordnen konntest.
