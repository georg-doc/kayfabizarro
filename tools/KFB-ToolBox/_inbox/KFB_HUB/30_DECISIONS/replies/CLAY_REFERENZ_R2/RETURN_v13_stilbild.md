# RETURN · Knete v1.3 (Kandidat) · Stilbild · 16.11.2026 · STOPP-BERICHT nach CRITIC_3D_R1

Auftrag: `BRIEF_CD_KNETE_V13_R1.md` (Georg q718, V-1839, V-1840).

## Ergebnis in drei Zeilen
1. **Löcher sind weg:** Der Kandidat `kfb-clay.v1.3.js` zeigt in keinem Bild Löcher, Krater oder Pocken. Im selben Bild hat v1.1 sie noch, an FB-Kinn, Bauch und Fels. Beide blinden Kritiker bestätigen das.
2. **Noch keine Claybound-Knete:** Die Kritiker geben beide Male REWORK, mit 7,7 und dann 7,0 Punkten bei geforderten 8. Ihr Befund:
   - FB liest sich glatt, ohne sichtbare Knete-Merkmale;
   - der Fels zeigt Knete nur aus der Nähe;
   - Glanz wie von Fingerfett fehlt.
3. **Stopp-Regel:** Zwei Reparaturen haben keinen Punktgewinn bei K6 und K8 gebracht. Nach CRITIC_3D_R1 folgt daraus der Stopp mit diesem Bericht. Georg sieht diese Bilder nur über WS0 als Stopp-Bericht, nicht als Abnahme.

## Dateien
- **Kandidat:** `replies/CLAY_SSOT_R1/kfb-clay.v1.3.js`, sha256 `2c905c40622a2eeba6f9cd5ff8cc7ae7f0f7add7daa126137a1b213594e5e8c5`. Das ist genau der Stand, den Kritiker 2 bewertet hat.
- **v1.1** bleibt byte-gleich (`a81a3ee3…3fd0`), v1.2 unverändert.
- **Tests:**
  - `tests/kfb-clay.v1.3.unit.test.mjs`
  - `golden.v1.3.html` und `tests/golden.v1.3.test.mjs`
  - `proof-kit.v1.3.js` mit der Variante `v13`
  - Ergebnisse in `evidence/golden_results.v1.3.json`, Vergleichsbilder `evidence/compare_v11_v13_*`
- **Stilbilder** (JPG, je unter 130 KB) in `replies/CLAY_REFERENZ_R2/evidence/`; jedes Bild hat die Spalten „Referenz | v1.1 | v1.3“:
  - `v13_1_gesicht_r8.jpg`: FB-Gesicht nah, Kamera wie im Spiel-Bild „KFB heute v1.1“;
  - `v13_2_ganz_r8.jpg`: FB ganz von vorn;
  - `v13_3_fels_r8.jpg`: Fels `kfb_stone_leicht_felsen.r1.glb` aus dem Spiel, Profil midground, Fahrtsicht (3,4 m hoch, 9 m Abstand, 55°);
  - `check_fels_nah_r8.jpg`: Fels nah, nur zur Prüfung;
  - `check_relief_gesicht_r8.jpg`: Diagnose mit den Spalten Datei | v1.3 Relief aus | v1.3 Relief an.
- **Harness:** `knete_v13.html`, `tests/render.mjs`. Bühne, Licht und Renderer kommen vom Clay-Golden (kfb-stage-light, MESA Tag, ACES 1), ein Licht-Rig, kein Randlicht, kein Fresnel.
- **FB:** aus `appearance.export.v.web` = `FB_WEB_KANON.r1j.glb` (assets/private @800a85eb).
  - Mund in Ruhe über `fb_mund.v2.js`.
  - Knete nur auf der Haut (FB_Yellow und KFB_Tail_Clay, 9 Netze). In beiden Spalten wird die gebackene Datei-Normale durch Live-Knete ersetzt; die Marmorierung ist aus, weil sie schon in der Textur steckt.
  - Die Extras `kfbClayOrig` an `KFB_Tail_Bunny` und `KFB_Shirt_FB` werden beim Laden verworfen; auch r1j trägt sie noch.

## Was v1.3 anders macht als v1.1
Die fünf Ebenen-Plätze von v1.1 bleiben, damit clayBake und kit-figure weiter passen. Drei Plätze bekommen einen neuen Baustein, alles im Objektraum, also nahtlos auf jeder Form, ohne UV.

