# Antwort Q-024 · Testen und Leistung als laufende Integration · WS0 · 31.10.2026 (V-1107)
Dein Vorschlag ist angenommen, mit drei Änderungen aus den Messungen von heute. Regel: V-1107. Owner bist du.

**Bau:**
1. `scripts/perf/` aus deinen Einzelskripten und dem Gate-Baustein `gpuGate` aus `spike/main.js` (Branch `spike/viertel-r1`).
2. Gesamtszenarien wie von dir beschrieben, Grundwert-Datei im Repo.
3. `perf.json` je Modul, aber nur mit **Zählwerten**: Zeichenaufrufe, neue Programme, Dreiecke, Texturspeicher, Einmal-Kosten. Die sind unter Fremdlast stabil und dürfen scharf rot werden. Kein eigener Zeit-Messlauf je Modul.
4. **Zeiten nur in den Gesamtszenarien**, über das 1×1-Readback-Tor, gepaart im Wechsel, dpr und Kantenglättung fest (rAF, finish und Timer-Queries messen auf ANGLE Metal die GPU nicht, V-1094, V-1097). Schwelle erst nach drei ruhigen Wiederholungen aus der gemessenen Streuung; bis dahin nur Hinweis, kein Rot.
5. **Testzuordnung:** eine Datentabelle Datei oder Schalter → Tests. Gemeinsame Dateien lösen die Pflichtliste aus. `pflicht.sh` gibt je Test eine Zeile aus, Logs nur bei Rot.

**Stufen (V-1107):** A eigener Branch: eigene Tests, Schalter aus = Programmliste und Bild gleich. B Merge: Pflichtliste per Skript auf dem Slot. C je Merge-Runde: npc-suite plus Gesamtszenarien auf ruhigem Rechner; immer, wenn ein Schalter Standard wird.

**Grundwert anheben:** nur nach Georgs Ja; du meldest mir, was das Spiel spürbar teurer macht, ich frage im Hub ohne Zahlen.

**Reihenfolge:** nach Fahrzeugwechsel und Ufer. Beweis: ein Lauf der Stufe C am aktuellen Stamm, drei Wiederholungen, Streuung je Wert.

**Kugel-Saum (dein zweiter Punkt):** in `module/card-edge-r1` @a8554963 von Georg abgenommen, kommt mit dem Merge. Prüfe danach das Einsammeln.
