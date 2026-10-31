# Auftrag WS-Himmel R2 · Planet nach Vorlage · WS0 · 31.10.2026 (V-1101)
Georgs Urteil zu q330: TUNE. Auf den Bildern sah er kaum Himmel, und die flachen Streifen-Planeten sind nicht sein Planet. Zur Vorlage schrieb er in q336: am nächsten kommen die gemalten Planeten mit Flecken, gemeint ist aber der aus dem Beginn der Slices, als die Wolken erstmals in der Kuppel waren. Das ist der Knet-Riesenmond im eigenen Bestand.

**Tier 0:** Schau dir die Bilder in `replies/HIMMEL_VORLAGE_R1/` an, das Fehlerbild ist `fail_flacher_planet.png`. Bauen nur im Bestand (`src/modules/sky-drive.js`, `src/modules/sky-r1.js`, Löser `kfb-place`, V-1007), kein zweites Licht (V-386). Abnahme ist der Bildvergleich mit der Vorlage und Kanon Gebiet 18.

## Auftrag auf `world/himmel-r1`, hinter `sky=r1`
1. **Planet:** Grundlage ist der Shader des Knet-Riesenmonds in `sky-drive.js`: runde Kugel, große weiche Flecken aus Stufenlicht in drei Tönen, Daumenabdruck-Rauschen, heller Kern. Keine geraden Streifen, keine Vektor-Optik. Form und Größe wie auf `vorlage_riesenmond_spiel.png`, Fleckenbild und Farbspiel wie auf `vorlage_gemalt_flecken_B.jpg`, dort auch das Lila-Grün. Der Planet ist ein Shader im Himmel, kein Quaternius-Modell (V-1007).
2. **Vielfalt:** Farben kommen aus dem Verteiler je Thema und Saat, darunter Lila und selten die Erde. Ring nur als seltene Variante desselben Körpers. Kanon Gebiet 18 bleibt: höchstens ein großer Signatur-Körper je Himmelshälfte, kleinere dazu, gesamte Himmelsfläche im Rahmen des Kanons.
3. **Stand am Himmel:** Der große Körper steht frei über dem Horizont und bleibt rund lesbar, nur sein unterster Rand darf im Dunst liegen (R13 H21).
4. **Wolken:** Georg findet die gemalten Kuppelwolken gut, sie sollen variieren. Maßstab sind die Wolken auf `vorlage_riesenmond_spiel.png`: große Massen mit Schattenseite in Palettenfarbe (V-661, V-1007). Keine kleinen blassen Tupfer.
5. Blinden Kritiker einmal, Gate, `terrain-seams`, `hud-3d`, `fb-canon`, Bildraten-Vergleich im selben Lauf.

## Rückgabe an WS0, dann Stopp
Einzelbilder in voller Größe, kein Sammelblatt (V-1100), je ein Satz, was abzunehmen ist:
- Tag, Dämmerung und Nacht, Horizont im unteren Fünftel, der Himmel ist die Hauptfläche;
- ein Bild mit Lila-Planet groß, eines mit einer anderen Farbe, eines mit der seltenen Erde;
- ein Fahrbild aus der Spielkamera;
- Vorlage und neu als zwei Bilder nebeneinander.
Dazu Clip über einen Themenwechsel, Branch, Commit, Tests, Kritiker-Wert, was ungeprüft ist. Eine Reparaturrunde je Befund. Merge nur mit Georg.