| Platz | v1.1 | v1.3 | gemessen an |
|---|---|---|---|
| dent2 | große Gauß-Schüssel mit Wulst | **Daumenfläche**: Die Fläche wird flach abgeschnitten, die Neigung wächst von 0 in der Mitte bis zum Rand und läuft dann weich aus. Keine Wand, kein Wulst. | Knete-Kugeln (rosa, grün) |
| dent | dichte kleine Dellen (das „MG“) | **Knickfalte**: Schnitt einer kleinen Scheibe mit der Fläche, also eine dünne Linie auf der Fläche, an den Enden spitz. | orange Claybound-Felsen |
| grain | Körnungs-Rauschen | **Fingerrillen**: Stellen mit feinen, welligen, parallelen Rillen, die Richtung je Stelle zufällig in der Flächenebene. Nur nah sichtbar. Polynom-Welle statt sin, damit das Ergebnis auf jeder GPU bitgleich bleibt. | lila Claybound-Platte, Fingerabdrücke auf der Kugel |
| lump | Beulen | gleich, nur bei Figuren ruhiger (Neigung 0,16 → 0,08) | Claybound-Junge fast ohne Textur |
| facet | Facetten | gleich (midground, background) | – |

Farbe, Marmorierung, Rauheit, Sheen, Seed, Maßstab, Bänder-Logik und API sind wie v1.1. Neu ist eine Uniform `uClayGrooveX`.

### Werte je Baustein und Bild-Bezug
Maße in Bezugslängen: bei Figuren die Figurenhöhe H, bei Requisiten scaleRef 1,8 m.

- **Daumenfläche (dent2).**
  - Gemessen an der rosa Kugel (Bild 512 px, Kugel ≈ 470 px): Die Flächen sind 70–110 px breit, also Radius 0,15–0,23 des Kugelradius. Etwa 30 Stück liegen auf der sichtbaren Halbkugel. Die grüne Kugel zeigt kleinere Flächen und mehr davon.
  - Übertragen auf FB (Kopfradius ≈ 0,17 H): Radius im Mittel 0,035 H (Zelle 0,1 × Radius 0,35 Zellen) und etwa die halbe Dichte der Kugel, weil Figuren am glattesten sein sollen. Das ergibt 0,3 je Zelle, rund 15–20 Flächen je Kopf.
  - Volle Abflachung wäre eine Neigung von R/r_Kopf ≈ 0,2. character nimmt 0,12, also rund 60 %. Die Ovalform 1,6 kommt von den Daumenballen auf der Kugel (1,4–1,6).
  - midground: Zelle 0,16, Neigung 0,10, weiche Kante 0,35. Die Kante ist breiter, weil eine Daumenfläche auf ebenen Felsflächen sonst als Mulde mit Ring liest; das zeigte die Runde mit dem nahen Fels.
  - background: Zelle 0,5, Neigung 0,08.
- **Knickfalte (dent).**
  - Gemessen am orangen Fels (ss1 und vergleich, links oben): Die Linien sind 2–4 px breit auf Blöcken von ≈ 250 px Höhe, also rund 1 % des Blocks, und 30–120 px lang, also 0,1–0,5 des Blocks.
  - midground: Zelle 0,14 (0,25 m), Scheibenradius 0,42 Zellen (Linien bis ≈ 0,2 m), Breite 0,02 Zellen (≈ 5 mm), Neigung 0,24, Dichte 0,9.
  - character: wenige, 0,12 je Zelle (≈ 5 je Kopf), Neigung 0,10.
  - background: Zelle 0,5, Dichte 0,2.
  - Die Bänder sind so gesetzt, dass eine Linie bei 1080p ab ≈ 1,5 px voll sichtbar ist und unter ≈ 0,6 px ausblendet; so flimmert nichts.
- **Fingerrillen (grain).**
  - Gemessen an der lila Platte: Rillenabstand 6–10 px auf ≈ 1500 px Breite, also ≈ 0,005 der Form. Auf der Kugel liegen die Fingerabdruck-Linien ≈ 3 px auseinander.
  - character: Wellenlänge 0,0045 H, Neigung 0,035, Deckung 0,5.
  - midground: Wellenlänge 0,006 (≈ 1 cm), Neigung 0,06, Deckung 0,4.
  - Beide Profile: Welligkeit 0,9, Band [1/200, 1/90]; die Rillen erscheinen also erst ab ≈ 5 px Wellenlänge.
  - background: keine Rillen.
  - Grenze bei Figuren: Rillen-Neigung 0,05 bei Deckung 0,35 riss G2 (stripePeak 3,005 bei Hunky). Deshalb 0,035 bei Deckung 0,5.
- **Glanz.** Rauheit und Sheen bleiben wie v1.1 (character 0,72 / 0,04, midground 0,82 / 0,02, background 0,9 / 0). Eine Probe mit 0,64 und 0,74 änderte im Bild nichts, siehe Offen 3.

