# RECOVERY · Startpunkt für einen neuen Chat oder Entwickler

## In zwei Minuten arbeitsfähig

1. `python3 -m http.server 8080`, dann `http://localhost:8080/KFB_Resident_Atlas_S6.html`.
2. Lies `docs/ATLAS_RETURN.md` — Entscheidungen, Befunde, OPEN 1–30. Das ist das Gedächtnis des Projekts.
3. Lies den Kopf von `data/cast.js` — die Strukturregel für Hand-Requisiten.
4. `docs/ATLAS_NEXT_SLICES.md` hat die nächsten Scheiben mit ausgearbeitetem Briefing.

`CHANGELOG.md` ist 32 Sprints lang. Nicht vorab lesen, nur bei konkreter Rückfrage nachschlagen.

## Die vier Regeln, die alles tragen

1. **Identität zuerst.** `handslot`-Bones sind authored Befestigungspunkte. Eine Requisite mit Identitäts-Transform sitzt richtig, in jeder Pose. Erst wenn sie sichtbar nicht sitzt, wird gerechnet. **Und: erst die andere Hand probieren, bevor man eine Ausnahme erfindet** (drei Sprints, zwei falsche „Ausnahmen").
2. **Der Pivot sagt die Rolle.** Boden = Standobjekt, Griff/Kante = Handrequisit, mittig in allen drei Achsen = schwebendes Artefakt. Nicht der Dateiname.
3. **Ausrichtung ist eine Achsen-Zuordnung, keine Weltrichtung.** In T-Pose hat `handslot` lokal X = außen, Y = vorn, Z = oben — bei Rig_Medium und Rig_Large gleich. `slotAxis` ist posen-fest, `aim` gilt nur in der Pose, gegen die es gerechnet wurde. **Welche Zuordnung richtig ist, entscheidet ein A/B, nicht eine Analogie zum Nachbarfall.**
4. **Box3 lügt.** Bei posierten SkinnedMesh, bei der Kamera-Einpassung und bei diagonalen Objekten. Freiprüfungen laufen über Abstände echter Vertex-Wolken.

## Fünf Fehlerklassen, die diese Session wiederholt gekostet hat

- **Veraltete Zahl** — gemessen, dann einen Parameter geändert, dann die alte Messung dokumentiert. Zehn Fälle. → Nach der **letzten Parameteränderung** neu messen. Und: ändert eine Nachmessung eine Zahl, ist **jede** Stelle im gerade geschriebenen Dokument betroffen, nicht nur die, an der man zuletzt getippt hat.
- **Erfundener Befund** — ein „geht nicht" ohne Gegenprobe. Drei Fälle, alle drei falsch. → Ein „geht nicht" ist selbst eine Behauptung und braucht denselben Beleg wie ein „geht".
- **Unvollständiger Widerruf** — Dokumente korrigiert, Code-Kommentare und Header stehen gelassen. Zwei Fälle. → Projektweit case-insensitiv nach dem **Wortstamm** greppen, und zwar nach den Begriffen **des jeweiligen** Widerrufs.
- **Prüfsatz mit Loch** — drei Sprints Kopf-, Banner- und Bodenabstand gemessen und nie den Abstand zur **Hand**, also genau die Größe, um die es ging. → Vor dem Messen fragen: welche Größe beantwortet den Auftrag?
- **Verschlucktes Array-Komma** — zweimal hat eine in `data/cast.js` eingefügte Notiz das Modul lahmgelegt. → Nach dem Doku-Schritt laden, nicht nur nach dem Code-Schritt.

## Offene Fehler

Siehe `KNOWN_ISSUES.md` (sechs Punkte) und `ATLAS_RETURN.md` OPEN 1–30. Kein bekannter Laufzeitfehler; die Konsole zeigt zwei three.js-Deprecation-Warnungen und eine abgefangene 404 (`Rig_Large_Tools.glb` existiert nicht).

## Nächste konkrete Arbeit

**Scheibe D, das wiederverwendbare QA-Prüfskript.** Begründung: dieselben vier Messungen (Abstand zur Hand, zum Kopf, Unterkante, Bindungsquote, an gefrorener Pose) sind in den letzten acht Sprints jedes Mal von Hand geschrieben worden, und es hätte die Caption-Verdeckung, beide Komma-Fehler und mehrere veraltete Zahlen mitgefunden. Danach Jonglier-Clip (Scheibe B) und Dance-Set (Scheibe C).

## Owner-Grenzen (unverändert)

Atlas und ToolBox besitzen Komposition, Messung und Kandidatenrezepte. Registry und Librarian besitzen Quelle und Provenienz. Travel besitzt Welt, Platzierung, Kontaktinterpretation, Persistenz und Runtime. Race und Combat behalten ihre eigenen Implementierungszuständigkeiten. Animation Lab besitzt Rig-, Motion- und Attachment-Freigabe.

Der Preview-Renderer des Atlas wird **nicht** zum zweiten Travel-Renderer. L0–L4 bleiben Quellen-/Autorenreife; L5 nur für den tatsächlich getesteten Consumer und die konkrete Revision.

## Rollback

Dieses Paket ist der Originalexport `2026-09-17-r1`. Rollback heißt: dieses ZIP erneut entpacken. Innerhalb des Projekts bleibt `KFB_Resident_Atlas_S5.html` als Vorgängerstand erhalten.