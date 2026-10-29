# WS0 → WSA work · Cascade Sphere R5: Treffer passen zur Waffe, Farbbänder bunt, Heil-Werkzeug, Figur lesbar (V-1011, V-1012) · 29.10.2026

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

**Für diesen Auftrag:**
- **Konzeptblatt:** `replies/KONZEPTBLATT_CASCADE_R5_TREFFER_R1.md` (WS0).
- **Ort:** weiter auf `poc/cascade-sphere-r0` im privaten Repo georg-doc/KFB-Stunt-Car-Race, Host-Vertrag wie R4, kein Commit in `game/proc-world-ws0`.
- **Werkzeuge im Web-Spiel** sind die R4-Module und der Spiel-Bestand, also keine neuen Helfer:
  - `cascade-core`, `kfb-curb`, `fx-burst`;
  - Materialadapter (Konzept §4f);
  - Sprenkel-Modul (V-403);
  - `kfb-fluff-suck` mit der Richtung build (V-533);
  - Knete- und Licht-Profile des Spiels.
- **Bestand vor Neubau (V-956, V-574):** keine neuen Animationen, keine neue Waffe, kein zweites Schadens-, Material- oder Physiksystem.
- **Gate:** Für dieses Web-Spiel ersetzen die folgenden Prüfungen `kfb_env_bpy.run()` und die Proof-Stage-Prüfungen G1–G7. Bilder entstehen immer im Spiel-Look, mit KFB-Augen und dem Licht des Spiels.
  - deine V-1000-§5-Prüfung;
  - die Prüfungen unten;
  - Rauch, Funken und Staub nach `replies/SPEC_CARTOON_VFX_SHAPES_R1.md` (eine Masse statt Kugelstapel, kein Selbstleuchten, Checkliste §4);
  - Splitter und Krümel nach V-767.
- **Reihenfolge:**
  1. Schritt A, ein Bildblatt zur Abnahme durch Georg.
  2. Schritt B, der Bau.
  3. Je Runde: Gate, dann Kritiker-PASS, erst dann der Clip an WS0. Höchstens zwei Runden.

**Warum:** Georg 29.10. zum R4-Golden (V-1009): „nicht so schlecht“. Aber die herausgeschossene Wand passt noch nicht zu Waffe und Treffer. Die Farbbänder sind grau bzw. nicht zu sehen. Der Jetpack verdeckt die Figur. Der Heilstrahl bleibt ein Meta-Gimmick, keine Kampfwaffe (Georg 26.10., V-1011).

**Verbindlich lesen:**
- Dein Return R4: `review/cascade-sphere-r0/RETURN_R4_GOLDEN.md` (@646eb84) und die blinde Kritik `review/cascade-sphere-r4/BLIND_CRITIC_V1001_R1.md`.
- Web-Chat R17 und R18 im kayfabizarro-Branch `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19` (PR 435, Head cf0e146), Ordner KFB_GAME_FEEL_COMIC_MOTION_R1:
  - `CASCADE_SPHERE_R17_SHARED_IMPACT_MATERIAL_RESISTANCE_RACER_GATLING_CANNON_DESTRUCTION_WS0_2026-10-29.md` §2 (ein Ablauf vom Treffer bis zur Reparatur) und §3 (Materialprofile);
  - R18 (Collage kurz zurücknehmen, damit der Treffer lesbar bleibt).
- KFB Arsenal R1 (WS1): kayfabizarro-Branch `ws1/status`, `docs/WAFFEN_ZUORDNUNG_R1.md`, Spalten Rolle und Energie.
- Konzept `replies/KONZEPT_CASCADE_SPHERE_GAME_IN_GAME_R1.md` §4d.2 (Treffer-Löcher) und §4f (Material und Impact); Spec `replies/SPEC_GUTTER_CURB_R1.md` §2 (Bürgersteig-Oberfläche).
- Register (Branch docs/kfb-decisions-register-2026-10-11): V-403, V-533, V-561, V-597, V-609, V-625, V-767, V-846, V-848, V-913, V-956, V-962, V-987, V-1000, V-1001, V-1002, V-1009, V-1011, V-1012.

**Schritt A · Bildblatt zur Abnahme (vor dem Bau; das Designpaket nach V-740 für diesen Schritt):**
- Ein Blatt im Spiel-Look aus dem laufenden R4-Golden, nach dem Konzeptblatt:
  - je Waffe (Gatling, Rakete) und Material (Pappe, Knete, Stoff) die Stufen Delle → Riss → Bresche;
  - je Energie eine Spur: Ruß/Nachbrennen, Funkenkette, Pfütze;
  - ein befallenes Gebäude mit grauem Fleck im bunten Gelände, halb geheilt und geheilt.
- Erlaubt: Montage aus echten Bildern bzw. Standbilder aus kurzen Probeläufen.
- Vor Georg: das Blatt durch den blinden Kritiker nach `CANON_3D/CRITIC_3D_R1.md`, die Effekt-Teile zusätzlich durch die Checkliste §4 aus `replies/SPEC_CARTOON_VFX_SHAPES_R1.md`. Nur bei PASS geht es über WS0 an Georg.
- Georg nimmt das Blatt ab, danach Schritt B. Der Vergleich mit dem Blatt ist das Gate.

