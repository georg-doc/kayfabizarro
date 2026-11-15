Für Claude Design (Chat „Claymation Look & Animations“) · Knete v1.2 ist TUNE: Dellen überzogen, neu vom Bild aus · 16.11. (Georg q718, V-1839, V-1840)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzept für diesen Job (WS0 bestätigt): keine Szene, sondern eine Material-Runde der Knete-Bibliothek `kfb-clay` auf der Proof-Bühne. An Stelle des Konzeptblatts steht der Bildvergleich unten.

**Kern (3 Zeilen):**
1. Georg hat v1.2 „Lichtkante“ im Spiel auf TUNE gesetzt (Hub q718): „v1.2 sieht aus, als wäre FB von einem MG durchlöchert - das ist kein claymation look, ihr habt das mit den dellen überstrapaziert und nicht verstanden -> checkt die claybound und andere clay(mation) texturen!“
2. Echte Knete hat keine Löcher. Sie hat glatte große Flächen, weiche runde Kanten, hauchfeine Fingerrillen, dünne Knickfalten und einen leichten Glanz. Die Form trägt das Detail, die Oberfläche nur wenig.
3. Du baust Stilbilder und einen Kandidaten v1.3 nach diesem Bild. Freigegeben wird erst nach Georgs PASS auf Bilder aus dem Spiel.

**Bilder (Pflicht, vor jedem Wert ansehen):** Repo `georg-doc/kayfabizarro`, Zweig `docs/kfb-decisions-register-2026-10-11`, im Register-Ordner unter `replies/CLAY_REFERENZ_R2/` (Register-Ordner = `KFB_HUB/30_DECISIONS/` des Registers, wie in deinen früheren Aufträgen):
- `vergleich_claybound_kfb.jpg`: oben Claybound (Fels und Platte, Fingerrillen) und eine echte Knete-Kugel, unten FB heute (v1.1) und v1.2 im Spiel mit gleicher Kamera.
- `ref_claybound_ss1.jpg` bis `ss5.jpg`: fünf ganze Claybound-Bilder (Wüste, Nacht, Stapel, Höhle, Kugeln).
- `ref_knetekugel_blenderkit.jpg` und `…_gruen.jpg`: eine Knete-Kugel mit flachen Daumenflächen und Fingerrillen.
- Dazu der Kanon-Benchmark `CANON_3D/sources/KLAYBOUND_CLAYBOUND_VISUAL_BENCHMARK_2026-09-26.md` (CANON_3D Gebiet 8, gilt vollständig). Wo der Befund unten davon abweicht, im RETURN benennen.

**Was die Bilder zeigen (WS0-Befund, bitte am Bild prüfen):**
- **Daumendruck macht Knete flach, nicht hohl.** Auf der Kugel liegen breite, fast ebene Flächen mit weichem Übergang, wenige je Form. v1.2 macht Schüsseln mit Wand und Wulst; bei der Dichte am Kopf liest das als Einschuss.
- **Fingerrillen** sind sehr fein, flach und wellig parallel (lila Platte). Man sieht sie fast nur im Glanzlicht.
- **Knickfalten** sind dünne Linien, wo Knete gestaucht oder gefaltet ist (orange Felsen). Sie sitzen auf der Fläche und sind keine Krater.
- **Kanten** sind rund und weich. Schichten liegen wie gerollte Platten aufeinander (Stapel-Bild).
- **Figuren** sind am glattesten. Der Junge in Claybound hat fast keine sichtbare Oberflächen-Textur, nur Form und weiches Licht.
- **Glanz** ist leicht, wie von Fingerfett, und kommt aus dem einen Licht-Rig. Feste Grenze (V-385, V-409, CANON_3D Gebiet 8): Glanz nur über Rauheit und das Glanzlicht des Rigs, Figuren-Sheen ≤ 0,05, kein CGI-Glanz. Sheen 0,18 war schon einmal Ursache des hellen Saums um FB (V-382); kein aus Claybound abgeleiteter Wert geht darüber.

**Georgs Zusatzquelle (16.11.):** Greyscalegorilla-Tutorial „How to Create Stop-Motion Claymation Effects in Cinema 4D“ (youtube.com/watch?v=F-oA5cvokJ8, E.J. Hassenfratz). WS0 hat nur Beschreibung und Kapitel gelesen; Georg findet es konzeptionell passend. Davon gilt für diese Runde:
- **Subsurface:** Die Knete wirkt weich und warm, weil Licht leicht eindringt. Bei uns nur als Material-Antwort im einen Rig (V-385), kein eigenes Licht.
- **Triplanar:** Fingerrillen und Knickfalten liegen nahtlos auf jeder Form, ohne UV-Nähte.
- **Später, nicht jetzt:** „Boiling“, also die von Bild zu Bild leicht springende Oberfläche wie im Stop-Motion. Das ist eine Bewegungsfrage und kommt in eine eigene Runde mit Video.

