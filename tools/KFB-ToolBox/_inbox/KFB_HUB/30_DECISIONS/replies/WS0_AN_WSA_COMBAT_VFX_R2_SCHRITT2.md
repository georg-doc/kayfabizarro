# WS0 an WSA work · Combat VFX R2 · Antwort auf Schritt 1, nächster Schritt · 31.10.2026 (V-1140, V-1135, V-1126)
Schritt 1 ist angenommen. Deine technischen Empfehlungen gelten: neue Version statt Bearbeitung der V1-Kopien, Herkunft in `src/vendor/combat/SOURCE.md` nachziehen, Eigentumsgrenzen bleiben.

**Antworten**
- **Q01:** Kanonisch ist `50_BLENDER/K10/data/combatmech_minigun_mounts.fb_r2.json` auf `assets/private` @548ad8dd. −35° gilt für FrizzleBob, −36° nur für den Mech. Kein globaler Wert, die Daten je Figur tragen das (V-1040).
- **Q02:** Der erste Lauf bleibt beim Bodenkampf wie heute. Die Sperre in der Luft bleibt. Fliegen und Fahren aus V-1038 sind das Ziel, aber ein eigener Folgeschritt.
- **Q03:** Du baust keinen Riss-Code, solange Georg nicht gewählt hat und das Kartengebäude nicht im Stamm ist. `design/kartengebaeude-r1` bleibt bis dahin nur Quelle. Danach nennt WS0 dir die Naht.

**Nächster Schritt, zwei Stränge nebeneinander**

**A · Laufzeit, auf eigenem Branch vom aktuellen Stamm `game/integration-r2`, hinter `fx=r2`:**
1. Neuer Prüfer als eigene Version, auch die ausgeschlossenen Clips werden abgelehnt. Regressionsfälle mit den Karten aus dem Stamm.
2. Pistole und Blaster als erste Referenz: Flamme und elektrische Entladung, Bewegung je Schuss, gemeinsames Lichtsignal, Rückstoß, Prüf-Modus. Grundauftrag Punkte 1, 2, 5, 6.
3. Dann Stopp und Rückgabe. Gatling und Rakete folgen, wenn WS0 die Referenz freigibt.

`fx-burst` wird erst für die Rakete gebraucht; dann mit der ganzen Abhängigkeitsmenge übernehmen und die vier von dir genannten Nähte beheben.

**B · Bildvorlagen, ohne Spielcode (V-1135 Punkt 4):** Einzelbilder an WS0, Georg wählt.
- Mündungsfeuer: Pistole, Blaster, Gatling, Rakete.
- Geschoss und Spur je Waffe.
- Einschussloch in einer Wand: außen, innen, schräg in die Tiefe.

Je Motiv höchstens drei Varianten. Vorlagen und Bildquellen wie im Nachtrag. Bilder allein belegen die Fortsetzung des Risses auf der Innenseite nicht, das sagst du zu Recht; zeig sie als Ziel.

**Übergabe an WS1:** Vorher den Stamm nachholen und den Stand nennen, geteilte Dateien mit Absicht je Datei nennen, nötigen Stand von `assets/private` nennen (V-1137).

**Rückgabe an WS0, dann Stopp:** Wie im Grundauftrag, nur für Pistole und Blaster, dazu die Bildvorlagen als einzelne Dateien auf Branch `assets/private`. Eine Zeile, was Georg wählen soll. Kritiker höchstens einmal, auf dem Strang A.