**Schritt B · Bau (Golden R5, in dieser Reihenfolge):**
1. **Treffer-Grammatik:** ein Ablauf nach R17 §2 für alle Treffer.
   - **Ort:** Das Loch sitzt am echten Treffpunkt des bestätigten Treffers, nie an einer vorgegebenen Stelle. Technik wie in R4: Maske in der Hülle plus Wandzellen, keine Bruchphysik zur Laufzeit (V-597).
   - **Stufen:** Nicht jeder Treffer öffnet die Wand, sondern erst Delle, dann Riss, dann Bresche. Ein Abprall bei heiler Wand ist ein gültiges Ereignis.
   - **Die Waffe bestimmt Größe und Verlauf:**
     - Gatling: viele kleine runde Einschüsse, die sich erst bei genug Treffern in einem Feld zur Bresche verbinden.
     - Rakete: ein großer Ausriss mit Ruß und Nachbrennen. Die Brandspur bleibt wie in R4 die Schadens-Textur im Hüllen-Shader (V-1001); höchstens die Sternform darf aus `src/look/impactStar.js` (V-848) übernommen werden. Nachbrennen mit Flammen, Funken und Rauch bleibt bei `fx-burst`.
     - Der Racer kommt erst im Kartenviertel (V-1002), nicht in diesem Schritt.
   - **Das Material bestimmt die Form:** Pappe reißt, Knete bröckelt, Stoff franst aus. Metall (Beulen, Abprall) kommt später. Die Profile hängen am vorhandenen Materialadapter (Konzept §4f) bzw. an den Knete-Profilen, als Daten. Kein eigenes Materialsystem.
   - **Energiearten aus dem Arsenal als Materialantwort:** heiß brennt nach (vorhanden), elektrisch springt als Funkenkette auf das Nachbarfeld über, nass hinterlässt eine Pfütze am Fuß. Die Pfütze ist ein Parametersatz des einen Fluid-Bausteins aus dem Spiel (V-913), kein eigener Helfer. Liegt der Baustein im POC noch nicht vor, zeigt Schritt A die Pfütze nur als Bild, und im Bau wird sie zurückgestellt. Das ist eine Tabelle Material × Energie, kein neues System.
   - Für dauernden Kontakt gilt eine Abklingzeit. Jedes Projektil zählt einmal.
2. **Farbbänder bunt:** Gelände von Anfang an in der `terrain3`-Palette. Grau sind nur die befallenen Gebäude und ein Befallsfleck um sie herum (Farbe gestohlen, V-625). Grau heißt entsättigt mit erhaltener Helligkeit, kein flächiges Mittelgrau. Der Bürgersteig bleibt nach Spec §2 nur leicht aufgehellt, nie grau. Die Heilung bringt die Farbe als Sprenkelband (V-403) zurück, an der Hülle und im Gelände-Fleck.
3. **Heil- und Bau-Werkzeug (der „Heilstrahl“):** Es ist der Aktionsleisten-Platz „Bauen“, keine Kampfwaffe. Es zahlt mit gesammeltem Fluff und heilt mit einer Regel.
   - **Sichtbarer Bau- und Heil-Akt:** über `kfb-fluff-suck` in der Richtung build (V-533; Konzept: Wiederaufbau über kfb-fluff-suck). Fehlt das Modul im POC, nimm den Rückwärts-Bau aus `fx-burst` (V-974), der intern `kfb-fluff-suck` aufruft. Es gibt keinen zweiten Bau-Weg.
   - **Das Sprenkel-Modul (V-403)** schließt Bresche, Rand und Brandspur zusammen mit Maske und Kollision und bringt die Farbe an Hülle und Gelände-Fleck zurück (V-1001).
   - Kein neuer Effekt.
4. **Figur und Fokus lesbar** (Kritik R4):
   - Jetpack kleiner nach V-1012: ein Faktor im Sitz, um den Rücken-Kontaktpunkt. WS1 legt den Wert im Hauptspiel fest (Start 0,75, Vergleich A/B gegen 1,0 von hinten). Du übernimmst diesen Wert, bis dahin gilt 0,75.
   - Bei einem bestätigten Treffer tritt das Hüllenraster kurz zurück (R18).
   - Prüfkamera so, dass Figur und Hebel weder Bresche noch Lider verdecken.
5. **Offen lassen:**
   - die Regel, ob Kugeln Fluff-Ressource sind oder Goo neutralisieren (kommt von Georg);
   - den Racer-Durchbruch und alle 56 Karten;
   - das Heilen von Dark Fluffern und den Boss als Buddy;
   - Befallsflecken über den KFB-Verteiler und das Gedächtnis je Zelle. Das sind spätere Schritte aus V-1011, in diesem Golden je Gebäude fest gesetzt.

**Prüfung vor dem Clip:**
- Lochmitte gegen Treffpunkt in Wandkoordinaten.
- Kein Loch ohne bestätigtes Ereignis.
- Gatling-Folge und Rakete auf denselben Wandtyp, zwei Materialien.
- Farbanteil im Gelände vor und nach der Heilung.
- Bildzeiten mit 600 Kugeln.

**Rückgabe:**
- Branch und Commit.
- Ein Clip in Third-Person im Spiel-Look: Gatling-Folge, Rakete, Heilung mit Farbrückkehr im Gelände.
- Messwerte, Kritiker-Urteil.
- Offene Fragen an Georg nur, wo er entscheiden muss.