**Was du baust:**
- Grundlage ist `kfb-clay.v1.1.js` (CLAY_SSOT_R1), nicht v1.2. Die Lichtkante aus v1.2 geht nicht weiter.
- Ein Vorschlag v1.3 mit den Bausteinen aus dem Befund: flache Daumenflächen statt Schüsseln, Fingerrillen, wenige Knickfalten, weniger und größere Drücke. Die Werte leitest du aus den Bildern ab und schreibst im RETURN je Baustein, an welchem Bild du ihn gemessen hast. Nichts heuristisch hochskalieren.
- Die ruhigere Figuren-Knete läuft über die vorhandenen Profile aus CLAY_SSOT_R1 (V-662): FB = `character`, KayKit-Figuren = `kit-figure`, Felsen = `midground`, Gelände und Ferne = `background`. Keine neue Stufe, kein zweites Modul. Figuren wie in Claybound am glattesten. `kit-figure` behält das in V-662 festgelegte stärkere Relief gegenüber `character` und wird in dieser Runde nicht geändert.
- Das geparkte Knetkorn auf dem Gelände (V-1451) bleibt geparkt; v1.3 ändert nur die bestehende Knete der Profile.
- Licht: das eine Licht-Rig der Proof-Bühne. Kein Randlicht, kein Fresnel (V-385).
- FB nur aus der SSOT: Figurendatei `src/data/characters/frizzlebob.character.json` im Stamm `game/integration-r2` (Repo `georg-doc/KFB-Stunt-Car-Race`), Feld `appearance.export.v.web` = `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON.r1j.glb` auf `assets/private` @800a85eb. Den Look nur auf FBs Haut (Kopf, Körper, Ohren, Schwanz); Augen, Pupillen, Lider, Brauen, Nase, Mund und Shirt behalten ihre Materialien. Die Extras `userData.kfbClayOrig` an `KFB_Tail_Bunny` und `KFB_Shirt_FB` beim Laden verwerfen.

**Stilbilder (Abgabe 1):**
- Je Bild drei Spalten „Claybound | v1.1 | v1.3“: links der passende Ausschnitt aus den Referenzen, Mitte und rechts die Proof-Bühne mit gleicher Kamera und gleichem Licht.
- Drei Zeilen in den Abständen aus dem Spiel-Vergleich, denn v1.2 hat im Stilbild bestanden und erst im Spiel versagt:
  1. FB-Gesicht nah, wie im Spiel-Bild „KFB heute v1.1“;
  2. FB ganz von vorn;
  3. ein Fels (Profil `midground`) aus der Fahrtsicht; kein Gelände-Ausschnitt, weil das Knetkorn geparkt bleibt.
- Kanon-Wache auf jedem FB-Bild: beide Augen mit weißem Augapfel, schwarzer Pupille und Lidern im dunkleren Kopfton, Brauen, rote Nase, Mund aus dem Satz der Datei, beide Ohren, Schwanz.
- Eine Zeile Selbstprüfung je Bild: Sieht man irgendwo Löcher, Krater oder Pocken? Hat FB einen hellen Saum über 2 px bei 1080p (LIGHT_MODEL_R2 L-3, V-842)? Wenn ja, zurück an den Werten, nicht zeigen.
- Prüfweg wie Tier 0: Proof-Stage G1–G7 grün, soweit sie für ein Materialbild greifen (mindestens G1 Augen/Lider, G2 und G5 Knete); `kfb_env_bpy.run()` entfällt, weil keine Szene gebaut wird. Vor jedem FB-Bild läuft der FB-Wächter der Proof-Bühne (Kanon-Prüfung, wie `fbKanonPruefen` im Spiel) grün. Danach dann ein Lauf des blinden Kritikers nach `CANON_3D/CRITIC_3D_R1.md` mit der Frage „liest sich das wie Claybound-Knete oder wie Löcher?“. Erst dann an WS0.

**Rückgabe:**
- Stilbilder als JPG ≤ 2 MB und das Harness unter `replies/CLAY_REFERENZ_R2/` (oder als Bündel, wie bei v1.2).
- Dazu die Datei als **Kandidat** `kfb-clay.v1.3.js` (noch keine Freigabe), v1.1 bleibt byte-gleich, mit Unit und Golden wie bei v1.2. WS0 baut den Kandidaten hinter einem neuen Schalter ins Spiel, weil v1.2 erst im Spiel versagt hat: Abnahme im echten Gelände mit Spielkamera und von vorn (V-662, CANON_3D Gebiet 15). Die Hub-Karte zeigt Spiel-Bilder neben deinem Stilbild.
- RETURN `RETURN_v13_stilbild.md` im selben Ordner: je Baustein die abgeleiteten Werte mit Bild-Bezug; je Profil die Materialantwort nach CANON_3D Gebiet 8 (Rauheitsbereich, Schattentönung, Kantenantwort, Abnutzung, Verformung); was gegenüber v1.1 anders ist und was offen bleibt.
- Nur über WS0 an Georg. Im Spiel bleibt bis zu Georgs PASS v1.1. Der Schalter `knete12` (v1.2) ist aus.
