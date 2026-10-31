# Auftrag WS-Himmel R2 · Planet nach Vorlage · WS0 · 31.10.2026 (V-1101)
Georgs Urteil zu q330: TUNE. Auf den Bildern sah er kaum Himmel, und die flachen Streifen-Planeten sind nicht sein Planet. Zur Vorlage schrieb er in q336: am nächsten kommen die gemalten Planeten mit Flecken, gemeint ist aber der aus dem Beginn der Slices, als die Wolken erstmals in der Kuppel waren. WS0 sieht darin den Knet-Riesenmond im eigenen Bestand und baut darauf auf; Georgs Bestätigung läuft im Hub q337, ein Nein stoppt diesen Auftrag.

Ergänzung zu `replies/START_WS_HIMMEL_R1.md`: Konzeptblatt, Gate für Laufzeit-Code und Grenzen gelten weiter.

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

Vorlagen: `replies/HIMMEL_VORLAGE_R1/`, Fehlerbild `fail_flacher_planet.png`. Bauen im Bestand (`src/modules/sky-drive.js`, `src/modules/sky-r1.js`, Löser `kfb-place`, V-1007), kein zweites Licht (V-385, V-759). Abnahme ist der Bildvergleich mit der Vorlage, dazu Kanon Gebiet 18.

## Auftrag auf `world/himmel-r1`, hinter `sky=r1`
1. **Planet:** Grundlage ist der Shader des Knet-Riesenmonds in `sky-drive.js`: runde Kugel, große weiche Flecken aus Stufenlicht in drei Tönen, Daumenabdruck-Rauschen, heller Kern. Keine geraden Streifen, keine Vektor-Optik. Form und Größe wie auf `vorlage_riesenmond_spiel.png`, Fleckenbild und Farbspiel wie auf `vorlage_gemalt_flecken_B.jpg`, dort auch das Lila-Grün. Der Planet ist ein Shader im Himmel, kein Quaternius-Modell (V-1007). WS0-Entscheidung: V-661 gilt für Gelände und Wolken; auf dem Himmelskörper gehen Georgs Flecken vor.
2. **Vielfalt:** Farben kommen aus dem Verteiler je Thema und Saat, darunter Lila und selten die Erde. Ring nur als seltene Variante desselben Körpers. Kanon Gebiet 18 bleibt: höchstens ein großer Signatur-Körper je Himmelshälfte, kleinere dazu, zusammen höchstens 15 % Himmelsfläche, Mindestwinkel zwischen den Körpern (V-1007).
3. **Stand am Himmel:** WS0-Entscheidung zu Ü40: Der große Körper darf wie auf der Vorlage frei im Himmel stehen. Steht er tief am Horizont, liegen die unteren 20–35 % im Dunst (Ü40), und er bleibt als runde Kugel lesbar.
4. **Wolken:** Georg findet die gemalten Kuppelwolken gut, sie sollen variieren. Maßstab sind die Wolken auf `vorlage_riesenmond_spiel.png`: große Massen mit Schattenseite in Palettenfarbe (V-661, V-1007), keine kleinen blassen Tupfer. Richtwert bleibt Ü38 (höchstens 35 % des Himmels, ΔL* 10–18). Die Vorlage zeigt mehr als zwei Massen in der Mittelschicht, hier geht Georgs Auge vor (START R1); nenne die Abweichung im Bericht.
5. Blinden Kritiker einmal, Gate, Prüfungen Y1–Y4, P1–P10 und Horizont-Pass (Ü41) im Bericht, `terrain-seams`, `hud-3d`, `fb-canon`, Bildraten-Vergleich im selben Lauf.

## Rückgabe an WS0, dann Stopp
Einzelbilder in voller Größe, kein Sammelblatt (V-1100), je ein Satz, was abzunehmen ist:
- Tag, Dämmerung und Nacht, je einmal, Horizont im unteren Fünftel, der Himmel ist die Hauptfläche, darunter einmal der Lila-Planet groß und einmal eine andere Farbe;
- ein Bild mit der seltenen Erde;
- ein Fahrbild aus der Spielkamera;
- Vorlage und neu als zwei Bilder nebeneinander: Nacht, gleicher Ausschnitt, gleiche Stelle wie auf der Vorlage.
Dazu Clip über einen Themenwechsel, Branch, Commit, Tests, Kritiker-Wert, was ungeprüft ist. Eine Reparaturrunde je Befund. Merge nur mit Georg.
