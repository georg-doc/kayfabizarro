# MINI_blatt_r1b · Ausdrucksblatt R1b · RETURN (WSB, 17.11.2026, V-1842/V-1843/V-1844)

**Bundle:** `wsb-ausdrucksblatt-r1b.bundle`, sha256 `5fcc50182d956fea330180eb504e639acdd839de37bcdabff533ea5d3da4ea39`
- Zweig `assets/wsb-ausdrucksblatt-r1b` @971e0025, ab `assets/private` @eb113fea.
- 142 neue Dateien, alle unter `50_BLENDER/AUSDRUCK_R1/`, nur additiv. WSB pusht nicht.

**Messblatt** mit Gate-Werten je Take, allen geänderten Winkeln und Gründen: `50_BLENDER/AUSDRUCK_R1/RETURN_ausdrucksblatt_r1b.md`.

**Blätter** (hier und in `50_BLENDER/AUSDRUCK_R1/blaetter/`):
- `AUSDRUCK_R1B_blatt_A_neu_v2.jpg`: die sieben neuen Takes, „FB | Farmerin“.
- `AUSDRUCK_R1B_blatt_B_angenommen_v2.jpg`: die neun angenommenen mit der neuen Farmerin.
- `AUSDRUCK_R1B_augen_spiel_buehne_v2.jpg`: Augen-Gegenprobe Spiel | Bühne, vorn und dreiviertel.

## Kurz
- **Arm-Gate:** Modul `stage/arm-gate.v1.js` mit Test (5 Fälle bestanden), läuft vor jedem Bild in `stage/render.r1b.mjs`. Bei FAIL gibt es kein Abnahme-Bild.
  - Alle 34 Zellen bestehen, gemessen im Einzelrender. Grenze 1 % der Höhe: FB 1,74 cm, Farmerin 1,38 cm.
  - Drei Festlegungen, im Messblatt begründet: Kleidung liefert keine Glied-Punkte (Shirt-Ärmel), die obere Hälfte des Oberarms (Achselquetschung) zählt nicht, Ruhe-Abgleich.
- **Farmerin-Augen über den Spielweg:**
  - Die Farmerin ist im Spiel eine Karten-Figur (`body: castcard` → `cardActor`, nicht `eyeActor`). Die Bühne macht deshalb dasselbe wie `cardActor`: `vendor_spiel/` aus dem Stamm @682d0f16 mit `applyAugenR2` aus der Figurendatei, Lid-Regel und `lidFix`.
  - Gegenprobe zahlengleich mit dem laufenden Spiel: Ring 0,575, inset −0,0272, Pupillen ±0,225 rad, Lid #a67e65, Radius/Abstand 0,1618 zu 0,1615.
  - Ursache in R1: converge 0,45 als Augapfel-Drehung, dazu Auge × 1,15.
- **Posen:**
  - FB bekommt auf allen Takes die Grundkorrektur aus IDLE_R1 (Oberarm 18°).
  - Danach hat die Suche je Seite die kleinste Änderung gesucht; der Rest ist von Hand nachgestellt.
  - Hängende Arme müssen bei beiden Figuren 25–45° vom Körper weg. Viele ruhige Posen stehen dadurch in A-Haltung.
- **Abweichungen vom Katalog:**
  - Hände hinter dem Rücken (9 Neugier) gehen bei beiden Figuren nicht (Raster aus 27 Varianten), Ersatz: Arme nach hinten abgespreizt.
  - Hand in der Hüfte (2 Triumph, Farmerin) steckte 10 cm im Bauch, Ersatz: Faust unten seitlich.
  - Für die neuen Takes stehen die Ersatzgesten im Messblatt.
- **Blinder Kritiker (ein Lauf): REWORK.**
  - Hineingedrückt wirkende Fäuste der Farmerin (4, 8, 12): nachgearbeitet, jetzt 0,0 / 0,3 / 0,8 cm.
  - Unterarme im Latz oder Shirt: Das Gate misst dort unter 1,6 cm, also Auflage.
  - Schwach gelesen: Ja, Nein und Nachdenken bei beiden Figuren; Ja und Nein hat Georg angenommen.
  - Kein zweiter Lauf, weil der Brief nur einen vorsieht.

## Befunde für WS0
1. **Spiel:** In der Dreiviertelansicht steht das ferne Auge der Farmerin über die Gesichtskontur hinaus, im Spiel genauso (Augen-Blatt unten). Es kommt aus dem Ankersitz der Karte, nicht von der Bühne.
2. **Prüfwerkzeug:** Der Prüflauf (`--scan`, viele Takes in einer Seite) maß einmal zu wenig (Farmerin 12: 1,2 statt 7,0 cm). Für Schritt 3 gilt nur das Gate im Einzelrender.
3. **Die A-Haltung ist eine Folge der Figuren:** Mit runden Bäuchen und kurzen Armen kann ein ruhiger, eng anliegender Arm bei 1 % Grenze nicht bestehen. Falls Georg eng hängende Arme will, wäre das ein eigener Entscheid: andere Grenze für ruhige Posen oder Körperform.