### Materialantwort je Profil (CANON_3D Gebiet 8)

| Profil | Rauheitsbereich | Schattentönung | Kantenantwort | Abnutzung | Verformung |
|---|---|---|---|---|---|
| character (FB) | ≥ 0,72, Sheen 0,04; die Datei-Rauheit gewinnt, wenn sie höher liegt | keine eigene, nur das eine Rig | weich, Daumenflächen mit weicher Kante 0,25, kein CGI-Glanz | Fingerrillen-Stellen (nur nah), sehr wenige Knickfalten | flache Daumenflächen (0,3/Zelle), ruhige Beulen (0,08) |
| midground (Fels, Requisiten) | ≥ 0,82, Sheen 0,02 | keine eigene | weich, Kante 0,35 | Knickfalten als dünne Linien (0,9/Zelle), Fingerrillen nah | Daumenflächen, Facetten wie v1.1 |
| background (Gelände, Ferne) | ≥ 0,9, Sheen 0 | keine eigene | weich | wenige große Knickfalten | große Daumenflächen, Facetten wie v1.1 |

`kit-figure` (V-662, `src/look/clayKit.js`) setzt im Spiel weiter die Uniforms über character, unverändert. In v1.3 bedeuten diese Plätze:
- `uClayDent2.x/.z` = Zelle und Neigung der Daumenfläche, also 0,1 / 0,24 gegen 0,1 / 0,12 bei character;
- `uClayDent.x/.z` = Zelle und Neigung der Knickfalte, also 0,045 / 0,2 gegen 0,12 / 0,10.

Damit ist kit-figure weiter stärker als character. Wie das im Spiel aussieht, ist nicht geprüft.

## Prüfungen (alle gelaufen, Stand sha 2c905c40…)
- **Unit** `kfb-clay.v1.3.unit.test.mjs`: 51/51 PASS.
  - Geprüft sind API, Profilgrenzen und Determinismus, dass das GLSL ohne UV, sin, fwidth und Texturen auskommt, die neuen Bausteine und die Uniform-Belegung.
  - Außerdem, dass character das ruhigste Profil ist und Knickfalte und Daumenfläche im Suchfenster bleiben.
- **Golden G0–G5:** alle PASS (M1 Max, ANGLE Metal, 0 Fehler).
  - G1: SSIM 1, max. 0 px Abweichung.
  - G2: stripePeak höchstens 2,50, Kohärenz höchstens 0,64 (Grenzen 3,0 und 0,70).
  - G3: SSIM 1.
  - G4: mindestens 0,9981 bei Referenz 0,998.
  - G5: Chroma mindestens 0,956.
  - Relief-Energie gegenüber v1.1: 0,34–0,45. v1.3 ist also deutlich ruhiger, wie beabsichtigt.
- **Proof-Stage-Äquivalente im Harness**, vor jedem FB-Bild, beide Spalten PASS:
  - G1-Inhalt per Kanon-Wache: beide Lederhäute, Pupillen und Lidhäute, beide Brauen, Nase, beide Ohren, Schwanz, Mund in Ruhe; kein Teil hat sein Material getauscht.
  - G2: kein kaputtes Material, 0 von 84 332 Normalen defekt.
  - G5: Alle 9 Hautnetze tragen `kfb-clay.v1.3` bzw. `v1.1`.
  - Das volle `runGates` der Proof-Stage lief nicht, weil FB aus der SSOT-Datei seine Augen selbst mitbringt und nicht über den Proof-Stage-Augen-Rig kommt.
- **Heller Saum (L-3) bei 1920×1080:** 0 px in v1.1 und 0 px in v1.3; die Ringhelligkeiten sind identisch.
- **Selbstprüfung je Bild, ob irgendwo Löcher, Krater oder Pocken zu sehen sind:**
  - Gesicht: nein.
  - Ganz: nein.
  - Fels fern: nein.
  - Fels nah: nein. Die Knickfalten sind Linien; eine einzelne kurze wirkt wie ein Schnitt, das ist Befund 2 von Kritiker 2.

## Runden
- **r1:** Grundstand.
  - FB: keine Pocken mehr.
  - Fels: Knickfalten kaum zu sehen, Rillen wirkten gerade.
