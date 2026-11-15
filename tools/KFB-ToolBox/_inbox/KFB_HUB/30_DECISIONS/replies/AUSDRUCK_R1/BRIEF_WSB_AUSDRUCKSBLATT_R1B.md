# Für WSB (Mac mini, Blender MCP) · Ausdrucksblatt R1b: sieben Posen neu, Arm-Gate im Code, Farmer-Augen wie im Spiel · 16.11. (Georg q719–q723, V-1842, V-1843)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzept für diesen Job (WS0 bestätigt, wie R1): keine Szene, sondern Posen-Blätter zweier fertiger Figuren auf der Proof-Bühne. An Stelle des Konzeptblatts stehen der Acting-Katalog und Georgs Antworten unten.

**Kern (3 Zeilen):**
1. Georg hat neun Posen angenommen. Sieben stellst du neu, weil Arme in Rumpf oder Kopf stecken: „die arme stecken bei 10-12 in körper und kopf!“, „13 & 14 arme stecken in körper - bitte fixen“. Er will das nicht wieder ansagen müssen.
2. Die Farmerin „schielt extrem“ und die Augen „ploppen raus“. Das ist ein Fehler aus dem WS0-Auftrag R1, nicht deiner: `kfb-proof-eyes.v1.js` liest `converge` als Drehung des ganzen Augapfels und setzt das größere Auge an die Kappe; im Spiel dreht `converge` nur die Pupille, gekappt, bei gleicher Augenmitte. Die Farmerin bekommt jetzt die Augen über den Spielweg.
3. Neu und Pflicht für jedes Posen-Bild, auch in Schritt 3: ein Arm-Gate im Code. Wenn es anschlägt, wird das Bild nicht gezeigt.

**Grundlage:** `assets/private` @eb113fea (dein Zweig `assets/wsb-ausdrucksblatt-r1`, vorgespult). Pfade ohne Präfix liegen dort.

**Georgs Antworten (q719–q723):**
- **Angenommen, Pose bleibt:** 1 Jubel, 2 Triumph, 3 Doppel-Take, 5 Wut, 6 Frust, 7 Trauer, 9 Neugier, 15 Erklären/Zeigen, 16 Ja/Nein.
- **Neu stellen:** 4 Schreck, 8 Angst, 10 Skepsis, 11 Stolz, 12 Verlegenheit, 13 Langeweile, 14 Nachdenken.
- **Normal-Stufe:** cartoon. Das Stufenblatt bleibt, wie es ist.

**1 · Arm-Gate (Code, vor jedem Bild):**
- Gemessen wird an der gestellten Pose, mit den gehäuteten Positionen (`SkinnedMesh` mit `applyBoneTransform` bzw. `getVertexPosition` nach dem Posen-Haken).
- **Glieder:** die Vertices mit dem größten Gewicht auf Oberarm, Unterarm oder Hand (links und rechts), bei FB dazu die Knete-Hände.
- **Körper:** Rumpf und Kopf (Vertices mit dem größten Gewicht auf Hüfte, Wirbelsäule, Brust, Hals, Kopf), bei FB auch Shirt und Kopf-Netze, bei der Farmerin Latzhose und Haare.
- **Test:** Liegt ein Glied-Vertex innerhalb der geschlossenen Körperhülle? Zum Beispiel Strahl-Parität gegen die gestellten Körper-Dreiecke, `three-mesh-bvh` ist im Stamm vorhanden. Erlaubt ist Berührung bis 1 % der Figurenhöhe Eindringtiefe, etwa eine Hand an der Wange. Mehr ist FAIL.
- **Je Take und Figur:** größte Eindringtiefe und betroffene Knochen ins Messblatt. Bei FAIL die Pose korrigieren (Winkel, Ellbogen nach außen, Hand vor den Körper), nicht das Netz.
- Das Gate läuft über **alle 16** Takes. Schlägt es bei einer angenommenen Pose an, korrigierst du nur so weit wie nötig und markierst die Pose im Messblatt.
- Das Gate kommt als eigenes Modul in `50_BLENDER/AUSDRUCK_R1/stage/` mit kurzem Test, damit Schritt 3 und das Spiel es wiederverwenden.

