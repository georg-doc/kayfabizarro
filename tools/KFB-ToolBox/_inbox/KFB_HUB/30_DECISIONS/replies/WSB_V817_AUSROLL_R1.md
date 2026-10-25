# WSB · Georg: Utopia r814 PASS → V-814-Weg ausrollen (V-817) · WS0 · 25.10.2026

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Georgs Urteil (25.10.):** Die Utopia-Bühne aus der V-814-Probe (`UtopiaStage_A_screen.v2_ids_r814.glb`, Blatt `blaetter_v814/`) ist PASS. Georgs Bildurteil geht vor dem Kritiker-Wert. Der V-814-Weg bleibt und wird ausgerollt. Der Grundsatzwechsel V-816 wird nicht als Ersatz gebaut. Georg: „wenn ihr das noch verbessern könnt: gerne“, deshalb kommt er nur als Verbesserungs-Probe nach dem Ausrollen (Schritt 5). Konzeptblatt: `replies/FARBROLLEN_KONZEPTBLATT_WSB.md` mit Nachtrag V-817.

**Auftrag:**
1. **Utopia** bleibt wie r814; behoben wird dort nur der Laub-Fehler an Emblemen und Rohren (Schritt 3), Ergebnis `UtopiaStage_A_screen.v2_ids_r817.glb`.
2. **Ausrollen** des V-814-Wegs auf alle Meshy-Bühnen, die sich laut Runde 4 sauber einfärben lassen, und auf das Gefängnis (q232). Die Imbiss-Ruine ist ein Kit-Diorama und bleibt bei r806. Ausgang sind die `*_ids_r812b.glb` bzw. `*_ids_r812c.glb`, neue Fassung `*_ids_r817.glb`.
3. **Mängel aus `kritik_v814_farbe.md` beheben** (eindeutige Fehler, keine Feineinstellung):
   - `leaf` nur auf Pflanzen. Die B9-Laub-Ausnahme gilt nicht für Embleme, Rohre und andere Nicht-Pflanzen.
   - `schlank → tower` nur für Teile, die als Turm, Säule oder Pfeiler stehen, nicht für liegende Felsstränge.
   - Durchgehende Flächen tragen über Knick-Komponenten hinweg einen Code (z. B. die Theater-Schürze, Felszapfen).
   - Der Fokus ist der ganze Ornamentrahmen samt Bildschirmkante als eine Fläche, beim Theater mit den Kartuschen und den Ornamentfeldern der Pfeiler.
4. **Mesa:** Fokus ist die Kappe, auf ≤ 10 % eingeengt.
5. **Verbesserungs-Probe, erst nach 1–4:** nur Utopia und Theater nach dem Verfahren aus `replies/WSB_V816_FARBCLUSTER_PROBE_R1.md` (Textur-Farbcluster nach Flächenrang auf die Palette; leaf ohne Rang, pad nur am Fokus), als `*_r816.glb`. Je Bühne ein Blatt r817 neben r816 (Canyon). Ohne Kritiker, weil es ein Bildvergleich für Georgs Wahl ist wie bei q230; Georg wählt im Hub. Es gelten die Präzisierungen aus dem V-816-Brief: der Fokus zieht auch die Helligkeit, grüne Nicht-Pflanzen bekommen nicht `leaf`, der Farbcode-Kanal (COLOR_1 B) bleibt in r816 wie r812b.

**Prüfung:** Farbrollen-Gate grün (V-812, V-808-Fokus, Bildschirm 255, Hash), Gate M5; dann blinder Kritiker nur K2 mit den Bildern laut Konzeptblatt. Maßstab ist das Utopia-Blatt r814 als Golden (Georg PASS). Bestanden heißt hier: mindestens Golden-Niveau (K2 ≥ 6) und keiner der vier Mängel aus Schritt 3 sichtbar.

**Rückgabe:** je Bühne ein Blatt vorher/nachher (Canyon) ohne Fachbegriffe; das Vergleichsblatt aus Schritt 5; Kritiker-Urteil; RETURN.md mit einer Zeile je Bühne (Fokus, Laub-Teile, Einfärbbarkeit).

**Danach, eigener Auftrag (nicht jetzt):** Georg verlangt, dass die eingefärbten Bühnen mit der Terrain-Einbettung (V-341, V-711, V-716) integrierbar sind, mit den modellierten Übergängen aus Steinen und Fragmenten (Abschluss-Grammatik V-577/V-578) und mit der Dünen-Logik, prozedural in der endlosen Welt (Fahrplan 5b, V-815). Bitte beim Bau nichts tun, was das verbaut (Sockel und Unterkante bleiben, wie sie sind).