- **r2–r3:** Fels-Knickfalten stärker, die Rillen welliger. Die Falten blieben kurze Striche.
- **r4: Ursache gefunden.** Als 3D-Linie durchstößt eine Falte die Fläche nur an einer Stelle und hinterlässt einen Strich oder Punkt; ein Punkt kann wieder wie Pocken aussehen. Neu ist die Falte als Schnitt einer Scheibe mit der Fläche, also immer eine Linie auf der Fläche.
- **r5–r6:** mehr Falten, Rillen erst ab 5 px. Golden G2 riss (Hunky 3,005), deshalb die Rillen bei Figuren flacher und an mehr Stellen. Dann alle Gates PASS.
- **Kritiker 1 (r6): REWORK, 7,7.** K4 8, K6 7, K10 8, K8 6.
- **r7–r8, Reparatur 1:** Fels mit mehr und weicheren Knickfalten und etwas mehr Daumenrelief. Die Rauheits-Probe wurde zurückgenommen.
- **Kritiker 2 (r8): REWORK, 7,0.** K4 8, K6 6, K10 7, K8 5. Kritiker 2 hat versehentlich mehr vom Brief gelesen als freigegeben; Code und RETURN hat er nicht gelesen.
- **r9, Reparatur 2, nicht an einen Kritiker gegeben:**
  - Daumenflächen auf FB stärker (0,16), Knickfalten nur in Stauchzonen, größere Fels-Flächen.
  - Bei Figuren-Dichte 0,45 riss G2 (FB 4,07 bzw. 3,04).
  - Im eigenen Blick: FB weiter fast glatt, am Fels jetzt zu wenige Falten. Kein Gewinn, deshalb zurück auf den Stand r8.

**Nicht von der Knete** (in v1.1 identisch, das Diagnosebild zeigt sie auch bei „Relief aus“):
- Streifen im Nasenschatten und ein feines Raster an Wange und Kiefer; sie kommen aus Datei, Textur oder Selbstschatten (Gebiet 7);
- gestufte Schattenkanten der Bühne;
- perlige Brauenfuge, das ist Geometrie.

## Vermutete Ursache des Stopps (für WS0)
1. **Zielkonflikt bei Figuren.**
   - Der Brief verlangt Figuren am glattesten, die Form trägt das Detail, wie beim Claybound-Jungen.
   - Kanon K6 und K10 verlangen sichtbare Knete.
   - Jede Steigerung auf FB, die man sieht, reißt G2 (Streifen) oder läuft Richtung Dellen.
   - Entscheidung nötig: Wie viel Knete soll FB nah zeigen? Sollen die Daumenflächen auf FB so sichtbar sein wie auf der Kugel?
2. **Fahrtsicht.**
   - Feine Knete (Rillen, 5-mm-Falten) liegt in der Fahrtsicht unter 1 px und blendet absichtlich aus, damit nichts flimmert (Gebiet 17: Mikro darf die Lesbarkeit nicht ändern).
   - Claybound zeigt sie, weil dort die Felsen das Bild füllen.
   - Lesbare Knete aus der Spielkamera (V-662) gelingt so nur über Form und Daumenflächen, also über Mesh und Bake, oder über größere Falten, die dann nah zu grob werden.
3. **Glanz.**
   - Die Knete setzt die Rauheit als Maximum aus Datei und Profil.
   - FB-Datei und Fels-Kit liegen darüber; ein Glanz wie von Fingerfett muss deshalb aus der Datei kommen (WSB-Bake, Rauheit von FB_Yellow) oder aus einer Regeländerung im Modul (Rauheit setzen statt Minimum). Beides ist nicht meine Entscheidung.
4. **Stilbild gegen Spiel.** v1.2 hat im Stilbild bestanden und im Spiel versagt. Für v1.3 sagt ein Spielbild mehr als eine dritte Stilbild-Runde.

## Offen
- **Subsurface** (Greyscalegorilla): nicht gebaut. three r180 Standard hat keine Streuung; ein Wrap-Term wäre eine Änderung am Lichtmodell (V-385). Das braucht eine Entscheidung von WS0 oder Georg.
- **Boiling:** wie im Brief später, eigene Runde mit Video.
- **clayBake** im Spiel ist mit v1.3 nicht getestet.
  - Die Plätze lump, dent2 und dent werden gebacken; Rillen und Facetten bleiben live.
  - Rechnerische Obergrenzen der Gradienten: Daumenfläche ≤ 0,16 bei character und ≤ 0,31 bei kit-figure (bei Überlappung ×2 bis 0,62), Knickfalte ≤ 0,31 (midground). Alle liegen unter `RANGE` 0,9, also braucht es keine Änderung. Das ist nicht gemessen.
  - Dünne Falten können in der Bake-Textur weicher werden.
- **background** (Gelände) ist mit v1.3 geändert, aber nicht im Stilbild; der Brief hat keine Gelände-Zeile verlangt, und das Knetkorn bleibt geparkt. Für das Gelände braucht es einen Spielbeleg.
- **Register-Zeile:** nicht geschrieben, das ist WS0s Aufgabe.