**2 · Farmer-Augen über den Spielweg:**
- Stamm `game/integration-r2` (Repo `georg-doc/KFB-Stunt-Car-Race`): `src/modules/eyeActor.js` (`createEyeActor`) mit `kaykit-eye-adapter.v1.js`, `pet-eye-rig.v6.js`, `lidFix.js`, E2-Lidhaut `clay-skin-attach.v1.js` und `src/modules/augenR2.js` (`applyAugenR2`, Werte aus der Figurendatei `src/data/characters/farmer_hut.character.json`, `appearance.augenR2` und `appearance.lids`, gelesen über `figurDatei.js`), wie im Spiel mit `augen=r2`.
- Diese Module lädst du in die Bühnenkopie statt `kfb-proof-eyes.v1.js` für die Farmerin. FB bleibt, wie er ist: Augen und Lider sind in r1j eingebacken.
- **Gegenprobe:** ein Bild der Farmerin von vorn in Ruhepose neben einem Spielbild derselben Figur mit gleichem Blick. Die Augen müssen gleich sitzen: im Kopf, Pupillen nur leicht nach innen.
- Gilt für **alle 16** Farmerin-Zellen, auch für die angenommenen Posen.

**3 · Neue Posen (4, 8, 10–14):**
- Weiter nach dem Acting-Katalog und `replies/AUSDRUCK_R1/MENTALMODELL_BRAUEN_AUGEN_R1.md` (Register-Repo `georg-doc/kayfabizarro`, Zweig `docs/kfb-decisions-register-2026-10-11`, Register-Ordner `KFB_HUB/30_DECISIONS/`). Phase E, cartoon, Regeln aus R1: klare Aktionslinie, kein Twinning, höchstens 8 % Stretch, nur Knochen, keine neuen Teile (V-574).
- Kurze Arme: Wo eine Geste den Körper berühren würde (Arme verschränken, Kinn, Mund), lieber eine lesbare Ersatz-Geste vor oder neben dem Körper, etwa Hände vorn gefaltet, eine Hand vor dem Mund oder Arme seitlich. Die Silhouette muss die Emotion tragen.
- Skepsis, Stolz, Verlegenheit, Langeweile, Nachdenken: Unterarm nie im Rumpf, Hand nie im Kopf.

**Bilder:**
- Weg wie R1: Proof-Bühne, Knete v1.1 (nicht v1.2), Licht der Bühne, dreiviertel vorn, Figur ganz im Bild.
- **Blatt A:** die sieben neuen Takes, je Zelle „FB | Farmerin“.
- **Blatt B:** die neun angenommenen Takes mit der neuen Farmerin, je Zelle „FB | Farmerin“.
- **Augen-Blatt:** die Gegenprobe „Spiel | Bühne R1b“, zwei Bilder.
- JPG ≤ 2 MB. Kanon-Wache wie R1: FB mit beiden Augen, Lidern im dunkleren Kopfton, Brauen, Nase, Mund, beiden Ohren, Schwanz; die Farmerin mit beiden Augen im Kopf, Pupillen, E2-Lidern im dunkleren Hautton, Mund aus der Datei.
- Erst Arm-Gate und G1 grün, dann ein Lauf des blinden Kritikers mit der Frage „Steckt irgendwo ein Arm im Körper oder Kopf? Sitzen die Augen der Farmerin wie im Spiel?“.

**Rückgabe:**
- Git-Bundle mit Zweig `assets/wsb-ausdrucksblatt-r1b` von `assets/private` @eb113fea: Blätter, neue Posen-JSON (ersetzen die alten der sieben Takes), Arm-Gate-Modul mit Test, aktualisierte Bühnenkopie, alles unter `50_BLENDER/AUSDRUCK_R1/`.
- RETURN `RETURN_ausdrucksblatt_r1b.md` in `KFB_HUB/30_DECISIONS/replies/AUSDRUCK_R1/MINI_blatt_r1b/`: je Take die Gate-Werte (größte Eindringtiefe je Figur), die geänderten Winkel und wo du vom Katalog abgewichen bist (mit Grund).
- WS0 baut daraus die Hub-Karten für Georg. Schritt 3 (Clips als Video) kommt danach als eigener Auftrag.
